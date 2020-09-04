import { util, wxApi, webApi, regeneratorRuntime, APP_CONST } from '../../../common/commonImport';
import req from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionDirectlyList:[],
    regionDirectIndex:null,
    regionJoinList:[],
    regionJoinIndex:null,
    selectType:1,
    isShowPopover:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
    this.init();
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

  },

  async regionDirectChange (e){ 
    let { value } = e.detail;
    this.setData({
      "info.regionId": this.data.regionDirectlyList[value].regionId,
      regionDirectIndex: value
    })
  },

  async regionJoinChange (e){ 
    let { value } = e.detail;
    this.setData({
      "info.regionId": this.data.regionJoinList[value].regionId,
      regionJoinIndex: value
    })
  },

  async init() {
    let nav = this.selectComponent("#nav");
    nav.change();
     //查询区域直营区域
     let regionDirectlyList = await webApi.getRegion({"regionStatus":3,"regionType":1});
     this.setData({regionDirectlyList});
     //查询区域加盟区域
     let regionJoinList = await webApi.getRegion({"regionStatus":3,"regionType":2});
      this.setData({regionJoinList});
  },

  sureFilter(){
    this.setData({isShowPopover:false})
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

  async changeSelectType(e){
    let selectType = e.currentTarget.dataset.state;
    if(selectType == 1){
      let regionDirectIndex = null;
      let regionJoinIndex = null;
      let regionId = -1;
      this.setData({ selectType,regionDirectIndex,regionJoinIndex,regionId});
    }else if(selectType == 2){
      let regionJoinIndex = null;
      let regionId = -1;
      this.setData({ selectType,regionJoinIndex,regionId});
    }else{
      let regionDirectIndex = null;
      let regionId = -1;
      this.setData({ selectType,regionDirectIndex,regionId});
    }
    
  },


})