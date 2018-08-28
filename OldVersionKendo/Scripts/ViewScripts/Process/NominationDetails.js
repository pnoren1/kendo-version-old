onSaveNominationDetails = function (data) {
    if (data.ActionResult != null) {
        var errors = data.ActionResult.Errors;
        var warnings = data.ActionResult.Warnings;
        var notifications = data.ActionResult.Notifications;
        var isChange = data.ActionResult.IsChange;

        if (errors != null && errors.length > 0) {
            Moj.showErrorMessage(errors, function () {
                return false;
            });
        }
        else if (warnings != null && warnings.length > 0) {

            //TODO:show warning message
            Moj.confirm(warnings, function () {
                // return false;

                var formId = "frmNominationDetails";
                var saveUrl = "/Process/SaveNominationDetails";
                Moj.callActionWithJson(formId, saveUrl, function (data) {
                    onSaveNominationDetails(data);
                }
                    , { isUserApproved: true });
            });
        }
        else {
            if (isChange) {
                var id = data.ActionResult.ProcessId;
                var text = Resources.Strings.Process + " " + id;
                var tabName = "Process_Tab_";
                MojFind("[id^='ObjectState']").val(false);
                PDO.reloadEntityContentTab(EntityContentTypeEnum.Process, id, text, tabName + id, "NominationsHistory");
                //PDO.afterSaveEntityContentTab(data.EntityInfo);
            }
            if (notifications) {
                Moj.showMessage(notifications, undefined, Resources.Strings.InfoMessage, MessageType.Attention);
            }
        }
    }


};

enableEmploymentTypeId = function () {
    var isEmploymentEnabled = MojFind("#Details_IsEmploymentEnabled").val();
    if (Moj.isTrue(isEmploymentEnabled))
        MojFind("#NominationForDisplay_EmploymentTypeId").enable(true);
    else {
        var defaultTypeId = MojFind("Details_DefaultEmploymentTypeId").val();
        MojControls.AutoComplete.setValueById("NominationForDisplay_EmploymentTypeId", defaultTypeId);
        MojFind("#NominationForDisplay_EmploymentTypeId").enable(true);
    }
};

setContractLineTypeVisibility = function () {
    var nominationTypeId = MojControls.AutoComplete.getValueById("NominationForDisplay_NominationTypeId");
    if (nominationTypeId == NominationTypeEnum.Retainer) {
        MojFind("#NominationForDisplay_ContractLineTypeId").visible(true);
        MojFind("#NominationForDisplay_EmploymentTypeId").enable(false);
        var defaultTypeId = MojFind("#Details_DefaultForRetainerEmploymentTypeId").val();
        MojControls.AutoComplete.setValueById("NominationForDisplay_EmploymentTypeId", defaultTypeId);
        MojFind("#Details_RetainerContract").visible(true);

        MojControls.Hidden.setValueById("NominationForDisplay_IsRetainerChange", true);
        //set defatult by retainer
    } else {
        MojFind("#NominationForDisplay_ContractLineTypeId").visible(false);
        MojFind("#Details_RetainerContract").visible(false);
        if (nominationTypeId != NominationTypeEnum.Internal)
            enableEmploymentTypeId();

        MojControls.Hidden.setValueById("NominationForDisplay_IsRetainerChange", false);
    }
};

setDefaultContractLineTypeVisibility = function () {
    var nominationTypeId = MojControls.AutoComplete.getValueById("NominationForDisplay_NominationTypeId");
    if (nominationTypeId == NominationTypeEnum.Retainer) {
        MojFind("#NominationForDisplay_ContractLineTypeId").visible(true);
        MojFind("#NominationForDisplay_EmploymentTypeId").enable(false);
        MojFind("#Details_RetainerContract").visible(true);
    } else {
        MojFind("#NominationForDisplay_ContractLineTypeId").visible(false);
        MojFind("#Details_RetainerContract").visible(false);
        var isEmploymentEnabled = MojFind("#Details_IsEmploymentEnabled").val();
        if (Moj.isTrue(isEmploymentEnabled))
            MojFind("#NominationForDisplay_EmploymentTypeId").enable(true);
        else {
            MojFind("#NominationForDisplay_EmploymentTypeId").enable(false);
        }
    }
};

onNominationDetailsDocumentReady = function () {
    setDefaultContractLineTypeVisibility();
};



