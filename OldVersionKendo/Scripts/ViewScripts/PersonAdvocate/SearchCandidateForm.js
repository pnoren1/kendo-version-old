function CandidateForm_RequestEnd(e, lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    if (e.response != undefined) {
        if (e.response.Total == 1){
            var id = e.response.Data[0].CandidateFormId;
            var advocateId = e.response.Data[0].AdvocateId;
            //var fullName = Moj.HtmlHelpers._htmlEscape(e.response.Data[0].FullNameNoSpaces);
            var fullName = e.response.Data[0].FullNameNoSpaces;
            //PDO.addEntityContentTab(EntityContentTypeEnum.CandidateForm, id, "", Resources.Strings.CandidateForm + " " + id, "CandidateForm_Tab_" + id);
            PDO.addCandidateFormById(id, advocateId, fullName);
        }
    }
}

enableSearcCandidateFormField = function (isEnabled) {

    MojFind("#SearchCriteria_SubmissionDateFrom").enable(isEnabled);
    MojFind("#SearchCriteria_SubmissionDateTo").enable(isEnabled);
    MojFind("#SearchCriteria_Status").enable(isEnabled);
    MojFind("#SearchCriteria_StatusReason").enable(isEnabled);
    MojFind("#SearchCriteria_IDNumber").enable(isEnabled);
    MojFind("#SearchCriteria_LastName").enable(isEnabled);
    MojFind("#SearchCriteria_FirstName").enable(isEnabled);
    MojFind("#SearchCriteria_AdvocateLicenseNumber").enable(isEnabled);
    MojFind("#SearchCriteria_AdvocateLicenseYearFrom").enable(isEnabled);
    MojFind("#SearchCriteria_AdvocateLicenseYearTo").enable(isEnabled);
};
function grdCAndidateFormList() {

}

GetCandidateFormDetails = function (CandidateFormId, AdvocateId) {
    //CandidateFormDetails_CloseTab(CandidateFormId);
    //PDO.addEntityContentTab(EntityContentTypeEnum.CandidateForm, id, "", Resources.Strings.CandidateForm + " " + id, "CandidateForm_Tab_" + id);
    //testAddTab(id, Resources.Strings.CandidateForm + " " + id, "CandidateForm_Tab_" + id);
    var parentTabName = "CandidateForm_Tab_" + CandidateFormId;
    Moj.addTab("#tabStrip", "טופס בקשה" + " " + CandidateFormId, parentTabName, CandidateFormId, false, function () {
        $("#divContent_" + parentTabName).load(baseUrl + '/PersonAdvocate/CandidateFormDetails?candidateFormId=' + CandidateFormId + '&advocateId=' + AdvocateId, function () {
            $("#divContent_" + parentTabName).find("[id^='content']").attr("id", "content_" + CandidateFormId);
            $("#divContent_" + parentTabName).find("[id^='lnk']").attr("data-ajax-update", "#content_" + CandidateFormId);
        });
    }, false);
};


CandidateFormDetails_CloseTab = function (id) {
    var tabToCloseButtonCandidateFormDetails;
    if (id == 0)
        tabToCloseButtonCandidateFormDetails = $('.tab-close[id*="CandidateForm_Tab_"]');
    else
        tabToCloseButtonCandidateFormDetails = $('.tab-close[id*="CandidateForm_Tab_"]:not(.tab-close[id*="CandidateForm_Tab_' + id + '"])');

    var CandidateFormDetailsTabToClose = tabToCloseButtonCandidateFormDetails.attr("id");

    if (typeof (CandidateFormDetailsTabToClose) != "undefined") {
        PDO.closeEntityTab(tabToCloseButtonCandidateFormDetails);
    }
};
$(document).ready(function () {

    MojFind("#btnCancelSearchCandidateForm").off('click');
    MojFind("#btnOkSearchCandidateForm").off('click');

    resetCandidateSearchForm = function () {
        MojFind("#SearchCriteria_CandidateFormId").change();
    }

    MojFind("#CandidateFormSearchDiv").on('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#btnSearchSearchCandidateForm").click();
            return false;
        }
    });

    MojFind("#btnSearchSearchCandidateForm").click(function () {
        resetCandidateSearchForm();
    });

    MojFind("#btnCancelSearchCandidateForm").click(function () {
        
        var window = $("#actionSearchdialogModal").data("kendoWindow");
        window.close();
        });

    MojFind("#btnClearSearchCandidateForm").click(function () {
        resetCandidateSearchForm();
        MojControls.Grid.clear('grdCandidateFormList');
    });

    MojFind("#SearchCriteria_CandidateFormId").change(function () {

        var newValue = $(this).val();
        if (newValue != undefined && newValue != "") {
            enableSearcCandidateFormField(false);
            Moj.clearFields(undefined, "[id$='SearchCandidateForm']");
            MojFind("#SearchCriteria_CandidateFormId").val(newValue);
        }
        else {
            enableSearcCandidateFormField(true);
        }

    });

candidateFormSelected = function () {
        var grid = MojFind("[id^='grdCandidateFormList']").data("kendoGrid");
        var myWindow = $("#actionSearchdialogModal").data("kendoWindow");
        myWindow.close();
        if (grid.dataItem(grid.select()) != undefined) {
            var ParentEntityInstanceID = grid.dataItem(grid.select())["CandidateFormId"];
            var ParentEntityInstance = grid.dataItem(grid.select())["CandidateFormId"];
            GenericDocuments.setParentEntityData(ParentEntityInstance, ParentEntityInstanceID);
        }
}

MojFind("[id*='grdCandidateFormList']").find("#rdbIsSelected").die('click');
MojFind("[id*='grdCandidateFormList']").find("#rdbIsSelected").live('click', function () {
    
    if (this.checked) { 
        var grid = MojControls.Grid.getKendoGridById("grdCandidateFormList");
        var tr = $(this).closest("tr");
        grid.select(tr);
    }
});



MojFind("#btnOkSearchCandidateForm").click(function () {
    
    onSearchCandidateFormPopupClosed();
});


onSearchCandidateFormPopupClosed = function () {
    
    var grid = MojControls.Grid.getKendoGridById("grdCandidateFormList");
    var selectedItem = grid.dataItem(grid.select());
    var candidateFormIdFieldName = MojFind("#CandidateFormIdFieldName").val();
    var window = $("#actionSearchdialogModal").data("kendoWindow");
    var customActionName = MojFind("#CustomActionName").val();
    var actionName = "PDO.setSelectedCandidateForm";

    window.close();

    if (selectedItem != undefined) {
        if (customActionName != "")
            eval(customActionName + "(" + JSON.stringify(selectedItem) + ");");
        else if (jQuery.isFunction(eval(actionName))) {
            var setAction = actionName + "(" + JSON.stringify(selectedItem) + ",'" + candidateFormIdFieldName  + "');"
            eval(setAction);
        }
    }
};

    MojFind("#SearchCriteria_Status").change(function () {

        if (isNaN(parseInt(this.value)) || this.value == 0) {
        }
        MojControls.ComboBox.clearComboBox(MojFind("#SearchCriteria_StatusReason"), true);
        
        $.ajax({
            url: baseUrl + '/PersonAdvocate/GetCandidateFormStatusReason',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "statusId": "' + this.value + '" }',

            success: function (retData) {

                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSource("SearchCriteria_StatusReason", retData);
                    MojControls.AutoComplete.clearSelectionById("SearchCriteria_StatusReason");
                }
            },
            error: function (xhr, tStatus, err) {
                //alert(err);
            }
        });

    });
});