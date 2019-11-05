var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg: '',
    avatar:'',
    percent:'',
    member_count:'',
    all_profit:'',
    useful_profit:'',
    invite_all_cost:'',
    isShow:false,

  }, 
  // 点击规则
  guize:function(){
    this.setData({
      isShow:true
    })
  },
  // 点击遮罩层
  fullbg:function(){
    this.setData({
      isShow:false
    })
  },
  // 跳转到可用收益
  Returns_detailed:function(){
    wx.navigateTo({
      url: '/pages/index/share/Returns_detailed/Returns_detailed',
    })
  },
  // 跳转到我的邀请
  invite: function () {
    wx.navigateTo({
      url: '/pages/index/share/invite/invite',
    })
  },
  // 跳转到提现
  toalipay:function(){
    wx.navigateTo({
      url: '/pages/index/share/draw_money/draw_money',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = app.globalData.userInfo.userinfo.id
    wx.request({
      url: app.globalData.domain + '/api/v1/share/default/index',
      method: "GET",
      data: {
        user_id:id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          percent: res.data.data.percent, //下单可反百分比 
          member_count: res.data.data.member_count, //好友人数
          all_profit: res.data.data.list.all_profit,//累计消费
          useful_profit: res.data.data.list.useful_profit, //可提现金额
          invite_all_cost: res.data.data.list.invite_all_cost //好友消费
        })
      },
      fail(res) {
        console.log(res.data)
      }
    })
    this.setData({
      domain: app.globalData.domain,
      headimg: app.globalData.userInfo.userinfo.image,
      avatar: app.globalData.userInfo.userinfo.avatar,
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
    if (this.data.money){
      this.setData({
        useful_profit: this.data.money
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var id = app.globalData.userInfo.userinfo.id
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '一元做广告，不在是传说',
      path: '/pages/register/register?id=' + id,
      imageUrl:'/images/mine/share.jpg'
    }
  }
})