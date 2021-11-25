using System;

namespace CorrectPrice.Client.Models
{
    public class ProjectConfigurationDetails
    {
        public Guid ID { get; set; }

        public Guid ProjectCollectionID { get; set; }

        public RoughProductDetails[] RoughProductDetails { get; set; }

        public decimal TotalCostPerQuantityNeeded { get; set; }

        public decimal TotalCostPerQuantityToBuy { get; set; }

        public decimal TotalCostPerRemainQuantity { get; set; }
    }

    public class RoughProductDetails
    {
        public Guid ID { get; set; }

        public string Name { get; set; }

        public decimal QuantityNeeded { get; set; }
        
        public decimal QuantityToBuy { get; set; }

        public decimal RemainQuantity { get; set; }

        public decimal CostPerQuantityNeeded { get; set; }
        
        public decimal CostPerQuantityToBuy { get; set; }
        
        public decimal CostPerRemainQuantity { get; set; }
    }
}
