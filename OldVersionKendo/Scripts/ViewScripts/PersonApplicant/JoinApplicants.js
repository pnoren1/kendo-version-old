setApplicantDetails = function (contactId, prefix) {
    var contactId = contactId;
    Moj.safeGet('/PersonApplicant/GetJoinApplicantModel?applicantContactId=' + contactId, undefined, function (retData) {
        if (JSON.stringify(retData) != "[]" && retData.ApplicantDetails != null && Moj.isNotEmpty(retData.ApplicantDetails)) {
            applicantDetails = retData.ApplicantDetails;
            applicantDetails = Moj.ReplaceNullsInEmptyString(applicantDetails);
            MojControls.Label.setValueById(prefix + "_ContactId", applicantDetails.ContactId);
            MojControls.Label.setValueById(prefix + "_IdNumberDigitsAndChars", applicantDetails.IdNumberDigitsAndChars);
            MojControls.Label.setValueById(prefix + "_IdNumberOnlyDigits", applicantDetails.IdNumberOnlyDigits);
            MojControls.Label.setValueById(prefix + "_IdNumberStatusName", applicantDetails.IdNumberStatusName);
            MojControls.Label.setValueById(prefix + "_LastName", applicantDetails.LastName);
            MojControls.Label.setValueById(prefix + "_FirstName", applicantDetails.FirstName);
            MojControls.Label.setValueById(prefix + "_FatherName", applicantDetails.FatherName);
            MojControls.Label.setValueById(prefix + "_PrisonerNumber", applicantDetails.PrisonerNumber);
            MojControls.Label.setValueById(prefix + "_BirthDate", applicantDetails.BirthDate);
            MojControls.Label.setValueById(prefix + "_BirthDateAsString", applicantDetails.BirthDateAsString);
            MojFind("#" + prefix + "_IsDeceased").val(applicantDetails.IsDeceased);
            MojFind("#" + prefix + "_IsDeceasadLabel").visible(applicantDetails.IsDeceased);
            MojControls.Label.setValueById(prefix + "_IdNumberTypeName", applicantDetails.IdNumberTypeName);
            MojControls.Label.setValueById(prefix + "_UnidentifiedTypeName", applicantDetails.UnidentifiedTypeName);
            MojControls.Label.setValueById(prefix + "_GenderTypeName", applicantDetails.GenderTypeName);
            MojFind("#" + prefix + "_GenderTypeId").val(applicantDetails.GenderTypeId);
            MojControls.Label.setValueById(prefix + "_CountryName", applicantDetails.CountryName);
            
            idNumberDisplayTreatmet(Moj.isNotEmpty(applicantDetails.IdNumberOnlyDigits), prefix);

            if (MojFind("#MainApplicantDetails_ContactId").val() != "0" && MojFind("#JoinApplicantDetails_ContactId").val() != "0") {
                var sourcePrefix = prefix == "JoinApplicantDetails" ? "MainApplicantDetails" : "JoinApplicantDetails";
                setUpdateJoinDetails(applicantDetails, sourcePrefix, "UpdateMainApplicantDetails");
            }
        }
    });
};

