//const wxpay = require('../../utils/pay.js')
const app = getApp()
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的订单', //导航栏 中间的标题
    },
    statusType: [ // 标题数据
      {
        status: 9999,
        label: '全部'
      },
      {
        status: 0,
        label: '待付款'
      },
      {
        status: 1,
        label: '待发货'
      },
      {
        status: 2,
        label: '待收货'
      },
      {
        status: 3,
        label: '待评价'
      },
    ],
    status: 9999, // 订单状态默认值是查看全部默认值
    hasRefund: false, // 退货
    badges: [0, 0, 0, 0, 0],
    url:app.urlServer,
    orderList:[] // tab 标题对应的order数据
  },
  statusTap: function(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      status
    });
    this.onShow();
  },
  cancelOrderTap: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          if (!token) {
            return
          }
   
          const uid = wx.getStorageSync('uid');
          wx.request({
            // 取消订单接口 http://localhost:3000/order/changeToCanceled
            url: app.urlServer + 'order/changeToCanceled',
            data:{
              userId:uid,
              orderId:orderId
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
  },
  onLoad: function(options) {
    if (options && options.type) {
      if (options.type == 99) {
        this.setData({
          hasRefund: true
        });
      } else {
        this.setData({
          status: options.type
        });
      }      
    }
  },
  getOrderStatistics() {
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    var that = this;
    wx.request({
      // 获得当前用户的订单状态 http://localhost:3000/order/orderStatistics
      url: app.urlServer + 'order/orderStatistics',
      data:{
        userId:uid,
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data);
        if (res.data.success) {
          const badges = that.data.badges;
          badges[1] = res.data.data.count_id_no_pay
          badges[2] = res.data.data.count_id_no_transfer
          badges[3] = res.data.data.count_id_no_confirm
          badges[4] = res.data.data.count_id_no_reputation
          console.log(badges)
          that.setData({
            badges
          })
        }
      }
    })
  },
  onShow: function() {
      var isLogined = true;
      if (isLogined) {
        // 调用状态标题对应的 order数据方法
        this.doneShow();
      } else {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    
  },
  doneShow() {
    // 获得订单状态
    this.getOrderStatistics();
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    
    const uid = wx.getStorageSync('uid');
    var that = this;
    var status = this.data.status; // 拿到status状态值
    if (status == 9999) { // 查看订单全部
      status = ''
    }
    wx.request({
      // 获得当前用户的订单状态的商品
      url: app.urlServer + 'order/queryAllOrders',
      data:{
        userId:uid,
        orderStatus:status
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data);
        if (res.data.success) {
          that.setData({
            orderList: res.data.data
          });
        } else {
          that.setData({
            orderList: null
          });
        }
      }
    })
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
})