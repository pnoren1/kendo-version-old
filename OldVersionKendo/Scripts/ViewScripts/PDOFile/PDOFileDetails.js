addPDOFileAttached = function () {
    PDO.openSearchPDOFilePopup("", "onCloseSearchPDOFilePopup");
};

onCloseSearchPDOFilePopup = function (retData) {
    return {
        ID: 0,
        PDOFileId: retData.PDOFileId,
        ConnectionType: "",
        AllSupervisors: ""
    };
};

onSetSearchPDOFileId = function (selectedItem) {
    var pdoFileId = selectedItem["PDOFileId"];
    MojControls.TextBox.setValueById("AttachedPDOFileId", pdoFileId, false);
    checkAttachedPDOFileIdExist(pdoFileId);
};

checkAttachedPDOFileIdExist = function (pdoFileId) {
    if (pdoFileId == MojFind("#EntityId").val()) {
        Moj.showErrorMessage(Resources.Messages.WrnAttachedCurrentPDOFile);
        MojFind("#AttachedPDOFileId").val('');
        return;
    }
    var grid = MojControls.Grid.getKendoGridById("grdPDOFileAttachedList");
    if (Moj.isEmpty(grid) || grid == null)
        return false;

    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
            if ($(this).find("[name*='AttachedPDOFileId']").val() == pdoFileId) {
                Moj.showErrorMessage(Resources.Messages.WrnAttachedPDOFileExist);
                MojFind("#AttachedPDOFileId").val('');
                return true;
            }
        }
    });
};

checkProcessIdExist = function (processId, gridName) {
    var isExist = false;
    var grid = MojControls.Grid.getKendoGridById(gridName);
    if (Moj.isEmpty(grid) || grid == null)
        return isExist;

    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);

        if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
            if ($(this).find("[name*='ProcessId']").val() == processId) {
                Moj.showErrorMessage("פניה קיימת");
                isExist = true;
            }
        }
    });
    return isExist;
};

onSuccessSavePDOFileDetails = function (data) {
    if (data.ActionResult != null) {
        if (data.ActionResult.Error != undefined && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });
        } else {
            if (data.ActionResult.IsChange) {
                var id = data.EntityInfo.EntityId;
                var text = Resources.Strings.PDOFile + " " + id;
                var tabName = "PDOFile_Tab_";
                MojFind("[id^='ObjectState']").val(false);
                PDO.reloadEntityContentTab(EntityContentTypeEnum.PDOFile, id, text, tabName + id);
            }
        }
    }
};

//getConsultantUsersByProcessId = function (processId, consultantUsersDataSourceName) {
//$.ajax({
//    url: baseUrl + '/PDOFile/getConsultantUsersByProcessId',
//    type: 'POST',
//    async: false,
//    contentType: 'application/json; charset=utf-8',
//    dataType: 'json',
//    data: '{ "processId": "' + processId + '"}',

//    success: function (retData) {
//        if (JSON.stringify(retData) != "[]" && Moj.isNotEmpty(retData)) {
//            MojControls.AutoComplete.setDataSource(consultantUsersDataSourceName, retData);
//            }
//        }
//});
getConsultantUsersByProcessId = function (prefixName, consultationGridName, ConsultantUserFieldName, isUniqProcessId) {
    var processId = MojControls.AutoComplete.getValueById(prefixName + "ProcessId");
    if (Moj.isEmpty(processId) || processId == 0) {
        MojFind("#" + prefixName + "ApplicantContactId").val("");
        MojControls.Label.setValueById(prefixName + "ApplicantName", "");
        return;
    }
    //if (isUniqProcessId != false && Moj.isTrue(checkProcessIdExist(processId, consultationGridName))) {
    //    MojControls.AutoComplete.clearSelectionById(prefixName + "ProcessId");
    //    return;
    //}
    $.ajax({
        url: baseUrl + '/PDOFile/GetProcessDetailsForConsultation',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{ "processId": "' + processId + '" }',
        success: function (retData) {
            if (JSON.stringify(retData) != "[]") {
                if (ConsultantUserFieldName != undefined)
                    MojControls.AutoComplete.setDataSourceAndValue(ConsultantUserFieldName, retData.ProcessConsultationUsers, -1);
                //else
                //    MojFind("#" + prefixName + "DistrictId").val(retData.DistrictId);

                MojFind("#" + prefixName + "ApplicantContactId").val(retData.ApplicantContactId);
                MojControls.Label.setValueById(prefixName + "ApplicantName", retData.ApplicantName);
            }
        }
    });
};

