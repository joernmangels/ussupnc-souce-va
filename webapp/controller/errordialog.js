sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.errordialog", {

		open: function (PFAD, title, _soView, oModel, oModel_ds, fnResolve, fnReject) {

			var oView = _soView;
			var oDialog1 = oView.byId("ErrorDialog");
			var path1 = "ds>" + PFAD;

			var oFragmentController1 = {
				handleClose: function (oEvent) {
					oDialog1.destroy();
				},
				handleConfirm: function (oEvent) {
					var aContexts = oEvent.getParameter("selectedContexts");
					var path = aContexts[0].sPath;
					var currentline = oModel.getProperty(path);

					if (currentline.Errorcode_Key !== '') {
						fnResolve(currentline);
						oDialog1.destroy();
						return true;
					} else {
						oDialog1.destroy();
					}

				}
			};

			oDialog1 = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.errordialog",
				oFragmentController1);

			jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog1);
			oDialog1.setMultiSelect(false);
			oDialog1.setTitle(title);
			oView.addDependent(oDialog1);
			oDialog1.open();
		}

	}); //end extend
}); //end