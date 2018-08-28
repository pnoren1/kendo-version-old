

function onSearchFeeRequestHearingsRequestEnd(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    if (!Moj.isTrue(MojFind("#IsForDocuments").val()))
    {
        if (e.response != undefined) {
            if (e.response.Total == 1) {
                var id = e.response.Data[0].FeeRequestId;
                var advcoateFirstName = e.response.Data[0].AdvcoateFirstName;
                var advocateLastName = e.response.Data[0].AdvocateLastName;

                PDO.addFeeRequestHearingTabById(id, advocateLastName, advcoateFirstName);
            }
        }
    }
}

onStateChenged = function () {
    var stateId = MojControls.AutoComplete.getValueById("feeRequestCommonSearchCriteria_FeeRequestHandlingStateId");
    if (stateId == FeeRequestHandlingState.Nominator) {
        MojFind("#feeRequestCommonSearchCriteria_FeeRequestLineStatusSupervisorId").enable(true);

        if (MojFind("#DefaultFeeRequestLineStatusSupervisor").val() != "")
        {
            var defaultFeeRequestLineStatusSupervisor = parseInt(MojFind("#DefaultFeeRequestLineStatusSupervisor").val());
            MojControls.AutoComplete.setValueById("feeRequestCommonSearchCriteria_FeeRequestLineStatusSupervisorId", defaultFeeRequestLineStatusSupervisor);
        }
    }
    else {
        MojFind("#feeRequestCommonSearchCriteria_FeeRequestLineStatusSupervisorId").enable(false);
        MojControls.AutoComplete.clearSelectionById("feeRequestCommonSearchCriteria_FeeRequestLineStatusSupervisorId");
    }

    Moj.safePost("/FeeRequest/GetFeeRequestLineStatuses", { feeRequestHandlingStateId: stateId }, function (data) {
        if (data.FeeRequestLineStatuses != null)
            MojControls.AutoComplete.setDataSource("feeRequestCommonSearchCriteria_FeeRequestLineStatusId", data.FeeRequestLineStatuses);

    });
   
};

setStateDefault = function () {
    
    var defualtValue = MojFind("#DefaultFeeRequestHandlingState").val();
    if (defualtValue != "")
    {
        var defaultFeeRequestHandlingState = parseInt(defualtValue);
        MojControls.AutoComplete.setValueById("feeRequestCommonSearchCriteria_FeeRequestHandlingStateId", defaultFeeRequestHandlingState);
    }
    onStateChenged();
};
onSearchFeeRequestHearingReady = function () {
    setStateDefault();
};


setSelectedProcess = function (selectedItem) {
    var processid = selectedItem["ProcessId"];
    MojFind("#feeRequestCommonSearchCriteria_ProcessId").val(processid);
};

enableSearchFeeRequestHearingFields = function (isEnabled) {
    MojFind("#feeRequestCommonSearchCriteria_AssignedTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_AdvocateContactId").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_PdoFileId").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_ProcessTypeId").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_ProcessNumberForDisplay").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_CourtLevelId").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_CourtTypeId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_CourtContactId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestLineStatusId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_StatusUpdateDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_StatusUpdateDateTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeActivityTypeClassificationId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeActivityTypeId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_ActivityDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_ActivityDateTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_AdvocateObjectionId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FormNumber").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_RecivedDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_RecivedDateTo").enable(isEnabled);
    MojFind("#feeRequestHearingSearchCriteria_IsSearchBySubmisssionAdditions").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_IsAssignedToNon").enable(isEnabled);
    


    if (isEnabled)
        MojFind("#feeRequestHearingSearchCriteria_IsSearchBySubmisssionAdditions")[0].removeAttribute("disabled");
    else
        MojFind("#feeRequestHearingSearchCriteria_IsSearchBySubmisssionAdditions")[0].setAttribute("disabled", "");

};


