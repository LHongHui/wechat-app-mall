const app = getApp();

Page({
    data:{
      orderId:0,
      goodsList:[],
      url:app.urlServer,
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: 'order-details', //导航栏 中间的标题
      },
    },
    onLoad:function(e){
      // e.id = 478785
      const accountInfo = wx.getAccountInfoSync()
      var orderId = e.id;
      console.log(orderId);
      this.setData({
        orderId: orderId,
        appid: accountInfo.miniProgram.appId
      });
    },
    onShow : function () {
      var that = this;
    
      const token = wx.getStorageSync('token')
      if (!token) {
        return
      }

      const uid = wx.getStorageSync('uid');
      wx.request({
        // 取消订单接口 http://localhost:3000/getorderDetail
        url: app.urlServer + 'getorderDetail',
        data:{
          userId:uid,
          orderId:that.data.orderId
        },
        header: {
        'content-type': 'application/json' // 默认值
        },
        success (res) {
          console.log(res.data.data);
          if (!res.data.success) {
            wx.showModal({
              title: '错误',
              content: res.data.message,
              showCancel: false
            })
            return;
          }
          
          that.setData({
            orderDetail: res.data.data
          });
          console.log(that.data.orderDetail)
        }
      })
    },
   
    confirmBtnTap:function(e){
      let that = this;
      let orderId = this.data.orderId;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
                ///order/changeToFinished
                var that = this;
      
                const token = wx.getStorageSync('token')
                if (!token) {
                  return
                }

                const uid = wx.getStorageSync('uid');
                wx.request({
                  // 取消订单接口 http://localhost:3000/getorderDetail
                  url: app.urlServer + 'getorderDetail',
                  data:{
                    userId:uid,
                    orderId:that.data.orderId
                  },
                  header: {
                  'content-type': 'application/json' // 默认值
                  },
                  success (res) {
                    console.log(res.data.data);
                    if (res.data.success) {
                      that.onShow();                  
                    }
                  }
              })
            }
          }
      })
    }
  })