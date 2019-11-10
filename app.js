const Towxml = require('/towxml/main');
App({
  towxml: new Towxml(),
  // 全局变量的初始化
  globalData: {
    userInfo: null,
    navHeight: 0,
    equipmentHeight: '',
    height: 0,
    // 购物车中的数组
    shoppingCar: [],
    // 选中的广告
    chooseCar: [],
    // 购物车中删除的项
    delID: [],
    delID1: [],
    parentid: "",
    // 类型
    type: "",
    cityleft: [],
    typeList: [],
    domain: "https://ahwyx.com", //域名,
    pagenum: 1,
    statusNum: -1
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (options) {
    // 获取设备高度
    var that = this;
    this.globalData.equipmentHeight = wx.getSystemInfoSync().screenHeight
    // 获取本地储存的信息
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          that.globalData.userInfo = res.data;
        } else {
          // wx.reLaunch({
          //   url: '/pages/register/register'
          // })
        }
      },
      fail(res) {
        console.log(res);
        // wx.reLaunch({
        //   url: '/pages/register/register'
        // })
      }
    })
    // 获取购物车
    wx.getStorage({
      key: 'shoppingCar',
      success(res) {
        that.globalData.shoppingCar = res.data;
      },
      fail(res) {
        console.log(res);
      }
    })
    // 获取类型
    wx.request({
      url: that.globalData.domain + '/api/v1/equipment/default/type',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.globalData.typeList = res.data.data;
      },
      fail(res) {
        console.log(res.data)
      }
    })
    // 获取城市
    wx.request({
      url: that.globalData.domain + '/api/v1/equipment/default/region',
      method: "GET",
      data: {
        parent_id: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.globalData.cityleft = res.data.data
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // 获取分享者ID
    if (options.query.id) {
      this.globalData.parentid = options.query.id;
    }
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  isLogin:function(){
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          that.globalData.userInfo = res.data;
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
  }
})
