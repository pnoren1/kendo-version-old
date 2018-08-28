function captchaSaveSuccess(data) {
    if (data.isValid == true) {
        var window = $("#frmCaptcha").data("kendoWindow");
        window.close();
        if ($("#currentJSFunction").val() != undefined) {
            eval($("#currentJSFunction").val());
            $("#currentJSFunction").val("");
        }
    } else {
        Moj.showErrorMessage(data.Errors, function () {
            Moj.HtmlHelpers._onCaptchaRefresh("CaptchaValue");
            $("#CaptchaValue").val("");
        });
    }
}

$("#frmCaptcha").keypress(function (e) {
    if (((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))) {
        $(this).blur();
        $('#btnActionCaptcha').focus().click();
    }
});
