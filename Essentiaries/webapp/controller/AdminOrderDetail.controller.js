sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"

], function (Controller, History, UIComponent, JSONModel, MessageToast, BusyIndicator) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.AdminOrderDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ink.Essentiaries.view.AdminOrderDetail
		 */
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("AdminOrderDetail").attachMatched(this._onRouteMatched, this);

		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {

			this.id = oEvent.getParameter("arguments").Orderid;
			this.GETMasterOrder();
			this.GETSlaveOrder();
		},
		GETMasterOrder: function () {
			var that = this;
			var sUrl = "/AdminModule/api/order/";
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
					console.log(data);
					that.orderCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/MasterOrder", data);
					that.getOwnerComponent().getModel("oProductModel").refresh();

				},
				complete: function () {
					for (var i = 0; i < that.orderCount; i++) {

						if (that.id == that.getOwnerComponent().getModel("oProductModel").getProperty("/MasterOrder/" + i + "/orderid")) {
							var oData = that.getOwnerComponent().getModel("oProductModel").getProperty("/MasterOrder/" + i);
							that.getOwnerComponent().getModel("oProductModel").setProperty("/MasterOrderDetail", oData);
							console.log(that.getOwnerComponent().getModel("oProductModel").getProperty("/MasterOrderDetail"));

							break;
						}
					}
				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		GETSlaveOrder: function () {
			var that = this;
			var sUrl = "/AdminModule/api/orderslave/" + this.id;
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
					console.log(data);
					that.slave = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/SlaveOrderDetail", data);
					that.getOwnerComponent().getModel("oProductModel").refresh();
				},

				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		fnUpdateStatus: function (oEvent) {
			var key = oEvent.getSource().getSelectedKey();
			var oData = {
				"status": key
			};
			var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/MasterOrderDetail/orderid");
			var sUrl = "/AdminModule/api/order/" + id;
			this.fnPutCall(sUrl, oData);

		},
		fnPutCall: function (sUrl, oData) {
			var that = this;
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
					MessageToast.show("Data saved successfully");

				},
				error: function (xhr, status) {

					MessageToast.show("Action Failed");

				},
				complete: function (xhr, status) {

				}
			});
		}

	});

});