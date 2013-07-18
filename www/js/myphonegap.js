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
	$("#goneOffline").popup("close");
	$.mobile.loading('show');
	$.mobile.changePage( "http://bkvmsmisdev02/onlineappointments.public/Login");
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