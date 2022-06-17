sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.matnrdialog", {

		// constructor: function (oView) {
		// 	//this._oView = oView;
		// },

		open: function (placeholder, title, _soView, oModel, oModel_ds, supplier, fnResolve, fnReject) {

			var oView = _soView;
			var oDialog = oView.byId("MatnrDialog");

			//var path1 = "ds>/BestellungSet('" + purchaseorder + "')";
			var path1 = "ds>/MaterialSet";

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

					if (currentline.Matnr !== '') {
						fnResolve(currentline);
						oDialog.destroy();
						return true;

					} else {
						//oInput.setValue(null);
						oDialog.destroy();
					}

				},
				handleSearch: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					sValue = sValue.replace(new RegExp("_", "g"), "*");

					if (sValue && sValue.length > 3) {
						var oFilter1 = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue);
						// var oFilter2 = new sap.ui.model.Filter("Maktg", sap.ui.model.FilterOperator.Contains, sValue);

						
						var oFilters = new sap.ui.model.Filter({
							filters: [
								oFilter1
								// oFilter2
							],
							and: false
						});

						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter(oFilters);
					}
				}
			};

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.matnrdialog",
				oFragmentController);
            
            
     		//this._oDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0].setPlaceholder("New Placeholder")
            var searchfield = oDialog.getAggregation("_dialog").getSubHeader().getContentMiddle()[0];
            searchfield.setPlaceholder(placeholder);
            // searchfield.setProperty("value", "TEST");
            
			oDialog.setMultiSelect(false);
			oDialog.setTitle(title);
			jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);

			// oDialog.bindElement({
			//  	path: path1,
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

			oView.addDependent(oDialog);
			oDialog.open();
		}

	}); //end extend
}); //end