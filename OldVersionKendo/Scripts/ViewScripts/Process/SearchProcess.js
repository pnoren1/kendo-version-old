NewProcessClick = function (applicantContactId) {
    var urlParameters = "";
    if (applicantContactId != undefined)
        urlParameters = '?applicantContactId=' + applicantContactId;
    //open the popup with appendto property

    //Moj.website.openPopupWindow("PopUpWizard", "", Resources.Strings.NewProcess, 1266, 766, false, false, false, baseUrl + '/Process/NewProcessWizard' + urlParameters, undefined, undefined, undefined, undefined, 'הנתונים לא ישמרו. להמשיך?');
    Moj.website.openPopupWindow("PopUpWizard", "", Resources.Strings.NewProcess, 1266, 766, false, false, false, baseUrl + '/Process/NewProcessWizard' + urlParameters, undefined, undefined, undefined, undefined, 'הנתונים לא ישמרו. להמשיך?');
};

ProcessDetails_CloseTab = function (id) {
    var tabToCloseButtonProcessDetails;
    if (id == 0)
        tabToCloseButtonProcessDetails = $('.tab-close[id*="Process_Tab_0"]');
    else
        tabToCloseButtonProcessDetails = $('.tab-close[id*="Process_Tab_"]:not(.tab-close[id*="Process_Tab_' + id + '"])');

    var ProcessDetailsTabToClose = tabToCloseButtonProcessDetails.attr("id");

    if (typeof (ProcessDetailsTabToClose) != "undefined") {
        PDO.closeEntityTab(tabToCloseButtonProcessDetails);
    }
};

processSelected = function (dataItemSelect) {

    // var grid = MojFind("[id^='grdProcessList']").data("kendoGrid");
    //actionSearchdialogModal for document module
    //var myWindow = $("#openSearchProcessPopup, #actionSearchdialogModal").data("kendoWindow");
    // myWindow.close();
    if (dataItemSelect != undefined) {
        var ParentEntityInstanceID = dataItemSelect.ProcessId;
        var ParentEntityInstance = dataItemSelect["ProcessId"];
        GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
    }
}

