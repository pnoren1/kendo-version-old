$(document).ready(function () {
    
    MojFind("#AdvocateProfileId").focusout();
    MojFind("#btnSaveInGridAdvocateNominationCallDetails").removeAttr('onclick');

    MojFind("#btnSaveInGridAdvocateNominationCallDetails").die('click');
    MojFind("#btnSaveInGridAdvocateNominationCallDetails").live('click',function () {
        CheckIfAgreedToNominationCallResultIdAlreadyExistInGrid();

        

    });
});



MojFind("#AdvocateProfileId").die('change');
MojFind("#AdvocateProfileId").live('change', function () {
    CheckIfAdvocateContactIdAlreadyExistInGrid();
});


MojFind("#CallResultId").die('change');
MojFind("#CallResultId").live('change', function () {
    
    if (MojFind("#CallResultId").val() == CallResults.CandidateAgreed)
    {
        var isInternal = MojFind("#IsInternal").val();
        var advocateContactId = MojFind('[name="AdvocateId"]').val();
        //var advocateContactId = MojControls.AutoComplete.getValueById("AdvocateProfileId");
        if (isInternal != "true") {
            //get EmploymentTypeId for current advocate
            $.get(baseUrl + '/Process/GetAdvocateEmploymentInDistrictId?advocateContactId=' + advocateContactId, function (data) {
                if (data != null) {
                    if (data.length == 1) {
                        MojFind("#EmploymentTypeId").enable(true);
                        MojControls.AutoComplete.setDataSourceAndValue("EmploymentTypeId", data, data[0].Key, true);
                    }
                    else {
                        MojFind("#EmploymentTypeId").enable(true);
                        MojControls.AutoComplete.setDataSource("EmploymentTypeId", data);
                    }
                };
            });
        }
    }
    else {
        //MojFind("#EmploymentTypeId").enable(false);
        MojFind("#EmploymentTypeId").enable(false);
        MojFind("[name = EmploymentTypeId_input]").removeAttr("disabled");
        MojFind("[name = EmploymentTypeId_input]").attr("readonly", "true");
        MojFind("#EmploymentTypeId").removeAttr("disabled");
        MojFind("#EmploymentTypeId").attr("readonly", "true");

        //MojControls.AutoComplete.setDataSourceAndValue("EmploymentTypeId", null, null, true);
        //MojControls.AutoComplete.setDataSource("EmploymentTypeId", null);
        MojControls.AutoComplete.setValueById("EmploymentTypeId", null);

        
    }
});


//MojFind("#EmploymentTypeId").change(function () {
//    
//    var employmentTypeId = MojFind("#EmploymentTypeId").val();
//    var advocateContactId = MojFind("#AdvocateId").val();
//    $.get(baseUrl + '/Process/GetUnpaidFeeRequestListForAdvocateEmploymentType?advocateContactId=' + advocateContactId + '&employmentTypeId=' + employmentTypeId, function (data) {
//        
//        if (data.FeeRequestList.length > 0) { // אם יש בקשות שכ"ט תורנות והקפצות שטרם שולמו
//            Moj.showErrorMessage(Resources.Messages.ErrExistFeeRequestWhenEmploymentTypeIsChanged);
//            MojControls.AutoComplete.setValueById("EmploymentTypeId", null);
//        };
//    });


//});

CheckIfAdvocateContactIdAlreadyExistInGrid = function () {
    
    var newAdvocateProfileId = MojFind('#AdvocateProfileId').val();
    var array = [];
    var i = 0;
    MojFind('#div_grdAdvocateNominationCallsList tbody tr').each(function () {
        if ($(this)[0].id != "tr_grdAdvocateNominationCallsList_Details" && $(this).find('td:eq(2) input').val() && !$(this)[0].className.includes("hide")) {
            array[i] = $(this).find('td:eq(5) input').val();
            i++;
        }              
    })
    if ($.inArray(newAdvocateProfileId, array) != -1) { //If AdvocateProfileId exists in the grid
        resetCallsGridFields();

        Moj.showErrorMessage(Resources.Messages.AlreadySelectedAdvocateContact);
        return false;
    }
    else {
        if (newAdvocateProfileId == "")
        {
            resetCallsGridFields();
            return false;
        }
        else {
            var selectedID = MojControls.AutoComplete.getValueById("AdvocateProfileId");
            $.ajax({
                url: baseUrl + '/Process/GetDetailsByAdvocateID',
                type: 'POST',
                async: false,
                dataType: 'json',
                data: "SelectedID=" + selectedID,

                success: function (response) {
                    
                    MojFind('#Phone').val(response["Telephone"]);
                    //MojControls.Label.setValueById("AdvocateId", response["AdvocateContactId"])
                    MojFind('#div_AdvocateId').text(response["AdvocateContactId"]);
                    MojFind("#AdvocateId").val(response["AdvocateContactId"]);
                    MojFind("#IsInternal").val(response["IsInternal"]);
                    MojFind("#CallResultId").enable(true);
                    MojControls.AutoComplete.setValue(MojFind("#CallResultId"), null);

                    MojFind("#EmploymentTypeId").enable(false);
                    MojFind("[name = EmploymentTypeId_input]").removeAttr("disabled"); 
                    MojFind("[name = EmploymentTypeId_input]").attr("readonly","true"); 
                    MojFind("#EmploymentTypeId").removeAttr("disabled");
                    MojFind("#EmploymentTypeId").attr("readonly","true");


                    //MojControls.AutoComplete.setDataSourceAndValue("EmploymentTypeId", null, null);
                    MojControls.AutoComplete.setValueById("EmploymentTypeId", null);
                    //MojControls.AutoComplete.setDataSourceAndValue("EmploymentTypeId", response["EmploymentTypes"], response["EmploymentTypeId"]);
                }
            });
            return true;
        }
    }

},

