var MessageType = {
};
MessageType.Error = "error";
MessageType.Message = "message";
MessageType.Alert = "alert";

function ApplicantDetailsModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
         return fieldPrefix + "_";
    };

self.setCountries = function (personTypeId) {
    
    if (MojControls.Hidden.getValueById(self.getFieldPrefix() + CountriesWithIsrael) != undefined &&
        (personTypeId == PersonIdTypesEnum.IdentityNumber || personTypeId == PersonIdTypesEnum.NoneNumberId || personTypeId == PersonIdTypesEnum.NoData)) {

        MojControls.DropDown.setDataSource(self.getFieldPrefix() +Person_CountryId, JSON.parse(MojControls.Hidden.getValueById(self.getFieldPrefix() + CountriesWithIsrael)));


    }
        else if (MojControls.Hidden.getValueById(self.getFieldPrefix() + CountriesWithoutIsrael) != undefined && personTypeId == PersonIdTypesEnum.OtherNumberId) {

        if (MojControls.DropDown.getValueById(self.getFieldPrefix() + Person_CountryId) == CountryEnum.IsraelCode) {
            MojControls.DropDown.setValueById(self.getFieldPrefix() + Person_CountryId, "0");
        }

        MojControls.DropDown.setDataSource(self.getFieldPrefix() + Person_CountryId, JSON.parse(MojControls.Hidden.getValueById(self.getFieldPrefix() + CountriesWithoutIsrael)));
    }

    if (personTypeId == PersonIdTypesEnum.IdentityNumber) {
        MojControls.DropDown.setValueById(self.getFieldPrefix() + Person_CountryId, CountryEnum.IsraelCode);
        MojFind("#" + self.getFieldPrefix() + Person_CountryId).enable(false);
        //MojControls.Common.changeAvailabilityById(self.getFieldPrefix() + Person_CountryId, false);
    }

    else if (personTypeId == PersonIdTypesEnum.OtherNumberId || personTypeId == PersonIdTypesEnum.NoneNumberId) {
        MojFind("#" + self.getFieldPrefix() + Person_CountryId).enable(true);
            //MojControls.Common.changeAvailabilityById(self.getFieldPrefix() + Person_CountryId, true);

    }
    else if (personTypeId == PersonIdTypesEnum.NoData) {
        MojControls.DropDown.setValueById(self.getFieldPrefix() + Person_CountryId, "0");
        MojFind("#" +self.getFieldPrefix() + Person_CountryId).enable(false);
        //MojControls.Common.changeAvailabilityById(Person_CountryId, false);
    }
}

self.enableAddress = function () {
    MojFind("#" + Address_CityId).enable(true);
    MojFind("#" + Address_StreetId).enable(true);
    MojFind("#" + Address_HouseNumber).enable(true);
    MojFind("#" + Address_ZipCode).enable(true);

    //MojControls.Common.changeAvailabilityById(Address_CityId, true);
    //MojControls.Common.changeAvailabilityById(Address_StreetId, true);
    //MojControls.Common.changeAvailabilityById(Address_HouseNumber, true);
    //MojControls.Common.changeAvailabilityById(Address_ZipCode, true);
};

self.changeAvailabilityAddress = function (isEnable) {
    MojFind("#" + Address_CityId).enable(isEnable);
    MojFind("#" + Address_StreetId).enable(isEnable);
    MojFind("#" + Address_HouseNumber).enable(isEnable);
    MojFind("#" + Address_Flat).enable(isEnable);
    MojFind("#" + Address_ZipCode).enable(isEnable);
    MojFind("#" + Address_AtAddress).enable(isEnable);
    MojFind("#" + Address_PostOfficeBox).enable(isEnable);


    //MojControls.Common.changeAvailabilityById(Address_CityId, true);
    //MojControls.Common.changeAvailabilityById(Address_StreetId, true);
    //MojControls.Common.changeAvailabilityById(Address_HouseNumber, true);
    //MojControls.Common.changeAvailabilityById(Address_ZipCode, true);
};

