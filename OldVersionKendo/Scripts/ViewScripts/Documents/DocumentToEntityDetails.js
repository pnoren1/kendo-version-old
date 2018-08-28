$(document).ready(function () {
    splitter = MojFind("[id^='splitterDocument']").data("kendoSplitter");
    if (splitter != undefined) {
        splitter.collapse(MojFind("#left-pane"));
        MojFind('.k-splitbar.k-state-default.k-splitbar-horizontal').addClass('hide')
    }
});

var documentToEntityDetails = {

    afterCloseDetails: function () {
        MojFind('.k-splitbar.k-state-default.k-splitbar-horizontal').removeClass('hide')
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        var dragDocument = MojFind("[id^='grdDocumentToEntityList']").data("dragDocument");
        if (dragDocument != undefined) {
            if (grid.dataSource.get(MojFind("[id^='grdDocumentToEntityList']").data("docID")) == undefined || MojFind("[id^='grdDocumentToEntityList']").data("docID") == 0) {
                if (dragDocument != undefined && dragDocument != "") {
                    grid.dataSource.data()[grid.dataSource.total() - 1].dragDocument = dragDocument;
                }
                else {
                    grid.dataSource.data()[grid.dataSource.total() - 1].dragDocument = undefined;
                }
                DocumentsToEntityList.enableGridButton(false);
                Moj.replaceDivs("#Preview", "#NoPreview");
                GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
                MojFind("Preview").attr("src", "");
                GenericDocuments.setGenDocPreviewSrc("");
            }
            else {
                var selectedRow = grid.dataSource.get(MojFind("[id^='grdDocumentToEntityList']").data("docID"));
                selectedRow.dragDocument = dragDocument;
                if (selectedRow.DocumentStatusID == window.Enums.DocumentStatus.NotAccepted)
                    selectedRow.DocumentStatusID = window.Enums.DocumentStatus.Active;
            }
        }
        MojFind("[id^='grdDocumentToEntityList']").data("dragDocument", "");
        MojFind("[id^='grdDocumentToEntityList']").data("docID", "");
    },

    beforeSaveDetails: function () {
        if (MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument") != undefined && MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument") != "") {
            MojFind("[id^='grdDocumentToEntityList']").data("dragDocument", MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument"));
            MojFind("[id^='grdDocumentToEntityList']").data("docID", MojFind("#DocumentsToEntityForDisplayObject_ID").val());
        }
        var DocumentTypeID = MojFind("#SharedDocumentDetailsObject_DocumentTypeID");
        if (DocumentTypeID.val() != "") {
            var documentType = DocumentTypeID.data("kendoComboBox").dataSource.data()
                .find(s => s.DocumentTypeID == DocumentTypeID.val());
            var documentItemID = documentType.DocumentItemID;
            MojFind("#DocumentsToEntityForDisplayObject_DocumentItemType").val(documentItemID == window.Enums.DocumentItem.Incoming ? "Incoming" : "Outgoing");
            MojFind("#DocumentsToEntityForDisplayObject_DocumentItemTypeTitle").val(documentItemID == window.Enums.DocumentItem.Incoming ? Resources.Strings.IncomingDocument : Resources.Strings.OutgoingDocument)
        }
        if (MojFind('#SharedDocumentDetailsObject_WithoutFile').is(":checked")) {
            MojControls.DropDown.setValueById("SharedDocumentDetailsObject_DocumentStatusID", window.Enums.DocumentStatus.NotAccepted);
        }
    }
}