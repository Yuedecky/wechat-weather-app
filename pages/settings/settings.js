// pages/settings/settings.js
let utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    setting:{},
    show:false,
    keepScreenOn:false,
    SDKVersion:'',
    enableUpdate:true,
  
  },

  switchChange(e){
    let dataset = e.currentTarget.dataset

    let switchParam = this.data.setting
    let settings = this.data.settings
    if(switchParam == 'forceUpdate'){
      if(this.data.enableUpdate){
        settings[switchParam] = (e.detail || {}).value
      }else{
        settings[switchParam]=false
        wx.showToast({
          title: '基础库版本较低，无法使用该功能',
          icon:'none',
          duration:2000
        })
      }
    }else if(switchParam == 'keepScreenOn'){
      this.setKeepSereenOn(!this.data.keepScreenOn)
      getApp().globalData.keepScreenOn = !this.data.keepScreenOn
    }else{
      settings[switchParam] = !(e.detail || {}).value
    }
    this.setData({
      settings,
    })

    wx.setStorage({
      key: 'settings',
      data: settings,
    })
  },

  defaultBackgroud(){

    this.removeBackgroud(()=>{
      wx.showToast({
        title: '恢复默认背景',
        duration:1500
      })
    })
  },

  removeBackgroud(callback){
    wx.getSavedFileList({
      success:function(res){
        let fileList = res.fileList
        let len = fileList
        if(len>0){
          for (let i =0;i<len;i++){
            (function (path) {
              wx.removeSavedFile({
                filePath: path,
                complete: function (res) {
                  if (i === len - 1) {
                    callback && callback()
                  }
                }
              })
            })(fileList[i].filePath)
          }
        }else{
          callback && callback()
        }
      },
      fail:function(res){
        wx.showToast({
          title: '出错了，请稍后再试',
          icon: 'none',
        })
      }
      
    })
  },

  customBcg(){
    let that = this
    wx.chooseImage({
      success: function(res) {
        that.removeBackgroud(() => {
          wx.saveFile({
            tempFilePath: res.tempFilePaths[0],
            success: function (res) {
              wx.navigateBack({})
            },
          })
        })
      },

      fail: function (res) {
        let errMsg = res.errMsg
        // 如果是取消操作，不提示
        if (errMsg.indexOf('cancel') === -1) {
          wx.showToast({
            title: '发生错误，请稍后再试',
            icon: 'none',
          })
        }
      },
    })
  },


  hide() {
    this.setData({
      show: false,
    })
  },
  updateInstruc() {
    this.setData({
      show: true,
    })
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  

    // 不能初始化到 data 里面！！！！
    this.setData({
      keepScreenOn: getApp().globalData.keepScreenOn,
    })
    this.ifDisableUpdate()
    this.getScreenBrightness()
    let that = this
    wx.getStorage({
      key: 'settings',
      success: function (res) {
        let setting = res.data
        that.setData({
          setting,
        })
      },
      fail: function (res) {
        that.setData({
          setting: {},
        })
      },
    })
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


  ifDisableUpdate() {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '1.9.90')
    if (version >= 0) {
      this.setData({
        SDKVersion,
        enableUpdate: true,
      })
    } else {
      this.setData({
        SDKVersion,
        enableUpdate: false,
      })
    }
  },

  getHCEState() {
    wx.showLoading({
      title: '检测中...',
    })
    wx.getHCEState({
      success: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '检测结果',
          content: '该设备支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#40a7e7',
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '检测结果',
          content: '该设备不支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#40a7e7',
        })
      },
    })
  },


  getScreenBrightness() {
    let that = this
    wx.getScreenBrightness({
      success: function (res) {
        that.setData({
          screenBrightness: Number(res.value * 100).toFixed(0),
        })
      },
      fail: function (res) {
        that.setData({
          screenBrightness: '获取失败',
        })
      },
    })
  },

  screenBrightnessChanging(e) {
    this.setScreenBrightness(e.detail.value)
  },

  setScreenBrightness(val) {
    let that = this
    wx.setScreenBrightness({
      value: val / 100,
      success: function (res) {
        that.setData({
          screenBrightness: val,
        })
      },
    })
  },

  setKeepScreenOn(b) {
    let that = this
    wx.setKeepScreenOn({
      keepScreenOn: b,
      success() {
        that.setData({
          keepscreenon: b,
        })
      },
    })
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
  
  },

  removeStorage (e) {
    let that = this
    let datatype = e.currentTarget.dataset.type
    if (datatype === 'menu') {
      wx.setStorage({
        key: 'pos',
        data: {
          top: 'auto',
          left: 'auto',
        },
        success: function (res) {
          wx.showToast({
            title: '悬浮球已复位',
          })
        },
      })
    } else if (datatype === 'setting') {
      wx.showModal({
        title: '提示',
        content: '确认要初始化设置',
        cancelText: '容朕想想',
        confirmColor: '#40a7e7',
        success(res) {
          if (res.confirm) {
            wx.removeStorage({
              key: 'setting',
              success: function (res) {
                wx.showToast({
                  title: '设置已初始化',
                })
                that.setData({
                  setting: {},
                })
              },
            })
          }
        },
      })
    } else if (datatype === 'all') {
      wx.showModal({
        title: '提示',
        content: '确认要删除',
        cancelText: '容朕想想',
        confirmColor: '#40a7e7',
        success(res) {
          if (res.confirm) {
            wx.clearStorage({
              success: function (res) {
                wx.showToast({
                  title: '数据已清除',
                })
                that.setData({
                  setting: {},
                  pos: {},
                })
              },
            })
          }
        },
      })
    }
  },

})