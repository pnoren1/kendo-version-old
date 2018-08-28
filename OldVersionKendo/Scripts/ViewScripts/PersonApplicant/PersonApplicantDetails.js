function PersonApplicantDetailsModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    };

    self.selfFind = function (id) {
        return MojFind("#" + self.getFieldPrefix() + id);
    };

    validatePersonIDNumber = function () {
        var numberOnlyTypesArray = MojControls.Hidden.getValueById(self.getFieldPrefix() + "Person_PersonIDNumberTypeNumbersOnly");
        var personIdNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");

        if (personIdNumberTypeId != "") {
            if ($.inArray(personIdNumberTypeId, numberOnlyTypesArray) > -1) {
                if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "Person_IdNumberOnlyDigits") == "")
                    return { valid: false, message: window.Resources.Messages.ErrIdentificationNumberMandatory };
            }
            else {
                if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "Person_IdNumberDigitsAndChars") == "")
                    return { valid: false, message: window.Resources.Messages.ErrIdentificationNumberMandatory };
            }
        }

        return { valid: true, message: "" };
    };

    self.onDocumentReady = function () {
        self.recheckPopulationRegistration();
        self.changeIdNumberAvailability();
        self.setPersonStatusAvailability();
        self.setPopulationRegistrationDivVisibility();
        self.changePersonPopulationRegistrationAvailability();
        self.setAgeByBirthDate(true);
        self.setPopulationRegistrationAddress();
    };

    self.recheckPopulationRegistration = function () {
        var personIdNumberStatusId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberStatusId");
        var personIdNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        if (personIdNumberTypeId == PersonIdTypesEnum.IdentityNumber &&
            personIdNumberStatusId == PersonIdNumberStatusEnum.NotChecked) {
            self.setPersonPopulationRegistrationDetails()
        }
    };

    self.setPopulationRegistrationDivVisibility = function (idNumberStatusId) {
        if (idNumberStatusId == undefined)
            idNumberStatusId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberStatusId");
        var idNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        if (idNumberTypeId == PersonIdTypesEnum.IdentityNumber && idNumberStatusId == PersonIdNumberStatusEnum.Verified) {
            MojFind(".population-registration-div").removeClass("hide");
        }
        else {
            self.cleanPersonPopulationRegistrationFields();
            MojFind(".population-registration-div").addClass("hide");
        }
    };

    self.changeCountry = function () {
        var idNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        //var countryId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_CountryId");
        if (MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_CountryId") <= 0 || MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_CountryId") == CountryEnum.IsraelCode) {
            if (idNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_CountryId", CountryEnum.IsraelCode);
            }
            else {
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_CountryId", 0);
            }
        }
    };

    self.changePersonPopulationRegistrationAvailability = function () {
        var idNumberType = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        var idNumberStatusId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberStatusId");

        if (idNumberType == PersonIdTypesEnum.IdentityNumber && idNumberStatusId == PersonIdNumberStatusEnum.Verified) {
            self.selfFind("Person_IdNumberTypeId").enable(false);
            self.selfFind("Person_IdNumberOnlyDigits").enable(false);
            var isDeceased = self.selfFind("PersonPopulationRegistration_IsDeceased").val();
            if (Moj.isTrue(isDeceased))
                self.selfFind("Person_IsDeceased").enable(false);
        }
    }

    self.changeIdNumberAvailability = function () {
        var value = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        if (value != 0) {
            var items = self.selfFind("Person_IdNumberTypeId").data("kendoComboBox").dataSource._data;
            var selectedItem;
            $.each(items, function (index, item) {
                if (item.ID == value) {
                    selectedItem = item;
                    return false;
                }
            });

            if (selectedItem != undefined) {
                var isNumbersOnly = selectedItem.IsNumbersOnly;
                self.visibleIdNumber(isNumbersOnly);
            }
        }
        else {
            self.selfFind("Person_IdNumberOnlyDigits").val("");
            self.selfFind("Person_IdNumberOnlyDigits").enable(false);
            self.selfFind("Person_IdNumberOnlyDigits").visible(true);
            self.selfFind("Person_IdNumberDigitsAndChars").val("");
            self.selfFind("Person_IdNumberDigitsAndChars").enable(false);
            self.selfFind("Person_IdNumberDigitsAndChars").visible(false);
        }


    };

    self.visibleIdNumber = function (isNumbersOnly) {
        var showOnlyDigits = false
        if (isNumbersOnly != null && Moj.isTrue(isNumbersOnly)) {
            showOnlyDigits = true;
        }
        self.selfFind("Person_IdNumberOnlyDigits").enable(showOnlyDigits);
        self.selfFind("Person_IdNumberOnlyDigits").visible(showOnlyDigits);
        if (!showOnlyDigits)
            self.selfFind("Person_IdNumberOnlyDigits").val("");
        self.selfFind("Person_IdNumberDigitsAndChars").enable(!showOnlyDigits);
        self.selfFind("Person_IdNumberDigitsAndChars").visible(!showOnlyDigits);
        if (showOnlyDigits)
            self.selfFind("Person_IdNumberDigitsAndChars").val("");

    };

    self.onCheckIsContactExistSuccess = function (data) {
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
                        self.savePersonApplicantDetails();
                    });
                    break;
                }

            case DuplicationPerson.NotExist:
                {
                    self.savePersonApplicantDetails();
                    break;
                }
        }
    }

    self.onCancelPersonApplicantDetailsClicked = function () {
        PDO.loadEntityTab('/PersonApplicant/PersonApplicantDetails');
    };

    self.savePersonApplicantDetails = function (e) {
        var formId = MojFind("#divSavePersonApplicantDetails").closest("form").attr("id");
        var saveUrl = "/PersonApplicant/SavePersonApplicantDetails";
        Moj.callActionWithJson(formId, saveUrl, function (data) {
            if (data.ActionResult != null) {
                if (data.ActionResult.Error != null && data.ActionResult.Error.length > 0) {
                    Moj.showErrorMessage(data.ActionResult.Error);
                } else {

                    if (data.ActionResult.IsChange) {
                        var id = data.ActionResult.ContactId;
                        var text = id != 0 ? Resources.Strings.Applicant + " " + id : Resources.Strings.NewApplicant;
                        var tabName = "Contact_Tab_";
                        MojFind("[id^='ObjectState']").val(false);
                        PDO.reloadEntityContentTab(EntityContentTypeEnum.Applicant, id, Resources.Strings.Applicant + " " + id, tabName + id);
                    }
                }
            }
        });
    };

    self.getPersonPopulationRegistrationAddress = function () {
        var cityId = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityId").val();
        var cityName = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityName").val();
        var streetId = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetId").val();
        var streetName = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetName").val();
        var houseNumber = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val();
        var flat = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_Flat").val();
        var postOfficeBox = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val();
        var zipCode = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val();
        return {
            cityId: cityId, cityName: cityName, streetId: streetId,
            streetName: streetName, houseNumber: houseNumber,
            flat: flat, postOfficeBox: postOfficeBox, zipCode: zipCode
        };

    };

    self.getExistPopulationRegistrationAddress = function () {
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

    self.areAddressesEquals = function (oldAddress, newAddress) {
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

    self.addAddressToGridDataSource = function (grid, address) {
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

    self.isAllRowsDeleted = function (grid) {

        var isDeleted = false;
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem.State == window.Enums.ObjectState.Deleted) {
                isDeleted = true;
                return false;
            }
        });
        return isDeleted;
    }

    self.isEmptyAddress = function (address) {
        return Moj.isEmpty(address.cityId) &&
            Moj.isEmpty(address.cityName) &&
            Moj.isEmpty(address.flat) &&
            Moj.isEmpty(address.houseNumber) &&
            Moj.isEmpty(address.postOfficeBox) &&
            Moj.isEmpty(address.streetId) &&
            Moj.isEmpty(address.streetName) &&
            Moj.isEmpty(address.zipCode);
    }

    self.copyAddressToGrid = function (showMessage, message) {
        var populationRegistrationAddress = self.getPersonPopulationRegistrationAddress();
        if (self.isEmptyAddress(populationRegistrationAddress)) {


        }

        else {

            Moj.safeGet("/PersonApplicant/GetPopulationRegistrationAddress", populationRegistrationAddress
                , function (address) {

                    var grid = MojControls.Grid.getKendoGridById("grdAddresses");
                    var existAddress = self.getExistPopulationRegistrationAddress();
                    if (existAddress == undefined) {
                        //אם  לא קימת כתובת מרשם
                        if (message != undefined) {
                            Moj.showMessage(message, undefined, Resources.Strings.Message, MessageType.Alert);
                        }
                        //if (grid != undefined) {
                        if (grid.tbody.find('tr').length == 0 || self.isAllRowsDeleted(grid)) {//length is 0 and state is not deleted
                            address.IsContactAddress = true;
                        }
                        self.addAddressToGridDataSource(grid, address);
                        //}
                    }
                    else {

                        if (Moj.isTrue(showMessage)) {
                            //אם הכתובת לא זהה בכלל

                            if (!self.areAddressesEquals(existAddress, populationRegistrationAddress)) {
                                if (message == undefined)
                                    message = "";
                                message = message + Resources.Messages.WrnConvertNewAddressToMainAddress;
                                Moj.confirm(message, function () {
                                    //באישור יש לסמן ככתובת למשלוח דואר
                                    grid.tbody.find('tr').each(function () {
                                        var dataItem = grid.dataItem(this);
                                        if (Moj.isTrue(dataItem.IsContactAddress)) {
                                            dataItem.IsContactAddress = false;
                                            if (dataItem.State == 0) {
                                                dataItem.State = window.Enums.ObjectState.Modified;//Modified
                                            }
                                            return false;
                                        }
                                    });

                                    address.IsContactAddress = true;
                                    self.addAddressToGridDataSource(grid, address);
                                }, function () {
                                },
                                    function () {
                                        //בביטול יש רק להוסיף לגריד
                                        self.addAddressToGridDataSource(grid, address);
                                    }, "", false, Resources.Strings.Yes, Resources.Strings.No);
                            }
                        }
                        else {
                            self.addAddressToGridDataSource(grid, address);
                        }
                    }
                });
        }
    };

    self.copyAddressDetails = function (message) {
        var grid = MojControls.Grid.getKendoGridById("grdAddresses");
        //if (grid == undefined) {
        //    self.selfFind("PersonPopulationRegistration_IsCopyAddress").val(true);
        //    if (message != undefined)
        //        Moj.showMessage(message, undefined, "", MessageType.Message);
        //}
        //else {
        self.copyAddressToGrid(true, message);
        //}
    };

    self.copyPopulationRegistratioDetails = function () {
        self.selfFind("Person_LastName").val(self.selfFind("PersonPopulationRegistration_LastName").val());
        self.selfFind("Person_FirstName").val(self.selfFind("PersonPopulationRegistration_FirstName").val());
        self.selfFind("Person_FatherName").val(self.selfFind("PersonPopulationRegistration_FatherName").val());
        self.selfFind("Person_BirthDate").val(Moj.HtmlHelpers._parseDate(self.selfFind("PersonPopulationRegistration_BirthDate").val()));
        self.selfFind("Person_BirthDate").change();
        var isDeceased = self.selfFind("PersonPopulationRegistration_IsDeceased").val();
        if (isDeceased != null) {
            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "Person_IsDeceased", isDeceased);
            if (Moj.isTrue(isDeceased))
                self.selfFind("Person_IsDeceased").enable(false);
            else
                self.selfFind("Person_IsDeceased").enable(true);
        }
        if (MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_CountryId") <= 0) {
            MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_CountryId", CountryEnum.IsraelCode);
        }
    };

    self.getAgeByBirthDate = function (dateString) {
        try {
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
                return -1;

            var today = new Date();
            var age = parseInt(today.getFullYear()) - parseInt(dateString.substring(6, 10));
            if (parseInt(today.getMonth() + 1) < parseInt(dateString.substring(3, 5))
                || (parseInt(today.getMonth() + 1) == parseInt(dateString.substring(3, 5))
                    && parseInt(today.getDate() + 1) < parseInt(dateString.substring(0, 2))))
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

    self.setPopulationRegistrationAddress = function () {
        var cityName = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityName").val();
        var streetName = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetName").val();
        var houseNumber = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val();
        var zipCode = self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val();

        var addressToDisply = streetName + " " + houseNumber + " " + cityName + " " + zipCode;
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_Address", addressToDisply)
    };

    self.setPersonPopulationRegistrationDetails = function () {
        var idNumber = self.selfFind("Person_IdNumberOnlyDigits").val();
        MojFind("#ObjectStatePerson").val(true);
        Moj.safeGet("/PersonApplicant/GetPersonPopulationRegistrationById", {
            idNumber: idNumber
        }, function (data) {
            var response = data.Response;
            var address = data.Address;

            //אם מוחזרים נתונים מאביב מציגים אותם בשדות המרשם וסטטוס תז מאומתת
            var personId = MojControls.Hidden.getValueById(self.getFieldPrefix() + "Person_ContactId");

            switch (response.ErrorCode) {
                case InteriorMinistryInquiryResults.Success:
                    self.cleanPersonPopulationRegistrationFields();
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_LastName", response.PopulationRegistrationPerson.LastName);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_FirstName", response.PopulationRegistrationPerson.FirstName);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_FatherName", response.PopulationRegistrationPerson.FatherName);
                    var birthDate = Moj.HtmlHelpers._parseDate(data.Response.PopulationRegistrationPerson.BirthDate);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_BirthDate", birthDate);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_Address", address);
                    var address = response.PopulationRegistrationPerson.Contacts.Addresses[0];

                    self.selfFind("PersonPopulationRegistration_IsAddressChanged").val(true);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityId").val(address.CityId);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityName").val(address.CityName);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetId").val(address.StreetId);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetName").val(address.StreetName);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val(address.HouseNumber);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_Flat").val(address.Flat);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val(address.PostOfficeBox);
                    self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val(address.ZipCode);
                    self.selfFind("PersonPopulationRegistration_IsDeceased").val(response.PopulationRegistrationPerson.IsDeceased)
                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_IdNumberTypeId", PersonIdTypesEnum.IdentityNumber);
                    if (response.PopulationRegistrationPerson.IsDeceased != null && Moj.isTrue(response.PopulationRegistrationPerson.IsDeceased))
                        MojFind("#div_IsDeceasadLabel").removeClass('hide')
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
                    break;
                case InteriorMinistryInquiryResults.DataNotAvailable:
                    self.cleanPersonPopulationRegistrationFields();
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
                    break;
                case InteriorMinistryInquiryResults.CheckDigitIsWrong:
                    self.cleanPersonPopulationRegistrationFields();
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
                    break;
                case InteriorMinistryInquiryResults.ServiceNotAvailable:
                    if (MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberStatusId") == PersonIdNumberStatusEnum.Verified && personId != 0) {
                        Moj.showErrorMessage(Resources.Messages.AvivServiceUnavailable)
                    }
                    else {
                        self.cleanPersonPopulationRegistrationFields();
                        self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotChecked);
                    }
                    break;
            }
        });
    }

    self.cleanPersonPopulationRegistrationFields = function () {
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_LastName", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_FirstName", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_FatherName", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_BirthDate", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "PersonPopulationRegistration_Address", "");
        self.selfFind("PersonPopulationRegistration_IsDeceased").val(false)
        //MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_IdNumberTypeId", PersonIdTypesEnum.IdentityNumber);
        MojFind("#div_IsDeceasadLabel").addClass('hide')

        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityId").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_CityName").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetId").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_StreetName").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_HouseNumber").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_Flat").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_PostOfficeBox").val("");
        self.selfFind("PersonPopulationRegistration_AddressForDisplayModel_ZipCode").val("");
        self.selfFind("PersonPopulationRegistration_IsAddressChanged").val(false);
        //self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
    };

    self.setPersonStatusAvailability = function () {
        var personIdNumberStatusId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberStatusId");
        var personIdNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
        if (personIdNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
            if (personIdNumberStatusId != PersonIdNumberStatusEnum.Verified) {
                self.selfFind("Person_IdNumberStatusId").visible(true);
            }
            else {
                self.selfFind("Person_IdNumberStatusId").visible(false);
            }
        }
        else {

            MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_IdNumberStatusId", -1);
            self.selfFind("Person_IdNumberStatusId").visible(false);
        }
        self.selfFind("Person_IsDeceased").enable(true);
    };

    self.setPersonIdNumberStatusId = function (personIdNumberStatusIdEnum) {
        MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "Person_IdNumberStatusId", personIdNumberStatusIdEnum);
        self.selfFind("Person_IdNumberStatusId").change();
        self.setPersonStatusAvailability();
        self.setPopulationRegistrationDivVisibility(personIdNumberStatusIdEnum);
    };

    self.setAgeByBirthDate = function (setHeader) {
        var isDateValid = MojFind("#" + self.getFieldPrefix() + "Person_BirthDate").length > 0 && MojFind("#" + self.getFieldPrefix() + "Person_BirthDate").valid();
        if (Moj.isTrue(isDateValid)) {
            var date = MojControls.DateTimePicker.getValueById(self.getFieldPrefix() + "Person_BirthDate");
            if (date != "") {
                var age = PDO.calcAge(date);
                if (age < 0)
                    age = "";
                else if (MojFind("#ProcessDetailsModel_IsMinor").length > 0) {
                    if (isMinor(MojFind("#ProcessDetailsModel_CourtIdType").val(), age)) {
                        MojControls.CheckBox.setValueById("ProcessDetailsModel_IsMinor", true);
                        MojFind("#ProcessDetailsModel_IsMinor").enable(false);
                    }
                    else
                        MojFind("#ProcessDetailsModel_IsMinor").enable(true);
                }
                var ageAsString = PDO.getAgeAsString(age);
                MojControls.Label.setValueById(self.getFieldPrefix() + "Person_Age", ageAsString);
                if (setHeader == true)
                    MojControls.Label.setValueById("Age", ageAsString);
            }

            else {
                MojControls.Label.setValueById(self.getFieldPrefix() + "Person_Age", "");
            }
        }

        else {
            MojControls.Label.setValueById(self.getFieldPrefix() + "Person_Age", "");
        }

    };

    $(document).ready(function () {

        self.selfFind("Person_IdNumberTypeId").change(function () {
            MojControls.TextBox.clearValue(self.selfFind("Person_IdNumberOnlyDigits"), false);
            MojControls.TextBox.clearValue(self.selfFind("Person_IdNumberDigitsAndChars"), false);

            self.changeIdNumberAvailability();
            self.changeCountry();
            self.setPersonStatusAvailability();
            self.setPopulationRegistrationDivVisibility();
        });

        MojFind("#" + self.getFieldPrefix() + "btnCopyDetails").click(function () {
            var lastName = self.selfFind("Person_LastName").val();
            var firstName = self.selfFind("Person_FirstName").val();
            var fatherName = self.selfFind("Person_FatherName").val();
            var birthDate = self.selfFind("Person_BirthDate").val();

            if (firstName != "" || lastName != "" || fatherName != "" || birthDate != "") {

                var newAddress = self.getPersonPopulationRegistrationAddress();
                var existAddress = self.getExistPopulationRegistrationAddress();
                if (self.areAddressesEquals(existAddress, newAddress)) {
                    Moj.showMessage(Resources.Messages.WrnIdentificationDetailsValues, undefined, Resources.Strings.Message, MessageType.Alert);
                }
                else {
                    self.copyAddressDetails(Resources.Messages.MsgOnlyAddressCopy);
                }
            }
            else {
                self.copyPopulationRegistratioDetails();
                self.copyAddressDetails();
            }
        });

        self.selfFind("btnRefreshDetails").click(function () {
            self.setPersonPopulationRegistrationDetails();
        });

        self.selfFind("Person_IdNumberDigitsAndChars").change(function () {
            var isIdNumberValid = self.selfFind("Person_IdNumberDigitsAndChars").valid();
            if (Moj.isTrue(isIdNumberValid)) {
                self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.Verified);
            }
            else {
                self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
            }
        });

        self.selfFind("Person_IdNumberOnlyDigits").change(function () {
            var isIdNumberValid = self.selfFind("Person_IdNumberOnlyDigits").valid();
            var idNumberTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "Person_IdNumberTypeId");
            if (idNumberTypeId == PersonIdTypesEnum.IdentityNumber) {
                var isIdentificationNoValid = PDO.checkIdentificationNo(self.selfFind("Person_IdNumberOnlyDigits").val())
                if (Moj.isTrue(isIdNumberValid) && Moj.isTrue(isIdentificationNoValid)) {
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotVerified);
                    self.setPersonPopulationRegistrationDetails();
                }
                else {
                    self.setPersonIdNumberStatusId(PersonIdNumberStatusEnum.NotValid);
                }
            }

        });

        self.selfFind("Person_BirthDate").change(function () {
            self.setAgeByBirthDate(false);
        });


    });
}



