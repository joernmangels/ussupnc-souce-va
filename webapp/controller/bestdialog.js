sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.bestdialog", {

		// constructor: function (oView) {
		// 	//this._oView = oView;
		// },

		open: function (PFAD, title, _soView, oModel, oModel_ds, fnResolve, fnReject) {
		
			var oView = _soView;
			var oDialog = oView.byId("BestDialog");
			//var that = this;
			//var path1 = PFAD + "/TOFHM_V";
			var path1 = "ds>" + PFAD;

			// if (!oDialog) {
			var oFragmentController = {
				handleSearch: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					sValue = sValue.replace(new RegExp("_", "g"), "*");
					// var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
					// var oBinding = oEvent.getSource().getBinding("items");
					// oBinding.filter([oFilter]);

					if (sValue && sValue.length > 0) {
						//var oFilter1 = new sap.ui.model.Filter("Fhmar", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter1 = new sap.ui.model.Filter("Purchaseorder", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter3 = new sap.ui.model.Filter("Createdbyuser", sap.ui.model.FilterOperator.Contains, sValue);
						// var oFilter3 = new sap.ui.model.Filter("Creationdate", sap.ui.model.FilterOperator.Contains, sValue);
						// var oFilter4 = new sap.ui.model.Filter("Purchaseorderdate", sap.ui.model.FilterOperator.Contains, sValue);

						var oFilters = new sap.ui.model.Filter({
							filters: [
								oFilter1,
								oFilter2,
								oFilter3
								// oFilter4,
								// oFilter5
							],
							and: false
						});
					}

					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(oFilters);
				},
				handleClose: function (oEvent) {
					oDialog.destroy();
				},
				handleConfirm: function (oEvent) {
					//var oModel = this.getOwnerComponent().getModel("ds");
					var aContexts = oEvent.getParameter("selectedContexts");
					var path = aContexts[0].sPath;
					var currentline = oModel.getProperty(path);

					if (currentline.Purchaseorder !== '') {
						// var oInput = oView.byId("PurchaseOrderNo");
						// oInput.setValue(currentline.Purchaseorder);
						fnResolve(currentline);
						oDialog.destroy();
						return true;
						
					} else {
						//oInput.setValue(null);
						oDialog.destroy();
					}
				
				}
			};

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.bestdialog",
				oFragmentController);

			oDialog.setMultiSelect(false);
			oDialog.setTitle(title);

			// oDialog.bindElement({
			//  	path: path1,
			// // 	// parameters: {
			// // 	// 	expand: "TOFHM_V"
			// // 	// },
			//  	events: {
			// // 		//change: this._onBindingChange.bind(this),
			//  		dataRequested: function (oEvent) {
			// // 			oDialog.setBusy(true);
			//  		},
			//  		dataReceived: function (oEvent) {
			// // 			oDialog.setBusy(false);
			//  		}
			//  	}
			// });
			jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oView.addDependent(oDialog);
			oDialog.open();
		}

	}); //end extend
}); //end