setUpdateJoinDetails = function (applicantDetails, sourcePrefix, targetPrefix) {
    MojControls.Label.setValueById(targetPrefix + "_ContactId", MojFind("#MainApplicantDetails_ContactId").val());
    if (applicantDetails.IdNumberDigitsAndChars != MojFind("#" + sourcePrefix + "_IdNumberDigitsAndChars").val())
        applicantDetails.IdNumberDigitsAndChars = null;
    MojControls.TextBox.setValueById(targetPrefix + "_IdNumberDigitsAndChars", applicantDetails.IdNumberDigitsAndChars);
    if (applicantDetails.IdNumberOnlyDigits != MojFind("#" + sourcePrefix + "_IdNumberOnlyDigits").val())
        applicantDetails.IdNumberOnlyDigits = null;
    MojControls.TextBox.setValueById(targetPrefix + "_IdNumberOnlyDigits", applicantDetails.IdNumberOnlyDigits);
    if ((applicantDetails.IdNumberStatusName != MojFind("#" + sourcePrefix + "_IdNumberStatusName").val()) || applicantDetails.IdNumberOnlyDigits == null)
        applicantDetails.IdNumberStatusId = null;
    MojControls.AutoComplete.setValueById(targetPrefix + "_IdNumberStatusId", applicantDetails.IdNumberStatusId);
    if (applicantDetails.LastName != MojFind("#" + sourcePrefix + "_LastName").val())
        applicantDetails.LastName = null;
    MojControls.TextBox.setValueById(targetPrefix + "_LastName", applicantDetails.LastName);
    if (applicantDetails.FirstName != MojFind("#" + sourcePrefix + "_FirstName").val())
        applicantDetails.FirstName = null;
    MojControls.TextBox.setValueById(targetPrefix + "_FirstName", applicantDetails.FirstName);
    if (applicantDetails.FatherName != MojFind("#" + sourcePrefix + "_FatherName").val())
        applicantDetails.FatherName = null;
    MojControls.TextBox.setValueById(targetPrefix + "_FatherName", applicantDetails.FatherName);
    if (applicantDetails.PrisonerNumber != null && applicantDetails.PrisonerNumber != MojFind("#" + sourcePrefix + "_PrisonerNumber").val())
        applicantDetails.PrisonerNumber = null;
    MojControls.TextBox.setValueById(targetPrefix + "_PrisonerNumber", applicantDetails.PrisonerNumber);
    if (applicantDetails.BirthDateAsString != MojFind("#" + sourcePrefix + "_BirthDateAsString").val())
        applicantDetails.BirthDate = null;
    MojControls.DateTimePicker.setValueById(targetPrefix + "_BirthDate", applicantDetails.BirthDate);
    if (applicantDetails.IsDeceased != MojFind("#" + sourcePrefix + "_IsDeceased").val())
        applicantDetails.IsDeceased = false;
    MojControls.CheckBox.setValueById(targetPrefix + "_IsDeceased", applicantDetails.IsDeceased);
    if (applicantDetails.IdNumberTypeName != MojFind("#" + sourcePrefix + "_IdNumberTypeName").val())
        applicantDetails.IdNumberTypeId = null;                                      
    MojControls.AutoComplete.setValueById(targetPrefix + "_IdNumberTypeId", applicantDetails.IdNumberTypeId);
    if (applicantDetails.UnidentifiedTypeName != MojFind("#" + sourcePrefix + "_UnidentifiedTypeName").val())
        applicantDetails.UnidentifiedTypeId = null;
    MojControls.AutoComplete.setValueById(targetPrefix + "_UnidentifiedTypeId", applicantDetails.UnidentifiedTypeId);
    if (applicantDetails.GenderTypeName != MojFind("#" + sourcePrefix + "_GenderTypeName").val())
        applicantDetails.GenderTypeId = null;
    MojControls.AutoComplete.setValueById(targetPrefix + "_GenderTypeId", applicantDetails.GenderTypeId);
    if (applicantDetails.CountryName != MojFind("#" + sourcePrefix + "_CountryName").val())
        applicantDetails.CountryId = null;
    MojControls.AutoComplete.setValueById(targetPrefix + "_CountryId", applicantDetails.CountryId);
        
    idNumberDisplayTreatmet(MojFind("#" + targetPrefix + "_IdNumberTypeId").val() == PersonIdTypesEnum.IdentityNumber, targetPrefix);
};

idNumberDisplayTreatmet = function (onlyDigit, prefix) {
    if (onlyDigit) {
        //MojControls.TextBox.setValueById(prefix + "_IdNumberOnlyDigits", idNumber);
        MojFind("#" + prefix + "_IdNumberOnlyDigits").visible(true);
        MojFind("#" + prefix + "_IdNumberOnlyDigits").enable(true);

        MojFind("#" + prefix + "_IdNumberDigitsAndChars").visible(false);
        MojFind("#" + prefix + "_IdNumberDigitsAndChars").enable(false);

    } else {

        //MojControls.TextBox.setValueById("PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars", idNumber);
        MojFind("#" + prefix + "_IdNumberDigitsAndChars").visible(true);
        MojFind("#" + prefix + "_IdNumberDigitsAndChars").enable(true);

        MojFind("#" + prefix + "_IdNumberOnlyDigits").visible(false);
        MojFind("#" + prefix + "_IdNumberOnlyDigits").enable(false);
    }
}

