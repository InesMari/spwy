import { util, wxApi, webApi, regeneratorRuntime, APP_CONST } from '../../../common/commonImport';
import req from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: 2, //展示页面，1是订单跟踪，2是订单详情
    isShowCancelOrder: false,  //取消订单弹窗
    isShowRejectOrder: false, //拒绝三方结算订单弹窗
    trackIndex:0,
    trackList:[],//轨迹信息容器
  },
  /**
   * 生命周期函数--监听页面加载
   * orderId：订单id
   */
  async onLoad({ orderId, userLogin, attributionType}) {
    this.setData({ orderId});
    await this.isLogin(orderId,userLogin,attributionType);
    this.doQuery();
  },
  //订阅进入判断是否登录，没登录自动登录
  async isLogin(orderId,userLogin,attributionType){
    console.log("orderId：" + orderId);
    console.log("userLogin" + userLogin);
    console.log("attributionType：" + attributionType);
    await webApi.loginState();
    let unlogin = wx.getStorageSync("UNLOGIN");//是否登录
    if (unlogin){
      await wxApi.showModal("登录状态已失效，请先登录。");
      req.reLogin();
      return
    }
    console.log("登录信息有效");
    if (util.isNotBlank(userLogin) && util.isNotBlank(attributionType)){  //
      let result = await webApi.getUserId({userLogin}); //根据手机号查询用户id
      console.log(result);
      //登录
      let res = await webApi.changeUser({ attributionType, userLogin,id });
      if (res.result == '0') {
        await req.resetStorage(res);
      }
    }
  },
  //初始化查询按钮权限(doQuery命名不能改变，修改、支付回调会调用此方法)
  async doQuery(){
    this.init();      //查询订单详情
  },
  tabChange(e) {
    let { page } = e.currentTarget.dataset;
    this.setData({ showPage: page })
  },
  async init(){
    let { orderId} = this.data;
    let res = await webApi.orderDetail({ orderId });
    let orderType = 1;
    if (res.tracks.length>0){
      var trackList = res.tracks[0].track; //拆单默认显示第一个
    }
    this.setData({ ...res, orderType, trackList });
    //查询是否扫码用户
    if(util.isNotBlank(res.cmWarehouse)){
      this.setData({warehouseNature:res.cmWarehouse.warehouseNature});
    }    
    // 判断是否东莞客户
    let {cfgValue} = await webApi.getConfig({ cfgName: "PURCHASE_TENANT" });  //查询东莞用户id
    let tenantId = wx.getStorageSync(APP_CONST.STORAGE.TENANT_ID);  //查询用户类型
    if(cfgValue==tenantId&&res.order.orderType==2){
      this.setData({warehouseNature:4});
    }
  },
  selectTrack(e){
    let {index} = e.currentTarget.dataset;
    this.setData({ trackList: this.data.tracks[index].track, trackIndex:index});
  },
  //展示取消订单弹窗
  showCancelOrder(e) {
    let id = this.data.orderId;
    this.setData({ currentOrderId: id, isShowCancelOrder: true });
  },
  //隐藏取消订单弹窗
  hideCancelOrder() {
    this.setData({ isShowCancelOrder: false, orderCancelMark: '' });
  },
  //取消订单
  async cancelOrder() {
    this.setData({ isShowCancelOrder: false, orderCancelMark: '' })
    let res = await webApi.cancelOrder({ orderId: this.data.currentOrderId, cancelRemark: this.data.orderCancelMark });
    if (res.result == 0) {
      await wxApi.showModal({ title: '提示', content: '取消订单成功', showCancel: false });
      this.doQuery();
    }
  },
  //修改订单
  editOrder(e) {
    let id = this.data.orderId;
    wx.navigateTo({
      url: `/packages/order/billing/billing?orderId=${id}`,
    })
  },
  //展示拒绝三方结算订单弹窗
  showRejectOrder(e) {
    let id = this.data.orderId;
    this.setData({ currentOrderId: id, isShowRejectOrder: true });
  },
  //隐藏拒绝三方结算订单弹窗
  hideRejectOrder() {
    this.setData({ isShowRejectOrder: false, ordeRejectMark: '' });
  },
  inputRejectMark(e) {
    this.setData({ ordeRejectMark: e.detail.value })
  },
  //拒绝三方结算订单
  async rejectOrder() {
    this.setData({ isShowRejectOrder: false, ordeRejectMark: '' })
    let res = await webApi.rejectOrder({ orderId: this.data.currentOrderId, rejectlRemark: this.data.ordeRejectMark });
    if (res.result == 0) {
      await wxApi.showModal({ title: '提示', content: '已拒绝', showCancel: false });
      this.doQuery();
    }
  },
  //同意三方结算订单
  async agreeOrder(e) {
    let id = this.data.orderId;
    let { confirm } = await wxApi.showModal({ title: '提示', content: '是否同意该订单' });
    if (confirm) {
      let res = await webApi.agreeOrder({ orderId: id });
      if (res.result == 0) {
        await wxApi.showModal({ title: '提示', content: '已同意', showCancel: false });
        this.doQuery();
      }
    }
  },
  //重新开单
  async reBilling(e) {
    let id = this.data.orderId;
    let { confirm } = await wxApi.showModal({ title: '提示', content: '是否要重新开单' });
    if (confirm) {
      let res = await webApi.reBilling({ orderId: id });
      if (res.result == 0) {
        await wxApi.showModal({ title: '提示', content: '已重新开单', showCancel: false });
        this.doQuery();
      }
    }
  },
  // 长按复制文本
  async copyText(e){
    let {label,value} = e.currentTarget.dataset;
    await wxApi.setClipboardData(value);
    wxApi.showToast(`${label}已复制`);
  },
  topay(e) {
    let id = this.data.orderId;
    wx.navigateTo({
      url: `/packages/order/orderPay/orderPay?orderId=${id}`,
    })
  },
})