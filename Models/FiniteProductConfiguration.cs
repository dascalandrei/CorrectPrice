using System;

namespace CorrectPrice.Client.Models
{
    public class FiniteProductConfiguration
    {
        public Guid ID { get; set; }

        public Guid ProjectID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Cost { get; set; }

        public ProductDetails[] ProductDetails { get; set; }
    }

    public class ProductDetails
    {
        public Guid RoughProductID { get; set; }

        public string Name { get; set; }

        public decimal Cost { get; set; }

        public decimal Quantity { get; set; }
    }
}