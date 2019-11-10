var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        money:Number,
        tomine:Boolean,
        delta:Number,
        delID1:Array,
        background: {
            type: String,
            value: 'rgba(45, 112, 252, 1)'
        },
        color: {
            type: String,
            value: 'rgba(0, 0, 0, 1)'
        },
        goBack:{
            type: Number,
            value:''
        },
        agreement: {
          type: Number,
          value: ''
        },
        titleText: {
            type: String,
            value: '导航栏'
        },
        fontSize: {
            type: Number,
            value: 18
        },
        iconHeight: {
            type: Number,
            value: 19
        },
        iconWidth: {
            type:Number,
            value: 58
        }
    },
    attached: function(){
        var that = this;
        that.setNavSize();
        that.setStyle();
    },
    data: {

    },
    methods: {
        // 通过获取系统信息计算导航栏高度
        setNavSize: function() {
            var that = this
                , sysinfo = wx.getSystemInfoSync()
                , statusHeight = sysinfo.statusBarHeight
                , isiOS = sysinfo.system.indexOf('iOS') > -1
                , navHeight;
            if (!isiOS) {
                navHeight = 54;
            } else {
                navHeight = 50;
            }
            app.globalData.height = statusHeight + navHeight;
            that.setData({
                status: statusHeight,
                navHeight: navHeight
            })
        },
        setStyle: function() {
            var that  = this
                , containerStyle
                , textStyle
                , iconStyle
            containerStyle = [
                'background:' + that.data.background
                ].join(';');
            textStyle = [
                'color:' + that.data.color,
                'font-size:' + that.data.fontSize + 'px'
            ].join(';');
            iconStyle = [
                'width: ' + that.data.iconWidth + 'px',
                'height: ' + that.data.iconHeight + 'px'
            ].join(';');
            that.setData({
                containerStyle: containerStyle,
                textStyle: textStyle,
                iconStyle: iconStyle,
            })
        },
        // 返回事件
        back: function(e){
          let pages = getCurrentPages();
          console.log(this.data.agreement);
          console.log(this.data.tomine);
          if (this.data.agreement == 10){
            wx.navigateBack({
              delta: 1
            })
            return false
          }
          if (this.data.agreement == 11) {
            console.log(123);
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
              backLA:true
            })
            wx.navigateBack({
              delta: 1
            })
            return false
          }
          if (this.data.delta){
            let prevPage = pages[pages.length - 3];
            prevPage.setData({
              delID1:this.data.delID1
            })
          }else{
            if (!this.data.tomine){
              let prevPage = pages[pages.length - 2];
              // prevPage.setData({
              //   newsNum:0,
              //   money:this.data.money,
              //   headimg: app.globalData.userInfo.userinfo.image,
              //   name: app.globalData.userInfo.userinfo.name
              // })
            }           
          }         
          if (this.data.delta){
            wx.navigateBack({
              delta: this.data.delta
            })
          }else{
            if (this.data.tomine){
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            }else{
              wx.navigateBack({
                delta: 1
              })
            }          
          }         
        }
    }
})
