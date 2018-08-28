var ContractRetainerDetails = {

    checkChangeAmount: function () {
        var fromDate = MojFind("#FromDate").val();
        if (fromDate == "") {
            Moj.showErrorMessage(Resources.Messages.NeedFillStartDateInFirst)
            return false
        }
        if (MojFind("#ContractStatusId").val() == ContractStatus.History) {
            if (MojFind("#ContractRetainerForDisplay_AmountPrev").val() != MojFind("#ContractRetainerForDisplay_Amount").val()) {
                if (parseInt(MojFind("#ContractRetainerForDisplay_AmountPrev").val()) < parseInt(MojFind("#ContractRetainerForDisplay_Amount").val())) {
                    Moj.showErrorMessage(Resources.Messages.CanOnlyLessenAmount);
                    return false;
                }
                else if (MojFind("#ContractRetainerForDisplay_RemainderForReduction").val() == 0) {
                    Moj.showErrorMessage(Resources.Messages.CanBeChangedAmountOnlyIfThereAreRemainderForReduction);
                    return false;
                }
                else if (parseInt(MojFind("#ContractRetainerForDisplay_AmountPrev").val()) - parseInt(MojFind("#ContractRetainerForDisplay_Amount").val()) > parseInt(MojFind("#ContractRetainerForDisplay_RemainderForReduction").val())) {
                    Moj.showErrorMessage(String.format(Resources.Messages.TheLessHasToBeToAmountOfRemainderForReduction, parseInt(MojFind("#ContractRetainerForDisplay_AmountPrev").val()) - parseInt(MojFind("#ContractRetainerForDisplay_RemainderForReduction").val())));
                    return false;
                }
                // MojFind("#ContractRetainerForDisplay_RemainderForReduction").val(parseInt(MojFind("#ContractRetainerForDisplay_AmountPrev").val()) - parseInt(MojFind("#ContractRetainerForDisplay_Amount").val()));
            }
        }
        else if (MojFind("#ContractStatusId").val() == ContractStatus.Active) {
            if (parseInt(MojFind("#ContractRetainerForDisplay_Amount").val()) + parseInt(MojFind("#ContractRetainerForDisplay_AmountFromPreviousContracts").val()) <
                   parseInt(MojFind("#ContractRetainerForDisplay_Used").val())) {
                Moj.showErrorMessage(Resources.Messages.AmountAndAmountFromPreviousLessThanUsed);
                return false
            }
        }
        return true;
    },

    calculationCostContract: function () {
        var data = MojFind("[id^='grdContractRetainerList']").data("kendoGrid").dataSource.data();
        $.ajax({
            type: 'POST',
            async :false,
            url: baseUrl + "/PersonAdvocate/CalculationCostContractRetainer",
            data: JSON.stringify({ contractRetainerList: data, startDate: MojFind("#FromDate").val() }),
            success: function (dataRes) {
                if (dataRes.HasRate != undefined && dataRes.HasRate == false) {
                    Moj.showErrorMessage(Resources.Messages.DoesNoRate);
                    for (var i = 0; i < data.length - 1; i++) {
                        data[i].Amount = 0;
                    }
                    MojFind("[id^='grdContractRetainerList']").data("kendoGrid").refresh();
                }
                if (dataRes.NewCost != undefined) {
                    MojControls.TextBox.setValueById("Cost", dataRes.NewCost.toString());
                    MojFind("#ObjectStateContract").val(true);
                    var sumAmount = 0;
                    var sumRemainder = 0;
                    var sumRemainderForReduction = 0;
                    for (var i = 0; i < data.length - 1; i++) {
                        if (MojFind("#ContractStatusId").val() == ContractStatus.History)
                            data[i].RemainderForReduction = data[i].RemainderForReduction - (parseInt(data[i].AmountPrev) - parseInt(data[i].Amount));
                        else
                            data[i].Remainder = parseInt(data[i].Amount) + parseInt(data[i].AmountFromPreviousContracts) - parseInt(data[i].Used);

                        data[i].AmountPrev = data[i].Amount;
                        sumAmount += parseInt(data[i].Amount);
                        sumRemainder += parseInt(data[i].Remainder);
                        sumRemainderForReduction += parseInt(data[i].RemainderForReduction);
                    }
                    data[data.length - 1].Amount = sumAmount;

                    if (MojFind("#ContractStatusId").val() == ContractStatus.History)
                        data[data.length - 1].RemainderForReduction = sumRemainderForReduction;
                    else
                        data[data.length - 1].Remainder = sumRemainder;
                    MojFind("[id^='grdContractRetainerList']").data("kendoGrid").refresh();
                }
            },
            contentType: "application/json; charset=utf-8",
        });

       
    },
}
