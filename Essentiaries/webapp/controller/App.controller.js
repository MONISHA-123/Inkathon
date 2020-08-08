sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Popup",
	"sap/ui/core/routing/History"

], function (BaseController, Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device,
	Popup, History) {
	"use strict";
	return BaseController.extend("com.ink.Essentiaries.controller.App", {
		onInit: function () {
			this.forgotOTP = 0;
			this.oRegistration = {
				"email": "",
				"fname": "",
				"lname": "",
				"phoneno": "",
				"password": "",
				"role": "user"
			};

			var oEmptyModel = new JSONModel();
			oEmptyModel.setProperty("/ForgotPassword", {
				"email": ""
			});
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart", []);
			oEmptyModel.setProperty("/Currency", {
				"currency": "₹"
			});
			this.getView().setModel(oEmptyModel, "oEmptyModel");
		},
		fnOnLoginValidation: function () {

			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/oList/Email");

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/oList/password");

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (sPassword == undefined || sEmail == undefined)

				MessageToast.show("Mandatory fields cannot be blank");

			else if (!(mailregex.test(sEmail)))

				MessageToast.show("Invalid Email");

			else {
				var sCredentials = "email=" + sEmail + "&password=" + sPassword;

				var that = this;
				this.busyIndicator(2000);
				var sUrl = "/AdminModule/login?" + sCredentials;
				$.ajax({
					url: sUrl,
					data: null,
					async: true,
					dataType: "json",
					contentType: "application/json; charset=utf-8",
					headers: {
						"x-CSRF-Token": "fetch"
					},
					error: function (err) {
						MessageToast.show("Category Fetch Destination Failed");
					},
					success: function (data, status, xhr) {

						if (data.email == "")
							MessageToast.show("Email ID does not exist");
						else if (data.email == sEmail && data.password != sPassword)
							MessageToast.show("Password does not match with the id provided");
						else {
							if (data.email == sEmail && data.password == sPassword && data.role == "user") {
								that.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", data);
								var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);
							
								that.getView().byId("accountMenu").setInitials(sInitial);
								that.getView().byId("accountMenu").setVisible(true);

								that.getView().byId("signIn").setVisible(false);

								that._oDialog.close();

								that._oDialog.destroy();

								that._oDialog = null;
									that.GETMethod_ADDRESS();
							}
							if (data.email == sEmail && data.password == sPassword && data.role == "admin") {
								that.getView().byId("cart").setVisible(false);
								that.getView().byId("signIn").setVisible(false);
								that.getRouter().navTo("Admin");
							}
						}

					},
					type: "GET"
				}).always(function (data, status, xhr) {
					that.token = xhr.getResponseHeader("x-CSRF-Token");

				});

			}

		}

	});
});