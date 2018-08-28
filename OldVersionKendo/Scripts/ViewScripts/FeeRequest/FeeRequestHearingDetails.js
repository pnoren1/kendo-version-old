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
        
        PDO.onRefresh(EntityContentTypeEnum.FeeRequestHearing);
    };

    MojFind("#btnNewPercentageAdditionHearings").click(function () {
        PDO.showAddDetails("grdHandlingHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });

    MojFind("#btnHistoryNewPercentageAdditionHearings").click(function () {
        PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });
   
    MojFind("#btnNewDeductionHearings").click(function () {
       PDO.showAddDetails("grdHandlingHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.Offsetting)
    });

    MojFind("#btnHistoryNewDeductionHearings").click(function () {
        PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.Offsetting)
    });

    MojFind("#btnHistoryNewFullDeductionHearings").click(function () {
        var grid = MojFind("[id^='grdHandlingHistoryHearings']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if(feeActivityTypeClassification==FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.FullyOffsetBase)
            else if(feeActivityTypeClassification==FeeActivityTypeClassification.PercentageAddition)
                PDO.showAddDetails("grdHandlingHistoryHearings", FeeActivityCategory.HearingsInHearings, FeeActivityTypeClassification.FullyOffsetPercentageAddition)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
              
    });



});