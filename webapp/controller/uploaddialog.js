sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/m/library"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox, MobileLibrary) {
	"use strict";

	return UI5Object.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.uploaddialog", {
		kill: function (oView) {
			var oDialog1 = oView.byId("UploadDialog");
			if (oDialog1) {
				oDialog1.destroy();
			}
		},
		open: function (comp, button_close, title, _soView, oModel, oModel_ds) {

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
						var cFiles = comp._uploadCollection.getList().getItems().length;
						oModel_ds.setProperty("/_Filescount", cFiles);

						oDialog1.close();
					},
					// onOpenPressed: function (oEvent) {
					// 	//alert("Hallo");
						
					// // 	var merchandise = oEvent.getSource();
					// // 	this._fileName = merchandise.getFileName();
					// // 	this._download(merchandise)
					// // .then((blob) => {
					// // 	var url = window.URL.createObjectURL(blob);
					// // 	// //open within the browser
					// // 	// window.open(url);

					// // 	//obtain
					// // 	var hyperlink = doc.createElement('a');
					// // 	hyperlink.href = url;
					// // 	hyperlink.setAttribute('obtain', this._fileName);
					// // 	doc.physique.appendChild(hyperlink);
					// // 	hyperlink.click on();
					// // 	doc.physique.removeChild(hyperlink);						
					// // })
					// // .catch((err)=> {
					// // 	console.log(err);
					// // });					
					// // },
						
						
					// },
					onfileSizeExceeded: function (oEvent) {
							var text = comp.getModel("i18n").getResourceBundle().getText("filesize");
							MessageToast.show(text, {
								duration: 6000, // default
								width: "20em" // default
							});
					},
					onfileNameLengthExceeded: function (oEvent) {
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
					onAfterItemAdded: function (oEvent) {
						var oUploadCollection = oEvent.getSource();
						var newitem = oEvent.getParameter("item");
						var filename_new = newitem.getFileName();
						
						newitem.setProgress(100);
						//newitem.setUploadState(sap.m.UploadState.Complete); //Anzeige aus
						//newitem.setUploadState(sap.m.UploadState.Uploading); //Upload läuft
						
						
						
						//remove filenames that already exists
						if (oUploadCollection.getItems().length !== 0) {

							//NewFiles:
							var listfile;

							// for (var i = 0; i < newfiles.length; i++) {
								for (var j = 0; j < oUploadCollection.getItems().length; j++) {
									
							 		listfile = oUploadCollection.getItems()[j].getFileName();

							 		if (listfile === filename_new) {
							 			oUploadCollection.removeItem(oUploadCollection.getItems()[j]);
							 		}
							 	}
							// }

							// oUploadCollection.getItems().forEach(function (oItem) {
							// 	var filename_old = oItem.getFileName();
							// 	if  (filename_new === filename_old) {
							// 		var textd = comp.getModel("i18n").getResourceBundle().getText("upldenied");
							// 		MessageToast.show(textd);
							// 		return;
							// 	}
							// });
						
						}
						

						var filename_check = filename_new.replace(/[^a-zA-Z0-9-_. ]/g, "");
						if ( filename_check !== filename_new) {
							newitem.setFileName(filename_check);
						}
						
						var text = comp.getModel("i18n").getResourceBundle().getText("uplchange");
						MessageToast.show(text);
						
						//var oModel1 = oEvent.getSource().getParent().getModel("upl");
						
						//Keine URL setzen damit es keinen Link gibt.
						// Macht nur Sinn wenn sofort upload 
						// wir machen den Upload ja erst wenn user Button "Daten senden drueckt"
						//var url = oModel1.getProperty("/uploadurl");
						//newitem.setUrl(url);	
						//newitem.attachOpenPressed(this.onOpenPressed.bind(this));
						var oUploadSet = oView.byId("UploadCollection");
						oUploadSet.addItem(newitem);
						
						
						
						
					}
				};

				oDialog1 = sap.ui.xmlfragment(oView.getId(), "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.uploaddialog",
					oFragmentController1);

				jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog1);
				//oDialog1.setMultiSelect(false);
				oDialog1.setTitle(title);
				//oDialog1.setModel(oModel, "model");
				oView.addDependent(oDialog1);
				// Button of Control Upload
				
				oView.byId("close").setText(button_close);
			}
			oDialog1.setModel(jModel1, "upl");

			//var oUploadSet = oView.byId("UploadCollection");
			// oCustomUploader = new CustomUploader();

			// 		oUploadSet.setUploader(oCustomUploader);
			// oUploadSet.registerUploaderEvents(oCustomUploader);

			// Attach separate set of event handlers to demonstrate custom progress monitoring
			// oCustomUploader.attachUploadStarted(this.onUploadStarted.bind(this));
			// oCustomUploader.attachUploadProgressed(this.onUploadProgressed.bind(this));
			// oCustomUploader.attachUploadCompleted(this.onUploadCompleted.bind(this));
			// oCustomUploader.attachUploadAborted(this.onUploadAborted.bind(this));
			//oUploadSet.attachAfterItemAdded(this.onChange.bind(this));
			//oUploadSet.attachAfterItemAdded(this.test.bind(this));

			//oUploadSet.attachFileSizeExceeded(this.onFileSizeExceed.bind(this));
			//var ListMode = MobileLibrary.ListMode;
			//oUploadSet.getList().setMode(ListMode.MultiSelect);

			oDialog1.open();
		}

	}); //end extend
}); //end