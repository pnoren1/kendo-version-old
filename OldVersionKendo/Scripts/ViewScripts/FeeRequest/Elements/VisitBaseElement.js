function VisitBaseElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

        self.checkActivityTimeMinutes = function (element) {
            if (element.value > 59) {
                self.invalidVisitTimeValue(element, Resources.Messages.ErrInvalidMinutesVisitTime);
            }
            else {
                if (element.value == "") {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
                    MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
                    MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime
                }
                else
                    self.calculateTotalTime(element);
            }
        },

        self.checkActivityTimeHours = function (element) {
            if (element.value > 23) {
                self.invalidVisitTimeValue(element, Resources.Messages.ErrInvalidHoursVisitTime);
            }
            else {
                if (element.value == "") {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
                    MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
                    MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime
                }
                else
                    self.calculateTotalTime(element);
            }
        },

        self.calculateTotalTime = function (element) {
            var activityFromTimeHours = MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").val();
            var activityFromTimeMinutes = MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").val();
            var activityToTimeHours = MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").val();
            var activityToTimeMinutes = MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").val();

            if (activityFromTimeHours != "" && activityFromTimeMinutes != "" && activityToTimeHours != "" && activityToTimeMinutes != "") {
                if (MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() == "") {
                    var activityFromTimeDate = "01/01/2000" + " " + activityFromTimeHours + ":" + activityFromTimeMinutes;
                    var activityToTimeDate = "01/01/2000" + " " + activityToTimeHours + ":" + activityToTimeMinutes;
                }
                else {
                    var activityFromTimeDate = MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() + " " + activityFromTimeHours + ":" + activityFromTimeMinutes;
                    var activityToTimeDate = MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() + " " + activityToTimeHours + ":" + activityToTimeMinutes;
                    MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(activityFromTimeDate); // // הערך שנכנס לדיבי - ActivityFromTime
                    MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(activityToTimeDate); // הערך שנכנס לדיבי - ActivityToTime
                }

                var activityFromTimeDateConverted = new Date(activityFromTimeDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
                var activityToTimeDateConverted = new Date(activityToTimeDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));



                if (activityFromTimeDateConverted > activityToTimeDateConverted) // בודק אם משעה גדול מ- עד שעה
                {
                    Moj.showMessage(Resources.Messages.ErrNegativeTimesDiff, undefined, Resources.Strings.Error, MessageType.Error);
                    MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeHours", "");
                    MojControls.TextBox.setValueById(self.getFieldPrefix() + "ActivityToTimeMinutes", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                }

                else {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", PDO.calculateDatesDiff(activityFromTimeDate, activityToTimeDate));

                    var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();
                    var feeActivityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "FeeActivityTypeId");

                    if (feeActivityTypeId != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(self.getFieldPrefix() + "FeeActivityTypeId") != -1) {
                        self.getTotalSum(totalTime, feeActivityTypeId);
                    }

                }
            }

        },

        self.invalidVisitTimeValue = function (element, message) {
            Moj.showMessage(message, undefined, Resources.Strings.Error, MessageType.Error);
            element.value = "";
            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
            MojFind("#" + self.getFieldPrefix() + "ActivityFromTime").val(""); // // הערך שנכנס לדיבי - ActivityFromTime
            MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(""); // הערך שנכנס לדיבי - ActivityToTime

        },

        self.addMaskToTimesFields = function () {
            MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").mask('99');
            MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").mask('99');
            MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").mask('99');
            MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").mask('99');
        },

        self.getTotalSum = function (totalTime, feeActivityTypeId) {
            Moj.safePost("/FeeRequest/GetTotalSumToVisit", { totalTime: totalTime, feeActivityTypeId: feeActivityTypeId }, function (data) {
                if (data.TotalSum != undefined) {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.TotalSum);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.RateValue);
                    MojControls.Hidden.setValueById(self.getFieldPrefix() + "FeeRateTypeId", data.FeeRateTypeId);
                }

            });
        },

        $(document).ready(function () {

            if (MojFind("#" + self.getFieldPrefix() + "TotalSum").val() < 0) {
                MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').css("color", "#C00509")
                MojFind("#" + self.getFieldPrefix() + "TotalSum").closest('div').attr("style", "direction:ltr ; width:130px");
            }

            MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeHours").change(function () {
                self.checkActivityTimeHours(this);
            });

            MojFind("#" + self.getFieldPrefix() + "ActivityFromTimeMinutes").change(function () {
                self.checkActivityTimeMinutes(this);
            });

            MojFind("#" + self.getFieldPrefix() + "ActivityToTimeHours").change(function () {
                self.checkActivityTimeHours(this);
            });

            MojFind("#" + self.getFieldPrefix() + "ActivityToTimeMinutes").change(function () {
                self.checkActivityTimeMinutes(this);
            });

            MojFind("#" + self.getFieldPrefix() + "ActivityDate").change(function () {
                self.calculateTotalTime(this);
            });


            MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {

                var isRequired = MojControls.Hidden.getValueById("SubmissionDetails_Elements_VisitBaseElement_IsRequiredPart")

                if (!Moj.isTrue(isRequired)) {

                    MojFind("[id^='SubmissionDetails_Elements_VisitBaseElement'].visitBaseEnable").enable(false);

                    MojControls.DateTimePicker.setValueById("SubmissionDetails_Elements_VisitBaseElement_ActivityDate", null)
                    MojControls.Label.setValueById("SubmissionDetails_Elements_VisitBaseElement_TotalTime", "")
                    MojControls.Label.setValueById("SubmissionDetails_Elements_VisitBaseElement_TotalSum", "")
                    MojControls.TextBox.setValueById("SubmissionDetails_Elements_VisitBaseElement_ActivityFromTimeMinutes", "")
                    MojControls.TextBox.setValueById("SubmissionDetails_Elements_VisitBaseElement_ActivityFromTimeHours", "")
                    MojControls.TextBox.setValueById("SubmissionDetails_Elements_VisitBaseElement_ActivityToTimeMinutes", "")
                    MojControls.TextBox.setValueById("SubmissionDetails_Elements_VisitBaseElement_ActivityToTimeHours", "")
                }
                else {
                    MojFind("[id^='SubmissionDetails_Elements_VisitBaseElement'].visitBaseEnable").enable(true);
                    self.addMaskToTimesFields();
                }

            });

            MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").change(function () {

                var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();

                var feeActivityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "FeeActivityTypeId");

                if (feeActivityTypeId != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(self.getFieldPrefix() + "FeeActivityTypeId") != -1 && totalTime != "") {
                    self.getTotalSum(totalTime, feeActivityTypeId);
                }
                else {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
                }

            });


        })
}