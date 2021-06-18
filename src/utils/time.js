import moment from 'moment'

export function dateFormat(dateStr) {
  if (dateStr === undefined) {
    return ''
  }
  return moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
}
