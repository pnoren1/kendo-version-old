var FeeDetails = {

    dataBound: function (e) {
        var grid = MojFind("[id^='grdFeeActionList']").data("kendoGrid");
        FeeDetails.expandRows(grid);
        if (grid.element.find("tr:last").prev().find("td [name*='ApplicantFeeActionId']").val() == "0" || grid.element.find("tr:last").prev().find("td [name*='TeenaDetailsChange']").val() == "true")
            MojFind(".moj-add-button").addClass('hide')

        MojFind("[id ^=grdFeeActionList]").find('.k-alt').css('background-color', '#f0f5fa')



    },

    expandRows: function (grid) {
        grid.expandRow(grid.element.find(".k-master-row"));
    },

    displaySelectedTemplate: function () {
        var grid = MojFind("[id^='grdFeeActionList']").data("kendoGrid");
        grid.element.find("tr.k-detail-row").attr("style", "display: table-row");

        MojFind("[id ^=grdFeeActionList]").find('.k-alt').css('background-color', '#f0f5fa')
    },

    checkApplicantFee: function (gridName, url, isAddRowInline, IsEditableGridInline, methodCustomData, setAllModel) {
        Moj.safePost("/Process/CheckRequiredApplicantFee", {}, function (data) {
            if (data.Error != undefined) {
                Moj.showErrorMessage(data.Error);
                return false;
            }
            else
                Moj.HtmlHelpers._showGridAddDetails(gridName, url, isAddRowInline, IsEditableGridInline, methodCustomData, setAllModel);
            return true;
        });
    },

    onSaveFeeDetailsSuccess: function (data) {
        if (data.ActionResult != null) {
            if (data.ActionResult.Error != null && data.ActionResult.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });
            } else {
                if (data.ActionResult.IsChange) {
                    PDO.afterSaveEntityContentTab(data.EntityInfo);
                }
                if (data.ActionResult.Notifications) {
                    Moj.showMessage(data.ActionResult.Notifications, undefined, Resources.Strings.InfoMessage, MessageType.Attention);
                }
            }
        }
    },

    checkIfLastRow: function () {
        var isLastRow = false;
        if (MojFind("#ChargeDetailsModel_ChargeStatus").val() == "1" || MojFind("#ChargeDetailsModel_ChargeStatus").val() == "0")
        {
            var grid = MojFind("[id^='grdFeeActionList']").data("kendoGrid");
            var row = grid.element.find("tr:last").prev();
            if (grid.select().length == 0)
                isLastRow = true;
            else if (row.data().uid == grid.select().data().uid)
                isLastRow = true;
        }
      
        return { isRowLast: isLastRow }

    },

};

$(document).ready(function () {

    MojFind("#btnCancelFeeDetails").click(function () {
        PDO.loadEntityTab('/Process/FeeDetails');
    });
});