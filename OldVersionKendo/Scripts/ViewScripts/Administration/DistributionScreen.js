function callondrop(e) {
    debugger;
    e.preventDefault();
    var data = new FormData();
    if ((e.dataTransfer && e.dataTransfer.files) || (e.dataTransfer && e.dataTransfer.files)) {
        var files = e.target.files || e.dataTransfer.files;
        //if (src.indexOf("pdf") > -1) {
        handleFiles(files);
    //}
    return false;
    };
};

function handleFiles(files) {
    debugger;
    var grid = MojFind("[id^='grdAttachedFilesList']").data("kendoGrid");

    var data = new FormData();
    var guid = MojFind("#Guid").val();
    var saveUrl = "/Administration/SaveAttachment?Guid=" + guid;
    if (files.length > 0) {
        var length = grid.dataSource.length;
        if (length == undefined) length = 0;
        var types = [
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "image/jpeg",
            "image/tiff",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-powerpoint",
            //.pps
            "application/pdf",
            "image/gif",
            "image/png",
            //.msg
            //.ppsx
            "application/zip",
            "application/x-rar-compressed",
        ];
        var dataLength = 0;
        $.each(files, function (key, file) {
            if (types.indexOf(file.type) != -1) {
                data.append(file.name, file);
                dataLength = dataLength + 1;
            }
            else
                Moj.showErrorMessage("הקובץ " + file.name + " לא נתמך"); 
        });
        if (dataLength > 0) {
            grid.refresh();
            $.ajax({
                url: saveUrl,
                type: 'POST',
                dataType: 'json',
                data: data,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Error == undefined) {
                        MojFind("#Guid").val(data.Guid);
                        if (data.FilesNames != undefined)
                            $.each(data.FilesNames, function (index, fileName) {
                                grid.dataSource.add(
                                    {
                                        ID: length,
                                        FileName: fileName,
                                        State: window.Enums.ObjectState.Added
                                    });
                                length = length + 1;

                            });
                    }
                    else {
                        Moj.showErrorMessage(data.Errors);
                    }
                }
            });
        }
    }
};

onSearchAdvocateForMailClosed = function (data) {
    var listValue = [];

    if (!Moj.isEmpty(data) && data.length > 0)
        $.each(data, function (index, item) {
            if (Moj.isTrue(item.IsSelected))
                listValue.push({ Key: item.ContactId, Value: item.FullName });
        });
    var dropDownElement = MojFind("[id='RecipientIds']").data("kendoMultiSelect");
    dropDownElement.setDataSource(listValue);
    dropDownElement.value(listValue.map(a => a.Key));

};

deleteAttachedFile = function (e) {
    debugger;
    var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
    var rowSelected = grid.dataItem($(e.currentTarget).closest("tr"));
    if (!Moj.isEmpty(rowSelected.FileName)) {
        url = "/Administration/DeleteAttachment?fileName=" + rowSelected.FileName + "&guid=" + MojFind("#Guid").val();
        Moj.confirm(Resources.Strings.ConfirmDelete, function () {
            $.post(url, {}, function (data) {
                if (data.Errors != undefined && data.Errors.length > 0) {
                    Moj.showErrorMessage(data.Errors);
                } else {
                    grid.dataSource.remove(rowSelected);
                    grid.dataSource.total = function () { return grid.dataSource.data().length };
                    grid.refresh();
                }
            });
        });
    }
    return false;
};

