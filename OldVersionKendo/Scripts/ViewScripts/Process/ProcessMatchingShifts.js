MojFind("[id='btncopy-shift']").die('click');
MojFind("[id='btncopy-shift']").live('click', function () {
    if ($(this).attr('disabled') != 'disabled') {
        var grid = MojControls.Grid.getKendoGridById("grdProcessMatchingShifts");
        var currentItem = grid.dataItem($(this).closest('tr'));
        copyAdvocateToGrid(currentItem.AdvocateContactId, currentItem.ShiftId, currentItem.EmploymentTypeId);
    }
});