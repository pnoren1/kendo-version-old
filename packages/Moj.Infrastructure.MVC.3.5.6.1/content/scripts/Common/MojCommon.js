$(document).ready(function () {
    var url = window.location.href.replace(baseUrl, '');
    index = url.indexOf('?');
    if (index > -1)
        url = url.substring(0, index);
    if ($("li a[data-href*='" + url + "']").closest("li").length > 0)
        $("li a[data-href*='" + url + "']:first").closest("ul").closest("li").addClass("active");
    else if ($("li a[href*='" + url + "']").length > 0) {
        $($("li a[href*='" + url + "']:first")).closest("li").addClass("active");
    }
    State.bindPopstateToWindow();
    Moj.initBreadCrumbs();
    if (isInternetExplorer()) {
        MojFind("input[type=radio]+.before, input[type=checkbox]+.before, input[type=radio]~.after, input[type=checkbox]~.after").remove();
        MojFind("input[type=radio], input[type=checkbox]").addClass("ie").after($("<div/>", { "class": "after" })).after($("<div/>", { "class": "before" }));
    }
});

$(document).on('pjax:timeout', function (event) {
    event.preventDefault()
});

$(document).on('pjax:error', function (event) {
    event.preventDefault();
});

$(document).ajaxStart(function () {
    if (document.body != null)
        document.body.style.cursor = 'wait';
    $("#div_overlay").removeClass("hide");
});

$(document).ajaxStop(function () {
    if (Moj.Constants["IsInAction"] == false) {
        if (document.body != null)
            document.body.style.cursor = 'auto';
        $("#div_overlay").addClass("hide");
    }
    Moj.enableValidation(MojFind("form"));
    $("table .k-minus,table .k-plus").attr("href", "javascript:void(0)");
    $(".button-tooltip").each(function () {
        var a = $(this).closest("a");
        var content = $(this).html();
        a.qtip({
            content: content,
            show: { event: 'focus mouseover' },
            hide: { event: 'unfocus mouseout blur click' },
            position: { my: 'bottom center', at: 'top center' }
        });
    });
    if (isInternetExplorer()) {
        MojFind("input[type=radio]+.before, input[type=checkbox]+.before, input[type=radio]~.after, input[type=checkbox]~.after").remove();
        MojFind("input[type=radio], input[type=checkbox]").addClass("ie").after($("<div/>", { "class": "after" })).after($("<div/>", { "class": "before" }));
    }
    var forms = $('form');
    $(forms).each(function () {
        Moj.addObjectStateToForm(this.id);
    });
    Moj.keepAlive();
});

$(document).ajaxError(function (event, xhr, settings, exception) {
    Moj.HtmlHelpers._handleErrorMessage(xhr);
    Moj.HtmlHelpers._handleValidationErrorMessage(xhr);
    Moj.HtmlHelpers._showCaptchaWindowIfNeeded(xhr);
    Moj.keepAlive();
    Moj.recaptchaReset();
});
$(document).ajaxSuccess(function (event, xhr, settings) {
    Moj.HtmlHelpers._handleErrorMessage(xhr);
    Moj.HtmlHelpers._showCaptchaWindowIfNeeded(xhr);

    $.validator.setDefaults({
        ignore: []
    });

    if ($.inArray('html', settings.dataTypes) >= 0) {
        function parseUnobtrusive(elementId) {
            if (elementId) {
                $.validator.unobtrusive.parse('#' + elementId);
                $('input,textarea').live('change', function () {
                    var objectStateEntityVal = $(this).attr('ObjectStateEntity');
                    if (objectStateEntityVal != undefined) {
                        if (objectStateEntityVal.indexOf(".") != -1) {
                            var prefix = objectStateEntityVal.substring(0, objectStateEntityVal.indexOf('.'));
                            objectStateEntityVal = objectStateEntityVal.substring(objectStateEntityVal.indexOf('.') + 1, objectStateEntityVal.length);
                            MojFind('#' + elementId).find("#" + prefix + "_" + "ObjectState" + objectStateEntityVal).val("true");
                        }
                        else
                            MojFind('#' + elementId).find('#ObjectState' + $(this).attr('ObjectStateEntity')).val("true");
                    }
                    if (MojFind('#' + elementId).find('#ObjectState').length > 0)
                        MojFind('#' + elementId).find('#ObjectState').val("true");
                    if ($(this).attr('type') == "text")
                        $(this).attr('title', $(this).val());
                });

                $(".menu").kendoMenu({
                    direction: "bottom right"
                });
                handleGridPager();
            }
        }

        var forms = $('form', '<div>' + xhr.responseText + '</div>');
        $(forms).each(function () {
            var formId = this.id;
            setTimeout(function () { parseUnobtrusive(formId); }, 0);
        });
        handleGridPager();

        if (isInternetExplorer()) {
            MojFind("input[type=radio]+.before, input[type=checkbox]+.before, input[type=radio]~.after, input[type=checkbox]~.after").remove();
            MojFind("input[type=radio], input[type=checkbox]").addClass("ie").after($("<div/>", { "class": "after" })).after($("<div/>", { "class": "before" }));
        }
    }
    Moj.keepAlive();
});

function recaptchaCheckCallback(input) {
    $("[data-recaptcha]").val(input);
}

function recaptchaExpiredCallback() {
    $("[data-recaptcha]").val('');
}

function isInternetExplorer() {
    var myNav = navigator.userAgent.toLowerCase();
    if (myNav.indexOf('msie') != -1)
        return parseInt(myNav.split('msie')[1]);
    if (myNav.indexOf('rv:') != -1)
        return parseInt(myNav.split('rv:')[1]);

    return false;
}
function isFF() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('firefox') != -1);
}
function isEdge() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('edge') != -1);
}

function handleGridPager() {
    MojFind(".k-grid").each(function () {
        if ($(this).attr("griddatasource") != undefined) {
            $(this).find(".k-grid-pager a").addClass("hide-important");
            $(this).find(".k-grid-pager ul").addClass("hide-important");
        }
        else {
            $(this).find(".k-grid-pager a").removeClass("hide-important");
            $(this).find(".k-grid-pager ul").removeClass("hide-important");
        }
    });
};



function objectToQueryString(name, object, str) {
    if (!$.isArray(str)) str = [];
    for (var i in object) {
        if (typeof (object[i]) == "function") {
        } else if (typeof (object[i]) === 'object')
            objectToQueryString(name + Moj.getNameObjectForSubmit(i, name), object[i], str);
        else {
            str[str.length] = ($('<input/>', {
                name: name + Moj.getNameObjectForSubmit(i, name),
                value: object[i]
            }).serialize());
        }
    }
    return str.join("&").replace(/%20/g, "+");
}

function MojFind(selector) {
    var object = $(Moj.Constants["selectedTabContent"]).find(selector);
    return object;
};

var MessageType = {};
MessageType.Error = "Error";
MessageType.Message = "Message";
MessageType.Alert = "Alert";
MessageType.Attention = "Attention";
MessageType.Success = "Success";


var EventType = {};
EventType.MultiChanged = "multiChanged";


$(function () {
    Moj.changeDocFontSize(Moj.docFontSizeType.normal);
    //Moj.addConstant("defaultSelectedTabContent", document);
    //Moj.addConstant("selectedTabContent", document);
    //Moj.addConstant("IsInAction", false);
    //Moj.addConstant("DocumetFormats", "png, pdf, doc, txt, jpeg, jpg, ppt, pptx, tif, tiff, xls, xlsx, xml,zip,zg1,msg,html,htm");

    if ($("ul[current-culture]").length > 1 && $("ul[current-culture]").attr("current-culture") != undefined)
        kendo.culture($("ul[current-culture]").attr("current-culture"));
    else
        kendo.culture("he-IL");
    $.ajaxSetup({ cache: false });

    $(".menu").kendoMenu({
        direction: "bottom right"
    });

    if ($.support.pjax) {
        $.pjax.defaults.timeout = 15000;
        $(document).pjax('[data-pjax]', '.web-site-container')
    }

    $(document).delegate('[datareadonly="deleteOnly"]', 'keydown', function (e) {
        return (e.which === 46 || e.which === 8 || (e.which >= 37 && e.which <= 40));
    });

    $(document).delegate('.moj-panel > .moj-form-title.txt .txt', 'click', function (e) {
        e.stopImmediatePropagation();
        $(e.currentTarget).closest(".moj-panel").find(".button-open-close div").trigger("click");
    });

    $(document).delegate('.plus', 'click', function (e) {
        if ($(this).find('a').attr('disabled') != 'disabled') {
            $(e.currentTarget).closest(".moj-panel").find("#" + $(this).attr("data-id")).slideDown();
            $(this).removeClass("plus").addClass("minus");
            $(this).closest(".moj-form-title").removeClass("no-border-bottom");
            $(this).find("a").attr("aria-label", $(this).find("a").attr("close-text"));
        }
    });

    $(document).delegate('.minus', 'click', function (e) {
        var title = $(this).closest(".moj-form-title");
        $(e.currentTarget).closest(".moj-panel").find("#" + $(this).attr("data-id")).slideUp(function () {
            title.addClass("no-border-bottom");
        });
        $(this).removeClass("minus").addClass("plus");
        $(this).find("a").attr("aria-label", $(this).find("a").attr("open-text"));
    });



    $(document).delegate(".moj-modal", "click", function () {
        if ($(this).attr("disabled") == undefined || $(this).attr("disabled") != "disabled") {
            var dialogId = 'dialogModal';
            $(this).attr('active', true);
            var width = 700;
            var height = 500;
            var size = $(this).attr('datamodal');
            if (size != undefined) {
                width = size.split(";")[0];
                height = size.split(";")[1];
                if (size.split(";")[2] != undefined)
                    dialogId = size.split(";")[2] + "dialogModal";
            }
            var url = $(this).attr('href');
            Moj.openPopupWindow(dialogId, "", "", width, height, true, true, false, url);
        }
        return false;
    });

    $("body").on("window_opened", ".k-window-content", function (e) {
        $(this).bind('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);
        Moj.Constants["PrevSelectedTabContent"] = Moj.Constants["selectedTabContent"];
        Moj.Constants["selectedTabContent"] = "div#" + $(e.currentTarget).attr("id") + ".k-window-content.k-content";
    });

    $("body").on("window_closed", ".k-window-content", function (e) {
        $(this).unbind('mousewheel DOMMouseScroll');
        Moj.Constants["selectedTabContent"] = Moj.Constants["PrevSelectedTabContent"];
        if (Moj.Constants["PrevSelectedTabContent"] == null)
            Moj.Constants["selectedTabContent"] = Moj.Constants["defaultSelectedTabContent"];
        Moj.Constants["PrevSelectedTabContent"] = null;
    });

    $(".k-list.k-reset[data-role='staticlist']").live('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);

    $(".k-grid-content").live('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);

    $('input,textarea').live('change', function () {
        Moj.changeObjectsState($(this));
        if ($(this).attr('type') == "text")
            $(this).attr('title', $(this).val());
        else if ($(this).attr('type') == "radio") {
            var name = MojFind("#" + this.id).attr("name");
            MojFind("[name='" + name + "']:checked").closest('.col').next().addClass("bold");
            MojFind("[name='" + name + "']:not(:checked)").closest('.col').next().removeClass("bold");
        }
        //fix combobox bug that not save custom string after type existing string
        var inputName = $(this).attr("name") != undefined ? "[name='" + $(this).attr("name").replace("_input", "") + "']" : "";
        if ($(this).attr('role') == "combobox" && Moj.isTrue(MojFind(inputName).attr("allowcustomstring"))) {
            val = $(this).val();
            if (val != "") {
                MojFind(inputName).data("kendoComboBox").value("");
                MojFind(inputName).data("kendoComboBox").text(val);
            }
        }
    });

    $('input[readonly], textarea[readonly]').live('focus', function (ev) {
        $(this).trigger('blur');
    });

    MojFind(".moj-ws-top-menu .ul-navigation > li > a").live("keydown", function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9 && e.shiftKey) {
            $(".ul-sub-navigation").removeAttr("style");
        }
        else if (keyCode == 9) {
            $(".ul-sub-navigation").removeAttr("style");
            if ($(".ul-sub-navigation li", $(this).closest("li")).length > 0) {
                e.preventDefault();
                $(".ul-sub-navigation", $(this).closest("li")).attr("style", "display: block; z-index: 9999;");//.css({ "display": "block", "z-index": "9999" });
                $(".ul-sub-navigation a:first", $(this).closest("li")).focus();
            }
        }
    });

    MojFind(".moj-ws-top-menu .ul-sub-navigation > li:last a").live("keydown", function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 9) {
            $(".ul-sub-navigation").removeAttr("style");
        }
    });

    MojFind(".moj-ws-top-menu .ul-navigation > li > a").live("focus", function (e) {
        $(".ul-sub-navigation").removeAttr("style");
        if ($(".ul-sub-navigation li", $(this).closest("li")).length > 0) {
            $(".ul-sub-navigation", $(this).closest("li")).attr("style", "display: block; z-index: 9999;");
        }
    });

    $(document).live("mousedown", function (e, a, g) {
        if ($(e.srcElement).closest(".ul-navigation").length == 0) {
            $(".ul-sub-navigation").removeAttr("style");
        }
    });

    //$("div[data-role='grid']").live('blur', function (e) {
    //    Moj.HtmlHelpers._closeGridInlineDetails($(this).attr('id').split('-')[0]);
    //});

    $("tr").live('click', function (e) {
        var editButton = $(e.currentTarget).find('td.edit-row').find('a[iseditablegridinline]');
        if (editButton == undefined)
            return;

        var isEditRowInlineAttr = editButton.attr('iseditrowinline');
        var isEditableGridInlineAttr = editButton.attr('iseditablegridinline');
        if (isEditRowInlineAttr != undefined && Moj.isTrue(isEditRowInlineAttr)
            && isEditableGridInlineAttr != undefined && Moj.isTrue(isEditableGridInlineAttr)) {
            if (e.srcElement != undefined
                && $(e.srcElement).parent().hasClass('edit-row') == false
                && $(e.srcElement).parent().hasClass('delete-row') == false
                && $(e.srcElement).hasClass('delete-row') == false
            ) {
                editButton.click()
            }

            if (e.srcElement != undefined && $(e.srcElement).hasClass('delete-row') == true) {
                $(e.currentTarget).find('a.k-grid-Delete').click()
            }
        }
    });

    $(".action-base.in-group").live("click", function () {
        //find his all group buttons only
        $(this).parent().find(".action-base.in-group input").removeClass("active");
        $("input", this).addClass("active");
    });

    $(".accessible-bar .open-menu").click(function () {
        $(".accessible-bar").addClass("open")
    });
    $(".accessible-bar .close, .accessible-bar .link-close").click(function () {
        $(".accessible-bar").removeClass("open")
    });
});

$(document).delegate(".guidelines .guide-more", "click", function () {
    $(".summary", $(this).closest("span")).hide();
    $(".txt", $(this).closest("span")).slideDown();
    $("h4", $(this).closest("span")).attr("aria-expanded", "true");
    $("h4", $(this).closest("span")).focus();
});
$(document).delegate(".guidelines .guide-close", "click", function () {
    $(".txt", $(this).closest("span")).slideUp(function () {
        $(".summary", $(this).closest("span")).show();
        $("h4", $(this).closest("span")).attr("aria-expanded", "false");
    });
});

$(document).delegate(".guidelines h4", "click", function () {
    if ($(this).attr("aria-expanded") == "false") {
        $(".summary", $(this).closest("span")).hide();
        $(".txt", $(this).closest("span")).slideDown();
        $("h4", $(this).closest("span")).attr("aria-expanded", "true");
        $("h4", $(this).closest("span")).focus();
    }
    else if ($(this).attr("aria-expanded") == "true") {
        $(".txt", $(this).closest("span")).slideUp(function () {
            $(".summary", $(this).closest("span")).show();
            $("h4", $(this).closest("span")).attr("aria-expanded", "false");
        });
    }
});

// event handler methods
$('input,textarea,select').live('change', function () {
    if (typeof ($(this).attr("data-val")) != "undefined") {
        if (!$(this).valid())
            $("[aria-owns='" + $(this).attr("id") + "_listbox'").attr("aria-describedby", $(this).attr("aria-describedby"));
    }

    if ($(this).attr('type') == "text")
        $(this).attr('title', $(this).val());
    else if ($(this).attr('type') == "radio") {
        var name = MojFind("#" + this.id).attr("name");
        MojFind("[name='" + name + "']:checked").closest('.col').next().addClass("bold");
        MojFind("[name='" + name + "']:not(:checked)").closest('.col').next().removeClass("bold");
    }
});


$("[data-role='combobox'][allowCustomString!='true']").live('change', function () {
    if ($(this).data("kendoComboBox").select() == -1) {
        $(this).val("");
        $(this).data("kendoComboBox").value("");
        $("[name='" + this.id.replace('_', '.') + "_input']").attr('title', "");
        $(this).valid();
    }
});

$(".k-widget.k-combobox input.k-input").live("blur", function () {
    if ($(this).val() != "") {
        var element = $(this).closest(".k-widget.k-combobox").find("input[data-role='combobox']");
        var combobox = element.data("kendoComboBox");
        var value = combobox.options.dataTextField;
        var key = combobox.options.dataValueField;
        var dataSource = combobox.dataSource;
        var data = dataSource._view;
        for (var i in data) {
            var index = parseInt(i);
            if (!isNaN(index))
                if (data[index][value] == $(this).val())
                    element.val(data[index][key]);
        }
    }

});

$("[serverautocomplete] .k-input").live("keyup", function () {
    var name = $(this).val();
    var controlName = $(this).attr("name").replace("_input", "");
    var lastName = $(this).attr("lastName");
    var load = false;
    var url = $(this).parents("[serverautocomplete]").attr("url");
    var parameters = $(this).attr("parameters");
    parameters = typeof (parameters) != "undefined" ? parameters : "";
    var combo = MojFind("input[name='" + controlName + "']").data("kendoComboBox");
    var minLength = combo.options.minLength;
    if (name.length > minLength - 1) {
        if (typeof (lastName) == "undefined" || lastName == "")
            load = true;
        else if (name.indexOf(lastName) != 0)
            load = true;
    }
    if (load) {
        //send the additional data city id for example as attributes in the field
        $(this).attr("lastName", name);
        $.ajax({
            url: url + "?text=" + encodeURIComponent(name) + parameters,
            type: "get",
            success: function (list) {
                if (list == null)
                    list = [];
                //list = eval(list);
                combo.dataSource.data(list);
                if (list.length > 0)
                    combo.open();
            },
            error: function () {
                combo.dataSource.data([]);
            }
        });
    }
});

$("form").live("submit", function () {
    $(this).find("input:focus").blur();
    $(this).find("textarea:focus").blur();
    $(this).find("button:focus").blur();
    $(".k-widget.k-window[tabindex]").blur();
});

//kendo validation extention - fix bug in date (hebrew)
$.validator.methods.date = function (value, element) {
    if (value != "") {
        var dateElement = $(element).data("kendoDatePicker");
        if (dateElement == undefined)
            dateElement = $(element).data("kendoDateTimePicker");
        if (dateElement != undefined) {
            var format = dateElement.options.format;
            return kendo.parseDate(value, [format], 'he-IL') != null;
        }
    }
    return /^$|(?!3[2-9]|00|02-3[01]|04-31|06-31|09-31|11-31)[0-3]?[0-9]\/(?!1[3-9]|00)[01]?[0-9]\/\d{4}/.test(value);
};

$.validator.messages.maxlength = Resources.Messages.MaxLengthMessage;

//jquery extention methods
var rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;
$.fn.serializeArray = function () {
    return this.map(function () {
        // Can add propHook for "elements" to filter or add form elements
        var elements = jQuery.prop(this, "elements");
        return elements ? jQuery.makeArray(elements) : this;
    })
        .filter(function () {
            var type = this.type;
            // Use .is(":disabled") so that fieldset[disabled] works
            return this.name && !jQuery(this).is(":disabled") &&
                rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                (this.checked || !manipulation_rcheckableType.test(type));
        })

        .map(function (i, elem) {
            var val = $(this).val();
            if ($(this).attr('type') == "radio") {
                val = MojFind("input[name='" + $(this).attr('name') + "']:checked").val();
                if (val == undefined)
                    val = "";
            }
            if ($(this).attr('type') == "checkbox") {
                var isCheck = $(this).attr('checked');
                if (isCheck == undefined)
                    val = "";
            }

            return jQuery.isArray(val) ?
                jQuery.map(val, function (val) {
                    return {
                        name: elem.name, value: val.replace(rCRLF, "\r\n")
                    };
                }) :
                val != null ?
                    { name: elem.name, value: val.replace(rCRLF, "\r\n") } :
                    null;
        }).get();
};

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    var selectElementsArray = [];
    //find multiselect fields
    var selectElements = this.filter("select");
    for (var i = 0; i < selectElements.length; i++) {
        if (selectElements[i].multiple) {
            var selectedOptions = [];
            for (var j = 0; j < selectElements[i].options.length; j++) {
                if (selectElements[i].options[j].selected)
                    selectedOptions.push(selectElements[i].options[j]);
            }
            //var selectedOptions = selectElements[i].options.filter(function (i, e) { return e.selected == true }); //selectElements[i].options;
            for (var j = 0; j < selectedOptions.length; j++) {
                if (j == 0)
                    selectElementsArray.push(selectElements[i].name);
                o[selectElements[i].name + "[" + j + "]"] = selectedOptions[j].value
            }
        }
    }

    for (var i = 0; i < a.length; i++) {
        if (o[a[i].name] === undefined && selectElementsArray.indexOf(a[i].name) == -1) {
            o[a[i].name] = a[i].value || '';
        }
    }

    //set all unchecked elements to false value
    $("input:checkbox:not(:checked)", this).each(function (index, elm) {
        if (o[elm.name] !== undefined)
            o[elm.name] = "false";
    });

    return o;
}


