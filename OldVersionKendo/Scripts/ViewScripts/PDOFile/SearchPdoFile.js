
function PDOFileList_RequestEnd(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    if (e.response != undefined) {
        if (MojFind("#ObjectToSearch") != undefined && MojFind("#ObjectToSearch").val() != null && MojFind("#ObjectToSearch").val() != "") {
            MojFind("#ObjectToSearch").val("");
            //if (e.response.Total == 0) {
            //    Moj.confirm(Resources.Messages.ProcessNotExist, function () {
            //        NewProcessClick();
            //    }, "", undefined, "", true);
            //}
        }
        if (e.response.Total == 1 && !Moj.isTrue(MojFind("#IsPopup").val())) {
            var id = e.response.Data[0].PDOFileId;
            PDO.addEntityContentTab(EntityContentTypeEnum.PDOFile, id, "", Resources.Strings.PDOFile + " " + id, "PDOFile_Tab_" + id);
        }
    }
};

enableSearchPDOFileFields = function (isEnabled) {
    MojFind("#SearchCriteria_OldPDOFileId").enable(isEnabled);
    MojFind("#SearchCriteria_DistrictId").enable(isEnabled);
    MojFind("#SearchCriteria_SupervisorId").enable(isEnabled);
    MojFind("#SearchCriteria_PDOFileStatusId").enable(isEnabled);
    MojFind("#SearchCriteria_ProcessTypeId").enable(isEnabled);
    MojFind("#SearchCriteria_ProcessNumber").enable(isEnabled);
    MojFind("#SearchCriteria_JudgeId").enable(isEnabled);
    MojFind("#SearchCriteria_PersonAdvocateId").enable(isEnabled);
    MojFind("#SearchCriteria_NominationStatusId").enable(false);
    MojFind("#SearchCriteria_Tag1Id").enable(isEnabled);
    MojFind("#SearchCriteria_Tag2Id").enable(false);
    MojFind("#SearchCriteria_OpenDateFrom").enable(isEnabled);
    MojFind("#SearchCriteria_OpenDateTo").enable(isEnabled);
    MojFind("#SearchCriteria_ThereIsconsultantion").enable(isEnabled);
    MojFind("#SearchCriteria_consultantId").enable(false);
    MojFind("#SearchCriteria_ConsultingStatusId").enable(false);
    MojFind("#SearchCriteria_ThereIsExpert").enable(isEnabled);
    MojFind("#SearchCriteria_ExpertTypeId").enable(false);
    MojFind("#SearchCriteria_ExpertId").enable(false);
    MojFind("#SearchCriteria_ExpertProductId").enable(false);
    MojFind("#SearchCriteria_ApplicantName").enable(false);
    MojFind("#btnSearchApplicant").enable(isEnabled);
};


PDOFileSelected = function () {
    
    var grid = MojFind("[id^='grdPDOFileList']").data("kendoGrid");
    var myWindow = $("#actionSearchdialogModal").data("kendoWindow");
    myWindow.close();
    if (grid.dataItem(grid.select()) != undefined) {
        var ParentEntityInstanceID = grid.dataItem(grid.select())["PDOFileId"];
        var ParentEntityInstance = grid.dataItem(grid.select())["PDOFileId"];
        GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
    }
}

