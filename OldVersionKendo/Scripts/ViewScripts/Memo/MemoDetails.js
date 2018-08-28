function successSaveMemo(data) {
    //var errors = "";
    
    var gridName = "grdMemoList";
    if (data.length > 0)
        errors = data;
    else if (data.Errors != undefined)
        errors = data.Errors;
    if (errors.indexOf("ErrorHandle") == -1) {
        if (Moj.showErrorMessage(errors) == true) {
            MojFind('#DetailsContent').empty();
            var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
            grid.dataSource.read(Moj.getGridData());
            grid.refresh();
            Moj.replaceDivs('#DetailsContent', '#ListContent');
            return true;
        }
    }
    return false;
}

function onMemoDetailsLoad() {
    
    if (Moj.isEmpty(MojFind("#SearchCriteria_EntityController").val()))
        return;

    var data = MojFind("[id^='grdMemoEntitiesList']").data("kendoGrid").dataSource.data();
    $.ajax({
        type: 'POST',
        async: false,
        url: baseUrl + '/' + MojFind("#SearchCriteria_EntityController").val() + '/FillMemoEntityList',
        data: JSON.stringify({ MemoEntityTypeList: data }),
        success: function (res) {
            if (res != undefined) {
                for (var i = 0; i < data.length; i++) {
                    data[i].MemoEntityValue = res[i].MemoEntityValue;
                }
                MojFind("[id^='grdMemoEntitiesList']").data("kendoGrid").refresh();
            }
        },
        contentType: "application/json; charset=utf-8",
    });

}

$(document).ready(function () {

    onMemoDetailsLoad();

    MojFind("[id^='ManagedRecipient']").unbind('click');
    MojFind("[id^='ManagedRecipient']").bind('click', function (e) {
        
        var isUser = MojControls.RadioButton.getValue(this);
        if (Moj.isTrue(isUser)) {
            MojFind("#MemoRecipientId").enable(true);
            MojFind("#RoleId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#RoleId"));
        }
        else {
            MojFind("#RoleId").enable(true);
            MojFind("#MemoRecipientId").enable(false);
            MojControls.AutoComplete.clearSelection(MojFind("#MemoRecipientId"));
        }

    });

    MojFind("#MemoEntityId").die('change');
    MojFind("#MemoEntityId").live('change', function (e) {
        var grid = MojFind("[id^='grdMemoEntitiesList']").data("kendoGrid");
        var tr = $(this).closest("tr");
        //grid.select(tr);
        var entityTypeAllreadyExist = false;
        var memoEntityId = this.value;
        var entityTypeId = MojFind("[id='EntityTypeId']").val();
        grid.tbody.find('tr').each(function () {
            var dataItem = grid.dataItem(this);
            if (dataItem != undefined && !$(this).hasClass('k-state-selected')) {
                if (memoEntityId == dataItem.MemoEntityId && entityTypeId == dataItem.EntityTypeId && dataItem.State != window.Enums.ObjectState.Deleted) {
                    entityTypeAllreadyExist = true;
                }
            }
        });
        if (entityTypeAllreadyExist) {
            Moj.showErrorMessage(Resources.Messages.EntityTypeAllreadyExist);
            MojControls.AutoComplete.clearSelection(MojFind("#MemoEntityId"));
            //Moj.HtmlHelpers._saveRowToGrid('grdMemoEntitiesList', 'tr_grdMemoEntitiesList_Details', '', '', '', true, '', '', '', false);
        }
        else
            MojFind("#MemoEntityValue").val(MojControls.AutoComplete.getTextById("MemoEntityId"));
    });


    MojFind("#EntityTypeId").die('change');
    MojFind("#EntityTypeId").live('change', function (e) {
        
        if (isNaN(parseInt(this.value)) || this.value == 0) {
            MojControls.AutoComplete.setValueById("MemoEntityId", 0);
            MojFind("#MemoEntityId").enable(false);
            return;
        }
        else {
            //MojFind("#MemoEntityId").enable(true);
            var entityTypeId = this.value;
            MojControls.ComboBox.clearComboBox(MojFind("#MemoEntityId"), true);
            fillMemoEntityId(entityTypeId, "MemoEntityId");
        }
    });

   
});