$(document).ready(function () {
  //  MojFind("#SearchByOtherParamDate").enable(false);
    //MojFind("#SearchByOtherParameters_Id").change(function () {
    //    
    //    var val = MojControls.AutoComplete.getValueById("SearchByOtherParameters_Id");
    //    if (val == 4) {//פניות חקירה המובאות לבית משפט
    //        MojControls.DateTimePicker.setValueById("SearchByOtherParamDate", Moj.HtmlHelpers._parseDate(new Date(), "dd/MM/yyyy"));
    //        MojFind("#SearchByOtherParamDate").visible(true);
    //        MojFind("#div_HasNotNominatorOrDepartment").attr('style', 'width: 85px;')
    //    }
    //    else {
    //        MojControls.DateTimePicker.setValueById("SearchByOtherParamDate", null);
    //        MojFind("#SearchByOtherParamDate").visible(false);
    //        MojFind("#div_HasNotNominatorOrDepartment").attr('style', 'width: 255px;')
    //    }

    //});


    MojFind("#btnOkSearchPersonApplicant").off('click');

    MojFind("#btnOkSearchProcess").click(function () {
        // var grid = MojControls.Grid.getKendoGridById("grdProcessList");
        onCloseSearchProcessPopup();
    });

    MojFind("#btnClearSearchProcess").removeAttr('onclick');

    MojFind("#divSearchProcessCriteria").off('keypress');
    MojFind("#divSearchProcessCriteria").on('keypress', function (e) {

        if (e.keyCode == 13) {
            MojFind("#ProcessId").change();
            MojFind("#btnSearchSearchProcess").click();
            return false;
        }
    });

    enableSearchProcessFields = function (isEnabled) {

        MojFind("#SearchByOtherParamDate").visible(false);
        MojFind("#div_HasNotNominatorOrDepartment").attr('style', 'width: 255px;')
        MojFind("#ProcessTypeId").enable(isEnabled);
        MojFind("#ProcessNoForDisplay").enable(isEnabled);
        MojFind("#DistrictId").enable(isEnabled);
        MojFind("#ProcessStatusId").enable(isEnabled);
        MojFind("#ProcessFromDate").enable(isEnabled);
        MojFind("#ProcessToDate").enable(isEnabled);
        MojFind("#btnSearchApplicant").enable(isEnabled);
        MojFind("#PersonIDTypeId").enable(isEnabled);
        MojFind("#ApplicantIdNumber").enable(isEnabled);
        MojFind("#PDOFileId").enable(isEnabled);
        MojFind("#PoliceIncidentNumber").enable(isEnabled);

        //MojFind("#ProcessNominationStatusId").enable(isEnabled);
        //MojFind("#AdvocateIdNumber").enable(isEnabled);
        //MojFind("#AdvocateName").enable(isEnabled);

        MojFind("#ApplicantLocation_InstituteTypeId").enable(isEnabled);
        MojFind("#ApplicantLocation_InstituteId").enable(isEnabled);
        MojFind("#FeeTypeId").enable(isEnabled);
        MojFind("#ApplicantFeeActionTypeId").enable(isEnabled);
        MojFind("#NominatedAdvocateId").enable(isEnabled);
        MojFind("#NominatorId").enable(isEnabled);
        MojFind("#ProcessCreator").enable(isEnabled);
        MojFind("#ShiftTypeId").enable(isEnabled);
        MojFind("#ShiftDate").enable(isEnabled);
        MojFind("#ShiftConfigurationId").enable(isEnabled);
        MojFind("#ShiftPlaceId").enable(isEnabled);
        MojFind("#SearchByOtherParameters_Id").enable(isEnabled);

        MojFind("#IsMinor").enable(isEnabled);
        MojFind("#HasNotNominatorOrDepartment").enable(isEnabled);
        MojFind("#NominationGroundStatusId").enable(isEnabled);
        MojFind("#NominationGroundId").enable(isEnabled);
        MojFind("#ProcessInitiatorId").enable(isEnabled);
        MojFind("#ProsecutorTypeId").enable(isEnabled);
        MojFind("#ProcesschannelId").enable(isEnabled);
        MojFind("#CourtTypeId").enable(isEnabled);
        MojFind("#CourtLevelId").enable(isEnabled);
        MojFind("#CourtContactId").enable(isEnabled);
        MojFind("#NominationTypeId").enable(isEnabled);
        MojFind("#NominationCauseId").enable(isEnabled);
        MojFind("#AdvocateContractId").enable(isEnabled);
        MojFind("#IsExistNomination").enable(isEnabled);
        MojFind("#NominationStatusId").enable(isEnabled);
        MojFind("#IsFinancialEntitlement18a7Checked").enable(isEnabled);
        MojFind("#HospitalizationPlaceContactId").enable(isEnabled);
        MojFind("#ApplicantFeeTypeId").enable(isEnabled);
        MojFind("#IsExistProcessConsultation").enable(isEnabled);
        MojFind("#ConsultantUserId").enable(isEnabled);
        MojFind("#ConsultationStatusId").enable(isEnabled);
        MojFind("#IsExistProcessExpert").enable(isEnabled);
        MojFind("#ExpertTypeId").enable(isEnabled);
        MojFind("#ExpertId").enable(isEnabled);
        MojFind("#ExpertProductId").enable(isEnabled);
        MojFind("#ProcessResultTypeId").enable(isEnabled);
        MojFind("#EndProcessHearingDateFrom").enable(isEnabled);
        MojFind("#EndProcessHearingDateTo").enable(isEnabled);
        MojFind("#FelonyLawClauseStageId").enable(isEnabled);
        MojFind("#FelonyLawTypeId").enable(isEnabled);
        MojFind("#FelonyLawClauseId").enable(isEnabled);
        MojFind("#TagId").enable(isEnabled);
        MojFind("#PoliceStationContactId").enable(isEnabled);
        MojFind("#SearchJoinedProcesses").enable(isEnabled);



    };

    MojFind("#btnClearSearchProcess").click(function () {

        Moj.clearFields(undefined, "[id$='pnlSearchProcess1']");

        if (!Moj.isTrue(MojFind("#ProcessSearchModel_IsReport").val())) //not reports view
            MojControls.Grid.clear('grdProcessList');

        enableSearchProcessFields(true);
        if (!Moj.isTrue(MojFind("#ProcessSearchModel_IsReport").val())) //not reports view
        {
            var defaultDistrictId = parseInt(MojFind("#DefaultDistrictId").val());
            MojControls.AutoComplete.setValueById("DistrictId", defaultDistrictId);
            GetDependentFieldsByDistrictId(defaultDistrictId);
            MojControls.AutoComplete.setValueById("FelonyLawClauseStageId", MojFind("#DefaultFelonyLawClauseStageId").val());
        }
        else //reports view
        {
            MojControls.AutoComplete.setValueById("FelonyLawClauseStageId", MojFind("#ProcessSearchModel_DefaultFelonyLawClauseStageId").val());
            MojFind("#DistrictId").enable(false);
            MojFind("#DistrictId").change();
        }
            

        
        MojFind("#ApplicantLocation_InstituteId").enable(false);
        MojFind("#SearchJoinedProcesses").enable(false);
        ResetFelonyLawClause();


    });


    GetDependentFieldsByDistrictId = function (districtId) {
        $.post("Process/GetDependentFieldsByDistrictId?districtId=" + districtId, function (data) {

            MojControls.AutoComplete.setDataSourceAndValue("ProcessCreator", data.ProcessCreators, -1);
            MojControls.AutoComplete.setDataSourceAndValue("NominatorId", data.Nominators, -1);
            MojControls.AutoComplete.setDataSourceAndValue("ConsultantUserId", data.ConsultantUsers, -1);
            MojControls.AutoComplete.setDataSourceAndValue("NominatedAdvocateId", data.NominatedAdvocates, -1);
            MojControls.AutoComplete.setDataSourceAndValue("ShiftConfigurationId", data.ShiftConfigurations, -1);
            MojFind("#ProcessCreator").enable(true);
            MojFind("#NominatorId").enable(true);
            MojFind("#ConsultantUserId").enable(true);
            MojFind("#NominatedAdvocateId").enable(true);
            MojFind("#ShiftConfigurationId").enable(true);
        });
    };

    //MojFind("#btnSearchSearchProcess").click(function () {
    //    MojFind("#ProcessId").change();
    //});

    MojFind("#ProcessId").change(function () {
        var newValue = $(this).val();
        if (newValue != undefined && newValue != "") {
            enableSearchProcessFields(false);
            Moj.clearFields(undefined, "[id$='pnlSearchProcess1']");
            MojFind("#ProcessId").val(newValue);
        }
        else {
            enableSearchProcessFields(true);
            var defaultDistrictId = parseInt(MojFind("#DefaultDistrictId").val());
            MojControls.AutoComplete.setValueById("DistrictId", defaultDistrictId);
            MojControls.AutoComplete.setValueById("FelonyLawClauseStageId", MojFind("#DefaultFelonyLawClauseStageId").val());
            MojFind("#ApplicantLocation_InstituteId").enable(false);
            MojFind("#SearchJoinedProcesses").enable(false);
            ResetFelonyLawClause();
        }
    });

    MojFind("#ProcessNoForDisplay").change(function () {

        var processNoForDisplayVal = MojFind("#ProcessNoForDisplay").val();

        if (processNoForDisplayVal != "")
            MojFind("#SearchJoinedProcesses").enable(true);
        else {
            MojFind("#SearchJoinedProcesses").enable(false);
            MojControls.CheckBox.setValueById("SearchJoinedProcesses", "");
        }
    });

    MojFind("[id*='grdProcessList']").find("#rdbIsSelected").die('click');

    MojFind("[id*='grdProcessList']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdProcessList");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

    MojFind('#pnlSearchProcess1 .minus').die('click');

    MojFind('#pnlSearchProcess1 .minus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdProcessList', 20)
    })

    MojFind('#pnlSearchProcess1 .plus').die('click');

    MojFind('#pnlSearchProcess1 .plus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdProcessList', 10)
    })

});

