sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
		
], function (Controller,JSONModel) {
	"use strict";

	return Controller.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.header", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.header
		 */
		onInit: function () {
			// set the appinfo model
			var masterModel = this.getOwnerComponent().getModel("ds");
			var appVersion = this.getOwnerComponent().getManifestEntry("/sap.app/applicationVersion/version");
			var oModelGlobal = this.getOwnerComponent().create_globalModel(masterModel, appVersion);
			this.getOwnerComponent().setModel(oModelGlobal, "APPINFO");
			
			var oModel_ds = this.getOwnerComponent().create_dataset();
			this.getOwnerComponent().setModel(oModel_ds, "DATASET");
			//this.getOwnerComponent().create_load_usersettings();
			//this.create_load_models();
			
		},
		// 	create_load_models: function () {

		// 	try {
		// 		// Funktioniert nur über Launchpad (Shell)
		// 		var Username = sap.ushell.Container.getService("UserInfo").getId();
		// 	} catch (err) {
		// 		Username = "SY-UNAME";
		// 	}

		// 	var oModelSettings = new JSONModel({
		// 		_Username: Username,
		// 		_Lifnum: "",
		// 		_Sysid: ""
		// 	});
		// 	this.getOwnerComponent().setModel(oModelSettings, "USERSETTINGS");

		// 	var that = this;
		// 	var oModel = this.getOwnerComponent().getModel("ds");

		// 	var promise1 = new Promise(function (resolve, reject) {
		// 		var path = "/UserSettingsSet('" + Username + "')";
		// 		oModel.read(path, {
		// 			success: function (oData) {
		// 				var oModelSettings1 = that.getOwnerComponent().getUserSettings();
		// 				oModelSettings1.setProperty("/_Username", oData.Bname);
		// 				oModelSettings1.setProperty("/_Lifnum", oData.Lifnum);
		// 				oModelSettings1.setProperty("/_sysid", oData.Sysid);
		// 				// oModelSettings1.setProperty("/_rapid", oData.SRapid);
		// 				// oModelSettings1.setProperty("/_picu", oData.SPicu);
		// 				// oModelSettings1.setProperty("/_autoreload", oData.SAutoreload);
		// 				// oModelSettings1.setProperty("/_autoreload_min", oData.SAutoreloadMin);
		// 				// oModelSettings1.setProperty("/_growingThreshold", oData.SGrowingthreshold);
		// 				// oModelSettings1.setProperty("/_piclist", oData.SPicList);
		// 				// oModelSettings1.setProperty("/_settings_read", true);
		// 				// oModelSettings1.setProperty("/_Super_Access", oData.Super_Access);
		// 				// oModelSettings1.setProperty("/_Log_Deactive", oData.Log_Deactive);
		// 				// oModelSettings1.setProperty("/_Log_Done", false);
		// 				// oModelSettings1.setProperty("/_sysid", oData.SysID);
		// 				// oModelSettings1.setProperty("/_filterzr", oData.SFilterZr);
		// 				resolve('done');
		// 			}

		// 		});
		// 	});

		// 	promise1.then(function (value) {
		// 		//that.setbinding();
		// 	});
		// },
		// create_load_models: function () {

		// 	try {
		// 		// Funktioniert nur über Launchpad (Shell)
		// 		var Username = sap.ushell.Container.getService("UserInfo").getId();
		// 	} catch (err) {
		// 		Username = "SY-UNAME";
		// 	}

		// 	var oModelSettings = new JSONModel({
		// 		_Username: Username,
		// 		_Lifnum: "",
		// 		_Sysid: ""
		// 	});
		// 	this.getOwnerComponent().setModel(oModelSettings, "USERSETTINGS");

		// 	var that = this;
		// 	var oModel = this.getOwnerComponent().getModel("ds");

		// 	var promise1 = new Promise(function (resolve, reject) {
		// 		var path = "/UserSettingsSet('" + Username + "')";
		// 		oModel.read(path, {
		// 			success: function (oData) {
		// 				var oModelSettings1 = that.getOwnerComponent().getUserSettings();
		// 				oModelSettings1.setProperty("/_Username", oData.Bname);
		// 				oModelSettings1.setProperty("/_Lifnum", oData.Lifnum);
		// 				oModelSettings1.setProperty("/_sysid", oData.Sysid);
		// 				// oModelSettings1.setProperty("/_rapid", oData.SRapid);
		// 				// oModelSettings1.setProperty("/_picu", oData.SPicu);
		// 				// oModelSettings1.setProperty("/_autoreload", oData.SAutoreload);
		// 				// oModelSettings1.setProperty("/_autoreload_min", oData.SAutoreloadMin);
		// 				// oModelSettings1.setProperty("/_growingThreshold", oData.SGrowingthreshold);
		// 				// oModelSettings1.setProperty("/_piclist", oData.SPicList);
		// 				// oModelSettings1.setProperty("/_settings_read", true);
		// 				// oModelSettings1.setProperty("/_Super_Access", oData.Super_Access);
		// 				// oModelSettings1.setProperty("/_Log_Deactive", oData.Log_Deactive);
		// 				// oModelSettings1.setProperty("/_Log_Done", false);
		// 				// oModelSettings1.setProperty("/_sysid", oData.SysID);
		// 				// oModelSettings1.setProperty("/_filterzr", oData.SFilterZr);
		// 				resolve('done');
		// 			}

		// 		});
		// 	});

		// 	promise1.then(function (value) {
		// 		//that.setbinding();
		// 	});
		// },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.header
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.header
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.header
		 */
		//	onExit: function() {
		//
		//	}

	});

});