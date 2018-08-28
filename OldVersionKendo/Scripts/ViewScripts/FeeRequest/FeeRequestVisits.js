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

    MojFind("#btnNewPercentageAdditionVisits").click(function () {
        PDO.showAddDetails("grdHandlingVisits", FeeActivityCategory.VisitsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });

    MojFind("#btnHistoryNewPercentageAdditionVisits").click(function () {
        PDO.showAddDetails("grdHistoryHandlingVisits", FeeActivityCategory.VisitsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });

    MojFind("#btnHistoryNewFullDeductionVisits").click(function () {
        var grid = MojFind("[id^='grdHistoryHandlingVisits']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHistoryHandlingVisits", FeeActivityCategory.VisitsInHearings, FeeActivityTypeClassification.FullyOffsetBase)
            else if (feeActivityTypeClassification == FeeActivityTypeClassification.PercentageAddition)
                PDO.showAddDetails("grdHistoryHandlingVisits", FeeActivityCategory.VisitsInHearings, FeeActivityTypeClassification.FullyOffsetPercentageAddition)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    MojFind("#btnNewPercentageAdditionTravelsToVisit").click(function () {
        PDO.showAddDetails("grdHandlingTravelsToVisit", FeeActivityCategory.TravelsToVisitsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });

    MojFind("#btnHistoryNewPercentageAdditionTravelsToVisit").click(function () {
        PDO.showAddDetails("grdHistoryHandlingTravelsToVisit", FeeActivityCategory.TravelsToVisitsInHearings, FeeActivityTypeClassification.PercentageAddition)
    });

    MojFind("#btnHistoryNewFullDeductionTravelsToVisit").click(function () {
        var grid = MojFind("[id^='grdHistoryHandlingTravelsToVisit']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var feeActivityTypeClassification = dataItem.FeeActivityTypeClassificationId;
            if (feeActivityTypeClassification == FeeActivityTypeClassification.Base)
                PDO.showAddDetails("grdHistoryHandlingTravelsToVisit", FeeActivityCategory.TravelsToVisitsInHearings, FeeActivityTypeClassification.FullyOffsetBase)
            else if (feeActivityTypeClassification == FeeActivityTypeClassification.PercentageAddition)
                PDO.showAddDetails("grdHistoryHandlingTravelsToVisit", FeeActivityCategory.TravelsToVisitsInHearings, FeeActivityTypeClassification.FullyOffsetPercentageAddition)
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });


});