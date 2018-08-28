//-------- AnyLetterRequiredAttribute-----------

jQuery.validator.unobtrusive.adapters.add('anyletterrequired', function (options) {
    options.rules['anyletterrequired'] = options.params;
    options.messages['anyletterrequired'] = options.message;
});

jQuery.validator.addMethod("anyletterrequired", function (value, element, params) {
    var regularExpression = /^.*(?=.*[a-zA-Zא-ת]).*$/;
    var text = $(element).data('kendoComboBox').text();
    if (text != "" && !regularExpression.test(text)) {
        return false;
    }
    else {
        return true;

    }
});


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
    //
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

//--------GreaterThanOrEqualToDateAttribute-----

jQuery.validator.unobtrusive.adapters.add('greaterThanOrEqualToDateAttribute', function (options) {
    
    options.rules['greaterThanOrEqualToDateAttribute'] = options.params;
    options.messages['greaterThanOrEqualToDateAttribute'] = options.message;
});

jQuery.validator.addMethod("greaterThanOrEqualToDateAttribute", function (value, element, params) {
    if (value == null)
        return true
    else if (new Date(value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")) > Date.now())
        return false;
    return true;
});

//--------lessthanif-----------

jQuery.validator.unobtrusive.adapters.add('lessthanif', ['dependentproperty', 'targetproperty', 'targetvalue', 'operator', 'passonnull'], function (options) {
    options.rules['lessthanif'] = {
        dependentproperty: options.params['dependentproperty'],
        targetproperty: options.params['targetproperty'],
        targetvalue: options.params['targetvalue'],
        operator: options.params['operator'],
        passonnull: options.params['passonnull']
    };
    options.messages['lessthanif'] = options.message;
});

jQuery.validator.addMethod("lessthanif", function (value, element, params) {

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