setSearchMainApplicant = function (selectedItem) {
    var contactId = selectedItem["ContactId"];
    var firstName = selectedItem["FirstName"];
    var lastName = selectedItem["LastName"];
    if (!Moj.isEmpty(contactId)) {
        if (contactId == MojFind("#JoinApplicantContactId").val()) {
            Moj.showErrorMessage("פונה ראשי ופונה לצירוף זהים");
            return false;
        }
        MojFind("#MainApplicantContactId").val(contactId);
        MojFind("#MainApplicant").val(lastName + " " + firstName);
        setApplicantDetails(contactId, "MainApplicantDetails");
        //MojFind("#btnSearchJoinApplicant").enable(true);
        //MojFind("#JoinApplicant").enable(true);
    }
    else if(Moj.isEmpty(MojFind("#JoinApplicant").val()))
    {
        MojFind("#btnSearchJoinApplicant").enable(false);
        MojFind("#JoinApplicant").enable(false);
    }
};

setSearchJoinApplicant = function (selectedItem) {
    var contactId = selectedItem["ContactId"];
    var firstName = selectedItem["FirstName"];
    var lastName = selectedItem["LastName"];
    if (!Moj.isEmpty(contactId)) {
        if (contactId == MojFind("#MainApplicantContactId").val()) {
            Moj.showErrorMessage("פונה ראשי ופונה לצירוף זהים");
            return false;
        }
    MojFind("#JoinApplicantContactId").val(contactId);
    MojFind("#JoinApplicant").val(lastName + " " + firstName);
    setApplicantDetails(contactId, "JoinApplicantDetails");
    //MojFind("#btnSearchMainApplicant").enable(true);
    //MojFind("#MainApplicant").enable(true);
}
    else if (Moj.isEmpty(MojFind("#MainApplicant").val())) {
        MojFind("#btnSearchMainApplicant").enable(false);
        MojFind("#MainApplicant").enable(false);
}
};

//--------------------------------------------------------------

validatePersonIDNumber = function () {
    var numberOnlyTypesArray = MojControls.Hidden.getValueById("UpdateMainApplicantDetails_PersonIDNumberTypeNumbersOnly");
    var personIdNumberTypeId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberTypeId");

    if (personIdNumberTypeId != "") {
        if ($.inArray(personIdNumberTypeId, numberOnlyTypesArray) > -1) {
            if (MojControls.TextBox.getValueById("UpdateMainApplicantDetails_IdNumberOnlyDigits") == "")
                return { valid: false };
        }
        else {
            if (MojControls.TextBox.getValueById("UpdateMainApplicantDetails_IdNumberDigitsAndChars") == "")
                return { valid: false };
        }
    }

    return { valid: true, message: "" };
};

changeIdNumberAvailability = function () {
    var value = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberTypeId");;

    if (value != 0) {
        var items = MojFind("#UpdateMainApplicantDetails_IdNumberTypeId").data("kendoComboBox").dataSource._data;
        var selectedItem;
        $.each(items, function (index, item) {
            if (item.ID == value) {
                selectedItem = item;
                return false;
            }
        });

        if (selectedItem != undefined) {
            var isNumbersOnly = selectedItem.IsNumbersOnly;
            visibleIdNumber(isNumbersOnly);
        }
    }
    else {
        MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").val("");
        MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").enable(false);
        MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").visible(true);
        MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").val("");
        MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").enable(false);
        MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").visible(false);
    }


};

visibleIdNumber = function (isNumbersOnly) {
    var showOnlyDigits = false
    if (isNumbersOnly != null && Moj.isNotEmpty(applicantDetails.IdNumberOnlyDigits) && Moj.isTrue(isNumbersOnly)) {
        showOnlyDigits = true;
    }
    MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").enable(showOnlyDigits);
    MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").visible(showOnlyDigits);
    if (!showOnlyDigits)
        MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").val("");
    MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").enable(!showOnlyDigits);
    MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").visible(!showOnlyDigits);
    if (showOnlyDigits)
        MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").val("");

};

