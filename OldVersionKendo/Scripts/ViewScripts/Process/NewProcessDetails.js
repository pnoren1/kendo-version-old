/// <reference path="../../Common/jquery.fileDownload.js" />

function HideStatusPreviousProcessDiv(hide) {
    if (hide) {
        MojFind("#StatusPreviousProcessDiv").addClass("hide")
        MojFind("#" + "ProcessDetailsModel_" + "ProcessStatusReasonDisplayOption").val(FieldDisplayOption.DisplayedOptional);
        MojControls.AutoComplete.clearSelectionById("ProcessDetailsModel_PreviousProcessStatusReasonId");
    }
    else {
        MojFind("#StatusPreviousProcessDiv").removeClass("hide");
        MojFind("#" + "ProcessDetailsModel_" + "ProcessStatusReasonDisplayOption").val(FieldDisplayOption.DisplayedMandatory);
        MojControls.AutoComplete.setValue(MojFind("#ProcessDetailsModel_PreviousProcessStatusReasonId"), ProcessStatusReason.AdministrativeClosure);
    }

};

function SelectPreviousProcess(previousProcessId, previousProcessStatusId) {
    MojFind("#" + "ProcessDetailsModel_" + "SelectedPreviousProcessId").val(previousProcessId);
    MojFind("#" + "ProcessDetailsModel_" + "SelectedPreviousProcessStatusId").val(previousProcessStatusId);
    if (previousProcessId == "")
        $("#ProcessDetailsModel_PDOFileId").val('');
    if (MojFind("#PdoFileForNewProcess").length > 0 && MojFind("#PdoFileForNewProcess").parent(".wizard-content").length > 0)
        MojFind("#PdoFileForNewProcess").parent(".wizard-content").remove();
};

function isMinor(court, age) {
    if (court == CourtType.MinorMagistratesCourt || court == CourtType.MinorDistrictCourt)
        return true;
    return age != -1 && age < MojFind("#ProcessDetailsModel_AdultAge").val();
    return false;

};

function calcIsMinor(court) {
    var age = -1;
    var bd = MojFind("#PersonApplicantDetailsModel_Person_BirthDate");
    if (bd != undefined && bd.valid()
        && MojControls.DateTimePicker.getValueById("PersonApplicantDetailsModel_Person_BirthDate") != "")//change AppplicantBirthDate
    {
        if (MojFind("#ProcessDetailsModel_FelonyDate") != undefined && MojControls.DateTimePicker.getValueById("ProcessDetailsModel_FelonyDate") != "" && MojFind("#ProcessDetailsModel_FelonyDate").valid())
            var dateForCalc = MojControls.DateTimePicker.getValueById("ProcessDetailsModel_FelonyDate")
        else
            var dateForCalc = undefined;

        var age = PDO.calcAge(MojControls.DateTimePicker.getValueById("PersonApplicantDetailsModel_Person_BirthDate"), dateForCalc)
    }
    return isMinor(court, age);
};

