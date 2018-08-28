
function contactToProcess() {
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
    Moj.website.openPopupWindow("PopUpWizard", "", Resources.Strings.NewProcess, 1266, 766, false, false, false, baseUrl + '/Process/NewProcessWizard' + urlParameters, undefined, undefined, undefined, undefined);
};

updateProcessNumber = function () {
    var urlParameters = {
        processNoForDisplay: MojFind("#ProcessNoForDisplay").val(),
        isProcessNoUnknown: MojFind("#IsProcessNoUnknown").val(),
        isChange: MojFind("#IsChangeProcessNumber").val(),
        newProcessNumberPrefixId: MojFind("#NewProcessNumberPrefixId").val(),
        newProcessNumber: MojFind("#NewProcessNumberId").val(),
        newProcessNumberMonth: MojFind("#NewProcessNumberMonth").val(),
        newProcessNumberYear: MojFind("#NewProcessNumberYear").val(),
        newIsProcessNoUnknown: MojControls.CheckBox.getValueById("NewIsProcessNoUnknown"),
        processType: MojFind("#ProcessTypeId").val(),
        updateReason: MojFind("#ProcessNumberUpdateReason").val() != "" ? MojFind("#ProcessNumberUpdateReason").val() : 0,
        displayFieldsProcessNumber: MojFind("#DisplayFields_ProcessNumber").val()
    };
    Moj.openPopupWindow("updateProcessNumber", null, Resources.Strings.UpdateProcessNumber, 900, 320, false, false, false,
        baseUrl + "/Process/UpdateProcessNumber", undefined, urlParameters)
};

ProcessNumberHistory = function () {
    Moj.openPopupWindow(null, null, Resources.Strings.HistoryProcessNumber, 900, 310, false, false, false,
        baseUrl + "/Process/ProcessNumberHistory?processId=" + MojFind("#ProcessId").val());
};

updateProcessCourt = function () {
    var urlParameters = {
        courtId: MojFind("#CourtId").val(),
        isChange: MojFind("#IsChangeCourt").val(), newCourtId: MojFind("#NewCourtId").val(),
        updateReason: MojFind("#CourtUpdateReason").val(), processType: MojFind("#ProcessTypeId").val(), displayFieldsCourt: MojFind("#DisplayFields_CourtContactId").val()
    };
    Moj.openPopupWindow("updateProcessCourt", null, Resources.Strings.UpdateProcessCourt, 900, 310, false, false, false,
        baseUrl + "/Process/UpdateCourt", undefined, urlParameters)
};

ProcessCourtHistory = function () {
    Moj.openPopupWindow(null, null, Resources.Strings.ProcessCourtHistory, 900, 310, false, false, false,
        baseUrl + "/Process/CourtsHistory?processId=" + MojFind("#ProcessId").val());
};

ProcessStatusHistory = function () {
    Moj.website.openPopupWindow(null, null, Resources.Strings.StatusesHistory, 900, 410, false, false, false,
        baseUrl + "/Process/ProcessStatusHistory?processId=" + MojFind("#ProcessId").val());
};

onSuccessUpdateProcesNumber = function (result) {
    if (result.Error.length > 0) {
        Moj.showErrorMessage(result.Error, function () {
            return false;
        });
        closePopUp("updateProcessNumber");
    }
    else {
        var newProcessNumberPrefixId = result.newProcessNumberPrefixId;
        var newProcessNumber = result.newProcessNumber;
        var newProcessNumberMonth = result.newProcessNumberMonth;
        var newProcessNumberYear = result.newProcessNumberYear;
        var processNumberForSearch = result.ProcessNumberForSearch;
        var newIsProcessNoUnknown = result.newIsProcessNoUnknown;
        var newProcessNoForDisplay = result.NewProcessNoForDisplay;
        var updateReason = result.updateReason;

        closePopUp("updateProcessNumber");

        MojFind(".div-update-panel").find("#IsChangeProcessNumber").val(true);
        MojFind(".div-update-panel").find("#NewProcessNumberPrefixId").val(newProcessNumberPrefixId);
        MojFind(".div-update-panel").find("#NewProcessNumberId").val(newProcessNumber);
        MojFind(".div-update-panel").find("#NewProcessNumberMonth").val(newProcessNumberMonth);
        MojFind(".div-update-panel").find("#NewProcessNumberYear").val(newProcessNumberYear);
        MojFind(".div-update-panel").find("#ProcessNumberForSearch").val(processNumberForSearch);
        MojControls.CheckBox.setValue(MojFind(".div-update-panel").find("#NewIsProcessNoUnknown"), newIsProcessNoUnknown);
        MojControls.Label.setValue(MojFind(".div-update-panel").find("#NewProcessNoForDisplay"), newProcessNoForDisplay);
        MojFind(".div-update-panel").find("#ProcessNumberUpdateReason").val(updateReason);
        MojFind(".div-update-panel").closest("form").find("[id^='ObjectState']").val(true);
    }
};

