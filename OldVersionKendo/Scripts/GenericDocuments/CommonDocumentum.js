
var Doc = {

    DccwObject: {},

    Constants: {},

    Configuration: {
        IsSignReceived: false
    },

    addConstant: function (key, value) {
        Doc.Constants[key] = value;
    },

    browseFile: function (filter, callback) {
        document.body.style.cursor = 'wait';
        W$.OpenFileDialog(filter, function (data) {
            document.body.style.cursor = 'auto';
            Doc.showAndSendErrorMessage("browseFile", data, window.Resources.Messages.ErrAddDocument, callback)
        });
    },

    Initialize: function (Repository, DocumentType, FolderPath, UserName, IsSignReceived) {
        Doc.addConstant("Repository", Repository);
        Doc.addConstant("DocumentType", DocumentType);
        Doc.addConstant("FolderPath", FolderPath);
        Doc.Configuration.IsSignReceived = IsSignReceived;
        initalizeDCCW(UserName);
        W$.Initialize(Repository, function (data) {
            if (data == null)
                alert("error: not connected");
        });
    },

    disposeDCCW: function () {
        Doc.DccwObject.Dispose();
    },

    checkOut: function (mojId) {
        document.body.style.cursor = 'wait';
        W$.CheckOut(mojId, Doc.Constants["DocumentType"], true, false, function (data) {
            document.body.style.cursor = 'auto';
            Doc.showAndSendErrorMessage("checkOut", data, window.Resources.Messages.CantEditTheDocument, undefined);
        });
    },

    //return http url to content
    previewUrl: function (mojId, callback) {
        //document.body.style.cursor = 'wait';
        W$.GetPreviewUrl(mojId, Doc.Constants["DocumentType"], function (data) {
           // document.body.style.cursor = 'auto';
            callback(Doc.getReturnValue(data));
        });
    },

    //return path to local file
    viewFile: function (mojId, callback) {
        document.body.style.cursor = 'wait';
        W$.ViewFile(mojId, Doc.Constants["DocumentType"], function (data) {
            document.body.style.cursor = 'auto';
            Doc.showAndSendErrorMessage("viewFile", data, window.Resources.Messages.CantViewTheDocument, undefined);
            if (callback != undefined)
                callback();
        });
    },

    getVersionObject: function (mojId) {
        document.body.style.cursor = 'wait';
        W$.GetVersionObject(mojId, Doc.Constants["DocumentType"], "1.0", function (data) {
            document.body.style.cursor = 'auto';
            Doc.showAndSendErrorMessage("getVersionObject", data, window.Resources.Messages.CantViewTheDocument, undefined);
        });
    },

    editContent: function (mojId, callback) {
        document.body.style.cursor = 'wait';
        W$.GetFile(mojId, Doc.Constants["DocumentType"], function (data) {
            W$.Scan(Doc.getReturnValue(data), true, false, true, function (data) {
                document.body.style.cursor = 'auto';
                callback(Doc.getReturnValue(data));
            });
        });
    },

    editPdf: function (mojId) {
        document.body.style.cursor = 'wait';
        W$.GetFile(mojId, Doc.Constants["DocumentType"], function (fileNames) {
            W$.Scan(Doc.getReturnValue(fileNames), true, false, false, function (data) {
                var dataValue = Doc.getReturnValue(data);
                if (dataValue != undefined && dataValue != "[null]" && dataValue != "") {
                    Doc.updateObject(mojId, dataValue.split(";")[0], function (data) {
                        document.body.style.cursor = 'auto';
                    }, "NEXT_MINOR");
                }
            });
        });
    },

    scan: function (isImage, callback) {
        document.body.style.cursor = 'wait';
        W$.Scan("", true, isImage, true, function (data) {
            document.body.style.cursor = 'auto';
            callback(Doc.getReturnValue(data));
        });
    },

    importObject: function (docPath, folderPath, errorMessage, isShowError, isFromScan, callback) {
        document.body.style.cursor = 'wait';
        W$.ImportObject(Doc.Constants["DocumentType"], docPath, folderPath, Doc.getFlagsXml(isFromScan), function (data) {
            if (typeof (data) == "object") {
                if (data.ErrorCode != 0) {
                    if (isShowError)
                        Doc.showErrorMessage(data.ErrorCode, data.ErrorMessage, errorMessage);
                    Doc.sendErrorMessage("importObject", data.ErrorCode, data.ErrorMessage);
                    callback(undefined);
                }
                else {
                    callback(data.ReturnValue);
                }
            }
            else if (data.indexOf("[error]") != -1) {
                if (isShowError)
                    Moj.showMessage(errorMessage);
                Doc.sendErrorMessage("importObject", 0, data);
                callback(undefined);
            }
            else {
                callback(data);
            }
        });
    },

    importObjectByBlob: function (blob, folderPath, errorMessage, isShowError, callback) {
        document.body.style.cursor = 'wait';
        if (W$.ImportObjectByBlob != undefined) {
            W$.ImportObjectByBlob(blob, Doc.Constants["DocumentType"], folderPath, Doc.getFlagsXml(false), function (data) {
                if (typeof (data) == "object") {
                    if (data.ErrorCode != 0) {
                        if (isShowError)
                            Doc.showErrorMessage(data.ErrorCode, data.ErrorMessage, errorMessage);
                        Doc.sendErrorMessage("importObject", data.ErrorCode, data.ErrorMessage);
                        callback(undefined);
                    }
                    else {
                        callback(data.ReturnValue);
                    }
                }
                else if (data.indexOf("[error]") != -1) {
                    if (isShowError)
                        Moj.showMessage(errorMessage);
                    Doc.sendErrorMessage("importObject", 0, data);
                    callback(undefined);
                }
                else {
                    callback(data);
                }
            });
        }
        else {
            Doc.showAndSendErrorMessage("importObjectByBlob", "[error] Dccw version is 2.2.6 - disable drad & drop", window.Resources.Messages.ErrDCCVersion, callback);
        }
    },

    getFlagsXml: function (isFromScan = false) {
        var rootXml = "<?xml version='1.0' encoding='UTF-8' ?><root>";
        var isSignDigitalXml = "";
        if (isFromScan == true || isFromScan == "true" || isFromScan == "True")
            isSignDigitalXml = " <attribute name=\"a_is_signed\" type='boolean'><value>1</value></attribute>";
        var isSignReceivedXml = " <attribute name=\"a_status\" type='number'><value>88</value></attribute>";
        xml = rootXml + isSignDigitalXml + (Doc.Configuration.IsSignReceived ? isSignReceivedXml : "") + "</root > ";
        return xml;
    },

    updateObject: function (mojId, docPath, callback, version) {
        document.body.style.cursor = 'wait';
        if (version == undefined)
            version = "SAME_VERSION";
        W$.UpdateObject(mojId, Doc.Constants["DocumentType"], docPath, null, version, null, function (data) {
            document.body.style.cursor = 'auto';
            Doc.showAndSendErrorMessage("updateObject", data, window.Resources.Messages.ErrNotUpdate, callback);
        });
    },

    SilentPrint: function (mojId, printerName, callback) {
        W$.GetFile(mojId, Doc.Constants["DocumentType"], function (data) {
            W$.SilentPrint(Doc.getReturnValue(data), printerName, "", function (data) {
                Doc.showAndSendErrorMessage("SilentPrint", data, window.Resources.Messages.ErrPrintDocument, callback);
            });
        });
    },

    SilentPrintWithFilePath: function (path, printerName, callback) {
        W$.SilentPrint(path, printerName, "", function (data) {
            Doc.showAndSendErrorMessage("SilentPrintWithFilePath", data, window.Resources.Messages.ErrPrintDocument, callback);
        });
    },

    showAndSendErrorMessage: function (functionName, data, defaultErrorMessage, callback) {
        if (typeof (data) == "object") {
            if (data.ErrorCode != 0) {
                Doc.showErrorMessage(data.ErrorCode, data.ErrorMessage, defaultErrorMessage);
                Doc.sendErrorMessage(functionName, data.ErrorCode, data.ErrorMessage);
                if (callback != undefined)
                    callback(undefined);
            }
            else {
                if (callback != undefined)
                    callback(data.ReturnValue)
            }
        }
        else if (data.indexOf("[error]") != -1) {
            Moj.showMessage(defaultErrorMessage);
            Doc.sendErrorMessage(functionName, 0, data);
            if (callback != undefined)
                callback(undefined);
        }
        else {
            if (callback != undefined)
                callback(Doc.getReturnValue(data));
        }
    },

    showErrorMessage: function (errorCode, objectErrorMessage, errorMessage) {
        if (errorCode >= 2000 && errorCode < 3000)
            Moj.showErrorMessage(objectErrorMessage);
        else
            Moj.showErrorMessage(errorMessage);
    },

    sendErrorMessage: function (functionName, errorCode, errorMessage) {
        JL().error(String.format("Documentum error on {0} function: error code- {1}, error message- {2}", functionName, errorCode, errorMessage));
    },

    getReturnValue: function (data) {
        if (typeof (data) == "object")
            return data.ReturnValue;
        else
            return data;
    }
};


