


$(document).ready(function () {

    MojFind("#btnTelephoneConnectionRounds").click(function () {
        var grid = MojControls.Grid.getKendoGridById("grdNominationHistoryList");
        var selectedRow = grid.select();
        if (selectedRow.length > 0) {
            var processAdvocateNominationId = grid.dataItem(selectedRow).ProcessAdvocateNominationId;
            var processId = MojFind("#ProcessId").val();
            var urlParameters = '?processId=' + processId;
            urlParameters = urlParameters + "&processAdvocateNominationId=" + processAdvocateNominationId;
            Moj.openPopupWindow("OpenPreviousRoundView", "", "סבבי התקשרות קודמים למינוי", 1200, 700, false, false, false, baseUrl + '/Process/PreviousRoundsView' + urlParameters, "");
        }
    });


    MojFind("#btnCreateNominationDocuments").click(function () {
        var grid = MojControls.Grid.getKendoGridById("grdNominationHistoryList");
        var selectedRow = grid.select();
        if (selectedRow.length > 0) {
            var processAdvocateNominationId = grid.dataItem(selectedRow).ProcessAdvocateNominationId;
            var processId = MojFind("#ProcessId").val();
            var urlParameters = '?processId=' + processId;
            urlParameters = urlParameters + "&processAdvocateNominationId=" + processAdvocateNominationId;
            Moj.openPopupWindow("OpenCreateNominationDocuments", "", "יצירת מסמכי מינוי", 1200, 700, false, false, false, baseUrl + '/Process/CreateNominationDocumentsView' + urlParameters, "");
        }
    });
});