$(document).ready(function () {
    debugger;
    

    onSearchSuccess = function () {
        debugger;
        if (Moj.isTrue(MojFind("#frmShiftsListReportProductionForAdvocate").valid()))
            Moj.HtmlHelpers._onSearchButtonClicked('grdShiftsReport', 'btnShiftsListReportProductionForAdvocate');
    }

    MojFind("#btnClearShiftsListReportProductionForAdvocate").removeAttr('onclick');
    MojFind("#btnClearShiftsListReportProductionForAdvocate").click(function () {
        debugger;
        Moj.clearFields(undefined, "[id$='frmShiftsListReportProductionForAdvocate']");
        MojControls.Grid.clear('grdShiftsReport');
        MojFind("#frmShiftsListReportProductionForAdvocate").clearValidationErrors();
    }),

    MojFind("#ShiftTypesSelection").change(function () {
        
        if (MojFind("#ShiftTypesSelection").val() == null)
            resetShiftConfiguration();
        else
        {
            
            var postData = { shiftTypes: MojFind("#ShiftTypesSelection").val().map(Number) };
            $.ajax({
                type: "POST",
                url: "/Shift/GetShiftConfigurationsByShiftTypes",
                data: postData,
                success: function (data) {
                    
                    if (data.ShiftConfigurations != null)
                    {
                        MojControls.MultiDropDown.clearAll("ShiftConfigurationsSelection");
                        MojFind("#ShiftConfigurationsSelection").data("kendoMultiSelect").enable(true);
                        MojControls.MultiDropDown.setDataSource("ShiftConfigurationsSelection", data.ShiftConfigurations);
                    }
                    else
                        resetShiftConfiguration();

                },
                dataType: "json",
                traditional: true
            });

        }


            
    });

    resetShiftConfiguration = function () {
        debugger;
        MojControls.MultiDropDown.clearAll("ShiftConfigurationsSelection");
        MojFind("#ShiftConfigurationsSelection").data("kendoMultiSelect").enable(false);
        MojControls.MultiDropDown.setDataSource("ShiftConfigurationsSelection", null);
    };


    afterReportCreateAndSend = function (data) {
        

        if (data.Error != undefined)
            Moj.showMessage("שגיאה", undefined, Resources.Strings.Error, MessageType.Error);
        else
        {
            if (data.Response == null)
                Moj.showMessage(Resources.Messages.ErrNotSendAssignmentLetters, undefined, Resources.Strings.Error, MessageType.Error);
            else 
                Moj.showMessage(String.format(Resources.Messages.SentAssignmentLettersMessage, data.Response), undefined, Resources.Strings.Message, MessageType.Alert);
        }
    };

});