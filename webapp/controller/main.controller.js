sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/utils/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"

], function (Controller, Formatter, JSONModel, Fragment) {
	"use strict";

	return Controller.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.controller.main", {
		onInit: function () {

			//this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			var oModel = this.getOwnerComponent().getAppSettings();
			this.getView().setModel(oModel, "appinfo");

			var oModel_ds = this.getOwnerComponent().getDataset();
			this.getView().setModel(oModel_ds, "dataset");

			this.create_load_models();
			
			// var that = this;
			// var oModel1 = this.getOwnerComponent().getModel("ds");
			// oModel1.attachRequestSent(function () {
			// 	that.getView().setBusy(true);
			// });
			// oModel1.attachRequestCompleted(function (oEvent) {
			// 	that.getView().setBusy(false);
			// 	//sap.ui.core.BusyIndicator.hide();
			// 	//that.getOwnerComponent().saveRequestCompleted(oEvent, that.getView());
			// });
			

		},
		onAfterRendering: function () {},
		handleFullscreen1: function (evt) {
			this.getOwnerComponent().handleFullscreen(evt);
		},
		handleLogoPress: function (evt) {
			//MessageToast.show("The ImageContent is pressed.");
			this.getOwnerComponent().openInfoDialog(evt, this);
		},
		create_load_models: function () {

			try {
				// Funktioniert nur über Launchpad (Shell)
				var Username = sap.ushell.Container.getService("UserInfo").getId();
			} catch (err) {
				Username = "SY-UNAME";
			}

			var oModelSettings = new JSONModel({
				_Username: Username,
				_Lifnum: "",
				_Sysid: "",
				_Nodata: false,
				_Input_matnr: false,
				_Data_read: false
			});
			this.getOwnerComponent().setModel(oModelSettings, "USERSETTINGS");

			var that = this;
			var oModel = this.getOwnerComponent().getModel("ds");

			var promise1 = new Promise(function (resolve, reject) {
				var path = "/UserSettingsSet('" + Username + "')";
				oModel.read(path, {
					success: function (oData) {
						var oModelSettings1 = that.getOwnerComponent().getUserSettings();
						oModelSettings1.setProperty("/_Username", oData.Bname);
						oModelSettings1.setProperty("/_Lifnum", oData.Lifnum);
						oModelSettings1.setProperty("/_Sysid", oData.Sysid);
						oModelSettings1.setProperty("/_Nodata", oData.Nodata);
						oModelSettings1.setProperty("/_Input_matnr", oData.Input_matnr);
						// oModelSettings1.setProperty("/_rapid", oData.SRapid);
						// oModelSettings1.setProperty("/_picu", oData.SPicu);
						// oModelSettings1.setProperty("/_autoreload", oData.SAutoreload);
						// oModelSettings1.setProperty("/_autoreload_min", oData.SAutoreloadMin);
						// oModelSettings1.setProperty("/_growingThreshold", oData.SGrowingthreshold);
						// oModelSettings1.setProperty("/_piclist", oData.SPicList);
						// oModelSettings1.setProperty("/_settings_read", true);
						// oModelSettings1.setProperty("/_Super_Access", oData.Super_Access);
						// oModelSettings1.setProperty("/_Log_Deactive", oData.Log_Deactive);
						// oModelSettings1.setProperty("/_Log_Done", false);
						// oModelSettings1.setProperty("/_sysid", oData.SysID);
						// oModelSettings1.setProperty("/_filterzr", oData.SFilterZr);
						
						//nodatapanel auf visible setzen
						var panel1 = that.getView().byId("nodatapanel");
						var panel2 = that.getView().byId("lifnumpanel");
						var panel3 = that.getView().byId("selectpanel");
						if (oData.Nodata) {
							panel1.setVisible(true);
							panel2.setVisible(false);
							panel3.setVisible(false);
						} else {
							panel1.setVisible(false);
							panel2.setVisible(true);
							panel3.setVisible(true);
						}
						
						
						var oModel_ds = that.getOwnerComponent().getDataset();
						oModel_ds.setProperty("/_Supplier", oData.Lifnum);
						resolve('done');
					}

				});
			});

			promise1.then(function (value) {
				that.setbinding();
			});
		},
		setbinding: function (evt) {
			var oView = this.getView();
			var that = this;

			//Bewwirkt, dass UpdateFineshed immer gefeuert wird
			oView.unbindObject("ds");
			oView.setModel(this.getOwnerComponent().getUserSettings(), "userset");

			//var oModel_userset = oView.getModel("userset");
			var oModel_userset = this.getOwnerComponent().getUserSettings();
			var supplier = oModel_userset.getProperty("/_Lifnum");
			if (supplier !== "") {
				oView.bindElement({
					///sap/opu/odata/sap/ZQM_USSUPNC_SRV/UserSettingsSet(Bname='VAR_MANGELS')/TOLIEF
					//path: "ds>/UserSettingsSet(Bname=" + bname + ")/TOLIEF",
					//path: "ds>/UserSettingsSet(Bname='VAR_MANGELS')/TOLIEF",
					path: "ds>/LieferantSet(Supplier='" + supplier + "')",
					// parameters: {
					// 	expand: "TODAS"
					// },
					events: {
						change: this.onBindingChange.bind(this),
						dataRequested: function (oEvent) {
							that.getOwnerComponent().setBusyView(oView, true);
						},
						dataReceived: function (oEvent) {
							that.getOwnerComponent().setBusyView(oView, false);
						}
					}
				});
			}

		},
		setbinding_neu: function (evt) {
			var oView = this.getView();
			var that = this;

			//Bewwirkt, dass UpdateFineshed immer gefeuert wird
			oView.unbindObject("ds");

			//var oModel_userset = oView.getModel("userset");
			//var oModel_userset = this.getOwnerComponent().getUserSettings();
			//var supplier = MODEL_US.getProperty("/_Lifnum");

			var oModel_ds = oView.getModel("dataset");
			var supplier = oModel_ds.getProperty("/_Supplier");

			if (supplier === "") {
				return;
			}

			//oView.setModel(this.getOwnerComponent().getUserSettings(), "userset");

			oView.bindElement({
				///sap/opu/odata/sap/ZQM_USSUPNC_SRV/UserSettingsSet(Bname='VAR_MANGELS')/TOLIEF
				//path: "ds>/UserSettingsSet(Bname=" + bname + ")/TOLIEF",
				//path: "ds>/UserSettingsSet(Bname='VAR_MANGELS')/TOLIEF",
				path: "ds>/LieferantSet(Supplier='" + supplier + "')",
				// parameters: {
				// 	expand: "TODAS"
				// },
				events: {
					change: this.onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						that.getOwnerComponent().setBusyView(oView, true);
					},
					dataReceived: function (oEvent) {
						that.getOwnerComponent().setBusyView(oView, false);
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
		handleValueHelpErr: function (oEvent) {
			this.getOwnerComponent().onerrorDialog(this.getView(), oEvent);
		},
		handleValueHelpPOP: function (oEvent) {
			this.getOwnerComponent().onbestposDialog(this.getView(), oEvent);
		},
		handleValueHelpMAT: function (oEvent) {
			this.getOwnerComponent().onmatnrDialog(this.getView(), oEvent);
		},
		handleValueHelpPO: function (oEvent) {
			this.getOwnerComponent().onbestDialog(this.getView(), oEvent);

			// 	if (!this._oValueHelpDialog) {
			// 		Fragment.load({
			// 			name: "de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.view.besthelp",
			// 			controller: this
			// 		}).then(function (oValueHelpDialog) {
			// 			this._oValueHelpDialog = oValueHelpDialog;
			// 			this.getView().addDependent(this._oValueHelpDialog);
			// 			//this._configValueHelpDialog();
			// 			this._oValueHelpDialog.open();
			// 		}.bind(this));
			// 	} else {
			// 		//this._configValueHelpDialog();
			// 		this._oValueHelpDialog.open();
			// 	}
		},
		onuploadbuttonPress: function (oEvent) {
				this.getOwnerComponent().onuploadbuttonPress(this.getView(), oEvent);
		},
		onQuantityChange: function (oEvent) {
				this.getOwnerComponent().onQuantityChange(this.getView(), oEvent);
		},
		onSegButtonChange: function (oEvent) {
			this.getOwnerComponent().onSegButtonChange(oEvent, this.getView());
		}
			// handleSearchPO: function (oEvent) {
			// 	var sValue = oEvent.getParameter("value");
			// 	sValue = sValue.replace(new RegExp("_", "g"), "*");
			// 	// var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
			// 	// var oBinding = oEvent.getSource().getBinding("items");
			// 	// oBinding.filter([oFilter]);

		// 	if (sValue && sValue.length > 0) {
		// 		//var oFilter1 = new sap.ui.model.Filter("Fhmar", sap.ui.model.FilterOperator.Contains, sValue);
		// 		var oFilter1 = new sap.ui.model.Filter("Purchaseorder", sap.ui.model.FilterOperator.Contains, sValue);
		// 		var oFilter2 = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue);
		// 		var oFilter3 = new sap.ui.model.Filter("Createdbyuser", sap.ui.model.FilterOperator.Contains, sValue);
		// 		// var oFilter3 = new sap.ui.model.Filter("Creationdate", sap.ui.model.FilterOperator.Contains, sValue);
		// 		// var oFilter4 = new sap.ui.model.Filter("Purchaseorderdate", sap.ui.model.FilterOperator.Contains, sValue);

		// 		var oFilters = new sap.ui.model.Filter({
		// 			filters: [
		// 				oFilter1,
		// 				oFilter2,
		// 				oFilter3
		// 				// oFilter4,
		// 				// oFilter5
		// 			],
		// 			and: false
		// 		});
		// 	}

		// 	var oBinding = oEvent.getSource().getBinding("items");
		// 	oBinding.filter(oFilters);
		// },
		// handleClosePO: function (oEvent) {
		// 	//this._oValueHelpDialog.close();
		// },
		// handleConfirmPO: function (oEvent) {
		// 	var oModel = this.getOwnerComponent().getModel("ds");
		// 	var aContexts = oEvent.getParameter("selectedContexts");
		// 	var path = aContexts[0].sPath;
		// 	var currentline = oModel.getProperty(path);

		// 	if (currentline.Purchaseorder !== '') {
		// 		var oInput = this.byId("PurchaseOrderNo");
		// 		oInput.setValue(currentline.Purchaseorder);
		// 		return true;
		// 	} else {
		// 		oInput.setValue(null);
		// 	}

		// 	//  var oModel = this.getView().getModel(),
		// 	//  	aProducts = oModel.getProperty("/ProductCollection"),
		// 	// 

		// 	// var bHasSelected = aProducts.some(function(oProduct) {
		// 	// 	if (oProduct.selected) {
		// 	// 		oInput.setValue(oProduct.Name);
		// 	// 		return true;
		// 	// 	}
		// 	// });

		// 	// if (!bHasSelected) {
		// 	// 	oInput.setValue(null);
		// 	// }

		// 	// var oModelUserSettings = this.getOwnerComponent().getUserSettings();
		// 	// var supplier = oModelUserSettings.getProperty("/_Lifnum");
		// 	// this.setbinding(currentline.Supplier);

		// 	// oModel.setProperty("/dataset/Lifnum", currentline.Supplier);
		// 	// oModel.setProperty("/dataset/Ebeln", currentline.Purchaseorder);

		// 	// var strs, picpfad, pdfSrc1, file, mime;

		// 	// oModel.read(path, {
		// 	// 	success: function (oData) {

		// 	// 		var fhmnodok = oView.getModel("i18n").getResourceBundle().getText("fhm-nodok");
		// 	// 		if (oData.Filename === "") {
		// 	// 			MessageToast.show(fhmnodok);
		// 	// 			oModel_g.setProperty("/_displayfile/url", "");
		// 	// 			oModel_g.setProperty("/_displayfile/file", "");
		// 	// 			oModel_g.setProperty("/_displayfile/mimetype", "");
		// 	// 			fnResolve("reject");
		// 	// 		} else {
		// 	// 			strs = oData.__metadata.media_src.split("/sap");
		// 	// 			picpfad = "/sap" + strs[1];
		// 	// 			pdfSrc1 = picpfad;
		// 	// 			file = oData.Filename;
		// 	// 			mime = oData.Mimetype;
		// 	// 			oModel_g.setProperty("/_displayfile/url", pdfSrc1);
		// 	// 			oModel_g.setProperty("/_displayfile/file", file);
		// 	// 			oModel_g.setProperty("/_displayfile/mimetype", mime);
		// 	// 			fnResolve("success");
		// 	// 		}
		// 	// 		oDialog.destroy();
		// 	// 	}

		// 	// });
		// 	// 	var aContexts = oEvent.getParameter("selectedContexts");
		// 	// 	if (aContexts && aContexts.length) {
		// 	// 		MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().Name; }).join(", "));
		// 	// 	} else {
		// 	// 		MessageToast.show("No new item was selected.");
		// 	// 	}
		// 	// 	oEvent.getSource().getBinding("items").filter([]);
		// },

	});
});