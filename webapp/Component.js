sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/model/models",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/bestdialog",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/bestposdialog",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/errordialog",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/uploaddialog",
	"de/enercon/ussupnc/USSUPNC-Supplier-NC-Notification-Frontend/controller/matnrdialog"

], function (UIComponent, Device, JSONModel, MessageBox, MessageToast, models, bestDialog, bestposDialog, errorDialog, uploadDialog,
	matnrDialog) {
	"use strict";

	return UIComponent.extend("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			// set the appinfo model
			var masterModel = this.getModel("ds");
			var appVersion = this.getManifestEntry("/sap.app/applicationVersion/version");
			var oModelGlobal = this.create_globalModel(masterModel, appVersion);
			this.setModel(oModelGlobal, "APPINFO");

			var oModel_ds = this.create_dataset();
			this.setModel(oModel_ds, "DATASET");

			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			//this.getRouter().initialize();

			//Upload-Collecion
			//this._uploadCollection = new sap.m.UploadCollection();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//BestDialog
			this._bestDialog = new bestDialog(this.getAggregation("rootControl"));
			//BestPosDialog
			this._bestposDialog = new bestposDialog(this.getAggregation("rootControl"));
			//ErrorDialog
			this._errorDialog = new errorDialog(this.getAggregation("rootControl"));
			//UploadDialog
			this._uploadDialog = new uploadDialog(this.getAggregation("rootControl"));
			//MatnrDialog
			this._matnrDialog = new matnrDialog(this.getAggregation("rootControl"));
		},
		// create_load_usersettings: function (resolve, reject) {

		// 	try {
		// 		// Funktioniert nur über Launchpad (Shell)
		// 		var Username = sap.ushell.Container.getService("UserInfo").getId();
		// 	} catch (err) {
		// 		Username = "SY-UNAME";
		// 	}

		// 	var oModelSettings = new JSONModel({
		// 		_Username: Username,
		// 		_Lifnum: "",
		// 		_Sysid: "",
		// 		_Nodata: false
		// 	});

		// 	this.setModel(oModelSettings, "USERSETTINGS");

		// 	var that = this;
		// 	var oModel = this.getModel("ds");

		// 	//var promise1 = new Promise(function (resolve, reject) {
		// 	var path = "/UserSettingsSet('" + Username + "')";
		// 	oModel.read(path, {
		// 		success: function (oData) {
		// 			var oModelSettings1 = that.getUserSettings();
		// 			oModelSettings1.setProperty("/_Username", oData.Bname);
		// 			oModelSettings1.setProperty("/_Lifnum", oData.Lifnum);
		// 			oModelSettings1.setProperty("/_Sysid", oData.Sysid);
		// 			oModelSettings1.setProperty("/_Nodata", oData.Nodata);

		// 			var oModel_ds = that.getDataset();
		// 			oModel_ds.setProperty("/_Supplier", oData.Lifnum);
		// 			resolve('done');
		// 		}

		// 	});
		// 	//});

		// 	//promise1.then(function (value) {
		// 	//	that.setbinding();
		// 	//});
		// },

		create_dataset: function () {

			var oModel = new JSONModel({
				_Supplier: "",
				_Ebeln: "",
				_Ebelp: "",
				_Matnr: "",
				_Maktx: "",
				_Smatnr: "",
				_Textl: "",
				_Qmnam: "",
				_Serchg: "",
				_Rkmng: "",
				_Mgein: "",
				_Eneap: "",
				_Errorcode: "",
				_Errorcode_Key: "",
				_Filescount: "0",
				_Bzmng: "",
				_InputQuan: true,
				_Input_art: "B",
				_Input_Ser_Charg: true
					// _Charg: "",
			});
			return oModel;
		},
		create_globalModel: function (mastermodel, version) {
			var complete_url = window.location.href;
			var pieces = complete_url.split("/");
			var url = pieces[2];

			var language = sap.ui.getCore().getConfiguration().getLanguage();

			var imagepath;
			var launchpad = false;
			var path = jQuery.sap.getModulePath("de.enercon.ussupnc.USSUPNC-Supplier-NC-Notification-Frontend");
			switch (path) {
			case ".":
				imagepath = "image";
				break;
			default:
				imagepath = path + "/image";
				launchpad = true;
				break;
			}

			var oModelGlobal = new JSONModel({
				_url: url,
				_langu: language,
				_phone: Device.system.phone,
				_tablet: Device.system.tablet,
				_desktop: Device.system.desktop,
				_launchpad: launchpad,
				_clock1: "",
				_clock2: "",
				_AppVersion: version,
				_imagepath: imagepath,
				_appWidthLimited: true

				// _navpanel_expanded: true,
				// _autosave: false,
				// _ViewPos: "",
				// _DisplayTiles: false,
				// _DisplayNoTiles: false,
				// _displayfile: {
				// 	url: "",
				// 	file: "",
				// 	mimetype: ""
				//}

			});

			// CLock
			var that = this;
			setInterval(function () {
				that.SetClock(oModelGlobal);
			}, 1000);

			return oModelGlobal;
		},
		getDataset: function () {
			return this.getModel("DATASET");
		},
		getUserSettings: function () {
			return this.getModel("USERSETTINGS");
		},
		getAppSettings: function () {
			return this.getModel("APPINFO");
		},
		setBusyView: function (oView, bool) {
			oView.setBusy(bool);
		},
		// create_load_usersettings: function () {

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
		// 			// _rapid: true,
		// 			// _picu: false,
		// 			// _autoreload: false,
		// 			// _autoreload_min: parseFloat("3"),
		// 			// _autoreload_except_recordresults: false,
		// 			// _autoreload_pg_percent: parseFloat("100"),
		// 			// _autoreload_pg_time: "",
		// 			// _autoreload_fin_time: new Date(),
		// 			// _growingThreshold: 15,
		// 			// _piclist: false,
		// 			// _settings_read: false,
		// 			// _Super_Access: false,
		// 			// _Log_Deactive: true,
		// 			// _Log_Done: false,
		// 			// _filterzr: false
		// 	});
		// 	this.setModel(oModelSettings, "USERSETTINGS");

		// 	var that = this;
		// 	var oModel = this.getModel("ds");

		// 	var promise1 = new Promise(function (resolve, reject) {
		// 		var path = "/UserSettingsSet('" + Username + "')";
		// 		oModel.read(path, {
		// 			success: function (oData) {
		// 				var oModelSettings1 = that.getUserSettings();
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
		// 		// 	return 'X';
		// 		// 	//return done('done');
		// 		// 	// that.handleautoreload_new();
		// 		// 	// var oModelSettings1 = that.getUserSettings();
		// 		// 	// var lifnum = oModelSettings1.getProperty("/_Lifnum");
		// 		// 	// 	// var path = "/datasetSet(Lfdnr='000001',Lifnum='" + lifnum +"')";
		// 		// 	// 	// oModel.read(path, {
		// 		// 	// 	// 	success: function (oData) {
		// 		// 	// 	// 	}
		// 		// 	// 	// });
		// 		// 	// 	var oModel = that.getModel("ds");
		// 		// 	// 	var pathm = oModel.createKey("datasetSet", {
		// 		// 	// 	Lfdnr: '000001',
		// 		// 	// 	Lifnum: lifnum
		// 		// 	// });
		// 		// 	// var pathmm = "/" + pathm;
		// 		// 	// var currentdatam = oModel.getProperty(pathmm);

		// 	});
		// },
		SetClock: function (OMODEL) {
			var datum = new Date();
			//datum.toLocaleString();
			var nhour = ("00" + datum.getHours()).slice(-2);
			var nmin = ("00" + datum.getMinutes()).slice(-2);
			var nsec = ("00" + datum.getSeconds()).slice(-2);

			var uhrzeit = nhour + ":" + nmin + ":" + nsec;

			//var oModel = this.getModel("GLOBAL");
			OMODEL.setProperty("/_clock1", datum);
			OMODEL.setProperty("/_clock2", uhrzeit);
		},
		handleFullscreen: function (evt) {

			var oModel = this.getAppSettings();

			if (evt.getSource().getPressed()) {
				oModel.setProperty("/_appWidthLimited", false);
			} else {
				oModel.setProperty("/_appWidthLimited", true);
			}
		},
		openInfoDialog: function (EVT, THIS) {
			var title = this.getModel("i18n").getResourceBundle().getText("title");
			var appResponsible1 = this.getModel("i18n").getResourceBundle().getText("appResponsible1");
			var appResponsible2 = this.getModel("i18n").getResourceBundle().getText("appResponsible2");
			var oModelg = this.getAppSettings();
			var oModel = this.getModel("clog");
			var content = [];

			if (!THIS.oFixedSizeDialog) {

				// image
				var imagepath = oModelg.getProperty("/_imagepath");
				imagepath = imagepath + '/en_logo.png';
				var image = new sap.m.Image({
					src: imagepath,
					alt: "test image",
					decorative: false,
					height: "50px",
					widht: "100px",
					error: function () {
						this.setSrc("ERROR IMAGE PATH");
					}
				});
				content.push(image);

				//vbox
				var vbox = new sap.m.VBox();
				content.push(vbox);

				//Status
				var status1 = new sap.m.ObjectStatus({
					class: "sapUiSmallMarginBottom",
					text: appResponsible1,
					inverted: true,
					state: "Success",
					icon: "sap-icon://accept"
				});
				content.push(status1);
				var status2 = new sap.m.ObjectStatus({
					class: "sapUiSmallMarginBottom",
					text: appResponsible2,
					inverted: true,
					state: "Success",
					icon: "sap-icon://accept"
				});
				content.push(status2);

				//List
				//var jsondata = oModel.getJSON();

				var oSorter = new sap.ui.model.Sorter({
					path: 'version',
					descending: true
				});

				// var oList = new sap.m.List({
				// 		items: {path: "/Changelog", 
				// 		sorter: oSorter
				// 	}
				// });
				// content.push(oList);

				// // Simple List in a Page
				// new sap.m.App({
				// 	pages: [
				// 		new sap.m.Page({
				// 			title: "Sorted Groupings",
				// 			content: [
				// 				new sap.m.List("list", {
				// 					items: {
				// 						path: '/records',
				// 						template: new sap.m.StandardListItem({
				// 							title: '{value}'
				// 						}),
				// 						sorter: oSorter
				// 					}
				// 				})
				// 			]
				// 		})
				// 	]
				// }).placeAt("content");

				var list = new sap.m.List();
				// var list = new sap.m.List("list", {	items: {
				//  						path: '/Changelog',
				//  						template: new sap.m.StandardListItem({
				// 							title: "{version}",
				// 							description: "{features}",
				// 							info: "{release}"
				//  						}),
				//  						sorter: oSorter
				//  					}
				// });

				list.setModel(oModel).bindItems("/Changelog",
					new sap.m.StandardListItem({
						title: "{version}",
						description: "{features}",
						info: "{release}"
					}), oSorter
				);
				//var content = new sap.ui.core.Control();					
				//content.push(list);	
				//content.addCustomData(list);
				//content.addAggregation(list);
				content.push(list);

				THIS.oFixedSizeDialog = new sap.m.Dialog({

					title: title,
					contentWidth: "600px",
					contentHeight: "400px",
					content: content,
					titleAlignment: "Center",
					// content: new sap.m.List({
					// 	items: "",

					// 	// items: {
					// 	// 	path: jsondata,
					// 	// 	//path: "{ path: 'clog>/Changelog', sorter: { path: 'version', descending: true } }",
					// 	// 	//path: "oModel>/Changelog', sorter: { path: 'version', descending: true } }",
					// 	template: new sap.m.StandardListItem({
					// 			title: "{version}",
					// 			description: "{features}"
					// 		})
					// 		//}
					//}),
					endButton: new sap.m.Button({
						text: "OK",
						press: function () {
							THIS.oFixedSizeDialog.close();
						}.bind(THIS)
					})
				});

				//to get access to the controller's model
				THIS.getView().addDependent(this.oFixedSizeDialog);
			}

			THIS.oFixedSizeDialog.open();
		},
		handleSaving: function (OVIEW, EVT) {
			// // oModel.read("/dataset(Supplier='10011837')", {
			// oModel.read("/LieferantSet(Supplier='0010011837')/TODAS", {
			// 	success: function (oData, oResponse) {
			// 		// oJsonModel.setData(oData);
			// 		// this.getView().setModel(oJsonModel, "readModel");
			// 		// oJsonModel.refresh(true);
			// 	},
			// 	error: function (oError) {}
			// }, this);

			// 			var title = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
			// var message = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-message");
			// var nosave = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			// var _c_this = this;
			// var oModel = view.getView().getModel("pl");

			var title1 = this.getModel("i18n").getResourceBundle().getText("save");
			var savemess = this.getModel("i18n").getResourceBundle().getText("savemess");
			var that = this;

			// if (oModel_ds.hasPendingChanges()) {
			MessageBox.confirm(
				savemess, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: title1,
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							//_this.getModel("detailView").setProperty("/busy", true);
							that.savedata(OVIEW);
						}
					}
				});
			// } else {
			// 	//sap.m.MessageToast.show(nosave);
			// }

		},
		// _create_user_access_log: function (target, globalmodel, usersettingsmodel) {
		// 	var dat = new Date();
		// 	var jahr = dat.getFullYear();
		// 	var monat = dat.getMonth() + 1;
		// 	monat = ("0" + monat).slice(-2);
		// 	var tag = dat.getDate();
		// 	tag = ("0" + tag).slice(-2);
		// 	var stunde = dat.getHours();
		// 	stunde = ("0" + stunde).slice(-2);
		// 	var minute = dat.getMinutes();
		// 	minute = ("0" + minute).slice(-2);
		// 	var sekunde = dat.getSeconds();
		// 	sekunde = ("0" + sekunde).slice(-2);

		// 	var oLog = {};
		// 	oLog.Bname = usersettingsmodel.getProperty("/_Username");
		// 	oLog.Adatum = jahr + monat + tag;
		// 	oLog.Auzeit = stunde + minute + sekunde;
		// 	oLog.Browser = sap.ui.Device.browser.name;
		// 	oLog.Os = sap.ui.Device.os.name;

		// 	if (sap.ui.Device.system.tablet) {
		// 		oLog.Frontend = '1';
		// 	}
		// 	if (sap.ui.Device.system.phone) {
		// 		oLog.Frontend = '2';
		// 	}
		// 	if (sap.ui.Device.system.desktop) {
		// 		oLog.Frontend = '3';
		// 	}
		// 	if (sap.ui.Device.system.combi) {
		// 		oLog.Frontend = '4';
		// 	}

		// 	oLog.Launchpad = globalmodel.getProperty("/_launchpad");
		// 	oLog.URL = globalmodel.getProperty("/_url");

		// 	// var system = globalmodel.getProperty("/_system");
		// 	// if (system === 'WebIde-SCP') {
		// 	// 	oLog.ERP = "IDE";
		// 	// } else {
		// 	// 	oLog.ERP = system;
		// 	// }
		// 	oLog.ERP = usersettingsmodel.getProperty("/_sysid");
		// 	oLog.Target = target;

		// 	var oModel = this.getModel("pl");

		// 	oModel.create("/UserAccessLogSet", oLog, {
		// 		method: "POST",
		// 		success: function (data) {
		// 			//alert("success");
		// 			//Wenn erfolgreich Matnr/Sernr merken 
		// 			// var oModelSernr = _this.getOwnerComponent().getModel("lastsernr");
		// 			// oModelSernr.setProperty("/_LASTSERNR", oEntry.Sernr);
		// 			// oModelSernr.setProperty("/_LASTMATNR", oEntry.Matnr);

		// 		},
		// 		error: function (e) {
		// 			//alert("error");
		// 		}
		// 	});

		// },		
		onbestDialog: function (oView, evt) {
			var title1 = this.getModel("i18n").getResourceBundle().getText("po");
			var title2 = this.getModel("i18n").getResourceBundle().getText("select");
			var title = title1 + " " + title2;

			var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();

			var path = oView.getBindingContext("ds").sPath;
			var currentdata = oModel.getProperty(path);
			//var title = title + ":" + " " + Number(currentdata.Supplier);
			var title = title + ":" + " " + currentdata.Suppliername;

			var that = this;

			var promise_d = new Promise(function (resolve, reject) {
				that._bestDialog.open(path, title, oView, oModel, oModel_ds, resolve, reject);
			});
			promise_d.then(function (data) {
				if (data.Purchaseorder !== "") {
					var oInput = oView.byId("PurchaseOrderNo");
					oInput.setValue(data.Purchaseorder);
				} else {
					oInput.setValue(null);
				}
				var oInputsi = oView.byId("PurchaseOrderItem");
				if (data.Singleitem !== "") {

					oInputsi.setValue(data.Singleitem);

					var path1 = "/BestellPosSet(Purchaseorder='" + data.Purchaseorder + "',Purchaseorderitem='" + data.Singleitem + "')";
					oModel.read(path1, {
						success: function (oData) {
							oModel_ds.setProperty("/_Matnr", oData.Material);
							oModel_ds.setProperty("/_Maktx", oData.Purchaseorderitemtext);
							oModel_ds.setProperty("/_Smatnr", oData.Suppliermaterialnumber);
							oModel_ds.setProperty("/_Mgein", oData.Baseunit);
							oModel_ds.setProperty("/_Bzmng", oData.Orderquantity);
							if (!oData.SerialMat && !oData.SerialMat) {
								oModel_ds.setProperty("/_Input_Ser_Charg", false);
							} else {
								oModel_ds.setProperty("/_Input_Ser_Charg", true);
							}
							if (oData.SerialMat) {
								oModel_ds.setProperty("/_Rkmng", "1");
								oModel_ds.setProperty("/_InputQuan", false);
							} else {
								oModel_ds.setProperty("/_InputQuan", true);
								if (oData.Orderquantity === "1") {
									oModel_ds.setProperty("/_Rkmng", oData.Orderquantity);
								} else {
									oModel_ds.setProperty("/_Rkmng", "");
								}
							}
							//resolve('resolved');
						}
					});

				} else {
					oInputsi.setValue(null);
					that.onbestposDialog(oView, evt);
				}
			});

		},
		onbestposDialog: function (oView, evt) {
			var title1 = this.getModel("i18n").getResourceBundle().getText("pop");
			var title2 = this.getModel("i18n").getResourceBundle().getText("select");
			var title = title1 + " " + title2;

			var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();
			var bestellung = oModel_ds.getProperty("/_Ebeln");

			//var path = oView.getBindingContext("ds").sPath;
			//var currentdata = oModel.getProperty(path);
			//var title = title + ":" + " " + Number(currentdata.Supplier);
			var title = title + ":" + " " + bestellung;

			var that = this;

			var promise_d = new Promise(function (resolve, reject) {
				that._bestposDialog.open(title, oView, oModel, oModel_ds, bestellung, resolve, reject);
			});

			promise_d.then(function (bestpos) {
				if (bestpos.Purchaseorderitem !== "") {
					var oInput = oView.byId("PurchaseOrderItem");
					oInput.setValue(bestpos.Purchaseorderitem);
					oModel_ds.setProperty("/_Matnr", bestpos.Material);
					oModel_ds.setProperty("/_Maktx", bestpos.Purchaseorderitemtext);
					oModel_ds.setProperty("/_Smatnr", bestpos.Suppliermaterialnumber);
					oModel_ds.setProperty("/_Mgein", bestpos.Baseunit);
					oModel_ds.setProperty("/_Bzmng", bestpos.Orderquantity);
					if (!bestpos.SerialMat && !bestpos.SerialMat) {
						oModel_ds.setProperty("/_Input_Ser_Charg", false);
					} else {
						oModel_ds.setProperty("/_Input_Ser_Charg", true);
					}
					if (bestpos.SerialMat) {
						oModel_ds.setProperty("/_Rkmng", "1");
						oModel_ds.setProperty("/_InputQuan", false);
					} else {
						oModel_ds.setProperty("/_InputQuan", true);
						if (bestpos.Orderquantity === "1") {
							oModel_ds.setProperty("/_Rkmng", bestpos.Orderquantity);
						} else {
							oModel_ds.setProperty("/_Rkmng", "");
						}
					}

				} else {
					oInput.setValue(null);
				}
			});

		},
		onmatnrDialog: function (oView, evt) {
			var matinput = this.getModel("i18n").getResourceBundle().getText("matinput");
			var title1 = this.getModel("i18n").getResourceBundle().getText("mat");
			var title2 = this.getModel("i18n").getResourceBundle().getText("select");
			var title = title1 + " " + title2;

			var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();
			var supplier = oModel_ds.getProperty("/_Supplier");
			//var title = title + ":" + " " + bestellung;

			var that = this;

			var promise_d = new Promise(function (resolve, reject) {
				that._matnrDialog.open(matinput, title, oView, oModel, oModel_ds, supplier, resolve, reject);
			});

			promise_d.then(function (material) {
				if (material.Matnr !== "") {
					var oInput = oView.byId("MaterialNo");
					oInput.setValue(material.Matnr);
					oModel_ds.setProperty("/_Matnr", material.Matnr);
					oModel_ds.setProperty("/_Maktx", material.Maktg);
					oModel_ds.setProperty("/_Ebeln", "");
					oModel_ds.setProperty("/_Ebelp", "");
					oModel_ds.setProperty("/_Mgein", "ST");
					// oModel_ds.setProperty("/_InputQuan", true);
					oModel_ds.setProperty("/_Rkmng", "1");
					oModel_ds.setProperty("/_InputQuan", false);
					// oModel_ds.setProperty("/_Smatnr", bestpos.Suppliermaterialnumber);
					// oModel_ds.setProperty("/_Mgein", bestpos.Baseunit);
					// oModel_ds.setProperty("/_Bzmng", bestpos.Orderquantity);
					// if (bestpos.SerialMat) {
					// 	oModel_ds.setProperty("/_Rkmng", "1");
					// 	oModel_ds.setProperty("/_InputQuan", false);
					// } else {
					// 	oModel_ds.setProperty("/_InputQuan", true);
					// 	if (bestpos.Orderquantity === "1") {
					// 		oModel_ds.setProperty("/_Rkmng", bestpos.Orderquantity);
					// 	} else {
					// 		oModel_ds.setProperty("/_Rkmng", "");
					// 	}
					// }
				} else {
					oInput.setValue(null);
				}
			});

		},
		onerrorDialog: function (oView, evt) {
			var title1 = this.getModel("i18n").getResourceBundle().getText("errorcode");
			var title2 = this.getModel("i18n").getResourceBundle().getText("select");
			var title = title1 + " " + title2;

			var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();

			var path = oView.getBindingContext("ds").sPath;
			//var currentdata = oModel.getProperty(path);

			var that = this;

			var promise_d = new Promise(function (resolve, reject) {
				that._errorDialog.open(path, title, oView, oModel, oModel_ds, resolve, reject);
			});
			promise_d.then(function (data) {
				if (data.Errorcode_Key !== "") {
					var oInput = oView.byId("errorcode");
					oInput.setValue(data.Errorcode);
					oModel_ds.setProperty("/_Errorcode_Key", data.Errorcode_Key);
				} else {
					oInput.setValue(null);
				}
			});

		},
		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				// if (!sap.ui.Device.support.touch) {
				this._sContentDensityClass = "sapUiSizeCompact";
				// } else {
				//	this._sContentDensityClass = "sapUiSizeCozy";
				//}
			}
			return this._sContentDensityClass;
		},
		onQuantityChange: function (oView, evt) {
			var message1 = this.getModel("i18n").getResourceBundle().getText("quan_max");
			var message2 = this.getModel("i18n").getResourceBundle().getText("quan_zero");

			//var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();
			var oInput = evt.getSource();

			var eingabe = parseInt(oInput.getValue());

			//			if (oInput.getValue() < "1") {
			if (eingabe < 1) {
				MessageBox.error(message2, {
					styleClass: "sapUiSizeCompact",
					contentWidth: "100px"
				});
				oInput.setValueState(sap.ui.core.ValueState.Error);
				return;
			} else {
				oInput.setValueState(sap.ui.core.ValueState.None);
			}

			//Nur bei Bestellungen
			if (oModel_ds.getProperty("/_Ebeln") !== "") {
				var menge = parseInt(oModel_ds.getProperty("/_Bzmng"));

				//if (oInput.getValue() > oModel_ds.getProperty("/_Bzmng")) {
				if (eingabe > menge) {
					MessageBox.error(message1 + " " + oModel_ds.getProperty("/_Bzmng"), {
						styleClass: "sapUiSizeCompact",
						contentWidth: "100px"
					});
					oInput.setValueState(sap.ui.core.ValueState.Error);
				} else {
					oInput.setValueState(sap.ui.core.ValueState.None);
				}
			}

		},
		onuploadbuttonPress: function (oView, evt) {
			var title = this.getModel("i18n").getResourceBundle().getText("uploadbutton_d");
			var button_close = this.getModel("i18n").getResourceBundle().getText("close_upl");
			//var title2 = this.getModel("i18n").getResourceBundle().getText("select");
			//var title = title1 + " " + title2;

			var oModel = this.getModel("ds");
			var oModel_ds = this.getDataset();

			//var supplier = oModel_ds.getProperty("/_Supplier");

			//var path = oView.getBindingContext("ds").sPath;
			//var currentdata = oModel.getProperty(path);

			//var that = this;

			// var promise_u = new Promise(function (resolve, reject) {
			this._uploadDialog.open(this, button_close, title, oView, oModel, oModel_ds);
			this._oViewMain = oView;

			// });
			// promise_u.then(function (uplcoll) {
			// 	that._uploadCollection = uplcoll;
			// 	var cFiles = that._uploadCollection.getItems().length;
			// 	oModel_ds.setProperty("/_Filescount", cFiles);
			// });

		},
		onSegButtonChange: function (EVENT, VIEW) {
			var title1 = this.getModel("i18n").getResourceBundle().getText("achtung");
			var savemess = this.getModel("i18n").getResourceBundle().getText("dataloss");

			var oSegButton = VIEW.byId("segbutton");

			var oModel_ds = this.getDataset();
			var selected = EVENT.getParameter('item').getKey();
			if (selected === 'M') {
				var selected_no = 'B';
			}
			if (selected === 'B') {
				var selected_no = 'M';
			}

			var that = this;
			if (oModel_ds.getProperty("/_Ebeln") !== '' || oModel_ds.getProperty("/_Matnr") !== '') {

				MessageBox.confirm(
					savemess, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title1,
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								oModel_ds.setProperty("/_Input_art", selected);
								that.cleardata();
							}
							if (oAction === sap.m.MessageBox.Action.NO) {
								oModel_ds.setProperty("/_Input_art", selected_no);
								oSegButton.setSelectedKey(selected_no);
							}
						}
					});
			} else {
				oModel_ds.setProperty("/_Input_art", selected);
			}

		},
		cleardata: function () {
			var oModel_ds = this.getDataset();
			oModel_ds.setProperty("/_Ebeln", "");
			oModel_ds.setProperty("/_Ebelp", "");
			oModel_ds.setProperty("/_Matnr", "");
			oModel_ds.setProperty("/_Maktx", "");
			oModel_ds.setProperty("/_Smatnr", "");
			oModel_ds.setProperty("/_Textl", "");
			oModel_ds.setProperty("/_Qmnam", "");
			oModel_ds.setProperty("/_Serchg", "");
			oModel_ds.setProperty("/_Rkmng", "");
			oModel_ds.setProperty("/_Mgein", "");
			oModel_ds.setProperty("/_Eneap", "");
			oModel_ds.setProperty("/_Errorcode", "");
			oModel_ds.setProperty("/_Errorcode_Key", "");
			oModel_ds.setProperty("/_Filescount", "0");
			oModel_ds.setProperty("/_Filescount", "0");
			oModel_ds.setProperty("/_Input_Ser_Charg", true);
			var oUploadCollection = this._uploadCollection;

			if (oUploadCollection) {
				oUploadCollection.removeAllItems();
			}

			//this._uploadCollection = {};			
		},
		savedata: function (OVIEW) {
			var textsaved = this.getModel("i18n").getResourceBundle().getText("textsaved");
			var textnotsaved = this.getModel("i18n").getResourceBundle().getText("textnotsaved");
			var save = this.getModel("i18n").getResourceBundle().getText("save");

			var that = this;
			var promise_d = new Promise(function (resolve, reject) {
				//that.setBusyView(OVIEW, true);
				sap.ui.core.BusyIndicator.show();
				that.senddata(that, resolve, reject);
			});
			promise_d.then(function (success) {

				if (success) {
					MessageBox.success(textsaved, {
						title: save,
						styleClass: "sapUiSizeCompact",
						contentWidth: "100px"
					});
					var oModel_ds = that.getDataset();
					oModel_ds.setProperty("/_Ebeln", "");
					oModel_ds.setProperty("/_Ebelp", "");
					oModel_ds.setProperty("/_Matnr", "");
					oModel_ds.setProperty("/_Maktx", "");
					oModel_ds.setProperty("/_Smatnr", "");
					oModel_ds.setProperty("/_Textl", "");
					oModel_ds.setProperty("/_Qmnam", "");
					oModel_ds.setProperty("/_Serchg", "");
					oModel_ds.setProperty("/_Rkmng", "");
					oModel_ds.setProperty("/_Mgein", "");
					oModel_ds.setProperty("/_Eneap", "");
					oModel_ds.setProperty("/_Errorcode", "");
					oModel_ds.setProperty("/_Errorcode_Key", "");
					oModel_ds.setProperty("/_Filescount", "0");
					oModel_ds.setProperty("/_Input_Ser_Charg", true);

					// if (!that._uploadDialog) {
					// 	setTimeout(function () {
					// 		that.handleUploads();
					// 	}, 4000);
					// }

				} else {
					MessageBox.error(textnotsaved, {
						title: save,
						styleClass: "sapUiSizeCompact",
						contentWidth: "100px"
					});

				}

			});
		},
		senddata: function (THIS, fnRes, fnRej) {
			//res(false);
			var oModel = THIS.getModel("ds");
			var oModel_ds = THIS.getDataset();

			// Supplier
			// Ebeln
			// Ebelp
			// Sernr
			// Charg
			// Rkmng
			// Mgein
			// Qmnam
			// Eneap
			// Textl
			// Errorcode
			// Errorcode_Key

			// var oModel = new JSONModel({
			// 	_Supplier: "",
			// 	_Ebeln: "",
			// 	_Ebelp: "",
			// 	_Matnr: "",
			// 	_Maktx: "",
			// 	_Smatnr: "",
			// 	_Textl: "",
			// 	_Qmnam: "",
			// 	_Serchg: "",
			// 	_Rkmng: "",
			// 	_Mgein: "",
			// 	_Eneap: "",
			// 	_Errorcode: "",
			// 	_Errorcode_Key: "",
			// 	_Filescount: "0"

			///////////////////////////////////////////////////////////////////////			
			// Step 1 save dataset
			var promise_2 = new Promise(function (resolve2, reject2) {

				var oEntry = {};
				oEntry.Supplier = oModel_ds.getProperty("/_Supplier");
				oEntry.Ebeln = oModel_ds.getProperty("/_Ebeln");
				oEntry.Ebelp = oModel_ds.getProperty("/_Ebelp");
				oEntry.Matnr = oModel_ds.getProperty("/_Matnr");
				oEntry.Sernr = oModel_ds.getProperty("/_Serchg");
				oEntry.Charg = oModel_ds.getProperty("/_Serchg");
				oEntry.Rkmng = oModel_ds.getProperty("/_Rkmng");
				oEntry.Mgein = oModel_ds.getProperty("/_Mgein");
				oEntry.Qmnam = oModel_ds.getProperty("/_Qmnam");
				oEntry.Eneap = oModel_ds.getProperty("/_Eneap");
				oEntry.Textl = oModel_ds.getProperty("/_Textl");
				oEntry.Errorcode = oModel_ds.getProperty("/_Errorcode");
				oEntry.Errorcode_Key = oModel_ds.getProperty("/_Errorcode_Key");

				oModel.create("/datasetSet", oEntry, {
					method: "POST",
					success: function (oData, oResponse) {

						var lv_success = true;

						var obj = oData.__batchResponses;
						for (var i in obj) {
							if ('message' in obj[i]) {
								if (obj[i].message === "HTTP request failed") {
									if (obj[i].response.statusCode === "400") {
										//MessageToast.show(error);
										lv_success = false;
										break;
									}
								}
							}
						}

						if (lv_success) {
							resolve2(true);
						}

					},

					error: function (oData) {
						resolve2(false);
						// MessageBox.error(error, {
						// 	title: title,
						// 	onClose: null,
						// 	styleClass: "",
						// 	initialFocus: null,
						// 	textDirection: sap.ui.core.TextDirection.Inherit
						// });
					}

				});

			});

			///////////////////////////////////////////////////////////////////////			
			// Step 2 save datasetFile		
			promise_2.then(function (success2) {
				if (success2) {
					if (THIS._uploadDialog) {
						THIS.handleUploads();
						setTimeout(function () {
							//THIS.setBusyView(OVIEW, false);
							sap.ui.core.BusyIndicator.hide();
							fnRes(true);
						}, 4000);

					}
				}
			});

			//oModel.refresh(true);

		},
		handleUploads: function () {
			var oUploadCollection = this._uploadCollection;

			if (oUploadCollection) {
				//var cFiles = oUploadCollection.getItems().length;
				//var items = oUploadCollection.getItems();

				var cFiles = oUploadCollection.getList().getItems().length;
				if (cFiles > 0) {

					// onStartUpload: function() {
					// 			var oAttachmentUpl = this.byId("attachmentUpl");
					// 			var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
					// 			this.iIncompleteItems = aIncompleteItems.length; //used to turn off busy indicator upon completion of all pending uploads
					// 			if (this.iIncompleteItems !== 0) {
					// 				oAttachmentUpl.setBusy(true);
					// 				this.i = 0; //used to turn off busy indicator when all uploads complete
					// 			for (var i = 0; i < this.iIncompleteItems; i++) {
					//  					var sFileName = aIncompleteItems[i].getProperty("fileName");
					//  					var oXCSRFToken = new sap.ui.core.Item({
					//  						key: "X-CSRF-Token",
					//  						text: this.getOwnerComponent().getModel().getSecurityToken()
					//  					});
					//  					var oSlug = new sap.ui.core.Item({
					//  						key: "SLUG",
					//  						text: this.sRequestId + "/" + sFileName
					//  					});
					//  					oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug).uploadItem(aIncompleteItems[i]);
					//  					oAttachmentUpl.removeAllHeaderFields(); //at least slug header field must be reset after each upload
					// 			}
					// 			}
					// },

					//	var aIncompleteItems = oUploadCollection.getIncompleteItems();
					//	this.iIncompleteItems = aIncompleteItems.length;
					var that = this;
					oUploadCollection.getItems().forEach(function (oItem) {
						//if (oItem.getListItem().getSelected()) {
						var oXCSRFToken = new sap.ui.core.Item({
							key: "X-CSRF-Token",
							text: that.getModel("ds").getSecurityToken()
						});
						oUploadCollection.addHeaderField(oXCSRFToken);

						var sFileName = oItem.getProperty("fileName");
						var oSlug = new sap.ui.core.Item({
							key: "SLUG",
							text: sFileName
						});
						oUploadCollection.addHeaderField(oSlug);
						oUploadCollection.uploadItem(oItem);
						oUploadCollection.removeAllHeaderFields();
						//}
					});

					//oUploadCollection.upload(); //Reichte für UploadCollection
					this._uploadDialog.kill(this._oViewMain);
					this._oViewMain = {};
				}
			}
			//var oTextArea = this.byId("TextArea");

			//var items = new sap.m.UploadCollectionItem;

			//var i;
			//var uploadInfo = cFiles + " file(s)";

			// Llfdnr
			// Lifnum
			// Filename
			// var path = "/sap/opu/odata/WIND/QM_RESULTS_SRV/PruefMerkmaleSet(Prueflos='" + _scurrentdata.Prueflos +
			// 	"',Prueflos_Key_Modus='" +
			// 	_scurrentdata.Prueflos_Key_Modus +
			// 	"',Prueflos_Key_Object='" + _scurrentdata.Prueflos_Key_Object + "',Vornr='" + _scurrentdata.Vornr + "',Pruefpunkt='" +
			// 	_scurrentdata.Pruefpunkt + "',Merknr='" +
			// 	_scurrentdata.Merknr +
			// 	"')/TOFOTO";
			// var path = "/sap/opu/odata/sap/ZQM_USSUPNC_SRV/datasetFile(Llfdnr='000001',Lifnum='0010011837',Filename='Test')";
			// oEvent.setUploadUrl(path);

			//var path = "/sap/opu/odata/sap/ZQM_USSUPNC_SRV/datasetFileSet(Lfdnr='000001',Lifnum='0010011837',Filename='Test')";
			// var path = "/sap/opu/odata/sap/ZQM_USSUPNC_SRV/datasetFileSet";
			// oUploadCollection.setUploadUrl(path);

			// <UploadCollection 
			//   maximumFilenameLength="55" 
			//   maximumFileSize="1000" 
			//   fileDeleted="onFileDeleted"
			//   filenameLengthExceed="onFilenameLengthExceed" 
			//   fileRenamed="onFileRenamed" 
			//   fileSizeExceed="onFileSizeExceed" 
			//   id="UploadCollection"
			//   change="onChange" 
			//   mode="SingleSelectMaster" 
			//   beforeUploadStarts="onBeforeUploadStarts" 
			//   items="{path: '/FileSet'}" multiple="true"							
			//   uploadUrl="/sap/opu/odata/sap/ZFILE_EX_SRV/FileSet" 
			//   uploadComplete="onUploadComplete" noDataText="No files found."
			//   noDataDescription="Drop files to upload, or use the &quot;+&quot; button.">
			//   <items>
			//     <UploadCollectionItem 
			//       documentId="{ID}" 
			//       fileName="{FileName}" 
			//       url="/sap/opu/odata/sap/ZFILE_EX_SRV/FileSet(guid'{ID}')/$value"
			//       mimeType="{MIMEType}" 
			//       enableEdit="false" 
			//       enableDelete="false" 
			//       visibleDelete="false" 
			//       visibleEdit="false">
			//     </UploadCollectionItem>
			//   </items>
			// </UploadCollection>

			// var i;

			// var oModel = this.getModel("ds");
			// var oModel_ds = this.getDataset();

			// var pathm = oModel.createKey("datasetFileSet", {
			// 	Lfdnr: '000001',
			// 	Lifnum: oModel_ds.getProperty("/_Supplier"),
			// 	Filename: "Test"
			// });
			//	var pathmm = "/sap/opu/odata/sap/ZQM_USSUPNC_SRV/" + pathm;
			// 	var currentdatam = oModel.getProperty(pathmm);

		},
		onTest: function (VIEW, EVT) {
			// Test
			this.handleUploads();
		}

	});
});