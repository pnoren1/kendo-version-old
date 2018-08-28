
setSearchContactFrom = function (selectedItem) {
    
    var contactId = selectedItem["ContactId"];
    var firstName = selectedItem["FirstName"];
    var lastName = selectedItem["LastName"];
    MojFind("#FromApplicantContactId").val(contactId);
    MojFind("#FromApplicantName").val(lastName + " " + firstName);
   
    if (!MojControls.Grid.isEmpty('grdSelectedProcessesList')) MojControls.Grid.clear('grdSelectedProcessesList');
    if (!MojControls.Grid.isEmpty('grdSourceProcessesList')) MojControls.Grid.clear('grdSourceProcessesList');

    Moj.safeGet('/PersonApplicant/GetApplicantProcessesWithAttachedProcesses?applicantContactId=' + contactId, undefined, function (retData) {
        if (retData != null && retData.Data != null && JSON.stringify(retData) != "[]") {
            MojControls.Grid.setDataSource('grdSourceProcessesList', retData.Data, true);
        }
    });
};


onSuccessTransferProcesses = function (data) {
    if (data.Error != undefined && data.Error.length > 0) {
        Moj.showErrorMessage(data.Error);
        return;
    }
    else if (data.Messages != undefined && data.Messages.length > 0) {
        //var columnList  = new { "ProcessId", "ProcessNumberForDisplay", "ProcessTypeName", "ProcessDate" };
        Moj.showErrorMessage(data.Messages);
        //Moj.confirm(data.Messages, function () { transferAllAttachedProcesses(data.ProcessIdsList) });
        return;
    }
    else if (MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid").dataSource.total() > 0) {
        var message = Resources.Messages.AllSelectedProcessesApplicantWillChange;
        Moj.confirm(message, function () {
            saveTransferProcesses();
        });
    }
};

selectAllAttachedProcess = function (grid, attachToProcessId) {
    var isSelectAnotherRows = false;
    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem.AttachToProcessId == attachToProcessId && !$(this).hasClass('k-state-selected')) {
            $(this).addClass('k-state-selected');
            isSelectAnotherRows = true;
        }
    });
    return isSelectAnotherRows;
};

prepareAttachedProcess = function (sourceGrid) {
    var transferWithAttachedProcess = false;
    var selectedRows = sourceGrid.select();
    selectedRows.each(function (index, selectedRow) {
        var attachToProcessId = sourceGrid.dataItem(selectedRow)["AttachToProcessId"];
        if (!Moj.isEmpty(attachToProcessId)) {
            transferWithAttachedProcess = selectAllAttachedProcess(sourceGrid, attachToProcessId) || transferWithAttachedProcess;
        }
    });
    return transferWithAttachedProcess;
};

beforeBtnLeftButtonClick = function () {
    var sourceGrid = MojFind("[id^='grdSourceProcessesList']").data("kendoGrid");
    var targetGrid = MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid");

    if (sourceGrid.dataSource.total() > 0 && sourceGrid.dataSource.total() != targetGrid.dataSource.total()) {
        var transferWithAttachedProcess = false;

        if (sourceGrid.dataSource.total() > 1)
            var transferWithAttachedProcess = prepareAttachedProcess(sourceGrid);

        if (transferWithAttachedProcess == true)
            Moj.confirm(Resources.Messages.WrnSelectedProcessHaveAttachedProcess, function () {
                PDO.addRowFromTableToTable(['grdSourceProcessesList'], 'grdSelectedProcessesList', ['ProcessId', 'AttachToProcessId', 'ProcessNumberForDisplay', 'ProcessTypeName', 'ProcessDate'], undefined, 'True');
            }, null, function () { sourceGrid.clearSelection() }, "", true, Resources.Strings.Yes, Resources.Strings.No);
        else
            return true;
    }
    return false;
};

beforeBtnRightButtonClick = function () {
    var targetGrid = MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid");

    if (targetGrid.dataSource.total() > 0) {
        var transferWithAttachedProcess = false;

        if(targetGrid.dataSource.total() > 1)
            var transferWithAttachedProcess = prepareAttachedProcess(targetGrid);

        if (transferWithAttachedProcess == true) {
            Moj.confirm(Resources.Messages.WrnSelectedProcessHaveAttachedProcess, function () {
                PDO.removeRowFromTableToTable('grdSelectedProcessesList', undefined, 'True')
            }, null, function () { targetGrid.clearSelection() }, "", true, Resources.Strings.Yes, Resources.Strings.No);
        }
        else
            return true;
    }
    return false;
};

saveTransferProcesses = function () {
    var formId = MojFind("#transferProcessesDiv").closest("form").attr("id");
    var saveUrl = "/PersonApplicant/SaveTransferProcesses";
    Moj.callActionWithJson(formId, saveUrl, function (data) {
        if (data.Error != null && data.Error.length > 0) {
            Moj.showErrorMessage(data.Error);
        }
        else {
            Moj.showMessage(Resources.Messages.SuccessTransferProcessesFromApplicant, function () {
                MojFind("#content_Applicants").load(baseUrl + '/PersonApplicant/TransferProcesses');
            }, Resources.Strings.Message, MessageType.Success, true)


    }
    });
};

$(document).ready(function () {

    MojFind("#FromApplicantContactId").change(function () {
        var applicantContactId = MojFind("#FromApplicantContactId").val();
        Moj.safeGet("/Nominations/GetApplicantContactNameById?applicantContatId=" + applicantContactId, undefined, function (data) {
            if (data.PersonName != undefined) {
                MojFind("#FromApplicantName").text(data.PersonName);
            }
            else {
                MojFind("#FromApplicantName").text("");
            }
        });
    });

    MojFind("#ToApplicantContactId").change(function () {
        var applicantContactId = MojFind("#ToApplicantContactId").val();
        Moj.safeGet("/Nominations/GetApplicantContactNameById?applicantContatId=" + applicantContactId, undefined, function (data) {
            if (data.PersonName != undefined) {
                MojFind("#ToApplicantName").text(data.PersonName);
            }
            else {
                MojFind("#ToApplicantName").text("");
            }
        });
    });

    MojFind("#btnCancelTransferProcesses").click(function () {
        MojFind("#content_Applicants").load(baseUrl + '/PersonApplicant/TransferProcesses');
    });

});