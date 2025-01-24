<template>
    <div class="multi-selection-action-container">
        <ul>
            <li>
                <div class="action" @click="forwardOneByOne">
                    <div class="icon">
                        <i class="icon-ion-forward"></i>
                    </div>
                    <p>{{ $t('conversation.forward_one_by_one') }}</p>
                </div>
            </li>
            <li>
                <div class="action" @click="forwardComposite">
                    <div class="icon">
                        <i class="icon-ion-quote"></i>
                    </div>
                    <p>{{ $t('conversation.forward_composite') }}</p>
                </div>
            </li>
            <li>
                <div class="action" @click="fav">
                    <div class="icon">
                        <i class="icon-ion-android-favorite"></i>
                    </div>
                    <p>{{ $t('common.fav') }}</p>
                </div>
            </li>
            <li>
                <div class="action">
                    <div @click="deleteMultiMessage" class="icon">
                        <i class="icon-ion-android-delete"></i>
                    </div>
                    <p>{{ $t('common.delete') }}</p>
                </div>
            </li>
            
        </ul>
		<div class="close">
		    <i @click="hideMultiSelectionActionView" class="icon-ion-close"></i>
		</div>
    </div>
</template>

<script>
import store from "@/store";
import ForwardType from "@/pages/conversation/message/forward/ForwardType";

export default {
    name: "MessageMultiSelectionActionView",
    data() {
        return {
            sharedPickState: store.state.pick,
        }
    },
    methods: {
        deleteMultiMessage() {
            store.deleteSelectedMessages();
        },

        hideMultiSelectionActionView() {
            store.toggleMessageMultiSelection();
        },

        forwardOneByOne() {
            let messages = [...this.sharedPickState.messages];
            this.$forward({
                forwardType: ForwardType.ONE_BY_ONE,
                messages: messages,
            });
            store.toggleMessageMultiSelection();
        },

        forwardComposite() {
            let messages = [...this.sharedPickState.messages];
            this.$forward({
                forwardType: ForwardType.COMPOSITE,
                messages: messages,
            });
            store.toggleMessageMultiSelection();
        },

        fav(){
            let messages = [...this.sharedPickState.messages];
            this.$parent.favMessages(messages);
            store.toggleMessageMultiSelection();
        }
    },

}
</script>

<style lang="scss" scoped>

.multi-selection-action-container {
    width: 100%;
    height: 203px;
    min-height: 204px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #222222;
	position: relative;
}

ul {
    list-style: none;
}

ul li {
    display: inline-block;
}

.action {
    font-size: 13px;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
p {
	color: $cm-text-color;
}
.close {
	position: absolute;
	top: 20px;
	right: 20px;
}

.action .icon {
    width: 120rpx;
    height: 120rpx;
    background-color: white;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.action .icon:active {
    background-color: lightgrey;

}

.action p {
    padding-top: 10px;
}

.action i{
    font-size: 20px;
}

.icon-ion-close:before {
	color: white;
}

</style>
