function beforeExitSearchPersonApplicant() {
    var contactId = MojFind("#SearchPersonResult_ApplicantContactId").val();
    if (contactId == "" || contactId == null) {
        Moj.showErrorMessage(Resources.Messages.ErrExitSearchPersonApplicant);
        return false;
    }
    else {
        var tabContactId = MojFind("#PersonApplicantDetailsModel_Person_ContactId").val();
        if (tabContactId != undefined && tabContactId != contactId) {
            //Moj.confirm(Resources.Messages.WrnExitSearchPersonApplicant, function () {
            //    return true;
            //}, undefined, function () {
            //    return false;
            //});
            var isExitSearchPersonApplicant = confirm(Resources.Messages.WrnExitSearchPersonApplicant);
            if (Moj.isTrue(isExitSearchPersonApplicant))
                PDO.wizard.reloadAllNexTabs();
            return isExitSearchPersonApplicant;
        }
    }



};

$(document).ready(function () {

    MojFind("[id^='" + "grdContactList" + "']").find('tr').live('click', function (e) {
        var grid = MojControls.Grid.getKendoGridById("grdContactList");
        if (Moj.isEmpty(grid) || grid == null)
            return;
        if (e.srcElement != undefined) {
            var radioButton = $(e.currentTarget).find('#rdbIsSelected');
            $(radioButton).attr('checked', true);
            //MojControls.RadioButton.setValue($(radioButton), true);
            //grid.tbody.find('tr').each(function () {
            //    var dataItem = grid.dataItem(this);
            //    if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
            //        MojControls.RadioButton.setValue($(this).find("[id = rdbIsSelected]"), false);
            //    }
            //});
            MojControls.CheckBox.setValueById("IsNewPersonApplicantChecked", false);
            var contactId = parseInt($(MojControls.Grid.getKendoGridById("grdContactList").tbody.find('tr.k-state-selected').find('td')[1]).text());
            MojFind("#SearchPersonResult_ApplicantContactId").val(contactId);
        }

    });
});