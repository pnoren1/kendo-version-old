

function PdoFile(fieldPrefix) {
    var self = this;
    self.getFieldPrefix = function () {
        return Moj.isEmpty(fieldPrefix) ? "" : fieldPrefix.replace('.', '_') + "_";
    };

    self.setPdoFileIdByNewFileCheckBox = function () {
        var isChecked = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "IsNewPdoFileId");
        if (isChecked) {
            MojFind("#" + self.getFieldPrefix() + "PDOFileId").val("");
            MojFind("#" + self.getFieldPrefix() + "PDOFileId").enable(false);
            MojFind("[id='btncopy-file']").enable(false)
        }
        else {
            MojFind("#" + self.getFieldPrefix() + "PDOFileId").enable(true);
            MojFind("[id='btncopy-file']").enable(true)
        }
    };

    self.setNoRecordVisible = function () {
        if (MojControls.Grid.getKendoGridById("grdProcessesPoliceIncidentNumbers").dataSource.data().length == 0) {
            MojFind("#div-list1").addClass('hide');
            MojFind("#list1Title").visible(true);
        }

        if (MojControls.Grid.getKendoGridById("grdProcessesNumberForDisplay").dataSource.data().length == 0) {
            MojFind("#div-list2").addClass('hide');
            MojFind("#list2Title").visible(true);
        }

        if (MojControls.Grid.getKendoGridById("grdProcessesApplicantContact").dataSource.data().length == 0) {
            MojFind("#div-list3").addClass('hide');
            MojFind("#list3Title").visible(true);
        }
    };

    self.onPdoFileViewReady = function () {
        self.setNoRecordVisible();
        self.setPdoFileIdByNewFileCheckBox();

        var pdoFileId = MojFind("#" + self.getFieldPrefix() + "PDOFileId").val();
        
        if (pdoFileId != "" && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "IsInheritedPDOFile").val())) {
            MojFind("#ExistPdoFileId").show();
            MojFind("#NotExistPdoFileId").hide();
        }
        else {
            MojFind("#NotExistPdoFileId").show();
            MojFind("#ExistPdoFileId").hide();
        }

        MojFind("#" + self.getFieldPrefix() + "IsNewPdoFileId").change(function () {
            self.setPdoFileIdByNewFileCheckBox();
        });

        MojFind("[id='btncopy-file']").die('click');
        MojFind("[id='btncopy-file']").live('click', function () {
            var gridName = $(this).closest('.k-widget.k-grid').attr('id');
            var grid = MojFind("#" + gridName).data("kendoGrid");
            var currentItem = grid.dataItem($(this).closest('tr'));
            MojFind("#" + self.getFieldPrefix() + "PDOFileId").val(currentItem.PDOFileId);
        });

        MojFind("#btnPdoFileOk").die('click');
        MojFind("#btnPdoFileOk").live('click', function () {
            pdoFileOkOnClick();
        });

    };

};

pdoFileOkOnClick = function () {
    var PDOFileId = MojFind("#PDOFileId").val();
    var isNewPDOFile = MojControls.CheckBox.getValueById("IsNewPdoFileId");
    Moj.closePopUp("openPdoFile");
    MojFind("[id='PDOFileId'].moj-input-txt").val(PDOFileId);
    MojControls.CheckBox.setValueById("DoPDOFile", isNewPDOFile);
    Moj.changeObjectsState(MojFind("[id='PDOFileId'].moj-input-txt"));
    onDoPDOFileChange();
};

beforeExistPdoFileView = function () {
    var isEndProcess = MojControls.CheckBox.getValueById('HearingsAndEligibilityModel_IsEndProcess');
    if (isEndProcess) {
        var fileId = MojFind("#PdoFileModel_PDOFileId").val();
        var isChecked = MojControls.CheckBox.getValueById("PdoFileModel_IsNewPdoFileId");
        if (isChecked || fileId == "")
            return confirm(Resources.Messages.ErrPdoFileTab);
    }
    return true;
};