onSuccessUpdateCourt = function (result) {
    if (result.Error.length > 0) {
        Moj.showErrorMessage(result.Error, function () {
            return false;
        });
        closePopUp("updateProcessCourt");
    }
    else {
        var newcourtId = result.newcourtId;
        var courtName = result.courtName;
        var updateReason = result.updateReason;

        closePopUp("updateProcessCourt");

        MojFind(".div-update-panel").find("#IsChangeCourt").val(true);
        MojFind(".div-update-panel").find("#NewCourtId").val(newcourtId);
        MojControls.Label.setValue(MojFind(".div-update-panel").find("#NewCourt"), courtName);
        MojFind(".div-update-panel").find("#CourtUpdateReason").val(updateReason);
        MojFind(".div-update-panel").closest("form").find("[id^='ObjectState']").val(true);
    }
};

onSuccessSaveProcessDetails = function (data) {
    if (data.ActionResult != null) {
        if (data.ActionResult.Error != undefined && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });
        } else {
            if (data.ActionResult.IsChange) {
                var id = data.ActionResult.ProcessId;
                var text = Resources.Strings.Process + " " + id;
                var tabName = "Process_Tab_";
                MojFind("[id^='ObjectState']").val(false);
                PDO.reloadEntityContentTab(EntityContentTypeEnum.Process, id, text, tabName + id);
            }
            if (data.ActionResult.Notifications) {
                Moj.showMessage(data.ActionResult.Notifications, undefined, Resources.Strings.InfoMessage, MessageType.Attention);
            }
        }
    }


};

closePopUp = function (id) {
    var window = $("#" + id).data("kendoWindow");
    window.close();

};

EnabledProcessNumber = function (enabled) {
    MojFind("#ProcessNumberId").enable(enabled);
    MojFind("#ProcessNumberMonth").enable(enabled);
    MojFind("#ProcessNumberYear").enable(enabled);
    if (enabled == true) {
        MojFind("#ProcessNumberMonth").mask('99');
        MojFind("#ProcessNumberYear").mask('99');
    }
    MojFind("#ProcessNumberPrefixId").enable(enabled);
    MojFind("#ProcessNumberId").val('');
    MojFind("#ProcessNumberMonth").val('');
    MojFind("#ProcessNumberYear").val('');
    MojControls.AutoComplete.setValueById("ProcessNumberPrefixId", 0);
}

enableNominationGroundStatusReason = function (isEnable, clearNominationGroundStatusReason) {
    MojFind("#NominationGroundModel_NominationGroundStatusReasonId").enable(isEnable);
    if (clearNominationGroundStatusReason)
        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundStatusReasonId", 0);
};

enableNominationGroundsId = function (isEnable, clearNominationGroundId) {
    MojFind("#NominationGroundModel_NominationGroundId").enable(isEnable);
    if (clearNominationGroundId)
        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundId", 0);
};

