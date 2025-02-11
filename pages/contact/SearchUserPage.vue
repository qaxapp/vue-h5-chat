<template>
    <view class="search-user-container">
        <input class="input" type="text" v-model="keyword" :placeholder="$t('common.search')" @input="searchUser">
        <view v-if="users && users.length">
            <text class="category">{{ $t('chat.search_results')}}</text>
            <UserListView
                class="result"
                :enable-pick="false"
                :users="users"
                :show-category-label="false"
                :padding-left="'10px'"/>
        </view>
        <text v-if="keyword && !users.length" class="tip">{{ $t('chat.no_users_found')}}</text>
    </view>
</template>

<script>
import UserListView from "../user/UserListView.vue";
import wfc from "../../wfc/client/wfc";
import SearchType from "../../wfc/model/searchType";
import appServerApi from "../../api/appServerApi";

export default {
    name: "SearchUserPage",
    components: {UserListView},
    data() {
        return {
            keyword: '',
            users: [],
        }
    },
    methods: {
        searchUser() {
            if (!this.keyword.trim()) {
                this.users = [];
                return;
            }
            console.log('search user', this.keyword);
			appServerApi.searchUser(this.keyword).then((result) => {
				console.log('searchUser success', result.list)
				if (result.list) {
					this.users = result.list;
				}
			}).catch(err => {
				console.log(' searchUser err', err)
			});
        }
    }
}
</script>

<style lang="scss" scoped>
.search-user-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
	color: $cm-text-color;
}

.input {
    height: 40px;
    padding: 0 10px;
    width: 100%;
    border-bottom: 1px solid $cm-split-line-color;
}

.category{
    padding: 5px 10px;
}

.result {
    min-height: 0;
    flex: 1 1 auto;
    overflow-y: auto;
}

.tip {
    padding-top: 40px;
    text-align: center;
}

</style>