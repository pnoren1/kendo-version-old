

exportView = {

    onDataBound: function (e) {
        Grid_dataBound(e);
        //exportView.setViewColors();
        MojFind("[id*='grdFeeRequestsExport']").find("input[name='chbIsSelected']").attr("onclick", "exportView.onCheckBoxClicked(this)");

    },
    onShowClick: function () {
        Moj.safePost("/FeeRequest/InvalidMerkavaView", undefined, function (content) {

            if (content.Error != undefined && content.Error.length > 0) {
                Moj.showErrorMessage(content.Error, function () {
                    return false;
                });
            }
            else {
                Moj.openPopupWindow("OpenInvalidMerkavaView", content, "בקשות שכר טרחה עם מוטב מרכבה לא תקין", 1250, 700, false, false, false);
            }
        });

    },

    onCheckBoxClicked: function (e) {

        exportView.setTotalSum(e);
        Moj.HtmlHelpers._onCheckboxInGridClicked(e, 'IsSelected', true);
    },

    onDocumentReady: function () {

        MojFind("#btnShowDisabledMutavRequests").click(function () {
            exportView.onShowClick();
        });

        //MojFind("[id*='grdFeeRequestsExport']").find("[id='chbIsSelected']").die('change');
        //$(document).delegate("[id*='grdFeeRequestsExport'] [id='chbIsSelected']",
        //    "change",
        //    function() {
        //        exportView.setTotalSum();
        //    });
        //MojFind("[id*='grdFeeRequestsExport']").find("[id='chbIsSelected']").live('change', function () {
        //    
        //    exportView.setTotalSum();

        //});

        //MojFind("[id='chbIsSelected']").live("check",function () {
        //    
        //    exportView.setViewColors();
        //    exportView.setTotalSum();

        //});

    },

    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    numberWithOutCommas: function (x) {
        return x.toString().replace(/\,/g, '');
    },

    setTotalSum: function (e) {
        var totalSum = MojFind("#ExportTotalSum").val();
        totalSum = exportView.numberWithOutCommas(totalSum);
        var grid = MojControls.Grid.getKendoGridById("grdFeeRequestsExport");
        var tr = $(e).closest("tr");
        var row = grid.dataItem(tr);
        if (e.checked) {
            totalSum = (parseFloat(totalSum) + parseFloat(row.TotalSumWithVat + row.TotalSumZeroVat)).toFixed(2);

        }
        else {
            totalSum = (parseFloat(totalSum) - parseFloat(row.TotalSumWithVat + row.TotalSumZeroVat)).toFixed(2);
        }

       totalSum = exportView.numberWithCommas(totalSum);
       MojControls.Label.setValueById("ExportTotalSum", totalSum);
    },

    //setViewColors: function () {

    //    var grid = MojControls.Grid.getKendoGridById("grdFeeRequestsExport");
    //    grid.tbody.find('tr').each(function () {
    //        var dataItem = grid.dataItem(this);
    //        if (dataItem != undefined) {
    //            if (Moj.isTrue(dataItem.IsExist)) {
    //                $(this).addClass("exist-row");

    //            }
    //        }
    //    });
    //},

    onSaveSuccess: function (data) {
            if (data.Error != undefined && data.Error.length > 0) {
                Moj.showErrorMessage(data.Error, function () {
                    return false;
                });
            }
            else {
                Moj.showMessage('הכנת משלוח למרכב"ה החלה. בסיום התהליך תתקבל הודעת אישור על המסך.', undefined, 'הודעה', MessageType.Message)
                if (data.IsChange != undefined && data.IsChange==true) {
                    MojFind("[id^='ObjectState']").val(false);
                    //MojFind("#li_" + "FeeRequestExportView").find("a").click();



                    //PDO.onRefresh(EntityContentTypeEnum.FeeRequestShiftsCalls);

                    //var id = data.EntityInfo.EntityId;
                    //PDO.reloadEntityContentTab(EntityContentTypeEnum.FeeRequest, id, data.ActionResult.AdvocateName + "-" + id, "FeeRequest_Tab_" + id, "FeeRequestHearingDetails");
                }
            }


    },


}


$(document).ready(function () {


});







