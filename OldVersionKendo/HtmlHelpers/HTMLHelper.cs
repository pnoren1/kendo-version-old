using Kendo.Mvc.UI;
using Moj.Infrastructure.MVC.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;

namespace System.Web.Mvc.Html
{
    public static class HTMLHelper
    {

        public static MvcHtmlString ComboBox<TModel, TValue, T>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression,
                                                       int LabelWidth, int DropDownListWidth, IEnumerable<T> dataSource, int SelectedIndex, string PlaceHolderText = "", FilterType filterType = FilterType.StartsWith, string LabelText = null, bool? IsEnable = null, bool IsVisible = true,
                                                       int minLength = 1, string DataTextField = "Value", string DataValueField = "Key", bool AllowCustomString = false, string groupByField = "GroupBy", bool isGrouping = false, object htmlAttributes = null, object externalHtmlAttributes = null, object wrapHtmlAttributes = null, bool? IsRequiredIndication = null, bool IsAcceptSearchValidation = false, string cachObjectName = null)
        {
            IsEnable = true;
            bool IsSearch = (bool)(htmlHelper.ViewContext.RouteData.Values["Action"].ToString().Contains("Search"));
            ModelMetadata metadata = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);

            string selectedValue = null;
            //Fix bug - if model is enum or item in List<T> - set specific selected value \ when using UserControl
            var prefix = htmlHelper.ViewData.TemplateInfo.HtmlFieldPrefix;
            string id = ExpressionHelper.GetExpressionText(expression).Replace('.', '_').Replace('[', '_').Replace(']', '_');
            if (!string.IsNullOrEmpty(prefix))
                id = HtmlHelperUtilities.JoinPrefixToId(prefix, id);

            if (!string.IsNullOrEmpty(prefix) || metadata.Model is Enum || ExpressionHelper.GetExpressionText(expression).Contains('['))
                selectedValue = metadata.Model == null ? null : Convert.ToInt32(metadata.Model).ToString();
            if ((metadata.Model is int && (int)metadata.Model == 0) || (metadata.Model is short && (short)metadata.Model == 0))
                selectedValue = "";
            if (metadata.Model is Enum && (int)metadata.Model == 0)
                selectedValue = null;

            object constHtmlAttribute = new { @class = "form-control", originalIndex = selectedValue ?? metadata.Model };

            if (AllowCustomString)
                constHtmlAttribute = HtmlHelperUtilities.MergeAttributes(constHtmlAttribute, new { allowCustomString = "true" });
            var newHtmlAttribute = HtmlHelperUtilities.MergeAttributes(htmlAttributes, constHtmlAttribute);
            newHtmlAttribute = HtmlHelperUtilities.AddGroupsValidationAttributes(metadata, newHtmlAttribute);
            newHtmlAttribute = HtmlHelperUtilities.AddRequiredAttributes(metadata, newHtmlAttribute, IsSearch, IsRequiredIndication);
            string dataBoundEventString = string.Empty;
            if (newHtmlAttribute.ContainsKey("aria-required"))
                dataBoundEventString = " e.sender.element.parent().find(\"input[name*='_input']\").attr('aria-required','true');";
            if (!(bool)IsEnable)
                dataBoundEventString += "  MojFind(\"[id='" + id + "']\").removeAttr(\"disabled\"); MojFind(\"[id='" + id + "']\").attr(\"readonly\",\"true\");";
            // ComboBox div 
            TagBuilder DropDownListTagBuilder = new TagBuilder("div");
            if (wrapHtmlAttributes != null)
                DropDownListTagBuilder.MergeAttributes(wrapHtmlAttributes.ToDictionary());

            DropDownListTagBuilder.Attributes.Add("id", "div_" + metadata.PropertyName);
            DropDownListTagBuilder.AddCssClass(GetColWidth(DropDownListWidth, htmlHelper, isVisible: IsVisible));
            bool IsHidden = false;
            HtmlHelperUtilities.AddPermissionsSupport(htmlHelper, expression, ref IsEnable, ref IsHidden, ref newHtmlAttribute, DropDownListTagBuilder);
            if (!IsVisible)
                DropDownListTagBuilder.AddCssClass("hide");

