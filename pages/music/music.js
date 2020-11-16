// pages/music/music.js
Page({

  /**
   * 页面的初始数据
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var Audio = wx.createInnerAudioContext()
    this.audio = Audio
    this.angle=0
  },
  
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          screenWidth:res.screenWidth,
          screenHeight:res.screenHeight
        })
      },
    })
  },
  changePosition(e){
    let {x, y, source} = e.detail
    if(x>this.data.screenWidth/2){
      this.setData({
        x:this.data.screenWidth,
        y
      })
    }else{
      this.setData({
        x:0,
        y
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})