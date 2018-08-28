function NewApplicantProcessClick() {

    NewProcessClick(MojFind("#EntityId").val());
}

function ApplicantProcesses(fieldPrefix) {
    var self = this;
    //self.getFieldPrefix = function () {
    //    return fieldPrefix + "_";
    //};

    $(document).ready(function () {

        MojFind("[id*='grdApplicantProcessesList']").find("#chbIsChecked").live('click', function () {
                       var grid = MojFind("[id*='grdApplicantProcessesList']").data("kendoGrid");
            var tr = $(this).closest("tr");
            grid.select(tr);
            if ($(this).attr("readonly") != undefined)
                return;
            if (this.checked) {
                grid.tbody.find('tr').each(function () {
                    var dataItem = grid.dataItem(this);
                    if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                        MojControls.CheckBox.setValue($(this).find("[id = chbIsChecked]"), false);
                    }
                });
            }

        });

    });
}