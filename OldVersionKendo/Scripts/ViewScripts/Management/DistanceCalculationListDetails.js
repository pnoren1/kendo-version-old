CheckDistanceCalculationIsExistOnSuccess = function (data)
{
    if (data != "")
    {
        if (data.Error.length > 0)
            Moj.showErrorMessage(Resources.Messages.DistanceCalculationIsExist, function () { });
    }
    else
    {
        Moj.HtmlHelpers._saveRowToGrid('grdDistancesCalculationList', 'DistancesCalculationListDetails', '', '', '', false, '', '', '', false);
        return false;
    }
}

