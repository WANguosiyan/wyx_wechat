var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //选择的终点城市暂存数据/类型
    endselect: "选择地区",
    endkeys: "选择类型",
    //用户选择县城
    town: [],
    touchDotX: 0,
    touchDotY: 0,
    isInfo: false,
    isClick: false,
    typeList: [],
    qyopen: false,
    qyshow: true,
    nzopen: false,
    nzshow: true,
    isfull: false,
    isfull2: false,
    cityleft: [],
    citycenter: {},
    select1: '',
    select2: '',
    shownavindex: '',
    biaoji:[],
    xiabiao:'',
    shopNum:'',
    newNum:'',
    obj: {
      parent_id: "",
      city_id: "",
      type: ""
    },
    allList: [],
    lists: [],
    // 地图
    heigh: "",
    latitude: "",
    longitude: "",
    markers:[],
    callout: {
      content:"022020",
      padding: 7,
      display: 'ALWAYS',
      textAlign: 'center',
      borderRadius: 50,
      borderColor: '#2D70FC',
      borderWidth: 1,
      color: '#2D70FC',
      bgColor: '#F8F8F8'
    },
  },
  // 下拉菜单
  //选择地区
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        isInfo: false,
        isfull2: false,
        qyopen: false,
        nzopen: false,
        nzshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        isInfo: false,
        isfull2: false,
        qyopen: true,
        nzopen: false,
        nzshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  // 选择类型
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        isInfo: false,
        isfull2: false,
        nzopen: false,
        qyopen: false,
        nzshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        isInfo: false,
        isfull2: false,
        nzopen: true,
        qyopen: false,
        nzshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  chooseType: function (e) {
    var type = 'obj.type';
    this.setData({
      qyopen: false,
      nzopen: false,
      nzshow: true,
      qyshow: true,
      isfull: false,
      [type]: e.currentTarget.dataset.type_id,
      type: e.currentTarget.dataset.type,
      endkeys: e.currentTarget.dataset.item
    })
    var obj = this.data.obj;
    this.filtrate(obj)
  },
  // 选择地区的方法
  selectleft: function (e) {
    var that = this;
    var parent_id = e.currentTarget.dataset.cityid;
    this.setData({
      endselect: e.currentTarget.dataset.item
    })
    // 获取二级城市
    wx.request({
      url: app.globalData.domain + '/api/v1/equipment/default/region',
      method: "GET",
      data: {
        parent_id: parent_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          citycenter: res.data.data,
          city: e.target.dataset.city,
          select1: e.target.dataset.city,
          select2: ''
        })
      },
      fail(res) {
        console.log(res.data)
      }
    })
    var parentId = 'obj.parent_id';
    this.setData({
      [parentId]: parent_id
    })
    var obj = this.data.obj;
    this.filtrate(obj)
  },
  selectcenter: function (e) {
    var city_id = 'obj.city_id';
    this.setData({
      qyopen: false,
      nzopen: false,
      nzshow: true,
      qyshow: true,
      isfull: false,
      [city_id]: e.target.dataset.cityid,
      select2: e.target.dataset.city,
      city: e.target.dataset.city,
      endselect: e.currentTarget.dataset.item
    });
    var obj = this.data.obj;
    this.filtrate(obj)
  },
  // 遮罩层
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      nzshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },
  hidebg2: function (e) {
    this.setData({
      isfull2: false,
      isInfo:false
    })
  },
  // 筛选广告机列表
  filtrate: function (obj) {
    var parent_id = obj.parent_id;
    var city_id = obj.city_id;
    var type = obj.type;
    var lists = this.data.lists;
    var allList = this.data.allList;
    // 判断选择了哪些选项
    // 当type有而parent_id没有时
    if (type && !parent_id) {
      if (type == -1) {
        this.setData({
          lists: allList
        })
      } else {
        var arr = [];
        allList.forEach((r) => {
          if (r.type_id == type) {
            arr.push(r);
          }
        })
        this.setData({
          lists: arr
        })
      }
      //当type没有而parent_id有时
    } else if (!type && parent_id) {
      if (parent_id == -1) {
        this.setData({
          lists: allList
        })
      } else {
        var arr = [];
        allList.forEach((r) => {
          if (r.province == parent_id) {
            arr.push(r);
          }
        })
        if (city_id) {
          if (city_id == -1) {
            this.setData({
              lists: arr
            })
          } else {
            var arr2 = [];
            arr.forEach((r) => {
              if (r.city == city_id) {
                arr2.push(r);
              }
            })
            this.setData({
              lists: arr2
            })
          }
        } else {
          this.setData({
            lists: arr
          })
        }
      }
      // 当两个都有时
    } else if (type && parent_id) {
      if (type == -1 && parent_id == -1) {
        this.setData({
          lists: allList
        })
      } else if (type == -1 && parent_id != -1) {
        if (city_id && city_id != -1) {
          var arr2 = [];
          allList.forEach((r) => {
            if (r.province == parent_id && r.city == city_id) {
              arr2.push(r);
            }
          })
          this.setData({
            lists: arr2
          })
        } else {
          var arr2 = [];
          allList.forEach((r) => {
            if (r.province == parent_id) {
              arr2.push(r);
            }
          })
          this.setData({
            lists: arr2
          })
        }
      } else if (type != -1 && parent_id == -1) {
        var arr2 = [];
        allList.forEach((r) => {
          if (r.type_id == type) {
            arr2.push(r);
          }
        })
        this.setData({
          lists: arr2
        })
      } else if (type != -1 && parent_id != -1) {
        if (city_id && city_id != -1) {
          var arr2 = [];
          allList.forEach((r) => {
            if (r.province == parent_id && r.type_id == type && r.city == city_id) {
              arr2.push(r);
            }
          })
          this.setData({
            lists: arr2
          })
        } else {
          var arr2 = [];
          allList.forEach((r) => {
            if (r.province == parent_id && r.type_id == type) {
              arr2.push(r);
            }
          })
          this.setData({
            lists: arr2
          })
        }
      }
    }
  },

  // 跳转到消息
  tonews:function(){
    wx.navigateTo({
      url: '/pages/search/news/news',
    })
  },
  // 跳转图文
  totuwen:function(){
    wx.navigateTo({
      url: '/pages/search/tuwen/tuwen',
    })
  },
  // 跳转购物车
  shopping_trolley: function () {
    var delID1 = app.globalData.delID1;
    wx.navigateTo({
      url: '/pages/shopping_trolley/shopping_trolley?delID1=' + delID1,
    })
  },
  // 跳转搜索
  sousuo: function () {
    wx.navigateTo({
      url: '/pages/search/sousuo/sousuo'
    })
  },
  // 批量购买
  advertisement_putting: function () {
    wx.navigateTo({
      url: '/pages/index/advertisement_putting/advertisement_putting',
    })
  },
  // 查看详情
  toDetails: function () {
    var lists = this.data.lists;
    var xiabiao = this.data.xiabiao;
    var id = lists[xiabiao].id;
    wx.navigateTo({
      url: '/pages/search/details/details?id=' + id,
    })
    this.setData({
      isfull2: false,
      isInfo: false
    })
  },
  // 添加购物车
  add: function () {
    var lists = this.data.lists;
    var xiabiao = this.data.xiabiao;
    var shoppingCar = app.globalData.shoppingCar;
    if (lists[xiabiao].choose){
      wx.showToast({
        title: '请勿重复添加',
        icon: 'none',
        duration: 1000
      });
      this.setData({
        isfull2: false,
        isInfo: false
      })
    }else{
      lists[xiabiao].choose = true;
      shoppingCar.push(lists[xiabiao]);
      this.setData({
        shopNum: shoppingCar.length
      })
      wx.setStorage({
        key: 'shoppingCar',
        data: shoppingCar
      })
      this.setData({
        isfull2: false,
        isInfo: false
      })
      wx.showToast({
        title: '添加成功',
        icon: 'none',
        duration: 1000
      });    
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res);
        if (res.data.token) {
          that.globalData.userInfo = res.data;
          setTimeout(function () {
            that.setData({
              domain: app.globalData.domain,
              typeList: app.globalData.typeList,
              cityleft: app.globalData.cityleft,
              heigh: app.globalData.equipmentHeight - 160
            })
          }, 500)
          // 获取标记城市
          wx.request({
            url: app.globalData.domain + '/api/v1/equipment/default/list',
            method: "GET",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              var lists = res.data.data.data;
              var arr1 = res.data.data.data;
              that.setData({
                biaoji: arr1
              })
              var arr2 = that.data.biaoji;
              arr2.forEach((r) => {
                r.height = 38;
                r.choose = false;
                r.latitude = r.position[1];
                r.callout.display = 'ALWAYS';
                r.callout.textAlign = 'center';
                r.callout.borderRadius = 50;
                r.callout.borderColor = '#2D70FC';
                r.callout.borderWidth = 1;
                r.callout.padding = 7;
                r.callout.color = '#2D70FC';
                r.callout.bgColor = '#F8F8F8';
              })
              that.setData({
                allList: arr2,
                lists: arr2,
                markers: arr2
              })
            },
            fail(res) {
              console.log(res.data)
            }
          })
          // 获取消息条数
          wx.request({
            url: app.globalData.domain + '/api/v2/user/users/getfeedbacknum',
            method: "GET",
            data: {
              user_id: app.globalData.userInfo.userinfo.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if (res.data.code == 200) {
                that.setData({
                  newNum: res.data.data
                })
              }
            },
            fail(res) {
              console.log(res.data);
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '未登录',
            showCancel:false,
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
          showCancel:false,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.mapCtx = wx.createMapContext('myMap');
    this.getCenterLocation();
    setTimeout(function(){
      var shoppingCar = app.globalData.shoppingCar;
      var lists = that.data.lists;
      if (lists.length != 0 && shoppingCar.length != 0) {
        for (let i = 0; i < lists.length; i++) {
          for (let j = 0; j < shoppingCar.length; j++) {
            if (lists[i].id == shoppingCar[j].id) {
              lists[i].choose = true;
            }
          }
        }
        that.setData({
          lists: lists
        })
      }
    },500)
  },
  // 获取当前位置
  getCenterLocation: function () {
    var that = this
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        console.log(res.latitude, res.longitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail:function(res){
        console.log(res);
        that.mapCtx = wx.createMapContext('myMap');
        that.getCenterLocation();
      }
    })
  },
  // 点击markers
  bindmarkertap: function (e) {
    var latitude = '';
    var longitude ='';
    for (let i = 0; i < this.data.lists.length; i++){
      console.log(this.data.lists[i].id)
      if (this.data.lists[i].id == e.markerId){
        latitude = this.data.lists[i].latitude;
        longitude = this.data.lists[i].longitude;
        this.setData({
          xiabiao:i
        })
      }
    }
    this.setData({
      latitude: latitude,
      longitude: longitude,
      isInfo: true,
      isfull2: true,
    })
  },
  // 点击气泡
  bindcallouttap: function (e) {
    var latitude = '';
    var longitude = '';
    for (let i = 0; i < this.data.lists.length; i++) {
      if (this.data.lists[i].id == e.markerId) {
        latitude = this.data.lists[i].latitude;
        longitude = this.data.lists[i].longitude;
        this.setData({
          xiabiao: i
        })
      }
    }
    this.setData({
      latitude: latitude,
      longitude: longitude,
      isInfo: true,
      isfull2: true,
    })
  },
  // 删除
  del: function () {
    this.setData({
      isInfo: false,
      isfull2: false,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var delID = app.globalData.delID;
    var delID1 = app.globalData.delID1;
    var shoppingCar = app.globalData.shoppingCar;
    var lists = this.data.lists;
    if (lists.length != 0 && delID.length!=0){
      for (let i = 0; i < lists.length;i++){
        for(let j=0;j<delID.length;j++){
          if (lists[i].id == delID[j]){
            lists[i].choose = false;
          }
        }
      }
    }
    for (let i = 0; i < shoppingCar.length; i++) {
      for (let j = 0; j < delID1.length; j++) {
        if (shoppingCar[i].id == delID1[j]) {
          shoppingCar[i].choose = false;
        }
      }
    }
    var arr = [];
    shoppingCar.forEach((r)=>{
      if(r.choose == true){
        arr.push(r);
      }
    })
    app.globalData.shoppingCar = arr;
    wx.setStorage({
      key: 'shoppingCar',
      data: arr
    })
    this.setData({
      lists: lists,
      shopNum: arr.length
    })
    if (this.data.newsNum == 0){
      // 获取消息条数
      wx.request({
        url: app.globalData.domain + '/api/v2/user/users/getfeedbacknum',
        method: "GET",
        data: {
          user_id: app.globalData.userInfo.userinfo.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              newNum: res.data.data
            })
          }
        },
        fail(res) {
          console.log(res.data);
        }
      })
    }
  },
})