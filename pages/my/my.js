const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const app = getApp()
Page({
	data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxloginHidden:false,
    orderList: [],
    userMobile:'',
    // 用户订单统计数据
    count_id_no_confirm: 0,
    count_id_no_pay: 0,
    count_id_no_reputation: 0,
    count_id_no_transfer: 0,
  },
	onLoad() {
	},
  onShow() {
      const that = this
      AUTH.checkHasLogined().then(isLogined => {
        that.setData({
          wxloginHidden:!isLogined
        })
      
        if (isLogined) {
          // 订单状态信息调用方法
          that.orderStatistics();
          that.getUserApiInfo();
        }
      })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge();
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '佳音乐器',
      showCancel:false
    })
  },
  // 订单状态
  orderStatistics: function () {
    // 获得用户的订单状态： http://localhost:3000/getUserOrderStaus?userId='+token,
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
      var that = this;
      wx.request({
        url: app.urlServer + 'order/orderStatistics?userId='+uid,
        header: {
         'content-type': 'application/json' // 默认值
        },
       success (res) {
        console.log(res);
      
        if (res.data.success) {
            const {
              count_id_no_confirm,
              count_id_no_pay,
              count_id_no_reputation,
              count_id_no_transfer,
            } = res.data.data || {}
            that.setData({
              count_id_no_confirm,
              count_id_no_pay,
              count_id_no_reputation,
              count_id_no_transfer
            })
          }
        }
    })
  },
  goOrder: function (e) {
    // 到 订单列表页order-list/index 中并且将 订单状态(order_status)现在type的值传递过去
    wx.navigateTo({
      url: "/pages/order-list/index?type=" + e.currentTarget.dataset.type
    })
  },
  goLogin() {
    this.setData({
      wxloginHidden:true
    })
  },
  bindGetUserInfo(e) {
      
      AUTH.login(this);
      this.setData({
        wxloginHidden:false
      })
  },
  getUserApiInfo(){
    var that = this;
    // 获得用户详细信息接口： http://localhost:3000/getUserApiInfo;
    wx.request({
      url: 'http://localhost:3000/getUserApiInfo',
      header: {
       'content-type': 'application/json' // 默认值
      },
      data:{
        token:wx.getStorageSync('token')
      },
      success (res) {       
        if (res.data.success) {
          let _data = {}
          _data.apiUserInfoMap = res.data.data
          if (res.data.data.phone) {
            _data.userMobile = res.data.data.phone
          }
          console.log(res.data.data)
          that.setData(_data);
        }
        
      }
    })
  },
  loginOut(){
    AUTH.loginOut()
    wx.reLaunch({
      url: '/pages/my/my'
    })
  },
  cancelLogin() {
    this.setData({
      wxloginHidden: false
    })
  },
  getPhoneNumber: function(e) {
    let that = this;
    console.log(e);
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
      wx.login({
        success: function (res0) {
            wx.request({
              url: app.urlServer +'bindMobileWxa',
              data:{
                code:res0.code,
                encryptedData:  e.detail.encryptedData,
                iv: e.detail.iv,
              },
              header: {
              'content-type': 'application/json' // 默认值
              },
              success (res) {  
                if (res.data.success) {
                  wx.showToast({
                    title: '绑定成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.getUserApiInfo();
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.message,
                    showCancel: false
                  })
                }
              }
          })
        }
      })
  },

})