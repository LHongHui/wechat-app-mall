const app = getApp()

/*
确认订单
  1. 获得购物车中的数据
  2. 获得收货的默认地址信息，如果没添加收货地址
  3. 创建订单 生成订单号(操作三个 order,order_item,address)
  4. 清空购物车信息
  5. 去支付

*/
Page({
  data: {
    url: app.urlServer,
    totalScoreToPay: 0,
    goodsList: [],
    addressId: '',
    allGoodsPrice: 0,
    yunPrice: 8,
    allGoodsAndYunPrice: 0,
    peisongType: 'kd', // 配送方式 kd,zq 分别表示快递/到店自取
    remark: '',
    curAddressData: false, // 获得默认地址信息
    addressId: '',
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '支付页面', //导航栏 中间的标题
    },
  },
  onLoad: function(options) {
    var that = this;
    var goodsList = JSON.parse(options.list)
    that.setData({
      goodsList: goodsList
    });
  },
  onShow(){
    this.doneShow()
  },
  doneShow() {
        var that = this;
        that.setData({
          peisongType: that.data.peisongType
        });
        // 获得默认地址的信息的方法
        that.initShippingAddress()
        // 获得购物车商品的总价格
        that.setTotalPrice()
        console.log(that.data.goodsList)
  },
  remarkChange(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  goProductDetail(e){
    var id= e.currentTarget.dataset.id
     //console.log(id);
    wx.navigateTo({
      url:'../productDetail/productDetail?id='+id,
    })
 },
  createOrder: function (e) {
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    var that = this;
    var remark = this.data.remark; // 备注信息
    // 判断是否有默认地址信息
    if (this.data.peisongType == 'kd') {
      if (!that.data.curAddressData) {
        wx.showToast({
          title: '请设置收货地址',
          icon: 'none'
        })
        return;
      }
    }
    // 创建订单: http://localhost:3000/order/createOrder
    /*
       要将购买的购物车多个商品，将多商品id和多商品数量拼成字符串
       例如:   0001|3,0005|2,0009|1 
    */
    var itemStr = "";
    for (var i = 0; i < this.data.goodsList.length; i++) {
      var itemId = this.data.goodsList[i].cid;
      var itemCounts = this.data.goodsList[i].count;
      var singleItem = itemId + "|" + itemCounts + ",";
      itemStr += singleItem;
      that.delItemDone(itemId);
    }
    console.log(that.data.addressId, itemStr);
    console.log(uid)
    wx.request({
      method: 'post',
      url: app.urlServer + 'order/createOrder',
      data: {
        itemStr: itemStr, // 0001|3,0005|2,0009|1 要购买的商品数据
        userId: uid, // 用户id
        addressId: that.data.addressId, // 用户地址编号
        peisongType: that.data.peisongType,
        remark: remark
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data.data)
        if (!res.data.success) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false //不显示取消按钮
          })
          return;
        }
      }
    })
  },

  delItemDone(key) {
    // 删除当前商品购物车的接口: http://localhost:3000/items/delShop
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    var that = this;
    wx.request({
      url: app.urlServer + 'items/delShop',
      data: {
        userId: uid,
        id: key
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        wx.navigateTo({
          url: "/pages/order-list/index"
        })
      }
    });
  },

  initShippingAddress() {
    // 获得默认地址： http://localhost:3000/address/default/:userId
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    var that = this;
    wx.request({
      url: app.urlServer + 'address/default/' + uid,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data.data)
        if (res.data.data) {
          that.setData({
            curAddressData: res.data.data, //地址信息
            addressId: res.data.data._id //地址id 编号（重要）
          });
        } else {
          that.setData({
            curAddressData: false
          });
        }
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  radioChange(e) {
    this.setData({
      peisongType: e.detail.value
    })
    this.setTotalPrice();
  },
  setTotalPrice() {
    let items = this.data.goodsList;
    let totalprice = 0;
    let allGoodsAndYunPrice = 0;
    for (var i = 0; i < items.length; i++) {
      totalprice += this.data.goodsList[i].mallPrice;
    }
    if (this.data.peisongType == 'kd') {
      allGoodsAndYunPrice = totalprice + this.data.yunPrice - 10;
    } else {
      allGoodsAndYunPrice = totalprice - 10;
    }
    this.setData({
      allGoodsPrice: totalprice,
      allGoodsAndYunPrice: allGoodsAndYunPrice
    })
  }
})