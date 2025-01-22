# 手机Web平台

支持Android 和 iOS 手机浏览器，支持微信浏览器

## 开发

1. 运行```npm install```命令
2. HBuilderX，运行到浏览器，Chrome

## 打包

1. 如果需要配置`publicPath`，可修改`vite.config.js`文件里面的`base`字段
1. HBuilderX，发行，网站-PC Web或手机H5

## 命令行打包
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
导航栏背景色: #0F162B
内容背景色:#212332, 比如列表背景
分割线: #1A3143，还不确定