//enableEligiblityPanel = function (isEnable, clearNominationGroundId, clearNominationGroundStatusReason) {
//    MojFind("#PersonalRequestTypeID").enable(isEnable);
//    MojFind("#PersonalRequestDate").enable(isEnable && !Moj.isEmpty(MojFind("#PersonalRequestTypeID").val()));
//    MojFind("#NominationGroundModel_NominationGroundStatusId").enable(isEnable);
//    enableNominationGroundStatusReason(isEnable && !(Moj.isEmpty(MojFind("#NominationGroundModel_NominationGroundStatusId").val())
//        || MojFind("#NominationGroundModel_NominationGroundStatusId").val() == null) && MojFind("#NominationGroundModel_NominationGroundStatusId").val() != NominationGroundStatus.Eligible);
//    enableNominationGroundsId(isEnable && !(Moj.isEmpty(MojFind("#NominationGroundModel_NominationGroundStatusId").val(), clearNominationGroundStatusReason)
//        || MojFind("#NominationGroundModel_NominationGroundStatusId").val() == null) && MojFind("#NominationGroundModel_NominationGroundStatusId").val() == NominationGroundStatus.Eligible, clearNominationGroundId);
//    //MojFind("#NominationGroundModel_NominationGroundId").enable(isEnable);
//    //MojFind("#NominationGroundModel_DisplayAllNominationGrounds").enable(isEnable);

//};

visibleEndOfRepresentationFields = function (isEnable) {
    if (isEnable == true)
        MojFind("#EndOfRepresentationDate").data("kendoDatePicker").value(new Date());
    else
        MojFind("#EndOfRepresentationDate").data("kendoDatePicker").value(null);

    MojFind("#EndOfRepresentationDate").enable(isEnable);
    MojFind("#EndOfRepresentationReasonId").enable(isEnable);
};

preventNominationGroundStatusChange = function (message) {
    Moj.showErrorMessage(message, undefined, "", true);
    MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundStatusId", prevNominationGroundStatusId);
};

checkProcessesAttached = function () {
    var result = false;
    var grid = MojFind("[id^='grdProcessesAttachedList']").data("kendoGrid");
    if (grid.dataSource.total() > 0) {
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined) {
                if (dataItem.State != window.Enums.ObjectState.Deleted && Moj.isTrue(dataItem.IsProcessId1)) {
                    result = true;
                }
            }
        });
    }
    return result;
};

deletedNominationGround = function () {
    MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundId", 0);
    MojFind("#NominationGroundModel_IsNominationGroundContinued").val(false);
    MojFind("#NominationGroundContinuedLable").visible(false);
};

connectToPDOFile = function () {
    $.ajax({
        url: baseUrl + "/Process/PdoFileForUpdateProcess",
        type: "post",
        data: JSON.stringify(updateProcessUrlParameters()),
        contentType: 'application/json',
        success: function (data, textStatus, xhr) {
            Moj.website.openPopupWindow("openPdoFile", data, Resources.Strings.ConnectToPdoFile, 1170, 600, false, false, false);
        },
        error: function (event, xhr, settings, exception) {

        }
    });
};

addProcessesAttached = function () {
    Moj.website.openPopupWindow("addProcessesAttached", null, Resources.Strings.AddProcessesAttached, 900, 455, false, false, false,
        baseUrl + "/Process/AddProcessesAttached", undefined, addProcessesAttachedData());
};

//SearchPersonAdvocate = function () {
//    Moj.openPopupWindow("SearchPersonAdvocate", null, Resources.Strings.SearchPersonAdvocates, 1170, 870, false, false, false,
//        baseUrl + "/PersonAdvocate/SearchPersonAdvocate", undefined, { isPopup : true, isCurrentDistrictOnlyField : true });
//};

OpenHistoryNominationConsulationDay = function () {
    Moj.website.openPopupWindow("HistoryNominationConsulationDay", null, Resources.Strings.HistoryNominationConsulationDay, 1100, 700, false, false, false,
        baseUrl + "/Process/HistoryNominationConsulationDay", undefined, addProcessesAttachedData());
};

OpenNominationsToRelatedProcesses = function () {
    Moj.openPopupWindow("NominationsToRelatedProcesses", null, Resources.Strings.NominationsRelatedProcessTitle, 1100, 450, false, false, false,
        baseUrl + "/Process/NominationsToRelatedProcesses", undefined, addProcessesAttachedData());
};

