var ConfirmBack = {

    approveBack: function () {
        
        var reasonBack = MojFind("#ReasonBack").val();
        var type = MojControls.Hidden.getValueById("RequestLineBackType")
        if (reasonBack != "") {

            var window = $("#ConfirmBackFromConfirmation").data("kendoWindow");
            window.close();
            FeeRequestLineDetails.updateReasonBack(reasonBack, type);
        } else {
            Moj.showErrorMessage("חובה להזין סיבה להחזרה",
                function () {
                    return false;
                });
        }

    }
}