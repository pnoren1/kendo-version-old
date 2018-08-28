function PercentageAdditionBaseElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

        self.setTotalSum = function () {

            var activityClassificationId = MojFind("#GeneralDetails_LineActivityClassificationId").val();
            var baseTotalSum = MojFind(".parentTotalSum input[id^=" + self.getFieldPrefix() + "]").val();
            var additionPercent = MojFind("#" + self.getFieldPrefix() + "AdditionPercent").val();

            if (additionPercent != "0" && additionPercent != "") {
                Moj.safePost("/FeeRequest/GetTotalSumToPercentageAddition", {
                    activityClassificationId: activityClassificationId,
                    baseTotalSum: baseTotalSum,
                    additionPercent: additionPercent
                }, function (data) {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.TotalSum);
                    if (activityClassificationId == FeeActivityTypeClassification.FullyOffsetPercentageAddition)
                        MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').css("color", "#C00509");
                });

            };
        },

        $(document).ready(function () {

            if (MojFind("#" + self.getFieldPrefix() + "TotalSum").val() < 0) {
                MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').css("color", "#C00509");
                MojFind("#" + self.getFieldPrefix() + "TotalSum").closest('div').attr("style", "direction:ltr ; width:130px");
            }

            MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").change(function () {
                var additionTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "FeeActivityTypeId");
                if (additionTypeId != "" && !isNaN(parseInt(additionTypeId))) {
                    Moj.safePost("/FeeRequest/GetMaximumPercent", {
                        feeActivityTypeId: additionTypeId,
                    }, function (data) {
                        MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(data.feeRateTypeId);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "RegulationClause", data.regulationClause);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "MaximumPercent", data.maximumPercent);
                        MojControls.TextBox.setValueById(self.getFieldPrefix() + "AdditionPercent", data.maximumPercent);

                        if (data.isMaxValue)
                            MojFind("#" + self.getFieldPrefix() + "AdditionPercent").enable(true);
                        else
                            MojFind("#" + self.getFieldPrefix() + "AdditionPercent").enable(false);

                    });
                }
                else {
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                    MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(null);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "MaximumPercent", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "RegulationClause", "");
                    MojControls.TextBox.setValueById(self.getFieldPrefix() + "AdditionPercent", "");
                    MojFind("#" + self.getFieldPrefix() + "AdditionPercent").enable(false)
                }

            });

            MojFind("#" + self.getFieldPrefix() + "AdditionPercent").change(function () {
                if (!MojFind("#" + self.getFieldPrefix() + "AdditionPercent").valid() || MojControls.TextBox.getValueById(self.getFieldPrefix() + "AdditionPercent") == "0" || MojControls.TextBox.getValueById(self.getFieldPrefix() + "AdditionPercent") == "")
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                else
                    self.setTotalSum();
            });

            MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
                var isCheck = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart")

                if (isCheck == "false") {
                    MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").enable(false);
                    MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "FeeActivityTypeId")
                    MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").change();

                }
                else
                    MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").enable(true);
            });
        });
};