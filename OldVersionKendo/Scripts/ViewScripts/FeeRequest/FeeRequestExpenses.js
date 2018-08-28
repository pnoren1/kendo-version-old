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

    MojFind("#btnHistoryNewFullDeductionExpensePhotoAndOther").click(function () {
        PDO.showAddDetails("grdHistoryHandlingExpensePhotoAndOther",FeeActivityCategory.OtherExpensesHearings,FeeActivityTypeClassification.FullyOffsetBase);
    });
});