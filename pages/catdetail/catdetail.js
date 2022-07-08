// pages/matchdetail/matchdetail.js
import Api from "../../api/index";
import { formatDate } from "../../utils/util";
import storgae from "../../utils/cache";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ismyid:'',
    user_id: "",
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
  // 查看详情
  gocatDetail(event){
    console.log(event)
    let {item}=event.currentTarget.dataset
    wx.showLoading({
      title: '加载中..',
    })
    wx.navigateTo({
      url:`/pages/catdetail/catdetail?user_id=${item.user_id}&cat_id=${item.id}`,
    })
  },
    //预览图片
    previewImage(e) {
      var index = e.target.dataset.index;
      wx.previewImage({
        current:'../../images/moer.jpg',
        uels:['/images/moer.jpg']
      })
      return
      wx.previewImage({
        current: this.data.getdata.img[index], //当前点击的图片链接
        urls: this.data.getdata.img, //图片数组
      });
    },
  // 倒计时
  oncountChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  goBaobutton() {
    let { id } = this.data.getdata;
    wx.showLoading({
      title: '加载中...',
    })
    wx.navigateTo({
      url: `/pages/matchenroll/matchenroll?match_id=${id}`,
    });
  },
  // 修改详情
  goedit() {
    let { user_id, cat_id } = this.data;
    wx.navigateTo({
      url: `/pages/addcat/addcat?cat_id=${cat_id}`,
    })
  },
  getCatdetails() {
    let { user_id, cat_id } = this.data;
    Api.getCatdetails({
      user_id,
      cat_id,
    }).then((res) => {
      console.log(res, "猫咪详情");
      let desclength=res.desc.length
      this.setData({
        getdata: res,
      });
    });
  },
  // 删除
  delCat(){
    let id =this.data.cat_id
    Api.delCat({id}).then(res=>{
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
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { user_id, cat_id } = options;
    this.setData({
      user_id,
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
      ismyid:storgae.getUserInfo().user_id
    })
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
