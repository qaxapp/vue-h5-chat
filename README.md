# 手机Web平台

支持Android 和 iOS 手机浏览器，支持微信浏览器

## 服务端地址配置
config.js
```javascript
// APP SERVER的地址，不能省略http(s)前缀。
// 默认的app server使用端口是8888，注意端口号别忘记了。
static APP_SERVER = 'https://chattest.qaxapp.top';

// 请仔细看注释
// 仅仅是 HOST，没有 http 前缀，后面也没有端口
// IM SERVER 的 host 地址，一定要和 APP_SERVER 对应起来，即 APP_SERVER 上配置的 im-server 和下面所配置的im-server 是同一个
static IM_SERVER_HOST = 'chattest.qaxim.top'/** 请仔细看上面的注释，仅仅是 HOST，没有 http 前缀，后面也没有端口 **/;

```
## 开发

1. 运行```npm install```命令
2. 下载、安装HBuilderX，运行到浏览器，Chrome

## 注册
DCloud为支持海外开发者，特推出“国际区”注册服务，注册在“国际区”的账号，仅需验证邮箱，即可使用云端打包服务。
[注册“国际区”账号](https://zh.uniapp.dcloud.io/tutorial/internationalization.html)

### 修改 App ID
点击 manifest.json

### 打包

1. 如果需要配置`publicPath`，可修改`vite.config.js`文件里面的`base`字段
1. 使用 HBuilderX,顶部工具栏 -> 发行 -> 网站-PC Web或手机H5

### 命令行打包
#### 安装 HBuilderX
[HBuilderX](https://www.dcloud.io/hbuilderx.html)


#### 全局安装 vue-cli
```shell
npm install -g @vue/cli
```
#### 配置 cli 命令
``` shell
# on Mac: /Applications/HBuilderX.app/Contents/MacOS/cli
# vi ~/.zshrc 
alias cli='/Applications/HBuilderX.app/Contents/MacOS/cli'
# 记得 source 
source ~/.zshrc 
cli --ver    
HBuilderX CLI CLIENT TOOL v1.0.0.1
```
#### 打包
```
# project是 工程文件夹
cli publish --platform h5 --project vue-h5-chat

# 不想配置 alias ，可以直接
/Applications/HBuilderX.app/Contents/MacOS/cli publish --platform h5 --project vue-h5-chat
```

## 常见问题说明

## 颜色值
导航栏背景色: $cm-bg-bar-color;
内容背景色: $cm-bg-color;
分割线: $cm-split-line-color;

### 添加头像点击事件
```js
NormalInMessageContentView.vue
NormalOutMessageContentView.vue

onClickUserPortrait(userId) {
	
}
```

### 网站接入
通过 iframe 的方式接入，参考 kf-site/index.html, kf-site/chatroom.html

### im-server 配置
客服的账号，需要配置为允许聊天, 允许 web 多端登陆。

im-server/config/wildfirechat.conf
```
##是否禁止陌生人聊天
message.disable_stranger_chat true

##当禁止陌生人聊天时，允许聊天的用户id，比如管理员或者文件传输助手等。用户id以英文逗号分割。
message.allow_stranger_chat_list admin,FireRobot,wfc_file_transfer

## 是否支持任意多端登陆，为true时支持任意平台任意多个客户端同时登录；为false时每个平台只支持一个端登录，但不同平台可以同时登录。
## Android/iOS为移动平台，windows/mac/linux为pc平台，web为web平台，小程序为小程序平台，iPad和Android Pad为Pad平台。
## 建议使用false
server.multi_endpoint false
## 是否支持Web多端登陆，当server.multi_endpoint为true时，此开关无意义，当为false时，可以单独打开Web端多端登录。
server.multi_web_endpoint true
```