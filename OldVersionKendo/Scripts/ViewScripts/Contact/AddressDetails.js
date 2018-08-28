$(document).ready(function () {

    MojFind("#AddressForDisplayModel_City").change(function () {
        var cityId = MojControls.AutoComplete.getValueById("AddressForDisplayModel_City");
        //check if city id is int and is not equel to 0
        MojControls.TextBox.setValueById("AddressForDisplayModel_HouseNumber", "", false);
        MojControls.TextBox.setValueById("AddressForDisplayModel_Flat", "", false);
        MojControls.TextBox.setValueById("AddressForDisplayModel_PostOfficeBox", "", false);
        MojControls.TextBox.setValueById("AddressForDisplayModel_ZipCode", "", false);

        //MojControls.AutoComplete.clear("AddressForDisplayModel_Street");
       // MojControls.AutoComplete.setDataSourceAndValue("AddressForDisplayModel_Street", null, "");
        MojControls.ComboBox.clearComboBox(MojFind("#AddressForDisplayModel_Street"))
        if (cityId == 0 || cityId == "") {
            MojFind("#AddressForDisplayModel_Street").enable(false);
        }
        else {
            MojFind("#AddressForDisplayModel_Street").enable(true);
            if (MojControls.Common.IsDigits(cityId)) {
                Moj.safeGet("/PersonApplicant/GetStreetsByCityId", { cityId: cityId }, function (streets) {
                    MojControls.AutoComplete.setDataSource("AddressForDisplayModel_Street", streets);
                    MojFind("#AddressForDisplayModel_Street").data("kendoComboBox").select(-1);
                });
            }
        }
    });

});

onAddressDetailsReady = function () {
    setCity();
    setStreet();
};

setCity = function () {
    var cityId = MojFind("#AddressForDisplayModel_CityId").val();
    var cityName = MojFind("#AddressForDisplayModel_CityName").val();
    if (cityId != "") {
        MojControls.AutoComplete.setValueById("AddressForDisplayModel_City", cityId);
    }
    else {     
        MojControls.AutoComplete.setTextById("AddressForDisplayModel_City", cityName);
    }

}

setStreet = function () {
    var streetId = MojFind("#AddressForDisplayModel_StreetId").val();
    if (streetId != "") {
        MojControls.AutoComplete.setValueById("AddressForDisplayModel_Street", streetId);
    }
    else {
        var streetName = MojFind("#AddressForDisplayModel_StreetName").val();
        MojControls.AutoComplete.setTextById("AddressForDisplayModel_Street", streetName);
    }

    var cityId = MojControls.AutoComplete.getValueById("AddressForDisplayModel_City");
    if (cityId == 0 || cityId == "") {
        MojFind("#AddressForDisplayModel_Street").enable(false);
    }
}

beforeSaveAddress = function () {
    MojFind("#AddressForDisplayModel_CityName").val(MojControls.AutoComplete.getTextById("AddressForDisplayModel_City"));
    MojFind("#AddressForDisplayModel_StreetName").val(MojControls.AutoComplete.getTextById("AddressForDisplayModel_Street"));

    var city = MojControls.AutoComplete.getValueById("AddressForDisplayModel_City")
    if (MojControls.Common.IsDigits(city)) {
        MojFind("#AddressForDisplayModel_CityId").val(city);
    }
    else {
        MojFind("#AddressForDisplayModel_CityId").val("");
    }

    var street = MojControls.AutoComplete.getValueById("AddressForDisplayModel_Street");
    if (MojControls.Common.IsDigits(street)) {
        MojFind("#AddressForDisplayModel_StreetId").val(street);
    }
    else {
        MojFind("#AddressForDisplayModel_StreetId").val("");
    }

    if (MojFind("#ContactTypeId").val() == ContactTypeEnum.Applicant) {
        var isContactAddress = MojControls.CheckBox.getValueById("AddressForDisplayModel_IsContactAddress");
        var grid = MojControls.Grid.getKendoGridById("grdAddresses");
        var currentRowId = grid.tbody.find('tr.k-state-selected').attr("data-uid");
        if (isContactAddress == true) {
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined && dataItem.uid != currentRowId) {
                    if (Moj.isTrue(dataItem.IsContactAddress)) {
                        dataItem.IsContactAddress = false;
                        if (dataItem.State == 0) {
                            dataItem.State = window.Enums.ObjectState.Modified;//Modified
                        }
                    }
                }
            });
        }
    }
    if (MojFind("#ContactTypeId").val() == ContactTypeEnum.Advocate) {
        var isDocumentAddress = MojControls.CheckBox.getValueById("AddressForDisplayModel_IsDocumentAddress");
        var grid = MojControls.Grid.getKendoGridById("grdAddresses");
        var currentRowId = grid.tbody.find('tr.k-state-selected').attr("data-uid");
        if (isDocumentAddress == true) {
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined && dataItem.uid != currentRowId) {
                    if (Moj.isTrue(dataItem.IsDocumentAddress)) {
                        dataItem.IsDocumentAddress = false;
                        if (dataItem.State == 0) {
                            dataItem.State = window.Enums.ObjectState.Modified;//Modified
                        }
                    }
                }
            });
        }
    }
};

MojFind("#AddressForDisplayModel_HouseNumber").change(function (e) {

    setZipCodeForStreet(MojControls.AutoComplete.getValueById("AddressForDisplayModel_City"), MojControls.AutoComplete.getValueById("AddressForDisplayModel_Street"), MojControls.TextBox.getValueById("AddressForDisplayModel_HouseNumber"), '');
});

MojFind("#AddressForDisplayModel_PostOfficeBox").change(function (e) {
    setZipCodeForPoBox(MojControls.AutoComplete.getValueById("AddressForDisplayModel_CityId"), MojControls.TextBox.getValueById("AddressForDisplayModel_PostOfficeBox"));
});

MojFind("#AddressForDisplayModel_IsDocumentAddress").click(function () {
    var isDocumentAddress = MojControls.CheckBox.getValueById("AddressForDisplayModel_IsDocumentAddress");

    if (isDocumentAddress && MojFind("#Advocate_ContactId").val() != 0 && MojFind("#InDistrict").val() == "False") {
        Moj.showErrorMessage(Resources.Messages.CantAddAddressInDistrict)
        MojControls.CheckBox.setValueById("AddressForDisplayModel_IsDocumentAddress", false);
    }
});

setZipCodeForPoBox = function (cityId, poBox) {
    if (isNaN(parseInt(cityId)) || isNaN(parseInt(poBox)))
        return;

    MojControls.TextBox.setValueById("AddressForDisplayModel_ZipCode", "");

    $.ajax({
        url: baseUrl + '/PersonApplicant/GetZipCodeForPoBox',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "cityId=" + cityId + "&poBox=" + poBox,

        success: function (retData) {
            if (retData != '') {
                MojControls.TextBox.setValueById("AddressForDisplayModel_ZipCode", retData);

            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
};

setZipCodeForStreet = function (cityId, streetId, houseNumber, entrance) {

    if (isNaN(parseInt(cityId)) || isNaN(parseInt(streetId)) || $.trim(houseNumber) == "")
        return;

    MojControls.TextBox.setValueById("AddressForDisplayModel_ZipCode", "");

    $.ajax({
        url: baseUrl + '/PersonApplicant/GetZipCodeForStreet',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "cityId=" + cityId + "&streetId=" + streetId + "&houseNumber=" + houseNumber + "&entrance=" + entrance,

        success: function (retData) {
            if (retData != '') {
                MojControls.TextBox.setValueById("AddressForDisplayModel_ZipCode", retData);

            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
};


   


