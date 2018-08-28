$(document).ready(function () {


    MojFind("#btnCancelJoinedProcesses").on('click', function (e) {
        PDO.loadEntityTab('/Process/JoinedProcesses');
    });

    MojFind("#btnActionJoinedProcesses").removeAttr("onclick")
    MojFind("#btnActionJoinedProcesses").die('click');
    MojFind("#btnActionJoinedProcesses").live('click', function () {
        var processesRepresentedByPDO = MojFind("[id^='grdProcessesRepresentedByPDOList']").data("kendoGrid").dataSource.data();
        var processesNotRepresentedByPDO = MojFind("[id^='grdProcessesNotRepresentedByPDOList']").data("kendoGrid").dataSource.data();

        if (processesRepresentedByPDO.length > 0 && processesRepresentedByPDO.every(x => x.State == GridRowState.Deleted)) { //all records deleted
            Moj.confirm(Resources.Messages.WrnAllJoinedProcessesDeleted, function () {
                saveFunction();

            }, null, null);
        }

        else if (processesRepresentedByPDO.length == 0 && processesNotRepresentedByPDO.length > 0) {
            Moj.showMessage(Resources.Messages.ErrMustToJoinProcessToJoinedProcess, null, Resources.Strings.MessageError, MessageType.Error);
        }
        else if (processesRepresentedByPDO.length > 0 || processesNotRepresentedByPDO.length > 0) {
            saveFunction();
        }

    }),


        saveFunction = function () {
            Moj.callActionWithJson("frmJoinedProcesses", "/Process/SaveJoinedProcesses", function (data) {
                if (data.Error != undefined && data.Error.length > 0) {
                    Moj.showErrorMessage(data.ActionResult.Error, function () {
                        return false;
                    });
                }
                else {
                    if (data.IsChange) {
                        PDO.onRefresh(EntityContentTypeEnum.Process);
                    }
                }
            });
        }

    onSuccessSaveJoinedProcesses = function (data) {
            if (data.Error != undefined && data.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });
            }
            else {
                if (data.IsChange) {
                         PDO.onRefresh(EntityContentTypeEnum.Process);
                    }
                }
        },

    openProcessesRepresentedByPDOPopup = function () {
        
        var rows = MojFind("[id^='grdProcessesRepresentedByPDOList']").data("kendoGrid").dataSource.data();
        var existProcesses = [];
        var parameters = null;
        var i = 0;
        rows.forEach(function (obj) {
            parameters += "&existProcesses[" + i + "]=" + obj.ProcessId; 
            i++;
        });

Moj.openPopupWindow("openProcessesRepresentedByPDOPopup", "", "פניות לפונה", 1100, 400, false, false, false, "Process/ProcessesToPersonApplicant?" + parameters, null);

    }
});




