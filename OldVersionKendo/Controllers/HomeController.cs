using Moj.PDO.UI.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Moj.PDO.Entities.DataContracts.Common;

namespace NewVersionKendo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var model = new ProcessDetailsModel();

            for (int i = 0; i < 5; i++)
            {
                model.ProcessTypes.Add(new CodeTablePair() { Key = i, Value = "test" });
            }

            return View(model);
        }

        public ActionResult About()
        {
            //ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            //ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}