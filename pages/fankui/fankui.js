import Api from "../../api/index";
// pages/fankui/fankui.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    problem: "",
    autosize: { minHeight: 100 },
  },
  problembutton() {
    let { problem } = this.data;
    if (!problem) {
      wx.showToast({
        title: "请输入问题",
      });
      return;
    }
    Api.save({ content: problem }).then((response) => {
        console.log(response,'反馈')
        if(response.data.code==200){
            wx.showToast({
                title: '提交成功,自动返回',
                icon:'none'
              })
              this.setData({
                problem: "",
              });
              setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/morepage/more',
                  })
              }, 1000);
             
        } else if (response.data.code == 401) {
            wx.redirectTo({
                url: '/pages/login/login',
            })
        } else {
            wx.showToast({
                title: response.data.msg,
                icon: 'none',
                mask: true,
            })
        }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  onReachBottom: function () {},

});
