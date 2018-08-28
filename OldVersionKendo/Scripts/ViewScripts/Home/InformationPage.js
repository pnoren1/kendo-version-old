function setColors(countControlClass) {
    
    //var low = parseInt(MojFind("#Low").val());
    //var medium = parseInt(MojFind("#Medium").val());
    ////var high = parseInt(MojFind("#High").val());
    //var control=MojFind("#" + countControlName);
    //var count = parseInt(control.text());
    //if (count < low) {
    //    control.addClass("green-color");
    //}
    //else if (count > low && count < medium) {
    //    control.addClass("orange-color");
    //}
    //else {
    //    control.addClass("red-color");
    //}

    var low = parseInt(MojFind("#Low").val());
    var medium = parseInt(MojFind("#Medium").val());
    //var high = parseInt(MojFind("#High").val());
    var control = MojFind("." + countControlClass);
    var controlCount = MojFind("." + countControlClass + " .num");
    var count = parseInt(MojFind("." + countControlClass + " .num").text());
    if (count < low) {
        controlCount.addClass("green");
    }
    else if (count > low && count < medium) {
        controlCount.addClass("orange");
    }
    else {
        controlCount.addClass("red");
    }
}

$(document).ready(function () {
    
    setColors("cube-1");
    setColors("cube-2");
    setColors("cube-3");
    setColors("cube-4");
    setColors("cube-5");
    setColors("cube-6");

    //setColors("checkedForEligibilityCount");
    //setColors("duringPhoneCheckingCount");
    //setColors("waitingReAppointmentCount");
    //setColors("newCandidateForms");




    MojFind(".cube-1").click(function () {
        //MojFind("#IsUserNominator"
        var isUserNominator = MojFind("#IsUserNominator").val();
        if (Moj.isTrue(isUserNominator)) {
            PDO.addContentTab(ContentTypeEnum.NominationModul, 'Nominations', 'isAutoBind=true', "מינויים", 'NominationModulTab', undefined, undefined, true)
        }
    });

    MojFind(".cube-2").click(function () {
        PDO.addContentTab(ContentTypeEnum.ProcessModul, 'Processes', 'processStatusId=2', "פניות", 'ProcessModulTab', undefined, undefined, true)//(ProcessStatusReason.CheckedForEligibility)
    });

    MojFind(".cube-3").click(function () {
        PDO.addContentTab(ContentTypeEnum.NominationModul, 'Nominations', 'openTabName=SearchTelephoneConnection&isFromInformationPage=true', "מינויים", 'NominationModulTab', undefined, undefined, true);
        //PDO.addContentTab(ContentTypeEnum.ProcessModul, 'Processes', 'processStatusId=8', "פניות", 'ProcessModulTab', undefined, undefined, true)//(ProcessStatusReason.DuringPhoneChecking)
    });


    MojFind(".cube-4").click(function () {
        PDO.addContentTab(ContentTypeEnum.ProcessModul, 'Processes', 'processStatusId=14', "פניות", 'ProcessModulTab', undefined, undefined, true)//(ProcessStatusReason.WaitingReAppointment)
    });


    MojFind(".cube-5").click(function () {
        PDO.addContentTab(ContentTypeEnum.AdvocateModul, 'Advocates', 'openTabName=SearchCandidateForm&statusId=1', "סנגורים", 'AdvocateModulTab', undefined, undefined, true)//CandidateFormStatus.New
    });

    MojFind(".cube-6").click(function () {
        //PDO.addContentTab(ContentTypeEnum.AdvocateModul, 'Advocates', 'openTabName=SearchCandidateForm&statusId=1', "סנגורים", 'AdvocateModulTab', undefined, undefined, true)//CandidateFormStatus.New
        
        var href = "/Home/MemoListDetails?ControllerValue=Memo&ActionValue=SearchMemo&RouteValues={\"Kind\":1,\"EntityType\":null,\"EntityId\":null,\"EntityController\":null,\"Container\":2, \"IsFromInformationPage\": true}"
        Moj.safeAjaxCall(href,
            "get",
            undefined,
            undefined,
            function (data) {
                
                MojFind("[id^='content']").html(data);
                Moj.ChangeState("li_SearchMemo");
                return false;
            });
       
    });
    


});