changeCountry = function () {
    var idNumberTypeId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberTypeId");
    //var countryId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_CountryId");
    if (idNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
        MojControls.AutoComplete.setValueById("UpdateMainApplicantDetails_CountryId", CountryEnum.IsraelCode);
    }
    else if (ojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_CountryId") == CountryEnum.IsraelCode) {
        MojControls.AutoComplete.setValueById("UpdateMainApplicantDetails_CountryId", 0);
    }
};

setPersonStatusAvailability = function () {
    var personIdNumberStatusId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberStatusId");
    var personIdNumberTypeId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberTypeId");
    if (personIdNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
        if (personIdNumberStatusId != PersonIdNumberStatusEnum.Verified) {
            MojFind("#UpdateMainApplicantDetails_IdNumberStatusId").visible(true);
        }
        else {
            MojFind("#UpdateMainApplicantDetails_IdNumberStatusId").visible(false);
        }
    }
    else {

        MojControls.AutoComplete.setValueById("UpdateMainApplicantDetails_IdNumberStatusId", -1);
        MojFind("#UpdateMainApplicantDetails_IdNumberStatusId").visible(false);
    }
};

setPersonPopulationRegistrationDetails = function () {

    var idNumber = MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").val();
    Moj.safeGet("/PersonApplicant/GetPersonPopulationRegistrationById", {
        idNumber: idNumber
    }, function (data) {
        var response = data.Response;
        var address = data.Address;
        //cleanPersonPopulationRegistrationFields();
        //אם מוחזרים נתונים מאביב מציגים אותם בשדות המרשם וסטטוס תז מאומתת
        switch (response.ErrorCode) {
            case InteriorMinistryInquiryResults.Success:
                //MojControls.Label.setValueById(getFieldPrefix() + "PersonPopulationRegistration_LastName", response.PopulationRegistrationPerson.LastName);
                //MojControls.Label.setValueById(getFieldPrefix() + "PersonPopulationRegistration_FirstName", response.PopulationRegistrationPerson.FirstName);
                //MojControls.Label.setValueById(getFieldPrefix() + "PersonPopulationRegistration_FatherName", response.PopulationRegistrationPerson.FatherName);
                //var birthDate = Moj.HtmlHelpers._parseDate(data.Response.PopulationRegistrationPerson.BirthDate);
                //MojControls.Label.setValueById(getFieldPrefix() + "PersonPopulationRegistration_BirthDate", birthDate);
                //MojControls.Label.setValueById(getFieldPrefix() + "PersonPopulationRegistration_Address", address);
                //var address = response.PopulationRegistrationPerson.Contacts.Addresses[0];

                //MojFind("#PersonPopulationRegistration_IsAddressChanged").val(true);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityId").val(address.CityId);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityName").val(address.CityName);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetId").val(address.StreetId);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetName").val(address.StreetName);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val(address.HouseNumber);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_Flat").val(address.Flat);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val(address.PostOfficeBox);
                //MojFind("#PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val(address.ZipCode);
                //MojFind("#PersonPopulationRegistration_IsDeceased").val(response.PopulationRegistrationPerson.IsDeceased)
                MojControls.AutoComplete.setValueById("UpdateMainApplicantDetails_IdNumberTypeId", PersonIdTypesEnum.IdentityNumber);
                //if (response.PopulationRegistrationPerson.IsDeceased != null && Moj.isTrue(response.PopulationRegistrationPerson.IsDeceased))
                    //MojFind("#div_IsDeceasadLabel").removeClass('hide')
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
                break;
            case InteriorMinistryInquiryResults.DataNotAvailable:
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
                break;
            case InteriorMinistryInquiryResults.CheckDigitIsWrong:
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
                break;
            case InteriorMinistryInquiryResults.ServiceNotAvailable:
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotChecked);
                break;
        }
    });
}

setPersonIdNumberStatusId = function (personIdNumberStatusIdEnum) {
    MojControls.AutoComplete.setValueById("UpdateMainApplicantDetails_IdNumberStatusId", personIdNumberStatusIdEnum);
    MojFind("#UpdateMainApplicantDetails_IdNumberStatusId").change();
    setPersonStatusAvailability();
    //setPopulationRegistrationDivVisibility(personIdNumberStatusIdEnum);
};

