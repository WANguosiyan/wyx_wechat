var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsShow:true,
    multiIndex: [0, 0, 0],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    // 输入框的值
    shopname: "",
    industry: "",
    shopkeeper: "",
    tel: "",
    weChat: "",
    province: "",
    city: "",
    area: "",
    address: "",
    userid: "",
    desc:"",
    files: [],
  },
  // 提交
  submit: function () {
    var shopname = this.data.shopname;
    var industry = this.data.industry;
    var shopkeeper = this.data.shopkeeper;
    var tel = this.data.tel;
    var weChat = this.data.weChat;
    var province = this.data.province;
    var city = this.data.city;
    var area = this.data.area;
    var address = this.data.address;
    var desc = this.data.desc;
    var userid = app.globalData.userInfo.userinfo.id;
    var files = this.data.files;
    var num = Number(this.data.files.length - 1);
    var imgs = [];
    if (shopname && industry && shopkeeper && tel && weChat && province && city && area && desc && address) {
      if (files.length != 0) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (tel.length === 0) {
          wx.showToast({
            title: '手机号输入错误！',
            icon: 'none',
            duration: 1500
          });
          return false;
        } else if (tel.length < 11) {
          wx.showToast({
            title: '手机号输入错误！',
            icon: 'none',
            duration: 1500
          });
          return false;
        } else if (!myreg.test(tel)) {
          wx.showToast({
            title: '手机号输入错误！',
            icon: 'none',
            duration: 1500
          });
          return false;
        } else {
          for (let i = 0, h = files.length; i < h; i++) {
            wx.uploadFile({
              url: app.globalData.domain +'/api/v2/home/index/addimg',
              filePath: files[i],
              name: 'img',
              formData: {
                'imgIndex': i
              },
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (res) {
                var data = JSON.parse(res.data);
                if (data.code == 200) {
                  imgs.push(data.data);
                }
                if (i === num) {
                  var list = JSON.stringify(imgs);
                  // 提交
                  wx.request({
                    url: app.globalData.domain + '/api/v2/shop/index/addshop',
                    method: "POST",
                    data: {
                      shopname: shopname,
                      industry: industry,
                      shopkeeper: shopkeeper,
                      tel: tel,
                      wechat: weChat,
                      province: province,
                      city: city,
                      area: area,
                      address: address,
                      userid: userid,
                      desc: desc,
                      img: list,
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(res) {
                      wx.showToast({
                        title: '上传成功',
                        icon: 'none',
                        duration: 1500
                      });
                      setTimeout(function(){
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      },1000)
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
                })
              }
            });
          } 
        }
      } else {
        wx.showToast({
          title: '请输入完整信息',
          icon: 'none',
          duration: 1500
        });
      }
    }else{
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 1500
      });
    }
  },
  // 获取店铺名称
  getShopName: function (e) {
    this.setData({
      shopname: e.detail.value
    })
  },
  // 获取行业
  getIndustry: function (e) {
    this.setData({
      industry: e.detail.value
    })
  },
  // 获取联系人
  getName: function (e) {
    this.setData({
      shopkeeper: e.detail.value
    })
  },
  // 获取联系电话
  getTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 获取微信号
  getWx:function(e){
    this.setData({
      weChat: e.detail.value
    })
  },
  // 获取省 市 区
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      area: e.detail.value[2],
      IsShow: false
    })
  },
  // 获取详细地址
  getAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 商户介绍
  getIntroduce:function(e){
    this.setData({
      desc: e.detail.value
    })
  },
  // 上传图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths
        });
      }
    })
  },
  // 删除图片
  uploader_deal:function(e){
    this.data.files.splice(e.currentTarget.dataset.imgindex,1)
    var imgArr = this.data.files;
    this.setData({
      files:imgArr
    }) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  }
})