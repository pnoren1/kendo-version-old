var ContractDetails = {


    prevFromDate: MojFind("#FromDate").val(),

    prevToDate: MojFind("#ToDate").val(),

    SaveContract: function (data) {
        if (data != null && data.ActionResult != null) {
            if (data.ActionResult.Error.length > 0) {
                Moj.showErrorMessage(data.ActionResult.Error, function () {
                    return false;
                });
            } else {
                if (data.ActionResult.IsChange) {
                    PDO.afterSaveEntityContentTab(data.EntityInfo);
                }
                else {
                    MojFind('#DetailsContent').empty();
                    Moj.replaceDivs("#DetailsContent", "#ListContent");
                }
            }
        }
    },

    CheckValidContractDate: function () {

        Moj.callActionWithJson("frmContractDetails", "/PersonAdvocate/CheckContractDate", function (data) {
            if (data.Error != undefined && data.Error.length > 0) {
                Moj.showErrorMessage(data.Error)
                MojFind("#FromDate").val(ContractDetails.prevFromDate)
                MojFind("#ToDate").val(ContractDetails.prevToDate)
            }
            else {
                ContractDetails.prevFromDate = MojFind("#FromDate").val()
                ContractDetails.prevToDate = MojFind("#ToDate").val()
            }
        });
    },

};


