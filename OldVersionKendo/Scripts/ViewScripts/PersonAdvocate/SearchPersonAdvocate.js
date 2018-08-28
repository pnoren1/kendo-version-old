function AdvocateList_RequestEnd(e, lbl) {
    debugger;
    if (Moj.isFalse(MojFind("#IsCheckAllAbility").val()))
        PDO._onSearchRequestEnd(e, lbl);

    MojFind("#SearchCriteria_IsFirstTime").val(false);
    MojFind("#SearchCriteria_FullName").val("");
    if (e.response != undefined) {
        if (e.response.Total == 1 && !Moj.isTrue(MojFind("#SearchCriteria_IsPopup").val())) {
            var id = e.response.Data[0].ContactId;
            PDO.addEntityContentTab(EntityContentTypeEnum.Advocate, id, "", Resources.Strings.Advocate + " " + id, "Advocate_Tab_" + id);
        }
    }
}

AdvocateDetails_CloseTab = function (id) {
    var tabToCloseButtonAdvocateDetails;
    if (id == 0)
        tabToCloseButtonAdvocateDetails = $('.tab-close[id*="Advocate_Tab_0"]');
    else
        tabToCloseButtonAdvocateDetails = $('.tab-close[id*="Advocate_Tab_"]:not(.tab-close[id*="Advocate_Tab_' + id + '"])');

    var AdvocateDetailsTabToClose = tabToCloseButtonAdvocateDetails.attr("id");

    if (typeof (AdvocateDetailsTabToClose) != "undefined") {
        PDO.closeEntityTab(tabToCloseButtonAdvocateDetails);
    }
};

NewAdvocateClick = function () {
    AdvocateDetails_CloseTab(0);
    var value = $.trim(MojFind("#ObjectToSearch").val());
    if (/^[0-9]+$/.test(value))
        PDO.addEntityContentTab(EntityContentTypeEnum.Advocate, 0, { IDNumber: value }, Resources.Strings.NewAdvocate, "Advocate_Tab_0");
    else
        PDO.addEntityContentTab(EntityContentTypeEnum.Advocate, 0, "", Resources.Strings.NewAdvocate, "Advocate_Tab_0");

};

function notEmpty(elem) {
    if (elem.length == 0) {
        return false;
    }
    return true;
}

enableSearcAdvocatehField = function (isEnabled, flag) {

    if (flag != "CurrentDistrictOnly")
    {
        MojFind("#SearchCriteria_DistrictId").enable(isEnabled);
        MojFind("#SearchCriteria_AdvocateStatus").enable(isEnabled);
    }
            MojFind("#SearchCriteria_IDNumber").enable(isEnabled);
            MojFind("#SearchCriteria_LastName").enable(isEnabled);
            MojFind("#SearchCriteria_FirstName").enable(isEnabled);
            MojFind("#SearchCriteria_ExistNumberMerkava").enable(isEnabled);
            MojFind("#SearchCriteria_AdvocateLicenseNumber").enable(isEnabled);
            MojFind("#SearchCriteria_AdvocateLicenseStatusId").enable(isEnabled);

            MojFind("#SearchCriteria_StatusInMerkavaId").enable(isEnabled);
            MojFind("#SearchCriteria_StatusAdmissionRequestId").enable(isEnabled);
            MojFind("#SearchCriteria_AdmissionRequestFromDate").enable(isEnabled);

            MojFind("#SearchCriteria_AdmissionRequestToDate").enable(isEnabled);
            MojFind("#SearchCriteria_DifficultyLevelName").enable(isEnabled);
            MojFind("#SearchCriteria_AdditionalCertificationId").enable(isEnabled);
            MojFind("#SearchCriteria_ApplicantCharacteristicType").enable(isEnabled);
            MojFind("#SearchCriteria_Specialization").enable(isEnabled);
            MojFind("#SearchCriteria_Language").enable(isEnabled);
            MojFind("#SearchCriteria_NominationPoolId").enable(isEnabled);
            MojFind("#SearchCriteria_Court").enable(isEnabled);
            MojFind("#SearchCriteria_ZoneId").enable(isEnabled);
            MojFind("#SearchCriteria_NominationPriorityId").enable(isEnabled);
            MojFind("#SearchCriteria_ShiftTypeId").enable(isEnabled);
            MojFind("#SearchCriteria_ContractLineTypeId").enable(isEnabled);
            //MojFind("#SearchCriteria_OnCallOrOnDutyId").enable(false);

              if (MojFind("#SearchCriteria_DistrictId").val() == "")
              {
                    //MojFind("#SearchCriteria_StatusAdmissionRequestId").enable(false);
                    //MojFind("#SearchCriteria_AdmissionRequestFromDate").enable(false);
                    //MojFind("#SearchCriteria_AdmissionRequestToDate").enable(false);
                    //MojFind("#SearchCriteria_AdvocateStatus").enable(false);
                    EnableOrDisableFields(false);
                }
                else
                {
                    //MojFind("#SearchCriteria_StatusAdmissionRequestId").enable(true);
                    //MojFind("#SearchCriteria_AdmissionRequestFromDate").enable(true);
                    //MojFind("#SearchCriteria_AdmissionRequestToDate").enable(true);
                    //MojFind("#SearchCriteria_AdvocateStatus").enable(true);
                    if (Moj.isTrue(MojFind("#SearchCriteria_IsCurrentDistrictOnly").val()))
                        EnableOrDisableFields(true, flag);
                    else
                        EnableOrDisableFields(true);
                }

};

