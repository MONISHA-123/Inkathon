sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/uxap/BlockBase"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator,BlockBase) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.OrderDetail", {
	onInit: function () {
			console.log("InsideController");	
		},
	fnToTrackOrder: function(){
			MessageToast.show("Inside Order");
		}
	});
});