MojFind("#" +self.getFieldPrefix() +Person_PersonIDTypeId).unbind("change").change(function () {
        
    self.enableAddress();

    if (MojControls.DropDown.getValueById(self.getFieldPrefix()+Person_PersonIDTypeId) != PersonIdTypesEnum.IdentityNumber) {
        MojFind('.minus').each(function () {
            MojFind("#" + $(this).attr("data-id")).slideUp();
            $(this).closest(".moj-form-title").addClass("no-border-bottom");
            $(this).removeClass("minus").addClass("plus");
        });
        clearIMFields();
    }
    var personIdTypeId = MojControls.DropDown.getValueById(self.getFieldPrefix() +Person_PersonIDTypeId);
    switch (parseInt(personIdTypeId)) {
        case PersonIdTypesEnum.IdentityNumber:
            self.setIdentityNumber();
            break;
        case PersonIdTypesEnum.OtherNumberId:
            setOtherNumberId();
            break;
        case PersonIdTypesEnum.NoneNumberId:
            setNoneNumber();
            break;
        case PersonIdTypesEnum.NoData:
            setNoData();
            break;
    }

});

self.setIdentityNumber = function () {
    if (MojControls.Hidden.getValueById(self.getFieldPrefix() +State) == ApplicantStateEnum.InjectedID || MojControls.Hidden.getValueById(self.getFieldPrefix() +State) == ApplicantStateEnum.InjectedIDOther) {
        //if (/^[0-9]+$/.test(MojControls.TextBox.getValueById(Person_IDOther)) && MojControls.TextBox.getValueById(Person_IDOther).length <= 9) {
        //    MojControls.TextBox.setValueById(Person_IDNumber, MojControls.TextBox.getValueById(Person_IDOther));
        //}
        if (MojControls.TextBox.getValueById(self.getFieldPrefix() +Person_IDNumber) != '') {
            MojFind("#" +self.getFieldPrefix() +Person_IDNumber).enable(false);
            //MojControls.Common.changeAvailabilityById(Person_IDNumber, false);
            MojFind("#" +self.getFieldPrefix() +Person_IDNumber).change();
        }
    }

    if (MojControls.TextBox.getValueById(self.getFieldPrefix() +Person_IDNumber) == '') {
        MojFind("#" +self.getFieldPrefix() +Person_IDNumber).enable(true);
        //MojControls.Common.changeAvailabilityById(Person_IDNumber, true);
    }

    //MojControls.TextBox.setValueById(Person_IDOther, "");

    MojControls.Common.setVisibilityById(self.getFieldPrefix() +Person_IDNumber, true);
    //MojControls.Common.setVisibilityById(Person_IDOther, false);

    //MojControls.Common.changeAvailabilityById(Person_FirstName, false);
    //MojControls.Common.changeAvailabilityById(Person_LastName, false);
    //MojControls.Common.changeAvailabilityById(Person_FatherName, true);
    //MojControls.Common.changeAvailabilityById(Person_BirthDate, true);
        //MojControls.Common.changeAvailabilityById(Person_Gender, true);

    MojFind("#" +self.getFieldPrefix() +Person_FirstName).enable(false);
    MojFind("#" +self.getFieldPrefix() +Person_LastName).enable(false);
    MojFind("#" +self.getFieldPrefix() +Person_FatherName).enable(true);
    MojFind("#" +self.getFieldPrefix() + Person_BirthDate).enable(true);
    MojFind("#" + self.getFieldPrefix() +Person_Gender).enable(true);

    
    self.setCountries(PersonIdTypesEnum.IdentityNumber);

};

setOtherNumberId = function () {
    if (MojControls.Hidden.getValueById(State) == ApplicantStateEnum.InjectedID) {
        MojControls.TextBox.setValueById(Person_IDOther, MojControls.TextBox.getValueById(Person_IDNumber));

    }

    if (MojControls.TextBox.getValueById(Person_IDOther) == '') {
        MojFind("#" + Person_IDOther).enable(true);
        //MojControls.Common.changeAvailabilityById(Person_IDOther, true);

    }
    else if (MojControls.Hidden.getValueById(State) == ApplicantStateEnum.InjectedID || MojControls.Hidden.getValueById(State) == ApplicantStateEnum.InjectedIDOther) {
        MojFind("#" + Person_IDOther).enable(false);
        //MojControls.Common.changeAvailabilityById(Person_IDOther, false);

    }

    MojControls.TextBox.setValueById(Person_IDNumber, "");

    MojControls.Common.setVisibilityById(Person_IDNumber, false);
    MojControls.Common.setVisibilityById(Person_IDOther, true);

    MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, "");

    MojFind("#" + Person_FirstName).enable(true);
    MojFind("#" + Person_LastName).enable(true);
    MojFind("#" + Person_FatherName).enable(true);
    MojFind("#" + Person_BirthDate).enable(true);
    MojFind("#" + Person_Gender).enable(true);

    //MojControls.Common.changeAvailabilityById(Person_FirstName, true);
    //MojControls.Common.changeAvailabilityById(Person_LastName, true);
    //MojControls.Common.changeAvailabilityById(Person_FatherName, true);
    //MojControls.Common.changeAvailabilityById(Person_BirthDate, true);
    //MojControls.Common.changeAvailabilityById(Person_Gender, true);

    setCountries(PersonIdTypesEnum.OtherNumberId);
};

