var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var segmentation = require('../../utils/segmentation.js');
var pickerViewT = 0;
var show = false;
var moveY = 200;
//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()
  that.setData({
    animation: that.animation.export(),
    show: show
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],
    menu:[],
    currentTab: 0,
    SetMealList:[],
    isShow:true,
    isBg:false,
    numPage:1,
    address:'',
    cityleft:[],
    cityright:[],
    cityIndex:0,
    parentid:'',
    parentname:'',
    cityid:'',
    cityname:'',
    lat:0,
    lng:0
  },
  // 跳转到广告投放页
  advertisement_putting:function(){
    wx.navigateTo({
      url: '/pages/index/advertisement_putting/advertisement_putting',
    })
  },
  // 跳转到分销页
  share: function () {
    wx.navigateTo({
      url: '/pages/index/share/share',
    })
  },
  // 申请加盟
  application: function () {
    wx.navigateTo({
      url: '/pages/jiameng/jiameng',
    })
  },
  // 视屏制作
  video: function () {
    wx.navigateTo({
      url: '/pages/index/video/video',
    })
  },
  // 广告场景
  scene: function () {
    wx.navigateTo({
      url: '/pages/index/case/case',
    })
  },
  // 商家入驻
  cooperation:function(){
    wx.navigateTo({
      url: '/pages/index/application/application',
    })
  },
  // 切换到套餐提交
  toSetMeal:function(e){
    var combo_id = e.currentTarget.dataset.comboid;
    wx.navigateTo({
      url: '/pages/index/SetMeal/SetMeal?combo_id=' + combo_id,
    })
  },
  //点击地址图标
  translate: function (e) {
    if (pickerViewT == 0) {
      moveY = 0;
      show = false;
      pickerViewT = 1;
    } else {
      moveY = 200;
      show = true;
      pickerViewT = 0;
    }
    animationEvents(this, moveY, show);
    this.setData({
      isBg:true
    })

  },
  // 点击省市
  getCity:function(e){
    var that = this;
    that.setData({
      parentname: e.currentTarget.dataset.name
    })
    // 获取二级城市
    wx.request({
      url: app.globalData.domain + '/api/v1/equipment/default/region',
      method: "GET",
      data: {
        parent_id: e.currentTarget.dataset.parentid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          cityright: res.data.data
        })
      },
      fail(res) {
        console.log(res.data)
      }
    })
    this.setData({
      parentid: e.currentTarget.dataset.parentid,
      cityIndex: e.currentTarget.dataset.cityindex
    })
  },
  // 点击城市
  getCombo:function(e){
    var that = this;
    var parentname = this.data.parentname;
    console.log(e.currentTarget.dataset.cityid)
    if (e.currentTarget.dataset.cityid == -1){
      that.setData({
        address: parentname
      })
    }else{
      that.setData({
        address: e.currentTarget.dataset.name
      })
    }
    // 获取广告套餐
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/combo-list',
      method: "POST",
      data: {
        pageSize: 10,
        page: 1,
        province:that.data.parentid,
        city: e.currentTarget.dataset.cityid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data);
        that.setData({
          SetMealList: res.data.data
        })
      }
    })
    this.setData({
      isBg: false,
      cityid: e.currentTarget.dataset.cityid
    })
    moveY = 200;
    show = true;
    pickerViewT = 0;
    animationEvents(this, moveY, show);
  },
  // 点击背景
  bg:function(){
    this.setData({
      isBg: false
    })
    moveY = 200;
    show = true;
    pickerViewT = 0;
    animationEvents(this, moveY, show);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'P6IBZ-IK5W2-4ORUK-CT7IO-7W3NQ-FUFY2'
    });
    // 调用接口
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        console.log(res.result);
        wx.request({
          url: app.globalData.domain + '/api/v2/equipment/default/get-region',
          method: "POST",
          data: {
            lat: res.result.location.lat,
            lng: res.result.location.lng
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res);
            // 获取广告套餐
            console.log(res.data.data.parent_id, res.data.data.id);
            that.setData({
              parentid: res.data.data.parent_id,
              cityid: res.data.data.id
            })
            wx.request({
              url: app.globalData.domain + '/api/v2/equipment/default/combo-list',
              method: "POST",
              data: {
                pageSize: 10,
                page: 1,
                province: res.data.data.parent_id,
                city: res.data.data.id
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                console.log(res.data.data);
                that.setData({
                  SetMealList: res.data.data
                })
              }
            })
          }
        })
        that.setData({
          cityleft: app.globalData.cityleft,
          address: res.result.address_component.district,
          lat: res.result.location.lat,
          lng: res.result.location.lng
        })
      },
      fail: function (res) {
        console.log(res);
        wx.request({
          url: app.globalData.domain + '/api/v2/equipment/default/get-region',
          method: "POST",
          data: {
            lat: 0,
            lng: 0
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res);
            // 获取广告套餐
            console.log(res.data.data.parent_id, res.data.data.id);
            that.setData({
              parentid: res.data.data.parent_id,
              cityid: res.data.data.id
            })
            wx.request({
              url: app.globalData.domain + '/api/v2/equipment/default/combo-list',
              method: "POST",
              data: {
                pageSize: 10,
                page: 1,
                province: res.data.data.parent_id,
                city: res.data.data.id
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                console.log(res.data.data);
                that.setData({
                  SetMealList: res.data.data,
                  address:"全部"
                })
              }
            })
          }
        })
      },
    });

    this.setData({
      domain: app.globalData.domain
    })
    wx.request({
      url: app.globalData.domain + '/api/v2/home/index/gethomepic',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var menu = segmentation(res.data.data.menu, 10);
        that.setData({
          banner: res.data.data.banner,
          menu: menu
        })
      }
    })
   
  },
  onShow:function(){
    var that = this;
    this.setData({
      isBg: false
    })
    moveY = 200;
    show = true;
    pickerViewT = 0;
    animationEvents(this, moveY, show);
    console.log(that.data.parentid,)
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/combo-list',
      method: "POST",
      data: {
        pageSize: 10,
        page: 1,
        province: that.data.parentid,
        city: that.data.cityid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var arr = res.data.data
        that.setData({
          SetMealList: arr,
          numPage:1
        })
      }
    })
  },
  // 触底加载更多
  onReachBottom: function () {
    var that = this;
    var numPage = this.data.numPage;
    numPage++;
    this.setData({
      numPage: numPage
    })
    wx.request({
      url: app.globalData.domain + '/api/v2/equipment/default/combo-list',
      method: "POST",
      data: {
        pageSize: 10,
        page:numPage,
        province: that.data.parentid,
        city: that.data.cityid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var arr = that.data.SetMealList
        var arr2 = arr.concat(res.data.data);
        that.setData({
          SetMealList: arr2
        })
      }
    })
  },
})