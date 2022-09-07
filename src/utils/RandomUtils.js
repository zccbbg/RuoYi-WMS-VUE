import moment from 'moment'

export function randomId() {
  return moment().format('YYYY-MM-DD-HHmmss');
}
