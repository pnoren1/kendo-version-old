setRetainerTypeIdVisibility = function () {
    var nominationTypeId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_NominationTypeId");
    if (nominationTypeId == NominationTypeEnum.Retainer) {
        MojFind("#NominationCandidatesForDisplay_ContractLineTypeId").visible(true);
        MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_EmploymentTypeId", MojControls.Hidden.getValueById("NominationCandidatesForDisplay_DefaultForRetainerEmploymentTypeId"))
        MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(false);
    }
    else {
        MojFind("#NominationCandidatesForDisplay_ContractLineTypeId").visible(false);
        MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_ContractLineTypeId", null);

        var advocateId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_AdvocateContactId");
        //todo change!!!
        if (advocateId == "" || nominationTypeId == NominationTypeEnum.Internal || nominationTypeId == NominationTypeEnum.ToranutHakraot || nominationTypeId == NominationTypeEnum.ToranutMahatzarim) {
            MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(false);
        }
        else {
            MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(true);
        }
    }
};

afterSaveCandidateDetails = function (data) {
    //if (data.Errors != undefined) {
    //    Moj.showErrorMessage(data.Errors);
    //}
}

resetAdvocateDetails = function () {
    MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateContactIdNumber", "");
    //MojFind("#NominationCandidatesForDisplay_AdvocateContactIdNumber").visible(false);
    MojControls.Label.setValueById("NominationCandidatesForDisplay_PhoneNumber", "");
    MojFind("#NominationCandidatesForDisplay_PhoneNumber").visible(false);
    MojFind("#NominationCandidatesForDisplay_AdvocateContactName").val("");
    MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateFeatureName", "");
    MojFind("#NominationCandidatesForDisplay_AdvocateFeatureId").val("");
    MojFind("#NominationCandidatesForDisplay_IsExistOtherNominations").val("");
    //MojControls.Label.setValueById("NominationCandidatesForDisplay_RetainerSummery", "")
    //MojFind("#NominationCandidatesForDisplay_RetainerSummery").visible(false);


    MojControls.Label.setValueById("NominationCandidatesForDisplay_RegularRetainerSummeryString", "")
    MojFind("#NominationCandidatesForDisplay_RegularRetainerSummeryString").visible(false);
    MojControls.Label.setValueById("NominationCandidatesForDisplay_ConsistsRetainerSummeryString", "")
    MojFind("#NominationCandidatesForDisplay_ConsistsRetainerSummeryString").visible(false);
    MojControls.Label.setValueById("NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString", "")
    MojFind("#NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString").visible(false);
    MojFind("#RetainterLabel").visible(false);

    MojFind("#NominationCandidatesForDisplay_IsExistRetainerContract").val(false);
    MojFind("#NominationCandidatesForDisplay_RetainerRegularBalance").val("");
    MojFind("#NominationCandidatesForDisplay_RetainerConsistsBalance").val("");
    MojFind("#NominationCandidatesForDisplay_RetainerPsychiatricCommitteeBalance").val("");
    MojControls.Hidden.setValueById("NominationCandidatesForDisplay_DefaultForRetainerEmploymentTypeId", "");
    MojControls.Label.setValueById("NominationCandidatesForDisplay_NominationNote", "")
    MojControls.AutoComplete.setDataSource("NominationCandidatesForDisplay_NominationTypeId", "")
    MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_NominationTypeId", "");
    MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_ContractLineTypeId", "");
    MojFind("#NominationCandidatesForDisplay_NominationTypeId").enable(false);
    MojFind("#NominationCandidatesForDisplay_ContractLineTypeId").visible(false);
    MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_SupervisionLevelId", "");
    MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_SupervisorId", "");
    MojControls.ComboBox.clearComboBox(MojFind("#NominationCandidatesForDisplay_EmploymentTypeId"), false)
    MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").visible(false);
    MojFind("#div_NominationCandidateExistInOtherProcess").hide();
    MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').addClass("hide");
    MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').prev('div').addClass("hide");

    MojFind("#AdvocateInformation").addClass('hide');
}

