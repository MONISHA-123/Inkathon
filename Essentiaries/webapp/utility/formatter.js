jQuery.sap.declare("com.productTable.ProductTables.utility.formatter");

com.productTable.ProductTables.utility.formatter = {

	changeColor: function (sValue) {
		this.removeStyleClass("textGreen textRed");
		if (sValue ==="Available") {
			this.addStyleClass("textGreen");
		} else {
			this.addStyleClass("textRed");
		}
		return sValue;
	}
};