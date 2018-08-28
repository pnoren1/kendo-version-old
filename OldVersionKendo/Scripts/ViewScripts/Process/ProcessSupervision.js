function CreateAppealProcess() {
    var urlParameters = "";
    var applicantContactId = MojFind("#ApplicantContactId").val();
    var appealFatherProcessId = MojFind("#EntityId").val();
    if (appealFatherProcessId != undefined || applicantContactId != undefined) {
        urlParameters = '?';
        if (appealFatherProcessId != undefined)
            urlParameters = urlParameters + 'appealFatherProcessId=' + appealFatherProcessId;
        if (applicantContactId != undefined && urlParameters.length > 1)
            urlParameters = urlParameters + '&applicantContactId=' + applicantContactId;
    }
    Moj.website.openPopupWindow("PopUpCreateAppealProcess", "", Resources.Strings.CreateAppealProcess, 850, 450, false, false, false, baseUrl + '/Process/CreateAppealProcess' + urlParameters, undefined, undefined, undefined, undefined);
};

function onFelonyLawTypeIdChanged(felonyLawTypeId, felonyLawClauseName) {
    if (isNaN(parseInt(felonyLawTypeId)) || felonyLawTypeId == 0) {
        MojFind("#" + felonyLawClauseName).enable(false);
        MojControls.AutoComplete.setValueById(felonyLawClauseName, "");
    }
    else {
        MojControls.ComboBox.clearComboBox(MojFind("#" + felonyLawClauseName), true);

        $.ajax({
            url: baseUrl + '/Process/FillFelonyLawClauses',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "felonyLawTypeId": "' + felonyLawTypeId + '" }',

            success: function (retData) {
                MojFind("#" + felonyLawClauseName).enable(true);
                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSourceAndValue(felonyLawClauseName, retData, -1);
                    //MojFind("#FelonyLawClausesForDisplay_FelonyLawClauseId").enable(true);
                }
                //else {
                //    MojFind("#FelonyLawClausesForDisplay_FelonyLawClauseId").enable(false);
                //}
            }

        });
    }
};

function openApplicantPlaces() {
    var contactId = MojFind("#ApplicantContactId").val();
    PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, contactId, null, Resources.Strings.Applicant + " " + contactId, "Contact_Tab_" + contactId, "Locations");
};

function onSuccessSaveProcessSupervision(data) {
    if (data.ActionResult != undefined) {
        if (data.ActionResult.Errors != undefined && data.ActionResult.Errors.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Errors, function () {
                return false;
            });
        }
        //else if (data.ActionResult.IsChange) {
        //    PDO.afterSaveEntityContentTab(data.EntityInfo);
        //}
        else if (data.ActionResult.IsChange) {
            var id = data.EntityInfo.EntityId;
            var text = Resources.Strings.Process + " " + id;
            var tabName = "Process_Tab_";
            MojFind("[id^='ObjectState']").val(false);
            PDO.reloadEntityContentTab(EntityContentTypeEnum.Process, id, text, tabName + id, "ProcessSupervision");
        }
    }
};

function endProcessHearingDateTreatment() {
    if (Moj.isTrue(MojFind("#ThereIsActiveNomination").val())) {
        MojFind("#NominationEndReasonId").enable(true);
        Moj.confirm(Resources.Messages.MsgEndProcessHearingDate, function () {
        }, "", function () {
            MojControls.AutoComplete.clearSelection(MojFind("#NominationEndReasonId"));
            MojFind("#NominationEndReasonId").enable(false);
            MojFind("#EndProcessHearingDate").val("");
        }, Resources.Strings.AnAlert, true, Resources.Strings.Yes, Resources.Strings.No);
    }
};

SaveProcessSupervision = function (isTransferAll) {
    var formId = MojFind("#btnSaveProcessSupervision").closest("form").attr("id");
    var saveUrl = "/Process/SaveProcessSupervision";
    Moj.callActionWithJson(formId, saveUrl, function (data) {
        onSuccessSaveProcessSupervision(data);
    });
};

