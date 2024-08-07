const eventRegistryMap = new WeakMap();
function getRegistry(instance) {
  let events = eventRegistryMap.get(instance);
  if (!events) {
    eventRegistryMap.set(instance, (events = Object.create(null)));
  }
  return events;
}
export function $on(instance, event, fn) {
  if (Array.isArray(event)) {
    event.forEach((e) => $on(instance, e, fn));
  } else {
    const events = getRegistry(instance);
    (events[event] || (events[event] = [])).push(fn);
  }
  return instance;
}
export function $once(instance, event, fn) {
  const wrapped = (...args) => {
    $off(instance, event, wrapped);
    fn.call(instance, ...args);
  };
  wrapped.fn = fn;
  $on(instance, event, wrapped);
  return instance;
}
export function $off(instance, event, fn) {
  const vm = instance;
  // all
  if (!event) {
    eventRegistryMap.set(instance, Object.create(null));
    return vm;
  }
  // array of events
  if (Array.isArray(event)) {
    event.forEach((e) => $off(instance, e, fn));
    return vm;
  }
  // specific event
  const events = getRegistry(instance);
  const cbs = events[event];
  if (!cbs) {
    return vm;
  }
  if (!fn) {
    events[event] = undefined;
    return vm;
  }
  events[event] = cbs.filter((cb) => !(cb === fn || cb.fn === fn));
  return vm;
}
export function $emit(instance, event, ...args) {
  instance && instance.$emit && instance.$emit(event, ...args);
  const cbs = getRegistry(instance)[event];
  if (cbs) {
    cbs.map((cb) => cb.apply(instance, args));
  }
  return instance;
}
export function $children(instance) {
  function $walk(vnode, children) {
    if (vnode.component && vnode.component.proxy) {
      children.push(vnode.component.proxy);
    } else if (vnode.shapeFlag & (1 << 4)) {
      const vnodes = vnode.children;
      for (let i = 0; i < vnodes.length; i++) {
        $walk(vnodes[i], children);
      }
    }
  }
  const root = instance.$.subTree;
  const children = [];
  if (root) {
    $walk(root, children);
  }
  return children;
}
