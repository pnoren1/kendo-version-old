//#region Initial parameters
var WCF_BASE_URL = "";
var WCF_END_URL = "?callback=?";
var PARAMS_SEPARATOR = "|~|";
//#endregion


//#region Base64
var Base64 =
    {
    	// private property
    	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    	// public method for encoding
    	encode: function (input)
    	{
    		if (input == null)
    			return null;

    		var output = "";
    		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    		var i = 0;

    		input = Base64._utf8_encode(input);

    		while (i < input.length)
    		{

    			chr1 = input.charCodeAt(i++);
    			chr2 = input.charCodeAt(i++);
    			chr3 = input.charCodeAt(i++);

    			enc1 = chr1 >> 2;
    			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    			enc4 = chr3 & 63;

    			if (isNaN(chr2))
    			{
    				enc3 = enc4 = 64;
    			} else if (isNaN(chr3))
    			{
    				enc4 = 64;
    			}

    			output = output +
			    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    		}

    		return output;
    	},

    	// public method for decoding
    	decode: function (input)
    	{
    		var output = "";
    		var chr1, chr2, chr3;
    		var enc1, enc2, enc3, enc4;
    		var i = 0;

    		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    		while (i < input.length)
    		{

    			enc1 = this._keyStr.indexOf(input.charAt(i++));
    			enc2 = this._keyStr.indexOf(input.charAt(i++));
    			enc3 = this._keyStr.indexOf(input.charAt(i++));
    			enc4 = this._keyStr.indexOf(input.charAt(i++));

    			chr1 = (enc1 << 2) | (enc2 >> 4);
    			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    			chr3 = ((enc3 & 3) << 6) | enc4;

    			output = output + String.fromCharCode(chr1);

    			if (enc3 != 64)
    			{
    				output = output + String.fromCharCode(chr2);
    			}
    			if (enc4 != 64)
    			{
    				output = output + String.fromCharCode(chr3);
    			}

    		}

    		output = Base64._utf8_decode(output);

    		return output;

    	},

    	// private method for UTF-8 encoding
    	_utf8_encode: function (string)
    	{
    		string = string.replace(/\r\n/g, "\n");
    		var utftext = "";

    		for (var n = 0; n < string.length; n++)
    		{

    			var c = string.charCodeAt(n);

    			if (c < 128)
    			{
    				utftext += String.fromCharCode(c);
    			}
    			else if ((c > 127) && (c < 2048))
    			{
    				utftext += String.fromCharCode((c >> 6) | 192);
    				utftext += String.fromCharCode((c & 63) | 128);
    			}
    			else
    			{
    				utftext += String.fromCharCode((c >> 12) | 224);
    				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    				utftext += String.fromCharCode((c & 63) | 128);
    			}

    		}

    		return utftext;
    	},

    	// private method for UTF-8 decoding
    	_utf8_decode: function (utftext)
    	{
    		var string = "";
    		var i = 0;
    		var c = c1 = c2 = 0;

    		while (i < utftext.length)
    		{

    			c = utftext.charCodeAt(i);

    			if (c < 128)
    			{
    				string += String.fromCharCode(c);
    				i++;
    			}
    			else if ((c > 191) && (c < 224))
    			{
    				c2 = utftext.charCodeAt(i + 1);
    				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    				i += 2;
    			}
    			else
    			{
    				c2 = utftext.charCodeAt(i + 1);
    				c3 = utftext.charCodeAt(i + 2);
    				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    				i += 3;
    			}

    		}

    		return string;
    	}

    }
//#endregion

function makeCall(url, callBack)
{
	W$.ErrorOccured = false;
	W$.ReturnNull = false;

	$.getJSON(url, function (data)
	{
		var objJson;
		try
		{
			objJson = $.parseJSON(data);
		}
		catch (e)
		{
			objJson = data;
		}
		if (objJson == null)
			W$.ErrorOccured = true;
		else
			if (objJson == "[null]")
				W$.ReturnNull = true;

		if (callBack != null)
			callBack(objJson);
	});

}

