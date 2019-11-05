var app = getApp();
Page({
  data: {
    isfull3:false,
    istypeBox:false,
    type:"",
    lists: [],
    delID:[],
    hasList: false,          // 列表是否有数据
    totalnum: 0,
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认全选
  },
  onLoad(options){
    app.globalData.delID = [];
    this.setData({
      domain: app.globalData.domain,
    })
    var delID1 = app.globalData.delID1;
    if (delID1.length!=0) {
      var delID1 = options.delID1;
      var shoppingCar = app.globalData.shoppingCar;
      for (let i = 0; i < shoppingCar.length; i++) {
        for (let j = 0; j < delID1.length; j++) {
          if (shoppingCar[i].id == delID1[j]) {
            shoppingCar[i].selected = false;
            shoppingCar[i] = "";
          }
        }
      }
      var arr2 = [];
      shoppingCar.forEach((r) => {
        if (r != "") {
          arr2.push(r);
        }
      })
      app.globalData.shoppingCar = arr2;
      wx.setStorage({
        key: 'shoppingCar',
        data: arr2
      })
      app.globalData.delID = delID1;
      this.setData({
        hasList: true,
        lists: arr2,
      })
    }else{
      this.setData({
        hasList: true,
        lists: app.globalData.shoppingCar
      })
    }   
  },
  onShow(){
    if(this.data.delID1){
      var delID1 = this.data.delID1;
      var shoppingCar = app.globalData.shoppingCar;
      if (delID1.length != 0) {
        for (let i = 0; i < shoppingCar.length; i++) {
          for (let j = 0; j < delID1.length; j++) {
            if (shoppingCar[i].id == delID1[j]) {
              shoppingCar[i].selected = false;
              shoppingCar[i] = "";
            }
          }
        }
        var arr2 = [];
        shoppingCar.forEach((r)=>{
          if(r != ""){
            arr2.push(r);
          }
        })
        app.globalData.shoppingCar = arr2;
        wx.setStorage({
          key: 'shoppingCar',
          data: arr2
        })
        app.globalData.delID = delID1;
        this.setData({
          hasList: true,
          lists: arr2,
        })
      }
    }     
  },
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


  // 计算手滑动角度函数
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  touchstart(e) {
    //开始触摸时 重置所有删除
    this.data.lists.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      lists: this.data.lists
    })
  },
  //滑动事件处理
  touchmove(e) {
    let index = e.currentTarget.dataset.index;//当前索引
    let startX = this.data.startX;//开始X坐标
    let startY = this.data.startY;//开始Y坐标
    let touchMoveX = e.touches[0].clientX;//滑动变化坐标
    let touchMoveY = e.touches[0].clientY;//滑动变化坐标
    //获取滑动角度
    let angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    this.data.lists.forEach((v, i) => {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    this.setData({
      lists: this.data.lists
    })
  },
  //删除事件
  del(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    let lists = this.data.lists;
    const selected = lists[index].selected;
    lists[index].selected = false;
    var delID = this.data.delID;
    delID.push(lists[index].id);
    this.setData({
      delID: delID
    })
    this.data.lists.splice(e.currentTarget.dataset.index, 1);
    app.globalData.delID = delID;
    console.log(this.data.lists);
    wx.setStorage({
      key: 'shoppingCar',
      data: that.data.lists
    })
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
  // 下一步
  next:function(){
    app.globalData.chooseCar = [];
    var lists = this.data.lists;
    var arr = [];
    for(let i=0; i<lists.length; i++){
      if(lists[i].selected){
        arr.push(lists[i]);     
      }
    }
    app.globalData.chooseCar = arr;
    wx.setStorage({
      key: 'shoppingCar',
      data: arr
    })
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
  // 点击取消
  typeBoxQX:function(){
    this.setData({
      istypeBox:false,
      isfull3:false,
    })
  },
  // 点击视屏
  typeBoxSP(e){
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
  },
    // 跳转到广告机详情
  todetail: function (e) {
    var id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '/pages/search/details/details?id=' + id,
    })
  }
})