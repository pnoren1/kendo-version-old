
function ContactList_RequestEnd(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    MojFind("#SearchCriteria_FullName").val("");
    if (e.response != undefined) {
        if (e.response.Total == 1
       && !Moj.isTrue(MojFind("#SearchCriteria_IsWizard").val())
       && !Moj.isTrue(MojFind("#SearchCriteria_IsPopup").val())
       ) {
            var id = e.response.Data[0].ContactId;
            PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, id, "", Resources.Strings.Applicant + " " + id, "Contact_Tab_" + id);
        }
    }
}

ContactDetails_CloseTab = function (id) {
    var tabToCloseButtonContactdetails;
    if (id == 0)
        tabToCloseButtonContactdetails = $('.tab-close[id*="Contact_Tab_0"]');
    else
        tabToCloseButtonContactdetails = $('.tab-close[id*="Contact_Tab_' + id + '"]');

    var contactdetailsTabToClose = tabToCloseButtonContactdetails.attr("id");

    if (typeof (contactdetailsTabToClose) != "undefined") {
        PDO.closeEntityTab(tabToCloseButtonContactdetails);
    }
};

NewContactClick = function () {
    ContactDetails_CloseTab(0);
    var value = $.trim(MojFind("#ObjectToSearch").val());
    if (/^[0-9a-zA-Z]+$/.test(value) && !/^[a-zA-Z]+$/.test(value))
        PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, 0, { IDNumber: value }, Resources.Strings.NewApplicant, "Contact_Tab_0");
    else
        PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, 0, "", Resources.Strings.NewApplicant, "Contact_Tab_0");

};

function notEmpty(elem) {
    if (elem.length == 0) {
        return false;
    }
    return true;
}

enableSearchField = function (isEnabled) {
    // MojControls.Common.changeAvailabilityByClass("search-field", isEnabled);
    MojFind("#SearchCriteria_PersonIdNumberTypeId").enable(isEnabled);
    MojFind("#SearchCriteria_PersonAdvocateId").enable(isEnabled);
    MojFind("#SearchCriteria_IdNumber").enable(isEnabled);
    MojFind("#SearchCriteria_LastName").enable(isEnabled);
    MojFind("#SearchCriteria_FirstName").enable(isEnabled);
    MojFind("#SearchCriteria_FatherName").enable(isEnabled);
    MojFind("#SearchCriteria_UnidentifiedTypeId").enable(isEnabled);
    MojFind("#SearchCriteria_BirthDateFrom").enable(isEnabled);
    MojFind("#SearchCriteria_BirthDateTo").enable(isEnabled);
    MojFind("#SearchCriteria_CountryId").enable(isEnabled);
    MojFind("#SearchCriteria_ProcessNumberForDisplay").enable(isEnabled);
    MojFind("#SearchCriteria_PDOFileId").enable(isEnabled);
    MojFind("#SearchCriteria_AdvocateNumber").enable(isEnabled);
    MojFind("#SearchCriteria_AdvocateName").enable(isEnabled);
    MojFind("#SearchCriteria_ApplicantProcessNominatiStatusId").enable(isEnabled);
};

personApplicantSelectedToDocument = function (selectedItem) {
    if (selectedItem != undefined)
    {
        var ParentEntityInstanceID = selectedItem["ContactId"];
        var ParentEntityInstance = selectedItem["ContactId"];
        GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
    }
}

onCloseSearchPersoPopup = function () {
    var grid = MojControls.Grid.getKendoGridById("grdContactList");
    var selectedItem = grid.dataItem(grid.select());
    var actionName = "PDO.setSelectedApplicant";
    var applicantNameField = MojFind("#ApplicantNameField").val();
    var applicantContactIdField = MojFind("#ApplicantContactIdField").val();
    var customActionName = MojFind("#CustomActionNameField").val();


    var window = $("#actionSearchdialogModal").data("kendoWindow");
    window.close();

    if (selectedItem != undefined) {
        if (customActionName != "")
            eval(customActionName + "(" + JSON.stringify(selectedItem) + ");");
        else if (jQuery.isFunction(eval(actionName))) {
            var setAction = actionName + "(" + JSON.stringify(selectedItem) + ",'" + applicantNameField + "','" + applicantContactIdField + "');"
            eval(setAction);
        }

    }
};

//onSearchPersonOpened = function () {

//    MojFind("#btnCancelSearchPersonApplicant").click(function () {
//        var window = $("#actionSearchdialogModal").data("kendoWindow");
//        window.close();
//    });

//    MojFind("#btnOkSearchPersonApplicant").click(function () {
//        PDO.onCloseSearchPersoPopup();
//    });


//    //grid.tbody.find
//    MojFind('tr').live('dblclick', function () {
//        PDO.onCloseSearchPersoPopup();
//    })
//};

//onSearchPersonClose = function () {
//    MojFind('tr').die('dblclick');
//    MojFind("#btnCancelSearchPersonApplicant").off('click');
//    MojFind("#btnOkSearchPersonApplicant").off('click');
//}