setAdvocateValues = function () {

    if (MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").val() != "") {
        MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").visible(true);
        MojFind("#div_AdvocateFeatureName")[0].style.direction = "ltr"
    }
    else
        MojFind("#NominationCandidatesForDisplay_AdvocateFeatureName").visible(false);

    var IsNominationExistInOtherProcess = MojFind("#NominationCandidatesForDisplay_IsExistOtherNominations").val();

    if (Moj.isTrue(IsNominationExistInOtherProcess)) {
        MojFind("#div_NominationCandidateExistInOtherProcess").show();
    }
    else {
        MojFind("#div_NominationCandidateExistInOtherProcess").hide();
    }

    if (MojFind("#NominationCandidatesForDisplay_NominationNote").val() != "") {
        MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').removeClass("hide");
        MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').prev('div').removeClass("hide");

    }
    else {
        MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').addClass("hide");
        MojFind("#NominationCandidatesForDisplay_NominationNote").parent('div').prev('div').addClass("hide");


    }


};

setCandidateDetailsDefaultValues = function () {
    //remove the internal value from the dropdown
    setAdvocateValues();
    setRetainerTypeIdVisibility();
    setCandidateNextOrder();

    var advocateId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_AdvocateContactId");
    if (advocateId != 0)
        MojFind("#AdvocateInformation").removeClass('hide');


    //setSupervisionLevelIdAndSupervisorIdVisibility();
};

onSearchAdvocateClosed = function (selectedItem) {

    var contactId = selectedItem["ContactId"];

    $.ajax({
        url: baseUrl + '/PersonAdvocate/GetAdvocateDataSourceByContactId',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{ "contactId": "' + contactId + '" }',
        success: function (data) {
            if (data != undefined) {
                MojControls.AutoComplete.setDataSourceAndValue("NominationCandidatesForDisplay_AdvocateContactId", data, contactId);
            }
        }
    });

    //MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_AdvocateContactId", contactId);
    MojFind("#NominationCandidatesForDisplay_AdvocateContactId").change();
};

