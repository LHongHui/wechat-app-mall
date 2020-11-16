// pages/upload/upload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '上传商品', //导航栏 中间的标题
    },
    goodsCate:[],
    showCate:{},  //{}  选中的分类对象

    // 向后台发送的对象
    title:"",
    sub_title:"",
    cate_id:"",
    goods_number:"",
    shop_price:"",
    market_price:"",
    goods_size:"",
    goods_color:"",
    goods_keywords:"",
    goods_content:"",
    sort:"",
    is_new:"",
    is_hot:"",
    is_best:""
  },
  takeValue(e){
    let value = e.detail.value  //  拿取input中value的值
    let name = e.currentTarget.dataset.name 
    this.data[name]=value
    console.log(this.data)
  },
  takeGoodsCate(e){
    let {value}=e.detail
    let showCate = this.data.goodsCate[value]
    this.setData({
      showCate,
      cate_id:showCate._id
    })
    console.log(this.data.cate_id)
  },
  takeGoodsContent(e){
    let {html, text, delta} = e.detail
    this.setData({
      goods_content:html
    })
  },
  takeCheckboxValue(e){
    this.setData({
      is_best:0,
      is_hot:0,
      is_new:0
    })
    console.log(e)
    let checked =e.detail.value
    if(checked.includes("0")){
      this.setData({
        is_best:1
      })
    }
    if(checked.includes("1")){
      this.setData({
        is_hot:1
      })
    }
    if(checked.includes("2")){
      this.setData({
        is_new:1
      })
    }
    let {is_best,is_hot,is_new} = this.data
    console.log(is_best,is_hot,is_new)
  },
  formSubmit(e){
    let { title,sub_title,cate_id,goods_number,shop_price,market_price,goods_size,goods_color,goods_keywords,goods_content,sort,is_new,is_hot,is_best } = this.data

    console.log(title,sub_title,cate_id,goods_number,shop_price,market_price,goods_size,goods_color,goods_keywords,goods_content,sort,is_new,is_hot,is_best)
    
    /* wx.request({
      method:'POST',
      data:{

      },
      url: 'http://localhost:3000/admin/goods/doadd',
    }) */
    // console.log(this.data)
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeSize(e){
    console.log(e)
    let { value } = e.detail  
    console.log(value)
    this.setData({
      goods_size:value
    })
  },
  changeColor(e){
    console.log(e)
    let { value } = e.detail  
    console.log('changeColor' , value)
    this.setData({
      goods_color:value
    })
  },
  onLoad(){
    let that = this
    wx.request({
      url: app.urlServer+'cats',
      success(res){
        that.setData({
          goodsCate:res.data.data
        })
        console.log(res.data.data)
      }
    })
  }
})

// bindtap="takeCheckboxValue"
// bindtap="takeCheckboxValue"
// bindtap="takeCheckboxValue"