/**
 * Created by ChengZheLin on 2018/7/22.
 */
function formatTimeStamp(timestamp, format) {
  timestamp = timestamp.toString().length === 13 ? timestamp / 1000 : timestamp;

  if (!timestamp) {
    return 0;
  }
  let formatTime;
  format = format || 'yyyy-MM-dd hh:mm:ss';
  let date = new Date(timestamp * 1000);
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds() //秒
  };
  if (/(y+)/.test(format)) {
    formatTime = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  } else {
    formatTime = format;
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(formatTime))
      formatTime = formatTime.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return formatTime;
}

module.exports = {
  formatTimeStamp
}
