import storage from "../../utils/cache";
import Api from "../../api/index";
import{formatTime} from '../../utils/util'

// pages/dynamicpage/dynamicpage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listType: "homeblockmodel",
    isdele: true,
    catList: [],
    isStatus: 1,
    list: [],
    page: 1,
    pageSize: 20,
    ismore: false,
  },
  // onpull(){
  //   this.data.page++
  //   this.getDynamic()
  // },
  editcat(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/dongtai/dongtai?id=${id}`,
    });
  },
  catDelete(e) {
    let { id } = e.currentTarget.dataset;
    wx.showModal({
      cancelText: "取消",
      confirmText: "确认",
      showCancel: true,
      title: "是否确认删除",
      success: (result) => {
        console.log(result);
        if (!result.confirm) {
          return;
        }
        Api.feedpointDelete({ id }).then((res) => {
          wx.showToast({
            title: "删除成功",
          });
          this.setData({
            page: 1,
          });
          this.getlist();
        });
      },
      fail: (res) => {},
      complete: (res) => {},
    });
  },
  getlist() {
    let { user_id } = storage.getUserInfo();
    let { page: pageIndex, list, pageSize } = this.data;
    Api.recordMe({ pageSize, pageIndex }).then((res) => {
      this.setData({
        ismore: res.length > 0 ? false : true,
      });
      res=res.list.map(item=>{
          item['feedTime']=formatTime(item['feedTime'])
          return item
      })
      if (pageIndex == 1) {
        this.setData({
          list: res,
        });
      } else {
        this.setData({
          list: list.concat(res),
        });
      }
    });
  },
  onpull() {
    this.data.page++;
    this.getlist();
  },
  // getDynamic() {
  //   let {  user_id } = storage.getUserInfo();
  //   let { page } = this.data;
  //   Api.getDynamic({ user_id, page }).then((res) => {
  //     this.setData({
  //       catList: res,
  //     });
  //   });
  // },
  ondele(e) {
    let { id } = e.detail;
    wx.showModal({
      cancelColor: "#ccc",
      cancelText: "取消",
      confirmColor: "#ff0000",
      confirmText: "确认",
      content: "此操作将永久删除，是否继续 ？",
      showCancel: true,
      title: "操作提示",
      success: (result) => {
        console.log(result);
        let { confirm } = result;
        if (confirm) {
          Api.delDynamic({ dynamic_id: id }).then((res) => {
            this.setData({
              page: 1,
            });
            this.getlist();
            wx.showToast({
              title: "删除成功",
            });
          });
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getlist();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onReachBottom: function () {
    this.onpull();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
