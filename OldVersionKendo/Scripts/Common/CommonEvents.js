$(document).ready(init).on('pjax:end',init);

function init()
{
    Moj.addObjectState();
    $.validator.setDefaults({
        ignore: []
    });
    clearTimeout(Moj.HtmlHelpers._watchTimerHandle);
    Moj.HtmlHelpers._ActivateWatch();
    Moj.HtmlHelpers._addPagerHeader();
    Moj.HtmlHelpers._addPagerHeaderForListView();
    Moj.HtmlHelpers._pagerTabindexSetZero();
    Moj.HtmlHelpers._InitEditor();
    $("form input[readonly='readonly']").attr("tabindex", -1);
}

var previewRules = [];
$("input[type=submit], div[data-role=submit]").click(function () {
    var inputElement = $(this);
    handleRules(inputElement);
});

function handleRules(inputElement) {
    restorePreviewRules();
    //  $("input").qtip('destroy');
    var formElement = $(inputElement.parents("form")[0]);

    var validationGroups = inputElement.attr('data_val_ignorevalidationgroup');
    var acceptValidationGroups = inputElement.attr('data_val_acceptvalidationgroup');
    if (validationGroups != undefined) {
        var validationGroupsArr = validationGroups.split(';');
        $.each(validationGroupsArr, function () {
            //Get all fields those validation should be ignored when this submit element is clicked
            //Remove their validation rules
            $('*[data_val_validationgroup*=";' + this + ';"]').each(function () {
                var rules = $(this).rules("remove");
                $(this).data("rulesBackup", rules);
                var fieldValidation = $(formElement).find("[data-valmsg-for='" + $(this).attr("name") + "']");
                fieldValidation.empty();
                fieldValidation.addClass('field-validation-valid');
                fieldValidation.removeClass('field-validation-error');
                $(this).addClass('input-validation-valid');
                $(this).removeClass('input-validation-error');
                previewRules.push($(this));
            });
        });
    }
    else if (acceptValidationGroups != undefined) {
        var acceptValidationGroupsArr = acceptValidationGroups.split(';');
        var strGroups = "input";
        var textareastrGroups = "textarea";
        $.each(acceptValidationGroupsArr, function () {
            strGroups = strGroups + ':not([data_val_validationgroup*=";' + this + ';"])';
            textareastrGroups = textareastrGroups + ':not([data_val_validationgroup*=";' + this + ';"])';
        });
        //Get all fields those validation should be accepts when this submit element is clicked
        //Remove their validation rules
        $(formElement).find(strGroups + "," + textareastrGroups).each(function () {
            var rules = $(this).rules("remove");
            $(this).data("rulesBackup", rules);
            var fieldValidation = $(formElement).find("[data-valmsg-for='" + $(this).attr("name") + "']");
            fieldValidation.empty();
            fieldValidation.addClass('field-validation-valid');
            fieldValidation.removeClass('field-validation-error');
            $(this).addClass('input-validation-valid');
            $(this).removeClass('input-validation-error');
            previewRules.push($(this));
        });
    }
    //Restore rules after submit
    if (previewRules.length > 0) {
        formElement.ajaxSuccess(function () {
            restorePreviewRules();
        });
        formElement.one('submit', function () {
            if (!$(this).valid()) {
                restorePreviewRules();
            }
        });
    }
}

function restorePreviewRules() {
    if (previewRules.length > 0) {
        for (var i in previewRules) {
            if (typeof (previewRules[i].attr("data-val")) != "undefined")
                previewRules[i].rules("add", previewRules[i].data("rulesBackup"));
        }
    }
    previewRules = [];
};
   