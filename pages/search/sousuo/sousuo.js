var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    value: "",
    history:[],
  },
  focused:function(){
    this.setData({
      isShow:true
    })
  },
  cancel:function(){
    this.setData({
      isShow: false,
      value:""
    })
  },
  finish:function(e){
    this.setData({
      value: e.detail.value
    })
  },
  clickItem:function(e){
    wx.navigateTo({
      url: '/pages/search/result/result?value=' + e.currentTarget.dataset.name
    })
  },
  // 点击键盘的搜索
  bindconfirm:function(){
    var value = this.data.value;
    if(value){
      wx.navigateTo({
        url: '/pages/search/result/result?value=' + value
      })
    }
  },
  //清除历史记录
  clear:function(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/equipment/default/delete-history',
      method: "GET",
      data:{
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data);
        if (res.data.code == 200){
          wx.request({
            url: app.globalData.domain + '/api/v1/equipment/default/history',
            method: "GET",
            data: {
              user_id: app.globalData.userInfo.userinfo.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              that.setData({
                history: res.data.data
              })
            },
            fail(res) {
              console.log(res.data)
            }
          })
        }
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/equipment/default/history',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          history: res.data.data
        })     
      },
      fail(res) {
        console.log(res.data)
      }
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

  },
})