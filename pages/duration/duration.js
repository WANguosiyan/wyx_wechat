var app = getApp();
var bianLi = require('../../utils/http.js');
// 排序函数
function sortNumber(a, b) {
  return a.dateDay - b.dateDay
}
Page({
  data: {
    inpCishu: '',
    isIcom: true,
    selectAllStatus: false,
    shichang: "",
    cishu: "",
    riqi: [],
    year: 0,
    month: 0,
    months: 0,
    second: 0,
    allSecond: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    chooseTime: [['0分钟', '1分钟', '2分钟', '3分钟', '4分钟', '5分钟', '6分钟', '7分钟', '8分钟', '9分钟', '10分钟', '11分钟', '12分钟', '13分钟', '14分钟', '15分钟', '16分钟', '17分钟', '18分钟', '19分钟', '20分钟', '21分钟', '22分钟', '23分钟', '24分钟', '25分钟', '26分钟', '27分钟', '28分钟', '29分钟', '30分钟', '31分钟', '32分钟', '33分钟', '34分钟', '35分钟', '36分钟', '37分钟', '38分钟', '39分钟', '40分钟', '41分钟', '42分钟', '43分钟', '44分钟', '45分钟', '46分钟', '47分钟', '48分钟', '49分钟', '50分钟', '51分钟', '52分钟', '53分钟', '54分钟', '55分钟', '56分钟', '57分钟', '58分钟', '59分钟', '60分钟'], ['0秒', '1秒', '2秒', '3秒', '4秒', '5秒', '6秒', '7秒', '8秒', '9秒', '10秒', '11秒', '12秒', '13秒', '14秒', '15秒', '16秒', '17秒', '18秒', '19秒', '20秒', '21秒', '22秒', '23秒', '24秒', '25秒', '26秒', '27秒', '28秒', '29秒', '30秒', '31秒', '32秒', '33秒', '34秒', '35秒', '36秒', '37秒', '38秒', '39秒', '40秒', '41秒', '42秒', '43秒', '44秒', '45秒', '46秒', '47秒', '48秒', '49秒', '50秒', '51秒', '52秒', '53秒', '54秒', '55秒', '56秒', '57秒', '58秒', '59秒', '60秒']],
    multiIndex2: ['0分钟', '0秒'],
    isNumBox: false,
    indexSD: -1,
    checkSD: [],
    ismasklayer: false,
    shiduan: [],
    dateArr: [],
    isToday: 0,
    quan: [],
    allQuan: [],
    dan: [],
    allDan: [],
    allChose: 0,
    isTodayWeek: false,
    todayIndex: 0,
    buyNum:1,
    dangqiantian:''
  },
  onLoad: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let todaydate = year + month + now.getDate();
    console.log(now.getDate());
    if(now.getDate() < 10){
      var dangqiantian = ''+year + month + '0'+ now.getDate();
    }
    console.log(dangqiantian);


    this.setData({
      year: year,
      month: month,
      months: month,
      isToday: '' + year + month + now.getDate(),
      dangqiantian:dangqiantian
    })
    this.dateInit();
   
    // 判断是不是已经过去的日期
    var today = this.data.isToday;
    var yue = this.data.month;
    var nian = this.data.year;
    var dangnian = Number(today.slice(0, 4));//今年
    var dangyue = Number(today.slice(4, 5));//本月
    var jingtian = Number(this.data.isToday);//当天
    console.log(jingtian);
    console.log(this.data.dateArr);

    // 判断年份
    if (nian < dangnian) {
      var dateArr = this.data.dateArr;
      dateArr.forEach((r) => {
        r.isPass = true;
      })
      this.setData({
        dateArr: dateArr
      })
    } else {
      // 判断月份
      if (yue < dangyue) {
        var dateArr = this.data.dateArr;
        dateArr.forEach((r) => {
          r.isPass = true;
          r.todaystatus=-1
        })
        this.setData({
          dateArr: dateArr
        })
      } else if (yue == dangyue) {
        // 判断日期
        var dateArr = this.data.dateArr;

        dateArr.forEach((r) => {
          console.log(r.isToday);
          if (r.isToday < jingtian) {
            r.isPass = true;
            r.todaystatus = -1
          } else if (r.isToday = jingtian){
            r.todaystatus = 0
          }else{
            r.todaystatus =1
          }
        })
        this.setData({
          dateArr: dateArr
        })
      }
    }
  },
  onShow() {
    var shiduan = this.data.shiduan;
    shiduan.forEach((r) => {
      r.isCheck = false;
    })
    this.setData({
      shiduan: shiduan,
      multiIndex2: ["", ""],
      inpCishu: "",
      second: 0,
      buyNum:1
    })
  },
  // 获取广告时长
  getTime: function (e) {
    // 重新选择后清空之前的
    var shiduan = this.data.shiduan;
    shiduan.forEach((r) => {
      r.isCheck = false;
    })
    this.setData({
      shiduan: shiduan,
      inpCishu: "",
    })
    var that = this;
    var allDan = this.data.allDan;
    var allQuan = this.data.allQuan;
    if (allDan.length != 0 || allQuan.length != 0) {
      var dateArr = this.data.dateArr;
      console.log(dateArr);
      this.setData({ multiIndex2: e.detail.value });
      var miao = Number(e.detail.value[0] * 60 + e.detail.value[1]);
      this.setData({
        second: miao
      })
    } else {
      wx.showToast({
        title: '请先选择日期',
        icon: 'none',
        duration: 1500
      });
    }

  },
  // 获取次数
  getNum: function (e) {
    if (this.data.second == 0) {
      wx.showToast({
        title: '请先输入广告时长',
        icon: 'none',
        duration: 1500
      });
    } else {
      var second = this.data.second;
      var cishu = parseInt(3600 / second);
      var dateArr = this.data.dateArr;
      var shiduan = this.data.shiduan;
      this.setData({
        cishu: cishu,
        isNumBox: true,
        ismasklayer: true
      })
    }
  },
  // 获取输入次数
  getCiShu: function (e) {
    var inpCishu = e.detail.value;
    this.setData({
      inpCishu: inpCishu
    })
  },
  // 点击确定
  numBoxConfirm: function () {
    if (this.data.cishu < this.data.inpCishu) {
      wx.showToast({
        title: '请输入正确次数',
        icon: 'none',
        duration: 1500
      });
    } else {
      // 重新选择后清空之前的
      console.log(this.data.second, this.data.inpCishu);
      var shiduan = this.data.shiduan;
      var allSecond = Number(this.data.second) * Number(this.data.inpCishu);
      shiduan.forEach((r) => {
        r.isCheck = false;
        if (allSecond <= r.time_long && r.isshow == true){
          r.isshow = true
        }
      })
      console.log(shiduan);
      this.setData({
        shiduan: shiduan
      })
      this.setData({
        isNumBox: false,
        ismasklayer: false,
        allSecond: allSecond
      })
    }

  },
  // 点击取消
  numBoxCancel: function () {
    if (this.data.inpCishu) {
      this.setData({
        isNumBox: false,
        ismasklayer: false
      })
    } else {
      this.setData({
        inpCishu: '',
        isNumBox: false,
        ismasklayer: false
      })
    }
  },
  //选择时段
  translate: function (e) {
    if (!this.data.inpCishu) {
      wx.showToast({
        title: '请先输入每个时段重复的次数',
        icon: 'none',
        duration: 1500
      });
    } else {
      var shiduan = this.data.shiduan;
      var index = e.currentTarget.dataset.timein;
      var allSecond = this.data.allSecond;
      if (allSecond <= shiduan[index].time_long && shiduan[index].isshow == true) {
        console.log(allSecond, shiduan[index].time_long)
        shiduan[index].isCheck = !shiduan[index].isCheck;
        this.setData({
          shiduan: shiduan
        })
      }
    }
  },
  // 跳转到提交订单
  submit: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          app.globalData.userInfo = res.data;
          var riqi = that.data.riqi;
          var allDan = that.data.allDan;
          var allQuan = that.data.allQuan;
          var arr = allQuan.concat(allDan);
          var arr2 = [];
          arr.forEach((r) => {
            if (r.state == 2) {
              arr2.push(r);
            }
          })
          var second = that.data.second;
          console.log(second);
          var inpCishu = that.data.inpCishu;
          var shiduan = that.data.shiduan;
          var checkSD = [];
          shiduan.forEach((r) => {
            if (r.isCheck) {
              checkSD.push(r.shi)
            }
          })
          var arr = [];
          var obj = {};
          var timezone = [];
          var riqi = arr2;
          if (riqi.length != 0 && second != 0 && inpCishu != 0 && checkSD.length != 0) {
            if (that.data.buyNum == 1) {
              riqi.forEach((r) => {
                arr = r.isToday.split("");
                if (arr.length < 8) {
                  r.isToday = r.dateYear.toString() + r.dateYue.toString() + r.dateDay.toString()
                }
              })
              for (let i = 0; i < riqi.length; i++) {
                for (let j = 0; j < checkSD.length; j++) {
                  obj = {
                    yue: riqi[i].isToday,
                    shi: checkSD[j]
                  }
                  timezone.push(obj);
                }
              }
              var arr5 = JSON.stringify(timezone);
              var chooseCar = app.globalData.chooseCar;
              var arr2 = [];
              chooseCar.forEach((r) => {
                arr2.push(r.id);
              })
              var id = arr2.toString();
              wx.showLoading({
                title: '请稍等',
              })
              wx.request({
                url: app.globalData.domain + '/api/v2/equipment/default/choose-time-zone',
                method: "POST",
                data: {
                  user_id: app.globalData.userInfo.userinfo.id,
                  token: app.globalData.userInfo.token,
                  equipment_id: id,
                  time_long: second,
                  type: app.globalData.type,
                  play_num: inpCishu,
                  play_long: second,
                  timezone: arr5,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(res) {
                  wx.hideLoading()
                  if (res.data.code == 400) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    });
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    }, 3000)
                  } else {
                    wx.navigateTo({
                      url: '/pages/submit/submit?id=' + res.data.data.order_id + '&delID1=' + arr2
                    })
                  }
                },
                fail(res) {
                  console.log(res.data)
                }
              })
            } else {
              this.setData({
                buyNum: 2
              })
            }

          } else {
            wx.showToast({
              title: '请输入完整信息',
              icon: 'none',
              duration: 1500
            });
          }

        } else {
          wx.showModal({
            title: '提示',
            content: '未登录',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/register/register'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })


        }
      },
      fail(res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '未登录',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/register/register'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
   
  },

  // 全选
  selectAll: function () {
    // 重新选择后清空之前的
    var shiduan = this.data.shiduan;
    shiduan.forEach((r) => {
      r.isCheck = false;
    })
    this.setData({
      shiduan: shiduan,
      multiIndex2: ["", ""],
      inpCishu: "",
      second: 0
    })

    var by = this.data.dateArr[15].weight;
    var dateArr = this.data.dateArr;
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    this.setData({
      selectAllStatus: selectAllStatus
    })
    if (selectAllStatus) {
      var allArr = [];
      var allDan = this.data.allDan;
      if (allDan.length != 0) {
        allDan.forEach((r) => {
          if (r.weight != by) {
            allArr.push(r);
          }
        })
        this.setData({
          allDan: allArr
        })
      }
      var arr = [];
      // 判断是不是已经过去的日期
      var today = this.data.isToday;
      var yue = this.data.month;
      var nian = this.data.year;
      var dangnian = Number(today.slice(0, 4));//今年
      var dangyue = Number(today.slice(4, 5));//本月
      var jingtian = Number(this.data.isToday);//当天
      // 判断年份
      if (nian < dangnian) {

      } else {
        // 判断月份
        if (yue < dangyue) {

        } else if (yue == dangyue) {
          // 判断日期
          var arr1 = [];
          dateArr.forEach((r) => {
            if (r.isToday >= jingtian && !r.isPass) {
              r.state = 2;
              arr1.push(r);
            }
          })
          this.setData({
            quan: arr1,
            dateArr: dateArr
          })
        } else if (yue > dangyue) {
          var arr1 = [];
          dateArr.forEach((r) => {
            if (r.isToday && !r.isPass) {
              r.state = 2;
              arr1.push(r);
            }
          })
          this.setData({
            quan: arr1,
            dateArr: dateArr
          })
        }
      }
      var allQuan = this.data.allQuan
      var arr2 = allQuan.concat(this.data.quan);
      this.setData({
        allQuan: arr2
      })
    } else {
      dateArr.forEach((r) => {
        r.state = 0
      })
      var allQuan = this.data.allQuan;
      var allDan = this.data.allDan;
      var arr = [];
      allQuan.forEach((r) => {
        if (r.weight != by) {
          arr.push(r);
        }
      })
      this.setData({
        allQuan: arr,
        dateArr: dateArr
      })
    }
    var that = this;
    var allDan = this.data.allDan;
    var allQuan = this.data.allQuan;
    var arr = allQuan.concat(allDan);
    var arr2 = [];
    arr.forEach((r) => {
      var riqi = r.dateYear + '-' + r.dateYue + '-' + r.dateDay
      arr2.push(riqi);
    })
    var month = arr2.toString();
    var chooseCar = app.globalData.chooseCar;
    var arr3 = [];
    chooseCar.forEach((r) => {
      arr3.push(r.id);
    })
    var id = arr3.toString();
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/time-zone-desc',
      method: "POST",
      data: {
        type: app.globalData.type,
        equipment_id: id,
        month: month
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          shiduan: res.data.data.data
        })
      }
    })
  },

  //选择日期后加样式   
  select_date: function (e) {
    // 重新选择后清空之前的
    var shiduan = this.data.shiduan;
    shiduan.forEach((r) => {
      r.isCheck = false;
    })
    this.setData({
      shiduan: shiduan,
      multiIndex2: ["", ""],
      inpCishu: "",
      second: 0
    })

    var by = this.data.dateArr[15].weight;
    var index = e.currentTarget.dataset.key;
    let selectAllStatus = this.data.selectAllStatus;
    if (this.data.dateArr[index].isPass) {
      this.data.dateArr[index].state = 0
    } else {
      if (selectAllStatus) {
        this.data.dateArr[index].state = 0;
        var allQuan = this.data.allQuan;
        var allDan = this.data.allDan;
        var dateArr = this.data.dateArr;
        var allArr1 = [];
        var allArr2 = [];
        var allArr3 = [];
        if (allQuan.length != 0) {
          allQuan.forEach((r) => {
            if (r.weight != by) {
              allArr1.push(r);
            }
          })
        }
        dateArr.forEach((r) => {
          if (r.state == 2) {
            allArr2.push(r);
          }
        })
        if (allDan.length != 0) {
          allArr3 = allDan.concat(allArr2);
        } else {
          allArr3 = allArr2;
        }
        this.setData({
          allQuan: allArr1,
          allDan: allArr3
        })
        var today = this.data.isToday;
        var yue = this.data.month;
        var nian = this.data.year;
        var dangnian = Number(today.slice(0, 4));//今年
        var dangyue = Number(today.slice(4, 5));//本月
        var jingtian = Number(this.data.isToday);//当天
        var xuanzhong = Number(this.data.dateArr[index].isToday);//选择的日期
        // 判断年份
        if (nian < dangnian) {

        } else {
          // 判断月份
          if (yue < dangyue) {

          } else if (yue == dangyue) {
            // 判断日期
            if (xuanzhong >= jingtian) {
              this.setData({
                selectAllStatus: false
              })
            } else {
              this.setData({
                selectAllStatus: true
              })
            }

          } else if (yue > dangyue) {
            this.setData({
              selectAllStatus: false
            })
          }
        }
        this.setData({
          dateArr: this.data.dateArr
        })
      } else {
        var allQuan = this.data.allQuan;
        var dateArr = this.data.dateArr;
        var arr = [];
        if (allQuan.length != 0) {
          allQuan.forEach((r) => {
            if (r.weight != dateArr[10].weight) {
              arr.push(r);
            }
          })
          this.setData({
            allQuan: arr
          })
        }
        if (this.data.dateArr[index].state == 0) {
          // 判断是不是已经过去的日期
          var today = this.data.isToday;
          var yue = this.data.month;
          var nian = this.data.year;
          var dangnian = Number(today.slice(0, 4));//今年
          var dangyue = Number(today.slice(4, 5));//本月
          var jingtian = Number(this.data.isToday);//当天
          var xuanzhong = Number(this.data.dateArr[index].isToday);//选择的日期
          // 判断年份
          if (nian < dangnian) {
            this.data.dateArr[index].state = 0;
          } else {
            // 判断月份
            if (yue < dangyue) {
              this.data.dateArr[index].state = 0;
            } else if (yue == dangyue) {
              // 判断日期
              var arr1 = [];
              var dateArr = this.data.dateArr;
              var dan = this.data.dan;
              dateArr.forEach((r) => {
                if (r.isToday >= jingtian && !r.isPass) {
                  arr1.push(r);
                }
              })
              this.setData({
                allChose: arr1.length
              })
              if (xuanzhong >= jingtian) {
                this.data.dateArr[index].state = 2;
                this.setData({
                  dateArr: this.data.dateArr
                })
              } else {
                this.data.dateArr[index].state = 0;
                this.setData({
                  dateArr: this.data.dateArr
                })
              }
            } else if (yue > dangyue) {
              var arr1 = [];
              var dateArr = this.data.dateArr;
              dateArr.forEach((r) => {
                if (r.isToday && !r.isPass) {
                  arr1.push(r);
                }
              })
              this.data.dateArr[index].state = 2;
              this.setData({
                dateArr: this.data.dateArr,
                allChose: arr1.length
              })
            }
          }
        } else {
          this.data.dateArr[index].state = 0;
          this.setData({
            dateArr: this.data.dateArr
          })
        }
        var dateArr = this.data.dateArr;
        var allDan = this.data.allDan;
        var arr = [];
        dateArr.forEach((r) => {
          if (r.state == 2) {
            arr.push(r);
          }
        })
        if (arr.length == this.data.allChose) {
          this.setData({
            selectAllStatus: true
          })
        } else {
          this.setData({
            selectAllStatus: false
          })
        }
        if (allDan.length == 0) {
          this.setData({
            allDan: arr
          })
        } else {
          var arr1 = [];
          allDan.forEach((r) => {
            if (r.weight != this.data.dateArr[10].weight) {
              arr1.push(r);
            }
          })
          var arr2 = arr1.concat(arr);
          this.setData({
            allDan: arr2
          })
        }
      }
    }
    var that = this;
    var allDan = this.data.allDan;
    var allQuan = this.data.allQuan;
    var arr = allQuan.concat(allDan);
    var arr2 = [];
    arr.forEach((r) => {
      var riqi = r.dateYear + '-' + r.dateYue + '-' + r.dateDay
      arr2.push(riqi);
    })
    var month = arr2.toString();
    var chooseCar = app.globalData.chooseCar;
    var arr3 = [];
    chooseCar.forEach((r) => {
      arr3.push(r.id);
    })
    var id = arr3.toString();
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/time-zone-desc',
      method: "POST",
      data: {
        type: app.globalData.type,
        equipment_id: id,
        month: month
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data.data);
        that.setData({
          shiduan: res.data.data.data
        })
      }
    })
  },
  // 设置日历
  dateInit: function (setYear, setMonth) {
    var jingtian = Number(this.data.dangqiantian);//当天

    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];
    let calendarArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let firstDay = new Date(year, month, 1);
    let startWeek = firstDay.getDay();                         //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    let sum = "";
    let bum = month + 1;
    let cum = "";
    if (bum < 10) {
      cum = "0" + bum
    } else {
      cum = bum
    }
    // v
    var XZRQ = this.data.riqi;
    // console.log(XZRQ)
    // v
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        if (num < 10) {
          sum = "0" + num;
        } else {
          sum = num;
        }
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          dateDay: sum,
          dateYue: cum,
          dateYear: year,
          weight: month + 1,
          state: 0,
          isPass: false,
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    // 切换时给状态
    for (let i = 0; i < dateArr.length; i++) {
      for (let j = 0; j < XZRQ.length; j++) {
        if (dateArr[i].isToday == XZRQ[j].isToday) {
          dateArr[i].state = XZRQ[j].state;
        }
      }
    }
    //gsy 
    var length = dateArr.length;
    for(var i=0;i<length;i++){
     
      var now_day = ''+dateArr[i].dateYear + dateArr[i].dateYue + dateArr[i].dateDay;
      console.log(now_day);
        if (now_day == jingtian){
          dateArr[i].todaystatus = 0
        }else if(now_day > jingtian){
          dateArr[i].todaystatus = 1
        }else{
          dateArr[i].todaystatus = -1
        }
      
    }
    this.setData({
      dateArr: dateArr
    })
    console.log(this.data.dateArr);
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    var that = this;
    var riqi = this.data.riqi;
    var allDan = this.data.allDan;
    var allQuan = this.data.allQuan;
    var arr = allQuan.concat(allDan);
    var arr2 = [];
    arr.forEach((r) => {
      if (r.state == 2) {
        arr2.push(r);
      }
    })
    this.setData({
      riqi: arr2
    })
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    // 判断是不是已经过去的日期
    var today = this.data.isToday;
    var yue = this.data.month;
    var nian = this.data.year;
    var dangnian = Number(today.slice(0, 4));//今年
    var dangyue = Number(today.slice(4, 5));//本月
    var jingtian = Number(this.data.isToday);//当天
    // 判断年份
    if (nian < dangnian) {
      var dateArr = this.data.dateArr;
      dateArr.forEach((r) => {
        r.isPass = true
      })
      this.setData({
        dateArr: dateArr,
        selectAllStatus: false
      })
    } else if (nian == dangnian) {
      // 判断月份
      if (yue < dangyue) {
        var dateArr = this.data.dateArr;
        dateArr.forEach((r) => {
          r.isPass = true;
        })
        this.setData({
          dateArr: dateArr,
          selectAllStatus: false
        })
      } else if (yue == dangyue) {
        // 判断日期
        var dateArr = this.data.dateArr;
        var allArr1 = [];
        var allArr2 = [];
        dateArr.forEach((r) => {
          if (r.isToday < jingtian) {
            r.isPass = true;
          } else if (r.isToday) {
            allArr1.push(r);
          }
        })
        arr2.forEach((r) => {
          if (r.weight == yue) {
            allArr2.push(r);
          }
        })
        if (allArr2.length == allArr1.length) {
          this.setData({
            selectAllStatus: true
          })
        } else {
          this.setData({
            selectAllStatus: false
          })
        }
        this.setData({
          dateArr: dateArr
        })
      } else {
        var dateArr = this.data.dateArr;
        var allArr1 = [];
        var allArr2 = [];
        dateArr.forEach((r) => {
          if (r.isToday) {
            r.isPass = true;
            allArr1.push(r);
          }
        })
        arr2.forEach((r) => {
          if (r.weight == yue) {
            allArr2.push(r);
          }
        })
        if (allArr2.length == allArr1.length) {
          this.setData({
            selectAllStatus: true
          })
        } else {
          this.setData({
            selectAllStatus: false
          })
        }
        dateArr.forEach((r) => {
          r.isPass = false;
        })
      }
    } else {
      var dateArr = this.data.dateArr;
      var allArr1 = [];
      var allArr2 = [];
      dateArr.forEach((r) => {
        if (r.isToday) {
          r.isPass = true;
          allArr1.push(r);
        }
      })
      arr2.forEach((r) => {
        if (r.weight == yue) {
          allArr2.push(r);
        }
      })
      if (allArr2.length == allArr1.length) {
        this.setData({
          selectAllStatus: true
        })
      } else {
        this.setData({
          selectAllStatus: false
        })
      }
      dateArr.forEach((r) => {
        r.isPass = false;
      })
    }
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    var that = this;
    var riqi = this.data.riqi;
    var allDan = this.data.allDan;
    var allQuan = this.data.allQuan;
    var arr = allQuan.concat(allDan);
    var arr2 = [];
    arr.forEach((r) => {
      if (r.state == 2) {
        arr2.push(r);
      }
    })
    this.setData({
      riqi: arr2
    })
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    // 判断是不是已经过去的日期
    var today = this.data.isToday;
    var yue = this.data.month;
    var nian = this.data.year;
    var dangnian = Number(today.slice(0, 4));//今年
    var dangyue = Number(today.slice(4, 5));//本月
    var jingtian = Number(this.data.isToday);//当天
    // 判断年份
    if (nian < dangnian) {
      var dateArr = this.data.dateArr;
      dateArr.forEach((r) => {
        r.isPass = true
      })
      this.setData({
        dateArr: dateArr,
        selectAllStatus: false
      })
    } else if (nian == dangnian) {
      // 判断月份
      if (yue < dangyue) {
        var dateArr = this.data.dateArr;
        dateArr.forEach((r) => {
          r.isPass = true;
        })
        this.setData({
          dateArr: dateArr,
          selectAllStatus: false
        })
      } else if (yue == dangyue) {
        // 判断日期
        var dateArr = this.data.dateArr;
        var allArr1 = [];
        var allArr2 = [];
        dateArr.forEach((r) => {
          if (r.isToday < jingtian) {
            r.isPass = true;
          } else if (r.isToday) {
            allArr1.push(r);
          }
        })
        arr2.forEach((r) => {
          if (r.weight == yue) {
            allArr2.push(r);
          }
        })
        if (allArr2.length == allArr1.length) {
          this.setData({
            selectAllStatus: true
          })
        } else {
          this.setData({
            selectAllStatus: false
          })
        }
        this.setData({
          dateArr: dateArr
        })
      } else {
        var dateArr = this.data.dateArr;
        var allArr1 = [];
        var allArr2 = [];
        dateArr.forEach((r) => {
          if (r.isToday) {
            r.isPass = true;
            allArr1.push(r);
          }
        })
        arr2.forEach((r) => {
          if (r.weight == yue) {
            allArr2.push(r);
          }
        })
        if (allArr2.length == allArr1.length) {
          this.setData({
            selectAllStatus: true
          })
        } else {
          this.setData({
            selectAllStatus: false
          })
        }
        dateArr.forEach((r) => {
          r.isPass = false;
        })
      }
    } else {
      var dateArr = this.data.dateArr;
      var allArr1 = [];
      var allArr2 = [];
      dateArr.forEach((r) => {
        if (r.isToday) {
          r.isPass = true;
          allArr1.push(r);
        }
      })
      arr2.forEach((r) => {
        if (r.weight == yue) {
          allArr2.push(r);
        }
      })
      if (allArr2.length == allArr1.length) {
        this.setData({
          selectAllStatus: true
        })
      } else {
        this.setData({
          selectAllStatus: false
        })
      }
      dateArr.forEach((r) => {
        r.isPass = false;
      })
    }
  },
})