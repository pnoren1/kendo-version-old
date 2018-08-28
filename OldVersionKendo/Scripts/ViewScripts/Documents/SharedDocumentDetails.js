$(document).ready(function () {
    var SharedDocumentDetails =
        {
            setDropDocument: function (dropObject) {
                if (dropObject[0] && dropObject[0].size && dropObject[0].size > 0) {
                    MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument", dropObject[0]);
                    SharedDocumentDetails.setDocumentUrl(dropObject[0].name);
                    MojFind("#pnlDragDrop").removeClass("active").addClass("added").text(dropObject[0].name);
                    MojFind("#SharedDocumentDetailsObject_IsFromScan").val(false);
                }
            },  

            setDocumentUrl: function (url) {
                MojFind("#SharedDocumentDetailsObject_Document").val(url);
                MojFind("#SharedDocumentDetailsObject_Document").attr("title", url);

                MojFind("#SharedDocumentDetailsObject_Document").valid();

                var format = GenericDocuments.getDocumentFormatName(url);
                MojFind("#SharedDocumentDetailsObject_DocumentFormat").val(format);

                if (Moj.Constants['DocumetFormats'].indexOf(format) == -1)
                    MojFind("#imgDocumentFormatName").attr("src", baseUrl + "/Content/MojImages/icons/icoOther.png");
                else
                    MojFind("#imgDocumentFormatName").attr("src", baseUrl + "/Content/MojImages/icons/ico" + format + ".png");
                MojFind("#DocumentsToEntityForDisplayObject_DocumentFormatName").val(format);
            },

            setDataByDocumentType: function (onInit) {
                var DocumentTypeID = MojFind("#SharedDocumentDetailsObject_DocumentTypeID");
                if (DocumentTypeID.val() != "") {
                    var documentType = DocumentTypeID.data("kendoComboBox").dataSource.data().find(s => s.DocumentTypeID == DocumentTypeID.val())
                    var DocumentCatagoryID = documentType.DocumentCatagoryID;
                    MojFind("#SharedDocumentDetailsObject_DocumentTypeGroupID").data("kendoDropDownList").value(-1);
                    MojFind("#SharedDocumentDetailsObject_DocumentTypeGroupID").data("kendoDropDownList").value(DocumentCatagoryID);
                    MojFind("#SharedDocumentDetailsObject_DocumentTypeGroupID").valid();
                    var SecurityLevelID = documentType.SecurityLevelID;
                    if (SecurityLevelID != null && onInit == undefined)
                        MojFind("#SharedDocumentDetailsObject_SecurityLevelID").data("kendoDropDownList").value(SecurityLevelID);
                    var itemTypeID = documentType.DocumentItemID;
                    if (itemTypeID != null)
                        MojFind("#SharedDocumentDetailsObject_ItemTypeID").data("kendoDropDownList").value(itemTypeID);
                    $.get(baseUrl + '/Documents/GetDepartment?DocumentTypeGroupID=' + DocumentCatagoryID, function (data) {
                        var departmentCmb = MojFind("#SharedDocumentDetailsObject_DepartmentID").data("kendoDropDownList");
                        departmentCmb.value(data[0].DepartmentID)
                        MojFind("#SharedDocumentDetailsObject_DocumentumFolderPath").val(data[0].DocumentumFolderPath);

                    });
                }
            },

            updateDocumentDate: function () {
                MojFind("#SharedDocumentDetailsObject_DocumentStatusUpdateDate").val(Moj.getCurrentDate());
                MojFind("#div_DocumentStatusUpdateDate div").html(Moj.getCurrentDate());
            }
        }
    if (GenericDocuments.dropFile != undefined) {
        SharedDocumentDetails.setDropDocument(GenericDocuments.dropFile);
        GenericDocuments.dropFile = undefined;
    }
    MojFind("#dragArea").on('dragenter', function (event) {
        event.stopPropagation();
        event.preventDefault();
        if ($(event.target).is("#pnlDragDrop"))
            $(this).addClass("active");
    });

    MojFind("#dragArea").on('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        if ($(event.target).is("#pnlDragDrop"))
            $(this).addClass("active");
    });

    MojFind("#dragArea").on('dragleave', function (event) {
        if ($(event.target).is("#pnlDragDrop"))
            $(this).removeClass("active");
    });

    MojFind("#dragArea").on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(e.target).is("#pnlDragDrop")) {
            var selectedFiles = e.originalEvent.dataTransfer.files;
            if (MojControls.CheckBox.getValueById("SharedDocumentDetailsObject_WithoutFile"))
                Moj.showMessage(window.Resources.Messages.RemoveWithoutFile);
            else {
                SharedDocumentDetails.setDropDocument(selectedFiles);
            }
        }
    });

    MojFind("#SharedDocumentDetailsObject_DocumentTypeGroupID").on("change", function () {
        var DocumentTypeGroupID = $(this).val();
        if (DocumentTypeGroupID == "")
            DocumentTypeGroupID = null;
        if (DocumentTypeGroupID != null) {
            var documentTypeGroup = $(this).data("kendoDropDownList").dataSource.data().find(s => s.Key == DocumentTypeGroupID)
            var departmentCmb = MojFind("#SharedDocumentDetailsObject_DepartmentID").data("kendoDropDownList");
            departmentCmb.value(-1);
            if (documentTypeGroup.DepartmentID != undefined) {
                departmentCmb.value(documentTypeGroup.DepartmentID);
                MojFind("#SharedDocumentDetailsObject_DocumentumFolderPath").val(departmentCmb.dataSource.data()[departmentCmb.select() - 1].DocumentumFolderPath);
            }
            else
                MojFind("#SharedDocumentDetailsObject_DocumentumFolderPath").val("");
        }
        var DepartmentID = MojFind("#SharedDocumentDetailsObject_DepartmentID").val();
        if (DepartmentID == "")
            DepartmentID = null;
        $.get(baseUrl + '/Documents/GetDocumentType?WithIsActive=' + true + '&DocumentTypeGroupID=' + DocumentTypeGroupID + "&DepartmentID=" + DepartmentID + "&DocumentID=" + MojFind("[id='SharedDocumentDetailsObject_DocumentID']").val(), function (data) {
            MojControls.AutoComplete.setDataSource('SharedDocumentDetailsObject_DocumentTypeID', data);
            MojControls.AutoComplete.clearSelectionById('SharedDocumentDetailsObject_DocumentTypeID');
        });
    
    });

    MojFind("#SharedDocumentDetailsObject_DepartmentID").on("change", function () {
        var DepartmentID = $(this).val();
        if (DepartmentID == "")
            DepartmentID = null;
        $.get(baseUrl + '/Documents/GetDocumentType?WithIsActive=' + true + '&DepartmentID=' + DepartmentID, function (data) {
            MojControls.AutoComplete.setDataSource('SharedDocumentDetailsObject_DocumentTypeID', data);
            MojControls.AutoComplete.clearSelectionById('SharedDocumentDetailsObject_DocumentTypeID');
        });
        $.get(baseUrl + '/Documents/GetDocumentTypeGroup?WithIsActive=' + true + '&DepartmentID=' + DepartmentID, function (data) {
            MojControls.DropDown.setDataSource('SharedDocumentDetailsObject_DocumentTypeGroupID', data);
        });
        if (DepartmentID != null)
            var departmentCmb = MojFind("#SharedDocumentDetailsObject_DepartmentID").data("kendoDropDownList")
        MojFind("#SharedDocumentDetailsObject_DocumentumFolderPath").val(departmentCmb.dataSource.data()[departmentCmb.select() - 1].DocumentumFolderPath);
    });

    $(document).on("change", "#SharedDocumentDetailsObject_DocumentTypeID", function () {
        SharedDocumentDetails.setDataByDocumentType();
    });

    MojFind("#SharedDocumentDetailsObject_DocumentStatusID").on("change", function () {
        SharedDocumentDetails.updateDocumentDate();
    });

    MojFind('#SharedDocumentDetailsObject_WithoutFile').on("change", function () {
        if (MojFind(this).is(":checked") && MojFind("#SharedDocumentDetailsObject_Document").val() != "") {
            Moj.confirm(Resources.Messages.RemoveBrowseDocument, function () {
                MojFind("#SharedDocumentDetailsObject_Document").val("");
                MojFind("#SharedDocumentDetailsObject_Document").attr("title", "");
                MojFind("#SharedDocumentDetailsObject_DocumentFormat").val("");
                MojFind("#imgDocumentFormatName").attr("src", "");
                MojFind(".pnl-drag").removeClass("added").text(Resources.Messages.DragFile);
            }, undefined, function () {
                MojControls.CheckBox.setValueById("SharedDocumentDetailsObject_WithoutFile", false);
            });
        }
    });

    MojFind("#btnBrowse").click(function () {
        if (MojControls.CheckBox.getValueById("SharedDocumentDetailsObject_WithoutFile"))
            Moj.showMessage(window.Resources.Messages.RemoveWithoutFile);
        else {
            Doc.browseFile("All Files|*.*", function (data) {
                if (data != undefined && data != "[null]" && data != "") {
                    MojFind("#SharedDocumentDetailsObject_IsFromScan").val(false);
                    MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument", "");
                    MojFind("[id^='grdDocumentToEntityList']").data("docID", "");
                    MojFind(".pnl-drag").removeClass("added").text(Resources.Messages.DragFile);
                    SharedDocumentDetails.setDocumentUrl(data);
                }
            });
        }
    });

    MojFind("#btnScan").click(function () {
        if (MojControls.CheckBox.getValueById("SharedDocumentDetailsObject_WithoutFile")) {
            Moj.showMessage(window.Resources.Messages.RemoveWithoutFile);
        }
        else {
            Doc.scan(false, function (data) {
                if (data != undefined && data != "[null]" && data != "") {
                    MojFind("#SharedDocumentDetailsObject_IsFromScan").val(true);
                    MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument", "");
                    MojFind("[id^='grdDocumentToEntityList']").data("docID", "");
                    MojFind(".pnl-drag").removeClass("added").text(Resources.Messages.DragFile);
                    if (data.indexOf(";") > -1) {
                        var tmp = data.split(";")[0] + ";";
                        SharedDocumentDetails.setDocumentUrl(data.replace(tmp, ""));
                    }
                    else
                        SharedDocumentDetails.setDocumentUrl(data);
                }
            });
        }
    });

    MojFind("#div_grdDocumentToEntityList_Details").ajaxStop(function () {
        $(this).unbind("ajaxStop");
        SharedDocumentDetails.setDataByDocumentType(true);
    });

    MojFind("[id^='divContent_']").ajaxStop(function () {
        $(this).unbind("ajaxStop");
        SharedDocumentDetails.setDataByDocumentType(true);
    });


    if (MojFind("#SharedDocumentDetailsObject_Document").val() != undefined && MojFind("#SharedDocumentDetailsObject_Document").val() != "") {
        SharedDocumentDetails.setDocumentUrl(MojFind("#SharedDocumentDetailsObject_Document").val());
    }

    if (MojFind("#DocumentSearchObject_DefaultDepartmentID").val() != undefined && MojFind("#SharedDocumentDetailsObject_DepartmentID").val() == "") {
        var value = MojFind("#DocumentSearchObject_DefaultDepartmentID").val();
        if (value != "") {
            MojControls.DropDown.setValueById("SharedDocumentDetailsObject_DepartmentID", value);
            MojFind("#SharedDocumentDetailsObject_DepartmentID").trigger("change");
        }
    }

});

