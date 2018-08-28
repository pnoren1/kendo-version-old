
getCurrentContactData = function () {
    var getCurrentContactDataCallback = function () {
        var grid = MojControls.Grid.getKendoGridById("grdCandidateList");
        var selectedRow = grid.select();
        if (selectedRow != undefined) {
            var item = grid.dataItem($(selectedRow))
            if (item != null) {
                var applicantContactId = item.AdvocateContactId;
                var processId = MojFind("#ProcessId").val();
            }
            return { applicantContactId: applicantContactId, processId: processId };

        }
        return { applicantContactId: null, processId: null };

    };
    return getCurrentContactDataCallback();
};

onTelephoneConnectionDocumentReady = function () {
    
    MojFind("#CreateDocumentsDiv").addClass('hide');
    MojFind("#AgreedToNominationDiv").addClass('hide');

    MojFind("#ExistProcessesForAdvocae").addClass('hide');
    MojFind("#NoMoreProcessesForAdvocate").addClass("hide")

    if (MojFind("[id^='" + "grdCandidateList" + "']").data("kendoGrid") != null) {
        MojFind("[id^='" + "grdCandidateList" + "']").data("kendoGrid").tbody.on('click', function (e) {
            if ($(e.srcElement).hasClass('k-button') == false && $(e.srcElement).hasClass('moj-link') == false) {
                MojControls.Grid.getKendoGridById("grdCandidateList").select($(this).find("tr.k-alt.k-state-selected"));
                MojControls.Grid.getKendoGridById("grdMoreProcessForAdvocate").dataSource.read(getCurrentContactData());
            }
        });
    }

    //MojFind(".td-action.delete-row").addClass("hide")
};


onMoreProcessesForAdvocateEnd = function (e) {
    
    if (e != undefined && e.response != undefined && e.response.Total != undefined) {
        if (getCurrentContactData().applicantContactId != undefined) {


            if (e.response.Total > 0) {

                MojFind("#ExistProcessesForAdvocae").removeClass('hide');
                MojFind("#NoMoreProcessesForAdvocate").addClass("hide")
            }
            else {

                MojFind("#ExistProcessesForAdvocae").addClass('hide');
                MojFind("#NoMoreProcessesForAdvocate").removeClass("hide")
            }
        }
    }
};

saveNominationTelephoneConnection = function () {
    var formId = "frmNominationTelephoneConnection";
    var saveUrl = "/Process/SaveNominationTelephoneConnection";

    Moj.callActionWithJson(formId, saveUrl, function (data) {
        onSaveNominationTelephoneConnectionSuccessed(data);
    });
};

onCheckIsActiveNominationSuccessed = function (data) {

    if (data != null) {
        if (data.Error != null && data.Error.length > 0) {
            Moj.showErrorMessage(data.Error);
        }
        else if (data.Warning != null && data.Warning.length > 0) {
            Moj.showMessage(data.Warning, function () {
                saveNominationTelephoneConnection();
            }, Resources.Strings.Message, MessageType.Alert, true);

        }
        else if (data.Message != null && data.Message.length > 0) {
            Moj.confirm(data.Message, function () {
                saveNominationTelephoneConnection();
            });
        }
        else {
            saveNominationTelephoneConnection();
        }



    }


};

onSaveNominationTelephoneConnectionSuccessed = function (data) {
    if (data.ActionResult != null) {
        if (data.ActionResult.Error != null && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });

        }
        else {
            if (data.ActionResult.IsChange) {
                var id = data.ActionResult.ProcessId;
                var text = Resources.Strings.Process + " " + id;
                var tabName = "Process_Tab_";
                MojFind("[id^='ObjectState']").val(false);
                PDO.reloadEntityContentTab(EntityContentTypeEnum.Process, id, text, tabName + id, "NominationTelephoneConnection");
            }
            if (data.ActionResult.Notifications) {
                Moj.showMessage(data.ActionResult.Notifications, undefined, Resources.Strings.InfoMessage, MessageType.Attention);
            }
        }
    }
};

$(document).ready(function () {

    MojFind("#btnCancelNominationTelephoneConnection").click(function () {
        PDO.loadEntityTab('/Process/NominationTelephoneConnection');
    });
});