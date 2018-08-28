$(document).ready(function () {
    MojFind("[name='ContactId']").change(function () {
        var advocateName = MojControls.AutoComplete.getTextById("#ContactId");
        MojFind("#ContactName").val(advocateName);
    });
});