//index.js
//获取应用实例
const app = getApp()
const Top_distance = 1;
Page({
  data: {
    tab:['精选','全部商品','活动'],
    active:0,
    indicatorDots: true,
    vertical: false,
    autoplay:true,
    interval: 3000,
    duration: 500,
    swipers:[],
    products:[],
    categories:[],
    url:app.urlServer,
    height:'',
    
    goodslist0:[],
    goodslist1:[],
    goodslist2:[],
    goodslist3:[],
    goodslist4:[],
    goodslist5:[],
    orderBy: '', // 排序规则
    windowHeight:400,  //窗口的高度
    page:1,
    flag:true,
    triggered:false
  },
  
  onLoad: function () {
    this.getSwiper();
    this.getProducts();
    this.getTitles();
    this.getChange();

    this.search();
  },
  getChange:function(e){
    if(e){
      this.setData({
        active:e.currentTarget.dataset.index
      })
    }
  },
  // 设置轮播容器的高度
  setContainerHeight:function(e){
    // 图片的原始宽度
    var imgWidth = e.detail.width;
    // 图片的原始高度
    var imgHeight = e.detail.imgHeight;
    // 同步获取设备宽度
    var sysInfo = wx.getSystemInfoSync();
    // 获取屏幕的宽度
    var screenWidth = sysInfo.screenWidth;
    // 获取屏幕和原图的比例
    var scale = screenWidth / imgWidth;
    // 设置容器的高度
    this.setData({
      height: imgHeight * scale
    })
  },
  tabClick:function(e){
    // 本地存储_categoryId
    wx.setStorageSync("_categoryId",e.currentTarget.dataset.id)
    // Tab页面跳转  navigatorTo()   tabbar频道跳转wx.switchTab
    wx.switchTab({
      url:'/pages/category/category', 
    })
  },
  getTitles(){  
    // 分类标题接口：http://app.yiqigoumall.com/cats
    wx.showLoading({   //显示加载loadding
      title:'加载中',       
    })
    var that = this;
    wx.request({
      url:app.urlServer +'cats',
      header: {
        'content-type':'application/json' //默认值
      },
      success(res){
        wx.hideLoading() //隐藏
        let categories = res.data.data;
        for(var i=0; i<categories.length; i++){
          // 注意小程序不能解析 windows 系统的 \路径，所以要替换
          // .replace(/\\/g,'/')
          categories[i].cate_img = categories[i].cate_img.replace(/\\/g,'/').split(',')[0];
        }
        that.setData({
          categories:categories,
        })
        let titles = res.data.data;
        that.getGoodsList0(titles[0]._id);
        that.getGoodsList1(titles[1]._id);
        that.getGoodsList2(titles[2]._id);
        that.getGoodsList3(titles[3]._id);
        that.getGoodsList4(titles[4]._id);
        that.getGoodsList5(titles[5]._id);
      }
    })
  },
  getSwiper(){
    // http://app.yiqigoumall.com/index/carousels
    // 小程序接口调用  ajax
    // wx.request 实现接口调用
    var that = this
    wx.request({
      url:app.urlServer+'index/carousels', 
      header: {
        'content-type': 'application/json'
      },
      success (res) {
       that.setData({
         swipers:res.data.data,
       })
      }
    })
  },
  getProducts(){
    wx.showLoading({  // 显示加载loadding
      title: '加载中',
    })
    this.setData({
      flag:false  //当触发接口调用时 锁上
    })
    // get 传值:推荐商品接口: http://app.yiqigoumall.com/index/items/is_best
    var that =this;
    wx.request({
      url: app.urlServer+'index/items/is_best',
      data:{  // 2. 传递当前页
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading() // 隐藏
        //当拿到的数据<6条时，不可再分页, 为最后一页
        if (res.data.data.length<6){
          var f=false;
        }else{
          var f=true;
        }
        var products = res.data.data;
  
        for(var i = 0; i<products.length;i++)
        // 注意小程序不能解析 windows系统的\路径，所以要替换
        for(var i=0;i<products.length;i++){
          products[i].goods_img = products[i].goods_img.replace(/\\/g,'/'); 
      }
        // 3. 将分页的数据拼接起来 并且 page 加 1(++that.data.page;)
        // concat用来拼接最新获得的6条数据
        var myproducts = that.data.products.concat(res.data.data)
        var page = ++that.data.page;
        
        that.setData({
          // 更新products , page页会变，要传新的值过去
          products:myproducts, 
          page:page,
          flag:f
        })
        let arr = []
        that.data.products.forEach((item)=>{
          arr.push(item.goods_img.split(',')[0])
        })
        myproducts.forEach((curr,index)=>{
          curr.goods_cover=arr[index].replace('[','').split('"')[1]
        })
        that.setData({
          products:myproducts,
        })
      }
    }) 
  },
  
  goProductDetail(e){
    if(e){
      var id= e.currentTarget.dataset.id
    wx.navigateTo({
      url:'../productDetail/productDetail?id='+id,
    })
    }
 },



 //  分类商品的调用
 getGoodsList0(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist0 = that.data.goodslist0;
      
      for(var i=0;i<2;i++){
          goodslist0.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist0:goodslist0
        })
    }
  })  
},
getGoodsList1(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist1 = that.data.goodslist1;
      for(var i=0;i<2;i++){
          goodslist1.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist1:goodslist1
        })
    }
  })  
},
getGoodsList2(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist2 = that.data.goodslist2;
      for(var i=0;i<2;i++){
          goodslist2.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist2:goodslist2
        })
    }
  })  
},
getGoodsList3(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist3 = that.data.goodslist3;
      for(var i=0;i<2;i++){
          goodslist3.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist3:goodslist3
        })
    }
  })  
},
getGoodsList4(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist4 = that.data.goodslist4;
      for(var i=0;i<2;i++){
          goodslist4.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist4:goodslist4
        })
    }
  })  
},
getGoodsList5(id){
  //通过分类编号查找对应的商品  http://app.yiqigoumall.com/items/searchByCat?catId=5dca0a8a9078a521a0f3e263
  wx.showLoading({
    title: '加载中',
  })
  var that =this;
  wx.request({
    url: app.urlServer +'items/searchByCat?catId='+ id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      wx.hideLoading()
      let categoryGoodsList = res.data.data;
      let goodslist5 = that.data.goodslist5;
      for(var i=0;i<2;i++){
          goodslist5.push(categoryGoodsList[i]);
      }
      that.setData({
          goodslist5:goodslist5
        })
    }
  })  
},

