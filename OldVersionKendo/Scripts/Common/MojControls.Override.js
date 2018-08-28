MojControls.MultiDropDown.clearAll = function (multiDropDownId) {
    var multiDropDown = MojFind("#" + multiDropDownId).data("kendoMultiSelect");
    multiDropDown.value([]);
    multiDropDown.input.blur();
};

MojControls.MultiDropDown.getValuesById = function (multiDropDownId) {
    var list = MojFind("#" + multiDropDownId).find("option");
    var ids = new Array();
    $.each(list, function (index, value) {
        ids[index] = value.value;
    });
    return ids;

};

MojControls.MultiDropDown.setDataSource = function (multiDropDownId, dataSource) {
    var multiDropDown = MojFind("#" + multiDropDownId).data("kendoMultiSelect");
    multiDropDown.setDataSource(dataSource);
    multiDropDown.refresh();
};

MojControls.DateTimePicker.getValueById = function (dateTimePickerId) {
    return MojFind("#" + dateTimePickerId).val();
};

MojControls.DateTimePicker.ClearDateTimePickerValueIncludeHistoryTime = function (dateTimePickerId) {

    MojFind("#" + dateTimePickerId).data("kendoDateTimePicker").value(null); //set value to null
    if (MojFind("#" + dateTimePickerId).data("kendoDateTimePicker").dateView.calendar != undefined)
        MojFind("#" + dateTimePickerId).data("kendoDateTimePicker").dateView.calendar._current.setHours(0, 0, 0, 0); //set history hour to 00:00
};

MojControls.DropDown.setDataSourceByDropDown = function (selector, dataSoruce) {
    var dropDown = selector.data("kendoDropDownList");
    dropDown.setDataSource(dataSoruce);
    dropDown.refresh();
};

MojControls.Grid.setPageSizeById = function (gridId, pageSize) {
    MojControls.Grid.getKendoGridById(gridId).dataSource.pageSize(pageSize)
};

MojControls.Grid.clear = function (gridId) {
    MojControls.Grid.getKendoGridById(gridId).dataSource.data([]);
};

MojControls.Grid.isEmpty = function (gridId) {
    return (MojControls.Grid.getKendoGridById(gridId).dataSource.data().length == 0);
};

MojControls.Grid.setDataSource = function (gridId, data, refresh) {
    var grid = MojControls.Grid.getKendoGridById(gridId);
    grid.dataSource.data(data);
    if (refresh == true)
    {
        grid.refresh();
    }
};

MojControls.Label.setValueById = function (labelId, value) {
    if(Moj.isEmpty(value))
        value = "";
    var siblingDiv = MojFind("#" + labelId).siblings('div');
    siblingDiv.text(value);
    siblingDiv.attr('title', value);
    MojFind("#" + labelId).val(value);
};
//MojControls.Label.setValueById = function (labelId, value) {
//    MojFind("#" + labelId).siblings('div').text(value);
//    MojFind("#" + labelId).val(value);
//};

//MojControls.DropDown.clearDropDown = function (dropdown) {
//    dropdown.closest("span").attr("title", "");
//    dropdown = dropdown.data("kendoDropDownList");
//    dropdown.value("");
//    dropdown.setDataSource(null);
//    dropdown.refresh();
//};

MojControls.DropDown.setValue = function (dropdown, value) {
    dropdown.data("kendoDropDownList").value(value);
    //    dropdown = dropdown.data("kendoDropDownList");
    //    dropdown.value("");
    //    dropdown.setDataSource(null);
    //    dropdown.refresh();
};

MojControls.CheckBox.setValueById = function (checkBoxId, value) {
    if (!Moj.isBool(value) || !MojControls.CheckBox.isCheckBoxById(checkBoxId))
        return;
    if (value == "false" || value == "False")
        value = false;

    if (value == "true" || value == "True")
        value = true;

    MojControls.CheckBox.setValue(MojFind("#" + checkBoxId), value);

};

