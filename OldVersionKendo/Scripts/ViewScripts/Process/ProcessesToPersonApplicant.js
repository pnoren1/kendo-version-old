$(document).ready(function () {
    
    //disable defualt checked rows



    saveProcessesToGrid = function () {

        var processesToPersonApplicantGrid = MojFind("[id^='grdProcessesToPersonApplicant']").data("kendoGrid");
        var selectedProcesses = processesToPersonApplicantGrid.dataSource.data().filter(x => x.IsSelected);
        var parameters = null;
        var i = 0;
        var myWindow = $("#openProcessesRepresentedByPDOPopup").data("kendoWindow");

        selectedProcesses.forEach(function (obj) {
            parameters += "&selectedProcesses[" + i + "]=" + obj.ProcessId;
            i++;
        });

        if (selectedProcesses.length > 0) {
            $.ajax({
                url: baseUrl + '/Process/CheckBeforeProcessesToPersonApplicantSave?' + parameters,
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.Result != null) {
                        Moj.showMessage(result.Result, function () {
                            if (myWindow != null)
                                myWindow.close();
                            var processesRepresentedByPDOGrid = MojFind("[id^='grdProcessesRepresentedByPDOList']").data("kendoGrid");

                            selectedProcesses.forEach(function (obj) {
                                if (obj.PDOFile == null)
                                    obj.PDOFile = "";
                                processesRepresentedByPDOGrid.dataSource.add(obj);
                                MojFind("#ObjectState").val(true);

                            });
                        }, Resources.Strings.Message, MessageType.Alert);
                    }
                    else {
                        if (myWindow != null)
                            myWindow.close();
                        var processesRepresentedByPDOGrid = MojFind("[id^='grdProcessesRepresentedByPDOList']").data("kendoGrid");

                        selectedProcesses.forEach(function (obj) {
                            if (obj.PDOFile == null)
                                obj.PDOFile = "";
                            processesRepresentedByPDOGrid.dataSource.add(obj);
                            MojFind("#ObjectState").val(true);

                        });
                    }

                },

            });
        }
        else {
            if (myWindow != null)
                myWindow.close();
        }


        
    }
});

