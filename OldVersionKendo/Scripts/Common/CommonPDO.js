//window.onerror = function (message, file, line, col, error) {
//    console.log(message, "from", error.stack);
//};
//window.addEventListener("error", function (e) {
//    console.log(e.error.message, "from", e.error.stack);
//});

$('input[type="text"]').live('keypress', function (e) {

    if (e.keyCode == 13) {
        e.preventDefault();
        return;
    }
});

MojFind("[id^='grd']").find(".view-history").die('click');
MojFind("[id^='grd']").find(".view-history").live('click', function (e) {
    if ($(this).attr("disabled") == "disabled")
        return;
    var grid = $(e.currentTarget).closest(".k-grid");
    var dataItem = grid.data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));
    if (Moj.isFalse(dataItem.HasHistory))
        return;
    var gridName = grid[0].id.substring(0, grid[0].id.indexOf('-'))
    var auditModel = JSON.parse(MojFind("#HistoryModel" + gridName).val());
    auditModel.Key = dataItem.ID;
    PDO.openHistoryView(auditModel, 900);
});

function onSelect(e) {

}

function onActivate(e) {
    var id = $(this)[0].element[0].id;
    var cssClass = $("#" + e.item.id + " .mark").length ? $("#" + e.item.id + " .mark").attr("class").split(" ")[0] : "";
    Moj.markTopMenu(cssClass);

    //Update selectedTabContent const to PopUpWizard
    if ($("#" + id + " div[class='k-content k-state-active']").find("#PopUpWizard").length > 0) {
        Moj.addConstant("selectedTabContent", "div#PopUpWizard.k-window-content.k-content");
        // תיקון לפתיחת פופאפ על פופאפ(משרה עזרא)
        Moj.addConstant("defaultSelectedTabContent", "div#PopUpWizard.k-window-content.k-content");
    }
    else {
        Moj.addConstant("selectedTabContent", $("#" + id + " div[class='k-content k-state-active']"));
        Moj.addConstant("defaultSelectedTabContent", $("#" + id + " div[class='k-content k-state-active']"));
    }

}


var entityTab = [];
entityTab[EntityContentTypeEnum.Applicant] = "PersonApplicant";
entityTab[EntityContentTypeEnum.Advocate] = "PersonAdvocate";
entityTab[EntityContentTypeEnum.Process] = "Process";
entityTab[EntityContentTypeEnum.Nomination] = "Nomination";
entityTab[EntityContentTypeEnum.FeeRequestHearing] = "FeeRequestHearing";
//var MaxSearchResult = $("#MaxSearchResult").val();

//$(function () {
//    $.ajax({
//        url: baseUrl + "/Home/GetDocumentumConfiguration",
//        type: "get",
//        success: function (data) {
//            //if (Moj.showErrorMessage(data.Faults) == true) {
//            if (data.DucumentumConfiguration != null) {
//                Doc.Initialize(data.DucumentumConfiguration.Repository, data.DucumentumConfiguration.DocumentType, data.DucumentumConfiguration.FolderPath, data.UserName);
//            }
//        },
//        error: function () {
//        }
//    });
//});


