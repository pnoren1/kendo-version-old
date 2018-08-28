$(document).ready(function () {
    //  MojFind("#SearchByOtherParamDate").enable(false);
    MojFind("#SearchByOtherParameters_Id").change(function () {
        var val = MojControls.AutoComplete.getValueById("SearchByOtherParameters_Id");
        if (val == PredefinedQueries.InvestigationProcessesBroughtToCourt) {//פניות חקירה המובאות לבית משפט
            var tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            MojControls.DateTimePicker.setValueById("SearchByOtherParamDate", Moj.HtmlHelpers._parseDate(tomorrowDate, "dd/MM/yyyy"));
            MojFind("#SearchByOtherParamDate").visible(true);
            MojFind("#div_HasNotNominatorOrDepartment").attr('style', 'width: 85px;')
        }
        else {
            MojControls.DateTimePicker.setValueById("SearchByOtherParamDate", null);
            MojFind("#SearchByOtherParamDate").visible(false);
            MojFind("#div_HasNotNominatorOrDepartment").attr('style', 'width: 255px;')
        }

    });

 

});