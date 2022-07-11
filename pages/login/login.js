// pages/start/index.js
import Api from "../../api/index";

import Cache from "../../utils/cache";
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile: false,
    userInfo: {},
    disabled: false,
  },
  onLoad(e) {
    var that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    // this.bindgetuserinfo()
  },
  bindgetuserinfo() {
    var that = this;
    wx.getUserInfo({
      success(res) {
        console.log(res);
        that.setData({
          userInfo: res.userInfo,
        });
      },
    });
  },
  noUser() {
    wx.switchTab({
      url: "/pages/location/location",
    });
  },
  getUserProfile(e) {
    let that = this;
    this.setData({
      disabled: true,
    });
    wx.login({
      success: res => {
        console.log(res);
        this.setData({
          code: res.code,
        });
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      lang: "zh_CN",
      success: res => {
        let { iv, encryptedData, rawData, signature } = res;
        // console.log(obj)
        wx.showLoading({
          title: "登陆中..",
        });
        Api.wx_mini_login({ code: that.data.code })
          .then(res => {
            console.log(res);
            let { sessionKey, openid } = res.data.data;
            // 获取用户信息
            Cache.setToken(res.headers.token[0]);
            that.setData({
              userInfo: res.data.data,
            });
            Cache.setUserInfo(res.data.data)
            App.globalData.userInfo = res.data.data;
            App.globalData.is_login = false;
            Api.getUserInfo({
              sessionKey,
              openId: openid,
              iv,
              encryptedData,
              signature,
            }).then(res => {
              wx.hideLoading();
              wx.switchTab({
                url: "/pages/location/location",
              });
            });
          })
          .catch(err => {
            Cache.removeToken();
          });
      },
      complete: () => {
        that.setData({
          disabled: false,
        });
      },
    });
  },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
});