$.fn.serializeObjectForGrid = function () {
    var newObject = {};
    var array = this.serializeArray();

    var selectElementsArray = [];

    //find multiselect fields
    var selectElements = this.filter("select");

    for (var i = 0; i < selectElements.length; i++) {
        if (selectElements[i].multiple) {
            var selectedOptions = [];
            for (var j = 0; j < selectElements[i].options.length; j++) {
                if (selectElements[i].options[j].selected)
                    selectedOptions.push(selectElements[i].options[j].value);
            }
            newObject[selectElements[i].name] = selectedOptions
        }
    }

    $.each(array, function () {
        if (this.name.lastIndexOf('.') != -1) {
            if (this.name.indexOf('[') != -1) {
                var arrayKey = this.name.substring(0, this.name.indexOf('['));
                if (arrayKey.lastIndexOf('.') != -1)
                    arrayKey = arrayKey.substring(arrayKey.lastIndexOf('.') + 1);
                var newKey = this.name.substring(this.name.lastIndexOf('.') + 1);
                if (!(arrayKey in newObject)) {
                    newObject[arrayKey] = [];
                    newObject[arrayKey].push(Moj.getObjectByArray(newKey, this.value, {}));
                }
                else {
                    var i = newObject[arrayKey].length - 1;
                    if (this.name.substring(this.name.indexOf('[') + 1, this.name.indexOf(']')) != i.toString()) {
                        newObject[arrayKey].push(Moj.getObjectByArray(newKey, this.value, {}));
                    }
                    else
                        Moj.getObjectByArray(newKey, this.value, newObject[arrayKey][i]);
                }


            }
            else {
                var newKey = this.name.substring(this.name.lastIndexOf('.') + 1);
                newObject = Moj.getObjectByArray(newKey, this.value, newObject);
            }
        }
        else {
            newObject = Moj.getObjectByArray(this.name, this.value, newObject);
        }
    });

    return newObject;
};

$.fn.serializeObjectToString = function () {
    var o = this.serializeObject();
    var str = "";
    $.each(o, function () {
        str += this;
    });
    return str;
};

$.fn.serializeDisabled = function () {
    var obj = {};
    $(':disabled[name]', this).each(function () {
        obj[this.name] = $(this).val();
    });
    return obj;
};

$.fn.clearValidationErrors = function () {
    $(this).each(function () {
        //Removes validation from input-fields
        $(this).find('.input-validation-error').addClass('input-validation-valid');
        $(this).find('.input-validation-error').removeClass('input-validation-error');
        //Removes validation message after input-fields
        $(this).find('.field-validation-error').empty();
        $(this).find('.field-validation-error').addClass('field-validation-valid');
        $(this).find('.field-validation-error').removeClass('field-validation-error');
    });
};

$.fn.enterkeypress = function (keypress) {
    $(this).attr("tabindex", 0);
    $(this).keypress(function (e) {
        if (e.keyCode === 13) { // If Enter key pressed
            keypress($(this));
        }
    });
    $(this).focus();
};

$.fn.visible = function (isVisible) {
    if (this.length > 0) {
        var controlId = this[0].id;
        var propertyName = controlId;

        if (controlId.indexOf("_") > -1) {
            var array = controlId.split("_");
            propertyName = array[array.length - 1];
        }

        var mainDiv = $(this[0]);
        var className = "hide-important";

        //if (mainDiv.is("input") || mainDiv.is("select") || mainDiv.is("textarea")) {
        var wrapDiv = $(this[0]).closest("div.col");
        if (wrapDiv.length > 0) {
            mainDiv = $(this[0]).closest("div.col");
            className = "hide";
        }

        if (isVisible) {
            mainDiv.removeClass(className);
        } else {
            mainDiv.addClass(className);
        }

        var handleLabel = true;
        var prevLabel = mainDiv.prev();
        if ($(this[0]).is("input[type=checkbox]"))
            prevLabel = mainDiv.next();
        else if (!prevLabel.is(".col-txt"))
            handleLabel = false;

        if (handleLabel) {
            if (isVisible) {
                prevLabel.removeClass("hide");
            } else {
                prevLabel.addClass("hide");
            }
        }
    }
};

$.fn.enable = function (isEnable) {
    $(this.selector).each(function () {
        if ($(this).data("kendoDropDownList") != undefined) {
            $(this).data("kendoDropDownList").enable(isEnable);
            $(this).removeAttr("disabled");
        } else if ($(this).data("kendoComboBox") != undefined) {
            $(this).data("kendoComboBox").enable(isEnable);
            $(this).removeAttr("disabled");
            if (!isEnable)
                $(this).attr("readonly", "true");
            else {
                $(this).removeAttr("readonly");
            }
        } else if ($(this).data("kendoDatePicker") != undefined) {
            $(this).data("kendoDatePicker").enable(isEnable);
            $(this).removeAttr("disabled");
            if (!isEnable)
                $(this).attr("readonly", "true");
            else {
                $(this).removeAttr("readonly");
            }
        } else if ($(this).data("kendoDateTimePicker") != undefined) {
            $(this).data("kendoDateTimePicker").enable(isEnable);
            $(this).removeAttr("disabled");
            if (!isEnable)
                $(this).attr("readonly", "true");
            else {
                $(this).removeAttr("readonly");
            }
        } else if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
            if (!isEnable) {
                $(this).attr("onclick", "return false");
                $(this).attr("readonly", "readonly");
            } else {
                $(this).removeAttr("readonly");
                $(this).removeAttr("onclick");
            }
        } else if ($(this).attr("type") == "button" || $(this).attr("type") == "submit") {
            if (!isEnable) {
                $(this).attr("disabled", "disabled");
                $('#div_' + this.id).attr("disabled", "disabled");
            } else {
                $(this).removeAttr("disabled");
                $('#div_' + this.id).removeAttr("disabled");
            }
        } else if ($(this).get(0).tagName == "A") {
            if (!isEnable) {
                $(this).attr("disabled", "disabled");
                $(this).find("div").attr("disabled", "disabled");
                $(this).attr('tabindex', '-1')
            } else {
                $(this).find("div").removeAttr("disabled");
                $(this).removeAttr("disabled");
                $(this).removeAttr("tabindex");
            }
        } else {
            if (!isEnable)
                $(this).attr("readonly", "true");
            else {
                $(this).removeAttr("readonly");
            }
        }
        if (!isEnable)
            $(this).attr("tabindex", "-1");
        else {
            $(this).removeAttr("tabindex");
        }
    });
};


$.fn.visiblePanel = function (isVisible) {
    if (isVisible) {
        MojFind(this.selector).removeClass("hide");
        MojFind(this.selector).addClass("moj-form");
    }
    else {
        MojFind(this.selector).removeClass("moj-form");
        MojFind(this.selector).addClass("hide");
    }
};

$.fn.changeText = function (text) {
    var selector;
    if (this.length > 0)
        selector = this[0].id;
    else
        selector = this.selector.replace("#", "");
    var inputSelector = selector;
    if (selector.indexOf("_") > -1) {
        var a = selector.split("_");
        selector = a[a.length - 1];
    }
    MojFind("form").removeData("validator");
    Moj.HtmlHelpers._hideErrorMessage($("#div_" + selector));
    var strPrevText = MojFind("#div_label_" + selector).text();
    strPrevText = strPrevText.replace("*", "");
    var attrs = $(MojFind("#" + inputSelector)[0].attributes).filter(function (i, e) { return e.name.match("^data-val-") })
    attrs.each(function () {
        this.value = this.value.replace(strPrevText, text);
    });
    $.validator.unobtrusive.parse(document);

    MojFind("#div_label_" + selector).html(MojFind("#div_label_" + selector).html().replace(strPrevText, text));
};

$.fn.hasScrollBar = function () {
    return this.get(0).scrollHeight > this.height();
};

$.fn.mojWindowCenter = function () {
    var wrapper = this[0].wrapper,
        documentWindow = this[0].appendTo

    wrapper.css({
        left: documentWindow.scrollLeft() + Math.max(0, (documentWindow.width() - wrapper.width()) / 2),
        top: documentWindow.scrollTop() + Math.max(0, (documentWindow.height() - wrapper.height()) / 2) - 20
    });

    return this;
};


$.fn.addRequiredIndication = function () {
    var selector;
    if (this.length > 0)
        selector = this[0].id;
    else
        selector = this.selector.replace("#", "");
    var inputSelector = selector;
    if (selector.indexOf("_") > -1) {
        var a = selector.split("_");
        selector = a[a.length - 1];
    }

    var str = MojFind("#div_label_" + selector).text() + "<span class='star'>*</span>";
    MojFind("#div_label_" + selector).html(str);
};

$.fn.removeRequiredIndication = function () {
    var selector;
    if (this.length > 0)
        selector = this[0].id;
    else
        selector = this.selector.replace("#", "");
    var inputSelector = selector;
    if (selector.indexOf("_") > -1) {
        var a = selector.split("_");
        selector = a[a.length - 1];
    }

    var str = MojFind("#div_label_" + selector).text().replace("*", "");
    MojFind("#div_label_" + selector).html(str);
};


kendo.ui.Select.prototype.close = function () {
    if (typeof (this.element.attr("ismultidropdown")) == "undefined") {
        this.popup.close();
    } else {
        this.popup.element.find(".k-state-selected,.k-state-focused").removeClass("k-state-selected k-state-focused");
    }
};

kendo.ui.Groupable.prototype.options.messages = $.extend(kendo.ui.Groupable.prototype.options.messages,
    { empty: Resources.Messages.KendoGridGroupMessage }
);

var gridSelectedValue = undefined;

var parseAllDate = function (object) {
    for (var i in object) {
        if (typeof (object[i]) == "function") {
        } else if (typeof (object[i]) === 'object') {
            parseAllDate(object[i]);
        } else if (typeof object[i] === 'string' && object[i].indexOf("/Date(") != -1) {
            object[i] = Moj.HtmlHelpers._parseDate(object[i]);
        }
    }
};

function Grid_dataBound(e) {
    //parse dates in ds
    var data = e.sender.dataSource.data();
    parseAllDate(data);
    e.sender.element.find("thead").css("pointer-events", "auto");
    if (e.sender.element.hasClass("moj-scrollable-grid")) {
        Moj.HtmlHelpers._scrollableGridDataBound(e.sender);
    }
    if (gridSelectedValue != undefined) {
        //  MojFind("#" + this.element[0].id).find("tr")[gridSelectedIndex].className = MojFind("#" + this.element[0].id).find("tr")[gridSelectedIndex].className + " k-state-selected";
        gridSelectedValue = undefined;
    }
    var grid = MojFind("#" + e.sender.element[0].id).data("kendoGrid");
    if (grid != undefined) {

        grid.thead.find("th").each(function () {
            $(this).find("span").attr("aria-label", $(this).attr("aria-label"));
        });

        grid.tbody.find('>tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && dataItem.State != undefined) {
                if (dataItem.State == window.Enums.ObjectState.Deleted) {
                    $(this).find("td, div").addClass('moj-row-deleted');
                    $(this).find(".td-action.edit-row, .td-action.delete-row, td.action-row").attr("disabled", "disabled");
                    $(this).find(".td-action.edit-row a, .td-action.delete-row a, td.action-row a").attr("disabled", "disabled");
                }
            }
            if ($(this).is(".k-master-row")) {
                $(this).find('.k-hierarchy-cell a').click(function (e) {
                    var grid = $(e.currentTarget).closest("[data-role=grid]").data("kendoGrid");
                    grid.select($(e.currentTarget).closest("tr"));
                });
            }
        });
        var gridName = e.sender.element[0].id.split("-")[0];
        var searchDataField = MojFind("[id$='lblSearchData" + gridName + "']");
        if (searchDataField.length > 0) {
            var topSearch = MojFind("[id$='lblSearchData" + gridName + "']").closest("div").closest("div").attr("topGrid");
            if (grid.dataSource.data().length > 0 && topSearch == grid.dataSource.data().length) {
                searchDataField.text("(" + topSearch + " " + Resources.Strings.RecordsIdentified + " " + grid.dataSource.data()[0].FullSearch + ")");
                searchDataField.removeClass('hide');
            } else {
                searchDataField.addClass('hide');
            }
        }

        var checkAll = grid.thead.find("[name^='chbCheckAll']");
        if (checkAll.length > 0) {
            var name = checkAll[0].name.split("chbCheckAll")[1];
            var ifCheckAll = true;
            $(grid.dataSource.data()).each(function () {
                if (!this[name])
                    ifCheckAll = false;
            });
            if (ifCheckAll)
                checkAll[0].checked = true;
        }
        var table = grid.table;
        if (table.children("caption").length == 0)
            table.prepend("<caption class='offscreen'>" + table.attr("caption") + "</caption>");

        setTimeout(function () {
            Moj.HtmlHelpers._pagerTabindexSetZero();
        }, 0);

        if (isInternetExplorer()) {
            MojFind("input[type=radio]+.before, input[type=checkbox]+.before, input[type=radio]~.after, input[type=checkbox]~.after").remove();
            MojFind("input[type=radio], input[type=checkbox]").addClass("ie").after($("<div/>", { "class": "after" })).after($("<div/>", { "class": "before" }));
        }
    }
}

function ListView_databound() {
    setTimeout(function () {
        MojFind(".k-listview").removeAttr("role")
        for (var i = 0; i < MojFind(".k-pager-wrap").find(".k-link").length; i++) {
            MojFind(".k-pager-wrap").find(".k-link")[i].setAttribute("tabindex", "0");
        }
        for (var i = 0; i < MojFind(".k-pager-info.k-label").length; i++) {
            MojFind(".k-pager-info.k-label")[i].setAttribute("aria-label", " ");
            //MojFind(".k-pager-info.k-label")[i].setAttribute("tabindex", "0");
        }
    }, 0);
}

function dropDownSelect(e) {
    var data = this.dataItem(e.item.index());
    var isActive = data.IsActive;
    if (isActive != null && typeof (isActive) != "undefined" && !Moj.isTrue(isActive))
        e.preventDefault();
};

