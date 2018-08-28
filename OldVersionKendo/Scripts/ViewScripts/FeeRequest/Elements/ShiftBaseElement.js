function ShiftBaseElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    //self.checkActivityTimeMinutes = function(element) 
    //{
    //    if (element.value.split(" ")[0].split(":")[1] > 59) {
    //        self.invalidShiftTimeValue(element, Resources.Messages.ErrInvalidMinutesShiftTime);
    //    }
    //    else {
    //        if (element.value.split(" ")[0].split(":")[1] == "") {
    //            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
    //            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
    //            MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
    //            MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime
    //        }
    //        else
    //            self.calculateTotalTime(element);
    //    }
    //},

    //    self.checkActivityTimeHours = function (element) {
    //    if (element.value.split(" ")[0].split(":")[0] > 23) {
    //        self.invalidShiftTimeValue(element, Resources.Messages.ErrInvalidHoursShiftTime);
    //    }
    //    else {
    //        if (element.value.split(" ")[0].split(":")[0] == "") {
    //            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
    //            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
    //            MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
    //            MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime
    //        }

    //        else
    //            self.calculateTotalTime(element);
    //    }
    //},

    self.enableDisableFields = function()
    {
        
        var selectOtherAdvocateFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SelectOtherAdvocateFieldPrefix").val();
        var feeRequestLineDetailTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRequestLineDetailTypeId").val();
        var feeRequestLineId = MojFind("#GeneralDetails_FeeRequestLineId").val(); //מציין אם שורה חדשה או קיימת
        if ((feeRequestLineDetailTypeId == FeeRequestLineDetailType.SubmissionDetails.toString() || feeRequestLineDetailTypeId == FeeRequestLineDetailType.ExaminationDetails.toString())
            && feeRequestLineId == "")
        {
            MojFind("#" + self.getFieldPrefix() + "ActivityDate").enable(true);
            MojFind("#" + selectOtherAdvocateFieldPrefix + "IsReplacementAdvocate").enable(false);
        }
        else
            {
            MojFind("#" + self.getFieldPrefix() + "ActivityDate").enable(false);

        }

    },

        self.invalidShiftTimeValue = function (element, message) {
            Moj.showMessage(message, undefined, Resources.Strings.Error, MessageType.Error);
            element.value = "";
            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
            MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
            MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime
            
        },

        self.enableDisableSelectAdvocateElement = function (isEnable) {
            var selectAdvocateFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SelectOtherAdvocateFieldPrefix").val();
            MojFind("#" + selectAdvocateFieldPrefix + "IsReplacementAdvocate").enable(isEnable);
            MojControls.CheckBox.setValueById(selectAdvocateFieldPrefix + "IsReplacementAdvocate", isEnable);
            MojFind("#" + selectAdvocateFieldPrefix + "IsReplacementAdvocate").change();
        },

        self.calculateTotalTime = function (element) {
        //    var activityFromTimeHours = MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").val();
        //    var activityFromTimeMinutes =MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").val();
        //    var activityToTimeHours =MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").val();
        //    var activityToTimeMinutes = MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").val();
            var fromTime = MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val();
            var toTime = MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val();

            //if (activityFromTimeHours != "" && activityFromTimeMinutes != "" && activityToTimeHours != "" && activityToTimeMinutes != "")
            //{
            //    //var activityFromTime = fromTime.split(' ')[0] + " " + activityFromTimeHours + ":" + activityFromTimeMinutes;
                //var activityToTime = toTime.split(' ')[0] + " " + activityToTimeHours + ":" + activityToTimeMinutes;

                //var activityFromTimeDateConverted = new Date(activityFromTimeDate.split(' ')[0] + ' ' + activityFromTimeDate.split(' ')[1].split('/')[1] + "/" + activityFromTimeDate.split(' ')[1].split('/')[0] + "/" + activityFromTimeDate.split(' ')[1].split('/')[2]);
                ////var activityFromTimeDateConverted = new Date(activityFromTimeDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
                ////var activityToTimeDateConverted = new Date(activityToTimeDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
                //var activityToTimeDateConverted = new Date(activityToTimeDate.split(' ')[0] + ' ' + activityToTimeDate.split(' ')[1].split('/')[1] + "/" + activityToTimeDate.split(' ')[1].split('/')[0] + "/" + activityToTimeDate.split(' ')[1].split('/')[2]);
                
                //MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(activityFromTime); // // הערך שנכנס לדיבי - ActivityFromTime
                //MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(activityToTime); // הערך שנכנס לדיבי - ActivityToTime
                
                if (PDO.FromTimeGreatherThanToTime(fromTime, toTime)) // בודק אם משעה גדול מ- עד שעה
               // if (activityFromTimeDateConverted > activityToTimeDateConverted) 
                {
                    Moj.showMessage(Resources.Messages.ErrNegativeTimesDiff, undefined, Resources.Strings.Error, MessageType.Error);
                    MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityToTime", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                }

                else
                {
                    var dateDiff = PDO.calculateDatesDiff(fromTime, toTime);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", dateDiff);
                    if (dateDiff > "24:00") {
                        Moj.showMessage(Resources.Messages.ActivityTotalTimeOver24, undefined, Resources.Strings.Error, MessageType.Error);
                        MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityToTime", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                    }
                    else {

                        var feeRateTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val();
                        if (feeRateTypeId != "") {
                            var rateDate = MojFind("#" + self.getFieldPrefix() + "RateDate").val();
                            var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();
                            Moj.safePost("/FeeRequest/GetNewTotalSumAndRateValue", { feeRateTypeId: feeRateTypeId, rateDate: rateDate, totalTime: totalTime }, function (data) {
                                if (data.NewTotalSum != undefined)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.NewTotalSum);
                                if (data.NewRateValue != undefined)
                                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.NewRateValue);
                                if (data.NewRateDate != undefined)
                                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", data.NewRateDate);

                            });
                        }
                    }
                }

        },


    self.clearActivityDateFields = function()
    {
        MojControls.AutoComplete.clearSelection(MojFind("#" + self.getFieldPrefix() + "ActivityTypeId"));
        MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").enable(false);
        MojFind("#" + self.getFieldPrefix() + "ActivityDate").val("");
        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftTypeName", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftId", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftHours", "");
        MojControls.Hidden.setValueById(self.getFieldPrefix() + "CourtId", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "CourtName", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftHours", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftActualHours", "");
        MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").enable(false);
        MojFind("#" + self.getFieldPrefix() + "ActivityToTime").enable(false);
        //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").enable(false);
        //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").enable(false);
        //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").enable(false);
        //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").enable(false);
        //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeMinutes", "")
        //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeHours", "")
        //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeMinutes", "")
        //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeHours", "")
    },

        self.onExitActivityDate = function () {

        var advocateContactId = MojFind("#" + self.getFieldPrefix() + "AdvocateContactId").val();
        var shiftDate = MojFind("#" + self.getFieldPrefix() + "ActivityDate").val();
        var districtId = MojFind("#" + self.getFieldPrefix() + "DistrictId").val();
        var selectOtherAdvocateFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SelectOtherAdvocateFieldPrefix").val();

        Moj.safePost("/FeeRequest/OnExitActivityDate", { advocateContactId: advocateContactId, shiftDate: shiftDate, districtId: districtId }, function (data) {
            if (data.Error == undefined) {
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftId", data.shiftId);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftTypeName", data.shiftTypeName);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftHours", data.shiftHours);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftActualHours", data.shiftActualHours);

                MojControls.Hidden.setValueById(self.getFieldPrefix() + "CourtId", data.courtId);
                MojControls.Label.setValueById(self.getFieldPrefix() + "CourtName", data.courtName);
                MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").enable(true);
                MojFind("#" + self.getFieldPrefix() + "ActivityToTime").enable(true);
                MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(data.fromTime);
                MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(data.toTime);
                MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").enable(true);
                MojFind("#" + selectOtherAdvocateFieldPrefix + "IsReplacementAdvocate").enable(true);
                //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").enable(true);
                //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").enable(true);
                //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").enable(true);
                //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").enable(true);
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeMinutes", data.activityFromTimeMinutes);
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeHours", data.activityFromTimeHours);
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeMinutes", data.activityToTimeMinutes);
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeHours", data.activityToTimeHours);
                //self.addMaskToTimesFields();

            }
            else {
                MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", "");

                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftId", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftTypeName", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftHours", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftActualHours", "");
                MojControls.Hidden.setValueById(self.getFieldPrefix() + "CourtId", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "CourtName", "");

                MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").enable(false);
                self.enableDisableSelectAdvocateElement(false);

                Moj.showMessage(data.Error, undefined, Resources.Strings.Error, MessageType.Error);
                MojFind("#" + self.getFieldPrefix() + "ActivityDate").focus();
            }
            self.calculateTotalTime(null);
        });

    },

    //self.addMaskToTimesFields = function () {
    //    //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").mask('99');
    //    //MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").mask('99');
    //    //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").mask('99');
    //    //MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").mask('99');
    //},

        $(document).ready(function () {

        PDO.checkFeeRequestTotalSumLabel(self.getFieldPrefix());

        self.enableDisableFields();

        MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").change(function () {
            var activityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityTypeId");



            if (activityTypeId != "")
            {
                Moj.safePost("/FeeRequest/GetFeeRateType", { feeActivityTypeId: activityTypeId }, function (data) {
                    if (data.NewFeeRateType != undefined) {
                        MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(data.NewFeeRateType);
                        var feeRateTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val();
                        var rateDate = MojFind("#" + self.getFieldPrefix() + "RateDate").val();
                        var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();
                        Moj.safePost("/FeeRequest/GetNewTotalSumAndRateValue", { feeRateTypeId: feeRateTypeId, rateDate: rateDate, totalTime: totalTime }, function (data) {
                            if (data.NewTotalSum != undefined)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.NewTotalSum);
                            if (data.NewRateValue != undefined)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.NewRateValue);
                            if (data.NewRateDate != undefined)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", data.NewRateDate);

                        });
                    }
                });
            }
            else
            {
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
                MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val("");

            }

        });

       // MojFind("#" + self.getFieldPrefix() + "ActivityDate").die('change');
        MojFind("#" + self.getFieldPrefix() + "ActivityDate").unbind("blur").blur(function () {

            if (!Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ActivityDate").is('[readonly]'))) //only when the control is active (not readonly)
            {
                var submissionDetailsFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SubmissionDetailsFieldPrefix").val();
                var submissionDetailsActivityDate = MojFind("#" + submissionDetailsFieldPrefix + "ActivityDate").val();

                //var examinationDetailsActivityDate = MojFind('input[id$="ActivityDate"]')[1].value;
                var feeRequestLineDetailTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRequestLineDetailTypeId").val();

                var selectOtherAdvocateFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SelectOtherAdvocateFieldPrefix").val();
                MojControls.AutoComplete.clearSelection(MojFind("#" + selectOtherAdvocateFieldPrefix + "ReplacementAdvocateId"));
                MojFind("#div_" + selectOtherAdvocateFieldPrefix + "btnShowDetails").hide();
                MojControls.Label.setValueById(selectOtherAdvocateFieldPrefix + "ReplacementWarning", "");

                if (this.value != "" && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ActivityDate").valid())) {
                    if (((feeRequestLineDetailTypeId == FeeRequestLineDetailType.ExaminationDetails) || (feeRequestLineDetailTypeId == FeeRequestLineDetailType.ApprovalDetails)) && submissionDetailsActivityDate != "")
                    {
                        if (this.value != submissionDetailsActivityDate) {
                            Moj.showMessage(String.format(Resources.Messages.ErrEqualSubmissionDetailsActivityDate, feeRequestLineDetailTypeId == FeeRequestLineDetailType.ExaminationDetails ? Resources.Strings.ExaminationDetails : Resources.Strings.ApprovalDetails), undefined, Resources.Strings.Error, MessageType.Error);
                            self.clearActivityDateFields();
                        }
                        else
                            self.onExitActivityDate();
                    }
                    else
                        self.onExitActivityDate();
                }

                else
                {
                    self.clearActivityDateFields();
                    self.enableDisableSelectAdvocateElement(false);
                }
            }

        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
            var isRequired = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart");

            if (!Moj.isTrue(isRequired)) {
                MojFind("[id^='" + self.getFieldPrefix() + "'].shiftBaseEnable").enable(false);
                MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").enable(false); // סוג פעילות
                MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", null)
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftTypeName", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftId", "")
                MojControls.Hidden.setValueById(self.getFieldPrefix() + "CourtId", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "CourtName", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftHours", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "ShiftActualHours", "");
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "ActivityTypeId", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "")
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeMinutes", "")
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityFromTimeHours", "")
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeMinutes", "")
                //MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeHours", "")

            }
            else
            {
                MojFind("[id^='" + self.getFieldPrefix() + "'].shiftBaseEnable").enable(true);
                //self.addMaskToTimesFields();
            }
                
        });

        MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").change(function () {
            self.calculateTotalTime(this);
        });


        MojFind("#" + self.getFieldPrefix() + "ActivityToTime").change(function () {
            self.calculateTotalTime(this);
        });



    });

}
