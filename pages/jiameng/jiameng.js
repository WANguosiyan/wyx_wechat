var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsShow: true,
    multiIndex: [0, 0, 0],
    region: ['上海市', '上海市', '浦东新区'],
    chooseType: ["LED彩屏","电视屏","投影设备"],
    type:'',
    isType:true,
    // 输入框的值
    unitname:"",
    industry:"",
    name:"",
    tel:"",
    equipment_num: "",
    province: "",
    city: "",
    area: "",
    equipment_type: "",
    address: "",
    userid:"",
    files: [],
    isCHO:true,
  },
  // 提交
  submit: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          app.globalData.userInfo = res.data;
          var unitname = that.data.unitname;
          var industry = that.data.industry;
          var name = that.data.name;
          var tel = that.data.tel;
          var equipment_num = that.data.equipment_num;
          var province = that.data.province;
          var city = that.data.city;
          var area = that.data.area;
          var equipment_type = that.data.equipment_type;
          var address = that.data.address;
          var userid = app.globalData.userInfo.userinfo.id;
          var files = that.data.files;
          var num = Number(that.data.files.length - 1);
          var imgs = [];
          if (unitname && industry && name && tel && equipment_num && province && city && area && equipment_type && address) {
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
                    url: app.globalData.domain + '/api/v2/home/index/addimg',
                    filePath: files[i],
                    async: false,
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
                          url: app.globalData.domain + '/api/v2/shop/index/joinus',
                          method: "POST",
                          data: {
                            unitname: unitname,
                            industry: industry,
                            name: name,
                            tel: tel,
                            equipment_num: equipment_num,
                            province: province,
                            city: city,
                            area: area,
                            equipment_type: equipment_type,
                            address: address,
                            userid: userid,
                            shoppic: list,
                          },
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success(res) {
                            console.log(res.data)
                            if (res.data.code == 200) {
                              wx.showToast({
                                title: '提交成功',
                                icon: 'none',
                                duration: 1000
                              });
                              setTimeout(function () {
                                wx.switchTab({
                                  url: '/pages/index/index'
                                })
                              }, 1000)
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
            } else {
              wx.showToast({
                title: '请输入完整信息',
                icon: 'none',
                duration: 1500
              });
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
  // 获取单位名称
  companyName:function(e){
    this.setData({
      unitname: e.detail.value
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
      name: e.detail.value
    })
  },
  // 获取联系电话
  getTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 获取设备数
  getEquipment: function (e) {
    this.setData({
      equipment_num: e.detail.value
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
  // 选择类型
  getType:function(e){
    this.setData({
      equipment_type: this.data.chooseType[e.detail.value],
      isType:false
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
  uploader_deal: function (e) {
    this.data.files.splice(e.currentTarget.dataset.imgindex, 1)
    var imgArr = this.data.files;
    this.setData({
      files: imgArr
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