Reset_DropDown_Field = function (FieldName) {
    MojControls.AutoComplete.setValueById(FieldName, "");
    MojControls.ComboBox.clearComboBox(MojFind("#" + FieldName), true);
}

MojFind("#DistrictId").change(function () {
    var district = MojFind("#DistrictId").val();

    if (district != "")
        GetDependentFieldsByDistrictId(district);
    else {
        MojControls.AutoComplete.setDataSourceAndValue("ProcessCreator", null, -1, false);
        MojControls.AutoComplete.setDataSourceAndValue("NominatorId", null, -1, false);
        MojControls.AutoComplete.setDataSourceAndValue("ConsultantUserId", null, -1, false);
        MojControls.AutoComplete.setDataSourceAndValue("NominatedAdvocateId", null, -1, false);
        MojControls.AutoComplete.setDataSourceAndValue("ShiftConfigurationId", null, -1, false);
    }

    //GetDropDownDataFromServer("DistrictId", "GetDependentFieldsByDistrictId", "ProcessCreator");
});



MojFind("#div_ExtendedSearchParametersShow").click(function () {
    MojFind("#ExtendedSearchParameters").show();
    MojFind("#div_ExtendedSearchParametersShow").hide()
    MojFind("#div_ExtendedSearchParametersHide").show()

});

