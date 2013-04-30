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
	window.location = "https://ola.avon.com.au/Login";;
}

function isConnected() {
	if (navigator.connection == null) {
		return;
	}
	var networkState = navigator.connection.type;

	if (networkState == Connection.NONE) {
		$.mobile.pageLoadErrorMessage = "You are currently Offline";
		$("#goneOffline").popup("open", "dismissible", false);
	}
	else {
		startingApp();
	}
}