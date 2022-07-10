// pages/matchdetail/matchdetail.js
import Api from "../../api/index";
import { formatDate,formatTime } from "../../utils/util";
import storgae from "../../utils/cache";
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recordTodayList: [], //今日投喂记录
    isjoinPounp: false,
    createdUSerinfo: {}, //创建人信息
    ismyid: "",
    user_id: "",
    my_id: "",
    cat_id: "",
    detile_userid: "",
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    nullheaderImage:
      "https://img.js.design/assets/img/61b44a697eee4352133690cc.png",
    getdata: {},
    timeData: {},
  },
  group_idFunction(data) {
    let { levelList } = this.data;
    let value = "";

    levelList.forEach((item) => {
      if (item.id == data) {
        value = item.text;
      }
    });
    return value;
  },

  //预览图片
  previewImage(e) {
    var index = e.target.dataset.index;
    console.log(index)
    let imageList=this.data.getdata.feedPointMedias
    imageList=imageList.map(item=>item.url)
    console.log(imageList,imageList[index])

    wx.previewImage({
      current: imageList[index],
      urls:imageList,
    });
  },

  // 修改详情
  goedit() {
    let { cat_id } = this.data;
    wx.navigateTo({
      url: `/pages/dongtai/dongtai?cat_id=${cat_id}`,
    });
  },
  getCatdetails() {
    let { user_id, cat_id } = this.data;
    App.isGetlocation((location) => {
      let { longitude, latitude } = location;
      Api.getCatdetails({
        id: cat_id,
        longitude,
        latitude,
      }).then((res) => {
        console.log(res);
        this.setData({
          getdata: res,
        });
        this.recordToday();

      });
    });
  },
  //   获取创建人信息
  getCreatedUserinfo(id) {
    Api.getNewUserInfo({ id }).then((res) => {
      console.log("获取创建人信息", res);
      this.setData({
        createdUSerinfo: res,
      });
    });
  },
  //   导航
  gouserlocation() {
    let { latitude, longitude, address } = this.data.getdata;
    try {
      wx.openLocation({
        latitude, // 纬度，范围为-90~90，负数表示南纬
        longitude, // 经度，范围为-180~180，负数表示西经
        scale: 18, // 缩放比例
        name: "猫咪投喂点",
        address,
      });
    } catch (error) {
      wx.showToast({
        title: "请刷新后从新点击",
        icon: "none",
      });
    }
  },
  // 删除
  delCat() {
    let id = this.data.cat_id;
    Api.delCat({ id }).then((res) => {
      wx.showToast({
        title: "删除成功，1.5秒自动返回",
        icon: "none",
        mask: true,
      });
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        });
      }, 1500);
    });
  },
  nojoincat() {
    this.setData({
      isjoinPounp: false,
    });
  },
  onClose() {
    this.setData({
      isjoinPounp: false,
    });
  },
  //   加入投入点
  joincat() {
    this.setData({
      isjoinPounp: true,
    });
  },
  feedmemberJoin() {
    let { id: feedPointId } = this.data.getdata;
    Api.feedmemberJoin({ feedPointId }).then((res) => {
      wx.showToast({
        title: "加入成功",
      });
      this.nojoincat();
      this.getCatdetails();
    });
  },
  // 今日投喂记录
  recordToday() {
    let { id: feedPointId } = this.data.getdata;
    console.log("recordTodayList",feedPointId,this.data.getdata)
    Api.recordToday({ feedPointId }).then((res) => {
        res=res.map(item=>{
            item['feedTime']=formatTime(item['feedTime'])
            return item
        })
      this.setData({
        recordTodayList: res,
      });
    });
  },
  // 立即投喂
  recordfeed() {
    let { id: feedPointId } = this.data.getdata;
    App.isGetlocation((location) => {
      let { longitude, latitude } = location;
      Api.recordfeed({
        feedPointId,
        longitude,
        latitude,
      }).then((res) => {
        wx.showToast({
          title: "投喂成功！",
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { cat_id } = options;
    this.setData({
      my_id: storgae.getUserInfo().id,
      cat_id,
      detile_userid: storgae.getUserInfo().user_id,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCatdetails();
    this.setData({
      ismyid: storgae.getUserInfo().user_id,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "某某投喂点",
    };
  },
});
