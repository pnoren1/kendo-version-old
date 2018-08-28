function onFeeRequestLineStatuesHistoryViewReady() {
    MojFind("tr").die('click');
    MojFind("tr").live('click', function (e) {
        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var dataItem = grid.dataItem(grid.select());
        if (dataItem != null && Moj.isTrue(dataItem.IsStatusNote)) {
            MojFind("#Notes").val(dataItem.StatusNote);
        } else {
            MojFind("#Notes").val("");
        }
    });
};