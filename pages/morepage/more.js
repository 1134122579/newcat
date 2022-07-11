var appInst = getApp();
import storage from "../../utils/cache";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        is_login: false,
        powerlist: ["user"],
        navHeight: appInst.globalData.navHeight,
        userInfo: {},
        list: [{
                title: "我的发布投喂点",
                icon: "maoliangpen",
                to: "../../pages/dynamicpage/dynamicpage",
                linktype: "navigateTo",
                value: "",
                isborder: true,
                marginTop: "",
                is_power: "admin",
                isLink: false,
                isbutton: false,
                isshare: false,
            },
            {
                title: "我加入的投喂点",
                icon: "xiaohongshushoucang",
                to: "../../pages/myjoin/myjoin",
                linktype: "navigateTo",
                value: "",
                isborder: true,
                marginTop: "",
                is_power: "admin",
                isLink: false,
                isbutton: false,
                isshare: false,
            },
            {
                title: "投喂记录",
                icon: "dingdanjihe",
                to: "../../pages/mylog/mylog",
                linktype: "navigateTo",
                value: "",
                isborder: true,
                marginTop: "",
                is_power: "admin",
                isLink: false,
                isbutton: false,
                isshare: false,
            },
            // {
            //   title: "投票活动",
            //   icon: "security",
            //   to: "../../pages/vote/vote",
            //   linktype: "navigateTo",
            //   value: "",
            //   isborder: true,
            //   marginTop: "",
            //   is_power: "admin",
            //   isshare: false,
            //   isLink: false,
            //   isbutton: false,
            // },
            // {
            //   title: "证书注册",
            //   icon: "RFQ-logo",
            //   to: "../../pages/certificate/certificate",
            //   linktype: "navigateTo",
            //   value: "",
            //   isborder: true,
            //   // marginTop: "marginTop",
            //   is_power: "user",
            //   isshare: false,
            //   isLink: false,
            //   isbutton: false,
            // },
            // {
            //   title: "赛事订单",
            //   icon: "dingdanjihe",
            //   to: "../../pages/MatchOrder/MatchOrder",
            //   linktype: "navigateTo",
            //   value: "",
            //   isborder: true,
            //   marginTop: "",
            //   is_power: "user",
            //   isshare: false,
            //   isLink: false,
            //   isbutton: false,
            // },
            // {
            //     title: "日历排班",
            //     icon: "dingdanjihe",
            //     to: "../../pages/calendar/calendar",
            //     linktype: "navigateTo",
            //     value: "",
            //     isborder: true,
            //     marginTop: "",
            //     is_power: "user",
            //     isshare: false,
            //     isLink: false,
            //     isbutton: false,
            // },
            {
                title: "分享推荐",
                icon: "share",
                to: "",
                linktype: "navigateTo",
                value: "",
                isborder: true,
                marginTop: "",
                is_power: "user",
                isshare: true,
                isLink: false,
                isbutton: false,
            },
            {
                title: "意见建议",
                icon: "editor",
                to: "../../pages/fankui/fankui",
                linktype: "navigateTo",
                value: "",
                isborder: true,
                marginTop: "",
                is_power: "user",
                isshare: false,
                isLink: false,
                isbutton: false,
            },
        ],
    },
    goList(e) {
        console.log(e);
        let {
            id
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/likepage/likepage?id=${id}`,
        });
    },

    gocathouse() {
        let {
            user_id
        } = storage.getUserInfo();
        wx.showLoading({
            title: "加载中..",
        });
        wx.navigateTo({
            url: "/pages/cathouse/cathouse?user_id=" + user_id,
        });
    },
    goVip() {
        wx.showLoading({
            title: "加载中..",
        });
        wx.navigateTo({
            url: "/pages/vipdetail/vipdetail",
        });
    },
    onuserInfo() {
        wx.showLoading({
            title: "加载中..",
        });
        if (storage.getToken()) {
            wx.navigateTo({
                url: "/pages/userInfo/userInfo",
            });
        } else {
            wx.navigateTo({
                url: '/pages/login/login',
            })
        }

    },
    oncarClick() {
        wx.showLoading({
            title: "加载中..",
        });
        wx.navigateTo({
            url: "/pages/cardList/cardList",
        });
    },
    oncardClick() {
        wx.showLoading({
            title: "加载中..",
        });
        wx.navigateTo({
            url: "/pages/couponpage/couponpage",
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
        if (storage.getToken()) {
            appInst.getUserinfoFn();
            this.setData({
                is_login: true
            })
        } else {
            this.setData({
                is_login: false
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        appInst.tabbershow(this, 2);
        let {
            powerlist
        } = this.data;
        this.setData({
            userInfo: appInst.globalData.userInfo,
            navHeight: appInst.globalData.navHeight,
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        wx.hideLoading({
            success: res => {},
        });
    },

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
        var shareObj = {
            title: "WCCF协会", // 默认是小程序的名称(可以写slogan等)
            path: "pages/home/home", // 默认是当前页面，必须是以‘/'开头的完整路径
            imageUrl: "",
        };
        return shareObj;
    },
});