
var Employments =
{

    CheckChangesBeforeSave: function (data) {
        if (data != null) {
            if (data.Error != undefined && data.Error.length > 0) {
                Moj.showErrorMessage(data.Error, function () {
                    return false;
                });
            } else if (data.Message != undefined && data.Message.length > 0) {
                Moj.confirm(data.Message, function () {
                    Employments.SaveAdvocateEmployments();
                });
                return false;
            }
            else {
                Employments.SaveAdvocateEmployments();
            }
        }
    },

    SaveAdvocateEmployments: function () {
        Moj.callActionWithJson("frmEmployments", "/PersonAdvocate/SaveAdvocateEmployments", function (data) {
            if (data.ActionResult != null) {
                if (data.ActionResult.Error.length > 0) {
                    Moj.showErrorMessage(data.ActionResult.Error, function () {
                        return false;
                    });
                } else {
                    if (data.ActionResult.IsChange) {
                        PDO.afterSaveEntityContentTab(data.EntityInfo);
                    }
                }
            }
        });
    },

}


$(document).ready(function () {

    MojFind("#btnAddSelfEmployment").click(function () {
              Moj.safePost("/PersonAdvocate/CheckAddEmployment", {}, function (data) {
            if (data.Error != "")
                Moj.showErrorMessage(data.Error)
            else {
                MojFind("#SelfEmploymentDiv").load(baseUrl + "/PersonAdvocate/EmploymentDetails", { EmploymentTypeId: EmploymentType.SelfEmployment })
                MojFind("#div_btnAddSelfEmployment").hide();
            }
        });

    });

    MojFind("#btnAddEmployee").click(function () {
        Moj.safePost("/PersonAdvocate/CheckAddEmployment", {}, function (data) {
            if (data.Error != "")
                Moj.showErrorMessage(data.Error)
            else {
                MojFind("#EmployeeDiv").load(baseUrl + "/PersonAdvocate/EmploymentDetails", { EmploymentTypeId: EmploymentType.Employee })
                MojFind("#div_btnAddEmployee").hide();
            }
        });

    });

    MojFind("#btnCancelEmployments").click(function () {
        PDO.loadEntityTab('/PersonAdvocate/Employments');
    });

  
});

