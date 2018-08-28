validateIDNumber = function () {




    //var numberOnlyTypesArray = MojControls.Hidden.getValueById(self.getFieldPrefix() + "Person_PersonIDNumberTypeNumbersOnly");
    //var personIdNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");

    //if (personIdNumberTypeId != "") {
    //    if ($.inArray(personIdNumberTypeId, numberOnlyTypesArray) > -1) {
    //        if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "Person_IdNumberOnlyDigits") == "")
    //            return { valid: false };
    //    }
    //    else {
    //        if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "Person_IdNumberDigitsAndChars") == "")
    //            return { valid: false };
    //    }
    //}

    return { valid: PDO.checkIdentificationNo(MojFind("#Advocate_IDNumber").val()) };
};


CheckIfAdvocateExist = function (data) {
    if (data.Type == DuplicationPerson.Error) {
        Moj.showErrorMessage(data.Error, function () {
            return false;
        });
    } else {
        if (data.Type == DuplicationPerson.NotExist) {
            SaveAdvocateDetails();
        }
        if (data.Type == DuplicationPerson.IdNumberExist) {
            Moj.showErrorMessage(data.Error, function () {
                MojControls.Hidden.setValueById(Advocate_PersonIDNumberStatusId, "");
                return false;
            });
        }
    }
};

onCancelPersonAdvocateDetailsClicked = function () {
    PDO.loadEntityTab('/PersonAdvocate/PersonAdvocateDetails');
};

SaveAdvocateDetails = function (data) {

    Moj.callActionWithJson(MojFind("#divSaveAdvocateDetails").closest("form").attr("id"), "/PersonAdvocate/SaveAdvocate", function (data) {
        if (data.ActionResult != null) {
            if (data.ActionResult.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });

            } else {
                if (data.ActionResult.IsChange) {
                    var id = data.EntityInfo.EntityId;
                    var prevContactId = MojFind("#" + Advocate_ContactId).val();
                    PDO.reloadEntityContentTab(EntityContentTypeEnum.Advocate, id, Resources.Strings.Advocate + " " + id, "Advocate_Tab_" + id) //("addPersonApplicantTab", "Contact_Tab_", "", Id);
                }
            }
        }
    });
};

showAddAddressDetails = function (gridName, url, isAddRowInline) {
    var grid = MojControls.Grid.getKendoGridById(gridName);
    url = url + "?countRow=" + grid._data.length;
    Moj.HtmlHelpers._showGridAddDetails(gridName, url, isAddRowInline);
};

cleanPersonPopulationRegistrationFields = function () {
    MojControls.Label.setValueById("PersonPopulationRegistration_LastName", "");
    MojControls.Label.setValueById("PersonPopulationRegistration_FirstName", "");
    MojControls.Label.setValueById("PersonPopulationRegistration_FatherName", "");
    MojControls.Label.setValueById("PersonPopulationRegistration_BirthDate", "");
    MojControls.Label.setValueById("PersonPopulationRegistration_Address", "");
    MojFind("#PersonPopulationRegistration_IsDeceased").val(false)
    MojFind("#div_IsDeceasadLabel").addClass('hide')
    MojControls.Hidden.setValueById(Advocate_PersonIDNumberStatusId, PersonIdNumberStatusEnum.NotVerified);
};

recheckPopulationRegistration = function () {
    if (MojControls.Hidden.getValueById("Advocate_PersonIDNumberStatusId") == PersonIdNumberStatusEnum.NotChecked) {
        self.setPersonPopulationRegistrationDetails(MojFind("#" + Advocate_IDNumber).val())
    }
};

