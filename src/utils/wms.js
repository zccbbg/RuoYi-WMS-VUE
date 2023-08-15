import Vue from 'vue';
import MyCustomComponent from '@/components/WmsInsufficientStockDialog/index.vue';

// 创建临时的 Vue 组件
const TempComponent = Vue.extend({
  components: {
    MyCustomComponent
  },
  render(createElement) {
    return createElement(MyCustomComponent, {
      props: {
        prodId: this.prodId, // 传递 prodId 属性
        msg: this.msg
      },
      key: 'my-custom-WmsWarehouseSelect' // 设置唯一的 key 属性
    });
  }
});

// 库存不足弹窗
export default function InsufficientStockAlert(data) {
  const tempComponent = new TempComponent({
    data: {
      prodId: data.data.itemId,// 设置 prodId 属性的值
      msg: data.msg
    }
  });
  const tempElement = document.createElement('div');
  tempComponent.$mount(tempElement);
  const vnodeHtml = tempElement.innerHTML;
  tempComponent.$createElement(vnodeHtml)
  document.body.appendChild(tempComponent.$el); // 将对话框组件的根元素添加到页面中
}