getAdvocateDetails = function (advocateId, processId, shiftId, employmentTypeId) {
    $.post("/Process/GetAdvocateDetails?advocateId=" + advocateId + "&processId=" + processId + "&shiftId=" + shiftId + "&employmentTypeId=" + employmentTypeId , "", function (data) {
        if (data.Error == undefined) {
            //if (Moj.isNotEmpty(data.AdvocateDetails.DefaultEmploymentId))
                MojFind("#NominationCandidatesForDisplay_ShiftEmploymentTypeId").val(data.AdvocateDetails.DefaultEmploymentId);
            MojFind("#AdvocateInformation").removeClass('hide');
            MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateContactIdNumber", data.AdvocateDetails.AdvocateIdNumber);
            //if (data.AdvocateDetails.AdvocateIdNumber != null) {
            //    MojFind("#NominationCandidatesForDisplay_AdvocateContactIdNumber").visible(true);
            //}
            //else {
            //    MojFind("#NominationCandidatesForDisplay_AdvocateContactIdNumber").visible(false);
            //}

            if (data.AdvocateDetails.PhoneNumber != null) {
                MojControls.Label.setValueById("NominationCandidatesForDisplay_PhoneNumber", data.AdvocateDetails.PhoneNumber);
                MojFind("#NominationCandidatesForDisplay_PhoneNumber").visible(true);
            }
            else {
                MojFind("#NominationCandidatesForDisplay_PhoneNumber").visible(false);
            }


            MojFind("#NominationCandidatesForDisplay_AdvocateContactName").val(data.AdvocateDetails.AdvocateName);
            MojControls.Label.setValueById("NominationCandidatesForDisplay_AdvocateFeatureName", data.AdvocateDetails.AdvocateFeatureName);
            MojFind("#NominationCandidatesForDisplay_AdvocateFeatureId").val(data.AdvocateDetails.AdvocateFeatureId);
            MojFind("#NominationCandidatesForDisplay_IsExistOtherNominations").val(data.AdvocateDetails.IsNominationExistInOtherProcess);

            if (data.Retainer != null) {
                //MojControls.Label.setValueById("NominationCandidatesForDisplay_RetainerSummery", data.Retainer.SummeryString)
                //MojFind("#NominationCandidatesForDisplay_RetainerSummery").visible(true);
                if (data.Retainer.RegularRetainerSummeryString != null || data.Retainer.ConsistsRetainerSummeryString != null || data.Retainer.PsychiatricCommitteeRetainerSummeryString != null) 
                    MojFind("#RetainterLabel").visible(true);
                if (data.Retainer.RegularRetainerSummeryString != null) {
                    MojControls.Label.setValueById("NominationCandidatesForDisplay_RegularRetainerSummeryString", data.Retainer.RegularRetainerSummeryString)
                    MojFind("#NominationCandidatesForDisplay_RegularRetainerSummeryString").visible(true);
                }

                if (data.Retainer.ConsistsRetainerSummeryString != null) {
                    MojControls.Label.setValueById("NominationCandidatesForDisplay_ConsistsRetainerSummeryString", data.Retainer.ConsistsRetainerSummeryString)
                    MojFind("#NominationCandidatesForDisplay_ConsistsRetainerSummeryString").visible(true);
                }

                if (data.Retainer.PsychiatricCommitteeRetainerSummeryString != null) {
                    MojControls.Label.setValueById("NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString", data.Retainer.PsychiatricCommitteeRetainerSummeryString)
                    MojFind("#NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString").visible(true);
                }

                MojFind("#NominationCandidatesForDisplay_IsExistRetainerContract").val(true);

                MojFind("#NominationCandidatesForDisplay_RetainerRegularBalance").val(data.Retainer.RetainerRegularBalance);
                MojFind("#NominationCandidatesForDisplay_RetainerConsistsBalance").val(data.Retainer.RetainerConsistsBalance);
                MojFind("#NominationCandidatesForDisplay_RetainerPsychiatricCommitteeBalance").val(data.Retainer.RetainerPsychiatricCommitteeBalance);
                MojControls.Hidden.setValueById("NominationCandidatesForDisplay_DefaultForRetainerEmploymentTypeId", data.AdvocateDetails.Retainer.EmploymentTypeId);

            }
            else {
                //MojFind("#NominationCandidatesForDisplay_RetainerSummery").val("");
                //MojFind("#NominationCandidatesForDisplay_RetainerSummery").visible(false);
                MojControls.Label.setValueById("NominationCandidatesForDisplay_RegularRetainerSummeryString", "")
                MojFind("#NominationCandidatesForDisplay_RegularRetainerSummeryString").visible(false);
                MojControls.Label.setValueById("NominationCandidatesForDisplay_ConsistsRetainerSummeryString", "")
                MojFind("#NominationCandidatesForDisplay_ConsistsRetainerSummeryString").visible(false);
                MojControls.Label.setValueById("NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString", "")
                MojFind("#NominationCandidatesForDisplay_PsychiatricCommitteeRetainerSummeryString").visible(false);
                MojFind("#RetainterLabel").visible(false);

                MojFind("#NominationCandidatesForDisplay_IsExistRetainerContract").val(false);

                MojFind("#NominationCandidatesForDisplay_RetainerRegularBalance").val("");
                MojFind("#NominationCandidatesForDisplay_RetainerConsistsBalance").val("");
                MojFind("#NominationCandidatesForDisplay_RetainerPsychiatricCommitteeBalance").val("");
                MojControls.Hidden.setValueById("NominationCandidatesForDisplay_DefaultForRetainerEmploymentTypeId", "");
            }
            MojControls.Label.setValueById("NominationCandidatesForDisplay_NominationNote", data.AdvocateDetails.NominationNote)



            if (data.AdvocateDetails.NominationTypesResult != null) {

                MojControls.AutoComplete.setDataSource("NominationCandidatesForDisplay_NominationTypeId", data.AdvocateDetails.NominationTypesResult.NominationTypes)
                //if (data.AdvocateDetails.NominationTypesResult.IsDefault != null) {
                MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_NominationTypeId", data.AdvocateDetails.NominationTypesResult.IsDefault);
                MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_ContractLineTypeId", data.AdvocateDetails.NominationTypesResult.ContractLineTypeId);
                //  }
                MojFind("#NominationCandidatesForDisplay_NominationTypeId").enable(true);
                setRetainerTypeIdVisibility();
            }

            if (data.AdvocateDetails.DefaultSupervisonLevelId != null) {
                MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_SupervisionLevelId", data.AdvocateDetails.DefaultSupervisonLevelId);
            }
            if (data.AdvocateDetails.DefaultSupervisorId != null) {
                MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_SupervisorId", data.AdvocateDetails.DefaultSupervisorId);
            }
            if (data.AdvocateDetails.EmploymentTypes != null) {
                MojControls.AutoComplete.setDataSourceAndValue("NominationCandidatesForDisplay_EmploymentTypeId", data.AdvocateDetails.EmploymentTypes, data.AdvocateDetails.DefaultEmploymentId)
                //if (Moj.isNotEmpty(data.AdvocateDetails.DefaultEmploymentId))
                //    MojFind("#NominationCandidatesForDisplay_ShiftEmploymentTypeId").val(data.AdvocateDetails.DefaultEmploymentId);
                if (Moj.isNotEmpty(shiftId) && Moj.isNotEmpty(MojFind("#NominationCandidatesForDisplay_NominationTypeId").val()))// && Moj.isNotEmpty(data.AdvocateDetails.DefaultEmploymentId))
                    MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(false);
                else
                    MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(true);
            }
            else {
                MojControls.ComboBox.clearComboBox(MojFind("#NominationCandidatesForDisplay_EmploymentTypeId"), false)
            }
            setAdvocateValues();
            MojFind("#NominationCandidatesForDisplay_ShiftId").val(shiftId);
        }
    });
}

