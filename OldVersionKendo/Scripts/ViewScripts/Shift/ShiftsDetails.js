function onShiftScheduleRequestEnd() {

    GetShiftDetailsGridHeaders(false, false);
};


function onShiftScheduleRequestStart(e) {

    if (MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val() == "") {
        MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").change();
        e.preventDefault();
    }

};



function GetShiftDetailsGridHeaders(isNextWeek, isPreviousWeek) {

    var date = MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val();
    //var dateSplitted = date.split("/");
    //var dateToSend = dateSplitted[0] + "/" + dateSplitted[1] + "/" + dateSplitted[2];

    $.ajax({
        url: baseUrl + '/Shift/GetShiftDetailsGridHeaders',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //'{ "courtId": "'
        data: '{ "date": "' + date + '", "isNextWeek": "' + isNextWeek + '", "isPreviousWeek": "' + isPreviousWeek + '" }',
        //data: "date=" + dateToSend + "&isNextWeek=" + isNextWeek + "&isPreviousWeek=" + isPreviousWeek,

        success: function (data) {

            if (data != undefined) {

                for (i = 0; i < data.length; ++i) {
                    MojFind(".Day" + i)[0].children[1].title = data[i];
                    MojFind(".Day" + i)[0].children[1].text = data[i];

                }
                if (isNextWeek || isPreviousWeek)
                    MojControls.DateTimePicker.setValueById("shiftsDetailsSearchCriteria_ViewInWeekOfDate", data[0].split(" ")[0]);
            };
        }

    });



    //$.get(baseUrl + '/Shift/GetShiftDetailsGridHeaders?date=' + dateToSend + "&isNextWeek=" + isNextWeek + "&isPreviousWeek=" + isPreviousWeek, function (data) {
    //    
    //    if (data != undefined) {

    //        for (i = 0; i < data.length; ++i) {
    //            MojFind("#Day" + i)[0].children[1].title = data[i];
    //            MojFind("#Day" + i)[0].children[1].text = data[i];

    //        }
    //        if (isNextWeek || isPreviousWeek)
    //            MojControls.DateTimePicker.setValueById("shiftsDetailsSearchCriteria_ViewInWeekOfDate", data[0].split(" ")[0]);
    //    };
    //});
};

$(document).ready(function () {

    GetShiftDetailsGridHeaders(false, false);


    MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").change(function () {
        if (!isNaN(Date.parse(MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")))) //check if date is correct
        {
            if (MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").valid() && !Moj.isTrue(MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val().length > 10)) {
                if (MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val() != "") {
                    GetShiftDetailsGridHeaders(false, false);
                    MojFind("#btnSearchShiftsDetails").click();
                    if ($("#tabStrip").length > 0)
                        $("#tabStrip").focus();
                }
            }
        }


    });




    //MojFind("#btnClearShiftsDetails").click(function () {
    //    
    //    MojControls.DateTimePicker.setValueById("shiftsDetailsSearchCriteria_ViewInWeekOfDate", MojFind("#DefaultViewInWeekOfDate").val());
    //    MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").change();
    //});

    MojFind("#btnLeftButton").click(function () {
        if (MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val() != "" && MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").valid() && !Moj.isTrue(MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val().length > 10)) {
            GetShiftDetailsGridHeaders(true, false);
            MojFind("#btnSearchShiftsDetails").click();
        }
        
    });

    MojFind("#btnRightButton").click(function () {
        if (MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val() != "" && MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").valid() && !Moj.isTrue(MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val().length > 10)) {
            GetShiftDetailsGridHeaders(false, true);
            MojFind("#btnSearchShiftsDetails").click();
        }
    });

});