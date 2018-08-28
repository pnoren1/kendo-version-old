


MojFind("#" + Released).change(function (data) {
    
    switch (data.target.value) {
        case Released.No:
            MojFind("#" + ImprisonmentReleaseDate).enable(false);
            MojFind("#" + ImprisonmentPeriodReleaseReasonId).enable(false);
            MojFind("#" + ImprisonmentReleaseDate).val(null);
            MojControls.AutoComplete.setValueById(ImprisonmentPeriodReleaseReasonId, null);
            break;
        case Released.Yes:
            MojFind("#" + ImprisonmentPeriodReleaseReasonId).enable(true);
            MojFind("#" + ImprisonmentReleaseDate).enable(true);
            break;
        default:
            MojFind("#" + ImprisonmentReleaseDate).enable(false);
            MojFind("#" + ImprisonmentPeriodReleaseReasonId).enable(false);
            break;
    }
});


SaveImprisonments = function (data) {
    if (data != null && data.ActionResult != null) {
        if (data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });

        } else {
            if (data.ActionResult.IsChange) {
                PDO.afterSaveEntityContentTab(data.EntityInfo);
            }
        }
    }
};

function LoadImprisonmentsView() {
    PDO.loadEntityTab('/PersonApplicant/Imprisonments');
};