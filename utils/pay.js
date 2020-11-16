/**
 * type: order 支付订单 recharge 充值 paybill 优惠买单
 * data: 扩展数据对象，用于保存参数
 */
var tools=require('./tools.js');
function wxpay(type, money, orderId, redirectUrl) {
  wx.showLoading({
    title: '加载中...',
  })
  var token = wx.getStorageSync('token');
  var uid = wx.getStorageSync('uid');
  var salt = wx.getStorageSync('salt');
  //生成签名

  var sign = tools.sign({
    token: token,
    uid: uid,
    salt: salt    //私钥
  })
  const postData = {
    token:token,
    uid:uid,
    money: money,
    sign: sign,
    orderId: orderId 
  }

  // 订单支付接口：  http://localhost:3000/doOrder
  wx.request({
      url: 'http://localhost:3000/dowxPay',
      method: "POST",
      data:postData,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);

        // "{"out_trade_no":"20180729190510492426","nonceStr":"yELNZj2UamxapWnN","timeStamp":"1532862310","package":"prepay_id = wx29190511245578c23d761a910193872964","paySign":"5fabf74ef07cbffbb76ec0ff51596b29"}"
        if (res.data.success) {
          // 发起支付
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            fail: function (aaa) {
              console.error(aaa)
              wx.showToast({
                title: '支付失败:' + aaa
              })
            },
            success: function () {
              // 提示支付成功
              wx.showToast({
                title: '支付成功'
              })
              wx.redirectTo({
                url: redirectUrl
              });
            }
          })
        } else {
          wx.showModal({
            title: '出错了',
            content: JSON.stringify(res),
            showCancel: false
          })
        }
      }
  
  })
}

module.exports = {
  wxpay: wxpay
}