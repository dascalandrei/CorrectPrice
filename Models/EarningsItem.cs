using System;

namespace CorrectPrice.Client.Models
{
    public class EarningsItem
    {
        public Guid ID { get; set; }

        public string Details { get; set; }

        public DateTime Date { get; set; }

        public decimal Cost { get; set; }

        public Guid ProjectID { get; set; }

        public Guid ProjectCollectionID { get; set; }

        public Guid ClientID { get; set; }
    }
}
