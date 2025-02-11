<script>
import store from "./store";
import { getItem, setItem } from "./pages/util/storageHelper";
import wfc from "./wfc/client/wfc";
import ConferenceInviteMessageContent from "./wfc/av/messages/conferenceInviteMessageContent";
import Message from "./wfc/messages/message";
import ForwardType from "./pages/conversation/message/forward/ForwardType";
import ConnectionStatus from "./wfc/client/connectionStatus";
import appServerApi from "./api/appServerApi";
import { getCachedLanguage } from "./common/language";
import Conversation from "./wfc/model/conversation";
import ConversationType from "./wfc/model/conversationType";
import EventType from "./wfc/client/wfcEvent";
export default {
  data() {
    return {
      wfc: null,
      store: null,
    };
  },
  onLaunch: function (option) {
    console.log("App Launch");
	// uni.preloadPage({
	// 	  url: "/pages/SplashPage"
	// })
	// uni.preloadPage({
	// 	  url: "/pages/login/LoginPage"
	// })
	// uni.preloadPage({
	// 	  url: "/pages/conversation/Customer"
	// })
    this.wfc = wfc;
    this.store = store;
    // #ifdef APP-PLUS
    plus.push.getClientInfoAsync((info) => {
      let cid = info["clientid"];
      if (cid) {
        console.log("push clientId", cid);
        wfc.setDeviceToken(7, cid);
      }
    });
    // #endif
	console.log(option);
	const {query, path} = option;
	if(query.wechat === 'true' && path==='pages/SplashPage'){
		console.log("设置chatId", query.chatId)
		setItem("wechat", true);
		if(query.clientId){
			setItem("clientId", query.clientId);
		}
		if(query.userId){
			setItem("userId", query.userId);
		}
		if(query.token){
			setItem("token", query.token);
		}
		if(query.authTokenapp){
			setItem("authToken-app",query.authTokenapp)  
		}
		setItem("chatId", query.chatId);
		setItem("type", query.type);
	}
  },
  onShow: function () {
    console.log("App Show");
    store.state.misc.isAppHidden = false;
    // #ifdef H5
    let userId = getItem("userId");
    let token = getItem("token");
    if (token) {
      if (
        wfc.getConnectionStatus() === ConnectionStatus.ConnectionStatusConnected
      ) {
        console.log("app Show and connected");
        return;
      }
      wfc.connect(userId, token);
	  if (getItem("wechat")) {
		  this.$go2CustomerPage();
	  } else {
		  this.go2ConversationList();
	  }
    } else {
      uni.redirectTo({
        url: "/pages/login/LoginPage",
      });
    }
    this.getOperateConfig();

    // #endif
  },

  mounted() {
	uni.setLocale(getCachedLanguage());
	// uni.onLocaleChange(() => {
	// 	console.log("语言改变");
	// 	this.$forceUpdate();
	// })
    //屏蔽默认的contextmenu事件
    document.oncontextmenu = (e) => e.preventDefault();
  },

  onHide: function () {
    console.log("App Hide");
    store.state.misc.isAppHidden = true;
  },
  methods: {
    getOperateConfig() {
      appServerApi.getOperateConfig().then((result) => {
        const messageRecallTimeLimit = result.messageRecallTimeLimit;
        setItem("messageRecallTimeLimit", messageRecallTimeLimit);
      });
    },
    go2ConversationList() {
      uni.switchTab({
        url: "/pages/conversationList/ConversationListPage",
        success: () => {
          console.log("to conversation list success");
        },
        fail: (e) => {
          console.log("to conversation list error", e);
        },
        complete: () => {
          console.log("switch tab complete");
        },
      });
    },

    forwardConferenceInviteMessage(
      callId,
      host,
      title,
      desc,
      startTime,
      audioOnly,
      defaultAudience,
      advance,
      pin
    ) {
      let inviteMessageContent = new ConferenceInviteMessageContent(
        callId,
        host,
        title,
        desc,
        startTime,
        audioOnly,
        defaultAudience,
        advance,
        pin
      );
      console.log("invite", inviteMessageContent);
      let message = new Message(null, inviteMessageContent);
      this.$forward({
        forwardType: ForwardType.NORMAL,
        messages: [message],
      });
    },
  },
};
</script>

<style lang="css">
/*每个页面公共css */
@import "./global.css";
@import "./wfc.css";
/* #ifndef APP-NVUE */
@import "./static/iconfonts/customicons.css";
@import "./static/iconfonts/icomoon/style.css";
/* #endif */

:root {
  --uni-tabbar-height: 50px;

  /*app-plus header 和 tabbar 是原生的*/

  /* #ifdef APP-PLUS */
  --uni-page-header-height: 0;
  --page-full-height-without-header-and-tabbar: 100vh;
  --page-full-height-without-header: 100vh;
  /* #endif */
  /* #ifdef H5 */
  --uni-page-header-height: 44px;
  --page-full-height-without-header-and-tabbar: calc(100vh - 44px - 50px);
  --page-full-height-without-header: calc(100vh - 44px);
  /* #endif */
}

/* 适用于 WebKit 内核浏览器（Chrome、Safari、Edge 等） */
::-webkit-scrollbar {
  width: 5px;   /* 垂直滚动条宽度 */
  height: 5px;  /* 水平滚动条高度 */
}

::-webkit-scrollbar-track {
  background: #162837; /* 轨道背景色 */
  border-radius: 337px;
}

::-webkit-scrollbar-thumb {
  background: #495E6F;    /* 滑块颜色 */
  border-radius: 337px;
}

::-webkit-scrollbar-thumb:hover {
  background: #495E6F;     /* 滑块悬停颜色 */
}
</style>
