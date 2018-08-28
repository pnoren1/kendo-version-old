using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Moj.PDO.Entities.DataContracts.Common
{
    public class CodeTablePair
    {
        public int Key { get; set; }

        public string Value { get; set; }

        public bool IsActive { get; set; }

        public string GroupBy { get; set; }

        public CodeTablePair()
        {
            IsActive = true;
        }
    }
    public class CodeTableObjectPair
    {
        public object Key { get; set; }

        public string Value { get; set; }
    }

    public class CodeTableStringPair
    {
        public string Key { get; set; }

        public string Value { get; set; }
    }

    public class CodeTablePairComparer : IEqualityComparer<CodeTablePair>
    {
        public bool Equals(CodeTablePair x, CodeTablePair y)
        {

            //Check whether the compared objects reference the same data. 
            if (Object.ReferenceEquals(x, y)) return true;

            //Check whether any of the compared objects is null. 
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
                return false;

            //Check whether the products' properties are equal. 
            return x.Key == y.Key && x.Value == y.Value;
        }

        // If Equals() returns true for a pair of objects  
        // then GetHashCode() must return the same value for these objects. 
        public int GetHashCode(CodeTablePair pair)
        {
            //Check whether the object is null 
            if (Object.ReferenceEquals(pair, null)) return 0;

            //Get hash code for the Name field if it is not null. 
            int hashProductName = pair.Value == null ? 0 : pair.Value.GetHashCode();

            //Get hash code for the Code field. 
            int hashProductCode = pair.Key.GetHashCode();

            //Calculate the hash code for the product. 
            return hashProductName ^ hashProductCode;
        }
    }

    public static class CodeTablePairExtensions
    {
        public static void RemoveKey(this List<CodeTablePair> list, int key)
        {
            list.RemoveAll(a => a.Key == key);
        }
    }
}
