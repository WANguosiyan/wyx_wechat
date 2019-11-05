var app = getApp();
Page({
  data: {
    isShow: false,
    value: "",
    // 购物车
    height: 0,
    typeList: [],
    cityleft: [],
    allList:[],
    lists: [],
    hasList: false,          // 列表是否有数据
    totalnum: 0,
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
  },
  onShow() {
    if (this.data.delID1) {
      if (this.data.delID1.length != 0) {
        this.onLoad();
        this.setData({
          selectAllStatus: false,
          delID1: []
        })
      }
    }
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      domain: app.globalData.domain,
      value: options.value
    })
    // 获取搜索的广告机
    wx.request({
      url: app.globalData.domain + '/api/v1/equipment/default/list',
      method: "GET",
      data:{
        user_id: app.globalData.userInfo.userinfo.id,
        search_name:options.value
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        var lists = res.data.data.data;
        lists.forEach((r) => {
          r.isTouchMove = false;
          r.selected = false;
        })
        that.setData({
          hasList: true,
          allList: lists,
          lists: lists
        })
      }
    })
    setTimeout(function () {
      that.setData({
        cityleft: app.globalData.cityleft,
        typeList: app.globalData.typeList,
        height: app.globalData.height
      })
    }, 500)

  },
  // 获取下拉选择的地区和类型
  showTab: function (e) {
    this.filtrate(e.detail);
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
  // 点击键盘的搜索
  bindconfirm: function () {
    var value = this.data.value;
    var that = this;
    if (value) {
      wx.request({
        url: app.globalData.domain + '/api/v1/equipment/default/list',
        method: "GET",
        data: {
          user_id: app.globalData.userInfo.userinfo.id,
          search_name: value
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          var lists = res.data.data.data;
          lists.forEach((r) => {
            r.isTouchMove = false;
            r.selected = false;
          })
          that.setData({
            hasList: true,
            allList: lists,
            lists: lists
          })
        }
      })
    }
  },
  // 搜索方法
  focused: function () {
    this.setData({
      isShow: true
    })
  },
  cancel: function () {
    this.setData({
      isShow: false,
      value: ""
    })
  },
  finish: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  // 跳转到选择时长
  duration: function () {
    var lists = this.data.lists;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].selected) {
        app.globalData.chooseCar.push(lists[i]);
      }
    }
    if (app.globalData.chooseCar.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 1500
      });
    } else {
      this.setData({
        istypeBox: true,
        isfull3: true
      })
    }
  },
  // 跳转到广告机详情
  todetail: function (e) {
    var id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '/pages/search/details/details?id=' + id,
    })
  },
  // 购物车的方法
  selectList(e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let lists = this.data.lists;                    // 获取购物车列表
    const selected = lists[index].selected;         // 获取当前商品的选中状态
    lists[index].selected = !selected;              // 改变状态
    let selectAllStatus = this.data.selectAllStatus;
    let num = 0;
    let sum = 0;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].selected == true) {
        sum++;
      } else {
        num++;
        this.setData({
          selectAllStatus: false
        })
      }
    }
    this.setData({
      totalnum: sum
    })
    if (num == 0) {
      this.setData({
        selectAllStatus: true
      })
    }
    this.setData({
      lists: lists
    });
  },
  // 
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let lists = this.data.lists;
    for (let i = 0; i < lists.length; i++) {
      lists[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      lists: lists
    });
    if (selectAllStatus == true) {
      this.setData({
        totalnum: lists.length
      })
    }
  },
  //删除事件
  del(e) {
    const index = e.currentTarget.dataset.index;
    let lists = this.data.lists;
    const selected = lists[index].selected;
    this.data.lists.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      lists: this.data.lists,
    })
    let num = 0;
    let sum = 0;
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].selected == true) {
        sum++;
      } else {
        num++;
        this.setData({
          selectAllStatus: false
        })
      }
    }
    this.setData({
      totalnum: sum
    })
    if (num == 0) {
      this.setData({
        selectAllStatus: true
      })
    }
  },
  // 点击取消
  typeBoxQX: function () {
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
  },
  // 点击视屏
  typeBoxSP(e) {
    app.globalData.type = e.currentTarget.dataset.sp
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
    wx.navigateTo({
      url: '/pages/duration/duration',
    })
  },
  // 点击文字
  typeBoxWZ(e) {
    app.globalData.type = e.currentTarget.dataset.wz
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
    wx.navigateTo({
      url: '/pages/duration/duration',
    })
  }
})