setPersonPopulationRegistrationDetails = function (idNumber, callBack) {
    Moj.safeGet("/PersonApplicant/GetPersonPopulationRegistrationById", {
        idNumber: idNumber
    }, function (data) {
        var response = data.Response;
        var address = data.Address;

        //אם מוחזרים נתונים מאביב מציגים אותם בשדות המרשם וסטטוס תז מאומתת
        switch (response.ErrorCode) {
            case InteriorMinistryInquiryResults.Success:
                cleanPersonPopulationRegistrationFields();
                MojFind("#ObjectStatePerson").val(true);
                MojControls.Label.setValueById("PersonPopulationRegistration_LastName", response.PopulationRegistrationPerson.LastName);
                MojControls.Label.setValueById("PersonPopulationRegistration_FirstName", response.PopulationRegistrationPerson.FirstName);
                MojControls.Label.setValueById("PersonPopulationRegistration_FatherName", response.PopulationRegistrationPerson.FatherName);
                var birthDate = Moj.HtmlHelpers._parseDate(data.Response.PopulationRegistrationPerson.BirthDate);
                MojControls.Label.setValueById("PersonPopulationRegistration_BirthDate", birthDate);
                MojControls.Label.setValueById("PersonPopulationRegistration_Address", address);
                var address = response.PopulationRegistrationPerson.Contacts.Addresses[0];

                MojFind("#ObjectStateIMAddress").val(true);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityId").val(address.CityId);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityName").val(address.CityName);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetId").val(address.StreetId);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetName").val(address.StreetName);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val(address.HouseNumber);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_Flat").val(address.Flat);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val(address.PostOfficeBox);
                MojFind("#PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val(address.ZipCode);
                MojFind("#PersonPopulationRegistration_IsDeceased").val(response.PopulationRegistrationPerson.IsDeceased)

                if (response.PopulationRegistrationPerson.IsDeceased != null && Moj.isTrue(response.PopulationRegistrationPerson.IsDeceased))
                    MojFind("#div_IsDeceasadLabel").removeClass('hide')
                //MojControls.Hidden.setValueById(Advocate_PersonIDNumberStatusId, PersonIdNumberStatusEnum.Verified);
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
                if (callBack != undefined && callBack != null)
                    eval(callBack);
                break;
            case InteriorMinistryInquiryResults.DataNotAvailable:
                cleanPersonPopulationRegistrationFields();
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
                Moj.showErrorMessage(Resources.Messages.CantCreateAdvocateIsNotExistInAviv)
                break;
            case InteriorMinistryInquiryResults.CheckDigitIsWrong:
                cleanPersonPopulationRegistrationFields();
                setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
                Moj.showErrorMessage(Resources.Messages.IdNumberIsNotValid)
                break;
            case InteriorMinistryInquiryResults.ServiceNotAvailable:
                if (MojControls.Hidden.getValueById("Advocate_PersonIDNumberStatusId") != PersonIdNumberStatusEnum.Verified) {
                    //&& MojFind("#Advocate_ContactId").val() != 0
                    cleanPersonPopulationRegistrationFields();
                    setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotChecked);
                    Moj.showErrorMessage(Resources.Messages.CantCreateAdvocateAvivIsNotActive);
                }
                else {
                    Moj.showErrorMessage(Resources.Messages.AvivServiceUnavailable)
                }
                break;
        }
    });
}

getPersonPopulationRegistrationAddress = function () {

    var cityId = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityId").val();
    var cityName = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityName").val();
    var streetId = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetId").val();
    var streetName = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetName").val();
    var houseNumber = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val();
    var flat = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_Flat").val();
    var postOfficeBox = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val();
    var zipCode = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val();
    return {
        cityId: cityId, cityName: cityName, streetId: streetId,
        streetName: streetName, houseNumber: houseNumber,
        flat: flat, postOfficeBox: postOfficeBox, zipCode: zipCode
    };

};

getExistPopulationRegistrationAddress = function () {
    var grid = MojControls.Grid.getKendoGridById("grdAddresses");
    if (grid == undefined)
        return;
    var existAddress;
    var maxDate = new Date(00, 01, 01);//=minimum date
    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (Moj.isTrue(dataItem.IsFromPopulationRegistration)
            && dataItem.PopulationRegistrationFromDate != null
            && dataItem.State != window.Enums.ObjectState.Deleted) {
            if (kendo.parseDate(dataItem.PopulationRegistrationFromDate) >= maxDate) {
                existAddress = dataItem;
                maxDate = kendo.parseDate(dataItem.PopulationRegistrationFromDate);
            }
        }
    });
    return existAddress;
};

areAddressesEquals = function (oldAddress, newAddress) {
    if (oldAddress != undefined && newAddress != undefined) {
        return oldAddress.CityName == newAddress.cityName
                        && ((Moj.isEmpty(newAddress.streetName) && Moj.isEmpty(oldAddress.StreetName)) || oldAddress.StreetName == newAddress.streetName)
                        && ((Moj.isEmpty(newAddress.houseNumber) && Moj.isEmpty(oldAddress.HouseNumber)) || oldAddress.HouseNumber == newAddress.houseNumber)
                        && ((Moj.isEmpty(newAddress.postOfficeBox) && Moj.isEmpty(oldAddress.PostOfficeBox)) || oldAddress.PostOfficeBox == newAddress.postOfficeBox)
                        && ((Moj.isEmpty(newAddress.zipCode) && Moj.isEmpty(oldAddress.ZipCode)) || oldAddress.ZipCode == newAddress.zipCode)
                    && ((Moj.isEmpty(newAddress.flat) && Moj.isEmpty(oldAddress.Flat)) || oldAddress.Flat == newAddress.flat);
    }
    return false;
};

