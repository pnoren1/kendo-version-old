function CallVisitBaseElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    self.enableDisableFields = function () {

        var selectAdvocateFieldPrefix = MojFind("#" +self.getFieldPrefix() + "SelectAdvocateFieldPrefix").val();
        var feeRequestLineDetailTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRequestLineDetailTypeId").val();
        var feeRequestLineId = MojFind("#GeneralDetails_FeeRequestLineId").val(); //מציין אם שורה חדשה או קיימת

        if ((feeRequestLineDetailTypeId == FeeRequestLineDetailType.SubmissionDetails.toString() || feeRequestLineDetailTypeId == FeeRequestLineDetailType.ExaminationDetails.toString())
            && feeRequestLineId == "")
            {
               // MojFind("#" +self.getFieldPrefix() + "ProcessId").enable(true);
                MojFind("#" +selectAdvocateFieldPrefix + "IsReplacementAdvocate").enable(false);
            }
        //else
        //{
          //  MojFind("#" + self.getFieldPrefix() + "ProcessId").enable(false);
            //MojFind("#" + self.getFieldPrefix() + "ProcessId")[0].setAttribute("disabled", "disabled"); //enable user select option in the control
        //}
            

    },

    self.getNewTotalSumAndRateValue = function (feeRateTypeId, rateDate, totalTime) {
        Moj.safePost("/FeeRequest/GetNewTotalSumAndRateValue", { feeRateTypeId: feeRateTypeId, rateDate: rateDate, totalTime: totalTime }, function (data) {
            if (data.NewTotalSum != undefined)
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.NewTotalSum);
            if (data.NewRateValue != undefined)
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.NewRateValue);
            if (data.NewRateDate != undefined)
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", data.NewRateDate);

        });
    },

        self.setProcessFields = function (processTypeName, consultationTypeName, nominationConsultationTime, consultationEndTime, applicantMeetingPlace, applicantName) {

        MojControls.Label.setValueById(self.getFieldPrefix() + "ProcessType", processTypeName);
        MojControls.Label.setValueById(self.getFieldPrefix() + "NominationConsultationTime", nominationConsultationTime);
        MojControls.Label.setValueById(self.getFieldPrefix() + "ConsultationEndTime", consultationEndTime);
        MojControls.Label.setValueById(self.getFieldPrefix() + "ApplicantMeetingPlace", applicantMeetingPlace);
        MojControls.Label.setValueById(self.getFieldPrefix() + "ConsultationTypeName", consultationTypeName);
        MojControls.Label.setValueById(self.getFieldPrefix() + "ApplicantName", applicantName);


        MojFind("#" + self.getFieldPrefix() + "ActivityDate").val(nominationConsultationTime);
        

        MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val(consultationEndTime);
        MojFind("#" + self.getFieldPrefix() + "ActivityDate").change();
    },

    self.getFeeRateType = function () {
        
        var activityTypeId = MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").val();
        if (activityTypeId != "")
        {
                Moj.safePost("/FeeRequest/GetFeeRateType", { feeActivityTypeId: activityTypeId
                }, function (data) {
            if (data.NewFeeRateType != undefined) {
                        
                        MojFind("#" +self.getFieldPrefix() + "FeeRateTypeId").val(data.NewFeeRateType);
                        var feeRateTypeId = MojFind("#" +self.getFieldPrefix() + "FeeRateTypeId").val();
                        var rateDate = MojFind("#" +self.getFieldPrefix() + "RateDate").val();
                        var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();
                self.getNewTotalSumAndRateValue(feeRateTypeId, rateDate, totalTime);
            }
        });
        }
        else
        {
            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");
        }
    },

    self.onExitProcessId = function (processId) {
        
        var districtId = MojFind("#DistrictId").val();
        var advocateContactId = MojFind("#AdvocateContactId").val();
        var districtId = MojFind("#DistrictId").val();
        var selectAdvocateFieldPrefix = MojFind("#" +self.getFieldPrefix() + "SelectAdvocateFieldPrefix").val();

        Moj.safePost("/FeeRequest/onExitProcessId", { processId: processId, districtId: districtId, advocateContactId: advocateContactId }, function (data) {
            
            if (data.Error == undefined)
            {
                var activityPlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "ActivityPlaceFieldPrefix").val();
                if (data.ManagedPlaceOrOtherPlace == FeeRequestPlaceType.OtherPlace)
                    {
                        MojControls.RadioButton.setValueById(activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace", data.ManagedPlaceOrOtherPlace);
                        MojFind("[id*='" + activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change();
                        MojFind("#" + activityPlaceFieldPrefix + "PlaceName").val(data.PlaceName);
                }
                else if (data.ManagedPlaceOrOtherPlace == FeeRequestPlaceType.ManagedPlace)
                {
                    MojControls.RadioButton.setValueById(activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace", data.ManagedPlaceOrOtherPlace);
                    MojFind("[id*='" +activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change();
                    MojControls.AutoComplete.setValueById(activityPlaceFieldPrefix + "PlaceTypeId", data.PlaceTypeId)
                    MojControls.AutoComplete.setDataSourceAndValue(activityPlaceFieldPrefix + "PlaceId", data.Places, data.PlaceId)
                }

                self.setProcessFields(data.ProcessTypeName, data.ConsultationTypeName, data.NominationConsultationTime, data.ConsultationEndTime, data.ApplicantMeetingPlace, data.ApplicantName);
                self.enableDisableProcessFields(true);
                MojFind("#" +selectAdvocateFieldPrefix + "IsReplacementAdvocate").enable(true);

                if (MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() != "" && MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val() != "")
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", PDO.calculateDatesDiff(MojFind("#" + self.getFieldPrefix() + "ActivityDate").val(), MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val()));
            }

            else
            {
                self.clearProcessFields();
                self.enableDisableProcessFields(false);
                self.enableDisableSelectAdvocateElement(false);
                Moj.showMessage(data.Error, undefined, Resources.Strings.Error, MessageType.Error);

            }
             
        });
    },
    self.activityTimeChange = function (element) {

        var ActivityDate = MojFind("#" + self.getFieldPrefix() + "ActivityDate").val();
        var activityToTime = MojFind("#" + self.getFieldPrefix() + "ActivityToTime").val();
        var selectAdvocateFieldPrefix = MojFind("#" + self.getFieldPrefix() + "SelectAdvocateFieldPrefix").val();

        var date1Converted = new Date(ActivityDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        var date2Converted = new Date(activityToTime.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));


        MojControls.AutoComplete.clearSelection(MojFind("#" + selectAdvocateFieldPrefix + "ReplacementAdvocateId"));
        MojFind("#div_" + selectAdvocateFieldPrefix + "btnShowDetails").hide();
        MojControls.Label.setValueById(selectAdvocateFieldPrefix + "ReplacementWarning", "");

        if (ActivityDate != "" && activityToTime != "" && date1Converted < date2Converted) {

            // diffrence between dates up to 24 hours (not include 24)
            if (date2Converted - date1Converted < 86400000)
            {
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", PDO.calculateDatesDiff(ActivityDate, activityToTime));

                //update TotalSum and Rate Value when TotalTime field changed
                var activityTypeId = MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").val();
                var totalTime = MojFind("#" + self.getFieldPrefix() + "ActivityTotalTime").val();
                if (activityTypeId != "" && totalTime != "") {
                    var feeRateTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val();
                    var rateDate = MojFind("#" + self.getFieldPrefix() + "RateDate").val();
                    self.getNewTotalSumAndRateValue(feeRateTypeId, rateDate, totalTime);
                }
            }
            else
            {
                Moj.showMessage(Resources.Messages.ErrDifferenceBetweenDatesOver24Hours, undefined, Resources.Strings.Error, MessageType.Error);
                MojControls.DateTimePicker.ClearDateTimePickerValueIncludeHistoryTime(element[0].id);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
                MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");
            }


        }
        else {
            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
            MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");

            if (element.val() == "")
                MojControls.DateTimePicker.ClearDateTimePickerValueIncludeHistoryTime(element[0].id);

        }
    },

    self.clearSelectActivityPlaceFields = function () {
        var activityPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "ActivityPlaceFieldPrefix").val();
        MojControls.RadioButton.setValueById(activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace", FeeRequestPlaceType.ManagedPlace);
        MojFind("[id*='" + activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change();
        MojControls.AutoComplete.clearSelectionById(activityPlaceFieldPrefix + "PlaceTypeId");
        MojControls.AutoComplete.clearSelectionById(activityPlaceFieldPrefix + "PlaceId");

    },


    self.clearProcessFields = function () {
        MojFind("#" + self.getFieldPrefix() + "ProcessId").val("");
        self.setProcessFields("", "", "", "", "", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalTime", "");
        self.clearSelectActivityPlaceFields();
        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
        MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");
        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "FeeActivityTypeId");

    },


    self.enableDisableProcessFields = function (isEnable) {
        
        var activityPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "ActivityPlaceFieldPrefix").val();
            MojFind("#" + activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace_1").enable(isEnable);
            MojFind("#" + activityPlaceFieldPrefix + "ManagedPlaceOrOtherPlace_2").enable(isEnable);
            MojFind("#" + activityPlaceFieldPrefix + "PlaceTypeId").enable(isEnable);
            MojFind("#" + activityPlaceFieldPrefix + "PlaceId").enable(isEnable);
            MojFind("#" + self.getFieldPrefix() + "ActivityDate").enable(isEnable);
            MojFind("#" + self.getFieldPrefix() + "ActivityToTime").enable(isEnable);
            MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").enable(isEnable);

            },

    self.enableDisableSelectAdvocateElement = function (isEnable) {
            var selectAdvocateFieldPrefix = MojFind("#" +self.getFieldPrefix() + "SelectAdvocateFieldPrefix").val();
            MojFind("#" + selectAdvocateFieldPrefix + "IsReplacementAdvocate").enable(isEnable);
            MojControls.CheckBox.setValueById(selectAdvocateFieldPrefix + "IsReplacementAdvocate", isEnable);
            MojFind("#" +selectAdvocateFieldPrefix + "IsReplacementAdvocate").change();
    },

    $(document).ready(function () {
        //if (Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ProcessId").is('[readonly]')))
        //    MojFind("#" + self.getFieldPrefix() + "ProcessId")[0].setAttribute("disabled", "disabled"); //enable user select option in the control

        PDO.checkFeeRequestTotalSumLabel(self.getFieldPrefix());

        self.enableDisableFields();

        MojFind("#" + self.getFieldPrefix() + "ProcessId").on('keypress', function (e) {
            if (e.keyCode == 13) {
                MojFind("#" + self.getFieldPrefix() + "ProcessId").change();
                return false;
            }
        });

        MojFind("#" + self.getFieldPrefix() + "ProcessId").change(function () {
            var submissionDetailsProcessId = MojFind('input[id$="ProcessId"]')[0].value;
            var examinationDetailsProcessId = MojFind('input[id$="ProcessId"]')[1].value;
            if (this.value != "" && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ProcessId").valid())) {
                if (examinationDetailsProcessId != "" && submissionDetailsProcessId != "") {
                    if (examinationDetailsProcessId != submissionDetailsProcessId) {
                    Moj.showMessage(Resources.Messages.ErrSubmissionDetailsExaminationDetailsProcessId, undefined, Resources.Strings.Error, MessageType.Error);
                        self.clearProcessFields();
                        self.enableDisableProcessFields(false);
                        self.enableDisableSelectAdvocateElement(false);

                }
                else
                        self.onExitProcessId(this.value);

            }
                else
                    self.onExitProcessId(this.value);
            }
            else {
                self.clearProcessFields();
                self.enableDisableProcessFields(false);
                self.enableDisableSelectAdvocateElement(false);
            }


        });

        MojFind("#" + self.getFieldPrefix() + "ActivityDate").change(function () {

            self.activityTimeChange(MojFind("#" + self.getFieldPrefix() + "ActivityDate"));

            if (MojFind("#GeneralDetails_LineActivityClassificationId").val() == FeeActivityTypeClassification.Base)
            {
                if (MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() != "" && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ActivityDate").valid())) {
                    if (self.getFieldPrefix() == "ExaminationDetails_Elements_CallVisitBaseElement_") // פאנל פרטי בדיקה
                    {
                        MojFind("#DateForCallProcesses").val(MojFind("#" + self.getFieldPrefix() + "ActivityDate").val());
                        var splitted = MojFind("#DateForCallProcesses").val().split(" ");
                        MojFind("#DateForCallProcesses").val(splitted[1] + " " + splitted[0]);
                        MojFind("#btnCallProcesses").enable(true);
                    }
                    else if (self.getFieldPrefix() == "ApprovalDetails_Elements_CallVisitBaseElement_") {
                        MojFind("#DateForCallProcesses").val(MojFind("#" + self.getFieldPrefix() + "ActivityDate").val());
                        var splitted = MojFind("#DateForCallProcesses").val().split(" ");
                        MojFind("#DateForCallProcesses").val(splitted[1] + " " + splitted[0]);
                        MojFind("#btnCallProcesses").enable(true);
                    }

                }
                else {
                    if (self.getFieldPrefix() == "ExaminationDetails_Elements_CallVisitBaseElement_") // פאנל פרטי בדיקה
                    {
                        MojFind("#DateForCallProcesses").val("");
                        MojFind("#btnCallProcesses").enable(false);
                    }

                    else if (self.getFieldPrefix() == "ApprovalDetails_Elements_CallVisitBaseElement_") {
                        MojFind("#DateForCallProcesses").val("");
                        MojFind("#btnCallProcesses").enable(false);
                    }
                }
            }

        });

        MojFind("#" + self.getFieldPrefix() + "ActivityToTime").change(function () {
            self.activityTimeChange(MojFind("#" + self.getFieldPrefix() + "ActivityToTime"));
        });

        MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").change(function () {
            if (!isNaN(MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").val()))
                self.getFeeRateType();
        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {

            var isRequired = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart");

            if (!Moj.isTrue(isRequired)) {
                MojFind("[id^='" + self.getFieldPrefix() + "'].callVisitBaseEnable").enable(false);
                MojControls.TextBox.setValueById(self.getFieldPrefix() + "ProcessId", "");
                MojFind("#" + self.getFieldPrefix() + "ProcessId").change();

            }
            else
            //{
                MojFind("[id^='" + self.getFieldPrefix() + "'].callVisitBaseEnable").enable(true);
            //    MojFind("#" + self.getFieldPrefix() + "ProcessId")[0].removeAttribute("disabled");
            //}
        });
    });

}
