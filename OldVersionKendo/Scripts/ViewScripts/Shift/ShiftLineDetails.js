$(document).ready(function () {

    //var shiftTypeID = MojFind("#ShiftTypeId").val();
    //var originalAdvocateContactID = MojFind("#OriginalAdvocateContactId").val();
    //var originalEmploymentTypeID = MojFind("#OriginalEmploymentTypeId").val();
    //add originalAdvocateContactId to parameters serverAutoComplete
    //if (shiftTypeID == ShiftTypeEnum.Readings || (originalAdvocateContactID != "0" && originalEmploymentTypeID != "")) {
    var streetsServerAutoCompleteInput = MojFind("input[name='ShiftsEmbedsDetails.AdvocateContactId_input']");
    streetsServerAutoCompleteInput.attr("parameters", "&originalAdvocateContactId=" + MojFind("#OriginalAdvocateContactId").val());
    //}



    MojFind("#btnSaveInGridShiftLineDetails").removeAttr('onclick');

    MojFind("#btnSaveInGridShiftLineDetails").die('click');
    MojFind("#btnSaveInGridShiftLineDetails").live('click', function () {
        var isExistShiftAllreadyInGrid = false; var plannedFromTimeGreatherThanToTime = false; var actualFromTimeGreatherThanToTime = false; var singleActualTimeFieldIsEmpty = false; var emptyShiftChangeTimeReason = false;
        //var notExistContract = false;
        var ErrorMessage = "";

        isExistShiftAllreadyInGrid = CheckIfExistShiftAllreadyInGrid();

        //if (MojFind("#IsNewLine").val() && MojFind("#ShiftTypeId").val() == ShiftTypeEnum.Readings)
        //{
        //    $.ajax({
        //            type: "GET",
        //            async: false,
        //            url: baseUrl + "/Shift/ReadingAdvocateContractCheck",
        //            contentType: 'application/json',
        //            data: { advocateContactId: MojFind("#ShiftsEmbedsDetails_AdvocateContactId").val(), 
        //                    fromTime: MojFind("#ShiftsEmbedsDetails_FromTime").val() },
        //            dataType: "json",
        //            success: function (data) {
        //                
        //                if (data == 1)
        //                   notExistContract = true;
        //            }
        //        });
        //}

        if (MojFind("#ShiftsEmbedsDetails_PlannedFromTime").val() >= MojFind("#ShiftsEmbedsDetails_PlannedToTime").val()
            && !(MojFind("#ShiftsEmbedsDetails_PlannedFromTime").attr('readonly') == "readonly")
            && !(MojFind("#ShiftsEmbedsDetails_PlannedToTime").attr('readonly') == "readonly")
            && (MojFind("#ShiftsEmbedsDetails_PlannedFromTime").val() != "")
            && (MojFind("#ShiftsEmbedsDetails_PlannedToTime").val() != ""))
            plannedFromTimeGreatherThanToTime = true;

        if (MojFind("#ShiftsEmbedsDetails_ActualFromTime").val() != "" && MojFind("#ShiftsEmbedsDetails_ActualToTime").val() == "" || MojFind("#ShiftsEmbedsDetails_ActualFromTime").val() == "" && MojFind("#ShiftsEmbedsDetails_ActualToTime").val() != "")
            singleActualTimeFieldIsEmpty = true;

        else if (PDO.FromTimeGreatherThanToTime(MojFind("#ShiftsEmbedsDetails_ActualFromTime").val() , MojFind("#ShiftsEmbedsDetails_ActualToTime").val())
           && !(MojFind("#ShiftsEmbedsDetails_ActualFromTime").attr('readonly') == "readonly")
            && !(MojFind("#ShiftsEmbedsDetails_ActualToTime").attr('readonly') == "readonly")
            && (MojFind("#ShiftsEmbedsDetails_ActualFromTime").val() != "")
            && (MojFind("#ShiftsEmbedsDetails_ActualToTime").val() != ""))
            actualFromTimeGreatherThanToTime = true;

        if (!plannedFromTimeGreatherThanToTime
            && !actualFromTimeGreatherThanToTime
            && MojFind("#ShiftsEmbedsDetails_PlannedFromTime").val() != ""
            && MojFind("#ShiftsEmbedsDetails_PlannedToTime").val() != ""
            && MojFind("#ShiftsEmbedsDetails_ActualFromTime").val() != ""
            && MojFind("#ShiftsEmbedsDetails_ActualToTime").val() != "") {
            var diff1 = PDO.calculateDatesDiff(MojFind("#ShiftsEmbedsDetails_ActualFromTime").val(), MojFind("#ShiftsEmbedsDetails_ActualToTime").val());
            var diff2 = PDO.calculateDatesDiff(MojFind("#ShiftsEmbedsDetails_PlannedFromTime").val(), MojFind("#ShiftsEmbedsDetails_PlannedToTime").val());

            if (diff1 > diff2 && MojFind("#ShiftsEmbedsDetails_ShiftChangeTimeReasonId").val() == "")
                emptyShiftChangeTimeReason = true;


        }

        if (isExistShiftAllreadyInGrid)
            ErrorMessage += Resources.Messages.ErrExistShiftInCurrentShiftConfiguration + "." + "<br />";

        //if (notExistContract)
        //    ErrorMessage += Resources.Messages.ErrNotExistActiveContract + "." + "<br />";

        if (plannedFromTimeGreatherThanToTime)
            ErrorMessage += Resources.Messages.ErrPlannedFromTimeGreatherThanToTime + "." + "<br />";

        if (actualFromTimeGreatherThanToTime)
            ErrorMessage += Resources.Messages.ErrActualFromTimeGreatherThanToTime + "." + "<br />";

        if (singleActualTimeFieldIsEmpty)
            ErrorMessage += Resources.Messages.ErrSingleActualTimeFieldIsEmpty + "." + "<br />";

        if (emptyShiftChangeTimeReason)
            ErrorMessage += Resources.Messages.ErrEmptyShiftChangeTimeReason + "." + "<br />";

        if (ErrorMessage != "")
            Moj.showMessage(ErrorMessage, undefined, Resources.Strings.Error, MessageType.Error);
        else {
            Moj.HtmlHelpers._saveRowToGrid('grdShiftsPerShiftConfiguration', 'tr_grdShiftsPerShiftConfiguration_Details', "/Shift/UpdateShiftLineDetails", '', '', true, '', '', '', false);
        }

    });

    MojFind("#ShiftsEmbedsDetails_PlannedFromTime").change(function () {

        handleTimeField(this);
    });

    MojFind("#ShiftsEmbedsDetails_PlannedToTime").change(function () {

        handleTimeField(this);
    });

    //MojFind("#ShiftsEmbedsDetails_ActualFromTime").change(function () {

    //    handleTimeField(this);
    //});

    //MojFind("#ShiftsEmbedsDetails_ActualToTime").change(function () {

    //    handleTimeField(this);
    //});

    MojFind("#ShiftsEmbedsDetails_FromTime").change(function () {

        if (this.value == "" || !Moj.isTrue(MojFind("#ShiftsEmbedsDetails_FromTime").valid())) {

            resetDatesFields();
            MojFind("#ShiftsEmbedsDetails_FromTimeString").val("");
            MojControls.Label.setValueById("ShiftsEmbedsDetails_DayInWeek", "");
            enableDisableDatesFields(false);

            if (MojFind("#ShiftTypeId").val() == ShiftTypeEnum.Readings) //הקראות
            {
                MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_AdvocateContactId", "");
                MojFind("#ShiftsEmbedsDetails_AdvocateContactId").change();
                MojFind("#ShiftsEmbedsDetails_AdvocateContactId").enable(false);

                //remove last name attribute of input element - reset the control filter
                $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("lastname");
                $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("title");
            }

        }
        else {

            var splittedDate = this.value.split("/");
            var dateConverted = splittedDate[1] + "/" + splittedDate[0] + "/" + splittedDate[2];
            var date = new Date(dateConverted);

            if (!isNaN(new Date(dateConverted)) && !Moj.isTrue(dateConverted.length > 10)) { //check date is valid

                var minDateSplitted = MojFind("#MinDateInWeek").val().split(" ")[0].split("/");
                var minDateConverted = minDateSplitted[1] + "/" + minDateSplitted[0] + "/" + minDateSplitted[2];
                var minDate = new Date(minDateConverted);

                var maxDateSplitted = MojFind("#MaxDateInWeek").val().split(" ")[0].split("/");
                var maxDateConverted = maxDateSplitted[1] + "/" + maxDateSplitted[0] + "/" + maxDateSplitted[2];
                var maxDate = new Date(maxDateConverted);

                if (date < minDate || date > maxDate) {
                    Moj.showMessage("אין אפשרות להזין תאריך זה", undefined, Resources.Strings.Error, MessageType.Error);
                    MojFind("#ShiftsEmbedsDetails_FromTime").val("");
                    MojFind("#ShiftsEmbedsDetails_FromTimeString").val("");
                    MojControls.Label.setValueById("ShiftsEmbedsDetails_DayInWeek", "");
                    enableDisableDatesFields(false);

                }
                else {
                    var dayInWeek = new Date(dateConverted).getDay();
                    MojFind("#ShiftsEmbedsDetails_FromTimeString").val(this.value);
                    var daysInHebrew = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
                    MojControls.Label.setValueById("ShiftsEmbedsDetails_DayInWeek", daysInHebrew[dayInWeek]);
                    enableDisableDatesFields(true);
                    resetDatesFields();


                    //get times from shiftconfigurationdays 
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: baseUrl + "/Shift/GetTimesPerShiftConfigurationAndDay",
                        contentType: 'application/json',
                        data: { date: dateConverted, shiftConfigurationId: MojFind("#ShiftConfigurationId").val() },
                        dataType: "json",
                        success: function (data) {

                            MojControls.DateTimePicker.setValueById("ShiftsEmbedsDetails_PlannedFromTime", data.PlannedFromTime);
                            MojFind("#ShiftsEmbedsDetails_PlannedFromTimeString").val(data.PlannedFromTimeString);
                            MojControls.DateTimePicker.setValueById("ShiftsEmbedsDetails_PlannedToTime", data.PlannedToTime);
                            MojFind("#ShiftsEmbedsDetails_PlannedToTimeString").val(data.PlannedToTimeString);

                        },
                    });

                    //MojControls.DateTimePicker.setValueById("ShiftsEmbedsDetails_PlannedFromTime", "00:00 " + this.value);
                    //MojFind("#ShiftsEmbedsDetails_PlannedFromTimeString").val("00:00");
                    //MojControls.DateTimePicker.setValueById("ShiftsEmbedsDetails_PlannedToTime", "00:00 " + this.value);
                    //MojFind("#ShiftsEmbedsDetails_PlannedToTimeString").val("00:00");

                    //if (MojFind("#ShiftTypeId").val() == ShiftTypeEnum.Readings) //הקראות
                    //    MojFind("#ShiftsEmbedsDetails_AdvocateContactId").enable(true);

                    if (MojFind("#ShiftTypeId").val() == ShiftTypeEnum.Readings) //הקראות
                    {
                        MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_AdvocateContactId", "");
                        MojFind("#ShiftsEmbedsDetails_AdvocateContactId").change();
                        MojFind("#ShiftsEmbedsDetails_AdvocateContactId").enable(true);

                        //remove last name attribute of input element - reset the control filter
                        $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("lastname");
                        $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("title");
                    }
                }
            }

        }


    });


    CheckIfExistShiftAllreadyInGrid = function () {

        var advocateContactId = MojFind("#ShiftsEmbedsDetails_AdvocateContactId").val();

        if (advocateContactId != "") {
            var fromTime = MojFind("#ShiftsEmbedsDetails_FromTime").val()
            var gridRowsCount = $('#div_grdShiftsPerShiftConfiguration tbody tr').length;
            var trowsGrid = MojFind('#div_grdShiftsPerShiftConfiguration tbody tr');
            var j = 0;
            for (var i = 0; i < gridRowsCount; i++) {

                if (trowsGrid[i].id != "tr_grdShiftsPerShiftConfiguration_Details") {
                    if (!trowsGrid[i].className.includes("hide")) {
                        if (MojFind("[name='ShiftsEmbedsList[" + j + "].FromTime']").val().includes(fromTime) && MojFind("[name='ShiftsEmbedsList[" + j + "].AdvocateContactId']").val() == advocateContactId) {
                            //MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_AdvocateContactId", "");
                            //Moj.showMessage("כבר קיים שיבוץ לסנגור במוקד ביום זה", undefined, Resources.Strings.Error, MessageType.Error);
                            return true;
                        }
                    }
                    j++;
                }

            }
            return false;
        }


        //MojFind('#div_grdShiftsPerShiftConfiguration tbody tr').each(function () {
        //    
        //    if ($(this)[0].id != "tr_grdShiftsPerShiftConfiguration_Details" && !$(this)[0].className.includes("hide")) {
        //        if ($(this).find('td:eq(2) input').val() == fromTime && $(this).find('td:eq(7) input')[0].value == advocateContactId)
        //        {
        //            Moj.showMessage("כבר קיים שיבוץ לסנגור במוקד ביום זה.", undefined, Resources.Strings.Error, MessageType.Error);

        //        }
        //    }
        //})
        //var shiftConfigurationId = MojFind("#ShiftConfiguraionId").val();
        //var fromTime = MojFind("#ShiftsEmbedsDetails_FromTime").val();
        //var advocateContactId = MojFind("#ShiftsEmbedsDetails_AdvocateContactId").val();

        //$.ajax({
        //    type: "GET",
        //    async: false,
        //    url: baseUrl + "/Shift/ShiftLineValuesValidationsBeforeSave",
        //    contentType: 'application/json',
        //    data: { shiftConfigurationId: shiftConfigurationId, fromTime: fromTime, advocateContactId: advocateContactId },
        //    dataType: "json",
        //    success: function (data) {
        //        
        //        if (!Moj.isTrue(data.IsInternalAdvocate)) {
        //            Moj.showMessage(Resources.Messages.ErrOnlyInternalAdvocates, undefined, Resources.Strings.Error, MessageType.Error);
        //            MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_AdvocateContactId", "");
        //        }

        //    },
        //});
    };

    MojFind('#ShiftsEmbedsDetails_AdvocateContactId').die('change');
    MojFind("#ShiftsEmbedsDetails_AdvocateContactId").live('change', function () {
        
        var currentAdvocateContactId = this.value;
        if (currentAdvocateContactId != "") {
            var shiftTypeId = MojFind("#ShiftTypeId").val();
            var originalAdvocateContactId = MojFind("#OriginalAdvocateContactId").val();
            var originalEmploymentTypeId = MojFind("#OriginalEmploymentTypeId").val();
            var shiftId = MojFind("#ShiftsEmbedsDetails_ShiftId").val();
            var shiftFromTime = MojFind("#ShiftsEmbedsDetails_FromTime").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
            var guid = MojFind("#Guid").val();

            var errorMessage = ""

            if (shiftId != "0" && currentAdvocateContactId != originalAdvocateContactId)
            {
                var employmentTypeOriginal = MojFind("#OriginalEmploymentTypeId").val();
                if (employmentTypeOriginal == "")
                    employmentTypeOriginal = null;

                $.ajax({
                    url: baseUrl + '/Shift/BeforeDeleteRowCheck',
                    type: 'POST',
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: '{ "shiftId": ' + shiftId + ', "advocateContactId": ' + originalAdvocateContactId + ', "employmentTypeId":' + employmentTypeOriginal + '}',
                    success: function (data) {
                        
                        if(Moj.isTrue(data.IsExistProcess))
                            errorMessage += Resources.Messages.ErrOpenedProcessesForShiftAdvocateChange + "." + "<br />";
                        //if (Moj.isTrue(data.IsExistFeeRequest))
                        //    errorMessage += Resources.Messages.ErrExistUnpaidFeeRequestsForShift + "." + "<br />";

                        if (data.UnpaidFeeRequests.length > 0) {
                            var unpaidFeeRequestsIds = "";
                            for (var i = 0; i < data.UnpaidFeeRequests.length; i++) {
                                unpaidFeeRequestsIds += i != data.UnpaidFeeRequests.length - 1 ? " " + data.UnpaidFeeRequests[i] + ',' : " " + data.UnpaidFeeRequests[i];
                            }
                            var error = String.format(Resources.Messages.ErrActiveFeeRequestChangeAdvocate, unpaidFeeRequestsIds)
                            errorMessage += error + "." + "<br />";
                        }
                        if (Moj.isTrue(data.IsExistNomination))
                            errorMessage += Resources.Messages.ErrExistNominationForShiftAdvocateChange + "." + "<br />";
                        if (Moj.isTrue(data.IsExistNominationCandidate))
                            errorMessage += Resources.Messages.ErrExistNominationCandidateForShiftAdvocateChange + "." + "<br />";
                    }
                });
            }


            if (!Moj.isTrue(MojFind("#IsInternalAdvocateByShiftType").val())) {

                if (shiftTypeId == ShiftTypeEnum.Readings || (originalAdvocateContactId != "0" && originalEmploymentTypeId != "")) {
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: baseUrl + "/Shift/AdvocateContactCheckment",
                        contentType: 'application/json',
                        data: { advocateContactId: currentAdvocateContactId, shiftId: shiftId, shiftTypeId: shiftTypeId, originalAdvocateContactId: originalAdvocateContactId, originalEmploymentTypeId: originalEmploymentTypeId, shiftFromTime: shiftFromTime, guid: guid },
                        dataType: "json",
                        success: function (data) {

                            if (data.IsExistAdvocateReadingContract == false) {
                                errorMessage += Resources.Messages.ErrNotExistActiveReadingContract + "." + "<br />";
                            }
                            //if (data.UnpaidFeeRequests.length > 0) {
                            //    var unpaidFeeRequestsIds = "";
                            //    for (var i = 0; i < data.UnpaidFeeRequests.length; i++) {
                            //        unpaidFeeRequestsIds += i != data.UnpaidFeeRequests.length - 1 ? " " + data.UnpaidFeeRequests[i] + ',' : " " + data.UnpaidFeeRequests[i];
                            //    }
                            //    var error = String.format(Resources.Messages.ErrActiveFeeRequestChangeAdvocate, unpaidFeeRequestsIds)
                            //    errorMessage += error + "." + "<br />";
                            //}

                            if (errorMessage != "") {
                                
                                MojFind("#ShiftsEmbedsDetails_AdvocateContactId").data("kendoComboBox").dataSource.filter([]);

                                if (originalAdvocateContactId != "0") {
                                    $.ajax({
                                        type: "GET",
                                        async: false,
                                        url: baseUrl + "/PersonAdvocate/GetAdvocateDataSourceByContactId",
                                        contentType: 'application/json',
                                        data: {
                                            contactId: originalAdvocateContactId
                                        },
                                        dataType: "json",
                                        success: function (data) {
                                            //remove last name attribute of input element - reset the control filter
                                            $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("lastname");
                                            $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("title");

                                            if (data != undefined)
                                                MojControls.AutoComplete.setDataSourceAndValue("ShiftsEmbedsDetails_AdvocateContactId", data, originalAdvocateContactId);
                                            MojFind("#ShiftsEmbedsDetails_AdvocateContactId").change();
                                            MojFind("#ShiftsEmbedsDetails_AdvocateContactId").enable(true);
                                        }
                                    });
                                }
                                else {
                                    MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_AdvocateContactId", null);
                                    MojFind("#ShiftsEmbedsDetails_AdvocateContactId").change();
                                    MojFind("#ShiftsEmbedsDetails_AdvocateContactId").enable(true);

                                    //remove last name attribute of input element - reset the control filter
                                    $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("lastname");
                                    $("[name^='ShiftsEmbedsDetails.AdvocateContactId_input']").removeAttr("title");
                                }



                                Moj.showMessage(errorMessage, undefined, Resources.Strings.Error, MessageType.Error);
                            }
                            else {

                                if (data.CurrentAdvocateTypeId != AdvocateType.Internal) {
                                    if (shiftTypeId == ShiftTypeEnum.Readings) {
                                        MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_EmploymentTypeId", data.AdvocateReadingContractEmploymentTypeId);
                                        MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(false);
                                    }
                                    else
                                        getAdvocateEmploymentInDistrictId(currentAdvocateContactId);

                                    MojFind("#ShiftsEmbedsDetails_IsInternalAdvocate").val("False");
                                }
                                else //סנגור פנימי
                                {
                                    MojFind("#ShiftsEmbedsDetails_IsInternalAdvocate").val("True");
                                    MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_EmploymentTypeId", null);
                                    //MojControls.AutoComplete.setDataSourceAndValue("ShiftsEmbedsDetails_EmploymentTypeId", null, null, false);
                                    MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(false);

                                }
                            }

                        },
                    });
                }

                else {

                    $.get(baseUrl + '/Shift/IsInternalAdvocate?advocateContactId=' + currentAdvocateContactId, function (data) {
                        if (!Moj.isTrue(data.IsInternal)) {
                            getAdvocateEmploymentInDistrictId(currentAdvocateContactId);
                            MojFind("#ShiftsEmbedsDetails_IsInternalAdvocate").val("False");
                        }
                        else {
                            MojFind("#ShiftsEmbedsDetails_IsInternalAdvocate").val("True");
                            MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_EmploymentTypeId", null);
                            //MojControls.AutoComplete.setDataSourceAndValue("ShiftsEmbedsDetails_EmploymentTypeId", null, null, false);
                            MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(false);
                        }
                    });
                }
            }
            else
            {
                if (errorMessage != "")
                 Moj.showMessage(errorMessage, undefined, Resources.Strings.Error, MessageType.Error);
            }

        }
        else {
            MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_EmploymentTypeId", null);
            //MojControls.AutoComplete.setDataSourceAndValue("ShiftsEmbedsDetails_EmploymentTypeId", null, null, false);
            MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(false);
        }
    });

});

