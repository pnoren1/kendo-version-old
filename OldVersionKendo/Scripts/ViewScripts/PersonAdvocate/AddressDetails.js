setStreets = function (cityId) {
    MojControls.ComboBox.clearComboBox(MojFind("#" + Address_StreetId), true)

    if (isNaN(parseInt(cityId)))
        return;

    $.ajax({
        url: baseUrl + '/PersonApplicant/GetStreets',
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
    setStreets(MojControls.AutoComplete.getValueById(Address_CityId));
    var cityName = MojControls.AutoComplete.getTextById("#" + Address_CityId);
    if (MojControls.AutoComplete.getValueById(Address_CityId) == null)
        MojFind("#" + Address_CityId).val(cityName);
    
    MojFind("#" + Address_CityName).val(cityName);
});

MojFind("#" + Address_StreetId).change(function (e) {
    var streetName = MojControls.AutoComplete.getTextById("#" + Address_StreetId);
    MojFind("#" + Address_StreetName).val(streetName);
});

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

validateCity = function () {
    if (checkIfOnlyHebrew(Address_CityId))
        return { valid: true, message: "" };
    return { valid: false, message: Resources.Messages.InvalidHebrewPattern };
};

validateStreet = function () {
    if (checkIfOnlyHebrew(Address_StreetId))
        return { valid: true, message: "" };
    return { valid: false, message: Resources.Messages.InvalidHebrewPattern };

};

checkIfOnlyHebrew = function (id) {
    if (MojControls.AutoComplete.getValueById(id) != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(id) == -1 && MojControls.AutoComplete.getValueById(id).match("^[א-ת.\\-\\s\\']+$") == null)
        return false;
    return true;
};
//MojFind("#" + Address_IsEmployee).change(function (e) {

//    if (this.checked) {

//        MojControls.CheckBox.setValue("#" + Address_IsSelfEmployed, false);
//        MojFind("#" + Address_EmployeeOrSelfEmployee).val(Resources.Strings.Employee);

//    } else
//        MojFind("#" + Address_EmployeeOrSelfEmployee).val("");
//});

//MojFind("#" + Address_IsSelfEmployed).change(function (e) {

//    if (this.checked) {
//        MojControls.CheckBox.setValue("#" + Address_IsEmployee, false);
//        MojFind("#" + Address_EmployeeOrSelfEmployee).val(Resources.Strings.SelfEmployed);

//    } else
//        MojFind("#" + Address_EmployeeOrSelfEmployee).val("");
//});
