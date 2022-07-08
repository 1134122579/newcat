// pages/enrollpage/enrollpage.js
let App = getApp();
import Api from "../../api/index";
import { getDate } from "../../utils/util";
import storgae from "../../utils/cache";
let time;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isnopush: false,
    ispush: false,
    show: false,
    maxcount: 8,
    title: "",
    address: "",
    match_id: "",
    label: "",
    type: 1,
    introduction: "", //简介
    level: "",
    levelIndex: null,
    sexIndex: null,
    voteIndex: null,
    autoSize: {
      maxHeight: 200,
      minHeight: 100,
    },
    isnoTimelocation: false,
    latitude:'',//经纬度
    longitude:'', //经纬度
    endTime: "2022-01-01",
    PzList: [],
  },
  showPopup() {
    wx.navigateTo({
      url: "/pages/CatClasspage/CatClasspage?cat_pz=" + this.data.label,
    });
    // this.setData({ show: true });
  },
  onclosebuttonPopup() {
    this.setData({
      show: false,
    });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },
  // 获取个位置
  getlocation() {
    let that = this;
    App.isGetlocation(res => {
      let { latitude, longitude } = res;
      wx.chooseLocation({
        latitude,
        longitude,
        success(chooseLocationres) {
          console.log(chooseLocationres);
          that.setData({
            latitude:chooseLocationres.latitude,
            longitude:chooseLocationres.longitude,
            address: chooseLocationres.address,
          });
        },
      });
    });
  },
  // 上传前
  beforeread(event) {
    let that = this;
    console.log(event, "上传前event");
    let { file, callback } = event.detail;
    let { duration, size, type, url } = file[0];
    let isSize = size / 1024 / 1024;
    let typenum = type == "image" ? 1 : 2;
    const { fileList = [] } = that.data;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    if (fileList.length > 0) {
      if (file[0].type == "video") {
        wx.showToast({
          title: "已上传图片无法选择视频",
          icon: "none",
        });
        return;
      }
    }
    console.log(fileList, file, type, this.data.maxcount, "视频");
    this.setData({
      maxcount: type == "image" ? 8 : 1,
      type: typenum,
    });
    console.log(file, type, this.data.maxcount, "视频");
    callback(true);
    return;
    isSize > 20 && callback(false); //判断大小
    callback(true);
    wx.showLoading({
      title: "上传中..",
    });
  },
  // 上传
  afterRead(event) {
    let that = this;
    const { file } = event.detail;
    const { fileList = [] } = that.data;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // if (fileList.length > 0) {
    //   if (fileList[0].type == "image" && file[0].type == "video") {
    //     wx.showToast({
    //       title: "已上传图片无法选择视频",
    //       icon: "none",
    //     });
    //     return;
    //   }
    // }
    // 视频裁剪
    if (file[0].type == "video") {
      wx.openVideoEditor({
        filePath: file[0].url,
        success(res) {
          // duration	number	剪辑后生成的视频文件的时长，单位毫秒（ms）
          // size	number	剪辑后生成的视频文件大小，单位字节数（byte）
          // tempFilePath	string	编辑后生成的视频文件的临时路径
          // tempThumbPath	string	编辑后生成的缩略图文件的临时路径
          let { duration, size, tempFilePath, tempThumbPath } = res;
          let isSize = size / 1024 / 1024;
          //判断大小
          if (isSize > 20) {
            wx.showToast({
              title: "视频不能超过20m",
            });
            return;
          }
          that.uploadFile({
            url: tempFilePath,
            size,
            duration,
          });
        },
        complete(res) {
          console.log(res, "complete");
        },
      });
      return;
    }
    let fileArray = file.map(item => {
      item["isupload"] = true;
      return item;
    });
    let promiseall = [];
    fileArray.forEach(item => {
      promiseall.push(that.uploadFilenew(item));
    });
    wx.showLoading({
      title: "上传中..",
    });
    Promise.allSettled(promiseall)
      .then(res => {
        that.setData({
          fileList: fileList.concat(res),
        });
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  // 文件上传
  uploadFile(file) {
    let that = this;
    const { fileList = [] } = this.data;
    let token = storgae.getToken();
    let filearr = file.map(item => item.url);
    wx.uploadFile({
      url: App.globalData.baseUrl + "/client/media/pv", // 接口地址
      filePath: filearr,
      header: {
        token,
      },
      name: "files",
      success(res) {
        console.log("上传完成", res);
        // // 上传完成需要更新 fileList
        // res = JSON.parse(res.data);
        // fileList.push({
        //     ...file,
        //     url: res.data.imgLink,
        //     isupload: false,
        // });
        // console.log(fileList, "数据");
        // that.setData({
        //     fileList,
        // });
      },
      complete() {
        wx.hideLoading();
      },
    });
  },
  uploadFilenew(file) {
    let token = storgae.getToken();
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: App.globalData.baseUrl + "/client/media/pv", // 接口地址
        filePath: file.url,
        header: {
          token,
        },
        name: "files",
        success(res) {
          // 上传完成需要更新 fileList
          console.log(res, "上传完成需要更新");
          res = JSON.parse(res.data);
          resolve({
            ...file,
            url: res.data.imgLink,
            isupload: false,
          });
        },
      });
    });
  },
  // 删除
  deleteImage(e) {
    let { fileList } = this.data;
    let delitem = e.detail;
    this.setData({
      fileList: fileList.filter(item => item.url != delitem.file.url),
      maxcount: fileList.length <= 0 || fileList[0].type == "image" ? 8 : 1,
    });
  },
  // 性别
  bindsexChange(event) {
    let { sexList } = this.data;
    this.setData({
      sexIndex: event.detail.value,
      sex: sexList[event.detail.value]["id"],
    });
  },
  // 投票期数
  bindvoteChange(event) {
    let { voteList } = this.data;
    this.setData({
      voteIndex: event.detail.value,
      match_id: voteList[event.detail.value]["id"],
    });
  },
  // 级别
  bindlevelChange(event) {
    let { levelList } = this.data;
    this.setData({
      levelIndex: event.detail.value,
      level: levelList[event.detail.value]["id"],
    });
  },
  // 生日
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value,
    });
  },
  // 提交
  onClick() {
    let {
      label = "",
      fileList = [],
      introduction = "",
      title = "",
      type = "",
      ispush,
      isnopush,
    } = this.data;
    let link_url = fileList.map(item => item.url);
    if (this.checkUpQuery()) {
      wx.showToast({
        title: "添加成功，将自动返回",
        icon: "none",
        mask: true,
      });
      return;
      if (ispush || isnopush) return;
      wx.showLoading({
        title: "发布中..",
        mask: true,
      });
      this.setData({
        ispush: true,
      });
      Api.addDynamic({
        label,
        link_url,
        introduction,
        title,
        type,
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: "添加成功，将自动返回",
          icon: "none",
          mask: true,
        });
        this.setData({
          ispush: false,
          isnopush: true,
        });
        time = setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          });
        }, 1000);
      });
    }
  },
  // 校验上传数据
  checkUpQuery() {
    let {
      level,
      sex,
      cat_name,
      color,
      title,
      fileList,
      label,
      address,
      introduction,
      birthday,
      eye_color,
      register_no,
      father_name,
      father_pz,
      father_color,
      father_register_no,
      mother_pz,
      mother_color,
      mother_name,
      mother_register_no,
      group_id,
      match_id,
    } = this.data;
    let img = fileList?.[0]?.url;
    if (!img) {
      wx.showToast({
        title: "请上传文件",
        icon: "none",
      });
      return;
    }
    if (!title.trim()) {
      wx.showToast({
        title: "请输入标题",
        icon: "none",
      });
      return;
    }
    // if (!label.trim()) {
    //   wx.showToast({
    //     title: "请选择标签",
    //     icon: "none",
    //   });
    //   return;
    // }
    if (!introduction) {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
      });
      return;
    }
    // if (!address) {
    //   wx.showToast({
    //     title: "请选择地点",
    //     icon: "none",
    //   });
    //   return;
    // }
    return true;
  },
  bindbqclick(e) {
    this.setData({
      label: e.currentTarget.dataset.item.name,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   match_id: options?.match_id
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      endTime: getDate(new Date()),
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      label: storgae.getInfo("CARPZ"),
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(time);
    storgae.removeInfo("CARPZ");
  },

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
  onShareAppMessage: function () {},
});
