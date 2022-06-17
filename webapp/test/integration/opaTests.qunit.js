/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});