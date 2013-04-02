using System;
using System.Collections.Generic;
using System.IO;
using Funq;
using ServiceStack.ServiceHost;
using ServiceStack.Text;
using ServiceStack.WebHost.Endpoints;

namespace Echo.ServiceStack.HttpListener
{
    public class AppHost : AppHostHttpListenerBase
    {
        public AppHost() : base("ServiceStack HttpListener Benchmarks", typeof(AppHost).Assembly) { }
        public override void Configure(Container container) { }
    }

    public static class Program
    {
        public static void Main(string[] args)
        {
            var appHost = new AppHost();
            appHost.Init();
            appHost.Start("http://*:3000/");

            "Listening on: http://localhost:3000/ ...".Print();
            Console.ReadKey();
        }
    }

    [Route("/text")]
    public class RawRequest : IRequiresRequestStream
    {
        public Stream RequestStream { get; set; }
    }

    [Route("/json")]
    public class Request : List<Customer> { }

    public class Response
    {
        public string Result { get; set; }
    }

    public class MyService : IService
    {
        static int counter;

        public string Any(RawRequest request)
        {
            using (var sr = new StreamReader(request.RequestStream))
            {
                var body = sr.ReadToEnd();

                return body;
            }
        }

        public List<Customer> Any(Request request)
        {
            return request.ConvertAll(x => x.Copy());
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
