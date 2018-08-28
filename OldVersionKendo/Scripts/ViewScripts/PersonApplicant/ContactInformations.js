$(document).ready(function () {
    MojFind("#ContactInformationsModel_Email_Email").change(function () {
        if (MojFind("#ContactInformationsModel_Email_Email").val() != "") {
            MojFind("#ContactInformationsModel_Email_IsContactEmail").enable(true)
            if (MojFind("#ContactInformationsModel_ContactTypeId").val() == ContactTypeEnum.Advocate) //סנגורים המייל הוא תמיד להתקשרות
                MojControls.CheckBox.setValueById("ContactInformationsModel_Email_IsContactEmail", true);
        }
        else {
            MojFind("#ContactInformationsModel_Email_IsContactEmail").enable(false)
            MojControls.CheckBox.setValueById("ContactInformationsModel_Email_IsContactEmail", false);
        }
    });
});