MojFind('#ShiftsEmbedsDetails_EmploymentTypeId').die('change');
MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").live('change', function () {

    if (!Moj.isTrue(MojFind("#IsNewLine").val())) {
        var originalEmploymentTypeId = MojFind("#OriginalEmploymentTypeId").val();
        var originalAdvocateContactId = MojFind("#OriginalAdvocateContactId").val();
        var shiftId = MojFind("#ShiftsEmbedsDetails_ShiftId").val();
        var currentEmploymentTypeId = this.value;

        if (currentEmploymentTypeId != "") {
            if (originalEmploymentTypeId != "" && originalAdvocateContactId != "") {
                $.get(baseUrl + '/Shift/GetUnpaidFeeRequestList?shiftId=' + shiftId + '&originalAdvocateContactId=' + originalAdvocateContactId + '&originalEmploymentTypeId=' + originalEmploymentTypeId, function (data) {
                    if (data.UnpaidFeeRequests.length > 0) {
                        var unpaidFeeRequestsIds = "";
                        for (var i = 0; i < data.UnpaidFeeRequests.length; i++) {
                            unpaidFeeRequestsIds += i != data.UnpaidFeeRequests.length - 1 ? " " + data.UnpaidFeeRequests[i] + ',' : " " + data.UnpaidFeeRequests[i];
                        }
                        var error = String.format(Resources.Messages.ErrActiveFeeRequestChangeEmploymentType, unpaidFeeRequestsIds)
                        Moj.showMessage(error, undefined, Resources.Strings.Error, MessageType.Error);
                        MojControls.AutoComplete.setValueById("ShiftsEmbedsDetails_EmploymentTypeId", originalEmploymentTypeId);
                    }
                });
            }
        }
    }
});



