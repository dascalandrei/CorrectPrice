using System;

namespace CorrectPrice.Client.Models
{
    [Serializable]
    public class ProjectCollectionConfiguration
    {
        public Guid ID { get; set; }

        public Guid ClientID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}