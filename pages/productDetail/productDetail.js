// pages/ProductDetail/ProductDetail.js
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    that:{},
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '产品详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height1: app.globalData.height * 2 + 20,

    faved:false, // 是否收藏的布尔值
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    circular:true,
    swipers:[],
    productOne:[],
    productId:'',
    url:app.urlServer,

    height:'',

    hideFuwuPopup:true, //服务弹层布尔值

    hideShopPopup:true, // 弹层布尔值
    buyNumber: 0,  // 购买数量
    buyNumMin:0,
    buyNumMax:10,
    shopNum: 0,  // 提示徽标的数量
  },
  //设置轮播容器的高度
  setContainerHeight:function(e){
    //图片的原始宽度
    var imgWidth = e.detail.width;
    //图片的原始高度
    var imgHeight = e.detail.height;
    //同步获取设备宽度
    var sysInfo = wx.getSystemInfoSync();
    // console.1og("sysInfo:",sysInfo);
    //获取屏幕的宽度
    var screenWidth = sysInfo.screenWidth;
    //获取屏幕和原图的比例
    var scale =screenWidth/imgWidth;
    //设置容器的高度
    this. setData({
      height:imgHeight*scale
    })
    //console.log(this.data.height);
  },
 
  onLoad: function (options) {
    this.setData({
      that:this
    })
    console.log('onload')
    // 接收 index首页中推荐商品中传递过来的商品 id编号
    console.log(options)
    this.setData({
      productId:options.id
    })
    this.getProductOne();
    this.shippingCartInfo(); // 弹层购物车销徽标
  },
  onShow(){
    let isLogined = true;
    if (isLogined) {
      this.goodsFavCheck() // 判断是否用户收藏了商品
    }
  },
  shippingCartInfo(){
    // 调用获得购物车数据接口:http://localhost/items/getShop
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid')
    var that = this;
    wx.request({
      url: app.urlServer + 'items/getShop?userId='+uid,
      header: {
       'content-type': 'application/json' // 默认值
      },
     success (res) {
      
        if (res.data.success) {
          that.setData({
            shopNum: res.data.totalNumber
          })
        }
      }
    })
  },

  getProductOne(){
    var that = this
    wx.request({ //调接口
      //调用一个商品的接口:http://app.yiqigoumall.com/items/searchById?itemId=5edcf667c998b405d645d61e
      url: app.urlServer + 'items/searchById?itemId='+that.data.productId,
      header:{
        'content-type':'application/json' //默认值
      },
      success(res){
        console.log(1111)
        console.log(res.data.data)
        var productOne = res.data.data
        var swipers = JSON.parse(productOne.goods_img);
        var article = productOne.goods_content;
        productOne.goods_color = JSON.parse(productOne.goods_color);
        that.setData({
          buyNumMax:res.data.data.goods_number,
          buyNumber:(res.data.data.goods_number>0)?1:0
        })
    WxParse.wxParse('article','html',article,that);
        swipers.pop();
        that.setData({
          productOne:productOne,
          swipers:swipers
        })
        console.log(productOne,swipers);
      }
    })
  },

  // 服务弹层开始
  taichufuwu(){
    this.bindfuwuTap()
  },
  bindfuwuTap(){
    this.setData({
      hideFuwuPopup:false
    })
  },
  closefuwuTap(){
    this.bindclosefuwuTap()
  },
  bindclosefuwuTap(){
    this.setData({
      hideFuwuPopup:true
    })
  },
// 服务弹层结束

  addShopCar(){
    this.bindGuiGeTap()
  },
  // 加入购物车 弹出框显示
  bindGuiGeTap(){
    this.setData({
      hideShopPopup:false
    })
  },
  //  加入购物车 弹出框隐藏
  closePopupTap:function(){
    this.setData({
      hideShopPopup:true
    })
  },
  numjianTap:function(){
    if(this.data.buyNumber>this.data.buyNumMin){
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber:currentNum
      })
    }
  },
  numjiaTap:function(){
    if(this.data.buyNumber<this.data.buyNumMax){
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber:currentNum
      })
    }
  },

  /*加入购物车 */
  addShopCarDo(){
    // 判断数量是否合理
    if (this.data.buyNumber < 1) {
      wx.showToast({
        title: '请选择购买数量',
        icon: 'none'
      })
      return
    }
    // const token = '1100' //模拟用户
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.showModal({
        title: '请登录',
        success(res){
          if(res.confirm){
            wx.reLaunch({
              url:'/pages/my/my'
            })
          }else{
            return
          }
        }
      })
    }
    const uid = wx.getStorageSync('uid')
    //post表单添加或修改: http://localhost:3000/items/addShop  添加到购物车接口
    var that = this;
    wx.request({
      method:'post',
      url: app.urlServer + 'items/addShop',
      data:{
        userId:uid,
        id:that.data.productOne._id,
        count:that.data.buyNumber
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success (res) {
        that.closePopupTap(); // 关闭弹层
        that.shippingCartInfo()
      }
    })
  },
  goShopCar: function() {
    wx.reLaunch({
      url: "/pages/cart/cart"
    });
  }, 
  goodsFavCheck(){
    // var token = '1100';
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid')
    var that = this;
     // 检查是否收藏:http://localhost:3000/item/userIsLikeItem
     wx.request({
      url: app.urlServer + 'item/userIsLikeItem',
      data:{
        itemId:this.data.productId,
        userId:uid
      },
      header: {
        'content-type': 'application/json' // 默认值
       },
      success(res){
        if(res.data.success){
          that.setData({
            faved:true
          })
        } else {
          that.setData({
            faved: false
          })
        }
      }
     })
  },
  addFav(){
    var isLogined = true;
    if (isLogined) {
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.showModal({
          title: '请登录',
          success(res){
            if(res.confirm){
              wx.reLaunch({
                url:'/pages/my/my'
              })
            }else{
              return
            }
          }
        })
      }
      const uid = wx.getStorageSync('uid')
      var that =this;
      if (this.data.faved) {
        // 取消收藏
        //取消收藏接口:http://localhost:3000/item/unlike
        wx.request({
          url: app.urlServer + 'item/unlike',
          data:{
            itemId:this.data.productId,
            userId:uid
          },
          header: {
          'content-type': 'application/json' // 默认值
          },
          success (res) {
            that.goodsFavCheck() // 重新调用 判断是否收藏的方法
          }
        })
      } else {
        // 加入收藏
        //添加收藏接口:http://localhost:3000/item/like
        wx.request({
          url: app.urlServer + 'item/like',
          data:{
            itemId:this.data.productId,
            userId:uid
          },
          header: {
          'content-type': 'application/json' // 默认值
          },
          success (res) {
          that.goodsFavCheck() // 重新调用 判断是否收藏的方法
          }
        })
      }
    }
},

 // 获取滚动条当前位置
 onPageScroll: function (e) {
  console.log(e)
  if (e.scrollTop > 100) {
    this.setData({
      floorstatus: true
    });
  } else {
    this.setData({
      floorstatus: false
    });
  }
},

//回到顶部
goTop: function (e) {  // 一键回到顶部
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
},
 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
      return { 
         title: '佳音乐器',
         path: 'pages/index/index?id=123',  // 路径，传递参数到指定页面。
         imageUrl:'../../assets/share/share_fengmian.jpg', // 分享的封面图
         success: function (res) {
           // 转发成功
           console.log("转发成功:" + JSON.stringify(res));
         },
         fail: function (res) {
           // 转发失败
           console.log("转发失败:" + JSON.stringify(res));
         }
      }
  }
})