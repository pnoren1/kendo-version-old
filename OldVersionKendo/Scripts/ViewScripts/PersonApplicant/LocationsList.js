function LocationListModel(fieldPrefix) {

    var self = this;

    //self.getFieldPrefix = function () {
    //    if (fieldPrefix == '') return '';
    //    return fieldPrefix + "_";
    //};

    //self.selfFind = function (id) {
    //    return MojFind("#" + self.getFieldPrefix() + id);
    //};


    //MojFind("#div_grdLocationsList").find(".k-button").unbind("click").click(function (e) {
    //    if ($(this)[0].children[0].className == "moj-create-button") { // this is Add Button
    //        e.preventDefault();
    //        var isExistCurrentLocation = false;
    //        var grid = MojFind("[id^='grdLocationsList']").data("kendoGrid");
    //        grid.select().removeClass('k-state-selected');
    //        grid.tbody.find('tr').each(function () {
    //            var dataItem = grid.dataItem(this);
    //            if (dataItem != undefined && (dataItem.IsCurrentLocation == true || dataItem.IsCurrentLocation == "true")) {
    //                isExistCurrentLocation = true;
    //                return;
    //            }
    //        });
    //        if (isExistCurrentLocation) {
    //            Moj.confirm(Resources.Messages.ExistCurrentLocation, function () {
    //                Moj.HtmlHelpers._showGridAddDetails('grdLocationsList', '/PersonApplicant/LocationDetails', 'False', 'False');
    //                return true;
    //            }, function () {
    //                return false;
    //            });
    //        }
    //        else {
    //            Moj.HtmlHelpers._showGridAddDetails('grdLocationsList', '/PersonApplicant/LocationDetails', 'False', 'False');
    //            return true;
    //        }

    //    };
    //    return true;
    //});

    beforeSaveDetails = function () {
        var isCanSave = CheckDatesOverlap();
        if (isCanSave) {
            //if (MojControls.CheckBox.getValueById('locationForDisplayObject_IsCurrentLocation') == true) {
            //    var grid = MojFind("[id^='grdLocationsList']").data("kendoGrid");
            //    grid.tbody.find('tr').each(function () {
            //        var dataItem = grid.dataItem(this);
            //        if (!$(this).hasClass('k-state-selected')) {
            //            if (dataItem != undefined && (dataItem.IsCurrentLocation == true || dataItem.IsCurrentLocation == "true")) {// && (dataItem.ToDate == null || dataItem.ToDate == "")

            //                dataItem.IsCurrentLocation = false;
            //                dataItem.LeftLocation = true;
            //                dataItem.ValidToDateText = Resources.Strings.LeftLocation;
            //                if (dataItem.State == 0)
            //                    dataItem.State = window.Enums.ObjectState.Modified;
            //            }
            //        }

            //    });

            //}

            MojFind("#" + locationForDisplayObject_CityName).val(MojControls.AutoComplete.getTextById(locationForDisplayObject_City));
            MojFind("#" + locationForDisplayObject_StreetName).val(MojControls.AutoComplete.getTextById(locationForDisplayObject_Street));

            var city = MojControls.AutoComplete.getValueById(locationForDisplayObject_City)
            if (MojControls.Common.IsDigits(city)) {
                MojFind("#" + locationForDisplayObject_CityId).val(city);
            }
            else {
                MojFind("#" + locationForDisplayObject_CityId).val("");
            }
            var street = MojControls.AutoComplete.getValueById(locationForDisplayObject_Street);
            if (MojControls.Common.IsDigits(street)) {
                MojFind("#" + locationForDisplayObject_StreetId).val(street);
            }
            else {
                MojFind("#" + locationForDisplayObject_StreetId).val("");
            }
            preparePlaceDesc();
        }

        return isCanSave;

    };

    CheckDatesOverlap = function () {
        
        var newFromDate = MojFind("#locationForDisplayObject_FromDate").val();
        var newToDate = MojFind("#locationForDisplayObject_ToDate").val();
        if (newFromDate != "") {
            if (Moj.isFalse(typeof (newFromDate) == "object")) {
                newFromDate = newFromDate.split("/");
                newFromDate = new Date(newFromDate[2], newFromDate[1] - 1, newFromDate[0]);
            }
            newFromDate.setHours(0, 0, 0, 0);
        }


        if (newToDate != null && newToDate != "") {
            if (Moj.isFalse(typeof (newToDate) == "object")) {
                newToDate = newToDate.split("/");
                newToDate = new Date(newToDate[2], newToDate[1] - 1, newToDate[0]);
            }
            newToDate.setHours(0, 0, 0, 0);
        }
        else if (MojControls.CheckBox.getValueById("locationForDisplayObject_LeftLocation")) {
            newToDate = newFromDate;
        }

        var grid = MojFind("[id^='grdLocationsList']").data("kendoGrid");
        var IsOverlap = false;
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            var dataItemFromDate = dataItem.FromDate;
            if (dataItemFromDate != "") {
                if (Moj.isFalse(typeof (dataItemFromDate) == "object")) {
                    dataItemFromDate = dataItemFromDate.split("/");
                    dataItemFromDate = new Date(dataItemFromDate[2], dataItemFromDate[1] - 1, dataItemFromDate[0]);
                }
                dataItemFromDate.setHours(0, 0, 0, 0);
            }
            var dataItemToDate = dataItem.ToDate;
            if (dataItemToDate != null && dataItemToDate != "") {
                if (Moj.isFalse(typeof (dataItemToDate) == "object")) {
                    dataItemToDate = dataItemToDate.split("/");
                    dataItemToDate = new Date(dataItemToDate[2], dataItemToDate[1] - 1, dataItemToDate[0]);
                }
                dataItemToDate.setHours(0, 0, 0, 0);
            }
            else if (dataItem.LeftLocation == true || dataItem.LeftLocation == "true") {
                //|| MojControls.CheckBox.getValueById('locationForDisplayObject_IsCurrentLocation') == true
                dataItemToDate = dataItemFromDate;
            }

            if (!$(this).hasClass('k-state-selected') && dataItem.State != window.Enums.ObjectState.Deleted) {
                IsOverlap = IsOverlap | CheckDatesOverlapGeneric(dataItemFromDate, dataItemToDate, newFromDate, newToDate);
            }
        });

        if (IsOverlap == true || IsOverlap == 1) {
            isValid = false;
            Moj.showErrorMessage(Resources.Messages.DatesOverlap)
            //MessageText = Resources.Messages.DatesOverlap;
        }
        else {
            isValid = true;
        }


        return isValid;
    };

    CheckDatesOverlapGeneric = function (existingFromDate, existingToDate, newFromDate, newToDate) {
        if (newFromDate != "" && newToDate != "" && existingFromDate != "" && existingToDate != "") {
            if (newFromDate - existingFromDate >= 0 && newFromDate - existingToDate <= 0)
                return true;
            if (newToDate - existingFromDate >= 0 && newToDate - existingToDate <= 0)
                return true;
            if (newFromDate - existingFromDate <= 0 && newToDate - existingToDate >= 0)
                return true;
        }

        if (newFromDate != "" && (newToDate == "" || newToDate == null) && existingFromDate != "" && existingToDate != "") {
            if (newFromDate - existingToDate <= 0)
                return true;
        }

        if (newFromDate != "" && newToDate != "" && existingFromDate != "" && (existingToDate == "" || existingToDate == null)) {
            if (existingFromDate - newToDate <= 0)
                return true;
        }
        if ((existingToDate == "" || existingToDate == null) && (newToDate == "" || newToDate == null)) {
            return true;
        }

        return false;
    };


    preparePlaceDesc = function () {
        if (MojFind("#" + locationForDisplayObject_LocationTypeId).val() == LocationTypeEnum.PrivateHouse) {
            var address = "";
            if (MojFind("#" + locationForDisplayObject_StreetName).val() == "" && MojFind("#" + locationForDisplayObject_HouseNumber).val() == "")
                address = MojFind("#" + locationForDisplayObject_CityName).val();
            else
                address = MojFind("#" + locationForDisplayObject_StreetName).val() + " " + MojFind("#" + locationForDisplayObject_HouseNumber).val() + " , " + MojFind("#" + locationForDisplayObject_CityName).val();
            MojFind("#" + locationForDisplayObject_PlaceDesc).val(address);
        }
        else {

            MojFind("#" + locationForDisplayObject_PlaceDesc).val(MojControls.AutoComplete.getTextById(locationForDisplayObject_PlaceContactId));
        }
    };

    boldCurrentLocation = function () {

        var grid = MojFind("[id^='grdLocationsList']").data("kendoGrid");
        grid.tbody.find('>tr').each(function () {

            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && (dataItem.IsCurrentLocation == "true" || dataItem.IsCurrentLocation == true))
                $(this).addClass('moj-bold');
            else
                $(this).removeClass('moj-bold');

        });
    }






}