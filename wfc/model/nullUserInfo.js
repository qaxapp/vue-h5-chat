/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import UserInfo from "./userInfo";

export default class NullUserInfo extends UserInfo {
    constructor(userId) {
        super();
        this.uid = userId;
        //this.name = '<' + userId + '>';
        this.name = 'User';
        this.displayName = this.name;
        this.portrait = '';
    }
}
