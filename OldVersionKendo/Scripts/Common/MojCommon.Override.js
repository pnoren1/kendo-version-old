
Moj.wizard.loadActionTab = function (e, isVisibleContentTab, isDataFromParams, callBack) {
    kendo.ui.progress($("body"), true);
    var tabId = e.id;
    var contentTabId = "content-" + tabId;
    var loadContent = false;

    Moj.wizard._hasCancel($(e).attr("has-cancel"));

    if ($(e).attr("data-load-mode") == "Replace" || $(e).attr("data-reload").toLowerCase() == "true")
        loadContent = true;
    if ($(e).attr("data-load-mode") == "Replace")
        contentTabId = "content-replace";


    if (MojFind("#form-container").has("[id='" + contentTabId + "']").length == 0) {
        MojFind("#form-container").append($('<div>', {
            'data-role': 'tab-content',
            id: contentTabId,
            'class': 'wizard-content hide'
        }));
        loadContent = true;
    }
    var isSubMenu = typeof ($(e).attr("data-submenu")) != "undefined" && $(e).attr("data-submenu") == "true";

    if (loadContent && !isSubMenu) {
        var data = $(e).attr("data-params");
        if (Moj.isTrue($(e).attr("data-submit-behavior")) && !Moj.isTrue(isDataFromParams))
            data = JSON.stringify($(MojFind('form')[0]).serializeObject());
        var getParamsMethod = $(e).attr("data-params-method");
        if (getParamsMethod != undefined && getParamsMethod != "") {
            data = JSON.stringify(eval(getParamsMethod));
        }
        $.ajax({
            type: "POST",
            url: $(e).attr("data-href"),
            data: data,
            contentType: 'application/json',
            success: function (data) {
                if (Moj.showErrorMessage(data.Errors) == true) {

                    if (data.NotReload == undefined || data.NotReload == false) {
                        MojFind("#content-replace").empty();
                        MojFind("#" + contentTabId).html(data);
                        if (isVisibleContentTab != false) {
                            Moj.wizard._setContentTab(contentTabId, e);
                            MojFind(".main-menu").attr("current-tab-id", tabId);
                            Moj.wizard.enableNavigationButtons(true, $(e).attr("is-last"), $(e).attr("is-first"));
                        }
                        if (callBack != undefined)
                            callBack();
                    }
                    else {
                        Moj.wizard._setTabByContentTabId(contentTabId, e, tabId);
                    }
                }
                kendo.ui.progress($("body"), false);
            },
            error: function () {
                eval($(e).attr("data-ajax-failure"));
                kendo.ui.progress($("body"), false);
            },
            failure: function (parameters) {
                eval($(e).attr("data-ajax-failure"));
                kendo.ui.progress($("body"), false);
            }
        });
    } else {
        Moj.wizard._setTabByContentTabId(contentTabId, e, tabId);
        kendo.ui.progress($("body"), false);
    }
};

Moj.wizard.onBeginActionTab = function (e) {
    if ($(e).closest("li").attr("disabled") == "disabled") return false;
    var detailsExsit = MojFind('[id^=div_][id$=_Details]');
    var activeDetailsExist = false;
    $(detailsExsit).each(function () {
        if ($(this).css("display") != "none" && $(this).html() != "")
            activeDetailsExist = true;
    });
    if (MojFind('[id^=tr_][id$=_Details]').length > 0 || activeDetailsExist) {
        if (MojFind('[id^=tr_][id$=_Details]').length > 0) {
            MojFind('[id^=tr_][id$=_Details]').each(function () {
                var gridName = this.id.split("_")[1];
                Moj.HtmlHelpers._closeGridInlineDetails(gridName);
            });
        } else {
            Moj.showMessage(window.Resources.Messages.DataNotSaved);
            return false;
        }
    }
    kendo.ui.progress($("body"), true);
    if (Moj.isTrue(MojFind("[name='SaveAnyWay']").val()) || Moj.wizard.checkChanges()) {
        //var canSave = true;
        //if (MojFind("[name='methodBeforeSave']").val() != "") {
        //    var result = eval(MojFind("[name='methodBeforeSave']").val() + "(e)");
        //    if (typeof (result) == "boolean")
        //        canSave = Moj.isTrue(result);
        //}
        //if (Moj.isTrue(canSave)) {
            Moj.wizard._saveAndLoadTab(e);
        //}
        kendo.ui.progress($("body"), false);
        return;
    }
    Moj.wizard.loadActionTab(e);
};

