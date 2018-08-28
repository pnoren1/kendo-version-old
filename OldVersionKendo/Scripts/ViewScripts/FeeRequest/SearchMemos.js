
LinkToEntity = function (EntityId, EntityType) {
    var tabName;
    var typeEnum;
    var tabTitle;
    switch (EntityType) {
        case MemoEntityType.Applicant:
            tabName = 'Contact';
            typeEnum = EntityContentTypeEnum.Applicant;
            tabTitle = Resources.Strings.Applicant;
            break;
        case MemoEntityType.Advocate:
            tabName = 'Advocate';
            typeEnum = EntityContentTypeEnum.Advocate;
            tabTitle = Resources.Strings.Advocate;
            break;
        default:
            return;
    }

    CloseEntityTab(EntityId, tabName);
    PDO.addEntityContentTab(typeEnum, EntityId, null, tabTitle + " " + EntityId, tabName + "_Tab_" + EntityId);
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
                    var searchMemoEntityIds = Moj.appendObjectForSubmit("MemoEntitys", retData, MojFind("#pnlGetMemoListByEntity"));
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

fillMemoEntities();

$(document).ready(function () {

    MojFind("#SearchCriteria_SearchEntityTypeId").die('change');
    MojFind("#SearchCriteria_SearchEntityTypeId").live('change', function (e) {
        if (isNaN(parseInt(this.value)) || this.value == 0) {
            MojControls.AutoComplete.setValueById("SearchEntityId", 0);
            MojFind("#SearchEntityId").enable(false);
            return;
        }
        else {
            //MojFind("#MemoEntityId").enable(true);
            var entityTypeId = this.value;
            MojControls.ComboBox.clearComboBox(MojFind("#SearchCriteria_SearchEntityId"), true);
            fillMemoEntityId(entityTypeId, "SearchCriteria_SearchEntityId");
        }
    });

    MojFind("#EntityTypeId").die('change');
    MojFind("#EntityTypeId").live('change', function (e) {
        if (isNaN(parseInt(this.value)) || this.value == 0) {
            MojControls.AutoComplete.setValueById("MemoEntityId", 0);
            MojFind("#MemoEntityId").enable(false);
            return;
        }
        else {
            //MojFind("#MemoEntityId").enable(true);
            var entityTypeId = this.value;
            MojControls.ComboBox.clearComboBox(MojFind("#MemoEntityId"), true);
            fillMemoEntityId(entityTypeId, "MemoEntityId");
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

    MojFind("#btnClearGetMemoListByEntity").die('click');
    MojFind("#btnClearGetMemoListByEntity").live('click', function (e) {
        var defaultEntityTypeId = MojFind("#DefaultEntityTypeId").val();
        var defaultEntityId = MojFind("#DefaultEntityId").val();
        //Moj.clearFields("btnClearGetMemoListByEntity");
        MojControls.AutoComplete.setValueById("SearchCriteria_SearchEntityTypeId", defaultEntityTypeId);
        MojControls.AutoComplete.setValueById("SearchCriteria_SearchEntityId", defaultEntityId);
    });
});