personAdvocateSelected = function () {
    debugger;
    var grid = MojFind("[id^='grdAdvocateList']").data("kendoGrid");
    var myWindow = $("#actionSearchdialogModal").data("kendoWindow");
    if (myWindow != null)
        myWindow.close();
    if (grid.dataItem(grid.select()) != undefined) {
        var ParentEntityInstanceID = grid.dataItem(grid.select())["ContactId"];
        var ParentEntityInstance = grid.dataItem(grid.select())["ContactId"];
        GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
    }
}

//ReadOnlyFields = function () {
//    if (Moj.isTrue(MojFind("#SearchCriteria_IsPopup").val()))
//        MojFind("#SearchCriteria_DistrictId").attr("disabled", true);

//};

EnableOrDisableFields = function (IsEnabled, flag) {
    if (flag != "CurrentDistrictOnly") {
        MojFind("#SearchCriteria_AdvocateStatus").enable(IsEnabled);
    }

    MojFind("#SearchCriteria_StatusAdmissionRequestId").enable(IsEnabled);
    MojFind("#SearchCriteria_AdmissionRequestFromDate").enable(IsEnabled);

    MojFind("#SearchCriteria_AdmissionRequestToDate").enable(IsEnabled);
    MojFind("#SearchCriteria_DifficultyLevelName").enable(IsEnabled);
    MojFind("#SearchCriteria_AdditionalCertificationId").enable(IsEnabled);
    MojFind("#SearchCriteria_ApplicantCharacteristicType").enable(IsEnabled);
    MojFind("#SearchCriteria_Specialization").enable(IsEnabled);
    MojFind("#SearchCriteria_Language").enable(IsEnabled);
    MojFind("#SearchCriteria_NominationPoolId").enable(IsEnabled);
    MojFind("#SearchCriteria_Court").enable(IsEnabled);
    MojFind("#SearchCriteria_ZoneId").enable(IsEnabled);
    MojFind("#SearchCriteria_NominationPriorityId").enable(IsEnabled);
    MojFind("#SearchCriteria_ShiftTypeId").enable(IsEnabled);
    MojFind("#SearchCriteria_ContractLineTypeId").enable(IsEnabled);
    //MojFind("#SearchCriteria_OnCallOrOnDutyId").enable(false);
    

    if (IsEnabled == false)
    {
        MojControls.AutoComplete.setValueById("SearchCriteria_StatusAdmissionRequestId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_AdvocateStatus", "");
        MojControls.DateTimePicker.setValueById("SearchCriteria_AdmissionRequestFromDate", "");
        MojControls.DateTimePicker.setValueById("SearchCriteria_AdmissionRequestToDate", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_DifficultyLevelName", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_AdditionalCertificationId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_ApplicantCharacteristicType", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_Specialization", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_Language", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_NominationPoolId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_Court", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_ZoneId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_NominationPriorityId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_ShiftTypeId", "");
        MojControls.AutoComplete.setValueById("SearchCriteria_ContractLineTypeId", "");
        //MojControls.AutoComplete.setValueById("SearchCriteria_OnCallOrOnDutyId", "");
    }
}