getAdvocateEmploymentInDistrictId = function (currentAdvocateContactId) {
    $.get(baseUrl + '/Process/GetAdvocateEmploymentInDistrictId?advocateContactId=' + currentAdvocateContactId, function (data) {
        if (data != null) {
            if (data.length == 1) {
                MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(true);
                MojControls.AutoComplete.setDataSourceAndValue("ShiftsEmbedsDetails_EmploymentTypeId", data, data[0].Key, true);
            }
            else {
                MojFind("#ShiftsEmbedsDetails_EmploymentTypeId").enable(true);
                MojControls.AutoComplete.setDataSource("ShiftsEmbedsDetails_EmploymentTypeId", data);
            }
        };
    });
};


handleTimeField = function (element) {
    if (element.value != "" && element.value.split(" ")[1] != MojFind("#ShiftsEmbedsDetails_FromTime").val()) {
        Moj.showMessage("אין אפשרות לשנות את התאריך", undefined, Resources.Strings.Error, MessageType.Error);
        element.value = element.value.split(" ")[0] + " " + MojFind("#ShiftsEmbedsDetails_FromTime").val();
    }
    else {
        MojControls.DateTimePicker.setValueById(element.id + "String", element.value.split(" ")[0]);
    }

};


enableDisableDatesFields = function (isEnabled) {

    MojFind("#ShiftsEmbedsDetails_PlannedFromTime").enable(isEnabled);
    MojFind("#ShiftsEmbedsDetails_PlannedToTime").enable(isEnabled);

    if (isEnabled && Moj.isTrue(MojFind("#IsActualPerformance").val()) || !isEnabled) {
        MojFind("#ShiftsEmbedsDetails_ActualFromTime").enable(isEnabled);
        MojFind("#ShiftsEmbedsDetails_ActualToTime").enable(isEnabled);
    }

};

resetDatesFields = function () {
    MojFind("#ShiftsEmbedsDetails_PlannedFromTime").val("");
    MojFind("#ShiftsEmbedsDetails_PlannedFromTimeString").val("");
    MojFind("#ShiftsEmbedsDetails_PlannedToTime").val("");
    MojFind("#ShiftsEmbedsDetails_PlannedToTimeString").val("");
    MojFind("#ShiftsEmbedsDetails_ActualFromTime").val("");
    MojFind("#ShiftsEmbedsDetails_ActualFromTimeString").val("");
    MojFind("#ShiftsEmbedsDetails_ActualToTime").val("");
    MojFind("#ShiftsEmbedsDetails_ActualToTimeString").val("");
};


