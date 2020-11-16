// components/music/music.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageThis:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData:{},
    animation:'',
    y:'250',
    x:'',
    screenHeight:'',
    screenWidth:''
  },
  lifetimes:{
    ready(){
      let that = this
      let currentPageThis = this.properties.pageThis
      var Audio = wx.createInnerAudioContext()
      currentPageThis.audio = Audio
      currentPageThis.angle=0


      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            screenWidth:res.screenWidth,
            screenHeight:res.screenHeight
          })
        },
      })
    },
    detached(){
      console.log("music组件被销毁")
      this.properties.pageThis.audio.destroy()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fun(){
      if(this.properties.pageThis.audio.paused){
        // console.log('播放歌曲')
        this.properties.pageThis.audio.src="http://localhost:3000/images/111.mp3"
        this.properties.pageThis.audio.play()
        var animation = wx.createAnimation({
          duration:1000,
          timingFunction: "linear"
        })
        this.properties.pageThis.animation=animation
        this.setData({
          animation
        })
        this.refreshList()
      }else{
        // console.log('销毁歌曲')
        this.properties.pageThis.audio.pause()
        clearInterval(this.properties.pageThis.timeInterval)
      }
      setInterval(()=>{
        console.log(this.properties.pageThis.audio.paused)
      },1000)
    },
    refreshList() {
      this.properties.pageThis.timeInterval = setInterval(()=>{
        this.properties.pageThis.angle = this.properties.pageThis.angle+90
        this.properties.pageThis.animation.rotate(this.properties.pageThis.angle).step()
        this.setData({
          animationData: this.properties.pageThis.animation.export()
        })
      }, 1000)
    },
    changePosition(e){
      console.log(this.properties.pageThis)
      let {x, y, source} = e.detail
      console.log(x, y)
      this.setData({
        y
      })
      if(x>this.data.screenWidth/2){
        this.setData({
          x:this.data.screenWidth
        })
      }else{
        this.setData({
          x:0
        })
      }
    },
  },
})
