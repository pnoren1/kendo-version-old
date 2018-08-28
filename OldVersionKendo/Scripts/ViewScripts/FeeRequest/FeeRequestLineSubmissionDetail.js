var FeeRequestLineSubmissionDetail = {
    setAllEnable: function (value) {

    },
}

$(document).ready(function () {
    MojFind("#SubmissionDetails_RecivedDate").unbind('blur').blur(function () {
        if (!Moj.isTrue(MojFind("#SubmissionDetails_RecivedDate").is('[readonly]'))) {
            if (Moj.isTrue(MojFind("#SubmissionDetails_RecivedDate").valid())) {
                var feeRequestTypeIdFromHeader = MojFind("#FeeRequestTypeId").val();
                var recivedDateFromSubmissionDetails = MojFind("#SubmissionDetails_RecivedDate").val();

                if (recivedDateFromSubmissionDetails != "") {
                    if (feeRequestTypeIdFromHeader == FeeRequestTypeEnum.ShiftsAndOnCalls) {
                        var receivedDateFromHeader = MojFind("#ReceivedDate").val();

                        if (receivedDateFromHeader != recivedDateFromSubmissionDetails) {

                            Moj.confirm(Resources.Messages.WrnDifferentsReceivedDates, function () {
                                return true;
                            }, null, function () {
                                MojFind("#SubmissionDetails_RecivedDate").val(MojFind("#ReceivedDate").val());
                            }, Resources.Strings.Message)
                        }
                        else
                            return true;
                    }
                    else
                        return true;
                }
            }
            else
                MojFind("#SubmissionDetails_RecivedDate").val(null);
        }

    });

    MojFind("#SubmissionDetails_IsNewSubmissionPart").change(function () {

        MojControls.Hidden.setValue(MojFind("[id^=SubmissionDetails_Elements].isRequiredPart"), MojControls.CheckBox.getValueById("SubmissionDetails_IsNewSubmissionPart"))
        MojFind("[id^=SubmissionDetails_Elements].isRequiredPart").change()

        MojFind(".submissionEnable").enable(MojControls.CheckBox.getValueById("SubmissionDetails_IsNewSubmissionPart"));
        MojFind("#SubmissionDetails_Note").val("")
        MojControls.DateTimePicker.setValueById("SubmissionDetails_RecivedDate", null)
        MojControls.CheckBox.setValueById("SubmissionDetails_IsAdvocateObjection", false)
    });

});





