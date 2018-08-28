openRetainerPopup = function (advocateContactId) {
    Moj.safePost("/Process/CurrentAdvocateRetainerContractView", { advocateContactId: advocateContactId }, function (content) {
        Moj.openPopupWindow("OpenRetainerContract", content, "חוזה ריטיינר לסנגור במחוז",700, 280, false, false, false);
    });
}

onNominationRelatedProcessReady = function () {


    var grdShifts = MojFind("[id^='" + "grdProcessMatchingShifts" + "']");
    if (grdShifts != undefined)
        grdShifts.attr('style', 'width: 40%');
    //setNominationRelatedProcesGridVisibility();


    MojFind("[id='btncopy-pdo-file']").die('click');
    MojFind("[id='btncopy-pdo-file']").live('click', function () {
        //if ($(this).attr('disabled') != 'disabled') {

        var isCreateNewPdoFileChecked = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationPdoFile_IsCreateNewPdoFile");
        if (!isCreateNewPdoFileChecked) {
            var gridName = $(this).closest('.k-widget.k-grid').attr('id');
            var grid = MojFind("#" + gridName).data("kendoGrid");
            var currentItem = grid.dataItem($(this).closest('tr'));
            var pdoFileDiv = MojFind("#PdoFileDiv");
            if (pdoFileDiv.length != 0) {
                var pdoFileIdField = pdoFileDiv.find("#GeneralDetailsModel_NominationPdoFile_PDOFileId");
                pdoFileIdField.val(currentItem.PDOFileId);
                pdoFileIdField.change();
            }
            else {
                Moj.showMessage("לא ניתן לשנות את מספר תיק הסנגוריה", undefined, Resources.Strings.Message, MessageType.Alert);
            }
        }
        else {
            Moj.showMessage("מסומן תיק סנגוריה חדש", undefined, Resources.Strings.Message, MessageType.Alert);
        }


        //}
    });

    MojFind("[id='btncopy-advocate']").die('click');
    MojFind("[id='btncopy-advocate']").live('click', function () {
        if ($(this).attr('disabled') != 'disabled') {
            var gridName = $(this).closest('.k-widget.k-grid').attr('id');
            var grid = MojFind("#" + gridName).data("kendoGrid");
            var currentItem = grid.dataItem($(this).closest('tr'));
            copyAdvocateToGrid(currentItem.AdvocateContactId);
        }

    });
    //  setSpecialAdvocateTooltip();


};