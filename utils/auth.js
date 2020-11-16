async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}
async function checkToken(token){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: 'http://localhost:3000/checkToken',
      data:{
        token
      },
      header: {
      'content-type': 'application/json' // 默认值
      },
      success (res) {  
        
        if (!res.data.success) {
          return resolve(false)
        }else{
          return resolve(true)
        }
        
      }
    })
  })
}
// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await checkToken(token)
  if (!checkTokenRes) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        return resolve(res)
      },
      fail: err => {
        console.error(err)
        return resolve()
      }
    })
  })
}
async function login(page){
  const that = this
  wx.login({
    success: function (res) {
      console.log(res);
      wx.getUserInfo({
        success: function (res3) {
            var userInfo = res3
            console.log(userInfo)
            wx.request({
              url: 'http://localhost:3000/login',
              data:{
                code:res.code,
                /*
                   nickName,avatarUrl等 但传加密信息
                */
                encryptedData: userInfo.encryptedData,
                iv: userInfo.iv,
              },
              header: {
              'content-type': 'application/json' // 默认值
              },
              success (res2) {       
                if (!res2.data.success) {
                  // 登录错误
                  wx.showModal({
                    title: '无法登录',
                    content: res2.data.message,
                    showCancel: false
                  })
                  return;
                }
                wx.setStorageSync('token', res2.data.data.token)
                wx.setStorageSync('uid', res2.data.data.uid)
                wx.setStorageSync('salt',res2.data.data.salt );
                if ( page ) {
                  page.onShow() // 调用 my页面模块用onShow刷新页面
                }
              }
            })
        }
      })
    }
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}



module.exports = {
  checkHasLogined: checkHasLogined,
  getUserInfo: getUserInfo,
  login: login,
  loginOut: loginOut
}