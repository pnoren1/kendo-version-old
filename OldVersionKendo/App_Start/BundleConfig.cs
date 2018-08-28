using System.Web;
using System.Web.Optimization;

namespace NewVersionKendo
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = false;

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-1.12.3.min.js", "~/Scripts/jquery-migrate-1.2.1.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery-ui").Include(
                // "~/Scripts/jquery/jquery-ui-1.8.11.js", 
                "~/Scripts/jquery/jquery.qtip.min.js",
                "~/Scripts/jquery/jquery.qtip.validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate.min.js",
                "~/Scripts/jquery.validate.unobtrusive.min.js",
          "~/Scripts/jquery.unobtrusive-ajax.min.js",
           "~/Scripts/plugins/jquery.maskedinput*"));

            // The Kendo JavaScript bundle
            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                    //"~/Scripts/kendo/kendo.web.min.js", // or kendo.all.* if you want to use Kendo UI Web and Kendo UI DataViz
                    // "~/Scripts/kendo/kendo.all.js",
                    "~/Scripts/kendo/kendo.all.min.js",
                    "~/Scripts/kendo/kendo.culture.he-IL.min.js",
                    "~/Scripts/kendo/kendo.aspnetmvc.*",
                    "~/Scripts/kendo/kendo.timezones.min.js"
                    ));

            bundles.Add(new ScriptBundle("~/bundles/common").Include(
                "~/Scripts/Common/MojCommon.js",
                "~/Scripts/Common/MojControls.js",
                "~/Scripts/Common/MojCommon.Override.js",
                "~/Scripts/Common/MojControls.Override.js",
                "~/Scripts/Common/EnumDefinitions.js",
                "~/Scripts/Common/CommonSignalR.js",
                "~/Scripts/Common/custom.validations.js",
                "~/Scripts/Common/custom.validations.pdo.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/mvcfoolproof").Include(
                "~/Scripts/Common/mvcfoolproof.unobtrusive.js",
                "~/Scripts/Common/MvcFoolproofJQueryValidation.js"));

            bundles.Add(new ScriptBundle("~/Scripts/bootstrap").Include("~/Scripts/bootstrap.js"));

            // The Kendo CSS bundle
            bundles.Add(new StyleBundle("~/content/kendo/kendo").Include(
                    "~/Content/kendo/kendo.common.min.css",
                    "~/Content/kendo/kendo.default.min.css"));
            //"~/Content/kendo/kendo.rtl.min.css" - Add this if you added the SaveAsPDF function - Export Kendo Grid To PDF

            bundles.Add(new StyleBundle("~/Content/bootstrap/bootstrap").Include(
                    "~/Content/bootstrap/css/bootstrap.css",
                    "~/Content/bootstrap/css/bootstrap-theme.css",
                    "~/Content/bootstrap/css/bootstrap-rtl.css"));


            bundles.Add(new StyleBundle("~/content/common/common").Include(
                "~/Content/Common/kendo.overrides.css",
                "~/Content/Common/jqueryui.overrides.css",
                "~/Content/Common/moj-common.css",
                //"~/Content/Common/moj-bo.css",
                "~/Content/Common/moj-tabs.css",
                "~/Content/Common/moj-layout.css",
                "~/Content/Common/moj-wizard.css",
                //"~/Content/Common/moj-website.css",
                "~/Content/Common/moj-forms.css",
                "~/Content/Common/moj-fonts.css",
                "~/Content/Common/moj-window.css",
                "~/Content/Common/moj-bo.css",
                "~/Content/Common/pdo-common.css",
                "~/Content/Documents/Document.css",
                "~/Content/Common/moj-tabs-vertical.css",
                "~/Content/Nominations/Nominations.css"));

            bundles.Add(new StyleBundle("~/Content/jquery/jquery-ui").Include(
                "~/Content/jquery/themes/base/jquery.ui.all.css",
                "~/Content/jquery/themes/base/jquery.qtip.css"));

            bundles.Add(new ScriptBundle("~/Scripts/jquery/signalr").Include(
                "~/Scripts/SignalR/jquery.signalR-1.2.2.js",
                "~/Scripts/SignalR/Moj.SignalR.PubSub.js",
                "~/Scripts/SignalR/Moj.SignalR.js"));

            // Clear all items from the default ignore list to allow minified CSS and JavaScript files to be included in debug mode
            bundles.IgnoreList.Clear();

            // Add back the default ignore list rules sans the ones which affect minified files and debug mode
            bundles.IgnoreList.Ignore("*.intellisense.js");
            bundles.IgnoreList.Ignore("*-vsdoc.js");
            bundles.IgnoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
        }
    }
}
