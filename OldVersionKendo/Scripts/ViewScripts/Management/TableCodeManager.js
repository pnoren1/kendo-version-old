function onEditTableClicked() {
    var selectedTableId = MojControls.AutoComplete.getValueById(SelectedTable);
    MojFind("#selectedTabContent").load(baseUrl + "/Management/TableCodeManager?selectedTableId=" + selectedTableId);
}

function doVirtualDelete(e) {
    if ($(e.currentTarget).attr("disabled") != "disabled") {
        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

        if (MojFind("form").find('#ObjectState') != undefined)
            MojFind("form").find('#ObjectState').val("true");
        if (dataItem.State == window.Enums.ObjectState.Added || dataItem.State == window.Enums.ObjectState.AddedString) {
            grid.dataSource.remove(dataItem);
            //fix kendo total not refresh
            grid.dataSource.total = function () { return grid.dataSource.data().length };
        }
        else {
            dataItem.IsActive = false;
            dataItem.State = window.Enums.ObjectState.Modified;
        }
        grid.refresh();
    }

    return false;
}