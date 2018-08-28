
$(document).ready(function () {
    MojFind("#DocumentEntityInstance_ParentEntityInstance,#DocumentEntityInstance_EntityID").on("change", function () {
        MojControls.DropDown.clearDropDown(MojFind('#DocumentEntityInstance_EntityInstanceID'));
        if (MojFind("#DocumentEntityInstance_ParentEntityID").val() != "" && MojFind("#DocumentEntityInstance_ParentEntityInstance").val() != "" && MojFind("#DocumentEntityInstance_EntityID").val() != "") {
            $.get(baseUrl + '/Documents/GetEntityInstance?ParentEntityID=' + MojFind("#DocumentEntityInstance_ParentEntityID").val() + '&ParentEntityInstance=' + MojFind("#DocumentEntityInstance_ParentEntityInstance").val() + "&EntityID=" + MojFind("#DocumentEntityInstance_EntityID").val(), function (data) {
                var cmb = MojFind('#DocumentEntityInstance_EntityInstanceID').data("kendoDropDownList");
                Moj.setDataSource(cmb, data);
            });
        }
    });

    MojFind("#DocumentEntityInstance_ParentEntityID").on("change", function () {
        MojFind("#DocumentEntityInstance_ParentEntityInstance").val("");
        $.get(baseUrl + '/Documents/GetEntityList?ParentEntityID=' + MojFind("#DocumentEntityInstance_ParentEntityID").val(), function (data) {
            var cmb = MojFind('#DocumentEntityInstance_EntityID').data("kendoDropDownList");
            Moj.setDataSource(cmb, data);
            MojControls.DropDown.clearDropDown(MojFind('#DocumentEntityInstance_EntityInstanceID'));
        });
        var isEnable = false;
        if (MojFind("#DocumentEntityInstance_ParentEntityID").val() != "") {
            var ParentEntity = MojFind("#DocumentEntityInstance_ParentEntityID").data("kendoDropDownList");
            var actionSearch = ParentEntity.dataSource.data()[ParentEntity.select() - 1].SearchAction;
            isEnable = actionSearch != null && actionSearch != "";
        }
        MojFind("#btnParentActionSearch").enable(isEnable);
        var text = ($(this).val() != "") ? Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentEntityInstance_ParentEntityID") : Resources.Strings.Search;
        $("#" + MojFind("#btnParentActionSearch").attr("aria-describedby") + "-content").html(text);
        MojFind("#btnParentActionSearch span").html(text);
    });

    MojFind("#btnParentActionSearch").on("click", function () {
        if ($(this).attr("disabled") == undefined && MojFind("#DocumentEntityInstance_ParentEntityID").val() != "") {
            var ParentEntity = MojFind("#DocumentEntityInstance_ParentEntityID").data("kendoDropDownList");
            var actionSearch = ParentEntity.dataSource.data()[ParentEntity.select() - 1].SearchAction;
            if (actionSearch != null && actionSearch != "") {
                MojFind("#btnParentActionSearch").attr("isActive", true);
                MojFind("#btnActionSearch").removeAttr("isActive");
                MojFind("#btnEntityInstance").removeAttr("isActive");
                Moj.website.openPopupWindow('actionSearchdialogModal', '', Resources.Strings.Search + " " + MojControls.DropDown.getTextById("DocumentEntityInstance_ParentEntityID"), '1140', '870', '', '', '', baseUrl + "/" + actionSearch);
            }
        }
    })


});