var PDO = {

    setModelOnPage: function (fieldPrefix, key, model) {

        if (fieldPrefix == "")
            window[key] = model;
        else
            window[fieldPrefix] = model;
    },

    onRowRequestLineActiveSelect: function (e) {
        var nameGrid = e.sender.element[0].id.substring(11, e.sender.element[0].id.indexOf('-'));
        if (this.select().length != 0) {
            var data = this.dataItem(this.select());
            var statusId = data.FeeRequestLineStatusId;
            var classificationId = data.FeeActivityTypeClassificationId;

            if (Moj.isTrue(MojFind("[id^=btnNewDeduction" + nameGrid + "]").attr('addPermission')) || Moj.isTrue(MojFind("[id^=btnNewPercentageAddition" + nameGrid + "]").attr('addPermission'))) {
                if (classificationId == FeeActivityTypeClassification.Base && statusId != FeeRequestLineStatus.OnHold) {
                    MojFind("[id^=btnNewDeduction" + nameGrid + "]").enable(true);
                    MojFind("[id^=btnNewPercentageAddition" + nameGrid + "]").enable(true);
                } else {
                    MojFind("[id^=btnNewDeduction" + nameGrid + "]").enable(false);
                    MojFind("[id^=btnNewPercentageAddition" + nameGrid + "]").enable(false);
                }
            }
        }
        else {
            MojFind("[id^=btnNewDeduction" + nameGrid + "]").enable(false);
            MojFind("[id^=btnNewPercentageAddition" + nameGrid + "]").enable(false);
        }







    },

    checkFeeRequestTotalSumLabel: function (fieldPrefix) {
        if (MojFind("#" + fieldPrefix + "TotalSum").val() < 0) {
            MojFind("#" + fieldPrefix + "TotalSum").prev('div').css("color", "#C00509")
            MojFind("#" + fieldPrefix + "TotalSum").closest('div').attr("style", "direction:ltr ; width:130px");
        }
    },

    checkFeeRequestTotalSumTextBox: function (fieldPrefix) {
        if (MojControls.TextBox.getValueById(fieldPrefix + "TotalSum") < 0) {
            MojFind("#" + fieldPrefix + "TotalSum").css("color", "#C00509");
            MojFind("#" + fieldPrefix + "TotalSum").css("text-align", "right");
            MojFind("#" + fieldPrefix + "TotalSum").css("direction", "ltr");
        }
    },


    deleteFeeRequestLine: function (e) {
        var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
        var deleteId = grid.dataItem($(e.currentTarget).closest("tr")).id;
        var url = e.currentTarget.href + "/" + deleteId;
        var entityContentTypeEnum = e.currentTarget.parentElement.getAttribute('entityContentTypeEnum');

        Moj.safeGet("/FeeRequest/CheckBeforeDeleteFeeRequestLine", { id: deleteId },
            function (data) {
                if (Moj.showErrorMessage(data.Errors)) {
                    Moj.confirm(Resources.Strings.ConfirmDelete,
                        function () {
                            $.post(url,
                                function (data) {

                                    if (data.ActionResult != undefined &&
                                        data.ActionResult.Errors != undefined &&
                                        data.ActionResult.Errors.length > 0) {
                                        Moj.showErrorMessage(data.Errors);
                                    } else if (data.IsChange) {
                                        PDO.onRefresh(entityContentTypeEnum);
                                    }
                                });
                        });
                }
            });
        return false;

    },

    onRowRequestLineHistorySelect: function (e) {
        var nameGrid = e.sender.element[0].id.substring(18, e.sender.element[0].id.indexOf('-'));
        if (this.select().length != 0) {
            var data = this.dataItem(this.select());
            var statusId = data.FeeRequestLineStatusId;
            var classificationId = data.FeeActivityTypeClassificationId;
            if (Moj.isTrue(MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").attr('addPermission')) ||
                Moj.isTrue(MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").attr('addPermission')) ||
                Moj.isTrue(MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").attr('addPermission'))) {
                if (statusId == FeeRequestLineStatus.FinalConfirmed ||
                    statusId == FeeRequestLineStatus.DelayedPayment ||
                    statusId == FeeRequestLineStatus.ConfirmedForShipment ||
                    statusId == FeeRequestLineStatus.SentToMerkava ||
                    statusId == FeeRequestLineStatus.FailedToMerkava) {
                    if (classificationId == FeeActivityTypeClassification.Base) {
                        MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(true);
                        MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(true);
                        MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(true);
                    } else if (classificationId == FeeActivityTypeClassification.PercentageAddition) {
                        MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(true);
                        MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(false);
                        MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(false);
                    } else {
                        MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(false);
                        MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(false);
                        MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(false);
                    }
                } else if (statusId == FeeRequestLineStatus.Confirmed || statusId == FeeRequestLineStatus.ConfirmedByCharge
                ) {
                    if (classificationId == FeeActivityTypeClassification.Base) {
                        MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(true);
                        MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(true);
                    } else {
                        MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(false);
                        MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(false);

                    }
                    MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(false);
                } else {
                    MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(false);
                    MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(false);
                    MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(false);
                }
            }

            if (data.FeeSubmissionId != null)
                MojFind("[id^=btnHistoryShowSubmission" + nameGrid + "]").enable(true);
            else
                MojFind("[id^=btnHistoryShowSubmission" + nameGrid + "]").enable(false);
        }
        else {
            MojFind("[id^=btnHistoryNewDeduction" + nameGrid + "]").enable(false);
            MojFind("[id^=btnHistoryNewPercentageAddition" + nameGrid + "]").enable(false);
            MojFind("[id^=btnHistoryNewFullDeduction" + nameGrid + "]").enable(false);
        }
    },

    openHistoryView: function (data, widthWindow, callBack) {

        Moj.website.openPopupWindow("ViewHistory", "", data.PanelTitle, widthWindow, 330, false, false, false, baseUrl + "/Audit/ViewHistory", callBack, data);

    },

    onRefresh: function (entityContentTypeEnum) {
        var id = MojFind("#EntityId").val();
        var tabName = $(Moj.Constants["selectedTabContent"]).find("[id^='divContent']").attr('id').replace("divContent_", "");
        var textTab = $(Moj.Constants["selectedTabContent"]).parent("div").find("li.k-item.k-state-active").find("span.k-link").text();
        var currentTab = $(Moj.Constants["selectedTabContent"]).find('li.active').attr('id').replace("li_", "");
        Moj.controlsPopupsClean(false, false, null);
        PDO.reloadEntityContentTab(entityContentTypeEnum, id, textTab, tabName, currentTab);
    },

    addContactTabById: function (contactId) {
        PDO.addEntityContentTab(EntityContentTypeEnum.Applicant, contactId, null, Resources.Strings.Applicant + " " + contactId, "Contact_Tab_" + contactId);
    },

    addProcessTabById: function (processId) {
        PDO.addEntityContentTab(EntityContentTypeEnum.Process, processId, null, Resources.Strings.Process + " " + processId, "Process_Tab_" + processId);
    },

    addProcessTabById: function (processId, actionName) {
        PDO.addEntityContentTab(EntityContentTypeEnum.Process, processId, null, Resources.Strings.Process + " " + processId, "Process_Tab_" + processId, actionName);
    },

    addAdvocateTabById: function (advocateId) {
        PDO.addEntityContentTab(EntityContentTypeEnum.Advocate, advocateId, null, Resources.Strings.Advocate + " " + advocateId, "Advocate_Tab_" + advocateId);
    },

    addCandidateFormById: function (candidateFormId, advocateId, fullName) {
        fullName = fullName.replace(/-/g, ' ');
        PDO.addEntityContentTab(EntityContentTypeEnum.CandidateForm, candidateFormId, { advocateId: advocateId }, Resources.Strings.CandidateForm + " - " + fullName, "CandidateForm_Tab_" + candidateFormId);
    },


    addFeeRequestHearingTabById: function (feeRequestId, advocateLastName, advocateFirstName) {
        advocateLastName = advocateLastName.replace(/_/g, ' ');
        advocateFirstName = advocateFirstName.replace(/_/g, ' ');

        PDO.addEntityContentTab(EntityContentTypeEnum.FeeRequestHearing, feeRequestId, { feeRequestId: feeRequestId }, advocateLastName + " " + advocateFirstName + "-" + feeRequestId, "FeeRequest_Tab_" + feeRequestId);
    },

    addFeeRequestShiftCallTabById: function (feeRequestId, advocateLastName, advocateFirstName) {
        advocateLastName = advocateLastName.replace(/_/g, ' ');
        advocateFirstName = advocateFirstName.replace(/_/g, ' ');

        PDO.addEntityContentTab(EntityContentTypeEnum.FeeRequestShiftsCalls, feeRequestId, { feeRequestId: feeRequestId }, advocateLastName + " " + advocateFirstName + "-" + feeRequestId, "FeeRequest_Tab_" + feeRequestId);
    },

    addPdoFileTabById: function (pdoFileId) {
        PDO.addEntityContentTab(EntityContentTypeEnum.PDOFile, pdoFileId, null, Resources.Strings.PDOFile + " " + pdoFileId, "PDOFile_Tab_" + pdoFileId);
    },

    refreshShiftsGridData: function () {
        MojFind("#btnSearchShiftsDetails").click();
    },

    openShiftsPerShiftConfigurationView: function (shiftConfigurationId) {
        var inWeekOfDate = MojFind("#shiftsDetailsSearchCriteria_ViewInWeekOfDate").val();
        var dateSplitted = inWeekOfDate.split("/");
        var dateToSend = dateSplitted[1] + "/" + dateSplitted[0] + "/" + dateSplitted[2];

        PDO.openPopupWindow("ShiftsPerShiftConfigurationView", "", "תורנויות למוקד", 1750, 800, true, false, false, baseUrl + "/Shift/ShiftsPerShiftConfiguration?shiftConfigurationId=" + shiftConfigurationId + "&inWeekOfDate=" + dateToSend, PDO.refreshShiftsGridData, undefined, undefined, undefined, undefined, true);
    },

    openPopupWindow: function (id, content, title, width, height, scrollable, draggable, resizable, url, methodNameAfterCancel, urlParameters, methodNameAfterOpen, appendTo, textAlertBeforeClose, isHeaderDiv) {
        //isHeaderDiv indicates if have a fixed header in the popup
        var focusedElement = $(document.activeElement);
        var scrollHeight = isHeaderDiv ? height - 181 : height - 79;
        title = "<a id ='preFocus' tabindex='0'></a><h2 class='moj-modal-title'>" + title + "</h2>";
        var maxWidth = window.innerWidth - 80;
        var kendoWindow = $("<div id='" + id + "' style='position:relative;'><div id=\"HeaderDiv\"></div><div class='window-bottom'></div><div class='scroll' style='overflow:auto;height:" + scrollHeight + "px;'><div class='moj-window-container-content'><center><img id='loading' class='margin-top20' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center></div></div><a id ='stopFocus' tabindex='0'></a></div>").kendoWindow({
            width: width < maxWidth ? width : maxWidth,
            height: height,
            iframe: false,
            modal: appendTo == undefined ? true : false,
            appendTo: appendTo,
            scrollable: false,
            draggable: draggable,
            resizable: resizable,
            close: function (e) {
                if (textAlertBeforeClose != undefined && arguments.callee.caller.arguments.callee.caller.arguments.callee.caller.name == "_windowActionHandler") {
                    e.preventDefault();
                    var x = Moj.confirm(textAlertBeforeClose, function () {
                        $("#" + id).trigger('window_closed');
                        if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                            methodNameAfterCancel();
                        if (appendTo != undefined)
                            Moj.setOverlay(kendoWindow, appendTo, false);
                        $("#" + id).data("kendoWindow").unbind("close");
                        $("#" + id).data("kendoWindow").close();
                    });
                }
                else {
                    $(document).off("keydown.kendoWindow");
                    $("#" + id).trigger('window_closed');
                    if (methodNameAfterCancel != undefined && methodNameAfterCancel != "")
                        methodNameAfterCancel();
                    if (appendTo != undefined)
                        Moj.setOverlay(kendoWindow, appendTo, false);
                }
                focusedElement.focus();
            },
            activate: function () {
                var windowElement = this.wrapper,
                    windowContent = this.element;
                $(document).on("keydown.kendoWindow", function (e) {
                    var focusedElement = $(document.activeElement);
                    if (e.keyCode == kendo.keys.TAB) {
                        if (focusedElement.closest(windowElement).length > 0 || document.activeElement == document.body) {
                            return;
                        }
                        windowContent.focus();
                    }
                });
                $("#stopFocus").focus(function () {
                    windowContent.focus();
                });
                $("#preFocus").focus(function () {
                    windowContent.focus();
                });
            },
            deactivate: function () {
                this.destroy();
            }
        });
        Moj.setWindowTitle(kendoWindow, title);
        if (appendTo != undefined)
            Moj.setOverlay(kendoWindow, appendTo, true);

        $("#" + id).trigger('window_opened');
        if (content != "" && content != null) {
            $("#" + id + " .moj-window-container-content").html(content);
            var w = kendoWindow.data("kendoWindow").toFront();
            if (appendTo == undefined)
                w.center();
            else
                $(w).mojWindowCenter();
            w.open();

            if (methodNameAfterOpen != undefined && methodNameAfterOpen != "")
                methodNameAfterOpen();

            MojFind("div.scroll").bind('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);
            Moj.setFocusToTheFirstElement(MojFind('.moj-window-container-content'));
            $(".moj-window-container-content input[readonly='readonly']").attr("tabindex", -1);
        }
        if (typeof (url) != "undefined" && url != "" && url != null) {
            urlParameters = $.extend(urlParameters, { PopWidth: width < maxWidth ? width : maxWidth });
            $("#" + id + " .moj-window-container-content").load(url, urlParameters, function (data) {
                if (data.toString().indexOf("ErrorHandler") == -1) {
                    var w = kendoWindow.data("kendoWindow").toFront();
                    if (appendTo == undefined)
                        w.center();
                    else
                        $(w).mojWindowCenter();
                    w.open();
                    if (methodNameAfterOpen != undefined && methodNameAfterOpen != "")
                        methodNameAfterOpen();


                    MojFind("div.scroll").bind('mousewheel DOMMouseScroll', Moj.HtmlHelpers._preventBackWindowScroll);
                    Moj.setFocusToTheFirstElement(MojFind('.moj-window-container-content'));
                    $(".moj-window-container-content input[readonly='readonly']").attr("tabindex", -1);
                }
            });

        }
        return kendoWindow;
    },

    searchButtonClicked: function (selector, divName) {

        var validate = MojFind("#" + divName).closest("form").validate();
        var isValid = true;
        MojFind("#" + divName).find("input").each(function () {
            if (validate.element($(this)) != undefined && MojFind("span[data-valmsg-for='" + $(this).attr("name") + "']").length > 0)
                isValid = isValid & $(this).valid();
        });
        if (isValid) {
            var element = MojFind("[id^='" + selector + "']");
            var view = "";
            switch (element.attr("data-role")) {
                case "listview":
                    {
                        view = element.data("kendoListView");
                        break;
                    }
                case "grid":
                    {
                        view = element.data("kendoGrid");
                        break;
                    }
            }
            if (view.dataSource._total > 0)
                view.dataSource.page(1);
            MojFind("[id*=Skip][type='hidden']").val(0);
            view.dataSource.read(MojFind("#" + divName).closest("form").serializeObject());
        }
    },

    validateId: function (str) {

        //INPUT VALIDATION
        // Just in case -> convert to string
        var iDnum = String(str);

        // Validate correct input
        if (iDnum.length > 9 || isNaN(iDnum))
            return false;

        // The number is too short - add leading 0000
        if (iDnum.length < 9) {
            while (iDnum.length < 9) {
                iDnum = '0' + iDnum;
            }
        }
        // CHECK THE ID NUMBER
        var mone = 0, incNum;
        for (var i = 0; i < 9; i++) {
            incNum = Number(iDnum.charAt(i));
            incNum *= (i % 2) + 1;
            if (incNum > 9)
                incNum -= 9;
            mone += incNum;
        }
        if (mone % 10 == 0)
            return true;
        else
            return false;
    },

    getSelectedFile: function () {
        var tabstrip = $("#tabStrip").data("kendoTabStrip");
        var fileId = 0;
        if (tabstrip != undefined) {
            fileId = tabstrip.select().attr("data");
        }
        return fileId;
    },

    getSelectedSubmissionNo: function () {
        var tabstrip = $("#tabStrip").data("kendoTabStrip");
        var SubmissionNo;
        if (tabstrip != undefined) {
            SubmissionNo = tabstrip.select().text().split(" ")[1];
        }
        return SubmissionNo;
    },

    getSelectedParentTab: function () {
        var tabstrip = $("#tabStrip").data("kendoTabStrip");
        var selectedParentTab;
        if (tabstrip != undefined) {
            selectedParentTab = tabstrip.select();
        }
        return selectedParentTab;
    },

    getModuleColorByContentType: function (contentType) {
        switch (contentType) {
            case ContentTypeEnum.ApplicantModul:
                return 'moduleApplicants';
            case ContentTypeEnum.AdvocateModul:
                return 'moduleAdvocates';
            case ContentTypeEnum.ProcessModul:
                return 'moduleProcesses';
            case ContentTypeEnum.NominationModul:
                return 'moduleNominations';
            case ContentTypeEnum.FeeModule:
                return 'moduleFees';
            case ContentTypeEnum.PDOFileModule:
                return 'moduleFiles';
            case ContentTypeEnum.Management:
                return 'moduleManagement';
            case ContentTypeEnum.ReportModule:
                return 'moduleReports';
            case ContentTypeEnum.ShiftModule:
                return 'moduleShift';
            default:
                return 'moduleDefault';
        }
    },

    getModuleColorByEntityContentType: function (contentType) {
        switch (contentType) {
            case EntityContentTypeEnum.Applicant:
                return 'moduleApplicants';
            case EntityContentTypeEnum.Advocate:
            case EntityContentTypeEnum.CandidateForm:
                return 'moduleAdvocates';
            case EntityContentTypeEnum.Process:
                return 'moduleProcesses';
            case EntityContentTypeEnum.Nomination:
                return 'moduleNominations';
            case EntityContentTypeEnum.FeeRequestHearing:
                return 'moduleFees';
            case EntityContentTypeEnum.FeeRequestShiftsCalls:
                return 'moduleFees';
            case EntityContentTypeEnum.PDOFile:
                return 'moduleFiles';
            case EntityContentTypeEnum.Shift:
                return 'moduleShift';
            default:
                return 'moduleDefault';
        }
    },

    // add module tab with a vertical action-links menu
    addContentTab: function (contentType, id, values, parentTabText, parentTabName, openTabName, func, reload) {
        var moduleColor = PDO.getModuleColorByContentType(contentType);
        Moj.addTab("#tabStrip", parentTabText, parentTabName, id, false, function () {
            var routeValues = objectToQueryStringTreatment(values);
            $("#divContent_" + parentTabName).load(baseUrl + '/Home/Content?contentType=' + contentType + '&id=' + id + routeValues, function () {

                $("#divContent_" + parentTabName).find("[id^='content']").attr("id", "content_" + id);
                $("#divContent_" + parentTabName).find("[id^='lnk']").attr("data-ajax-update", "#content_" + id);

                if (openTabName != undefined && openTabName != null) {
                    alert(openTabName);
                    MojFind("#li_" + openTabName).find("a").click();
                }

            });

        }, reload, moduleColor);
        var fn = PDO[func];
        if (typeof fn === "function")
            fn.call();
    },

    addEntityContentTab: function (entityContentType, entityId, values, parentTabText, parentTabName, openTabName, func, isReloadTab) {
        var moduleColor = PDO.getModuleColorByEntityContentType(entityContentType);
        Moj.addTab("#tabStrip", parentTabText, parentTabName, entityId, false, function () {
            var routeValues = objectToQueryStringTreatment(values);

            if (openTabName != undefined && openTabName != null && openTabName != "")
                routeValues += "&openTabName=" + openTabName;

            $("#divContent_" + parentTabName).load(baseUrl + '/Home/EntitiesContent?entityContentType=' + entityContentType + '&entityId=' + entityId + routeValues, function () {

                $("#divContent_" + parentTabName).find("[id^='content']").attr("id", "content_" + entityId);
                $("#divContent_" + parentTabName).find("[id^='lnk']").attr("data-ajax-update", "#content_" + entityId);

                //if (openTabName != undefined && openTabName != null)
                //    MojFind("#li_" + openTabName).find("a").click();

            });

        }, isReloadTab, moduleColor, true);

        if (openTabName != undefined && openTabName != null && openTabName != "") {
            if (MojFind("#li_" + openTabName).hasClass('active') == false) {
                MojFind("#li_" + openTabName + " a").click()
            }
        }

        var fn = PDO[func];
        if (typeof fn === "function")
            fn.call();
    },

    getCurrentTab: function () {
        return $(Moj.Constants["selectedTabContent"]).find('li.active').attr('id').replace("li_", "");
    },

    afterSaveEntityContentTab: function (entityInfo) {
        PDO.updateEntityInfo(entityInfo);
        var currentTab = $(Moj.Constants["selectedTabContent"]).find('li.active').attr('id');
        MojFind("[id^='ObjectState']").val(false);
        MojFind("#" + currentTab).find("a").click();
    },

    loadEntityTab: function (url) {
        MojFind('.moj-content[id*="content"]').load(baseUrl + url, {});
    },

    reloadEntityContentTab: function (entityContentType, entityId, parentTabText, parentTabName, openTabName, isReload, values, entityInfo, func) {

        var tabToCloseName = $(Moj.Constants["selectedTabContent"]).find("[id^='divContent']").attr('id').replace("divContent_", "");
        //var parentTabText = $(Moj.Constants["selectedTabContent"]).parent("div").find("li.k-item.k-state-active").find("span.k-link").text()

        //if (Moj.isEmpty(openTabName) && prevEntityId != 0)
        //    openTabName = $(Moj.Constants["selectedTabContent"]).find('li.active').attr('id').replace("li_", "");

        var prevEntityId = MojFind("#EntityId").val();
        PDO.updateEntityInfo(entityInfo, true);

        var routeValues = objectToQueryStringTreatment(values);

        if (openTabName != undefined && openTabName != null && openTabName != "")
            routeValues += "&openTabName=" + openTabName;

        if (prevEntityId == 0) {
            var newContactContent = MojFind("#divContent_" + tabToCloseName);
            newContactContent.attr('id', "divContent_" + parentTabName);
            $("#tabStrip").data("kendoTabStrip").select().text("");
            var activeTab = $("#tabStrip").data("kendoTabStrip").tabGroup.children("li.k-state-active");
            activeTab.append('<span class="k-link">' + parentTabText + '</span>')
            activeTab.attr("data", entityId);
            activeTab.append("<a id='close_" + parentTabName + "' class='tab-close' onclick=\"Moj.closeTab('" + "#tabStrip" + "','close_" + parentTabName + "');\" />")
            isReload = false;
        }

        if (!Moj.isBool(isReload))
            isReload = true;
        routeValues += "&isReload=" + isReload;

        var parentTab = $("#divContent_" + parentTabName);
        Moj.controlsPopupsClean(false, false, null);
        parentTab.load(baseUrl + '/Home/EntitiesContent?entityContentType=' + entityContentType + '&entityId=' + entityId + routeValues, function () {
            parentTab.find("[id^='content']").attr("id", "content_" + entityId);
            parentTab.find("[id^='lnk']").attr("data-ajax-update", "#content_" + entityId);

        });

        var fn = PDO[func];
        if (typeof fn === "function")
            fn.call();
    },

    convertFormToObject: function (formId, moreData) {
        var data = MojFind("#" + formId).serializeObject();
        $.extend(data, moreData);
        return data;
    },

    getEntitiesTabsContainer: function (entityContentType, values) {
        var routeValues = objectToQueryStringTreatment(values);
        //MojFind('.tabs-container[id*="tabs-container"]').load(baseUrl + '/' + entityTab[entityContentType] +'/EntitiesTabsContainer?entityContentType=' + entityContentType + '&routeValues=' + values, {});
        Moj.callAjax(null, '/' + entityTab[entityContentType] + '/EntitiesTabsVisible?entityContentType=' + entityContentType + '&routeValues=' + routeValues, function (data) {
            var isTabsVisible = data;
            MojFind('.tabs-container[id*="tabs-container"]').find("[id^='li_']").each(function () {
                var isTabHidden = !isTabsVisible[this.id.replace("li_", "")];
                if (isTabHidden == false)
                    $(this).removeClass('hide')
            });
        }, "post");

    },

    updateEntityInfo: function (entityInfo, isReload) {
        if (entityInfo != undefined) {
            MojFind("#Guid").val(entityInfo.Guid);
            MojFind("#EntityId").val(entityInfo.EntityId);
        }
        if (!Moj.isTrue(isReload))
            isReload = false;
        MojFind("#IsReload").val(isReload);
    },

    updateEntityInfoOnTabLoad: function (entityId, guid) {
        MojFind("#EntityId").val(entityId);
        MojFind("#Guid").val(guid);
    },

    closeEntityTab: function (closeButton) {
        MojFind("#EntityId").val('');
        MojFind("#Guid").val('');
        PDO.closeTab(closeButton);
    },

    closeTab: function (closeButton) {
        closeButton.trigger("click");
    },

    refreshHeaderFile: function () {
        MojFind("#FileHeader").load(baseUrl + "/PDOFile/FileHeader");
    },

    changeActionTab: function (href) {
        MojFind("#tabs-content-container > div").hide();
        MojFind("#tabs-content-container > div[id=" + href + "_Div]").show();
    },

    saveWithDocumentAreaSuccess: function (gridName, data) {
        var errors = "";
        if (data.length > 0)
            errors = data;
        else
            errors = data.Errors;
        if (errors.indexOf("Moj.showMessage") == -1) {
            if (Moj.showErrorMessage(errors) == true) {
                MojFind('#DetailsContent').html("");
                var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
                grid.dataSource.read(Moj.getGridData());
                Moj.replaceDivs('#DetailsContent', '#ListContent');
            }
        }
        return false;
    },

    callAction: function (url, successfunc, type) {
        if (typeof (type) == "undefined")
            type = "GET";

        $.ajaxSetup({ cache: true });
        $.ajax({
            type: type,
            url: baseUrl + url,
            success: successfunc == '' ? saveSuccess : successfunc,
            //data: data,
            error: function (e) {
                //Moj.showMessage(Resources.Strings.Error);
            }
        });

    },

    isValidName: function (value) {
        if (value == undefined || value == "")
            return true;

        if (!(/^[א-ת.\\-\\s\\']+$/.test(value) || /^[a-zA-z.\\-\\s]+$/.test(value)))
            return false;
        else
            return true;
    },

    setEntityObject: function (dataObject) {
        var str = [], data;
        data = objectToQueryString("", dataObject, str);
        return data.join("&").replace(/%20/g, "+") + "&" + EntityMojFind("input[name='Entity']").serialize() + "&" + EntityMojFind("input[name='EntityId']").serialize() + "&" + EntityMojFind("input[name='RequestDateTime']").serialize();
    },

    showGridAddDetailsForEntity: function (gridName, url, isAddRowInline) {
        if (isAddRowInline == "False" || isAddRowInline == undefined) {
            MojFind('#div_' + gridName + '_Details').html("<center><img id='loading' class='margin-top10' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center>");
            MojFind('#div_' + gridName + '_Details').load(url, {}, function () {
                Moj.enableValidation(MojFind('#div_' + gridName + '_Details').closest("form"));
                var action = MojFind('#div_' + gridName + '_Details').closest("form").attr("id").replace("frm", "");
                MojFind(MojFind("[id^='btn'][id*='" + action + "']")).parent("div").parent("div").addClass("hide");
            });
            Moj.replaceDivs('#div_' + gridName, '#div_' + gridName + '_Details');
        } else {
            $.post(url, {}, function (data) {
                MojFind("[id^='" + gridName + "'] tr.hide").removeClass("hide");
                MojFind('#tr_' + gridName + '_Details').remove();
                var addClassAlt = (MojFind("[id^='" + gridName + "'] tbody tr").length > 0 && !MojFind("[id^='" + gridName + "'] tbody tr:last").hasClass("k-alt"));
                MojFind("[id^='" + gridName + "'] tbody").append(data);
                if (addClassAlt)
                    MojFind('#tr_' + gridName + '_Details').addClass("k-alt");
                Moj.enableValidation(MojFind('#tr_' + gridName + '_Details').closest("form"));
            });
        }
    },

    addRowFromTableToTable: function (sourceGridList, targetGridName, columnList, methodNameBeforeLeftButtonClick, isSelectionModeMultiple, isTransferAllRows) {
        var canSave = true;
        document.body.style.cursor = 'wait';
        if (methodNameBeforeLeftButtonClick != undefined && methodNameBeforeLeftButtonClick != "") {
            var result = eval(methodNameBeforeLeftButtonClick + "()");
            if (typeof (result) == "boolean")
                canSave = Moj.isTrue(result);
        }
        if (canSave) {
            sourceGridList.forEach(function (sourceGridName) {
                var sourceGrid = MojFind("[id^='" + sourceGridName + "']").data("kendoGrid");
                var targetGrid = MojFind("[id^='" + targetGridName + "']").data("kendoGrid");

                if (Moj.isTrue(isTransferAllRows)) {
                    var selectedRows = sourceGrid.dataSource._data.filter(x => !x.UnSelected);
                    if (selectedRows != "undefined" && selectedRows.length > 0) {
                        for (var i = selectedRows.length - 1; i >= 0; i--) {
                            var selectedRow = selectedRows[i];
                            PDO.addSelectedRowToTargetGrid(sourceGrid, targetGrid, selectedRow, columnList, sourceGridName, true);
                        }
                        targetGrid.refresh();

                    }
                }
                else {
                    if (isSelectionModeMultiple == undefined || Moj.isFalse(isSelectionModeMultiple)) {
                        var selectedRow = sourceGrid.select();
                        if (selectedRow != "undefined" && selectedRow.length > 0) {
                            PDO.addSelectedRowToTargetGrid(sourceGrid, targetGrid, selectedRow, columnList, false)
                        }
                    }
                    else {
                        var selectedRows = sourceGrid.select();
                        if (selectedRows != "undefined" && selectedRows.length > 0) {
                            $(selectedRows.get().reverse()).each(function (index, selectedRow) {
                                PDO.addSelectedRowToTargetGrid(sourceGrid, targetGrid, selectedRow, columnList, sourceGridName, false)
                            })
                        }
                    }
                }



            });
        }

        document.body.style.cursor = 'auto';
    },

    addSelectedRowToTargetGrid: function (sourceGrid, targetGrid, selectedRow, columnList, sourceGridName, isTransferAllRows) {
        targetGrid.addRow();
        var uid = null;
        if (Moj.isTrue(isTransferAllRows))
            uid = selectedRow.uid;
        else
            uid = $(selectedRow).data("uid");
        var item = sourceGrid.dataSource.getByUid(uid);
        targetGrid.dataItem(targetGrid.items()[0])["GridSource"] = sourceGridName;
        targetGrid.dataItem(targetGrid.items()[0])["RowUidSource"] = uid;
        if (targetGrid.dataItem(targetGrid.items()[0])["State"] != undefined)
            targetGrid.dataItem(targetGrid.items()[0])["State"] = window.Enums.ObjectState.Added;
        columnList.forEach(function (columnName) {
            var columnValue = item[columnName];
            targetGrid.dataItem(targetGrid.items()[0])[columnName] = columnValue;
        });

        item.set("UnSelected", true);

        if (Moj.isFalse(isTransferAllRows))
            targetGrid.refresh();
    },

    removeRowFromTableToTable: function (targetGridName, methodNameBeforeRightButtonClick, isSelectionModeMultiple, isReturnAllRows) {
        var canSave = true;
        document.body.style.cursor = 'wait';
        if (methodNameBeforeRightButtonClick != undefined && methodNameBeforeRightButtonClick != "") {
            var result = eval(methodNameBeforeRightButtonClick + "()");
            if (typeof (result) == "boolean")
                canSave = Moj.isTrue(result);
        }
        if (canSave) {
            var targetGrid = MojFind("[id^='" + targetGridName + "']").data("kendoGrid");

            if (Moj.isTrue(isReturnAllRows)) {
                //document.body.style.cursor = 'wait';
                var selectedRows = targetGrid.dataSource._data;
                if (selectedRows != "undefined" && selectedRows.length > 0) {
                    for (var i = selectedRows.length - 1; i >= 0; i--) {
                        var selectedRow = selectedRows[i];
                        PDO.removeSelectedRowFromTableToTable(selectedRow, targetGrid, true);
                    }

                    targetGrid.refresh();
                }
            }
            else {
                if (isSelectionModeMultiple == undefined || Moj.isFalse(isSelectionModeMultiple)) {
                    var selectedRow = targetGrid.select();
                    if (selectedRow != "undefined" && selectedRow.length > 0) {
                        PDO.removeSelectedRowFromTableToTable(selectedRow, targetGrid, false)
                    }
                }
                else {
                    var selectedRows = targetGrid.select();
                    if (selectedRows != "undefined" && selectedRows.length > 0) {
                        $(selectedRows.get().reverse()).each(function (index, selectedRow) {
                            PDO.removeSelectedRowFromTableToTable(selectedRow, targetGrid, false)
                        })
                    }
                }
            }

        }
        document.body.style.cursor = 'auto';
    },

    removeSelectedRowFromTableToTable: function (selectedRow, targetGrid, isReturnAllRows) {
        var uid = null;
        if (Moj.isTrue(isReturnAllRows))
            uid = selectedRow.uid;
        else
            uid = $(selectedRow).data("uid");
        var item = targetGrid.dataSource.getByUid(uid);
        var sourceGridName = item.GridSource;
        if (uid != "" && sourceGridName != "") {
            var sourceGrid = MojFind("[id^='" + sourceGridName + "']").data("kendoGrid");
            var itemToUnSelect = sourceGrid.dataSource.getByUid(item.RowUidSource);
            itemToUnSelect.set("UnSelected", false);
            targetGrid.dataSource.remove(item);
        }
    },

    checkUnSelectOnDataBound: function (e) {
        var grid = MojFind("#" + e.sender.element[0].id).data("kendoGrid");
        if (grid != undefined) {

            grid.tbody.find('tr').each(function () {
                var row = this;
                var dataItem = grid.dataItem(row);
                if (dataItem != undefined && dataItem.UnSelected != undefined && dataItem.UnSelected == true) {
                    $(row).addClass("unSelected");
                    $(row).find('td div').addClass('unSelectedColor');
                    $(row).removeClass('k-state-selected k-state-selecting');
                }
            });
        }

        Grid_dataBound(e);
    },

    _onSearchRequestEnd: function (e, lblname) {
        if (e.response != undefined) {

            if (e.response.TotalCount > e.response.Total) {

                $("#" + lblname).visible(true);
                $("#" + lblname).text(" מוצגות " + e.response.Total + " תוצאות מתוך " + e.response.TotalCount)
            }
            else {
                $("#" + lblname).visible(false);
            }
        }

    },



    _onSearchSuccess: function (e, lblname, isShowAll) {
        debugger;
        Grid_dataBound(e);
        if (e != undefined && e.sender != undefined && e.sender.dataSource != undefined && e.sender.dataSource.data() != undefined && e.sender.dataSource.data().length != undefined && !Moj.isTrue(isShowAll)) {
            var maxSearchResult = $("#MaxSearchResult").val();
            if (e.sender.dataSource.data().length >= maxSearchResult) {
                $("#" + lblname).visible(true);
            }
            else {
                $("#" + lblname).visible(false);
            }
        }
    },


    checkUnSelectOnChange: function (e) {
        var grid = MojFind("#" + e.sender.element[0].id).data("kendoGrid");
        if (grid != undefined) {

            var row = grid.select();
            var dataItem = grid.dataItem(row);

            if (dataItem != undefined && dataItem.UnSelected != undefined && dataItem.UnSelected == true) {
                $(row).removeClass('k-state-selected k-state-selecting');
            }

        }

    },

    compareRowsValues: function (row1, row2) {
        if (row1.length != row2.length)
            return false;
        for (var i = 0; i < row1.length; i++) {
            if (row1[i] != row2[i])
                return false;
        }
        return true;
    },

    checkIdentificationNo: function (value) {
        if (value.length != 9) {
            str = "000000000" + value;
            str = str.substr(value.length, 9);
            value = str;
        }
        if (/^\d+$/.test(value) == false) {
            return false;
        }
        else {
            var idnum1 = parseInt(value.substr(0, 1)) * 1;
            var idnum2 = parseInt(value.substr(1, 1)) * 2;
            var idnum3 = parseInt(value.substr(2, 1)) * 1;
            var idnum4 = parseInt(value.substr(3, 1)) * 2;
            var idnum5 = parseInt(value.substr(4, 1)) * 1;
            var idnum6 = parseInt(value.substr(5, 1)) * 2;
            var idnum7 = parseInt(value.substr(6, 1)) * 1;
            var idnum8 = parseInt(value.substr(7, 1)) * 2;
            var idnum9 = parseInt(value.substr(8, 1)) * 1;

            if (idnum1 > 9) idnum1 = (idnum1 % 10) + 1;
            if (idnum2 > 9) idnum2 = (idnum2 % 10) + 1;
            if (idnum3 > 9) idnum3 = (idnum3 % 10) + 1;
            if (idnum4 > 9) idnum4 = (idnum4 % 10) + 1;
            if (idnum5 > 9) idnum5 = (idnum5 % 10) + 1;
            if (idnum6 > 9) idnum6 = (idnum6 % 10) + 1;
            if (idnum7 > 9) idnum7 = (idnum7 % 10) + 1;
            if (idnum8 > 9) idnum8 = (idnum8 % 10) + 1;
            if (idnum9 > 9) idnum9 = (idnum9 % 10) + 1;

            var sumval = idnum1 + idnum2 + idnum3 + idnum4 + idnum5 + idnum6 + idnum7 + idnum8 + idnum9;

            sumval = sumval % 10;
            if (sumval > 0) {
                return false;
            }
            else
                return true;
        }

    },

    //onCloseSearchPersoPopup: function () {

    //    var grid = MojControls.Grid.getKendoGridById("grdContactList");
    //    var selectedItem = grid.dataItem(grid.select());
    //    var actionName = MojFind("#ActionName").val();

    //    var window = $("#actionSearchdialogModal").data("kendoWindow");
    //    window.close();

    //    if (selectedItem != undefined) {
    //        if (jQuery.isFunction(eval(actionName))) {
    //            var setAction = actionName + "(" + JSON.stringify(selectedItem) + ");"
    //            eval(setAction);
    //        }

    //    }
    //},

    //onSearchPersonOpened: function () {

    //    MojFind("#btnCancelSearchPersonApplicant").click(function () {
    //        var window = $("#actionSearchdialogModal").data("kendoWindow");
    //        window.close();
    //    });

    //    MojFind("#btnOkSearchPersonApplicant").click(function () {
    //        PDO.onCloseSearchPersoPopup();
    //    });


    //    //grid.tbody.find
    //    MojFind('tr').live('dblclick', function () {
    //        PDO.onCloseSearchPersoPopup();
    //    })
    //},

    //onSearchPersonClose: function () {
    //    MojFind('tr').die('dblclick');
    //    MojFind("#btnCancelSearchPersonApplicant").off('click');
    //    MojFind("#btnOkSearchPersonApplicant").off('click');
    //},

    openSearchApplicantPopup: function (ApplicantName, ApplicantContactId, CustomActionName) {
        Moj.openPopupWindow("actionSearchdialogModal", "", "איתור פונה", 1140, 620, false, false, false, baseUrl + '/PersonApplicant/SearchPersonApplicant?isPopup=true&applicantNameField=' + ApplicantName + '&applicantContactIdField=' + ApplicantContactId + '&customActionName=' + CustomActionName);
    },

    setSelectedApplicant: function (selectedItem, applicantNameField, applicantContactIdField) {
        var contactId = selectedItem["ContactId"];
        var firstName = selectedItem["FirstName"];
        var lastName = selectedItem["LastName"];
        MojFind("#" + applicantContactIdField).val(contactId);
        MojFind("#" + applicantNameField).val(lastName + " " + firstName);
    },

    openSearchPDOFilePopup: function (pdoFileIdField, CustomActionName) {
        Moj.openPopupWindow("actionSearchdialogModal", "", "איתור תיק", 1140, 750, false, false, false, baseUrl + '/PDOFile/SearchPDOFile?isPopup=true&pdoFileIdField=' + pdoFileIdField + '&customActionName=' + CustomActionName);
    },

    setSelectedPDOFile: function (selectedItem, pdoFileIdField) {
        MojFind("#" + pdoFileIdField).val(selectedItem["PDOFileId"]);
    },

    openSearchProcessPopup: function (onClosePopupMethodName) {
        Moj.website.openPopupWindow("openSearchProcessPopup", "", "איתור פניה", 1140, 800, false, false, false, baseUrl + '/Process/SearchProcess?isPopup=true&onClosePopupMethodName=' + onClosePopupMethodName);
    },

    openSearchFeeRequestHearingPopup: function (onClosePopupMethodName) {
        Moj.website.openPopupWindow("actionSearchdialogModal", "", "איתור בקשה לישיבות", 1140, 800, false, false, false, baseUrl + '/FeeRequest/SearchFeeRequestHearing?isPopup=true&onClosePopupMethodName=' + onClosePopupMethodName);
    },

    openSearchFeeRequestShiftsPopup: function (onClosePopupMethodName) {
        Moj.website.openPopupWindow("actionSearchdialogModal", "", "איתור בקשה לתורנויות", 1140, 800, false, false, false, baseUrl + '/FeeRequest/SearchFeeRequestShiftsCalls?isPopup=true&onClosePopupMethodName=' + onClosePopupMethodName);
    },

    openSearchAdvocatePopup: function (onClosePopupMethodName, isCurrentDistrictOnlyField, showOkCancelButtons, isCheckAllAbility) {

        Moj.website.openPopupWindow("SearchPersonAdvocateDialog", "", Resources.Strings.SearchPersonAdvocates, 1170, 870, false, false, false, baseUrl + '/PersonAdvocate/SearchPersonAdvocate?isPopup=true&isCurrentDistrictOnlyField=' + isCurrentDistrictOnlyField + '&showOkCancelButtons=' + showOkCancelButtons + '&onClosePopupMethod=' + onClosePopupMethodName + '&isCheckAllAbility=' + isCheckAllAbility); 
    },

    openSearchCandidateFormPopup: function (candidateFormIdField, customActionName) {

        Moj.website.openPopupWindow("actionSearchdialogModal", "", "איתור טופס בקשה", 1170, 870, false, false, false, baseUrl + '/PersonAdvocate/SearchCandidateForm?isPopup=true&customActionName=' + customActionName + '&candidateFormIdFieldName=' + candidateFormIdField);
    },

    setSelectedCandidateForm: function (selectedItem, candidateFormIdFieldName) {
        MojFind("#" + candidateFormIdFieldName).val(selectedItem["CandidateFormId"]);
    },

    calcAge: function (fromDate, toDate) {
        var age;

        $.ajax({
            type: "POST",
            async: false,
            url: baseUrl + "/PersonApplicant/GetAgeByDate",
            contentType: 'application/json',
            data: JSON.stringify({ dateTime: fromDate, inDate: toDate }),
            success: function (data) {
                if (data != null && data != undefined) {
                    age = data.Age;
                }
            },
        });
        return age;

        //try {

        //    //if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fromDate) || !/^\d{2}\/\d{2}\/\d{4}$/.test(toDate))
        //    //    return -1;
        //    if (toDate == undefined)
        //        toDate = new Date();

        //    if (Moj.isFalse(typeof (fromDate) == "object")) {
        //        var fromDate = fromDate.split("/");
        //        var fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        //    }

        //    if (Moj.isFalse(typeof (toDate) == "object")) {
        //        var toDate = toDate.split("/");
        //        var toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        //    }

        //    toDate = toDate.setHours(0, 0, 0, 0);
        //    fromDate = fromDate.setHours(0, 0, 0, 0);

        //    if (isNaN(fromDate) == true) throw new Error('הערך אינו תאריך חוקי');

        //    else {
        //        var age = ((toDate - fromDate) / (1000 * 60 * 60 * 24 * 365.25));
        //    }

        //    return age;

        //}
        //catch (e) {
        //    return -1;
        //}
    },

    calculateDatesDiff: function (date1, date2) {

        var date1Converted = new Date(date1.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        var date2Converted = new Date(date2.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

        var diff = date2Converted - date1Converted;
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);

        if (hours >= 0 && hours < 10)
            hours = "0" + hours;
        else if (hours < 0 && hours > -10)
            hours = "-0" + hours * (-1);

        if (minutes < 10)
            minutes = "0" + minutes;

        return (hours + ":" + minutes).toString();
    },

    FromTimeGreatherThanToTime: function (date1, date2) {

        var date1Converted = new Date(date1.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        var date2Converted = new Date(date2.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

        return (date1Converted >= date2Converted);
    },


    getAgeAsString: function (age) {
        try {
            var years = Math.floor(age);
            var month = Math.floor((age % 1) * 12);
            return month + '\\' + years;
        }
        catch (e) {
            return -1;
        }
    },

    isAlphanumeric: function (value) {
        if (value == undefined || value == "")
            return true;

        if (/^[0-9a-zA-Zא-ת\-\s\' %]+$/.test(value) && (/^[0-9a-zA-Z\-\s\ %]+$/.test(value) && /^[^א-ת]+$/.test(value) || /^[א-ת\s'%]+$/.test(value)))
            return true;
        else
            return false;
    },

    isAlphanumericSearchContact: function (value, contactType) {
        if (value == undefined || value == "")
            return true;

        //if (!(/^[0-9a-zA-Zא-ת\-\s\' %]+$/.test(value)))
        //    return false;

        switch (contactType) {
            //case ModuleEnum.Applicant:
            //    return /^[0-9a-zA-Z\-\s\ %]+$/.test(value) && /^[^א-ת]+$/.test(value) || /^[א-ת\s'%]+$/.test(value);
            case ModuleEnum.Advocate:
                return /^[א-ת\s'%]+$/.test(value) || /^[a-zA-Z\s%]+$/.test(value) || /^[0-9%]+$/.test(value);
            case ModuleEnum.Process:
                return true;///^[0-9א-ת\-\s\'\\\" %]+$/.test(value);//todo
            default:
                return true;
        }

    },

    // id - the int key in the strings dictinary
    // dict - the string dictionary in json
    resolveDictionaryStringById: function (id, dict) {
        var key = id.toString();
        if ((dict[key] == null) || (dict[key] == undefined) || (dict[key] == ""))
            return "";
        else
            return "<div class='moj-radic'>" + dict[key] + "</div>";
    },


    showAddDetails: function (gridName, feeActivityCategory, feeActivityTypeClassification) {

        var grid = MojFind("[id^='" + gridName + "']").data("kendoGrid");
        var row = grid.select();
        if (row != undefined && row.length == 1) {
            var dataItem = grid.dataItem(row);
            var id = dataItem.id;

            Moj.safeGet("/FeeRequest/CheckAddNewRequestLine", { classificationId: feeActivityTypeClassification, parentRequestLineId: id },
                function (data) {
                    if (Moj.showErrorMessage(data.Errors)) {

                        var url = baseUrl + "/FeeRequest/FeeRequestLineDetails";
                        var customData = {
                            feeActivityCategory: feeActivityCategory,
                            feeActivityTypeClassificationId: feeActivityTypeClassification
                        }

                        MojFind('#DetailsContent').html("<center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center>");

                        MojFind('#DetailsContent').load(url + "/" + id, customData, function () {
                        });
                        Moj.replaceDivs('#ListContent', '#DetailsContent');
                        return false;
                    }
                });
        }
        else {
            Moj.showMessage(Resources.Messages.NoSelectRecord);
        }


    },

    //clear interval of showEditDetails
    //showEditDetailsTest : function (e)
    //{
    //    
    //    intervalId = setInterval(PDO.showEditDetails(e), 1000);
    //    
    //    clearInterval(intervalId);
    //    return false;
    //},
    showEditDetails: function (e) {
        if (e.currentTarget.hasAttribute("disabled") && $(e.currentTarget).attr("disabled") == "disabled") {
            return false;
        } else {
            var grid = $(e.currentTarget).closest(".k-grid").data("kendoGrid");
            grid.select($(e.currentTarget).closest("tr"));
            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
            var id = dataItem.id;
            var url = e.currentTarget.href;
            var customData, getCustomData = MojFind(e.currentTarget).attr("methodCustomData");
            if (typeof (getCustomData) != "undefined" && getCustomData != null && getCustomData != "") {
                if (getCustomData.includes("@rowSelected"))
                    getCustomData = getCustomData.replace("@rowSelected", JSON.stringify(dataItem));
                customData = eval(getCustomData);
            };
            MojFind('#DetailsContent').html("<center><img id='loading' class='margin-top30' alt='' src='" + baseUrl + "/Content/kendo/Default/loading-image.gif' /></center>");
            var x = MojFind('#DetailsContent').load(url + "/" + id, customData, function () {
            });
            //var x1 = setInterval(PDO.x(url, id, customData), 1000);
            //clearInterval(x1);
            Moj.replaceDivs('#ListContent', '#DetailsContent');
            return false;
        }
    },

    //    x: function (url, id, customData) {
    //        
    //        return MojFind('#DetailsContent').load(url + "/" + id, customData, function () {
    //        });

    //},
    getFeeActivityCategory: function (feeActivityCategory, rowSelected) {
        return {
            feeActivityCategory: feeActivityCategory,
            editOrView: rowSelected.EditOrView
        }
    },

    openDocumentsWindow: function (entityId, entityInstanceId) {

        if (entityId == undefined || entityId == 0 || entityInstanceId == undefined || entityInstanceId == 0) return;
        var url = baseUrl + '/Home/GetDocumentListDetailsView?entityId=' + entityId + "&entityInstanceId=" + entityInstanceId;
        PDO.openFullWindow(url, "מסמכי ישות " + entityId);
    },

    openFullWindow: function (url, windowName) {

        var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        window.open(url, windowName, "width=" + width + ",height=" + height);
    },

    bridgeOpenDocumentWindow: function (entityId, entityInstanceId, actionName) {

        //Moj.loadMenuTab(actionName, undefined);
        PDO.openDocumentsWindow(entityId, entityInstanceId);
        //return false;
    },

    wizard: {

        reloadAllNexTabs: function () {
            var idActiveContent = MojFind(".wizard-content.active").attr('id');
            MojFind(".wizard-content").each(function (i, val) {
                var idItemContent = MojFind(val).attr('id');
                if (parseInt(idItemContent.substring(idItemContent.indexOf('_') + 1, idItemContent.length)) > parseInt(idActiveContent.substring(idActiveContent.indexOf('_') + 1, idActiveContent.length)))
                    $(this).remove();
            });
        },

        changePopUpTitle: function (title) {
            $("#PopUpWizard").data("kendoWindow").setOptions({ title: Resources.Strings.NewProcess + " - " + title })
        },
    },
};


function EntityMojFind(selector) {

    //Get entity from PrevSelectedTabContent if the popup is not wizard
    //&& Moj.Constants["PrevSelectedTabContent"].find(".k-window").length == 0
    if (Moj.Constants["PrevSelectedTabContent"] != null && MojFind(".main-menu[role=tablist]").length == 0)
        var object = $(Moj.Constants["PrevSelectedTabContent"]).find(selector);
    else
        var object = $(Moj.Constants["selectedTabContent"]).find(selector);
    return object;
};

$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    jqXHR.setRequestHeader('Guid', EntityMojFind("#Guid").val());
    jqXHR.setRequestHeader('IsReload', EntityMojFind("#IsReload").val());
});

function objectToQueryStringTreatment(values) {
    if (values == null) return "";
    else if (typeof (values) == "object")
        return objectToQueryStringParameters("", values, []);
    else if (typeof (values) == "string" && values != "")
        return "&" + values;
    return "";
}

function objectToQueryStringParameters(name, object, str) {

    for (var i in object) {
        if (typeof (object[i]) == "function") {
        } else if (typeof (object[i]) === 'object')
            objectToQueryString(name + getName(name, i), object[i], str);
        else {
            str[str.length] = ("&" + $('<input/>', {
                name: name + getName(name, i),
                value: object[i]
            }).serialize());
        }
    }
    return str;
}

function objectToQueryString(name, object, str) {

    for (var i in object) {
        if (typeof (object[i]) == "function") {
        } else if (typeof (object[i]) === 'object')
            objectToQueryString(name + getName(name, i), object[i], str);
        else {
            str[str.length] = ($('<input/>', {
                name: name + getName(name, i),
                value: object[i]
            }).serialize());
        }
    }
    return str;
}

function getName(name, i) {
    if (!isNaN(parseInt(i)))
        return "[" + i + "]";
    else
        return name != "" ? "." + i : i;
}

//String.prototype.format = function (args) {
//    var str = this;
//    return str.replace(String.prototype.format.regex, function (item) {
//        var intVal = parseInt(item.substring(1, item.length - 1));
//        var replace;
//        if (intVal >= 0) {
//            replace = args[intVal];
//        } else if (intVal === -1) {
//            replace = "{";
//        } else if (intVal === -2) {
//            replace = "}";
//        } else {
//            replace = "";
//        }
//        return replace;
//    });
//};

//String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

//String.format = function () {
//    // The string containing the format items (e.g. "{0}")
//    // will and always has to be the first argument.
//    var theString = arguments[0];

//    // start with the second argument (i = 1)
//    for (var i = 1; i < arguments.length; i++) {
//        // "gm" = RegEx options for Global search (more than one instance)
//        // and for Multiline search
//        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
//        theString = theString.replace(regEx, arguments[i]);
//    }

//    return theString;
//}

