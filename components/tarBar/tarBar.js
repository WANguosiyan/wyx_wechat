// components/tarBar/tarBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: {
      type: Number,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tarList: [
      {
        "current": 0,
        "pagePath": "/pages/index/index",
        "iconPath": '/images/tab/icon_home_default.png',
        "selectedIconPath": "/images/tab/icon_home_selected.png",
        "text": "首页"
      },
      {
        "current": 1,
        "pagePath": "/pages/search/search",
        "iconPath": '/images/tab/icon_search_default.png',
        "selectedIconPath": "/images/tab/icon_search_selected.png",
        "text": "查询"

      },
      {
        "current": 2,
        "pagePath": "/pages/mine/mine",
        "iconPath": '/images/tab/icon_me_default.png',
        "selectedIconPath": "/images/tab/icon_me_selected.png",
        "text": "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
