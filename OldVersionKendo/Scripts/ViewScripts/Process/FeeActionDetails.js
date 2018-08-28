var FeeActionDetails = {

    displayFieldByActionTypeId: function (actionTypeId) {
        FeeActionDetails.cleanAndHideFieldActionDetails();
        var grid = MojFind("[id^='grdFeeActionList']").data("kendoGrid");
        switch (actionTypeId) {
            case ApplicantFeeActionType.Fee:
                MojFind("#FeeActionFordisplay_ActionToDate").visible(true);
                MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
                MojFind("#FeeActionFordisplay_ActionToDays").visible(true);
                MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", MojControls.Hidden.getValueById("DefaultActionToDays"), true);
                MojFind("#FeeActionFordisplay_FeeTotal").visible(true);
                MojFind("#FeeActionFordisplay_FeeTotal").closest('div').next().removeClass('hide');
                if (grid._data.length == 0)
                    MojFind("#FeeActionFordisplay_ApplicantFeeDecisionId").visible(true);
                FeeActionDetails.GetFeeRate();
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                break;
            case ApplicantFeeActionType.RejectionRequestExemption:
            case ApplicantFeeActionType.SentFeeByRegisteredMail:
                MojFind("#FeeActionFordisplay_ActionToDate").visible(true);
                MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
                MojFind("#FeeActionFordisplay_ActionToDays").visible(true);
                MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", MojControls.Hidden.getValueById("DefaultActionToDays"), true);
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                break;
            case ApplicantFeeActionType.Discount:
                MojFind("#FeeActionFordisplay_ActionToDate").visible(true);
                MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
                MojFind("#FeeActionFordisplay_ActionToDays").visible(true);
                MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", MojControls.Hidden.getValueById("DefaultActionToDays"), true);
                MojFind("#FeeActionFordisplay_FeeTotal").visible(true);
                MojFind("#FeeActionFordisplay_FeeTotal").closest('div').next().removeClass('hide');
                MojControls.Label.setValueById("FeeActionFordisplay_FeeTotal", MojFind("#ChargeDetailsModel_FeeCharge").val());
                MojFind("#FeeActionFordisplay_Total").closest('div').removeClass('hide');
                MojFind("#FeeActionFordisplay_Total").closest('div').prev().removeClass('hide');
                MojFind("#FeeActionFordisplay_Discount").closest('div').removeClass('hide');
                MojFind("#FeeActionFordisplay_Discount").closest('div').prev().removeClass('hide');
                MojFind("#FeeActionFordisplay_Discount").closest('div').next().removeClass('hide-');
                MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").visible(true);
                MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").changeText(Resources.Strings.DiscountReason);
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                break;
            case ApplicantFeeActionType.SubmittedRequestExemption:
            case ApplicantFeeActionType.WaitingForDecision:
            case ApplicantFeeActionType.RequestAdditionalDocuments:
            case ApplicantFeeActionType.ReceiveMailReturns:
                MojFind("#FeeActionFordisplay_ActionToDate").visible(true);
                MojFind("#FeeActionFordisplay_ActionToDays").visible(true);
                MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", MojControls.Hidden.getValueById("DefaultActionToDays"), true);
                MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastTreatmentDate);
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').removeClass('hide-important')
                break;
            case ApplicantFeeActionType.Exemption:
                MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").visible(true);
                MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").changeText(Resources.Strings.ExemptionReason);
                if (grid._data.length == 0)
                    MojFind("#FeeActionFordisplay_ApplicantFeeDecisionId").visible(true);
                FeeActionDetails.GetFeeRate();
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                break;
            case ApplicantFeeActionType.RegisteredMailReturns:
            case ApplicantFeeActionType.Freeze:
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').removeClass('hide-important')
                break;
            case ApplicantFeeActionType.UnFreeze:
                MojFind("#FeeActionFordisplay_ActionToDate").visible(true);
                MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
                MojFind("#FeeActionFordisplay_ActionToDays").visible(true);
                MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", MojControls.Hidden.getValueById("DefaultActionToDays"), true);
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').addClass('hide-important')
                MojFind("#FeeActionFordisplay_MemoRecipientId").closest('div.moj-form-line').removeClass('hide-important')
                break;

        }
    },

    cleanAndHideFieldActionDetails: function () {
        MojControls.DateTimePicker.setValueById("FeeActionFordisplay_ActionDate", Moj.HtmlHelpers._parseDate(new Date()));
        MojControls.DateTimePicker.setValueById("FeeActionFordisplay_ActionToDate", "");
        MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", "", false);
        MojControls.Label.setValueById("FeeActionFordisplay_FeeTotal", "");
        MojControls.Label.setValueById("FeeActionFordisplay_Total", "");
        MojControls.Label.setValueById("FeeActionFordisplay_Discount", 0);
        MojControls.AutoComplete.setValueById("FeeActionFordisplay_ApplicantFeeActionReasonId", "");

        MojFind("#FeeActionFordisplay_ActionToDate").visible(false);
        MojFind("#FeeActionFordisplay_ActionToDays").visible(false);
        MojFind("#FeeActionFordisplay_FeeTotal").visible(false);
        MojFind("#FeeActionFordisplay_FeeTotal").closest('div').next().addClass('hide');
        MojFind("#FeeActionFordisplay_Total").closest('div').addClass('hide');
        MojFind("#FeeActionFordisplay_Total").closest('div').prev().addClass('hide');
        MojFind("#FeeActionFordisplay_Discount").closest('div').addClass('hide');
        MojFind("#FeeActionFordisplay_Discount").closest('div').prev().addClass('hide');
        MojFind("#FeeActionFordisplay_Discount").closest('div').next().addClass('hide');
        MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").visible(false);
        MojFind("#FeeActionFordisplay_ApplicantFeeDecisionId").visible(false);

    },

    GetFeeRate: function () {
        if (MojFind("#FeeActionFordisplay_ApplicantFeeDecisionId").val() != "") {
            var applicantFeeDecisionId = MojControls.AutoComplete.getValueById("FeeActionFordisplay_ApplicantFeeDecisionId");
            Moj.safePost("/Process/GetFeeRate", { applicantFeeDecisionId: applicantFeeDecisionId }, function (data) {
                if (data.FeeRate != undefined) {
                    MojControls.Label.setValueById("FeeActionFordisplay_FeeTotal", data.FeeRate);
                    MojControls.Hidden.setValueById("FeeActionFordisplay_ExternalId", data.ExternalId);
                    //  MojControls.Hidden.setValueById("FeeActionFordisplay_ApplicantFeeDecisionId", data.ApplicantFeeDecisionId);
                }
            });
        }

    },

};

