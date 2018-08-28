var AdmissionRequestDetails= {
    //boldCurrentAdmissionRequest : function () {
    //    var grid = MojFind("[id^='grdAdmissionRequestsList']").data("kendoGrid");
    //    grid.tbody.find('>tr').each(function () {
    //        var dataItem = grid.dataItem(this);
    //        if (dataItem != undefined && (dataItem.IsCurrentRequest == "true" || dataItem.IsCurrentRequest == true || dataItem.IsCurrentRequest == "True"))
    //            $(this).addClass('moj-bold');
    //        else
    //            $(this).removeClass('moj-bold');
    //    })
    //},

saveAdmissionRequest : function (data) {
    if (data.ActionResult != null) {
        if (Moj.showErrorMessage(data.Errors) == true) {
            if (data.ActionResult.IsChange) {
                PDO.afterSaveEntityContentTab(data.EntityInfo);
                //PDO.updateEntityInfo(data.EntityInfo);
            }
            else {
                MojFind('#DetailsContent').empty();
                Moj.replaceDivs('#DetailsContent', '#ListContent');
            }
                    }
    }

},

//admissionRequestStatusHistory : function(){
//    var admissionRequestId = MojFind("#AdvocateAdmissionRequestsObject_AdvocateAdmissionRequestId").val();
//    Moj.openPopupWindow("ViewHistoryAdmissionRequestStatuses", "", Resources.Strings.HistoryAdmissionRequestStatuses, 550, 330, false, false, false, baseUrl + "/PersonAdvocate/HistoryAdmissionRequestStatuses?admissionRequestId=" + admissionRequestId, "", {});

//},

}

$(document).ready(function () {
    MojFind("#AdvocateAdmissionRequestsObject_AdvocateAdmissionRequestStatusId").change(function () {
        //MojFind("#AdvocateAdmissionRequestsObject_AdvocateAdmissionRequestStatusDate").data("kendoDatePicker").value(new Date());
        MojControls.Label.setValueById("AdvocateAdmissionRequestsObject_AdvocateAdmissionRequestStatusDate", Moj.HtmlHelpers._parseDate(new Date()))
       
        //MojFind("#DbParams_FromDate").datepicker().datepicker("setDate", new Date(today));
        //MojControls.DateTimePicker.setValueById("", new Date().getVarDate)
        if ($(this).val() == AdmissionRequestStatusType.PendingInterview)
            MojFind("#AdvocateAdmissionRequestsObject_InterviewDate").visible(true);
        else
            MojFind("#AdvocateAdmissionRequestsObject_InterviewDate").visible(false);
    });
    //MojFind("#lnkHistoryStatuses").click(function () {

    //    var admissionRequestId = MojFind("#AdvocateAdmissionRequestsObject_AdvocateAdmissionRequestId").val();
    //    Moj.openPopupWindow("ViewHistoryAdmissionRequestStatuses", "", "", 550, 270, false, false, false, baseUrl + "/PersonAdvocate/HistoryAdmissionRequestStatuses?admissionRequestId=" + admissionRequestId, "", {});

    //});
});