function ProcessDetails(fieldPrefix) {
    var self = this;
    self.getFieldPrefix = function () {
        return Moj.isEmpty(fieldPrefix) ? "" : fieldPrefix + "_";
    };

    var prevProcessTypeId;
    var prevProcessCategoryId;
    var prevProcessNumberId;
    var prevProcessNumberPrefixId;
    var prevProcessNumberPrefixText;

    self.EnabledProcessNumber = function (enabled) {
        MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").enable(enabled);
        MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").enable(enabled);
        MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").enable(enabled);
        MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").enable(enabled);
    }

    self.visiblePanelTypeId = function (isVisible) {
        MojFind("#" + self.getFieldPrefix() + "PanelTypeId").visible(isVisible);
        if (Moj.isFalse(isVisible))
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "PanelTypeId");
    };

    self.EnabledHospitalizationPlace = function (enabled) {
        if (Moj.isFalse(enabled)) {
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "HospitalizationPlaceContactId");
        }
        MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceContactId").enable(enabled);
    };

    self.EnabledShiftFields = function (isEnabled) {
        if (Moj.isFalse(isEnabled)) {
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "IsShiftAdvocateWantToContinue");
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "IsShiftAdvocateAbleToContinue");
        }
        MojFind("#" + self.getFieldPrefix() + "IsShiftAdvocateWantToContinue").enable(isEnabled);
        MojFind("#" + self.getFieldPrefix() + "IsShiftAdvocateAbleToContinue").enable(isEnabled);
    };

    self.loadGeneralDetails = function (processTypeId, processCategoryId, district, processNumberPrefixId, processNumberId, processNumberMonth, processNumberYear) {
        var fatherProcessId = MojFind("#AppealFatherProcessId").val();

        if (processTypeId == "")
            processTypeId = 0;
        MojFind("#GeneralDetailsDiv").load(baseUrl + '/Process/GeneralDetails?processTypeId=' + processTypeId + '&processCategoryId=' + processCategoryId + '&district=' + district.replace(' ', '_')
            + '&processNumberPrefixId=' + processNumberPrefixId + '&processNumberId=' + processNumberId + '&processNumberMonth=' + processNumberMonth + '&processNumberYear=' + processNumberYear + '&fatherProcessId=' + fatherProcessId, function (data) {

                if (data.indexOf("ErrorHandlerScript") > -1) {
                    self.loadGeneralDetails("", processCategoryId, district, processNumberPrefixId, processNumberId, processNumberMonth, processNumberYear);
                    return;
                }
                self.start(true);
                MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").val(processNumberPrefixId);
                MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val(processNumberId);
                MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val(processNumberMonth);
                MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val(processNumberYear);

                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_ProcessTime").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "ProcessDate").data("kendoDateTimePicker").value(new Date());
                else if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_ProcessDate").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "ProcessDate").data("kendoDatePicker").value(new Date());

                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_PsychiatricOrderIssueDate").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "PsychiatricOrderIssueDate").data("kendoDatePicker").value(new Date());
                //else
                //    MojFind("#" + self.getFieldPrefix() + "OrderIssueDate").data("kendoDatePicker").value(null);

                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_ArrestTime").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "ArrestTime").data("kendoDateTimePicker").value(new Date());
                //else
                //    MojFind("#" + self.getFieldPrefix() + "ArrestTime").data("kendoDateTimePicker").value(null);

                //if(MojFind("#" + self.getFieldPrefix() + "ArrivalAtPoliceStationTime").val() != FieldDisplayOption.NotDisplayed)
                //    MojFind("#" + self.getFieldPrefix() + "ArrivalAtPoliceStationTime").data("kendoDateTimePicker").value(new Date());
                ////else
                ////    MojFind("#" + self.getFieldPrefix() + "ArrivalAtPoliceStationTime").data("kendoDateTimePicker").value(null);

                //if(MojFind("#" + self.getFieldPrefix() + "ConsultationEndTime").val() != FieldDisplayOption.NotDisplayed)
                //    MojFind("#" + self.getFieldPrefix() + "ConsultationEndTime").data("kendoDateTimePicker").value(new Date());
                ////else
                ////    MojFind("#" + self.getFieldPrefix() + "ConsultationEndTime").data("kendoDateTimePicker").value(null);

                //if(MojFind("#" + self.getFieldPrefix() + "MeetingWithApplicantTime").val() != FieldDisplayOption.NotDisplayed)
                //    MojFind("#" + self.getFieldPrefix() + "MeetingWithApplicantTime").data("kendoDateTimePicker").value(new Date());
                //else
                //    MojFind("#" + self.getFieldPrefix() + "MeetingWithApplicantTime").data("kendoDateTimePicker").value(null);
                self.setDefaultParoleBoard();
            })

    };

    self.PreviousProcessAllowed = function (isAllowed) {

        if (Moj.isTrue(isAllowed)) {
            MojFind("#SearchPreviousProcessGridDiv").removeClass("hide");
            HideStatusPreviousProcessDiv(true);
            MojFind("#AllProcessDetailsDiv").addClass("hide");
        }
        else {
            MojFind("#SearchPreviousProcessGridDiv").addClass("hide");
            HideStatusPreviousProcessDiv(true);
            if (MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() == 0)
                MojFind("#AllProcessDetailsDiv").addClass("hide");
            else
                MojFind("#AllProcessDetailsDiv").removeClass("hide");
        }

    };

    self.start = function (reloadNexTabs) {
        if (MojFind("#SearchPersonResult_ApplicantContactId").val() == 0) {
            self.PreviousProcessAllowed(false);
        }
        else {
            if (MojFind("#PreviousProcessId").val() != "") {
                MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").enable(false);
                MojFind("#buttonSearchPreviousProcessDiv").addClass("hide");
            }
            else
                self.PreviousProcessAllowed(MojFind("#ProcessDetailsModel_IsPreviousProcessAllowed").val())
        }


        prevProcessTypeId = MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val();
        prevProcessCategoryId = MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val();
        prevProcessNumberId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val();
        prevProcessNumberMonth = MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val();
        prevProcessNumberYear = MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val();
        prevProcessNumberPrefixId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").val();
        prevProcessNumberPrefixText = MojControls.AutoComplete.getTextById(self.getFieldPrefix() + "ProcessNumberPrefixId");

        var isMinor = calcIsMinor(MojFind("#" + self.getFieldPrefix() + "CourtIdType").val());
        if (Moj.isTrue(isMinor)) {
            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsMinor", true);
            MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(false);
        }
        else
            MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(true);

        if (reloadNexTabs) {
            PDO.wizard.reloadAllNexTabs();
        }
    };

    self.ProcessNumberChanged = function () {
        var grid = MojFind("[id^='grdPreviousProcessList']").data("kendoGrid");
        if (grid.dataSource.total() > 0) {
            var id = this.value;
            var confirm = false;
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined) {
                    if (Moj.isTrue(dataItem.IsChecked) && dataItem.ProcessNoForDisplay == prevProcessNumberPrefixText + prevProcessNumberId) {
                        confirm = true;
                    }
                }
            });
            if (confirm) {
                Moj.confirm(Resources.Messages.ProcessNumberChanged, function () {
                    self.loadGeneralDetails(MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val(), MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val(), MojFind("#" + self.getFieldPrefix() + "District").val(),
                        MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").val(), MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val(), MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val(), MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val());
                }, "", function () {
                    MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val(prevProcessNumberId);
                    MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val(prevProcessNumberMonth);
                    MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val(prevProcessNumberYear);
                    MojControls.AutoComplete.setValue(MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId"), prevProcessNumberPrefixId)
                }, Resources.Strings.AnAlert, true, Resources.Strings.Yes, Resources.Strings.No);
            }
            else {
                prevProcessNumberId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val();
                prevProcessNumberMonth = MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val();
                prevProcessNumberYear = MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val();
                prevProcessNumberPrefixId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").val();
                prevProcessNumberPrefixText = MojControls.AutoComplete.getTextById(self.getFieldPrefix() + "ProcessNumberPrefixId");
            }
        }
        else {
            prevProcessNumberId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val();
            prevProcessNumberMonth = MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val();
            prevProcessNumberYear = MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val();
            prevProcessNumberPrefixId = MojFind("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").val();
            prevProcessNumberPrefixText = MojControls.AutoComplete.getTextById(self.getFieldPrefix() + "ProcessNumberPrefixId");
        }
    }

    self.getHospitalizationPlaces = function () {
        var selectedValue = MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceContactId").val();
        MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceContactId"), true);

        $.ajax({
            url: baseUrl + '/Process/GetHospitalizationPlaces',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{"hospitalizationPlaceTypeId": "' + MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceTypeId").val() + '" }',

            success: function (retData) {

                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSourceAndValue(self.getFieldPrefix() + "HospitalizationPlaceContactId", retData, selectedValue);
                }
            }

        });
    }

    self.getProcessNumber = function () {
        return MojFind("#" + self.getFieldPrefix() + "ProcessNumberId").val() + MojFind("#" + self.getFieldPrefix() + "ProcessNumberMonth").val() + MojFind("#" + self.getFieldPrefix() + "ProcessNumberYear").val();
    };

    self.setDefaultParoleBoard = function () {

        if (MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val() == ProcessCategoryEnum.ParoleBoard) {
            var grid = MojFind("[id^='grdLocationsList']").data("kendoGrid");
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined && Moj.isTrue(dataItem.IsCurrentLocation) && (dataItem.ToDate == null || dataItem.ToDate == ""))
                    if (dataItem.LocationTypeId == LocationTypeEnum.KnownPlace && dataItem.PlaceTypeId == PlaceTypeEnum.Prison) {
                        MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "PrisonStartDate", dataItem.FromDate);
                        MojControls.TextBox.setValueById(self.getFieldPrefix() + "PrisonPeriod", dataItem.ImprisonmentPeriod);
                        MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "PrisonContactId", dataItem.PlaceContactId);
                    }

            });
        }
    };

    $(document).ready(function () {

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessCategoryId").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessCategoryId").live('change', function (e) {//todo before select

            if (Moj.isNotEmpty(MojFind("#AppealFatherProcessId").val())) return;
            if (MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() == "") {
                prevProcessCategoryId = this.value;
                var typeId = MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val();
                var dropdown = MojFind("#" + self.getFieldPrefix() + "ProcessTypeId");
                //MojControls.ComboBox.clearComboBox(dropdown, true);
                $.ajax({
                    url: baseUrl + '/Process/GetProcessTypesByCategory',
                    type: 'POST',
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: '{ "ProcessCategoryId": "' + this.value + '" }',
                    success: function (retData) {
                        if (JSON.stringify(retData) != "[]") {
                            MojControls.AutoComplete.setDataSource(self.getFieldPrefix() + "ProcessTypeId", retData);
                            if (Moj.isEmpty(typeId))
                                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ProcessTypeId");
                            else
                                MojControls.AutoComplete.setValue(MojFind("#" + self.getFieldPrefix() + "ProcessTypeId"), typeId)
                        }
                    },
                    error: function (xhr, tStatus, err) {
                        //alert(err);
                    }
                });
            }
            else {
                Moj.confirm(Resources.Messages.ProcessCategoryChanged, function () {
                    self.loadGeneralDetails("", MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val(), MojFind("#" + self.getFieldPrefix() + "District").val());
                }, "", function () {
                    MojControls.AutoComplete.setValue(MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId"), prevProcessCategoryId)

                }, Resources.Strings.AnAlert, true, Resources.Strings.Yes, Resources.Strings.No);
            }
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessTypeId").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessTypeId").live('change', function (e) {//todo before select
            //if (isNaN(parseInt(this.value)))
            //    return;

            if (self.getFieldPrefix() == "")
                return;

            var processTypeId = this.value;
            var grid = MojFind("[id*='grdPreviousProcessList']").data("kendoGrid");
            if ((grid.dataSource.total() > 0 || !MojFind("#AllProcessDetailsDiv").hasClass("hide")) && !isNaN(parseInt(prevProcessTypeId))) {// && !isNaN(parseInt(this.value))) {
                Moj.confirm(Resources.Messages.ProcessTypeChanged, function () {
                    self.loadGeneralDetails(processTypeId, MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val(), MojFind("#" + self.getFieldPrefix() + "District").val());
                    //self.setDefaultParoleBoard();
                }, "", function () {

                    MojControls.AutoComplete.setValue(MojFind("#" + self.getFieldPrefix() + "ProcessTypeId"), prevProcessTypeId)
                }, Resources.Strings.AnAlert, true, Resources.Strings.Yes, Resources.Strings.No);
            }
            else {
                self.loadGeneralDetails(processTypeId, MojFind("#" + self.getFieldPrefix() + "ProcessCategoryId").val(), MojFind("#" + self.getFieldPrefix() + "District").val());
                //self.setDefaultParoleBoard();
            }
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberPrefixId").live('change', function (e) {
            self.ProcessNumberChanged();
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberId").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberId").live('change', function (e) {

            self.ProcessNumberChanged();
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberMonth").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberMonth").live('change', function (e) {
            self.ProcessNumberChanged();
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberYear").die('change');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "ProcessNumberYear").live('change', function (e) {
            self.ProcessNumberChanged();
        });

        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "IsProcessNoUnknown").die('click');
        MojFind("#GeneralDetailsDiv").find("#" + self.getFieldPrefix() + "IsProcessNoUnknown").live('click', function (e) {

            if ($(this).attr("readonly") != undefined)
                return;

            if (this.checked) {
                var grid = MojFind("[id*='grdPreviousProcessList']").data("kendoGrid");
                if (grid.dataSource.total() >= 1) {
                    Moj.confirm(Resources.Messages.ProcessNumberUnKnownChanged, function () {
                        grid.dataSource.data([]);
                        HideStatusPreviousProcessDiv(true);
                        SelectPreviousProcess("", "");
                        self.EnabledProcessNumber(false);
                    }, "", function () {
                        MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsProcessNoUnknown", false);
                    }, "", true, Resources.Strings.Yes, Resources.Strings.No);
                }
                else
                    self.EnabledProcessNumber(false);
            }
            else {
                self.EnabledProcessNumber(true);
            }

        });


        MojFind("#GeneralDetailsDiv").find("#btnCopyProcessNumber").die('click');
        MojFind("#GeneralDetailsDiv").find("#btnCopyProcessNumber").live('click', function (e) {

            if ($(this).attr("readonly") != undefined)
                return;

            var grid = MojFind("[id^='grdPoliceIncidentNumberList']").data("kendoGrid");
            if (grid != undefined) {
                var processNumber = self.getProcessNumber();
                if (!Moj.isEmpty(processNumber)) {
                    grid.dataSource.add(
                        {
                            ID: "0",
                            PoliceIncidentNumberTypeId: PoliceIncidentNumberType.PoliceIncidentNumber.toString(),
                            PoliceIncidentNumber: processNumber,
                            State: window.Enums.ObjectState.Added
                        });
                    grid.refresh();
                }
            }
        });

        MojFind("#" + self.getFieldPrefix() + "IsFinancialEntitlement18a7Checked").die('change');
        MojFind("#" + self.getFieldPrefix() + "IsFinancialEntitlement18a7Checked").live('change', function (e) {
            if (this.value == 1 && MojFind("#" + self.getFieldPrefix() + "DisplayFields_IsFinancialEntitlement18a7").val() != FieldDisplayOption.NotDisplayed) {
                MojFind("#" + self.getFieldPrefix() + "IsFinancialEntitlement18a7").enable(true);
            }
            else {
                MojFind("#" + self.getFieldPrefix() + "IsFinancialEntitlement18a7").enable(false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "IsFinancialEntitlement18a7");
            }

        });

        MojFind("#" + self.getFieldPrefix() + "IsInternalOnCallRequired").die('click');
        MojFind("#" + self.getFieldPrefix() + "IsInternalOnCallRequired").live('click', function (e) {
            if ($(this).attr("readonly") != undefined)
                return;

            if (this.checked) {
                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_InternalOnCallReason").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "InternalOnCallReason").enable(true);
                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_InternalOnCallId").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "InternalOnCallId").enable(true);
            }
            else {
                MojFind("#" + self.getFieldPrefix() + "InternalOnCallReason").enable(false);
                MojFind("#" + self.getFieldPrefix() + "InternalOnCallReason").val(0);
                MojFind("#" + self.getFieldPrefix() + "InternalOnCallId").enable(false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "InternalOnCallId");
            }

        });

        MojFind("#" + self.getFieldPrefix() + "IsInternalOnCallRequired").die('change');
        MojFind("#" + self.getFieldPrefix() + "IsInternalOnCallRequired").live('change', function (e) {
            if ($(this).attr("readonly") != undefined)
                return;
            if (this.value) {
                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_InternalOnCallReason").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "InternalOnCallReason").enable(true);
                if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_InternalOnCallId").val() != FieldDisplayOption.NotDisplayed)
                    MojFind("#" + self.getFieldPrefix() + "InternalOnCallId").enable(true);
            }
            else
                MojFind("#" + self.getFieldPrefix() + "InternalOnCallReason").enable(false);
            MojFind("#" + self.getFieldPrefix() + "InternalOnCallId").enable(false);
        });

        MojFind("#" + self.getFieldPrefix() + "AdvocateCalledId").die('change');
        MojFind("#" + self.getFieldPrefix() + "AdvocateCalledId").live('change', function (e) {
            //אם נמצאה רשומה....TODO
            if (this.value != null && MojFind("#" + self.getFieldPrefix() + "DisplayFields_AdvocateCallReason").val() != FieldDisplayOption.NotDisplayed) {
                MojFind("#" + self.getFieldPrefix() + "AdvocateCallReason").enable(true);
            }
            else
                MojFind("#" + self.getFieldPrefix() + "AdvocateCallReason").enable(false);
        });

        MojFind("[id*='grdPreviousProcessList']").find("#chbIsChecked").die("click");
        MojFind("[id*='grdPreviousProcessList']").find("#chbIsChecked").live('click', function () {
            if ($(this).attr("readonly") != undefined)
                return;
            if (this.checked) {
                var grid = MojFind("[id*='grdPreviousProcessList']").data("kendoGrid");
                var tr = $(this).closest("tr");
                grid.select(tr);
                grid.tbody.find('tr').each(function () {
                    var dataItem = grid.dataItem(this);
                    if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                        MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), false);
                    }
                });
                if (!grid.dataItem(grid.select()).IsClosedStatus) {
                    HideStatusPreviousProcessDiv(false);
                }
                else {
                    HideStatusPreviousProcessDiv(true);
                }
                var processId = grid.dataItem(grid.select()).ProcessId;
                SelectPreviousProcess(processId, grid.dataItem(grid.select()).ProcessStatusId);
                MojFind("#AllProcessDetailsDiv").load(baseUrl + '/Process/GetProcessesByProcessId?processId=' + processId + "&processType=" + MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() + "&fieldPrefix=" + "ProcessDetailsModel", function () {
                    //MojFind("#AllProcessDetailsDiv").removeClass("hide");
                })
            }
            else {
                SelectPreviousProcess("", "");
                HideStatusPreviousProcessDiv(true);
                //MojFind("#AllProcessDetailsDiv").load(baseUrl + '/Process/GetProcessesByProcessId?processType=' + MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() + '&fieldPrefix=' + "ProcessDetailsModel")
            }
        });

        MojFind("#" + self.getFieldPrefix() + "CourtId").die('change');
        MojFind("#" + self.getFieldPrefix() + "CourtId").live('change', function (e) {
            var isMinor;
            if (isNaN(parseInt(this.value))) {
                isMinor = calcIsMinor();
                if (Moj.isTrue(isMinor)) {
                    MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsMinor", true);
                    MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(false);
                }
                else
                    MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(true);
                self.visiblePanelTypeId(false);
                return;
            }

            var fillNominationGround = false;
            if (MojFind("#HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds").length != 0 && !MojControls.CheckBox.getValue(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_DisplayAllNominationGrounds")) && Moj.isEmpty(MojFind("#HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId").val())) {
                fillNominationGround = true;
            }

            $.ajax({
                url: baseUrl + '/Process/GetCourtTypeChanges',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: '{ "courtId": "' + this.value + '", "processTypeId": "' + MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() + '", "fillNominationGround": "' + fillNominationGround + '"}',

                success: function (retData) {
                    if (JSON.stringify(retData) != "[]") {
                        MojFind("#" + self.getFieldPrefix() + "CourtIdType").val(retData.CourtIdType);
                        MojFind("#" + self.getFieldPrefix() + "CourtIdLevel").val(retData.CourtIdLevel);

                        isMinor = calcIsMinor(retData.CourtIdType);
                        if (Moj.isTrue(isMinor)) {
                            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsMinor", true);
                            MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(false);
                        }
                        else
                            MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(true);

                        self.visiblePanelTypeId((retData.CourtIdLevel == CourtLevel.District || retData.CourtIdLevel == CourtLevel.High) && MojFind("#" + self.getFieldPrefix() + "DisplayFields_PanelTypeId").val() != FieldDisplayOption.NotDisplayed);
                        if (fillNominationGround && JSON.stringify(retData.NominationGrounds) != "[]") {
                            MojControls.AutoComplete.setDataSource("HearingsAndEligibilityModel_NominationGroundModel_NominationGroundId", retData);
                        }
                    }
                },
            });
        });

        MojFind("#" + self.getFieldPrefix() + "FelonyDate").die('change');
        MojFind("#" + self.getFieldPrefix() + "FelonyDate").live('change', function (e) {
            var isMinor = calcIsMinor(MojFind("#" + self.getFieldPrefix() + "CourtIdType").val());
            if (Moj.isTrue(isMinor)) {
                MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsMinor", true);//only new process
                MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(false);
            }
            else
                MojFind("#" + self.getFieldPrefix() + "IsMinor").enable(true);

        });

        MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceTypeId").die('change');
        MojFind("#" + self.getFieldPrefix() + "HospitalizationPlaceTypeId").live('change', function (e) {
            var hospitalizationPlaceTypeId;
            if (isNaN(parseInt(this.value))) {
                self.EnabledHospitalizationPlace(false);
                return;
            }
            self.EnabledHospitalizationPlace(true);
            self.getHospitalizationPlaces();
        });

        //MojFind("[id^=" + self.getFieldPrefix() + 'ManagedShiftAdvocater' + "]").die('click');
        //MojFind("[id^=" + self.getFieldPrefix() + 'ManagedShiftAdvocater' + "]").live('click', function (e) {
        //    var isShiftAdvocate = MojControls.RadioButton.getValue(this);
        //    if (Moj.isTrue(isShiftAdvocate)) {
        //        MojFind("#" + self.getFieldPrefix() + "ShiftId").enable(true);
        //        MojFind("#" + self.getFieldPrefix() + "NonShiftAdvocateContactId").enable(false);
        //        MojControls.AutoComplete.clearSelection(MojFind("NonShiftAdvocateContactId"));
        //    }
        //    else if (Moj.isFalse(isShiftAdvocate)) {
        //        MojFind("#" + self.getFieldPrefix() + "NonShiftAdvocateContactId").enable(true);
        //        MojFind("#" + self.getFieldPrefix() + "ShiftId").enable(false);
        //        MojControls.AutoComplete.clearSelection(MojFind(self.getFieldPrefix() + "ShiftId"));
        //    }
        //});

        MojFind("#" + self.getFieldPrefix() + "IsShiftAdvocater").die('click');
        MojFind("#" + self.getFieldPrefix() + "IsShiftAdvocater").live('click', function (e) {
            if ($(this).attr("readonly") != undefined)
                return;
            var isShiftAdvocate = MojControls.CheckBox.getValue(this);
            if (Moj.isTrue(isShiftAdvocate)) {
                MojFind("#" + self.getFieldPrefix() + "ShiftAdvocateId").enable(true);
                MojControls.CheckBox.setValue(MojFind("#" + self.getFieldPrefix() + "IsNonShiftAdvocater"), false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "NonShiftAdvocateContactId");
                MojFind("#" + self.getFieldPrefix() + "NonShiftAdvocateContactId").enable(false);
                self.EnabledShiftFields(true);
            }
            else if (Moj.isFalse(isShiftAdvocate)) {
                MojFind("#" + self.getFieldPrefix() + "ShiftAdvocateId").enable(false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ShiftAdvocateId");
                self.EnabledShiftFields(false);
            }
        });

        MojFind("#" + self.getFieldPrefix() + "IsNonShiftAdvocater").die('click');
        MojFind("#" + self.getFieldPrefix() + "IsNonShiftAdvocater").live('click', function (e) {
            if ($(this).attr("readonly") != undefined)
                return;
            var isNonShiftAdvocate = MojControls.CheckBox.getValue(this);
            if (Moj.isTrue(isNonShiftAdvocate)) {
                MojFind("#" + self.getFieldPrefix() + "NonShiftAdvocateContactId").enable(true);
                MojControls.CheckBox.setValue(MojFind("#" + self.getFieldPrefix() + "IsShiftAdvocater"), false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ShiftAdvocateId");
                MojFind("#" + self.getFieldPrefix() + "ShiftAdvocateId").enable(false);
                self.EnabledShiftFields(true);
            }
            else if (Moj.isFalse(isNonShiftAdvocate)) {
                MojFind("#" + self.getFieldPrefix() + "NonShiftAdvocateContactId").enable(false);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "NonShiftAdvocateContactId");
                self.EnabledShiftFields(false);
            }
        });

        MojFind("#" + self.getFieldPrefix() + "ProcessDate").die('change');
        MojFind("#" + self.getFieldPrefix() + "ProcessDate").live('change', function (e) {

            if (MojFind("#" + self.getFieldPrefix() + "DisplayFields_ShiftId").val() == FieldDisplayOption.NotDisplayed)
                return;
            if (Moj.isEmpty(MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val()))
                return;
            if (Moj.isEmpty(this.value) || MojControls.DateTimePicker.getValueById(self.getFieldPrefix() + "ProcessDate") == "" || !MojFind("#" + self.getFieldPrefix() + "ProcessDate").valid())
                return;
            var selectedValue = MojFind("#" + self.getFieldPrefix() + "ShiftAdvocateId").val();
            $.ajax({
                url: baseUrl + '/Process/GetShiftAdvocateList',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: '{"processTypeId": "' + MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val() + '", "processDate": "' + MojFind("#" + self.getFieldPrefix() + "ProcessDate").val() + '" }',

                success: function (retData) {

                    if (JSON.stringify(retData) != "[]") {
                        MojControls.AutoComplete.setDataSourceAndValue(self.getFieldPrefix() + "ShiftAdvocateId", retData, -1);
                    }
                    else
                        MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "ShiftAdvocateId"), true);
                }

            });
        });
    });

};