setNoneNumber = function () {

    MojControls.TextBox.setValueById(Person_IDNumber, "");
    MojControls.TextBox.setValueById(Person_IDOther, "");
    MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, "");

    MojControls.Common.setVisibilityById(Person_IDNumber, false);
    MojControls.Common.setVisibilityById(Person_IDOther, true);

    MojFind("#" + Person_IDOther).enable(false);
    //MojControls.Common.changeAvailabilityById(Person_IDOther, false);

    MojFind("#" + Person_FirstName).enable(true);
    MojFind("#" + Person_LastName).enable(true);
    MojFind("#" + Person_FatherName).enable(true);
    MojFind("#" + Person_BirthDate).enable(true);
    MojFind("#" + Person_Gender).enable(true);

    setCountries(PersonIdTypesEnum.NoneNumberId);
};

setNoData = function () {

    MojControls.TextBox.setValueById(Person_IDNumber, "");
    MojControls.TextBox.setValueById(Person_IDOther, "");

    MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, "");

    MojControls.TextBox.setValueById(Person_LastName, "");
    MojControls.TextBox.setValueById(Person_FirstName, "");
    MojControls.TextBox.setValueById(Person_FatherName, "");
    MojControls.DateTimePicker.setValueById(Person_BirthDate, "");
    MojControls.TextBox.setValueById(Person_AgeString, "");


    MojControls.AutoComplete.setValueById(Address_CityId, "");
    MojControls.AutoComplete.setValueById(Address_StreetId, "");
    MojControls.TextBox.setValueById(Address_HouseNumber, "");
    MojControls.TextBox.setValueById(Address_ZipCode, "");

    MojControls.Common.setVisibilityById(Person_IDNumber, false);
    MojControls.Common.setVisibilityById(Person_IDOther, true);


    MojFind("#" + Person_IDOther).enable(false);
    MojFind("#" + Person_FirstName).enable(false);
    MojFind("#" + Person_LastName).enable(false);
    MojFind("#" + Person_FatherName).enable(false);
    MojFind("#" + Person_BirthDate).enable(false);
    MojFind("#" + Person_Gender).enable(true);

    setCountries(PersonIdTypesEnum.NoData);
};

MojFind("#" + Person_IDNumber).unbind("change").change(function () {
    if (/^[0-9]+$/.test(MojControls.TextBox.getValueById(Person_IDNumber))) {
        var isValid = PDO.validateId(MojControls.TextBox.getValueById(Person_IDNumber));
        if (isValid) {
            MojFind('.minus').each(function () {
                MojFind("#" + $(this).attr("data-id")).slideUp();
                $(this).closest(".moj-form-title").addClass("no-border-bottom");
                $(this).removeClass("minus").addClass("plus");
            });
            getFromAviv(MojFind('.plus'), false);

        } else {
            Moj.confirm(Resources.Messages.InvalidID, function () {
                MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotValid);
                MojFind("#" + Person_FirstName).enable(true);
                MojFind("#" + Person_LastName).enable(true);
                MojFind("#" + Person_Gender).enable(true);
                //MojControls.Common.changeAvailabilityById(Person_FirstName, true);
                //MojControls.Common.changeAvailabilityById(Person_LastName, true);
                //MojControls.Common.changeAvailabilityById(Person_Gender, true);


                MojFind('.minus').each(function () {
                    MojFind("#" + $(this).attr("data-id")).slideUp();
                    $(this).closest(".moj-form-title").addClass("no-border-bottom");
                    $(this).removeClass("minus").addClass("plus");
                });

                clearIMFields();
            }, function () {
            });
        }
    }
});

