using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using Moj.PDO.Entities;
using Moj.PDO.Entities.DataContracts.Common;

namespace Moj.PDO.UI.ViewModels
{
    public class ProcessDetailsModel
    {
        public ProcessDetailsModel() {

            ProcessTypes = new List<CodeTablePair>();
        }

        public int ProcessTypeId { get; set; }

        public List<CodeTablePair> ProcessTypes { get; set; }
    }


}