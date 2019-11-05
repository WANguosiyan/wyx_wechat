function bainLi(arr, months) {
  return new Promise((resolve, reject) => {
    var timeArr = [];
    if (arr.__proto__.nv_constructor == "Object"){
      Object.keys(arr).forEach(function (key) {
        var time = arr[key].split("-");
        if (time[1] == months) {
          timeArr.push(time);
        }
      })
    }else{
      arr.forEach((r) => {
        var time = r.split("-");
        if (time[1] == months) {
          timeArr.push(time);
        }
      })
    }
    resolve(timeArr);
  })
}
module.exports = bainLi;