$(document).ready(function () {
    // מסתיר את הטמפלט של השורת עדכון הנוכחית
    //  MojFind(".tr-mode-inline-grid").next().attr("style", "display: none");

    switch (parseInt(MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val())) {
        case ApplicantFeeActionType.SubmittedRequestExemption:
        case ApplicantFeeActionType.WaitingForDecision:
        case ApplicantFeeActionType.RequestAdditionalDocuments:
        case ApplicantFeeActionType.ReceiveMailReturns:
            MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastTreatmentDate);
            break;
        case ApplicantFeeActionType.Fee:
        case ApplicantFeeActionType.RejectionRequestExemption:
        case ApplicantFeeActionType.SentFeeByRegisteredMail:
            MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
            break;
        case ApplicantFeeActionType.Exemption:
            MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").changeText(Resources.Strings.ExemptionReason);
            break;
        case ApplicantFeeActionType.Discount:
            MojFind("#FeeActionFordisplay_ActionToDate").changeText(Resources.Strings.LastPaymentDate);
            MojFind("#FeeActionFordisplay_ApplicantFeeActionReasonId").changeText(Resources.Strings.DiscountReason);
            break;
    }

    MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").change(function () {
        if (MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val() != "") {


            if (MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val() != 2)//פטור
            {
                if (Moj.isTrue(MojFind("#ChargeDetailsModel_IsDebtCollectionCenter").val())) {
                    MojControls.AutoComplete.setValueById("FeeActionFordisplay_ApplicantFeeActionTypeId", "");
                    FeeActionDetails.displayFieldByActionTypeId(0);
                    Moj.showErrorMessage("החיוב הועבר למרכז לגביית קנסות וחובות, ניתן רק לתת פטור");
                    return false;
                }
                //else {
                //    FeeActionDetails.displayFieldByActionTypeId(parseInt(MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val()));

                //}
            }


            Moj.safePost("/Process/CheckRequiredPrevAction", { actionTypeId: MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val() }, function (data) {
                if (data.Error != undefined) {
                    MojControls.AutoComplete.setValueById("FeeActionFordisplay_ApplicantFeeActionTypeId", "");
                    FeeActionDetails.displayFieldByActionTypeId(0);
                    Moj.showErrorMessage(data.Error);
                    return false;
                }
                else {
                    FeeActionDetails.displayFieldByActionTypeId(parseInt(MojFind("#FeeActionFordisplay_ApplicantFeeActionTypeId").val()));

                }
            });

        }
        else
            FeeActionDetails.displayFieldByActionTypeId(0);
    });

    MojFind("#FeeActionFordisplay_ApplicantFeeDecisionId").change(function () {
        FeeActionDetails.GetFeeRate();
    });


    MojFind("#FeeActionFordisplay_ActionDate").change(function () {
        var date1 = MojFind("#FeeActionFordisplay_ActionToDate").val();
        var date2 = MojFind("#FeeActionFordisplay_ActionDate").val();

        if (date1 != "" && date2 != "") {
            if (Moj.isFalse(typeof (date1) == "object")) {
                date1 = date1.split("/");
                date1 = new Date(date1[2], date1[1] - 1, date1[0]);
            }
            if (Moj.isFalse(typeof (date2) == "object")) {
                date2 = date2.split("/");
                date2 = new Date(date2[2], date2[1] - 1, date2[0]);
            }

            var diffDays = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
            MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", parseInt(diffDays), false);
            MojFind("#FeeActionFordisplay_ActionToDays").valid();

        }

    });

    MojFind("#FeeActionFordisplay_ActionToDate").change(function () {
        var date1 = MojFind("#FeeActionFordisplay_ActionToDate").val();
        var date2 = MojFind("#FeeActionFordisplay_ActionDate").val();
        if (date1 != "" && date2 != "") {
            if (Moj.isFalse(typeof (date1) == "object")) {
                date1 = date1.split("/");
                date1 = new Date(date1[2], date1[1] - 1, date1[0]);
            }
            if (Moj.isFalse(typeof (date2) == "object")) {
                date2 = date2.split("/");
                date2 = new Date(date2[2], date2[1] - 1, date2[0]);
            }

            var diffDays = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
            MojControls.TextBox.setValueById("FeeActionFordisplay_ActionToDays", parseInt(diffDays), false);
            MojFind("#FeeActionFordisplay_ActionToDays").valid();
        }

        MojControls.Hidden.setValueById("FeeActionFordisplay_TeenaDetailsChange", true)


    });

    MojFind("#FeeActionFordisplay_ActionToDays").change(function () {

        if (MojFind("#FeeActionFordisplay_ActionToDays").val() != "") {
            var dateAction = MojFind("#FeeActionFordisplay_ActionDate").val();
            if (dateAction != "") {
                if (Moj.isFalse(typeof (dateAction) == "object")) {
                    dateAction = dateAction.split("/");
                    dateAction = new Date(dateAction[2], dateAction[1] - 1, dateAction[0]);
                }

                var newAction = dateAction;
                newAction.setDate(newAction.getDate() + parseInt(MojFind("#FeeActionFordisplay_ActionToDays").val()));
                MojFind("#FeeActionFordisplay_ActionToDate").val(Moj.HtmlHelpers._parseDate(newAction));
                MojFind("#FeeActionFordisplay_ActionToDate").valid();
            }
            MojControls.Hidden.setValueById("FeeActionFordisplay_TeenaDetailsChange", true)

        }

    });

    MojFind("#FeeActionFordisplay_Total").change(function () {
        if (MojFind("#FeeActionFordisplay_Total").val() != "")
            MojControls.Label.setValueById("FeeActionFordisplay_Discount", (parseFloat(MojFind("#FeeActionFordisplay_FeeTotal").val()) - parseFloat(MojFind("#FeeActionFordisplay_Total").val())).toFixed(2))
    });

    MojFind("[id^='FeeActionFordisplay_ManagedRecipient']").unbind('click');
    MojFind("[id^='FeeActionFordisplay_ManagedRecipient']").bind('click', function (e) {

        var isUser = MojControls.RadioButton.getValue(this);
        if (Moj.isTrue(isUser)) {
            MojFind("#FeeActionFordisplay_MemoRecipientId").enable(true);
            MojFind("#FeeActionFordisplay_RoleId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#FeeActionFordisplay_RoleId"));
        }
        else {
            MojFind("#FeeActionFordisplay_RoleId").enable(true);
            MojFind("#FeeActionFordisplay_MemoRecipientId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#FeeActionFordisplay_MemoRecipientId"));
        }

    });
});