            if (IsLoadDropDownsDataByAjax() || cachObjectName != null)
            {
                htmlHelper.ViewContext.Controller.TempData[cachObjectName ?? id] = dataSource;
            }



            DropDownListTagBuilder.InnerHtml = htmlHelper.Kendo().ComboBoxFor(expression)
                                                           //.Placeholder(string.IsNullOrEmpty(PlaceHolderText) ? (IsSearch ? Resource.All : Resource.Choose) : PlaceHolderText)
                                                           .DataTextField(DataTextField)
                                                           .DataValueField(DataValueField)
                                                           .Filter(filterType)
                                                           .BindTo(dataSource)
                                                           .Value(selectedValue)
                                                           .SelectedIndex(SelectedIndex)
                                                           .Enable((bool)IsEnable)
                                                           .Suggest(true)
                                                           .HighlightFirst(true)
                                                           .MinLength(minLength)
                                                           .HtmlAttributes(newHtmlAttribute)
                                                           //.NoDataTemplate(Resource.NoDataFound)
                                                           //.ClearButton(false)
                                                           .Template("<div class='k-item moj-ellipsis' title='#= data." + DataTextField + "#'>#= data." + DataTextField + "#</div>")
                                                           .DataSource(source => source.Custom().Group(g =>
                                                           {
                                                               if (isGrouping)
                                                                   g.Add(groupByField, typeof(string));
                                                               if (IsLoadDropDownsDataByAjax() && cachObjectName == null)
                                                                   source.Read(read =>
                                                                   {
                                                                       read.Action("GetDropDownData", "Moj", new { dropDownName = id }); //Set the Action and Controller names.
                                                                   });
                                                           }))
                                                           .Events(e => e.Change("function (e) {MojFind(\"[name='\" +  e.sender.element[0].id.replace('_', '.') + \"_input']\").attr('title', e.sender.element.data('kendoComboBox').text());}").Open("Moj.HtmlHelpers.openDropDown"))
                                                           //.Events(e => e.DataBound("function (e) { Moj.HtmlHelpers.removeNotActive(e); e.sender.element.parent().find(\"input[name*='_input']\").attr('aria-label','" + metadata.DisplayName.Replace("'", "") + "');" + dataBoundEventString + "}"))
                                                           .ToHtmlString()
                                                           + ((IsSearch && !IsAcceptSearchValidation) ? String.Empty : (IsSearch ? String.Empty : String.Empty));

            //Support Multi Files
            DropDownListTagBuilder.InnerHtml = DropDownListTagBuilder.InnerHtml.Replace("jQuery(\"#", "MojFind(\"[id='");
            int i = DropDownListTagBuilder.InnerHtml.IndexOf("MojFind(\"[id='");
            i = DropDownListTagBuilder.InnerHtml.IndexOf("\"", i + 11);
            DropDownListTagBuilder.InnerHtml = DropDownListTagBuilder.InnerHtml.Insert(i, "']");
            if (cachObjectName != null)
            {
                DropDownListTagBuilder.InnerHtml = DropDownListTagBuilder.InnerHtml.Replace("</script>", $"Moj.HtmlHelpers.getDropDownsClienDataSource('{cachObjectName}','{id}','kendoComboBox')</script>");
            }
            //if (!(bool)IsEnable)
            //{
            //string id = ExpressionHelper.GetExpressionText(expression).Replace('.', '_');
            //if (!string.IsNullOrEmpty(prefix))
            //id = HtmlHelperUtilities.JoinPrefixToId(prefix, id);
            //remove disabled attribute from input- for submit.

            //DropDownListTagBuilder.InnerHtml = DropDownListTagBuilder.InnerHtml.Replace("</script", "$(\"#" + id + "\").removeAttr(\"disabled\");$(\"#" + id + "\").attr(\"readonly\",\"true\");</script");
            //}

            LabelWidth = 0;
            string MvcHtmlStringContent = HtmlHelperUtilities.GetLabelFor(htmlHelper, LabelWidth, expression, LabelText, IsVisible: IsVisible, IsRequiredIndication: IsRequiredIndication, IsHidden: IsHidden)
                                    + DropDownListTagBuilder.ToString(TagRenderMode.Normal);
            MvcHtmlStringContent = HtmlHelperUtilities.AddExternalDiv(externalHtmlAttributes, MvcHtmlStringContent);


