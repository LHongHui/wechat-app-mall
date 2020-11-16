var md5=require('./md5.js');
// 显示购物车tabBar的Badge
function showTabBarBadge(){
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.removeTabBarBadge({
        index: 2,
      });
      return
    }
    var that = this;
    const uid = wx.getStorageSync('uid');
    // 获得购物车信息:http://localhost:3000/items/getShop?userId='+uid
    wx.request({
      url: 'http://localhost:3000/items/getShop?userId='+uid,
      header: {
       'content-type': 'application/json' // 默认值
      },
     success (res) {
      if (res.data.success) {
        console.log(res.data.totalNumber)
        if (res.data.totalNumber==0) {
          // 清除 Badge 徽标数量
          wx.removeTabBarBadge({
            index: 2,
          });
        } else {
          // 设置徽标
          wx.setTabBarBadge({
            index: 2,
            text: `${res.data.totalNumber}`
          });
        }
      }
     }    
  })
}

function sign(json) { //签名方法

    var arr = [];
    for (var i in json) {
      arr.push(i);
    }


    // arr = ['cpenid', 'did','alt']


    //如果这个参数被省略，那么元素将按照 ASCII 字符顺序进行升序排列（也就是所谓的自然顺序）
    arr = arr.sort();

    // arr = ['alt', 'cpenid','did']



    var str = '';
    for (let i = 0; i < arr.length; i++) {
      str += arr[i] + json[arr[i]]
    }


    // str = alt + alt值 + cpenid + cpenid值 + did + did值

    return md5(str);

  }

module.exports = {
  showTabBarBadge: showTabBarBadge,
  sign:sign
}