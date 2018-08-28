var ProcessAttached = {

    enableContactProcessFields: function (isEnable) {
        if (Moj.isFalse(isEnable)) {
            MojControls.AutoComplete.setValueById("ParentProcessTypeID", 0);
            MojControls.AutoComplete.setValueById("ParentProcessNumberPrefixId", 0);
            MojFind("#ParentProcessNumberId").val('');
            MojControls.AutoComplete.setValueById("ParentDistrictId", 0);
        }
        MojFind("#ParentProcessTypeID").enable(isEnable);
        MojFind("#ParentProcessNumberPrefixId").enable(isEnable);
        MojFind("#ParentProcessNumberId").enable(isEnable);
        MojFind("#ParentDistrictId").enable(isEnable);
    },

    saveProcessesAttached: function () {
        var isCanSave = false;
        var selectedItem;
        var grid = MojFind("[id^='grdParentProcessList']").data("kendoGrid");
        var processConnectionTypeId = MojFind("#ProcessConnectionTypeId").val();
        var processConnectionTypeName = MojControls.AutoComplete.getTextById("ProcessConnectionTypeId");
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && $($(this).find('#chbIsChecked')).is('[checked]')) {
                isCanSave = true;
                selectedItem = dataItem;
                //break; todo
            }
        });
        if (!isCanSave) {
            Moj.showErrorMessage(Resources.Messages.ErrNoProcessSelected);
            return;
        }
        var myWindow = $("#addProcessesAttached").data("kendoWindow");
        myWindow.close();
        $(".moj-modal").removeAttr('active');
        ProcessAttached.onSuccessAddProcessesAttached(selectedItem, processConnectionTypeId, processConnectionTypeName);
        return isCanSave;
    },

    onSuccessAddProcessesAttached: function (dataItem, processConnectionTypeId, processConnectionTypeName) {
        var isExist = false;
        var isProcessAccompanyingExist = false;
        var addToGrid = true;
        var grid = MojFind("[id^='grdProcessesAttachedList']").data("kendoGrid");
        $.each(grid.dataSource.data(), function (index, value) {
            if (value.ConnectProcessId == dataItem.ProcessId) {
                if (value.State == window.Enums.ObjectState.Deleted) {
                    value.State = window.Enums.ObjectState.Unchanged;
                    addToGrid = true;
                }
                else {
                    addToGrid = false;
                    Moj.showMessage(Resources.Messages.WrnProcessSelected);
                }
                isExist = true;
            }
            else if (processConnectionTypeId == ProcessConnectionType.ProcessAccompanying && value.ProcessConnectionTypeId == ProcessConnectionType.ProcessAccompanying && value.State != window.Enums.ObjectState.Deleted)
                isProcessAccompanyingExist = true;
        });

        if (isProcessAccompanyingExist == true)
            Moj.showMessage(Resources.Messages.WrnAccompanyingProcessAllreadyExist);

        else if (addToGrid) {
            if (!isExist) {
                grid.dataSource.add(
                    {
                        ID: 0,
                        ProcessAttachedId: 0,
                        NominationGroundId: dataItem.NominationGroundId,
                        ProcessConnectionTypeId: processConnectionTypeId,
                        ProcessConnectionType: processConnectionTypeName,
                        ProcessId: MojFind("#ProcessId").val(),
                        ConnectProcessId: dataItem.ProcessId,
                        ProcessNumberForDisplay: dataItem.ProcessNoForDisplay,
                        IsProcessId1: true,
                        //EndOfRepresentationReason: dataItem.EndOfRepresentationReasonId,
                        //EndOfRepresentationReasonId: dataItem.EndOfRepresentationReasonId,
                        ProcessStatusReasonId: dataItem.ProcessStatusReasonId,
                        State: window.Enums.ObjectState.Added,
                    });
            }
            grid.refresh();
            //todo change design...
            if (dataItem.NominationGroundId != null) {// && !Moj.isEmpty(MojControls.AutoComplete.getValueById("NominationGroundModel_NominationGroundId")) && MojControls.AutoComplete.getValueById("NominationGroundModel_NominationGroundId") != null) {// == dataItem.NominationGroundId) {
                Moj.confirm(Resources.Messages.IsUpdateProcessNominationGround, function () {
                    ProcessAttached.setNominationGroundFromAttachProcess(dataItem);
                });
            }
            //ProcessAttached..setNominationGroundFromAttachProcess(dataItem);
            Moj.changeObjectStateToForm("true");
        }
    },

    setNominationGroundFromAttachProcess: function (dataItem) {
        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundStatusId", NominationGroundStatus.Eligible);
        MojControls.ComboBox.clearComboBox(MojFind("#NominationGroundModel_NominationGroundStatusReasonId"));
        MojControls.AutoComplete.setValueById("NominationGroundModel_NominationGroundId", dataItem.NominationGroundId);
        MojFind("#NominationGroundModel_IsNominationGroundContinued").val(true);
        MojFind("#NominationGroundContinuedLable").visible(true);
        MojFind("#ObjectStateProcess").val(true);
    }
}
$(document).ready(function () {

    MojFind("#btnClearAddProcessesAttached").removeAttr('onclick');

    MojFind("#AddProcessesAttachedDiv").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#btnSearchParentProcess").click();
            return false;
        }
    });

    MojFind("#btnClearAddProcessesAttached").click(function (e) {
        Moj.clearFields(e, '[id$="ParentProcessSearchDivForCancel"]');
        ProcessAttached.enableContactProcessFields(false);
        MojControls.Grid.clear('grdParentProcessList');
        MojControls.AutoComplete.setValueById("ParentDistrictId", MojFind("#SourceProcessDistrictId").val());
    });

    MojFind("[id^='" + "grdParentProcessList" + "']").find('tr').die('click');
    MojFind("[id^='" + "grdParentProcessList" + "']").find('tr').live('click', function (e) {
        var grid = MojControls.Grid.getKendoGridById("grdParentProcessList");
        if (Moj.isEmpty(grid) || grid == null)
            return;
        if (e.srcElement != undefined) {
            var checkBox = $(e.currentTarget).find('#chbIsChecked');
            $(checkBox).attr('checked', true);
            MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), true);
            var currentRow = $(this);
            grid.tbody.find('tr').each(function () {
                var dataItem = grid.dataItem(this);
                if (dataItem != undefined && !PDO.compareRowsValues(currentRow, $(this)) && !$(this).hasClass('k-state-selected')) {
                    MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), false);
                }
            });
        }

    });

    MojFind("[id*='grdParentProcessList']").find("#chbIsChecked").die('click');

    MojFind("[id*='grdParentProcessList']").find("#chbIsChecked").live('click', function () {


        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdParentProcessList");
            var tr = $(this).closest("tr");
            grid.select(tr);
            if (grid.dataSource.total() > 0) {
                grid.tbody.find('tr').each(function () {
                    var dataItem = grid.dataItem(this);
                    if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                        MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), false);
                    }
                });
            }
        }
    });

    MojFind("#ProcessConnectionTypeId").die('change');
    MojFind("#ProcessConnectionTypeId").live('change', function (e) {
        MojControls.Grid.clear('grdParentProcessList');

        if ($(this).attr("readonly") != undefined || this.value == null || this.value == 0) {
            ProcessAttached.enableContactProcessFields(false);
            return;
        }

        var isAppealProcessType = false;
        var processConnectionType = parseInt(this.value);
        switch (processConnectionType) {
            case ProcessConnectionType.ProcessAdditional:
                {
                    isAppealProcessType = false;
                    ProcessAttached.enableContactProcessFields(true);
                    //MojControls.AutoComplete.setValueById("ParentProcessTypeID", MojFind("#ProcessTypeId").val());
                    MojControls.AutoComplete.setValueById("ParentProcessNumberPrefixId", MojFind("#SourceProcessNumberPrefixId").val());
                    MojFind("#ParentProcessNumberPrefixId").enable(false);
                    MojFind("#ParentProcessNumberId").enable(false);
                    MojFind("#ParentProcessNumberId").val(MojFind("#ProcessNoForSearch").val());
                    MojControls.AutoComplete.setValueById("ParentDistrictId", MojFind("#SourceProcessDistrictId").val());
                    break;
                };
            case ProcessConnectionType.ProcessAccompanying:
                {
                    isAppealProcessType = true;
                    MojControls.AutoComplete.setValueById("ParentProcessNumberPrefixId", -1);
                    MojFind("#ParentProcessNumberId").val("");
                    ProcessAttached.enableContactProcessFields(true);
                    MojControls.AutoComplete.setValueById("ParentDistrictId", MojFind("#SourceProcessDistrictId").val());
                    break;
                };
            default: ProcessAttached.enableContactProcessFields(true);
        }

        //var typeId = MojFind("#" + self.getFieldPrefix() + "ProcessTypeId").val();
        MojControls.ComboBox.clearComboBox(MojFind("#ParentProcessTypeID"), true);
        $.ajax({
            url: baseUrl + '/Process/GetProcessTypes',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "isFatherProcessType": "' + isAppealProcessType + '", "parentProcessTypeID": "' + MojFind("#ProcessTypeId").val() + '"}',

            success: function (retData) {

                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSource("ParentProcessTypeID", retData);
                    if (processConnectionType == ProcessConnectionType.ProcessAdditional) {
                        MojControls.AutoComplete.setValueById("ParentProcessTypeID", MojFind("#ProcessTypeId").val());
                        MojFind("#ParentProcessTypeID").enable(false);
                    }
                }
            },
            error: function (xhr, tStatus, err) {
                //alert(err);
            }
        });
        if (processConnectionType == ProcessConnectionType.ProcessAdditional)
            MojControls.AutoComplete.setValueById("ParentProcessTypeID", MojFind("#ProcessTypeId").val());
    });
});

