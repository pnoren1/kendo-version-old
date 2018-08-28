
$(document).ready(function () {
    
    var period = getHearingPeriod();
    //visibleHearingResult(period == HearingPeriod.Hearing);
    MojFind("#Hearing_HearingPeriods").val(period);

    MojFind("#Hearing_HearingDate").change(function () {
        var date = MojFind("#Hearing_HearingDate").val();
        MojFind("#Hearing_HearingDateString").val(date);
    });

    MojFind("#Hearing_PlaceTypeId").change(function () {
        if (MojFind("#Hearing_PlaceTypeId").val() != "") {
            $.ajax({
                url: baseUrl + '/FeeRequest/GetPlacesByPlaceType',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: '{ "placeTypeId": "' + MojFind("#Hearing_PlaceTypeId").val() + '" }',

                success: function (response) {
                    MojFind("#Hearing_CourtContactID").enable(true);
                    MojControls.AutoComplete.setDataSourceAndValue("Hearing_CourtContactID", response.Places, "");
                }
            })
        }
        else {
            MojControls.AutoComplete.setValueById("Hearing_CourtContactID", "");
            MojFind("#Hearing_CourtContactID").enable(false);

        }

    });
});
