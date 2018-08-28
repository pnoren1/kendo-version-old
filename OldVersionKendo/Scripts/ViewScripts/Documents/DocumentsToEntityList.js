
var DocumentsToEntityList =
    {
        isDocumentExist: function () {
            var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
            var row = grid.select();
            var dataItem;
            if (row != undefined && row.length > 0) {
                dataItem = grid.dataItem(row);
                return dataItem.DocumentFormatName != '' && dataItem.DocumentFormatName != null;
            }
        },

        isRequierdDocument: function () {
            var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
            var row = grid.select();
            var dataItem;
            if (row != undefined && row.length > 0) {
                dataItem = grid.dataItem(row);
                return dataItem.HideEditClass != null;
            }
        },

        enableGridButton: function (data) {
            var documentExist = DocumentsToEntityList.isDocumentExist();
            data = MojFind("#isInEnableArea").val() == 'False' ? false : data;
            MojFind("#btnDownloadToEntity").enable(data);
            MojFind("#btnScanToRowEntity").enable(data);
            MojFind("#btnPrintDocumentEntity").enable(data && documentExist);
            MojFind("#btnMarkAsAccepted").enable(data && DocumentsToEntityList.isRequierdDocument());
        },

        browseFile: function (dataItem, callBack) {
            Doc.browseFile("All Files|*.*", function (documentPath) {
                if (documentPath != undefined && documentPath != "[null]" && documentPath != "") {
                    if (dataItem.MojID != null && dataItem.MojID != "") {
                        dataItem.set("State", window.Enums.ObjectState.Modified);
                    }
                    else {
                        dataItem.set("State", window.Enums.ObjectState.Added);
                        callBack();
                    }
                    dataItem.set("Document", documentPath);
                    dataItem.set("IsFromScan", false);
                    dataItem.set("DocumentFormatName", GenericDocuments.getDocumentFormatName(documentPath));
                    dataItem.set("WithoutFile", false);
                    MojFind("#Preview").attr("src", "");
                    GenericDocuments.setGenDocPreviewSrc("");
                }
            });
        },

        markAsAccepted: function (dataItem, grid) {
            dataItem.set("DocumentStatusID", window.Enums.DocumentStatus.NotAccepted);
            dataItem.set("State", window.Enums.ObjectState.Added);
            dataItem.set("DocumentToEntityStatus", "DocumentToEntityStatusAccepted");
            dataItem.set("Document", "");
            dataItem.set("DocumentFormatName", "");
            dataItem.set("WithoutFile", true);
            dataItem.set("DocumentToEntityStatusTitle", Resources.Strings.DocumentToEntityStatusAccepted);
            dataItem.set("DocumentReceivedDate", "");
            grid.refresh();
        },

        scanFile: function (dataItem, callBack) {
            Doc.scan(false, function (data) {
                if (data != undefined && data != "[null]" && data != "") {
                    var documentPath = data.split(";")[0];
                    if (dataItem != null && dataItem.MojID != null && dataItem.MojID != "") {
                        dataItem.set("State", window.Enums.ObjectState.Modified);
                    }
                    else {
                        dataItem.set("State", window.Enums.ObjectState.Added);
                        callBack();
                    }
                    dataItem.set("Document", documentPath);
                    dataItem.set("IsFromScan", true);
                    dataItem.set("DocumentFormatName", GenericDocuments.getDocumentFormatName(documentPath));
                    dataItem.set("WithoutFile", false);
                    MojFind("#Preview").attr("src", "");
                    GenericDocuments.setGenDocPreviewSrc("");
                }
            });

        },

        grdDocumentToEntityListBound: function (e) {
            Grid_dataBound(e);
            GenericDocuments.bindGridClick(e);
            GenericDocuments.bindDocsDrag(e);
        },

        setDocumentData: function (dataItem) {
            var isExist = false;

            var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
            $.each(grid.dataSource.data(), function (index, value) {
                if (value.DocumentID == dataItem.DocumentID) {
                    if (value.State == window.Enums.ObjectState.Deleted) {
                        value.State = window.Enums.ObjectState.Unchanged;
                        grid.refresh();
                    }
                    else
                        Moj.showMessage(Resources.Messages.ErrSelectDocumentAlreadyConnect);
                    isExist = true;
                }
            });
            if (!isExist) {

                grid.dataSource.add(
                    {
                        DocumentItemTypeTitle: "", DocumentItemType: "", DocumentumFolderPath: "", DepartmentID: "", HideDelete: "", HideEditClass: "", IsMust: "", DocumentToEntityStatus: "", DocumentToEntityStatusTitle: "", WithoutFile: dataItem.MojID == "", SecurityLevelID: dataItem.SecurityLevelID, ID: dataItem.DocumentID, DocumentID: dataItem.DocumentID, MojID: dataItem.MojID, Document: "", EntityID: MojFind("#EntityID").val(),
                        EntityInstanceID: MojFind("#EntityInstanceID").val(), ParentEntityID: MojFind("#ParentEntityID").val(),
                        ParentEntityInstance: MojFind("#ParentEntityInstance").val(),
                        DocumentFormatName: dataItem.DocumentFormatName, AdditionaDataForDisplayArray: "",
                        DocumentTypeGroupID: dataItem.DocumentTypeGroupID, DocumentTypeID: dataItem.DocumentTypeID, DocumentStatusID: dataItem.DocumentStatusID,
                        DocumentStatusUpdateDate: dataItem.DocumentStatusUpdateDate, DocumentReceivedDate: dataItem.DocumentReceivedDate,
                        Multi: dataItem.Multi, State: window.Enums.ObjectState.Added,
                        CreationDate: kendo.toString(kendo.parseDate(dataItem.CreationDate), "G"), CreatedBy: dataItem.CreatedBy, Box: "", Release: "", IsGetDccData: false, IsFromScan: false,
                        AdditionalTextBoxProperties: dataItem.AdditionalTextBoxProperties, AdditionalHiddenProperties: dataItem.AdditionalHiddenProperties, AdditionalCheckBoxProperties: dataItem.AdditionalCheckBoxProperties, AdditionalComboBoxProperties: dataItem.AdditionalComboBoxProperties,
                        AdditionalTextAreaProperties: dataItem.AdditionalTextAreaProperties, AdditionalDateTimeProperties: dataItem.AdditionalDateTimeProperties

                    });
                grid.refresh();
                DocumentsToEntityList.enableGridButton(false);
                splitter = MojFind("[id^='splitterDocument']").data("kendoSplitter");
                if (splitter != undefined) {
                    splitter.collapse(MojFind("#left-pane"));
                    Moj.replaceDivs("#Preview", "#NoPreview");
                    GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
                    MojFind("#Preview").attr("src", "");
                    GenericDocuments.setGenDocPreviewSrc("");
                }

                Moj.changeObjectStateToForm("true");
            }
        },

        afterDocumentImport: function (value, documentList, grid, data, count, callBack) {

            if (data == undefined) {
                Moj.Constants["IsInAction"] = false;
                if (document.body != null)
                    document.body.style.cursor = 'auto';
                $("#div_overlay").addClass("hide");
                Moj.showErrorMessage(Resources.Messages.ErrAddDocument, function (data) {
                    callBack(false, documentList, true);
                });
                return;
            }
            value.MojID = data;
            if (grid != undefined) {
                grid.refresh();
            }
            count++;
            if (count == documentList.length) {
                Moj.Constants["IsInAction"] = false;
                callBack(true, documentList, true);
            }
            return count;
        },

        addFilesToDocumentum: function (callBack, documentList, grid) {
            var isDocumentsChange = false;
            if (documentList.length == 0)
                callBack(true, documentList, isDocumentsChange);
            var count = 0;
            $.each(documentList, function (index, value) {
                if (MojFind("#IsUpdateBoxNumber").val() == "True") {
                    value.Box = MojFind("#BoxNumber").val();
                }
                if (((value.State == window.Enums.ObjectState.Added || value.State == window.Enums.ObjectState.AddedString)
                    && (value.MojID == "" || value.MojID == null) && value.DocumentStatusID != window.Enums.DocumentStatus.NotAccepted && value.Document != null && value.Document != "") ||
                    (value.State == window.Enums.ObjectState.Modified && (value.MojID == "" || value.MojID == null) && value.DocumentFormatName != "" && value.DocumentFormatName != null)) {
                    isDocumentsChange = true;
                    Moj.Constants["IsInAction"] = true;
                    var folderPath = value.DocumentumFolderPath != null ? value.DocumentumFolderPath : Doc.Constants["FolderPath"];
                    if (value.dragDocument != undefined) {
                        Doc.importObjectByBlob(value.dragDocument, folderPath, Resources.Messages.ErrAddDocument, false, function (data) {
                            count = DocumentsToEntityList.afterDocumentImport(value, documentList, grid, data, count, callBack);
                        });
                    }
                    else {
                        Doc.importObject(value.Document, folderPath, Resources.Messages.ErrAddDocument, false, value.IsFromScan, function (data) {
                            count = DocumentsToEntityList.afterDocumentImport(value, documentList, grid, data, count, callBack);
                        });
                    }
                }
                else if (value.State == window.Enums.ObjectState.Modified && value.Document != null && value.Document != "") {
                    isDocumentsChange = true;
                    Moj.Constants["IsInAction"] = true;
                    Doc.updateObject(value.MojID, value.Document, function (data) {
                        if (data == undefined) {
                            Moj.Constants["IsInAction"] = false;
                            if (document.body != null)
                                document.body.style.cursor = 'auto';
                            $("#div_overlay").addClass("hide");
                            Moj.showErrorMessage(Resources.Messages.ErrEditDocument, function (data) {
                                callBack(false, documentList, isDocumentsChange);
                            });
                            return;
                        }
                        if (grid != undefined) {
                            grid.refresh();
                        }
                        count++;
                        if (count == documentList.length) {
                            Moj.Constants["IsInAction"] = false;
                            callBack(true, documentList, isDocumentsChange);
                        }
                    });
                }
                else {
                    count++;
                    if (count == documentList.length) {
                        Moj.Constants["IsInAction"] = false;
                        callBack(true, documentList, isDocumentsChange);
                    }
                }
            });
        },

    }

