using System;

namespace CorrectPrice.Client.Models
{
    public class InvestmentItem
    {
        public Guid ID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }

        public decimal Cost { get; set; }

        public Guid? ProjectID { get; set; }

        public Guid? ProjectCollectionID { get; set; }

        public Guid ClientID { get; set; }
    }
}
