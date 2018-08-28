$(document).ready(function () {

    EnableArrestsFields = function (IsEnabled) {
        MojFind("#NominationConsultationTime").enable(IsEnabled);
        MojFind('#ConsultationTypeId').enable(IsEnabled);
        MojFind("#IsSendMessageToAdvocate").enable(IsEnabled);
        MojFind("#ArrivalAtPoliceStationTime").enable(IsEnabled);
        MojFind("#IsPoliceWaitForAdvocate").enable(IsEnabled);
        MojFind("#IsMetApplicant").enable(IsEnabled);
        MojFind("#OnCallChangeReasonId").enable(IsEnabled);

    };

    MojFind("#btnOpenShiftsTab").click(function () {
        var shiftPoliceStationId = MojFind("#PoliceStationId").val();
        var processDate = "";

        if (MojControls.DateTimePicker.getValueById("ProcessDate") != "")
            processDate = MojControls.DateTimePicker.getValueById("ProcessDate").split(" ")[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

        PDO.addContentTab(ContentTypeEnum.ShiftModule, 'Shifts', 'shiftPoliceStationId=' + shiftPoliceStationId + '&processDate=' + processDate, 'תורנויות', 'ShiftModulTab', undefined, undefined, true);
    });

    IsEnableEditControl = function () {
        
        var GridRows = MojFind("[id^='grdAdvocateNominationCallsList'] tbody tr");

        if (typeof GridRows != 'undefined') {
            GridRows.each(function () {

                var callResultVal = $(this).find('td:eq(8) input').val();
                if (callResultVal == CallResults.CandidateAgreed) {
                    MojFind(this).find('td:eq(11) a').attr("disabled", "disabled");
                    MojFind(this).addClass('moj-bold');
                };
            });
        }
    };

    //boldCandidateAgreedRow = function () {
    //    
    //    var grid = MojFind("[id^='grdAdvocateNominationCallsList']").data("kendoGrid");
    //    grid.tbody.find('>tr').each(function () {
    //        var dataItem = grid.dataItem(this);
    //        if (dataItem != undefined && (dataItem.CallResultId == CallResults.CandidateAgreed))
    //            MojFind(this).addClass('moj-bold');
    //        else
    //            MojFind(this).removeClass('moj-bold');

    //    });
    //},
    
    //boldCandidateAgreedRow();

    CheckCallsGridRecordAdd = function () {
        
        var isExist = false;
        MojFind('#div_grdAdvocateNominationCallsList tbody tr').each(function () {
            if ($(this)[0].id != "tr_grdAdvocateNominationCallsList_Details" && $(this).find('td:eq(2) input').val() == GridRowState.Deleted && $(this).find('td:eq(8) input').val() == CallResults.CandidateAgreed && !isExist)
                isExist = true;
        })

        if (isExist)
            Moj.showErrorMessage(Resources.Messages.ErrNotAdditionChangesCallsGrid);
        else
            Moj.HtmlHelpers._showGridAddDetails('grdAdvocateNominationCallsList', '/Process/AdvocateNominationCallDetails', 'True', 'True', '', 'False');
    };

    MojFind('#IsNoNominationConsultation').change(function () {
        
        var isExistCall = false;
        if (MojFind('#IsNoNominationConsultation:checked').length > 0) { //if checkbox is selected
            
            var gridRows = MojFind("[id^='grdAdvocateNominationCallsList'] tbody tr");

            if (typeof gridRows != 'undefined') {
                gridRows.each(function () {

                    var callResultVal = $(this).find('td:eq(8) input').val();
                    if (callResultVal == CallResults.CandidateAgreed) {
                            Moj.showErrorMessage(Resources.Messages.ErrIsNoNominationConsultationWithAgreedCall);
                            MojControls.CheckBox.setValueById("IsNoNominationConsultation", false);
                            isExistCall = true;
                            return false;
                    }
                });
                
            }
            if (isExistCall) return false;
            else
            {
                ResetArrestsFields();
                EnableArrestsFields(false);
                MojFind("#NoNominationConsultationReasonId").enable(true);
            }
}

        else {
            MojFind("#NoNominationConsultationReasonId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#NoNominationConsultationReasonId"));
        }
    });

    
});

ClearNominationConsultationFieldsAfterDelete = function (obj) {
    
    IsEnableEditControl();
    if (obj.CallResultId == CallResults.CandidateAgreed)
    {
        
        ResetArrestsFields();
        EnableArrestsFields(false);
    }
    
};

grdAdvocateNominationCallsAfterSave = function () {
    IsEnableEditControl();
};


MojFind('#IsSendFaxToPoliceStation').change(function () {
    if (MojFind('#IsSendFaxToPoliceStation:checked').length > 0) //If checkbox is selected
        MojFind('#PoliceStationFaxTypeId').enable(true);
    else
        MojFind('#PoliceStationFaxTypeId').enable(false);
});

