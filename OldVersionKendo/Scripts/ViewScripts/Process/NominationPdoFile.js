
setNominationPdoFileIdByNewFileCheckBox = function () {
    var isChecked = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsCreateNewPdoFile");
    if (isChecked) {
        MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").val("");
        MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").enable(false);
        MojFind("[id='btncopy-pdo-file'").enable(false)
    }
    else {
        MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").enable(true);
        MojFind("[id='btncopy-pdo-file'").enable(true)
    }
};

setSupervisorAccordingToAdvocateVisibility = function () {
    var isChecked = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate");
    if (isChecked) {
        MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationPdoFile_SupervisorId", 0);
        MojFind("#GeneralDetailsModel_NominationPdoFile_SupervisorId").enable(false);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationPdoFile_SupervisorId").enable(true);
    }
};

setSupervisionLevelVisibility = function () {
    var isChecked = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate");
    if (isChecked) {
        MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationPdoFile_SupervisionLevelId", 0);
        MojFind("#GeneralDetailsModel_NominationPdoFile_SupervisionLevelId").enable(false);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationPdoFile_SupervisionLevelId").enable(true);
    }
};

$(document).ready(function () {


    MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate").change(function () {
        setSupervisorAccordingToAdvocateVisibility();
    });



    MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate").change(function () {
        setSupervisionLevelVisibility();
    });


    MojFind("#GeneralDetailsModel_NominationPdoFile_IsCreateNewPdoFile").change(function () {
        setNominationPdoFileIdByNewFileCheckBox();
    });

    MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").change(function () {
        var fileId = MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").val();
        if (!Moj.isEmpty(fileId)) {
            $.post("/Process/GetPdoFileById?pdoFileId=" + fileId, "", function (data) {
                if (data.ActionResult.IsPdoFileExist != null && data.ActionResult.IsPdoFileExist == true) {
                    PDO.updateEntityInfo(data.EntityInfo);
                    MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationPdoFile_SupervisionLevelId", data.ActionResult.SupervisionLevelId);
                    MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationPdoFile_SupervisorId", data.ActionResult.SupervisorId);
                    MojControls.Label.setValueById("GeneralDetailsModel_NominationPdoFile_OldSupervisionLevelId", data.ActionResult.SupervisionLevel);
                    MojControls.Label.setValueById("GeneralDetailsModel_NominationPdoFile_OldSupervisorId", data.ActionResult.Supervisor);
                }
                else {
                    var message = Resources.Messages.PdoFileIdNotExist;
                    Moj.showMessage(message, undefined, Resources.Strings.Message, MessageType.Alert);
                    MojFind("#GeneralDetailsModel_NominationPdoFile_PDOFileId").val("");
                }

            });
        }
    });


});