var Moj = {
    Constants: {},

    HtmlHelpers: {
        //Buttons
        _onSearchButtonClicked: function (selector, buttonId) {
            var validate = MojFind("[id*='Search'][id^='frm']").validate();
            var isValid = true;
            MojFind("[id*='Search'][id^='frm']").find("input").each(function () {
                if (validate.element($(this)) != undefined && MojFind("span[data-valmsg-for='" + $(this).attr("name") + "']").length > 0)
                    isValid = isValid & $(this).valid();
            });
            if (isValid) {
                var element = MojFind("[id^='" + selector + "']");
                var view = "";
                switch (element.attr("data-role")) {
                    case "listview":
                        {
                            view = element.data("kendoListView");
                            break;
                        }
                    case "grid":
                        {
                            view = element.data("kendoGrid");
                            break;
                        }
                }
                if (view.dataSource._total > 0)
                    view.dataSource.page(1);
                MojFind("[id*=Skip][type='hidden']").val(0);
                view.dataSource.read(Moj.getGridData());
            } else {
                Moj.HandleAccessibleErrorMessages(buttonId);
            }
        },

        _onSubmitButtonClicked: function (e, url, onSuccess) {
            if (MojFind('[id^=tr_][id$=_Details]').length > 0) {
                MojFind('[id^=tr_][id$=_Details]').each(function () {
                    var gridName = this.id.split("_")[1];
                    Moj.HtmlHelpers._closeGridInlineDetails(gridName);
                });
            }
            $(e).parents('form').attr('action', url);
            if (onSuccess != "")
                $(e).parents('form').attr('data-ajax-success', onSuccess);
            else
                $(e).parents('form').attr('data-ajax-success', $(e).parents('form').attr('dataAjaxSuccessDefault'));

            $(e).closest("form").valid();

            Moj.HandleAccessibleErrorMessages($(e).attr("id"));
        },

        _onCancelButtonClicked: function (e) {
            var myWindow = $(e).closest("[data-role='window']");
            if (myWindow.length > 0) {
                myWindow.removeAttr('active');
                myWindow.data("kendoWindow").close();
            } else {
                MojFind('#DetailsContent').empty();
                Moj.replaceDivs("#DetailsContent", "#ListContent");
            }
        },

        _checkCanSubmitForFloating: function (e) {
            var canSave = true;
            if ($(e).attr("CustomIsSaveCurrentTab") != "") {
                var result = eval($(e).attr("CustomIsSaveCurrentTab") + "()");
                if (typeof (result) == "boolean")
                    canSave = Moj.isTrue(result);
            }

            if (Moj.isTrue($(e).attr("IsSaveCurrentTab")) && Moj.isTrue(canSave)) {
                if (Moj.wizard.saveCurrentTab()) {
                    kendo.ui.progress($("body"), false);
                    MojFind(".ul-request-buttons li").removeClass("active");
                    MojFind(e).addClass("active");
                    var canSubmit = true;
                    var result = true;
                    if ($(e).attr("methodBeforeSubmit") != "" && typeof ($(e).attr("methodBeforeSubmit")) != "undefined" && $(e).attr("methodBeforeSubmit") != null) {
                        result = eval($(e).attr("methodBeforeSubmit")).call(e);
                        if (typeof (result) == "boolean")
                            canSubmit = Moj.isTrue(result);
                    }
                    return canSubmit;

                }
                kendo.ui.progress($("body"), false);
                event.preventDefault();
                return false;
            }
            return true;
        },

        _onButtonForFloatingPanelClicked: function (e) {
            if (Moj.HtmlHelpers._checkCanSubmitForFloating(e)) {
                handleRules($(e));
                MojFind('form').first().submit();
            }
        },

        _onScrollToTopButtonClicked: function () {
            $('html,body').animate({ scrollTop: 0 }, "slow");
        },

        _onScrollToBottomButtonClicked: function () {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        },

        _onEditorChange: function (e) {
            Moj.changeObjectsState(this);
        },

        //Grid
        _cancelInGrid: function (gridName, methodNameAfterCancel) {
            Moj.HtmlHelpers._backToListGrigForSubmit(gridName);
            if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                eval(methodNameAfterCancel + "();");
        },

        _showDetails: function (e) {
            if (e.currentTarget.hasAttribute("disabled") && $(e.currentTarget).attr("disabled") == "disabled") {
                return false;
            } else {
                var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
                grid.select($(e.currentTarget).closest("tr"));
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                var id = dataItem.id;
                var url = e.currentTarget.href;
                kendo.ui.progress(MojFind("#DetailsContent"), true);
                var x = MojFind('#DetailsContent').load(url + "/" + id, function () {
                    kendo.ui.progress(MojFind("#DetailsContent"), false);
                });
                Moj.replaceDivs('#ListContent', '#DetailsContent');
                return false;
            }
        },

        _editRowInGridInline: function (e, gridName, url, dataItem, currentTr) {
            //if exist other div-buttons 
            if (MojFind(".div-buttons").find("div[id^='div_btnSaveInGrid'],div[id^='div_btnCancelInGrid']").not("[class*=hide]").length == 0) {
                MojFind("[id^='" + gridName + "'] tr.hide").removeClass("hide");
            }
            //colapse details
            MojFind("[id^='" + gridName + "']").find(".k-hierarchy-cell .k-minus").not(".current-open").trigger("click");

            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(dataItem),
                success: function (data) {
                    //put off action from head row like sort
                    var grid = MojFind("[id^='" + gridName + "']");
                    grid.find("thead").css("pointer-events", "none");
                    var detailsDiv = MojFind('#tr_' + gridName + '_Details');
                    detailsDiv.remove();
                    currentTr.addClass("hide");
                    var wrapContent = "";
                    if (grid.hasClass("moj-scrollable-grid"))
                        wrapContent = ".k-grid-content";
                    var index = MojFind("[id^='" + gridName + "'] " + wrapContent + " >table >tbody >tr").index(currentTr);
                    MojFind("[id^='" + gridName + "'] " + wrapContent + " >table >tbody >tr:eq(" + index + ")").after(data);
                    detailsDiv = MojFind('#tr_' + gridName + '_Details');
                    Moj.enableValidation(detailsDiv.closest("form"));
                    if (currentTr.hasClass("k-alt")) {
                        detailsDiv.addClass("k-alt");
                    }
                    MojFind("[id^='" + gridName + "'] tbody tr").last().find('>td').first().addClass('right-sided');
                }
            });

        },

        _showGridDetails: function (e) {
            if ($(e.currentTarget).attr("disabled") != "disabled") {
                $(e.currentTarget).closest("[data-role=grid]").data("kendoGrid").select($(e.currentTarget).closest("tr"));
                var gridName = $(e.currentTarget).closest("[data-role=grid]").attr("id").split("-")[0];
                var editUrl = $(e.currentTarget).attr("href");
                if (MojFind('#tr_' + gridName + '_Details').length > 0) {
                    var isEditableGridInlineAttr = $(e.currentTarget).attr("isEditableGridInline");
                    if (isEditableGridInlineAttr == undefined || Moj.isFalse(isEditableGridInlineAttr)) {
                        Moj.showMessage(window.Resources.Messages.InlineNewEditSaveMessage);
                    }
                    else {
                        var saveButton = MojFind('#tr_' + gridName + '_Details').find("input.moj-save-button");
                        var saveUrl = saveButton.attr('url');
                        var methodNameBeforeSave = saveButton.attr('methodNameBeforeSave');
                        var methodNameAfterSave = saveButton.attr('methodNameAfterSave');
                        var methodSaveCustomData = saveButton.attr('methodCustomData');
                        var setAllModel = saveButton.attr('setallmodel');

                        Moj.HtmlHelpers._saveRowToGrid(gridName, 'tr_' + gridName + '_Details',
                            saveUrl, methodNameBeforeSave, methodNameAfterSave, true,
                            function () {
                                var uid = $(e.currentTarget).closest("tr").attr('data-uid');
                                var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
                                var currentTr = grid.table.find('[data-uid=' + uid + ']');
                                var dataItem = grid.dataItem(currentTr)

                                Moj.HtmlHelpers._editRowInGridInline(e, gridName, editUrl, dataItem, currentTr);
                            }, methodSaveCustomData, "", setAllModel);
                    }
                }

                else {
                    var uid = $(e.currentTarget).closest("tr").attr('data-uid');
                    var thisGrid = MojFind(e.currentTarget).closest("[data-role=grid]").data("kendoGrid");
                    var currentTr = thisGrid.table.find('[data-uid=' + uid + ']');
                    var dataItem = thisGrid.dataItem(currentTr);
                    var id = dataItem.id;
                    var customData, getCustomData = MojFind(e.currentTarget).attr("methodCustomData");
                    if (typeof (getCustomData) != "undefined" && getCustomData != null && getCustomData != "") {
                        customData = eval(getCustomData + "()");
                        $.extend(dataItem, customData);
                    };
                    var editDetailsType = Moj.HtmlHelpers._getEditDetailsType(e.currentTarget);
                    switch (editDetailsType) {
                        case "IsEditInDiv": {
                            MojFind('#div_' + gridName + '_Details').html("<center><img id='loading' alt='' class='margin-top10' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center>");
                            $.ajax({
                                type: "POST",
                                url: editUrl,
                                contentType: 'application/json',
                                data: JSON.stringify(dataItem),
                                success: function (data) {
                                    MojFind('#div_' + gridName + '_Details').html(data);
                                    var frm = MojFind('#div_' + gridName + '_Details').closest("form");
                                    Moj.enableValidation(frm);
                                    if (frm.length > 0) {
                                        var action = frm.attr("id").replace("frm", "");
                                        MojFind(MojFind("[id^='btn'][id*='" + action + "']")).parent("div").parent("div").addClass("hide");
                                    }
                                }
                            });
                            Moj.replaceDivs('#div_' + gridName, '#div_' + gridName + '_Details');
                            break;
                        }
                        case "IsEditRowInline": {
                            Moj.HtmlHelpers._editRowInGridInline(e, gridName, editUrl, dataItem, currentTr);
                            break;
                        }
                        case "IsEditRowInTemplate": {
                            Moj.HtmlHelpers._editRowInTemplate(e, gridName, editUrl, dataItem, currentTr);
                            break;
                        }
                    }
                }
            }
            return false;
        },
        _getEditDetailsType: function (el) {
            if ($(el).attr("IsEditRowInline") != undefined && Moj.isTrue($(el).attr("IsEditRowInline")))
                return "IsEditRowInline";
            if ($(el).attr("IsEditRowInTemplate") != undefined && Moj.isTrue($(el).attr("IsEditRowInTemplate")))
                return "IsEditRowInTemplate";
            return "IsEditInDiv";
        },
        _editRowInTemplate: function (e, gridName, editUrl, dataItem, currentTr) {
            var rowToExpand = $(e.currentTarget).closest("tbody tr").find(".k-hierarchy-cell .k-plus");
            if (rowToExpand.length > 0) {
                rowToExpand.trigger("click");
                rowToExpand.trigger("mousedown");
            }
        },
        _addItemToInlineGrid: function (url, gridName, methodCustomData) {
            var customData = "";
            if (typeof (methodCustomData) != "undefined" && methodCustomData != null && methodCustomData != "") {
                customData = eval(methodCustomData + "()");
            };
            $.ajax({
                url: url,
                data: customData,
                async: false,
                success: function (data) {
                    //put off action from head row like sort
                    MojFind("[id^='" + gridName + "']").find("thead").css("pointer-events", "none");
                    var detailsDiv = MojFind('#tr_' + gridName + '_Details');
                    MojFind("[id^='" + gridName + "'] tr.hide").removeClass("hide");
                    detailsDiv.remove();
                    var addClassAlt = (MojFind("[id^='" + gridName + "'] tbody tr").length > 0 && !MojFind("[id^='" + gridName + "'] tbody tr:last").hasClass("k-alt"));
                    MojFind("[id^='" + gridName + "'] >table >tbody, [id^='" + gridName + "'].moj-scrollable-grid >>table >tbody").append(data);
                    detailsDiv = MojFind('#tr_' + gridName + '_Details');
                    if (addClassAlt)
                        detailsDiv.addClass("k-alt");
                    Moj.enableValidation(detailsDiv.closest("form"));
                    Moj.setFocusToTheFirstElement(detailsDiv);
                    MojFind("[id^='" + gridName + "'] tbody tr").last().find('>td').first().addClass('right-sided');
                }
            });
        },

        _closeGridInlineDetails: function (gridName) {
            if (MojFind('#tr_' + gridName + '_Details').length > 0) {

                var saveButton = MojFind('#tr_' + gridName + '_Details').find("input.moj-save-button");
                if (saveButton.length > 0) {
                    var saveUrl = saveButton.attr('url');
                    var methodNameBeforeSave = saveButton.attr('methodNameBeforeSave');
                    var methodNameAfterSave = saveButton.attr('methodNameAfterSave');
                    var methodSaveCustomData = saveButton.attr('methodCustomData');

                    Moj.HtmlHelpers._saveRowToGrid(gridName, 'tr_' + gridName + '_Details',
                        saveUrl, methodNameBeforeSave, methodNameAfterSave, true, null, methodSaveCustomData);
                }
            }
        },

        _showGridAddDetails: function (gridName, url, isAddRowInline, IsEditableGridInline, methodCustomData, setAllModel) {
            if (isAddRowInline == "False" || isAddRowInline == undefined) {
                MojFind('#div_' + gridName + '_Details').html("<center><img id='loading' class='margin-top10' alt='' src='" + baseUrl + "/Content/kendo/BlueOpal/loading-image.gif' /></center>");
                var customData = "";
                if (typeof (methodCustomData) != "undefined" && methodCustomData != null && methodCustomData != "") {
                    customData = eval(methodCustomData + "()");
                };
                $.ajax({
                    type: "POST",
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(customData),
                    success: function (data) {
                        MojFind('#div_' + gridName + '_Details').html(data);
                        Moj.enableValidation(MojFind('#div_' + gridName + '_Details').closest("form"));
                        var frm = MojFind('#div_' + gridName + '_Details').closest("form");
                        if (frm.length > 0) {
                            var action = frm.attr("id").replace("frm", "");
                            MojFind(MojFind("[id^='btn'][id*='" + action + "']")).parent("div").parent("div").addClass("hide");
                        }
                    }
                });
                Moj.replaceDivs('#div_' + gridName, '#div_' + gridName + '_Details');
            } else {
                if (MojFind('#tr_' + gridName + '_Details').length > 0) {
                    if (IsEditableGridInline == undefined || Moj.isFalse(IsEditableGridInline)) {
                        Moj.showMessage(window.Resources.Messages.InlineNewEditSaveMessage);
                    }
                    else {

                        var saveButton = MojFind('#tr_' + gridName + '_Details').find("input.moj-save-button");
                        var saveUrl = saveButton.attr('url');
                        var methodNameBeforeSave = saveButton.attr('methodNameBeforeSave');
                        var methodNameAfterSave = saveButton.attr('methodNameAfterSave');
                        var methodSaveCustomData = saveButton.attr('methodCustomData');

                        Moj.HtmlHelpers._saveRowToGrid(gridName, 'tr_' + gridName + '_Details',
                            saveUrl, methodNameBeforeSave, methodNameAfterSave, true, function () {
                                Moj.HtmlHelpers._addItemToInlineGrid(url, gridName, methodCustomData);
                            }, methodSaveCustomData, "", setAllModel);
                    }
                }
                else {
                    Moj.HtmlHelpers._addItemToInlineGrid(url, gridName, methodCustomData);
                }
            }
        },

        _showAddDetails: function (url) {
            MojFind('#DetailsContent').html("<center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/BlueOpal/loading-image.gif' /></center>");
            MojFind('#DetailsContent').load(url, function () {
                Moj.setFocusToTheFirstElement(MojFind('#DetailsContent'));
            });
            Moj.replaceDivs('#ListContent', '#DetailsContent');
        },

        _deleteVirtualRowGrid: function (e) {
            if ($(e.currentTarget).attr("disabled") != "disabled") {
                var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
                var url = $(e.currentTarget).attr("href");
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                var methodAfterDelete = $(e.currentTarget).attr("data");
                if (dataItem.State != window.Enums.ObjectState.Deleted) {
                    if (url != "" && dataItem.State != window.Enums.ObjectState.Added && dataItem.State != window.Enums.ObjectState.AddedString) {
                        $.ajax({
                            type: "POST",
                            url: url,
                            contentType: 'application/json',
                            dataType: "json",
                            data: JSON.stringify(dataItem),
                            success: function (data) {
                                if (Moj.showErrorMessage(data.Errors) == true) {
                                    Moj.confirm(Resources.Strings.ConfirmDelete, function () {
                                        if (MojFind("form").find('#ObjectState') != undefined)
                                            MojFind("form").find('#ObjectState').val("true");
                                        if (dataItem.State == window.Enums.ObjectState.Added || dataItem.State == window.Enums.ObjectState.AddedString) {
                                            grid.dataSource.remove(dataItem);
                                            //fix kendo total not refresh
                                            grid.dataSource.total = function () { return grid.dataSource.data().length };
                                        }
                                        else
                                            dataItem.State = window.Enums.ObjectState.Deleted;
                                        grid.refresh();
                                        if (methodAfterDelete != undefined && methodAfterDelete != "")
                                            eval(methodAfterDelete + "(" + JSON.stringify(dataItem) + ");");
                                    });
                                }
                            }
                        });
                    } else {
                        Moj.confirm(Resources.Strings.ConfirmDelete, function () {
                            if (MojFind("form").find('#ObjectState') != undefined)
                                MojFind("form").find('#ObjectState').val("true");
                            if (dataItem.State == window.Enums.ObjectState.Added || dataItem.State == window.Enums.ObjectState.AddedString) {
                                grid.dataSource.remove(dataItem);
                                //fix kendo total not refresh
                                grid.dataSource.total = function () { return grid.dataSource.data().length };
                            }
                            else
                                dataItem.State = window.Enums.ObjectState.Deleted;
                            grid.refresh();
                            if (methodAfterDelete != undefined && methodAfterDelete != "")
                                eval(methodAfterDelete + "(" + JSON.stringify(dataItem) + ");");
                        });
                    }
                }
            }
            return false;
        },

        _deleteRowGrid: function (e) {
            var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
            var url = e.currentTarget.href + "/" + grid.dataItem($(e.currentTarget).closest("tr")).id;
            Moj.confirm(Resources.Strings.ConfirmDelete, function () {
                $.post(url, function (data) {
                    if (data.Errors == undefined) {
                        $("#" + e.delegateTarget.id).data("kendoGrid").dataSource.read(Moj.getGridData());
                    } else
                        Moj.showErrorMessage(data.Errors);
                });
            });
            return false;
        },

        _deleteRowGridByObject: function (e) {
            var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
            var url = e.currentTarget.href;
            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
            Moj.confirm(Resources.Strings.ConfirmDelete, function () {
                $.ajax({
                    type: "POST",
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(dataItem),
                    success: function (data) {
                        if (Moj.showErrorMessage(data.Errors) == true) {
                            $("#" + e.delegateTarget.id).data("kendoGrid").dataSource.read(Moj.getGridData());
                        }
                    }
                });
            });
            return false;
        },

        _deleteRow: function (url) {
            MojFind('#ListContent').load(url);
        },

        _saveRowToGrid: function (gridName, selector, url, methodNameBeforeSave, methodNameAfterSave, isEditableGridInline, onSaveSuccess, getCustomData, customValidation, setAllModel, async) {
            setAllModel = typeof (setAllModel) == "undefined" ? false : setAllModel;
            if (MojFind("#" + selector).find('[id^=tr_][id$=_Details]').length > 0) {
                MojFind("#" + selector).find('[id^=tr_][id$=_Details]').each(function () {
                    var gridName = this.id.split("_")[1];
                    Moj.HtmlHelpers._closeGridInlineDetails(gridName);
                });
            }

            var validate = MojFind("#" + selector).closest("form").validate();
            var isValid = true;
            MojFind("#" + selector + " :input[type!=hidden]").each(function () {
                if (validate.element($(this)) != undefined)
                    isValid = isValid & $(this).valid();
            });

            if (typeof (customValidation) != "undefined" && customValidation != null && customValidation != "") {
                isValid = isValid & customValidation();
            };
            var customData = {};
            if (typeof (getCustomData) != "undefined" && getCustomData != null && getCustomData != "") {
                customData = eval(getCustomData + "()");
            };
            if (isValid) {
                if (url != "") {
                    kendo.ui.progress($("body"), true);
                    Moj.callActionWithJson(selector + " :input", url, function (data) {
                        kendo.ui.progress($("body"), false);
                        if (Moj.showErrorMessage(data.Errors) == true) {
                            var canSave = true;
                            if (methodNameBeforeSave != undefined && methodNameBeforeSave != "") {
                                var result = eval(methodNameBeforeSave + "(data.Data)");
                                if (typeof (result) == "boolean")
                                    canSave = Moj.isTrue(result);
                            }
                            if (canSave) {
                                if (data.Model == undefined)
                                    data.Model = MojFind("#" + selector + " :input").serializeObjectForGrid();
                                Moj.HtmlHelpers._saveRowToGridFunc(gridName, data.Model, selector, isEditableGridInline, setAllModel);
                                if (methodNameAfterSave != undefined && methodNameAfterSave != "")
                                    eval(methodNameAfterSave + "(data.Data)");
                                if (onSaveSuccess != undefined && onSaveSuccess != "")
                                    onSaveSuccess();
                            }
                        }
                    }, customData, async);
                } else {
                    var canSave = true;
                    if (methodNameBeforeSave != undefined && methodNameBeforeSave != "") {
                        var result = eval(methodNameBeforeSave + "();");
                        if (typeof (result) == "boolean")
                            canSave = Moj.isTrue(result);
                    }
                    if (canSave) {
                        var model = MojFind("#" + selector + " :input").serializeObjectForGrid();
                        Moj.HtmlHelpers._saveRowToGridFunc(gridName,
                            model,
                            selector,
                            isEditableGridInline,
                            setAllModel);
                        if (methodNameAfterSave != undefined && methodNameAfterSave != "")
                            eval(methodNameAfterSave + "();");
                    }
                }
            } else {
                Moj.HandleAccessibleErrorMessages(MojFind("[id^='btnSaveInGrid']").attr("id"));
            }
        },


        _saveRowToGridFunc: function (gridName, model, selector, isEditableGridInline, setAllModel) {
            var selectedRow;
            var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
            if (isEditableGridInline != undefined && isEditableGridInline == true) {
                selectedRow = grid.table.find("tr.hide");//for editable gridinline 
            }
            else {
                selectedRow = grid.select();
                var detailsRow = MojFind("#" + selector).closest(".k-detail-row");
                if (detailsRow.length > 0) {
                    selectedRow = detailsRow.prev();
                }
                if ($(selectedRow).hasClass("tr-mode-inline-grid"))
                    selectedRow = selectedRow.prev();
            }
            if (model.State == window.Enums.ObjectState.Added || model.State == window.Enums.ObjectState.AddedString || (model.ID != undefined && model.ID != "0" && model.ID != "00000000-0000-0000-0000-000000000000")) {
                if (!setAllModel) {
                    var o = MojFind("#" + selector + " :input");
                    for (var i = 0; i < o.length; i++) {
                        var name = o[i].name;
                        if (name.indexOf(".") != -1) {
                            if (name.indexOf("[") != -1) {
                                name = name.substring(0, name.indexOf('['));
                            }
                            name = o[i].name.split(".")[1];
                        }
                        //Handle multi select dropDown in grid 4Submit.
                        if (name.indexOf("_DropDown") >= 0) {
                            name = name.replace("_DropDown", "");
                        }

                        grid.dataItem(selectedRow)[name] = model[name];
                    }

                    if (model.State != window.Enums.ObjectState.Added && model.State != window.Enums.ObjectState.AddedString)
                        grid.dataItem(selectedRow)["State"] = window.Enums.ObjectState.Modified;
                } else {
                    if (model.State != window.Enums.ObjectState.Added && model.State != window.Enums.ObjectState.AddedString)
                        model.State = window.Enums.ObjectState.Modified;
                    var items = grid.dataSource.data();
                    var index = -1;
                    $(items).filter(function (i, e) {
                        if (e.uid == selectedRow.attr("data-uid"))
                            index = i;
                        return e.uid == selectedRow.attr("data-uid");
                    });
                    if (index >= 0) {
                        items[index] = model;
                        grid.dataSource.data(items);
                    }
                }


            } else {
                model["State"] = window.Enums.ObjectState.Added;
                //fix kendo total not refresh
                grid.dataSource.total = function () { return grid.dataSource.data().length };
                grid.dataSource.add(model);
            }
            Moj.changeObjectStateToForm(true);
            grid.refresh();
            Moj.HtmlHelpers._backToListGrigForSubmit(gridName);
        },

        _getIndexOfRowByGrid: function (grid, dataItem) {
            var data = $("[id^='" + grid + "']").data("kendoGrid").dataSource.data();
            return data.indexOf(dataItem);
        },

        _getValueFromDataSourceByPropertyName: function (datasource, propertyName, dataItem) {
            var value = "";
            for (var i = 0; i < datasource.length; i++) {
                if (datasource[i].Key == dataItem[propertyName])
                    value = datasource[i].Value;
            }
            return value;
        },

        _getValuesFromDataSourceByPropertyName: function (datasource, propertyName, dataItem) {
            var value = "";
            if (dataItem[propertyName] != null) {
                for (var j = 0; j < dataItem[propertyName].length; j++) {
                    for (var i = 0; i < datasource.length; i++) {
                        if (datasource[i].Key == dataItem[propertyName][j]) {
                            value += datasource[i].Value + ", ";
                            break;
                        }
                    }
                }
            }
            return value.substring(0, value.lastIndexOf(','));
        },

        _onCheckboxInGridClicked: function (e, columnName, isRefreshOnCheck) {
            var grid = $(e).closest("[data-role='grid']").data("kendoGrid");
            var tr = $(e).closest("tr");
            var isChecked = $(e).attr("checked") != undefined;
            grid.dataItem(tr)[columnName] = isChecked;
            if (grid.dataItem(tr).State != window.Enums.ObjectState.Deleted) {
                if (grid.dataItem(tr).State != window.Enums.ObjectState.Added && grid.dataItem(tr).State != window.Enums.ObjectState.AddedString)
                    grid.dataItem(tr).State = window.Enums.ObjectState.Modified;
            }
            Moj.changeObjectStateToForm(true);
            if (isRefreshOnCheck) {
                grid.refresh();
            }
        },

        _onGridRequestEnd: function (e) {
            if (typeof (e.sender) != "undefined") {
                var data = e.sender.data();
                parseAllDate(data);
            }
        },

        _parseDate: function (value, format) {
            if (format == undefined || format == "")
                format = "dd/MM/yyyy"
            var date = kendo.parseDate(value, format);
            if (date == null)
                return "";
            else
                return kendo.toString(date, format);
        },

        _parseNumber: function (value, format) {
            if (format == undefined || format == "")
                format = "#,#"
            return kendo.toString(value, format);
        },

        toString: function (prop, format) {
            if (typeof (format) != "undefined" && format != "" && $.isNumeric(prop))
                return kendo.toString(parseFloat(prop), format);
            return prop;
        },

        parseDecimal: function (str) {
            var num = 0;
            var afterPoint = false;
            var numAfterPoint = 0;
            for (var i = 0; i < str.length; i++) {
                if (str[i] != ".") {
                    num = num * 10 + parseInt(str[i]);
                }
                else {
                    afterPoint = true;
                    numAfterPoint = str.length - i - 1;
                }
            }
            return num / Math.pow(10, numAfterPoint);
        },

        formatDecimalSeperator: function (str) {
            var newStr = str.toString();
            var index = newStr.indexOf(".");
            for (var i = index - 3; i > 0; i -= 3) {
                newStr = newStr.mojSplice(i, 0, ",");
            }
            return newStr;
        },

        _htmlEscape: function (str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace('null', '');
        },

        _scrollableGridDataBound: function (e) {
            var fixedScrollableGrid = e.element.attr("fix_scroll_height");
            var rowHeight = e.tbody.find("tr").eq(0).outerHeight();
            if (rowHeight == 0) rowHeight = 30;
            var height = parseInt(rowHeight) * 5;
            var maxHeight = e.element.attr("max_height");
            var maxRecordNumber = e.element.attr("max_record_number");

            if (!Moj.isEmpty(maxHeight))
                height = parseInt(maxHeight);
            if (!Moj.isEmpty(maxRecordNumber))
                height = parseInt(maxRecordNumber) * parseInt(rowHeight);
            if (!Moj.isTrue(fixedScrollableGrid)) {
                e.content.css("max-height", height + "px");
                e.content.css("height", "100%");
            } else {
                e.content.css("height", height + "px");
            }

            if (e.content.hasScrollBar()) {
                e.element.find(".k-grid-header").addClass("k-grid-header-scroll");
            } else {
                e.element.find(".k-grid-header").removeClass("k-grid-header-scroll");
            }

            function setValidationPosition(contentEl) {
                var innerHeight = $(contentEl).innerHeight();
                var innerWidth = $(contentEl).innerWidth();
                $(contentEl).find(".field-validation-error,.field-validation-valid").each(function () {
                    var elename = $(this).attr("data-valmsg-for");
                    var ele = MojFind("[name='" + elename + "']");
                    if (ele.parent().hasClass("k-widget"))
                        ele = ele.parent();
                    var bottom = $(ele).position().bottom;
                    var eleLeft = $(ele).position().left;
                    var eleWidth = $(ele).outerWidth();
                    var right = innerWidth - eleLeft - eleWidth;
                    $(this).css("left", eleLeft);
                    $(this).css("bottom", bottom - 16);

                    if (bottom < 0 || bottom - innerHeight > 20) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            }
            $(e.content).bind('scroll', function () {
                setValidationPosition($(this));
            });

            setValidationPosition($(e.content));
        },

        _serverGridDataBound: function (gridName) {
            setTimeout(function () {
                var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
                if (Moj.isFalse(grid.element.attr("has_header")))
                    grid.element.find(".k-toolbar.k-grid-toolbar.k-grid-top").hide();
                if (grid.element.hasClass("moj-scrollable-grid")) {
                    Moj.HtmlHelpers._scrollableGridDataBound(grid);
                }
                var table = grid.table;
                if (table.children("caption").length == 0)
                    table.prepend("<caption class='offscreen'>" + table.attr("caption") + "</caption>");
            }, 0);
        },

        _onGridDetailActionInit: function (e) {
            var url = e.sender.element.attr("detailsurl");
            $.ajax({
                contentType: 'application/json',
                url: url,
                data: JSON.stringify(e.data),
                type: "post",
                success: function (res) {
                    e.detailRow.find(".k-detail-cell").html(res);
                }
            });
        },

        _onGridDetailActionExpand: function (e) {
            e.masterRow.find(".k-hierarchy-cell .k-minus").addClass("current-open");
            e.sender.table.find(".k-hierarchy-cell .k-minus").not(".current-open").trigger("click");
            if (Moj.isTrue(e.masterRow.find(".td-action.edit-row a").attr("isDisabledRowsInEditTemplate")))
                e.sender.table.find(".k-hierarchy-cell .k-plus").attr("disabled", "disabled");
            e.masterRow.find(".k-hierarchy-cell .k-minus").removeClass("current-open");
        },

        _onGridDetailActionCollapse: function (e) {
            e.detailRow.remove();
            if (Moj.isTrue(e.masterRow.find(".td-action.edit-row a").attr("isDisabledRowsInEditTemplate")))
                e.sender.table.find(".k-hierarchy-cell .k-plus").removeAttr("disabled");
        },

        _filter: function (selector) {
            var self = this;
            self.selector = selector;
            self.events = function () {
                $(selector).find("#FilterText").keyup(function () {
                    self.filter($(this).attr("filter-by"), $(this).val());
                });
            };
            self.clear = function (filterByName) {
                $(selector).find("[filter-name='" + filterByName + "']").parents("tr").show();
            };
            self.filter = function (filterByName, value) {
                if (value == "")
                    self.clear(filterByName);
                else {
                    $(selector).find("[filter-name='" + filterByName + "']").parents("tr").hide();
                    $(selector).find("[filter-name='" + filterByName + "']").each(function () {
                        if (MojFind(this).text().toUpperCase().indexOf(value.toUpperCase()) >= 0) {
                            MojFind(this).parents("tr").show();
                        }
                    });
                }
            };
        },

        _filterBy: function (selector) {
            var self = this;
            self.selector = selector;
            self.curentText = "";
            self.filterByDataList = [];
            self.filter = new Moj.HtmlHelpers._filter(selector);
            self.init = function () {
                self.filterByDataList = self.getFilterByDataList();
                self.initByLength();
            };
            self.events = function () {
                self.filter.events();
                $(selector).find("[id^='FilterByMultiple']").change(function () {
                    self.set($(this).val(), $(this).data("kendoDropDownList").text());
                });
                $(selector).find("#FilterText").blur(function () {
                    if ($(this).val() == "")
                        $(this).val(self.curentText);
                });
                $(selector).find("#FilterText").click(function () {
                    if ($(this).val().indexOf(self.curentText) != -1)
                        $(this).val("");
                });
            };
            self.set = function (value, text) {
                $(selector).find("#FilterText").attr("filter-by", value);
                self.curentText = Resources.Messages.FilterByText.replace("{filter-by}", text);
                $(selector).find("#FilterText").val(self.curentText);
                self.filter.clear($(selector).find("#FilterText").attr("filter-by"));
            };
            self.setDefaultSearch = function () {
                self.set(self.filterByDataList[0].Key, self.filterByDataList[0].Value);
            };
            self.getFilterByDataList = function () {
                var list = [];
                $(selector).find(".k-grid-header .k-header").each(function () {
                    if (!Moj.isEmpty($(this).attr("grid-list-view-filterable")))
                        list.push({ Key: $(this).attr("data-field"), Value: $(this).attr("data-title") });
                });
                return list;
            };
            self.hideFilter = function () {
                $(selector).find(".k-toolbar.k-grid-toolbar.k-grid-top #GridListViewFilterContainer").hide();
            };
            self.showOne = function () {
                $(selector).find("[id^='FilterByMultiple']").closest(".k-dropdown").hide();
                $(selector).find("#div_label_FilterByMultiple").hide();
                self.setDefaultSearch();
            };
            self.showMultiple = function () {
                $(selector).find("[id^='FilterByMultiple']").data("kendoDropDownList").setDataSource(self.filterByDataList);
                $(selector).find("[id^='FilterByMultiple']").data("kendoDropDownList").value(self.filterByDataList[0].Key);
                self.setDefaultSearch();
            };
            self.initByLength = function () {
                switch (self.filterByDataList.length) {
                    case 0:
                        {
                            self.hideFilter();
                            break;
                        }
                    case 1:
                        {
                            self.showOne();
                            break;
                        }
                    default:
                        {
                            self.showMultiple();
                            break;
                        }
                }
            };
        },

        _gridListViewFilter: function (selector) {
            var self = this;
            self.filterBy = new Moj.HtmlHelpers._filterBy(selector);
            self.init = function () {
                self.filterBy.init();
                self.events();
            };
            self.events = function () {
                self.filterBy.events();
            };
        },

        _bindGridListViewToolbar: function (gridName) {
            var listFilter = new Moj.HtmlHelpers._gridListViewFilter(MojFind("[id^='" + gridName + "']"));
            listFilter.init();
        },

        _onSubGridInit: function (e) {
            var subListName = e.sender.table.attr("sublistname");
            var setData = function () {
                grid = gridElement.data("kendoGrid");
                if (typeof (grid) != "undefined") {
                    var list = e.data[subListName];
                    if (typeof (list) == "unedfined" || list == null)
                        list = [];
                    grid.dataSource.data(list);
                }
            };
            var gridElement = $("#SubGrid" + e.data.uid);
            var grid = gridElement.data("kendoGrid");
            if (typeof (grid) != "undefined")
                setData();
            else
                setTimeout(setData, 0);

        },

        _exportGrid: function (gridId, buttonName) {
            var dataToStr = MojFind("[id^='" + gridId + "']").data("kendoGrid").dataSource.data();
            for (var i = 0; i < dataToStr.length; i++) {
                for (var prop in dataToStr[i]) {
                    if (dataToStr[i][prop] instanceof Date && dataToStr[i][prop] != undefined) {
                        //converting Js Date Object To string in format : "DD/MM/YYYY HH:MM:SS"
                        var dd = dataToStr[i][prop].getDate();
                        var mm = (dataToStr[i][prop].getMonth() + 1); //January is 0!
                        var yyyy = dataToStr[i][prop].getFullYear();
                        var fullTimeStr = dataToStr[i][prop].toTimeString();
                        var timeStr = fullTimeStr.split(' ')[0];
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        var dateTimeStr = dd + '/' + mm + '/' + yyyy + ' ' + timeStr;
                        dataToStr[i][prop] = dateTimeStr;
                    }
                }
            }
            var objectType = MojFind(buttonName).attr('objectType');
            var modelParam = $.parseJSON(JSON.stringify(dataToStr));
            $.fileDownload(baseUrl + '/Home/Export',
                {
                    httpMethod: "POST",
                    data: {
                        model: modelParam,
                        typeObject: objectType
                    }
                });
        },

        //RadioButton
        _onRadioButtonInGridClicked: function (e, gridName, columnName) {
            var grid = $(e).closest("[data-role='grid']").data("kendoGrid");
            var tr = $(e).closest("tr");
            if (grid.dataItem(tr).State != window.Enums.ObjectState.Deleted) {
                MojFind("[id^='" + gridName + "']").find("[id='rdb" + columnName + "']").removeAttr("checked");
                for (var i = 0; i < grid.tbody.find("tr").length; i++) {
                    if (grid.dataItem(grid.tbody.find("tr").eq(i))[columnName] == true) {
                        grid.dataItem(grid.tbody.find("tr").eq(i))[columnName] = false;
                        if (grid.dataItem(grid.tbody.find("tr").eq(i)).State != window.Enums.ObjectState.Added && grid.dataItem(grid.tbody.find("tr").eq(i)).State != window.Enums.ObjectState.AddedString)
                            grid.dataItem(grid.tbody.find("tr").eq(i)).State = window.Enums.ObjectState.Modified;
                    }

                }
                grid.dataItem(tr)[columnName] = true;
                if (grid.dataItem(tr).State != window.Enums.ObjectState.Added && grid.dataItem(tr).State != window.Enums.ObjectState.AddedString)
                    grid.dataItem(tr).State = window.Enums.ObjectState.Modified;
                grid.refresh();
                tr.find("[id='rdb" + columnName + "']").attr("checked", true);
            }
            Moj.changeObjectStateToForm(true);
        },

        _onRadioButtonInListGridClicked: function (e, gridName, columnName) {
            var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
            MojFind("[id^='" + gridName + "']").find("[id='rdb" + columnName + "']").removeAttr("checked");
            $(e).attr("checked", true);
            Moj.changeObjectStateToForm(true);
        },

        //MultiDropDown

        _onMultiDropDownDataBound: function (e) {
            var selectedTextItems = '';
            var selectedItems = e.sender.dataSource.data()
                .filter(function (item, i) { return e.sender.value().indexOf(item.Key) >= 0 });
            $(selectedItems).each(function (i, item) { selectedTextItems += item.Value + ', '; });
            e.sender.input.attr('title', selectedTextItems.substring(0, selectedTextItems.length - 2));
            e.sender.element.closest('div').attr('title', selectedTextItems.substring(0, selectedTextItems.length - 2));
        },

        _onMultiDropDownChanged: function (e) {
            (e.sender.element).empty();
            $(e.sender._old).each(function (i, el) {
                e.sender.element.append($("<option/>", {
                    "value": el,
                    "selected": "selected"
                }));
            });

            //for accessibiliy

            // get all text of selected items
            var selectedTextItems = "";
            $(e.sender.dataItems()).each(function (i, item) {
                selectedTextItems += item.Value + ", ";
            });

            //add selected items text to title
            e.sender.input.attr("title", selectedTextItems.substring(0, selectedTextItems.length - 2));

            Moj.changeObjectStateToControl(true, e.sender.element);
        },

        _onMultiDropDownItemClicked: function (checkBox, dropDownName, containerDivName) {
            $(checkBox).attr("isClick", true);
            var containerElement = containerDivName != undefined && containerDivName != ""
                ? $(MojFind("#" + containerDivName)[0])
                : $(MojFind("[name='" + dropDownName + "_DropDown']").parents("form")[0]);
            // remove div with hidden inputs
            if (containerElement.find("[id='div" + dropDownName + "']").length > 0) {
                containerElement.find("[id='div" + dropDownName + "']").remove();
            }
            // append new div
            containerElement.append("<div id='div" + dropDownName + "'></div>");
            var ulElement = $(checkBox).closest("ul");
            if (ulElement.length == 0)
                ulElement = $(checkBox).parent().siblings('ul');
            //support "all" option
            if ($(checkBox).attr("value") == '') {
                if ($(checkBox).attr("checked") != undefined) {
                    $(ulElement).find("[id^='chb" + dropDownName + "']").each(function () {
                        $(this).attr("checked", "checked");
                    });
                } else {
                    $(ulElement).find("[id^='chb" + dropDownName + "']").each(function () {
                        $(this).removeAttr("checked");
                    });
                }
            } else {
                $(ulElement).siblings(".k-list-optionlabel").find("[id^='chb" + dropDownName + "'][value='']").removeAttr("checked");
            }
            //add hidden input
            $(ulElement).find("[id^='chb" + dropDownName + "'][value!='']:checked").each(function (index) {
                containerElement.find("[id='div" + dropDownName + "']").append("<input type='hidden' name='" + dropDownName + "[" + index + "]' value='" + $(this).attr("value") + "' />");
            });

            Moj._callMultiChangedEvent(dropDownName, checkBox);
            Moj.changeObjectStateToForm(true);
        },

        _onMultiDropDownItemSelected: function (e) {
            $(e.sender.element).data("kendoDropDownList").text($(e.sender.element).attr("selectedText"));
            // add tooltip
            $(e.sender.element).closest("span").attr("title", $(e.sender.element).attr("selectedText"));
            var checkBox = e.item.find("[type= 'checkbox']");
            var dropDownName = $(e.sender.element).attr("name").split("_")[0];
            //if not called from check box click
            if (checkBox.attr("isClick") == "false") {
                if (checkBox.attr("checked") != "checked") {
                    checkBox.attr("checked", "checked");
                } else {
                    checkBox.removeAttr("checked");
                }
                var containerDivName = MojFind("[id='" + dropDownName.replace(".", "_") + "_DropDown']").attr("containerDivName");
                Moj.HtmlHelpers._onMultiDropDownItemClicked(checkBox, dropDownName, containerDivName);
            } else {
                Moj._callMultiChangedEvent(dropDownName, checkBox);
            }
            checkBox.attr("isClick", false);
            Moj.changeObjectStateToControl(true, $(this.element));
        },

        _onMultiDropDownClosed: function (e) {
            if (this.current() != undefined) {
                //save selected text
                var dropDownName = $(this.element).attr("name").split("_")[0];
                var isAllItemsChekced = false;
                var checkBox = this.current().find("[type= 'checkbox']");
                var ulElement = this.current().closest("ul");
                if (ulElement.length == 0)
                    ulElement = this.current().siblings('ul');
                var isAllCheckboxChecked = (checkBox.attr("value") == "" && checkBox.attr("checked") != undefined);

                if (!Moj.isFalse($(this.element).attr("isDisplayAll")) && isAllCheckboxChecked == false) {
                    var dataLength = this.current().closest("ul").find("li input[value!='']").length;
                    var checkedLength = this.current().closest("ul").find("li input:checked").length;
                    isAllItemsChekced = dataLength == checkedLength && checkedLength != 0;
                    if (isAllItemsChekced == true) {
                        this.current().closest("ul").siblings(".k-list-optionlabel").find("input[value='']").attr("checked", "checked");
                    }
                }
                Moj.HtmlHelpers._setMultiDropDownText(dropDownName, $(ulElement), isAllCheckboxChecked || isAllItemsChekced);
                checkBox.closest("li").removeClass("k-state-selected k-state-focused");
                e.sender.element.valid();
            }
        },

        _checkDropDownItems: function (dropDownName, listValue) {
            var dropDownId = dropDownName.replace(/\./g, '_');
            var isCheckedAll = MojFind("[id='" + dropDownId + "_DropDown']").attr("checkedAll");
            var dropDownElement = MojFind("[id='" + dropDownId + "_DropDown']").data("kendoDropDownList");
            var dataSourceLength = dropDownElement.dataSource.total();

            if (isCheckedAll != true && listValue.length == dataSourceLength) {
                isCheckedAll = true;
            }

            if (isCheckedAll == true) {
                dropDownElement.ul.find("[id^='chb" + dropDownName + "']").attr("checked", "checked");
            }
            for (var i = 0; listValue.length != dataSourceLength && i < listValue.length; i++) {
                //select checked item
                dropDownElement.ul.find("[id='chb" + dropDownName + listValue[i] + "']").attr("checked", "checked");
            }

            //set selected text drop down
            Moj.HtmlHelpers._setMultiDropDownText(dropDownName, dropDownElement.ul, isCheckedAll);

        },

        _setMultiDropDownText: function (dropDownName, ulElement, isCheckAll) {
            var selectedText = isCheckAll == true ? ulElement.siblings(".k-list-optionlabel").find("input[value='']").attr("data-text") :
                ulElement.find("[id^='chb" + dropDownName + "'][value!='']:checked").map(function () { return $(this).attr("data-text"); }).get().join(", ");

            MojFind("[name='" + dropDownName + "_DropDown']").attr("selectedText", selectedText);
            MojFind("[name='" + dropDownName + "_DropDown']").closest("span").find(".k-input").text(selectedText)
            // add tooltip
            MojFind("[name='" + dropDownName + "_DropDown']").closest("span").attr("title", selectedText);
        },

        //Captcha
        _onCaptchaRefresh: function (selector) {//get a new captcha

            Moj.safeGet("/Home/RefreshCaptcha", undefined, function (data) {
                MojFind("#" + selector).val("");
                MojFind("#Captcha_" + selector).attr("src", "data:image/bmp;base64," + data.Img + "");
            });
        },

        _showCaptchaWindowIfNeeded: function (xhr) {
            if (typeof (xhr.responseText) != "undefined" && xhr.responseText.indexOf("CaptchaScript") > -1 && $(Moj.Constants["selectedTabContent"]).attr("id") != 'frmCaptcha') {
                Moj.website.openPopupWindow('frmCaptcha', '', '', 390, 260, true, true, false, baseUrl + '/Home/Captcha', '');
            }
        },

        openWindowByPost: function (url, params, httpMethod, target) {

            var tempForm = document.createElement("form");
            $(tempForm).attr({
                method: httpMethod || 'post',
                action: url,
                target: target || '_blank'
            });

            if (params) {
                $.each(params, function (key, value) {
                    var input = document.createElement("input");
                    $(input).attr({
                        type: 'hidden',
                        name: key,
                        value: value
                    });
                    tempForm.appendChild(input);
                });
            }

            document.body.appendChild(tempForm);
            tempForm.submit();
            document.body.removeChild(tempForm);
        },

        //Watch
        _watchTimerHandle: null,

        _ActivateWatch: function () {
            var watchLabel = $("div[dataType=watch]").first();
            if (watchLabel.length != 0) {
                var watchDate = new Date(Date.parse(watchLabel.attr("serverwatch")));
                var hours = watchDate.getHours() < 10 ? "0" + watchDate.getHours() : watchDate.getHours();
                var minute = watchDate.getMinutes() < 10 ? "0" + watchDate.getMinutes() : watchDate.getMinutes();
                var seconds = watchDate.getSeconds() < 10 ? "0" + watchDate.getSeconds() : watchDate.getSeconds();
                var displayDate = hours + ":" + minute + ":" + seconds;
                var day = watchDate.getUTCDate() < 10 ? "0" + watchDate.getUTCDate() : watchDate.getUTCDate();
                var month = (watchDate.getUTCMonth() + 1) < 10 ? "0" + (watchDate.getUTCMonth() + 1) : (watchDate.getUTCMonth() + 1);
                displayDate = displayDate + " - " + day + "/" + month + "/" + watchDate.getUTCFullYear();
                watchLabel.find("span").text(displayDate);
                watchDate.setSeconds(watchDate.getSeconds() + 1);
                watchLabel.attr("serverwatch", watchDate.toString());
                Moj.HtmlHelpers._ActivateWatchTimer();
            }
        },

        _ActivateWatchTimer: function () {
            Moj.HtmlHelpers._watchTimerHandle = setTimeout('Moj.HtmlHelpers._ActivateWatch()', 1000);
        },

        //Grid
        _addPagerHeader: function () {
            $('.k-grid-pager').each(function () {
                if ($(this)[0].firstChild.tagName != 'H5')
                    $(this).prepend("<h5 role='pager' class='offscreen'>" + Resources.Strings.Browsing + "</h5>");

            });
        },

        //listView
        _addPagerHeaderForListView: function () {
            $('[id ^=listView][id $=_pager]').each(function () {
                if ($(this).firstChild) {
                    if ($(this)[0].firstChild.tagName != 'H5')
                        $(this).prepend("<h5 role='pager' class='offscreen'>" + Resources.Strings.Browsing + "</h5>");
                }
                else {
                    $(this).prepend("<h5 role='pager' class='offscreen'>" + Resources.Strings.Browsing + "</h5>");
                }
            });
        },

        _pagerTabindexSetZero: function () {
            //add tabindex to grid controls and to the pager
            for (var i = 0; i < MojFind(".k-widget.k-grid").find("a.k-link").length; i++) {
                var el = $(MojFind(".k-widget.k-grid").find("a.k-link")[i]);
                el.attr("tabindex", "0");
                if (el.closest(".k-header").length > 0 && el.html() != "&nbsp;") {
                    textEl = el.html();
                    var tooltipText = textEl.indexOf("<span") >= 0 ? textEl.substr(0, textEl.indexOf("<span")) : textEl;
                    el.attr("title", tooltipText);
                }
            }
            for (var i = 0; i < MojFind(".k-pager-info.k-label").length; i++) {
                var text = MojFind(".k-pager-info.k-label")[i].innerText;
                MojFind(".k-pager-info.k-label")[i].setAttribute("aria-label", text);
            }
        },

        //FlowArray
        _startFlow: function () {

            MojFind("#FlowArrayContainer > div > #FContent").find("input[type!=hidden][readonly='readonly'],textarea[readonly='readonly']").each(function () {
                $(this).attr("wasReadonly", "True");
            });
            Moj.HtmlHelpers._isValidFlowArray();
            MojFind("#FlowArrayContainer > div > #FContent").find("input[type!=hidden],textarea").each(function () { $(this).live('change', function () { Moj.HtmlHelpers._isValidFlowArray(); }) });
        },

        _isValidFlowArray: function () {
            var Flows = MojFind("#FlowArrayContainer > div ");
            var FlowArrayContainer = MojFind("#FlowArrayContainer > div > #FContent");
            FlowArrayContainer.each(function (i, div) {
                var isValid = 1;
                $(div).find("input[type!=hidden],textarea").each(function (i, input) {
                    isValid = isValid & $(input).valid();
                    if (isValid == 0)
                        return false;
                });
                Moj.HtmlHelpers._hideErrorMessage(div);
                if (isValid == 0) {
                    for (var j = i + 1; j < Flows.length; j++) {
                        $(Flows[j]).addClass("disabled");
                        $(Flows[j]).find("input[type='button']").attr("readonly", "readonly");
                        Moj.HtmlHelpers._disableDiv(Flows[j], false);
                        $(Flows[j]).find(".single-fu").each(function () {
                            var fuID = this.id.replace(/_fu$/, "");
                            fu.enableFileUpload(fuID, "false");
                        });
                    }
                    return false;
                }
                else {
                    if (i + 1 < Flows.length) {
                        $(Flows[i + 1]).removeClass("disabled");
                        $(Flows[i + 1]).find("input[type='button']").removeAttr("readonly");
                        Moj.HtmlHelpers._disableDiv(Flows[i + 1], true);
                        $(Flows[i + 1]).find(".single-fu").each(function () {
                            var fuID = this.id.replace(/_fu$/, "");
                            fu.enableFileUpload(fuID, "true");
                        });
                    }
                }
            });
        },

        //Editor
        _InitEditor: function () {
            kendo.ui.Editor.defaultTools["insertLineBreak"].options.shift = false;
        },

        _setDirection: function (e) {
            e.srcElement.parentElement.classList.add("k-state-selected");
            if (e.srcElement.classList.contains("k-ltr")) {
                $("a:has(.k-ltr)").addClass("moj-disabled");
                $("a:has(.k-rtl)").removeClass("k-state-selected").removeClass("moj-disabled");
            }
            else {
                $("a:has(.k-rtl)").addClass("moj-disabled");
                $("a:has(.k-ltr)").removeClass("k-state-selected").removeClass("moj-disabled");
            }
            var editor = $(".k-editor textarea").data("kendoEditor");
            var prefixstart = "<div style=\"";
            var prefixmid = "direction:rtl;";
            var prefixend = "\">";
            var suffix = "</div>";

            var html = editor.value();

            if (html.startsWith(prefixstart + prefixmid)) {
                html = html.slice((prefixstart + prefixmid).length);
                var tagend = html.indexOf(">");
                if (tagend == 1)
                    html = html.slice(2).slice(0, -suffix.length);
                else
                    html = prefixstart + html;
            } else {
                html = prefixstart + prefixmid + prefixend + html + suffix;
            }
            editor.value(html);
        },

        //Others
        _handleErrorMessage: function (xhr) {
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
                if (xhrHtmlTags != null && xhrHtmlTags != undefined && xhrHtmlTags != "undefined") {
                    var ErrorHandlerScript = xhrHtmlTags.find('#ErrorHandlerScript');
                    if (ErrorHandlerScript != null && ErrorHandlerScript != undefined && ErrorHandlerScript != "undefined" && ErrorHandlerScript.length != 0)
                        message = ErrorHandlerScript.text().replace(/'/g, '');
                    else {
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
        },

        _handleValidationErrorMessage: function (xhr) {
            if (typeof (xhr.responseText) != "undefined" && xhr.responseText.indexOf("Errors\":") > 0 && Moj.isJSON(xhr.responseText)) {
                var errorObject = JSON.parse(xhr.responseText);
                if (errorObject != undefined)
                    Moj.showErrorMessage(errorObject.Errors);
            }
        },

        _onCheckBoxSelectColumnChanged: function (e) {
            var element = $(e);
            var name = element.attr("name");
            var grid = element.closest("[data-role='grid']").data("kendoGrid");
            var dataItem = grid.dataItem(element.closest("tr"));
            dataItem[name] = e.checked ? true : false;
            if (!e.checked) {
                var checkAll = $(e).closest("table").find("[name='chbCheckAll" + e.name + "']");
                if (checkAll.length > 0)
                    checkAll[0].checked = false;
            }
        },

        _getHtmlNewLinesString: function (text) {
            var regexp = new RegExp('\n', 'g');
            return text.replace(regexp, '<br>');
        },

        _backToListGrigForSubmit: function (gridName) {
            MojFind("[id^='" + gridName + "'] thead").css("pointer-events", "auto");
            MojFind("#div_" + gridName + "_Details").empty();
            Moj.replaceDivs("#div_" + gridName + "_Details", "#div_" + gridName);
            //For inline grid
            MojFind("#tr_" + gridName + "_Details").remove();
            MojFind("[id^='" + gridName + "'] tr.hide").removeClass("hide");
            //For template grid
            MojFind("[id^='" + gridName + "'] .k-hierarchy-cell .k-minus").trigger("click");
            MojFind("[id^='" + gridName + "'] .k-hierarchy-cell .k-plus").removeAttr("disabled");
            //if exist other div-buttons 
            if (MojFind(".div-buttons").find("div[id^='div_btnSaveInGrid'],div[id^='div_btnCancelInGrid']").not("[class*=hide]").length == 0) {
                var frm = MojFind('#div_' + gridName + '_Details').closest("form");
                if (frm.length > 0) {
                    var action = frm.attr("id").replace("frm", "");
                    MojFind(MojFind("[id^='btn'][id*='" + action + "']")).parent("div").parent("div").removeClass("hide");
                }
            }
        },

        _preventBackDropListScroll: function (e) {
            var scrollTo = null;

            if (e.type == 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            } else if (e.type == 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).parent().scrollTop(scrollTo + $(this).parent().scrollTop());
            }
        },

        _preventBackWindowScroll: function (e) {
            var scrollTo = null;

            if (e.type == 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            } else if (e.type == 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }
        },

        _disableDiv: function (div, isEnable) {
            $(div).find("input[type!=hidden],textarea").each(function () {
                var inputSelector = "#" + $(this).attr("id");
                if ($(inputSelector).attr("wasReadonly") != "True") {
                    $(inputSelector).enable(isEnable);
                }
            });
        },

        _hideErrorMessage: function (div) {
            $(div).find("span.field-validation-error").each(function () {
                $(this).removeClass("field-validation-error").addClass("field-validation-valid");
                $(this).prev("input").removeClass("input-validation-error").addClass("input-validation-valid");;
                $(this).find("span").remove();
            });
        },

        //the client template of multidropdown in gridforsubmit,put hidden element for each value that is selected
        _getListBoundForSubmitClientTemplate: function (list, propertyName, gridDataSourceName, containerId, data) {
            var texts = Moj.HtmlHelpers._getValuesFromDataSourceByPropertyName(list, propertyName, data);
            var div = "<div class='moj-ellipsis' title='" + texts + "'>" + texts + "</div>";

            var propertyValue = data[propertyName];
            var index = Moj.HtmlHelpers._getIndexOfRowByGrid(containerId, data);
            for (var i = 0; i < propertyValue.length; i++) {
                var value = propertyValue[i];
                div += "<input type='hidden' name='" + gridDataSourceName + "[" + index + "]." + propertyName + "[" + i + "]" + "' value='" + value + "'/>";
            }
            return div;
        },

        _putCheckAllInGrid: function (gridName, chbName) {
            if (MojFind("[id^='" + gridName + "'] th[data-field='" + chbName + "'] input[type=checkbox]").length == 0)
                MojFind("[id^='" + gridName + "'] th[data-field='" + chbName + "']").html($("<input />", { type: "checkbox", name: "chbCheckAll" + chbName, onclick: "Moj.HtmlHelpers._checkAllInGrid(this, '" + gridName + "', '" + chbName + "')" }));
        },

        _checkAllInGrid: function (elem, gridName, chbName) {
            var grid = MojControls.Grid.getKendoGridById(gridName);
            var data = grid.dataSource.data();
            for (var i = 0; i < data.length; i++) {
                data[i][chbName] = $(elem).is(":checked");
            }
            grid.refresh()
            return false;
        },

        openDropDown: function () {
            var dropDown = this;
            var data = dropDown.dataSource._data;
            if (data[0].IsActive != undefined) {
                for (var item = data.length - 1; item >= 0; item--) {
                    if (data[item].IsActive == false) {
                        $(dropDown.ul).find("li:eq(" + item + ") div").css("color", "#c0c0c0");
                    }
                }
            }
        },


        removeNotActive: function (e) {
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
        },

        _getFilteredActiveData: function (data, originalIndex) {
            var newData = [];
            if (data.length && data[0].IsActive != undefined) {
                for (var item = data.length - 1; item >= 0; item--) {
                    if (data[item].IsActive == false) {
                        if (data[item].Key == originalIndex) {
                            newData.unshift(data[item]);
                        }
                    }
                    else {
                        newData.unshift(data[item]);
                    }
                }
                return newData;
            }
            return data;
        }
    },

    keepAlive: function (sessionTimeout) {
        if (sessionTimeout != undefined)
            window.CurrentSessionTimeout = sessionTimeout;
        if (window.CurrentSessionTimeout != undefined) {
            var logOut;
            window.clearTimeout(window.sessionKeepAlive);
            window.sessionKeepAlive = window.setTimeout(function () {
                kendo.ui.progress($("body"), false);
                Moj.confirm(Resources.Messages.TimeoutMessage,
                    function () {
                        Moj.safeAjaxCall("/Home/KeepAlive", "get", undefined, undefined, function (value) {
                        });
                        window.clearTimeout(logOut);
                    },
                    null,
                    function () {
                        window.location.href = baseUrl;
                        window.clearTimeout(logOut);
                    },
                    undefined,
                    undefined,
                    Resources.Messages.TimeoutMessageStay,
                    Resources.Messages.TimeoutMessageLeave,
                    MessageType.Alert,
                    450);


                logOut = window.setTimeout(function () {
                    Moj.redirect(baseUrl + "/Home/LogOut");
                }, 3 * 60 * 1000);

            }, (window.CurrentSessionTimeout - 3) * 60 * 1000);
        }
    },

    recaptchaReset: function () {
        if (typeof grecaptcha != 'undefined') {
            grecaptcha.reset();
            $("[data-recaptcha]").val('');
        }
    },

    changeObjectsState: function (control) {
        if (control.attr('ObjectStateEntity') != undefined) {
            MojFind("form").find('#ObjectState' + control.attr('ObjectStateEntity')).val("true");
        }
        if (MojFind("form").find('#ObjectState').length > 0) {
            MojFind("form").find('#ObjectState').val("true");
        }
    },

    changeObjectStateToControl: function (value, control) {
        if (control != undefined && control.attr('ObjectStateEntity') != undefined)
            MojFind('#ObjectState' + control.attr('ObjectStateEntity')).val(value);
        if (value == true && MojFind("form").find('#ObjectState') != undefined)
            MojFind("form").find('#ObjectState').val(true);

    },

    getObjectByArray: function (key, value, newObject) {
        if (key.indexOf('.') != -1) {
            var splittedName = key.split('.');
            var theKey = splittedName[0];
            var newKey = key.substring(key.indexOf('.') + 1);

            if (newObject[theKey] == undefined) {
                newObject[theKey] = Moj.getObjectByArray(newKey, value, {});
            }
            else {
                newObject[theKey] = Moj.getObjectByArray(newKey, value, newObject[theKey]);
            }
        }
        else {
            if (newObject[key] == undefined)
                newObject[key] = value || '';
        }
        return newObject;
    },

    appendObjectForSubmit: function (name, object, selector) {
        for (var i in object) {
            if (typeof (object[i]) == "function") {
            } else if (typeof (object[i]) === 'object')
                Moj.appendObjectForSubmit(name + Moj.getNameObjectForSubmit(i, name), object[i], selector);
            else {
                selector.append("<input type='hidden' name='" + name + Moj.getNameObjectForSubmit(i, name) + "' value='" + object[i] + "'/>");
            }
        }
    },

    HandleAccessibleErrorMessages: function (buttonId) {
        var errorsMessage = "";
        MojFind("[aria-describedby]").each(function () {
            if (errorsMessage.indexOf(MojFind("#" + $(this).attr("aria-describedby")).text()) < 0)
                errorsMessage += MojFind("#" + $(this).attr("aria-describedby")).text() + " ";
        });

        if ($.trim(errorsMessage) != "")
            MojFind("[id='divAccessibleErrorMessages_" + buttonId + "']").html(Resources.Messages.ErrorsMessageRemark + " " + errorsMessage);
        else
            MojFind("[id='divAccessibleErrorMessages_" + buttonId + "']").html("");

        MojFind(".moj-panel:has(span.field-validation-error) .plus").click();
        MojFind("input.input-validation-error:first-child").focus();
    },

    getNameObjectForSubmit: function (i, name) {
        if (!isNaN(parseInt(i)))
            return "[" + i + "]";
        else
            return name != "" ? "." + i : i;
    },

    redirect: function (url) {
        var http = "http";
        if (!(url.slice(0, http.length) == http)) {
            url = baseUrl + url;
        }
        if ($.support.pjax && url.indexOf(baseUrl) >= 0) {
            $.pjax({ url: url, container: '.web-site-container' });
        }
        else
            window.location.href = url;
    },

    callActionWithJson: function (formId, url, successfunc, moreData, async) {
        if (async == null || typeof (async) == "undefined" || async == "")
            async = false;
        var getDataCallback = function () {
            var data = MojFind("#" + formId).serializeObject();
            $.extend(data, moreData);
            return JSON.stringify(data);
        };
        $.ajaxSetup({ cache: false });
        $.ajax({
            type: "POST",
            async: async,
            url: url == undefined ? MojFind("#" + formId).attr("action") : baseUrl + url,
            contentType: 'application/json',
            data: (typeof getDataCallback == 'undefined') ? {} : getDataCallback($(this)),
            dataType: "json",
            success: successfunc == '' ? saveSuccess : successfunc,
            error: function (e) {
                //Moj.showMessage(Resources.Strings.Error);
            }
        });
    },

    callAjax: function (formId, url, successfunc, type) {
        if (typeof (type) == "undefined")
            type = "GET";
        var getDataCallback = function () { return MojFind("#" + formId).serializeObject(); };
        $.ajaxSetup({ cache: false });
        $.ajax({
            type: type,
            url: baseUrl + url,
            success: successfunc == '' ? saveSuccess : successfunc,
            data: (typeof getDataCallback == 'undefined') ? {} : getDataCallback($(this)),
            error: function (e) {
                //Moj.showMessage(Resources.Strings.Error); 
            }
        });
    },

    safeAjaxCall: function (url, type, data, contentType, onSuccess, onError) {
        $.ajax({
            url: baseUrl + url,
            type: type,
            data: data == undefined ? '' : data,
            contentType: contentType == undefined ? 'application/json' : contentType,
            success: function (data, textStatus, xhr) {
                var isError = xhr.responseText.indexOf("ErrorHandlerScript") > -1;
                if (!isError && onSuccess != undefined) {
                    onSuccess(data);
                }

            },
            error: function (event, xhr, settings, exception) {
                if (onError != undefined) {
                    onError();
                }
            }
        });
    },

    safeGet: function (url, data, onSuccess, onFailure) {
        $.get(baseUrl + url, data, function (data, textStatus, xhr) {

            var isError = xhr.responseText.indexOf("ErrorHandlerScript") > -1;

            if (!isError && onSuccess != undefined) {
                if (Moj.showErrorMessage(data.Errors)) {
                    onSuccess(data);
                }
                else if (onFailure != undefined) {
                    onFailure();
                }
            }
        });
    },

    safePost: function (url, data, onSuccess, onFailure) {
        $.post(baseUrl + url, data, function (data, textStatus, xhr) {
            var isError = xhr.responseText.indexOf("ErrorHandlerScript") > -1;
            if (!isError && onSuccess != undefined) {
                if (Moj.showErrorMessage(data.Errors)) {
                    onSuccess(data);
                }
                else if (onFailure != undefined) {
                    onFailure();
                }
            }
        });
    },

    replaceDivs: function (div1, div2) {
        MojFind(div1).hide();
        MojFind(div2).show();
    },

    addConstant: function (key, value) {
        Moj.Constants[key] = value;
    },

    showErrorMessage: function (result, okFunction, title, isCloseWindowOnEnter, messageType) {
        if (typeof (messageType) == "undefined" || messageType == null)
            messageType = MessageType.Error;
        var errorList = "";
        if (result instanceof Array == false)
            errorList = result;
        else {
            $.each(result, function (index, value) {
                if (typeof (value.ErrorMessage) != "undefined")
                    errorList = errorList + "<div>" + value.ErrorMessage + "</div>";
                else
                    errorList = errorList + "<div>" + value + "</div>";
            });
        }
        if (errorList != "" && errorList != undefined) {
            Moj.showMessage(errorList, okFunction, title, messageType, isCloseWindowOnEnter);
            return false;
        }
        return true;
    },

    showMessage: function (data, okFunction, title, type, isCloseWindowOnEnter) {
        if (typeof (type) == undefined || type == null)
            type = MessageType.Error;
        if (typeof (title) == undefined || title == null)
            title = Resources.Strings.MessageError;
        title = "<a id ='preFocus' tabindex='0'></a><h2 class='moj-modal-title' id='msgTitle'>" + title + "</h2>";
        var kendoWindow = $("<div class='moj-window-message'/>").kendoWindow({
            title: title,
            resizable: false,
            width: 336,
            modal: true,
            deactivate: function () {
                this.destroy();
            },
            close: function () {

                if ($('#body') != undefined && $('#body').length > 0)
                    $('#body').attr('aria-hidden', false);
                $('header,footer').attr("aria-hidden", false);

                $(document).off("keydown.kendoWindow");
                if (okFunction != undefined && okFunction != null)
                    okFunction();
            },
            activate: function () {

                if ($('#body') != undefined && $('#body').length > 0)
                    $('#body').attr('aria-hidden', true);
                $('header,footer').attr("aria-hidden", true);

                var windowElement = this.wrapper,
                    windowContent = this.element;
                $(document).on("keydown.kendoWindow", function (e) {
                    var focusedElement = $(document.activeElement);
                    if (e.keyCode == kendo.keys.TAB) {
                        if (focusedElement.closest(windowElement).length > 0) {
                            return;
                        }
                        windowContent.focus();
                    }
                });
                $("#stopFocus").focus(function () {
                    windowContent.focus();
                });
                $("#preFocus").focus(function () {
                    windowContent.focus();
                });
                windowElement.attr("role", "alertdialog");
                windowElement.attr("aria-labelledby", "msgTitle");
                windowElement.attr("aria-describedby", "msgDescription");
            }
        });
        data = "<span class='moj-window-message-data' id='msgDescription'>" + data + "</span>";
        var designLine = '<div class="clear-both"></div><div class="moj-window-line"></div>';

        var iconAlert = "<img src='" + baseUrl + "/Content/MojImages/icons/" + type + "PopIcon.png' alt='' class='moj-message-img' />";
        var okButton = '<div class="col moj-button action-base moj-small-dark"><input class="moj-window-confirm" type="button" value="' + Resources.Strings.Ok + '"></div>';
        var buttons = "<div class='moj-window-buttons'>" + okButton + "<a id ='stopFocus' tabindex='0'></a></div>";
        kendoWindow.data("kendoWindow")
            .content("<div class='moj-window-message-container'>" + iconAlert + data + designLine + buttons + "<div class='clear-both'></div></div>")
            .center().open();

        kendoWindow
            .find(".moj-window-confirm")
            .click(function () {
                kendoWindow.data("kendoWindow").close();
                return true;
            })
            .end();

        if (isCloseWindowOnEnter != undefined && isCloseWindowOnEnter)
            Moj.attachCloseWindowOnEnter(kendoWindow);

        return kendoWindow;
    },

    closeWindowOnEnter: function (window) {
        $(document).unbind("keyup").bind('keyup.window.message', function (event) {
            if (event.which == 13) {
                window.find(".moj-window-confirm").trigger("click");
            }
        });
    },

    confirm: function (message, okFunction, parameter, cancelFunction, title, isCloseWindowOnEnter, okText, cancelText, messageType, width) {
        if (okText == undefined || okText == "")
            okText = Resources.Strings.Ok;
        if (cancelText == undefined || cancelText == "")
            cancelText = Resources.Strings.Cancel;
        if (typeof (title) == undefined || title == null)
            title = Resources.Strings.Message;
        title = "<a id ='preFocus' tabindex='0'></a><h2 class='moj-modal-title' id='msgTitle'>" + title + "</h2>";
        if (typeof (messageType) == undefined || messageType == null)
            messageType = MessageType.Alert;
        if (width == undefined || width == null)
            width = 300;
        var kendoWindow = $("<div class='moj-window-message' />").kendoWindow({
            title: title,
            resizable: false,
            width: width,
            deactivate: function () {
                this.destroy();
            },
            modal: true,
            close: function () {
                if ($('#body') != undefined && $('#body').length > 0)
                    $('#body').attr('aria-hidden', false);
                $('header,footer').attr("aria-hidden", false);

                $(document).off("keydown.kendoWindow");
                if (!Moj.isTrue(kendoWindow.isCloseFromOk) && cancelFunction != undefined && cancelFunction != null)
                    cancelFunction(parameter);
            },
            isCloseFromOk: false,
            activate: function () {

                if ($('#body') != undefined && $('#body').length > 0)
                    $('#body').attr('aria-hidden', true);
                $('header,footer').attr("aria-hidden", true);

                var windowElement = this.wrapper,
                    windowContent = this.element;
                $(document).on("keydown.kendoWindow", function (e) {
                    var focusedElement = $(document.activeElement);
                    if (e.keyCode == kendo.keys.TAB) {
                        if (focusedElement.closest(windowElement).length > 0) {
                            return;
                        }
                        windowContent.focus();
                    }
                });
                $("#stopFocus").focus(function () {
                    windowContent.focus();
                });
                $("#preFocus").focus(function () {
                    windowContent.focus();
                });
                windowElement.attr("role", "alertdialog");
                windowElement.attr("aria-labelledby", "msgTitle");
                windowElement.attr("aria-describedby", "msgDescription");
            }
        });
        message = "<span class='moj-window-message-data' id='msgDescription'>" + message + "</span>";
        var designLine = '<div class="clear-both"></div><div class="moj-window-line"></div>';
        var iconAlert = "<img src='" + baseUrl + "/Content/MojImages/icons/" + messageType + "PopIcon.png'  alt='' class='moj-message-img' />";
        var cancelButton = '<div style="float:left;"><div class="col moj-button action-base moj-small-light"><input id="Cancel" type="button" value="' + cancelText + '"></div></div>';
        var okButton = '<div style="float:left;margin-right:8px;"><div class="col moj-button action-base moj-small-dark"><input id="Ok" class="moj-window-confirm" type="button" value="' + okText + '"></div></div>';
        var buttons = "<div class='moj-window-buttons'>" + okButton + cancelButton + "<a id ='stopFocus' tabindex='0'></a></div>";
        kendoWindow.data("kendoWindow")
            .content("<div class='moj-window-message-container'>" + iconAlert + message + designLine + buttons + "<div class='clear-both'></div></div>")
            .center().open();

        kendoWindow
            .find("#Ok")
            .click(function (e) {
                kendoWindow.isCloseFromOk = true;
                kendoWindow.data("kendoWindow").close();
                if (okFunction != undefined)
                    okFunction(parameter);
                return true;
            })
            .end()
            .find("#Cancel")
            .click(function () {
                kendoWindow.data("kendoWindow").close();
                return false;
            })
            .end();

        if (isCloseWindowOnEnter != undefined && isCloseWindowOnEnter)
            Moj.attachCloseWindowOnEnter(kendoWindow);
    },

    clearFields: function (e, selector, filter) {
        if (typeof (filter) == "undefined" || filter == null) filter = "";
        if (selector == undefined)
            selector = "[id$='" + e.id.replace("btnClear", "") + "']";
        MojFind(selector + filter).clearValidationErrors();
        MojFind(selector + " textarea" + filter).val("").attr("title", "");
        MojFind(selector + " input[type!=button][type!=submit][type!=radio][type!=checkbox]:not([type=checkbox]+[type=hidden])" + filter).each(function () {
            $(this).val("").attr("title", "");
        });
        MojFind(selector + " [data-role='datepicker']" + filter).each(function () {
            $(this).data("kendoDatePicker").value("");
        });
        MojFind(selector + " input[type=radio]" + filter).removeAttr("checked");
        MojFind(selector + " input[type=checkbox]" + filter).removeAttr("checked");
        MojFind(selector + " span.k-dropdown input" + filter).each(function () {
            $(this).data("kendoDropDownList").select(0);
        });
        MojFind(selector + " span.k-combobox input[data-role='combobox']" + filter).each(function () {
            $(this).data("kendoComboBox").select(-1);
            $(this).closest("span").attr("title", "");
        });
        MojFind(selector + " .k-grid" + filter).each(function () {
            $(this).data("kendoGrid").dataSource.data([]);
        });

        MojFind(selector + " [ismultidropdown=True]" + filter).each(function () {
            $(this).data("kendoMultiSelect").value([]);
            $(this).data("kendoMultiSelect").input.blur();
        });

        MojFind(selector + " [id$='DropDown']" + filter).each(function () {
            var dropDownField = $(this).data("kendoDropDownList");
            var dropDownName = $(this).attr("name");
            $(this).closest("span").attr("title", "");
            dropDownField.text("");
            dropDownField.ul.find("input").removeAttr("checked");
            MojFind(selector).find("[id='div" + dropDownName.substring(0, dropDownName.indexOf("_")) + "']").remove();
            if ($(this).attr("checkedAll") != undefined) {
                dropDownField.ul.find("[id^='chb" + dropDownName.substring(0, dropDownName.indexOf("_")) + "']").attr("checked", "checked");
            }
        });
    },


    //this methods real disabled ,(inputs are not return in submit)
    enableFields: function (selector, isEnable, filter) {
        if (typeof (filter) == "undefined" || filter == null) filter = "";
        MojFind(selector + " span.k-combobox input[data-role='combobox']" + filter).each(function () {
            $(this).data("kendoComboBox").enable(isEnable);
        });
        MojFind(selector + " span.k-dropdown input" + filter).each(function () {
            $(this).data("kendoDropDownList").enable(isEnable);
        });
        MojFind(selector + " input[type!=button][type!=submit][type!=hidden]" + filter + "," + selector + " textarea" + filter).each(function () {
            $(this).attr("disabled", !isEnable);
        });
        MojFind(selector + " span.k-datepicker input" + filter).each(function () {
            $(this).data("kendoDatePicker").enable(isEnable);
        });
        MojFind(selector + " .icon-button" + filter).each(function () {
            if (!isEnable) {
                $(this).attr("disabled", "disabled");
                $(this).find("div").attr("disabled", "disabled");
            } else {
                $(this).find("div").removeAttr("disabled");
                $(this).removeAttr("disabled");
            }
        });
    },

    getGridData: function () {
        return MojFind("[id*='Search']" && "[id^='frm']").serializeObject();
    },

    setDataSource: function (cmb, data) {
        cmb.element.closest("span").attr("title", "");
        cmb.setDataSource(data);
        cmb.refresh();
        cmb.enable(true);
        cmb.select(-1);
    },

    loadMenuTab: function (id, menuId) {
        Moj.safeAjaxCall(MojFind("#lnk_" + id).attr("href"),
            "get",
            undefined,
            undefined,
            function (data) {
                MojFind("[id^='content_'], [id='content']").empty().html(data);
                if (menuId != undefined)
                    Moj.ChangeState("li_" + menuId);
                else
                    Moj.ChangeState("li_" + id);
                return false;
            });
    },

    checkChanges: function (isCanOpenMethodName, id, menuId) {
        if (isCanOpenMethodName != "") {
            if (eval(isCanOpenMethodName + "();") == false)
                return false;
        }
        if (MojFind("[id^='content']").children.length > 1) {
            var forms = MojFind("[id^='content']").find('form');

            if (forms.length == 0)
                Moj.loadMenuTab(id, menuId);

            $(forms).each(function () {
                var formId = this.id;
                if (formId.toLowerCase().indexOf("search") == -1 && formId.toLowerCase().indexOf("list") == -1) {
                    if (MojFind('#' + formId).find("[id^='ObjectState']:input[value='true']").length > 0) {
                        Moj.confirm(Resources.Strings.LoseChanges,
                            function () {
                                $("#ObjectState").val("false");
                                Moj.loadMenuTab(id, menuId);
                            });

                    } else
                        Moj.loadMenuTab(id, menuId);
                }
                else
                    Moj.loadMenuTab(id, menuId);
            });
        }

        return false;
    },

    enableValidation: function (form) {
        form.unbind();
        form.removeData('validator');
        form.removeData('unobtrusiveValidation');
        $.validator.unobtrusive.parse(form);
        form.validate();
    },

    saveSuccess: function (gridName, data) {
        var errors = "";
        if (data.length > 0)
            errors = data;
        else if (data.Errors != undefined)
            errors = data.Errors;
        if (errors.indexOf("ErrorHandle") == -1 && errors.indexOf("CaptchaScript") == -1) {
            if (Moj.showErrorMessage(errors) == true) {
                MojFind('#DetailsContent').empty();
                var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
                if (grid != undefined)
                    grid.dataSource.read(Moj.getGridData());
                Moj.replaceDivs('#DetailsContent', '#ListContent');
                return true;
            }
        }
        Moj.recaptchaReset();
        return false;
    },

    addObjectState: function () {
        var forms = MojFind("[id^='content']").find('form');
        $(forms).each(function () {
            var formId = this.id;
            Moj.addObjectStateToForm(formId);
        });
    },

    addObjectStateToForm: function (formId) {
        if (formId != "") {
            if (MojFind('#' + formId).find('#ObjectState').length == 0) {
                MojFind('#' + formId).append("<input type='hidden' id='ObjectState' name='ObjectState' value='false'/>");
            }
            var anotherObjectState = MojFind('#' + formId).find('[ObjectStateEntity]');
            $(anotherObjectState).each(function () {
                var name = $(this).attr('ObjectStateEntity');
                if (name.indexOf(".") != -1) {
                    var prefix = name.substring(0, name.indexOf('.'));
                    name = name.substring(name.indexOf('.') + 1, name.length);
                    if (MojFind('#' + formId).find('#' + prefix + '_ObjectState' + name).length == 0) {
                        MojFind('#' + formId).append("<input type='hidden' id='" + prefix + "_ObjectState" + name + "' name='" + prefix.replace(/_/g, '.') + ".ObjectState" + name + "' value='false'/>");
                    }
                }
                else
                    if (MojFind('#' + formId).find('#ObjectState' + name).length == 0) {
                        MojFind('#' + formId).append("<input type='hidden' id='ObjectState" + name + "' name='ObjectState" + name + "' value='false'/>");
                    }
            });
        }
    },

    changeObjectStateToForm: function (value) {
        if (MojFind("form").find('#ObjectState') != undefined)
            MojFind("form").find('#ObjectState').val(value);
    },

    addTab: function (selectorTabStrip, text, id, data, isCenterContent, callBack, reload, cssClass, isSubItem) {
        var tabStrip = $(selectorTabStrip).data("kendoTabStrip");
        var existTab = false;
        var length = tabStrip.tabGroup.children("li").length;
        tabStrip.tabGroup.children("li").each(function () {
            if ($(this).text() == text) {
                tabStrip.select(this);
                if (Moj.isTrue(reload)) {
                    callBack();
                }
                existTab = true;
            }
        });
        if (length < 6 && !existTab) {
            var tabContect = "";
            var centerClass = "";
            if (isCenterContent)
                centerClass = "class='moj-content'";
            tabStrip.insertAfter(
                {
                    text: text,
                    content: ("<div  " + centerClass + " id='divContent_" + id + "'><center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/BlueOpal/loading-image.gif' /></center></div>")
                },
                tabStrip.tabGroup.children("li:last"));
            if (data != undefined)
                tabStrip.tabGroup.children("li:last").attr("data", data);
            var tabIndex = tabStrip.tabGroup.children("li").length - 1;
            var lastTab = tabStrip.tabGroup.children("li:last");
            lastTab.append("<a id='close_" + id + "' class='tab-close' onclick=\"Moj.closeTab('" + selectorTabStrip + "','close_" + id + "');\" />");
            if (typeof (cssClass) != "undefined" && cssClass != "" && cssClass != null) {
                Moj.markTopMenu(cssClass);
                if (Moj.isTrue(isSubItem)) {
                    cssClass += " sub-item";
                    lastTab.find("span.k-link").prepend($("<div/>", { "class": cssClass + " mark" }));
                }
                else
                    lastTab.append($("<div/>", { "class": cssClass + " mark" }));
            }
            if (lastTab.find("span.k-link").html().length > 24) {
                lastTab.find("span.k-link").attr("title", text);
            }
            tabStrip.select(tabIndex);
            callBack();
        } else if (length >= 6 && !existTab) {
            Moj.showMessage(Resources.Messages.Err15);
        }
    },

    markTopMenu: function (cssClass) {
        $(".moj-top-menu li.moj-li-main-menu .moj-li-container-div").removeClass("hover");
        $(".moj-top-menu li.moj-li-main-menu[data-class='" + cssClass + "'] .moj-li-container-div").addClass("hover");
    },

    addListDetailsTab: function (selectorTabStrip, text, id, actionName, controllerName, data, cssClass, isSubItem) {
        Moj.addTab(selectorTabStrip, text, id, data, true, function () {
            var o = {};
            o["ActionValue"] = actionName;
            o["ControllerValue"] = controllerName;
            $("#divContent_" + id).load(baseUrl + "/Home/ListDetails", o);
        }, false, cssClass, isSubItem);
    },

    addTabWithActionContent: function (selectorTabStrip, text, id, urlAction, data, callBack, reload, cssClass, isSubItem) {
        Moj.addTab(selectorTabStrip, text, id, data, true, function () {
            $("#divContent_" + id).load(urlAction, callBack);
        }, reload, cssClass, isSubItem);
    },

    closeTab: function (selectorTabStrip, closeTabId) {
        var result = true;
        var contentID = closeTabId.replace("close_", "divContent_");
        var forms = $("[id='" + contentID + "']").find('form');
        $(forms).each(function () {
            var formId = this.id;
            if (formId.toLowerCase().indexOf("search") == -1 && formId.toLowerCase().indexOf("list") == -1) {
                if ($(this).find("[id^='ObjectState']:input[value='true']").length > 0) {
                    result = confirm(Resources.Strings.LoseChanges);
                    return;
                }
            }
        });
        if (result == true) {
            var tabStrip = $(selectorTabStrip).data('kendoTabStrip');
            if (tabStrip.select().index() == $("#" + closeTabId).closest("li").index() && tabStrip.select().index() != 0)
                tabStrip.select($("#" + closeTabId).closest("li").index() - 1);
            tabStrip.remove($("#" + closeTabId).closest("li").index());
        };
    },

    ChangeState: function (selector) {
        var a = selector.split("_");
        MojFind("[id^=" + a[0] + "]").each(function () { $(this).removeClass("active"); });
        $(".border-right", MojFind("[id^=" + a[0] + "]")).remove();
        $(".border-left", MojFind("[id^=" + a[0] + "]")).remove();
        MojFind("#" + selector).addClass("active");
        MojFind("#" + selector).append(("<div class='border-right'></div>")).append(("<div class='border-left'></div>"));
        $(".ul-menu").css("display", "none");
    },

    setMultiSelectValue: function (dropDownName, listValue, containerDivName) {
        var containerElement = containerDivName != undefined && containerDivName != ""
            ? $(MojFind("#" + containerDivName)[0])
            : $(MojFind("[name='" + dropDownName + "_DropDown']").parents("form")[0]);
        // append new div
        containerElement.append("<div id='div" + dropDownName + "'></div>");

        $.each(listValue, function (index, value) {
            containerElement.find("[id='div" + dropDownName + "']").append("<input type='hidden' name='" + dropDownName + "[" + index + "]' value='" + value + "' />");
        });
        // add attr check   
        Moj.HtmlHelpers._checkDropDownItems(dropDownName, listValue);
    },

    openPopupWindow: function (id, content, title, width, height, scrollable, draggable, resizable, url, methodNameAfterCancel, urlParameters, appendTo, textAlertBeforeClose) {
        var focusedElement = $(document.activeElement);
        var kendoWindow = $("<div id='" + id + "'><div class='moj-window-container-content'><center><img id='loading' class='margin-top20' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center></div></div>").kendoWindow({
            width: width,
            height: height,
            iframe: false,
            modal: appendTo == undefined ? true : false,
            appendTo: appendTo,
            title: title,
            scrollable: scrollable,
            draggable: draggable,
            resizable: resizable,
            close: function (e) {
                if (textAlertBeforeClose != undefined && arguments.callee.caller.arguments.callee.caller.arguments.callee.caller.name == "_windowActionHandler") {
                    e.preventDefault();
                    var x = Moj.confirm(textAlertBeforeClose, function () {
                        $("#" + id).trigger('window_closed');
                        if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                            methodNameAfterCancel();
                        if (appendTo != undefined)
                            Moj.setOverlay(kendoWindow, appendTo, false);
                        $("#" + id).data("kendoWindow").unbind("close");
                        $("#" + id).data("kendoWindow").close();
                    });
                }
                else {
                    $("#" + id).trigger('window_closed');
                    if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                        methodNameAfterCancel();
                    if (appendTo != undefined)
                        Moj.setOverlay(kendoWindow, appendTo, false);
                }
                focusedElement.focus();
            },
            deactivate: function () {
                this.destroy();
            }
        });

        if (appendTo != undefined)
            Moj.setOverlay(kendoWindow, appendTo, true);


        $("#" + id).trigger('window_opened');
        if (content != "" && content != null) {
            $("#" + id + " .moj-window-container-content").html(content);
            var w = kendoWindow.data("kendoWindow").toFront();
            if (appendTo == undefined)
                w.center();
            else
                $(w).mojWindowCenter();
            w.open();
        }

        if (typeof (url) != "undefined" && url != "" && url != null) {
            $("#" + id + " .moj-window-container-content").load(url, urlParameters, function () {
                var w = kendoWindow.data("kendoWindow").toFront();
                if (appendTo == undefined)
                    w.center();
                else
                    $(w).mojWindowCenter();
                w.open();
            });

        }
        return kendoWindow;
    },

    openFixedPopupWindow: function (id, content, title, width, height, scrollable, draggable, resizable, url, methodNameAfterCancel, urlParameters, appendTo, textAlertBeforeClose) {
        Moj.website.openPopupWindow(id, content, title, width, height, scrollable, draggable, resizable, url, methodNameAfterCancel, urlParameters, appendTo, textAlertBeforeClose);
    },

    isKeyPressedNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },

    attachCloseWindowOnEnter: function (window) {
        var popup = window.data("kendoWindow").element.closest(".k-widget.k-window");
        popup.enterkeypress(function () {
            window.find(".moj-window-confirm").trigger("click");
        });
    },

    setBackgroundRows: function (rows) {
        rows.each(function (index) {
            if (index % 2 == 0)
                $(this).removeClass("k-alt");
            else
                $(this).addClass("k-alt");
        });
    },

    setSerializedObject: function (object, selectorForAddNotExisting) {
        var obj;
        var value;
        for (var i in object) {
            obj = MojFind("[name='" + i + "']");
            value = object[i];
            if (obj.length == 0) {
                if (typeof (selectorForAddNotExisting) != "undefined")
                    $(selectorForAddNotExisting).append("<input name='" + i + "' type='hidden' value='" + value + "' />");
            } else if (obj.attr("data-role") == "dropdownlist")
                obj.data("kendoDropDownList").value(value);
            else if (obj.attr("data-role") == "combobox") {
                if (typeof (object[i + "_input"]) != "undefined" && object[i + "_input"] != "")
                    value = object[i + "_input"];
                obj.data("kendoComboBox").value(value);
            } else if (obj.attr("type") == "checkbox") {
                if (value == "true")
                    obj.attr("checked", "checked");
                else
                    obj.removeAttr("checked");

            } else if (obj.attr("type") == "radio") {
                MojFind("[name='" + i + "']").attr("checked", false);
                MojFind("[name='" + i + "'][value='" + value + "']").attr("checked", true);
            } else {
                obj.val(value);
            }
        }
    },


    _callMultiChangedEvent: function (dropDownName, checkBox) {
        MojFind("[name='" + dropDownName + "_DropDown']").trigger({
            type: EventType.MultiChanged,
            value: $(checkBox).attr("value"),
            isChecked: MojControls.CheckBox.isChecked($(checkBox))
        });
    },

    serializeViewModel: function (object, newObject) {
        for (var i in object)
            if (typeof (object[i]) === 'object') {
                newObject[i] = {};
                newObject[i] = Moj.serializeViewModel(object[i], newObject[i]);
            } else
                newObject[i] = object[i];
        return newObject;
    },

    filterArray: function (array, objectToCompare) {
        return array.filter(function (i) {
            return i != objectToCompare;
        });
    },

    arrayFirstIndexOf: function (array, predicate, predicateOwner) {
        for (var i = 0, j = array.length; i < j; i++) {
            if (predicate.call(predicateOwner, array[i])) {
                return i;
            }
        }
        return -1;
    },

    closeActiveTab: function (selectorTab) {
        $(selectorTab).find("li.k-item.k-state-active").find(".tab-close").trigger("click");
    },

    findInActiveTab: function (selectorTab, selectorEle) {
        var object = $(selectorTab).find("div.k-state-active").find(selectorEle);
        return object;
    },

    //check if the value is undefinded or empty 
    isEmpty: function (value) {
        return value == undefined || value == "";
    },

    //check if the value is not undefinded or empty
    isNotEmpty: function (value) {
        return !Moj.isEmpty(value);
    },

    //checks if a given value is int and greater then zero(for selecting values in comboxes)
    isIntAndGreaterThenZero: function (value) {
        return value != undefined && value != 0 && value != -1 && value != "0" && value != "-1" && value != "" && value != NaN && value.toString() != "NaN";
    },

    //all checks for bool value
    isBool: function (value) {
        return value == true || value == "true" || value == "True" || value == false || value == "false" || value == "False";
    },

    //are first parameter and second parameter equels.
    areEquel: function (value1, value2) {
        return value1 == value2 || value1.toString() == value2.toString();
    },

    //check if the value is equel to false or the string 'false';
    isFalse: function (value) {
        return value == false || value == "false" || value == "False";
    },

    //check if the value is equel to true or the string 'true';
    isTrue: function (value) {
        return value == true || value == "true" || value == "True";
    },

    isJSON: function (str) {
        if (str.length == 0) return false;
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return (/^[\],:{}\s]*$/).test(str);
    },

    setFocusToTheFirstElement: function (container) {
        var elementFocus = $(container).find("input[type!=hidden][type!=button]:not(:disabled):not([readonly]):visible,textarea:not(:disabled):not([readonly]):visible,.k-dropdown:visible .k-dropdown-wrap.k-state-default").eq(0);
        if (elementFocus.hasClass("k-dropdown-wrap"))
            elementFocus = elementFocus.parent();

        elementFocus.focus();
    },

    getCurrentDate: function () {
        var fullDate = new Date();
        var twoDigitMonth = (((fullDate.getMonth() + 1).toString().length) == 2) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
        var twoDigitDay = ((fullDate.getDate().toString().length) == 2) ? (fullDate.getDate()) : '0' + (fullDate.getDate());
        var date = twoDigitDay + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        return date;
    },

    setOverlay: function (kendoWindow, appendTo, visible) {
        var overlay = appendTo.children(".k-overlay");

        if (!overlay.length) {
            overlay = $("<div class='k-overlay' />");
        }
        overlay.toggle(visible);
        if (visible) {
            overlay.appendTo(appendTo);
            overlay.css("z-index", parseInt(kendoWindow.css("z-index"), 10) - 1 + " !important");
            overlay.width($(appendTo).outerWidth());
            overlay.height($(appendTo).outerHeight());
            appendTo.css("position", "relative");
            overlay.css("position", "absolute");
        }
        else {
            overlay.remove();
        }
    },

    downloadFile: function (url, params, fileName) {
        var nav = navigator.userAgent.toLowerCase();
        var is_IE = (nav.indexOf('msie') != -1) || (nav.indexOf('trident') != -1) ? true : false;
        var DocumentName = !fileName ? "FileDocument" : fileName;
        $.ajax({
            type: "POST",
            url: baseUrl + url,
            data: params,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(function (data) {
            if (Moj.showErrorMessage(data.Errors) == true) {
                var fromServer = data;
                var byteArray = new Uint8Array(fromServer.fileArray);
                var a = window.document.createElement('a');
                var FullFileName = DocumentName + fromServer.extension;
                if (is_IE)//IE
                    window.navigator.msSaveOrOpenBlob(new Blob([byteArray], { type: 'application/octet-stream' }), FullFileName);
                else {
                    a.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
                    a.download = FullFileName;
                    // Append anchor to body.
                    document.body.appendChild(a)
                    a.click();
                    // Remove anchor from body
                    document.body.removeChild(a)
                }
            }
        }
            );
    },

    website: {
        openPopupWindow: function (id, content, title, width, height, scrollable, draggable, resizable, url, methodNameAfterCancel, urlParameters, methodNameAfterOpen, appendTo, textAlertBeforeClose) {
            var focusedElement = $(document.activeElement);
            var scrollHeight = height - 79;
            title = "<a id ='preFocus' tabindex='0'></a><h2 class='moj-modal-title'>" + title + "</h2>";
            var kendoWindow = $("<div id='" + id + "' style='position:relative;'><div class='window-bottom'></div><div class='scroll' style='overflow:auto;height:" + scrollHeight + "px;'><div class='moj-window-container-content'><center><img id='loading' class='margin-top20' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center></div></div><a id ='stopFocus' tabindex='0'></a></div>").kendoWindow({
                width: width,
                height: height,
                iframe: false,
                modal: appendTo == undefined ? true : false,
                appendTo: appendTo,
                title: title,
                scrollable: false,
                draggable: draggable,
                resizable: resizable,
                close: function (e) {
                    if (textAlertBeforeClose != undefined && arguments.callee.caller.arguments.callee.caller.arguments.callee.caller.name == "_windowActionHandler") {
                        e.preventDefault();
                        var x = Moj.confirm(textAlertBeforeClose, function () {
                            $("#" + id).trigger('window_closed');
                            if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                                methodNameAfterCancel();
                            if (appendTo != undefined)
                                Moj.setOverlay(kendoWindow, appendTo, false);
                            $("#" + id).data("kendoWindow").unbind("close");
                            $("#" + id).data("kendoWindow").close();
                        });
                    }
                    else {
                        $(document).off("keydown.kendoWindow");
                        $("#" + id).trigger('window_closed');
                        if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                            methodNameAfterCancel();
                        if (appendTo != undefined)
                            Moj.setOverlay(kendoWindow, appendTo, false);
                    }
                    focusedElement.focus();
                },
                activate: function () {
                    var windowElement = this.wrapper,
                        windowContent = this.element;
                    $(document).on("keydown.kendoWindow", function (e) {
                        var focusedElement = $(document.activeElement);
                        if (e.keyCode == kendo.keys.TAB) {
                            if (focusedElement.closest(windowElement).length > 0 || document.activeElement == document.body) {
                                return;
                            }
                            windowContent.focus();
                        }
                    });
                    $("#stopFocus").focus(function () {
                        windowContent.focus();
                    });
                    $("#preFocus").focus(function () {
                        windowContent.focus();
                    });
                },
                deactivate: function () {
                    this.destroy();
                }
            });

            if (appendTo != undefined)
                Moj.setOverlay(kendoWindow, appendTo, true);

            $("#" + id).trigger('window_opened');
            if (content != "" && content != null) {
                $("#" + id + " .moj-window-container-content").html(content);
                var w = kendoWindow.data("kendoWindow").toFront();
                if (appendTo == undefined)
                    w.center();
                else
                    $(w).mojWindowCenter();
                w.open();

                if (methodNameAfterOpen != undefined && methodNameAfterOpen != "")
                    methodNameAfterOpen();

                MojFind("div.scroll").bind('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);
                Moj.setFocusToTheFirstElement(MojFind('.moj-window-container-content'));
                $(".moj-window-container-content input[readonly='readonly']").attr("tabindex", -1);
            }
            if (typeof (url) != "undefined" && url != "" && url != null) {
                $("#" + id + " .moj-window-container-content").load(url, urlParameters, function (data) {
                    if (data.toString().indexOf("ErrorHandler") == -1) {
                        var w = kendoWindow.data("kendoWindow").toFront();
                        if (appendTo == undefined)
                            w.center();
                        else
                            $(w).mojWindowCenter();
                        w.open();
                        if (methodNameAfterOpen != undefined && methodNameAfterOpen != "")
                            methodNameAfterOpen();


                        MojFind("div.scroll").bind('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);
                        Moj.setFocusToTheFirstElement(MojFind('.moj-window-container-content'));
                        $(".moj-window-container-content input[readonly='readonly']").attr("tabindex", -1);
                    }
                });

            }
            return kendoWindow;
        },
        setScrollMsg: function () {
            MojFind(".ul-scroll li").each(function () {
                MojFind(".ul-paging-message").append("<li></li");
            });

            var messageWidth = parseInt(MojFind(".ul-scroll li").css("width"));
            var scrollMessage = function (el) {
                MojFind(".ul-paging-message li").removeClass("active");
                $(el).addClass("active");
                var index = $(el).index() + 1;
                MojFind(".scroll-messages-wrap ul").animate({ right: -messageWidth }, 100, function () {
                    MojFind(".scroll-messages-wrap ul").css("right", messageWidth).empty();
                    MojFind(".ul-scroll li:nth-child(" + index + ")").clone().appendTo(".scroll-messages-wrap ul");
                    MojFind(".scroll-messages-wrap ul").animate({ right: "0px" }, 800);
                });
            };
            scrollMessage(MojFind(".ul-paging-message li:first-child"));

            function getNextMsg() {
                if (MojFind(".ul-paging-message li.active").index() == MojFind(".ul-paging-message li").size() - 1) {
                    MojFind(".ul-paging-message li:first-child").click();
                } else {
                    MojFind(".ul-paging-message li.active").next().click();
                }
            }
            var scrollMessageLoop = setInterval(getNextMsg, 10000);

            MojFind(".ul-paging-message li").click(function () {
                scrollMessage(this);
            });

            MojFind(".stop-scroll-msg").live("click", function () {
                clearInterval(scrollMessageLoop);
                $(this).removeClass("stop-scroll-msg").addClass("restart-scroll-msg").attr("title", "re-play");
            });
            MojFind(".restart-scroll-msg").live("click", function () {
                getNextMsg();
                scrollMessageLoop = setInterval(getNextMsg, 10000);
                $(this).removeClass("restart-scroll-msg").addClass("stop-scroll-msg").attr("title", "stop");
            });
        }
    },
    wizard: {
        activateMainMenuTab: function (selector) {
            var a = selector.split("_");
            MojFind("[id^=" + a[0] + "]").removeClass("active").attr("aria-selected", "false");
            MojFind("#" + selector).addClass("active").attr("aria-selected", "true");
            if (MojFind("[data-parent-id=" + selector + "]").length > 0) {
                MojFind("[data-parent-id]").removeClass("active").attr("aria-selected", "false");
                MojFind("[data-parent-id=" + selector + "]").addClass("active").attr("aria-selected", "true");
            }
        },
        showSubMenu: function (selector, e, isMainMenuCalled) {
            var a = selector.split("_");
            $(".sub-menu-top-by-main", MojFind("[id^=" + a[0] + "]")).remove();
            if (MojFind("#" + selector).has(".ul-sub-menu").length > 0) {
                if (isMainMenuCalled) {
                    MojFind("#" + selector).append(("<div class='sub-menu-top-by-main'></div>"));
                    MojFind(".sub-menu-back").attr("main-menu-id", selector).html(MojFind("#" + selector + " #submenu_" + a[1]).html());
                    MojFind(".sub-menu-container").show();
                    MojFind("#content").empty();
                    MojFind(".sub-menu-back ul li:first div").click();
                    Moj.wizard.activateMainMenuTab(selector);
                }
                $(e).removeAttr("href");
                return false;
            } else {
                MojFind(".sub-menu-back").attr("main-menu-id", "").empty();
                MojFind(".sub-menu-container").hide();
            }
            return;
        },
        checkChanges: function () {
            var forms = MojFind("form")[0];
            if (typeof (forms) != "undefined") {
                var formId = forms.id;
                if (formId != "" && formId.toLowerCase().indexOf("search") == -1 && formId.toLowerCase().indexOf("list") == -1) {
                    if (MojFind('#' + formId).find("[id='ObjectState']:input[value='true']").length > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        checkChangesIfValid: function (buttonId) {
            var forms = MojFind("form")[0];
            var formId = forms.id;
            if (formId.toLowerCase().indexOf("search") == -1 && formId.toLowerCase().indexOf("list") == -1) {
                var validate = MojFind("#" + formId).validate();
                var isValid = true;
                MojFind("[data-role='tab-content'].active input[type!=hidden], [data-role='tab-content'].active textarea, [data-role='tab-content'].active select").each(function () {
                    if (validate.element($(this)) != undefined) {
                        isValid = isValid & $(this).valid();
                    }
                });
                if (isValid) {
                    return true;
                }
                else {
                    Moj.HandleAccessibleErrorMessages(buttonId);
                    return false;
                }
            } else {
                return true;
            }
        },
        onBeginActionTab: function (e, buttonId) {
            if ($(e).closest("li").attr("disabled") == "disabled") return false;
            if (!Moj.isTrue($(e).closest("li").attr("aria-selected"))) {
                if (MojFind("form").length > 0 && (Moj.isTrue(MojFind("[name='SaveAnyWay']").val()) || Moj.wizard.checkChanges())) {
                    var detailsExsit = MojFind('[id^=div_][id$=_Details], #DetailsContent');
                    var activeDetailsExist = false;
                    $(detailsExsit).each(function () {
                        if ($(this).css("display") != "none" && $(this).html().trim() != "")
                            activeDetailsExist = true;
                    });
                    if (MojFind('[id^=tr_][id$=_Details]').length > 0 || activeDetailsExist) {
                        if (MojFind('[id^=tr_][id$=_Details]').find("input.moj-save-button[type!=submit]").length > 0) {
                            MojFind('[id^=tr_][id$=_Details]').each(function () {
                                if ($(this).find("input[type!=submit]").length > 0) {
                                    var gridName = this.id.split("_")[1];
                                    Moj.HtmlHelpers._closeGridInlineDetails(gridName);
                                }
                            });
                        } else if (Moj.isTrue($(e).attr("data-checkIfGridDetailsExist"))) {
                            Moj.showMessage(window.Resources.Messages.DataNotSaved);
                            return false;
                        }
                    }
                    kendo.ui.progress($("body"), true);
                    var canSave = true;
                    if (MojFind("[name='methodBeforeSave']").val() != "") {
                        var result = eval(MojFind("[name='methodBeforeSave']").val() + "(e)");
                        if (typeof (result) == "boolean")
                            canSave = Moj.isTrue(result);
                    }
                    if (Moj.isTrue(canSave)) {
                        Moj.wizard._saveAndLoadTab(e, buttonId);
                    }
                    kendo.ui.progress($("body"), false);
                    return;
                }
                Moj.wizard.loadActionTab(e);
            }
            else
                MojFind("[data-role='tab-content'].active").find("h2.mcaf").focus();
        },

        _saveAndLoadTab: function (e, buttonId) {
            var checkValidation = true;
            var canSave = true;
            var isPreviousClicked = MojFind("ul[is-previous-clicked='true']").length != 0;
            if (Moj.isFalse(MojFind("ul[check-validation-on-previous]").attr('check-validation-on-previous'))
                && isPreviousClicked) {
                checkValidation = false;
            }
            else {
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
                    isValid = Moj.wizard.checkChangesIfValid(buttonId);
                    if (isValid)
                        isValid = Moj.wizard.submitActionTab().canLoadNextView;
                    if (isValid) {
                        Moj.changeObjectStateToForm(false);
                        if (MojFind("[name='methodAfterSave']").val() != "")
                            eval(MojFind("[name='methodAfterSave']").val());
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
        },

        _handleValidationGroupFoTab: function (e) {
            $(e).attr("original_ig", $(e).attr("data_val_ignorevalidationgroup"));
            $(e).attr("original_ag", $(e).attr("data_val_acceptvalidationgroup"));
            $(e).attr("data_val_ignorevalidationgroup", MojFind("[name='tab_ignorevalidationgroup']").val());
            $(e).attr("data_val_acceptvalidationgroup", MojFind("[name='tab_acceptvalidationgroup']").val());
            handleRules($(e));
        },
        _restoreValidationGroupFoTab: function (e) {
            $(e).attr("data_val_ignorevalidationgroup", $(e).attr("original_ig"));
            $(e).attr("data_val_acceptvalidationgroup", $(e).attr("original_ag"));
        },
        loadActionTab: function (e, isVisibleContentTab, isDataFromParams, callBack) {
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
                $.ajax({
                    type: "POST",
                    url: $(e).attr("data-href"),
                    data: data,
                    contentType: 'application/json',
                    success: function (data) {
                        if (Moj.showErrorMessage(data.Errors) == true) {
                            MojFind("#content-replace").empty();
                            var html = "<h2 class='mcaf offscreen' tabindex='0'>" + $(e).html() + "</h2>" + data + "<a href='javascript:void(0)' class='mcal offscreen' tabindex='0'>last element in content</a>";
                            MojFind("#" + contentTabId).html(html);
                            if (isVisibleContentTab != false) {
                                Moj.wizard._setContentTab(contentTabId, e);
                                MojFind(".main-menu").attr("current-tab-id", tabId);
                                Moj.wizard.enableNavigationButtons(true);
                            }
                            if (callBack != undefined)
                                callBack();

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
                MojFind("#content-replace").empty();
                Moj.wizard._setContentTab(contentTabId, e);
                MojFind(".main-menu").attr("current-tab-id", tabId);
                Moj.wizard.enableNavigationButtons(true);
                kendo.ui.progress($("body"), false);
            }
        },

        loadSpecificTab: function (i, successCallBack) {
            Moj.wizard.loadActionTab(MojFind(".ul-main-menu li.main-menu-item .main-menu-title")[i], i == 0, true, function () {
                i++;

                if (i < MojFind(".ul-main-menu li.main-menu-item .main-menu-title").length) {
                    Moj.wizard.loadSpecificTab(i, successCallBack);
                }
                else {
                    MojFind(".ul-main-menu li:first .main-menu-title").click();
                    if (typeof (successCallBack) != "undefined" && successCallBack != "") {
                        successCallBack();
                    }
                }
            });
        },

        loadAllTabs: function (successCallBack) {
            Moj.wizard.loadSpecificTab(0, successCallBack);
        },

        enableTab: function (item, isEnable) {
            if (!isEnable)
                $(item).attr("disabled", "disabled");
            else {
                $(item).removeAttr("disabled");
            }
        },
        enableAllTabs: function (isEnable, handleNavigation) {
            $(".ul-main-menu li.main-menu-item").each(function () {
                Moj.wizard.enableTab(this, isEnable);
            });
            $(".sub-menu-back .ul-sub-menu li.sub-menu-item").each(function () {
                Moj.wizard.enableTab(this, isEnable);
            });
            if (Moj.isTrue(handleNavigation)) {
                if (isEnable) {
                    Moj.wizard._enableNextButton();
                    Moj.wizard._enablePrevButton();
                } else {
                    Moj.wizard._disabledNextButton(false);
                    Moj.wizard._disabledPrevButton(false);
                }
            }
        },
        _setContentTab: function (contentTabId, e) {
            Moj.enableValidation(MojFind("#" + contentTabId).closest("form"));
            MojFind("[data-role='tab-content']").hide().removeClass("active").attr("aria-hidden", "true");
            MojFind("#" + contentTabId).show().addClass("active").attr("aria-hidden", "false");
            MojFind("[name='tab_ignorevalidationgroup']").val($(e).attr("data_val_ignorevalidationgroup"));
            MojFind("[name='tab_acceptvalidationgroup']").val($(e).attr("data_val_acceptvalidationgroup"));
            eval($(e).attr("data-ajax-success"));
            kendo.ui.progress($("body"), false);
            MojFind("#" + contentTabId).find("h2.mcaf").focus();
            MojFind("#" + contentTabId).find("h2.mcaf").on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9 && e.shiftKey) {
                    e.preventDefault();
                    var prevTab = Moj.wizard.getPrevActionWizardItem();
                    if (prevTab.length > 0)
                        $(prevTab)[0].focus();
                }
            });
            MojFind("#" + contentTabId).find("a.mcal").on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    if (MojFind("#btnGoToNextView").length > 0) {
                        if (MojFind("#btnGoToNextView").attr("disabled") != "disabled")
                            MojFind("#btnGoToNextView").focus();
                        else
                            MojFind("#a-focus-after-wizard").focus();
                    }
                    else {
                        var nextTab = Moj.wizard.getNextActionWizardItem();
                        if (nextTab.length > 0)
                            $(nextTab)[0].focus();
                        else
                            MojFind("#a-focus-after-wizard").focus();
                    }
                }
            });
        },
        submitActionTab: function () {
            kendo.ui.progress($("body"), true);
            var canLoadNextView = false, warnings = false;
            if (MojFind("[name='SaveUrl']").val() == "")
                canLoadNextView = true;
            else {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: MojFind("[name='SaveUrl']").val(),
                    data: $(MojFind('form')[0]).serialize(), // serializes the form's elements.
                    success: function (data) {
                        kendo.ui.progress($("body"), false);
                        var dataErrors = data.Errors != undefined ? data.Errors : "";
                        var dataWarnings = data.Warnings != undefined && data.Warnings != "" ? data.Warnings : null;
                        if (Moj.showErrorMessage(dataErrors)) {
                            //canLoadNextView = true;
                            if (dataWarnings != null) {
                                warnings = true;
                                var warningsList = "";
                                if (dataWarnings instanceof Array == false)
                                    warningsList = dataWarnings;
                                else {
                                    $.each(dataWarnings, function (index, value) {
                                        if (typeof (value.ErrorMessage) != "undefined")
                                            warningsList = warningsList + value.ErrorMessage + "\n";
                                        else
                                            warningsList = warningsList + value + "\n";
                                    });
                                }
                                if (warningsList != "" && warningsList != undefined) {
                                    canLoadNextView = confirm(warningsList);
                                } else {
                                    canLoadNextView = true;
                                }
                            } else
                                canLoadNextView = true;
                            //Moj.showErrorMessage(dataWarnings, null, Resources.Strings.MessageAlert, true, MessageType.Alert);
                        }
                    },
                    error: function () { kendo.ui.progress($("body"), false); },
                    failure: function () { kendo.ui.progress($("body"), false); }
                });
            }
            //return canLoadNextView;
            return {
                canLoadNextView: canLoadNextView,
                warnings: warnings
            };
        },
        onSuccessActionTab: function (e, saveUrl, id, saveAnyWay, mainmenu, successCallBack, methodBeforeSave, methodAfterSave) {
            MojFind("[name='methodBeforeSave']").val(methodBeforeSave);
            MojFind("[name='methodAfterSave']").val(methodAfterSave);
            MojFind("[name='SaveUrl']").val(saveUrl);
            MojFind("[name='SaveAnyWay']").val(saveAnyWay);
            Moj.changeObjectStateToForm(false);

            if (mainmenu != undefined && mainmenu != "") {
                Moj.wizard.activateMainMenuTab(mainmenu);
                Moj.wizard.showSubMenu(mainmenu, e, true);
            } else {
                mainmenu = MojFind("#" + id).closest(".main-menu-item").find(".main-menu-title").attr("id") + "_div";
                Moj.wizard.activateMainMenuTab(mainmenu);
                Moj.wizard.showSubMenu(mainmenu, e, false);
                if (MojFind("[data-parent-id=" + id + "]").length > 0) {
                    MojFind("[data-parent-id]").removeClass("active").attr("aria-selected", "false");
                    MojFind("[data-parent-id=" + id + "]").addClass("active").attr("aria-selected", "true");
                }
                MojFind(".sub-menu-container .ul-sub-menu li").removeClass("active").attr("aria-selected", "false");
                MojFind(".sub-menu-container .ul-sub-menu li[id=" + id + "]").addClass("active").attr("aria-selected", "true");
            }
            if (typeof (successCallBack) != "undefined" && successCallBack != "")
                eval(successCallBack);
            kendo.ui.progress($("body"), false);
        },
        onFailureActionTab: function () {
            kendo.ui.progress($("body"), false);
            Moj.showMessage(Resources.Strings.InnerErrorMessage);
        },
        getPrevActionWizardItem: function (fromFocused) {
            var activeSelector = Moj.isTrue(fromFocused) ? " [data-role=submit]:focus" : ".active";
            var currentUl, currentLi;
            var prevActionLink = [];
            if (MojFind(".ul-metro li").size() > 0) {
                $(MojFind(".ul-metro li:not([disabled])").get().reverse()).each(function (i, e) {
                    if ($(e).index() < MojFind(".ul-metro li.active").index() && $(e).attr("disabled") != "disabled") {
                        prevActionLink = $(e);
                        return false;
                    }
                });
            } else {
                var hasSubMenu = Moj.isTrue(fromFocused) && MojFind(".ul-main-menu > li [data-role=submit]:focus").length > 0 ?
                    MojFind(".ul-main-menu > li [data-role=submit]:focus").attr("data-submenu") &&
                    MojFind(".sub-menu-back").attr("main-menu-id") == MojFind(".ul-main-menu > li [data-role=submit]:focus").closest("li").id :
                    MojFind(".sub-menu-back").html() != "";
                console.log(hasSubMenu);
                if (Moj.isTrue(hasSubMenu)) {
                    currentUl = MojFind(".sub-menu-container .ul-sub-menu li" + activeSelector).closest("ul");
                    currentLi = Moj.isTrue(fromFocused) ? $("li" + activeSelector, currentUl).closest("li") : $("li.active", currentUl);
                    $(MojFind(".sub-menu-container .ul-sub-menu > li:not([disabled])").get().reverse()).each(function (i, e) {
                        if ($(e).index() < $(currentLi).index() && $(e).attr("disabled") != "disabled") {
                            prevActionLink = $("div.sub-menu-title", e);
                            return false;
                        }
                    });
                    //there is no more sub items to prev them
                    if (typeof (prevActionLink) == "undefined" || prevActionLink.length == 0) {
                        console.log("there is no more sub items to prev them");
                        currentUl = MojFind(".ul-main-menu > li.active").closest("ul");
                        $(MojFind(".ul-main-menu > li:not([disabled])").get().reverse()).each(function (i, e) {
                            if ($(e).index() < $("li.active", currentUl).index() && $(e).attr("disabled") != "disabled") {
                                prevActionLink = $("div.main-menu-title", e);
                                return false;
                            }
                        });
                    }
                } else {
                    currentUl = MojFind(".ul-main-menu > li" + activeSelector).closest("ul");
                    currentLi = Moj.isTrue(fromFocused) ? $("li" + activeSelector, currentUl).closest("li") : $("li.active", currentUl);
                    $(MojFind(".ul-main-menu > li:not([disabled])").get().reverse()).each(function (i, e) {
                        if ($(e).index() < $(currentLi).index() && $(e).attr("disabled") != "disabled") {
                            prevActionLink = $("div.main-menu-title", e);
                            return false;
                        }
                    });
                }
            }
            return prevActionLink;
        },
        goToPrevView: function () {
            var prevActionLink = Moj.wizard.getPrevActionWizardItem();
            if (prevActionLink != undefined && prevActionLink.length > 0) {
                var checkValidationOnPrevios = MojFind("ul[check-validation-on-previous]").attr('check-validation-on-previous');
                if (Moj.isFalse(checkValidationOnPrevios)) {
                    MojFind("ul[check-validation-on-previous]").attr('is-previous-clicked', true);
                }
                if (MojFind(".ul-metro li").size() > 0 && !Moj.isTrue(MojFind(".main-menu").data("mojWizard").enableNavigationByMetro))
                    eval($($(prevActionLink)[0]).attr("data-onclick"));
                else {
                    if ($(prevActionLink[0]).parent().hasClass("ul-metro"))
                        $(prevActionLink)[0].click();
                    else
                        return Moj.wizard.onBeginActionTab(prevActionLink[0], "btnGoToPrevView");
                }
            }
        },
        getNextActionWizardItem: function (fromFocused) {
            var activeSelector = Moj.isTrue(fromFocused) ? " [data-role=submit]:focus" : ".active";
            var currentUl, currentLi;
            var nextActionLink = [];
            if (MojFind(".ul-metro li").size() > 0) {
                MojFind(".ul-metro li:not([disabled])").each(function (i, e) {
                    if ($(e).index() > MojFind(".ul-metro li.active").index() && $(e).attr("disabled") != "disabled") {
                        nextActionLink = $(e);
                        return false;
                    }
                });
            } else {
                //if is menu item with sub menu
                var hasSubMenu = Moj.isTrue(fromFocused) && MojFind(".ul-main-menu > li [data-role=submit]:focus").length > 0 ?
                    MojFind(".ul-main-menu > li [data-role=submit]:focus").attr("data-submenu") &&
                    MojFind(".sub-menu-back").attr("main-menu-id") == MojFind(".ul-main-menu > li [data-role=submit]:focus").closest("li").id :
                    MojFind(".sub-menu-back").html() != "";
                if (Moj.isTrue(hasSubMenu)) {
                    currentUl = MojFind(".sub-menu-container .ul-sub-menu li" + activeSelector).closest("ul");
                    currentLi = Moj.isTrue(fromFocused) ? $("li" + activeSelector, currentUl).closest("li") : $("li.active", currentUl);
                    MojFind(".sub-menu-container .ul-sub-menu > li:not([disabled])").each(function (i, e) {
                        if ($(e).index() > $(currentLi).index() && $(e).attr("disabled") != "disabled") {
                            nextActionLink = $("div.sub-menu-title", e);
                            return false;
                        }
                    });
                    //there is no more sub items to next them
                    if (typeof (nextActionLink) == "undefined" || nextActionLink.length == 0) {
                        currentUl = MojFind(".ul-main-menu > li.active").closest("ul");
                        MojFind(".ul-main-menu > li:not([disabled])").each(function (i, e) {
                            if ($(e).index() > $("li.active", currentUl).index() && $(e).attr("disabled") != "disabled") {
                                nextActionLink = $("div.main-menu-title", e);
                                return false;
                            }
                        });
                    }
                } else {
                    currentUl = MojFind(".ul-main-menu > li" + activeSelector).closest("ul");
                    currentLi = Moj.isTrue(fromFocused) ? $("li" + activeSelector, currentUl).closest("li") : $("li.active", currentUl);
                    MojFind(".ul-main-menu > li:not([disabled])").each(function (i, e) {
                        if ($(e).index() > $(currentLi).index() && $(e).attr("disabled") != "disabled") {
                            nextActionLink = $("div.main-menu-title", e);
                            return false;
                        }
                    });
                }
            }
            return nextActionLink;
        },
        goToNextView: function () {
            var nextActionLink = Moj.wizard.getNextActionWizardItem();
            if (nextActionLink != undefined && nextActionLink.length > 0) {
                if (MojFind(".ul-metro li").size() > 0 && !Moj.isTrue(MojFind(".main-menu").data("mojWizard").enableNavigationByMetro))
                    eval($($(nextActionLink)[0]).attr("data-onclick"));
                else {
                    if ($(nextActionLink[0]).parent().hasClass("ul-metro"))
                        $(nextActionLink)[0].click();
                    else
                        return Moj.wizard.onBeginActionTab(nextActionLink[0], "btnGoToNextView");
                }
            }
        },
        onCancleViewSaving: function () {
            Moj.changeObjectStateToForm(false);
            MojFind(".sub-menu-container .ul-sub-menu li.active div").click();
        },
        _disabledNextButton: function (isHide) {
            MojFind("#div_btnGoToNextView,#div_btnGoToNextView input").attr("disabled", "disabled").attr("aria-hidden", "true");
            if (isHide) {
                MojFind("#div_btnGoToNextView").hide();
                if (MojFind(".main-menu").data("mojWizard") != undefined && Moj.isTrue(MojFind(".main-menu").data("mojWizard").IsSubmitEndProcsess)) {
                    MojFind("#div_btnWizardAction").show();
                }
            }
        },
        _enableNextButton: function () {
            MojFind("#div_btnGoToNextView,#div_btnGoToNextView input").removeAttr("disabled").removeAttr("aria-hidden");
            MojFind("#div_btnGoToNextView").show();
            MojFind("#div_btnWizardAction").hide();
        },
        _disabledPrevButton: function (isHide) {
            MojFind("#div_btnGoToPrevView,#div_btnGoToPrevView input").attr("disabled", "disabled").attr("aria-hidden", "true");
            if (isHide)
                MojFind("#div_btnGoToPrevView").hide();
        },
        _enablePrevButton: function () {
            MojFind("#div_btnGoToPrevView,#div_btnGoToPrevView input").removeAttr("disabled").removeAttr("aria-hidden");
            MojFind("#div_btnGoToPrevView").show();
        },
        _hasCancel: function (hasCancel) {
            if (Moj.isTrue(hasCancel))
                MojFind("#div_btnCancleViewSaving").parent().show();
            else
                MojFind("#div_btnCancleViewSaving").parent().hide();
        },
        enableNavigationButtons: function (isEnable) {
            if (Moj.isTrue(isEnable) || typeof (isEnable) == "undefined") {
                Moj.wizard._enableNextButton();
                Moj.wizard._enablePrevButton();

                var isLast = false, isFirst = false, currentTab, activeIndex, tabsCount;
                if (MojFind(".ul-metro li").size() > 0) {
                    currentTab = MojFind(".ul-metro li.active");
                    activeIndex = currentTab.index();
                    tabsCount = MojFind(".ul-metro li").length;
                    isLast = currentTab.is(":last-child") || MojFind(".ul-metro li:gt(" + activeIndex + ")").filter("[disabled]").length == (tabsCount - (activeIndex + 1));
                    isFirst = currentTab.is(":first-child") || MojFind(".ul-metro li:lt(" + activeIndex + ")").filter("[disabled]").length == activeIndex;
                } else {
                    //MojFind(".ul-main-menu[wizard='True'] > li.active:not(.ul-main-menu[wizard='True'] > li.active~.ul-main-menu[wizard='True'] > li.active) ")

                    var isFirstMainMenuItem = MojFind(".ul-main-menu[wizard='True'] > li.active:not(li.main-menu-item:not([disabled])~li.main-menu-item:not([disabled]))").length > 0;
                    var isLastMainMenuItem = MojFind(".ul-main-menu[wizard='True'] > li.active").is(":last-child");
                    var hasSubMenu = MojFind(".sub-menu-back").html() != "";

                    if (hasSubMenu) {
                        //אם זה הטאב הראשון ויש תת תפריט ובתת תפריט נבחר הראשון אז לעולם ראשון
                        isFirstSubItem = MojFind(".ul-sub-menu li.active:not(li.sub-menu-item:not([disabled])~li.sub-menu-item:not([disabled]))").length > 0;
                        if (isFirstMainMenuItem && hasSubMenu && isFirstSubItem) {
                            isFirst = true;
                        }
                        //אם זה הטאב האחרון ויש תת תפריט ובתת תפריט נבחר האחרון אז לעולם אחרון
                        else if (isLastMainMenuItem && hasSubMenu && MojFind(".ul-sub-menu li.active").is(":last-child")) {
                            isLast = true;
                        }
                    }
                    else {
                        currentTab = MojFind(".ul-main-menu[wizard='True'] li.active");
                        tabsCount = MojFind(".ul-main-menu[wizard='True'] li").length;
                        activeIndex = currentTab.index();
                        isLast = currentTab.is(":last-child") || MojFind(".ul-main-menu[wizard='True'] li:gt(" + activeIndex + ")").filter("[disabled]").length == (tabsCount - (activeIndex + 1));
                        isFirst = currentTab.is(":first-child") || MojFind(".ul-main-menu[wizard='True'] li:lt(" + activeIndex + ")").filter("[disabled]").length == activeIndex;
                    }
                }
                if (Moj.isTrue(isLast))
                    Moj.wizard._disabledNextButton(true);
                if (Moj.isTrue(isFirst))
                    Moj.wizard._disabledPrevButton(true);
            } else {
                Moj.wizard._disabledNextButton(false);
                Moj.wizard._disabledPrevButton(false);
            }
        },
        reloadCurrentTab: function () {
            Moj.wizard.loadActionTab(MojFind("[id^='" + MojFind(".main-menu").attr("current-tab-id") + "'] [data-reload]"));
        },
        saveCurrentTab: function () {
            if (Moj.isTrue(MojFind("[name='SaveAnyWay']").val()) || Moj.wizard.checkChanges()) {
                var detailsExsit = MojFind('[id^=div_][id$=_Details]');
                var activeDetailsExist = false;
                $(detailsExsit).each(function () {
                    if ($(this).css("display") != "none" && $(this).html().trim() != "")
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
                if (Moj.wizard.checkChangesIfValid()) {
                    var canSave = true;
                    if (MojFind("[name='methodBeforeSave']").val() != "") {
                        var result = eval(MojFind("[name='methodBeforeSave']").val() + "()");
                        if (typeof (result) == "boolean")
                            canSave = Moj.isTrue(result);
                    }
                    if (Moj.isTrue(canSave))
                        return Moj.wizard.submitActionTab().canLoadNextView;
                    else
                        return false;
                }
                else
                    MojFind(".moj-panel:has(span.field-validation-error) .plus").click();

            } else {
                return true;
            }
            return false;
        },
        createMetro: function () {
            var listForMetro = [];
            MojFind(".ul-main-menu li .main-menu-title[data-formetro=True]").each(function () {
                if (Moj.isTrue($(this).attr("data-submenu"))) {
                    $(".sub-menu-title", $(this).parent()).each(function () {
                        if (Moj.isTrue($(this).attr("data-formetro"))) {
                            listForMetro.push(this);
                        }
                    });
                } else {
                    listForMetro.push(this);
                }
            });
            listForMetro.sort(function (a, b) {
                return $(a).attr("data-indexForMetro") - $(b).attr("data-indexForMetro");
            });
            $(listForMetro).each(function () {
                Moj.wizard.addItemToMetro($(this).attr("id"), $(this).closest("li").attr("id"), $(this).html(), $(this).closest("li").attr("disabled") != "disabled");
            });
        },
        addItemToMetro: function (id, parentId, name, isEnable) {
            var metroItem = $("<li/>", {
                'data-id': id,
                'data-parent-id': parentId
            });
            if (Moj.isTrue(MojFind(".main-menu").data("mojWizard").enableNavigationByMetro)) {
                metroItem.attr("onclick", "Moj.wizard.onMetroClick('" + id + "')");
                metroItem.attr("style", "cursor: pointer !important;");
            }
            else
                metroItem.attr("data-onclick", "Moj.wizard.onMetroClick('" + id + "')");
            if (!Moj.isTrue(isEnable)) {
                metroItem.attr("disabled", "disabled");
            }
            $("<div/>", {
                'class': 'seperator right-seperator'
            }).appendTo(metroItem);
            $("<div/>", {
                'class': 'icon'
            }).appendTo(metroItem);
            $("<div/>", {
                'class': 'seperator left-seperator'
            }).appendTo(metroItem);
            $("<div/>", {
                'style': 'clear: both;'
            }).appendTo(metroItem);
            $("<a>" + name + "</a>").appendTo(metroItem);
            $(metroItem).appendTo(MojFind(".ul-metro"));
        },
        onMetroClick: function (id) {
            MojFind(".main-menu-title#" + id + ", .main-menu-item .sub-menu-title#" + id).click();
        },
        hideTopMenuWizard: function () {
            MojFind(".main-menu").hide();
        },
        initWizard: function () {
            MojFind(".ul-main-menu li.active .main-menu-title").click();
            MojFind("ul.ul-main-menu .main-menu-title, ul.ul-sub-menu .sub-menu-title").live("keypress", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 13) {
                    e.preventDefault();
                    e.currentTarget.click();
                }
            });
            MojFind("ul.ul-main-menu .main-menu-title, ul.ul-sub-menu .sub-menu-title").live("keydown", function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9 && e.shiftKey) {
                    e.preventDefault();
                    var prevTab = Moj.wizard.getPrevActionWizardItem(true);
                    if (prevTab.length > 0)
                        $(prevTab)[0].focus();
                    else
                        MojFind("#a-focus-before-wizard").focus();
                }
                else if (keyCode == 9) {
                    e.preventDefault();
                    var nextTab = Moj.wizard.getNextActionWizardItem(true);
                    if (nextTab.length > 0)
                        $(nextTab)[0].focus();
                    else
                        MojFind("#a-focus-after-wizard").focus();
                }
            });
            MojFind("#btnGoToNextView").on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    if (MojFind("#btnGoToPrevView").attr("disabled") != "disabled")
                        MojFind("#btnGoToPrevView").focus();
                    else {
                        var nextTab = Moj.wizard.getNextActionWizardItem();
                        if (nextTab.length > 0)
                            $(nextTab)[0].focus();
                    }
                }
            });
            MojFind("#btnGoToPrevView").on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    e.preventDefault();
                    var nextTab = Moj.wizard.getNextActionWizardItem();
                    if (nextTab.length > 0)
                        $(nextTab)[0].focus();
                }
            });
        }
    },
    docFontSizeType: { large: "large", normal: 'normal', small: 'small' },
    docFontSizes: { large: '16px', normal: '14px', small: '12px' },
    changeDocFontSize: function (fontSizeName) {
        var body = document.getElementsByTagName('body')[0];
        body.style.fontSize = Moj.docFontSizes[fontSizeName];
    },

    changeLang: function (culture) {
        $.get(baseUrl + "/Home/ChangeLang?culture=" + culture, function () {
            window.location.reload();
        })
    },

    IsSupportBrowser: function (isSupportEdge, isSupportFF) {
        if ((isInternetExplorer() && isInternetExplorer() < 9) || (!isEdge() && !isSupportEdge) || (!isSupportFF && !isFF())) {
            window.location.href = baseUrl + "/Home/UnsupportedBrowser";
        }
    },

    openFirstGridDetailAction: function (gridName) {
        var grid = MojFind("[id^='" + gridName + "']");
        var firstRowToExpand = grid.find("tbody tr").eq(0).find(".k-hierarchy-cell .k-plus");
        if (firstRowToExpand.length > 0) {
            firstRowToExpand.trigger("click");
            firstRowToExpand.trigger("mousedown");
        }
    },

    openNextGridDetailAction: function (gridName) {
        var grid = MojFind("[id^='" + gridName + "']");
        var kgrid = grid.data("kendoGrid");

        var nextRowToExpand = grid.find(".k-hierarchy-cell .k-minus").closest("tr").next().next().find(".k-hierarchy-cell .k-plus");
        if (nextRowToExpand.length > 0) {
            kgrid.select(grid.find(".k-hierarchy-cell .k-minus").closest("tr").next().next());
            nextRowToExpand.trigger("click");
        } else {
            var nextPager = grid.find(".k-pager-numbers.k-reset").find("span.k-state-selected").closest("li").next().find(".k-link");
            if (nextPager.length > 0) {
                nextPager.trigger("click");
                kgrid.select(grid.find(".k-master-row").eq(0));
                grid.find(".k-master-row").eq(0).find(".k-hierarchy-cell .k-plus").trigger("click");
            } else {
                kgrid.select(grid.find(".k-master-row"));
                grid.find(".k-master-row").find(".k-hierarchy-cell .k-minus").trigger("click");
            }
        }
    },

    collapseGridDetailAction: function (gridName) {
        var grid = MojFind("[id^='" + gridName + "']");
        var rowToExpand = grid.find(".k-hierarchy-cell .k-minus");
        if (rowToExpand.length > 0) {
            rowToExpand.trigger("click");
        }
    },

    isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },

    generateRelativePath: function (a) {
        var path = $(a).data("href");
        var http = "http";
        if (!(path.slice(0, http.length) == http)) {
            path = baseUrl + path;
        }
        Moj.redirect(path);
    },

    initBreadCrumbs: function () {
        if ($(".web-site-container.bread-crumbs").length > 0) {
            var currentAction = $(".web-site-container.bread-crumbs").attr("data-action");
            if ($("a[data-href$='" + currentAction + "'],a[href$='" + currentAction + "']").closest("ul").closest("li").find("a").length > 0)
                $(".web-site-container.bread-crumbs").append("<li>" + $("a[data-href$='" + currentAction + "'],a[href$='" + currentAction + "']").closest("ul").closest("li").find("a").first().clone().html() + "</li>");
            if ($("a[data-href$='" + currentAction + "'],a[href$='" + currentAction + "']").closest("li").find("a").length > 0) {
                $(".web-site-container.bread-crumbs").append("<li>" + $("a[data-href$='" + currentAction + "'],a[href$='" + currentAction + "']").closest("li").find("a").parent().html() + "</li>");
            }
        }
    },

    fixPopupHeight: function () {
        var x = parseInt($(".moj-window-container-content").outerHeight()) + 105;
        $(".k-widget.k-window").css("height", x);
        $(".k-widget.k-window .scroll").css("height", parseInt($(".moj-window-container-content").outerHeight()) + 20);
    }
};

