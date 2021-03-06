
/** 
    SignalR script to update payment processing result and send message to paymenthub
**/

$(function () {

    var isUnderProcessing = $('#hiddenIsPaymentCurrentlyBeingProcessed').val();
    var doConnectThroughSignalR = (isUnderProcessing == 'True');
    alert(isUnderProcessing);
    
    if (doConnectThroughSignalR == true) {
        // Reference the auto-generated proxy for the hub.  
        var paymentHubObj = $.connection.paymentHub;
        // Create a function that the hub can call back to display messages.
        paymentHubObj.client.postPaymentResults = function(name, message) {

            // Add the message to the page. 
            $('#paymentResults').append('<li><strong>' + htmlEncode(name)
                + '</strong>: ' + htmlEncode(message) + '</li>');
        };

        // Start the connection.
        $.connection.hub.logging = true;
        $.connection.hub.start().done(function() {

            console.log('Now connected, connection ID=' + $.connection.hub.id);

            /** Set groupId in cookie to retrieve on server/hub and add map current connenctionid to this groupid **/
            var groupId = $('#hiddenSignalRGroupId').val();
            alert(groupId);
            setCookie("cookie_signalrgroupid", groupId);

            /** 
                Call PaymentHub's connect method which will map this connectionid to groupid, 
                which will later be used for broadcasting message from server to client using this groupid 
            **/
            paymentHubObj.server.connect(groupId);
        });
    }
});

// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}

function setCookie(cName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = cName + "=" + c_value;
}