var AdvocateClassification = {

    SaveAdvocateClassification: function (data) {
        if (data != null && data.ActionResult != null) {
            if (data.ActionResult.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });
            } else {
                if (data.ActionResult.IsChange) {
                    var id = data.EntityInfo.EntityId;
                    PDO.reloadEntityContentTab(EntityContentTypeEnum.Advocate, id, Resources.Strings.Advocate + " " + id, "Advocate_Tab_" + id, "AdvocateClassification");
                }
            }
        }
    },

    ContactToDistrict: function () {
        Moj.safePost("/PersonAdvocate/CheckAdvocateFeature", { AdvocateFeatureId: MojFind("#AdvocateFeatureId").val() }, function (data) {
            if (data.IsAllowed == false) {
                // MojControls.AutoComplete.setValueById("AdvocateFeatureId", 0);
                Moj.showErrorMessage(data.Message);
            }
            else {
                MojFind("#ClassificationDetails").show();
                MojFind("#btnContactToDistrict").visible(false);
                MojFind("#btnActionAdvocateClassification").visible(true);
                MojFind("#btnCancelAdvocateClassification").visible(true);
            }
        });
    },
};

$(document).ready(function () {
    
    if (MojFind("#AdvocateProfileId").val() == 0) {
        MojFind("#ClassificationDetails").hide();
        MojFind("#btnActionAdvocateClassification").visible(false);
        MojFind("#btnCancelAdvocateClassification").visible(false);

        MojFind("#btnContactToDistrict").visible(true);
    }

    MojFind("#AdvocateStatusId").change(function () {
        var advocateStatusId = MojFind("#AdvocateStatusId").val();
        var advocateContactId = MojFind("#AdvocateContactId").val();
        if (advocateStatusId != "" && advocateStatusId != MojFind("#PrevAdvocateStatusId").val()) {
            if (advocateStatusId == AdvocateStatusType.Active) {
                Moj.safeGet("/PersonAdvocate/CheckIfCanChangeToActive", { advcateContactId: advocateContactId }, function (data) {
                    if (data.Error != undefined) {
                        Moj.showErrorMessage(data.Error);
                        MojControls.AutoComplete.setValueById("AdvocateStatusId", MojFind("#PrevAdvocateStatusId").val());
                    }
                });
                MojFind("#IsCloseAdvocate").val(false);
            }
            else {
                $.ajax({
                    url: baseUrl + '/PersonAdvocate/CheckIsFinishedWork',
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    data: JSON.stringify({ advocateStatusId: advocateStatusId }),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        
                        if (response.IsError == true) {
                            MojControls.AutoComplete.setValueById("AdvocateStatusId", MojFind("#PrevAdvocateStatusId").val())
                            Moj.showErrorMessage(response.Message);
                        }
                        else if (response.Message != "") {
                            Moj.confirm(response.Message, function () { MojFind("#IsCloseAdvocate").val(true); }, null, function () {
                                MojControls.AutoComplete.setValueById("AdvocateStatusId", MojFind("#PrevAdvocateStatusId").val())
                            });
                        }
                        else
                        {
                            MojFind("#IsCloseAdvocate").val(false);
                        }
                                            }
                })
            }
        }
    });


    MojFind("#btnCancelAdvocateClassification").click(function () {
        PDO.loadEntityTab('/PersonAdvocate/AdvocateClassification');
    });


    replacementsInProcessHearings = function() {
        Moj.website.openPopupWindow("replacementsInProcessHearings", null, Resources.Strings.ReplacementsInProcessHearings, 1110, 650, false, false, false,
            baseUrl + "/PersonAdvocate/ReplacementsInProcessHearings", undefined);
    }

});