var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comboInfo:'',
    time:'',
    combolist:[],
    comboThree:[],
    comboAllList:[],
    show:true,
    buyNum:1,
  },
  // 查看更多
  getMore:function(){
    var show = this.data.show;
    var list = this.data.comboAllList;
    var list1 = this.data.comboThree;
    if (show){
      this.setData({
        combolist: list
      })
    }else{
      this.setData({
        combolist: list1
      })
    }
    show = !show;
    this.setData({
      show:show
    })
  },
  // 立即购买
  topay:function(e){
    console.log(e.currentTarget.dataset.disabled);
    if (e.currentTarget.dataset.disabled != 1){
      if (this.data.buyNum == 1) {
        wx.showLoading({
          title: '请稍后',
        })
        var id = this.data.comboInfo.detail.equipment_id;
        var type = this.data.comboInfo.detail.type;
        var timezone = this.data.comboInfo.buy_time;
        var time_long = this.data.comboInfo.detail.time_long;
        var combo_id = this.data.comboInfo.detail.id;
        var arr2 = [];
        wx.request({
          url: app.globalData.domain + '/api/v2/equipment/default/choose-time-zone',
          method: "POST",
          data: {
            user_id: app.globalData.userInfo.userinfo.id,
            token: app.globalData.userInfo.token,
            equipment_id: id,
            time_long: time_long,
            type: type,
            play_long: time_long,
            timezone: timezone,
            combo_id: combo_id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            wx.hideLoading()
            console.log(res);
            if (res.data.code == 400) {
              wx.showToast({
                title: '订单生成失败',
                icon: 'none',
                duration: 1500
              });
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }, 1000)
            } else {
              wx.navigateTo({
                url: '/pages/submit/submit?id=' + res.data.data.order_id + '&delID1=' + arr2
              })
            }
          },
          fail(res) {
            console.log(res.data)
          }
        })
      }
      this.setData({
        buyNum: 2
      })
    }else{
      wx.showToast({
        title: '套餐已过期',
        icon: 'none',
        duration: 1500
      });
    }
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.combo_id);
    this.setData({
      domain: app.globalData.domain
    })
    var that = this;
    // 获取广告套餐
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/combo-info',
      method: "POST",
      data: {
        combo_id: options.combo_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data)
        let data = app.towxml.toJson(res.data.data.detail.content, 'markdown');
        data.theme = 'light';
        var time = res.data.data.detail.time_long;
        var num1 = parseInt(Number(time) / 60);
        var num2 = Number(time) % 60;
        var num3 = '';
        if(num1!=0){
          if (num2 != 0){
            num3 = num1 + '分钟' + num2 + '秒'
            that
          }else{
            num3 = num1 + '分钟'
          }
        }else{
          num3 = num2 + '秒'
        }
        var itemNum1 = res.data.data.detail.equipment_count;
        var itemNum2 = Number(itemNum1) - 3;
        var comboNum = ''
        if (itemNum2<0){
          comboNum = 0
        }else{
          comboNum = itemNum2;
        }
        var combolist = res.data.data.equipment;
        if (combolist.length < 3){
          that.setData({
            combolist: combolist,
            comboThree: combolist
          })
        }else{
          var arr = combolist.slice(0, 3);
          that.setData({
            combolist: arr,
            comboThree: arr
          })
        }
        that.setData({
          time:num3,
          comboInfo: res.data.data,
          comboNum: comboNum,
          comboAllList: res.data.data.equipment,
          nodes: res.data.data.detail.content,
          article: data
        })
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
    this.setData({
      buyNum:1
    })
    var that = this;
    // 获取广告套餐
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/combo-info',
      method: "POST",
      data: {
        combo_id: options.combo_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data)
        let data = app.towxml.toJson(res.data.data.detail.content, 'markdown');
        data.theme = 'light';
        var time = res.data.data.detail.time_long;
        var num1 = parseInt(Number(time) / 60);
        var num2 = Number(time) % 60;
        var num3 = '';
        if (num1 != 0) {
          if (num2 != 0) {
            num3 = num1 + '分钟' + num2 + '秒'
            that
          } else {
            num3 = num1 + '分钟'
          }
        } else {
          num3 = num2 + '秒'
        }
        var itemNum1 = res.data.data.detail.equipment_count;
        var itemNum2 = Number(itemNum1) - 3;
        var comboNum = ''
        if (itemNum2 < 0) {
          comboNum = 0
        } else {
          comboNum = itemNum2;
        }
        var combolist = res.data.data.equipment;
        if (combolist.length < 3) {
          that.setData({
            combolist: combolist,
            comboThree: combolist
          })
        } else {
          var arr = combolist.slice(0, 3);
          that.setData({
            combolist: arr,
            comboThree: arr
          })
        }
        that.setData({
          time: num3,
          comboInfo: res.data.data,
          comboNum: comboNum,
          comboAllList: res.data.data.equipment,
          nodes: res.data.data.detail.content,
          article: data
        })
      }
    })
  },
  onHide:function(){
  },
  onUnload:function(){
  }
})