MojFind(document).ready(function () {
    var selectedFiles;
    MojFind("#btnSearchAdvocate").unbind('click');
    MojFind("#btnSearchAdvocate").bind('click', function (e) {
        PDO.openSearchAdvocatePopup("onSearchAdvocateForMailClosed", false, true, true);
    });

    $("#pnlDragDrop").on('dragenter', function (event) {
        event.stopPropagation();
        event.preventDefault();

    });

    $("#pnlDragDrop").on('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
    });

    $("#pnlAttachedFilesGrid").on('drop', function (e) {
        debugger;
        e.stopPropagation();
        e.preventDefault();
        var selectedFiles = e.originalEvent.dataTransfer.files;
        var selectedFile = e.originalEvent.dataTransfer.files[0];

        if (!(window.File && window.FileList && window.FileReader))
            throw ("This browser does not support HTML5 File APIs.");

        var reader = new FileReader();

        reader.onload = function () {
            debugger;
            var data = reader.result;
            var content64 = data.replace(/^[^,]*,/, '');
            var formData = new FormData();
            formData.append("file_name", selectedFile.name);
            formData.append("file_content", content64);
            callBack(formData)
        }
        reader.readAsDataURL(selectedFile);

        callFormDataAjax = function (formData, callback) {
            jQuery.support.cors = true;
            var url = W$.BaseUrl + "ByBlob";
            $.ajax(
                {
                    url: url,
                    type: "POST",
                    data: formData,
                    processData: false,
                    success: function (data) {
                        resolveResponse(data, callback);
                    },

                    error: function (jqXHR, textStatus, errorThrown) {
                        if (callback != null) {
                            var response = PRE_ERROR + functionName + " error \r" + jqXHR.status + "\r" + jqXHR.statusText + "\r" + jqXHR.responseText;
                            callback(new DCCWResponse(response));
                        }
                    },

                    failure: function (errMsg) {
                        if (callback != null) {
                            var response = PRE_ERROR + functionName + " error\n" + errMsg.toString();
                            callback(new DCCWResponse(response));
                        }
                    }

                });
        }
        alert(selectedFiles[0].name);
        var grid = MojFind("[id^='grdAttachedFilesList']").data("kendoGrid");
        grid.dataSource.add(
            {
                Key: 1,
                Value: selectedFiles[0].name
            });
        grid.refresh();
        reader.abort();
    });
    MojFind("#FilesBasket").click(function () {
        debugger;
    });
    MojFind("#FilesBasket").find('.uploader input:file').on('change', function (e) {
        debugger;
        $this = $(this);
        var files = e.target.files || e.dataTransfer.files;
        $.each(files, function (key, file) {
            MojFind("#FilesBasket").append('<li>' + file.name + '</li>');
            //data = new FormData();
            data.append(file.name, file);
        });
        //MojFind("#FilesBasket").append('<input type="file" name="Files" id="Files" multiple hidden/>')
        //var length = MojFind("#FilesBasket").find("[id='Files']").length;
        //MojFind("#FilesBasket").find("[id='Files']")[length - 1].files = files
        //saveDS(length - 1);
        $.ajax({
            url: saveUrl,
            type: 'POST',
            dataType: 'json',
            data: data,
            contentType: false,
            processData: false
        });
        //});
        //$('.alert').remove();

        //$.each($this[0].files, function (key, file) {
        //    $('.files').append('<li>' + file.name + '</li>');

        //    data = new FormData();
        //    data.append(file.name, file);

        //    $.ajax({
        //        url: $('.uploader').attr('action'),
        //        type: 'POST',
        //        dataType: 'json',
        //        data: data
        //    });
        //});
    });
    MojFind("#btnBrowse").click(function () {
        //if (MojControls.CheckBox.getValueById("SharedDocumentDetailsObject_WithoutFile"))
        //    Moj.showMessage(window.Resources.Messages.RemoveWithoutFile);
        //else {
        Doc.browseFile("All Files|*.*", function (e, data) {
            debugger;
            //$('#Files')[0].files = data;
            var files = e.originalEvent;//.dataTransfer.files;
            handleFiles(files);
            //var files = e.target.files || e.dataTransfer.files;
            //MojFind("#FilesBasket").append('<input type="file" name="Files" id="Files" multiple hidden/>')
            //var length = MojFind("#FilesBasket").find("[id='Files']").length;
            //MojFind("#FilesBasket").find("[id='Files']")[length].files = files
            //if (data != undefined && data != "[null]" && data != "") {
            //    MojFind("#SharedDocumentDetailsObject_IsFromScan").val(false);
            //    MojFind("#SharedDocumentDetailsObject_Document").data("dragDocument", "");
            //    MojFind("[id^='grdDocumentToEntityList']").data("docID", "");
            //    MojFind(".pnl-drag").removeClass("added").text(Resources.Messages.DragFile);
            //    SharedDocumentDetails.setDocumentUrl(data);
        });
    });
    //}
    //});

    MojFind("#btnClearDistributionScreen").unbind('click');
    MojFind("#btnClearDistributionScreen").bind('click', function (e) {
        MojFind("#Body").data("kendoEditor").value("");
        Moj.clearFields("btnClearDistributionScreen");
        MojFind("#Files").each = null;
    });

    //$(document).delegate('.moj-document-format', 'click', function () {
    //    var grid = $("[id^='grdAttachedFilesList']").data("kendoGrid");
    //    Doc.viewFile(grid.dataItem(grid.select()).MojID);
    //});

});