Moj.wizard._saveAndLoadTab = function (e) {
    var checkValidation = true;
    var canSave = true;
    var isPreviousClicked = MojFind("ul[is-previous-clicked='true']").length != 0;
    if (Moj.isFalse(MojFind("ul[check-validation-on-previous]").attr('check-validation-on-previous'))
        && isPreviousClicked) {
        checkValidation = false;
    }
    else
    {
        if (MojFind("[name='methodBeforeSave']").val() != "") {
            document.body.style.cursor = 'wait';
            var result = eval(MojFind("[name='methodBeforeSave']").val() + "(e)");
            document.body.style.cursor = 'auto';
            if (typeof (result) == "boolean")
                canSave = Moj.isTrue(result);
        }
    }
    if (Moj.isTrue(canSave)) {
        Moj.wizard._handleValidationGroupFoTab(e);
        var isValid = true;
        if (checkValidation) {

            isValid = Moj.wizard.checkChangesIfValid();
            if (isValid)
                isValid = Moj.wizard.submitActionTab().canLoadNextView;
            if (isValid)
                if (MojFind("[name='methodAfterSave']").val() != "") {
                    document.body.style.cursor = 'wait';
                    eval(MojFind("[name='methodAfterSave']").val());
                    document.body.style.cursor = 'auto';
                }
        }
        if (isValid) {
            var active = MojFind(".sub-menu-container .ul-sub-menu li.active");
            var activeId = active.attr("id");
            active.removeClass("active").addClass("valid");
            MojFind(".main-menu-item.active").find("#" + activeId).addClass("valid");
            Moj.wizard._restoreValidationGroupFoTab(e);
            Moj.wizard.loadActionTab(e);
        }
        if (isPreviousClicked)
            MojFind("ul[is-previous-clicked]").attr('is-previous-clicked', false);
    }
};

Moj.wizard._setTabByContentTabId = function (contentTabId, e, tabId) {
    MojFind("#content-replace").empty();
    Moj.wizard._setContentTab(contentTabId, e);
    MojFind(".main-menu").attr("current-tab-id", tabId);
    Moj.wizard.enableNavigationButtons(true, $(e).attr("is-last"), $(e).attr("is-first"));
};

//Moj.HtmlHelpers._saveRowToGridFunc = function (gridName, model, selector, isEditableGridInline, setAllModel) {
//    var selectedRow;
//    var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");

//    if (isEditableGridInline != undefined && isEditableGridInline == true) {
//        selectedRow = grid.table.find("tr.hide");//for editable gridinline 
//    }
//    else if (grid.table.find("tr.tr-mode-inline-grid").length > 0) {
//        selectedRow = grid.table.find("tr.tr-mode-inline-grid").prev();
//    }
//    else {
//        selectedRow = grid.select();       
//    }
//    if (model.State == window.Enums.ObjectState.Added || model.State == window.Enums.ObjectState.AddedString || (model.ID != undefined && model.ID != "0" && model.ID != "00000000-0000-0000-0000-000000000000")) {
//        if (!setAllModel) {
//            var o = MojFind("#" + selector + " :input");
//            for (var i = 0; i < o.length; i++) {
//                if (o[i].name.indexOf(".") == -1)
//                    var name = o[i].name;
//                else
//                    var name = o[i].name.split(".").pop();
//                //Handle multi select dropDown in grid 4Submit.
//                if (name.indexOf("_DropDown") >= 0) {
//                    name = name.replace("_DropDown", "");
//                }
//                grid.dataItem(selectedRow)[name] = model[name];
//            }
//            if (model.State != window.Enums.ObjectState.Added && model.State != window.Enums.ObjectState.AddedString)
//                grid.dataItem(selectedRow)["State"] = window.Enums.ObjectState.Modified;
//        } else {
//            if (model.State != window.Enums.ObjectState.Added && model.State != window.Enums.ObjectState.AddedString)
//                model.State = window.Enums.ObjectState.Modified;
//            var items = grid.dataSource.data();
//            var index = -1;
//            $(items).filter(function (i, e) {
//                if (e.uid == selectedRow.attr("data-uid"))
//                    index = i;
//                return e.uid == selectedRow.attr("data-uid");
//            });
//            if (index >= 0) {
//                items[index] = model;
//                grid.dataSource.data(items);
//            }
//        }


