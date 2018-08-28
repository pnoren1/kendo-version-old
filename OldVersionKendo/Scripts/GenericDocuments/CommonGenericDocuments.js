$(document).ready(function () {

    Moj.safeGet('/Documents/GetDocumentumData', undefined, function (data) {
        Doc.Initialize(data.Repository, data.DocumentType, data.FolderPath, data.User, data.IsSignReceived);
    });

    window.addEventListener('message', function (event) {
        var grid = MojFind('[id^=grdDocumentToEntityList]').data('kendoGrid');
        DocumentsToEntityList.addFilesToDocumentum(function (isSuccess, documentList, isDocumentsChange) {
            if (isSuccess) {
                obj = JSON.parse(JSON.stringify(documentList));
                parent.postMessage(obj, '*');
            }
            else {
                parent.postMessage("Error", '*');
            }
        }, grid.dataSource.data(), grid)
    });

    $(document).on('mouseout', function (e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        //stop the drag events when the cursor is out of the window
        if (!from || from.nodeName == "HTML") {
            if ($draggingPreviewWidth != null) {
                if (e.clientX < 0) {
                    $(".doc-preview-panel").removeClass("open");
                    $(".doc-preview-panel").removeAttr("style");
                }
            }
            $draggingSplitter = null;
            $draggingPreviewWidth = null;
            $draggingPreviewHeight = null;
        }
    });

    $(".doc-preview-panel .open-close").live("click", function () {
        if ($(".doc-preview-panel").is(".open"))
            $(".doc-preview-panel").removeClass("open").addClass("close");
        else
            $(".doc-preview-panel").removeClass("close").addClass("open");
    });

    var $draggingSplitter = null;
    var $draggingPreviewWidth = null;
    var $draggingPreviewHeight = null;

    $(document.body).on("mousemove", function (e) {
        if ($draggingSplitter) {
            clearSelection();
            var positionTop = $draggingSplitter.position().top;
            $draggingSplitter.parent().find(".k-widget.k-splitter.k-splitter-horizontal, .k-pane, .k-splitbar").height(positionTop);
            if (positionTop > 350) {
                $draggingSplitter.offset({
                    top: e.pageY,
                });
            }
            if ($draggingSplitter.position().top < 370) {
                $draggingSplitter.attr("style", "top: 370px");
            }
        }
        if ($draggingPreviewWidth) {
            clearSelection();
            $(".iframe-overlay").css({ width: "100%", height: "100%" });
            if (e.pageX > 10) {
                $draggingPreviewWidth.css({ width: e.pageX });
                $(".doc-preview-panel").removeClass("close").addClass("open");
            }
            else
                $(".doc-preview-panel").removeClass("open");
        }
        if ($draggingPreviewHeight) {
            clearSelection();
            $(".iframe-overlay").css({ width: "100%", height: "100%" });
            if (e.pageY > $(".doc-preview-panel")[0].offsetTop + 100)
                $draggingPreviewHeight.css({ height: e.pageY - $(".doc-preview-panel")[0].offsetTop });
        }
    });

    $(document.body).on("mousedown", ".dragSplitter", function (e) {
        $draggingSplitter = $(e.target);
    });

    $(".doc-preview-panel .resize-width").live("mousedown", function (e) {
        $draggingPreviewWidth = $(".doc-preview-panel");
    });
    $(".doc-preview-panel .resize-height").live("mousedown", function (e) {
        $draggingPreviewHeight = $(".doc-preview-panel");
    });

    $(document.body).on("mouseup", function (e) {
        //fix bug for the last mousemove that move the splitter and not resize the grid
        if ($draggingSplitter != null) {
            var positionTop = $draggingSplitter.position().top;
            $draggingSplitter.parent().find(".k-widget.k-splitter.k-splitter-horizontal, .k-pane, .k-splitbar").height(positionTop);
        }
        $draggingSplitter = null;
        $draggingPreviewWidth = null;
        $draggingPreviewHeight = null;
        $(".iframe-overlay").css({
            width: "0", height: "0"
        });
    });

});
function onSelect(e) {

}

