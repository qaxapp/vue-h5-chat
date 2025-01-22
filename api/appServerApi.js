import Config from "../config";
import FavItem from "../wfc/model/favItem";
import {stringValue} from "../wfc/util/longUtil";
import AppServerError from "./appServerError";
import wfc from "../wfc/client/wfc";
import {getItem, setItem} from "../pages/util/storageHelper";

export class AppServerApi {
    constructor() {
    }

    requestAuthCode(mobile) {
        return this._post('/send_code', {mobile})
    }

    loginWithPassword(mobile, password) {
        return new Promise((resolve, reject) => {
            let responsePromise = this._post('/login_pwd', {
                mobile,
                password,
                platform: Config.getWFCPlatform(),
                clientId: wfc.getClientId()
            }, true)
            this._interceptLoginResponse(responsePromise, resolve, reject)
        })
    }

    loginWithAuthCode(mobile, authCode) {
        return new Promise((resolve, reject) => {
            let responsePromise = this._post('/login', {
                mobile,
                code: authCode,
                platform: Config.getWFCPlatform(),
                clientId: wfc.getClientId()
            }, true);
            this._interceptLoginResponse(responsePromise, resolve, reject)
        })
    }

    getOperateConfig() {
        return this._post('/operate_config')
    }


    changePassword(oldPassword, newPassword) {
        return this._post('/change_pwd', {
            oldPassword,
            newPassword
        })
    }

    requestResetPasswordAuthCode() {
        return this._post('/send_reset_code')
    }

    resetPassword(resetPasswordAuthCode, newPassword) {
        return this._post('/reset_pwd', {
            resetCode: resetPasswordAuthCode,
            newPassword: newPassword,
        })
    }

    getGroupAnnouncement(groupId) {
        return this._post('/get_group_announcement', {groupId: groupId})
    }

    updateGroupAnnouncement(author, groupId, announcement) {
        return this._post('/put_group_announcement', {
            author,
            groupId,
            text: announcement
        })
    }

    favMessage(message) {
        let favItem = FavItem.fromMessage(message);
        return this._post('/fav/add', {
            messageUid: stringValue(favItem.messageUid),
            type: favItem.favType,
            convType: favItem.conversation.type,
            convTarget: favItem.conversation.target,
            convLine: favItem.conversation.line,
            origin: favItem.origin,
            sender: favItem.sender,
            title: favItem.title,
            url: favItem.url,
            thumbUrl: favItem.thumbUrl,
            data: favItem.data,
        });
    }

    getFavList(startId, count = 20) {
        return this._post('/fav/list', {id: startId, count: count}, false, true)
    }

    delFav(favItemId) {
        return this._post('/fav/del/' + favItemId, '')
    }
	 // 聊天室列表
	getChatroomList(status) {
		return this._post("/chatroom/list");
	}
	// 查询用户在聊天室的状态
	// {
	//     "chatroomId": "abc",
	//     "userId": "bdsfk"
	// }
	getChatroomUserStatus(obj) {
		return this._post("/chatroom/get_user_status", obj);
	}
	// 设置/取消聊天室全员禁言： 0 取消全员禁言；1 设置全员禁言
	// {
	//     "chatroomId": "abc",
	//     "mute": 1
	// }
	getChatroomMuteAll(obj) {
		return this._post("/chatroom/mute_all", obj);
	}
	// 设置/取消聊天室管理员：0 取消管理员；1 设置管理员
	// {
	//     "chatroomId": "abc",
	//     "userId": "abc",
	//     "status": 0
	// }
	setChatroomManage(obj) {
		return this._post("/chatroom/set_manager", obj);
	}
	// 设置/取消聊天室黑名单：0 取消拉黑；1 禁言；2 禁止进入
	// {
	//     "chatroomId": "abc",
	//     "userId": "abc",
	//     "status": 0
	// }
	setChatroomBlack(obj) {
		return this._post("/chatroom/set_black", obj);
	}
	
	notifyChatUser(targetId, code) {
		return this._post('/user-chat-notify', {targetId, code}, false, true)
	}
	
	searchUser(keyword) {
		return this._post('/user/search', {keyword, page: 0, size: 200})
	}
	
	createGroup(members, groupName) {
		return this._post('/group/create', {members, groupName})
		
	}
	
	sendAddFriend(reason, targetId) {
		return this._post('/friend/send-request', {reason, targetId})
		
	}

    _interceptLoginResponse(responsePromise, resolve, reject) {
        responsePromise
            .then(response => {
                if (response.data.code === 0) {
                    let appAuthToken = response.header['authtoken'];
                    if (!appAuthToken) {
                        appAuthToken = response.header['authToken'];
                    }

                    if (appAuthToken) {
                        setItem('authToken-app', appAuthToken);
                    }
                    resolve(response.data.result);
                } else {
                    reject(new AppServerError(response.data.code, response.data.message));
                }
            })
            .catch(err => {
                reject(err);
            })
    }

    /**
     *
     * @param path
     * @param data
     * @param rawResponse
     * @param rawResponseData
     * @return {Promise<string | Response<any>|*|T>}
     * @private
     */
    _post(path, data = {}, rawResponse = false, rawResponseData = false) {
        let response;
        path = Config.APP_SERVER + path;
        let p = new Promise((resolve, reject) => {
            console.log('_post', path, data);
            uni.request({
                url: path,
                data: data,
                header: {
                    'content-type': 'application/json', // 默认值
                    'authToken': getItem('authToken-app'),
                },
                method: 'POST',

                success: (res) => {
                    console.log('_post result', res);
                    if (res.statusCode === 200) {
                        if (rawResponse) {
                            resolve(res);
                            return;
                        }
                        if (rawResponseData) {
                            resolve(res.data);
                            return
                        }
                        if (res.data.code === 0) {
                            resolve(res.data.result);
                        } else {
							console.log('request error: ' + res.data.message);
                            reject(new AppServerError(res.data.code, res.data.message))
                        }
                    } else {
                        throw new Error('request error, status code: ' + res.status)
                    }
                },
                fail: (res) => {
                    console.log('fail', res);
                    throw new Error('request error: ' + res)
                }
            });
        });
        return p;
    }

    login(phone, code) {
        let appServer = Config.APP_SERVER + '/login';
        let clientId = wfc.getClientId();
        console.log('login', wfc.getClientId(), Config.getWFCPlatform());
        uni.request({
            url: appServer,
            data: {
                mobile: phone,
                code: code,
                clientId: clientId,
                platform: Config.getWFCPlatform(),
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: 'POST',

            success: (res) => {
                if (res.statusCode === 200) {
                    let loginResult = res.data;

                    if (loginResult.code === 0) {
                        let userId = loginResult.result.userId;
                        let token = loginResult.result.token;
                        wfc.connect(userId, token);
                        setItem('userId', userId);
                        setItem('token', token)

                        let authToken = res.header['authToken'];
                        if (!authToken) {
                            authToken = res.header['authtoken'];
                        }

                        console.log('setupAppserver', Config.APP_SERVER, authToken);
                        //wfcUIKit.setupAppServer(Config.APP_SERVER, authToken);


                        this.go2ConversationList();

                    } else {
                        console.log('login failed', loginResult);
                    }
                }
            }

        });
    }
}

const appServerApi = new AppServerApi();
export default appServerApi;
