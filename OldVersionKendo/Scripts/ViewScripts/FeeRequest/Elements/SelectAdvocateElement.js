
function SelectAdvocateElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },



$(document).ready(function () {



  //  MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").enable(false);
        if (MojFind("#" +self.getFieldPrefix() + "ReplacementWarning").val() != "")
        {
          
            MojControls.Hidden.setValueById(self.getFieldPrefix().substring(0, self.getFieldPrefix().indexOf('_')) + "_IsReplacementAuthorized", false);
        }

    MojFind("#" + self.getFieldPrefix() + "IsReplacementAdvocate").change(function () {
        
        var isReplacementAdvocate = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "IsReplacementAdvocate");
        if (isReplacementAdvocate) {
            MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").enable(true);
        }
        else {
            MojControls.AutoComplete.clearSelection(MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId"));
            MojFind("#div_" + self.getFieldPrefix() + "btnShowDetails").hide();
            MojControls.Label.setValueById(self.getFieldPrefix() + "ReplacementWarning", "");
            MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").enable(false);
            MojControls.Hidden.setValueById(self.getFieldPrefix().substring(0, self.getFieldPrefix().indexOf('_')) + "_IsReplacementAuthorized", null);
        }

    });

    MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").change(function () {

        var replacementAdvocateIdVal = MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").val();//סנגור מחליף
        MojControls.Label.setValueById(self.getFieldPrefix() + "ReplacementWarning", "");
        MojFind("#div_" + self.getFieldPrefix() + "btnShowDetails").hide();

         if (Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").valid()))
         {
            if (replacementAdvocateIdVal != "") {

                var parentElementFieldPrefix = MojFind("#" + self.getFieldPrefix() + "ParentElementFieldPrefix").val();
                var date = MojFind("#" + parentElementFieldPrefix + "ActivityDate").val(); //תאריך פעילות

                if (date != "")
                {
                    var advocateContactId = MojFind("#AdvocateContactId").val(); //סנגור קיים
                    var districtId = MojFind("#" + self.getFieldPrefix() + "DistrictId").val(); //מחוז
                    var processId = MojFind("#ProcessId").val(); //מספר פניה
                    Moj.safePost("/FeeRequest/GetIsAdvocateReplacement", { advocateContactId: advocateContactId, replacementAdvocateId: replacementAdvocateIdVal, districtId: districtId, Date: date, processId: processId }, function (data) {
                        if (data.IsReplacement) {
                            MojFind("#div_" + self.getFieldPrefix() + "btnShowDetails").show();
                            MojFind("#" + self.getFieldPrefix() + "ToAdvocateProfileId").val(data.ToAdvocateProfileId);
                            MojFind("#" + self.getFieldPrefix() + "ValidFromDate").val(data.ValidFromDate);
                            MojFind("#" + self.getFieldPrefix() + "ValidToDate").val(data.ValidToDate);
                            MojFind("#" + self.getFieldPrefix() + "ReplacementReason").val(data.ReplacementReason);
                            MojFind("#" + self.getFieldPrefix() + "Note").val(data.Note);
                            MojControls.Hidden.setValueById(self.getFieldPrefix().substring(0, self.getFieldPrefix().indexOf('_')) + "_IsReplacementAuthorized", true);
                            return true;
                        } else {
                            MojControls.Label.setValueById(self.getFieldPrefix() + "ReplacementWarning", Resources.Messages.WrnIsNotReplacementAuthorized);
                            MojControls.Hidden.setValueById(self.getFieldPrefix().substring(0, self.getFieldPrefix().indexOf('_')) + "_IsReplacementAuthorized", false);
                        }



                    });
                }
                else
                {
                    Moj.showMessage(Resources.Messages.ActivityDateIsNull, undefined, Resources.Strings.Error, MessageType.Error);
                    MojFind("#" + self.getFieldPrefix() + "IsReplacementAdvocate").click();
                }

            }
          }

    });


    MojFind("#" + self.getFieldPrefix() + "btnShowDetails").click(function () {
        var advocateProfileId = MojFind("#AdvocateProfileId").val();
        var toAdvocateProfileId = MojFind("#" + self.getFieldPrefix() + "ToAdvocateProfileId").val();
        var validFromDate = MojFind("#" + self.getFieldPrefix() + "ValidFromDate").val();
        var validToDate = MojFind("#" + self.getFieldPrefix() + "ValidToDate").val();
        var replacementReason = MojFind("#" + self.getFieldPrefix() + "ReplacementReason").val().replace(/ /g, "_");
        var note = MojFind("#" + self.getFieldPrefix() + "Note").val().replace(/ /g, "_");
        //var dateConverted = new Date(validFromDate);
        Moj.openPopupWindow("ShowDetailsPopUp", "", Resources.Strings.ReplacementAdvocateDetails, 700, 270, false, false, false, baseUrl + '/PersonAdvocate/ReplacementAdvocateDetails?IsFeeRequestModule=true&AdvocateProfileId=' + advocateProfileId + "&ToAdvocateProfileId=" + toAdvocateProfileId + "&ValidFromDateAsString=" + validFromDate + "&ValidToDateAsString=" + validToDate + "&ReplacementReason=" + replacementReason + "&Note=" + note, "");
    });


    MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
        var isCheck = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart")

        if (isCheck == "false") {
            MojFind("[id^='SubmissionDetails_Elements'].replaceAdvocateEnable").enable(false);
            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsReplacementAdvocate", false)
            MojFind("#" + self.getFieldPrefix() + "IsReplacementAdvocate").change()
        }
        else
            MojFind("[id^='SubmissionDetails_Elements'].replaceAdvocateEnable").enable(true);
    });


    checkReplacement = function () {
        if (MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").val() != "" && MojControls.CheckBox.getValueById(self.getFieldPrefix() + "IsReplacementAdvocate")) {
            MojFind("#" + self.getFieldPrefix() + "IsReplacementAdvocate").change();
            MojFind("#" + self.getFieldPrefix() + "ReplacementAdvocateId").change();
        }

    };

    checkReplacement();




})
}