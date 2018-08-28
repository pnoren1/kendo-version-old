
beforeSavePhone = function () {
    

    var phoneNumberForDisplay = MojControls.AutoComplete.getTextById("PhoneForDisplayModel_PhoneAreaCodeId")
        + "-" + MojFind("#PhoneForDisplayModel_PhoneNumber").val();
        MojFind("#PhoneForDisplayModel_PhoneNumberForDisplay").val(phoneNumberForDisplay);
    var isContactPhone = MojControls.CheckBox.getValueById("PhoneForDisplayModel_IsContactPhone");
    var grid = MojControls.Grid.getKendoGridById("grdPhones");
    var currentRowId = grid.tbody.find('tr.k-state-selected').attr("data-uid");
    if (isContactPhone == true) {
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && dataItem.uid != currentRowId) {
                if (Moj.isTrue(dataItem.IsContactPhone)) {
                    dataItem.IsContactPhone = false;
                    if (dataItem.State == 0) {
                        dataItem.State = window.Enums.ObjectState.Modified;//Modified
                    }
                }
            }
        });
    }
};