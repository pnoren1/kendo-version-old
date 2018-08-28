setIdNumberValue = function (idNumber, typeId, onlyDigit) {
    if (typeId != undefined) {
        MojControls.AutoComplete.setValueById("PersonApplicantDetailsModel_Person_IdNumberTypeId", typeId);
    }
    if (onlyDigit) {
        if (idNumber != "")
            MojControls.TextBox.setValueById("PersonApplicantDetailsModel_Person_IdNumberOnlyDigits", idNumber);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").visible(true);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").enable(true);

        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").visible(false);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").enable(false);

    } else {

        if (idNumber != "")
            MojControls.TextBox.setValueById("PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars", idNumber);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").visible(true);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").enable(true);

        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").visible(false);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").enable(false);
    }
};

onApplicantDetailsReady = function () {
    //Append objectStates before change applicant details fields
    Moj.addObjectStateToForm("frmNewProcessWizard");
    if (MojFind("#PersonApplicantDetailsModel_Person_ContactId").val() != 0)
        return;

    var idNumberTypeId = MojControls.AutoComplete.getValueById("SearchCriteria_PersonIdNumberTypeId");
    var idNumber = MojFind("#SearchCriteria_IdNumber").val();
    var lastName = MojFind("#SearchCriteria_LastName").val();
    var firstName = MojFind("#SearchCriteria_FirstName").val();
    var fatherName = MojFind("#SearchCriteria_FatherName").val();

    var numberOnlyTypesArray = MojControls.Hidden.getValueById("PersonApplicantDetailsModel_Person_PersonIDNumberTypeNumbersOnly");
    var isOnlyNumByType = false;
    var isOnlyNumNoType = /^\d+$/.test(idNumber);

    


    if (idNumberTypeId != "") {
        isOnlyNumByType = ($.inArray(idNumberTypeId, numberOnlyTypesArray) > -1);


    }

    if (idNumberTypeId == 0) {
        if (idNumber != "") { // use defaults for type
            if (isOnlyNumNoType) {
                setIdNumberValue(idNumber, PersonIdTypesEnum.IdentityNumber, true);
            }
            else {
                setIdNumberValue(idNumber, PersonIdTypesEnum.Passport, false);
            }
        }
    }
    else if (idNumberTypeId == 4)//מספר אסיר
    {
        MojControls.TextBox.setValueById("PersonApplicantDetailsModel_Person_PrisonerNumber", idNumber);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").visible(true);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberOnlyDigits").enable(false);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").visible(false);
        MojFind("#PersonApplicantDetailsModel_Person_IdNumberDigitsAndChars").enable(false);


    }
    else {
        setIdNumberValue(idNumber, idNumberTypeId, isOnlyNumByType);
    }

    if (lastName != "") {
        MojFind("#PersonApplicantDetailsModel_Person_LastName").val(lastName);
    }
    if (firstName != "") {
        MojFind("#PersonApplicantDetailsModel_Person_FirstName").val(firstName);
    }
    if (fatherName != "") {
        MojFind("#PersonApplicantDetailsModel_Person_FatherName").val(fatherName);
    }
};

//onAddressesAndLocationsDetailsReady = function () {
//    var isCopyAddress = MojFind("#PersonApplicantDetailsModel_PersonPopulationRegistration_IsCopyAddress").val();
//    if (Moj.isTrue(isCopyAddress)) {
//        PersonApplicantDetailsModel.copyAddressToGrid(false);
//        MojFind("#PersonApplicantDetailsModel_PersonPopulationRegistration_IsCopyAddress").val(false);
//    }
//};

