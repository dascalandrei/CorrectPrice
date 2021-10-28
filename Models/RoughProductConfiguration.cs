using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace CorrectPrice.Client.Models
{
    public class RoughProductConfiguration
    {
        public Guid ID { get; set; }

        public Guid? ProjectCollectionID { get; set; }

        public Guid? ProjectID { get; set; }

        public DateTime EffectiveDate { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Quantity { get; set; }

        public UnitOfMeasure UnitOfMeasure { get; set; }

        public decimal Cost { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum UnitOfMeasure
    {
        None = 0,
        Buc = 1,
        Gram = 22,
        Kg = 24,
    }
}
