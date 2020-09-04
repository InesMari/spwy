import { util, wxApi, webApi, regeneratorRuntime,appConfig, APP_CONST } from '../../../common/commonImport';
import req from '../../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    regionList:[],
    regionListIndex:0,
    headImg:"/common/images/u3395.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    wx.hideHomeButton();
    this.doQuery();
  },
  async queryStorage() {
    let unlogin = wx.getStorageSync("UNLOGIN");//是否登录
    let headImg = wx.getStorageSync(APP_CONST.STORAGE.AVATARURL);//获取微信头像
    let orgName = wx.getStorageSync(APP_CONST.STORAGE.ORG_NAME);  //区域名称
    this.setData({ unlogin,orgName,headImg,ver:appConfig.ver });
  },
  async doQuery() {
    try{
      await this.queryStorage();
      await this.getUserRegion();
      let info = await webApi.getPersonalInfo();
      let { cfgValue } = await webApi.getConfig({ cfgName: "CONSUMER_HOTLINE" });
      this.setData({ info, cfgValue });
    } catch (e) {
      console.log(e)
    }
  },
  async getUserRegion(){
    let userId = wx.getStorageSync(APP_CONST.STORAGE.USER_ID);  //用户id
    let regionList = await webApi.getUserRegion({'userId':userId});
    this.setData({ regionList});
  },
  // 点击注册/登录
  toLogin(){
    req.reLogin();
  },
  // 退出登录
  async relogin(){
    let { confirm } = await wxApi.showModal({ title: '提示', content: '确定退出登录？' });
    let content = await webApi.relogin();
    if (content == 0) {
      req.reLogin();
    }
  },
 //切换区域
 async regionListChange(e){
  let { value } = e.detail;
  let regionId = this.data.regionList[value].regionId
  let userLogin = wx.getStorageSync(APP_CONST.STORAGE.LOGIN_ACCT);
  let res = await webApi.selectOrg({ userLogin: userLogin,regionId: regionId});
  if (res.result == '0') {
    await req.resetStorage(res);
    this.doQuery();
  }
 },
  // 拨打电话
  call(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.customerUserPhone
    })
  },
})