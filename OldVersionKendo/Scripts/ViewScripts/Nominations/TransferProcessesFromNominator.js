onSaveTransferProcessesFromNominatorSuccess = function (data) {
    if (data.Error != null && data.Error.length > 0) {
        Moj.showErrorMessage(data.Error);
    }
    else if (data.IsChange != null && Moj.isTrue(data.IsChange)) {
        Moj.showMessage(Resources.Messages.SuccessTransferProcessesFromNominator, function () {
            MojFind("#content_Nominations").load(baseUrl + '/Nominations/TransferProcessesFromNominator');
        }, Resources.Strings.Message, MessageType.Success, true)
        
    }
};

$(document).ready(function () {

    MojFind("#UserIdFrom").change(function () {
        var userIdFrom = MojControls.AutoComplete.getValueById("UserIdFrom");
        if (userIdFrom != "") {
            var grid = MojControls.Grid.getKendoGridById("grdSourceProcesses");
            Moj.safeGet('/Nominations/GetProcessesByUserId?userId=' + userIdFrom, undefined, function (data) {
                if (data.Data != null) {
                    grid.dataSource.data(data.Data);
                    grid.refresh();
                }
                else {
                    grid.dataSource.data([]);
                }
            });
        }
    });

    MojFind("#btnCancelTransferProcessesFromNominator").click(function () {
        MojFind("#content_Nominations").load(baseUrl + '/Nominations/TransferProcessesFromNominator');
    });


});