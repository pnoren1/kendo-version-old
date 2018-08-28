var ContractReadingsDetails = {

    checkChangeAmount: function () {
        var fromDate = MojFind("#FromDate").val();
        if (fromDate == "") {
            Moj.showErrorMessage(Resources.Messages.NeedFillStartDateInFirst)
            return false
        }
        if (parseInt(MojFind("#ContractReadingsForDisplay_Amount").val()) <
            parseInt(MojFind("#ContractReadingsForDisplay_Used").val())) {
            Moj.showErrorMessage(Resources.Messages.AmountLessThanUsed);
            return false
        }
        //MojFind("#ContractReadingsForDisplay_Remainder").val(parseInt(MojFind("#ContractReadingsForDisplay_Amount").val()) - parseInt(MojFind("#ContractReadingsForDisplay_Used").val()))
        return true;
    },

    calculationCostContract: function () {
        var data = MojFind("[id^='grdContractReadingsList']").data("kendoGrid").dataSource.data();
        $.ajax({
            type: 'POST',
            url: baseUrl + "/PersonAdvocate/CalculationCostContractReadings",
            data: JSON.stringify({ contractReadingsList: data, startDate: MojFind("#FromDate").val() }),
            success: function (dataRes) {
                if (dataRes.HasRate != undefined && dataRes.HasRate == false) {
                    Moj.showErrorMessage(Resources.Messages.DoesNoRate);
                    data[0].Amount = 0;
                    data[0].Remainder = 0;
                    MojFind("[id^='grdContractReadingsList']").data("kendoGrid").refresh();
                }
                if (dataRes.NewCost != undefined) {
                    MojControls.TextBox.setValueById("Cost", dataRes.NewCost.toString());
                    data[0].Remainder = data[0].Amount - data[0].Used;
                    MojFind("#ObjectStateContract").val(true);
                    MojFind("[id^='grdContractReadingsList']").data("kendoGrid").refresh();
                }
            },
            contentType: "application/json; charset=utf-8",
        });


    },

}