

onNominationContactDetailsInit = function (e) {
    var grid = $("#grid_" + e.data.ContactId).data("kendoGrid");
    grid.dataSource.data(e.data.Processes);
};

onNominationShiftDetailsInit = function (e) {
    var grid = $("#grid_" + e.data.ShiftId).data("kendoGrid");
    grid.dataSource.data(e.data.Processes);
};

onNominationProcessNumberForDisplayDetailsInit = function (e) {
    var grid = $("#grid_" + e.data.ID).data("kendoGrid");
    grid.dataSource.data(e.data.Processes);
};

setSearchButtonsVisibility = function () {
    var selectedValue = MojControls.RadioButton.getValueById('SearchCriteria_GroupByIndex');
    if (selectedValue == GroupByIndexex.Shift) {
        MojFind("[groupby='shift']").removeClass('hide');
        MojFind("[groupby='processNumberForDisplay']").addClass('hide');
        MojFind("[groupby='contact']").addClass('hide');
        MojFind("[groupby='process']").addClass('hide');


        MojControls.Grid.clear('grdNominationsListByShift');
    }

    else if (selectedValue == GroupByIndexex.Contact) {
        MojFind("[groupby='shift']").addClass('hide');
        MojFind("[groupby='processNumberForDisplay']").addClass('hide');
        MojFind("[groupby='contact']").removeClass('hide');
        MojFind("[groupby='process']").addClass('hide');

        MojControls.Grid.clear('grdNominationsListByContact');
    }

    else if (selectedValue == GroupByIndexex.Process) {
        MojFind("[groupby='shift']").addClass('hide');
        MojFind("[groupby='contact']").addClass('hide');
        MojFind("[groupby='processNumberForDisplay']").addClass('hide');
        MojFind("[groupby='process']").removeClass('hide');

        MojControls.Grid.clear('grdNominationsListByProcess');
    }

    else if (selectedValue == GroupByIndexex.ProcessNumberForDisplay) {
        MojFind("[groupby='shift']").addClass('hide');
        MojFind("[groupby='contact']").addClass('hide');
        MojFind("[groupby='process']").addClass('hide');
        MojFind("[groupby='processNumberForDisplay']").removeClass('hide');

        MojControls.Grid.clear('grdNominationsListByProcessNumberForDisplay');
    }
};

enableShiftFields = function (isEnable) {
    MojFind("#SearchCriteria_ShiftTypeId").enable(isEnable);
    MojFind("#SearchCriteria_ShiftAdvocateContactId").enable(isEnable);
    MojFind("#SearchCriteria_ShiftConfigurationId").enable(isEnable);
    MojFind("#SearchCriteria_ShiftDateFrom").enable(isEnable);
    MojFind("#SearchCriteria_ShiftDateTo").enable(isEnable);

    if (!isEnable) {
        MojControls.AutoComplete.clearSelectionById("SearchCriteria_ShiftTypeId");
        MojControls.AutoComplete.clearSelectionById("SearchCriteria_ShiftAdvocateContactId");
        MojControls.AutoComplete.clearSelectionById("SearchCriteria_ShiftConfigurationId");
        MojControls.DateTimePicker.setValueById("SearchCriteria_ShiftDateFrom", "");
        MojControls.DateTimePicker.setValueById("SearchCriteria_ShiftDateTo", "");

    }
};

setSelectedApplicant = function (selectedItem) {
    var contactId = selectedItem["ContactId"];
    var firstName = selectedItem["FirstName"];
    var lastName = selectedItem["LastName"];
    MojFind("#SearchCriteria_ApplicantContactId").val(contactId);
    MojFind("#SearchCriteria_ApplicantName").val(lastName + " " + firstName);
};

onClearButtonClicked = function (groupId, setDefaultNominator) {
    
    MojFind("#SearchCriteria_ShiftYesNoId").change();
    MojFind("#SearchCriteria_ApplicantName").text("");
    MojFind("#SearchCriteria_ProcessCategoryId").change();

    if (setDefaultNominator == true) {
        
        var defaultNominatorId = MojFind("#DefaultNominatorId").val();
        if (defaultNominatorId != "") {
            MojControls.AutoComplete.setValueById("SearchCriteria_NominatorId", defaultNominatorId);
        }
    }
    if (groupId != undefined) {
        MojControls.RadioButton.setValueById('SearchCriteria_GroupByIndex', groupId);
        setSearchButtonsVisibility();
    }
};

