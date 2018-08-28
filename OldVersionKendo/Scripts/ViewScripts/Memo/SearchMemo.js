
LinkToEntity = function (entityId, entityType) {
    
    var tabName;
    var typeEnum;
    var tabTitle;
    switch (entityType) {
        case MemoEntityType.Applicant:
            PDO.addContactTabById(entityId);
            break;
        case MemoEntityType.Advocate:
            PDO.addAdvocateTabById(entityId);
            break;
        case MemoEntityType.Process:
            PDO.addProcessTabById(entityId);
            break;
        case MemoEntityType.PDOFile:
            PDO.addPdoFileTabById(entityId);
            break;
        case MemoEntityType.FeeHearingRequest:
            PDO.addFeeRequestHearingTabById(entityId, "", "");
            break;
        case MemoEntityType.FeeShiftRequest:
                PDO.addFeeRequestShiftCallTabById(entityId, "", "");
        //    break;
        default:
            return;
    }

    //CloseEntityTab(EntityId, tabName);
    //PDO.addEntityContentTab(typeEnum, EntityId, null, tabTitle + " " + EntityId, tabName + "_Tab_" + EntityId);
};

CloseEntityTab = function (id, tabName) {
    var tabToCloseButton;
    if (id == 0)
        tabToCloseButton = $('.tab-close[id*="' + tabName + '_Tab_"]');
    else
        tabToCloseButton = $('.tab-close[id*="' + tabName + '_Tab_"]:not(.tab-close[id*="' + tabName + '_Tab_' + id + '"])');

    var tabToClose = tabToCloseButton.attr("id");

    if (typeof (tabToClose) != "undefined") {
        PDO.closeEntityTab(tabToCloseButton);
    }
};

getMemoEntitiesData = function () {
    var searchData = { "SearchEntityId": MojFind("#SearchCriteria_SearchEntityId").val(), "SearchEntityTypeId": MojFind("#SearchCriteria_SearchEntityTypeId").val() }
    return searchData;
};

fillMemoEntityId = function (entityTypeId, memoEntityId) {

    $.ajax({
        url: baseUrl + '/' + MojFind("#SearchCriteria_EntityController").val() + '/FillMemoEntityId',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{ "entityTypeId": "' + entityTypeId + '" }',

        success: function (retData) {
            MojFind("#" + memoEntityId).enable(true);
            if (JSON.stringify(retData) != "[]") {
                MojControls.AutoComplete.setDataSourceAndValue(memoEntityId, retData, -1);
                if (retData != null) {
                    //var searchMemoEntityIds = Moj.appendObjectForSubmit("SearchMemoEntityIds", retData, MojFind("#pnlGetMemoListByEntity"));
                }
            }
        }
    });
};

enableUsers = function (isEnable) {
    if (Moj.isFalse(isEnable)) {
        MojControls.AutoComplete.setValueById("SearchCriteria_MemoRecipientId", 0);
        MojControls.AutoComplete.setValueById("SearchCriteria_MemoCreateUserId", 0);
    }
    MojFind("#SearchCriteria_MemoRecipientId").enable(isEnable);
    MojFind("#SearchCriteria_MemoCreateUserId").enable(isEnable);
};

fillUsers = function (districtId) {

    $.ajax({
        url: baseUrl + '/Memo/FillUsers',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{ "districtId": "' + districtId + '" }',

        success: function (retData) {
            if (retData != null && JSON.stringify(retData) != "[]") {
                enableUsers(true);
                MojControls.AutoComplete.setDataSourceAndValue("SearchCriteria_MemoRecipientId", retData, retData.CurrentUser);
                MojControls.AutoComplete.setDataSourceAndValue("SearchCriteria_MemoCreateUserId", retData, retData.CurrentUser);
            }
        }

    });
};

fillMemoEntities = function (entityParentTypeId) {
    $.ajax({
        url: baseUrl + '/' + MojFind("#SearchCriteria_EntityController").val() + '/FillMemoEntities',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{}',// "entityParentTypeId": "' + entityParentTypeId + '" }',
        success: function (retData) {
            if (JSON.stringify(retData) != "[]") {
                if (retData != null) {
                    
                    var searchMemoEntityIds = Moj.appendObjectForSubmit("SearchCriteria.MemoEntityList", retData, MojFind("#SearchMemoDivNotForCancel"));
                }
            }
        }
    });
};

//MemoHistory = function (parameters) {
//    //Moj.openPopupWindow("MemoHistory", "", Strings.MemoHistory, 900, 310, false, false, false, baseUrl + '/PersonAdvocate/TaagidDetails?businessEntityNumber=' + BENumber + "&businessEntityName=" + BEName.replace(" ", "_"), "");
//    Moj.openPopupWindow(null, null, "", 900, 330, false, false, false,
//    baseUrl + "/Memo/MemoHistory?memoId=" + MojFind("#MemoId").val());

//}

saveMemoDetails = function (data) {
    if (data != null) {
        if (Moj.showErrorMessage(data.Errors) == true) {
            if (data.IsChange) {
                PDO.updateEntityInfo(data.EntityInfo);
            }
            if (Moj.saveSuccess("grdAdmissionRequestsList", data) == true) {
                Moj.changeObjectStateToForm(false);
            };
        }
    }

};

NewMemoClick = function () {
    //ContactDetails_CloseTab(0);
    //PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, 0, "", Resources.Strings.NewApplicant, "Contact_Tab_0");

};

