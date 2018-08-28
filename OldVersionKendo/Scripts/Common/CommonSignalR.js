
var PubSub = {
    writeLog: function (message) {
        var now = new Date();
        var strDateTime = [
            [PubSub.addZero(now.getDate()), PubSub.addZero(now.getMonth() + 1), now.getFullYear()].join("/"),
            [PubSub.addZero(now.getHours()), PubSub.addZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
        //console.log(strDateTime + " " + message);
    },

    addZero: function (num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    },

    handleServerSentEvent: function (eventName, message) {
        var title = 'הודעה';

        switch (eventName) {
            case "MerkavaExportPrep":
                title = 'הכנת משלוח למרכב"ה';
                break;
        }
        
        Moj.showMessage(message, undefined, title, MessageType.Message);
    },

    onConnectionStartedOk: function () {
        PubSub.writeLog('connection.hub.success');
    },

    onConnectionStartedError: function (error) {
        PubSub.writeLog('connection.hub.failed: ' + error);
    },

    onConnectionStarting: function () {
        PubSub.writeLog('connection.hub.starting');
    },

    onConnectionSlow: function () {
        PubSub.writeLog('connection.hub.connectionSlow');
    },

    onConnectionDisconnected: function () {
        PubSub.writeLog('connection.hub.disconnected');
    },

    onConnectionReconnecting: function () {
        PubSub.writeLog('connection.hub.reconnecting');
    },

    onCconnectionReconnected: function () {
        PubSub.writeLog('connection.hub.reconnect');
    },

    onConnectionReceived: function (dataReceived) {
        PubSub.writeLog('connection.received: ' + dataReceived.A[0] + ' / ' + dataReceived.A[1]);
    },

    onConnectionError: function (error) {
        PubSub.writeLog('connection.hub.error: ' + error);
    },

    onConnectionStateChanged: function (change) {
        PubSub.writeLog('connection.hub.stateChanged: ' + change.oldState + ' -> ' + change.newState);
    }
};