addProcessesAttachedData = function () {
    var isProcessNumberChange = MojFind("#IsChangeProcessNumber").val();
    var urlParameters = {
        processId: MojFind("#ProcessId").val(),
        processTypeId: MojFind("#ProcessTypeId").val(),
        processNumberForDisplay: MojFind("#NewProcessNoForDisplay").val(),
        processNumberForSearch: MojFind("#ProcessNumberForSearch").val(),
        ProcessNumberPrefixId:  Moj.isTrue(isProcessNumberChange) ? MojFind("#NewProcessNumberPrefixId").val() : MojFind("#ProcessNumberPrefixId").val(),
        ProcessNumberId: Moj.isTrue(isProcessNumberChange) ? MojFind("#NewProcessNumberId").val() : MojFind("#ProcessNumberId").val(),
        isProcessNoUnknown: MojControls.CheckBox.getValueById("NewIsProcessNoUnknown"),
        applicantContactId: MojFind("#ApplicantContactId").val(),
    };
    return urlParameters;
};

updateProcessUrlParameters = function () {
    var isProcessNumberChange = MojFind("#IsChangeProcessNumber").val();
    var grid = MojControls.Grid.getKendoGridById("grdPoliceIncidentNumberList");
    var policeIncidentNumberGrid = null;
    if (grid != null)
        policeIncidentNumberGrid = grid.dataSource.view();
    var urlParameters = {
        processId: MojFind("#ProcessId").val(),
        processTypeId: MojFind("#ProcessTypeId").val(),
        processNumberForDisplay: MojFind("#NewProcessNoForDisplay").val(),
        processNumberForSearch: MojFind("#ProcessNumberForSearch").val(),
        ProcessNumberPrefixId: Moj.isTrue(isProcessNumberChange) ? MojFind("#NewProcessNumberPrefixId").val() : MojFind("#ProcessNumberPrefixId").val(),
        ProcessNumberId: Moj.isTrue(isProcessNumberChange) ? MojFind("#NewProcessNumberId").val() : MojFind("#ProcessNumberId").val(),
        isProcessNoUnknown: Moj.isTrue(isProcessNumberChange) ? MojControls.CheckBox.getValueById("NewIsProcessNoUnknown") : MojFind("#IsProcessNoUnknown").val(),
        applicantContactId: MojFind("#ApplicantContactId").val(),
        policeIncidentNumberList: policeIncidentNumberGrid,
        pdoFileId: MojFind("#PDOFileId").val(),
        isNewPDOFile: MojControls.CheckBox.getValueById("DoPDOFile")
        //policeIncidentNumberList: grid.dataSource.view(),
    };
    return urlParameters;
};

onDoPDOFileChange = function () {
    var doPDOFile = MojControls.CheckBox.getValueById("DoPDOFile");
    if (doPDOFile == true) {
        MojFind("#PDOFileId").val('');
        MojFind("#PDOFileId").enable(false);
    }
    else
        MojFind("#PDOFileId").enable(true);
};

var prevNominationGroundStatusId = MojFind("#NominationGroundModel_NominationGroundStatusId").val();
//enableEligiblityPanel(!MojControls.CheckBox.getValueById("EndOfRepresentation"));

