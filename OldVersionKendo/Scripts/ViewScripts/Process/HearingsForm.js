
saveHearings = function () {

    Moj.callActionWithJson(MojFind("#btnSaveHearingsForm").closest("form").attr("id"), "/Process/SaveHearings", function (data) {
        if (data.ActionResult.Error != undefined && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });
        }
        else if (data.ActionResult.IsChange) {
            PDO.afterSaveEntityContentTab(data.EntityInfo);
        }
    });
};

MojFind("#btnCancelHearingsForm").click(function () {
    PDO.loadEntityTab('/Process/HearingsForm');
});
