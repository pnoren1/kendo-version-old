var DocumentSearch = {
    setEntity: function () {
        $.get(baseUrl + '/Documents/GetEntityList?ParentEntityID=' + MojFind("#DocumentSearchObject_ParentEntityID").val(), function (data) {

            var cmb = MojFind('#DocumentSearchObject_EntityID').data("kendoDropDownList");
            Moj.setDataSource(cmb, data);
            MojControls.DropDown.clearDropDown(MojFind('#DocumentSearchObject_EntityInstanceID'));
            DocumentSearch.changeEntityInstance();
            if (MojFind("#DocumentSearchObject_IsShowRelationParameters").val() == "True") {
                if (originalEntityInstanceID != undefined && originalEntityID != undefined) {
                    MojControls.DropDown.setValueById("DocumentSearchObject_EntityID", originalEntityID);
                    if (MojFind("#DocumentSearchObject_ParentEntityInstance").val() != "" && MojFind("#DocumentSearchObject_ParentEntityID").val() != "" && MojFind("#DocumentSearchObject_EntityID").val() != "") {
                        $.get(baseUrl + '/Documents/GetEntityInstance?EntityID=' + MojFind("#DocumentSearchObject_EntityID").val() + '&ParentEntityID=' + MojFind("#DocumentSearchObject_ParentEntityID").val() + '&ParentEntityInstance=' + MojFind("#DocumentSearchObject_ParentEntityInstance").val(), function (data) {
                            var cmb = MojFind('#DocumentSearchObject_EntityInstanceID').data("kendoDropDownList");
                            Moj.setDataSource(cmb, data);
                            MojControls.DropDown.setValueById("DocumentSearchObject_EntityInstanceID", originalEntityInstanceID);
                            DocumentSearch.changeEntityInstance();
                            originalEntityInstanceID = undefined;
                            originalEntityID = undefined;
                            if (MojControls.Grid.getKendoGridById("grdDocumentList") != undefined) {
                                MojFind('#btnSearchDocumentSearch').click();
                            }
                        });
                    }
                }
            }
        });
    },

    changeEntityInstance: function () {
        var Entity = MojFind('#DocumentSearchObject_EntityID').data("kendoDropDownList");
        if (Entity.select() > 0) {
            var SearchAction = Entity.dataSource.data()[Entity.select() - 1].SearchAction;
            var isVisible = MojFind("#DocumentSearchObject_ParentEntityID").val() == "" && MojFind('#DocumentSearchObject_EntityID').val() != "" && SearchAction != "" && SearchAction != null;
            MojFind("#DocumentSearchObject_EntityInstanceID").visible(!isVisible);
            MojFind("#DocumentSearchObject_EntityInstance").visible(isVisible);
            MojFind("#btnEntityInstance").visible(isVisible)
            if (isVisible)
                MojFind("#btnEntityInstance").removeClass("hide");
            else {
                MojFind("#btnEntityInstance").addClass("hide");
                MojFind("#DocumentSearchObject_EntityInstance").val("");
                MojFind("#DocumentSearchObject_EntityInstanceFromSearchID").val("");
            }
        }
        if (MojFind('#DocumentSearchObject_ParentEntityID').closest("div.moj-form-line").hasClass("hide-important") == true && Entity.dataSource.data() != undefined &&
            ((Entity.dataSource.data().length == 0) || (Entity.dataSource.data().length == 1 && Entity.dataSource.data()[0].EntityID == MojFind("#DocumentSearchObject_ParentEntityID").val()))) {
            MojFind("#entityLine").visible(false);
            MojFind("#connectionTitle").visible(false);
        }
        MojFind("#DocumentSearchObject_EntityInstanceID").changeText((MojControls.DropDown.getValueById("DocumentSearchObject_EntityID") != "") ? Resources.Strings.Description + " " + Resources.Strings.The + MojControls.DropDown.getTextById("DocumentSearchObject_EntityID") : Resources.Strings.Description);
    }
}

var originalEntityInstanceID = undefined;
var originalEntityID = undefined;

