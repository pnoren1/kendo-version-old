
$(document).ready(function () {

    GenericDocuments.handleSplitter();

    var DocumentListID = MojFind("[id^='grdDocumentList']").attr("id");

    if (MojFind("#btnUnattach").length > 0) {
        if (MojFind("#btnUnattach span").html() == "") {
            var tooltipUnattach = Resources.Strings.DisconnectFrom + MojControls.DropDown.getTextById("DocumentSearchObject_ParentEntityID");
            $("#" + MojFind("#btnUnattach").attr("aria-describedby") + "-content").html(tooltipUnattach);
            MojFind("#btnUnattach span").html(tooltipUnattach);
        }
    }

    MojFind("#" + DocumentListID).find("[id='btnedit-doc']").live('click', function () {
        var grid = $(this).closest(".k-grid").data("kendoGrid");
        grid.select($(this).closest("tr"));
        var selectedRow = grid.dataItem(grid.select());
        if (selectedRow.MojID != "") {
            if (selectedRow.DocumentFormatName == "pdf") {
                Doc.editPdf(selectedRow.MojID);
            }
            else
                Doc.checkOut(grid.dataItem(grid.select()).MojID);
        }
    });

    MojFind("#" + DocumentListID).find("[id = 'btnoriginal-doc']").live('click', function () {
        var grid = $(this).closest(".k-grid").data("kendoGrid");
        grid.select($(this).closest("tr"));
        if (grid.dataItem(grid.select()).MojID != "") {
            if (grid.dataItem(grid.select()).MojID != "") {
                if (grid.dataItem(grid.select()).DocumentFormatName.indexOf("pdf") > -1) {
                    Doc.getVersionObject(grid.dataItem(grid.select()).MojID)
                }
                else {
                    Moj.showMessage(Resources.Messages.DocumentView, function () { Doc.getVersionObject(grid.dataItem(grid.select()).MojID); }, Resources.Strings.MessageAlert, MessageType.Alert);
                }
            }
        }
    });

    MojFind("#" + DocumentListID).find("[id='chbSelectMojID']").live('click', function (e) {
        DocumentList.enableGridButton($(e.target).is(":checked"));

    });

    MojFind("[id^='btnCustomButton']").click(function () {
        var index = $(this).attr("id").split("_").pop();
        var grid = MojControls.Grid.getKendoGridById("grdDocumentList");
        var data = grid.dataSource.data();

        var mojIds = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].SelectMojID == true)
                mojIds.push(data[i].MojID);
        }
        customButtonMethod = MojFind("#CustomButtonList_" + index + "__CustomButtonMethod").val();
        if (typeof (customButtonMethod) != "undefined" && customButtonMethod != null && customButtonMethod != "") {
            var parentEntityID = MojFind("#DocumentSearchObject_ParentEntityID").val();
            var parentEntityInstanceID = MojFind("#DocumentSearchObject_ParentEntityInstance").val();
            customData = eval(customButtonMethod + "('" + mojIds.toString() + "', " + parentEntityID + "," + parentEntityInstanceID + ")");
        }
    });

    MojFind("#btnPrintDocument").click(function () {
        var grid = MojControls.Grid.getKendoGridById("grdDocumentList");
        var data = MojControls.Grid.getSortedDataSource(grid).filter(x => x.SelectMojID == true);
        print(data, 0);
    });

    MojFind("#btnSendMail").click(function () {
        var grid = MojControls.Grid.getKendoGridById("grdDocumentList");
        var data = grid.dataSource.data().filter(x => x.SelectMojID == true);

        var o = {};
        var mojIds = [];
        for (var i = 0; i < data.length; i++) {
            mojIds.push(data[i].MojID);
        }
        o["mojIds"] = mojIds.join();
        o["parentEntityID"] = MojFind("#DocumentSearchObject_ParentEntityID").val();
        o["parentEntityInstance"] = MojFind("#DocumentSearchObject_ParentEntityInstance").val();
        o["IsDisplayCreateDate"] = MojFind("#DocumentSearchObject_IsDisplayCreateDate").val();
        DocumentList.documentToSendMailData = data;
        Moj.website.openPopupWindow('sendMail', '', Resources.Strings.SendMessage, 1000, 800, false, true, false, baseUrl + '/Documents/SendMail', '', o,DocumentList.initSendMailGrid );
    });

    //recursive print for keep documents order
    function print(list, i, MojIds = '') {
        if (i == list.length) {
            if (MojIds.length == 0)
                Moj.showMessage(Resources.Messages.NoDocumentsChecked);
            return;
        }
        else {
            if (list[i].SelectMojID == true && list[i].MojID != undefined && list[i].MojID != "") {
                MojIds = MojIds + list[i].MojID + ";";
                Doc.SilentPrint(list[i].MojID, "", function (data) {
                    i++
                    print(list, i, MojIds);
                    if (i == list.length)
                        Moj.showMessage(Resources.Messages.PrintSent, undefined, Resources.Strings.Message, MessageType.Success);
                });
            }
        }
    }

    MojFind("#btnUnattach").click(function () {
        var documentIds = [];
        var grid = MojControls.Grid.getKendoGridById("grdDocumentList");
        var data = grid.dataSource.data();
        for (var i = 0; i < data.length; i++) {
            if (data[i].SelectMojID == true)
                documentIds.push(data[i].DocumentID);
        }
        Moj.safePost("/Documents/UnattachDocuments?documentIds=" + documentIds + "&ParentEntityID=" + MojFind("#DocumentSearchObject_ParentEntityID").val() + '&ParentEntityInstance=' + MojFind("#DocumentSearchObject_ParentEntityInstance").val(), undefined, function (data) {
            grid.dataSource.read(Moj.getGridData());
            GenericDocuments.closeSplitter();
        })
    });

    MojFind("#btnExportIndex").click(function () {
        Moj.safePost("/Documents/ExportIndex?exportIndexData=" + MojFind("#DocumentSearchObject_ExportWithIndexData").val() + "&ParentEntityID=" +
            MojFind("#DocumentSearchObject_ParentEntityID").val() + '&ParentEntityInstance=' + MojFind("#DocumentSearchObject_ParentEntityInstance").val(), undefined, function (data) {
                Moj.showMessage(Resources.Messages.ExportIndexSuccess, undefined, Resources.Strings.Message, MessageType.Success);
            })
    });

    MojFind('#btnScanToRow').on('click', function () {
        var grid = MojFind("[id^='grdDocumentList']").data("kendoGrid");
        var row = MojFind("[id^='grdDocumentList']").find("[id='chbSelectMojID']:checked");
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row.closest("tr"));
            if (dataItem.DocumentFormatName != "" && dataItem.DocumentFormatName != null) {
                Moj.confirm(Resources.Messages.ExistFile, function () {
                    DocumentList.scanFile(dataItem);
                });
            }
            else {
                DocumentList.scanFile(dataItem);
            }
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    MojFind('#btnDownload').on('click', function () {
        var grid = MojFind("[id^='grdDocumentList']").data("kendoGrid");
        var row = MojFind("[id^='grdDocumentList']").find("[id='chbSelectMojID']:checked");
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row.closest("tr"));
            if (dataItem.DocumentFormatName != "" && dataItem.DocumentFormatName != null) {
                Moj.confirm(Resources.Messages.ExistFile, function () {
                    DocumentList.browseFile(dataItem);
                });
            }
            else {
                DocumentList.browseFile(dataItem);
            }
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }
    });

    MojFind("#btnSplit").on('click', function () {
        var grid = MojFind("[id^='grdDocumentList']").data("kendoGrid");
        var row = MojFind("[id^='grdDocumentList']").find("[id='chbSelectMojID']:checked");
        var dataItem;
        if (row != undefined && row.length > 0) {
            dataItem = grid.dataItem(row.closest("tr"));
            var mojID = dataItem.MojID;
            if (dataItem.DocumentFormatName.indexOf("pdf") > -1) {
                Doc.editContent(mojID, function (data) {
                    if (data != undefined && data != "[null]" && data != "") {
                        var a = data.split(";");
                        if (a.length > 1) {
                            Moj.confirm(Resources.Messages.ConfirmSplit, function () {
                                var o = [];
                                var counter = 0;
                                var folderPath = dataItem.DocumentumFolderPath != null ? dataItem.DocumentumFolderPath : Doc.Constants["FolderPath"];
                                $.each(a, function (index, docPath) {
                                    if (index != 0) {
                                        Doc.importObject(docPath, folderPath, window.Resources.Messages.ErrSplitDocument, true, false, function (data) {
                                            counter++;
                                            if (data == undefined) {
                                                document.body.style.cursor = 'auto';
                                                return;
                                            }
                                            if (data != "")
                                                o.push(data);
                                            if (counter == a.length - 1) {
                                                Moj.safePost("/Documents/SplitDocument?id=" + mojID + "&MojIds=" + o, undefined, function (data) {
                                                    Moj.showMessage(Resources.Strings.SuccessSplit, undefined, Resources.Strings.Message, MessageType.Message);
                                                    MojFind("[id^='grdDocumentList']").data("kendoGrid").dataSource.read(Moj.getGridData());
                                                });
                                            }
                                        });
                                    }
                                });

                            });
                        }
                    }
                });
            }
            else
                Moj.showMessage(Resources.Messages.NoPDF);
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }

    });
    if (!MojFind("#entityLine").hasClass("hide-important")) {
        if (MojFind("#btnUnattach").length > 0) {
            MojFind("#btnUnattach").visible(false);
        }
    }

    MojFind("#ListContent #pnlDocumentGrid").on('dragstart', function (event) {
        if (!$(event.target).is(".moj-document-format"))
            event.preventDefault();
    });

    MojFind("#ListContent #pnlDocumentGrid").on('dragenter', function (event) {
        //fix bug on drag document icon for outlook, change the grid class
        if ($('[id=dragImg]').length == 0)
            MojFind("#ListContent #pnlDocumentGrid").addClass("on-dragging");
    });

    MojFind("#ListContent #pnlDocumentGrid").on('dragleave', function (event) {
        if ($(event.target).is("#pnlDocumentGrid"))
            $(event.target).removeClass("on-dragging");
    });

    MojFind("#ListContent #pnlDocumentGrid").on('dragover', function (event) {
        event.preventDefault();
    });

    MojFind("#ListContent #pnlDocumentGrid").on('drop', function (e) {
        e.preventDefault();
        if ($(e.target).is("#pnlDocumentGrid")) {
            $(e.target).removeClass("on-dragging");
            MojFind(".moj-add-button").find("a")[0].click(new function () {
                GenericDocuments.dropFile = e.originalEvent.dataTransfer.files;
            });
        }
    });

});