//    } else {
//        model["State"] = window.Enums.ObjectState.Added;
//        grid.dataSource.add(model);
//    }
//    Moj.changeObjectStateToForm(true);
//    grid.refresh();
//    Moj.HtmlHelpers._backToListGrigForSubmit(gridName);
//};

//Moj.HtmlHelpers._showDetails = function (e) {
//    if (e.currentTarget.hasAttribute("disabled") && $(e.currentTarget).attr("disabled") == "disabled") {
//        return false;
//    } else {
//        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
//        grid.select($(e.currentTarget).closest("tr"));
//        var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
//        var id = dataItem.id;
//        var url = e.currentTarget.href;
//        var customData, getCustomData = MojFind(e.currentTarget).attr("methodCustomData");
//        if (typeof (getCustomData) != "undefined" && getCustomData != null && getCustomData != "") {
//            customData = eval(getCustomData);
//        };
//        MojFind('#DetailsContent').html("<center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/BlueOpal/loading-image.gif' /></center>");
//        var x = MojFind('#DetailsContent').load(url + "/" + id, customData, function () {
//        });
//        Moj.replaceDivs('#ListContent', '#DetailsContent');
//        return false;
//    }
//},

Moj.closePopUp = function (windowId) {
    var window = $("#" + windowId).data("kendoWindow");
    window.close();

};

Moj.ShowDivsWindowUp = function (e) {
    var DivToShow = MojFind('div[class^="DivToHideWhenDetailsPageIsUp"]');
    if ((DivToShow != null) && (DivToShow != undefined))
    {
        DivToShow.each(function () 
        { 
            $(this).show() 
        });
    }
};

Moj.ReplaceNullsInEmptyString = function (object) {

    $.each(object, function (index, value) {
        if (value == null) {
            object[index] = "";
        };
    });

    return object;

};

Moj._handleErrorMessage= function (xhr) {
            if (typeof (xhr.responseText) != "undefined" && xhr.responseText.indexOf("ErrorHandlerScript") > -1) {
                var url = "";
                var callBack = undefined;
                if (xhr.responseText.indexOf("url=") > -1) {
                    url = xhr.responseText.substring(xhr.responseText.indexOf("url='"));
                    url = url.replace("url='", "").substring(0, url.replace("url='", "").indexOf("'"))
                    callBack = function () { window.location.href = baseUrl + url }
                }
                var xhrHtmlTags = $(xhr.responseText);
                var message = "";
                if (xhrHtmlTags != null && xhrHtmlTags != undefined && xhrHtmlTags != "undefined")
                {
                    var ErrorHandlerScript =  xhrHtmlTags.find('#ErrorHandlerScript');
                    if (ErrorHandlerScript != null && ErrorHandlerScript != undefined && ErrorHandlerScript != "undefined" && ErrorHandlerScript.length != 0)
                        message = ErrorHandlerScript.text().replace(/'/g,'');
                    else
                    {
                        if (xhrHtmlTags[0].id == "ErrorHandlerScript")
                            message = xhrHtmlTags[0].text.replace(/'/g, '');
                        else
                          message = xhr.responseText.replace(" url='" + url + "'", "").replace("<html><head><script id='ErrorHandlerScript'>'", "").replace("'</script></head></html>", "");
                    }
                       
                }
                else
                    message = xhr.responseText.replace(" url='" + url + "'", "").replace("<html><head><script id='ErrorHandlerScript'>'", "").replace("'</script></head></html>", "");

                Moj.showMessage(message, callBack);
            }
        };

Moj.HtmlHelpers.removeNotActive = function (e) {
    var dropDown = e.sender;
    var data = dropDown.dataSource._data;
    var newData = [];
    if (data.length && data[0].IsActive != undefined) {
        for (var item = data.length - 1; item >= 0; item--) {
            if (data[item].IsActive == false) {
                if (data[item].Key == dropDown.element.attr('originalIndex')) {
                    newData.unshift(data[item]);
                    $(dropDown.ul).find("li:eq(" + item + ") div").css("color", "#c0c0c0 !important");
                }
            }
            else {
                newData.unshift(data[item]);
            }
        }
        dropDown.unbind("dataBound");
        dropDown.dataSource.data(newData);
    }
};

