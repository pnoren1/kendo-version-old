function SearchTelephoneConnection_RequestEnd(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    }

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


onTelephoneConnectionDetailsInit = function (e) {
    var grid = $("#grid_" + e.data.ShiftId).data("kendoGrid");
    grid.dataSource.data(e.data.Processes);
};

onSearchTelephoneConnectionReady = function () {
    MojFind(".process-id-link-to-telephone").die('click');
    MojFind(".process-id-link-to-telephone").live('click', function (e) {
        var id = $(e.currentTarget).text();
        PDO.addProcessTabById(id, 'NominationTelephoneConnection');
    });




    MojFind(".contact-name-link").die('click');
    MojFind(".contact-name-link").live('click', function (e) {
        //var id = $(e.currentTarget).text();
        //PDO.addProcessTabById(id, 'NominationTelephoneConnection');
        var id = $(e.currentTarget).attr('contactid');
        PDO.addContactTabById(id);
    });
};

$(document).ready(function () {

    MojFind("#btnSearchSearchTelephoneConnection").on("click", function () {
        var grid = MojFind("[id^='grdTelephoneConnectionListByShift']").data("kendoGrid");
        grid.dataSource.page(1);
        grid.dataSource.read(Moj.getGridData());
    });


    MojFind("#btnClearSearchTelephoneConnection").removeAttr('onclick');
    MojFind("#btnClearSearchTelephoneConnection").click(function () {
        Moj.clearFields(btnClearSearchTelephoneConnection);
        enableShiftFields(true);
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

});

