
$(function() {

    //var baseUrl = 'http://localhost:51839';

    $.ajax({
        url: baseUrl + "/Home/GetPubSubConfiguration",
        type: "get",
        success: function (data) {
            if (data.PubSubConfiguration != null) {
                var connection = $.hubConnection(data.PubSubConfiguration.SubscriptionUrl + '/signalr/hubs');
                var coreHub = connection.createHubProxy('coreHub');
                coreHub.on('processServerMessage', function(eventName, message) {
                    PubSub.handleServerSentEvent(eventName, message);
                });

                //$.connection.hub.logging = true;
                //connection.start(function () { console.log('connection.onStart'); });
                connection.stateChanged(function(change) { PubSub.onConnectionStateChanged(change); });
                connection.disconnected(function() { PubSub.onConnectionDisconnected(); });
                connection.starting(function() { PubSub.onConnectionStarting(); });
                connection.received(function (dataReceived) { PubSub.onConnectionReceived(dataReceived); });
                connection.error(function(error) { PubSub.onConnectionError(error); });
                connection.connectionSlow(function() { PubSub.onConnectionSlow(); });
                connection.reconnecting(function() { PubSub.onConnectionReconnecting(); });
                connection.reconnected(function() { PubSub.onCconnectionReconnected(); });

                connection.start({ jsonp: true })
                    .done(function () {
                        PubSub.onConnectionStartedOk();
                    })
                    .fail(function(error) {
                        PubSub.onConnectionStartedError(error);
                    });


            }
        },
        error: function() {
        }
    });
});
