setRetainerTypeIdVisibility = function () {
    var nominationTypeId = MojControls.DropDown.getValueById("NominationCandidatesForDisplay_NominationTypeId");
    if (nominationTypeId == NominationTypeEnum.Retainer) {
        MojFind("#NominationCandidatesForDisplay_ContractRetainerTypeId").visible(true);
    }
    else {
        MojFind("#NominationCandidatesForDisplay_ContractRetainerTypeId").visible(false);

    }
};

setAdvocateValues = function () {
    var advocateFeatureId = MojFind("#NominationCandidatesForDisplay_AdvocateFeatureId").val();
    if (advocateFeatureId != AdvocateFeatureEnum.Normal) {
        MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").visible(true);
    }
    else {
        MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").visible(false);
    }

    var IsNominationExistInOtherProcess = MojFind("#NominationCandidatesForDisplay_IsExistOtherNominations").val();
    if (Moj.isTrue(IsNominationExistInOtherProcess)) {
        MojFind("#NominationCandidateExistInOtherProcess").visible(true);
    } else {
        MojFind("#NominationCandidateExistInOtherProcess").visible(false);
    }


    if (advocateFeatureId == AdvocateFeatureEnum.Internal) {
        MojFind("#NominationCandidatesForDisplay_NominationTypeId").enable(false);
    }
    else {
        MojFind("#NominationCandidatesForDisplay_NominationTypeId").enable(true);
    }
};



setCandidateDetailsDefaultValues = function () {
    //remove the internal value from the dropdown
    setAdvocateValues();
    setRetainerTypeIdVisibility();
    setCandidateNextOrder();
};

$(document).ready(function () {

    MojFind("#NominationCandidatesForDisplay_NominationTypeId").change(function () {
        setRetainerTypeIdVisibility();
    });

    MojFind("#NominationCandidatesForDisplay_AdvocateContactId").change(function () {
        debugger;
        var advocateId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_AdvocateContactId");
        var processId = MojFind("#GeneralDetailsModel_ProcessId").val();
        Moj.safeGet("/Nominations/GetAdvocateDetails?advocateId=" + advocateId + "&processId=" + processId, undefined, function (data) {
            debugger;
            if (data.Error == undefined) {
                MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateContactIdNumber", data.AdvocateDetails.AdvocateIdNumber);
                MojFind("#NominationCandidatesForDisplay_AdvocateContactName").val(data.AdvocateDetails.AdvocateName);
                MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateFeatureName", data.AdvocateDetails.AdvocateFeatureName);
                MojFind("#NominationCandidatesForDisplay_AdvocateFeatureId").val(data.AdvocateDetails.AdvocateFeatureId);
                MojFind("#NominationCandidatesForDisplay_IsExistOtherNominations").val(data.AdvocateDetails.IsNominationExistInOtherProcess);
                setAdvocateValues();

                if (data.AdvocateDetails.DefaultNominationTypeId != null) {
                    MojControls.DropDown.setValueById("NominationCandidatesForDisplay_NominationTypeId", data.AdvocateDetails.DefaultNominationTypeId);
                    MojFind("#NominationCandidatesForDisplay_NominationTypeId").change();
                }
                if (data.AdvocateDetails.SuperviosonLevelId != null) {
                    MojControls.DropDown.setValueById("NominationCandidatesForDisplay_SupervisionLevelId", data.AdvocateDetails.SupervisonLevelId);
                }
            }

        });
    });
})