$(document).ready(function () {


    if (MojFind("#DocumentSearchObject_ParentEntityID").val() != "") {
        if (MojFind("#DocumentSearchObject_IsShowRelationParameters").val() == "True") {
            originalEntityInstanceID = MojFind("#DocumentSearchObject_EntityInstanceID").val();
            originalEntityID = MojFind("#DocumentSearchObject_EntityID").val();
        }
        DocumentSearch.setEntity();
    }

    MojFind("#DocumentSearchObject_IsSearchByDocContent").on("change", function () {
        MojFind("#DocumentSearchObject_WordsToSearch").enable(MojControls.CheckBox.isChecked($(this)));
        MojFind("#searchByDocContent").clearValidationErrors();
        MojFind("#searchByDocRelation :input").enable(!MojControls.CheckBox.isChecked($(this)));
        MojFind("#DocumentSearchObject_CreatedBy").enable(!MojControls.CheckBox.isChecked($(this)));
        MojFind("#SearchAdditionalData :input").enable(!MojControls.CheckBox.isChecked($(this)));
        if (!MojControls.CheckBox.isChecked($(this)))
            MojFind("#DocumentSearchObject_WordsToSearch").val("");
    });

    MojFind("#btnClearfullSearch").on("click", function () {
        MojControls.DropDown.clearDropDown(MojFind('#DocumentSearchObject_EntityInstanceID'));
        MojFind("#DocumentSearchObject_EntityInstanceID").changeText(Resources.Strings.Description);
        MojFind("#DocumentSearchObject_ParentEntityInstance").changeText(Resources.Strings.Description);
        MojFind('#DocumentSearchObject_DccDocumentObject_DocumentStatusID').data("kendoDropDownList").value(window.Enums.DocumentStatus.Active);
        MojFind('#DocumentSearchObject_ParentEntityInstance').enable(false);
        $.get(baseUrl + '/Documents/GetDocumentTypeGroup', function (data) {
            MojControls.DropDown.setDataSource('DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID', data)
            MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").change();
        });
        clearSearchByDocContentDiv();
        Moj.clearFields(undefined, "[id$='SearchAdditionalData']");
    });

    MojFind("#btnClearpartSearch").on("click", function () {
        MojFind('#DocumentSearchObject_DccDocumentObject_DocumentStatusID').data("kendoDropDownList").value(window.Enums.DocumentStatus.Active);
        $.get(baseUrl + '/Documents/GetDocumentTypeGroup', function (data) {
            MojControls.DropDown.setDataSource('DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID', data)
            MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").change();
        });
        clearSearchByDocContentDiv();
        Moj.clearFields(undefined, "[id$='SearchAdditionalData']");
    });

    function clearSearchByDocContentDiv() {
        MojControls.CheckBox.setValueById("DocumentSearchObject_IsSearchByDocContent", false);
        MojFind("#DocumentSearchObject_WordsToSearch").enable(false);
        MojFind("#DocumentSearchObject_WordsToSearch").val("");
        Moj.HtmlHelpers._hideErrorMessage(MojFind("#div_WordsToSearch"));
    };

    MojFind("#DocumentSearchObject_DccDocumentObject_DepartmentID").on("change", function () {
        var DepartmentID = $(this).val();
        //set document categories (groups) by department
        $.get(baseUrl + '/Documents/GetDocumentTypeGroup?DepartmentID=' + DepartmentID, function (data) {
            var cmb = MojFind('#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID').data("kendoDropDownList");
            var DocumentTypeGroupID = MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").val();
            Moj.setDataSource(cmb, data);
            MojControls.DropDown.setValueById("DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID", DocumentTypeGroupID);
        });
        //set document types by department
        $.get(baseUrl + '/Documents/GetDocumentType?DepartmentID=' + DepartmentID, function (data) {
            var cmbTypes = MojFind('#DocumentSearchObject_DccDocumentObject_DocumentTypeID').data("kendoComboBox");
            Moj.setDataSource(cmbTypes, data);
        });
    });

    $(document).on("change", "#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID", function () {
        var DocumentTypeGroupID = $(this).val();

        $.get(baseUrl + '/Documents/GetDocumentType?DocumentTypeGroupID=' + DocumentTypeGroupID, function (data) {
            var cmb = MojFind('#DocumentSearchObject_DccDocumentObject_DocumentTypeID').data("kendoComboBox");
            Moj.setDataSource(cmb, data);
        });

        var documentTypeGroup = MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").data("kendoDropDownList").dataSource.data().find(s => s.Key == DocumentTypeGroupID)
        var departmentCmb = MojFind("#DocumentSearchObject_DccDocumentObject_DepartmentID").data("kendoDropDownList");
        departmentCmb.value(-1);
        if (documentTypeGroup != undefined && documentTypeGroup.DepartmentID != undefined)
            departmentCmb.value(documentTypeGroup.DepartmentID);
    });

    $(document).on("change", "#DocumentSearchObject_DccDocumentObject_DocumentTypeID", function () {
        var DocumentTypeID = $(this).val();
        var DocumentTypeGroupID = MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").val();
        if (DocumentTypeGroupID != "") {
            var documentTypeGroup = MojFind("#DocumentSearchObject_DccDocumentObject_DocumentTypeGroupID").data("kendoDropDownList").dataSource.data().find(s => s.Key == DocumentTypeGroupID)
            var departmentCmb = MojFind("#DocumentSearchObject_DccDocumentObject_DepartmentID").data("kendoDropDownList");
            departmentCmb.value(-1);
            if (documentTypeGroup.DepartmentID != undefined)
                departmentCmb.value(documentTypeGroup.DepartmentID);
        }
    });

    MojFind("#DocumentSearchObject_ParentEntityID").on("change", function () {
        MojFind("#DocumentSearchObject_ParentEntityInstance").enable($(this).val() != "");
        MojFind("#DocumentSearchObject_ParentEntityInstance").changeText(($(this).val() != "") ? Resources.Strings.Description + " " + Resources.Strings.The + MojControls.DropDown.getTextById("DocumentSearchObject_ParentEntityID") : Resources.Strings.Description);
        var isEnable = false;
        if ($(this).val() != "") {
            var ParentEntity = $(this).data("kendoDropDownList");
            var actionSearch = ParentEntity.dataSource.data()[ParentEntity.select() - 1].SearchAction;
            isEnable = actionSearch != null && actionSearch != "";
        }
        MojFind("#btnActionSearch").enable(isEnable);
        var text = ($(this).val() != "") ? Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentSearchObject_ParentEntityID") : Resources.Strings.Search;
        $("#" + MojFind("#btnActionSearch").attr("aria-describedby") + "-content").html(text);
        MojFind("#btnActionSearch span").html(text);
        if ($(this).val() == "") {
            MojFind("#DocumentSearchObject_ParentEntityInstance").val("");
        }
        DocumentSearch.setEntity();
    });

    MojFind("#DocumentSearchObject_EntityID,#DocumentSearchObject_ParentEntityInstance").on("change", function () {
        if (MojFind("#DocumentSearchObject_ParentEntityInstance").val() != "" && MojFind("#DocumentSearchObject_ParentEntityID").val() != "" && MojFind("#DocumentSearchObject_EntityID").val() != "") {
            $.get(baseUrl + '/Documents/GetEntityInstance?EntityID=' + MojFind("#DocumentSearchObject_EntityID").val() + '&ParentEntityID=' + MojFind("#DocumentSearchObject_ParentEntityID").val() + '&ParentEntityInstance=' + MojFind("#DocumentSearchObject_ParentEntityInstance").val(), function (data) {
                var cmb = MojFind('#DocumentSearchObject_EntityInstanceID').data("kendoDropDownList");
                Moj.setDataSource(cmb, data);
            });
        }
        else
            MojControls.DropDown.clearDropDown(MojFind('#DocumentSearchObject_EntityInstanceID'));
        DocumentSearch.changeEntityInstance();
    });

    MojFind("#btnActionSearch").on("click", function () {
        if ($(this).attr("disabled") == undefined && MojFind("#DocumentSearchObject_ParentEntityID").val() != "") {
            var ParentEntity = MojFind("#DocumentSearchObject_ParentEntityID").data("kendoDropDownList");
            var actionSearch = ParentEntity.dataSource.data()[ParentEntity.select() - 1].SearchAction;
            if (actionSearch != null && actionSearch != "") {
                MojFind("#btnActionSearch").attr("isActive", true);
                MojFind("#btnEntityInstance").removeAttr("isActive");
                MojFind("#btnParentActionSearch").removeAttr("isActive");
                Moj.website.openPopupWindow('actionSearchdialogModal', '', Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentSearchObject_ParentEntityID"), '1140', '870', '', '', '', baseUrl + "/" + actionSearch);
            }
        }
    });

    MojFind("#btnEntityInstance").on("click", function () {
        var Entity = MojFind("#DocumentSearchObject_EntityID").data("kendoDropDownList");
        var actionSearch = Entity.dataSource.data()[Entity.select() - 1].SearchAction;
        MojFind("#btnEntityInstance").attr("isActive", true);
        MojFind("#btnActionSearch").removeAttr("isActive");
        MojFind("#btnParentActionSearch").removeAttr("isActive");
        if (actionSearch != null && actionSearch != "")
            Moj.website.openPopupWindow('actionSearchdialogModal', '', Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentSearchObject_EntityID"), '1140', '870', '', '', '', baseUrl + "/" + actionSearch, function () {
            });
    });


    MojFind('#docSearch').enterkeypress(function (e) {
        MojFind('#btnSearchDocumentSearch').focus().click();
    });
    MojFind("#openNewBrowser").on("click", function () {
        Moj.safeAjaxCall('/Documents/GetDocumentSearchModel',
            "post",
            MojFind("#SearchModelSerialized").val(),
            undefined,
            function (data) {
                GenericDocuments.openSearchTab(data);
            });   
    });

});



