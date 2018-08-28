onSaveNominationSuccess = function (data) {
    if (data.ActionResult != null) {
        if (data.ActionResult.Error != null && data.ActionResult.Error.length > 0) {
            Moj.showErrorMessage(data.ActionResult.Error, function () {
                return false;
            });

        } else {
            if (data.ActionResult.IsChange) {
                var id = data.ActionResult.ProcessId;
                var text = Resources.Strings.Process + " " + id;
                var tabName = "Process_Tab_";
                MojFind("[id^='ObjectState']").val(false);
                PDO.reloadEntityContentTab(EntityContentTypeEnum.Process, id, text, tabName + id, "NominationGeneralDetails");
            }
            if (data.ActionResult.Notifications) {
                Moj.showMessage(data.ActionResult.Notifications, undefined, Resources.Strings.InfoMessage, MessageType.Attention);
            }
            if (data.ActionResult.SuccessMessage != "") {
                alert(data.ActionResult.SuccessMessage);
            }
        }
    }
};

setCandidateNextOrder = function () {
    var existOrder = MojFind("#NominationCandidatesForDisplay_Order").val();
    if (existOrder == "") {
        var grid = MojControls.Grid.getKendoGridById("grdNominationCandidates");
        var order = grid.dataSource.data().length + 1;
        MojFind("#NominationCandidatesForDisplay_Order").val(order);
    }
};

copyAdvocateToGrid = function (advocateId, shiftId, employmentTypeId) {
    if (advocateId == "")
        return;
    var processId = MojFind("#GeneralDetailsModel_ProcessId").val();
    var isAdvocateAlreadyExist = false;
    var grid = MojControls.Grid.getKendoGridById("grdNominationCandidates");
    grid.tbody.find('>tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem != undefined && dataItem.State != undefined) {
            if (dataItem.State != window.Enums.ObjectState.Deleted) {
                if (dataItem.AdvocateContactId == advocateId) {
                    Moj.showMessage(Resources.Messages.WrnAdvocateAlreadyExist, undefined, Resources.Strings.Message, MessageType.Alert);
                    isAdvocateAlreadyExist = true;
                    return false;
                }
            }
        }
    });
    if (!isAdvocateAlreadyExist) {
        var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
        if (roundTypeId == RoundTypeEnum.Nomination) {
            var rowsNumber = getCandidateGridRowNumber();
            if (rowsNumber == 1) {
                Moj.showMessage(Resources.Messages.WrnInvalidAddAdvocate, undefined, Resources.Strings.Message, MessageType.Alert);
                return false;
            }
        }


        $.post("/Process/GetCandidateByAdvocateId", { advocateId: advocateId, processId: processId, shiftId: shiftId, employmentTypeId: employmentTypeId }, function (data) {
            if (data.Error == undefined) {
                var grid = MojControls.Grid.getKendoGridById("grdNominationCandidates");
                var order = grid.dataSource.data().length + 1;
                data.Candidate.Order = order;
                grid.dataSource.add(data.Candidate);
                grid.refresh();
            }
            else {
                Moj.showErrorMessage(data.Error);
            }
        });
    }
};

MojFind("#btnActionNominationGeneralDetails").click(function () {
    var gridData = kendo.stringify(MojFind("[id^='grdNominationCandidates']").data("kendoGrid").dataSource.view());

    if (MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId").val() == RoundTypeEnum.Nomination && gridData != "[]") {
        var existNomination = false;
        $.ajax({
            url: baseUrl + '/Process/CheckNominationBeforeSave',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: gridData,

            success: function (response) {

                if (Moj.isTrue(response.ExistNomination))
                    existNomination = true;
                else
                    existNomination = false;

            },
        });

        if (Moj.isTrue(existNomination) && MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_NominationEndReason").val() != "") {
            Moj.showErrorMessage("יש למחוק את סיבת סיום מינוי כאשר יש מינוי מסוג תורנות ");
            return false;

        }
        else {
            MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_ExistNominationByShift").val(existNomination);
            return true;
        }
    }
    else {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_ExistNominationByShift").val("");
        return true;
    }



});

onNominatorIdChanged = function () {
    var currentUser = MojFind("#CurrentUser").val();
    var nominatorId = MojFind("#GeneralDetailsModel_NominatorId").val();
    if (nominatorId != currentUser) {
        MojFind('.minus').click();
        MojFind(".plus").find('a').attr('disabled', 'disabled');
        //var isProcessCharacteristicsChanged = Moj.isTrue(MojFind("#ObjectStateProcessCharacteristics").val());
        //var isPdoFileChanged = Moj.isTrue(MojFind("#ObjectStatePdoFile").val());
        //var isRoundChanged = Moj.isTrue(MojFind("#ObjectStateRound").val());
        ////var is candidate changed if any state is modified or added or deleted
        //if (isProcessCharacteristicsChanged || isPdoFileChanged || isRoundChanged) {
        //    Moj.confirm(Resources.Messages.WrnNominatorChanged, function () {
        //        //on ok clicked
        //        //
        //    }, undefined, function () {
        //        //on cancel clicked
        //        //set the old value of nominator

        //    });
        //}
        ////disable the plus button and check if object state is true, show message 7
    }
    else {
        //and enabled the plus button
        MojFind(".plus").find('a').removeAttr('disabled');
        MojFind('.plus').click();
    }
}

$(document).ready(function () {
    onNominatorIdChanged();
    MojFind("#GeneralDetailsModel_NominatorId").change(function (e) {
        onNominatorIdChanged();
    });

    MojFind("#FeePanel").hide(true);

    MojFind("#btnCancelNominationGeneralDetails").click(function () {
        PDO.loadEntityTab('/Process/NominationGeneralDetails');
    });
});