var validationErrorhoverIntentSetting = {
    over: function (e) {
        $(this).animate({ height: '24px', opacity: 1 }, "fast", "swing");
        $(this).find("span").animate({ fontSize: '17px', lineHeight: '24px', fontWeight: 'bold' }, "fast", "swing");
    },
    out: function (e) {
        $(this).animate({ height: '19px', opacity: 0.8 }, "fast", "swing");
        $(this).find("span").animate({ fontSize: '14px', lineHeight: '19px' }, "fast", "swing");
    },
    selector: '.field-validation-error',
    timeout: 100,
    interval: 100
};

//Sort Date column (by string)
//------kendo override for sorting date string
(function ($, undefined) {
    function normalizeSort(field, dir) {
        if (field) {
            var descriptor = typeof field === "string" ? { field: field, dir: dir } : field,
                descriptors = $.isArray(descriptor) ? descriptor : (descriptor !== undefined ? [descriptor] : []);

            return $.grep(descriptors, function (d) { return !!d.dir; });
        }
    };
    kendo.data.Query.prototype.orderBy = function (selector) {
        var result = this.data.slice(0),
            comparer = $.isFunction(selector) || !selector ? Comparer.asc(selector) : selector.compare;

        return new kendo.data.Query(result.sort(comparer));
    };
    kendo.data.Query.prototype.sort = function (field, dir, comparer) {
        var idx,
            length,
            descriptors = normalizeSort(field, dir),
            comparers = [];

        comparer = comparer || Comparer;

        if (descriptors.length) {
            for (idx = 0, length = descriptors.length; idx < length; idx++) {
                comparers.push(comparer.create(descriptors[idx]));
            }

            return this.orderBy({ compare: comparer.combine(comparers) });
        }

        return this;
    };
    var Comparer = {
        selector: function (field) {
            return $.isFunction(field) ? field : kendo.getter(field);
        },

        asc: function (field) {
            var selector = this.selector(field);
            return function (a, b) {
                a = selector(a);
                b = selector(b);
                try {
                    var a1 = kendo.parseDate(a, "dd/MM/yyyy");
                    var b1 = kendo.parseDate(b, "dd/MM/yyyy");
                    a = a1 != null ? a1 : a;
                    b = b1 != null ? b1 : b;
                } catch (error) {

                }

                return a > b ? 1 : (a < b ? -1 : 0);
            };
        },

        desc: function (field) {
            var selector = this.selector(field);
            return function (a, b) {
                a = selector(a);
                b = selector(b);

                try {
                    var a1 = kendo.parseDate(a, "dd/MM/yyyy");
                    var b1 = kendo.parseDate(b, "dd/MM/yyyy");
                    a = a1 != null ? a1 : a;
                    b = b1 != null ? b1 : b;
                } catch (error) {

                }


                return a < b ? 1 : (a > b ? -1 : 0);
            };
        },

        create: function (descriptor) {
            return this[descriptor.dir.toLowerCase()](descriptor.field);
        },

        combine: function (comparers) {
            return function (a, b) {
                var result = comparers[0](a, b),
                    idx,
                    length;

                for (idx = 1, length = comparers.length; idx < length; idx++) {
                    result = result || comparers[idx](a, b);
                }

                return result;
            };
        }
    };

})(jQuery);
//------end kendo override

