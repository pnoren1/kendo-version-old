setSelectedProcess = function (selectedItem) {
    var processid = selectedItem["ProcessId"];
    MojFind("#feeRequestCommonSearchCriteria_ProcessId").val(processid);
};

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
    if (defualtValue != "") {
        var defaultFeeRequestHandlingState = parseInt(defualtValue);
        MojControls.AutoComplete.setValueById("feeRequestCommonSearchCriteria_FeeRequestHandlingStateId", defaultFeeRequestHandlingState);
    }
    onStateChenged();
};

onSearchFeeRequestShiftsCallsReady = function () {
    setStateDefault();
};

MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").change(function () {
    onStateChenged();
});


MojFind("#btnClearfieldsClearDiv").click(function () {
    setStateDefault();
    enableSearchFeeRequestShiftCallsFields(true);
});

enableSearchFeeRequestShiftCallsFields = function (isEnabled) {
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_AssignedTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_AdvocateContactId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_ActivityDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_ActivityDateTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeActivityTypeId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_CourtContactId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestLineStatusId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_StatusUpdateDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_StatusUpdateDateTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FeeActivityTypeClassificationId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_AdvocateObjectionId").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_FormNumber").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_RecivedDateFrom").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_RecivedDateTo").enable(isEnabled);
    MojFind("#feeRequestCommonSearchCriteria_IsAssignedToNon").enable(isEnabled);



    
};

MojFind("#pnlSearchFeeRequestShiftsCalls").on('keypress', function (e) {
    if (e.keyCode == 13) {
        if (e.target.name == "feeRequestCommonSearchCriteria.FeeRequestId") {
            MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").change();
        }
        MojFind("#btnSearchSearchFeeRequestShiftsCalls").click();
    }
});

MojFind('#searchFeeRequestShiftsCallsPanel .minus').die('click');
MojFind('#searchFeeRequestShiftsCallsPanel .minus').live('click', function () {
    MojControls.Grid.setPageSizeById('grdFeeRequstShiftsCalls', 20);
});

MojFind('#searchFeeRequestShiftsCallsPanel .plus').die('click');
MojFind('#searchFeeRequestShiftsCallsPanel .plus').live('click', function () {
    MojControls.Grid.setPageSizeById('grdFeeRequstShiftsCalls', 5);
});


MojFind("#btnCancelSearchFeeRequestShiftCall").click(function () {
    var window = $("#actionSearchdialogModal").data("kendoWindow");
    window.close();
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

MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").die('change');
    MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").live('change',function () {
        var newValue = $(this).val();

        if (newValue != undefined && newValue != "") {
            enableSearchFeeRequestShiftCallsFields(false);
            Moj.clearFields(undefined, "[id$='pnlSearchFeeRequestShiftsCalls']");

            MojFind("#feeRequestCommonSearchCriteria_FeeRequestHandlingStateId").change();

            MojFind("#feeRequestCommonSearchCriteria_FeeRequestId").val(newValue);
        }
        else {
            enableSearchFeeRequestShiftCallsFields(true);
            setStateDefault();
            }
    });

    feeRequestShiftCallSelected = function () {
        //from documents only
        var grid = MojFind("[id^='grdFeeRequstShiftsCalls']").data("kendoGrid");
        var myWindow = $("#actionSearchdialogModal").data("kendoWindow");
        myWindow.close();
        if (grid.dataItem(grid.select()) != undefined) {
            var ParentEntityInstanceID = grid.dataItem(grid.select())["FeeRequestId"];
            var ParentEntityInstance = grid.dataItem(grid.select())["FeeRequestId"];
            GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
        }
    }

    MojFind("[id*='grdFeeRequstShiftsCalls']").find("#rdbIsSelected").die('click');
    MojFind("[id*='grdFeeRequstShiftsCalls']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdFeeRequstShiftsCalls");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

function RequestEndGrdFeeRequstShiftsCalls(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    if (!Moj.isTrue(MojFind("#IsForDocuments").val()))
    {
        if (e.response != undefined) {
            if (e.response.Total == 1) {
                var id = e.response.Data[0].FeeRequestId;
                var advcoateFirstName = e.response.Data[0].AdvcoateFirstName;
                var advocateLastName = e.response.Data[0].AdvocateLastName;

                PDO.addFeeRequestShiftCallTabById(id, advocateLastName, advcoateFirstName);
            }
        }
    }
    
}

