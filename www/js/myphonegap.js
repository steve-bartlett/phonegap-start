function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function alertDismissed() {
    // do something
}

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady() {
   document.addEventListener("online", onOnline, false);

	isConnected();
}


function onOnline() {
    startingApp();
}


function startingApp() {

    // need to make sure jqm is loaded
    $.support.cors = true;
    $.mobile.pageLoadErrorMessageTheme = "c";
    $.mobile.allowCrossDomainPages = true;

	$("#goneOffline").popup("close");
	$.mobile.loading('show');
    // $.mobile.changePage( "http://ola.avon.com.au/Login");
	navigator.app.loadUrl = "http://ola.avon.com.au/Login";
}


function checkConnected()
{
		if (navigator.connection == null) {
			return;
		}
		var networkState = navigator.connection.type;

		if ( networkState == Connection.NONE)
		{
        	navigator.notification.alert('You are Still Offline',
            	alertDismissed,  'Offline', 'Done');
		}
		else {
			startingApp();
		}
}

function isConnected() {
	if (navigator.connection == null) {
		return;
	}
	var networkState = navigator.connection.type;

	if (networkState == Connection.NONE) {
		$("#goneOffline").popup("open", "dismissible", false);
		$.mobile.pageLoadErrorMessage = "You are currently Offline";
	}
	else {
		startingApp();
	}
}