clearSelection = function () {
    if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  // IE?
        document.selection.empty();
    }
}

String.format = function () {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
}

String.IsNullOrEmpty = function (val) {
    if (val === undefined || val == null || val.length <= 0 || val == '')
        return true;
    return false;
}


String.prototype.mojSplice = function (start, delCount, newSubStr) {
    if (start != undefined && delCount != undefined && newSubStr != undefined)
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    return this;
};


var State = {
    bindPopstateToWindow: function () {

        onpopstate = function (event) {
            if (event.state != null) {
                if (event.state.html != null) {
                    $("#content").html(event.state.html);
                    document.title = event.state.title;
                }
            }
            else {
                location.reload();
            }
        };
    },

    pushState: function (data) {
        if (data.toString().indexOf("ErrorHandler") == -1) {
            if (data.Errors != undefined && data.Errors.length > 0) {
                Moj.showMessage(data.Errors);
            }
            else {
                var state = { html: data.html, title: data.title };
                $("#content").html(data.html);
                document.title = data.title;
                if (history.pushState != undefined)
                    history.pushState(state, null, data.pathName);
            }
        }
    }
}

Moj.addConstant("defaultSelectedTabContent", document);
Moj.addConstant("selectedTabContent", document);
Moj.addConstant("IsInAction", false);
Moj.addConstant("DocumetFormats", "png, pdf, doc, txt, jpeg, jpg, ppt, pptx, tif, tiff, xls, xlsx, xml,zip,zg1,msg,html,htm");