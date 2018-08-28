var MojControls = {

    //common functionality methods
    Common: {

        //check if element is disabled(either by readonly or disabled)
        //expeted element is either jquery element or DOM
        isDisabled: function (element) {
            return $(element).prop("readonly") || $(element).prop("disabled");

        },

        //check if disabled by id
        isDisabledById: function (elemendId) {
            return MojControls.Common.isDisabled(MojFind("#" + elemendId));
        },

        //enable\disable the element
        changeAvailability: function (element, isEnabled) {
            $(element).prop("disabled", !isEnabled);
        },

        //enable\disable by id
        changeAvailabilityById: function (elementId, isEnabled) {
            MojControls.Common.changeAvailability($("#" + elementId), isEnabled);
        },

        //visibility on/off
        setVisibility: function (element, isVisible) {
            $(element).visible(isVisible);
        },

        //visibility on/off by id
        setVisibilityById: function (elementId, isVisible) {
            MojControls.Common.setVisibility($("#" + elementId), isVisible);

        },

        changeDivVisibility: function (divName, isVisible) {
            if (Moj.isTrue(isVisible)) {
                MojFind("#" + divName).show();
                //$("#" + divName).removeAttr("hide");
            } else {
                MojFind("#" + divName).hide();
            }
        },

        //set visibility according  to class
        changeClassVisibility: function (className, isVisible) {
            if (Moj.isTrue(isVisible)) {
                MojFind("." + className).removeClass("hide");
            } else {
                MojFind("." + className).addClass("hide");
            }
        },

    },

    ComboBox: {
        clearComboBox: function (combobox, isEnabled) {
            combobox.closest("span").attr("title", "");
            combobox = combobox.data("kendoComboBox");
            combobox.value("");
            combobox.text("");
            combobox.setDataSource(null);
            combobox.refresh();
            if (isEnabled == undefined)
                isEnabled = false;
            combobox.enable(isEnabled);
        },
    },

    AutoComplete: {

        getSelectedAutoCompleteValueById: function (autoCompleteId) {
            return MojFind("#" + autoCompleteId).data("kendoComboBox").select();
        },

        setDataSource: function (autoCompleteId, dataSoruce) {
            var autoComplete = MojFind("#" + autoCompleteId).data("kendoComboBox");
            dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, MojFind("#" + autoCompleteId).attr('originalIndex'));
            autoComplete.setDataSource(dataSoruce);
            autoComplete.refresh();
        },

        setDataSourceAndValue: function (autoCompleteId, dataSoruce, value) {
            var autoComplete = MojFind("#" + autoCompleteId).data("kendoComboBox");
            autoComplete.value(value);
            dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, MojFind("#" + autoCompleteId).attr('originalIndex'));
            autoComplete.setDataSource(dataSoruce);
            $("[name='" + autoCompleteId.replace('_', '.') + "_input']").attr('title', autoComplete.text());
            autoComplete.refresh();
        },

        setValueById: function (autoCompleteId, value) {
            MojFind("#" + autoCompleteId).data("kendoComboBox").value(value);
        },

        getValueById: function (autoCompleteId) {
            return MojFind("#" + autoCompleteId).data("kendoComboBox").value();
        },

        getTextById: function (autoCompleteId) {
            return MojFind("#" + autoCompleteId).data("kendoComboBox").text();
        },

        setTextById: function (autoCompleteId, value) {
            MojFind("#" + autoCompleteId).data("kendoComboBox").text(value);
        },

        setValue: function (autoComplete, value) {
            autoComplete.data("kendoComboBox").value(value);
        },

        clearSelectionById: function (autoCompleteId) {
            MojFind("#" + autoCompleteId).data("kendoComboBox").select(-1);
        },

        clearSelection: function (autoComplete) {
            autoComplete.data("kendoComboBox").select(-1);
        },
    },

    //common "controls" methods
    DropDown: {

        setDataSourceAndValue: function (dropDownId, dataSoruce, value) {
            var dropDown = MojFind("#" + dropDownId).data("kendoDropDownList");
            dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, MojFind("#" + dropDownId).attr('originalIndex'));
            dropDown.setDataSource(dataSoruce);
            dropDown.value(value);
            MojFind("#" + dropDownId).closest('span').attr('title', dropDown.text());
            dropDown.refresh();
        },

        setDataSource: function (dropDownId, dataSoruce) {
            var dropDown = MojFind("#" + dropDownId).data("kendoDropDownList");
            dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, MojFind("#" + dropDownId).attr('originalIndex'));
            dropDown.setDataSource(dataSoruce);
            dropDown.refresh();
        },

        setDataSourceByDropDown: function (selector, dataSoruce) {
            var dropDown = selector.data("kendoDropDownList");
            dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, selector.attr('originalIndex'));
            dropDown.setDataSource(dataSoruce);
            dropDown.refresh();
        },

        setTextById: function (dropDownId, value) {
            MojFind("#" + dropDownId).data("kendoDropDownList").text(value);
        },

        setValueById: function (dropDownId, value) {
            MojFind("#" + dropDownId).data("kendoDropDownList").value(value);
        },

        setValue: function (dropdown, value) {
            var dropdownObj = dropdown.data("kendoDropDownList")
            dropdownObj.value(value);
            dropdownObj.refresh();
        },

        getValueById: function (dropDownId) {
            return MojFind("#" + dropDownId).data("kendoDropDownList").value();
        },

        getTextById: function (dropDownId) {
            var dropDown = MojFind("[id='" + dropDownId + "']").data("kendoDropDownList");
            if (dropDown != undefined)
                return dropDown.text();
            return "";
        },

        //select by the id of the control
        selectDropDownValueById: function (dropdownId, value) {
            MojControls.DropDown.selectDropDownValue(MojFind("#" + dropdownId), value);
        },

        //select the value. dropdown is either jQuery or DOM
        selectDropDownValue: function (dropDown, value) {
            $(dropDown).data("kendoDropDownList").select(value);
        },

        //get the value. dropdown is either jQuery or DOM
        getSelectedDropDownValue: function (dropDown) {
            return $(dropDown).data("kendoDropDownList").select();
        },

        getSelectedDropDownValueById: function (dropDownId) {
            return MojFind("#" + dropDownId).data("kendoDropDownList").select();
        },

        //is element is dropdown. dropdown is either jQuery or DOM
        isDropDownList: function (dropDown) {
            return $(dropDown).type == 'input' && $(dropDown).attr("data-role") == 'dropdownlist';
        },

        //is element is dropdown by it's id
        isDropDownListById: function (dropdownId) {
            return MojControls.DropDown.isDropDownList(MojFind("#" + dropdownId));
        },

        clearDropDown: function (dropdown) {
            dropdown.closest("span").attr("title", "");
            dropdown = dropdown.data("kendoDropDownList");
            dropdown.value("");
            dropdown.setDataSource(null);
            dropdown.refresh();
            dropdown.enable(false);
        },

    },



    MultiDropDown: {

        // is multi select have any item checked
        isAnyItemChecked: function (multiDropDown) {
            return $(multiDropDown).data("kendoDropDownList").ul.find("li :checked").length > 0;
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

    },


    RadioButton: {

        //get radio button value by id
        getValueById: function (radionButtonId) {
            return MojFind("input[id*='" + radionButtonId + "']:radio:checked").val();
        },

        //get radio button value by either DOM or Jquery
        getValue: function (radioButton) {
            return MojControls.RadioButton.getValueById($(radioButton).attr("id"));
        },

        //set value by radioButton id
        setValueById: function (radionButtonId, value) {
            if (!MojControls.RadioButton.isRadioButtonById(radionButtonId))
                return;
            MojFind("input[id*='" + radionButtonId + "'][value='" + value + "']:radio").attr('checked', 'checked');
            MojFind("input[id*='" + radionButtonId + "']:checked").closest('.col').next().addClass("bold");
            MojFind("input[id*='" + radionButtonId + "']:not(:checked)").closest('.col').next().removeClass("bold");
        },

        //set radiobutton value. radio button can be either jQuery or DOM
        setValue: function (radioButton, value) {
            MojControls.RadioButton.setValueById($(radioButton).attr("id"), value);
        },

        //check if element is radio button
        isRadioButton: function (element) {
            return $(element).type == 'radio' || $(element).attr('type') == 'radio';
        },

        //check if element is radio button by it's id
        isRadioButtonById: function (elementId) {
            return MojControls.RadioButton.isRadioButton(MojFind("input[id*='" + elementId + "']")[0]);
        }

    },

    CheckBox: {

        //get the value by id
        getValueById: function (checkBoxId) {
            return MojControls.CheckBox.getValue(MojFind("#" + checkBoxId));

        },

        //return true if checked and false if not.
        getValue: function (checkBox) {
            return $(checkBox).prop("checked");

        },

        //set the checkbox value by it's id
        setValueById: function (checkBoxId, value) {
            if (!Moj.isBool(value) || !MojControls.CheckBox.isCheckBoxById(checkBoxId))
                return;

            MojControls.CheckBox.setValue(MojFind("#" + checkBoxId), value);

        },

        //set the check box value by jQuery or DOM
        setValue: function (checkBox, value) {
            $(checkBox).prop('checked', value);


        },

        //check if element is checkbox
        isCheckBox: function (element) {
            return $(element).type == 'checkbox' || $(element).attr('type') == 'checkbox';
        },

        //check if element is checkbox by id
        isCheckBoxById: function (elementId) {
            return MojControls.CheckBox.isCheckBox(MojFind("#" + elementId));
        },

        //swap checkbox value by it's id
        swapById: function (checkboxId) {
            var value = MojControls.CheckBox.getValueById(checkboxId);
            MojControls.CheckBox.setValueById(checkboxId, !value);
        },

        //swap checkbox value by jQuery or DOM
        swap: function (checkbox) {
            var value = MojControls.CheckBox.getValue(checkbox);
            MojControls.CheckBox.setValue(checkbox, !value);
        },

        //check if check box is checked by jquery object.
        isChecked: function (checkbox) {
            return $(checkbox).is(":checked") || $(checkbox).attr('checked') != undefined;
        },

        //check if check box is checked by checkboxId
        isCheckedById: function (checkboxId) {
            return MojControls.CheckBox.isChecked(MojFind("#" + checkboxId));
        },

    },

    Hidden: {

        //get value of hidden by it's id
        getValueById: function (hiddenId) {
            return MojFind("#" + hiddenId).val();
        },

        //set the value by it's id
        setValueById: function (hiddenId, value) {
            MojFind("#" + hiddenId).val(value);
        },

        //get value for hidden element by jQuery or DOM
        getValue: function (hidden) {
            return $(hidden).val();
        },

        //set value for hidden element by jQuery or DOM
        setValue: function (hidden, value) {
            $(hidden).val(value);
        },
    },

    TextBox: {
        //is element TextBox. by jQuery or Dom
        isTextBox: function (element) {
            return (MojFind(element).is("input") || MojFind("#" + element).is("input"))
                && (element.type == 'text' || MojFind(element).attr('type') == 'text' || MojFind("#" + element).attr('type') == 'text');
        },

        //get value of textbox by it's id
        getValueById: function (textBoxId) {
            return MojFind("#" + textBoxId).val();
        },

        //set the value by it's id
        setValueById: function (textBoxId, value, raiseChangeEvent) {
            var textBox = MojFind("#" + textBoxId);
            textBox.val(value);

            if (raiseChangeEvent == undefined || Moj.isTrue(raiseChangeEvent))
                textBox.change();
        },

        //get value for textbox element by jQuery or DOM
        getValue: function (textBox) {
            return $(textBox).val();
        },

        //set value for textbox element by jQuery or DOM
        setValue: function (textBox, value) {
            $(textBox).val(value);
        },
    },

    Grid: {
        getKendoGridById: function (gridId) {
            return MojFind("[id^='" + gridId + "']").data("kendoGrid");
        },
        dataItemForSubmit: function (grid) {
            var items = grid.select().find("input").serializeObject();
            var source = grid.element.attr("gridDataSource") + ".";
            var data = {};
            for (var i in items) {
                var key = i.replace(/\[(.+?)\]/g, "").replace(source, "");
                data[key] = items[i];
            }
            return data;
        },
        isIDEmpty: function (value) {
            return value == "" || value == null || value == "0" || value == "00000000-0000-0000-0000-000000000000";
        }
    },

    DateTimePicker: {
        setValueById: function (dateTimePickerId, value) {
            MojFind("#" + dateTimePickerId).val(value);
        }

    },

    Label: {
        setValueById: function (labelId, value) {
            var siblingDiv = MojFind("#" + labelId).siblings('div');
            siblingDiv.text(value);
            siblingDiv.attr('title', value);
            MojFind("#" + labelId).val(value);
        }
    },

};



