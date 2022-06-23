// components/RemarkTextModel/RemarkTextModel.js
Component({
  options: {
    addGlobalClass: true, //使用全局组件 class
  },
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:Object,
      value:{}
    },
    title:{
      type:String,
      value:""
    },
    activeLookId:{
      type:['String',"Number"],
      value:""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
