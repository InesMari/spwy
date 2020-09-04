import { util, wxApi, webApi, appConfig, APP_CONST, regeneratorRuntime } from '../../common/commonImport';
import md5 from '../../lib/md5.js';
import req from '../../utils/request';

Page({
  data: {
    orderList:[],   //订单列表
    isSeeMore:false, //是否查看更多
    page:1,         //列表页码
  },
  onShow(){
    this.init();
  },
  //下拉刷新
  async onPullDownRefresh(){
    await this.init();
    const timeout = setTimeout(()=>{
      wx.stopPullDownRefresh();
    },500)
  },
  onReachBottom(){
    this.scrolltolowerHandler();
  },
  async onLoad() {
    try{      
      this.isUpdate();  //强制更新
      await this.isLogin();
      await webApi.loginState();
      let unlogin = wx.getStorageSync("UNLOGIN");//是否登录
      this.setData({ unlogin});
      this.init();
    }catch(e){
      console.log(e);
    }
  },
  async isUpdate(){
    //发布前更改后台版本号，
    // await webApi.setVersion({version:appConfig.version});
    let version = await webApi.getVersion();
    console.log(version);
    if(version==appConfig.version) return;
    //后台版本号与前端版本号不一时强制更新
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  async init() {
    try{
      let selectType = 1;
      this.setData({selectType })
      wx.setStorageSync('navType', selectType);
      let nav = this.selectComponent("#nav");
      nav.change();
      this.queryOrder(true); 
    }catch(e){
      console.log(e);
    }
  },
  async isLogin(){
    try {
      //判断session_key是否有效
      let checkSession = await wxApi.checkSession();
      //有效是请求后台查看后台登录是否过期
      if (checkSession.errMsg != "checkSession:ok") {
        wx.reLaunch({ url: '/pages/login/login' });
      }
    } catch (e) {
      console.log(e)
    }
  },
  //首页运单跟踪查询
  async queryOrder(clear) {
    try{
      if (clear){
        this.setData({page:1,allName:this.data.allName});
      }
      let {allName,page} = this.data;
      let { items, hasNext } = await webApi.orderList({ allName, page });
      if (clear) {
        this.setData({ orderList: [] });
      }
      this.setData({ orderList: [...this.data.orderList, ...items], hasNext})
    } catch (e) {
      console.log(e)
    }
  },
  inputSetData(e) {
    let { value } = e.detail;
    let { key } = e.currentTarget.dataset;
    this.setData({ [key]: value });
  },
  //滚动加载
  scrolltolowerHandler() {
    if (this.data.isSeeMore && this.data.hasNext) {
      this.setData({ page: ++this.data.page });
      this.queryOrder();
    }
  },
  //查看更多
  seeMore(){
    this.setData({ isSeeMore: true })
    this.queryOrder();
  },
  toLogin(){
    req.reLogin();
  },
  //扫码
  getCode(){
    let _this = this;
    wx.scanCode({
      success(res) {
        console.log(res);
        _this.setData({ trackingNum: res.result }); 
        _this.queryTrackingNum();
      }
    })
  },
  //订单详情
  toDetail(e) {
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/packages/order/orderDetail/orderDetail?orderId=${id}`,
    })
  },
  // 长按复制文本
  async copyText(e){
    let {label,value} = e.currentTarget.dataset;
    await wxApi.setClipboardData(value);
    wxApi.showToast(`${label}已复制`);
  }
})