run(e){
  // e 事件对象中的detail 接收子组件传递过来的变量数据
  console.log(e.detail); //**重要
},

// 商品部分

loadMore(){
  // 判断触底,调用下一页的数据   
  if(this.data.flag){  //flag 为true时可下拉
    this.getProducts();
  }
},
onPulling(e) {
  if(this.data.page<=2){
     return;
  }else{
    this.setData({
      page:1,
      products:[]
    })
    this.getProducts();
  }
},
onRefresh() {
  if (this._freshing) return
  this._freshing = true
  setTimeout(() => {
    this.setData({
      triggered: false,
    })
    this._freshing = false
  }, 1000)
},
onPullDownRefresh(){
  //  onPullDownRefresh 与 srcoll-view 是冲突的
  console.log('下拉刷新')
},
  // 获取滚动条当前位置
  onPageScroll: function(e) {
    let isTop = e.scrollTop > 100;
    this.setData({
      floorstatus: isTop ? true : false
    });
  },

  //回到顶部
  goTop: function(e) { // 一键回到顶部
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
filter(e){
  // orderBy: is_new 最新商品,click_count 销量, shop_price 价格
  // if(e.currentTarget){
  //   this.setData({
  //     orderBy: e.currentTarget.dataset.val
  //   })
  // }
  this.search()
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
        that.setData({
          goods: res.data.data,
        })
      } else {
        that.setData({
          goods: null,
        })
      }
    }
  })    
},

// 回到顶部
onPageScroll(options){
  //1  取出scrollTop
  const scrollTop = options.scrollTop;
  // 2 修改showBackTop 的属性
  this.setData({
    showBacktop: scrollTop>=Top_distance 
  })
},
goSearch(e){
  wx.navigateTo({
    url:'/pages/Search/Search',
  })
}
})
