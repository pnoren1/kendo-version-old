var ContractHoursDetails = {

    checkChangeAmount: function () {
        var flag = true;
        var processId = MojFind("#ContractHoursForDisplay_ProcessId").val();

        if (MojControls.Common.IsDigits(processId)) {
            // jQuery.ajaxSetup({ async: false });
            $.ajax({
                url: baseUrl + "/PersonAdvocate/checkAdvocateNominationInProcess",
                type: "get",
                async: false,
                data: { processId: processId },
                contentType: 'application/json',
                success: function (data) {
                    if (data.Error != undefined) {
                        Moj.showErrorMessage(data.Error)
                        flag = false;
                    }
                    else {
                        MojFind("#ContractHoursForDisplay_ProcessNumberForDisplay").val(data.ProcessNumberForDisplay);
                        MojFind("#ContractHoursForDisplay_ProcessIdToLink").val(processId);
                        flag = true;
                    }
                },

            });         
        }
        else {
            MojFind("#ContractHoursForDisplay_ProcessNumberForDisplay").val("");
            MojFind("#ContractHoursForDisplay_ProcessIdToLink").val("");
            flag = true;
        }
        return flag;
     
    },

    calculationCostContract: function () {
        var data = MojFind("[id^='grdContractHoursList']").data("kendoGrid").dataSource.data();

       // data[0].Remainder = data[0].Amount - data[0].Used;
        MojFind("#ObjectStateContract").val(true);
        MojFind("[id^='grdContractHoursList']").data("kendoGrid").refresh();

    }, 
}

$(document).ready(function () {

});