function onActivate(e) {
    var id = $(this)[0].element[0].id;
    Moj.addConstant("selectedTabContent", $("#" + id + " div[class='k-content k-state-active']"));
    Moj.addConstant("defaultSelectedTabContent", $("#" + id + " div[class='k-content k-state-active']"));
}

$("input[id^='btnDocumentAction']").live("click", function (e) {
    var form = $(this).closest("form");
    var validate = form.validate();
    var isValid = true;
    form.find("input").each(function () {
        if (validate.element($(this)) != undefined && MojFind("span [for='" + $(this).attr("id") + "']").length > 0)
            isValid = isValid & $(this).valid();
    });
    if (isValid) {
        if (document.body != null)
            document.body.style.cursor = 'wait';
        $("#div_overlay").removeClass("hide");
        var grid = MojFind("[id^='grdDocumentToEntityList']").data("kendoGrid");
        DocumentsToEntityList.addFilesToDocumentum(function (isSuccess, documentList, isDocumentsChange) {
            if (document.body != null)
                document.body.style.cursor = 'auto';
            $("#div_overlay").addClass("hide");
            if (isSuccess) {
                $(e.toElement).submit();
            }
        }, grid.dataSource.data(), grid)
    }
    return false;
});

$(document).delegate(".moj-modal-doc", "click", function () {
    var dialogId = 'dialogModal';
    $(this).attr('active', true);
    var width = 1130;
    var height = 620;
    var url = $(this).attr('href');
    Moj.website.openPopupWindow(dialogId, "", Resources.Strings.AddDocument, width, height, true, true, false, url);
    return false;
});

