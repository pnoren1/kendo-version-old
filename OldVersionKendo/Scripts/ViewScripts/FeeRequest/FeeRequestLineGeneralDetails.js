$(document).ready(function () {
    MojFind("#btnStatusHistory").click(function () {
        var feeRequestLineId = MojFind("#GeneralDetails_FeeRequestLineId").val();
        if (feeRequestLineId != "") {
            Moj.safePost("/FeeRequest/FeeRequestLineStatuesHistoryView",
                { feeRequestLineId: feeRequestLineId },
                function (content) {
                    Moj.openPopupWindow("OpenFeeRequestLineStatuesHistoryView", content, "הסטוריית טיפול בשורת שכט", 1250, 500, false, false, false);
                });
        }

    });
});