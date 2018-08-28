$(document).ready(function () {

    MojFind("#btnNewPercentageAdditionCalls").click(function () {

        PDO.showAddDetails("grdHandlingCalls",
            FeeActivityCategory.CallsInShiftAndCalls,
            FeeActivityTypeClassification.PercentageAddition);

    });

    MojFind("#btnHistoryNewPercentageAdditionCalls").click(function () {

        PDO.showAddDetails("grdHistoryHandlingCalls", FeeActivityCategory.CallsInShiftAndCalls, FeeActivityTypeClassification.PercentageAddition)

    });

    MojFind("#btnHistoryNewFullDeductionCalls").click(function () {
        var grid = MojFind("[id^='grdHistoryHandlingCalls']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHistoryHandlingCalls", FeeActivityCategory.CallsInShiftAndCalls, FeeActivityTypeClassification.FullyOffsetBase)
            else if (feeActivityTypeClassification == FeeActivityTypeClassification.PercentageAddition)
                PDO.showAddDetails("grdHistoryHandlingCalls", FeeActivityCategory.CallsInShiftAndCalls, FeeActivityTypeClassification.FullyOffsetPercentageAddition)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });


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


    
});