import Api from "../../api/index";
import stroage from '../../utils/cache'
const App = getApp();

Page({
    data: {
        istransitionshow: false,
        my_userInfo: '',
        adminUserInfo: '',
        feedPointId: "", //日历
        year: new Date().getFullYear(), // 年份
        month: new Date().getMonth() + 1, // 月份
        day: new Date().getDate(), // 日期
        header: true, // 日历标题
        lunar: true, // 显示农历
        more: false, // 显示非当前月日期
        week_title: true, // 显示周标题
        next: true, // 显示下个月
        prev: true, // 显示上个月
        cs: 60, // 单元格大小
        title_type: "cn", // 周标题类型
        titleType: ["英文单字母", "英语简写", "中文简写"],
        title_index: 0,
        style: [],
        activeType: "", // 日期背景效果
        activeDate: "", // 当前选中的任务日期
        activeconfig: "", // 当前选中的任务
        days_addon: [],
        showAction: false,
        navH: 0,
        windowHeight: 0,
        top: 0,
        bottom: 0,
        showViewStyle: "",
        buttonStyle: "",
        userList: [],
    },
    // 暂不加入
    onaddclick() {
        this.setData({
            istransitionshow: false
        })
    },
    // 加入排班  
    calendarRange() {
        let {
            my_userInfo,
            feedPointId: feedpointId,
            activeconfig,
            activeDate
        } = this.data

        let arrangeTime = activeDate.replaceAll('-', '')

        console.log(activeconfig)
        if (activeconfig.id == my_userInfo.id) {
            Api.calendarRemove({
                id: feedpointId
            }).then(res => {
                wx.showToast({
                    title: `已退出${activeDate}投喂`,
                })
                this.calendarList()
            })
            return
        }
        if (activeconfig.id) {
            wx.showToast({
                title: '当前日期已有人',
                icon: 'none'
            })
            return
        }
        Api.calendarRange({
            feedMemberId: my_userInfo.id,
            feedpointId,
            arrangeTime
        }).then(res => {
            wx.showToast({
                title: '已加入当前日期',
            })
            this.calendarList()
        })
    },
    //   获取投喂点人员列表
    feedmemberList(feedPointId) {
        Api.feedmemberList({
            feedPointId
        }).then(res => {
            res.ownerVo.isAdmin = true;
            let List = [res.ownerVo].concat(res.memberVos);
            let len = Math.ceil(List.length / 12);
            let userList = [];
            console.log(List, len);
            for (let index = 0; index < len; index++) {
                const element = List.splice(12 * index, 12);
                userList.push(element);
            }
            this.setData({
                userList,
                adminUserInfo: res.ownerVo
            });
        });
    },
    // 获取当前月份的排班表
    calendarList() {
        let {
            feedPointId: feedpointId,
            year,
            month
        } = this.data;
        Api.calendarList({
            feedpointId,
            year,
            month,
        }).then(res => {
            if (Array.isArray(res)) {
                res = res.map(item => {
                    return {
                        date: "2022-07-11",
                        other: item.nickName,
                        otherColor: "#4ECA8E",
                        badgeColor: "#4ECA8E",
                        background: "rgba(59,139,242,0.1)",
                    };
                });
                this.setData({
                    style: res,
                });
            }
            console.log("calendarList", res);
        });
    },
    // 移除或者退出投喂点
    feedmemberLeave() {

    },
    onLoad: function (options) {
        let {
            id
        } = options;
        let my_userInfo = stroage.getUserInfo()
        //顶部高度
        this.setData({
            windowHeight: App.globalData.windowHeight,
            feedPointId: id,
            my_userInfo
        });
        this.feedmemberList(id);
        this.calendarList();
        //样式
        this.setData({
            style: [{
                    id: 5,
                    date: "2022-07-28",
                    other: "未完成",
                    color: "#fff",
                    otherColor: "#38B0DE",
                    badgeColor: "#4ECA8E",
                    background: "rgba(59,139,242,0.2)",
                },
                {
                    id: 9,
                    date: "2022-07-29",
                    color: "#fff",
                    other: "未完成",
                    otherColor: "#4ECA8E",
                    badgeColor: "#4ECA8E",
                    background: "rgba(59,139,242,0.2)",
                },
                // {
                //   date: "2022-06-23",
                //   other: "2",
                //   other: "已完成",
                //   otherColor: "#4ECA8E",
                //   badgeColor: "#4ECA8E",
                //   background: "rgba(59,139,242,0.1)",
                // },
                // {
                //   date: "2020-09-04",
                //   other: "3",
                //   other: "已完成",
                //   otherColor: "#4ECA8E",
                //   badgeColor: "#4ECA8E",
                //   background: "rgba(59,139,242,0.1)",
                // },
                // {
                //   date: "2020-10-01",
                //   other: "3",
                //   other: "已完成",
                //   otherColor: "#4ECA8E",
                //   badgeColor: "#4ECA8E",
                //   background: "rgba(59,139,242,0.1)",
                // },
            ],
        });
    },
    catchtap() {},
    // 重置
    onaddclickresveclick() {
        this.setData({});
    },
    /**
     * 点击下个月
     */
    nextMonth: function (event) {
        const currentYear = event.detail.currentYear;
        const currentMonth = event.detail.currentMonth;
        const prevMonth = event.detail.prevMonth;
        const prevYear = event.detail.prevYear;
        // wx.showModal({
        //     title: '点击下个月事件',
        //     content: '当前年份：' + currentYear + '年\n当前月份：' + currentMonth + '月\n之前年份：' + prevYear + '年\n之前月份：' + prevMonth + '月'
        // });
        this.setData({
            showAction: false,
        });
    },

    /**
     * 点击上个月
     */
    prevMonth: function (event) {
        const currentYear = event.detail.currentYear;
        const currentMonth = event.detail.currentMonth;
        const prevMonth = event.detail.prevMonth;
        const prevYear = event.detail.prevYear;
        // wx.showModal({
        //     title: '点击上个月事件',
        //     content: '当前年份：' + currentYear + '年\n当前月份：' + currentMonth + '月\n之前年份：' + prevYear + '年\n之前月份：' + prevMonth + '月'
        // });
        this.setData({
            showAction: false,
        });
    },

    /**
     * 日期变更事件
     */
    dateChange: function (event) {
        const currentYear = event.detail.currentYear;
        const currentMonth = event.detail.currentMonth;
        const prevMonth = event.detail.prevMonth;
        const prevYear = event.detail.prevYear;
        console.log("日期变更事件", event);
        // wx.showModal({
        //     title: '日期选择器事件',
        //     content: '当前年份：' + currentYear + '年\n当前月份：' + currentMonth + '月\n之前年份：' + prevYear + '年\n之前月份：' + prevMonth + '月'
        // });
        this.setData({
            showAction: false,
        });
    },

    dayClick: function (event) {
        let {
            id
        } = event.detail;
        let {
            my_userInfo
        } = this.data;

        this.setData({
            activeDate: event.detail.date,
            activeconfig: event.detail,
            istransitionshow: true
        });
        console.log("当前选中的日期", event, id, my_userInfo.i);

    },
    setUser(e) {
        console.log(e);
        let {
            info
        } = e.currentTarget.dataset;
        let {
            activeDate,
            style,     my_userInfo,
            feedPointId: feedpointId,
            activeconfig,
        } = this.data;
        if (!activeDate) {
            wx.showToast({
                title: "请先选择日期",
                icon: "none",
            });
            return;
        }
        let arrangeTime = activeDate.replaceAll('-', '')
        Api.calendarRange({
            feedMemberId: my_userInfo.id,
            feedpointId,
            arrangeTime
        }).then(res => {
            wx.showToast({
                title: '设置成功',
            })
            this.calendarList()
        })
        return
        let is_date = JSON.stringify(style).indexOf(activeDate) > -1;
        let newStyle = [];
        if (!is_date) {
            newStyle = style.concat({
                date: activeDate,
                other: info.nickName,
                otherColor: "#4ECA8E",
                badgeColor: "#4ECA8E",
                background: "rgba(59,139,242,0.1)",
            });
        } else {
            newStyle = style.map(item => {
                if (item.date == activeDate) {
                    item.other = info.nickName;
                }
                return item;
            });
        }
        this.setData({
            style: newStyle,
        });
        console.log(this.data.style);
    },

    closeAction: function () {
        this.setData({
            showAction: false,
        });
    },
});