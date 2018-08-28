function setRecommendationName(fieldName) {
    var recommendationName = MojControls.AutoComplete.getTextById(fieldName);
    MojFind("#ProcessAppealRecommendationForDisplay_RecommenderName").val(recommendationName);
};

function visibleRecommendation(recommenderType) {
    
    switch (recommenderType) {
        case RecommenderType.Supervisor:
            MojFind("#rAdvocateContactId").addClass("hide");
            MojFind("#rSupervisorId").removeClass("hide");
            MojControls.AutoComplete.clearSelection(MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderAdvocateContactId"));
            break;
        case RecommenderType.Advocate:
            MojFind("#rAdvocateContactId").removeClass("hide");
            MojFind("#rSupervisorId").addClass("hide");
            MojControls.AutoComplete.clearSelection(MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderSupervisorId"));
            break;
        default:
            MojControls.AutoComplete.clearSelection(MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderSupervisorId"));
            MojControls.AutoComplete.clearSelection(MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderAdvocateContactId"));
            MojFind("#rSupervisorId").addClass("hide");
            MojFind("#rAdvocateContactId").addClass("hide");
            break;
    }
};

function enableAppealMatterIds(isEnable) {
    MojFind("#ProcessAppealRecommendationForDisplay_AppealMatterIds").enable(isEnable);
    MojFind("#ProcessAppealRecommendationForDisplay_AppealMatterIds").data("kendoMultiSelect").enable(isEnable);
    if (Moj.isFalse(isEnable))
        MojControls.MultiDropDown.clearAll("ProcessAppealRecommendationForDisplay_AppealMatterIds");
}
$(document).ready(function () {

    enableAppealMatterIds(parseInt(MojFind("#ProcessAppealRecommendationForDisplay_ApealRecommendationId").val()) == YesNoEnum.Yes);
     
    visibleRecommendation(parseInt(MojFind("#ProcessAppealRecommendationForDisplay_RecommenderTypeId").val()));
    
    MojFind("#ProcessAppealRecommendationForDisplay_RecommenderTypeId").die('change');
    MojFind("#ProcessAppealRecommendationForDisplay_RecommenderTypeId").live('change', function (e) {
        var recommenderType = parseInt(this.value);
        visibleRecommendation(recommenderType);
    });

    MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderAdvocateContactId").on('change', function (e) {
        setRecommendationName("ProcessAppealRecommendationForDisplay_AppealRecommenderAdvocateContactId");
    });

    MojFind("#ProcessAppealRecommendationForDisplay_AppealRecommenderSupervisorId").on('change', function (e) {
        setRecommendationName("ProcessAppealRecommendationForDisplay_AppealRecommenderSupervisorId");
    });

    MojFind("#ProcessAppealRecommendationForDisplay_ApealRecommendationId").removeAttr('change');
    MojFind("#ProcessAppealRecommendationForDisplay_ApealRecommendationId").on('change', function (e) {
        enableAppealMatterIds(parseInt(this.value) == YesNoEnum.Yes);
    });
});