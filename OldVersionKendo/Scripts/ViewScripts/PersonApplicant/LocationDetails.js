var LocationDetails = {

    clearAddressAndPhone: function () {

        MojControls.AutoComplete.setValueById(locationForDisplayObject_City, "");
        MojControls.Hidden.setValueById(locationForDisplayObject_CityId, "");
        MojControls.Hidden.setValueById(locationForDisplayObject_CityName, "");

        MojControls.ComboBox.clearComboBox(MojFind("#" + locationForDisplayObject_Street), true)

        MojControls.Hidden.setValueById(locationForDisplayObject_StreetId, "");
        MojControls.Hidden.setValueById(locationForDisplayObject_StreetName, "");
        MojControls.TextBox.setValueById(locationForDisplayObject_HouseNumber, "");
        MojControls.TextBox.setValueById(locationForDisplayObject_Flat, "");

        MojControls.AutoComplete.setValueById(locationForDisplayObject_PhoneAreaCodeId, "");
        MojControls.TextBox.setValueById(locationForDisplayObject_PhoneNumber, "");
    },

    onAddressDetailsReady: function () {
        var cityId = MojFind("#locationForDisplayObject_CityId").val();
        var cityName = MojFind("#locationForDisplayObject_CityName").val();
        if (cityId != "") {
            MojControls.AutoComplete.setValueById("locationForDisplayObject_City", cityId);
        }
        else {
            MojControls.AutoComplete.setTextById("locationForDisplayObject_City", cityName);
        }

        var streetId = MojFind("#locationForDisplayObject_StreetId").val();
        if (streetId != "") {
            MojControls.AutoComplete.setValueById("locationForDisplayObject_Street", streetId);
        }
        else {
            var streetName = MojFind("#locationForDisplayObject_StreetName").val();
            MojControls.AutoComplete.setTextById("locationForDisplayObject_Street", streetName);
        }
    },

    contactProcessToLocation: function (processId, processNoForDisplay) {

        MojFind("#locationForDisplayObject_ProcessId").val(processId);
        var processNr = processNoForDisplay == "null" || processNoForDisplay == null || processNoForDisplay == "" ? processId : processId + " - " + processNoForDisplay;
        MojFind("#lnkApplicantLocationProcessNr").text(processNr);
        MojControls.Hidden.setValue("#locationForDisplayObject_ApplicantLocationProcessNr", processNr)

    },
}