$(document).ready(function () {

    var DocumentToEntityListID = MojFind("[id^='grdDocumentToEntityList']").attr("id");

    MojFind("#" + DocumentToEntityListID).find("[id='btnedit-doc']").live('click', function () {
        var grid = $(this).closest(".k-grid").data("kendoGrid");
        grid.select($(this).closest("tr"));
        var selectedRow = grid.dataItem(grid.select());
        if (selectedRow.MojID == "" || selectedRow.MojID == null || (selectedRow.State == window.Enums.ObjectState.Modified && selectedRow.Document != null))
            Moj.showMessage(Resources.Messages.CantEditTheDocument);
        else {
            if (selectedRow.DocumentFormatName == "pdf")
                Doc.editPdf(selectedRow.MojID);
            else
                Doc.checkOut(selectedRow.MojID);
        }

    });

    MojFind("[id^='grdDocumentToEntityList'] tbody tr").die('click');
    MojFind("[id^='grdDocumentToEntityList'] tbody tr").live('click', function () {
        DocumentsToEntityList.enableGridButton(true);
    });

    MojFind('#btnPrintDocumentEntity').die('click');
    MojFind("#btnPrintDocumentEntity").live('click', function () {
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        var row = grid.select();
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row);
            Doc.SilentPrint(dataItem.MojID, "", function (data) {
            });
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });

    MojFind("#" + DocumentToEntityListID).find("[id = 'btnoriginal-doc']").die('click');
    MojFind("#" + DocumentToEntityListID).find("[id = 'btnoriginal-doc']").live('click', function () {
        var grid = $(this).closest(".k-grid").data("kendoGrid");
        grid.select($(this).closest("tr"));
        var selectedRow = grid.dataItem(grid.select());
        if (selectedRow.MojID == "" || selectedRow.MojID == null || (selectedRow.State == window.Enums.ObjectState.Modified && selectedRow.Document != null))
            Moj.showMessage(Resources.Messages.CantViewTheDocument);
        else {
            if (selectedRow.DocumentFormatName.indexOf("pdf") > -1) {
                Doc.getVersionObject(selectedRow.MojID);
            }
            else {
                Moj.showMessage(Resources.Messages.DocumentView, function () { Doc.getVersionObject(selectedRow.MojID); }, Resources.Strings.MessageAlert, MessageType.Alert);
            }
        }
    });

    MojFind('#btnScanToRowEntity').die('click');
    MojFind('#btnScanToRowEntity').live('click', function () {
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        var row = grid.select();
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row);
            if (dataItem.MojID != '' && dataItem.MojID != null) {
                if (dataItem.DocumentFormatName != "" && dataItem.DocumentFormatName != null) {
                    Moj.confirm(Resources.Messages.ExistFile, function () {
                        DocumentsToEntityList.scanFile(dataItem);
                    });
                }
                else {
                    DocumentsToEntityList.scanFile(dataItem);
                }
            }
            else {
                DocumentsToEntityList.scanFile(dataItem, function () {
                    //var parentEntityInstance = MojFind("#ParentEntityInstance").val()
                    //var parentEntityID = MojFind("#ParentEntityID").val();
                    //dataItem.set("DocumentFormatName", GenericDocuments.getDocumentFormatName(documentPath));
                    //dataItem.set("MojID", MojID);
                    //dataItem.set("Document", documentPath);
                    //dataItem.set("State", window.Enums.ObjectState.Added);
                    dataItem.set("DocumentReceivedDate", Moj.getCurrentDate());
                    dataItem.set("DocumentStatusID", window.Enums.DocumentStatus.Active);
                    dataItem.set("DocumentStatusUpdateDate", Moj.getCurrentDate());
                    //dataItem.set("DocumentTypeGroupID", MojFind("#DocumentTypeGroupID").val());
                    //dataItem.set("DepartmentID", MojFind("#DepartmentID").val());
                    //dataItem.set("ParentEntityInstance", parentEntityInstance);
                    //dataItem.set("ParentEntityID", parentEntityID);
                    dataItem.set("IsIncomingDocument", true);
                    //grid.refresh();
                });
            }
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    MojFind('#btnDownloadToEntity').die('click');
    MojFind('#btnDownloadToEntity').live('click', function () {
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        var row = grid.select();
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row);
            if (dataItem.MojID != '' && dataItem.MojID != null) {
                if (dataItem.DocumentFormatName != "" && dataItem.DocumentFormatName != null) {
                    Moj.confirm(Resources.Messages.ExistFile, function () {
                        DocumentsToEntityList.browseFile(dataItem);
                    });
                }
                else {
                    DocumentsToEntityList.browseFile(dataItem);
                }
            }
            else {
                DocumentsToEntityList.browseFile(dataItem, function () {
                    //var parentEntityInstance = MojFind("#ParentEntityInstance").val()
                    //var parentEntityID = MojFind("#ParentEntityID").val();
                    //dataItem.set("DocumentFormatName", GenericDocuments.getDocumentFormatName(documentPath));
                    // dataItem.set("MojID", MojID);
                    // dataItem.set("Document", documentPath);
                    // dataItem.set("State", window.Enums.ObjectState.Added);
                    dataItem.set("DocumentReceivedDate", Moj.getCurrentDate());
                    dataItem.set("DocumentStatusID", window.Enums.DocumentStatus.Active);
                    dataItem.set("DocumentStatusUpdateDate", Moj.getCurrentDate());
                    //dataItem.set("DocumentTypeGroupID", MojFind("#DocumentTypeGroupID").val());
                    //dataItem.set("DepartmentID", MojFind("#DepartmentID").val());
                    // dataItem.set("ParentEntityInstance", parentEntityInstance);
                    // dataItem.set("ParentEntityID", parentEntityID);
                    dataItem.set("IsIncomingDocument", true);
                    // grid.refresh();
                });

            }
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });

    MojFind('#btnMarkAsAccepted').die('click');
    MojFind("#btnMarkAsAccepted").live('click', function () {
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        var row = grid.select();
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row);
            if (dataItem.DocumentFormatName != "") {
                Moj.confirm(Resources.Messages.ExistFileForMark, function () {
                    DocumentsToEntityList.markAsAccepted(dataItem, grid);
                });
            }
            else
                DocumentsToEntityList.markAsAccepted(dataItem, grid);
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    Moj.replaceDivs("#Preview", "#NoPreview");
    GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
    MojFind("#Preview").attr("src", "");
    GenericDocuments.setGenDocPreviewSrc("");
    GenericDocuments.handleSplitter();
});


