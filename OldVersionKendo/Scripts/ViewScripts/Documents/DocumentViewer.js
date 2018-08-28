
$(document).ready(function () {
    var splitter = MojFind("[id^='splitterDocument']").data("kendoSplitter");
    splitter.collapse(MojFind("#left-pane"));
});

$("#DocumentViewer").ajaxStop(function () {
    if (MojFind("#DocumentCheck").closest("#dialogModal").length > 0) {
        MojFind("#DocumentCheck").removeClass("hide");
        MojFind(".moj-add-button").addClass("hide");
        MojFind("[id=DocumentSearchObject_ParentEntityID]").enable(true);
        MojFind("[id=DocumentSearchObject_ParentEntityInstance]").enable(true);
        var ParentEntity = MojFind("[id=DocumentSearchObject_ParentEntityID]").data("kendoDropDownList");
        var item = ParentEntity.dataSource.data()[ParentEntity.select() - 1];
        if (item != undefined) {
            var actionSearch = item.SearchAction;
            MojFind("#btnActionSearch").enable(actionSearch != null && actionSearch != "");
        }
    }
});



var DocumentViewer =
    {
        documentSelectedCallBack: undefined,

        documentSelected: function (callBack) {
            var grid = MojFind("[id^='grdDocumentList']").data("kendoGrid");
            var myWindow = $("#dialogModal").data("kendoWindow");
            if (MojFind("#IsMultiSelect").val() == "true") {
                var MojIds = [];
                MojFind("[id^='grdDocumentList']").find("[id='chbSelectMojID']:checked").each(function () {
                    MojIds.push($(this).attr("data"));
                });
                if (MojIds.length == 0)
                    Moj.showMessage(Resources.Messages.NoDocumentsChecked);
                else {
                    documentSelectedCallBack(MojIds);
                    documentSelectedCallBack = undefined;
                }
            }
            else {
                var selected = grid.dataItem(grid.select());
                myWindow.close();
                $(".moj-modal-doc").removeAttr('active');
                if (selected != undefined) {
                    DocumentsToEntityList.setDocumentData(selected);
                }
            }
        },

        onCancelButton: function () {
            Moj.HtmlHelpers._onCancelButtonClicked(btnCancelDocumentDetails);
            GenericDocuments.handleSplitter();
        }
    }