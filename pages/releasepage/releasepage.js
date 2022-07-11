// pages/releasepage/releasepage.js
let App = getApp()
import storage from '../../utils/cache'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goaddcat() {
    wx.showLoading({
      title: '进入中..',
    })
    storage.removeInfo('CARPZ')
    wx.navigateTo({
      url: '/pages/addcat/addcat',
    })
  },
  godongtai() {
    wx.showLoading({
      title: '进入中..',
    })
    if(storage.getToken()){
        wx.navigateTo({
            url: '/pages/dongtai/dongtai',
          })
    }else{
        wx.navigateTo({
          url: '/pages/login/login',
        })
    }
  
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
    App.tabbershow(this, 1);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading({})
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


})