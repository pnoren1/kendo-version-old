function EmploymentDetailsModel(fieldPrefix) {

    var self = this;

    self.getFieldPrefix = function () {
        if (fieldPrefix == '') return '';
        return fieldPrefix + "_";
    };

    self.enabledEmploymentDetailsData = function (value) {
        MojFind("#" + self.getFieldPrefix() + "AdvocateSelfEmploymentTypeId").enable(value);
        MojFind("#" + self.getFieldPrefix() + "NewBusinessEntity").enable(value);
        MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").enable(value);
        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").enable(value);
        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").enable(value);
        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").enable(value);
        MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").enable(value);
    };

    $(document).ready(function () {

        MojFind("#" + self.getFieldPrefix() + "NewBusinessEntity").click(function () {
            if (!MojControls.Common.isDisabledById(self.getFieldPrefix() + "NewBusinessEntity")) {
                var isChecked = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "NewBusinessEntity");
                $.post(baseUrl + '/PersonAdvocate/CheckChangeBusinessEntity', { advocateEmploymentId: MojFind("#" + self.getFieldPrefix() + "AdvocateEmploymentId").val(), employmentTypeId: MojFind("#" + self.getFieldPrefix() + "EmploymentTypeId").val(), businessEntityId: 0 }, function (data) {
                    if (data.Error != undefined && data.Error.length > 0) {
                        Moj.showErrorMessage(data.Error)
                        MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "BusinessEntityId", MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId"))
                        //data.PrevBusinessEntity
                        MojControls.CheckBox.setValueById(self.getFieldPrefix() + "NewBusinessEntity", false)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "ObjectStateEmploymentBusinessEntity", false)
                        return false;
                    }
                    else if (isChecked) {
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").enable(true);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").enable(true);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").enable(true);
                        MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").enable(true);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "DefaultMaxNumberOfEmployees").val());
                        MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val());
                        MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "BusinessEntityId");
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "PrevBusinessEntityId", null)

                    }
                    else {
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(0);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").enable(false);
                    }

                    MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", null);
                    MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val("");
                    MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val("");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", "");
                    MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", null);

                    MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees", false);
                    MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateDate", "");
                    MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUserHeb", "");
                    MojControls.Hidden.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUser", "");
                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").data("kendoGrid").dataSource.data([]);
                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").closest("[id=divAdvocatesSelfEmploymentList]").addClass('hide');
                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.data([]);
                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").closest("[id=divAdvocatesEmployeeList]").addClass('hide');
                });
            }

        });

        MojFind("#" + self.getFieldPrefix() + "CloseAdvocateEmployment").click(function () {
            if (!MojControls.Common.isDisabledById(self.getFieldPrefix() + "CloseAdvocateEmployment")) {
                var isChecked = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "CloseAdvocateEmployment");
                if (isChecked) {
                    // לבדוק פה אם יש שכירים פעילים במשרד אם הוא עצמאי אחרון במשרד
                    if (MojFind("#" + self.getFieldPrefix() + "EmploymentTypeId").val() == EmploymentType.SelfEmployment) {
                        if (MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").data("kendoGrid").dataSource.total() == 1 &&
                      MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.total() > 0) {
                            Moj.showErrorMessage(Resources.Messages.CantCloseEmploymentIfHasActiveEmployee)
                            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "CloseAdvocateEmployment", false)
                            self.enabledEmploymentDetailsData(true);
                            return;
                        }
                    }

                    if (MojFind("input[id*=AdvocateEmploymentId]").length == 1) {
                        Moj.showErrorMessage(Resources.Messages.CantCloseEmploymentIfIsLast)
                        MojControls.CheckBox.setValueById(self.getFieldPrefix() + "CloseAdvocateEmployment", false)
                        self.enabledEmploymentDetailsData(true);
                        return;
                    }
                    else {
                        var closeEmployment = MojFind("input[id*='CloseAdvocateEmployment']")
                        if (closeEmployment[0].checked == true && closeEmployment[1].checked) {
                            Moj.showErrorMessage(Resources.Messages.CantCloseEmploymentIfIsLast)
                            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "CloseAdvocateEmployment", false)
                            self.enabledEmploymentDetailsData(true);
                            return;
                        }
                    }

                    //לבדוק בסרבר את הענין אם החוזה הפתוח
                    $.post(baseUrl + '/PersonAdvocate/CheckCloseAdvocateEmployment', {
                        advocateEmploymentId: MojFind("#" + self.getFieldPrefix() + "AdvocateEmploymentId").val(),
                        advocateEmploymentInDistrictId: MojFind("#" + self.getFieldPrefix() + "AdvocateEmploymentInDistrictId").val(),
                        employmentTypeId: MojFind("#" + self.getFieldPrefix() + "EmploymentTypeId").val(),
                    }, function (data) {
                        if (data.Error != undefined && data.Error.length > 0) {
                            Moj.showErrorMessage(data.Error)
                            MojControls.CheckBox.setValueById(self.getFieldPrefix() + "CloseAdvocateEmployment", false)
                            self.enabledEmploymentDetailsData(true);
                            return;
                        }
                    });
                    self.enabledEmploymentDetailsData(false);
                }
                else {
                    self.enabledEmploymentDetailsData(true);
                }

            }
        });

        MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").unbind('change');
        MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").bind('change',function (e) {
            $.post(baseUrl + '/PersonAdvocate/CheckChangeBusinessEntity', { advocateEmploymentId: MojFind("#" + self.getFieldPrefix() + "AdvocateEmploymentId").val(), employmentTypeId: MojFind("#" + self.getFieldPrefix() + "EmploymentTypeId").val(), businessEntityId: MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").val() }, function (data) {
                if (data.Error != undefined && data.Error.length > 0) {
                    Moj.showErrorMessage(data.Error, function () {
                        if (MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId") != null) {
                            MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "BusinessEntityId", MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId"))
                            //data.PrevBusinessEntity
                            MojControls.Hidden.setValueById(self.getFieldPrefix() + "ObjectStateEmploymentBusinessEntity", false)
                        }
                        else
                            MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "BusinessEntityId");
                    });

                    //return false;
                }
                else {
                    if (MojFind("input[id*='_BusinessEntityId']").length == 2) {
                        if (MojFind("input[id*='_BusinessEntityId']").last().val() != "" && MojFind("input[id*='_BusinessEntityId']").last().val() == MojFind("input[id*='_BusinessEntityId']").first().val()) {
                            Moj.showErrorMessage(Resources.Messages.CantChooseSameBussinessEntity, function () {
                                // if (data.PrevBusinessEntity != undefined) {
                                if (MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId") != null) {
                                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "BusinessEntityId", MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId"))
                                    //data.PrevBusinessEntity
                                    MojControls.Hidden.setValueById(self.getFieldPrefix() + "ObjectStateEmploymentBusinessEntity", false)
                                }
                                else
                                    MojControls.AutoComplete.clearSelectionById(self.getFieldPrefix() + "BusinessEntityId");
                                //return false;

                            });
                        }
                    }
                    MojControls.CheckBox.setValueById(self.getFieldPrefix() + "NewBusinessEntity", false)
                    if (MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").val() != "" && MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").val() != 0) {
                        $.post(baseUrl + '/PersonAdvocate/GetBusinessEntityMerkavaDetails', { businessEntityId: MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").val(), employmentTypeId: MojFind("#" + self.getFieldPrefix() + "EmploymentTypeId").val() }, function (data) {
                            if (data.Error != undefined) {
                                Moj.showErrorMessage(data.Error, function () {
                                    MojControls.AutoComplete.setValueById(self.getFieldPrefix() + "BusinessEntityId", MojControls.Hidden.getValueById(self.getFieldPrefix() + "PrevBusinessEntityId"))

                                });
                            }
                            else if (data.MerkavaDetails != undefined) {
                                MojControls.Hidden.setValueById(self.getFieldPrefix() + "PrevBusinessEntityId", MojFind("#" + self.getFieldPrefix() + "BusinessEntityId").val())

                                MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").enable(true);
                                MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").enable(true);
                                MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").enable(true);
                                MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").enable(true);
                                //  if (data.MerkavaDetails.MerkavaDetails != undefined) {
                                MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", data.MerkavaDetails.MerkavaDetails.MerkavaId);
                                MojControls.TextBox.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber", data.MerkavaDetails.MerkavaDetails.BusinessNumber, false)
                                MojControls.TextBox.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber", data.MerkavaDetails.MerkavaDetails.MerkavaNumber, false)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", data.MerkavaDetails.MerkavaDetails.MerkavaName == null ? "" : data.MerkavaDetails.MerkavaDetails.MerkavaName)
                                MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", data.MerkavaDetails.MerkavaDetails.MerkavaStatusId)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", data.MerkavaDetails.MerkavaDetails.MerkavaStatusName)
                                //}

                                MojControls.TextBox.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployees", data.BusinessEntityDetails.MaxNumberOfEmployees, false)
                                MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val());
                                MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees", data.BusinessEntityDetails.IsOverDefaultNumberOfEmployees)
                                MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateDate", Moj.HtmlHelpers._parseDate(data.BusinessEntityDetails.MaxNumberOfEmployeesUpdateDate))

                                MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUserHeb", data.BusinessEntityDetails.MaxNumberOfEmployeesUpdateUser)
                                MojControls.Hidden.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUser", "");
                                MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").data("kendoGrid").dataSource.data(data.MerkavaDetails.AdvocatesSelfEmployment);
                                MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.data(data.MerkavaDetails.AdvocatesEmployee);
                                if (data.MerkavaDetails.AdvocatesEmployee.length > 0)
                                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").closest("[id=divAdvocatesEmployeeList]").removeClass('hide');
                                else
                                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").closest("[id=divAdvocatesEmployeeList]").addClass('hide');

                                if (data.MerkavaDetails.AdvocatesSelfEmployment.length > 0)
                                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").closest("[id=divAdvocatesSelfEmploymentList]").removeClass('hide');
                                else
                                    MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").closest("[id=divAdvocatesSelfEmploymentList]").addClass('hide');

                                MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").data("kendoGrid").refresh();
                                MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").refresh();
                            }
                        });
                    }
                    else {
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(0);
                        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").enable(false);
                        MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").enable(false);

                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", null);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val("");
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val("");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", "");
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", null);

                        MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees", false);
                        MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateDate", "");
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUser", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUserHeb", "");
                        MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").data("kendoGrid").dataSource.data([]);
                        MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesSelfEmploymentList']").closest("[id=divAdvocatesSelfEmploymentList]").addClass('hide');
                        MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.data([]);
                        MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").closest("[id=divAdvocatesEmployeeList]").addClass('hide');
                    }
                }
            });
        });

        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").change(function () {
            if ($(this).val() != "" && $(this).valid()) {
                if (MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber']").length == 2) {
                    if (MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber']")[0].value == MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber']")[1].value) {
                        Moj.showErrorMessage(Resources.Messages.BussinessNumberIsExist);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val("");
                        return false;
                    }
                }
                $.post(baseUrl + '/PersonAdvocate/GetMerkavaByMerkavaNumber', { id: MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val() }, function (data) {
                    if (data.Error != undefined || data.Message != undefined) {
                        if (data.Error != undefined) {
                            Moj.showErrorMessage(data.Error);
                            MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val("");
                        }

                        if (data.Message != undefined)
                            Moj.showMessage(data.Message, undefined, Resources.Strings.Message, MessageType.Alert);
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", null)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_IsNonProfitOrganization", null)
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val("");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", "");
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", "");
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", null);
                    }
                    else if (data.MerkavaDetails != undefined) {
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", data.MerkavaDetails.MerkavaId)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_IsNonProfitOrganization", data.MerkavaDetails.IsNonProfitOrganization)
                        MojControls.TextBox.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber", data.MerkavaDetails.MerkavaNumber, false)
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", data.MerkavaDetails.MerkavaName == null ? "" : data.MerkavaDetails.MerkavaName)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", data.MerkavaDetails.MerkavaStatusId)
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", data.MerkavaDetails.MerkavaStatusName)
                    }

                });
            }
        });

        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").change(function () {
            if ($(this).val() != "" && $(this).valid()) {
                if (MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber']").length == 2) {
                    if (MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber']")[0].value == MojFind("[id*='BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber']")[1].value) {
                        Moj.showErrorMessage(Resources.Messages.MerkavaNumberIsExist);
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val("");
                        return false;
                    }
                }

                $.post(baseUrl + '/PersonAdvocate/GetMerkavaByMerkavaNumber', { merkavaNumber: MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val() }, function (data) {
                    if (data.Error != undefined) {
                        Moj.showErrorMessage(data.Error)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", 0)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_IsNonProfitOrganization", null)
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber").val("")
                        MojFind("#" + self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaNumber").val("")
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", "")
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", "")
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", 0)
                    }
                    else if (data.MerkavaDetails != undefined) {
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaId", data.MerkavaDetails.MerkavaId)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_IsNonProfitOrganization", data.MerkavaDetails.IsNonProfitOrganization)
                        MojControls.TextBox.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_BusinessNumber", data.MerkavaDetails.BusinessNumber, false)
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaName", data.MerkavaDetails.MerkavaName == null ? "" : data.MerkavaDetails.MerkavaName)
                        MojControls.Hidden.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusId", data.MerkavaDetails.MerkavaStatusId)
                        MojControls.Label.setValueById(self.getFieldPrefix() + "BusinessEntityMerkavaDetails_MerkavaDetails_MerkavaStatusName", data.MerkavaDetails.MerkavaStatusName)
                    }
                });
            }
        });

        MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").change(function () {
            if (parseInt(MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val()) < parseInt(MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val())) {
                if (MojControls.CheckBox.getValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees") == false) {
                    Moj.showErrorMessage(Resources.Messages.MaxNumberOfEmployeesIs + " - " + MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val())
                    MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val())
                }
                else {
                    Moj.safeGet("/PersonAdvocate/CheckIfPublicDefender", undefined, function (data) {
                        if (data.IsPublicDefender != undefined && data.IsPublicDefender == false) {
                            Moj.showErrorMessage(Resources.Messages.OnlyDistrictAttorneyCanAddOverMaxNumberOfEmployees);
                            MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val())
                        }
                    });
                }
            }

            else if (MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.total() > parseInt(MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val())) {
                Moj.showErrorMessage(Resources.Messages.CantLessenCountOfEmployee);
                MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val())

            }
        });

        MojFind("#" + self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees").click(function () {
            if (!MojControls.Common.isDisabledById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees")) {
                var isChecked = MojControls.CheckBox.getValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees");
                Moj.safeGet("/PersonAdvocate/CheckIfPublicDefender", undefined, function (data) {
                    if (data.IsPublicDefender != undefined && data.IsPublicDefender == false) {
                        Moj.showErrorMessage(Resources.Messages.OnlyDistrictAttorneyCanApproveMoreEmployee);
                        MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees", !isChecked)
                        return false
                    }
                    else {
                        if (!isChecked) {
                            if (MojFind("[id^='" + self.getFieldPrefix() + "grdAdvocatesEmployeeList']").data("kendoGrid").dataSource.total() > parseInt(MojFind("#" + self.getFieldPrefix() + "DefaultMaxNumberOfEmployees").val())) {
                                Moj.showErrorMessage(Resources.Messages.CantUndoTheApproval);
                                MojControls.CheckBox.setValueById(self.getFieldPrefix() + "IsOverDefaultNumberOfEmployees", !isChecked)
                                return false
                            }
                            MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "DefaultMaxNumberOfEmployees").val());
                            MojFind("#" + self.getFieldPrefix() + "PrevMaxNumberOfEmployees").val(MojFind("#" + self.getFieldPrefix() + "MaxNumberOfEmployees").val());
                            MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateDate", "");
                            MojControls.Label.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUserHeb", "");
                            MojControls.Hidden.setValueById(self.getFieldPrefix() + "MaxNumberOfEmployeesUpdateUser", "");
                        }

                    }

                });
            }
        });


    });

}