getFromAviv = function (obj, isPlusClicked) {
    var identity = MojControls.TextBox.getValueById(Person_IDNumber);

    if (identity == "") { return; }

    $.get(baseUrl + '/PersonApplicant/GetPersonFromIM?id=' + identity, function (data) {

        if (data.ErrorCode == MessageCodeInteriorMinistryEnum.InteriorMinistryNotActive) {
            MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotChecked);
            clearIMFields();

        }
        else if (data.ErrorCode == MessageCodeInteriorMinistryEnum.ContactNotExistInInteriorMinistry || data.ErrorCode == MessageCodeInteriorMinistryEnum.CheckDigitIsWrong || data.ErrorCode == MessageCodeInteriorMinistryEnum.ContactDoesNotExist) {
            MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotValid);
            clearIMFields();
        }
        else {

            MojFind("#" + Person_FirstName).enable(true);
            MojFind("#" + Person_LastName).enable(true);
            MojFind("#" + Person_FatherName).enable(true);
            MojFind("#" + Person_BirthDate).enable(true);
            MojFind("#" + Person_Gender).enable(true);

            //MojControls.Common.changeAvailabilityById(Person_FirstName, true);
            //MojControls.Common.changeAvailabilityById(Person_LastName, true);
            //MojControls.Common.changeAvailabilityById(Person_FatherName, true);
            //MojControls.Common.changeAvailabilityById(Person_BirthDate, true);
            //MojControls.Common.changeAvailabilityById(Person_Gender, true);

            if (data.ErrorCode == 0 || data.ErrorCode == "" || data.ErrorCode == undefined) {

                if (MojControls.AutoComplete.getValueById(Person_PersonIDNumberStatusId) != PersonIdNumberStatusEnum.Verified)
                    MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotVerified);

                MojControls.TextBox.setValueById(PersonFromIM_LastName, data.LastName);
                MojControls.TextBox.setValueById(PersonFromIM_FirstName, data.FirstName);
                MojControls.TextBox.setValueById(PersonFromIM_FatherName, data.FatherName);
                MojControls.TextBox.setValueById(PersonFromIM_BirthDate, data.BirthDate);


                MojFind("#" + btnCopyDetails).removeAttr("disabled");
                MojFind("#" + div_btnCopyDetails).removeAttr("disabled");

                if (data.CityId != "" || data.CityName != "" || data.StreetId != "" || data.StreetName != "" || data.HouseNumber != "" || data.ZipCode != "") {

                    MojControls.Hidden.setValueById(PersonFromIM_CityId, data.CityId);
                    MojControls.TextBox.setValueById(PersonFromIM_CityName, data.CityName);
                    MojControls.Hidden.setValueById(PersonFromIM_StreetId, data.StreetId);
                    MojControls.TextBox.setValueById(PersonFromIM_StreetName, data.StreetName);
                    MojControls.TextBox.setValueById(PersonFromIM_HouseNumber, data.HouseNumber);
                    MojControls.TextBox.setValueById(PersonFromIM_ZipCode, data.ZipCode);

                    MojFind("#" + btnCopyAddress).removeAttr("disabled");
                    MojFind("#" + div_btnCopyAddress).removeAttr("disabled");


                    if (isPlusClicked) {
                        MojFind("#" + obj.attr("data-id")).slideDown();
                        obj.removeClass("plus").addClass("minus");
                        obj.unbind("click");
                        obj.on('click', minus);
                        obj.closest(".moj-form-title").removeClass("no-border-bottom");

                        if (obj.closest(".moj-panel")[0].id == "pnlIMAddress") {
                            // || obj.closest(".moj-panel")[0].id == "pnlIM") {
                            MojControls.Hidden.setValueById(IsAddressOpened, true);
                        }
                    }
                    else {

                        MojFind('.plus').each(function () {

                            MojFind("#" + $(this).attr("data-id")).slideDown();
                            $(this).removeClass("plus").addClass("minus");
                            $(this).unbind("click");
                            $(this).on('click', minus);
                            $(this).closest(".moj-form-title").removeClass("no-border-bottom");
                            
                        });
                    }
                }

            }
        }

    }, "json").fail(function () {
        MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotChecked);
        MojFind('.minus').each(function () {
            MojFind("#" + $(this).attr("data-id")).slideUp();
            $(this).closest(".moj-form-title").addClass("no-border-bottom");
            $(this).removeClass("minus").addClass("plus");
        });
        clearIMFields();

    });
};

