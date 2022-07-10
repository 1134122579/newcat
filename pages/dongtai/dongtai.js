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
    edit_id: "",
    isedit: false,
    disabled: false,
    maxcount: 8,
    title: "",
    address: "",
    label: "",
    type: 1,
    introduction: "", //简介
    autoSize: {
      maxHeight: 200,
      minHeight: 100,
    },
    latitude: "", //经纬度
    longitude: "", //经纬度
    PzList: [],
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  // 获取个位置
  getlocation() {
    let that = this;
    App.isGetlocation((res) => {
      let { latitude, longitude } = res;
      wx.chooseLocation({
        latitude,
        longitude,
        success(chooseLocationres) {
          console.log(chooseLocationres);
          that.setData({
            latitude: chooseLocationres.latitude,
            longitude: chooseLocationres.longitude,
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
    let fileArray = file.map((item) => {
      item["isupload"] = true;
      return item;
    });
    let promiseall = [];
    fileArray.forEach((item) => {
      promiseall.push(that.uploadFilenew(item));
    });
    wx.showLoading({
      title: "上传中..",
    });
    Promise.allSettled(promiseall)
      .then((res) => {
        res = res.map((item) => {
          return { ...item.value };
        });
        console.log("全部上传成功", res, fileList);
        that.setData({
          fileList: fileList.concat(res),
        });
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },
  // 文件上传
  uploadFile(file) {
    let that = this;
    const { fileList = [] } = this.data;
    let token = storgae.getToken();
    let filearr = file.map((item) => item.url);
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
          res = JSON.parse(res.data);
          console.log(res, "上传完成需要更新");
          resolve({
            ...file,
            url: res.data[0],
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
      fileList: fileList.filter((item) => item.url != delitem.file.url),
      maxcount: fileList.length <= 0 || fileList[0].type == "image" ? 8 : 1,
    });
  },

  // 提交
  onClick() {
    let {
      fileList = [],
      isedit,
      edit_id: id,
      longitude,
      latitude,
      address,
      introduction = "",
      title = "",
    } = this.data;
    let urls = fileList.map((item) => item.url);
    if (this.checkUpQuery()) {
      wx.showToast({
        title: "添加成功，将自动返回",
        icon: "none",
        mask: true,
      });
      wx.showLoading({
        title: "发布中..",
        mask: true,
      });
      //   introduction,longitude,latitude,address,urls
      if (isedit) {
        Api.feedpointEdit({
          id,
          introduction,
          longitude,
          latitude,
          address,
          urls,
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: "修改成功，1s后将自动返回",
            icon: "none",
            mask: true,
          });
          this.setData({ buttondisabled: true });
          time = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 1000);
        });
      } else {
        Api.addDynamic({
          introduction,
          longitude,
          latitude,
          address,
          urls,
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: "添加成功，1s后将自动返回",
            icon: "none",
            mask: true,
          });
          this.setData({ buttondisabled: true });
          time = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 1000);
        });
      }
    }
  },
  // 校验上传数据
  checkUpQuery() {
    let { title, fileList, introduction, address } = this.data;
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

    if (!introduction) {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
      });
      return;
    }
    if (!address) {
      wx.showToast({
        title: "请选择地点",
        icon: "none",
      });
      return;
    }
    return true;
  },
  bindbqclick(e) {
    this.setData({
      label: e.currentTarget.dataset.item.name,
    });
  },
  // 获取投喂点详情
  getCatdetails(id) {
    App.isGetlocation((location) => {
      let { longitude, latitude } = location;
      Api.getCatdetails({
        id,
        longitude,
        latitude,
      }).then((res) => {
        console.log(res);
        let {
          introduction,
          address,
          feedPointMedias: fileList,
          latitude,
          longitude,
        } = res;
        this.setData({
          introduction,
          address,
          fileList,
          latitude,
          longitude,
        });
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options;
    console.log(options);
    if (id) {
      this.getCatdetails(id);
      this.setData({
        isedit: true,
        edit_id: id,
      });
    }
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