$(document).ready(function () {

    MojFind("#btnOkSearchPersonApplicant").off('click');

    MojFind("#btnCancelSearchPersonApplicant").click(function () {
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();
    });

    MojFind("#btnClearSearchPersonAdvocateForNomination").removeAttr('onclick');

    MojFind("#btnClearSearchPersonAdvocateForNomination").click(function (e) {
        Moj.clearFields(e, '[id$="SearchPersonAdvocateForNominationDivForCancel"]');
    });

    //ReadOnlyFields();


    MojFind("#btnClearSearchPersonAdvocate").removeAttr('onclick');

    MojFind("#PersonAdvocateSearchDiv").off('keypress');
    MojFind("#PersonAdvocateSearchDiv").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#btnSearchSearchPersonAdvocate").click();
            return false;
        }
    });

    //MojFind("#btnSearchSearchPersonAdvocate").click(function () {
    //    MojFind("#SearchCriteria_ContactId").change();
    //});

    MojFind("#btnClearSearchPersonAdvocate").click(function () {
        Moj.clearFields(undefined, "[id$='PersonAdvocateSearchDiv']", ":not(.not_for_clear)");
        MojControls.Grid.clear('grdAdvocateList');
        if (Moj.isTrue(MojFind("#SearchCriteria_IsCurrentDistrictOnly").val())) {
            enableSearcAdvocatehField(true, "CurrentDistrictOnly");
        }
        else {
            var defaultDistrictId = parseInt(MojFind("#DefaultDistrictId").val());
            MojControls.AutoComplete.setValueById("SearchCriteria_DistrictId", defaultDistrictId);
            enableSearcAdvocatehField(true, "ClearButton");
        }
    });

    MojFind('#searchPersonAdvocatePanel .minus').die('click');
    MojFind('#searchPersonAdvocatePanel .minus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdAdvocateList', 22);
    });

    MojFind('#searchPersonAdvocatePanel .plus').die('click');
    MojFind('#searchPersonAdvocatePanel .plus').live('click', function () {
        MojControls.Grid.setPageSizeById('grdAdvocateList', 11);
    });

    MojFind("#SearchCriteria_ContactId").change(function () {
        var newValue = $(this).val();
        if (newValue != undefined && newValue != "") {
           
            Moj.clearFields(undefined, "[id$='PersonAdvocateSearchDiv']", ":not(.not_for_clear)");
            MojFind("#SearchCriteria_ContactId").val(newValue);
            enableSearcAdvocatehField(false);
            

        }
        else {
            //if (Moj.isTrue(MojFind("#SearchCriteria_IsCurrentDistrictOnly").val()))
            //    enableSearcAdvocatehField(true, "CurrentDistrictOnly");
            //else
            //enableSearcAdvocatehField(true);
            MojFind("#btnClearSearchPersonAdvocate").click();
            //MojFind("#SearchCriteria_DistrictId").attr("readonly", true);
            //MojFind("#SearchCriteria_AdvocateStatus").attr("readonly", true);
        }

    });

    MojFind("[id*='grdAdvocateList']").find("#rdbIsSelected").die('click');

    MojFind("[id*='grdAdvocateList']").find("#rdbIsSelected").live('click', function () {
        if (this.checked) {
            var grid = MojControls.Grid.getKendoGridById("grdAdvocateList");
            var tr = $(this).closest("tr");
            grid.select(tr);
        }
    });

    MojFind("#SearchCriteria_DistrictId").change(function () {
        if (MojFind("#SearchCriteria_DistrictId").val() != "") {
            EnableOrDisableFields(true);
        }
        else {
            EnableOrDisableFields(false);
        }

    });

    //MojFind("#SearchCriteria_ShiftTypeId").change(function () {
    //    if (MojFind("#SearchCriteria_ShiftTypeId").val() != "")
    //    {
    //        MojFind("#SearchCriteria_OnCallOrOnDutyId").enable(true);
    //    }
    //    else
    //    {
    //        MojFind("#SearchCriteria_OnCallOrOnDutyId").enable(false);
    //        MojControls.AutoComplete.setValueById("SearchCriteria_OnCallOrOnDutyId", "");
    //    }

        
    //})
    
    MojFind('tr').live('dblclick', function () {
        onSearchPersonAdvocatePopupClosed();
    })

    //MojFind("[id^='grdAdvocateList']").find("#rdbIsSelected").die('click');
    //MojFind("[id^='grdAdvocateList']").find("#rdbIsSelected").live('click', function () {
    //    if (this.checked) {
    //        var grid = MojControls.Grid.getKendoGridById("grdAdvocateList");
    //        var tr = $(this).closest("tr");
    //        grid.select(tr);
    //    }
    //});
});

