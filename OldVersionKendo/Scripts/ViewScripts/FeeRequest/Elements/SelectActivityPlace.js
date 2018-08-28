

function SelectActivityPlaceModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    self.setPlaceFieldsVisibility = function () {
        var placeTypeId = MojControls.RadioButton.getValueById(self.getFieldPrefix() + "ManagedPlaceOrOtherPlace");
        if (placeTypeId == FeeRequestPlaceType.ManagedPlace) {//סוג מקום מנוהל
            MojControls.TextBox.setValueById(self.getFieldPrefix() + "PlaceName", "", false)
            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "CityId")

            MojFind("#" + self.getFieldPrefix() + "PlaceTypeId").visible(true);
            MojFind("#" + self.getFieldPrefix() + "PlaceId").visible(true);
            MojFind("#" + self.getFieldPrefix() + "PlaceName").visible(false);
            MojFind("#" + self.getFieldPrefix() + "CityId").visible(false);
        }
        else if (placeTypeId == FeeRequestPlaceType.OtherPlace) { // סוג מקום אחר

            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "PlaceTypeId")
            MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "PlaceId"))
            MojFind("#" + self.getFieldPrefix() + "PlaceTypeId").visible(false);
            MojFind("#" + self.getFieldPrefix() + "PlaceId").visible(false);
            MojFind("#" + self.getFieldPrefix() + "PlaceName").visible(true);
            MojFind("#" + self.getFieldPrefix() + "CityId").visible(true);
        }
    },

     self.checkPlaceId = function () {
         if (MojFind("#" + self.getFieldPrefix() + "PlaceId").val() == "" && MojFind("#" + self.getFieldPrefix() + "PlaceTypeId").val() == "")
             MojFind("#" + self.getFieldPrefix() + "PlaceId").enable(false);

     }


    $(document).ready(function () {

        self.setPlaceFieldsVisibility();
        self.checkPlaceId();

        MojFind("[id*='" + self.getFieldPrefix() + "ManagedPlaceOrOtherPlace']").change(function () {
            self.setPlaceFieldsVisibility();
        });

        MojFind("#" + self.getFieldPrefix() + "PlaceTypeId").change(function () {
            var placeTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "PlaceTypeId");
            if (placeTypeId != "") {
                $.ajax({
                    type: "GET",
                    async: false,
                    url: baseUrl + "/FeeRequest/GetPlacesByPlaceType",
                    contentType: 'application/json',
                    data: { placeTypeId: placeTypeId },
                    dataType: "json",
                    success: function (data) {
                        MojFind("#" + self.getFieldPrefix() + "PlaceId").enable(true);
                        MojControls.AutoComplete.setDataSourceAndValue(self.getFieldPrefix() + "PlaceId", data.Places, -1);
                    },                    
                });
            }
            else {
                MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "PlaceId"))
            }

        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
            
            var isCheck = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart")

            if (isCheck == "false") {
                MojFind("[id^='SubmissionDetails_Elements'].placeDataEnable").enable(false);
                MojControls.RadioButton.setValueById(self.getFieldPrefix() + "ManagedPlaceOrOtherPlace", 1);
                MojFind("#" + self.getFieldPrefix() + "ManagedPlaceOrOtherPlace_1").change();
                if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "defaultPlaceTypeId") != "")
                {
                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "PlaceTypeId", MojControls.TextBox.getValueById(self.getFieldPrefix() + "defaultPlaceTypeId"));
                    MojFind("#" + self.getFieldPrefix() + "PlaceTypeId").change();
                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "PlaceId", MojControls.TextBox.getValueById(self.getFieldPrefix() + "defaultPlaceId"));
                    MojFind("#" + self.getFieldPrefix() + "PlaceId").enable(false);
                }                   
                else
                {
                    MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "PlaceTypeId");
                    MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "PlaceId"));
                }
                   
            }
            else {
                MojFind("[id^='SubmissionDetails_Elements'].placeDataEnable").enable(true);
                if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "defaultPlaceTypeId") != "")
                    MojFind("#" + self.getFieldPrefix() + "PlaceId").enable(true);
            }
                
        });

    });
}

