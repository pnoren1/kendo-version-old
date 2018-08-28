$(document).ready(function () {

    GetSumByApplicantDecisionId = function (ApplicantDecisionId)
    {
       if ((ApplicantDecisionId != "") && (ApplicantDecisionId != 0))
        {
             var DecisionSums = MojFind("#GeneralDetailsModel_FeePanelModel_DecisionsSums").val();
             var DecisionSumsInJSONFormat = jQuery.parseJSON(DecisionSums);
             var SelectedObject = DecisionSumsInJSONFormat.filter(function (item) { return item.Key === parseInt(ApplicantDecisionId) });
             var SumOfApplicantDecisionId = SelectedObject[0].Value;
             MojControls.Label.setValueById("GeneralDetailsModel_FeePanelModel_Sum", SumOfApplicantDecisionId);
             MojFind("#GeneralDetailsModel_FeePanelModel_Currency").visible(true);
       }
        else
       {
           MojControls.Label.setValueById("GeneralDetailsModel_FeePanelModel_Sum", "");
           MojFind("#GeneralDetailsModel_FeePanelModel_Currency").visible(false);
       }
    };




    AddDaysToDate = function (Days, DeadLineDate) {
        if (Days.val() != "") {
            var newAction = new Date();
            newAction.setDate(newAction.getDate() + parseInt(Days.val()));
            DeadLineDate.val(Moj.HtmlHelpers._parseDate(newAction));
            DeadLineDate.valid();
        }
    };

    ChangeDaysByDate = function (DeadlineDate, Days) {
        var NewDate = DeadlineDate.val();
        var CurrentDate = new Date();
        if (NewDate != "" && CurrentDate != "") {
            if (Moj.isFalse(typeof (date1) == "object")) {
                NewDate = NewDate.split("/");
                NewDate = new Date(NewDate[2], NewDate[1] - 1, NewDate[0]);
            }
            if (Moj.isFalse(typeof (CurrentDate) == "object")) {
                CurrentDate = date2.split("/");
                CurrentDate = new Date(CurrentDate[2], CurrentDate[1] - 1, CurrentDate[0]);
            }

            CurrentDate.setHours(00);
            CurrentDate.setMinutes(00);
            CurrentDate.setSeconds(00);

            var diffDays = Math.round((NewDate.getTime() - CurrentDate.getTime()) / (1000 * 60 * 60 * 24));
            MojControls.TextBox.setValueById(Days, parseInt(diffDays), false);
            MojFind("#" + Days).attr("title", parseInt(diffDays));
            MojFind(Days).valid();

        }

    };

 CheckApplicantFeeActionTypeId = function () {
        var Action = MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeActionTypeId").val();
        switch (parseInt(Action)) {
            case ApplicantFeeActionType.Fee:
                {
                    ClearFields();
                    MojFind("#FeeFields").show();
                    MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                    if (MojFind("#GeneralDetailsModel_FeePanelModel_ActionToDays").val() == "")
                    {
                        var Days = MojFind("#GeneralDetailsModel_FeePanelModel_DaysOfPayemnt");
                        AddDaysToDate(Days, MojFind("#FeeDeadlineDate"));
                        MojFind("#FeeDays").val(Days.val()).attr("title", Days.val());
                    }
                    else
                    {
                        var Days = MojFind("#GeneralDetailsModel_FeePanelModel_ActionToDays");
                        AddDaysToDate(Days, MojFind("#FeeDeadlineDate"));
                        MojFind("#FeeDays").val(Days.val()).attr("title", Days.val());
                    }

                    break;
                }
            case ApplicantFeeActionType.Exemption:
                {
                    ClearFields();
                    MojFind("#ExemptionFields").show();
                    MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                    break;
                }
            case ApplicantFeeActionType.WaitingForDecision:
                {
                    ClearFields();
                    MojFind("#PendingDecisionFields").show();
                    MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId").closest('div.moj-form-line').removeClass('hide-important')

                    if (MojFind("#GeneralDetailsModel_FeePanelModel_ActionToDays").val() == "") {
                        var Days = MojFind("#GeneralDetailsModel_FeePanelModel_DaysOfTreatment");
                        AddDaysToDate(Days, MojFind("#PendingDecisionDeadlineDate"));
                        MojFind("#PendingDecisionDays").val(Days.val());
                    }
                    else {
                        var Days = MojFind("#GeneralDetailsModel_FeePanelModel_ActionToDays");
                        AddDaysToDate(Days, MojFind("#PendingDecisionDeadlineDate"));
                        MojFind("#PendingDecisionDays").val(Days.val());
                    }

                    break;
                }

        }
    };

    ClearFields = function () {
        MojFind("#FeeFields").hide();
        MojFind("#ExemptionFields").hide();
        MojFind("#PendingDecisionFields").hide();
    }

    CheckApplicantFeeActionTypeId();

    MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeActionTypeId").change(function (e) {
        CheckApplicantFeeActionTypeId();
        var Action = MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeActionTypeId").val();
        if (Action == "")
            ClearFields();

    });

    MojFind("#FeeDays").focusout(function (e) {
        AddDaysToDate(MojFind("#FeeDays"), MojFind("#FeeDeadlineDate"));
    });

    MojFind("#PendingDecisionDays").focusout(function (e) {
        AddDaysToDate(MojFind("#PendingDecisionDays"), MojFind("#PendingDecisionDeadlineDate"));
    });

    MojFind("#FeeDeadlineDate").change(function () {
        ChangeDaysByDate(MojFind("#FeeDeadlineDate"), "FeeDays");
    });

    MojFind("#PendingDecisionDeadlineDate").change(function () {
        ChangeDaysByDate(MojFind("#PendingDecisionDeadlineDate"), "PendingDecisionDays");
    });

    MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeDecisionId").change(function () {
        GetSumByApplicantDecisionId(MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeDecisionId").val());
    });

    GetSumByApplicantDecisionId(MojFind("#GeneralDetailsModel_FeePanelModel_ApplicantFeeDecisionId").val());

    MojFind("[id^='GeneralDetailsModel_FeePanelModel_ManagedRecipient']").unbind('click');
    MojFind("[id^='GeneralDetailsModel_FeePanelModel_ManagedRecipient']").bind('click', function (e) {
        
        var isUser = MojControls.RadioButton.getValue(this);
        if (Moj.isTrue(isUser)) {
            MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId").enable(true);
            MojFind("#GeneralDetailsModel_FeePanelModel_RoleId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#GeneralDetailsModel_FeePanelModel_RoleId"));
        }
        else {
            MojFind("#GeneralDetailsModel_FeePanelModel_RoleId").enable(true);
            MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#GeneralDetailsModel_FeePanelModel_MemoRecipientId"));
        }

    });
    
});