addAddressToGridDataSource = function (grid, address) {
    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem.PopulationRegistrationLabel == Resources.Strings.CurrentAddress) {
            dataItem.PopulationRegistrationLabel = Resources.Strings.PreviousAddress;
            dataItem.IsFromPopulationRegistrationToken = PopulationRegistrationSymbolsEnum.PreviousAddress;
            return false;
        }
    });
    grid.dataSource.add(address);
    grid.refresh();
};

copyAddressDetails = function (message) {
    var populationRegistrationAddress = getPersonPopulationRegistrationAddress();
    Moj.safeGet("/PersonApplicant/GetPopulationRegistrationAddress", populationRegistrationAddress
        , function (address) {
            address.AddressLocationTypeId = AddressLocationType.Home;
            var grid = MojControls.Grid.getKendoGridById("grdAddresses");
            var existAddress = getExistPopulationRegistrationAddress();
            if (existAddress == undefined) {
                //אם  לא קימת כתובת מרשם
                if (message != undefined) {
                    Moj.showMessage(message, undefined, Resources.Strings.Message, MessageType.Alert);
                }
                addAddressToGridDataSource(grid, address);
            }
            else {
                if (!areAddressesEquals(existAddress, populationRegistrationAddress)) {
                    if (message == undefined)
                        addAddressToGridDataSource(grid, address);
                    else
                        Moj.showMessage(message,
                        function () {
                            addAddressToGridDataSource(grid, address);
                        }, Resources.Strings.Message, MessageType.Alert);
                }

            }
        });
};

copyPopulationRegistratioDetails = function () {
    MojControls.TextBox.setValueById("Advocate_LastName", MojFind("#PersonPopulationRegistration_LastName").val());
    MojControls.TextBox.setValueById("Advocate_FirstName", MojFind("#PersonPopulationRegistration_FirstName").val());
    MojFind("#Advocate_BirthDate").val(Moj.HtmlHelpers._parseDate(MojFind("#PersonPopulationRegistration_BirthDate").val()));
    MojFind("#Advocate_BirthDate").change();

};

setPersonIdNumberStatusId = function (personIdNumberStatusIdEnum) {
    MojControls.Hidden.setValueById("Advocate_PersonIDNumberStatusId", personIdNumberStatusIdEnum);
    MojFind("#Advocate_PersonIDNumberStatusId").change();
    setPopulationRegistrationDivVisibility(personIdNumberStatusIdEnum);
};

setPopulationRegistrationDivVisibility = function (idNumberStatusId) {
    if (idNumberStatusId == undefined)
        idNumberStatusId = MojControls.Hidden.getValueById("Advocate_PersonIDNumberStatusId");

    if (idNumberStatusId == PersonIdNumberStatusEnum.Verified) {
        MojFind(".population-registration-div").removeClass("hide");
    }
    else {
        MojFind(".population-registration-div").addClass("hide");
        MojFind(".licensedLawyer-div").addClass("hide");
        cleanLicensedLawyerFields();
    }
};