clearIMFields = function () {

    MojControls.TextBox.setValueById(PersonFromIM_LastName, "");
    MojControls.TextBox.setValueById(PersonFromIM_FirstName, "");
    MojControls.TextBox.setValueById(PersonFromIM_FatherName, "");
    MojControls.TextBox.setValueById(PersonFromIM_BirthDate, "");
    MojControls.TextBox.setValueById(PersonFromIM_CityName, "");
    MojControls.TextBox.setValueById(PersonFromIM_StreetName, "");
    MojControls.TextBox.setValueById(PersonFromIM_HouseNumber, "");
    MojControls.TextBox.setValueById(PersonFromIM_ZipCode, "");

};

MojFind('.plus').click(function () {
  
        if (MojControls.DropDown.getValueById(Person_PersonIDTypeId) == PersonIdTypesEnum.IdentityNumber && MojControls.AutoComplete.getValueById(Person_PersonIDNumberStatusId) != PersonIdNumberStatusEnum.NotValid) {
            getFromAviv($(this), true);
        }
});

plus = function () {
   
        if (MojControls.DropDown.getValueById(Person_PersonIDTypeId) == PersonIdTypesEnum.IdentityNumber && MojControls.AutoComplete.getValueById(Person_PersonIDNumberStatusId) != PersonIdNumberStatusEnum.NotValid) {
            getFromAviv($(this), true);
        }
}

minus = function () {
    if (MojControls.DropDown.getValueById(Person_PersonIDTypeId) == PersonIdTypesEnum.IdentityNumber) {
        MojFind("#" + $(this).attr("data-id")).slideUp(function () {
            $(this).closest(".moj-form-title").addClass("no-border-bottom");
        });
        $(this).removeClass("minus").addClass("plus");
        $(this).unbind("click");
        $(this).on('click', plus);
        $(this).closest(".moj-form-title").addClass("no-border-bottom");


    }
};

$(document).undelegate('.minus', 'click');

$(document).undelegate('.plus', 'click');

MojFind("#" + btnCopyDetails).click(function () {

    MojFind("#" + Person_IDNumber).enable(false);
    MojFind("#" + Person_FatherName).enable(false);
    MojFind("#" + Person_BirthDate).enable(false);
    MojFind("#" + Person_Gender).enable(true);
    MojFind("#" + Person_CountryId).enable(false);
    MojFind("#" + Person_Gender).enable(true);
    //MojControls.Common.changeAvailabilityById(Person_IDNumber, false);
    //MojControls.Common.changeAvailabilityById(Person_FatherName, false);
    //MojControls.Common.changeAvailabilityById(Person_BirthDate, false);
    //MojControls.Common.changeAvailabilityById(Person_Gender, true);
    //MojControls.Common.changeAvailabilityById(Person_CountryId, false);
    //MojControls.Common.changeAvailabilityById(Person_Gender, true);

    MojControls.AutoComplete.setValueById(Person_PersonIDNumberStatusId, PersonIdNumberStatusEnum.Verified);
    MojControls.TextBox.setValueById(Person_LastName, MojControls.TextBox.getValueById(PersonFromIM_LastName));
    MojControls.TextBox.setValueById(Person_FirstName, MojControls.TextBox.getValueById(PersonFromIM_FirstName));
    MojControls.TextBox.setValueById(Person_FatherName, MojControls.TextBox.getValueById(PersonFromIM_FatherName));
    MojControls.DateTimePicker.setValueById(Person_BirthDate, MojControls.TextBox.getValueById(PersonFromIM_BirthDate));

    setAge(MojControls.TextBox.getValueById(PersonFromIM_BirthDate));

    MojControls.DropDown.setValueById(Person_CountryId, CountryEnum.IsraelCode); //Israel Country

    MojControls.Hidden.setValueById(ObjectState, true);

});