errorInSaveCallRow = function() 
{
    MojControls.AutoComplete.setValueById("CallResultId", "");
    MojControls.AutoComplete.setValueById("EmploymentTypeId", "");
    MojFind("#EmploymentTypeId").enable(false);
},

resetCallsGridFields = function () 
{
    MojControls.AutoComplete.clearSelectionById("AdvocateProfileId");
    MojFind('#Phone').val("");
    MojFind('#div_AdvocateId').text("");
    MojFind("#AdvocateId").val("");
    MojFind("#CallResultId").enable(false);
    MojControls.AutoComplete.setValue(MojFind("#CallResultId"), null);
    //MojFind("#EmploymentTypeId").enable(false);
    MojFind("#EmploymentTypeId").enable(false);
    MojFind("[name = EmploymentTypeId_input]").removeAttr("disabled");
    MojFind("[name = EmploymentTypeId_input]").attr("readonly", "true");
    MojFind("#EmploymentTypeId").removeAttr("disabled");
    MojFind("#EmploymentTypeId").attr("readonly", "true");

    MojControls.AutoComplete.setValueById("EmploymentTypeId", null);
    //MojControls.AutoComplete.setDataSourceAndValue("EmploymentTypeId", null, null);
}, 

CheckIfAgreedToNominationCallResultIdAlreadyExistInGrid = function () {
    
    var newCallResult = MojFind("#CallResultId").val();

    var array = [];
    var i = 0;
    MojFind('#div_grdAdvocateNominationCallsList tbody tr').each(function () {
        if ($(this)[0].id != "tr_grdAdvocateNominationCallsList_Details" && !$(this)[0].className.includes("hide") && $(this).find('td:eq(2) input').val()) {
            array[i] = $(this).find('td:eq(8) input').val();
            i++;
        }
    })

    if (newCallResult == CallResults.CandidateAgreed)
    {
        
        if ($.inArray(newCallResult, array) != -1) //If newCallResult exists in the grid
        {
            Moj.showErrorMessage(Resources.Messages.AlreadyExistAdvocateAgreedToNominationCallResult, function () {
                errorInSaveCallRow();
                return false;
            });
        }
        else
        {
            if (MojFind("#EmploymentTypeId").val() != "" || Moj.isTrue(MojFind("#IsInternal").val())) //אם סומן הסכים למינוי חייבת להבחר צורת העסקה או אם פנימי אין צורת העסקה
                {
                    if (MojFind('#IsNoNominationConsultation:checked').length > 0) //אם סומן לא הוקפץ סנגור
                    {
                        Moj.showErrorMessage(Resources.Messages.ErrAgreedCallWithIsNoNominationConsultation, function () {
                            errorInSaveCallRow();
                            return false;
                        });
                    }
                    else {
                        if (MojFind('[name="AdvocateProfileId_input"]').val() != "") {
                            updateNominationConsultationDetails(MojControls.CheckBox.getValueById("IsOnCall"));
                            Moj.HtmlHelpers._saveRowToGrid('grdAdvocateNominationCallsList', 'tr_grdAdvocateNominationCallsList_Details', '', '', 'grdAdvocateNominationCallsAfterSave', true, '', '', '', false);
                    }
                }
            }
        }
    }
    else
    {
        Moj.HtmlHelpers._saveRowToGrid('grdAdvocateNominationCallsList', 'tr_grdAdvocateNominationCallsList_Details', '', '', 'grdAdvocateNominationCallsAfterSave', true, '', '', '', false);
    }
};


updateNominationConsultationDetails = function (isOnCall) {
    
    var NewAdvocateContactName = MojFind('[name="AdvocateProfileId_input"]').val();
    var advocateContactId = MojFind('[name="AdvocateId"]').val();
    var IsInternal = MojFind("#IsInternal").val();


    
    //update NominationConsultationTime to current date and time
    //var currentDateTime = new Date();
    //var currentDate = currentDateTime.toLocaleDateString().replace(/(\d{1})\/(\d{2})\/(\d{3})/, "$2/$1/$3");
    //var currentTime = currentDateTime.toTimeString();

    MojControls.DateTimePicker.setValueById("NominationConsultationTime", Moj.HtmlHelpers._parseDate(new Date(), "HH:mm dd/MM/yyyy"))

    //צורת ייעוץ -Default
    MojControls.AutoComplete.setValueById("ConsultationTypeId", ConsultationTypes.PoliceConsultation)

    MojFind("#NominationConsultationAdvocateContactId").val(advocateContactId);
    Moj.changeObjectsState(MojFind("#NominationConsultationAdvocateContactId"));
    EnableArrestsFields(true);

    if (isOnCall) {
        MojFind("#OnCallChangeReasonId").enable(false);
        MojControls.AutoComplete.clearSelection(MojFind("#OnCallChangeReasonId"));
    }
    else {
        MojFind("#OnCallChangeReasonId").enable(true);
    }

    if (MojFind('#IsSendFaxToPoliceStation:checked').length > 0)
        MojFind('#PoliceStationFaxTypeId').enable(true);
};


