//app.js
App({
  onLaunch() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systeminfo = res
      },
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    keepScreenOn:false,
    systemInfo:{},
    bMapAk: "LZqv7xUal4vRKsF6GrkSuB8gmw6fefX5",
    bmapAppName:'bmap-wechat-app',
    userInfo: null
  },
  setGeocoderUrl(address){
    return `https://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${this.globalData.bMapAk}&src=${this.globalData.bmapAppName}`
  }
})