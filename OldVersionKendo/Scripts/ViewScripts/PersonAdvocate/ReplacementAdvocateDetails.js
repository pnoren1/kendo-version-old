//$(document).ready(function () {
//    if (MojFind("#AdvocateProfileId").val() == 0) {
//        MojFind("#ReplacedByAdvocate_ReplacementAdvocateForDisplay_AdvocateProfileId").val(null)
//        MojFind("#ReplacesTheAdvocate_ReplacementAdvocateForDisplay_ToAdvocateProfileId").val(null)  
//    }
//});

$(document).ready(function () {
    setAdvocatesInformation = function ()
    {
        if (Moj.isTrue(MojFind("#ReplacementAdvocateForDisplay_IsProcessSupervisionModel").val())) {

                $.ajax({
                    type: "GET",
                    async: false,
                    url: baseUrl + "/PersonAdvocate/GetReplacementAdvocatesInfo",
                    contentType: 'application/json',
                    data: {
                        advocateProfileId: MojFind("#ReplacementAdvocateForDisplay_AdvocateProfileId").val(),
                        replaceAdvocateProfileId: MojFind("#ReplacementAdvocateForDisplay_ToAdvocateProfileId").val()
                    },
                    dataType: "json",
                    success: function (data) {
                        MojFind("#ReplacementAdvocateForDisplay_AdvocateName").val(data.AdvocateName);
                        MojFind("#ReplacementAdvocateForDisplay_AdvocateContactId").val(data.AdvocateContactId);
                        MojFind("#ReplacementAdvocateForDisplay_ReplaceAdvocateName").val(data.ReplaceAdvocateName);
                        MojFind("#ReplacementAdvocateForDisplay_ReplaceAdvocateContactId").val(data.ReplaceAdvocateContactId);

                    }
        })
    }
    }

    MojFind("#ReplacementAdvocateForDisplay_AdvocateProfileId").change(function () {
        var profile = MojFind("#ReplacementAdvocateForDisplay_AdvocateProfileId").val();
        var toProfile = MojFind("#ReplacementAdvocateForDisplay_ToAdvocateProfileId").val();

        if (profile != "" && toProfile != "" && profile == toProfile)
        {
            Moj.showErrorMessage(Resources.Messages.SameAdvocatesInReplacement);
            MojControls.AutoComplete.setValueById(this.id, null);
        }
            

    });


    MojFind("#ReplacementAdvocateForDisplay_ToAdvocateProfileId").change(function () {
        var profile = MojFind("#ReplacementAdvocateForDisplay_AdvocateProfileId").val();
        var toProfile = MojFind("#ReplacementAdvocateForDisplay_ToAdvocateProfileId").val();

        if (profile != "" && toProfile != "" && profile == toProfile)
        {
            Moj.showErrorMessage(Resources.Messages.SameAdvocatesInReplacement);
            MojControls.AutoComplete.setValueById(this.id, null);
        }

    });


});
