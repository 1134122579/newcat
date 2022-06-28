// pages/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [
        //貘科动物馆
        {
          id: 0,
          iconPath: "../../images/location.png",
          latitude: 39.941127,
          longitude:116.336590,
          width: 40,  //图片显示宽度
          height: 40,//图片显示高度
          title:'猫咪投喂点',
        },
        //犀鸟馆
        {
          id: 1,
          iconPath: "../../images/location.png",
          latitude: 39.940826,
          longitude: 116.335109,
          width: 30,  
          height: 30,
          title:'猫咪投喂点'
        },
        //火烈鸟馆
        {
          id: 2,
          iconPath: "../../images/location.png",
          latitude: 39.940578,
          longitude: 116.335977,
          width: 30,
          height: 30,
          title: '猫咪投喂点'
        },
        //鹦鹉馆
        {
          id: 3,
          iconPath: "../../images/location.png",
          latitude: 39.941573,
          longitude: 116.335544,
          width: 30,
          height: 30,
          title: '猫咪投喂点'
        }]
  },

  /**
   * 地图放大缩小事件触发
   * @param {*} e 
   */
  bindregionchange(e) {
    console.log('=bindregiοnchange=', e)
  },

  /**
   * 点击地图事件，有经纬度信息返回
   * @param {*} e 
   */
  bindtapMap(e) {
    console.log('=bindtapMap=', e)
  },
  bindcallouttap(e) {
    console.log('=bindcallouttap=', e)
  },
  bindanchorpointtap(e) {
    console.log('=bindanchorpointtap=', e)
  },
  onMarkerTap(e) {
    console.log('=onMarkerTap=', e)
    wx.navigateTo({
      url: '/pages/catdetail/catdetail?user_id=38&cat_id=180',
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