
onAddressesAndLocationsDetailsReady = function () {
 
    var isCopyAddress = MojFind("#PersonApplicantDetailsModel_PersonPopulationRegistration_IsCopyAddress").val();
    if (Moj.isTrue(isCopyAddress)) {
        PersonApplicantDetailsModel.copyAddressToGrid(false);
        MojFind("#PersonApplicantDetailsModel_PersonPopulationRegistration_IsCopyAddress").val(false);
    }
};