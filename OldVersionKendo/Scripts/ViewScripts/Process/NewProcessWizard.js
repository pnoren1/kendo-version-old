
function onNewProcessWizardReady() {
    var openContactId = MojFind("#SearchPersonResult_ApplicantContactId").val();
    if (openContactId != "") {
        //Moj.wizard.loadSpecificTab(1);
    }

};

function NewProcessDetailsBeforeExit(e) {

    var divName = "frmSearchPreviousProcessDiv";
    var validate = MojFind("#" + divName).closest("form").validate();
    var isValid = true;
    MojFind("#" + divName).find("input").each(function () {
        if (validate.element($(this)) != undefined)
            isValid = isValid & $(this).valid();
    });
    isValid = isValid & MojFind("#ProcessDetailsModel_ProcessDate").valid();
    if (isValid) {

        if (MojControls.CheckBox.getValue(MojFind("#ProcessDetailsModel_IsProcessNoUnknown"))) {
            MojFind("#ProcessDetailsModel_ProcessNumberId").val("");
            MojFind("#ProcessDetailsModel_ProcessNumberMonth").val("");
            MojFind("#ProcessDetailsModel_ProcessNumberYear").val("");
            MojControls.AutoComplete.clearSelectionById("ProcessDetailsModel_ProcessNumberPrefixId");
        }
        if (!Moj.isEmpty(MojFind("#SearchPersonResult_ApplicantContactId").val()) && MojFind("#SearchPersonResult_ApplicantContactId").val() != 0 && MojFind("#AllProcessDetailsDiv").hasClass("hide")) {
            Moj.showErrorMessage(Resources.Messages.WrnSearchPreviousProcess, function () {
                //isNext = false;
            }, Resources.Strings.MessageError, true);
            return false;
        }
        divName = "AllProcessDetailsDiv";
              MojFind("#" + divName).find("input").each(function () {
        if (validate.element($(this)) != undefined)
            isValid = isValid & $(this).valid();
        });
        if (!isValid)
           return false;
        if (!Moj.isEmpty(MojFind("#ProcessDetailsModel_ProcessNumberId").val()) && Moj.isEmpty(MojFind("#ProcessDetailsModel_ProcessNumberPrefixId").val())) {
            return confirm(Resources.Messages.WrnProcessPrefixEmpty);
            //Moj.confirm(Resources.Messages.WrnProcessPrefixEmpty, function () {
            //}, "", function () {
            //}, "", true, Resources.Strings.Yes, Resources.Strings.No);

        }
    }

};

function NewProcessDetailsAfterExit() {
    
    //if (MojFind("#FutureHearingsDiv").length != 0) {
    //    if (MojFind("#ProcessDetailsModel_DisplayFields_FutureHearings").val() == FieldDisplayOption.NotDisplayed)
    //        MojFind("#FutureHearingsDiv").addClass("hide");
    //    else
    //        MojFind("#FutureHearingsDiv").removeClass("hide");
    //}
    if (MojFind("#ParentProcessDiv").length != 0) {
        if (MojFind("#SearchPersonResult_ApplicantContactId").val() == 0 || Moj.isFalse(MojFind("#HearingsAndEligibilityModel_IsAppealProcess").val())) // || MojFind("#ProcessId").val() != 0) {
            MojFind("#ParentProcessDiv").addClass("hide");
        else if (Moj.isTrue(MojFind("#HearingsAndEligibilityModel_IsAppealProcess").val()))
            MojFind("#ParentProcessDiv").removeClass("hide");
    }
    if (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").length != 0) {
        //if (MojFind("#ProcessDetailsModel_CourtId").val() == "" || MojFind("#ProcessDetailsModel_CourtId").val() == 0)
        //    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds").visible(false);
        //else
        //    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds").visible(true);
        if (MojFind("#SearchPersonResult_ApplicantContactId").val() != 0) {
            NominationGroundContinuedTreatment(true);
        }
        shiftTreatment();
    }
};

function saveNewProcess(data) {
    if (data.Errors != undefined && data.Errors.length > 0) {
        Moj.showErrorMessage(data.Errors, null, Resources.Strings.MessageError, true);
       }
    else if (data.ProcessId > 0) {
        // DocumentsToEntityArea.addFilesToDocumentum(data.ProcessId, function() { })
        Moj.showMessage(String.format(Resources.Messages.SuccessSaveNewProcess, data.ProcessId), function () {
            Moj.closePopUp("PopUpWizard");
            PDO.addEntityContentTab(EntityContentTypeEnum.Process, data.ProcessId, null, Resources.Strings.Process + " " + data.ProcessId, "Process_Tab_" + data.ProcessId);
        }, Resources.Strings.Message, MessageType.Success, false)
            //Resources.Messages.SuccessSaveNewProcess.replace("{0}", data.ProcessId)
            //.format(data.ProcessId)
}
}

