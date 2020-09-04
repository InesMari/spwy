import { util, wxApi, webApi, APP_CONST, regeneratorRuntime } from '../../../common/commonImport';

Component({
  properties: {
    
  },
  data: {
    selectType:null,
  },
  ready(){
    let selectType = wx.getStorageSync("navType");
    if(util.isBlank(selectType)) selectType=1;
    this.setData({selectType });
  },
  methods: {
    change(){
      let unlogin = wx.getStorageSync("UNLOGIN");
      this.setData({unlogin })
    },
    // 首页
    toHome() {
      let selectType = 1;
      this.setData({selectType })
      wx.setStorageSync('navType', selectType);
      wx.redirectTo({ url: '/pages/index/index',  });
    },
    //运营
    toOperation() {
      wxApi.showToast("暂未开放，敬请期待~");
      return;
      let selectType = 2;
      this.setData({selectType })
      wx.setStorageSync('navType', selectType);
      wx.redirectTo({ url: '/packages/order/storage/storage/storage' });
    },
    // 看板
    toOrderList() {
      if (this.isToLogin()) return
      let selectType = 3;
      this.setData({selectType })
      wx.setStorageSync('navType', selectType);
      wx.redirectTo({ url: '/packages/order/orderStatistics/orderStatistics' });
    }, 
    // 我的
    toPersonal() {
      if (this.isToLogin()) return
      let selectType = 4;
      this.setData({selectType })
      wx.setStorageSync('navType', selectType);
      wx.redirectTo({ url: '/packages/personal/personal/personal' });
    },
    isToLogin(){
      if (this.data.unlogin){
        wxApi.showToast("登录后才能使用该功能~");
        return true;
      }else{
        return false;
      }
    },
  }
});
