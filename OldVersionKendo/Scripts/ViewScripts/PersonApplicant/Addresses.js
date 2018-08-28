function AddressesModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    };

    self.loadAddressesView = function () {
        PDO.loadEntityTab('/PersonApplicant/Addresses');
    };

    saveAddresses = function (data) {
        if (data.ActionResult.IsChange) {
            PDO.afterSaveEntityContentTab('/PersonApplicant/Addresses', data.EntityInfo);
        }
    };
}