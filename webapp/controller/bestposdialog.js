sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.bestposdialog", {

		// constructor: function (oView) {
		// 	//this._oView = oView;
		// },

		open: function (title, _soView, oModel, oModel_ds, purchaseorder, fnResolve, fnReject) {
		
			var oView = _soView;
			var oDialog = oView.byId("BestPosDialog");
			//var that = this;
			//var path1 = PFAD + "/TOFHM_V";
			var path1 = "ds>/BestellungSet('" + purchaseorder + "')";

			// if (!oDialog) {
			var oFragmentController = {
				handleClose: function (oEvent) {
					oDialog.destroy();
				},
				handleConfirm: function (oEvent) {
					//var oModel = this.getOwnerComponent().getModel("ds");
					var aContexts = oEvent.getParameter("selectedContexts");
					var path = aContexts[0].sPath;
					var currentline = oModel.getProperty(path);

					if (currentline.Purchaseorderitem !== '') {
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

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.bestposdialog",
				oFragmentController);

			oDialog.setMultiSelect(false);
			oDialog.setTitle(title);
			jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
			
			oDialog.bindElement({
			 	path: path1,
			 	events: {
			// 		//change: this._onBindingChange.bind(this),
			 		dataRequested: function (oEvent) {
			// 			oDialog.setBusy(true);
			 		},
			 		dataReceived: function (oEvent) {
			// 			oDialog.setBusy(false);
			 		}
			 	}
			});
			
			
			oView.addDependent(oDialog);
			oDialog.open();
		}

	}); //end extend
}); //end