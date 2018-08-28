function TravelExpensesBaseElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    self.checkIfNewTravelExpenseRecord = function () { //מציין אם שורה חדשה או קיימת
        if(MojFind("#GeneralDetails_FeeRequestLineId").val() == "") 
            return true;
        return false; 
    },

    self.totalSumCheckClassification = function() 
    {
        
        if (MojFind("#GeneralDetails_LineActivityClassificationId").val() == FeeActivityTypeClassification.FullyOffsetBase.toString())
            MojFind("#" + self.getFieldPrefix() + "TotalSum").css("color", "#C00509");
    },

    self.resetDistanceFields = function ()
        {
            MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(null);
            MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "");

            if (MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "FeeActivityIndicationId") != "")
                {
                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityIndicationId", null);
                    MojFind("#" +self.getFieldPrefix() + "FeeActivityIndicationId").change();
                }
        },

    self.getNewTotalSumAndRateValue = function () {
            
            var feeActivityTotalDistance = MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val();
            var feeRateTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val();
            Moj.safePost("/FeeRequest/GetNewTotalSumAndRateValue", { feeRateTypeId: feeRateTypeId, activityTotalDistance: feeActivityTotalDistance }, function (data) {
                
                if (data.NewTotalSum != undefined)
                    MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.NewTotalSum);
                if (data.NewRateValue != undefined)
                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.NewRateValue);
                if (data.NewRateDate != undefined)
                    MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", data.NewRateDate);
            });
        },

    self.checkDistanceResponse = function (distance, contactNameNoCityId, placeTypeNameNoCityId, elementToCheckId)
    {
        
        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

        switch (distance) {
            case FeeRequestDistanceResponseEnum.IdenticalPlaces:
            {
                Moj.showMessage(Resources.Messages.ErrZeroKmDistance, undefined, Resources.Strings.Error, MessageType.Error);
                MojControls.AutoComplete.setValueById(elementToCheckId, null);
                self.resetDistanceFields();
                break;
            }
            case FeeRequestDistanceResponseEnum.NoCity:
            {
                Moj.showMessage(String.format(Resources.Messages.ErrNoCity, placeTypeNameNoCityId, contactNameNoCityId), undefined, Resources.Strings.Error, MessageType.Error);
                MojControls.AutoComplete.setValueById(elementToCheckId, null);
                self.resetDistanceFields();
                break;
            }
            default :
            {
                var travelDirection = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
                    switch (travelDirection)
                    {
                        case FeeActivityTravelDirectionsEnum.TwoWay.toString(): //דו כיווני
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(distance * 2);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", distance * 2);
                                break;
                            }
                        case FeeActivityTravelDirectionsEnum.OneWay.toString():
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(distance);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", distance);
                                break;
                            }
                }
                break;
            }   

        }
    },

    self.getDistanceFromCache = function (element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName) {

         $.ajax({
            type: 'POST',
            url: baseUrl + "/FeeRequest/GetDistance",
            data: JSON.stringify({
                    departureCityId: departureCityId, departureContactId: departureContactId, destinationCityId: destinationCityId, destinationContactId: destinationContactId 
            }),
            success: function (data) {
                     if (data.Distance == null) {
                        Moj.showMessage(String.format(Resources.Messages.ErrNullDistanceValue, departureName, destinationName), undefined, Resources.Strings.Error, MessageType.Error);
                        self.resetDistanceFields();
                        MojFind("#" + element.id).data("kendoComboBox").value("");
                     }
                     else if (data.Distance == FeeRequestDistanceResponseEnum.IdenticalPlaces || data.Distance == FeeRequestDistanceResponseEnum.NoCity) {
                         self.checkDistanceResponse(data.Distance, data.ContactNameNoCityId, data.PlaceTypeNameNoCityId, element.id);
                     }
                     else
                         self.checkDistanceResponse(data.Distance, null, null, null);
                    },
            contentType: "application/json; charset=utf-8",
            async: false,
        });
     },

    self.handleDeparturePlace = function (element, isOtherPlace, travelDirection, activityIndicationId) {

        var destinationCityId = "";
        var destinationContactId = "";
        var destinationName = "";
        var departureCityId = "";
        var departureContactId = "";
        var departureName = MojControls.AutoComplete.getTextById(element.id);
        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

        if (MojFind("#" + destinationPlaceFieldPrefix + "CityId").val() != "")
        {
            destinationCityId = MojFind("#" + destinationPlaceFieldPrefix + "CityId").val();
            destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "CityId");
        }
        else if (MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").val() != "")
        {
            destinationContactId = MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").val();
            destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "PlaceId");
        }

        if (destinationCityId != "" || destinationContactId != "")
         {
            if (destinationCityId == element.value || destinationContactId == element.value)
                self.checkDistanceResponse(0, null, null, element.id);
            else
            {
                if (Moj.isTrue(isOtherPlace))
                    departureCityId = element.value;
                    else
                    departureContactId = element.value;

               self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);

               if (travelDirection != "" && activityIndicationId != "")
                    MojFind("#" +self.getFieldPrefix() + "FeeActivityIndicationId").change();
            }

         }
         else
        {
            self.resetDistanceFields();
        }
    },

    self.handleDestinationPlace = function (element, isOtherPlace, travelDirection, activityIndicationId) {

        
        var departureCityId = "";
        var departureContactId = "";
        var destinationCityId = "";
        var destinationContactId = "";

        var departureName = "";
        var destinationName = MojControls.AutoComplete.getTextById(element.id);
        var departurePlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

        if (MojFind("#" +departurePlaceFieldPrefix + "CityId").val() != "") {
            departureCityId = MojFind("#" + departurePlaceFieldPrefix + "CityId").val();
            departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "CityId");
            }
        else if (MojFind("#" +departurePlaceFieldPrefix + "PlaceId").val() != "") {
            departureContactId = MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val();
            departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "PlaceId");
        }

        if (departureCityId != "" || departureContactId != "") {
            if (departureCityId == element.value || departureContactId == element.value)
                self.checkDistanceResponse(0, null, null, element.id);
            else
            {
                if (Moj.isTrue(isOtherPlace))
                    destinationCityId = element.value;
                else
                    destinationContactId = element.value;

                self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);


            if (travelDirection != "" && activityIndicationId != "")
                MojFind("#" +self.getFieldPrefix() + "FeeActivityIndicationId").change();
            }
        }

        else {
            self.resetDistanceFields();
        }
    },

    self.getDistances = function (activityPlaceElementName, element, isOtherPlace) {
        
        var travelDirection = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
        var activityIndicationId = MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").val();
        if (element.value == "" || travelDirection == "") {
                self.resetDistanceFields();
            }
            else {
                
                switch (activityPlaceElementName)
                {
                    case "DeparturePlace":
                        {
                            self.handleDeparturePlace(element, isOtherPlace, travelDirection, activityIndicationId);
                            break;
                        }

                    case "DestinationPlace":
                        {
                            self.handleDestinationPlace(element, isOtherPlace, travelDirection, activityIndicationId);
                            break;
                        }
                }
            }
        },

    $(document).ready(function () {

        //PDO.checkFeeRequestTotalSumLabel(self.getFieldPrefix());
        PDO.checkFeeRequestTotalSumTextBox(self.getFieldPrefix());

        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

        self.totalSumCheckClassification();

        MojFind("#" + departurePlaceFieldPrefix + "CityId").change(function () {
            if (MojFind("#" + departurePlaceFieldPrefix + "CityId").valid())
            {
                var cityId = MojFind("#" + departurePlaceFieldPrefix + "CityId").val();
                self.getDistances("DeparturePlace", this, true);
            }
        });

        MojFind("#" + departurePlaceFieldPrefix + "PlaceId").change(function () {
            if (MojFind("#" + departurePlaceFieldPrefix + "PlaceId").valid())
                self.getDistances("DeparturePlace", this, false);
        });

        MojFind("#" + destinationPlaceFieldPrefix + "CityId").change(function () {
            if (MojFind("#" + destinationPlaceFieldPrefix + "CityId").valid())
                self.getDistances("DestinationPlace", this, true);
        });

        MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").change(function () {
            if (MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").valid())
                self.getDistances("DestinationPlace", this, false);
        });

        MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").change(function () {

            var activityTypeId;
            //if (self.checkIfNewTravelExpenseRecord()) // אם שורה חדשה
           //     MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").val(FeeActivityType.TravelExpenses);

            //הוצאות נסיעה
            activityTypeId = MojFind("#" + self.getFieldPrefix() + "FeeActivityTypeId").val();

            var activityIndicationId = MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").val();

            $.ajax({
                type: 'POST',
                url: baseUrl + "/FeeRequest/GetFeeRateType",
                data: JSON.stringify({ feeActivityTypeId: activityTypeId, activityIndicationId: activityIndicationId }),
                success: function (data) {
                    
                    MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val(data.NewFeeRateType);
                },
                contentType: "application/json; charset=utf-8",
                async: false,
            });

            switch (activityIndicationId)
            {
                case "":
                    {
                        MojFind("#" + self.getFieldPrefix() + "TotalSum").val("");
                        MojFind("#" + self.getFieldPrefix() + "TotalSum").enable(false);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");

                        break;
                    }
                case FeeActivityIndicationEnum.AccordingToKM.toString():
                    {
                        
                        if (MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistanceInString").val() != "" && MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val() != "")
                        {
                            MojFind("#" +self.getFieldPrefix() + "TotalSum").enable(false);
                            self.getNewTotalSumAndRateValue();
                        }
                    else
                        {
                        MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityIndicationId" , null);
                        Moj.showMessage(Resources.Messages.ErrEmptyDistanceSelectionIndication, undefined, Resources.Strings.Error, MessageType.Error);

                    }
                        break;
                    }
                case FeeActivityIndicationEnum.InSpecialTaxi.toString():
                    {
                        MojFind("#" + self.getFieldPrefix() + "TotalSum").val("");
                        MojFind("#" + self.getFieldPrefix() + "TotalSum").enable(true);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", "");
                        break;
                    }

            }
        });



        MojFind("[id*='" + departurePlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change(function () {
            self.resetDistanceFields();
        });

        MojFind("[id*='" + destinationPlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change(function () {
            self.resetDistanceFields();
        });

        MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").change(function () {
            var travelDirectionId = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
            var activityTotalDistanceInString = MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistanceInString").val();
            if (travelDirectionId != "")
            {
                if (activityTotalDistanceInString != "")
                {
                    switch (travelDirectionId)
                    {
                        case FeeActivityTravelDirectionsEnum.TwoWay.toString():
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(activityTotalDistanceInString * 2);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", activityTotalDistanceInString * 2);
                                MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").change();
                                break;
                            }

                        case FeeActivityTravelDirectionsEnum.OneWay.toString():
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(activityTotalDistanceInString / 2);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", activityTotalDistanceInString / 2);
                                MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").change();
                                break;
                            }
                    }
                }
                else
                {
                    
                    var destinationCityId = "";
                    var destinationContactId = "";
                    var departureCityId = "";
                    var departureContactId = "";
                    var destinationName = "";
                    var departureName = "";
                    var element = "";
                    var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
                    var destinationPlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

                    if (MojFind("#" + destinationPlaceFieldPrefix + "CityId").val() != "") // find destination
                    {
                        destinationCityId = MojFind("#" + destinationPlaceFieldPrefix + "CityId").val();
                        destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "CityId");
                        element = MojFind("#" + destinationPlaceFieldPrefix + "CityId")[0];
                    }
                    else if (MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").val() != "")
                    {
                        destinationContactId = MojFind("#" + destinationPlaceFieldPrefix + "PlaceId").val();
                        destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "PlaceId");
                        element = MojFind("#" + destinationPlaceFieldPrefix + "PlaceId")[0];
                    }

                    if (MojFind("#" + departurePlaceFieldPrefix + "CityId").val() != "") // find departure
                    {
                        departureCityId = MojFind("#" + departurePlaceFieldPrefix + "CityId").val();
                        departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "CityId");
                    }
                    else if (MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val() != "")
                    {
                        departureContactId = MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val();
                        departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "PlaceId");
                    }

                    if ((destinationCityId != "" || destinationContactId != "") && (departureCityId != "" || departureContactId != ""))
                        self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);
                       

                }
            }
            else
            {
                //MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val("");
                //MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "");
                self.resetDistanceFields();
            }
        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
            var isRequired = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart");

            if (!Moj.isTrue(isRequired)) {
                MojFind("[id^='" + self.getFieldPrefix() + "'].travelExpensesBaseEnable").enable(false);
                MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", null)
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "")
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityIndicationId", "")
                MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").change();
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityTravelDirectionId", MojFind("#" + self.getFieldPrefix() + "DefualtFeeActivityTravelDirectionId").val()); // כיוון נסיעה
                
            }
            else
                MojFind("[id^='" + self.getFieldPrefix() + "'].travelExpensesBaseEnable").enable(true);
        });
        

    });

}
