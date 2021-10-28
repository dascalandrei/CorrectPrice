using System;

namespace CorrectPrice.Client.Models
{
    public class ProjectConfiguration
    {
        public Guid ID { get; set; }

        public Guid ProjectCollectionID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
