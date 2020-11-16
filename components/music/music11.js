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
    isPlay:false,
    animation:'',
    y:'250',
    x:'',
    screenHeight:'',
    screenWidth:''
  },
  lifetimes:{
    ready(){
      var Audio = wx.createInnerAudioContext()
      this.audio = Audio
      this.angle=0

      console.log(this.properties.pageThis)

      let that = this
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            screenWidth:res.screenWidth,
            screenHeight:res.screenHeight
          })
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    fun(){
      if(this.audio.paused){
        // console.log('播放歌曲')
        this.audio.src="https://m801.music.126.net/20200629220637/0c535fde6e052912d102abaaad4f1007/jdyyaac/020f/555e/0209/5ef9fdce73b4cf4bb2d15c4eee6edd67.m4a"
        this.audio.play()
        var animation = wx.createAnimation({
          duration:1000,
          timingFunction: "linear"
        })
        this.animation=animation
        this.setData({
          animation
        })
        this.refreshList()
      }else{
        // console.log('销毁歌曲')
        this.audio.pause()
        clearInterval(this.timeInterval)
      }
      setInterval(()=>{
        console.log(this.audio.paused)
      },1000)
    },
    refreshList() {
      this.timeInterval = setInterval(()=>{
        this.angle = this.angle+90
        this.animation.rotate(this.angle).step()
        this.setData({
          animationData: this.animation.export()
        })
      }, 1000)
    },
    changePosition(e){
      console.log(this)
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
