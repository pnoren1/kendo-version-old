$(document).ready(function () {

    MojFind("#btnFeeRequestFinalApproval").click(function () {
        var url = "FeeRequest/FeeRequestFinalApproval";
        Moj.confirm(Resources.Strings.FeeRequestFinalApprovalAlert, function () {
            $.post(url, function (data) {
                
                if (data.Errors != undefined) {
                    Moj.showErrorMessage(data.Errors);
                } else if (data.Messages != undefined) {
                    Moj.showMessage(data.Messages, onRefresh, Resources.Strings.Message, MessageType.Success);
                }
            });
        });
        return false;
    });

    onRefresh = function () {
        
        PDO.onRefresh(EntityContentTypeEnum.FeeRequestShiftsCalls);
    };

    MojFind("#btnNewDeductionShifts").click(function () {
        PDO.showAddDetails("grdHandlingShifts", FeeActivityCategory.ShiftsInShiftAndCalls, FeeActivityTypeClassification.Offsetting)
    });

    MojFind("#btnHistoryNewDeductionShifts").click(function () {
        PDO.showAddDetails("grdHistoryHandlingShifts", FeeActivityCategory.ShiftsInShiftAndCalls, FeeActivityTypeClassification.Offsetting)
    });

    MojFind("#btnHistoryNewFullDeductionShifts").click(function () {
        
        var grid = MojFind("[id^='grdHistoryHandlingShifts']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHistoryHandlingShifts", FeeActivityCategory.ShiftsInShiftAndCalls, FeeActivityTypeClassification.FullyOffsetBase)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    MojFind("#btnHistoryNewFullDeductionTravelExpenses").click(function () {
        var grid = MojFind("[id^='grdHandlingHistoryTravelExpenses']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHandlingHistoryTravelExpenses", FeeActivityCategory.TravelExpensesInShiftAndCalls, FeeActivityTypeClassification.FullyOffsetBase)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });
    
});