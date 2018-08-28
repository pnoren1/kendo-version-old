function MeetingDataElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

        self.setTotalSum = function () {
            var courtLevelId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "CourtLevelId");
            var feeActivityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityTypeId");
            var feeActivityInidcationId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityIndicationId");
            var feeRequestLineId = MojFind("#FeeRequestLineId").val();
            var activityClassificationId = MojFind("#GeneralDetails_LineActivityClassificationId").val();
            var feeRequestLineDetailTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRequestLineDetailTypeId").val();

            Moj.safePost("/FeeRequest/GetTotalSumToMeeting", {
                feeRequestLineId: feeRequestLineId,
                feeRequestLineDetailTypeId: feeRequestLineDetailTypeId,
                activityClassificationId: activityClassificationId,
                courtLevelId: courtLevelId,
                feeActivityTypeId: feeActivityTypeId,
                feeActivityInidcationId: feeActivityInidcationId,

            }, function (data) {
                MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(data.FeeRateTypeId);
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.TotalSum);

                if (activityClassificationId == FeeActivityTypeClassification.FullyOffsetBase)
                    MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').css("color", "#C00509");
            });
        },

        self.setAdditionalActivityDataVisibility = function () {
            var activityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityTypeId");
            if (activityTypeId == null || activityTypeId == "") {
                MojFind("#" + self.getFieldPrefix() + "ActivitySubtypeId").visible(false)
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivitySubtypeId")
                MojFind("#" + self.getFieldPrefix() + "JoinedPdoFile").visible(false)
                MojControls.CheckBox.setValueById(self.getFieldPrefix() + "JoinedPdoFile", false);
                MojFind("#" + self.getFieldPrefix() + "JoindedPdoFileNote").visible(false)
                MojControls.TextBox.setValueById(self.getFieldPrefix() + "JoindedPdoFileNote", "", false);
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(null);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivityIndicationId");
                MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId").enable(false);
                MojControls.Hidden.setValueById(self.getFieldPrefix() + "RequiredActivityIndication", false)

            }
            else if (activityTypeId != FeeActivityType.PreparingCombinationFile) {
                MojFind("#" + self.getFieldPrefix() + "ActivitySubtypeId").visible(true)
                MojFind("#" + self.getFieldPrefix() + "JoinedPdoFile").visible(false)

                MojControls.CheckBox.setValueById(self.getFieldPrefix() + "JoinedPdoFile", false);
                MojFind("#" + self.getFieldPrefix() + "JoindedPdoFileNote").visible(false)
                MojControls.TextBox.setValueById(self.getFieldPrefix() + "JoindedPdoFileNote", "", false);

            }
            else {
                MojFind("#" + self.getFieldPrefix() + "ActivitySubtypeId").visible(false)
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivitySubtypeId")
                MojFind("#" + self.getFieldPrefix() + "JoinedPdoFile").visible(true)

                MojFind("#" + self.getFieldPrefix() + "JoindedPdoFileNote").visible(true)
                if (Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ToUpdate").val()) && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").val())) {
                    MojFind("#" + self.getFieldPrefix() + "JoinedPdoFile").enable(true)
                    MojFind("#" + self.getFieldPrefix() + "JoindedPdoFileNote").enable(true)
                }
                // תיקון  לבאג : בלחיצה על עריכה של שורה עם סוג פעילות "הכנת צירוף תיק" שיש לה קבוצת תעריף זה לא הוצג בפנל
                //MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivityIndicationId");
                //MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId").enable(false);
                //MojControls.Hidden.setValueById(self.getFieldPrefix() + "RequiredActivityIndication", false)
            }
        },

        self.onMeetingDataElementReady = function () {

            self.setAdditionalActivityDataVisibility();
        },

        self.getFeeActivitySubTypes = function () {

            var activityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityTypeId");
            if (activityTypeId != null && activityTypeId != "" && activityTypeId != FeeActivityType.PreparingCombinationFile) {
                Moj.safePost("/FeeRequest/GetFeeActivitySubtypes", { feeActivityTypeId: activityTypeId }, function (data) {
                    if (data.FeeActivitySubtypes.length == 0) {
                        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivitySubtypeId")
                        MojFind("#" + self.getFieldPrefix() + "ActivitySubtypeId").enable(false);
                    }
                    else {
                        MojControls.AutoComplete.setDataSource(self.getFieldPrefix() + "ActivitySubtypeId", data.FeeActivitySubtypes);
                        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivitySubtypeId")
                        MojFind("#" + self.getFieldPrefix() + "ActivitySubtypeId").enable(true);
                    }
                });
            }

        }



    $(document).ready(function () {

        if (MojFind("#" + self.getFieldPrefix() + "TotalSum").val() < 0) {
            MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').css("color", "#C00509")
            MojFind("#" + self.getFieldPrefix() + "TotalSum").closest('div').attr("style", "direction:ltr ; width:130px");
        }

        MojFind("#" + self.getFieldPrefix() + "ChangeCourtLevel").change(function () {

            var isChecked = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "ChangeCourtLevel");
            if (isChecked) {
                MojFind("#" + self.getFieldPrefix() + "CourtLevelId").enable(true);
            }
            else {
                MojFind("#" + self.getFieldPrefix() + "CourtLevelId").enable(false);
            }
        });

        MojFind("#" + self.getFieldPrefix() + "CourtLevelId").change(function () {

            var courtLevelId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "CourtLevelId");
            var feeActivityCategoryId = MojFind("#FeeActivityCategoryId").val();
            Moj.safePost("/FeeRequest/GetFeeActivityTypes", { feeActivityCategoryId: feeActivityCategoryId, courtLevelId: courtLevelId }, function (data) {
                MojControls.AutoComplete.setDataSource(self.getFieldPrefix() + "ActivityTypeId", data.FeeActivityTypes);
                MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivityTypeId")
                MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId"))
                self.setAdditionalActivityDataVisibility();
            });
        });

        MojFind("#" + self.getFieldPrefix() + "ActivityTypeId").change(function () {

            var activityTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityTypeId");
            var courtLevelId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "CourtLevelId");
            if (activityTypeId != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(self.getFieldPrefix() + "ActivityTypeId") != -1) {
                self.setAdditionalActivityDataVisibility();
                self.getFeeActivitySubTypes();
                Moj.safePost("/FeeRequest/GetFeeActivityIndections", { feeActivityTypeId: activityTypeId, courtLevelId: courtLevelId }, function (data) {

                    MojControls.AutoComplete.setDataSource(self.getFieldPrefix() + "ActivityIndicationId", data.FeeActivityIndications);
                    if (data.FeeActivityIndications.length > 0) {
                        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivityIndicationId");
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "RequiredActivityIndication", true)
                        MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId").enable(true);
                    }
                    else {
                        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "ActivityIndicationId");
                        MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId").enable(false);
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "RequiredActivityIndication", false)
                        self.setTotalSum();
                    }
                });
            }
        });

        MojFind("#" + self.getFieldPrefix() + "ActivityIndicationId").change(function () {
            if (MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "ActivityIndicationId") != "")
                self.setTotalSum();
            else {
                MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(null);
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
            }
        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
            var isRequired = MojControls.Hidden.getValueById("SubmissionDetails_Elements_MeetingDataElement_IsRequiredPart")

            if (!Moj.isTrue(isRequired)) {
                MojFind("[id^='SubmissionDetails_Elements_MeetingDataElement'].meetingDataEnable").enable(false);
                MojControls.DateTimePicker.setValueById("SubmissionDetails_Elements_MeetingDataElement_ActivityDate", null);
                MojControls.CheckBox.setValueById("SubmissionDetails_Elements_MeetingDataElement_ChangeCourtLevel", false);
                MojFind("#SubmissionDetails_Elements_MeetingDataElement_ChangeCourtLevel").change();
                MojControls.AutoComplete.setValueById("SubmissionDetails_Elements_MeetingDataElement_CourtLevelId", MojControls.Hidden.getValueById("SubmissionDetails_Elements_MeetingDataElement_PrevCourtLevelId"));
                MojFind("#SubmissionDetails_Elements_MeetingDataElement_CourtLevelId").change();
            }
            else
                MojFind("[id^='SubmissionDetails_Elements_MeetingDataElement'].meetingDataEnable").enable(true);


        });

    });

}
