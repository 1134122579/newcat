// pages/location/location.js

let App = getApp()
import Api from "../../api/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        longitude: 116.336590,
        latitude: 39.941127,
        scale: 28,
        markers: [
            // //貘科动物馆
            // {
            //     id: 0,
            //     iconPath: "../../images/location.png",
            //     latitude: 39.941127,
            //     longitude: 116.336590,
            //     width: 40, //图片显示宽度
            //     height: 40, //图片显示高度
            //     title: '猫咪投喂点',
            // },
        ]
    },
    // 获取当前坐标
    getNewLocation() {
        // 创建 map 上下文 MapContext 对象。建议使用 wx.createSelectorQuery 获取 context 对象
        // 获取地图，map要与wxml页面的id名一致。注意：不需要#符号
        // 将地图缩放值改为初始值
        App.isGetlocation(res => {
            console.log(res)
            let {
                latitude,
                longitude
            } = res
            let mpCtx = wx.createMapContext('map')
            // 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。'2.8.0' 起支持将地图中心移动到指定位置。
            Api.nearBy({
                latitude,
                longitude
            }).then(res => {
                console.log(res)
                let markers = res.map(item => {
                    return {
                        id: item.id,
                        iconPath: "../../images/location.png",
                        latitude: item.latitude,
                        longitude: item.longitude,
                        width: 40, //图片显示宽度
                        height: 40, //图片显示高度
                        title: '猫咪投喂点',
                    }
                })
                mpCtx.moveToLocation()
                this.setData({
                    latitude,
                    longitude,
                    markers,
                    scale: 14
                })
            })
        })
    },

    /**
     * 地图放大缩小事件触发
     * @param {*} e 
     */
    bindregionchange(e) {
        console.log('=bindregiοnchange=', e)
    },

    //   获取当前位置


    /**
     * 点击地图事件，有经纬度信息返回
     * @param {*} e 
     */
    bindtapMap(e) {
        console.log('=bindtapMap=', e)
    },
    bindcallouttap(e) {
        console.log('=bindcallouttap=', e)
    },
    bindanchorpointtap(e) {
        console.log('=bindanchorpointtap=', e)
    },
    onMarkerTap(e) {
        console.log('=onMarkerTap=', e)
        let {markerId}=e.detail
        wx.navigateTo({
            url: `/pages/catdetail/catdetail?cat_id=${markerId}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        App.tabbershow(this, 0);
        this.getNewLocation()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})