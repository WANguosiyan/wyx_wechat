// 使用全局里的内容
let app = getApp();
Page({
  // 数据初始化
  data: {
    currentTime: 61,
    time: "获取验证码",
    disabled: false,
    userInfo: {},
    yanzhenma:'',
    hasUserInfo: false,
    phoneNum:"",
    parentid:"",
    name:'',
    image:'',
    isShow:false,
    code:"",
  },
  // 跳转服务协议
  wechatCharacterR:function(){
    wx.navigateTo({
      url: '/pages/register/Agreement/Agreement',
    })
  },
  // 输入框获取手机号
  phone:function(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },

  //获取验证码
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + 'S'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  verificationCode:function(){
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var phoneMobile = this.data.phoneNum;
    if (phoneMobile.length === 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (phoneMobile.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    } else if (!myreg.test(phoneMobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      });
      return false;
    }else{
      // 获取验证码
      if(!this.data.disabled){
        this.setData({
          disabled:true
        })
        this.getCode();
        wx.showToast({
          title: '验证码已发送！',
          icon: 'none',
          duration: 1500
        });
        wx.request({
          url: app.globalData.domain + '/api/v2/user/code/create',
          method: "POST",
          data: {
            mobile: phoneMobile
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
      }else{
        wx.showToast({
          title: '验证码以发送，请勿重复点击！',
          icon: 'none',
          duration: 1500
        });
      }
    }
  },
  // 获取微信授权
  bindgetphonenumber: function (res) {
    var that = this;
    this.setData({
      iv: res.detail.iv,
      encryptedData: res.detail.encryptedData
    })
    if (res.detail.encryptedData) {
      that.setData({
        isShow:true
      })
    } else {
      console.log("点击了拒绝授权");
    }
  },
  // 获取用户头像和昵称
  bindgetuserinfo:function(res){
    console.log(res);
    var that = this;
    var parentid = this.data.parentid;
    var iv = that.data.iv;
    var encryptedData = this.data.encryptedData;
    wx.login({
      success(e) {
        if (res.detail.userInfo) {
          var name = res.detail.userInfo.nickName;
          var image = res.detail.userInfo.avatarUrl;
          wx.request({
            method: "POST",
            data: {
              parentid: parentid,
              code: e.code,
              encryptedData: encryptedData,
              iv: iv,
              nickname: name,
              avatar: image
            },
            url: app.globalData.domain + '/api/v2/user/code/login',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res);
              that.setData({
                isShow: false
              })
              if (res.data.code == 200) {
                wx.setStorage({
                  key: 'userInfo',
                  data: res.data.data
                })
                app.globalData.userInfo = res.data.data
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else {
                wx.showToast({
                  title: '授权失败，请重新登录',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            },
          })
        } else {
          that.setData({
            isShow: false
          })
        }
      }
    })

  },

  // 页面加载
  onLoad: function () {
    if (app.globalData.parentid){
      this.setData({
        parentid: app.globalData.parentid
      })
    }else{
      this.setData({
        parentid:0
      })
    }
  },
  // 获取输入的验证码
  verification:function(e){
    this.setData({
      yanzhenma: e.detail.value
    })
  },
  // 登录
  login:function(){
    var phoneMobile = this.data.phoneNum;
    var YZM = this.data.yanzhenma;
    var parentid = this.data.parentid;
    if (phoneMobile&&YZM){
       wx.request({
        data: {
          parentid: parentid,
          mobile:phoneMobile,
          code:YZM
        },
        method: "POST",
         url: app.globalData.domain + '/api/v2/user/users/login',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res);
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data
          })
          app.globalData.userInfo = res.data.data;
          if (res.data.data.token){
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else{
            wx.showToast({
              title: '请输入正确手机号和验证码',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        },
       })
    }else{
      wx.showToast({
            title: '请输入手机号和验证码',
            icon: 'none',
            duration: 1000,
            mask: true
    })
    }
  }
})