onSearchPDOFileReady = function () {

    MojFind("#SearchCriteria_PersonAdvocateId").die('change');
    MojFind("#SearchCriteria_PersonAdvocateId").live('change', function (e) {
        if (isNaN(parseInt(this.value))) {


            MojControls.AutoComplete.clearSelectionById("SearchCriteria_NominationStatusId");
            MojFind("#SearchCriteria_NominationStatusId").enable(false);
            return;
        }
        MojFind("#SearchCriteria_NominationStatusId").enable(true);
    });

    MojFind("#SearchCriteria_Tag1Id").die('change');
    MojFind("#SearchCriteria_Tag1Id").live('change', function (e) {
        if (isNaN(parseInt(this.value)) || Moj.isEmpty(this.value)) {
            MojFind("#SearchCriteria_Tag2Id").enable(false);
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_Tag2Id");
            return;
        }
        MojFind("#SearchCriteria_Tag2Id").enable(true);
    });

    MojFind("#SearchCriteria_ThereIsconsultantion").die('change');
    MojFind("#SearchCriteria_ThereIsconsultantion").live('change', function (e) {
        MojFind("#SearchCriteria_consultantId").enable(this.value == YesNoEnum.Yes);
        MojFind("#SearchCriteria_ConsultingStatusId").enable(this.value == YesNoEnum.Yes);
        if (this.value != YesNoEnum.Yes) {
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_consultantId");
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_ConsultingStatusId");
        }
    });

    MojFind("#SearchCriteria_ThereIsExpert").die('change');
    MojFind("#SearchCriteria_ThereIsExpert").live('change', function (e) {
        MojFind("#SearchCriteria_ExpertTypeId").enable(this.value == YesNoEnum.Yes);
        MojFind("#SearchCriteria_ExpertId").enable(this.value == YesNoEnum.Yes);
        MojFind("#SearchCriteria_ExpertProductId").enable(this.value == YesNoEnum.Yes);
        if (this.value != YesNoEnum.Yes) {
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_ExpertTypeId");
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_ExpertId");
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_ExpertProductId");
        }

    });

    MojFind("[id*='grdPDOFileList']").find("#rdbIsSelected").die('click');

    MojFind("[id*='grdPDOFileList']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdPDOFileList");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

    MojFind("#PDOFileSearchDiv").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#btnSearchSearchPdoFile").click();
            return false;
        }
    });

    MojFind("#btnCancelSearchPDOFile").die('click');
    MojFind("#btnCancelSearchPDOFile").live('click', function (e) {
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();
    });

    MojFind("#btnClearSearchPdoFile").removeAttr('onclick');

    MojFind("#btnClearSearchPdoFile").die('click');
    MojFind("#btnClearSearchPdoFile").live('click', function (e) {
        
        Moj.clearFields(btnClearSearchPdoFile);
        MojControls.Grid.clear('grdPDOFileList');
        enableSearchPDOFileFields(true);
        MojControls.AutoComplete.setValueById("SearchCriteria_DistrictId", MojFind("#SearchCriteria_OriginalDistrictId").val());
        //MojControls.Grid.getKendoGridById('grdPDOFileList').dataSource.filter([])
        return false;
    });
        

    MojFind("#btnOkSearchPDOFile").die('click');
    MojFind("#btnOkSearchPDOFile").live('click', function (e) {
        var grid = MojControls.Grid.getKendoGridById("grdPDOFileList");
        var selectedItem = grid.dataItem(grid.select());
        var pdoFileIdField = MojFind("#PDOFileIdField").val();
        var customActionName = MojFind("#CustomActionName").val();
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();

        if (selectedItem != undefined) {
            if (customActionName != "")
                eval(customActionName + "(" + JSON.stringify(selectedItem) + ");");
            else {
                var actionName = "PDO.setSelectedPDOFile";
                if (jQuery.isFunction(eval(actionName))) {
                    var setAction = actionName + "(" + JSON.stringify(selectedItem) + ",'" + pdoFileIdField + "');"
                    eval(setAction);
                }
            }

        }
    });

    MojFind("#SearchCriteria_PDOFileId").change(function () {
        var newValue = $(this).val();
        if (newValue != undefined && newValue != "") {
            enableSearchPDOFileFields(false);
            Moj.clearFields(undefined, "[id$='PDOFileSearchDiv']");
            MojFind("#SearchCriteria_PDOFileId").val(newValue);
        }
        else {
            enableSearchPDOFileFields(true);
        }
    });
};

$(document).ready(function () {
    onSearchPDOFileReady();
});

