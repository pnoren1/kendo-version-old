
onSetSearchPDOFileFrom = function (selectedItem) {
    var pdoFileId = selectedItem["PDOFileId"];
    MojFind("#FromPDOFile").val(pdoFileId);
    onPDOFileIdChange(pdoFileId);
};

onPDOFileIdChange = function (pdoFileId) {
    if (MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid").dataSource.data().length != 0)
        MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid").dataSource.data("");

    var grid = MojFind("[id^='grdSourceProcessesList']").data("kendoGrid");
    Moj.safeGet('/PDOFile/GetPDOFileProcessesWithAttachedProcesses?pdoFileId=' + pdoFileId, undefined, function (retData) {
        if (retData != null) {
            if (retData.Error != undefined && retData.Error.length > 0) {
                Moj.showErrorMessage(retData.Error, null, Resources.Strings.MessageError, true);
                MojFind("#FromPDOFile").val('');
                MojControls.Grid.clear('grdSourceProcessesList');
                grid.refresh();
            }
            else if (retData.result != null && JSON.stringify(retData) != "[]") {
                grid.dataSource.data(retData.result.Data);
                grid.refresh();
                MojFind("#SourceProcessesCount").val(retData.result.Data.length);
            }
            //else {
            //    MojControls.Grid.clear('grdSourceProcessesList');
            //    grid.refresh();
            //}
        }
    });
};


onSuccessTransferPDOFileProcesses = function (data, isTransferAll) {
    if (data.Error != undefined && data.Error.length > 0) {
        Moj.showErrorMessage(data.Error);
        return;
    }
    else if (data.IsChange) {
        if (Moj.isTrue(isTransferAll)) {
            Moj.showMessage(Resources.Messages.SuccessTransferProcessesFromPDOFile, function () {
                MojFind("#content_PDOFiles").load(baseUrl + '/PDOFile/PDOFileTransferProcesses');
            }, Resources.Strings.Message, MessageType.Success, true);
        }
        else if (Moj.isNotEmpty(data.NewPdoFileId)) {
            Moj.showMessage(String.format(Resources.Messages.SuccessTransferProcessesToNewPDOFile, data.NewPdoFileId), function () {
                MojFind("#content_PDOFiles").load(baseUrl + '/PDOFile/PDOFileTransferProcesses');
                PDO.addEntityContentTab(EntityContentTypeEnum.PDOFile, data.NewPdoFileId, null, Resources.Strings.PDOFile + " " + data.NewPdoFileId, "PdoFile_Tab_" + data.NewPdoFileId);
            }, Resources.Strings.Message, MessageType.Success, false);
        }
        else {
            Moj.showMessage(Resources.Messages.SuccessTransferProcessesFromPDOFile, function () {
                MojFind("#content_PDOFiles").load(baseUrl + '/PDOFile/PDOFileTransferProcesses');
            }, Resources.Strings.Message, MessageType.Success, true);
        }
    }

};

SaveTransferPDOFileProcess = function (isTransferAll) {
    var formId = MojFind("#btnSaveTransferPDOFileProcesses").closest("form").attr("id");
    var saveUrl = "/PDOFile/SaveTransferProcesses";
    Moj.callActionWithJson(formId, saveUrl, function (data) { onSuccessTransferPDOFileProcesses(data, isTransferAll); });
};

onPDOFileTransferProcessReady = function () {

    MojFind("#IsNewPDOFile").on('click', function (e) {
        var isNewPdoFile = MojControls.CheckBox.isChecked(MojFind("#IsNewPDOFile"))

        MojFind("#ToPDOFile").enable(!isNewPdoFile);
        MojFind("#btnSearchPDOFileTo").enable(!isNewPdoFile);

        if (isNewPdoFile) {
            MojFind("#ToPDOFile").val("");
        }
    });

    MojFind("#FromPDOFile").on('change', function (e) {
        if (!(isNaN(parseInt(this.value)) || Moj.isEmpty(this.value))) {
            onPDOFileIdChange(this.value);
        }
    });

    MojFind("#ToPDOFile").on('change', function (e) {
        var pdoFileId = this.value;
        if (!(isNaN(parseInt(pdoFileId)) || Moj.isEmpty(pdoFileId))) {
            Moj.safeGet('/PDOFile/IsPdoFileExist?pdoFileId=' + pdoFileId, undefined, function (retData) {
                if (retData != null) {
                    if (retData.Error != undefined && retData.Error.length > 0) {
                        Moj.showErrorMessage(retData.Error, null, Resources.Strings.MessageError, true);
                        MojFind("#ToPDOFile").val('');
                    }
                    else if (retData.isPDOFileExist == true) {
                        MojFind("#ToPDOFile").val(pdoFileId);
                    }
                }
            });
        }
    });

    MojFind("#btnCancelPDOFileTransferProcesses").click(function () {
        MojFind("#content_PDOFiles").load(baseUrl + '/PDOFile/PDOFileTransferProcesses');
    });

    MojFind("#btnSaveTransferPDOFileProcesses").click(function () {
        
        var formId = MojFind("#btnSaveTransferPDOFileProcesses").closest("form").attr("id");
        var isValid = MojFind("#" + formId).valid();
        if (Moj.isFalse(isValid))
            return;

        var grid = MojFind("[id^='grdSourceProcessesList']").data("kendoGrid");
        //if (MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid").dataSource.data().length)
        //    MojFind("[id^='grdSelectedProcessesList']").data("kendoGrid").dataSource.data().each(
        //        );
        var isTransferAllProcesses = true;
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem.UnSelected != true)
                isTransferAllProcesses = false;
        });

        if (isTransferAllProcesses == true) {
            if (Moj.isTrue(MojControls.CheckBox.getValueById("IsNewPDOFile")))
                Moj.showErrorMessage(Resources.Messages.ErrTransferAllProcessesToNewPDOFile);
            else {
                var message = String.format(Resources.Messages.WrnTransferAllPDOFileProcesses, MojFind("#FromPDOFile").val(), MojFind("#ToPDOFile").val())
                Moj.confirm(message, function () {
                    SaveTransferPDOFileProcess(true);
                }, null, function () { }, "", true, Resources.Strings.Yes, Resources.Strings.No);
}
        }
        else {
            SaveTransferPDOFileProcess();
        }
    });
}

$(document).ready(function () {
    onPDOFileTransferProcessReady();
});