$(document).ready(function () {
    if (MojFind("#locationForDisplayObject_ID").val() == "0")
        MojControls.CheckBox.setValueById("locationForDisplayObject_IsCurrentLocation", true);

    if (MojFind("[id*=LocationInWizard]").val() == true || MojFind("[id*=LocationInWizard]").val() == "True") {
        MojFind("#lnkApplicantLocationProcessNr").addClass('hide')
        MojFind("#btnContactToProcess").visible(false)
        if (MojFind("#locationForDisplayObject_ID").val() == "0")
            MojFind("#div_lblApplicantLocationProcessNr").text("0")
    }
    else {
        MojFind("#div_lblApplicantLocationProcessNr").addClass('hide')
    }



    MojFind("#locationForDisplayObject_LocationTypeId").unbind("change").change(function () {
        LocationDetails.clearAddressAndPhone();
        MojControls.AutoComplete.clearSelectionById(locationForDisplayObject_PlaceTypeId);
        MojControls.AutoComplete.setValueById(locationForDisplayObject_PlaceContactId, -1);
        MojFind("#" + locationForDisplayObject_PlaceContactId).enable(false);
        MojControls.AutoComplete.setValueById(locationForDisplayObject_LocationReasonId, -1);
        MojControls.AutoComplete.setValueById(locationForDisplayObject_DetentionConditionTypeId, -1);
        MojControls.TextBox.setValueById(locationForDisplayObject_ImprisonmentPeriod, -1);

        if (MojControls.AutoComplete.getValueById(locationForDisplayObject_LocationTypeId) == LocationTypeEnum.PrivateHouse) {

            MojFind("#" + locationForDisplayObject_LocationReasonId).visible(true);
            MojFind("#AddressLine").removeClass("hide-important");

            MojFind("#KnownPlaceLine").addClass("hide-important");
            MojFind("#PrisonServiceLine").addClass("hide-important");
            MojFind("#" + locationForDisplayObject_DetentionConditionTypeId).visible(false);
        }
        else if (MojControls.AutoComplete.getValueById(locationForDisplayObject_LocationTypeId) == LocationTypeEnum.KnownPlace) {
            MojFind("#KnownPlaceLine").removeClass("hide-important");
            MojFind("#" + locationForDisplayObject_LocationReasonId).visible(false);
            MojFind("#" + locationForDisplayObject_DetentionConditionTypeId).visible(false);
            MojFind("#AddressLine").addClass("hide-important");
            MojFind("#PrisonServiceLine").addClass("hide-important");
        }

    });

    MojFind("#locationForDisplayObject_PlaceTypeId").change(function () {

        MojControls.AutoComplete.setValueById(locationForDisplayObject_PlaceContactId, "");
        MojControls.AutoComplete.setValueById(locationForDisplayObject_LocationReasonId, "");
        MojControls.AutoComplete.setValueById(locationForDisplayObject_DetentionConditionTypeId, "");
        MojControls.TextBox.setValueById(locationForDisplayObject_ImprisonmentPeriod, "");

        if (MojControls.AutoComplete.getValueById(locationForDisplayObject_PlaceTypeId) == "0" || MojControls.AutoComplete.getValueById(locationForDisplayObject_PlaceTypeId) == "")
            return;

        if (MojControls.AutoComplete.getValueById(locationForDisplayObject_PlaceTypeId) == PlaceTypeEnum.Prison) {
            MojFind("#PrisonServiceLine").removeClass("hide-important");

            MojFind("#" + locationForDisplayObject_LocationReasonId).visible(false);
            MojFind("#" + locationForDisplayObject_DetentionConditionTypeId).visible(false);


        }
        else {
            MojFind("#" + locationForDisplayObject_LocationReasonId).visible(true);
            MojFind("#" + locationForDisplayObject_DetentionConditionTypeId).visible(true);

            MojFind("#PrisonServiceLine").addClass("hide-important");
        }
        MojFind("#" + locationForDisplayObject_PlaceContactId).enable(true);

        $.ajax({
            url: baseUrl + '/PersonApplicant/GetPlacesByType',
            type: 'POST',
            async: false,
            contentType: "application/json",
            dataType: 'json',
            data: '{ "placeTypeId": "' + MojControls.AutoComplete.getValueById(locationForDisplayObject_PlaceTypeId) + '" }',

            success: function (retData) {
                MojControls.AutoComplete.setDataSourceAndValue(locationForDisplayObject_PlaceContactId, retData, -1);
            },
            error: function (xhr, tStatus, err) {


            }
        })
    });

    MojFind("#locationForDisplayObject_City").change(function () {

        var cityId = MojControls.AutoComplete.getValueById(locationForDisplayObject_City);
        //check if city id is int and is not equel to 0
        MojControls.TextBox.setValueById(locationForDisplayObject_HouseNumber, "", false);
        MojControls.TextBox.setValueById(locationForDisplayObject_Flat, "", false);
        MojControls.ComboBox.clearComboBox(MojFind("#" + locationForDisplayObject_Street))

        if (cityId == 0 || cityId == "") {
            MojFind("#" + locationForDisplayObject_Street).enable(false);
        }
        else {
            MojFind("#" + locationForDisplayObject_Street).enable(true);
            if (MojControls.Common.IsDigits(cityId)) {
                Moj.safeGet("/PersonApplicant/GetStreetsByCityId", { cityId: cityId }, function (streets) {
                    MojControls.AutoComplete.setDataSource(locationForDisplayObject_Street, streets);
                });
            }
        }


    });

    MojFind("#locationForDisplayObject_LeftLocation").click(function () {
        if (!MojControls.Common.isDisabledById("locationForDisplayObject_LeftLocation")) {
            var isChecked = MojControls.CheckBox.getValueById("locationForDisplayObject_LeftLocation");
            if (isChecked) {

                MojControls.DateTimePicker.setValueById("locationForDisplayObject_ToDate", "");
                MojFind("#locationForDisplayObject_ToDate").enable(false);
                MojControls.TextBox.setValueById("locationForDisplayObject_ValidToDateText", Resources.Strings.LeftLocation);
                MojControls.CheckBox.setValueById("locationForDisplayObject_IsCurrentLocation", false);
            }
            else {
                //MojControls.DateTimePicker.setValueById(locationForDisplayObject_ToDate, "");
                MojFind("#locationForDisplayObject_ToDate").enable(true);
                MojControls.TextBox.setValueById("locationForDisplayObject_ValidToDateText", "");
                MojControls.CheckBox.setValueById("locationForDisplayObject_IsCurrentLocation", true);
            }

        }
    });

    MojFind("#locationForDisplayObject_FromDate").change(function () {
        var newFromDate = MojFind("#" + locationForDisplayObject_FromDate).val();
        if (newFromDate != null && newFromDate != "") {
            if (Moj.isFalse(typeof (newFromDate) == "object")) {
                newFromDate = newFromDate.split("/");
                newFromDate = new Date(newFromDate[2], newFromDate[1] - 1, newFromDate[0]);
            }
            newFromDate.setHours(0, 0, 0, 0);
        }

        if (MojFind("#" + locationForDisplayObject_LeftLocation).val() == "true" || MojFind("#" + locationForDisplayObject_LeftLocation).val() == true || newFromDate - Date.now() > 0)
            MojControls.CheckBox.setValueById(locationForDisplayObject_IsCurrentLocation, false);
        else
            MojControls.CheckBox.setValueById(locationForDisplayObject_IsCurrentLocation, true);
    });

    MojFind("#locationForDisplayObject_ToDate").change(function () {
        if (MojFind("#" + locationForDisplayObject_ToDate).val() == "")
            MojFind("#" + locationForDisplayObject_LeftLocation).enable(true);
        else
            MojFind("#" + locationForDisplayObject_LeftLocation).enable(false);
        MojControls.TextBox.setValueById(locationForDisplayObject_ValidToDateText, MojFind("#" + locationForDisplayObject_ToDate).val());
        var newToDate = MojFind("#" + locationForDisplayObject_ToDate).val();
        if (newToDate != null && newToDate != "") {
            if (Moj.isFalse(typeof (newToDate) == "object")) {
                newToDate = newToDate.split("/");
                newToDate = new Date(newToDate[2], newToDate[1] - 1, newToDate[0]);
            }
            newToDate.setHours(0, 0, 0, 0);
        }

        var newFromDate = MojFind("#" + locationForDisplayObject_FromDate).val();
        if (newFromDate != null && newFromDate != "") {
            if (Moj.isFalse(typeof (newFromDate) == "object")) {
                newFromDate = newFromDate.split("/");
                newFromDate = new Date(newFromDate[2], newFromDate[1] - 1, newFromDate[0]);
            }
            newFromDate.setHours(0, 0, 0, 0);
        }
        if (newToDate - Date.now() >= 0 && newFromDate - Date.now() < 0)
            MojControls.CheckBox.setValueById("locationForDisplayObject_IsCurrentLocation", true);
        else
            MojControls.CheckBox.setValueById("locationForDisplayObject_IsCurrentLocation", false);
    });

    MojFind("#btnContactToProcess").click(function () {

        if (MojFind("#locationForDisplayObject_ProcessId").val() != "") {
            Moj.confirm(Resources.Messages.ContactedToProcess, function () {
                //use website popup until fix the grid scroll
                Moj.website.openPopupWindow("ContactToProcess", "", Resources.Strings.ContactToProcess, 1200, 350, false, false, false, baseUrl + "/PersonApplicant/ContactProcess?isSingleSelect=true", "", {});

            }, {}, function () {
                return false;
            }, undefined, undefined, Resources.Strings.Yes, Resources.Strings.No);
        }
        else {
            //use website popup until fix the grid scroll
            Moj.website.openPopupWindow("ContactToProcess", "", Resources.Strings.ContactToProcess, 1200, 350, false, false, false, baseUrl + "/PersonApplicant/ContactProcess?isSingleSelect=true", "", {});

        }

    });

    MojFind("#lnkApplicantLocationProcessNr").click(function () {

        if (MojFind("#locationForDisplayObject_ProcessId").val() != "") {
            PDO.addEntityContentTab(EntityContentTypeEnum.Process, MojFind("#locationForDisplayObject_ProcessId").val(), null, Resources.Strings.Process + " " + MojFind("#locationForDisplayObject_ProcessId").val(), "Process_Tab_" + MojFind("#locationForDisplayObject_ProcessId").val());
        }

    });
});