$(document).ready(function () {
    
    MojFind("#pnlSearchFeeRequestHearing").on('keypress', function (e) {
        if (e.keyCode == 13) {
            if (e.target.name == "feeRequestCommonSearchCriteria.FeeRequestId") {
                MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").change();
            }
            MojFind("#btnSearchSearchFeeRequestHearing").click();
        }
    });

    MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").die('change');
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").live('change',function () {
        
        var newValue = $(this).val();

        if (newValue != undefined && newValue != "") {
            enableSearchFeeRequestHearingFields(false);
            Moj.clearFields(undefined, "[id$='pnlSearchFeeRequestHearing']");

            MojFind("#feeRequestHearingSearchCriteria_FeeRequestSubmittedAdditionStatusId").enable(false);
            MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").change();

            MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").val(newValue);
        }
        else {
            enableSearchFeeRequestHearingFields(true);
            setStateDefault();
            }
    });

    MojFind("#feeRequestHearingSearchCriteria_CourtLevelId").change(function () {
        var courtLevelId = MojControls.AutoComplete.getValueById("feeRequestHearingSearchCriteria_CourtLevelId");

        MojControls.AutoComplete.setValueById("feeRequestHearingSearchCriteria_CourtTypeId", "");
        MojControls.AutoComplete.setValueById("feeRequestCommonSearchCriteria_CourtContactId", "");

        Moj.safePost("/FeeRequest/GetCourtPlaces", { courtLevelId: courtLevelId }, function (data) {
            if (data.CourtTypes != null)
                MojControls.AutoComplete.setDataSource("feeRequestHearingSearchCriteria_CourtTypeId", data.CourtTypes);
            if (data.Courts != null)
                MojControls.AutoComplete.setDataSource("feeRequestCommonSearchCriteria_CourtContactId", data.Courts);
        });
    });

    MojFind("#feeRequestHearingSearchCriteria_CourtTypeId").change(function () {
        var courtLevelId = MojControls.AutoComplete.getValueById("feeRequestHearingSearchCriteria_CourtLevelId");
        var courtTypeId = MojControls.AutoComplete.getValueById("feeRequestHearingSearchCriteria_CourtTypeId");

        MojControls.AutoComplete.setValueById("feeRequestCommonSearchCriteria_CourtContactId", "");

        Moj.safePost("/FeeRequest/GetCourtPlaces", { courtLevelId: courtLevelId, courtTypeId: courtTypeId }, function (data) {
            if (data.CourtTypes != null)
                MojControls.AutoComplete.setDataSource("feeRequestHearingSearchCriteria_CourtTypeId", data.CourtTypes);
            if (data.Courts != null)
                MojControls.AutoComplete.setDataSource("feeRequestCommonSearchCriteria_CourtContactId", data.Courts);
        });
    });

    MojFind('#searchFeeRequestHearingPanel .minus').die('click');
    MojFind('#searchFeeRequestHearingPanel .minus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdFeeRequstHearing', 20);
    });

    MojFind('#searchFeeRequestHearingPanel .plus').die('click');
    MojFind('#searchFeeRequestHearingPanel .plus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdFeeRequstHearing', 5);
    });

    MojFind("#btnClearfieldsClearDiv").click(function() {
        
        setStateDefault();
        MojFind("#feeRequestHearingSearchCriteria_FeeRequestSubmittedAdditionStatusId").enable(false);
        enableSearchFeeRequestHearingFields(true);
        MojFind("#feeRequestHearingSearchCriteria_CourtLevelId").change();
        MojFind("#feeRequestHearingSearchCriteria_CourtTypeId").change();
    });

    MojFind("#feeRequestHearingSearchCriteria_IsSearchBySubmisssionAdditions").click(function () {
        
        var isChecked = MojControls.CheckBox.isCheckedById("feeRequestHearingSearchCriteria_IsSearchBySubmisssionAdditions");
        if (Moj.isTrue(isChecked))
        {
            MojFind("#feeRequestHearingSearchCriteria_FeeRequestSubmittedAdditionStatusId").enable(true);
        }
        else
        {
            MojControls.AutoComplete.setValueById("feeRequestHearingSearchCriteria_FeeRequestSubmittedAdditionStatusId");
            MojFind("#feeRequestHearingSearchCriteria_FeeRequestSubmittedAdditionStatusId").enable(false);
        }

    });

    MojFind("#feeRequestCommonSearchCriteria_IsAssignedToNon").click(function () {

        var isChecked = MojControls.CheckBox.isCheckedById("feeRequestCommonSearchCriteria_IsAssignedToNon");
        if (Moj.isTrue(isChecked)) {
            MojFind("#feeRequestCommonSearchCriteria_AssignedTo").enable(false);
            MojControls.AutoComplete.clearSelectionById("feeRequestCommonSearchCriteria_AssignedTo");
        }
        else {
            MojFind("#feeRequestCommonSearchCriteria_AssignedTo").enable(true);
        }


    });

    MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").change(function () {
        onStateChenged();
    });

    MojFind("#btnCancelSearchFeeRequestHearing").click(function () {
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();
    });


    feeRequestHearingSelected = function () {
        //from documents only
        var grid = MojFind("[id^='grdFeeRequstHearing']").data("kendoGrid");
        var myWindow = $("#actionSearchdialogModal").data("kendoWindow");
        myWindow.close();
        if (grid.dataItem(grid.select()) != undefined) {
            var ParentEntityInstanceID = grid.dataItem(grid.select())["FeeRequestId"];
            var ParentEntityInstance = grid.dataItem(grid.select())["FeeRequestId"];
            GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
        }
    }

    MojFind("[id*='grdFeeRequstHearing']").find("#rdbIsSelected").die('click');
    MojFind("[id*='grdFeeRequstHearing']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdFeeRequstHearing");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

});

