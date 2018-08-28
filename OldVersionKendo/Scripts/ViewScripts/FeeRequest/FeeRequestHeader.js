checkMerkavaStatus = function () {
    if (Moj.isTrue(MojFind("#IsFeeRequestShiftModule").val()))
    {
        var employmentTypeNameNotExist = MojFind("#EmploymentTypeNameNotExist").val();
        var distrinctName = MojFind("#District").val();
        if (MojFind("#OutputErrorId").val() == MerkavaCheckmentEnum.WrnFeeRequestEmploymentTypeNotExist)
            Moj.showMessage(String.format(Resources.Messages.WrnFeeRequestEmploymentTypeNotExist, employmentTypeNameNotExist, distrinctName), undefined, Resources.Strings.Message, MessageType.Alert);
        else if (MojFind("#OutputErrorId").val() == MerkavaCheckmentEnum.WrnShiftModuleHasNotBusinessEntityMerkava)
            Moj.showMessage(Resources.Messages.WrnShiftModuleHasNotBusinessEntityMerkava, undefined, Resources.Strings.Message, MessageType.Alert);
    }
    else
    {
        
        if (MojFind("#OutputErrorId").val() == MerkavaCheckmentEnum.ErrNominationTypeNotAllowedFeeRequest)
            Moj.showMessage(Resources.Messages.ErrNominationTypeNotAllowedFeeRequest, undefined, Resources.Strings.Message, MessageType.Error)
        else if (MojFind("#OutputErrorId").val() == MerkavaCheckmentEnum.ErrNoSameEmploymentTypes)
            Moj.showMessage(Resources.Messages.ErrNoSameEmploymentTypes, undefined, Resources.Strings.Message, MessageType.Error)
        else if (MojFind("#OutputErrorId").val() == MerkavaCheckmentEnum.WrnHearingModuleHasNotBusinessEntityMerkava)
            Moj.showMessage(Resources.Messages.WrnHearingModuleHasNotBusinessEntityMerkava, undefined, Resources.Strings.Message, MessageType.Alert);
        //else if (MojFind("#MerkavaStatus").val() == MerkavaCheckmentEnum.WrnHearingModuleHaveMoreThanOneBusinessEntityMerkava)
        //    Moj.showMessage(Resources.Messages.WrnHearingModuleHaveMoreThanOneBusinessEntityMerkava, undefined, Resources.Strings.Message, MessageType.Alert);

    }
        
};

$(document).ready(function () {

    
    if (!Moj.isTrue(MojFind("#divFeeRequestHeaderId #IsReload").val()))
        checkMerkavaStatus();

    var isFeeRequestShiftModule = MojFind("#IsFeeRequestShiftModule").val();
    if (Moj.isTrue(isFeeRequestShiftModule))
        MojFind("#divFeeRequestHeaderId").height("70px");

    MojFind("#div_AdvocateName").click(function () {
        var advocateContactId = MojFind("#AdvocateContactId").val();
        PDO.addAdvocateTabById(advocateContactId);
    });

    MojFind("#div_ProcessId").click(function () {
        var processId = MojFind("#ProcessId").val();
        PDO.addProcessTabById(processId);
    });

    MojFind("#div_PdoFileId").click(function () {
        var pdoFileId = MojFind("#PdoFileId").val();
        PDO.addPdoFileTabById(pdoFileId);
    });

    MojFind("#div_ApplicantName").click(function () {
        var applicantContactId = MojFind("#ApplicantContactId").val();
        PDO.addContactTabById(applicantContactId);
    });
    });