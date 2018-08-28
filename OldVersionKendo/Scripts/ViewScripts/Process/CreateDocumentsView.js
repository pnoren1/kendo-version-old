

function CreateDocumentsView(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        return Moj.isEmpty(fieldPrefix) ? "" : fieldPrefix.replace('.', '_') + "_";
    };

    self.selfFind = function (id) {
        return MojFind("#" + self.getFieldPrefix() + id);
    };

    self.setDocumentTemplateTypesByLanguageId = function () {

        var languageId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "LanguageId");
        var processTypeId = self.selfFind("ProcessTypeId").val();//TODO set processtypeid
        var uiContext = self.selfFind("DocumentUIContextId").val();
        var isFeeProcess = self.selfFind("IsFeeProcess").val();
        Moj.safeGet("/Process/GetDocumentTemplateTypesByLanguageId?languageId=" + languageId + "&processTypeId=" + processTypeId + "&uiContext=" + uiContext + "&isFeeProcess=" + isFeeProcess, undefined, function (data) {
            if (MojFind("#CreateDocumentsModel_IsMultiSelect").val() == "True") {
                MojControls.MultiDropDown.clearAll(self.getFieldPrefix() + "SelectedTemplateTypeIds");
                MojControls.MultiDropDown.setDataSource(self.getFieldPrefix() + "SelectedTemplateTypeIds", data.DocumentTemplateTypes);
            }
            else {
                MojControls.ComboBox.clearComboBox(MojFind("#" + self.getFieldPrefix() + "SelectedTypeId"), true);
                MojControls.AutoComplete.setDataSource(self.getFieldPrefix() + "SelectedTypeId", data.DocumentTemplateTypes);

            }

        });
    };

    self.isAnyValueNominationLetter = function (element, index) {
        return element == 95;    /// מינוי - נספח פרטי פונה לסנגור

    };
    self.setNominationLetterText = function () {
        var selectedTypeIds = MojControls.MultiDropDown.getValuesById(self.getFieldPrefix() + "SelectedTemplateTypeIds");
        var isAnyNominationLettter = selectedTypeIds.some(self.isAnyValueNominationLetter);//האם קיים כתב מינוי לסנגור
        if (isAnyNominationLettter) {
            MojFind("#" + self.getFieldPrefix() + "NominationLetterText").visible(true);
        }
        else {
            MojFind("#" + self.getFieldPrefix() + "NominationLetterText").visible(false);
        }
    };

    self.setInnerTextBySelectedTypeId = function () {

        var selectedTypeId = MojControls.AutoComplete.getValueById(self.getFieldPrefix() + "SelectedTypeId");

        Moj.safeGet("/PersonAdvocate/GetInnerTextByType?typeId=" + selectedTypeId, undefined, function (data) {

            if (data.InInnerText) {
                MojFind("#" + self.getFieldPrefix() + "InnerText").val(data.InnerText);
                MojFind("#" + self.getFieldPrefix() + "InnerText").visible(true);
            } else {
                MojFind("#" + self.getFieldPrefix() + "InnerText").visible(false);
            }
        });
    };

    self.onCreateDocumentsViewReady = function () {

        MojFind("#" + self.getFieldPrefix() + "LanguageId").change(function () {
            self.setDocumentTemplateTypesByLanguageId();
        });


        //MojFind("#" + self.getFieldPrefix() + "SelectedTemplateTypeIds").change(function () {

        //    
        //    self.setInnerTextBySelectedTypeId();
        //});

        var isMultiSelect = MojFind("#" + self.getFieldPrefix() + "IsMultiSelect").val();
        if (Moj.isFalse(isMultiSelect)) {
            MojFind("#" + self.getFieldPrefix() + "SelectedTypeId").change(function () {
                self.setInnerTextBySelectedTypeId();
            });
        }
        else {

            MojFind("#" + self.getFieldPrefix() + "SelectedTemplateTypeIds").change(function () {
                self.setNominationLetterText();

            });
        }


    };


    $(document).ready(function () {
        self.onCreateDocumentsViewReady();

        //MojFind("#CreateDocumentsModel_NominationLetterText").kendoEditor({

        //    tools: [
        //        "bold",
        //        "italic",
        //        "underline",
        //        "strikethrough",
        //        "justifyLeft",
        //        "justifyCenter",
        //        "justifyRight",
        //        "justifyFull",
        //        "insertUnorderedList",
        //        "insertOrderedList",
        //        "indent",
        //        "outdent",
        //        "createLink",
        //        "unlink",
        //        "insertImage",
        //        "insertFile",
        //        "subscript",
        //        "superscript",
        //        "createTable",
        //        "addRowAbove",
        //        "addRowBelow",
        //        "addColumnLeft",
        //        "addColumnRight",
        //        "deleteRow",
        //        "deleteColumn",
        //        "viewHtml",
        //        "formatting",
        //        "cleanFormatting",
        //        "fontName",
        //        "fontSize",
        //        "foreColor",
        //        "backColor",
        //        "print"
        //    ]
        //});
    });

};




