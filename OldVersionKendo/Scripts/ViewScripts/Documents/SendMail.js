var SendMail =
    {
        OnSendClick: function (e) {
            MojFind("[id^='frm']").validate();
            Moj.HtmlHelpers._onSubmitButtonClicked(e, '/Documents/SendMailToRecipients', 'SendMail.onSuccess');
            if (MojFind("[id^='frm']").valid()) {
                if (MojFind("#SendMailBody").data("kendoEditor").value().replace(/(<([^>]+)>)/ig, "") == "") {
                    Moj.confirm(Resources.Messages.MissingBodyAlert, SendMail.SendMailToRecipients);
                }
                else {
                    SendMail.SendMailToRecipients();
                }
            }
        },

        SendMailToRecipients: function () {
            MojFind("[id^='frm']").submit();
        },

        onSuccess: function (data) {
            if (Moj.showErrorMessage(data.Errors) == true) {
                $("#sendMail").data("kendoWindow").close();
            }
        }
    }