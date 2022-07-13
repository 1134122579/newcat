import storage from "../../utils/cache";
import Api from "../../api/index";
import {
    formatTime
} from '../../utils/util'

// pages/dynamicpage/dynamicpage.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLastPage: false, //是否最后一页
        listType: "homeblockmodel",
        isdele: true,
        catList: [],
        isStatus: 1,
        list: [],
        page: 1,
        pageSize: 20,
        ismore: false,
        total: 0,
    },
    // onpull(){
    //   this.data.page++
    //   this.getDynamic()
    // },
    editcat(e) {
        let {
            id
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/dongtai/dongtai?id=${id}`,
        });
    },

    catDelete(e) {
        let {
            id
        } = e.currentTarget.dataset;
        let that=this
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
                Api.feedpointDelete({
                    id
                }).then((res) => {
                    wx.showToast({
                        title: "删除成功",
                    });
                    that.setData({
                        page: 1,
                    });
                    that.getlist();
                });
            },
            fail: (res) => {},
            complete: (res) => {},
        });
    },
    getlist() {
        let {
            page: pageIndex,
            list,
            pageSize,
            isLastPage 
        } = this.data;
        if (isLastPage) {
            return
        }
        Api.myRecord({
            pageSize,
            pageIndex
        }).then((res) => {
            console.log(res)
            if (!res) return
            let {
                list: catList,
                total,
                isLastPage
            } = res
            this.setData({
                ismore: catList.length > 0 ? false : true,
                total,
                isLastPage
            });
            res = catList.map(item => {
                if (item.cover.indexOf('.mp4') > 0) {
                    item.cover = item.cover + '?vframe/jpg/offset/1'
                }
                item['createTime'] =item['createTime']? formatTime(item['createTime']):''
                return {
                    ...item,
                }
            })
            if (pageIndex == 1) {
                this.setData({
                    list: catList,
                });
            } else {
                this.setData({
                    list: list.concat(catList),
                });
            }
        });
    },
    onpull() {
        this.data.page++;
        this.getlist();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getlist();
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
    onReachBottom: function () {
        this.onpull();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
});