setPopulationRegistrationAddress = function () {

    var cityName = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_CityName").val();
    var streetName = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_StreetName").val();
    var houseNumber = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val();
    var zipCode = MojFind("#PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val();

    var addressToDisply = streetName + " " + houseNumber + " " + cityName + " " + zipCode;
    MojControls.Label.setValueById("PersonPopulationRegistration_Address", addressToDisply)
};

cleanLicensedLawyerFields = function () {
    MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseNumber", "");
    MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseYear", "");
    MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseStatusName", "");
    MojControls.Hidden.setValueById("LicensedLawyer_AdvocateLicenseStatusId", "");
    MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseUpdateDate", "");

};

setLicensedLawyerDivVisibility = function () {

    var advocateLicenseNumber = MojFind("#LicensedLawyer_AdvocateLicenseNumber").val();
    if (advocateLicenseNumber == 0 || advocateLicenseNumber == undefined)
        MojFind(".licensedLawyer-div").addClass("hide");
    else
        MojFind(".licensedLawyer-div").removeClass("hide");

};

setLicensedLawyerDetails = function (idNumber, licenseNumber) {
    Moj.safeGet("/PersonAdvocate/GetLicensedLawyerById", {
        idNumber: idNumber, licenseNumber: licenseNumber
    }, function (data) {
        var response = data.Response;
        cleanLicensedLawyerFields();
        switch (response.ErrorCode) {
            case 0:
                MojFind("#ObjectStatePerson").val(true);
                MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseNumber", response.License);
                var graduationDate = "";
                if (response.GraduationDate != null)
                    graduationDate = kendo.parseDate(response.GraduationDate).getFullYear();
                MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseYear", graduationDate);
                MojControls.Hidden.setValueById("LicensedLawyer_AdvocateLicenseStatusId", response.LicenseStatusId);
                MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseStatusName", data.AdvocateLicenseStatusName);
                MojControls.Label.setValueById("LicensedLawyer_AdvocateLicenseUpdateDate", Moj.HtmlHelpers._parseDate(response.UpToDate));
                if (response.LicenseStatusId != AdvocateAssociationStatuses.Active) {
                    Moj.showErrorMessage(Resources.Messages.CantCreateAdvocateIsNotExistInLicensedLawyers)
                    MojFind("#btnCopyDetails").enable(false)
                }
                else {
                    MojFind("#btnCopyDetails").enable(true)
                    MojFind("#Advocate_LastName").enable(true)
                    MojFind("#Advocate_FirstName").enable(true)
                    MojFind("#Advocate_BirthDate").enable(true)
                    MojFind("#Advocate_Gender").enable(true)
                    MojFind("#Advocate_BirthDate").enable(true)
                    MojFind("#Advocate_ImmigrationDate").enable(true)
                    MojFind("#Advocate_PersonTitleId").enable(true)
                    if (MojFind("#Advocate_ContactId").val() == 0)
                        MojFind("#Advocate_AdvocateTypeId").enable(true)
                }
                break;
            default:
                Moj.showErrorMessage(response.ErrorMsg)

        }
        MojFind(".licensedLawyer-div").removeClass("hide");
        //setLicensedLawyerDivVisibility();
    });

}

onDocumentReady = function () {
    recheckPopulationRegistration();
    setPopulationRegistrationDivVisibility();
    setPopulationRegistrationAddress();

    if (MojFind("#Advocate_ContactId").val() == 0) {
        MojFind(".licensedLawyer-div").addClass("hide");
        MojFind("#Advocate_BirthDate").val(null);

    }

    //setLicensedLawyerDivVisibility();
}

$(document).ready(function () {

    MojFind("#btnCancelPersonAdvocateDetails,#btnCancelAdvocateEntityContent").click(function () {
        onCancelPersonAdvocateDetailsClicked();
    });

    MojFind("#Advocate_IDNumber").change(function () {
        var isIdNumberValid = MojFind("#Advocate_IDNumber").valid();
        //var isIdentificationNoValid = PDO.checkIdentificationNo(MojFind("#Advocate_IDNumber").val())
        if (Moj.isTrue(isIdNumberValid)) {// && Moj.isTrue(isIdentificationNoValid
            setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
            setPersonPopulationRegistrationDetails(MojFind("#" + Advocate_IDNumber).val(), "setLicensedLawyerDetails('" + MojFind("#Advocate_IDNumber").val() + "'," + MojFind("#Advocate_AdvocateLicenseNumber").val() + ")");
            //if (MojControls.Hidden.getValueById("Advocate_PersonIDNumberStatusId") == PersonIdNumberStatusEnum.Verified)
            //setLicensedLawyerDetails(MojFind("#Advocate_IDNumber").val(), MojFind("#" + Advocate_AdvocateLicenseNumber).val());
        }
        else {
            setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
            //    Moj.showErrorMessage(Resources.Messages.InvalidIdentificationNo, function () {
            //        MojFind("#" +Advocate_IDNumber).focus();
            //});
        }
    });

    MojFind("#btnCopyDetails").click(function () {

        var lastName = MojFind("#Advocate_LastName").val();
        var firstName = MojFind("#Advocate_FirstName").val();
        var birthDate = MojFind("#Advocate_BirthDate").val();

        if (firstName != "" || lastName != "" || birthDate != "") {
            var newAddress = getPersonPopulationRegistrationAddress();
            var existAddress = getExistPopulationRegistrationAddress();
            if (areAddressesEquals(existAddress, newAddress))
                Moj.showMessage(Resources.Messages.WrnIdentificationDetailsValues, undefined, Resources.Strings.Message, MessageType.Alert);
            else
                copyAddressDetails(Resources.Messages.MsgOnlyAddressCopy);

        }
        else {
            copyPopulationRegistratioDetails();
            copyAddressDetails();
        }
    });

    MojFind("#btnRefreshDetails").click(function () {
        setPersonPopulationRegistrationDetails(MojFind("#" + Advocate_IDNumber).val());
    });

    MojFind("#btnRefreshLicensedLawyerDetails").click(function () {
        setLicensedLawyerDetails(MojFind("#" + Advocate_IDNumber).val(), MojFind("#" + Advocate_AdvocateLicenseNumber).val());
    });


});



