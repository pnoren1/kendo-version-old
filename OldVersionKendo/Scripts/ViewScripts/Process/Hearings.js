//function Hearings(fieldPrefix) {
//    var self = this;
//    self.getFieldPrefix = function () {
//        return Moj.isEmpty(fieldPrefix) ? "" : fieldPrefix.replace('.', '_') + "_";
//    };


getHearingPeriod = function () {
    var processDateForCompare = MojFind("#ProcessDetailsModel_ProcessDate").length > 0 ? kendo.parseDate(MojFind("#ProcessDetailsModel_ProcessDate").val(), ["hh:mm dd/MM/yyyy", "dd/MM/yyyy"])
        : kendo.parseDate(MojFind("#ProcessDateForDisplay").val(), ["hh:mm dd/MM/yyyy", "dd/MM/yyyy"]);
     var res = Moj.isEmpty(MojFind("#Hearing_HearingDate").val()) ||
         kendo.parseDate(MojFind("#Hearing_HearingDate").val(), ["hh:mm dd/MM/yyyy", "dd/MM/yyyy"]) > processDateForCompare ? HearingPeriod.FutureHearing : HearingPeriod.Hearing;
     //res = (new Date(MojFind("#Hearing_HearingDate").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")) < new Date(MojFind("#ProcessDetailsModel_ProcessDate").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")));
     return res
};

//visibleHearingResult = function (isVisible) {
//    if (Moj.isFalse(isVisible) && Moj.isFalse(MojFind("#Hearing_IsHasSittingID").val()))
//        MojControls.AutoComplete.clearSelectionById("Hearing_HearingResultTypeID");
//    MojFind("#Hearing_HearingResultTypeID").visible(isVisible);
//};

$(document).ready(function () {
    
    MojFind("#Hearing_HearingDate").die('change');
    MojFind("#Hearing_HearingDate").live('change', function (e) {
        var period = getHearingPeriod();
        MojFind("#Hearing_HearingPeriods").val(period);
        //visibleHearingResult(period == HearingPeriod.Hearing);
    });

});
//}