MojFind("#" + btnCopyAddress).click(function () {
    if (MojControls.Hidden.getValueById(IsNew) == "True" || MojControls.Hidden.getValueById(IsNew) == true)
        MojControls.DropDown.setValueById(AddressStateId, AddressStatesEnum.UpdatedAddress);
    else
        MojControls.DropDown.setValueById(AddressStateId, AddressStatesEnum.NewAddress);

    //-------------------------------------//

    if (MojControls.AutoComplete.getValueById(Address_CityId) == MojControls.AutoComplete.getTextById(Address_CityId)) {
        MojControls.AutoComplete.setTextById(Address_CityId, MojControls.TextBox.getValueById(PersonFromIM_CityName));
    }

    if (MojControls.Hidden.getValueById(PersonFromIM_CityId) != "") {
        MojControls.AutoComplete.setValueById(Address_CityId, MojControls.Hidden.getValueById(PersonFromIM_CityId));
    }
    else {
        MojControls.AutoComplete.setValueById(Address_CityId, MojControls.TextBox.getValueById(PersonFromIM_CityName));
    }

    MojFind("#" + Address_CityId).enable(false);

    if (MojControls.Hidden.getValueById(PersonFromIM_StreetId) != "") {
   
        $.when(
        $.ajax(setStreets(MojControls.Hidden.getValueById(PersonFromIM_CityId)))

    ).then(function () {
      
        MojControls.AutoComplete.setValueById(Address_StreetId, MojControls.Hidden.getValueById(PersonFromIM_StreetId));
    });

    }
    else {
      
        MojControls.AutoComplete.setValueById(Address_StreetId, MojControls.TextBox.getValueById(PersonFromIM_StreetName));
    }
    MojFind("#" + Address_StreetId).enable(false);

    MojControls.TextBox.setValueById(Address_HouseNumber, MojControls.TextBox.getValueById(PersonFromIM_HouseNumber));
    MojFind("#" + Address_HouseNumber).enable(false);

    MojControls.TextBox.setValueById(Address_ZipCode, MojControls.TextBox.getValueById(PersonFromIM_ZipCode));
    MojFind("#" + Address_ZipCode).enable(false);
    MojControls.TextBox.setValueById(ObjectStateAddresses, true);

});

setAge = function (age) {
    if (checkRangeOfDates().valid) {
        var age = PDO.getAgeAsString(age);
        if (age < 0) 
            age = "";
        MojControls.TextBox.setValueById(Person_AgeString, age);
    }
    else {
        MojControls.TextBox.setValueById(Person_AgeString, "");

    }

};

getAge = function (dateString) {
    try {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
            return -1;

        var today = new Date();

        var age = parseInt(today.getFullYear()) - parseInt(dateString.substring(6, 10));

        if (parseInt(today.getMonth() + 1) < parseInt(dateString.substring(3, 5)) || (parseInt(today.getMonth() + 1) == parseInt(dateString.substring(3, 5)) && parseInt(today.getDate() + 1) < parseInt(dateString.substring(0, 2))))
            age--;

        var month = parseInt(today.getMonth() + 1) - parseInt(dateString.substring(3, 5));

        if (parseInt(today.getMonth() + 1) < parseInt(dateString.substring(3, 5)))
            month = 12 - month * (-1);

        else if (parseInt(today.getMonth() + 1) == parseInt(dateString.substring(3, 5)) && parseInt(today.getDate() + 1) < parseInt(dateString.substring(0, 2))) {
            month = 11;
        }

        return (Math.round((age + month / 12) * 10)) / 10;

    }
    catch (e) {
        return 0;
    }
};

MojFind("#" + Person_BirthDate).change(function () {

    setAge(MojControls.DateTimePicker.getValueById(Person_BirthDate));

});

