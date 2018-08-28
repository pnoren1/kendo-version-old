function TravelingToVisitOrToCallElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    self.resetDistanceFields = function () {
        MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(null);
        MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "");
    },

    self.updateActivityTotalTime = function(hours, minutes, isReset)
    {
        
        if (!Moj.isTrue(isReset))
        {
            var totalTime = hours + ":" +minutes + ":00"
            MojFind("#" +self.getFieldPrefix() + "ActivityTotalTime").val(totalTime);
        }
        else
            MojFind("#" +self.getFieldPrefix() + "ActivityTotalTime").val("");
        
    },

    self.getNewTotalSumAndRateValue = function () {
        //var feeRateTypeId = MojFind("#" + self.getFieldPrefix() + "FeeRateTypeId").val();
        //var totalTime = MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").val() + ":" + MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").val();
        
        var hours = MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").val();
        var minutes = MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").val();
        var rateValue = MojFind("#" + self.getFieldPrefix() + "RateValue").val();
        var result = (parseInt(hours) + parseInt(minutes) / 60) * parseFloat(rateValue)
        
        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", parseFloat(Math.round(result * 100) / 100).toFixed(2));
        //Moj.safePost("/FeeRequest/GetNewTotalSumAndRateValue", { feeRateTypeId: feeRateTypeId, totalTime: totalTime }, function (data) {
        //    
        //    if (data.NewTotalSum != undefined)
        //        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", data.NewTotalSum);
        //    if (data.NewRateValue != undefined)
        //        MojControls.Label.setValueById(self.getFieldPrefix() + "RateValue", data.NewRateValue);
        //    if (data.NewRateDate != undefined)
        //        MojControls.Label.setValueById(self.getFieldPrefix() + "RateDate", data.NewRateDate);
        //});
    },

    self.invalidTravelingTimeValue = function (element, message) {
        Moj.showMessage(message, undefined, Resources.Strings.Error, MessageType.Error);
        element.value = "";
        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
        self.updateActivityTotalTime(null, null, true);
    },

        self.checkDistanceResponse = function (distance, contactNameNoCityId, placeTypeNameNoCityId, elementToCheckId) {
            
            var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
            var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();
            
            switch (distance) {
                case FeeRequestDistanceResponseEnum.IdenticalPlaces:
                {
                    MojFind("#" +self.getFieldPrefix() + "ActivityTotalDistance").val(0);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", 0);
                    //Moj.showMessage(Resources.Messages.ErrZeroKmDistance, undefined, Resources.Strings.Error, MessageType.Error);
                    //MojControls.AutoComplete.setValueById(elementToCheckId, null);
                    //self.resetDistanceFields();
                    break;
                }
                case FeeRequestDistanceResponseEnum.NoCity:
                {
                    Moj.showMessage(String.format(Resources.Messages.ErrNoCity, placeTypeNameNoCityId, contactNameNoCityId), undefined, Resources.Strings.Message, MessageType.Alert);
                    //MojControls.AutoComplete.setValueById(elementToCheckId, null);
                    self.resetDistanceFields();
                    break;
                }
                default:
                    {
                        var travelDirection = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
                        switch (travelDirection) {
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
                    }
                }
        },

    self.getDistanceFromCache = function (element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName) {
        Moj.safePost("/FeeRequest/GetDistance", { departureCityId: departureCityId, departureContactId: departureContactId, destinationCityId: destinationCityId, destinationContactId: destinationContactId }, function (data) {
            
            if (data.Distance == null) {
                Moj.showMessage(String.format(Resources.Messages.ErrNullDistanceValue, departureName, destinationName), undefined, Resources.Strings.Message, MessageType.Alert);
                self.resetDistanceFields();
            }
            else if (data.Distance == FeeRequestDistanceResponseEnum.IdenticalPlaces || data.Distance == FeeRequestDistanceResponseEnum.NoCity) {
                self.checkDistanceResponse(data.Distance, data.ContactNameNoCityId, data.PlaceTypeNameNoCityId, element.id);
            }
            else
                self.checkDistanceResponse(data.Distance, null, null, null);

            //else if (data.Distance == 0) {
            //    MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(0);
            //    MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", 0);
            //}
            //else
            //    self.checkDistanceResponse(data.Distance);
        });
    },

    self.handleDeparturePlace = function (element, isOtherPlace) {
        
        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();
        var destinationCityId = "";
        var destinationContactId = "";
        var departureCityId = "";
        var departureContactId = "";
        var destinationName = "";
        var departureName = MojControls.AutoComplete.getTextById(element.id);

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
                        

        if (destinationCityId != "" || destinationContactId != "") {
            if (destinationCityId == element.value || destinationContactId == element.value)
            {
                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(0);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", 0);
            }
                //self.checkDistanceResponse(0);
            else
            {
                if (Moj.isTrue(isOtherPlace))
                    departureCityId = element.value;
                else
                    departureContactId = element.value;

                self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);
            }
    
        }
        else {
            self.resetDistanceFields();
        }

    },

    self.handleDestinationPlace = function (element, isOtherPlace) {
        
        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();
        var departureCityId = "";
        var departureContactId = "";
        var destinationCityId = "";
        var destinationContactId = "";

        var departureName = "";
        var destinationName = MojControls.AutoComplete.getTextById(element.id);
        if (MojFind("#" + departurePlaceFieldPrefix + "CityId").val() != "")
        {
            departureCityId = MojFind("#" + departurePlaceFieldPrefix + "CityId").val();
            departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "CityId");
        }
        else if (MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val() != "")
        {
            departureContactId = MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val();
            departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "PlaceId");
        }

        if (departureCityId != "" || departureContactId != "") {
            if (departureCityId == element.value || departureContactId == element.value)
            {
                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(0);
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", 0);
            }
            else
            {
                  
                if (Moj.isTrue(isOtherPlace))
                    destinationCityId = element.value;
                else
                    destinationContactId = element.value;
             
                self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);
            }
                
        }
        else {
            self.resetDistanceFields();
        }
    },

    self.getDistances = function (activityPlaceElementName, element, isOtherPlace) {
        
        var travelDirection = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
        if (element.value == "" || travelDirection == "") {
            self.resetDistanceFields();
        }
        else {
            

            switch (activityPlaceElementName) {
                case "DeparturePlace":
                    {
                        self.handleDeparturePlace(element, isOtherPlace);
                        break;
                    }

                case "DestinationPlace":
                    {
                        self.handleDestinationPlace(element, isOtherPlace);
                        break;
                    }
            }
        }
    },

    self.addMaskToTimesFields = function () {
        MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").mask('99');
        MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").mask('99');
    },


    $(document).ready(function () {

        
        PDO.checkFeeRequestTotalSumLabel(self.getFieldPrefix());

        var departurePlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

        MojFind("#" + departurePlaceFieldPrefix + "CityId").change(function () {
            if (MojFind("#" + departurePlaceFieldPrefix + "CityId").valid())
                self.getDistances("DeparturePlace", this, true);
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

        MojFind("[id*='" + departurePlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change(function () {
            self.resetDistanceFields();
        });

        MojFind("[id*='" + destinationPlaceFieldPrefix + "ManagedPlaceOrOtherPlace']").change(function () {
            self.resetDistanceFields();
        });

        MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").change(function () {
            var travelDirectionId = MojFind("#" + self.getFieldPrefix() + "FeeActivityTravelDirectionId").val();
            var activityTotalDistanceInString = MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistanceInString").val();
            if (travelDirectionId != "") {
                if (activityTotalDistanceInString != "") {
                    switch (travelDirectionId) {
                        case FeeActivityTravelDirectionsEnum.TwoWay.toString():
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(activityTotalDistanceInString * 2);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", activityTotalDistanceInString * 2);
                                break;
                            }

                        case FeeActivityTravelDirectionsEnum.OneWay.toString():
                            {
                                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val(activityTotalDistanceInString / 2);
                                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", activityTotalDistanceInString / 2);
                                break;
                            }
                    }
                }
                else {
                        
                        var destinationCityId = "";
                        var destinationContactId = "";
                        var departureCityId = "";
                        var departureContactId = "";
                        var destinationName = "";
                        var departureName = "";
                        var element = "";
                        var departurePlaceFieldPrefix = MojFind("#" +self.getFieldPrefix() + "DeparturePlaceFieldPrefix").val();
                        var destinationPlaceFieldPrefix = MojFind("#" + self.getFieldPrefix() + "DestinationPlaceFieldPrefix").val();

                        if (MojFind("#" +destinationPlaceFieldPrefix + "CityId").val() != "") // find destination
                        {
                            destinationCityId = MojFind("#" +destinationPlaceFieldPrefix + "CityId").val();
                            destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "CityId");
                            element = MojFind("#" +destinationPlaceFieldPrefix + "CityId")[0];
                            }
                        else if(MojFind("#" +destinationPlaceFieldPrefix + "PlaceId").val() != "") {
                            destinationContactId = MojFind("#" +destinationPlaceFieldPrefix + "PlaceId").val();
                            destinationName = MojControls.AutoComplete.getTextById(destinationPlaceFieldPrefix + "PlaceId");
                            element = MojFind("#" + destinationPlaceFieldPrefix + "PlaceId")[0];
                        }

                        if (MojFind("#" +departurePlaceFieldPrefix + "CityId").val() != "") // find departure
                        {
                            departureCityId = MojFind("#" +departurePlaceFieldPrefix + "CityId").val();
                            departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "CityId");
                            }
                        else if (MojFind("#" +departurePlaceFieldPrefix + "PlaceId").val() != "")
                                {
                                    departureContactId = MojFind("#" + departurePlaceFieldPrefix + "PlaceId").val();
                                    departureName = MojControls.AutoComplete.getTextById(departurePlaceFieldPrefix + "PlaceId");
                                }

                        if ((destinationCityId != "" || destinationContactId != "") && (departureCityId != "" || departureContactId != ""))
                                    self.getDistanceFromCache(element, departureCityId, departureContactId, destinationCityId, destinationContactId, departureName, destinationName);


                           }
            }
            else {
                MojFind("#" + self.getFieldPrefix() + "ActivityTotalDistance").val("");
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "");
            }
        });

        MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").change(function () {
            
            if (this.value != "")
            {
                if ((this.value) < 24) {

                    var totalTimeMinutes = MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").val();
                    if (totalTimeMinutes != "")
                    {
                        var hours = MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").val();
                        var minutes = MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").val();

                        self.getNewTotalSumAndRateValue();
                        self.updateActivityTotalTime(hours, minutes, false);
                    }
                    else
                    {
                        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                        self.updateActivityTotalTime(null, null, true);
                    }
                }
                else
                    self.invalidTravelingTimeValue(this, Resources.Messages.ErrInvalidHoursTravelingTime);
            }
            else
            {
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                self.updateActivityTotalTime(null, null, true);
            }
                

        });

        MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").change(function () {
            if (this.value != "") {
                if ((this.value) < 60) {
                    var totalTimeHours = MojFind("#" + self.getFieldPrefix() + "TotalTimeHours").val();
                    if (totalTimeHours != "")
                    {
                        var hours = MojFind("#" +self.getFieldPrefix() + "TotalTimeHours").val();
                        var minutes = MojFind("#" + self.getFieldPrefix() + "TotalTimeMinutes").val();

                        self.getNewTotalSumAndRateValue();
                        self.updateActivityTotalTime(hours, minutes, false);
                    }
                    else
                    {
                        MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                        self.updateActivityTotalTime(null, null, true);
                    }
                }
                else
                    self.invalidTravelingTimeValue(this, Resources.Messages.ErrInvalidMinutesTravelingTime);
            }
            else
            {
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                self.updateActivityTotalTime(null, null, true);
            }

        });

        MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
            
            var isRequired = MojControls.Hidden.getValueById(self.getFieldPrefix() + "IsRequiredPart");

            if (!Moj.isTrue(isRequired)) {
                MojFind("[id^='" + self.getFieldPrefix() + "'].travelingToVisitOrToCallEnable").enable(false);
                MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", null)
                MojControls.Label.setValueById(self.getFieldPrefix() + "ActivityTotalDistanceInString", "")
                //MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityIndicationId", "")
                //MojFind("#" + self.getFieldPrefix() + "FeeActivityIndicationId").change();
                MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "FeeActivityTravelDirectionId", MojFind("#" + self.getFieldPrefix() + "DefualtFeeActivityTravelDirectionId").val()); // כיוון נסיעה
                MojControls.TextBox.setValueById(self.getFieldPrefix() + "TotalTimeMinutes", "")
                MojControls.TextBox.setValueById(self.getFieldPrefix() + "TotalTimeHours", "")
                MojControls.Label.setValueById(self.getFieldPrefix() + "TotalSum", "");
                self.updateActivityTotalTime(null, null, true);

            }
            else
            {
                MojFind("[id^='" + self.getFieldPrefix() + "'].travelingToVisitOrToCallEnable").enable(true);
                self.addMaskToTimesFields();
            }
        });

        MojFind("#" + self.getFieldPrefix() + "ActivityDate").change(function () {

            if (MojFind("#GeneralDetails_LineActivityClassificationId").val() == FeeActivityTypeClassification.Base) {
                if (MojFind("#" + self.getFieldPrefix() + "ActivityDate").val() != "" && Moj.isTrue(MojFind("#" + self.getFieldPrefix() + "ActivityDate").valid())) {
                    if (self.getFieldPrefix() == "ExaminationDetails_Elements_TravelingToVisitOrToCallElement_") // פאנל פרטי בדיקה
                    {
                        MojFind("#DateForCallProcesses").val(MojFind("#" + self.getFieldPrefix() + "ActivityDate").val());
                        MojFind("#btnCallProcesses").enable(true);
                    }
                    else if (self.getFieldPrefix() == "ApprovalDetails_Elements_TravelingToVisitOrToCallElement_") {
                        MojFind("#DateForCallProcesses").val(MojFind("#" + self.getFieldPrefix() + "ActivityDate").val());
                        MojFind("#btnCallProcesses").enable(true);
                    }

                }
                else {
                    if (self.getFieldPrefix() == "ExaminationDetails_Elements_TravelingToVisitOrToCallElement_") // פאנל פרטי בדיקה
                    {
                        MojFind("#DateForCallProcesses").val("");
                        MojFind("#btnCallProcesses").enable(false);
                        MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", null);
                    }

                    else if (self.getFieldPrefix() == "ApprovalDetails_Elements_TravelingToVisitOrToCallElement_") {
                        MojFind("#DateForCallProcesses").val("");
                        MojFind("#btnCallProcesses").enable(false);
                        MojControls.DateTimePicker.setValueById(self.getFieldPrefix() + "ActivityDate", null);
                    }
                }
            }

        });


    });

}