//----------------handle search perosn advocate as popup-----------------------------------------------

//---remvoe handlers
MojFind('tr').die('dblclick');
MojFind("#btnCancelSearchPersonAdvocate").off('click');
MojFind("#btnOkSearchPersonAdvocate").off('click');


//----add handlers
MojFind("#btnCancelSearchPersonAdvocate").click(function () {
    var window = $("#SearchPersonAdvocateDialog").data("kendoWindow");
    window.close();
});

MojFind("#btnOkSearchPersonAdvocate").click(function () {
    onSearchPersonAdvocatePopupClosed();
});



onSearchPersonAdvocatePopupClosed = function () {
    debugger;
    var grid = MojControls.Grid.getKendoGridById("grdAdvocateList");
    var selectedItem = grid.dataItem(grid.select());
    var onCloseMethod = MojFind("#OnClosePopupMethod").val();
    var IsCheckAllAbility = MojFind("#IsCheckAllAbility").val();
    var window = $("#SearchPersonAdvocateDialog").data("kendoWindow");
    window.close();

    if (Moj.isTrue(IsCheckAllAbility)) {
        if (jQuery.isFunction(eval(onCloseMethod))) {
            grid.tbody.find('tr').each(function () {
                var row = this;
                var dataItem = grid.dataItem(row);
                if (dataItem != undefined) {
                    $(row).addClass("unSelected");
                    $(row).find('td div').addClass('unSelectedColor');
                    $(row).removeClass('k-state-selected k-state-selecting');
                }
            });
            var methodToEval = onCloseMethod + "(" + JSON.stringify(grid.dataSource.data()) + ");"
            eval(methodToEval);
        }
    }
    else if (selectedItem != undefined) {
        if (jQuery.isFunction(eval(onCloseMethod))) {
            var methodToEval = onCloseMethod + "(" + JSON.stringify(selectedItem) + ");"
            eval(methodToEval);
        }

    }
};

//IsEnableOnCallOrOnDutyId = MojFind("#ShiftTypeId").change(function () {
//    var ShiftTypeIdField_Value = MojFind("#ShiftTypeId").val();
//    if (ShiftTypeIdField_Value != "")
//        EnableOnCallOrOnDutyId(true);
//    else
//        EnableOnCallOrOnDutyId(false);
//});

//EnableOnCallOrOnDutyId = function (isEnabled) {
//    MojFind("#OnCallOrOnDutyId").enable(isEnabled);
//}

var selectedId;

MojFind("#btnActionSearchPersonAdvocate").die('click');
MojFind("#btnActionSearchPersonAdvocate").live('click', function () {

    var targetGrid = MojFind("[id^='grdAdvocateList']").data("kendoGrid");

    var selectedItem = targetGrid.select();
    if (selectedItem.length > 0)
    {
        selectedId = selectedItem.find("td").first().find("input")[0].getAttribute("value");
        Moj.HtmlHelpers._onCancelButtonClicked(btnActionSearchPersonAdvocate);

        if (MojFind(".tr-mode-inline-grid").length != 0) {
            MojFind('#tr_grdAdvocateNominationCallsList_Details').remove();
        }

        Moj.HtmlHelpers._showGridAddDetails('grdAdvocateNominationCallsList', '/Process/AdvocateNominationCallDetails', 'True', 'True', 'AddSelectedAdvocatesArrayToGrid', 'False');

        $.ajax({
            url: baseUrl + '/PersonAdvocate/GetAdvocateDataSourceByProfileId',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "profileId": "' + selectedId + '" }',
            success: function (data) {
                if (data != undefined) {
                    MojControls.AutoComplete.setDataSourceAndValue("AdvocateProfileId", data, selectedId);
                }
            }
        });

        //MojControls.AutoComplete.setValueById("AdvocateProfileId", selectedId);
        var response = CheckIfAdvocateContactIdAlreadyExistInGrid();

        if (!Moj.isTrue(response)) //קיים בגריד כבר
            MojFind('#tr_grdAdvocateNominationCallsList_Details').remove();
        else //לא קיים בגריד
            Moj.HtmlHelpers._saveRowToGrid('grdAdvocateNominationCallsList', 'tr_grdAdvocateNominationCallsList_Details', '', '', '', true, '', '', '', false);
    }
});

AddSelectedAdvocatesArrayToGrid = function () {
    return { "AdvocateContactId": selectedId }
};

//-------------------------------------------------------------------------------------------------------