function buildUrl(dccwParams, repository)
{
	var parameters = "";

	if (dccwParams.Parameters.length == 0)
		parameters = "[none]";
	else
	{
		for (var i = 0; i < dccwParams.Parameters.length; i++)
		{
			var s = dccwParams.Parameters[i];
			if (s == null)
				s = "[null]";

			if (typeof (s) == "boolean")
				s = "bool:" + s.toString();

			if (typeof (s) == "number")
				s = "int:" + s.toString();

			parameters += s + PARAMS_SEPARATOR;
		}
	}

	if (parameters.length >= PARAMS_SEPARATOR.length)
		parameters = parameters.substr(0, parameters.length - PARAMS_SEPARATOR.length);

	var url = WCF_BASE_URL + "/" + dccwParams.FunctionName + "/" + repository + "/" + Base64.encode(parameters).replace(/\//g, '~~~') + WCF_END_URL;

	return url;
}

var DCCWParams = function ()
{
	this.FunctionName = "";
	this.Parameters = new Array();
	this.CallBack = null;
}

var DCCW = function (fullUserName)
{	
	fullUserName = fullUserName.replace(/\\/g, '-')
								.replace(/\//g, '-')
								.replace(/\?/g, '-')
								.replace(/\"/g, '-')
								.replace(/\'/g, '-')
								.replace(/\*/g, '-')
								.replace(/\>/g, '-')
								.replace(/\</g, '-')
								.replace(/\|/g, '-');

	WCF_BASE_URL = "http://localhost:6060/" + fullUserName + "/DCCW"; /* finally base url should be for example: http://localhost:6060/JUSTICE-DanielEl/DCCW */

	if (typeof (jQuery) == 'undefined')
		throw ("JQuery should be included");

	$("body").append("<iframe src='dccw://DCCWProtocol' style='display:none' onload='parent.$(this).remove()'></iframe>");

	this.Repository = null;

	window.W$ = this;
}

// General Invoker function
DCCW.prototype.Invoke = function (dccwParams)
{
	if (typeof (dccwParams) != "object")
		throw ("Invalid parameters passed");

	if (typeof (dccwParams.FunctionName) != "string" || (dccwParams.FunctionName == null) || (dccwParams.FunctionName == ""))
		return;

	if (!(dccwParams.Parameters instanceof Array))
		return;

	if (dccwParams.FunctionName.indexOf("Initialize") == 0)
		this.Repository = dccwParams.Parameters[0];

	var url = buildUrl(dccwParams, this.Repository);

	makeCall(url, dccwParams.CallBack);
}

//#region DCCW Functions

DCCW.prototype.InitializeExt = function (repository, dfsUrl, callBack)
{
	this.Invoke({
		FunctionName: "InitializeExt",
		Parameters: new Array(repository, dfsUrl),
		CallBack: callBack
	});
}

DCCW.prototype.Initialize = function (repository, callBack)
{
	this.Invoke({
		FunctionName: "Initialize",
		Parameters: new Array(repository),
		CallBack: callBack
	});
}

DCCW.prototype.CheckOut = function (mojId, docType, openForEdit, cancelCheckout, callBack)
{
	this.Invoke({
		FunctionName: "CheckOut",
		Parameters: new Array(mojId, docType, openForEdit, cancelCheckout),
		CallBack: callBack
	});
}

DCCW.prototype.CheckOutByVersion = function (mojId, docType, version, cancelCheckOut, openForEdit, callBack)
{
	this.Invoke({
		FunctionName: "CheckOutByVersion",
		Parameters: new Array(mojId, docType, version, cancelCheckOut, openForEdit),
		CallBack: callBack
	});
}

DCCW.prototype.GetOriginalUrl = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "GetOriginalUrl",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.CheckIn = function (mojId, docType, checkinVersion, attrXml, callBack)
{
	this.Invoke({
		FunctionName: "CheckIn",
		Parameters: new Array(mojId, docType, checkinVersion, attrXml),
		CallBack: callBack
	});
}

DCCW.prototype.CheckInByObjectId = function (objectId, docType, checkinVersion, versionDesc, attrXml, callBack)
{
	this.Invoke({
		FunctionName: "CheckInByObjectId",
		Parameters: new Array(objectId, docType, checkinVersion, versionDesc, attrXml),
		CallBack: callBack
	});
}

DCCW.prototype.CheckOutByObjectId = function (objectId, docType, openForEdit, cancelCheckout, callBack)
{
	this.Invoke({
		FunctionName: "CheckOutByObjectId",
		Parameters: new Array(objectId, docType, openForEdit, cancelCheckout),
		CallBack: callBack
	});
}

DCCW.prototype.CreateObjectByTemplate = function (templateMojId, docType, attrXml, Path, callBack)
{
	this.Invoke({
		FunctionName: "CreateObjectByTemplate",
		Parameters: new Array(templateMojId, docType, attrXml, Path),
		CallBack: callBack
	});
}

DCCW.prototype.ViewFile = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "ViewFile",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.GetFile = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "GetFile",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.GetPreviewUrl = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "GetPreviewUrl",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.GetThumbnailByMojId = function (mojId, docType, thumbnailSize, callBack)
{
	// thumbnailSize = 0 => Large
	// thumbnailSize = 1 => Medium
	// thumbnailSize = 2 => Small
	this.Invoke({
		FunctionName: "GetThumbnailByMojId",
		Parameters: new Array(mojId, docType, thumbnailSize),
		CallBack: callBack
	});
}

DCCW.prototype.UpdateObject = function (mojId, docType, filePath, label, checkinVersion, attrXml, callBack)
{
	this.Invoke({
		FunctionName: "UpdateObject",
		Parameters: new Array(mojId, docType, filePath, label, checkinVersion, attrXml),
		CallBack: callBack
	});
}

DCCW.prototype.GetVersionObject = function (mojId, docType, version, callBack)
{
	this.Invoke({
		FunctionName: "GetVersionObject",
		Parameters: new Array(mojId, docType, version),
		CallBack: callBack
	});
}

DCCW.prototype.ImportObject = function (docType, filePath, folderPath, attrXml, callBack)
{
	this.Invoke({
		FunctionName: "ImportObject",
		Parameters: new Array(docType, filePath, folderPath, attrXml),
		CallBack: callBack
	});
}

DCCW.prototype.Scan = function (input, inputAreFiles, isTiffSave, collectSavedFiles, callBack)
{
	this.Invoke({
		FunctionName: "Scan",
		Parameters: new Array(input, inputAreFiles, isTiffSave, collectSavedFiles),
		CallBack: callBack
	});
}

DCCW.prototype.FuncTest = function (input, callBack)
{
	this.Invoke({
		FunctionName: "FuncTest",
		Parameters: new Array(input),
		CallBack: callBack
	});
}

DCCW.prototype.GetLastError = function (callBack)
{
	this.Invoke({
		FunctionName: "GetLastError",
		Parameters: new Array("[none]"),
		CallBack: callBack
	});
}

DCCW.prototype.GetLastStackTrace = function (callBack)
{
	this.Invoke({
		FunctionName: "GetLastStackTrace",
		Parameters: new Array("[none]"),
		CallBack: callBack
	});
}

DCCW.prototype.GetVersionInfo = function (callBack)
{
	this.Invoke({
		FunctionName: "GetVersionInfo",
		Parameters: new Array("[none]"),
		CallBack: callBack
	});
}

DCCW.prototype.CopyObject = function (mojId, docType, destFolder, callBack)
{
	this.Invoke({
		FunctionName: "CopyObject",
		Parameters: new Array(mojId, docType, destFolder),
		CallBack: callBack
	});
}

DCCW.prototype.MoveObject = function (mojId, docType, destFolder, callBack)
{
	this.Invoke({
		FunctionName: "MoveObject",
		Parameters: new Array(mojId, docType, destFolder),
		CallBack: callBack
	});
}

DCCW.prototype.LaunchPDFWithAnnotations = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "LaunchPDFWithAnnotations",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.GetUrlByMojId = function (mojId, docType, contentType, callBack)
{
	this.Invoke({
		FunctionName: "GetUrlByMojId",
		Parameters: new Array(mojId, docType, contentType),
		CallBack: callBack
	});
}

DCCW.prototype.GetMergePdf = function (mojId, docType, callBack)
{
	this.Invoke({
		FunctionName: "GetMergePdf",
		Parameters: new Array(mojId, docType),
		CallBack: callBack
	});
}

DCCW.prototype.CheckOutX = function (mojId, docType, openForEdit, callBack)
{
	this.Invoke({
		FunctionName: "CheckOutX",
		Parameters: new Array(mojId, docType, openForEdit, false),
		CallBack: callBack
	});
}

DCCW.prototype.GetPreviewUrlByVersion = function (mojId, docType, version, callBack)
{
	this.Invoke({
		FunctionName: "GetPreviewUrlByVersion",
		Parameters: new Array(mojId, docType, version),
		CallBack: callBack
	});
}

DCCW.prototype.CreateObjectByTemplateAndMergeFields = function (templateMojId, templateIdentifier, docType, attrXml, dctmPath, createPdf, checkout, lauchFile, callBack)
{
	this.Invoke({
		FunctionName: "CreateObjectByTemplateAndMergeFields",
		Parameter: new Array(templateMojId, templateIdentifier, docType, attrXml, dctmPath, createPdf, checkout, lauchFile),
		CallBack: callBack
	});
}

//#endregion

//#region No DCCW functions

DCCW.prototype.UpdateAttributeList = function (attributeName, attributeValue, callBack)
{
	this.Invoke({
		FunctionName: "UpdateAttributeList",
		Parameters: new Array(attributeName, attributeValue),
		CallBack: callBack
	});
}

DCCW.prototype.RemoveAttributeList = function (attributeName, callBack)
{
	this.Invoke({
		FunctionName: "RemoveAttributeList",
		Parameters: new Array(attributeName),
		CallBack: callBack
	});
}

DCCW.prototype.ClearAttributeList = function (callBack)
{
	this.Invoke({
		FunctionName: "ClearAttributeList",
		Parameters: new Array("[none]"),
		CallBack: callBack
	});
}

DCCW.prototype.DisplayMailItemWithAttachedMojIds = function (subject, body, to, cc, docType, mojIds, callBack)
{
	this.Invoke({
		FunctionName: "DisplayMailItemWithAttachedMojIds",
		Parameters: new Array(subject, body, to, cc, docType, mojIds),
		CallBack: callBack
	});
}

DCCW.prototype.OpenFileDialog = function (filter, callBack)
{
	this.Invoke({
		FunctionName: "OpenFileDialog",
		Parameters: new Array(filter),
		CallBack: callBack
	});

}

DCCW.prototype.OpenMultiFileDialog = function (filter, callBack)
{
	this.Invoke({
		FunctionName: "OpenFileDialog",
		Parameters: new Array(filter, true),
		CallBack: callBack
	});
}

DCCW.prototype.SilentPrint = function (fileToPrint, printerName, pagesRange, callBack)
{
	this.Invoke({
		FunctionName: "SilentPrint",
		Parameters: new Array(fileToPrint, printerName, pagesRange),
		CallBack: callBack
	});
}

DCCW.prototype.ShellExecute = function (fileToExecute, callBack)
{
	this.Invoke({
		FunctionName: "ShellExecute",
		Parameters: new Array(fileToExecute),
		CallBack: callBack
	});
}

DCCW.prototype.LocalDefinedRepositories = function (callBack)
{
	this.Invoke({
		FunctionName: "LocalDefinedRepositories",
		Parameters: new Array("[none]"),
		CallBack: callBack
	});
}

//#endregion

function initalizeDCCW(fullUserName)
{
	window.W$ = new DCCW(fullUserName);
}