// const addressDatas = require('../../assets/js/address.js');
const addressDatas = require('../../assets/js/addr.js');

const app = getApp()
Page({
  data: {
    addressList: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '选择地址', //导航栏 中间的标题
    },
  },

  selectTap: function(e) {
    var addressId = e.currentTarget.dataset.id;
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    let that = this
        // 调用设置地址接口:http://localhost/address/setDefault
       
        wx.request({
          url: app.urlServer + 'address/setDefault',
          data:{
            userId: uid, // 用户编号
            addressId: addressId // 地址编号
          },
          header: {
           'content-type': 'application/json' // 默认值
          },
          success (res) {
     
            wx.navigateBack({})// 返回到上一页
          }
        })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function() {
  },
  onShow: function() {
      var isLogined =true; //测试
      if (isLogined) {
        this.initShippingAddress(); // 调用方法获得地址列表信息接口
      } else {
        wx.showModal({ //确认对话框
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/my"
              })
            } else {
              wx.navigateBack() // 返回前一页
            }
          }
        })
      }
    
  },
  initShippingAddress: function() {
    let that = this
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log(uid)
        // 调用获得地址接口:http://localhost/address/addressList/:userId
       
        wx.request({
          url: app.urlServer + 'address/addressList/'+uid,
          header: {
           'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log(res.data.data);
            if (res.data.success) {
              that.setData({
                addressList: res.data.data
              });
            } else{
              that.setData({
                addressList: null
              });
            }
          }
        })
  }
})