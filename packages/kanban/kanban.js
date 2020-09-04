// packages/kanban/kanban.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    isShowPopover:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showPopover(){
    this.setData({isShowPopover:true})
  },  
  // 开始时间
  changeStartDate(e){
    this.setData({ ['query.createDateStart']: e.detail });
  },
  // 结束时间
  changeEndDate(e) {
    this.setData({ ['query.createDateEnd']: e.detail });
  },
  // 清空筛选条件
  cleanSearch(){
    this.setData({
      consumerTypeIndex:null,
      query:{
        page: this.data.query.page,
        rows: 20
      },
    });
    this.selectComponent("#startDate").cleanDate();
    this.selectComponent("#endDate").cleanDate();
  },
  // 取消筛选
  cancelFilter(){
    this.setData({ isShowPopover:false});
  },
  sureFilter(){
    this.cancelFilter();

  }
})