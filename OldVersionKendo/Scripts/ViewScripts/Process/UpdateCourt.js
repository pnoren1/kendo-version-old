$(document).ready(function () {

    MojFind("#btnSaveUpdateCourt").die('click');

    MojFind("#btnSaveUpdateCourt").live('click', function (e) {
        var formId = MojFind("#btnSaveUpdateCourt").closest("form").attr("id");
        var isValid = MojFind("#" + formId).valid();
      

        var isExistRetainerNomination = MojFind("#IsExistRetainerNomination").val();
        var isCourtTypeIdAffectRetainer = MojFind("#IsCourtTypeIdAffectRetainer").val();
        var isCriminalCase = MojFind("#IsCriminalCase").val();
        if (isValid) {
            var newProcessCourt = MojControls.AutoComplete.getTextById("NewCourtId");

            if (Moj.areEquel(newProcessCourt, MojFind("#CourtName").val())) {
                Moj.confirm(Resources.Messages.WrnProcessCourtsAreSame, function () {
                    SaveUpdateCourt(formId);
                }, "", null, Resources.Strings.AnAlert, true);
            }

                //אם משתנה הבית משפט משלום למחוזי 
                //אם קיימים מינויים רינטינר יש להתריע

            else if (Moj.isTrue(isExistRetainerNomination) && Moj.isTrue(isCourtTypeIdAffectRetainer) && Moj.isTrue(isCriminalCase)) {
              
                var newCourtId = MojControls.AutoComplete.getValueById("NewCourtId");
                Moj.safeGet("/Process/GetCourtTypeIdByCourtId", { courtId: newCourtId }, function (courtTypeId) {
                    if (courtTypeId != 1 && courtTypeId != 5 && courtTypeId != 6) {
                        Moj.confirm(Resources.Messages.WrnChagneCourtAffectRetainer, function () {
                            SaveUpdateCourt(formId);
                        }, "", null, Resources.Strings.AnAlert, true);
                    }
                    else
                        SaveUpdateCourt(formId);
                });
            }
            else
                SaveUpdateCourt(formId);
        }
    });
});
SaveUpdateCourt = function (formId) {
    var saveUrl = "/Process/SaveUpdateCourt";
    Moj.callActionWithJson(formId, saveUrl, function (data) { onSuccessUpdateCourt(data); });
};