onSearchNominationsDocumentReady = function () {
    MojFind(".process-id-link").die('click');
    MojFind(".process-id-link").live('click', function (e) {
        var id = $(e.currentTarget).text();
        PDO.addProcessTabById(id, 'NominationGeneralDetails');
    });
    MojFind(".contact-name-link").die('click');
    MojFind(".contact-name-link").live('click', function (e) {
        var id = $(e.currentTarget).attr('contactid');
        PDO.addContactTabById(id);
    });


    MojFind("#SearchCriteria_ProcessCategoryId").change(function () {
        var processCategoryId = MojControls.AutoComplete.getValueById("SearchCriteria_ProcessCategoryId");
        Moj.safeGet("/Nominations/GetProcessTypesByProcessCategoryId?processCategoryId=" + processCategoryId, undefined, function (data) {
            MojControls.AutoComplete.setDataSource("SearchCriteria_ProcessTypeId", data.ProcessTypes);
        });
    });


    MojFind("#pnlSearchProcessesForNomination").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("[groupby]:not(.hide) #btnSearchSearchProcessesForNomination").click();
            return false;
        }
    });

    MojFind('#btnClearSearchProcessesForNomination').removeAttr('onclick');

    MojControls.RadioButton.setValueById('SearchCriteria_GroupByIndex', GroupByIndexex.Process);
    setSearchButtonsVisibility();

    MojFind("[id*='SearchCriteria_GroupByIndex']").change(function () {
        setSearchButtonsVisibility();
    });

    MojFind("#SearchCriteria_ShiftYesNoId").change(function () {
        var shiftYesNoId = MojControls.AutoComplete.getValueById("SearchCriteria_ShiftYesNoId");
        if (shiftYesNoId == YesNoEnum.No) {
            enableShiftFields(false);
        }
        else {
            enableShiftFields(true);
        }
    });


    MojFind('#searchNominationsPanel  .minus').die('click');
    MojFind('#searchNominationsPanel  .minus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdNominationsListByProcess', 22);
        MojControls.Grid.setPageSizeById('grdNominationsListByShift', 22);
        MojControls.Grid.setPageSizeById('grdNominationsListByContact', 22);


    })

    MojFind('#searchNominationsPanel  .plus').die('click');
    MojFind('#searchNominationsPanel  .plus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdNominationsListByProcess', 10);
        MojControls.Grid.setPageSizeById('grdNominationsListByShift', 10);
        MojControls.Grid.setPageSizeById('grdNominationsListByContact', 10);


    })


    //MojFind('#searchNominationsPanel .minus').die('click');
    //MojFind('#searchNominationsPanel .minus').live('click', function () {
    //    MojControls.Grid.setPageSizeById('grdNominationsListByShift', 15);
    //    MojControls.Grid.setPageSizeById('grdNominationsListByContact', 15);
    //    MojControls.Grid.setPageSizeById('grdNominationsListByProcess', 15);
    //})

    //MojFind('#searchNominationsPanel .plus').die('click');
    //MojFind('#searchNominationsPanel .plus').live('click', function () {
    //    MojControls.Grid.setPageSizeById('grdNominationsListByShift', 5);
    //    MojControls.Grid.setPageSizeById('grdNominationsListByContact', 5);
    //    MojControls.Grid.setPageSizeById('grdNominationsListByProcess', 5);
    //})

    MojFind("#btnClearSearchProcessesForNomination").click(function () {
        var selectedValue = MojControls.RadioButton.getValueById('SearchCriteria_GroupByIndex');
        Moj.clearFields(undefined, "[id='searhcNominationCriteriaArea']")
        onClearButtonClicked(selectedValue,true);
    });

    MojFind("#btnSearchContact").click(function () {
        PDO.openSearchApplicantPopup("setSelectedApplicant");
    });

    MojFind("#SearchCriteria_ApplicantContactId").change(function () {
        var applicantContactId = MojFind("#SearchCriteria_ApplicantContactId").val();
        Moj.safeGet("/Nominations/GetApplicantContactNameById?applicantContatId=" + applicantContactId, undefined, function (data) {
            if (data.PersonName != undefined) {
                MojFind("#SearchCriteria_ApplicantName").val(data.PersonName);
            }
            else {
                MojFind("#SearchCriteria_ApplicantName").val("");
            }
        });
    });

    MojFind("td div.criminal-case-process").die('click');
    MojFind("td div.criminal-case-process").live('click', function () {
        //get the warning contact id and show message
        var warningContactId_td = $($(this).closest('tr').find('td')[10]);
        var contactId = warningContactId_td.find('div').text();
        if (contactId == "")
            contactId = warningContactId_td.text();

        if (contactId != "") {
            Moj.confirm(Resources.Messages.WrnNewSearch, function () {
                //MojFind("#btnClearSearchProcessesForNomination").click();
                Moj.clearFields(undefined, "[id='searhcNominationCriteriaArea']");
                onClearButtonClicked(GroupByIndexex.Contact,false);
                MojFind("#SearchCriteria_ApplicantContactId").val(contactId);
                MojFind("#SearchCriteria_ApplicantContactId").change();
                MojFind("[groupby='contact'] #btnSearchSearchProcessesForNomination").click();
            });
        }
    });


};