MojFind("#IsMetApplicant").change(function () {
    
    if (MojFind("#IsMetApplicant").val() == YesNoEnum.Yes)
    {
        MojFind(".MeetingResult").enable(true);
        if (MojFind("#PlaceTypeId").val() != "")
        {
            if (MojFind("#PlaceTypeId").val() == PlaceTypeEnum.Other)
                MojFind("#ApplicantMeetingPlace").enable(true);
            else
                MojFind("#ApplicantMeetingPlaceContactId").enable(true);

        }
        if (MojFind("#IsFinancialEntitlement18a7Checked").val() == YesNoEnum.Yes)
            MojFind("#IsFinancialEntitlement18a7").enable(true);

        MojControls.AutoComplete.setValueById("NoMeetingReasonId", "");
        MojFind('#NoMeetingReasonId').enable(false);
        
    }
    else if (MojFind('#IsMetApplicant').val() == YesNoEnum.No)
    {
        MojFind('#NoMeetingReasonId').enable(true);
        
        MojFind(".MeetingResult").enable(false);
        MojFind("#ApplicantMeetingPlaceContactId").enable(false);
        MojFind("#ApplicantMeetingPlace").enable(false);
        MojFind("#IsFinancialEntitlement18a7").enable(false);

    }

    else if (MojFind('#IsMetApplicant').val() == "")
    {
        MojControls.AutoComplete.setValueById("NoMeetingReasonId", "");
        MojFind('#NoMeetingReasonId').enable(false);

        MojFind(".MeetingResult").enable(false);
        MojFind("#ApplicantMeetingPlaceContactId").enable(false);
        MojFind("#ApplicantMeetingPlace").enable(false);
        MojFind("#IsFinancialEntitlement18a7").enable(false);
    }

});




MojFind('#InternalLawyerID').change(function () {
    if (MojFind('#InternalLawyerID').val() != "") //If option is selected in the dropdown list
        MojFind('#InternalLawyerAssitReason').enable(true);
    else
        MojFind('#InternalLawyerAssitReason').enable(false);
});


ResetArrestsFields = function () {
    
    MojFind("#NominationConsultationAdvocateContactId").val("");

    MojFind("#NominationConsultationTime").val(null);
    MojControls.AutoComplete.clearSelection(MojFind("#ConsultationTypeId"));

    MojControls.AutoComplete.clearSelection(MojFind("#OnCallChangeReasonId"));
    MojControls.AutoComplete.clearSelection(MojFind("#PoliceStationFaxTypeId"));

    MojFind('#IsSendMessageToAdvocate:checkbox').removeAttr('checked');

    MojFind("#ArrivalAtPoliceStationTime").val(null);
    MojControls.AutoComplete.clearSelection(MojFind("#IsPoliceWaitForAdvocate"));

    MojControls.AutoComplete.clearSelection(MojFind("#IsMetApplicant"));
    MojControls.AutoComplete.clearSelection(MojFind("#NoMeetingReasonId"));
    
    MojFind("#IsMetApplicant").change();
    MojFind(".MeetingResult").val(null);
    MojControls.AutoComplete.clearSelection(MojFind("#ApplicantMeetingPlaceContactId"));

    MojControls.TextBox.setValueById("ApplicantMeetingPlace", null);
    MojFind("#div_ApplicantMeetingPlace").hide();
    MojFind("#div_ApplicantMeetingPlaceContactId").show();

    MojControls.AutoComplete.clearSelection(MojFind("#IsFinancialEntitlement18a7"));
    
}


MojFind('#IsBroughtToCourt').change(function () {
    if (MojFind('#IsBroughtToCourt').val() == YesNoEnum.Yes)
        EnableIsBroughtToCourtFields(true);
    else
    {
        MojControls.AutoComplete.setValueById("AdvocateSentToCourtContactId", "");
        MojFind("#BroughtToCourtDate").val(null);
        MojControls.CheckBox.setValueById("IsnotRepresentedInCourt", false);
        EnableIsBroughtToCourtFields(false);
        }
});

EnableIsBroughtToCourtFields = function (IsEnable) {
    MojFind("#BroughtToCourtDate").enable(IsEnable);
    MojFind("#AdvocateSentToCourtContactId").enable(IsEnable);
    MojFind("#IsnotRepresentedInCourt").enable(IsEnable);
}


MojFind('#PlaceTypeId').change(function () {
    
    var selectedPlaceTypeID = MojControls.AutoComplete.getValueById("PlaceTypeId");
    if (selectedPlaceTypeID != "") {
        if (selectedPlaceTypeID == PlaceTypeEnum.Other)
        {
            MojControls.AutoComplete.setValueById("ApplicantMeetingPlaceContactId", "");
            MojFind("#div_ApplicantMeetingPlaceContactId").hide();
            MojFind("#ApplicantMeetingPlace").enable(true);
            MojFind("#div_ApplicantMeetingPlace").show();
            MojControls.AutoComplete.setValueById("ApplicantMeetingPlaceContactId", "");
        }
        else
        {
            MojControls.TextBox.setValueById("ApplicantMeetingPlace", null);
            MojFind("#div_ApplicantMeetingPlace").hide();
            MojFind("#div_ApplicantMeetingPlaceContactId").show();

            $.ajax({
                url: baseUrl + '/Process/GetPlacesByPlaceTypeID',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: '{ "SelectedPlaceTypeID": "' + selectedPlaceTypeID + '" }',

                success: function (response) {
                    if (JSON.stringify(response) != "[]") {
                        EnableApplicantMeetingPlaceContactIdField(true);
                        MojControls.AutoComplete.setDataSourceAndValue("ApplicantMeetingPlaceContactId", response, -1);
                    }
                    else {
                        EnableApplicantMeetingPlaceContactIdField(false);
                    }
                }
            })
        }

    }
    else {
        MojControls.AutoComplete.setValueById("ApplicantMeetingPlaceContactId", "");
        MojControls.TextBox.setValueById("ApplicantMeetingPlace", null);
        MojFind("#div_ApplicantMeetingPlace").hide();
        MojFind("#div_ApplicantMeetingPlaceContactId").show();
        EnableApplicantMeetingPlaceContactIdField(false);
    }
});

EnableApplicantMeetingPlaceContactIdField = function (isEnable) {
    MojFind("#ApplicantMeetingPlaceContactId").enable(isEnable);
};

