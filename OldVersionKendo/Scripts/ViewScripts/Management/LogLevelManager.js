MojFind("#btnSaveLogLevel").click(function () {
    var current = MojControls.Hidden.getValueById(CurrentLevelId);
    var selected = MojControls.AutoComplete.getValueById(LevelId);
    if (current != selected)
    {
        $.ajax({
            url: baseUrl + "/Management/SetLogLevel?level=" + selected,
            success: function () {
                Moj.showMessage(Resources.Messages.ChangeLogLevelSuccess, null, Resources.Messages.ChangeLogLevelTitle, "alert");
            }
        });
    }
});