const app = getApp()
Page({
  data: {
    order:true,
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '分类详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20 , 

    delBtnWidth: 120,
    startX:0,

    listType: 1, // 1为1个商品一行，2为2个商品一行
    titles:[],
    categoryGoodsList:[],
    url:app.urlServer,

    categoryId:'',
    orderBy: '', // 排序规则
  },
  onLoad: function (options) {
    // 分类标题接口：http://app.yiqigoumall.com/cats
    console.log(options)
    this.setData({
      categoryId:options.id,
    })
    this.getGoodsList();
  },
  getGoodsList(){
    // 通过分类编号查对应的商品
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.urlServer +'items/searchByCat?catId='+ that.data.categoryId, //接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        // console.log(res.data.data)
        wx.hideLoading() // 隐藏
        let categoryGoodsList = res.data.data;
        for(var i=0;i<categoryGoodsList.length;i++){
          categoryGoodsList[i].goods_img = categoryGoodsList[i].goods_img.replace(/\\/g,'/').split(',')[0];
        }                                 
        that.setData({
          categoryGoodsList:categoryGoodsList
        })
      }
    })
  },
  paijiage(e){
    

    let ss = this.data.categoryGoodsList
    let arr=[]
    let order = this.data.order
    order = !order
    this.setData({
      order:order
    })
    if(this.data.order == true){
      arr = ss.sort(this.compare('shop_price'))
    }else{
      arr = ss.sort(this.Compare('shop_price'))
    }
    
    
    this.setData({
      categoryGoodsList:arr,
    })

    if(this.data.orderBy === e.currentTarget.dataset.val){
      return false
    }else{
      this.setData({
        orderBy: e.currentTarget.dataset.val
      })
    }
  },
  paixiaoliang(e){
    if(this.data.orderBy === e.currentTarget.dataset.val){
      return false
    }else{
      this.setData({
        orderBy: e.currentTarget.dataset.val
      })
    }

    let ss = this.data.categoryGoodsList
    let c_count1 = ss.sort(this.compare('click_count'))
    this.setData({
      categoryGoodsList:c_count1,
    })
  },

  compare(property){
    return function(a,b){
      var value1 = a[property]
      var value2 = b[property]
      return value1-value2
    }
  },
  Compare(property){
    return function(a,b){
      var value1 = a[property]
      var value2 = b[property]
      return value2-value1
    }
  },
 
  // 样式切换
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
  toDetailsTap(e){
    console.log(e)
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id
    })
  },

  filter(e){
    // orderBy: is_new 最新商品,click_count 销量, shop_price 价格
    if(this.data.orderBy === e.currentTarget.dataset.val){
      return false
    }else{
      this.setData({
        orderBy: e.currentTarget.dataset.val
      })
    }
    
  },
})
