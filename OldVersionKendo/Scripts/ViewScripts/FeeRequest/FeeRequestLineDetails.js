var FeeRequestLineDetails =
    {

        onShowWarning: function () {
            var dataSerialize = MojFind("#frmFeeRequestLineDetails").serializeObject();

            if (MojFind("#IsLineEditable").val() == "True") {

                if (MojFind("#frmFeeRequestLineDetails").valid()) {

                    $.ajax({
                        type: "POST",
                        async: false,
                        url: baseUrl + "/FeeRequest/ShowWarning",
                        contentType: 'application/json',
                        data: JSON.stringify(dataSerialize) ,
                        success: function (data) {
                            if (data != null) {
                                if (data.Errors != undefined && data.Errors.length > 0) {
                                    Moj.showErrorMessage(data.Errors, function () {
                                        return false;
                                    });
                                } else {
                                    Moj.openPopupWindow("OpenShowWarningView", data, "",1200,600, false, false, false, null, null);
                                }
                            }
                        },
                        error: function (e) {
                          
                        }
                    });
                   
                }
            }
            else
            {
                $.ajax({
                    type: "POST",
                    async: false,
                    url: baseUrl + "/FeeRequest/ShowWarning",
                    contentType: 'application/json',
                    data: JSON.stringify(dataSerialize),
                    success: function (data) {
                        if (data != null && data != undefined) {
                                Moj.openPopupWindow("OpenShowWarningView", data, "", 1200, 600, false, false, false, null, null);
                            }
                    },
                });
            }
        },

        onRequestLineBack: function (data) {

            if (data != null) {
                if (data.Error.length > 0) {
                    Moj.showErrorMessage(data.Error);
                    return false;
                }
                else {

                    var title = data.RequestLineBackType == 1
                        ? Resources.Strings.BackToExaminationTitle
                        : Resources.Strings.BackToApprovalTitle;
                    Moj.openPopupWindow("ConfirmBackFromConfirmation", null, title, 500, 180, false, false, false, baseUrl + "/FeeRequest/ConfirmBack", null, { RequestLineBackType: data.RequestLineBackType });

                }
            }

        },

        onCheckSaveSuccess: function (data) {

            if (data != null && data.Errors != undefined) {
                if (data.Errors.length > 0) {
                    Moj.showErrorMessage(data.Errors);
                    return false;
                } else if (data.Warning.length > 0) {
                    Moj.confirm(data.Warning, function () {
                        FeeRequestLineDetails.saveSuccessFeeRequestLineDetails(null);
                    });

                } else {
                    FeeRequestLineDetails.saveSuccessFeeRequestLineDetails(null);
                }
            }
        },

        updateReasonBack: function (reason, type) {
            MojControls.Hidden.setValueById("BackReason", reason);
            FeeRequestLineDetails.saveSuccessFeeRequestLineDetails(type);

        },

        saveSuccessFeeRequestLineDetails: function (type) {
            Moj.callActionWithJson("frmFeeRequestLineDetails", "/FeeRequest/SaveFeeRequestLineDetails", function (data) {

                if (data.ActionResult != null) {
                    if (data.ActionResult.Errors.length > 0) {
                        Moj.showErrorMessage(data.ActionResult.Errors, function () {
                            return false;
                        });

                    } else {
                        if (data.ActionResult.IsChange) {

                            PDO.onRefresh(data.ActionResult.EntityContentType);
                            return true;
                        }
                    }
                }
            }, { requestLineBackType: type });
        },

        openCallProcessesPopUp: function () {

            //var dateForCallProcesses = MojFind("#DateForCallProcesses").val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
            var dateForCallProcesses = MojFind("#DateForCallProcesses").val();


            if (dateForCallProcesses != "") {
                var urlParameters = {
                    dateForCallProcesses: dateForCallProcesses,
                };
                Moj.website.openPopupWindow("callProcessesPopUp", null, Resources.Strings.FeeRequestRangeDatesCallProcessesTitle, 1140, 620, false, false, false, baseUrl + '/FeeRequest/FeeRequestRangeDatesCallProcesses', undefined, urlParameters);

            }

        }

    }