getNewProcessNumber = function (processNumberPrefixText, processNumberId, processNumberMonth, processNumberYear) {
    var newProcessNumberForDisplay = processNumberPrefixText == "בחר" ? processNumberId : processNumberPrefixText + processNumberId;
    if (!isNaN(parseInt(processNumberMonth))) {
        newProcessNumberForDisplay += processNumberMonth > 0 && processNumberMonth < 10 ? "-0" + processNumberMonth : "-" + processNumberMonth;
    }
    if(!isNaN(parseInt(processNumberYear))){
        newProcessNumberForDisplay += processNumberYear > 0 && processNumberYear < 10 ? "-0" + processNumberYear : "-" + processNumberYear;
}
   
    return newProcessNumberForDisplay;
};

$(document).ready(function () {
   
    MojFind("#IsProcessNumberUnknown").die('click');

    MojFind("#IsProcessNumberUnknown").live('click', function (e) {

        if ($(this).attr("readonly") != undefined)
            return;

        if (this.checked)
            EnabledProcessNumber(false);
        else
            EnabledProcessNumber(true);
    });

    MojFind("#btnSaveUpdateProcesssNo").die('click');

    MojFind("#btnSaveUpdateProcesssNo").live('click', function (e) {
        var formId = MojFind("#btnSaveUpdateProcesssNo").closest("form").attr("id");
        var isValid = MojFind("#" + formId).valid();
        if (isValid) {
            var newProcessNumberForDisplay;
            var confirm = false;
            if (Moj.isTrue(MojControls.CheckBox.getValueById("IsProcessNumberUnknown"))) {
                if (Moj.isTrue(MojControls.CheckBox.getValueById("IsUnknownProcessNoForDisplay")))
                    confirm = true;
            }
            else {
                newProcessNumberForDisplay = getNewProcessNumber(MojControls.AutoComplete.getTextById("ProcessNumberPrefixId"), MojFind("#ProcessNumberId").val(), MojFind("#ProcessNumberMonth").val(), MojFind("#ProcessNumberYear").val());//MojControls.AutoComplete.getTextById("ProcessNumberPrefixId");
                if (Moj.areEquel(newProcessNumberForDisplay, MojFind("#ProcessNoForDisplay").val()))
                    confirm = true;
            }
            if (confirm)
                Moj.confirm(Resources.Messages.WrnProcessNumbersAreSame, function () { SaveUpdateProcesssNo(formId); }, "", null, Resources.Strings.AnAlert, true);
            else
                SaveUpdateProcesssNo(formId);
        }
    });
    
});
SaveUpdateProcesssNo = function (formId) {
    var saveUrl = "/Process/SaveUpdateProcesssNo";
    Moj.callActionWithJson(formId, saveUrl, function (data) { onSuccessUpdateProcesNumber(data); });
};
