var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg: '',
    avatar: '',
    name: '',
    number: '',
    unpay: [],
    unload: [],
    audit: [],
    unpass: [],
    cancal: [],
  },
  // 跳转待支付
  tounpay: function () {
    app.globalData.statusNum = 0;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 1,
    })
  },
  // 跳转未上传
  tounload: function () {
    app.globalData.statusNum = 1;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 2,
    })
  },
  // 跳转审核中
  toaudit: function () {
    app.globalData.statusNum = 2;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 3,
    })
  },
  // 跳转未通过
  tounpass: function () {
    app.globalData.statusNum = 3;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 4,
    })
  },
  // 跳转退款
  tocancal: function () {
    app.globalData.statusNum = 2;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 3,
    })
  },
  // 跳转设置
  toSet: function () {
    wx.navigateTo({
      url: '/pages/mine/set/set',
    })
  },
  // 跳转全部订单
  all_orders: function () {
    app.globalData.statusNum = -1;
    wx.navigateTo({
      url: '/pages/all_orders/all_orders?currentTab=' + 0,
    })
  },
  // 推广
  share: function () {
    wx.navigateTo({
      url: '/pages/index/share/share',
    })
  },
  // 加盟
  cooperation: function () {
    wx.navigateTo({
      url: '/pages/index/cooperation/cooperation',
    })
  },
  // 合作
  cooperation2: function () {
    wx.navigateTo({
      url: '/pages/mine/buyOut/buyOut',
    })
  },
  // 我的支付宝
  alipay: function () {
    wx.navigateTo({
      url: '/pages/mine/alipay/alipay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      domain: app.globalData.domain,
      number: app.globalData.userInfo.userinfo.mobile,
      headimg: app.globalData.userInfo.userinfo.image,
      avatar: app.globalData.userInfo.userinfo.avatar,
      name: app.globalData.userInfo.userinfo.name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var order = [];
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-list',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        status: -1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.msg == "获取数据成功") {
          order = res.data.data;
          that.setData({
            allList: order
          })
          var unpay = [];
          var unload = [];
          var audit = [];
          var unpass = [];
          var pass = [];
          var finish = [];
          var cancal = [];
          order.forEach((r) => {
            if (r.status == 0) {
              unpay.push(r);
            } else if (r.status == 1) {
              unload.push(r);
            } else if (r.status == 2) {
              audit.push(r);
            } else if (r.status == 3) {
              unpass.push(r);
            }
          })
          order.forEach((r) => {
            if (r.format_pay_back == "申请退款中") {
              cancal.push(r);
            }
          })
          that.setData({
            unpay: unpay,
            unload: unload,
            audit: audit,
            unpass: unpass,
            cancal: cancal,
          })
        }
      }

    })
  },
})