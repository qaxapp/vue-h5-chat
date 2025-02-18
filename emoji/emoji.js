import anchorme from "anchorme";
import twemoji from "twemoji";
import Config from "../config";

const emoji = [];


function parser(text) {
	return text;
		// 把 emoji 表情解析成 image - 废弃
    // var decodeText = anchorme({
    //     input: text,
    //     options: {
    //         attributes: {
    //             target: "_blank",
    //         }
		//
    //     }
    // });
		//
    // let emoji = twemoji.parse(decodeText);
    // emoji = emoji.replace(/src="https:\/\/twemoji\.maxcdn\.com\/v\/[0-9.]+\//g, 'src="' +  Config.emojiBaseUrl())
    // return emoji;
}

function normalize(text = '') {
    var matchs = text.match(/<span class="emoji emoji[0-9a-fA-F]+"><\/span>/g) || [];
    var decodeText = text;

    try {
        matchs.map(e => {
            // Decode utf16 to emoji
            var emojiCode = e.match(/emoji([0-9a-fA-F]+)/)[1].substr(0, 5);
            var emoji = String.fromCodePoint(parseInt(emojiCode, 16));
            text = decodeText = text.split(e).join(emoji);
        });
    } catch (ex) {
        console.error('Failed decode %s: %o', text, ex);
    }
    return decodeText;
}

export {emoji, parser, normalize};
