$(document).ready(function () {
    MojFind("#ApprovalDetails_FeeRequestLineDecisionTypeId").change(function () {
        var decisionTypeId = MojControls.AutoComplete.getValueById("ApprovalDetails_FeeRequestLineDecisionTypeId")
        if (decisionTypeId == FeeRequestLineDecisionType.Approval || decisionTypeId == FeeRequestLineDecisionType.Rejection) {
            Moj.safeGet("/FeeRequest/GetDecisionReasons", { decisionTypeId: decisionTypeId }, function (data) {
                MojControls.AutoComplete.setDataSource("ApprovalDetails_FeeRequestLineDecisionReasonId", data.DecisionReasons);
                MojControls.AutoComplete.clearSelectionById("ApprovalDetails_FeeRequestLineDecisionReasonId")
                MojFind("#ApprovalDetails_FeeRequestLineDecisionReasonId").visible(true);
                MojFind("#ApprovalDetails_DecisionAdvocateNotice").visible(true);

            });
        }
        else {
            MojFind("#ApprovalDetails_FeeRequestLineDecisionReasonId").visible(false);
            MojFind("#ApprovalDetails_DecisionAdvocateNotice").visible(false);
            MojControls.TextBox.setValueById("ApprovalDetails_DecisionAdvocateNotice", "");
            MojControls.AutoComplete.clearSelectionById("ApprovalDetails_FeeRequestLineDecisionReasonId")
        }
        

    });
});