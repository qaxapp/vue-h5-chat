/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import { i18n } from '../../main.js'

export default class UserOnlineState {
    userId;
    customState;
    clientStates;

    // 手机在线、web在线、pc在线
    desc() {
        if (this.customState.state > 0) {
            //0，未设置，1 忙碌，2 离开（主动设置），3 离开（长时间不操作），4 隐身，其它可以自主扩展。
            let cs = [
							i18n.global.t('chat.not_set'),
							i18n.global.t('chat.busy'),
							i18n.global.t('chat.away_active'),
							i18n.global.t('chat.away_inactive'),
							i18n.global.t('chat.invisible')
						];
            return this.customState.text + cs[this.customState.state];
        }

        let onlineClientDesc = '';
        let lastSeenDesc = '';
        this.clientStates.forEach(s => {
            //
            // /**
            //  Platform_UNSET = 0;
            //  Platform_iOS = 1;
            //  Platform_Android = 2;
            //  Platform_Windows = 3;
            //  Platform_OSX = 4;
            //  Platform_WEB = 5;
            //  Platform_WX = 6;
            //  Platform_LINUX = 7;
            //  Platform_iPad = 8;
            //  Platform_APad = 9;
            //  */
            // platform;
            //
            // //设备的在线状态，0是在线，1是有session但不在线，其它不在线。
            // state;
            //
            // //最后可见
            // lastSeen;

            let ps = ['', 'iOS', 'Android', 'Windows', 'mac', 'Web', i18n.global.t('chat.mini_program'), 'Linux', 'iPad', 'Android-Pad'];
            if (s.state === 0) {
                onlineClientDesc += ps[s.platform] + ' '
            } else if ([1, 2, 8, 9].indexOf(s.platform) >= 0) {
                // TODO
                lastSeenDesc += ps[s.platform] + ' ';
            }
        });

        if (onlineClientDesc.trim()) {
            return onlineClientDesc + i18n.global.t('chat.online');
        } else if (lastSeenDesc.trim()) {
            return lastSeenDesc + i18n.global.t('chat.recently_online');
        }
        //return '不在线';
        return '';
    }
}