setStreets = function (cityId) {
    MojControls.AutoComplete.setDataSourceAndValue(Address_StreetId, "", "");

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
    if (MojControls.AutoComplete.getValueById(Address_CityId).match(/^\d+$/))
        setStreets(MojControls.AutoComplete.getValueById(Address_CityId));
    else
        MojControls.AutoComplete.setDataSourceAndValue(Address_StreetId, "", "");

    MojControls.TextBox.setValueById(Address_HouseNumber, "");
    MojControls.TextBox.setValueById(Address_Flat, "");
    MojControls.TextBox.setValueById(Address_ZipCode, "");
    MojControls.TextBox.setValueById(Address_AtAddress, "");
    MojControls.TextBox.setValueById(Address_PostOfficeBox, "");

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

checkRangeOfDates = function () {

    BirthDate = new Date(parseInt(MojControls.DateTimePicker.getValueById(Person_BirthDate).substring(6, 10)), parseInt(MojControls.DateTimePicker.getValueById(Person_BirthDate).substring(3, 5)) - 1, parseInt(MojControls.DateTimePicker.getValueById(Person_BirthDate).substring(0, 2)));
    MinBirthDateAsDate = new Date(parseInt(MojControls.Hidden.getValueById(MinBirthDate).substring(6, 10)), parseInt(MojControls.Hidden.getValueById(MinBirthDate).substring(3, 5)) - 1, parseInt(MojControls.Hidden.getValueById(MinBirthDate).substring(0, 2)));
    MaxBirthDateAsDate = new Date(parseInt(MojControls.Hidden.getValueById(MaxBirthDate).substring(6, 10)), parseInt(MojControls.Hidden.getValueById(MaxBirthDate).substring(3, 5)) - 1, parseInt(MojControls.Hidden.getValueById(MaxBirthDate).substring(0, 2)));

    if (BirthDate < MinBirthDateAsDate || BirthDate > MaxBirthDateAsDate) {

        return { valid: false, message: Resources.Messages.RangeOfDates.replace("{0}", MojControls.Hidden.getValueById(MinBirthDate).substring(0, 10)).replace("{1}", MojControls.Hidden.getValueById(MaxBirthDate).substring(0, 10)) };
    }
    else {

        return { valid: true, message: "" };

    }
};

MojFind("#" + AddressStateId).unbind("change").change(function () {

    if (MojControls.DropDown.getValueById(AddressStateId) == AddressStatesEnum.NoAddress || MojControls.DropDown.getValueById(AddressStateId) == AddressStatesEnum.NoChangesInAddress) {
        changeAvailabilityAddress(false);
    }
    else {
        changeAvailabilityAddress(true);
    }


    if (MojControls.DropDown.getValueById(AddressStateId) == AddressStatesEnum.NoChangesInAddress) {
        MojControls.CheckBox.setValueById(NoChangesInAddress, true);
    }
    else {
        MojControls.CheckBox.setValueById(NoChangesInAddress, false);

    }
});

MojFind("#" + NoChangesInAddress).unbind("change").change(function () {

    if (this.checked)
        MojControls.DropDown.setValueById(AddressStateId, AddressStatesEnum.NoChangesInAddress);
    else
        MojControls.DropDown.setValueById(AddressStateId, 0);
});

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

CheckIfContactExist = function (data) {
    if (data.Type == DuplicationPerson.Error) {
        Moj.showErrorMessage(data.Error, function () {
            return false;
        });
    } else {
        if (data.Type == DuplicationPerson.NotExist) {
            SaveContactDetails();
        }
        if (data.Type == DuplicationPerson.IdNumberExist) {
            Moj.showErrorMessage(data.Error, function () {
                return false;
            });

        }
        if (data.Type == DuplicationPerson.FullNameExist) {
            Moj.confirm(data.Error, function () {
                SaveContactDetails();
            }, function () {
                return false;
            });
        }

    }
};

SaveContactDetails = function () {
    Moj.callActionWithJson(MojFind("#" + div_saveApplicantDetailsActionButton).closest("form").attr("id"), "/PersonApplicant/SaveContactDetails", function (data) {
        if (data.ActionResult != null) {
            if (data.ActionResult.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });
            } else {
                if (data.ActionResult.IsChange) {
                    var id = data.EntityInfo.EntityId;
                    var prevContactId = MojControls.Hidden.getValueById(Person_ContactId);
                    PDO.reloadEntityContentTab(1, id, id != 0 ? Resources.Strings.Applicant + " " + id : Resources.Strings.NewApplicant, "Contact_Tab_" + id, "Contact_Tab_" + prevContactId, ""); //("addPersonApplicantTab", "Contact_Tab_", "", Id);
                }
            }
        }
    });
};

loadContactView = function () {
    PDO.loadEntityTab('/PersonApplicant/Details');
};

}