var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _ts = this;        //请求markdown文件，并转换为内容
    wx.request({
      url: app.globalData.domain + '/api/v2/home/index/getjmmd',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {          //将markdown内容转换为towxml数据
        let data = app.towxml.toJson(res.data.data.jiameng, 'markdown');                //设置文档显示主题，默认'light'
        data.theme = 'light';                //设置数据
        _ts.setData({
          article: data
        });
      }
    });
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