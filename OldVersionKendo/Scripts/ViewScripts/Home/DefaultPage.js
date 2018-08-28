


$(document).ready(function () {
    var prevDistrict = MojFind("#CurrentDistrictId").val();

onSaveDefaultEntitySuccess = function () {
        if (prevDistrict != MojFind("#CurrentDistrictId").val()) {
            window.location.reload();
            return;
        }
    Moj.safeGet("/Home/GetEntityId", undefined, function (value) {      
        var dropDown = $("#layoutModuleTypes");
        MojControls.DropDown.setValue(dropDown, value);

    })
};
});