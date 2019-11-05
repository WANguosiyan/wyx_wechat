var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    create_time:"",
    start:"",
    end:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    var time_date = JSON.parse(options.time_date);
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    for (var p in time_date) {
      arr1.push(p);
      arr2.push(time_date[p]);
    }
    var start = arr1[0] + "-" + arr2[0][0];
    arr3 = arr2[arr2.length - 1];
    var end = arr1[arr1.length - 1] + "-" + arr3[arr3.length - 1];
    var create_time = options.create_time.substring(0, 10);
    this.setData({
      name: app.globalData.userInfo.userinfo.name,
      create_time: create_time,
      start: start,
      end:end
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