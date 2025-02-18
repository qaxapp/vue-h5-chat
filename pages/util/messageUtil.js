import ConversationType from "../../wfc/model/conversationType";
import MessageContentType from "../../wfc/messages/messageContentType";
const convertTimestampFromObject = (timestamp) => {
	const {
		low,
		high
	} = timestamp;

	// 处理 low 为无符号整数
	const lowUnsigned = low < 0 ? low + Math.pow(2, 32) : low;

	// 合成 64 位时间戳（毫秒级）
	const timestampMilliseconds = high * Math.pow(2, 32) + lowUnsigned;

	// 返回时间戳（秒级）
	return Math.floor(timestampMilliseconds / 1000); // 返回秒级时间戳
};
export const processMessages = (messages) => {
	const lastAvatarInfo = {}; // 用于存储每个用户最近的有头像的消息的时间戳
	let findFirstMessage = false
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
		const currentTimestamp = convertTimestampFromObject(message.timestamp);
		const currentUserId = message.from;
		// 第一条消息总是显示头像
		if (i === 0) {
			message.showAvatar = true;
			lastAvatarInfo[currentUserId] = currentTimestamp; // 更新为当前消息的时间戳
			continue;
		}
		if (!findFirstMessage) {
			if (message.messageContent.type <= MessageContentType.Streaming_Text_Generated) {
				findFirstMessage = true;
				message._showTime = true;
			}
		}
		message._showTime = true;

		// 检查与最近的有头像的消息的时间差
		const lastInfo = lastAvatarInfo[currentUserId];
		const previousMessage = messages[i - 1];
		if (previousMessage.messageContent.type === MessageContentType.RecallMessage_Notification) {
			message.showAvatar = true;
			lastAvatarInfo[currentUserId] = currentTimestamp; // 更新为当前消息的时间戳
			continue;

		}
		if (lastInfo) {
			const timeDiff = currentTimestamp - lastInfo; // 时间差（秒）

			// 如果时间差超过60秒，或者当前消息的发送者与上一个有头像的消息的发送者不同，则显示头像
			if (timeDiff > 60 || previousMessage.from !== currentUserId) {
				message.showAvatar = true;
				lastAvatarInfo[currentUserId] = currentTimestamp; // 更新为当前消息的时间戳

			} else {
				message.showAvatar = false; // 否则不显示头像
			}
		} else {
			message.showAvatar = true; // 如果没有记录，显示头像
			lastAvatarInfo[currentUserId] = currentTimestamp; // 更新为当前消息的时间戳

		}

		// 更新最近的有头像的消息的时间戳
		// 	lastAvatarInfo[currentUserId] = currentTimestamp; // 更新为当前消息的时间戳
	}
};

