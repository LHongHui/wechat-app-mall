// pages/category/category.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles:[],
    categoryGoodsList:[],
    categoryId:'',//myxxxxxx
    url:app.urlServer,

    products:[],
    windowHeight:400,//窗口高度
    page:1,
    flag:true,
    triggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 分类标题接口：http://app.yiqigoumall.com/cats
    this.getTitles();

    this.getProducts();
    // 1.获取屏幕高度(wx.getSystemInfo)
    var that = this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          windowHeight:res.windowHeight
        })
      }
    })
  },
  getProducts(){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      flag:false
    })
    // 推荐商品接口  http://app.yiqigoumall.com/index/items/is_best
    var that = this;
    wx.request({
      // url: 'http://app.yiqigoumall.com/index/carousels',
      url:app.urlServer+'index/items/is_best',
      data:{ // 2.传递当前页
        page:that.data.page
      },
      header:{
        'content-type':'application/json' //默认值
      },
      success(res){
        wx.hideLoading()
        if(res.data.data.length<6){
          var f = false;
        }else{
          var f = true;
        }
        // console.log(res.data.data)
        var products = res.data.data;
        for(var i=0;i<products.length;i++){
          products[i].goods_img =products[i].goods_img.replace(/\\/g,'/').split(",")[0];
        }
        console.log(that.data.page)
        // 3.将分页数据拼接 并且 page 加 1
        var myproducts = that.data.products.concat(res.data.data)
        var page = ++that.data.page;
        that.setData({
          products:myproducts,
          page:page,
          flag:f
        })
      }
    })
  },
  loadMore(){
    // bindscrolltolower="loadMore"
    // 4.判断触底，调用下一页的数据
    if(this.data.flag){
      this.getProducts();
    }
  },
  onPulling(e){
    if(this.data.page<=2){
      return
    }
    this.setData({
      page:1,
      products:[]
      
    })
    this.getProducts()
  },
  getTitles(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.urlServer +'cats', //接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data)
        wx.hideLoading() // 隐藏
        let titles = res.data.data;
        that.setData({
          titles:titles,
        })
        // that.getGoodsList();
      }
    })
  },
  goProductDetail(e){
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../productDetail/productDetail?id='+id,
    })
   },
  getGoodsList(){
    // 通过分类编号查对应的商品
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.urlServer +'items/searchByCat?catId='+ this.data.categoryId, //接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data.data)
        wx.hideLoading() // 隐藏
        let categoryGoodsList = res.data.data;
        for(var i=0;i<categoryGoodsList.length;i++){
          categoryGoodsList[i].goods_img = categoryGoodsList[i].goods_img.replace(/\\/g,'/').split(',')[0];
        }                                 
        this.setData({
          categoryGoodsList:categoryGoodsList
        })
      }
    })
  },
  toDetailsTap(e){
    console.log(e)
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。
      url: '/pages/ProductDetail/ProductDetail?id=' + e.currentTarget.dataset.id
    })
  },

  // mysearch
  goSearch(e){
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../Search/Search?id='+id,
    })
  },
  categoryDetail(e){
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/categoryDetail/categoryDetail?id='+id,
      // '../categoryDetail/categoryDetail?id='+id
    })
  }
})

//http://localhost:3000