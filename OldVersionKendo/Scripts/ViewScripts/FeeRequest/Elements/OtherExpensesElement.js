function OtherExpensesDataElementModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    },

    $(document).ready(function () {

          PDO.checkFeeRequestTotalSumTextBox(self.getFieldPrefix());

          //if (MojControls.TextBox.getValueById(self.getFieldPrefix() + "TotalSum") < 0) {
          //    MojFind("#" + self.getFieldPrefix() + "TotalSum").css("color", "#C00509");
          //    MojFind("#" + self.getFieldPrefix() + "TotalSum").css("text-align", "right");
          //    MojFind("#" + self.getFieldPrefix() + "TotalSum").css("direction", "ltr");
          //}

          MojFind("#" + self.getFieldPrefix() + "IsRequiredPart").change(function () {
              var isRequired = MojControls.Hidden.getValueById("SubmissionDetails_Elements_OtherExpensesElement_IsRequiredPart")

              if (isRequired == "false") {
                  MojFind("[id^='SubmissionDetails_Elements_OtherExpensesElement'].otherExpensesEnable").enable(false);

                  MojControls.CheckBox.setValueById("SubmissionDetails_Elements_OtherExpensesElement_IsReceiptAttached",false);
                  MojControls.AutoComplete.clearSelectionById("SubmissionDetails_Elements_OtherExpensesElement_FeeActivitySubtypeId");
                  MojControls.TextBox.setValueById("SubmissionDetails_Elements_OtherExpensesElement_TotalSum", "");
              }
              else
                  MojFind("[id^='SubmissionDetails_Elements_OtherExpensesElement'].otherExpensesEnable").enable(true);


          });
      });


};