var GenericDocuments = {
    dropFile: undefined,

    getFileToView: function (grid, callback) {
        var dataItem = grid.dataItem(grid.select());
        if (dataItem.MojID != "") {
            if (dataItem.MojID == "" || dataItem.MojID == null || (dataItem.State == window.Enums.ObjectState.Modified && dataItem.Document != null))
                Moj.showMessage(Resources.Messages.CantViewTheDocument);
            else {
                if (dataItem.DocumentFormatName.indexOf("pdf") > -1) {
                    Doc.viewFile(dataItem.MojID, callback)
                    //if (dataItem.url != undefined) {
                    //    GenericDocuments.openUrlInWindow(grid.dataItem(grid.select()));
                    //}
                    //else {
                    //    Doc.previewUrl(grid.dataItem(grid.select()).MojID, function (url) {
                    //        if (url.indexOf("pdf") > -1) {
                    //            grid.dataItem(grid.select()).url = url;
                    //            GenericDocuments.openUrlInWindow(grid.dataItem(grid.select()));
                    //        }
                    //    })
                    //}
                }
                else {
                    Moj.showMessage(Resources.Messages.DocumentView, function () { Doc.viewFile(grid.dataItem(grid.select()).MojID); }, Resources.Strings.MessageAlert, MessageType.Alert);
                }
            }
        }
    },

    replaceGenDocPreviewDivs: function (div1, div2) {
        if ($("[id='" + div1 + "']").length > 1) {
            MojFind("#" + div1).hide();
            MojFind("#" + div2).show();
        } else {
            $("#" + div1).hide();
            $("#" + div2).show();
        }
    },

    setGenDocPreviewSrc: function (src) {
        if ($("[id='GenDocPreview']").length > 1)
            MojFind("#GenDocPreview").attr("src", src);
        else if ($("[id='GenDocPreview']").length == 1)
            $("#GenDocPreview").attr("src", src);
    },

    previewDocument: function (grid) {
        var dataItem = grid.dataItem(grid.select());
        if (dataItem != null) {
            var src = "";
            if (dataItem.MojID == "" || dataItem.MojID == null || (dataItem.State == window.Enums.ObjectState.Modified && dataItem.Document != null)) {
                Moj.replaceDivs("#Preview", "#NoPreview");
                GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
                src = "";
            }
            else if (dataItem.url != undefined) {
                if (dataItem.url != MojFind("#Preview").attr("src")) {
                    MojFind("#Preview").attr("src", dataItem.url);
                    GenericDocuments.setGenDocPreviewSrc(dataItem.url);
                }
                Moj.replaceDivs("#NoPreview", "#Preview");
                GenericDocuments.replaceGenDocPreviewDivs("GenDocNoPreview", "GenDocPreview");
            }
            else {
                if (dataItem.DocumentFormatName != undefined && dataItem.DocumentFormatName != "") {
                    Doc.previewUrl(dataItem.MojID, function (data) {
                        src = data;
                        if (src != undefined) {
                            if (src.indexOf("pdf") > -1) {
                                dataItem.url = src;
                                Moj.replaceDivs("#NoPreview", "#Preview");
                                GenericDocuments.replaceGenDocPreviewDivs("GenDocNoPreview", "GenDocPreview");

                            }
                            else {
                                Moj.replaceDivs("#Preview", "#NoPreview");
                                GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
                                src = "";
                            }
                        }
                        MojFind("#Preview").attr("src", src);
                        GenericDocuments.setGenDocPreviewSrc(src);
                    });
                }
            }
        }
    },

    bindDocsDrag(e) {
        var gridElement = MojFind("#" + e.sender.element[0].id);
        var grid = gridElement.data("kendoGrid");
        MojFind('.moj-document-format').on('dragstart', function (ev) {
            var mojid = grid.dataItem(ev.currentTarget.closest("tr")).MojID;
            if (mojid != "") {
                var data = ["ATTACH-MOJID", Doc.Constants["Repository"], Doc.Constants["DocumentType"], mojid, "ATTACH-MOJID"];
                event.dataTransfer.clearData()
                event.dataTransfer.effectAllowed = 'all';
                event.dataTransfer.setData("text", data.join("|"));
            }
            $(document.body).append("<div id=\"dragImg\" class='doc-dragged'><img src=" + this.src + " /></div>")
        });
        MojFind('.moj-document-format').on('drag', function (ev) {
            $("#dragImg").css({ top: ev.pageY - 10, left: ev.pageX - 10 });
        });
        MojFind('.moj-document-format').on('dragend', function (ev) {
            $("#dragImg").remove();
            MojFind("#ListContent #pnlDocumentGrid").removeClass("on-dragging");
        });
    },

    bindGridClick(e) {
        var gridElement = MojFind("#" + e.sender.element[0].id);
        var grid = gridElement.data("kendoGrid");
        $(grid.tbody).unbind("click");
        var DELAY = 300, clicks = 0, timer = null;
        $(grid.tbody).on("click", "td", function (e) {
            var rowIndex = $(this).closest("tr").index();
            clicks++;
            //this code is for single click and double click on the same element see https://stackoverflow.com/questions/6330431/jquery-bind-double-click-and-single-click-separately/7845282#7845282
            if (clicks === 1) {//single click
                var elementClicked = $(this.firstElementChild);
                timer = setTimeout(function () {
                    if (elementClicked.is("[class='moj-document-format']")) {
                        GenericDocuments.getFileToView(grid, function () {
                            GenericDocuments.previewDocument(grid);
                        });
                    }
                    else {
                        GenericDocuments.previewDocument(grid);
                    }
                    clicks = 0;
                }, DELAY);
            } else {//double click
                clearTimeout(timer);//prevent single-click action
                if (rowIndex == grid.select().index()) {
                    GenericDocuments.getFileToView(grid, function () {
                        GenericDocuments.previewDocument(grid);
                    });
                    clicks = 0;//after action performed, reset counter
                }
            }
            return true;
        })
    },

    downloadReport: function (e, url) {
        var validate = $(e).parents("form").validate();
        var isValid = true;
        $(e).parents("form").find(" :input[type!=hidden]").each(function () {
            if (validate.element($(this)) != undefined)
                isValid = isValid & $(this).valid();
        });
        if (isValid) {
            $.fileDownload(baseUrl + url,
                {
                    httpMethod: "POST",
                    data: $.parseJSON(JSON.stringify($(e).parents("form").serializeObject()))
                });
        } else {
            return false;
        }
    },

    handleSplitter: function () {
        //splitter of kendo
        splitter = MojFind("[id^='splitterDocument']").data("kendoSplitter");
        if (splitter != undefined) {
            var isCollapse = splitter.options.panes[0].collapsed;
            splitter.expand(MojFind("#left-pane"));
            Moj.replaceDivs("#Preview", "#NoPreview");
            GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
            MojFind("#Preview").attr("src", "");
            GenericDocuments.setGenDocPreviewSrc("");
            if (isCollapse || isCollapse == undefined)
                splitter.collapse(MojFind("#left-pane"));
        }
        //splitter of moj
        var grid = MojFind("#ListContent [id^=grdDocumentList]").data("kendoGrid");
        if (grid) {
            var pageSizeDropDownList = grid.wrapper.children(".k-grid-pager").find("select").data("kendoDropDownList");
            if (pageSizeDropDownList) {
                pageSizeDropDownList.unbind("change").bind("change", function (e) {
                    var numOfRows = grid.dataSource.data().length;
                    var pageSize = e.sender.value();
                    //If number of rows less then pagesize, increas splitter height only to the needed height
                    if (numOfRows < pageSize)
                        pageSize = numOfRows;
                    var positionTop = (parseInt(pageSize) + 2) * 32 + 26 + 7 + 10;
                    //(parseInt(pageSize) + 2) * 32 => מספר שורות בטבלה כולל שורת כותרת ופוטר כפול 32 פיקסלים של גובה השורה
                    //26 + 7 => סך גובה שורת כפתורים עליונה מעל הטבלה
                    //10 => גובה מרווח בין שורת כפתורים עליונה לטבלה
                    $draggingSplitter = $(".dragSplitter");
                    if (positionTop < 370)
                        positionTop = 370;
                    MojFind(".k-widget.k-splitter.k-splitter-horizontal, .k-pane, .k-splitbar").height(positionTop);
                    $draggingSplitter.css({
                        top: positionTop,
                    });
                });
            }
        }
    },

    closeSplitter: function () {
        splitter = MojFind("[id^='splitterDocument']").data("kendoSplitter");
        if (splitter != undefined) {
            splitter.collapse(MojFind("#left-pane"));
            Moj.replaceDivs("#Preview", "#NoPreview");
            GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
            MojFind("#Preview").attr("src", "");
            GenericDocuments.setGenDocPreviewSrc("");
        }
    },

    addListDetailsDocumentTab: function (selectorTabStrip, text, id, actionName, controllerName, data) {
        Moj.addTab(selectorTabStrip, text, id, data, true, function () {
            var o = {};
            o["ActionValue"] = actionName;
            o["ControllerValue"] = controllerName;
            o["DocumentModel"] = data;
            $("#divContent_" + id).load(baseUrl + "/Documents/DocumentListDetails", o);
        });
    },

    getDocumentFormatName: function (documentUrl) {
        var format = documentUrl.split(".")[documentUrl.split(".").length - 1];
        if (format == "docx")
            format = "doc";
        return format.toLowerCase();
    },

    setParentEntityData: function (entityInstance, entityInstanceID) {
        if (MojFind("#btnActionSearch").attr("isActive") != undefined) {
            if (MojFind("[id='ParentEntityInstance']").length == 1)
                MojFind("[id='ParentEntityInstance']").val(entityInstance);
            else {
                MojFind("[id='DocumentSearchObject_ParentEntityInstance']").val(entityInstance);
                MojFind("[id='DocumentSearchObject_ParentEntityInstance']").change();
            }

            MojFind("#btnActionSearch").removeAttr("isActive");
        }
        else if (MojFind("#btnEntityInstance").attr("isActive") != undefined) {
            MojFind("[id='DocumentSearchObject_EntityInstance']").val(entityInstance);
            MojFind("[id='DocumentSearchObject_EntityInstanceFromSearchID']").val(entityInstanceID);
            MojFind("#btnEntityInstance").removeAttr("isActive");
        }
        else if (MojFind("#btnParentActionSearch").attr("isActive") != undefined) {
            if (MojFind("[id='DocumentEntityInstance_ParentEntityInstance']").length == 1) {
                MojFind("[id='DocumentEntityInstance_ParentEntityInstance']").val(entityInstance);
                MojFind("[id='DocumentEntityInstance_ParentEntityInstance']").change();
            }
            MojFind("#btnParentActionSearch").removeAttr("isActive");
        }
        else if (MojFind("#btnNormalActionSearch").attr("isActive") != undefined) {
            if (MojFind("[id='EntityRelationshipInstanceTextId']").length == 1) {
                MojFind("[id='EntityRelationshipInstanceTextId']").val(entityInstance);
                MojFind("#DocumentEntityInstance_EntityInstanceID").val(MojFind("#EntityRelationshipInstanceTextId").val());
                $.get(baseUrl + '/Documents/GetDescriptionByEntityInstanceID?EntityID=' + MojFind("#DocumentEntityInstance_EntityID").val() + '&EntityInstanceID=' + MojFind("#DocumentEntityInstance_EntityInstanceID").val(), function (data) {
                    MojFind("[id='EntityRelationshipInstanceText']").val(data);
                });
            }

            MojFind("#btnNormalActionSearch").removeAttr("isActive");
        }
    },

    openMultiSelectDocumentPopUp: function (id, title, selectedCallback) {
        var o = {};
        o["IsInPopUp"] = true;
        o["IsMultiSelect"] = true;
        documentSelectedCallBack = selectedCallback;
        Moj.website.openPopupWindow(id, '', title, 1130, 620, true, true, false, baseUrl + '/Documents/DocumentViewer', '', o);
    },

    getValueFromDataSource: function (datasource, propertyName, dataItem) {
        var value = "";
        var id = propertyName.substring(propertyName.lastIndexOf("[") + 1, propertyName.lastIndexOf("]"))
        for (var i = 0; i < datasource.length; i++) {
            if (dataItem["AdditionalComboBoxProperties"][id] != undefined) {
                if (datasource[i].Key == dataItem["AdditionalComboBoxProperties"][id]["DocumentAdditionalDataValue"])
                    value = datasource[i].Value;
            }
        }
        return value;
    },

    openUrlInWindow: function (item) {
        var params = [
            'height=' + (screen.height),
            'width=' + (screen.width),
            'titlebar=0',
            'toolbar=0',
            'menubar=0'
        ].join(',');
        var html = "<body style='width:100%;height:100%'><title>" + item.DocumentTypeName + "</title><embed width='100%' height='100%' name='plugin' id='plugin' src='" + item.url + "' type='application/pdf'></embed>"
        var myWindow = window.open("", '', params);
        myWindow.document.body.innerHTML = html;
    },

    openSearchTab: function (documentsModelAsJson) {
        var layoutIdentificationNum = $("#layoutIdentificationNumber").val();
        if (layoutIdentificationNum)
            $("#divLayoutSearch").click();
        else {
            documentsModel = JSON.parse(documentsModelAsJson);
            Moj.HtmlHelpers.openWindowByPost(baseUrl + '/Documents/DocumentListDetailsNewWindow', documentsModel, "post", documentsModel.IsOpenInNewBrowser ? "Map" : "_blank", documentsModel.IsOpenInNewBrowser);
        }
    },
}