onBeforeSaveJoinApplicant = function (data) {
    switch (data.Type) {
        case DuplicationPerson.Error: {
            Moj.showErrorMessage(data.Error);
            break;
        }
        case DuplicationPerson.IdNumberExist: {
            var message = Resources.Messages.IdNumberAlreadyExist;
            Moj.showErrorMessage(message);
            break;
        }
        case DuplicationPerson.FullNameExist:
            {
                var message = Resources.Messages.NameAlreadyExist;
                Moj.confirm(message, function () {
                    saveJoinApplicant();
                });
                break;
            }

        case DuplicationPerson.NotExist:
            {
                saveJoinApplicant();
                break;
            }
    }
}


saveJoinApplicant = function () {
    var message = String.format(Resources.Messages.ApplicantsWillJoin, MojFind("#JoinApplicant").val(), MojFind("#MainApplicant").val())
    Moj.confirm(message, function () {

        Moj.callActionWithJson(MojFind("#updateMainApplicant").closest("form").attr("id"), "/PersonApplicant/SaveJoinApplicant", function (data) {
            if (data.IsChange == undefined)
             {
                if (data.ActionResult.Error != undefined && data.ActionResult.Error.length > 0) {
                    Moj.showErrorMessage(data.ActionResult.Error, function () {
                        return false;
                    });
                }
            }
            else
            {
                Moj.showMessage(Resources.Messages.SuccessJoinApplicants, function () {
                    PDO.loadEntityTab('/PersonApplicant/JoinApplicants');
                }, Resources.Strings.Message, MessageType.Success, true);
            }
        });
    });
};

$(document).ready(function () {

    //MojFind("#btnSearchMainApplicant").click(function () {
    //    PDO.openSearchApplicantPopup("setSearchMainApplicant");
    //});

    //MojFind("#btnSearchJoinApplicant").click(function () {
    //    PDO.openSearchApplicantPopup("setSearchJoinApplicant");
    //});

    MojFind("#MainApplicant").change(function () {
        var applicantContactId = MojFind("#MainApplicant").val();
        Moj.safeGet("/Nominations/GetApplicantContactNameById?applicantContatId=" + applicantContactId, undefined, function (data) {
            if (data.PersonName != undefined) {
                MojFind("#MainApplicant").text(data.PersonName);
            }
            else {
                MojFind("#MainApplicant").text("");
            }
        });
    });

    MojFind("#JoinApplicant").change(function () {
        var applicantContactId = MojFind("#JoinApplicant").val();
        Moj.safeGet("/Nominations/GetApplicantContactNameById?applicantContatId=" + applicantContactId, undefined, function (data) {
            if (data.PersonName != undefined) {
                MojFind("#JoinApplicant").text(data.PersonName);
            }
            else {
                MojFind("#JoinApplicant").text("");
            }
        });
    });

    MojFind("#btnCancelTransferProcesses").click(function () {
        MojFind("#content_Applicants").load(baseUrl + '/PersonApplicant/TransferProcesses');
    });
    //----------------------------------------------------
    MojFind("#UpdateMainApplicantDetails_IdNumberTypeId").change(function () {
        changeIdNumberAvailability();
        changeCountry();
        setPersonStatusAvailability();
        //setPopulationRegistrationDivVisibility();
    });

    MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").change(function () {
        var isIdNumberValid = MojFind("#UpdateMainApplicantDetails_IdNumberDigitsAndChars").valid();
        if (Moj.isTrue(isIdNumberValid)) {
            setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
        }
        else {
            setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
        }
    });

    MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").change(function () {
        var isIdNumberValid = MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").valid();
        var idNumberTypeId = MojControls.AutoComplete.getValueById("UpdateMainApplicantDetails_IdNumberTypeId");
        if (idNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
            var isIdentificationNoValid = PDO.checkIdentificationNo(MojFind("#UpdateMainApplicantDetails_IdNumberOnlyDigits").val())
            if (Moj.isTrue(isIdNumberValid) && Moj.isTrue(isIdentificationNoValid)) {
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
                //setPersonPopulationRegistrationDetails();
            }
            else {
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
            }
        }

    });

});