var DocumentList =
    {
        documentToSendMailData: undefined,

        grdDocumentListBound: function (e) {
            Grid_dataBound(e);
            GenericDocuments.handleSplitter();
            DocumentList.enableGridButton()
            GenericDocuments.bindGridClick(e);
            GenericDocuments.bindDocsDrag(e);
        },

        deleteDocument: function (e) {
            var documentID = this.dataItem($(e.currentTarget).closest("tr")).id;
            var url = e.currentTarget.pathname + "/" + documentID;
            Moj.confirm(Resources.Messages.ConfirmDoumentDelete, function () {

                $.post(url, function (data) {
                    if (Moj.showErrorMessage(data.Errors) == true) {
                        $("#" + e.delegateTarget.id).data("kendoGrid").dataSource.read(Moj.getGridData());
                        GenericDocuments.closeSplitter();
                    }
                });
            });
            return false;
        },

        getDocumentSearchData: function () {
            var searchData = Moj.getGridData('frmDocumentSearch');
            searchData.IsFirst = !(MojFind("#DocumentSearchObject_IsSearchInOpen").val().toLowerCase() === 'true');
            GenericDocuments.handleSplitter();
            //if (MojFind('#httpMethode').val() == 'GET')
            //    searchData["DocumentSearchObject.IsCloseSearchSection"] = "False";
            return searchData;
        },

        browseFile: function (dataItem) {
            Doc.browseFile("All Files|*.*", function (data) {
                if (data != undefined && data != "[null]" && data != "") {
                    var documentFormat = GenericDocuments.getDocumentFormatName(data);
                    if (dataItem.MojID != null && dataItem.MojID != "") {

                        Doc.updateObject(dataItem.MojID, data, function (data) {
                            if (data != undefined)
                                $.post(baseUrl + "/Documents/UpdateFormatDocument", { documentId: dataItem.DocumentID, mojId: dataItem.MojID, formatDocument: documentFormat });

                            Moj.HtmlHelpers._onSearchButtonClicked("grdDocumentList", "btnSearchDocumentSearch");
                            MojFind("#Preview").attr("src", "");
                            GenericDocuments.setGenDocPreviewSrc("");
                        });
                    }
                    else {
                        Doc.importObject(data, dataItem.DocumentumFolderPath, window.Resources.Messages.ErrAddDocument, true, false, function (data) {
                            if (data != undefined)
                                $.post(baseUrl + "/Documents/UpdateFormatDocument", { documentId: dataItem.DocumentID, mojId: data, formatDocument: documentFormat });
                            Moj.HtmlHelpers._onSearchButtonClicked("grdDocumentList", "btnSearchDocumentSearch");
                            MojFind("#Preview").attr("src", "");
                            GenericDocuments.setGenDocPreviewSrc("");
                        });
                    }

                }
            });
        },

        scanFile: function (dataItem) {
            Doc.scan(false, function (data) {
                if (data != undefined && data != "[null]" && data != "") {
                    var documentFormat = GenericDocuments.getDocumentFormatName(data.split(";")[0]);
                    if (dataItem.MojID != null && dataItem.MojID != "") {
                        Doc.updateObject(dataItem.MojID, data.split(";")[0], function (data) {
                            if (data != undefined)
                                $.post(baseUrl + "/Documents/UpdateFormatDocument", { documentId: dataItem.DocumentID, mojId: dataItem.MojID, formatDocument: documentFormat });

                            Moj.HtmlHelpers._onSearchButtonClicked("grdDocumentList", "btnSearchDocumentSearch");
                            MojFind("#Preview").attr("src", "");
                            GenericDocuments.setGenDocPreviewSrc("");
                        });
                    }
                    else {
                        Doc.importObject(data, dataItem.DocumentumFolderPath, window.Resources.Messages.ErrAddDocument, true, true, function (data) {
                            if (data != undefined)
                                $.post(baseUrl + "/Documents/UpdateFormatDocument", { documentId: dataItem.DocumentID, mojId: data, formatDocument: documentFormat });
                            else {
                                document.body.style.cursor = 'auto';
                            }

                            Moj.HtmlHelpers._onSearchButtonClicked("grdDocumentList", "btnSearchDocumentSearch");
                            MojFind("#Preview").attr("src", "");
                            GenericDocuments.setGenDocPreviewSrc("");
                        });
                    }
                }
            });
        },

        enableGridButton: function (isChecked) {
            var count = 0;
            var grid = MojControls.Grid.getKendoGridById("grdDocumentList");
            var data = grid.dataSource.data();
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].SelectMojID == true)
                    count++;
            }
            // grid not yet refresh
            if (isChecked != undefined) {
                if (isChecked) count++;
                else count--;
            }
            var isEnable = count == 1;
            MojFind("#btnDownload").enable(isEnable);
            MojFind("#btnScanToRow").enable(isEnable);
            MojFind("#btnSplit").enable(isEnable);
            MojFind("#btnPrintDocument").enable(count >= 1);
            MojFind("#btnSendMail").enable(count >= 1);
            MojFind("#btnUnattach").enable(count >= 1);
            MojFind("#btnExportIndex").enable(true);
            MojFind("[id^='btnCustomButton']").enable(count >= 1);
        },

        showDetails: function (e) {
            if (e.currentTarget.hasAttribute("disabled") && $(e.currentTarget).attr("disabled") == "disabled") {
                return false;
            } else {
                var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
                grid.select($(e.currentTarget).closest("tr"));
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                var id = dataItem.id;
                var url = e.currentTarget.href;
                kendo.ui.progress(MojFind("#DetailsContent"), true);
                url += "&id=" + id;
                var x = MojFind('#DetailsContent').load(url, function () {
                    kendo.ui.progress(MojFind("#DetailsContent"), false);
                });
                Moj.replaceDivs('#ListContent', '#DetailsContent');
                return false;
            }
        },

        initSendMailGrid: function () {
            debugger;
            var grid = MojControls.Grid.getKendoGridById("grdDocumentToSend");
            var dataSource = new kendo.data.DataSource({
                data: DocumentList.documentToSendMailData,
                pageSize: 10
            });
            grid.dataSource.total = function () { return dataSource.data().length };
            grid.setDataSource(dataSource);
            grid.refresh();
            DocumentList.documentToSendMailData = undefined;

        }
    }








