var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    tupian:[],
    video:{},
    img:"",
    isShow:false,
    tapIndex:"",
    progress:0
  },
  // 选择图片或者视屏
  chooseImg:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['选择图片', '选择视屏'],
      success(res) {
        that.setData({
          tapIndex: res.tapIndex
        })
        if (res.tapIndex == 0){
          wx.chooseImage({
            count:1,
            compressed:false,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              console.log(res);
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              that.setData({
                tupian: res.tempFilePaths,
                video:{},
                isShow:true
              })
              var uploadTask = wx.uploadFile({
                url: app.globalData.domain + '/api/v2/home/index/addfile',
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: {
                  'imgIndex': 0
                },
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: function (res) {
                  console.log(res);
                  var data = JSON.parse(res.data);
                  that.setData({
                    img:data.data
                  })
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
              uploadTask.onProgressUpdate((res) => {
                that.setData({
                  progress: res.progress
                })
              })
            }
          })
        }else{
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            compressed: false,
            maxDuration: 60,
            camera: 'back',
            success(res) {
              wx.showLoading({
                title: '处理中...',
              })
              console.log(res,123);
              that.setData({
                tupian: [],
                video: res,
                isShow: true
              })
              var uploadTask = wx.uploadFile({
                url: app.globalData.domain + '/api/v2/home/index/addfile',
                filePath: res.tempFilePath,
                name: 'file',
                formData: {
                  'imgIndex': 0
                },
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: function (res) {
                  console.log(res.data,123456)
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 500)
                  var data = JSON.parse(res.data);
                  that.setData({
                    img: data.data,
                    progress: 100
                  })
                },
                fail: function (res) {
                  wx.hideToast();
                  wx.showModal({
                    title: '错误提示',
                    content: '上传视屏失败',
                    showCancel: false,
                    success: function (res) {
                      console.log(res)
                    }
                  })
                }
              });
              uploadTask.onProgressUpdate((res) => {
                console.log(res);
                if (res.progress == 100){
                  that.setData({
                    progress: 99
                  })
                }else{
                  that.setData({
                    progress: res.progress
                  })
                }
                
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 上传
  toload:function(){
    var order_id = this.data.order_id;
    var img = this.data.img;
    var type = this.data.tapIndex;
    console.log(img, type);
    wx.request({
      url: app.globalData.domain + '/api/v1/operate/default/save',
      data: {
        type: type,
        content: img,
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        order_id: order_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.msg)
        if (res.data.msg == "上传广告成功") {
          wx.showToast({
            title: '上传广告成功',
            icon: 'none',
            duration: 1500
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/all_orders/all_orders'
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '上传广告失败',
            icon: 'none',
            duration: 1500
          });
        }

      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      order_id: options.id
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