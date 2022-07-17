import Api from "../../api/index";
import stroage from "../../utils/cache";
const App = getApp();

Page({
    data: {
        isMyOccupy: false, //是自己占用
        istransitionshow: false,
        my_userInfo: "",
        adminUserInfo: "",
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
        activeType: "square", // 日期背景效果
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
        userList: [], //人分类 轮播
        everyList: [], //所有人
        rankList: {}, //当月所有选中日期 数据
        todyObj: [], //当日选中人员列表
    },
    // 暂不加入
    onaddclick() {
        let {
            feedPointId
        } = this.data;
        this.setData({
            istransitionshow: false,
        });
        wx.showToast({
            title: "完成排班，自动返回",
            icon: "none",
        });
        setTimeout(() => {
            wx.redirectTo({
                url: `/pages/catdetail/catdetail?cat_id=${feedPointId}`,
            });
        }, 1000);
    },
    // 加入排班
    calendarRange() {
        let {
            my_userInfo,
            feedPointId: feedpointId,
            activeconfig,
            activeDate,
            style,
            isMyOccupy,
        } = this.data;
        let arrangeTime = activeDate.replaceAll("-", "");
        // 判断是否有人占用
        if (isMyOccupy) {
            let proper = style.find(item => item.date == activeDate);
            Api.calendarRemove({
                id: proper.calenderId,
            }).then(res => {
                wx.showToast({
                    title: `已退出${activeDate}投喂`,
                    icon: "none",
                });
                this.calendarList();
            });
            return;
        }
        Api.calendarRange({
            feedMemberId: my_userInfo.id,
            feedpointId,
            arrangeTime,
        }).then(res => {
            wx.showToast({
                title: `已加入${activeDate}投喂`,
                icon: "none",
            });
            this.calendarList();
        });
    },
    // 管理员清除当日人员
    onReverUser(event) {
        console.log(event);
        let {
            user
        } = event.currentTarget.dataset;
        let {
            todyObj
        } = this.data;
        wx.showModal({
            title: "提示",
            content: "确定移除当日投喂吗？",
            success: function (res) {
                if (res.confirm == false) {
                    return false;
                }
                Api.calendarRemove({
                    id: user.id,
                }).then(res => {
                    wx.showToast({
                        title: `已删除`,
                        icon: "none",
                    });
                    this.calendarList();
                    this.setData({
                        todyObj: todyObj.filter(item => item.id != user.id),
                    });
                });
            }
        })

    },

    /**
     * @param {*} 重置
     */

    onRever() {
        this.setData({
            istransitionshow: false,
        });
        return;
        let {
            feedPointId: feedpointId,
            activeDate,
            style
        } = this.data;
        let proper = style.find(item => item.date == activeDate);
        if (!proper) {
            wx.showToast({
                title: "请选择已排班日期",
                icon: "none",
            });
            return;
        }
        Api.calendarRemove({
            id: proper.calenderId,
        }).then(res => {
            wx.showToast({
                title: `清空${activeDate}投喂`,
                icon: "none",
            });
            this.calendarList();
        });
    },
    //   获取投喂点人员列表
    feedmemberList(feedPointId) {
        Api.feedmemberList({
            feedPointId,
        }).then(res => {
            res.ownerVo.isAdmin = true;
            let List = [res.ownerVo].concat(res.memberVos);
            let everyList = [res.ownerVo].concat(res.memberVos);
            let len = Math.ceil(List.length / 12);
            let userList = [];
            console.log(List, len);
            for (let index = 0; index < len; index++) {
                const element = List.splice(12 * index, 12);
                userList.push(element);
            }
            this.setData({
                userList,
                everyList,
                adminUserInfo: res.ownerVo,
            });
        });
    },
    // 获取当前月份的排班表
    calendarList() {
        let {
            feedPointId: feedpointId,
            year,
            month,
            activeDate
        } = this.data;
        let that = this;
        Api.calendarList({
            feedpointId,
            year,
            month,
        }).then(res => {
            console.log(Object.keys(res), "获取当前月份的排班表");
            let style = Object.keys(res).map(item => {
                return {
                    date: that.returntime(item),
                    // other: item,
                    otherColor: "#4ECA8E",
                    badgeColor: "#4ECA8E",
                    background: "rgba(59,139,242,0.1)",
                };
            });

            this.setData({
                style,
                rankList: res,
            });
            if (activeDate) {
                activeDate = activeDate.replaceAll("-", "");
                let todyObj = res[activeDate] || [];
                this.setData({
                    style,
                    rankList: res,
                    todyObj,
                });
            }
        });
    },
    //   处理时间
    returntime(time) {
        let arrtime = String(time).split("");
        return `${arrtime[0]}${arrtime[1]}${arrtime[2]}${arrtime[3]}-${arrtime[4]}${arrtime[5]}-${arrtime[6]}${arrtime[7]}`;
    },
    onLoad: function (options) {
        let {
            id
        } = options;
        let my_userInfo = stroage.getUserInfo();
        //顶部高度
        this.setData({
            windowHeight: App.globalData.windowHeight,
            feedPointId: id,
            my_userInfo,
        });
        this.feedmemberList(id);
        this.calendarList();
    },
    catchtap() {},
    /**
     * 点击下个月
     */
    nextMonth: function (event) {
        const currentYear = event.detail.currentYear;
        const currentMonth = event.detail.currentMonth;
        const prevMonth = event.detail.prevMonth;
        const prevYear = event.detail.prevYear;
        console.log("点击下个月", event);
        this.setData({
            month: currentMonth,
            year: currentYear,
        });
        this.calendarList();
    },

    /**
     * 点击上个月
     */
    prevMonth: function (event) {
        const currentYear = event.detail.currentYear;
        const currentMonth = event.detail.currentMonth;
        const prevMonth = event.detail.prevMonth;
        const prevYear = event.detail.prevYear;
        console.log("点击上个月", event);
        this.setData({
            month: currentMonth,
            year: currentYear,
        });
        this.calendarList();
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
        this.setData({
            month: currentMonth,
            year: currentYear,
        });
        this.calendarList();
    },

    dayClick: function (event) {
        let {
            id,
            date
        } = event.detail;
        let {
            my_userInfo,
            adminUserInfo,
            rankList
        } = this.data;
        //当日选中人员列表
        date = date.replaceAll("-", "");
        let todyObj = rankList[date] || [];
        this.setData({
            isMyOccupy: false,
        });
        // 先判断自己是不是管理员
        let istransitionshow = true
        if (adminUserInfo.id != my_userInfo.id) {
            // 先判断自己是不是队员
            let isMyproper = todyObj.some(item => item.createBy == my_userInfo.id);
            if (isMyproper) {
                istransitionshow = false
            } else {
                istransitionshow = true
            }
        }
        console.log(istransitionshow)
        this.setData({
            activeDate: event.detail.date,
            activeconfig: event.detail,
            istransitionshow,
            month: event.detail.month,
            year: event.detail.year,
            todyObj,
        });
    },
    setUser(e) {
        let {
            info
        } = e.currentTarget.dataset;
        console.log(info);
        let {
            activeDate,
            style,
            my_userInfo,
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
        // 判断是小于当前日期
        let toDayTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime(); //当天0点的时间戳
        //   选中的时间戳
        let activeDateTime = new Date(activeDate).getTime();
        if (toDayTime > activeDateTime) {
            wx.showToast({
                title: "不能低于当前时间",
                icon: "none",
            });
            return;
        }
        let arrangeTime = activeDate.replaceAll("-", "");
        Api.calendarRange({
            feedMemberId: info.createBy || info.id,
            feedpointId,
            arrangeTime,
        }).then(res => {
            wx.showToast({
                title: `${activeDate}设置成功`,
                icon: "none",
            });
            this.calendarList();
        });
    },

    closeAction: function () {
        this.setData({
            showAction: false,
        });
    },
});