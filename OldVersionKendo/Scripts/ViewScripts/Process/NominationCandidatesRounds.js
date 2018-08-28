
checkRowNumberIfRoundTypeIsNomination = function () {
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if (roundTypeId == RoundTypeEnum.Nomination) {
        var rowsNumber = getCandidateGridRowNumber();
        if (rowsNumber > 1) {
            Moj.showMessage(Resources.Messages.WrnNominationMoreThanOneAdvocate, undefined, undefined, MessageType.Alert);
            MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId", null)
        }
    }
};

getCandidateGridRowNumber = function () {
    var grid = MojControls.Grid.getKendoGridById("grdNominationCandidates");
    var rowsNumber = 0;
    grid.tbody.find('tr').each(function () {
        var dataItem = grid.dataItem(this);
        if (dataItem != undefined && dataItem.State != undefined && dataItem.State != window.Enums.ObjectState.Deleted) {
            rowsNumber = rowsNumber + 1;
        }
    });

    return rowsNumber;
};

setReturnToNominatorVisibilty = function () {
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if (roundTypeId == RoundTypeEnum.NominationCandidate) {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_IsReturnToNominator").visible(true);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_IsReturnToNominator").visible(false);
    }

};

setIsMultipleNomination = function () {
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if (roundTypeId == RoundTypeEnum.NominationCandidate || roundTypeId == RoundTypeEnum.Nomination) {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination").visible(true);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination").visible(false);
    }

};

setNominationEndReasons = function () {
    var ActiveNominationsCounter = MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_ActiveNominationsCounter").val();
    var IsMultipleNomination = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination");
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if ((roundTypeId == RoundTypeEnum.NominationCandidate || roundTypeId == RoundTypeEnum.Nomination) && ActiveNominationsCounter == 1 && Moj.isFalse(IsMultipleNomination)) {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_NominationEndReason").visible(true);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_NominationEndReason").visible(false);
        MojControls.AutoComplete.setValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_NominationEndReason", null)
    }
};

CheckIsViewFeePanel = function () {
    var isVisibleFeePanel = MojFind("#GeneralDetailsModel_FeePanelModel_IsViewFeePanel").val();
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if ((roundTypeId == RoundTypeEnum.NominationCandidate || roundTypeId == RoundTypeEnum.Nomination) && Moj.isTrue(isVisibleFeePanel)) {
        MojFind("#GeneralDetailsModel_FeePanelModel_IsViewFeePanelAllConditions").val(true);
        MojFind("#FeePanel").closest('div').removeClass('hide');
        MojFind("#FeePanel").closest('div').css('display', '');
        //MojFind("#FeePanel").show();
    }
    else {
        MojFind("#GeneralDetailsModel_FeePanelModel_IsViewFeePanelAllConditions").val(false);
        MojFind("#FeePanel").closest('div').addClass('hide');
        MojFind("#FeePanel").closest('div').css('display', 'none');
    }
};

setSupervisionCheckboxesVisibility = function () {
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
    if (roundTypeId == RoundTypeEnum.Nomination) {
        MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate").enable(false);
        MojControls.CheckBox.setValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate", false);
        MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate").enable(false);
        MojControls.CheckBox.setValueById("GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate", false);
    }
    else {
        MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisionLevelAccordingToAdvocate").enable(true);
        MojFind("#GeneralDetailsModel_NominationPdoFile_IsSupervisorAccordingToAdvocate").enable(true);
    }
};

onNominationCandidateRoundDocumentReady = function () {
    setReturnToNominatorVisibilty();
    setIsMultipleNomination();
    setCreateNominationDocumentVisiblity();
    setNominationEndReasons();
    CheckIsViewFeePanel();
};

setCreateNominationDocumentVisiblity = function () {
    var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
        if (roundTypeId == RoundTypeEnum.NominationCandidate)
        {
            MojFind("#CreateDocumentViewPanel").show();
            MojFind("#CreateDocumentsModel_LanguageId").visible(false);
            MojFind("#CreateDocumentsModel_SelectedTemplateTypeIds").visible(false);
        }
        else if (roundTypeId == RoundTypeEnum.Nomination)
        {
            MojFind("#CreateDocumentViewPanel").show();
            MojFind("#CreateDocumentsModel_LanguageId").visible(true);
            MojFind("#CreateDocumentsModel_SelectedTemplateTypeIds").visible(true);
        }
        else
            MojFind("#CreateDocumentViewPanel").hide();
};

clearIsMultipleNomination = function () {
    MojControls.CheckBox.setValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination", true);
};

$(document).ready(function () {
  
      MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId").change(function (e) {
          checkRowNumberIfRoundTypeIsNomination();
                  setReturnToNominatorVisibilty();
                  setIsMultipleNomination();
                  setNominationEndReasons();
                  CheckIsViewFeePanel();
                  setCreateNominationDocumentVisiblity();
      });

      MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination").change(function (e) {
          var IsMultipleNomination = MojControls.CheckBox.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_IsMultipleNomination");
          var ActiveNominationsCounter = MojFind("#GeneralDetailsModel_NominationCandidatesRoundsModel_ActiveNominationsCounter").val();
          if (Moj.isFalse(IsMultipleNomination) && ActiveNominationsCounter > 1)
              Moj.showMessage(Resources.Messages.MoreOneActiveNominationForProcess, clearIsMultipleNomination, Resources.Strings.MessageError, MessageType.Error);
          else
              setNominationEndReasons();
      });

    MojFind("#btnPreviousRound").click(function () {
        var processId = MojFind("#GeneralDetailsModel_ProcessId").val();
        var urlParameters = '?processId=' + processId + "&processAdvocateNominationId=0";
        Moj.openPopupWindow("OpenPreviousRoundView", "", Resources.Strings.PreviousNominationRoundsTitle, 1200,500, false, false, false, baseUrl + '/Process/PreviousRoundsView' + urlParameters, "");
    });

    MojFind("#div_grdNominationCandidates").find(".moj-add-button .k-button").click(function (e) {
        var roundTypeId = MojControls.AutoComplete.getValueById("GeneralDetailsModel_NominationCandidatesRoundsModel_RoundTypeId");
        if (roundTypeId == RoundTypeEnum.Nomination) {
            var rowsNumber = getCandidateGridRowNumber();
            if (rowsNumber == 1) {
                Moj.showMessage(Resources.Messages.WrnInvalidAddAdvocate, undefined, Resources.Strings.Message, MessageType.Alert);
                e.preventDefault();
            }
        }
    });
});