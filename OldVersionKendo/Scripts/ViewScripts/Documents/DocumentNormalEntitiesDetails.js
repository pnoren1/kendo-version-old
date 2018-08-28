
$(document).ready(function () {
    MojFind("#DocumentEntityInstance_EntityID").on("change", function () {
        $.get(baseUrl + '/Documents/GetRelationshipList?EntityID=' + MojFind("#DocumentEntityInstance_EntityID").val() + "&ParentEntityID=" + MojFind("#DocumentEntityInstance_ParentEntityID").val(), function (data) {
            var cmb = MojFind('#EntityRelationshipId').data("kendoDropDownList");
            MojControls.DropDown.setDataSource('EntityRelationshipId', data)
            MojControls.DropDown.clearDropDown(MojFind('#EntityRelationshipInstanceId'));
            MojFind("#EntityRelationshipInstanceTextId").val("");
            MojFind("#EntityRelationshipInstanceText").val("");
            MojFind('#EntityRelationshipId').enable(MojFind("#DocumentEntityInstance_EntityID").val() != "");
            var text = (MojFind("#DocumentEntityInstance_EntityID").val() != "") ? Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentEntityInstance_ParentEntityID") : Resources.Strings.Search;
            $("#" + MojFind("#btnNormalActionSearch").attr("aria-describedby") + "-content").html(text);
            MojFind("#btnNormalActionSearch span").html(text);
            
        });
    });

    MojFind("#EntityRelationshipId").on("change", function () {
        var cmb = MojFind('#EntityRelationshipId').data("kendoDropDownList");
        if (cmb.dataSource.data()[cmb.select() - 1].IsHasQuery) {
            $.get(baseUrl + '/Documents/GetEntityInstanceDescriptionByRelationship?EntityRelationshipID=' + MojFind("#EntityRelationshipId").val() + '&ParentEntityInstance=' + MojFind("#DocumentEntityInstance_ParentEntityInstance").val(), function (data) {
                MojControls.DropDown.setDataSource('EntityRelationshipInstanceId', data)
                MojFind('#EntityRelationshipInstanceId').enable(true);
                MojFind('#EntityRelationshipInstanceId').visible(true);
                MojFind("#EntityRelationshipInstanceTextId").val("");
                MojFind("#EntityRelationshipInstanceText").val("");
                MojFind("#EntityRelationshipInstanceText").visible(false);
                MojFind("#btnNormalActionSearch").closest(".div-icon-button").addClass("hide");
                MojFind("#btnNormalActionSearch").addClass("hide");
            });
        }
        else {
            MojFind('#EntityRelationshipInstanceId').visible(false);
            MojFind('#EntityRelationshipInstanceId').val("");
            MojFind("#EntityRelationshipInstanceTextId").val("");
            MojFind("#EntityRelationshipInstanceText").visible(true);
            MojFind("#btnNormalActionSearch").closest(".div-icon-button").removeClass("hide");
            MojFind("#btnNormalActionSearch").removeClass("hide");
        }
    });

    MojFind("#btnNormalActionSearch").on("click", function () {
        if (MojFind("#DocumentEntityInstance_EntityID").val() != "") {
            var Entity = MojFind("#DocumentEntityInstance_EntityID").data("kendoDropDownList");
            var actionSearch = Entity.dataSource.data()[Entity.select() - 1].SearchAction;
            MojFind("#btnNormalActionSearch").attr("isActive", true);
            MojFind("#btnEntityInstance").removeAttr("isActive");
            MojFind("#btnActionSearch").removeAttr("isActive");
            MojFind("#btnParentActionSearch").removeAttr("isActive");
            if (actionSearch != null && actionSearch != "") {
                Moj.website.openPopupWindow('actionSearchdialogModal', '', Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentEntityInstance_EntityID"), '1140', '870', '', '', '', baseUrl + "/" + actionSearch);
            }
        }
    })


});

