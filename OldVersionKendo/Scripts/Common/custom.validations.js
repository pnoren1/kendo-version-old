//--------Security-----------

jQuery.validator.unobtrusive.adapters.add('security', function (options) {
    options.rules['security'] = options.params;
    options.messages['security'] = options.message;
});

jQuery.validator.addMethod("security", function (value, element, params) {
    var reg = /^$|^[^<>%\|+=#$\&\*\?\\]*$/;
    if (reg.test(value) == false)
        return false
    return true;
});

//--------SecurityNote-----------

jQuery.validator.unobtrusive.adapters.add('securitynote', function (options) {
    options.rules['securitynote'] = options.params;
    options.messages['securitynote'] = options.message;
});

jQuery.validator.addMethod("securitynote", function (value, element, params) {
    var reg = /^$|^[^<>%\|+=#$\&\*\\]*$/;
    if (reg.test(value) == false)
        return false
    return true;
});

//--------securityif-----------

jQuery.validator.unobtrusive.adapters.add('securityif', ['dependentproperty', 'targetvalue'], function (options) {
    options.rules['securityif'] = {
        dependentproperty: options.params['dependentproperty'],
        targetvalue: options.params['targetvalue']
    };
    options.messages['securityif'] = options.message;
});

jQuery.validator.addMethod("securityif", function (value, element, params) {
    var name = foolproof.getName(element, params['dependentproperty']);
    // get the target value (as a string,
    // as that's what actual value will be)
    var targetvalue = params['targetvalue'];
    targetvalue = (targetvalue == null ? '' : targetvalue).toString();
    var control = MojFind('[name="' + name + '"]');
    var controltype = control.attr('type');
    var controlValue =
    controltype === 'checkbox' ?
    control.attr('checked') ? "true" : "false" : control.val();

    if (targetvalue.toString().toLowerCase() == controlValue.toString().toLowerCase()) {
        return $.validator.methods.security.call(this, value, element, params);
    }

    return true;
});

//-------- BooleanRequired-----------

jQuery.validator.unobtrusive.adapters.add('booleanrequired', function (options) {
    options.rules['booleanrequired'] = options.params;
    options.messages['booleanrequired'] = options.message;
});

jQuery.validator.addMethod("booleanrequired", function (value, element, params) {
    return element.checked;
});

//--------LessOrEqualCurrentDate-----

jQuery.validator.unobtrusive.adapters.add('lessorequalcurrentdate', function (options) {
    options.rules['lessorequalcurrentdate'] = options.params;
    options.messages['lessorequalcurrentdate'] = options.message;
});

jQuery.validator.addMethod("lessorequalcurrentdate", function (value, element, params) {
    if (value == null)
        return true
    else if (new Date(value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")) > Date.now())
        return false;
    return true;
});

//--------numeric between--------------------

jQuery.validator.unobtrusive.adapters.add('numericbetween', ['from', 'to'], function (options) {
    options.rules['numericbetween'] = {
        from: options.params['from'],
        to: options.params['to']
    };
    options.messages['numericbetween'] = options.message;
});

jQuery.validator.addMethod("numericbetween", function (value, element, params) {
    return parseFloat(value) >= parseFloat(params['from']) && parseFloat(value) <= parseFloat(params['to']);
});

//--------IdentificationNo-----------

jQuery.validator.unobtrusive.adapters.add('identificationno', function (options) {
    options.rules['identificationno'] = options.params;
    options.messages['identificationno'] = options.message;
});

jQuery.validator.addMethod("identificationno", function (value, element, params) {

    if ($.trim(value) == "")
        return true;

    if (value.length != 9) {
        str = "000000000" + value;
        str = str.substr(value.length, 9);
        value = str;
    }

    if (value == "000000000")
        return false;

    if (/^\d+$/.test(value) == false) {
        return false;
    }
    else {
        var idnum1 = parseInt(value.substr(0, 1)) * 1;
        var idnum2 = parseInt(value.substr(1, 1)) * 2;
        var idnum3 = parseInt(value.substr(2, 1)) * 1;
        var idnum4 = parseInt(value.substr(3, 1)) * 2;
        var idnum5 = parseInt(value.substr(4, 1)) * 1;
        var idnum6 = parseInt(value.substr(5, 1)) * 2;
        var idnum7 = parseInt(value.substr(6, 1)) * 1;
        var idnum8 = parseInt(value.substr(7, 1)) * 2;
        var idnum9 = parseInt(value.substr(8, 1)) * 1;

        if (idnum1 > 9) idnum1 = (idnum1 % 10) + 1;
        if (idnum2 > 9) idnum2 = (idnum2 % 10) + 1;
        if (idnum3 > 9) idnum3 = (idnum3 % 10) + 1;
        if (idnum4 > 9) idnum4 = (idnum4 % 10) + 1;
        if (idnum5 > 9) idnum5 = (idnum5 % 10) + 1;
        if (idnum6 > 9) idnum6 = (idnum6 % 10) + 1;
        if (idnum7 > 9) idnum7 = (idnum7 % 10) + 1;
        if (idnum8 > 9) idnum8 = (idnum8 % 10) + 1;
        if (idnum9 > 9) idnum9 = (idnum9 % 10) + 1;

        var sumval = idnum1 + idnum2 + idnum3 + idnum4 + idnum5 + idnum6 + idnum7 + idnum8 + idnum9;

        sumval = sumval % 10;
        if (sumval > 0) {
            return false;
        }
        else
            return true;
    }

});


//--------IdentificationNoif-----------

jQuery.validator.unobtrusive.adapters.add('identificationnoif', ['dependentproperty', 'targetvalue'], function (options) {
    options.rules['identificationnoif'] = {
        dependentproperty: options.params['dependentproperty'],
        targetvalue: options.params['targetvalue']
    };
    options.messages['identificationnoif'] = options.message;
});

jQuery.validator.addMethod("identificationnoif", function (value, element, params) {

    var name = foolproof.getName(element, params['dependentproperty']);
    // get the target value (as a string, 
    // as that's what actual value will be)
    var targetvalue = params['targetvalue'];
    targetvalue = (targetvalue == null ? '' : targetvalue).toString();
    var control = MojFind('[name="' + name + '"]');
    var controltype = control.attr('type');
    var controlValue =
    controltype === 'checkbox' ?
    control.attr('checked') ? "true" : "false" :
    controltype == 'radio' ?
    MojFind('[name="' + name + '"]:radio:checked').val() :
    control.val();
    if (targetvalue.toString().toLowerCase() == controlValue.toString().toLowerCase()) {
        return $.validator.methods.identificationno.call(this, value, element, params);
    }

    return true;
});

//--------requiredifMultipleValues-----------

$.validator.addMethod('requiredifmultiplevalues',
    function (value, element, parameters) {

        var name = foolproof.getName(element, parameters['dependentproperty']);
        // get the target value (as a string, 
        // as that's what actual value will be)
        var targetvalue = parameters['targetvalue'];
        targetvalue = (targetvalue == null ? '' : targetvalue).toString();

        var targetvaluearray = targetvalue.split('|');

        for (var i = 0; i < targetvaluearray.length; i++) {

            // get the actual value of the target control
            // note - this probably needs to cater for more 
            // control types, e.g. radios
            var control = MojFind('[name="' + name + '"]');
            var controltype = control.attr('type');
            var actualvalue =
            controltype === 'checkbox' ?
            control.attr('checked') ? "true" : "false" :
            controltype == 'radio' ?
            MojFind('[name="' + name + '"]:radio:checked').val() :
            control.val();

            // if the condition is true, reuse the existing 
            // required field validator functionality
            if (targetvaluearray[i] === actualvalue) {
                return $.validator.methods.required.call(this, value, element, parameters);
            }
        }

        return true;
    }
);

$.validator.unobtrusive.adapters.add(
    'requiredifmultiplevalues',
    ['dependentproperty', 'targetvalue'],
    function (options) {
        options.rules['requiredifmultiplevalues'] = {
            dependentproperty: options.params['dependentproperty'],
            targetvalue: options.params['targetvalue']
        };
        options.messages['requiredifmultiplevalues'] = options.message;
    });

//--------requiredifexpression-----------

//(function ($) {
    // The following functions are taken from jquery.validate.unobtrusive: getModelPrefix, appendModelPrefix
    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }
    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    function getPropertyValue(propertyName, dataType, prefix) {

        var name = appendModelPrefix(propertyName, prefix);

        // get the actual value of the target control
        // note - this probably needs to cater for more 
        // control types, e.g. radios
        var control = MojFind('*[name=\'' + name + '\']');
        var controlType = control.attr('type');
        var actualValue =
            controlType === 'checkbox' ?
            control.attr('checked') ? true : false :
            controlType == 'radio' ?
            MojFind('[name="' + name + '"]:radio:checked').val() :
            control.val();

        if (actualValue == "True" || actualValue == "False" || actualValue == "true" || actualValue == "false")
            return Moj.isTrue(actualValue);
        //var dateControl = control.data("kendoDatePicker");
        //if (dateControl != undefined) {
        //    actualValue = dateControl.value();
        //}
        return actualValue;
    }

    function getPropertyValue2(element, propertyName) {
        name = foolproof.getName(element, propertyName);
        // get the actual value of the target control
        // note - this probably needs to cater for more 
        // control types, e.g. radios
        var control = $('*[name=\'' + name + '\']');
        var controlType = control.attr('type');
        var actualValue =
                controlType === 'checkbox' ?
                    control.attr('checked') :
                    control.val();
        if (actualValue == "True" || actualValue == "False" || actualValue == "true" || actualValue == "false")
            return Moj.isTrue(actualValue);

        return actualValue;
    }

    $.validator.addMethod('requiredifexpression',
        function (value, element, parameters) {

            var validatorFunc = parameters.validatorFunc;
            var result = validatorFunc();
            if (result) {
                // if the condition is true, reuse the existing 
                // required field validator functionality
                return $.validator.methods.required.call(this, value, element, parameters);
            }
            return true;
        }
    );

    $.validator.unobtrusive.adapters.add('requiredifexpression',
        ['expression'], // what attributes do we want
        function (options) {
            var prefix = getModelPrefix(options.element.name);
            var expression = options.params['expression'];
            var gv = function (propertyName, dataType) { return getPropertyValue(propertyName, dataType, prefix); };
            eval('function theValidator(gv) { return ' + expression + ';}');
            options.rules['requiredifexpression'] = {
                validatorFunc: function () {
                    return theValidator(gv);
                }
            };
            options.messages['requiredifexpression'] = options.message;
        }
    );

//})(jQuery);


//--------customjsfunc-----------
jQuery.validator.unobtrusive.adapters.add('customjsfunc', ['javascriptfunction'], function (options) {
    options.rules['customjsfunc'] = options.params;
    options.messages['customjsfunc'] = options.message;
});

jQuery.validator.addMethod("customjsfunc", function (value, element, params) {
    var res = eval(params["javascriptfunction"] + "(value,element)");
    var message = res.message;
    if (!res.valid) {
        $(element).closest("form").validate().settings.messages[$(element).attr("name")].customjsfunc = message;
    }
    return res.valid;
});


//--------rangedate-----------
jQuery.validator.unobtrusive.adapters.add('rangedate', ['prefix', 'daysfieldname', 'monthsfieldname', 'yearsfieldname', 'datefieldname', 'days', 'months', 'years', 'isdatescompare', 'maxfieldname', 'minfieldname', 'ismintoday', 'ismaxtoday'], function (options) {
    options.rules['rangedate'] = options.params;
    options.messages['rangedate'] = options.message;
});

jQuery.validator.addMethod("rangedate", function (value, element, params) {
    if (value == "")
        return true;

    var value = value.split("/");
    var dateValue;
    var maxdate;
    var mindate;

    if (params["isdatescompare"] != "True") {
        var now = new Date();

        if (params["datefieldname"] != "") {
            var name = getPropertyValue2(element, params["datefieldname"]).split("/");
            now = new Date(name[2], parseInt(name[1]) - 1, name[0]);
        }

        var date = now;
        var days = parseInt(params["days"]);
        var months = parseInt(params["months"]);
        var years = parseInt(params["years"]);

        if (params["daysfieldname"] != "") {
            days = getPropertyValue2(element, params["daysfieldname"]);
            days = parseInt(days);
        }


        if (params["monthsfieldname"] != "") {
            months = getPropertyValue2(element, params["monthsfieldname"]);
            months = parseInt(months);
        }

        if (params["yearsfieldname"] != "") {
            years = getPropertyValue2(element, params["yearsfieldname"]);
            years = parseInt(years);
        }


        var day = date.getDate() + days;
        var month = date.getMonth() + months;
        var year = date.getFullYear() + years;

        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        date = new Date(year, month, day);
        maxdate = date > now ? date : now;
        mindate = date < now ? date : now;

    } else {

        if (params["ismaxtoday"] == "True")
            maxdate = new Date();
        else {
            if (params["maxfieldname"] != "") {
                var name = getPropertyValue2(element, params["maxfieldname"]).split("/");
                maxdate = new Date(name[2], parseInt(name[1]) - 1, name[0]);
            }
        }
        if (params["ismintoday"] == "True")
            mindate = new Date();
        else {
            if (params["minfieldname"] != "") {
                var name = getPropertyValue2(element, params["minfieldname"]).split("/");
                mindate = new Date(name[2], parseInt(name[1]) - 1, name[0]);
            }

        }

    }

    dateValue = new Date(value[2], parseInt(value[1]) - 1, value[0]);
    var message = $(element).attr("data-val-rangedate");
    var maxdateDay = isNaN(maxdate.getDate()) ? "" : maxdate.getDate();
    var maxdateMonth = isNaN(parseInt(maxdate.getMonth() + 1)) ? "" : String(parseInt(maxdate.getMonth() + 1));
    var maxdateYear = isNaN(maxdate.getFullYear()) ? "" : maxdate.getFullYear();

    var mindateDay = isNaN(mindate.getDate()) ? "" : mindate.getDate();
    var mindateMonth = isNaN(parseInt(mindate.getMonth() + 1)) ? "" : String(parseInt(mindate.getMonth() + 1));
    var mindateYear = isNaN(mindate.getFullYear()) ? "" : mindate.getFullYear();

    if (isNaN(maxdate.getDate()) || isNaN(mindate.getDate()))
        message = "טווח תאריכים לא תקין";
    else
        message = message.replace("{mindate}", mindateDay + "/" + mindateMonth + "/" + mindateYear).replace("{maxdate}", maxdateDay + "/" + maxdateMonth + "/" + maxdateYear);

    $(element).closest("form").validate().settings.messages[$(element).attr("name")].rangedate = message;

    return dateValue <= maxdate && dateValue >= mindate;

});

//--------notduplicate-----------
jQuery.validator.unobtrusive.adapters.add('notduplicate', ['gridname', 'fieldname'], function (options) {
    options.rules['notduplicate'] = options.params;
    options.messages['notduplicate'] = options.message;
});

jQuery.validator.addMethod("notduplicate", function (value, element, params) {
    //TODO add the name of grid to message
    //TODO extend get the grid by class and not required the grid name
    if (value == "")
        return true;

    //get the state of the row 
    var state = getPropertyValue2(element, "State");

    //if state is added  check on all row and not in the selected row else check on all row

    //if is new row
    if (state == 0) {
        //check if existing 
        var exists = MojFind("[id^='" + params["gridname"] + "'] input[name$=']." + params['fieldname'] + "'][value='" + value + "']");
        if (exists.length > 0) {
            return false;
        }
    }
    else {
        //check if existing 
        var exists = MojFind("[id^='" + params["gridname"] + "']").find("tr:not(.k-state-selected)").not(":contains('Test')").find("input[name$=']." + params['fieldname'] + "'][value='" + value + "']");
        if (exists.length > 0) {
            return false;
        }
    }
    return true;
});


//--------sumsmallerthanorequalto-----------
jQuery.validator.unobtrusive.adapters.add('sumsmallerthanorequalto', ['gridname', 'fieldname', 'fielddependendname'], function (options) {
    options.rules['sumsmallerthanorequalto'] = options.params;
    options.messages['sumsmallerthanorequalto'] = options.message;
});

jQuery.validator.addMethod("sumsmallerthanorequalto", function (value, element, params) {

    //TODO add the name of grid to message

    //TODO extend get the grid by class and not required the grid name
    if (value == "")
        return true;


    value = parseFloat(value);

    if (isNaN(value))
        return true;

    //get the state of the row 
    var state = getPropertyValue2(element, "State");

    //if state is added  check on all row and not in the selected row else check on all row

    //get the sum value
    var dependendValue = parseFloat(getPropertyValue2(element, params["fielddependendname"]));
    if (isNaN(dependendValue))
        return true;


    var grid = MojFind("[id^='" + params["gridname"] + "']").data("kendoGrid");
    var griddata = grid.dataSource.data();

    var sum = 0;
    for (var i in griddata) {
        if (!isNaN(parseInt(i)))
            sum += parseFloat(griddata[i][params['fieldname']]);
    }

    //if is new row
    if (state == 0) {
        sum = sum + value;
        if (sum > dependendValue)
            return false;
    }
    else {
        var editvalue = grid.dataItem(grid.select())[params['fieldname']];
        sum = sum + value - editvalue;
        if (sum > dependendValue)
            return false;
    };
    return true;
});

//--------------multidropdownrequired-----------------
jQuery.validator.unobtrusive.adapters.add('multidropdownrequired', ['number'], function (options) {
    options.rules['multidropdownrequired'] = options.params;
    options.messages['multidropdownrequired'] = options.message;
});

jQuery.validator.addMethod("multidropdownrequired", function (value, element, params) {
    var number = params["number"];
    return MojFind(element).find("option[selected]").length >= parseInt(number);
});

//--------------multidropdownrequiredif-----------------
jQuery.validator.unobtrusive.adapters.add('multidropdownrequiredif', ['number', 'targetvalue', 'dependentproperty'], function (options) {
    options.rules['multidropdownrequiredif'] = options.params;
    options.messages['multidropdownrequiredif'] = options.message;
});

jQuery.validator.addMethod("multidropdownrequiredif", function (value, element, params) {
    var name = foolproof.getName(element, params['dependentproperty']);
    var control = MojFind('[name="' + name + '"]');
    var controltype = control.attr('type');
    var actualvalue =
            controltype === 'checkbox' ?
            control.attr('checked') ? "true" : "false" :
            controltype == 'radio' ?
            MojFind('[name="' + name + '"]:radio:checked').val() :
            control.val();
    if (params['targetvalue'] === actualvalue) {
        return $.validator.methods.multidropdownrequired.call(this, value, element, params);
    }
    return true;
});

//--------lessthanorequaltoif-----------

jQuery.validator.unobtrusive.adapters.add('lessthanorequaltoif', ['dependentproperty', 'targetproperty', 'targetvalue', 'operator', 'passonnull'], function (options) {
    options.rules['lessthanorequaltoif'] = {
        dependentproperty: options.params['dependentproperty'],
        targetproperty: options.params['targetproperty'],
        targetvalue: options.params['targetvalue'],
        operator: options.params['operator'],
        passonnull: options.params['passonnull']
    };
    options.messages['lessthanorequaltoif'] = options.message;
});

jQuery.validator.addMethod("lessthanorequaltoif", function (value, element, params) {

    var name = foolproof.getName(element, params['targetproperty']);
    // get the target value (as a string, 
    // as that's what actual value will be)
    var targetvalue = params['targetvalue'];
    targetvalue = (targetvalue == null ? '' : targetvalue).toString();
    var controlValue = MojFind('[name="' + name + '"]').val();
    if (targetvalue.toString().toLowerCase() == controlValue.toString().toLowerCase()) {
        return $.validator.methods.is.call(this, value, element, params);
    }

    return true;
});

//--------greaterthanorequaltoif-----------

jQuery.validator.unobtrusive.adapters.add('greaterthanorequaltoif', ['dependentproperty', 'targetproperty', 'targetvalue', 'operator', 'passonnull'], function (options) {
    options.rules['greaterthanorequaltoif'] = {
        dependentproperty: options.params['dependentproperty'],
        targetproperty: options.params['targetproperty'],
        targetvalue: options.params['targetvalue'],
        operator: options.params['operator'],
        passonnull: options.params['passonnull']
    };
    options.messages['greaterthanorequaltoif'] = options.message;
});

jQuery.validator.addMethod("greaterthanorequaltoif", function (value, element, params) {

    var name = foolproof.getName(element, params['targetproperty']);
    // get the target value (as a string, 
    // as that's what actual value will be)
    var targetvalue = params['targetvalue'];
    targetvalue = (targetvalue == null ? '' : targetvalue).toString();
    var controlValue = MojFind('[name="' + name + '"]').val();
    if (targetvalue.toString().toLowerCase() == controlValue.toString().toLowerCase()) {
        return $.validator.methods.is.call(this, value, element, params);
    }

    return true;
});

//--------phonenumber-----------

jQuery.validator.unobtrusive.adapters.add('phonenumber', function (options) {
    options.rules['phonenumber'] = options.params;
    options.messages['phonenumber'] = options.message;
});

jQuery.validator.addMethod("phonenumber", function (value, element, params) {
    if (!value)
        return true;

    if (/^[0-9]{2,3}-?[0-9]{7}$/.test(value) == false)
        return false;

    return true;
});

