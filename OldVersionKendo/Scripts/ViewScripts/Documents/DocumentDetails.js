var DocumentDetails =
    {
        DocumentEntityInstanceBound: function (e) {
            Grid_dataBound(e);
            var grid = MojFind("#" + e.sender.element[0].id).data("kendoGrid");
            if (grid != undefined) {
                grid.tbody.find('>tr').each(function () {
                    var dataItem = grid.dataItem(this);
                    //if (dataItem != undefined) {
                    //if (dataItem.EntityID == window.Enums.Entity.OutgoingCorrespondence || dataItem.EntityID == window.Enums.Entity.IncomingCorrespondence)
                    //    $(this).find(".k-grid-Delete").attr("disabled", "disabled");

                    //}
                });
            }
        },

        successSaveDocument: function (data) {
            if (data.Errors != undefined) {
                if (Moj.saveSuccess("grdDocumentList", data.Errors) == true) {
                    Moj.replaceDivs("#Preview", "#NoPreview");
                    GenericDocuments.replaceGenDocPreviewDivs("GenDocPreview", "GenDocNoPreview");
                    MojFind("#Preview").attr("src", "");
                    GenericDocuments.setGenDocPreviewSrc("");
                }
            }
            else {
                MojFind('#DetailsContent').html("");
                MojFind('#ListContent').html(data);
                Moj.replaceDivs('#DetailsContent', '#ListContent');
            }


        },

        addLinkValidation: function () {
            var grid = MojFind("[id^='grdDocumentEntityInstance']").data("kendoGrid");
            var description;
            if (MojFind('#IsMultiDetails').val() == "true" && MojFind("#btnNormal").hasClass("active")) {
                if (!MojFind("#EntityRelationshipInstanceText").closest("div.col").hasClass('hide')) {
                    MojFind("#DocumentEntityInstance_EntityInstanceID").val(MojFind("#EntityRelationshipInstanceTextId").val());
                    description = MojFind("#EntityRelationshipInstanceText").val();
                }
                else if (!MojFind("#EntityRelationshipInstanceId").closest("div.col").hasClass('hide')) {
                    MojFind("#DocumentEntityInstance_EntityInstanceID").val(MojFind("#EntityRelationshipInstanceId").val())
                    description = MojFind('#EntityRelationshipInstanceId').data("kendoDropDownList").text();
                }
            }
            else {
                description = MojFind('#DocumentEntityInstance_EntityInstanceID').data("kendoDropDownList").text();
            }
            var EntityInstanceID = MojFind('#DocumentEntityInstance_EntityInstanceID').val();
            if (EntityInstanceID != null && EntityInstanceID != "") {
                var isExist = false;
                $.each(grid.dataSource.data(), function (index, value) {
                    if (value.ParentEntityID == MojFind("#DocumentEntityInstance_ParentEntityID").val() && value.ParentEntityInstance == MojFind("#DocumentEntityInstance_ParentEntityInstance").val() && value.EntityID == MojFind("#DocumentEntityInstance_EntityID").val() && value.EntityInstanceID == MojFind('#DocumentEntityInstance_EntityInstanceID').val() && value.State != window.Enums.ObjectState.Deleted)
                        isExist = true;
                });
                if (!isExist) {
                    MojFind("#DocumentEntityInstance_EntityInstanceDescription").val(description);
                    MojFind("#DocumentEntityInstance_DocumentID").val(MojFind("#DocumentObject_DocumentID").val());
                    if (MojFind('#IsMultiDetails').val() == "true" && MojFind("#btnNormal").hasClass("active")) {
                        var cmb = MojFind('#EntityRelationshipId').data("kendoDropDownList");
                        if (cmb.dataSource.data()[cmb.select() - 1].IsParent) {
                            MojFind('#DocumentEntityInstance_ParentEntityInstanceID').val(MojFind('#DocumentEntityInstance_EntityInstanceID').val());
                            MojFind('#DocumentEntityInstance_ParentEntityID').val(MojFind('#DocumentEntityInstance_EntityID').val());
                            MojFind('#DocumentEntityInstance_ParentEntityInstance').val("");
                        }
                    }
                    return true;
                }

                else
                    Moj.showMessage(Resources.Messages.ErrDocumentAlreadyConnect);
            }
            else
                Moj.showMessage(Resources.Messages.ErrCantAddLnk);
            return false;
        }
    }

$(document).ready(function () {
    MojFind("#imgDocumentFormat").click(function () {
        var MojID = MojFind("#DccDocumentObject_MojID").val();
        Doc.viewFile(MojID);
    });

    MojFind("#btnActionDocumentDetails").click(function (e) {
        if (MojFind("#DocumentObject_DocumentID").val() == 0 || MojFind("#SharedDocumentDetailsObject_MojID").val() == "") {
            var grid = MojFind("[id^='grdDocumentEntityInstance']").data("kendoGrid");
            var NoRecord = 0;
            if (grid.dataSource.data().length == 0 || MojControls.CheckBox.getValueById("SharedDocumentDetailsObject_WithoutFile"))
                MojFind("#btnActionDocumentDetails").submit();
            else {
                $.each(grid.dataSource.data(), function (index, valueGrid) {
                    if (valueGrid.State != window.Enums.ObjectState.Deleted)
                        NoRecord++;
                    if (index == grid.dataSource.data().length - 1) {
                        if (MojFind('#frmDocumentDetails').valid() && NoRecord > 0) {
                            var folderPath = MojFind("#SharedDocumentDetailsObject_DocumentumFolderPath").val();
                            folderPath = folderPath != null && folderPath != "" ? folderPath : Doc.Constants["FolderPath"];
                            var mojIds = "";
                            var documentPath = MojFind("#SharedDocumentDetailsObject_Document").val().split(";");
                            if (MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument") != undefined && MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument") != "") {
                                Doc.importObjectByBlob(MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument"), folderPath, window.Resources.Messages.ErrAddDocument, true, function (data) {
                                    if (data == undefined) {
                                        document.body.style.cursor = 'auto'
                                        return false;
                                    }
                                    else
                                        mojIds = mojIds + data + ";";
                                    if (mojIds.split(";").length - 1 == documentPath.length) {
                                        MojFind("#SharedDocumentDetailsObject_MojID").val(mojIds);
                                        MojFind("#btnActionDocumentDetails").submit();
                                    }
                                });
                            }
                            else {
                                $.each(documentPath, function (i, valuePath) {
                                    Doc.importObject(valuePath, folderPath, window.Resources.Messages.ErrAddDocument, true, MojFind("#SharedDocumentDetailsObject_IsFromScan").val(), function (data) {
                                        if (data == undefined) {
                                            document.body.style.cursor = 'auto'
                                            return false;
                                        }
                                        else
                                            mojIds = mojIds + data + ";";
                                        if (mojIds.split(";").length - 1 == documentPath.length) {
                                            MojFind("#SharedDocumentDetailsObject_MojID").val(mojIds);
                                            MojFind("#btnActionDocumentDetails").submit();
                                        }
                                    });

                                });
                            }
                            return false;
                        }
                        else
                            MojFind("#btnActionDocumentDetails").submit();
                    }

                });
            }
            return false;
        }
    });
});

