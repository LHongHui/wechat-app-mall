// pages/cart/cart.js
const TOOLS = require('../../utils/tools.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 60, //删除按钮宽度单位（rpx）
    totalprice: 0,
    url: app.urlServer,
    isCartEmpty: true,
    items: [],
    goodsList:[],

    selected: false,
    saveHidden:true,
    allSelect:false, // 全选状态，默认不全选
  },

  /**
   * 生命周期函数--监听页面加载
   * onLoad 页面加载一次,onShow 显示切换是重新调用
   */
  onLoad: function(options) {
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    wx.request({
      url: app.urlServer + 'items/getShop?userId=' + uid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if (res.data.success) {
          that.setData({
            items: res.data.data
          })
        } else {
          that.setData({
            items: null
          })
        }
        if (that.data.items.length) {
          that.setData({
            isCartEmpty: false
          })
        } else {
          that.setData({
            isCartEmpty: true
          })
        }

        let items = that.data.items;
        let selected = that.data.selected;
        let allSelect = that.data.allSelect;
        let num=0;
        for (let i = 0; i < items.length; i++) {
          if(items[i].check == true){
            num++;
          }
        }
        if(num==0){
          selected = false;
        }else{
          selected = true;
        }
        if(num == items.length && num != 0){
          allSelect=true
        }else{
          allSelect=false
        }
        that.setData({
          selected: selected,
          allSelect: allSelect
        })
        console.log(items,selected,allSelect)
        // 结算总价
        that.setTotalPrice();
        // 徽标数量
        TOOLS.showTabBarBadge();
      }

    })
    
  },
  onShow: function (options) {
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    wx.request({
      url: app.urlServer + 'items/getShop?userId=' + uid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if (res.data.success) {
          that.setData({
            items: res.data.data
          })
        } else {
          that.setData({
            items: null
          })
        }
        if (that.data.items.length) {
          that.setData({
            isCartEmpty: false
          })
        } else {
          that.setData({
            isCartEmpty: true
          })
        }

        let items = that.data.items;
        let selected = that.data.selected;
        let allSelect = that.data.allSelect;
        let num=0;
        for (let i = 0; i < items.length; i++) {
          if(items[i].check == true){
            num++;
          }
        }
        if(num==0){
          selected = false;
        }else{
          selected = true;
        }
        if(num == items.length && num != 0){
          allSelect=true
        }else{
          allSelect=false
        }
        that.setData({
          selected: selected,
          allSelect: allSelect
        })
        console.log(items,selected,allSelect)
        // 结算总价
        that.setTotalPrice();
        // 徽标数量
        TOOLS.showTabBarBadge();
      }

    })


    this.shippingCartInfo();
  },
  shippingCartInfo() {
    // 调用获得购物车数据接口:http://localhost/items/getShop
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    wx.request({
      url: app.urlServer + 'items/getShop?userId=' + uid,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if (res.data.success) {
          that.setData({
            items: res.data.data
          })
        } else {
          that.setData({
            items: null
          })
        }
        if (that.data.items.length) {
          that.setData({
            isCartEmpty: false
          })
        } else {
          that.setData({
            isCartEmpty: true
          })
        }
        // 结算总价
        that.setTotalPrice();
        // 徽标数量
        TOOLS.showTabBarBadge();
      }

    })
  },
  goProductDetail(e){
    var id= e.currentTarget.dataset.id
     //console.log(id);
    wx.navigateTo({
      url:'../productDetail/productDetail?id='+id,
    })
 },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  delItem(e) {
    // 删除当前商品的编号 id
    const id = e.currentTarget.dataset.key
    this.delItemDone(id)
  },
  delItemDone(key) {
    // 删除当前商品购物车的接口: http://localhost:3000/items/delShop
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
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
        // 重新渲染获得购物车接口
        that.shippingCartInfo()
      }
    });
  },
  deleteSelected:function(){
    let that = this
    let items = that.data.items;
    wx.showModal({
      content: '确定要删除选中商品吗？',
      success: (res) => {
        if (res.confirm) {
          for(let i=0;i<items.length;i++){
            if(items[i].check){
              this.delItemDone(items[i].cid);
            }
          }
          that.setData({
            selected:false
          })
        }else{
          that.setData({
            selected:true
          })
        }
      }
    })
  },

  jiaBtnTap(e) {
    // 索引index
    const index = e.currentTarget.dataset.index;
    const item = this.data.items[index];
    // 商品的编号 cid
    const id = item['cid'];
    let number = item.count + 1;
    if (number >= item.store) {
      number = item.store
    }
    // 调用修改购物车接口
    this.shippingCarInfoModifyNumber(id, number);
  },
  jianBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.items[index];
    const id = item['cid'];
    const number = item.count - 1

    if (number <= 0) {
      // 弹出删除确认:确认对话框
      wx.showModal({
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            this.delItemDone(item.cid)
          }
        }
      })
      return
    }
    this.shippingCarInfoModifyNumber(id, number);
  },
  changeCarNumber(e) {
    // 当前修改商品的id编号
    const id = e.currentTarget.dataset.id
    // 获得表单元素的value （重要重要）
    const number = e.detail.value
    this.shippingCarInfoModifyNumber(id, number);
  },
  shippingCarInfoModifyNumber(id, number) {
    // 修改购物车接口: http://localhost:3000/items/editShop
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    var data = {
      userId: uid,
      id: id, //商品编号
      count: number //商品数量
    }
    
    wx.request({
      method: 'post',
      url: app.urlServer + 'items/editShop',
      data:data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        // 重新渲染获得购物车接口
        that.shippingCartInfo()
      }
    })
  },


  shippingCarInfoModifyCheck(id, check) {
    // 修改购物车接口: http://localhost:3000/items/editShop
    const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    }
    const uid = wx.getStorageSync('uid');
    console.log('购物车uid '+uid)
    var that = this;
    var data = {
      userId: uid,
      id: id, //商品编号
      check: check //商品是否选中
    }
    
    wx.request({
      method: 'post',
      url: app.urlServer + 'items/editShopCheck',
      data:data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res) {
        // 重新渲染获得购物车接口
        that.shippingCartInfo()
      }
    })
  },

  setTotalPrice() {
    let items = this.data.items;
    let totalprice = 0;
    for (var i = 0; i < items.length; i++) {
      if(items[i].check){
        totalprice += items[i].mallPrice;
      }
    }
    this.setData({
      totalprice: totalprice
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      this.data.items[index].left = left
      this.setData({
        items: this.data.items
      })
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      this.data.items[index].left = left
      this.setData({
        items: this.data.items
      })
    }
  },

  getSaveHide:function(){
    var saveHidden = !this.data.saveHidden;
    this.setData({
      saveHidden: saveHidden
    })
  },
  selectList(e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let items = this.data.items;                    // 获取购物车列表
    const check = items[index].check;         // 获取当前商品的选中状态
    items[index].check = !check;              // 改变状态
    this.shippingCarInfoModifyCheck(items[index].cid,items[index].check);

    let num=0;
    let allSelect = this.data.allSelect;    // 是否全选状态
    for (let i = 0; i < items.length; i++) {
      if(items[i].check == true){
        num++;
      }
    }
    console.log(num);
    if(num == items.length){
      allSelect = !allSelect;
    }
    if(allSelect == true){
      if(num != items.length){
        allSelect = !allSelect;
      }
    }
    let selected = this.data.selected;
    if(num==0){
      selected = false;
    }else{
      selected = true;
    }
    this.setData({
      allSelect: allSelect,
      selected: selected,
      items: items
    });
    this.setTotalPrice();                           // 重新获取总价
    console.log(this.data.selected);
  },
  selectAll(e) {
    let allSelect = this.data.allSelect;    // 是否全选状态 
    let items = this.data.items;

    if(items.length != 0){
      allSelect = !allSelect;
    }
    for (let i = 0; i < items.length; i++) {
        items[i].check = allSelect;            // 改变所有商品状态
        this.shippingCarInfoModifyCheck(items[i].cid,items[i].check);
    }

    let selected = this.data.selected;
    let num=0;
    for (let i = 0; i < items.length; i++) {
      if(items[i].check == true){
        num++;
      }
    }
    if(num==0){
      selected = false;
    }else{
      selected = true;
    }
    
    this.setData({
      allSelect: allSelect,
      selected: selected,
      items: items
    });
    this.setTotalPrice();                                // 重新获取总价
    console.log(this.data.selected);
  },
  toPayOrder:function(){
    let that = this
    let items = that.data.items;
    let goodsList = that.data.goodsList;
    for(let i=0;i<items.length;i++){
      if(items[i].check){
        goodsList.push(items[i]);
      }
    }
    console.log(that.data.goodsList);
    var listData = JSON.stringify(that.data.goodsList)
    wx.navigateTo({
      url: '../payOrder/payOrder?list='+listData
    })
    this.setData({
      goodsList: []
    })
  }
})