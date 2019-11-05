var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:String,
    address: String,
    type_name: String,
    img: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    domain: app.globalData.domain
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
