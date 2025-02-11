/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from '../messageContentType';
import { i18n } from '../../../main.js'
import GroupNotificationContent from './groupNotification';

export default class ModifyGroupExtraNotification extends GroupNotificationContent {
    operator = '';
    groupExtra = '';

    constructor(creator, groupExtra) {
        super(MessageContentType.ModifyGroupExtra_Notification);
        this.operator = creator;
        this.groupExtra = groupExtra;
    }

    formatNotification() {
			// 获取操作人名称
			const operatorName = this.fromSelf
				? i18n.global.t('chat.you')
				: (() => {
					let userInfo = wfc.getUserInfo(this.operator, false, this.groupId);
					return userInfo.friendAlias || userInfo.displayName || this.operator;
				})();

			// 使用国际化文案格式化最终通知字符串
			return i18n.global.t('chat.modify_group_extra', {
				operator: operatorName,
				extra: this.groupExtra
			});
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            n: this.groupExtra,
            o: this.operator,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let json = wfc.b64_to_utf8(payload.binaryContent)
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.operator = obj.o;
        this.groupExtra = obj.n;
    }
}
