var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpValue:'',
    headimg: '',
    avatar: '',
    isheadimg:false,
    name: '',
    focus:false
  },
  // 换头像
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;   
        var uploadImgCount = 9;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.domain + '/api/v2/home/index/addimg',
            filePath: tempFilePaths[i],
            name: 'img',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if(data.code == 200){
                wx.request({
                  url: app.globalData.domain + '/api/v2/user/users/apdateuser',
                  method: "POST",
                  data: {
                    userid: app.globalData.userInfo.userinfo.id,
                    image: data.data
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success(res) {
                    if(res.data.code == 200){
                      that.setData({
                        headimg: data.data
                      })
                      app.globalData.userInfo.userinfo.image = data.data;
                      wx.setStorage({
                        key: 'userInfo',
                        data: app.globalData.userInfo
                      })
                    }
                  },
                  fail(res) {
                    console.log(res.data)
                  }
                })
              }
              
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) {
                  console.log(res)
                }
              })
            }
          });
        }
      }
    });
  },
  // 换名字
  changename:function(){
    this.setData({
      focus:true
    })
  },
  // 获取输入框的值
  bindinput:function(e){
    this.setData({
      inpValue: e.detail.value
    })
  },
  // 取消
  quxiao:function(){
    this.setData({
      focus: false
    })
  },
  // 确定
  queding:function(){
    this.setData({
      focus: false,
      name:this.data.inpValue
    })
    var name = this.data.name;
    app.globalData.userInfo.userinfo.name = this.data.name;
    wx.setStorage({
      key: 'userInfo',
      data: app.globalData.userInfo
    })
    // 将名字传入数据库
    wx.request({
      url: app.globalData.domain + '/api/v2/user/users/apdateuser',
      method: "POST",
      data: {
        userid: app.globalData.userInfo.userinfo.id,
        name:name
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },
  // 退出登录
  exit:function(){
    wx.removeStorage({
      key: 'userInfo',
      success(res) {
        console.log(res)
        wx.reLaunch({
          url: '/pages/register/register'
        })
      }
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

  },
})