const app = getApp()
Page({
  data: {
    goods:[],
    url:app.urlServer,
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的收藏', //导航栏 中间的标题
    },
  },
  onLoad: function (options) {
  },
  onShow: function () {
      let isLogined =true;
      if (isLogined) {
        this.goodsFavList()
      }
    
  },
  goodsFavList() {
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    // 查询当前用户所有收藏的商品：http://localhost:3000/items/goodsFavList
    wx.request({
      url: app.urlServer+'index/items/goodsFavList',
      data:{  // 2. 传递当前页
        userId:uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading() // 隐藏
        if (res.data.success) {
          that.setData({
            goods: res.data.data,
          })
        } else {
          that.setData({
            goods: null
          })
        }
      }
    })
  },
  removeFav(e){
    const id = e.currentTarget.dataset.id
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    wx.request({
      url: app.urlServer + 'item/unlike',
      data:{
        itemId:id,
        userId:uid
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      success (res) {
     
        if (res.data.success) {
          that.goodsFavList()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  },
})