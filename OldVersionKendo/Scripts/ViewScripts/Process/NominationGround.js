
function NominationGround(fieldPrefix) {
    var self = this;
    self.getFieldPrefix = function () {
        return Moj.isEmpty(fieldPrefix) ? "" : fieldPrefix + "_";
    };
    
     if (MojFind("#ProcessDetailsModel_ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceBeforeInquiry || MojFind("#ProcessDetailsModel_ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceAfterInquiry) {
         MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "NominationGroundStatusId", NominationGroundStatus.Checking)
        MojFind("#" +self.getFieldPrefix() + "NominationGroundStatusId").enable(false);
        MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "NominationGroundStatusReasonId", NominationGroundStatusReason.Inquiry)
        MojFind("#" +self.getFieldPrefix() + "NominationGroundStatusReasonId").enable(false);
        }

    self.enableNominationGroundStatusReason = function (isEnable) {
        MojFind("#" + self.getFieldPrefix() + "NominationGroundStatusReasonId").enable(isEnable);
        if (Moj.isFalse(isEnable))
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "NominationGroundStatusReasonId");
    };

    self.enableNominationGroundsId = function (isEnable) {
        MojFind("#" + self.getFieldPrefix() + "NominationGroundId").enable(isEnable);
        //MojFind("#" + self.getFieldPrefix() + "DisplayAllNominationGrounds").enable(isEnable);
        if (Moj.isFalse(isEnable))
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "NominationGroundId");
    };


    $(document).ready(function () {
       
        MojFind("#" + self.getFieldPrefix() + "NominationGroundStatusId").change(function (e) {
            if (isNaN(parseInt(this.value)) || this.value == 0) {
                self.enableNominationGroundsId(false);
                self.enableNominationGroundStatusReason(false);
            }
            else {
                var nominationGroundStatusId = this.value;
                var isInvestigationProcess = (MojFind("#ProcessDetailsModel_ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceBeforeInquiry || MojFind("#ProcessDetailsModel_ProcessTypeId").val() == ProcessTypeEnum.PoliceInvestigationAdviceAfterInquiry);
                MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "NominationGroundStatusReasonId"), true);
                if (nominationGroundStatusId == NominationGroundStatus.Eligible) {
                    self.enableNominationGroundsId(true);
                    self.enableNominationGroundStatusReason(false);
                    }
                    else {
                    $.ajax({
                        url: baseUrl + '/Process/FillNominationGroundStatusReason',
                            type: 'POST',
                        async: false,
                        contentType: 'application/json; charset=utf-8',
                            dataType : 'json',
                            data: '{ "nominationGroundStatusId": "' + nominationGroundStatusId + '", "isInvestigationProcess": "' + isInvestigationProcess + '" }',

                                    success: function (retData) {
                                        
                                        if (JSON.stringify(retData) != "[]") {
                                            MojControls.AutoComplete.setDataSourceAndValue(self.getFieldPrefix() + "NominationGroundStatusReasonId", retData, -1);
                                    self.enableNominationGroundsId(false);
                                    self.enableNominationGroundStatusReason(true);
                                    }
                            else {
                                self.enableNominationGroundStatusReason(false);
                                }
                            if (jQuery.isFunction(NominationGroundContinuedTreatment))
                                NominationGroundContinuedTreatment(false);
                        }

                    });
                }
            }
        });

    });
};