MojFind("#div_ExtendedSearchParametersHide").click(function () {

    MojFind("#ExtendedSearchParameters").hide();
    MojFind("#div_ExtendedSearchParametersHide").hide()
    MojFind("#div_ExtendedSearchParametersShow").show()
});

MojFind("#FelonyLawTypeId").change(function () {

    if (MojFind("#FelonyLawTypeId").val() == "")
        ResetFelonyLawClause();
    else {
        if (MojFind("#FelonyLawClauseStageId").val() != "")
            GetFelonyLawClausesByFelonyLawTypeId();
    }
});

MojFind("#FelonyLawClauseStageId").change(function () {

    if (MojFind("#FelonyLawClauseStageId").val() == "")
        ResetFelonyLawClause();
    else {
        if (MojFind("#FelonyLawTypeId").val() != "" && MojFind("#FelonyLawClauseId").prop('readonly'))
            GetFelonyLawClausesByFelonyLawTypeId();
    }
});

MojFind("#ApplicantLocation_InstituteTypeId").change(function () {
    GetDropDownDataFromServer("ApplicantLocation_InstituteTypeId", "GetInstitutesByInstituteTypeId", "ApplicantLocation_InstituteId");
});

ResetFelonyLawClause = function () {

    MojFind("#FelonyLawClauseId").enable(false);
    MojControls.AutoComplete.setValueById("FelonyLawClauseId", null);
    MojControls.AutoComplete.setDataSource("FelonyLawClauseId", "");
};

GetFelonyLawClausesByFelonyLawTypeId = function () {

    $.post(baseUrl + '/Process/GetFelonyLawClausesByFelonyLawTypeId', { felonyLawTypeId: MojFind("#FelonyLawTypeId").val() }, function (data) {

        if (data != undefined && data.FelonyLawClauses != undefined) {
            MojFind("#FelonyLawClauseId").enable(true);
            MojControls.AutoComplete.setDataSource("FelonyLawClauseId", data.FelonyLawClauses)
        }
    });
};

GetDropDownDataFromServer = function (elementID, action, elementIdToChange) {
    var selectedId = MojControls.AutoComplete.getValueById(elementID);
    if (selectedId != "") {
        $.ajax({
            url: baseUrl + '/Process/' + action,
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "SelectedId": "' + selectedId + '" }',
            success: function (response) {
                if (JSON.stringify(response) != "[]") {
                    //EnableApplicantMeetingPlaceContactIdField(true);
                    MojControls.AutoComplete.setDataSourceAndValue(elementIdToChange, response, -1);
                    MojFind("#" + elementIdToChange).enable(true);
                }
                else {
                    //EnableApplicantMeetingPlaceContactIdField(false);
                    Reset_DropDown_Field(elementIdToChange);
                    MojFind("#" + elementIdToChange).enable(false);
                    //MojControls.AutoComplete.setValueById("ApplicantLocation_InstituteId", "");
                    //MojControls.AutoComplete.setDataSourceAndValue("ApplicantLocation_InstituteId", "[]", -1);
                }
            }
        })
    }
    else {
        Reset_DropDown_Field(elementIdToChange);
        MojFind("#" + elementIdToChange).enable(false);
        //EnableApplicantMeetingPlaceContactIdField(false);
    }
};

onCloseSearchProcessPopup = function () {
    var grid = MojControls.Grid.getKendoGridById("grdProcessList");
    var selectedItem = grid.dataItem(grid.select());
    var actionName = MojFind("#onClosePopupMethod").val();
    var window = $("#openSearchProcessPopup, #actionSearchdialogModal").data("kendoWindow");
    window.close();

    if (selectedItem != undefined) {
        if (jQuery.isFunction(eval(actionName))) {
            var setAction = actionName + "(" + JSON.stringify(selectedItem) + ");"
            eval(setAction);
        }
    }
};

if (Moj.isTrue(MojFind("#ProcessSearchModel_IsReport").val())) //reports view
    MojFind("#DistrictId").change();