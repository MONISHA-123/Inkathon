sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var OrderDetails = BlockBase.extend("com.ink.Essentiaries.Blocks.Order.OrderDetail", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.ink.Essentiaries.Blocks.Order.OrderDetail",
					type: "XML"
				},
				Expanded: {
					viewName: "com.ink.Essentiaries.Blocks.Order.OrderDetail",
					type: "XML"
				}
			}
		}
		
		
	});
	return OrderDetails;
});