$(document).ready(function () {

    //======================================================================================================Consultation

    MojControls.DateTimePicker.setValueById("FromDate", null);

    MojFind("#ConsultantUserId").die('change');
    MojFind("#ConsultantUserId").live('change', function (e) {
        var ConsultantUserName = MojControls.AutoComplete.getTextById("ConsultantUserId");
        MojFind("#ConsultantUserName").val(ConsultantUserName);
    });

    MojFind("#ConProcessId").die('change');
    MojFind("#ConProcessId").live('change', function (e) {
        getConsultantUsersByProcessId("Con", "grdProcessConsultationList", "ConsultantUserId");
    });

    //======================================================================================================PDOConsultation

    MojControls.DateTimePicker.setValueById("ConsultantionDate", null);

    MojFind("#PDOConsultantUserId").die('change');
    MojFind("#PDOConsultantUserId").live('change', function (e) {
        var ConsultantUserName = MojControls.AutoComplete.getTextById("PDOConsultantUserId");
        MojFind("#PDOConsultantUserName").val(ConsultantUserName);
    });

    MojFind("#PDOConProcessId").die('change');
    MojFind("#PDOConProcessId").live('change', function (e) {
        getConsultantUsersByProcessId("PDOCon", "grdProcessPDOConsultationList", "PDOConsultantUserId");
    });

    MojFind("#ExpertProcessId").die('change');
    MojFind("#ExpertProcessId").live('change', function (e) {
        getConsultantUsersByProcessId("Expert", "grdProcessExpertList", undefined, false);
    });

    //======================================================================================================AttachedPDOFile

    MojFind("#AttachedPDOFileId").die('change');
    MojFind("#AttachedPDOFileId").live('change', function (e) {
        var pdoFileId = this.value;
        if (Moj.isFalse(MojFind("#AttachedPDOFileId").valid())) {
            e.preventDefault();
            return;
        }
        checkAttachedPDOFileIdExist(pdoFileId);

        Moj.safeGet('/PDOFile/IsPdoFileExist?pdoFileId=' + pdoFileId, undefined, function (retData) {
            if (retData != null) {
                if (retData.Error != undefined && retData.Error.length > 0) {
                    Moj.showErrorMessage(retData.Error, null, Resources.Strings.MessageError, true);
                    MojFind("#AttachedPDOFileId").val('');
                }
            }
        });
    });

    MojFind("[id='btnbreak-Connection']").die('click');
    MojFind("[id='btnbreak-Connection']").live('click', function (e) {
        if ($(this).attr("disabled") == "disabled")
            return;
        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
        if (dataItem.State != window.Enums.ObjectState.Deleted) {
            if (dataItem.State == window.Enums.ObjectState.Added)
                grid.dataSource.remove(dataItem);
            else
                dataItem.State = window.Enums.ObjectState.Deleted;
            grid.refresh();
            var action = MojFind("[id^='frm']").attr("id").replace("frm", "");
            MojFind(MojFind("[id^='btn'][id*='" + action + "']")).parent("div").parent("div").removeClass("hide");
            if (MojFind("form").find('#ObjectState') != undefined)
                MojFind("form").find('#ObjectState').val("true");
        }
    });

    MojFind("#btnCancelPDOFileDetails, #btnCancelPDOFileEntityContent").die('click');
    MojFind("#btnCancelPDOFileDetails, #btnCancelPDOFileEntityContent").live('click', function (e) {
        PDO.loadEntityTab('/PDOFile/PDOFileDetails');
    });


    MojFind("#btnhistoryProcessSupervisor").click(function () {
        var grid = MojFind("[id^='grdHandlingHistoryHearings']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.FullyOffsetBase)
            else if (feeActivityTypeClassification == FeeActivityTypeClassification.PercentageAddition)
                PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.FullyOffsetPercentageAddition)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });

    MojFind("[id='btnview-history']").die('click');
    MojFind("[id='btnview-history']").live('click', function (e) {
        if ($(this).attr("disabled") == "disabled")
            return;
        var grid = $(e.currentTarget).closest(".k-grid");
        var dataItem = grid.data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
        if (Moj.isFalse(dataItem.HasHistory))
            return;
        var gridName = grid[0].id.substring(0, grid[0].id.indexOf('-'))
        var auditModel = JSON.parse(MojFind("#HistoryModel" + gridName).val());
        auditModel.Key = dataItem.ID;
        PDO.openHistoryView(auditModel, 900);
    });


    MojFind("#ExpertTypeId").die('change');
    MojFind("#ExpertTypeId").live('change', function (e) {
        var expertTypeId = this.value;
        Moj.safeGet('/PDOFile/GetExpertsByExpertType?expertTypeId=' + expertTypeId, undefined, function (retData) {
            if (retData != null) {
                if (retData.Error != undefined && retData.Error.length > 0)
                    Moj.showErrorMessage(retData.Error, null, Resources.Strings.MessageError, true);
                else
                    MojControls.AutoComplete.setDataSource("ExpertId", retData.expertIds);
            }
        });
    });

});

