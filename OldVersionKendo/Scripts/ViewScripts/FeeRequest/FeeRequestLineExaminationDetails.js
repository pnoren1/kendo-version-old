$(document).ready(function () {
    MojFind("#ExaminationDetails_FeeRequestLineDecisionTypeId").change(function () {
        var decisionTypeId = MojControls.AutoComplete.getValueById("ExaminationDetails_FeeRequestLineDecisionTypeId")
        if (decisionTypeId == FeeRequestLineDecisionType.Approval || decisionTypeId == FeeRequestLineDecisionType.Rejection) {
            Moj.safeGet("/FeeRequest/GetDecisionReasons", { decisionTypeId: decisionTypeId }, function (data) {
                MojControls.AutoComplete.setDataSource("ExaminationDetails_FeeRequestLineDecisionReasonId", data.DecisionReasons);
                MojControls.AutoComplete.clearSelectionById("ExaminationDetails_FeeRequestLineDecisionReasonId")
                MojFind("#ExaminationDetails_FeeRequestLineDecisionReasonId").visible(true);
                MojFind("#ExaminationDetails_DecisionAdvocateNotice").visible(true);
                MojFind("#ExaminationDetails_FeeRequestLineStatusSupervisorId").visible(false);
                MojControls.AutoComplete.clearSelectionById("ExaminationDetails_FeeRequestLineStatusSupervisorId")
            });
        }
        else if (decisionTypeId == FeeRequestLineDecisionType.TransferSupervisor) {
            MojFind("#ExaminationDetails_FeeRequestLineDecisionReasonId").visible(false);
            MojControls.AutoComplete.clearSelectionById("ExaminationDetails_FeeRequestLineDecisionReasonId")
            MojFind("#ExaminationDetails_DecisionAdvocateNotice").visible(false);
            MojControls.TextBox.setValueById("ExaminationDetails_DecisionAdvocateNotice", "");
            MojFind("#ExaminationDetails_FeeRequestLineStatusSupervisorId").visible(true);
        }
        else {
            MojFind("#ExaminationDetails_FeeRequestLineDecisionReasonId").visible(false);
            MojFind("#ExaminationDetails_FeeRequestLineStatusSupervisorId").visible(false);
            MojFind("#ExaminationDetails_DecisionAdvocateNotice").visible(false);
            MojControls.TextBox.setValueById("ExaminationDetails_DecisionAdvocateNotice", "");
            MojControls.AutoComplete.clearSelectionById("ExaminationDetails_FeeRequestLineStatusSupervisorId")
            MojControls.AutoComplete.clearSelectionById("ExaminationDetails_FeeRequestLineDecisionReasonId")
        }
      

    });
});