// app.js
import Api from "./api/index";
import storage from "./utils/cache";
import {
    Storage
} from "./utils/storage";
const $Storage = new Storage();

App({
    $Storage: $Storage,
    getStorage: $Storage.get,
    setStorage: $Storage.set,
    rmStorage: $Storage.rm,

    // 设置自定义下标 id
    tabbershow($this, selected) {
        if (typeof $this.getTabBar === "function" && $this.getTabBar()) {
            $this.getTabBar().setData({
                selected,
            });
        }
    },
    // 获取定位权限
    isGetlocation(cb) {
        var that = this;
        console.log(new Date().getTime())
        let locationTime = this.globalData.locationTime + 30000
        let newTime = new Date().getTime()
        let longitude = this.globalData.longitude
        let latitude = this.globalData.latitude
        console.log(newTime,locationTime,"时间比较")
        if (newTime <= locationTime) {
            cb({
                longitude,
                latitude
            })
            return
        }
        wx.getLocation({
            isHighAccuracy: true, // 开启地图精准定位
            type: 'gcj02', // 地图类型写这个
            success(res) {
                console.log(res);
                that.globalData.locationTime = new Date().getTime()
                that.globalData.longitude = res.longitude
                that.globalData.latitude = res.latitude
                cb(res);
            },
            fail() {
                wx.getSetting({
                    success(res) {
                        console.log(res);
                        //这里判断是否有地位权限
                        if (!res.authSetting["scope.userLocation"]) {
                            wx.showModal({
                                title: "提示",
                                content: "请求获取位置权限",
                                success: function (res) {
                                    if (res.confirm == false) {
                                        return false;
                                    }
                                    wx.openSetting({
                                        success(res) {
                                            //如果再次拒绝则返回页面并提示
                                            if (!res.authSetting["scope.userLocation"]) {
                                                wx.showToast({
                                                    title: "此功能需获取位置信息，请重新设置",
                                                    duration: 3000,
                                                    icon: "none",
                                                });
                                            }
                                            // else {
                                            //   //允许授权，调用地图
                                            //   cb();
                                            // }
                                        },
                                    });
                                },
                            });
                        } else {
                            //如果有定位权限，调用地图
                            wx.showModal({
                                title: "您手机定位功能没有开启",
                                content: "请在系统设置中打开定位服务",
                                success() {
                                    // 跳到首页
                                },
                            });
                        }
                    },
                });
            },
        });
    },
    // 获取用户信息
    getUserinfoFn() {
        if (!storage.getToken) {
            wx.navigateTo({
                url: '/pages/login/login',
            })
            return
        }
        let {
            id
        } = storage.getUserInfo()
        Api.getNewUserInfo({
            id
        }).then((res) => {
            this.globalData.userInfo = res;
            storage.setUserInfo(res);
        });
    },
    // 校验token是否过期
    isTimetoken() {
        let that = this;
        storage.getToken((token) => {
            Api.ckeckToken({
                token,
            }).then((res) => {
                console.log("isTimetoken", res);
                that.globalData.is_login = !res.code;
            });
        });
    },
    onLaunch() {
        // 展示本地存储能力
        let that = this;
        const logs = wx.getStorageSync("logs") || [];
        logs.unshift(Date.now());
        wx.setStorageSync("logs", logs);
        if (storage.getUserInfo()) {
            this.globalData.userInfo = storage.getUserInfo();
        }
        try {
            that.isTimetoken();
        } catch (error) {}

     
        // 热更新
        if (wx.canIUse("getUpdateManager")) {
            const updateManager = wx.getUpdateManager();
            //检查是否有新版本
            updateManager.onCheckForUpdate(function (res) {
                // 如果有新版本
                if (res.hasUpdate) {
                    // 手机支持热更新时
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: "更新提示",
                            content: "新版本已经准备好，是否重启应用？",
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate();
                                }
                            },
                        });
                    });
                    // 手机不支持热更新时
                    updateManager.onUpdateFailed(function () {
                        wx.showModal({
                            title: "已经有新版本了哟~",
                            content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
                        });
                    });
                }
            });
        } else {}
    },
    onShow() {
        // 获取小程序顶部参数
        try {
            let menuButtonObject = wx.getMenuButtonBoundingClientRect();
            console.log("获取自定义顶部高度相关参数", menuButtonObject);
            if (menuButtonObject.width == 0) {
                menuButtonObject = {
                    bottom: 80,
                    height: 32,
                    left: 281,
                    right: 368,
                    top: 48,
                    width: 87,
                }
            }
            let res = wx.getSystemInfoSync();
            let statusBarHeight = res.statusBarHeight,
                navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
                // navHeight =
                //   statusBarHeight +
                //   menuButtonObject.height +
                //   (menuButtonObject.top - statusBarHeight) * 2; //导航高度
                navHeight =
                Number(menuButtonObject.top) + Number(menuButtonObject.height) + 4;
            this.globalData.menuButtonObject = menuButtonObject;
            this.globalData.navHeight = navHeight;
            this.globalData.navTop = navTop;
            this.globalData.windowHeight = res.windowHeight;
            console.log(
                "获取自定义顶部高度相关参数====",
                navHeight,
                statusBarHeight,
                navTop
            );
        } catch (err) {
            console.error("获取小程序顶部参数", err);
        }
        this.globalData.statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    },
    globalData: {
        locationTime: 0,
        longitude: 116.336590,
        latitude: 39.941127,
        menuButtonObject: {},
        is_location: false,
        is_login: true,
        baseUrl: "http://106.14.159.176:8080",
        userInfo: null,
        statusBarHeight: null,
        redBg: "#ff0000",
        navHeight: 0,
        navTop: 0,
        windowHeight: 0,
    },
});