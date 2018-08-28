function NominationsList_RequestEnd(e,lbl) {
    PDO._onSearchRequestEnd(e, lbl);
    if (e.hasOwnProperty("response")) {
        if (e.response.Type == 0) {
            Moj.showErrorMessage(e.response.Error[0].ErrorMessage, function () {
                return false;
            });
        }
    }
}



    $(document).ready(function () {
        //validationAdvocateProfileId = function () {
        //    if (checkIfOnlyHebrew("SearchCriteria_AdvocateProfileId"))
        //        return { valid: true, message: "" };
        //    return { valid: false, message: Resources.Messages.InvalidHebrewPattern };
        //};

        //checkIfOnlyHebrew = function (id) {
        //    if (MojControls.AutoComplete.getValueById(id) != "" && MojControls.AutoComplete.getSelectedAutoCompleteValueById(id) == -1 && MojControls.AutoComplete.getValueById(id).match("^[א-ת.\\-\\s\\']+$") == null) {
        //        return false;
        //    }
        //    return true;
        //};

        MojFind("#SearchCriteria_AdvocateProfileId").change(function () {
            var regex = /[\u0590-\u05FF]/; //אותיות בעברית בלבד
            // var IfOnlyHebrew = checkIfOnlyHebrew("SearchCriteria_AdvocateProfileId");
            //var value2 = MojControls.AutoComplete.getValueById("SearchCriteria_AdvocateProfileId");
            var value = document.getElementsByName("SearchCriteria.AdvocateProfileId_input")[0].value;
            //document.getElementsByName("_input")[0].value;
            if (value == "" || regex.test(value)) {
                return true;
            } else {
                Moj.showErrorMessage("נא להכניס בבקשה רק אותיות בעברית");
                MojControls.AutoComplete.setValueById("SearchCriteria_AdvocateProfileId", "")

                //document.getElementById("notification").innerHTML = "נא להכניס רק אותיות בעברית";
                // document.getElementsByName("SearchCriteria.AdvocateProfileId_input")[0].className = "k-input input-validation-error";
                return false;
            }

        });

        MojFind("#btnClearSearchNominations").click(function () {
            MojControls.Grid.clear('GridSearchNomination');
        });
        


    })
