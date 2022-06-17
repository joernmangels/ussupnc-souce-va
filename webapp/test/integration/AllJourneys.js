sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.",
		autoWait: true
	});
});