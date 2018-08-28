
var isParentProcessSearch = false;

function isNominationGroundContinued(isContinued, nominationGroundId) {
    if (Moj.isTrue(isContinued) && !Moj.isEmpty(nominationGroundId)) {
        MojControls.AutoComplete.setValue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId"), NominationGroundStatus.Eligible);
        MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusReasonId").enable(false);
        MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").enable(true);
        //MojFind("#HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds").enable(true);
        MojControls.AutoComplete.setValue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId"), nominationGroundId);
        if (Moj.isEmpty(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val())) {
            //MojControls.CheckBox.setValueById("HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds", true);
            //MojFind("#" + self.getFieldPrefix() + "DisplayAllNominationGrounds").click()
            //displayAllNominationGrounds(true, undefined, undefined, "HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId", nominationGroundId, false);
        }
           
    }

    MojFind("#NominationGroundContinuedLable").visible(isContinued);
    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_IsNominationGroundContinued").val(isContinued);
};

function NominationGroundContinuedTreatment(onTabLoad) {
    //if (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == "" || MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == 0 || Moj.isTrue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_IsNominationGroundContinued").val())) {
    if (!MojFind("#SearchPreviousProcessGridDiv").hasClass("hide")) {
        var isProcessChecked = false;
        var nominationGroundId = false;

        if (MojFind("[id*='grdPreviousProcessList']") != undefined) {
            var grid = MojFind("[id*='grdPreviousProcessList']").data("kendoGrid");
            if (grid != undefined) {
                grid.tbody.find('tr').each(function () {
                    if (grid.dataItem(this) != undefined) {
                        var rowData = grid.dataSource.data()[$(this).index()];
                        if (rowData.IsChecked) {
                            isProcessChecked = true;
                            nominationGroundId = rowData.NominationGroundId;
                        }
                    }
                });
            }
        }
        if (!isProcessChecked) {
            if (MojFind("[id*='grdParentProcessList']") != undefined) {
                grid = MojFind("[id*='grdParentProcessList']").data("kendoGrid");
                if (grid != undefined) {
                    if (grid.dataSource.total() > 0) {
                        grid.tbody.find('tr').each(function () {
                            if (grid.dataItem(this) != undefined) {
                                var rowData = grid.dataSource.data()[$(this).index()];
                                if (rowData.IsChecked) {
                                    isProcessChecked = true;
                                    nominationGroundId = rowData.NominationGroundId;
                                }
                            }
                        });
                    }

                }
            }
        }

        if (isProcessChecked) {
            if (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == nominationGroundId && Moj.isFalse(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_IsNominationGroundContinued").val()))
                isNominationGroundContinued(true);
            else {
                if ((MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == "" || MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == 0) && !Moj.isEmpty(nominationGroundId) && onTabLoad)
                    isNominationGroundContinued(true, nominationGroundId);
                else if (Moj.isTrue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_IsNominationGroundContinued").val()) && (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() != nominationGroundId || MojControls.AutoComplete.getValueById("HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId") != NominationGroundStatus.Eligible))
                    isNominationGroundContinued(false);
            }

        }
        else {
            isNominationGroundContinued(false);
        }
    }
    //}
};

function shiftTreatment() {
    if (MojFind("#ProcessDetailsModel_DisplayFields_ShiftId").val() != FieldDisplayOption.NotDisplayed) {
        if (!Moj.isEmpty(MojFind("#ProcessDetailsModel_ShiftAdvocateId").val()) || !Moj.isEmpty(MojFind("#ProcessDetailsModel_NonShiftAdvocateContactId").val())) {
            MojControls.AutoComplete.setValue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId"), NominationGroundStatus.Eligible);
            MojControls.ComboBox.clearComboBox(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusReasonId"), false);
            MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").enable(false);
            MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").enable(true);
        }
        else
            MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").enable(true);
    }
    else if(Moj.isEmpty(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").val()))
        MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").enable(true);

};

function HearingsAndEligibilityBeforeExit() {
    var validate = MojFind("#AllProcessDetailsDiv").closest("form").validate();
    var divName = "ParentProcessSearchDiv";
    var isValid = true;
    var isParentProcessSearchExist = MojFind("#ParentProcessSearchDiv").length > 0 && !MojFind("#ParentProcessDiv").hasClass("hide") && !MojFind("#ParentProcessSearchDiv").hasClass("hide");
    if (isParentProcessSearchExist) {
        MojFind("#" + divName).find("input").each(function () {
            if (validate.element($(this)) != undefined)
                isValid = isValid & $(this).valid();
        });
    }

    if (isValid && !MojFind("#NominationGroundsDiv").hasClass("hide")) {
        divName = "NominationGroundsDiv";
        MojFind("#" + divName).find("input").each(function () {
            if (validate.element($(this)) != undefined)
                isValid = isValid & $(this).valid();
        });
    }

    if (isValid) {
        if (isParentProcessSearchExist) {
            if (isParentProcessSearch == false) {
                Moj.showErrorMessage(Resources.Messages.WrnSearchParentProcess);
                return false;
            }
        }
        //if (!MojFind("#HearingsDiv").hasClass("hide") && MojFind("#HearingsDiv").find("[id^='grdHearingsList']").data("kendoGrid").dataSource.total() == 0) {
        //    return confirm(Resources.Messages.WrnFutureHearingEmpty);
            //Moj.confirm(Resources.Messages.WrnFutureHearingEmpty, function () {
            //    isNext = true;
            //}, "", function () {
            //    isNext = false;
            //    return false
            //}, "", true, Resources.Strings.Yes, Resources.Strings.No);
        //}
    }
};

//if (MojFind("#ProcessDetailsModel_DisplayFields_FutureHearings").val() == FieldDisplayOption.NotDisplayed)
//    MojFind("#HearingsDiv").addClass("hide");

if (MojFind("#SearchPersonResult_ApplicantContactId").val() == 0 || Moj.isFalse(MojFind("#HearingsAndEligibilityModel_IsAppealProcess").val())) {// || MojFind("#ProcessId").val() != 0) {
    MojFind("#ParentProcessDiv").addClass("hide");
}
else if (Moj.isTrue(MojFind("#HearingsAndEligibilityModel_IsAppealProcess").val()))
    MojFind("#ParentProcessDiv").removeClass("hide");

NominationGroundContinuedTreatment(true);

shiftTreatment();
//TODO אם עילת המינוי ריקה והפניה קשורה לתורנות 


$(document).ready(function () {

    MojFind("#HearingsAndEligibilityModel_ParentProcessTypeID").change(function (e) {
        isParentProcessSearch = false;
    });

    MojFind("#HearingsAndEligibilityModel_ParentCourtNoID").change(function (e) {
        isParentProcessSearch = false;
    });

    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").die('change');
    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").live('change', function (e) {
        NominationGroundContinuedTreatment(false);
    });

    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").die('change');
    MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundStatusId").live('change', function (e) {
        NominationGroundContinuedTreatment(false);
    });

    MojFind("[id*='grdParentProcessList']").find("#chbIsChecked").die('click');

    MojFind("[id*='grdParentProcessList']").find("#chbIsChecked").live('click', function () {
        if ($(this).attr("readonly") != undefined && $(this).attr("disabled") != undefined)
            return;
        if (this.checked) {
            var grid = MojFind("[id*='grdParentProcessList']").data("kendoGrid");
            var tr = $(this).closest("tr");
            grid.select(tr);
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                    MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), false);
                }
            });

            var rowData = grid.dataItem(grid.select());
            SelectParentProcess(rowData.PDOFileId, rowData.ProcessId);

            if (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == "" || MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val() == 0) {
                NominationGroundContinuedTreatment(true);
            }
        }
        else {
            SelectParentProcess("", "");
            NominationGroundContinuedTreatment(true);
        }

    });

    MojFind("#btnSearchParentProcess").die('click');
    MojFind("#btnSearchParentProcess").live('click', function () {
        isParentProcessSearch = true;
    });

    MojFind("#HearingsAndEligibilityModel_IsEndProcess").on('change', function (e) {
        var isEndProcess = MojControls.CheckBox.getValueById('HearingsAndEligibilityModel_IsEndProcess');
        var grid = MojControls.Grid.getKendoGridById("grdReminderList");
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined) {
                dataItem.IsVisibleReminder = isEndProcess
            }
        });

        if (Moj.isTrue(isEndProcess))
            MojFind("#EndProcessReminders").removeClass("hide");
        else
            MojFind("#EndProcessReminders").addClass("hide");
    });
    
    
});