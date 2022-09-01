import moment from 'moment'

export function randomId() {
  return moment().format('YYYYMMDDHHmmss') + '-' + ('0000' + (Math.random() * 10000).toFixed()).slice(-4);
}
