$(document).ready(function () {

    MojFind("#btnSaveInGridProcessNotRepresentedByPDODetails").removeAttr("onclick")
    MojFind("#btnSaveInGridProcessNotRepresentedByPDODetails").die('click');
    MojFind("#btnSaveInGridProcessNotRepresentedByPDODetails").live('click', function () {
        checkBeforeSave();

    });

    checkBeforeSave = function () {
        var processNumberForSearch = MojFind("#ProcessNumber").val() + MojFind("#ProcessNumberMonth").val() + MojFind("#ProcessNumberYear").val();
        var processTypeId = MojFind("#ProcessTypeId").val();
        var joinedProcessId = MojFind("#JoinedProcessId").val();

        if (MojFind("#ProcessNumber").val() == "" && MojFind("#PoliceIncidentNumber").val() == "")
            Moj.showMessage(Resources.Messages.ErrPoliceIncidentNumberOrProcessNumberAreRequired, undefined, Resources.Strings.Error, MessageType.Error);

        else if (processNumberForSearch != "") {

            $.ajax({
                url: baseUrl + '/Process/CheckBeforeSaveProcessesNotByPDO',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: '{ "processNumberForSearch": "' + processNumberForSearch + '", "processTypeId": "' + processTypeId + '", "joinedProcessId": "' + joinedProcessId + '" }',

                success: function (data) {
                    var ErrorMessage = "";

                    if (Moj.isTrue(data.IsExistExternalProcesses)) {
                        ErrorMessage += Resources.Messages.ErrIsExistExternalProcesses + "." + "<br />"
                    };

                    if (Moj.isTrue(data.IsExistProcesses)) {
                        ErrorMessage += Resources.Messages.ErrIsExistProcesses + "." + "<br />"
                    };

                    if (ErrorMessage != "") {

                        Moj.showMessage(ErrorMessage, undefined, Resources.Strings.Error, MessageType.Error);
                        return false;
                    }
                    else {
                        setProcessNumberForDisplay();
                        Moj.HtmlHelpers._saveRowToGrid('grdProcessesNotRepresentedByPDOList', 'ProcessesNotRepresentedByPDODetails', '', 'setProcessNumberForDisplay', '', false, '', '', '', false);
                    }

                }

            });

        }
        else
            Moj.HtmlHelpers._saveRowToGrid('grdProcessesNotRepresentedByPDOList', 'ProcessesNotRepresentedByPDODetails', '', 'setProcessNumberForDisplay', '', false, '', '', '', false);
    },

    setProcessNumberForDisplay = function () {
        
        var prefixText = MojFind("#ProcessNumberPrefixId").data("kendoComboBox").text();
        var processNumber = MojFind("#ProcessNumber").val();
        var monthText = MojFind("#ProcessNumberMonth").val();
        var yearText = MojFind("#ProcessNumberYear").val();
        var forDisplayVal = "";
        if (prefixText != "")
            forDisplayVal = prefixText + " ";
        if (processNumber != "")
            forDisplayVal += processNumber;
        if (monthText != "")
            forDisplayVal += "-" + monthText;
        if (yearText != "")
            forDisplayVal += "-" + yearText;
        MojFind("#ProcessNumberForDisplay").val(forDisplayVal);
    }
});