$(document).ready(function () {

    MojFind("#SearchCriteria_PersonAdvocateId").on('change', function (e) {
        if (isNaN(parseInt(this.value)) || Moj.isEmpty(this.value)) {
            MojFind("#SearchCriteria_NominationStatusId").enable(false);
            MojControls.AutoComplete.clearSelectionById("SearchCriteria_NominationStatusId");
        }
        else
            MojFind("#SearchCriteria_NominationStatusId").enable(true);
    });

    MojFind("#btnClearSearchPersonApplicant").removeAttr('onclick');

    MojFind("#PersonApplicantSearchDiv").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#btnSearchSearchPersonApplicant").click();
            return false;
        }
    });

    MojFind("[id*='grdContactList']").find("#chbIsSelected").die('click');

    MojFind("[id*='grdContactList']").find("#chbIsSelected").live('click', function () {


        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdContactList");
            var tr = $(this).closest("tr");
            grid.select(tr);
            if (grid.dataSource.total() > 0) {
                grid.tbody.find('tr').each(function () {
                    var dataItem = grid.dataItem(this);
                    if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                        MojControls.CheckBox.setValue($(this).find("[id = chbIsSelected]"), false);
                    }
                });
            }
            MojControls.CheckBox.setValueById("IsNewPersonApplicantChecked", false);
            var contactId = parseInt($(MojControls.Grid.getKendoGridById("grdContactList").tbody.find('tr.k-state-selected').find('td')[1]).text());
            MojFind("#SearchPersonResult_ApplicantContactId").val(contactId);
        }
        else {
            MojFind("#SearchPersonResult_ApplicantContactId").val(null);
        }

    });

    MojFind("[id*='grdContactList']").find("#rdbIsSelected").die('click');

    MojFind("[id*='grdContactList']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdContactList");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

    MojFind("#IsNewPersonApplicantChecked").click(function () {
        
        var isChecked = MojControls.CheckBox.getValueById("IsNewPersonApplicantChecked");
        if (isChecked) {
            //var grid = MojControls.Grid.getKendoGridById("grdContactList");
            //if (grid.dataSource.total() > 0) {
            //    grid.tbody.find('tr').each(function () {
            //        var dataItem = grid.dataItem(this);
            //        if (dataItem != undefined) {
            //            MojControls.CheckBox.setValue($(this).find("[id = chbIsSelected]"), false);
            //        }
            //    });
            //}
            var checkedRow = MojFind("[name='rdbIsSelected']:checked");
            if (checkedRow.length > 0)
            {
                checkedRow.prop('checked', false);
                checkedRow.removeAttr("checked");
            }
            MojFind("#SearchPersonResult_ApplicantContactId").val(0);
        }
        else {
            MojFind("#SearchPersonResult_ApplicantContactId").val(null);
        }
    });

    MojFind("#btnSearchSearchPersonApplicant").click(function () {
        MojFind("#SearchCriteria_ContactId").change();
    });

    MojFind("#btnClearSearchPersonApplicant").click(function (e) {
        Moj.clearFields(e, '[id$="PersonApplicantSearchDiv"]');
        MojControls.Grid.clear('grdContactList');
        enableSearchField(true);
        MojFind("#SearchCriteria_NominationStatusId").enable(false);
    });

    MojFind("#SearchCriteria_ContactId").change(function () {
        var newValue = $(this).val();
        if (newValue != undefined && newValue != "") {
            enableSearchField(false);
            MojFind("#SearchCriteria_NominationStatusId").enable(false);
            Moj.clearFields(undefined, "[id$='PersonApplicantSearchDiv']");
            MojFind("#SearchCriteria_ContactId").val(newValue);
        }
        else {
            enableSearchField(true);
        }

    });

    MojFind('#searchPersonApplicantPanel .minus').die('click');

    MojFind('#searchPersonApplicantPanel .minus').live('click', function () {
        var isWizard = MojFind("#SearchCriteria_IsWizard").val();
        if (isWizard == "True")
            MojControls.Grid.setPageSizeById('grdContactList', 10)
        else
            MojControls.Grid.setPageSizeById('grdContactList', 20)
    })

    MojFind('#searchPersonApplicantPanel .plus').die('click');

    MojFind('#searchPersonApplicantPanel .plus').live('click', function () {
        var isWizard = MojFind("#SearchCriteria_IsWizard").val();
        if (isWizard == "True")
            MojControls.Grid.setPageSizeById('grdContactList', 5)
        else
            MojControls.Grid.setPageSizeById('grdContactList', 13)
    })

    MojFind('tr').die('dblclick');

    MojFind("#btnCancelSearchPersonApplicant").off('click');

    MojFind("#btnOkSearchPersonApplicant").off('click');

    MojFind("#btnCancelSearchPersonApplicant").click(function () {
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();
    });

    MojFind("#btnOkSearchPersonApplicant").click(function () {
        onCloseSearchPersoPopup();
    });

    //grid.tbody.find
    MojFind('tr').live('dblclick', function () {
        onCloseSearchPersoPopup();
    })
   
});

