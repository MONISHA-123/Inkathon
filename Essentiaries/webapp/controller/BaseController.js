sap.ui.define([
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
], function (Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device, Popup, History) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.BaseController", {
		getRouter: function () {

			return UIComponent.getRouterFor(this);

		},
		/*	fnTotalCalc: function () {
				var total = 0;
				var oEmptyModel = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
				for (var j = 0; j < oEmptyModel.length; j++) {
					total += this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart/" + j + "/amount");

				}

				this.getOwnerComponent().getModel("oProductModel").setProperty("/Total", total);
			},*/
		fnOnAddToCart: function (oEvent) {

			//var oButton=this.byId("cart");

			this.oButton = oEvent.getSource();
			// console.log(this.oButton);
			if (!this._oPopover) {

				Fragment.load({

					name: "com.ink.Essentiaries.fragments.Cart",
					id: "cartFragment",
					controller: this

				}).then(function (oPopover) {

					this._oPopover = oPopover;

					this.getView().addDependent(this._oPopover);

					this._oPopover.openBy(this.oButton);

				}.bind(this));

			} else {

				this._oPopover.openBy(this.oButton);

				console.log(this.oButton);
			}
			var cartLength = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").length;
			if (cartLength) {
				Fragment.byId("cartFragment", "cartTable").setVisible(true);
				Fragment.byId("cartFragment", "cartPopOver").addStyleClass("cartTransparent");
				Fragment.byId("cartFragment", "cartPopOver").removeStyleClass("cartimage");
				Fragment.byId("cartFragment", "ProceedToCart").setEnabled(true);

			} else {
				Fragment.byId("cartFragment", "cartTable").setVisible(false);
				Fragment.byId("cartFragment", "cartPopOver").addStyleClass("cartimage");
				Fragment.byId("cartFragment", "cartPopOver").removeStyleClass("cartTransparent");
				Fragment.byId("cartFragment", "ProceedToCart").setEnabled(false);

			}
		},
		fnPopCloseButton: function (oEvent) {

			this._oPopover.close();

		},
		//fragment for user
		fnOnUser: function () {

			if (this._oDialog) {

				this._oDialog.close();

				this._oDialog.destroy();

				this._oDialog = null;

			}

			this.getView().getModel("oEmptyModel").setProperty("/oList", []);

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idUserLogin", "com.ink.Essentiaries.fragments.UserLogin", this);

			}

			this.getView().addDependent(this._oDialog);
			this.getView().getModel("oEmptyModel").setProperty("/ForgotPassword", {});
			this.getView().getModel("oEmptyModel").setProperty("/GuestLogin", {});
			// Fragment.byId("idUserLogin", "idContent").addStyleClass("bgDialog"); 

			this._oDialog.open();

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
								var accountMenu = that.getOwnerComponent().getModel("oProductModel").getProperty("/accountMenu");
								var signIn = that.getOwnerComponent().getModel("oProductModel").getProperty("/signIn");
								var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);

								accountMenu.setInitials(sInitial);
								accountMenu.setVisible(true);

								signIn.setVisible(false);

								that.getOwnerComponent().getModel("oProductModel").setProperty("/userCart", []);
								that._oDialog.close();

								that._oDialog.destroy();

								that._oDialog = null;
								that.GETMethod_ADDRESS();
								that.GETCart();
							}
							if (data.email == sEmail && data.password == sPassword && data.role == "admin") {
								that.getView().byId("cart").setVisible(false);
								that.getView().byId("signIn").setVisible(false);

								that.getRouter().navTo("Admin");
								that.getView().byId("adminLogOut").setVisible(true);
							}
						}

					},
					type: "GET"
				}).always(function (data, status, xhr) {
					that.token = xhr.getResponseHeader("x-CSRF-Token");

				});

			}

		},

		fnAdminLogOut: function () {
			this.getRouter().navTo("Home");
			/*this.getView().byId("cart").setVisible(true);
			this.getView().byId("signIn").setVisible(true);
			this.getView().byId("adminLogOut").setVisible(false);*/
			var accountMenu = this.getOwnerComponent().getModel("oProductModel").getProperty("/accountMenu");
			var cart = this.getOwnerComponent().getModel("oProductModel").getProperty("/cartId");
			var signIn = this.getOwnerComponent().getModel("oProductModel").getProperty("/signIn");
			var adminLogOut = this.getOwnerComponent().getModel("oProductModel").getProperty("/adminLogOut");
			accountMenu.setVisible(false);
			signIn.setVisible(true);
				cart.setVisible(true);
			adminLogOut.setVisible(false);
		},
		fnOnCancel: function () {

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

		},
		GETMethod_CATE: function () {
			var that = this;
			var sUrl = "/AdminModule/api/category";
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

					that.cateCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Category", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		//GuestLogin
		fnGuestOTPReq: function () {
			var that = this;
			this.Refotp = 0;
			console.log(this.token);
			Fragment.byId("idGuestLogin", "2ndPart").setVisible(true);
			var phoneno = this.getView().getModel("oEmptyModel").getProperty("/GuestLogin/phoneno");
			var sUrl = "/AdminModule/guestlogin";
			var oData = {
				"email": "",
				"fname": "",
				"lname": "",
				"phoneno": phoneno,
				"password": "",
				"role": "user"
			};
			$.ajax({
				type: "POST",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					console.log(data);
					that.Refotp = data;

				},
				error: function (xhr, status) {

				},
				complete: function (xhr, status) {

				}
			});

		},
		fnOnGuestLogin: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("idGuestLogin", "com.ink.Essentiaries.fragments.ResetPassword", this);
			}
			this.getView().addDependent(this._oDialog);
			this.getView().getModel("oEmptyModel").setProperty("/GuestLogin/phoneno", "");
			Fragment.byId("idGuestLogin", "guestLogin").setVisible(true);
			Fragment.byId("idGuestLogin", "fogetPass").setVisible(false);
			Fragment.byId("idGuestLogin", "2ndPart").setVisible(false);
			Fragment.byId("idGuestLogin", "forgetPassOTP").setVisible(false);
			Fragment.byId("idGuestLogin", "resetPassPage").setVisible(false);
			Fragment.byId("idGuestLogin", "NavBackFP").setVisible(false);
			Fragment.byId("idGuestLogin", "NavBack").setVisible(true);
			this._oDialog.open();
		},
		fnOTPLogin: function () {
			var temp = "";
			var that = this;
			this.Guestotp = this.getView().getModel("oEmptyModel").getProperty("/GuestLogin/otp");
			for (var i = 0; i <= 10; i = i + 2) {
				temp += this.Guestotp[i];
			}
			if (this.Guestotp) {
				if (this.Refotp === parseInt(temp, 10)) {
					var phoneno = this.getView().getModel("oEmptyModel").getProperty("/GuestLogin/phoneno");
					var sUrl = "/AdminModule/saveguest";
					var oData = {
						"email": "",
						"fname": "",
						"lname": "",
						"phoneno": phoneno,
						"password": "",
						"role": "user"
					};
					$.ajax({
						type: "POST",
						url: sUrl,
						data: JSON.stringify(oData),
						dataType: "json",
						"headers": {
							"Content-Type": "application/json",
							"x-CSRF-Token": that.token
						},

						success: function (data) {
							console.log(data);
							data.fname = "Guest";
							data.lname = "User";
							var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);
							that.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", data);
							that.getView().byId("accountMenu").setInitials(sInitial);
							that.getView().byId("accountMenu").setVisible(true);
							that.getView().byId("signIn").setVisible(false);
							MessageToast.show("Welcome");
							that._oDialog.close();
							that._oDialog.destroy();
							that._oDialog = null;

						},
						error: function (xhr, status) {

						},
						complete: function (xhr, status) {

						}
					});

				} else {
					MessageToast.show("Incorrect OTP");
				}

			}

		},
		//fragment for reset password
		fnOnResetPass: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("idForgetPass", "com.ink.Essentiaries.fragments.ResetPassword", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("idForgetPass", "guestLogin").setVisible(false);
			Fragment.byId("idForgetPass", "fogetPass").setVisible(true);
			Fragment.byId("idForgetPass", "forgetPassOTP").setVisible(false);
			Fragment.byId("idForgetPass", "resetPassPage").setVisible(false);
			Fragment.byId("idForgetPass", "NavBackFP").setVisible(false);
			Fragment.byId("idForgetPass", "NavBack").setVisible(true);
			this._oDialog.open();
		},

		fnforgetPassOTP: function () {
			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/ForgotPassword/email");
			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			var that = this;

			var sUrl = "/AdminModule/forgotpassword?email=" + sEmail;

			if (mailregex.test(sEmail)) {
				this.busyIndicator(4000);

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

						that.forgotOTP = data;

					},
					complete: function (xhr, status) {
						that._oDialog.close();

						that._oDialog.destroy();

						that._oDialog = null;

						if (!that._oDialog) {

							that._oDialog = sap.ui.xmlfragment("idForgetPass", "com.ink.Essentiaries.fragments.ResetPassword", that);

						}

						that.getView().addDependent(that._oDialog);
						Fragment.byId("idForgetPass", "guestLogin").setVisible(false);
						Fragment.byId("idForgetPass", "fogetPass").setVisible(false);

						Fragment.byId("idForgetPass", "forgetPassOTP").setVisible(true);

						Fragment.byId("idForgetPass", "resetPassPage").setVisible(false);

						Fragment.byId("idForgetPass", "NavBack").setVisible(false);
						Fragment.byId("idForgetPass", "NavBackFP").setVisible(true);

						that._oDialog.open();

						var time = Fragment.byId("idForgetPass", "timer");

						var fiveMinutesLater = new Date();

						var scs = fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 3);

						var countdowntime = scs;

						var x = setInterval(function () {

							var now = new Date().getTime();

							var cTime = countdowntime - now;

							var minutes = Math.floor((cTime % (1000 * 60 * 60)) / (1000 * 60));

							var second = Math.floor((cTime % (1000 * 60)) / 1000);

							time.setText("OTP Expires in " + minutes + ":" + second + " Minutes");

							if (cTime < 0) {

								clearInterval(x);

								time.setText("OTP Expires in 0:0 Minutes");
								// Fragment.byId("idForgetPass", "resend").setEnabled(true);

							}

						});

					},
					type: "GET"
				});

			} else
				MessageToast.show("Invalid Email ID");
		},

		fnOTP: function (oEvent) {

			// this.otp = oEvent.getSource().getValue();

		},
		fnResetPassLogin: function () {
			var temp = "";
			this.otp = this.getView().getModel("oEmptyModel").getProperty("/ForgotPassword/otp");
			for (var i = 0; i <= 10; i = i + 2) {
				temp += this.otp[i];
			}
			if (this.otp) {
				if (this.forgotOTP === parseInt(temp, 10)) {
					this._oDialog.close();
					this._oDialog.destroy();
					this._oDialog = null;
					if (!this._oDialog) {
						this._oDialog = sap.ui.xmlfragment("ForgetPass", "com.ink.Essentiaries.fragments.ResetPassword", this);
					}
					this.getView().addDependent(this._oDialog);
					Fragment.byId("ForgetPass", "guestLogin").setVisible(false);
					Fragment.byId("ForgetPass", "fogetPass").setVisible(false);
					Fragment.byId("ForgetPass", "forgetPassOTP").setVisible(false);
					Fragment.byId("ForgetPass", "resetPassPage").setVisible(true);
					Fragment.byId("ForgetPass", "NavBack").setVisible(false);
					Fragment.byId("ForgetPass", "NavBackFP").setVisible(false);
					this._oDialog.open();
				} else {
					MessageToast.show("Incorrect OTP");
				}

			}

		},

		fnToOrderPage: function () {
			this.getRouter().navTo("Order");
		},
		fnLogOut: function () {
			this.busyIndicator(2000);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", []);
			this.getView().byId("accountMenu").setVisible(false);

			this.getView().byId("signIn").setVisible(true);
		},
		fnUserDashBoard: function () {
			this.getRouter().navTo("userDashBoard");
		},

		fnOnCreateAcc: function () {

			this.count = 0;

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idRegistration", "com.ink.Essentiaries.fragments.CreateAccount", this);

			}

			this.getView().addDependent(this._oDialog);
			this.getView().getModel("oEmptyModel").setProperty("/Registration", {
				"email": "",
				"fname": "",
				"lname": "",
				"phoneno": "",
				"password": "",
				"role": "user"
			});

			this._oDialog.open();

		},
		fnOnFNameChange: function (oEvent) {

			var regex_name = /^[A-Za-z\s]*$/;

			if (!(regex_name.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idFName").setValueState("Error");

				Fragment.byId("idRegistration", "idFName").setValueStateText("Invalid Entry");

			} else

				Fragment.byId("idRegistration", "idFName").setValueState("None");

		},

		fnOnLNameChange: function (oEvent) {

			var regex_name = /^[A-Za-z\s]*$/;

			if (!(regex_name.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idLName").setValueState("Error");

				Fragment.byId("idRegistration", "idLName").setValueStateText("Invalid Entry");

			} else

				Fragment.byId("idRegistration", "idLName").setValueState("None");

		},

		fnOnEmailChange: function (oEvent) {

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (!(mailregex.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idEmail").setValueState("Error");

				Fragment.byId("idRegistration", "idEmail").setValueStateText("Invalid email address");

			} else

				Fragment.byId("idRegistration", "idEmail").setValueState("None");

		},

		fnOnEmailLiveChange: function (oEvent) {

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			if (!(mailregex.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == ""))

				Fragment.byId("idRegistration", "idEmail").setValueStateText("Invalid email address");

			else

				Fragment.byId("idRegistration", "idEmail").setValueState("None");

		},

		fnOnPwdChange: function (oEvent) {

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			if (!(regex_passcode.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == "")) {

				Fragment.byId("idRegistration", "idPwd").setValueState("Error");

				Fragment.byId("idRegistration", "idPwd").setValueStateText(

					"An 8 digit password with atleast one Uppercase, one Lowecase, one symbol, one number is required.");

			} else

				Fragment.byId("idRegistration", "idPwd").setValueState("None");

		},

		fnOnPwdLiveChange: function (oEvent) {

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			if (!(regex_passcode.test(oEvent.getParameters().value)) || (oEvent.getParameters().value.trim() == ""))

				Fragment.byId("idRegistration", "idPwd").setValueStateText(

				"An 8 digit password with atleast one Uppercase, one Lowecase, one symbol, one number is required.");

			else

				Fragment.byId("idRegistration", "idPwd").setValueState("None");

		},

		fnOnConfirmPwdChange: function (oEvent) {

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/confirmPass");

			if (sCPassword != sPassword) {

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("Error");

				Fragment.byId("idRegistration", "idConfirmPwd").setValueStateText("Password and Confirm Password does not match.");

			} else

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("None");

		},

		fnOnConfirmPwdLiveChange: function (oEvent) {

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = oEvent.getParameters().value;

			if (sCPassword === sPassword)

				Fragment.byId("idRegistration", "idConfirmPwd").setValueState("None");

		},

		fnOnSubmit: function () {

			var regex_name = /^[A-Za-z\s]*$/;

			var mailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

			var regex_passcode = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

			var sFirstName = this.getView().getModel("oEmptyModel").getProperty("/Registration/fname");

			var sLastName = this.getView().getModel("oEmptyModel").getProperty("/Registration/lname");

			var sPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/password");

			var sCPassword = this.getView().getModel("oEmptyModel").getProperty("/Registration/confirmPass");

			var sEmail = this.getView().getModel("oEmptyModel").getProperty("/Registration/email");

			var sTerms = this.getView().getModel("oEmptyModel").getProperty("/Registration/terms");

			//this.getView().getModel("oEmptyModel").setProperty("/oList", []); 

			if (sFirstName == undefined || sLastName == undefined || sPassword == undefined || sCPassword == undefined || sEmail == undefined)

				MessageToast.show("Mandatory fields cannot be blank");

			else if (!(regex_name.test(sFirstName)) || (sFirstName.trim() == ""))

				MessageToast.show("Invalid First Name");

			else if (!(regex_name.test(sLastName)))

				MessageToast.show("Invalid Last Name");

			else if (!(mailregex.test(sEmail)))

				MessageToast.show("Invalid Email id");

			else if (!(regex_passcode.test(sPassword)))

				MessageToast.show("minimum of 8 digit password with atleast 1 symbol,1 number,1 uppercase, 1 lowercase is required");

			else if (sCPassword != sPassword)

				MessageToast.show("password and Confirm Password does not match");

			else if (sTerms != true)

				MessageToast.show("Agree with the terms and condition");

			else {

				var that = this;

				var oData = this.getView().getModel("oEmptyModel").getProperty("/Registration");
				delete oData.terms;
				delete oData.confirmPass;

				/*	var oRegistrationModel = new JSONModel();

					oRegistrationModel.setData(oDetails);

					this.getView().setModel(oRegistrationModel, "ORegistrationModel");*/

				// this.getView().byId("idConfirmation").setVisible(true);
				this.busyIndicator(2000);
				var sUrl = "/AdminModule/signup/";

				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						if (data.email == "")
							MessageToast.show("Email ID does not exist");
						else {
							that._oDialog.close();
							that._oDialog.destroy();
							that._oDialog = null;
							MessageToast.show("Acccount created successfully!!!Login to Shop");
							//that.getView().byId("idConfirmation").setVisible(true);
							that.fnOnUser();
						}

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("Registration failed");
					},
					complete: function (xhr, status) {

					}
				});

			}

		},

		fnOnShowPassword: function (oEvent) {

			this.count++;

			if (this.count % 2 == 1) {

				Fragment.byId("idRegistration", "idPwd").setType("Text");

				Fragment.byId("idRegistration", "idShowPwd").setIcon("sap-icon://hide");

			} else {

				Fragment.byId("idRegistration", "idPwd").setType("Password");

				Fragment.byId("idRegistration", "idShowPwd").setIcon("sap-icon://show");

			}

		},
		//Till now login fragments functions/////

		fnAccountMenu: function (oEvent) {

			var oButton = oEvent.getSource();

			// create menu only once 

			if (!this._menu) {

				Fragment.load({

					name: "com.ink.Essentiaries.fragments.account",

					controller: this

				}).then(function (oMenu) {

					this._menu = oMenu;

					this.getView().addDependent(this._menu);

					this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);

				}.bind(this));

			} else {

				this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);

			}

		},
		hideBusyIndicator: function () {
			BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function () {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},
		busyIndicator: function (sec) {
			this.showBusyIndicator(sec);
		},
		fnNewPassUpdate: function () {
			var that = this;
			var oData = this.getView().getModel("oEmptyModel").getProperty("/ForgotPassword");
			var sCredentials = "email=" + oData.email + "&password=" + oData.np;
			if (oData.np === oData.cp) {
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
						that.getOwnerComponent().getModel("oProductModel").setProperty("/LoginUser", data);
						data.password = oData.np;
						console.log(data);
						var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);
						that.getView().byId("accountMenu").setInitials(sInitial);
						that.getView().byId("accountMenu").setVisible(true);
						that.getView().byId("signIn").setVisible(false);
						$.ajax({
							type: "PUT",
							url: "/AdminModule/update",
							data: JSON.stringify(data),
							dataType: "json",
							"headers": {
								"Content-Type": "application/json",
								"x-CSRF-Token": that.token
							},

							success: function () {
								MessageToast.show("Data saved successfully");

							},

						});

						that._oDialog.close();

						that._oDialog.destroy();

						that._oDialog = null;
					},
					type: "GET"
				});

			}

		},
		/*	fnCart: function (oEvent) {
				MessageToast.show("Product Added To Cart ");
				oEvent.getSource().getParent().getItems()[0].setVisible(false);
				oEvent.getSource().getParent().getItems()[1].setVisible(true);
				var Path = oEvent.getSource().getBindingContext("oProductModel").sPath;
				var oData = this.getOwnerComponent().getModel("oProductModel").getProperty(Path);
				this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/quantity", 1);
				this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
				var price = this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/price");
				this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/amount", price);
				console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));

				this.getOwnerComponent().getModel("oProductModel").refresh();
				this.fnTotalCalc();

				this.fnOnAddToCart();
			},*/
		onChange: function (oEvent) {
			var iQuantity = oEvent.getParameters().value;
			var Path = oEvent.getSource().getParent().getBindingContextPath();
			var iAmount = iQuantity * (this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/price"));
			var Amount = iAmount.toFixed(2);
			iAmount = parseFloat(Amount);
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/amount", iAmount);
			this.fnTotalCalc();

		},
		onChangeOther: function (sPath) {
			var quantity = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/quantity");
			var price = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/price");
			var cart = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var iAmount = quantity * price;
			var Amount = iAmount.toFixed(2);
			iAmount = parseFloat(Amount);

			for (var i = 0; i < cart.length; i++) {
				if (cart[i].productid == this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/productid")) {
					this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart/" + i + "/amount", iAmount);

				}
			}

			this.fnTotalCalc();

		},

		fnTotalCalc: function () {
			var total = 0;
			var oEmptyModel = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			for (var j = 0; j < oEmptyModel.length; j++) {
				total += this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart/" + j + "/amount");

			}

			this.getOwnerComponent().getModel("oProductModel").setProperty("/Total", total);
		},
		fnOnDelete: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			var index = sPath.lastIndexOf("/");
			var lastIndexValue = sPath.charAt(index + 1);
			var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart/" + lastIndexValue + "/productid");
			var product = this.getOwnerComponent().getModel("oProductModel").getProperty("/Product");
			var cartid = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/cart_id");
			for (var i = 0; i < product.length; i++) {
				if (id == product[i].productid) {
					this.getOwnerComponent().getModel("oProductModel").setProperty("/Product/" + i + "/quantity", 0);
					this.getOwnerComponent().getModel("oProductModel").refresh();
				}
			}
			var aList = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			aList.splice(lastIndexValue, 1);
			this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart", aList);
			this.getOwnerComponent().getModel("oProductModel").refresh();
			var user = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser");
			if (user != undefined) {
				this.fnOnDeleteCart(cartid);
			}
			this.fnTotalCalc();

		},
		fnNewAddressSave: function () {
			var that = this;
			var regex_pincode = /^[1-8][0-9]{5}$/;
			var oData = this.getView().getModel("oEmptyModel").getProperty("/Address");
			if (oData.houseno.trim() == "" || oData.street.trim() == "" || oData.city.trim() == "" || oData.state.trim() == "" || oData.pincode
				.trim() == "") {
				MessageToast.show("Fill all the required fields");
			} else if (!(regex_pincode.test(oData.pincode))) {
				MessageToast.show("Enter a valid pincode");
			} else {

				var userid = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");

				var sUrl = "/AdminModule/addaddress/" + userid
				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("address added successfully");

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("failed");
					},
					complete: function (xhr, status) {
						that.GETMethod_ADDRESS();
					}
				});

			}
		},
		fnAddressEdit: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var oData = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
			this.getView().getModel("oEmptyModel").setProperty("/Address", oData);
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("address", "newAddress").setVisible(false);
			Fragment.byId("address", "oldAddress").setVisible(true);
			this._oDialog.open();
		},
		GETMethod_ADDRESS: function () {
			var userid = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");
			var that = this;

			var sUrl = "/AdminModule/getaddress/" + userid;
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
					MessageToast.show(" address Failed");
				},
				success: function (data, status, xhr) {

					that.addressCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Address", data);
					that.getOwnerComponent().getModel("oProductModel").refresh();
					console.log(data);

				},
				type: "GET"
			});
		},
		fnEditAddressSave: function () {
			var that = this;
			var id = this.getView().getModel("oEmptyModel").getProperty("/Address/address_id");
			var sUrl = "/AdminModule/updateaddress/" + id;
			var oData = this.getView().getModel("oEmptyModel").getProperty("/Address");
			$.ajax({
				type: "PUT",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					MessageToast.show("Address saved successfully");

				},
				error: function (xhr, status) {

					MessageToast.show("Action Failed");

				},
				complete: function (xhr, status) {
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					that.GETMethod_ADDRESS();
				}
			});

		},
		fnAddressDel: function () {
			var that = this;
			var id = this.getView().getModel("oEmptyModel").getProperty("/Address/address_id");
			var surl = "/AdminModule/deleteaddress/" + id;
			$.ajax({
				type: "DELETE",
				url: surl,
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},
				success: function (data) {
					MessageToast.show("Address Deleted");
				},
				error: function (xhr, status) {
					console.log("ERROR");
				},
				complete: function (xhr, status) {
					that.GETMethod_ADDRESS();
				}
			});
		},
		GETCart: function () {
			var userid = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");
			var that = this;

			var sUrl = "/AdminModule/cart/" + userid;
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
					MessageToast.show(" address Failed");
				},
				success: function (data, status, xhr) {

					that.cartCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Cart", data);
					that.getOwnerComponent().getModel("oProductModel").refresh();
					console.log(data);
					that.fnTotalCalc();

				},
				type: "GET"
			});
		},
		fnPostCart: function (oData) {
			var that = this;
			var sUrl = "/AdminModule/addtocart/" + this.id;
			$.ajax({
				type: "POST",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					console.log(data);
					MessageToast.show("Added to user cart");
					that.GETCart();

				},
				error: function (xhr, status) {

				},
				complete: function (xhr, status) {

				}
			});
		},
		fnUpdateCart: function (oData) {
			var that = this;
			$.ajax({
				type: "PUT",
				url: "/AdminModule/updatecart/",
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					MessageToast.show("Data saved successfully");

				},
				error: function (xhr, status) {

					MessageToast.show("Action Failed");

				},
				complete: function (xhr, status) {
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
					that.GETCart();
				}
			});
		},
		fnOnDeleteCart: function (id) {
			var that = this;
			var surl = "/AdminModule/deleteitem/" + id;
			$.ajax({
				type: "DELETE",
				url: surl,
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},
				success: function (data) {
					MessageToast.show(" Deleted");
				},
				error: function (xhr, status) {
					console.log("ERROR");
				},
				complete: function (xhr, status) {
					that.GETCart();
				}
			});
		},

		fnPostMasterOrder: function (oData) {
			var that = this;
			var sUrl = "/AdminModule/api/order/";
			$.ajax({
				type: "POST",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					that.GetUserMasterOrder();
					var oDataSlave = {
						"orderid": data.orderid,
						"productid": "",
						"productname": "",
						"quantity": "",
						"amount": ""
					};
					var cart = that.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
					for (var i = 0; i < cart.length; i++) {
						oDataSlave.productid = cart[i].productid;
						oDataSlave.productname = cart[i].productname;
						oDataSlave.quantity = cart[i].quantity;
						oDataSlave.amount = cart[i].amount;
						that.fnPostSlaveOrder(oDataSlave);
					}
					MessageToast.show("Order Placed");
					if (!that._oDialog) {
						that._oDialog = sap.ui.xmlfragment("AfterPlaceOrder", "com.ink.Essentiaries.fragments.AfterPlaceOrder", that);
					}
					that.getView().addDependent(that._oDialog);
					that._oDialog.open();

				},
				error: function (xhr, status) {

				},
				complete: function (xhr, status) {

				}
			});
		},

		fnPostSlaveOrder: function (oData) {
			var that = this;
			var sUrl = "/AdminModule/api/orderslave/";
			$.ajax({
				type: "POST",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},
				success: function (data) {
					var cart = that.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
					for (var i = 0; i < cart.length; i++) {
						that.fnOnDeleteCart(cart[i].cart_id);
					}

				},
				error: function (xhr, status) {

				},
				complete: function (xhr, status) {

				}
			});
		},

		GetUserMasterOrder: function () {
			var userid = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");
			var that = this;

			var sUrl = "/AdminModule/api/orderbyuser/" + userid;
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
					MessageToast.show("Failed");
				},
				success: function (data, status, xhr) {

					that.UserOrderCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/UserMasterOrder", data);
					that.getOwnerComponent().getModel("oProductModel").refresh();

				},
				type: "GET"
			});
		},

		fnProductUpdate: function () {
			var that = this;
			var cartData = that.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var data = that.getOwnerComponent().getModel("oProductModel").getProperty("/Product");

			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < cartData.length; j++) {
					if (data[i].productid == cartData[j].productid) {
						that.getOwnerComponent().getModel("oProductModel").setProperty("/Product" + i + "/quantity", cartData[j].quantity);
						that.getOwnerComponent().getModel("oProductModel").refresh();

					}
				}
			}
		},
		fnCateFooter: function (oEvent) {
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("oProductModel").sPath;
			var id = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/categoryid");
			this.getRouter().navTo("Product", {
				CategoryId: id
			});
		},
		onPressProduct: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var pId = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/productid");
			this.getRouter().navTo("productDescription", {
				ProductId: pId

			});
		},
		fnToAbout: function (oEvent) {
			var Selectedkey = oEvent.getSource().getSelectedItem().getKey();
			this.getRouter().navTo("About", {
				KEY: Selectedkey
			});
		}
	});

});