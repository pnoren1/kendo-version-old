

$(document).on('click', "#" + btnCancelPlacesDetails, function () {
  
    MojFind("#" + SelectedPlaceTypeId).enable(true);
});

$(document).ready(function () {
 
    MojFind("#" + SelectedPlaceTypeId).enable(false);

    MojControls.Hidden.setValueById(Place_PlaceTypeId, MojControls.AutoComplete.getValueById(SelectedPlaceTypeId));

    if (MojControls.Hidden.getValueById(Place_PlaceTypeId) == PlaceTypeEnum.Court) {
        if (MojFind(Place_CourtTypeId) != undefined && !MojFind(Place_CourtTypeId).is(':visible')) {
            MojControls.Common.setVisibilityById(Place_CourtTypeId, true);
        }
    }
    
});

validateCity = function () {
    if (checkIfOnlyHebrew(Address_CityId))
        return { valid: true, message: "" };
    return { valid: false, message: Resources.Messages.InvalidHebrewPattern };
};

savePlace = function (data) {
    if (data.Error != null) {
        Moj.showErrorMessage(data.Error, function () {
            return false;
        });
    }
    else {
        Moj.callActionWithJson(MojFind("#" + div_savePlaceDetailsActionButton).closest("form").attr("id"), "/Management/SavePlace", function (data) {
            if (data != null) {
                if (data.Errors.length > 0) {
                    Moj.showErrorMessage(data.Errors, function () {
                        return false;
                    });
                } else {                    
                    MojFind("#" + selectedTabContent).load(baseUrl + "/Management/PlacesManager?PlaceTypeId=" + MojControls.AutoComplete.getValueById(SelectedPlaceTypeId));
                }
            }
        });
    }
};

setStreets = function (cityId) {
    MojControls.ComboBox.clearComboBox(MojFind("#" + Address_StreetId), true)
    $.ajax({
        url: baseUrl + '/PersonApplicant/GetStreetsByCityId',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{ "cityId": "' + cityId + '" }',

        success: function (retData) {

            if (JSON.stringify(retData) != "[]") {
                MojControls.AutoComplete.setDataSource(Address_StreetId, retData);
            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
};

MojFind("#" + Address_CityId).change(function (e) {
    if (MojControls.AutoComplete.getValueById(Address_CityId).match(/^\d+$/))
        setStreets(MojControls.AutoComplete.getValueById(Address_CityId));
    else
        MojControls.ComboBox.clearComboBox(MojFind("#" + Address_StreetId), true)     


    MojControls.TextBox.setValueById(Address_HouseNumber, "");
    MojControls.TextBox.setValueById(Address_ZipCode, "");
    MojControls.TextBox.setValueById(Address_PostOfficeBox, "");

});

validateStreet = function () {
    if (checkIfOnlyHebrew(Address_StreetId))
        return { valid: true, message: "" };
    return { valid: false, message: Resources.Messages.InvalidHebrewPattern };

};

checkIfOnlyHebrew = function (id) {
    if (MojControls.AutoComplete.getValueById(id) != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(id) == -1 && MojControls.AutoComplete.getValueById(id).match("^[א-ת.\\-\\s\\']+$") == null) {
        return false;
    }
    return true;
};

MojFind("#" + Address_HouseNumber).change(function (e) {
    setZipCodeForStreet(MojControls.AutoComplete.getValueById(Address_CityId), MojControls.AutoComplete.getValueById(Address_StreetId), MojControls.TextBox.getValueById(Address_HouseNumber), '');
});

setZipCodeForStreet = function (cityId, streetId, houseNumber, entrance) {

    if (isNaN(parseInt(cityId)) || isNaN(parseInt(streetId)) || $.trim(houseNumber) == "")
        return;

    MojControls.TextBox.setValueById(Address_ZipCode, "");

    $.ajax({
        url: baseUrl + '/PersonApplicant/GetZipCodeForStreet',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "cityId=" + cityId + "&streetId=" + streetId + "&houseNumber=" + houseNumber + "&entrance=" + entrance,

        success: function (retData) {
            if (retData != '') {
                MojControls.TextBox.setValueById(Address_ZipCode, retData);

            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
};

MojFind("#" + Address_PostOfficeBox).change(function (e) {
    setZipCodeForPoBox(MojControls.AutoComplete.getValueById(Address_CityId), MojControls.TextBox.getValueById(Address_PostOfficeBox));
});

setZipCodeForPoBox = function (cityId, poBox) {
    if (isNaN(parseInt(cityId)) || isNaN(parseInt(poBox)))
        return;

    MojControls.TextBox.setValueById(Address_ZipCode, "");

    $.ajax({
        url: baseUrl + '/PersonApplicant/GetZipCodeForPoBox',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "cityId=" + cityId + "&poBox=" + poBox,

        success: function (retData) {
            if (retData != '') {
                MojControls.TextBox.setValueById(Address_ZipCode, retData);
            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
};



