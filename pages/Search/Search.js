// pages/category/category.js
const app = getApp()
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '搜索', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: 70 , 

    listType: 1, // 1为1个商品一行，2为2个商品一行    
    name: '', // 搜索关键词
    orderBy: '', // 排序规则
    url:app.urlServer,
    historys: [] // 历史记录数据
  },
  onLoad: function (options) {
    this.search();
    // 1.获得本地存储的历史搜索数据的方法
    this.getKeywordStorage();
  },
  search(){
    var that = this;
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    // 调用通过商品名称搜索商品：http://localhost:3000/index/search
    wx.request({
      url: app.urlServer + 'index/search',
      data:{
        orderBy:this.data.orderBy,
        keyword:this.data.name,
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading()
        if (res.data.success) {
          console.log(res.data.data);
          that.setData({
            goods: res.data.data,
          })
          //2.将搜索的关键字添加到历史搜索数据的本地存储中,后面看
          if(that.data.name){
            let historys = [];
            // 2.1 先将旧的历史搜索数据拿到
            if(wx.getStorageSync('historys')){
              historys =JSON.parse(wx.getStorageSync('historys'));
            }
            if (historys.length !== 0) {
              // 2.2 过滤掉重复的搜索关键字
              historys = historys.filter(val => val !== that.data.name);
            }
            // 2.3 将最新的搜索的关键字name 添加到最前面
            historys.unshift(that.data.name);
            // 2.4 将调整好的数据historys存储到本地
            wx.setStorageSync('historys', JSON.stringify(historys));
           }
          
        } else {
          that.setData({
            goods: null,
          })
        }
      }
    })    
  },
  tolinkName(e){
    // 3. 通点击历史搜索关键字触发方法，再次更新 name关键字数据，最后调用搜索接口
    var name = e.currentTarget.dataset.name;
    this.setData({
      name:name
    })
    this.search();
  },
  changeShowType(){
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },
  bindinput(e){
    // 1. 获得输入框中的 搜索关键字
    this.setData({
      name: e.detail.value
    })
  },
  bindconfirm(e){
    this.setData({
      name: e.detail.value
    })
    // 调用搜索的接口方法
    this.search()
  },
  filter(e){
    // orderBy: is_new 最新商品,click_count 销量, shop_price 价格
    this.setData({
      orderBy: e.currentTarget.dataset.val
    })
    this.search()
  },
  getKeywordStorage() {
    //wx.setStorageSync();  wx.getStorageSync()
    var historys=[];
    if(wx.getStorageSync('historys')){
      historys =JSON.parse(wx.getStorageSync('historys'));
    }
    this.setData({
      historys:historys
    })
  },
  removeItem(e) {
    // 4. 点击一个历史搜索关键字，删除本地存储中对应的历史关键字。
    var item = e.currentTarget.dataset.item;
    // 4.1. 过滤要删除的一个历史搜索关键字，更新 historys的数据
    let historys = this.data.historys.filter(val => val !== item);
    // 4.2 将删除的关键字过滤后，重新本地存储historys
    wx.setStorageSync('historys', JSON.stringify(historys));
    this.setData({
      historys:historys
    })
  },
  clear() {
    // 5. 清空history 键的历史搜集记录的信息
    wx.removeStorage({
      key: 'historys',
    })
    this.setData({
      historys:[]
    })
  },
  toDetailsTap(e){
    console.log(e)
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id
    })
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
})
