var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeList: Array,
    cityleft: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    //选择的终点城市暂存数据/类型
    endselect: "选择地区",
    endkeys: "选择类型",
    //用户选择县城
    town: [],
    qyopen: false,
    qyshow: true,
    nzopen: false,
    nzshow: true,
    isfull: false,
    select1: '',
    select2: '',
    shownavindex: '',
    citycenter: {},
    typeList: [],
    cityleft: [],
    obj:{
      parent_id:"",
      city_id:"",
      type:""
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //选择地区
    listqy: function (e) {
      if (this.data.qyopen) {
        this.setData({
          qyopen: false,
          nzopen: false,
          nzshow: true,
          qyshow: false,
          isfull: false,
          shownavindex: 0
        })
      } else {
        this.setData({
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
          nzopen: false,
          qyopen: false,
          nzshow: false,
          qyshow: true,
          isfull: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          nzopen: true,
          qyopen: false,
          nzshow: false,
          qyshow: true,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    // 选择类型
    chooseType: function (e) {
      this.data.obj.type = e.currentTarget.dataset.type_id
      this.setData({
        qyopen: false,
        nzopen: false,
        nzshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        type: e.currentTarget.dataset.type,
        endkeys: e.currentTarget.dataset.item
      })
      this.triggerEvent('showTab', this.data.obj);
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
      this.data.obj.parent_id = parent_id;
      this.triggerEvent('showTab', this.data.obj);
    },
    selectcenter: function (e) {
      this.setData({
        qyopen: false,
        nzopen: false,
        nzshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        select2: e.target.dataset.city,
        city: e.target.dataset.city,
        endselect: e.currentTarget.dataset.item
      });
      this.data.obj.city_id = e.target.dataset.cityid;
      this.triggerEvent('showTab', this.data.obj);
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
    // 将选择的数据传递Page
  }
})
