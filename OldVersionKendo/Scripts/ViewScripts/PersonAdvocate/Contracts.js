var Contracts = {

    deleteContract: function (e) {
        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var rowSelected  = grid.dataItem($(e.currentTarget).closest("tr"));
        if (rowSelected.Used != 0) {
            Moj.showErrorMessage(Resources.Messages.CantDeleteContract)
            return false;
        }
        else if (rowSelected.AmountFromPrevious != 0)
        {
            Moj.showErrorMessage("אין אפשרות למחוק חוזה אשר הועברו אליו יתרות מחוזה קודם")
            return false;
        }
        else {
            var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
            var url = e.currentTarget.pathname + "/" + grid.dataItem($(e.currentTarget).closest("tr")).id;
            Moj.confirm(Resources.Strings.ConfirmDelete, function () {
                $.post(url, {}, function (data) {
                  if (data.ActionResult != undefined && data.ActionResult.Errors != undefined && data.ActionResult.Errors.length > 0) {
                        Moj.showErrorMessage(data.Errors);
                    } else if (data.EntityInfo != undefined) {
                        PDO.afterSaveEntityContentTab(data.EntityInfo);

                    }
                });
            });
            return false;
        }
    },

    checkAdvocateStatus: function (url) {
        var advocateStatus = MojFind("#AdvocateStatus").val();
        if (advocateStatus != AdvocateStatusType.Active)
        {
            Moj.showErrorMessage(Resources.Messages.CantAddContract)
            return false;
        }
        else
            Moj.HtmlHelpers._showAddDetails(url);
        return true;
        
    },
};