$(document).ready(function () {

    MojFind("#NominationForDisplay_NominationTypeId").change(function () {
        if (MojFind("#NominationForDisplay_NominationTypeId").val() != "") {
            $.ajax({
                url: baseUrl + '/Process/CheckNominationTypeFeeRequestCompatibility',
                type: 'POST',
                async: false,
                //contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: "processId=" + MojFind("#ProcessId").val() + "&advocateContactId=" + MojFind("#NominationForDisplay_AdvocateContactId").val() + "&nominationTypeId=" + MojFind("#NominationForDisplay_NominationTypeId").val(),

                success: function (retData) {
                    if (Moj.isTrue(retData.IsCompatible)) {
                        MojControls.AutoComplete.clearSelectionById("NominationForDisplay_ContractLineTypeId");
                        setContractLineTypeVisibility();
                    }
                    else {
                        var originalNominationTypeId = MojFind("#NominationForDisplay_OriginalNominationTypeId").val();
                        MojControls.AutoComplete.setValueById("NominationForDisplay_NominationTypeId", originalNominationTypeId);
                        Moj.showMessage(Resources.Messages.ErrCheckNominationTypeFeeRequestCompatibility, undefined, Resources.Strings.Error, MessageType.Error);
                    }
                },
            });

        }
        else {
            MojControls.Hidden.setValueById("NominationForDisplay_IsRetainerChange", false);
        }
        if (MojFind("#NominationForDisplay_NominationTypeId").val() == NominationTypeEnum.ToranutHakraot || MojFind("#NominationForDisplay_NominationTypeId").val() == NominationTypeEnum.ToranutMahatzarim || MojFind("#NominationForDisplay_NominationTypeId").val() == NominationTypeEnum.Internal)
            MojFind("#NominationForDisplay_ShiftDate").enable(true);
        else {
            if (MojFind("#NominationForDisplay_ShiftDate").length > 0) {
                MojControls.DateTimePicker.setValueById("NominationForDisplay_ShiftDate", null);
                MojFind("#NominationForDisplay_ShiftDate").enable(false);
            }
            if (MojFind("#NominationForDisplay_ShiftId").length > 0)
                MojControls.ComboBox.clearComboBox(MojFind("#NominationForDisplay_ShiftId"), false);
        }
    });

    MojFind("#NominationForDisplay_ContractLineTypeId").change(function () {
        MojControls.Hidden.setValueById("NominationForDisplay_IsRetainerChange", true);

    });

    MojFind("#NominationForDisplay_ToDate").change(function () {
        if (MojFind("#NominationForDisplay_OriginalToDate").val() != "") {
            if (this.value == "") {

                Moj.showMessage(Resources.Messages.ErrResetToDate);
                MojFind("#NominationForDisplay_ToDate").val(MojFind("#NominationForDisplay_OriginalToDate").val());
            }
        }
        else if (Moj.isNotEmpty(this.value) && Moj.isTrue(MojFind("#NominationForDisplay_IsDuringPhoneChecking").val())) {
            Moj.showErrorMessage(Resources.Messages.ErrEndHearingNominationDuringCall);
            MojFind("#NominationForDisplay_ToDate").val(MojFind("#NominationForDisplay_OriginalToDate").val());
        }

    });

    MojFind("#NominationForDisplay_FromDate").unbind('blur').blur(function () {
        //if (MojFind("#NominationForDisplay_ShiftId").val() != "" && this.value && this.value != MojFind("#NominationForDisplay_OriginalFromDate").val()) {
        //    MojControls.DateTimePicker.setValueById("NominationForDisplay_FromDate", MojFind("#NominationForDisplay_OriginalFromDate").val());
        //    Moj.showMessage(Resources.Messages.ErrShiftNominationChangeFromDate, undefined, Resources.Strings.Error, MessageType.Error);
        //}
    });



    MojFind("#NominationForDisplay_NominationStatusId").change(function () {
        var nominationStatusId = MojControls.AutoComplete.getValueById("NominationForDisplay_NominationStatusId");
        if (nominationStatusId == NominationStatusEnum.Active) {
            MojFind("#NominationForDisplay_NominationTypeId").enable(true);
            MojFind("#NominationForDisplay_ContractLineTypeId").enable(true);
            enableEmploymentTypeId();
        }
        else if (nominationStatusId == NominationStatusEnum.NoActive) {
            MojFind("#NominationForDisplay_NominationTypeId").enable(false);
            MojFind("#NominationForDisplay_ContractLineTypeId").enable(false);
            MojFind("#NominationForDisplay_EmploymentTypeId").enable(false);

            //MojControls.DateTimePicker.setValueById("NominationForDisplay_ToDate", new Date());
            MojFind("#NominationForDisplay_ToDate").data("kendoDatePicker").value(new Date());
        }
    });

    MojFind("#IsCreateNominationDocuments").change(function () {
        var isCreate = MojControls.CheckBox.getValueById("IsCreateNominationDocuments");
        if (Moj.isTrue(isCreate)) {
            MojFind("#DocumentTempleteId").visible(true);
        }
    });

    MojFind("#NominationForDisplay_EmploymentTypeId").change(function () {

        var nominationCauseId = MojFind("#NominationForDisplay_NominationCauseId").val();
        if (nominationCauseId == NominationCauseEnum.CalledAdvocate) {
            var employmentTypeId = MojFind("#NominationForDisplay_EmploymentTypeId").val();
            var advocateContactId = MojFind("#NominationForDisplay_AdvocateContactId").val();
            $.get(baseUrl + '/Process/GetUnpaidFeeRequestListForAdvocateEmploymentType?advocateContactId=' + advocateContactId + '&employmentTypeId=' + employmentTypeId, function (data) {

                if (data.FeeRequestList.length > 0) { // אם יש בקשות שכ"ט תורנות והקפצות שטרם שולמו
                    Moj.showErrorMessage(Resources.Messages.ErrExistFeeRequestWhenEmploymentTypeIsChanged);
                    var originalEmploymentTypeId = MojFind("#NominationForDisplay_OriginalEmploymentTypeId").val();
                    MojControls.AutoComplete.setValueById("NominationForDisplay_EmploymentTypeId", originalEmploymentTypeId);
                };
            });
        }
    });

    MojFind("#NominationForDisplay_ToDate").change(function () {
        if (MojFind("#NominationForDisplay_ToDate").val() != "") {
            MojFind("#NominationForDisplay_NominationEndReasonId").visible(true);
        }
        else {
            MojFind("#NominationForDisplay_NominationEndReasonId").visible(false);
        }
    });

    MojFind("#NominationForDisplay_ShiftDate").change(function () {

        //if (MojFind("#NominationForDisplay_ShiftDate").val() != "") {
        MojFind("#NominationForDisplay_ShiftId").enable(true);
        $.ajax({
            url: baseUrl + '/Process/GetShiftsAndNominationTypesList',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "shiftDate": "' + MojFind("#NominationForDisplay_ShiftDate").val() + '", "advocateId": "' + MojFind("#NominationForDisplay_AdvocateContactId").val() + '"}',

            success: function (retData) {
                if (retData != undefined) {
                    if (JSON.stringify(retData.shiftResult) != "[]")
                        MojControls.AutoComplete.setDataSourceAndValue("NominationForDisplay_ShiftId", retData.shiftResult, -1);
                    else
                        MojControls.ComboBox.clearComboBox(MojFind("#NominationForDisplay_ShiftId"), true);
                    if (JSON.stringify(retData.nominationTypes) != "[]") {
                        MojControls.AutoComplete.setDataSourceAndValue("NominationForDisplay_NominationTypeId", retData.nominationTypes, retData.nominationTypeId);
                        if (retData.nominationTypeId == NominationTypeEnum.ToranutHakraot || retData.nominationTypeId == NominationTypeEnum.ToranutMahatzarim || retData.nominationTypeId == NominationTypeEnum.Internal)
                            MojFind("#NominationForDisplay_NominationTypeId").enable(false);
                        else
                            MojFind("#NominationForDisplay_NominationTypeId").enable(true);
                    }
                    else {
                        MojControls.ComboBox.clearSelectionById("NominationForDisplay_NominationTypeId");
                        MojFind("#NominationForDisplay_NominationTypeId").enable(true);
                        //MojControls.ComboBox.clearComboBox(MojFind("#NominationForDisplay_NominationTypeId"), true);
                    }
                }
            }
        });
        //}
        if (MojFind("#NominationForDisplay_ShiftDate").val() == "") {
            MojControls.ComboBox.clearComboBox(MojFind("#NominationForDisplay_ShiftId"), false);
            MojFind("#NominationForDisplay_NominationTypeId").enable(true);
            MojFind("#NominationForDisplay_EmploymentTypeId").enable(true);
        }
    });

    MojFind("#NominationForDisplay_ShiftId").change(function () {
        if (Moj.isNotEmpty(this.value) && Moj.isNotEmpty(MojFind("#NominationForDisplay_NominationTypeId").val())) {
            $.ajax({
                url: baseUrl + '/Process/GetEmploymentByShift',
                type: 'POST',
                async: false,
                //contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: "advocateContactId=" + MojFind("#NominationForDisplay_AdvocateContactId").val() + "&nominationTypeId=" + MojFind("#NominationForDisplay_NominationTypeId").val() + "&shiftId=" + MojFind("#NominationForDisplay_ShiftId").val(),

                success: function (retData) {
                    //if (Moj.isNotEmpty(retData)) {
                    MojFind("#NominationForDisplay_ShiftEmploymentTypeId").val(retData);
                    MojControls.AutoComplete.setValueById("NominationForDisplay_EmploymentTypeId", retData);
                    if (retData != undefined)
                        MojFind("#NominationForDisplay_EmploymentTypeId").enable(false);
                    //}
                },
            });
        }
        else if (Moj.isEmpty(this.value)) {
            MojFind("#NominationForDisplay_ShiftEmploymentTypeId").val("");
            //MojFind("#NominationForDisplay_EmploymentTypeId").enable(true);
            enableEmploymentTypeId();
        }
    });
});