            //return MvcHtmlString.Create("<div class=\"col txt-left col-txt col-sm-2\" id=\"div_label_ProcessTypeId\" style=\"width: 130px\"><label for='ProcessTypeId'>סוג הליך</label></div><div class=\"col - sm - 2 col\" id=\"div_ProcessTypeId\" style=\"width: 180px\"><input class=\"form-control\" data-val=\"true\" data-val-number=\"שדה סוג הליך חייב להיות מספר.\" id=\"ProcessTypeId\" name=\"ProcessTypeId\" originalIndex=\"\" style=\"width: 180px\" type=\"text\" /><script> kendo.syncReady(function(){ MojFind(\"[id='ProcessTypeId']\").kendoComboBox({ \"change\":function(e) { MojFind(\"[name='\" + e.sender.element[0].id.replace('_', '.') + \"_input']\").attr('title', e.sender.element.data('kendoComboBox').text()); },\"open\":Moj.HtmlHelpers.openDropDown,\"dataBound\":function(e) { Moj.HtmlHelpers.removeNotActive(e); e.sender.element.parent().find(\"input[name*='_input']\").attr('aria-label', 'סוג הליך'); },\"dataSource\":{ \"data\":[{\"Key\":69,\"Value\":\"ss\",\"IsActive\":true,\"GroupBy\":null},{\"Key\":53,\"Value\":\"בקשה לביטול שחרור על תנאי (הפקעה)\",\"IsActive\":true,\"GroupBy\":null}]},\"dataTextField\":\"Value\",\"filter\":\"startswith\",\"minLength\":1,\"template\":\"\u003cdiv class=\u0027k-item moj-ellipsis\u0027 title=\u0027#= data.Value#\u0027\u003e#= data.Value#\u003c/div\u003e\",\"clearButton\":false,\"dataValueField\":\"Key\",\"highlightFirst\":true,\"placeholder\":\"הכל\",\"suggest\":true});}); </script></div>");

            return MvcHtmlString.Create(MvcHtmlStringContent);
        }

        private static bool IsLoadDropDownsDataByAjax()
        {
            return false;
        }


        public static string GetColWidth(int width, HtmlHelper helper = null, bool isLabel = false, bool isVisible = true)
        {
            var containerWidth = 100;
            if (helper != null)
            {
                var PopWidth = 100;
                if (PopWidth != null)
                {
                    containerWidth = Convert.ToInt32(PopWidth);
                }
            }
            if (helper != null && helper.ViewContext.RequestContext.HttpContext.Items.Contains("PartWidth"))
            {
                var PartWidth = helper.ViewContext.RequestContext.HttpContext.Items["PartWidth"];
                if (PartWidth != null)
                {
                    containerWidth = Convert.ToInt32(PartWidth);
                }
            }

            double ratio = width * 100 / containerWidth;
            double bootstrapWidth = 12 * ratio / 100;// + 1;
            if (bootstrapWidth < 1) bootstrapWidth = 1;
            if (isLabel && bootstrapWidth > 1 && bootstrapWidth % 1 >= 0)
                bootstrapWidth += 0.5;
            int colWidth = Convert.ToInt32(bootstrapWidth);

            var IsHandleFields = false;
            if (helper != null && helper.ViewContext.RequestContext.HttpContext.Items.Contains("IsHandleFields") && Convert.ToBoolean(helper.ViewContext.RequestContext.HttpContext.Items["IsHandleFields"]))
            { IsHandleFields = true; }

            int Increase = 0;
            if (helper != null && helper.ViewContext.RequestContext.HttpContext.Items.Contains("ColsIncrease"))
                Increase = Convert.ToInt32(helper.ViewContext.RequestContext.HttpContext.Items["ColsIncrease"]);

            if (Increase + colWidth > 12)
                colWidth = 12 - Increase;
            if (IsHandleFields && isVisible && helper != null)
                helper.ViewContext.RequestContext.HttpContext.Items["ColsIncrease"] = Increase + colWidth;

            return "col-sm-" + colWidth;
        }

    }
}