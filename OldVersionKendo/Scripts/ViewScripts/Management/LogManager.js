$(document).ready(function () {
    InitiateTimeFields();
});

function InitiateTimeFields() {
    MojFind("#" + DbParams_FromTime).mask("99:99", { placeholder: "0" });
    MojFind("#" + DbParams_ToTime).mask("99:99", { placeholder: "0" });
    MojFind("#" + DbParams_FromTime).val("00:00");
    MojFind("#" + DbParams_ToTime).val("00:00");
};

function LogManagerDataBound() {
    clearExceptionDetails();
};

function clearExceptionDetails() {
    MojFind("#" + div_LdCreateDate).text("");
    MojFind("#" + div_LdLevel).text("");
    MojFind("#" + div_LdIdentity).text("");
    MojFind("#" + div_LdMachineName).text("");
    MojFind("#" + div_LdIP).text("");
    MojFind("#" + div_LdOrigin).text("");
    MojFind("#" + div_LdMessage).text("");
    MojFind("#" + div_LdException).text("");
};

MojFind("#DbParams_FromDate, #DbParams_ToDate, #DbParams_Level, #DbParams_Machinename, #DbParams_Identity, " +
    "#DbParams_Ip, #DbParams_Message").live('keypress', function (e) {
        if (e.keyCode == 13) {
            MojFind("#div_btnSearchLogManager").click();
        }
    });

MojFind("#" + DbParams_Level).live('change', function () {
    var levelName = MojControls.AutoComplete.getTextById(DbParams_Level);
    if (levelName != "בחר")
        MojFind("#" + DbParams_Level).val(levelName);
    else
        MojFind("#" + DbParams_Level).val("");
});

MojFind("#DbParams_FromDate").live('change', function () {
    if (MojFind("#DbParams_FromDate").val() == "")
        MojFind("#DbParams_FromDate").val("");
});

MojFind("#DbParams_ToDate").live('change', function () {
    if (MojFind("#DbParams_ToDate").val() == "")
        MojFind("#DbParams_ToDate").val("");
});

MojFind('.k-grid tr').live('click', function () {

    var grid = MojControls.Grid.getKendoGridById(grdLogEntriesList);
    if (grid != undefined) {
        var gridSelectedItem = grid.select();
        if (gridSelectedItem != undefined) {
            var selectedItem = grid.dataItem(this);
            var time = (selectedItem.CreateDate.toLocaleTimeString());
            var dt = selectedItem.CreateDate.toDateString();
            var dateFormatDay = selectedItem.CreateDate.getDate();
            var dateFormatMonth = selectedItem.CreateDate.getMonth() + 1;
            var dateFormatYear = selectedItem.CreateDate.getFullYear();
            var dateFormat = dateFormatDay + '/' + dateFormatMonth + '/' + dateFormatYear;
            dateFormat = time + " " + dateFormat;
            MojFind("#" + div_LdCreateDate).html(dateFormat);
            MojFind("#" + div_LdMachineName).html(selectedItem.Machinename);
            MojFind("#" + div_LdOrigin).html(selectedItem.Origin);
            MojFind("#" + div_LdIdentity).html(selectedItem.Identity);
            MojFind("#" + div_LdLevel).html(selectedItem.Level);
            MojFind("#" + div_LdMessage).html(selectedItem.Message);
            MojFind("#" + div_LdException).html(selectedItem.Exception);
            MojFind("#" + div_LdIP).html(selectedItem.Ip);
        }
    }
});

clearLog = function () {
    Moj.confirm(Resources.Messages.DeleteLogs, function () {

        $.ajax({
            url: baseUrl + "/Management/ClearLogEntries",
            success: function () {
                Moj.showMessage(Resources.Messages.DeleteLogsCompleted, null, Resources.Messages.DeleteLogsTitle, "alert");
            }
        });
    }, null, null, Resources.Messages.DeleteLogsTitle);
};

changeLogLevel = function () {
    Moj.openPopupWindow("changeLogLevel", null, Resources.Strings.ChangeLogLevel, 300, 100, false, false, false,
        baseUrl + "/Management/ChangeLogLevelForm", undefined, null);
};

function GetDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}





MojFind("#btnClearLogManager").live('click', function () {
    InitiateTimeFields();

    var today = GetDate();
    MojFind("#DbParams_FromDate").datepicker().datepicker("setDate", new Date(today));
    MojFind("#DbParams_ToDate").datepicker().datepicker("setDate", new Date(today));
});

MojFind("#btnSaveLogLevel").live('click', function () {
    alert('a');
    var current = MojControls.Hidden.getValueById(CurrentLevelId);
    var selected = MojControls.AutoComplete.getValueById(LevelId);
    //InitiateTimeFields();

    //var today = GetDate();
    //MojFind("#DbParams_FromDate").datepicker().datepicker("setDate", new Date(today));
    //MojFind("#DbParams_ToDate").datepicker().datepicker("setDate", new Date(today));
});