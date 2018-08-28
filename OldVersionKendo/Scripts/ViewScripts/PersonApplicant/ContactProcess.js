contactProcess = function () {
    var grid = MojFind("[id*='grdApplicantProcessesList']").data("kendoGrid");
    var window = $("#ContactToProcess").data("kendoWindow");
    var selectedItem = undefined;
    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        //if (dataItem != undefined && Moj.isTrue(dataItem.IsChecked)) {
        if ($(this).find("#rdbIsChecked").attr('checked') == "checked") {
            selectedItem = dataItem;
        }
    });

    if (selectedItem != undefined) {
        // var selectItem = grid.dataItem(grid.select());
        var processId = selectedItem.ProcessId;
        var processNoForDisplay = selectedItem.ProcessNoForDisplay;
    }

    window.close();

    if (processId != undefined) {
        LocationDetails.contactProcessToLocation(processId, processNoForDisplay);
    }



}
