

function ProcessList_RequestEnd(e) {
    debuggerl
    if (e.response != undefined) {
        if (e.response.Total == 0) {
            GetSearchProcessResponseType(MojControls.TextBox.getValueById(parameters_CourtFileNumber));
        }
    }
};


GetSearchProcessResponseType = function () {
    $.ajax({
        url: baseUrl + '/PersonApplicant/GetSearchProcessResponseType',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "courtFileNumber=" + MojControls.TextBox.getValueById(parameters_CourtFileNumber),

        success: function (response) {
            if (response != '') {
                if (response.Type == SearchProcessResponseTypeEnum.NoExist) {
                 
                    Moj.confirm(Resources.Messages.NoProcess, function () {                    
                        PDO.addEntityContentTab(EntityContentTypeEnum.Process, "0", { personApplicantId: response.personApplicantId, courtFileNumber: MojControls.TextBox.getValueById(parameters_CourtFileNumber) }, Resources.Strings.NewProcess, "Process_Tab_0");
                    }, function () {
                        return false;
                    });
                }
                else if (response.Type == SearchProcessResponseTypeEnum.OnlyProcessExist) {
                  
                    Moj.confirm(Resources.Messages.NoApplicantProcess, function () {
                        PDO.addEntityContentTab(EntityContentTypeEnum.Process, "0", { personApplicantId: response.personApplicantId, processId: response.processId, }, Resources.Strings.NewProcess + " " + response.Process, "Process_Tab_" + response.processId);
                    }, function () { return false; });
                }

                else if (response.Type == SearchProcessResponseTypeEnum.Error) {
                 
                    Moj.confirm(Resources.Messages.ErrorMsg, function () {

                    }, function () { return false; });
                }

            }
        },
        error: function (xhr, tStatus, err) {
            //alert(err);
        }
    });
}
  

