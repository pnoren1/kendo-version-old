
$(document).ready(function () {

});


var AdmissionRequest = {
    boldCurrentAdmissionRequest: function () {
        var grid = MojFind("[id^='grdAdmissionRequestsList']").data("kendoGrid");
        grid.tbody.find('>tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && (dataItem.IsCurrentRequest == "true" || dataItem.IsCurrentRequest == true || dataItem.IsCurrentRequest == "True"))
                $(this).addClass('moj-bold');
            else
                $(this).removeClass('moj-bold');

        })
    },

}
