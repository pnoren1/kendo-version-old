SaveShiftsPerShiftConfiguration = function (data) {
    Moj.callActionWithJson("frmShiftsPerShiftConfiguration", "/Shift/SaveShiftsPerShiftConfiguration", function (data) {
        
        if (data.Result != undefined && data.Error == undefined) {
            
            GetShiftsPerShiftConfiguraionPanel(MojFind("#MinDateInWeek").val(), false, false);
        }
        else if (data.Error.length > 0)
        {
            
            var errorMessage = "";
            if (typeof (data.Error) == "object") {
                data.Error.forEach(function (element) {
                    errorMessage += element.ErrorMessage + "</br>";
                });
            }
            else if (typeof (data.Error) == "string")
                errorMessage = data.Error;
                
            Moj.showMessage(errorMessage, undefined, Resources.Strings.Error, MessageType.Error);

        }

    });
};

DeleteRowInGrid = function (e) {
    
    var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
    var dataItem = grid.dataItem($(e.currentTarget).closest("tr")); //json format of selected row
    var ErrorMessage = ""
    
    if (dataItem.ShiftId != "0")
    {

        if (dataItem.EmploymentTypeId == "")
            dataItem.EmploymentTypeId = null;

        $.ajax({
            url: baseUrl + '/Shift/BeforeDeleteRowCheck',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "shiftId": ' + dataItem.ShiftId + ', "advocateContactId": ' + dataItem.AdvocateContactId + ', "employmentTypeId":' + dataItem.EmploymentTypeId + '}',
            success: function (data) {
                
                if (Moj.isTrue(data.IsExistProcess))
                    ErrorMessage += Resources.Messages.ErrOpenedProcessesForShift + "." + "<br />";

               if(data.UnpaidFeeRequests.length > 0) {
                    var unpaidFeeRequestsIds = "";
                    for (var i = 0; i < data.UnpaidFeeRequests.length; i++) {
                        unpaidFeeRequestsIds += i != data.UnpaidFeeRequests.length -1 ? " " +data.UnpaidFeeRequests[i]+ ',': " " +data.UnpaidFeeRequests[i];
                        }
                    var error = String.format(Resources.Messages.ErrExistUnpaidFeeRequestsForShift, unpaidFeeRequestsIds)
                    ErrorMessage += error + "." + "<br />";
                    }
                if (Moj.isTrue(data.IsExistNomination))
                    ErrorMessage += Resources.Messages.ErrExistNominationForShift + "." + "<br />";
                if (Moj.isTrue(data.IsExistNominationCandidate))
                    ErrorMessage += Resources.Messages.ErrExistNominationCandidateForShift + "." + "<br />";

                if (ErrorMessage != "")
                    Moj.showMessage(ErrorMessage, undefined, Resources.Strings.Error, MessageType.Error);
                else
                    Moj.HtmlHelpers._deleteVirtualRowGrid(e);
            }
        });
    }
    else
        Moj.HtmlHelpers._deleteVirtualRowGrid(e);

    return false;
    
};

    /**************with grid header***************/
    //function removeGridHeader() {
    //    if (MojFind(".k-grid .k-grid-header")[2] != undefined)
    //        MojFind(".k-grid .k-grid-header")[2].style["display"] = "none";

    //}
    /**************with grid header***************/

$(document).ready(function () {
    var html = MojFind("#Header").html();

    /**************with grid header***************/
    //var grid = MojFind("#GridHeader").html(MojFind(".moj-extended-grid").html());
    //grid[0].childNodes[1].remove();
    //grid[0].childNodes[1].remove();
    //grid[0].childNodes[0].childNodes[1].remove();
    //grid[0].childNodes[0].childNodes[0].childNodes[3].remove();
    //grid[0].firstElementChild.id = null;
    //MojFind("#HeaderDiv").html(html + grid[0].childNodes[0].outerHTML);
    //MojFind("#HeaderDiv").css("margin-bottom", "0px !important");
     /**************end with grid header***************/
    MojFind("#HeaderDiv").html(html);
    
    MojFind("#btnLeftButtonNextWeek").click(function () {
        if (CheckGridLinesChanges()) {
            Moj.confirm("הנתונים שהוזנו לא ישמרו, האם ברצונך להמשיך?", function () {
                GetShiftsPerShiftConfiguraionPanel(MojFind("#MaxDateInWeek").val(), false, true);
            }, undefined, undefined, Resources.Strings.Message, false, undefined, undefined, MessageType.Alert);
        }
        else
            GetShiftsPerShiftConfiguraionPanel(MojFind("#MaxDateInWeek").val(), false, true);
    });

    MojFind("#btnRightButtonPreviousWeek").click(function () {
        if (CheckGridLinesChanges())
        {
            Moj.confirm("הנתונים שהוזנו לא ישמרו, האם ברצונך להמשיך?", function () {
                GetShiftsPerShiftConfiguraionPanel(MojFind("#MinDateInWeek").val(), true, false);
            }, undefined, undefined, Resources.Strings.Message, false, undefined, undefined, MessageType.Alert);
        }
       else
         GetShiftsPerShiftConfiguraionPanel(MojFind("#MinDateInWeek").val(), true, false);
    });


    GetShiftsPerShiftConfiguraionPanel = function (inWeekOfDate, isPreviousWeek, isNextWeek) {

        var url = baseUrl + "/Shift/ShiftsPerShiftConfiguration";
        var customData = {
            shiftConfigurationId: MojFind("#ShiftConfigurationId").val(),
            inWeekOfDate: inWeekOfDate,
            isPreviousWeek: isPreviousWeek,
            isNextWeek: isNextWeek,
        };

        MojFind('#ShiftsPerShiftConfigurationPanel').load(url, customData, function () {
        });
    };


    CheckGridLinesChanges = function () {
        
        var gridDataRows = MojControls.Grid.getKendoGridById("grdShiftsPerShiftConfiguration")._data;
        for (var i = 0; i < gridDataRows.length; i++) {
            if (gridDataRows[i].State == GridRowState.Added || gridDataRows[i].State == GridRowState.Modified)
                return true;
        }
    };

});