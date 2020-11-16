var _animationIndex = 0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 5000; // 动画播放一次的时长ms
Page({
  
  data: {
    animationData: {},
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
    this.animation = animation
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.startAnimationInterval()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.stopAnimationInterval()
  },

  /**
    * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    }, _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },

  /**
   * 实现image旋转动画，每次旋转 360*n度
   */
  rotateAni: function (n) {
    this.animation.rotate(360*n).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  /**
   * 停止旋转
   */
  stopAnimationInterval: function () {
    if (_animationIntervalId > 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  },
  goIndex(e){
    var id= e.currentTarget.dataset.id
     //console.log(id);
    wx.switchTab({
      url:'../index/index?id='+id,
    })
},
})