// const addressDatas = require('../../assets/js/address.js');
const addressDatas = require('../../assets/js/addr.js');
const app = getApp()
Page({
  data: {
    provinces: undefined,// 省份数据数组
    pIndex: 0,//选择的省下标
    cities: undefined,// 城市数据数组
    cIndex: 0,//选择的市下标
    areas: undefined,// 区县数数组
    aIndex: 0,//选择的区下标

    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '地址管理', //导航栏 中间的标题
    },
  },
  provinces(provinceId, cityId, districtId) {
      //console.log(addressData);
      let prov= addressDatas.map(res => {
        return res;
      });
      const provinces = [{
        code: 0,
        name: '请选择'
      }].concat(prov)
      let pIndex = 0
      if (provinceId) {
        pIndex = provinces.findIndex(ele => {
          return ele.code == provinceId
        })
      }
      this.setData({
        pIndex,
        provinces: provinces
      })
      if (provinceId) {
        const e = { detail: { value: pIndex}}
        this.provinceChange(e, cityId, districtId)
      }
      
  },
  provinceChange(e, cityId, districtId) {
    const index = e.detail.value
    this.setData({
      pIndex: index
    })
    const pid = this.data.provinces[index].code
    if (pid == 0) {
      this.setData({
        cities: null,
        cIndex: 0,
        areas: null,
        aIndex: 0
      })
      return
    }
    let city = addressDatas[this.data.pIndex-1].childs.map(res => {
      return res;
    });
    
      const cities = [{
        code: 0,
        name: '请选择'
      }].concat(city)
      let cIndex = 0
      if (cityId) {
        cIndex = cities.findIndex(ele => {
          return ele.code == cityId
        })
      }
      this.setData({
        cIndex,
        cities: cities
      })
      console.log(this.data.cities);
      if (cityId) {
        const e = { detail: { value: cIndex } }
        this.cityChange(e, districtId)
      }
     
  },
  cityChange(e, districtId) {
    const index = e.detail.value
    this.setData({
      cIndex: index
    })
    const pid = this.data.cities[index].code
    if (pid == 0) {
      this.setData({
        areas: null,
        aIndex: 0
      })
      return
    }
    let area = addressDatas[this.data.pIndex-1].childs[this.data.cIndex-1].childs.map(res => {
      return res;
    });
      const areas = [{
        id: 0,
        name: '请选择'
      }].concat(area)
      let aIndex = 0
      if (districtId) {
        aIndex = areas.findIndex(ele => {
          return ele.code == districtId
        })
      }
      this.setData({
        aIndex,
        areas: areas
      })
      if (districtId) {
        const e = { detail: { value: aIndex } }
        this.areaChange(e)
      }
      
  },
  areaChange(e) {
    const index = e.detail.value
    this.setData({
      aIndex: index
    })  
  },
  bindSave(e) {
    if (this.data.pIndex == 0 ) {
      wx.showToast({
        title: '请选择省份',
        icon: 'none'
      })
      return
    }
    if (this.data.cIndex == 0 ) {
      wx.showToast({
        title: '请选择城市',
        icon: 'none'
      })
      return
    }
    const linkMan = e.detail.value.linkMan;
    const address = e.detail.value.address;
    const mobile = e.detail.value.mobile;
    /* const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    } */
    const uid = wx.getStorageSync('uid');
    if (linkMan == ""){
      wx.showToast({
        title: '请填写联系人姓名',
        icon: 'none'
      })
      return
    }
    if (mobile == ""){
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return
    }
    if (address == ""){
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return
    }       
    wx.request({
      method:'post',
      url: app.urlServer + 'address/createOrUpdate?addressId='+this.data.id,
      data:{
        userId: uid,
        receiver: linkMan,
        mobile: mobile,
        province: this.data.provinces[this.data.pIndex].code,
        city: this.data.cities[this.data.cIndex].code,
        district:this.data.areas[this.data.aIndex].code,
        descAddress: address
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success (res) {
        if (!res.data.success) {
          // 登录错误 
          wx.hideLoading();
          wx.showToast({
            title:res.data.msg,
            icon: 'none'
          })
          return;
        } else {
          wx.navigateBack()
        }
      }
    })
    
  },
onLoad(e) {
    var that = this;
    /* const token = wx.getStorageSync('token')
    console.log('购物车token '+token)
    if (!token) {
      return
    } */
    const uid = wx.getStorageSync('uid');
    if (e.id) { // 修改初始化数据库数据
      // 获得要修改的旧信息值接口: http://localhost:3000/address/fetch
      wx.request({
        url: app.urlServer + 'address/fetch',
        data:{
          userId: uid, // 用户编号
          addressId: e.id// 地址编号
        },
        header: {
         'content-type': 'application/json' // 默认值
        },
        success (res) {
          if (res.data.success) {
           
            that.provinces(res.data.data.province, res.data.data.city, res.data.data.district)
            const addressData = {}
            addressData.name = res.data.data.name
            addressData.phone = res.data.data.phone
            addressData.addressInfo = res.data.data.addressInfo
            addressData._id = res.data.data._id
            that.setData({
              id:e.id,
              addressData
            });
          } else {
            wx.showModal({
              title: '错误',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
          
        }
      })
    } else {
      this.provinces()
    }
  },
  deleteAddress: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          const token = wx.getStorageSync('token')
          if (!token) {
            return
          }
          const uid = wx.getStorageSync('uid');
          var that = this;

            // 调用删除地址接口:http://localhost/address/delete
            wx.request({
              url: app.urlServer + 'address/delete/'+id,
              data:{
                userId:uid,
              },
              header: {
              'content-type': 'application/json' // 默认值
              },
              success (res) {
                wx.navigateBack({})// 返回到上一页
              }
            })
         
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx() {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        const provinceName = res.provinceName;
        const cityName = res.cityName;
        const diatrictName = res.countyName;
        // 读取省
        const pIndex = that.data.provinces.findIndex(ele => {
          return ele.name == provinceName
        })
        if (pIndex != -1) {
          const e = {
            detail: {
              value: pIndex
            }
          }
          that.provinceChange(e, 0, 0).then(() => {
            // 读取市
            const cIndex = that.data.cities.findIndex(ele => {
              return ele.name == cityName
            })
            if (cIndex != -1) {
              const e = {
                detail: {
                  value: cIndex
                }
              }
              that.cityChange(e, 0).then(() => {
                // 读取区县
                const aIndex = that.data.areas.findIndex(ele => {
                  return ele.name == diatrictName
                })
                if (aIndex != -1) {
                  const e = {
                    detail: {
                      value: aIndex
                    }
                  }
                  that.areaChange(e)
                }
              })
            }
          })
        }
      }
    })
  },
})
