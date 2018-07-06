// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    github: "https://github.com/Yuedecky",
    email:"yuezhiyong916@gmail.com",
    wechat:"yuezhiyong_916",
  
    bannerImgList:[
      "http://image.qfstatic.com/9999/2018/201807/20180706/F6C96C3F4FF344E3A6AC0865B758446E.png"

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  
  },

  previewImages(e){
    let index = e.currentTarget.dataset.index || 0
    let urlsArr = this.data.bannerImgList
    wx.previewImage({
      current: urls[index],
      urls: urlsArr,
      success:function(res){},
      fail:function(res){
        console.error("previewImage fail:",res)
      }
    })
  },
  initSwapper(){

    let that = this
    let systemInfo= getApp().globalData.systemInfo
    if(utils.isEmptyObject(systemInfo)){
      wx.getSystemInfo({
        success: function(res) {
          that.setSwiperHeight(res)
        }
      })
    }
  },


  setSwiperHeight(d){
    this.setData({
      swiperHeight:`${(d.windowWidth|| d.screenWidth)/375*200}px`
    })
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
  
  },
  copy(e){
    let dataset=(e.target||{}).dataset||{}
    let title = dataset.title||''
    let content =   dataset.content||''
    wx.setClipboardData({
      data: content,
      success(){
        wx.showToast({
          title: `已复制${title}`,
          duration:2000
        })
      }
    })
  }
})