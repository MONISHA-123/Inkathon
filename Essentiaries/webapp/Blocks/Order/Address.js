sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Address = BlockBase.extend("com.ink.Essentiaries.Blocks.Order.Address", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.ink.Essentiaries.Blocks.Order.Address",
					type: "XML"
				},
				Expanded: {
					viewName: "com.ink.Essentiaries.Blocks.Order.Address",
					type: "XML"
				}
			}
		}
		
		
	});
	return Address;
});