$(document).ready(function () {

    MojFind("#EmploymentTypeId").change(function () {

        if (MojFind("#AdvocateContractTypeId").val() == AdvocateContractType.Readings) {
            if (MojFind('[name="ContractReadingsList[0].Used"]').val() > 0) //אם יש ניצול בגריד
            {
                MojControls.AutoComplete.setValueById("EmploymentTypeId", MojFind("#OriginalEmploymentTypeId").val());
                Moj.showErrorMessage(Resources.Messages.ErrChangeEmploymentTypeContractReadingUsedGreatherThanZero);
            }
        }

    });


    if (MojFind("#AdvocateContractId").val() == 0) {
        MojControls.DateTimePicker.setValueById("FromDate", null);
        MojControls.DateTimePicker.setValueById("ToDate", null);
    }

    MojFind("#FromDate").change(function (e) {
        if (MojFind("#FromDate").val() != "") {
            if (MojFind("#AdvocateContractTypeId").val() != AdvocateContractType.Hours) {
                ContractDetails.CheckValidContractDate();
            }
            else {
                var year = MojFind("#FromDate").val().substring(MojFind("#FromDate").val().lastIndexOf("/") + 1, MojFind("#FromDate").val().length);
                MojControls.AutoComplete.setValueById("ContractYearId", year)
            }
        }
    });

    MojFind("#ToDate").die("change");
    MojFind("#ToDate").live("change", function (e) {
        if (MojFind("#AdvocateContractTypeId").val() != AdvocateContractType.Hours && MojFind("#ToDate").val() != "" && MojFind("#ToDate").valid()) {
            ContractDetails.CheckValidContractDate();
        }
    });

    MojFind("#AdvocateContractTypeId").change(function () {
        if (MojFind("#AdvocateContractTypeId").val() != "") {
            MojFind("#AdvocateContractTypeDetailsDiv").load(baseUrl + "/PersonAdvocate/ContractTypeDetails", { advocateContractId: null, contractTypeId: MojFind("#AdvocateContractTypeId").val() })
            if (MojFind("#AdvocateContractTypeId").val() != AdvocateContractType.Hours) {
                MojFind("#ContractYearId").enable(true);
                MojFind("#MerkavaCode").enable(false);
                MojFind("#BudgetProtocolNumber").enable(false);
                MojFind("#FromDate").enable(false);
                MojFind("#ToDate").enable(false);
            }
            else {
                if (MojFind("#EmploymentTypeId").val() == 0) {
                    MojFind("#EmploymentTypeId").enable(true);

                }
                MojFind("#ContractYearId").enable(false);
                MojFind("#MerkavaCode").enable(true);
                MojFind("#BudgetProtocolNumber").enable(true);
                MojFind("#FromDate").enable(true);
                MojFind("#ToDate").enable(true);
            }

            MojControls.AutoComplete.clearSelectionById("ContractYearId");
            MojControls.DateTimePicker.setValueById("FromDate", null);
            MojControls.DateTimePicker.setValueById("ToDate", null);
            MojControls.TextBox.setValueById("MerkavaCode", "");
            MojControls.TextBox.setValueById("BudgetProtocolNumber", "");
        }
        else {
            MojFind("#ContractYearId").enable(false);
            MojFind("#MerkavaCode").enable(false);
            MojFind("#BudgetProtocolNumber").enable(false);
            MojFind("#FromDate").enable(false);
            MojFind("#ToDate").enable(false);
            MojFind("#EmploymentTypeId").enable(false);
            MojControls.AutoComplete.clearSelectionById("ContractYearId");
            MojControls.DateTimePicker.setValueById("FromDate", null);
            MojControls.DateTimePicker.setValueById("ToDate", null);
            MojControls.TextBox.setValueById("MerkavaCode", "");
            MojControls.TextBox.setValueById("BudgetProtocolNumber", "");
            MojFind("#AdvocateContractTypeDetailsDiv").empty()
        }
    });

    MojFind("#ContractYearId").change(function () {
        if (MojFind("#EmploymentTypeId").val() == 0) {
            MojFind("#EmploymentTypeId").enable(true);
        }
        MojFind("#MerkavaCode").enable(true);
        MojFind("#BudgetProtocolNumber").enable(true);
        if (MojFind("#ContractYearId").val() != 0) {
            Moj.safeGet("/PersonAdvocate/GetDefaultDate", { advocateContractTypeId: MojFind("#AdvocateContractTypeId").val(), year: MojFind("#ContractYearId").val() }, function (data) {
                if (data.Error != undefined) {
                    Moj.showErrorMessage(data.Error)
                }
                else {
                    MojFind("#FromDate").data("kendoDatePicker").value(data.fromDate);
                    MojFind("#ToDate").data("kendoDatePicker").value(data.toDate);
                    ContractDetails.prevFromDate = MojFind("#FromDate").val();
                    ContractDetails.prevToDate = MojFind("#ToDate").val();
                    MojFind("#FromDate").enable(true);
                    MojFind("#ToDate").enable(true);
                }
            });
        }
        else {
            MojFind("#FromDate").enable(false);
            MojFind("#ToDate").enable(false);
            MojFind("#FromDate").data("kendoDatePicker").value("");
            MojFind("#ToDate").data("kendoDatePicker").value("");
            ContractDetails.prevFromDate = MojFind("#FromDate").val();
            ContractDetails.prevToDate = MojFind("#ToDate").val();
        }
    });

    MojFind("#btnActionContractDetails").click(function () {
        if (MojFind("#ObjectStateEmploymentTypeId").val() == "true" && MojControls.AutoComplete.getValueById("EmploymentTypeId") != MojFind("#OriginalEmploymentTypeId").val())
        {
            MojFind("#ObjectStateContract").val(true);

            if (MojFind("#AdvocateContractTypeId").val() == AdvocateContractType.Retainer) {

                if (MojFind("#ContractStatusId").val() == ContractStatus.Active || MojFind("#ContractStatusId").val() == ContractStatus.History) {
                    //אם יש ניצול בגריד
                    if (MojFind('[name="ContractRetainerList[0].Used"]').val() > 0 || MojFind('[name="ContractRetainerList[1].Used"]').val() > 0 || MojFind('[name="ContractRetainerList[2].Used"]').val() > 0) {
                        Moj.confirm(Resources.Messages.EmploymentTypeChange, function () {
                            MojFind("#btnActionContractDetails").submit();
                        });
                    }
                    else
                    {
                        Moj.confirm("צורת העסקה שונתה, האם ברצונך להמשיך?", function () {
                            MojFind("#btnActionContractDetails").submit();
                        });
                    }
                   
                    return false;
                }

            }
        }
          

    });
});