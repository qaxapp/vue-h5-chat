/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */


import MessageContent from './messageContent'
import MessageContentType from './messageContentType'
import wfc from '../client/wfc'
import Config from '../../config'
import { i18n } from '../../main.js'

export default class CardMessageContent extends MessageContent {
    /**
     * 0，用户；1，群组；2，聊天室；3，频道
     */
    cardType = 0;
    target;
    name;
    displayName;
    portrait;
    from;

    constructor(cardType, target, displayName, portrait, from) {
        super(MessageContentType.UserCard);
        this.cardType = cardType;
        this.target = target;
        this.displayName = displayName;
        this.portrait = portrait;
        this.from = from;
    }

    encode() {
        let payload = super.encode()
        payload.content = this.target;
        let obj = {
            t: this.cardType,
            n: this.name,
            d: this.displayName,
            p: this.portrait,
            f: this.from,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload)
        this.target = payload.content;
        let obj = JSON.parse(wfc.b64_to_utf8(payload.binaryContent));
        this.cardType = obj.t;
        this.name = obj.n;
        this.displayName = obj.d;
        this.portrait = obj.p;
        if (Config.urlRedirect){
            this.portrait = Config.urlRedirect(obj.p);
        }
        this.from = obj.f;
    }

    digest() {
        let msg = i18n.global.t('chat_im_i18n.business_card');
        switch (this.cardType) {
            case 0:
                msg = i18n.global.t('chat_im_i18n.personal_card')
                break;
            case 1:
                msg = i18n.global.t('chat_im_i18n.group_card')
                break;
            case 2:
                msg = i18n.global.t('chat_im_i18n.chat_room_card')
                break;
            case 3:
                msg = i18n.global.t('chat_im_i18n.channel_card')
                break;
            default:
                break;
        }
        return msg + ' ' + this.displayName;
    }
}