$(document).ready(function () {

    //if (Moj.isNotEmpty(MojFind("#EndProcessHearingDate").val()))
    //    endProcessHearingDateTreatment();

    MojFind("#FelonyLawClausesForDisplay_FelonyLawTypeId").die('change');
    MojFind("#FelonyLawClausesForDisplay_FelonyLawTypeId").live('change', function (e) {
        //MojControls.Label.setValueById("FelonyLawClausesForDisplay_PenaltyYearsMax", "")
        MojControls.Label.setValueById("FelonyLawClausesForDisplay_FelonyLawClauseDescription", "")
        onFelonyLawTypeIdChanged(this.value, "FelonyLawClauseId");
    });

    MojFind("#MajorInitialFelonyLawTypeId").on('change', function (e) {
        onFelonyLawTypeIdChanged(this.value, "MajorInitialFelonyLawClauseId");
    });


    MojFind("#MajorAmendedFelonyLawTypeId").on('change', function (e) {
        onFelonyLawTypeIdChanged(this.value, "MajorAmendedLawClauseId");
    });

    MojFind("#FelonyLawClausesForDisplay_FelonyLawClauseId").die('change');
    MojFind("#FelonyLawClausesForDisplay_FelonyLawClauseId").live('change', function (e) {

        //MojControls.Label.setValueById("FelonyLawClausesForDisplay_PenaltyYearsMax", "");
        MojControls.Label.setValueById("FelonyLawClausesForDisplay_FelonyLawClauseDescription", "");

        if (isNaN(parseInt(this.value)) || this.value == 0) {
            Moj.showErrorMessage(Resources.Messages.ErrFelonyLawClauseNotExist, undefined, "", true);
            return;
        }

        var felonyLawClauseId = this.value;
        $.ajax({
            url: baseUrl + '/Process/FillFelonyLawDetails',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "felonyLawClauseId": "' + felonyLawClauseId + '" }',

            success: function (retData) {

                if (JSON.stringify(retData) != "[]") {
                    retData = Moj.ReplaceNullsInEmptyString(retData);
                    //MojControls.Label.setValueById("FelonyLawClausesForDisplay_PenaltyYearsMax", retData.penaltyYearsMax)
                    MojControls.Label.setValueById("FelonyLawClausesForDisplay_FelonyLawClauseDescription", retData.FelonyLawClauseDescription)
                }
                //else {
                //    MojControls.Label.setValueById("FelonyLawClausesForDisplay_PenaltyYearsMax", "")
                //    MojControls.Label.setValueById("FelonyLawClausesForDisplay_FelonyLawClauseDescription", "")
                //}
            }
        });
    });

    MojFind("#EndProcessHearingDate").on('change', function (e) {
        if (Moj.isEmpty(MojFind("#EndProcessHearingDate")) || MojFind("#EndProcessHearingDate").val() == "") {//MojControls.DateTimePicker.getValueById("EndProcessHearingDate") == ""){
            MojControls.AutoComplete.clearSelection(MojFind("#NominationEndReasonId"));
            MojFind("#NominationEndReasonId").enable(false);
        }
        else if (Moj.isTrue(MojFind("#ThereIsActiveNomination").val()))
            MojFind("#NominationEndReasonId").enable(true);
        //else {
        //    endProcessHearingDateTreatment();
        //}
    });

    MojFind("#IsMultipleNomination").on('change', function (e) {
        if (Moj.isFalse(MojControls.CheckBox.getValueById("IsMultipleNomination"))) {
            var ActiveNominationsCounter = MojFind("#ActiveNominationsCounter").val();
            if (ActiveNominationsCounter > 1) {
                Moj.showErrorMessage(Resources.Messages.MoreOneActiveNominationForProcess);
                MojControls.CheckBox.setValueById("IsMultipleNomination", true);
            }
        }
    });

    MojFind("#AppealDecisionId").on('change', function (e) {
        if (parseInt(this.value) == YesNoEnum.Yes)//int.try MojControls.ComboBox.getValueById("AppealDecisionId") ==  {
            //MojFind("#AppealMatterIds").enable(true);
            MojFind("#AppealMatterIds").data("kendoMultiSelect").enable(true)
        else {
            MojControls.MultiDropDown.clearAll("AppealMatterIds")
            //MojFind("#AppealMatterIds").enable(false);
            MojFind("#AppealMatterIds").data("kendoMultiSelect").enable(false)
        }
    });



    MojFind("#btnCancelProcessSupervision").on('click', function (e) {
        PDO.loadEntityTab('/Process/ProcessSupervision');
    });

    MojFind("#btnApplicantPlaces").die('click');
    MojFind("#btnApplicantPlaces").live('click', function (e) {
        openApplicantPlaces();
    });


    MojFind("#btnSaveProcessSupervision").click(function () {
        var formId = MojFind("#btnSaveProcessSupervision").closest("form").attr("id");
        var isValid = MojFind("#" + formId).valid();
        if (Moj.isFalse(isValid))
            return;
        if (Moj.isNotEmpty(MojFind("#EndProcessHearingDate").val()) && Moj.isTrue(MojFind("#IsDuringPhoneChecking").val())) {
            Moj.showErrorMessage(Resources.Messages.ErrEndHearingNominationDuringCall, function () {
                return false;
            });
            return false;
        }
        if (Moj.isNotEmpty(MojFind("#EndProcessHearingDate").val()) && Moj.isTrue(MojFind("#ThereIsActiveNomination").val())) {
            MojFind("#NominationEndReasonId").enable(true);
            Moj.confirm(Resources.Messages.MsgEndProcessHearingDate, function () {
                SaveProcessSupervision(true);
            }, "", function () {
            }, Resources.Strings.AnAlert, true, Resources.Strings.Yes, Resources.Strings.No);
        }
        else
            SaveProcessSupervision();
    });
});