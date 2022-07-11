// components/Tabbar/tabbar.js
import storage from "../utils/cache";

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    Zindex: 99,
    active: 0,
    color: "#ACB4C0",
    selectedColor: "#76CADD",
    selected: 0,
    list: [
      {
        pagePath: "pages/location/location",
        text: "投喂点",
        iconPath: "../images/dt.png",
        selectedIconPath: "../images/dt-a.png",
        isnavigatetominiprogram: false,
      },
      {
        pagePath: "pages/releasepage/releasepage",
        text: "",
        iconPath: "../images/catimg.png",
        selectedIconPath: "../images/catimg.png",
        isnavigatetominiprogram: false,
        is_content: true,
      },
      {
        pagePath: "pages/morepage/more",
        text: "我的",
        iconPath: "../images/cathome.png",
        selectedIconPath: "../images/cathome-a.png",
        isnavigatetominiprogram: false,
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToMiniProgram() {
      wx.navigateToMiniProgram({
        appId: "wxb894410659e6b29a",
        path: "pages/home/dashboard/index",
        envVersion: "release", // 打开正式版
        success(res) {
          // 打开成功
          console.log(res);
        },
        fail: function (err) {
          console.log(err);
        },
      });
    },
    onChange(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
    //   if (!storage.getToken()) {
    //     wx.navigateTo({
    //       url: "/pages/login/login", //能够带参数，在登陆页面接收
    //     });
    //   } else {
        var appInst = getApp();
        if(storage.getUserInfo()){
            appInst.globalData.userInfo = storage.getUserInfo();
        }

        this.setData({
          selected: data.index,
        });
        wx.switchTab({
          url: "/" + url,
        });
    //   }
    },
  },
});
