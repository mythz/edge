using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack.Text;

namespace Echo
{
    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            Console.WriteLine("input: " + (input ?? "null").GetType().Name);
            var objArr = input as object[];
            if (objArr != null)
            {
                Console.WriteLine("type: object[], element {0}", objArr.Length > 0 ? objArr[0] : "null");
                if (objArr.Length > 0)
                {
                    var obj = objArr[0] as Dictionary<string, object>;
                    if (obj != null)
                    {
                        Console.WriteLine("element: Dictionary<string,object>, Keys: " + string.Join(", ", obj.Keys.ToArray()));
                    }
                }
            }

            return input;
        }

        public async Task<object> DeserializeJson(object input)
        {
            var json = (string)input;
            var to = json.FromJson<List<Customer>>();
            return to.Count;
        }

        public async Task<object> DeserializeObject(object input)
        {
            var objArray = (object[])input;
            var to = (from Dictionary<string, object> map in objArray
                      select new Customer
                      {
                          Id = (string)map["Id"],
                          CompanyName = (string)map["CompanyName"],
                          ContactName = (string)map["ContactName"],
                          ContactTitle = (string)map["ContactTitle"],
                          Address = (string)map["Address"],
                          City = (string)map["City"],
                          Region = (string)map["Region"],
                          PostalCode = (string)map["PostalCode"],
                          Country = (string)map["Country"],
                          Phone = (string)map["Phone"],
                          Fax = (string)map["Fax"],
                          Email = (string)map["Email"],
                      }).ToList();

            return to.Count;
        }
    }

    public class Customer
    {
        public string Id { get; set; }
        public string CompanyName { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }

        public Customer Copy()
        {
            return new Customer
            {
                Id = Id,
                CompanyName = CompanyName,
                ContactName = ContactName,
                ContactTitle = ContactTitle,
                Address = Address,
                City = City,
                Region = Region,
                PostalCode = PostalCode,
                Country = Country,
                Phone = Phone,
                Fax = Fax,
                Email = Email,
            };
        }
    }
}