MojControls.Label.setValue = function (label, value) {
    var siblingDiv = label.siblings('div');
    siblingDiv.text(value);
    siblingDiv.attr('title', value);
    label.val(value);
};


MojControls.Common.IsDigits = function (value) {
    return /^\d+$/.test(value);
};

MojControls.DropDown.clearSelectionById = function (dropDownId) {
    MojFind("#" + dropDownId).data("kendoDropDownList").select(0);
};


MojControls.DropDown.clearSelection = function (dropDown) {
    dropDown.data("kendoDropDownList").select(0);
};

MojControls.DropDown.clearDropDown = function (dropdown, isEnabled) {
    dropdown.closest("span").attr("title", "");
    dropdown = dropdown.data("kendoDropDownList");
    //dropdown.value("");
    dropdown.select(0);
    dropdown.setDataSource(null);
    dropdown.refresh();
    if (isEnabled == undefined)
        isEnabled = false;
    dropdown.enable(isEnabled);
};

MojControls.DropDown.setValue = function (dropdown, value) {
    if (value == "" || value == 0 || value == -1 || value == null)
        MojControls.DropDown.clearSelection(dropdown);
    else
        dropdown.data("kendoDropDownList").value(value);
    dropdown.data("kendoDropDownList").refresh();
};

MojControls.TextBox.clearValueById = function (textBoxId, raiseChangeEvent) {
    var textBox = MojFind("#" + textBoxId);
    MojControls.TextBox.clearValue(textBox, raiseChangeEvent);
};

MojControls.TextBox.clearValue = function (textBox, raiseChangeEvent) {
    textBox.val("");
    textBox[0].setAttribute("title", "");

    if (raiseChangeEvent == undefined || Moj.isTrue(raiseChangeEvent))
        textBox.change();
};

//
MojControls.AutoComplete.setDataSourceAndValue = function (autoCompleteId, dataSoruce, value, isEnabled) {
    var control = MojFind("#" + autoCompleteId);
    var autoComplete = control.data("kendoComboBox");
    if (dataSoruce == "" || dataSoruce == null || dataSoruce=="[]") 
        MojControls.ComboBox.clearComboBox(control,isEnabled)
    else {
        MojControls.AutoComplete.setValue(control, value);
        dataSoruce = Moj.HtmlHelpers._getFilteredActiveData(dataSoruce, control.attr('originalIndex'));
        autoComplete.setDataSource(dataSoruce);
        $("[name='" + autoCompleteId.replace('_', '.') + "_input']").attr('title', autoComplete.text());
        autoComplete.refresh();
    }   
};

MojControls.AutoComplete.setValueById = function (autoCompleteId, value) {
    MojControls.AutoComplete.setValue(MojFind("#" + autoCompleteId), value);
};

MojControls.AutoComplete.setValue = function (autoComplete, value) {
    var autoCompleteData = autoComplete.data("kendoComboBox");
    if (value == 0 || value == -1 || value == "" || value == null)
        MojControls.AutoComplete.clearSelection(autoComplete);
    else
        autoCompleteData.value(value);
};

MojControls.AutoComplete.clearSelectionById = function (autoCompleteId) {
    MojControls.AutoComplete.clearSelection(MojFind("#" + autoCompleteId));
};

MojControls.AutoComplete.clearSelection = function (autoComplete) {
    autoComplete.data("kendoComboBox").select(-1);
};

//MojControls.ComboBox.clearComboBox = function (combobox, isEnabled) {
    
//    //combobox.closest("span").attr("title", "");
//    //combobox = combobox.data("kendoComboBox");
//    //combobox.setDataSource(null);
//    //combobox.select(-1);
//    //combobox.refresh();
//    //if (isEnabled == undefined)
//    //    isEnabled = false;
//    //combobox.enable(isEnabled);
//};

MojControls.AutoComplete.selectIndexById = function (autoCompleteId, index) {
    MojControls.AutoComplete.selectIndex(MojFind("#" + autoCompleteId), index);
};

MojControls.AutoComplete.selectIndex = function (autoComplete, index) {
    autoComplete.data("kendoComboBox").select(index);
};

