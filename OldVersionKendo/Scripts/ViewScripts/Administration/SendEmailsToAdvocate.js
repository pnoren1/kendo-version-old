MojFind(document).ready(function() {

    MojFind("#AdvocateStatusId").on('change', function () {
        var statusName = MojControls.AutoComplete.getTextById("#AdvocateStatusId");
        MojFind("#AdvocateStatusSelected").val(statusName);
    });

    MojFind("#EmploymentTypeId").on('change', function () {
        var employmentName = MojControls.AutoComplete.getTextById("#EmploymentTypeId");
        MojFind("#EmploymentTypeSelected").val(employmentName);
    });

    MojFind("#DistributionGroupId").on('change', function () {
        var distributionName = MojControls.AutoComplete.getTextById("#DistributionGroupId");
        MojFind("#DistributionSelected").val(distributionName);
    });
});


MojFind("#btnSelectGroups").live('click', function () {

    MojFind("#btnSelectGroups").visible(false);
    MojFind("#btnManualSelect").visible(true);
    
    
    MojFind("#manualSelect").visible(false);
    MojFind("#selectGroups").visible(true);

    MojFind("#SelectAdvocatesManually").hide();
    MojFind("#SelectAdvocatesGroups").show();

    MojFind("#SourceIndicator").val("Groups");
});

MojFind("#btnManualSelect").live('click', function () {
    
    MojFind("#btnManualSelect").visible(false);
    MojFind("#btnSelectGroups").visible(true);

    MojFind("#selectGroups").visible(false);
    MojFind("#manualSelect").visible(true);
    
    MojFind("#SelectAdvocatesGroups").hide();
    MojFind("#SelectAdvocatesManually").show();
    
    MojFind("#SourceIndicator").val("Manual");
});

