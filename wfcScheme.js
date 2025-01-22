export default class WfcScheme {
    static QR_CODE_PREFIX_PC_SESSION = "imdemo://pcsession/";
    static QR_CODE_PREFIX_USER = "imdemo://user/";
    static QR_CODE_PREFIX_GROUP = "imdemo://group/";
    static QR_CODE_PREFIX_CHANNEL = "imdemo://channel/";
    static QR_CODE_PREFIX_CONFERENCE = "imdemo://conference/";

    static buildConferenceLink(conferenceId, password) {
        let link = WfcScheme.QR_CODE_PREFIX_CONFERENCE + conferenceId;
        if (password) {
            link += '/?pwd=' + password
        }
        return link;
    }
}
