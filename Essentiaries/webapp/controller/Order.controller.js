sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (BaseController, Controller, JSONModel, Fragment, MessageToast, MessageBox, History, UIComponent) {
	"use strict";

	return BaseController.extend("com.ink.Essentiaries.controller.Order", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Order").attachMatched(this._onRouteMatched, this);

			this._wizard = this.byId("ShoppingCartWizard");
			var oEmptyModel = new JSONModel();
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder", {
				"Address": ""
			});
			var oModel = this.getOwnerComponent().getModel("oProductModel");

			this.getView().setModel(oModel, "oProductModel");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			// this.GETMethod_ADDRESS();
		},

		Address: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/Address", {
				"pincode": "",
				"city": "",
				"houseno": "",
				"state": "",
				"street": ""
			});
			Fragment.byId("address", "newAddress").setVisible(true);
			Fragment.byId("address", "oldAddress").setVisible(false);
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();

		},

		fnOnCancel: function () {

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

		},

		fnAddressSelectChange: function (oEvent) {
			var sPath = oEvent.getSource().getSelectedContextPaths("oProductModel")[0];
			var oAddress = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder/Address", oAddress);
			this.fnSelectedAddress();
		},
		fnSelectedAddress: function () {
			var oAddress = this.getOwnerComponent().getModel("oProductModel").getProperty("/Placeorder/Address");
			if (oAddress === "") {
				this._wizard.invalidateStep(this.byId("Address"));
			} else {
				this._wizard.validateStep(this.byId("Address"));
			}
		},
		/*	fnToPaymentStep: function () {
				this.setDiscardableProperty({
					message: "Are you sure you want to change the payment type ? This will discard your progress.",
					discardStep: this.byId("PaymentTypeStep"),
					modelPath: "/selectedPayment",
					historyPath: "prevPaymentSelect"
				});
			},*/
		fnPaymentMethod: function () {
			var oWizard = this.byId("ShoppingCartWizard");
			var oFirstStep = oWizard.getSteps()[2];

			var selectedKey = this.getView().getModel("oEmptyModel").getProperty("/selectedKey");

			switch (selectedKey) {
			case "Credit Card":
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));

				break;
			case "Debit Card":
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));

				break;
			case "Cash on Delivery":
			default:
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryInfo"));

				break;
			}
		},
		/*fnLogin: function () {
			var that=this;
			var user = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser");
				var promise=new Promise(function(res,rej){
				if(user==undefined)
				res(that.fnOnUser());
				else
				rej("error");
				
				});
		promise.then(function(result){
			console.log(result);
			that.byId("cartContent").setNextStep(that.getView().byId("Address"));
		});
				
		},*/
		fnLogin: function () {
			var oWizard = this.byId("ShoppingCartWizard");
			var oData={
				"amount":"",
				"product_name":"",
				"productid":"",
				"quantity":""
			};
		
			var oFirstStep = oWizard.getSteps()[0];
			var user = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser");
			if (user == undefined) {
				this.fnOnUser();
					oWizard.discardProgress(oFirstStep);
			} else {
				
			
				this.byId("cartContent").setNextStep(this.getView().byId("Address"));
				
				var userCart=this.getOwnerComponent().getModel("oProductModel").getProperty("/userCart");
				 this.id=this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");                        
			
				var cart=this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
				for(var i=0;i<cart.length;i++){
						oData.amount=cart[i].amount;
						oData.product_name=cart[i].productname;
						oData.productid=cart[i].productid;
						oData.quantity=cart[i].quantity;
						userCart.push(oData);
						this.fnPostCart(oData);
				}
				
			}

		},
		fnPostCart :function(oData){
					var that=this;
					var sUrl="/AdminModule/addtocart/"+this.id;
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
						
					

				},
				error: function (xhr, status) {
				
				
				},
				complete: function (xhr, status) {

				}
			});
		}
		/*	NextButton:function(){
					var user = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser");
					if(user==undefined){
							this.fnLogin();
					}
			
				else
				{
					console.log("To step 2")
				this.byId("cartContent").setNextStep(this.getView().byId("Address"));
			}
			}*/

	});

});