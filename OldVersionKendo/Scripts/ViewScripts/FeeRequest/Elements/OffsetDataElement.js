
function OffsetDataElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    self.setTotalSum = function () {
            var deductionTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "DeductionTypeId");
            var feeRequestLineId = MojFind("#FeeRequestLineId").val();
            var feeRequestLineDetailTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRequestLineDetailTypeId").val();
            if (deductionTypeId != "") {
                Moj.safePost("/FeeRequest/GetTotalSumToOffset",
                    {
                        feeRequestLineId: feeRequestLineId,
                        feeRequestLineDetailTypeId: feeRequestLineDetailTypeId,
                        feeActivityTypeId: deductionTypeId,
                    },
                    function(data) {
                        MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(data.FeeRateTypeId);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.TotalSum);
                    });
            } else {
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(null);
            }
               
        },

    $(document).ready(function () {

        MojFind("#" + self.getFieldPrefix() + "TotalSum").closest('div').attr("style", "direction:ltr ; width:130px");

        MojFind("#" + self.getFieldPrefix() + "TotalSum").prev('div').attr("style", "color:#C00509 ");

        MojFind("#" + self.getFieldPrefix() + "DeductionTypeId").change(function () {
            self.setTotalSum();
            //update TotalSum with feeRateTypeID
        });

        //MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
        //    var isCheck = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart")

        //    if (isCheck == "false") {
        //        MojFind("#" + self.getFieldPrefix() + "DeductionTypeId").enable(false);
        //        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "DeductionTypeId")
        //        MojFind("#" + self.getFieldPrefix() + "IsReplacementAdvocate").change()
        //    }
        //    else
        //        MojFind("#" + self.getFieldPrefix() + "DeductionTypeId").enable(true);
        //});

    });
};

