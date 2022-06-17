sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"

], function (Controller, Fragment, MessageToast) {
	"use strict";

	return Controller.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.input1", {

		onInit: function () {

			var oModelUserSettings = this.getOwnerComponent().getUserSettings();
			//var supplier = oModelUserSettings.getProperty("/_Lifnum");
			//this.setbinding();
			//this.setbinding('10011837');
			//var oModel = this.getView().getModel("ds");
		},
		setbinding: function () {
			var oView = this.getView();
			var that = this;
			
			//sap/opu/odata/sap/ZQM_USSUPNC_SRV/datasetSet(Lfdnr='000001',Lifnum='10009738')
			var path = "/datasetSet(Lfdnr='000001',Lifnum='00000000')";
			var path1 = "ds>" + path;
			
			var oModel =  this.getOwnerComponent().getModel("ds");
			
			var currentdata = oModel.getProperty(path);
			if (currentdata !== undefined) {
				this._do_binding(currentdata, oView, path1);
			} else {

				// Wenn noch nicht geladen dann mit read erst laden
				var promise1 = new Promise(function (resolve, reject) {
					oModel.read(path, {
						success: function (oRetrievedResult) {
							currentdata = oRetrievedResult;
							resolve("success");
						},
						error: function (oError) {
							resolve("error");
						}
					});
				});

				promise1.then(function (result) {
					if (result === "success") {
						that._do_binding(currentdata, oView, path1);
					}
				});
			}
		},
		_do_binding: function (data, VIEW, PATH) {
			var oView = VIEW;
			//var currentdata = data;
			var path1 = PATH;

			//var that = this;

			oView.bindElement({
				path: path1,
				// parameters: {
				// 	expand: "TOVORG,TOPLM,TORESU/TOBEWERTE,TORESU/TOMERKMALE"
				// },
				events: {
					change: this.onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						//that.getOwnerComponent().setBusyView(oView, true);
					},
					dataReceived: function (oEvent) {
						//that.getOwnerComponent().setBusyView(oView, false);
					}
				}
			});
		},
		onBindingChange: function (oEvent) {
			//this._oList.fireUpdateFinished();
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// 	//this._skip_list();
			// }
			// var olist = this.byId("vorgaengeList");
			// var oBinding = olist.getBinding("items");
			// oBinding.refresh();
		},
		handleValueHelpPO: function () {
			if (!this._oValueHelpDialog) {
				Fragment.load({
					name: "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.besthelp",
					controller: this
				}).then(function (oValueHelpDialog) {
					this._oValueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(this._oValueHelpDialog);
					//this._configValueHelpDialog();
					this._oValueHelpDialog.open();
				}.bind(this));
			} else {
				//this._configValueHelpDialog();
				this._oValueHelpDialog.open();
			}
		},
		handleSearchPO: function (oEvent) {
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
		handleClosePO: function (oEvent) {
			//this._oValueHelpDialog.close();
		},
		handleConfirmPO: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel("ds");
			var aContexts = oEvent.getParameter("selectedContexts");
			var path = aContexts[0].sPath;
			var currentline = oModel.getProperty(path);

			if (currentline.Purchaseorder !== '') {
				var oInput = this.byId("PurchaseOrderNo");
				oInput.setValue(currentline.Purchaseorder);
				return true;
			} else {
				oInput.setValue(null);
			}

			//  var oModel = this.getView().getModel(),
			//  	aProducts = oModel.getProperty("/ProductCollection"),
			// 

			// var bHasSelected = aProducts.some(function(oProduct) {
			// 	if (oProduct.selected) {
			// 		oInput.setValue(oProduct.Name);
			// 		return true;
			// 	}
			// });

			// if (!bHasSelected) {
			// 	oInput.setValue(null);
			// }

			// var oModelUserSettings = this.getOwnerComponent().getUserSettings();
			// var supplier = oModelUserSettings.getProperty("/_Lifnum");
			// this.setbinding(currentline.Supplier);

			// oModel.setProperty("/dataset/Lifnum", currentline.Supplier);
			// oModel.setProperty("/dataset/Ebeln", currentline.Purchaseorder);

			// var strs, picpfad, pdfSrc1, file, mime;

			// oModel.read(path, {
			// 	success: function (oData) {

			// 		var fhmnodok = oView.getModel("i18n").getResourceBundle().getText("fhm-nodok");
			// 		if (oData.Filename === "") {
			// 			MessageToast.show(fhmnodok);
			// 			oModel_g.setProperty("/_displayfile/url", "");
			// 			oModel_g.setProperty("/_displayfile/file", "");
			// 			oModel_g.setProperty("/_displayfile/mimetype", "");
			// 			fnResolve("reject");
			// 		} else {
			// 			strs = oData.__metadata.media_src.split("/sap");
			// 			picpfad = "/sap" + strs[1];
			// 			pdfSrc1 = picpfad;
			// 			file = oData.Filename;
			// 			mime = oData.Mimetype;
			// 			oModel_g.setProperty("/_displayfile/url", pdfSrc1);
			// 			oModel_g.setProperty("/_displayfile/file", file);
			// 			oModel_g.setProperty("/_displayfile/mimetype", mime);
			// 			fnResolve("success");
			// 		}
			// 		oDialog.destroy();
			// 	}

			// });
			// 	var aContexts = oEvent.getParameter("selectedContexts");
			// 	if (aContexts && aContexts.length) {
			// 		MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
			// 	} else {
			// 		MessageToast.show("No new item was selected.");
			// 	}
			// 	oEvent.getSource().getBinding("items").filter([]);
		},
	});

});