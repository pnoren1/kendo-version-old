
saveLocations = function () {
    Moj.callActionWithJson(MojFind("#btnSaveLocations").closest("form").attr("id"), "/PersonApplicant/SaveLocations", function (data) {
        if (data.ActionResult.Error != undefined && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });
        }
        else if(data.ActionResult.IsChange)
        {
           
            var id = data.EntityInfo.EntityId;
            var tabName = "Contact_Tab_";
            PDO.reloadEntityContentTab(EntityContentTypeEnum.Applicant, id, Resources.Strings.Applicant + " " + id, tabName + id, "Locations");
        }
    });
};

MojFind("#btnCancelLocations").click(function () {
    PDO.loadEntityTab('/PersonApplicant/Locations');
});