showMemoDetails = function (e) {
    var memoId = 0;
    var url = baseUrl + '/Memo/MemoDetails';
    if (e != undefined) {
        if (e.currentTarget.hasAttribute("disabled") && $(e.currentTarget).attr("disabled") == "disabled") {
            return false;
        } else {
            
            var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
            grid.select($(e.currentTarget).closest("tr"));
            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
            memoId = dataItem.id;
            url = e.currentTarget.href;
        }
    }
    var values = {
        kind: MojFind("#SearchCriteria_MemoKindId").val(),
        entityType: MojFind("#SearchCriteria_DefaultEntityTypeId").val(),
        entityId: MojFind("#SearchCriteria_DefaultEntityId").val(),
        entityController: MojFind("#SearchCriteria_EntityController").val(),
        id: memoId
    }
    //url += "?kind=@Model.SearchCriteria.MemoKindId&entityType=@Model.SearchCriteria.SearchEntityTypeId&entityId=@Model.SearchCriteria.SearchEntityId&entityController=@Model.SearchCriteria.EntityController&id=" + id;
    
    MojFind('#DetailsContent').html("<center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center>");
    var x = MojFind('#DetailsContent').load(url, values, function () {
        if (memoId == 0)
            Moj.setFocusToTheFirstElement(MojFind('#DetailsContent'));
    });
    Moj.replaceDivs('#ListContent', '#DetailsContent');
    return false;
};

if (MojFind("#SearchCriteria_Container").val() == "Entity")
    fillMemoEntities(fillMemoEntities);

$(document).ready(function () {

    MojControls.RadioButton.setValueById("SearchCriteria_ManagedRecipient", "True");

    MojFind("#SearchCriteria_SearchEntityTypeId").unbind('change');
    MojFind("#SearchCriteria_SearchEntityTypeId").bind('change', function (e) {
        if (isNaN(parseInt(this.value)) || this.value == 0) {
            MojControls.ComboBox.clearComboBox(MojFind("#SearchCriteria_SearchEntityId"), false);
            //MojFind("#SearchCriteria_SearchEntityId").enable(false);
            return;
        }
        else {
            //MojFind("#MemoEntityId").enable(true);
            var entityTypeId = this.value;
            MojControls.ComboBox.clearComboBox(MojFind("#SearchCriteria_SearchEntityId"), true);
            fillMemoEntityId(entityTypeId, "SearchCriteria_SearchEntityId");
        }
    });

    //MojFind("#SearchCriteria_UserDistrictId").die('change');
    //MojFind("#SearchCriteria_UserDistrictId").live('change', function (e) {
    //    if (isNaN(parseInt(this.value)) || this.value == 0) {
    //        MojControls.AutoComplete.setValueById("MemoRecipientId", 0);
    //        MojControls.AutoComplete.setValueById("MemoCreateUserId", 0);
    //        MojFind("#MemoRecipientId").enable(false);
    //        MojFind("#MemoCreateUserId").enable(false);
    //        return;
    //    }
    //    fillUsers(this.value);
    //});

    MojFind("#btnClearGetMemoListByEntity").unbind('click');
    MojFind("#btnClearGetMemoListByEntity").bind('click', function (e) {
        //var defaultEntityTypeId = MojFind("#SearchCriteria_DefaultEntityTypeId").val();
        //var defaultEntityId = MojFind("#SearchCriteria_DefaultEntityId").val();
        //Moj.clearFields("btnClearGetMemoListByEntity");
        //MojControls.AutoComplete.setValueById("SearchCriteria_SearchEntityTypeId", defaultEntityTypeId);
        //MojControls.AutoComplete.setValueById("SearchCriteria_SearchEntityId", defaultEntityId);
        //}
    });

    MojFind("[id^='SearchCriteria_ManagedRecipient']").unbind('click');
    MojFind("[id^='SearchCriteria_ManagedRecipient']").bind('click', function (e) {
        
        var isUser = MojControls.RadioButton.getValue(this);
        if (Moj.isTrue(isUser)) {
            MojFind("#SearchCriteria_MemoRecipientId").enable(true);
            MojFind("#SearchCriteria_RoleId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#SearchCriteria_RoleId"));
        }
        else {
            MojFind("#SearchCriteria_RoleId").enable(true);
            MojFind("#SearchCriteria_MemoRecipientId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#SearchCriteria_MemoRecipientId"));
        }

    });

    MojFind("#btnClearSearchMemo").removeAttr('onclick');

    MojFind("#btnClearSearchMemo").click(function (e) {
        if (MojFind("#SearchCriteria_MemoKindId").val() == MemoKind.Reminder) {
            var defaultRecipientId = MojFind("#DefaultRecipientId").val();
            var defaultStatusId = MojFind("#DefaultMemoStatusId").val();
            var defaultToMemoDate = MojFind("#DefaultMemoToDate").val();
            Moj.clearFields(e, '[id$="SearchMemoDivForCancel"]');

            //MojFind("#SearchCriteria_MemoRecipientId").data("kendoComboBox").dataSource.filter([]);
            //MojFind("#SearchCriteria_MemoStatusId").data("kendoComboBox").dataSource.filter([]);

            MojControls.AutoComplete.setValueById("SearchCriteria_MemoRecipientId", defaultRecipientId);
            MojControls.AutoComplete.setValueById("SearchCriteria_MemoStatusId", defaultStatusId);
            MojControls.DateTimePicker.setValueById("SearchCriteria_MemoToDate", Moj.HtmlHelpers._parseDate(defaultToMemoDate, "dd/MM/yyyy"));
            MojFind("#SearchCriteria_MemoRecipientId").enable(true);
            MojControls.RadioButton.setValueById("SearchCriteria_ManagedRecipient", "True");
            MojFind("#SearchCriteria_RoleId").enable(false);
        }
        else
            Moj.clearFields(e, '[id$="SearchMemoDivForCancel"]');

        MojFind("#SearchCriteria_SearchEntityId").enable(false);
        MojControls.Grid.clear('grdMemoList');
        //MojControls.Grid.getKendoGridById('grdMemoList').dataSource.filter([])
    });
});

