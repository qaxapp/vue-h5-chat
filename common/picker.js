import store from "../store";
import { i18n } from '../main.js'

export default {
    install(app, options) {
        app.config.globalProperties.$pickUsers = function (options) {
            uni.navigateTo({
                url: '/pages/pick/PickUserPage',
                events: {
                    pickedUsers: users => {
                        options.successCB && options.successCB(users);
                    }
                },

                success: (res) => {
                    res.eventChannel.emit('pickOptions', {
                        users: options.users ? options.users : store.state.contact.favContactList.concat(store.state.contact.friendList),
                        initialCheckedUsers: options.initialCheckedUsers,
                        uncheckableUsers: options.uncheckableUsers,
                        showCategoryLabel: options.showCategoryLabel !== false,
                        confirmTitle: options.confirmTitle ? options.confirmTitle : i18n.global.t('common.confirm'),
                    });
                }
            })
        };

        app.config.globalProperties.$pickUser = function (options) {
            uni.navigateTo({
                url: '/pages/pick/PickSingleUserPage',
                events: {
                    pickedUser: user => {
                        options.successCB && options.successCB(user);
                    }
                },

                success: (res) => {
                    res.eventChannel.emit('pickOptions', {
                        users: options.users ? options.users : store.state.contact.favContactList.concat(store.state.contact.friendList),
                        showCategoryLabel: options.showCategoryLabel !== false,
                        confirmTitle: options.confirmTitle ? options.confirmTitle : i18n.global.t('common.confirm'),
                    });
                }
            })
        };
    }
}
