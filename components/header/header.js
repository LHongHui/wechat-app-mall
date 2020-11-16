// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fa:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    msg:'son'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    play(){
      console.log('我是子组件的方法')
    }
  }
})