changeNominationGroundStatus = function (nominationGroundStatusId) {
    //var nominationGroundStatusId = this.value;
    MojControls.ComboBox.clearComboBox(MojFind("#NominationGroundModel_NominationGroundStatusReasonId"), true);
    if (nominationGroundStatusId == NominationGroundStatus.Eligible) {
        MojFind("#EndOfRepresentation").enable(true);
        enableNominationGroundsId(true);
        enableNominationGroundStatusReason(false, true);
    }
    else {
        var isInvestigationProcess = (MojFind("#ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceBeforeInquiry || MojFind("#ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceAfterInquiry);
        MojFind("#EndOfRepresentation").enable(false)
        $.ajax({
            url: baseUrl + '/Process/FillNominationGroundStatusReason',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "nominationGroundStatusId": "' + nominationGroundStatusId + '", "isInvestigationProcess": "' + isInvestigationProcess + '" }',
            success: function (retData) {
                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSourceAndValue("NominationGroundModel_NominationGroundStatusReasonId", retData, -1);
                    enableNominationGroundsId(false, true);
                    enableNominationGroundStatusReason(true);
                }
                else {
                    enableNominationGroundsId(false, true);
                    enableNominationGroundStatusReason(false, true);
                }
            }
        });
    }
    //if (Moj.isTrue(isChangePrev))
    prevNominationGroundStatusId = nominationGroundStatusId;
};
$(document).ready(function () {
    //if (MojFind("#CourtId").val() == "" || MojFind("#CourtId").val() == 0)
    //    MojFind("#NominationGroundModel_DisplayAllNominationGrounds").visible(false);
    MojFind("#DoPDOFile").die('click');
    MojFind("#DoPDOFile").live('click', function (e) {
        if ($(this).attr("readonly") != undefined)
            return;
        onDoPDOFileChange();
    });

    //MojFind("#EndOfRepresentation").die('click');
    //MojFind("#EndOfRepresentation").live('click', function (e) {
    //    if ($(this).attr("readonly") != undefined)
    //        return;
    //    var endOfRepresentation = MojControls.CheckBox.getValueById("EndOfRepresentation");
    //    if (endOfRepresentation) {
    //        if (Moj.isTrue(MojFind("#ThereAreActiveNominations").val()))
    //            Moj.confirm(Resources.Messages.ThereIsActiveNomination, function () {
    //                visibleEndOfRepresentationFields(true);
    //                //disabled the heligibility panel
    //                enableEligiblityPanel(false, false, false);
    //                //מינויים? MojFind("#ThereAreActiveNominations").val(false);
    //            }, null, function () {
    //                MojControls.CheckBox.setValueById("EndOfRepresentation", false);
    //                visibleEndOfRepresentationFields(false);
    //            }, "", true, "", "", MessageType.Alert);
    //        else {
    //            visibleEndOfRepresentationFields(true);
    //            enableEligiblityPanel(false, false, false);
    //        }
    //    }
    //    else {
    //        visibleEndOfRepresentationFields(false);
    //        //enabled the heligibility panel
    //        enableEligiblityPanel(true, false, false);
    //    }
    //});

    //MojFind("#NominationGroundModel_NominationGroundStatusId").live('change', function (e) {
    //    if ($(this).attr("readonly") != undefined)
    //        return;
    //    if (this.value == NominationGroundStatus.Eligible)
    //        MojFind("#EndOfRepresentation").enable(true);
    //    else
    //        MojFind("#EndOfRepresentation").enable(false);
    //});

    MojFind("#PdoFileLink").click(function () {
        var pdoFileId = MojFind("#PDOFileId").val();
        if (!Moj.isEmpty(pdoFileId))
            PDO.addPdoFileTabById(pdoFileId);
    });
    MojFind("#PersonalRequestTypeID").die('change');
    MojFind("#PersonalRequestTypeID").live('change', function (e) {
        if ($(this).attr("readonly") != undefined)
            return;
        if (this.value)
            MojFind("#PersonalRequestDate").enable(true);
        else
            MojFind("#PersonalRequestDate").enable(false);
    });

    MojFind("[id='btnbreak-Connection']").die('click');
    MojFind("[id='btnbreak-Connection']").live('click', function (e) {
        if ($(this).attr("disabled") == "disabled")
            return;

        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
        if (dataItem.State != window.Enums.ObjectState.Deleted) {
            var isDeleteRow = true;
            if (Moj.isTrue(MojFind("#NominationGroundModel_IsNominationGroundContinued").val()) && MojControls.AutoComplete.getValueById("NominationGroundModel_NominationGroundId") == dataItem.NominationGroundId) {
                Moj.confirm(Resources.Messages.WrnProcessConnectionDeletedChooseNewNominationGround, function () {
                    deletedNominationGround();
                    isDeleteRow = true;
                }, "", function () {
                    isDeleteRow = false;
                }, "", true, "", "", MessageType.Alert);
            }
            if (isDeleteRow == true) {
                if (dataItem.State == window.Enums.ObjectState.Added)
                    grid.dataSource.remove(dataItem);
                else
                    dataItem.State = window.Enums.ObjectState.Deleted;
                //MojFind("[id='btnbreak-Connection']").enable(false);
                //$(this).parent().attr("disabled", "disabled");
                //$(this).attr("disabled", "disabled");
                //$(this).enable(false);
                grid.refresh();
                if (MojFind("form").find('#ObjectState') != undefined)
                    MojFind("form").find('#ObjectState').val("true");
            }
        }
    });

    MojFind("#NominationGroundModel_NominationGroundStatusId").die('change');

    MojFind("#NominationGroundModel_NominationGroundStatusId").live('change', function (e) {
        var isChangePrev = true;
        var nominationGroundStatusId = this.value;
        if (prevNominationGroundStatusId == NominationGroundStatus.Eligible) {
            if (checkProcessesAttached()) {//אם יש פניות מקושרות
                preventNominationGroundStatusChange(Resources.Messages.ThereIsAttachedProcessDisconnectTheProcess);
                //e.preventDefault();
                return
            }
            if (Moj.isTrue(MojFind("#ThereAreNominationsNotCalled").val())) {//אם יש מינויים שאינם הקפצות??
                preventNominationGroundStatusChange(Resources.Messages.ErrThereIsActiveNominations);
                // e.preventDefault();
                return
            }
            if (!Moj.isEmpty(MojControls.AutoComplete.getValueById("NominationGroundModel_NominationGroundId")) && MojControls.AutoComplete.getValueById("NominationGroundModel_NominationGroundId") != null) {
                if (Moj.isTrue(MojControls.CheckBox.getValueById("EndOfRepresentation"))) {
                    Moj.confirm(Resources.Messages.IsDeletedNominationGroundAndEndOfRepresentation, function () {
                        deletedNominationGround();
                        MojControls.CheckBox.setValueById("EndOfRepresentation", false);
                        MojControls.AutoComplete.setValueById("EndOfRepresentationReasonId", 0);
                        MojFind("#EndOfRepresentationDate").val('');
                        MojFind("#EndOfRepresentationDate").enable(false);
                        MojFind("#EndOfRepresentationReasonId").enable(false);
                        changeNominationGroundStatus(nominationGroundStatusId);
                    }, null, function () {
                        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundStatusId", prevNominationGroundStatusId);
                        isChangePrev = false;
                    }, "", true, Resources.Strings.Yes, Resources.Strings.No, MessageType.Alert);
                }
                else {
                    Moj.confirm(Resources.Messages.IsDeletedNominationGround, function () {
                        deletedNominationGround();
                        changeNominationGroundStatus(nominationGroundStatusId);
                    }, null, function () {
                        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundStatusId", prevNominationGroundStatusId);
                        isChangePrev = false;
                    }, "", true, Resources.Strings.Yes, Resources.Strings.No, MessageType.Alert);
                }
                return;
            }

        }

        if (isNaN(parseInt(this.value)) || this.value == 0) {
            enableNominationGroundsId(false, true);
            enableNominationGroundStatusReason(false, true);
        }
    else {
        changeNominationGroundStatus(nominationGroundStatusId);
    }
     
    });

    MojFind("#NominationGroundModel_NominationGroundId").die('change');

    MojFind("#NominationGroundModel_NominationGroundId").live('change', function (e) {
        MojFind("#NominationGroundModel_IsNominationGroundContinued").val(false);
        MojFind("#NominationGroundContinuedLable").visible(false);
    });
    
    MojFind("#btnCancelEntityProcessDetails, #btnCancelProcessEntityContent").die('click');
    MojFind("#btnCancelEntityProcessDetails, #btnCancelProcessEntityContent").live('click', function (e) {
       PDO.loadEntityTab('/Process/EntityProcessDetails');
    });
       
});
