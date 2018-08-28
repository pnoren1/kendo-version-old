
$(document).ready(function () {
    MojFind("#" + SelectedPlaceTypeId).enable(true);
   
    var placeTypeId = MojControls.AutoComplete.getValueById(SelectedPlaceTypeId);
    if (placeTypeId != "" && placeTypeId != 0) {
      
        $.ajax({
            url: baseUrl + '/Management/GetPlaceList',
            type: 'POST',
            async: false,
            dataType: 'json',
            data: "placeTypeId=" + MojControls.AutoComplete.getValueById(SelectedPlaceTypeId),

            success: function (data) {
                var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
                var list = [];
                if (data != null)
                    list = data.Data;
                grid.dataSource.data(list);

            }
        });
    }
});

MojFind("#" + SelectedPlaceTypeId).change(function () {


    $.ajax({
        url: baseUrl + '/Management/GetPlaceList',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: "placeTypeId=" + MojControls.AutoComplete.getValueById(SelectedPlaceTypeId),
        
        success: function(data) {      
            var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
            var list = [];
            if (data != null)
                list = data.Data;
            grid.dataSource.data(list);

        }
    });
});

MojFind(".k-button").unbind("click").click(function (e) {
    if ($(this)[0].children[0].className == "moj-create-button") { // this is Add Button

        e.preventDefault();

        if (MojControls.AutoComplete.getValueById(SelectedPlaceTypeId) == 0) {
            Moj.showErrorMessage(Resources.Messages.SelectPlaceType, function () {
                return false;
            });
        }
        else {
            Moj.HtmlHelpers._showAddDetails('/Management/PlacesDetails');
            return true;
        }

       
    };
    return true;
});
