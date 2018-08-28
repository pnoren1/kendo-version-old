$(document).ready(function () {
    MojFind("#CandidateFormStatusId").die('change');
    MojFind("#CandidateFormStatusId").live('change', function (e) {//todo before select
        if (isNaN(parseInt(this.value)) || this.value == 0) {
            MojFind("#CandidateFormStatusReasonId").enable(false);
            return;
        }
        MojControls.ComboBox.clearComboBox(MojFind("#CandidateFormStatusReasonId"), true);
        
        $.ajax({
            url: baseUrl + '/PersonAdvocate/GetCandidateFormStatusReason',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "StatusId": "' + this.value + '" }',

            success: function (retData) {

                if (JSON.stringify(retData) != "[]") {
                    MojControls.AutoComplete.setDataSource("CandidateFormStatusReasonId", retData);
                    MojControls.AutoComplete.clearSelectionById("CandidateFormStatusReasonId");
                    MojFind("#CandidateFormStatusReasonId").enable(true);
                }
                else {
                    MojFind("#CandidateFormStatusReasonId").enable(false);
                }
            },
            error: function (xhr, tStatus, err) {
                //alert(err);
            }
        });

    });

    MojFind("#btnCancelCandidateFormDetails").click(function () {
        var candidateFormId = MojFind("#CandidateFormId").val();
        var advocateId = MojFind("#AdvocateId").val();
        MojFind(".moj-content").load(baseUrl + '/PersonAdvocate/CandidateFormDetails?candidateFormId=' + candidateFormId + '&advocateId=' + advocateId);
    });

    onSuccessSaveCandidateForm = function (result) {
        
        if (result.Error != undefined && result.Error.length > 0) {
            Moj.showErrorMessage(result.Error, function () {
                return false;
            });
        }
        else
        {
            if (result.candidateFormId != undefined)
            {
                //if (result.Error != undefined && result.Error.length == 0) {
                MojFind("#ObjectState").val(false);
                //MojFind('.div-buttons').attr('hidden', 'hidden')
                ////MojFind("#div_btnCancelCandidateFormDetails").visible(false);
                ////MojFind("#div_btnActionCandidateFormDetails").visible(false);
                //MojFind("#CandidateFormStatusId").enable(false);
                //MojFind("#CandidateFormStatusReasonId").enable(false);
                //MojFind("#StatusComments").enable(false);
                //DocumentsToEntityArea.addFilesToDocumentum(result.candidateFormId, function () {
                MojFind(".moj-content").load(baseUrl + '/PersonAdvocate/CandidateFormDetails?candidateFormId=' + result.candidateFormId + '&advocateId=' + result.ContactId, function (data) {
                    if (MojFind("#CandidateFormStatusId").val() == CandidateFormStatus.Accepted && result.ContactId != null && result.ContactId != 0) {
                        //Moj.confirm(Resources.Messages.CandidateFormAccepted, undefined, "", undefined, "", true);
                        Moj.showMessage(Resources.Messages.CandidateFormAccepted,
                    function () {
                        PDO.addEntityContentTab(EntityContentTypeEnum.Advocate, result.ContactId, "", Resources.Strings.Advocate + " " + result.ContactId, "Advocate_Tab_" + result.ContactId);
                    },Resources.Strings.Message, MessageType.Success, true);

                    }
                });
                //});
            }

        }
    };

});