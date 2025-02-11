/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import GroupNotificationContent from "./groupNotification";
import MessageContentType from "../messageContentType";
import wfc from "../../client/wfc";
import { i18n } from '../../../main.js'

export default class GroupSetManagerNotificationContent extends GroupNotificationContent {
    operator;
    // 1, 设置为管理员；0，取消管理员
    setManagerType;

    memberIds = [];


    constructor(operator, setManagerType, memberIds) {
        super(MessageContentType.SetGroupManager_Notification);
        this.operator = operator;
        this.setManagerType = setManagerType;
        this.memberIds = memberIds;
    }


    formatNotification(message) {
        let notifyStr = this.fromSelf ? i18n.global.t('chat.you') + ' ' : wfc.getGroupMemberDisplayName(this.groupId, this.operator) + ' '
        notifyStr += this.setManagerType === 0 ? i18n.global.t('chat.removed_admin') : i18n.global.t('chat.set_as_admin');
				this.memberIds.forEach((memberId) => {
					notifyStr += ' ';
					notifyStr += wfc.getGroupMemberDisplayName(this.groupId, memberId);
				})
        return notifyStr;
    }

    encode() {
        // MessagePayload payload = new MessagePayload();
        // try {
        //     JSONObject objWrite = new JSONObject();
        //     objWrite.put("g", groupId);
        //     objWrite.put("o", operator);
        //     objWrite.put("n", type + "");
        //     JSONArray objArray = new JSONArray();
        //     for (String id : memberIds) {
        //         objArray.put(id);
        //     }
        //     objWrite.put("ms", objArray);
        //     payload.binaryContent = objWrite.toString().getBytes();
        // } catch (JSONException e) {
        //     e.printStackTrace();
        // }
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            o: this.operator,
            n: this.setManagerType + '',
            ms: this.memberIds,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let obj = JSON.parse(wfc.b64_to_utf8(payload.binaryContent));
        this.groupId = obj.g;
        this.operator = obj.o;
        this.setManagerType = parseInt(obj.n);
        this.memberIds = obj.ms;
    }
}