//setSupervisionLevelIdAndSupervisorIdVisibility = function () {
//    var isSupervisionLevelAccordingToAdvocate = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate");
//    if (!isSupervisionLevelAccordingToAdvocate)
//        MojFind("#NominationCandidatesForDisplay_SupervisionLevelId").enable(false);

//    var isSupervisorAccordingToAdvocate = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate");
//    if (!isSupervisorAccordingToAdvocate)
//        MojFind("#NominationCandidatesForDisplay_SupervisorId").enable(false);
//};


$(document).ready(function () {
    //MojFind("#NominationCandidatesForDisplay_ContractLineTypeId").change(function () {
    //    Moj.safePost("/Process/GetAdvocateContract", { contractLineTypeId: MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_ContractLineTypeId") }
    //        , function (isExistBalance) {
    //    });
    //});
    //MojFind("#btnSearchAdvocate").die('click');
    MojFind("#btnSearchAdvocate").on('click', function (e) {
        PDO.openSearchAdvocatePopup("onSearchAdvocateClosed", true, true);
        //var isPopup = true;
        //Moj.openPopupWindow("SearchPersonAdvocatePopup", null, Resources.Strings.SearchPersonAdvocates, 1170, 870, false, false, false,
        //    baseUrl + '/PersonAdvocate/SearchPersonAdvocate?&isPopup=' + isPopup, onSearchAdvocateClosed);
    });

    MojFind("#NominationCandidatesForDisplay_NominationTypeId").die('change');
    MojFind("#NominationCandidatesForDisplay_NominationTypeId").live('change', function (e) {
        var nominationTypeId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_NominationTypeId");
        if (nominationTypeId != "")
            setRetainerTypeIdVisibility();
        if ((nominationTypeId == NominationTypeEnum.ToranutHakraot || nominationTypeId == NominationTypeEnum.ToranutMahatzarim  || nominationTypeId == NominationTypeEnum.Internal)
            && Moj.isNotEmpty(MojFind("#NominationCandidatesForDisplay_ShiftId").val())) {// && Moj.isNotEmpty(MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_EmploymentTypeId")))
            MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_EmploymentTypeId", MojFind("#NominationCandidatesForDisplay_ShiftEmploymentTypeId").val());
            MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(false);
        }
        else if (nominationTypeId != NominationTypeEnum.Retainer && nominationTypeId != NominationTypeEnum.Internal)
            MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(true);
            //MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(false);
        //else
            //MojFind("#NominationCandidatesForDisplay_EmploymentTypeId").enable(true);
    });

    MojFind("#NominationCandidatesForDisplay_AdvocateContactId").die('change');
    MojFind("#NominationCandidatesForDisplay_AdvocateContactId").live('change', function (e) {

        var advocateId = MojControls.AutoComplete.getValueById("NominationCandidatesForDisplay_AdvocateContactId");

        if (Moj.isEmpty(advocateId)) {
            MojFind("#NominationCandidatesForDisplay_AdvocateContactId").data("kendoComboBox").dataSource.filter([]);

            resetAdvocateDetails();
            return;
        }

        MojFind("#NominationCandidatesForDisplay_AdvocateContactId").data("kendoComboBox").dataSource.filter([]);
        var valueNumber = MojFind("#NominationCandidatesForDisplay_AdvocateContactId").val();
        MojFind("#NominationCandidatesForDisplay_AdvocateContactId").data("kendoComboBox").dataSource.filter({
            field: 'Value',
            ignoreCase: true,
            operator: 'startswith',
            value: MojFind("#NominationCandidatesForDisplay_AdvocateContactId").data("kendoComboBox").text(),
            valueNumber: MojFind("#NominationCandidatesForDisplay_AdvocateContactId").val(),
        });
        MojControls.AutoComplete.setValueById("NominationCandidatesForDisplay_AdvocateContactId", valueNumber);


        var processId = MojFind("#GeneralDetailsModel_ProcessId").val();
        var isAdvocateAlreadyExist = false;
        var grid = MojControls.Grid.getKendoGridById("grdNominationCandidates");

        grid.tbody.find('>tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && dataItem.State != undefined) {
                if (dataItem.State != window.Enums.ObjectState.Deleted) {
                    if (dataItem.AdvocateContactId == advocateId) {
                        Moj.showMessage(Resources.Messages.WrnAdvocateAlreadyExist, function () {
                            MojControls.AutoComplete.clearSelectionById("NominationCandidatesForDisplay_AdvocateContactId");
                        }, Resources.Strings.Message, MessageType.Alert);
                        isAdvocateAlreadyExist = true;
                        return false;
                    }
                }
            }
        });
        if (!isAdvocateAlreadyExist) {
            var gridShifts = MojControls.Grid.getKendoGridById("grdProcessMatchingShifts");
            var shiftId = null;
            var employmentTypeId = null;
            if (!Moj.isEmpty(gridShifts)) {
                gridShifts.tbody.find('>tr').each(function () {
                    var dataItem = gridShifts.dataItem(this);
                    if (dataItem != undefined) {
                        if (dataItem.AdvocateContactId == advocateId) {
                            shiftId = dataItem.ShiftId;
                            employmentTypeId = dataItem.EmploymentTypeId;
                            return false;
                        }
                    }
                });
            }
            getAdvocateDetails(advocateId, processId, shiftId, employmentTypeId);
        }

    });
    
})
