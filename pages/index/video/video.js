var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isText:false,
    filesShop: [],
    listShop:[],
    QRCode:[],
    listQR:[],
    filesOther:[],
    listOther:[],
    IsShow: true,
    multiIndex: [0, 0, 0],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    chooseType: ["LED彩屏", "电视屏", "投影设备"],
    type: '',
    IsType: true,
    shopname: "",
    industry: "",
    shopkeeper: "",
    tel: "",
    province: "",
    city: "",
    area: "",
    address: "",
    userid: "",
    desc: "",
    email:"",
  },
  changetext:function(){
    this.setData({
      isText:true
    })
  },
  // 获取描述需求
  bindblur:function(e){
    console.log(e.detail.value);
    this.setData({
      desc: e.detail.value
    });
    if (e.detail.value==false){
      this.setData({
        isText: false
      });
    }
  },
  // 选择类型
  ChangeType: function (e) {
    this.setData({
      type: e.detail.value,
      IsType: false
    })
  },
  // 店铺图片
  choose_filesShop: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          filesShop: res.tempFilePaths
        });
        var numShop = Number(res.tempFilePaths.length - 1);
        var imgShop = [];
        // 店铺图片
        for (let i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.domain + '/api/v2/home/index/addimg',
            filePath: res.tempFilePaths[i],
            name: 'img',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log(res.data);
              if (data.code == 200) {
                imgShop.push(data.data);
              }
              if (i === numShop) {
                var list = JSON.stringify(imgShop);
                that.setData({
                  listShop: list
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
    })
  },
  // 删除店铺图片
  uploader_filesShop: function (e) {
    this.data.filesShop.splice(e.currentTarget.dataset.imgindex, 1)
    var imgArr = this.data.filesShop;
    this.setData({
      filesShop: imgArr
    })
  },
  // 二位码图片
  choose_QRCode: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          QRCode: res.tempFilePaths
        });
        // 二维码
        var numQR = Number(res.tempFilePaths.length - 1);
        var imgQR = [];
        for (let i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.domain + '/api/v2/home/index/addimg',
            filePath: res.tempFilePaths[i],
            name: 'img',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log(res.data);
              if (data.code == 200) {
                imgQR.push(data.data);
              }
              if (i === numQR) {
                var list = JSON.stringify(imgQR);
                that.setData({
                  listQR: list
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
    })
  },
  // 删除二维码图片
  uploader_QRCode: function (e) {
    this.data.QRCode.splice(e.currentTarget.dataset.imgindex, 1)
    var imgArr = this.data.QRCode;
    this.setData({
      QRCode: imgArr
    })
  },
  // 其他图片
  choose_filesOther: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          filesOther: res.tempFilePaths
        });
        // 其他图片
        var numOther = Number(res.tempFilePaths.length - 1);
        var imgOther = [];
        for (let i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.domain + '/api/v2/home/index/addimg',
            filePath: res.tempFilePaths[i],
            name: 'img',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log(res.data);
              if (data.code == 200) {
                imgOther.push(data.data);
              }
              if (i === numOther) {
                var list = JSON.stringify(imgOther);
                that.setData({
                  listOther: list
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
    })
  },
  // 删除其他图片
  uploader_filesOther: function (e) {
    this.data.filesOther.splice(e.currentTarget.dataset.imgindex, 1)
    var imgArr = this.data.filesOther;
    this.setData({
      filesOther: imgArr
    })
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
  // 获取邮箱
  getEmail:function(e){
    this.setData({
      email: e.detail.value
    })
  },
  // 提交
  submit:function(){
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          app.globalData.userInfo = res.data;
          var shopname = that.data.shopname;
          var industry = that.data.industry;
          var shopkeeper = that.data.shopkeeper;
          var tel = that.data.tel;
          var province = that.data.province;
          var city = that.data.city;
          var area = that.data.area;
          var address = that.data.address;
          var desc = that.data.desc;
          var email = that.data.email;
          var listShop = that.data.listShop
          var listQR = that.data.listQR
          var listOther = that.data.listOther
          var userid = app.globalData.userInfo.userinfo.id;
          if (shopname && industry && shopkeeper && tel && province && city && area && address && desc && email && listShop.length != 0 && listQR.length != 0 && listOther.length != 0) {
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
              // 提交
              wx.request({
                url: app.globalData.domain + '/api/v2/video/index/addvideo',
                method: "POST",
                data: {
                  shopname: shopname,
                  industry: industry,
                  name: shopkeeper,
                  tel: tel,
                  email: email,
                  province: province,
                  city: city,
                  area: area,
                  address: address,
                  userid: userid,
                  desc: desc,
                  shoppic: listShop,
                  qrcode: listQR,
                  otherpic: listOther,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(res) {
                  console.log(res.data)
                  wx.showToast({
                    title: '上传成功',
                    icon: 'none',
                    duration: 1500
                  });
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }, 1000)
                },
                fail(res) {
                  console.log(res.data)
                }
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

  },
})