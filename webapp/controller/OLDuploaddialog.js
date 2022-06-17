sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.uploaddialog", {
			kill: function (oView) {
				var oDialog1 = oView.byId("UploadDialog");
				if (oDialog1) {
					oDialog1.destroy();
				}
			},
			open: function (comp, title, _soView, oModel, oModel_ds) {

				var oView = _soView;
				var oDialog1 = oView.byId("UploadDialog");

				var pathm = oModel.createKey("datasetSet", {
					Lfdnr: '000001',
					Supplier: oModel_ds.getProperty("/_Supplier")
				});
				var pathmm = "/sap/opu/odata/sap/ZQM_USSUPNC_SRV/" + pathm + "/TOFILES";

				var jModel1 = new sap.ui.model.json.JSONModel({
					uploadurl: pathmm
				});

				if (!oDialog1) {
					var oFragmentController1 = {
							handleClose: function (oEvent) {
								//oDialog1.destroy();
								var oUploadCollection = oView.byId("UploadCollection");
								//fnResolve(oUploadCollection);

								comp._uploadCollection = oUploadCollection;
								var cFiles = comp._uploadCollection.getItems().length;
								oModel_ds.setProperty("/_Filescount", cFiles);

								oDialog1.close();
							},
							onChange: function (oEvent) {
								var oUploadCollection = oEvent.getSource();

								// var headerparas = oModel.getHeaders();
								// var token = headerparas["x-csrf-token"];

								// // Header Token
								// var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
								// 	name: "x-csrf-token",
								// 	value: token
								// });
								// oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

								//remove filenames that already exists
								if (oUploadCollection.getItems().length !== 0) {

									//NewFiles:
									var newfiles = oEvent.getParameter("files");
									var listfile;

									for (var i = 0; i < newfiles.length; i++) {
										for (var j = 0; j < oUploadCollection.getItems().length; j++) {
											listfile = oUploadCollection.getItems()[j].getFileName();

											if (listfile === newfiles[i].name) {
												oUploadCollection.removeItem(oUploadCollection.getItems()[j]);
											}
										}
									}

								}

								var text = comp.getModel("i18n").getResourceBundle().getText("uplchange");
								MessageToast.show(text);
							},
							onFilenameLengthExceed: function (oEvent) {
								var text = comp.getModel("i18n").getResourceBundle().getText("filenamelength");
								MessageToast.show(text, {
									duration: 6000, // default
									width: "20em" // default
									// my: "center bottom", // default
									// at: "center bottom", // default
									// of: window, // default
									// offset: "0 0", // default
									// collision: "fit fit", // default
									// onClose: null, // default
									// autoClose: true, // default
									// animationTimingFunction: "ease", // default
									// animationDuration: 1000, // default
									// closeOnBrowserNavigation: true // default
								});

						},
						onFileSizeExceed: function (oEvent) {
							var text = comp.getModel("i18n").getResourceBundle().getText("filesize");
							MessageToast.show(text);
						},
						onBeforeUploadStarts: function (oEvent) {
							// Header Slug
							var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
								name: "slug",
								value: oEvent.getParameter("fileName")
							});
							oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

							// var oCustomerHeaderJoern = new sap.m.UploadCollectionParameter({
							// 	name: "Joern",
							// 	value: "TestTest"
							// });
							// oEvent.getParameters().addHeaderParameter(oCustomerHeaderJoern);

							//var oUploadCollection = oEvent.getSource();

							oModel.refreshSecurityToken();
							var headerparas = oModel.getHeaders();
							var token = headerparas["x-csrf-token"];

							// Header Token
							var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
								name: "x-csrf-token",
								value: token
							});
							//oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
							oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);

							//setTimeout(function () {
							// 	MessageToast.show("Event beforeUploadStarts triggered");
							// }, 4000);
						},
						onUploadComplete: function (oEvent) {
							// var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
							// setTimeout(function () {
							// 	var oUploadCollection = this.byId("UploadCollection");

							// 	for (var i = 0; i < oUploadCollection.getItems().length; i++) {
							// 		if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
							// 			oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
							// 			break;
							// 		}
							// 	}

							// 	// delay the success message in order to see other messages before
							// 	MessageToast.show("Event uploadComplete triggered");
							// }.bind(this), 8000);
						}
				};

				oDialog1 = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.uploaddialog",
					oFragmentController1);

				jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog1);
				//oDialog1.setMultiSelect(false);
				oDialog1.setTitle(title);
				//oDialog1.setModel(oModel, "model");
				oView.addDependent(oDialog1);
			}
			oDialog1.setModel(jModel1, "upl");
			oDialog1.open();
		}

	}); //end extend
}); //end