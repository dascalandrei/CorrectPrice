using System;
using System.Collections.Generic;
using System.Linq;
using CorrectPrice.Client.Models;
using CorrectPrice.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace CorrectPrice.Client.Controllers
{
    [ApiController]
    [Route("{controller}/{action}/")]
    public class ProjectConfigurationController : ControllerBase
    {
        private readonly Core.Contract.Configuration.IProjectCollectionConfigManager projectCollectionConfigManager;
        private readonly Core.Contract.Configuration.IProjectConfigManager projectConfigManager;
        private readonly Core.Contract.Configuration.IRoughProductConfigManager roughProductConfigManager;
        private readonly Core.Contract.Configuration.IFiniteProductConfigManager finiteProductConfigManager;

        public ProjectConfigurationController()
        {
            projectCollectionConfigManager = (Core.Contract.Configuration.IProjectCollectionConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectCollectionConfigManager");
            projectConfigManager = (Core.Contract.Configuration.IProjectConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectConfigManager");
            roughProductConfigManager = (Core.Contract.Configuration.IRoughProductConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IRoughProductConfigManager");
            finiteProductConfigManager = (Core.Contract.Configuration.IFiniteProductConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IFiniteProductConfigManager");
        }

        [HttpPost]
        public ProjectCollectionConfiguration[] ListAllProjectCollections()
        {
            Guid clientID = new Guid("EC29F557-E3EC-4FE6-8338-B0FB3F5B6A50");

            List<ProjectCollectionConfiguration> projectCollectionConfigurations = new List<ProjectCollectionConfiguration>();

            foreach (Core.Contract.Configuration.ProjectCollectionConfiguration projectCollectionConfiguration in projectCollectionConfigManager.ListAllProjectCollections(clientID))
                projectCollectionConfigurations.Add(ConvertToModel(projectCollectionConfiguration));

            return projectCollectionConfigurations.ToArray();
        }

        [HttpPost]
        public ProjectConfiguration[] ListAllProjects([FromForm]Guid projectCollectionID)
        {
            List<ProjectConfiguration> projectConfigurations = new List<ProjectConfiguration>();

            foreach (Core.Contract.Configuration.ProjectConfiguration projectConfiguration in projectConfigManager.ListAllProjects(projectCollectionID))
                projectConfigurations.Add(ConvertToModel(projectConfiguration));

            return projectConfigurations.ToArray();
        }

        [HttpPost]
        public RoughProductConfiguration[] ListAllRoughProductConfigurationsByCollection(Guid projectCollectionID)
        {
            List<RoughProductConfiguration> roughProductConfigurations = new List<RoughProductConfiguration>();

            foreach (Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration in roughProductConfigManager.ListAllRoughProductConfigurationsByCollection(projectCollectionID))
                roughProductConfigurations.Add(ConvertToModel(roughProductConfiguration));

            return roughProductConfigurations.ToArray();
        }

        [HttpPost]
        public RoughProductConfiguration[] ListAllRoughProductConfigurationsByProject(Guid projectID)
        {
            List<RoughProductConfiguration> roughProductConfigurations = new List<RoughProductConfiguration>();

            foreach (Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration in roughProductConfigManager.ListAllRoughProductConfigurationsByProject(projectID))
                roughProductConfigurations.Add(ConvertToModel(roughProductConfiguration));

            return roughProductConfigurations.ToArray();
        }

        [HttpPost]
        public FiniteProductConfiguration[] ListAllFiniteProductConfigurationsByProject(Guid projectID)
        {
            List<FiniteProductConfiguration> finiteProductConfigurations = new List<FiniteProductConfiguration>();

            foreach (Core.Contract.Configuration.FiniteProductConfiguration finiteProductConfiguration in finiteProductConfigManager.ListAllFiniteProductConfigurationsByProject(projectID))
                finiteProductConfigurations.Add(ConvertToModel(finiteProductConfiguration));

            return finiteProductConfigurations.ToArray();
        }

        [HttpPost]
        public void UpdateProjectCollectionConfiguration(ProjectCollectionConfiguration projectCollectionConfiguration)
        {
            projectCollectionConfigManager.UpdateProjectCollectionConfiguration(ConvertToContract(projectCollectionConfiguration));
        }

        [HttpPost]
        public void UpdateProjectConfiguration(ProjectConfiguration projectConfiguration)
        {
            projectConfigManager.UpdateProjectConfiguration(ConvertToContract(projectConfiguration));
        }
        
        [HttpPost]
        public void UpdateRoughProductConfiguration(RoughProductConfiguration roughProductConfiguration)
        {
            roughProductConfigManager.UpdateRoughProductConfiguration(ConvertToContract(roughProductConfiguration));
        }

        [HttpPost]
        public void UpdateFiniteProductConfiguration(FiniteProductConfiguration finiteProductConfiguration)
        {
            finiteProductConfigManager.UpdateFiniteProductConfiguration(ConvertToContract(finiteProductConfiguration));
        }

        [HttpPost]
        public void DeleteProjectCollectionConfiguration([FromForm] Guid id)
        {
            projectCollectionConfigManager.DeleteProjectCollectionConfiguration(id);
        }

        [HttpPost]
        public void DeleteProjectConfiguration([FromForm] Guid id)
        {
            projectConfigManager.DeleteProjectConfiguration(id);
        }

        [HttpPost]
        public void DeleteRoughProductConfiguration([FromForm] Guid id)
        {
            roughProductConfigManager.DeleteRoughProductConfiguration(id);
        }

        [HttpPost]
        public void DeleteFiniteProductConfiguration([FromForm] Guid id)
        {
            finiteProductConfigManager.DeleteFiniteProductConfiguration(id);
        }

        private ProjectCollectionConfiguration ConvertToModel(Core.Contract.Configuration.ProjectCollectionConfiguration projectCollectionConfiguration)
        {
            return new ProjectCollectionConfiguration()
            {
                ID = projectCollectionConfiguration.ID,
                ClientID = projectCollectionConfiguration.ClientID,
                Name = projectCollectionConfiguration.Name,
                Description = projectCollectionConfiguration.Description
            };
        }
        
        private Core.Contract.Configuration.ProjectCollectionConfiguration ConvertToContract(ProjectCollectionConfiguration projectCollectionConfiguration)
        {
            return new Core.Contract.Configuration.ProjectCollectionConfiguration()
            {
                ID = projectCollectionConfiguration.ID,
                ClientID = projectCollectionConfiguration.ClientID,
                Name = projectCollectionConfiguration.Name,
                Description = projectCollectionConfiguration.Description
            };
        }

        private ProjectConfiguration ConvertToModel(Core.Contract.Configuration.ProjectConfiguration projectConfiguration)
        {
            return new ProjectConfiguration()
            {
                ID = projectConfiguration.ID,
                ProjectCollectionID = projectConfiguration.ProjectCollectionID,
                Name = projectConfiguration.Name,
                Description = projectConfiguration.Description
            };
        }

        private Core.Contract.Configuration.ProjectConfiguration ConvertToContract(ProjectConfiguration projectConfiguration)
        {
            return new Core.Contract.Configuration.ProjectConfiguration()
            {
                ID = projectConfiguration.ID,
                ProjectCollectionID = projectConfiguration.ProjectCollectionID,
                Name = projectConfiguration.Name,
                Description = projectConfiguration.Description
            };
        }

        private RoughProductConfiguration ConvertToModel(Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration)
        {
            return new RoughProductConfiguration()
            {
                ID = roughProductConfiguration.ID,
                ProjectCollectionID = roughProductConfiguration.ProjectCollectionID,
                ProjectID = roughProductConfiguration.ProjectID,
                Name = roughProductConfiguration.Name,
                Description = roughProductConfiguration.Description,
                EffectiveDate = roughProductConfiguration.EffectiveDate,
                Quantity = roughProductConfiguration.Quantity,
                UnitOfMeasure = (UnitOfMeasure)roughProductConfiguration.UnitOfMeasure,
                Cost = roughProductConfiguration.Cost
            };
        }

        private Core.Contract.Configuration.RoughProductConfiguration ConvertToContract(RoughProductConfiguration roughProductConfiguration)
        {
            return new Core.Contract.Configuration.RoughProductConfiguration()
            {
                ID = roughProductConfiguration.ID,
                ProjectCollectionID = roughProductConfiguration.ProjectCollectionID,
                ProjectID = roughProductConfiguration.ProjectID,
                Name = roughProductConfiguration.Name,
                Description = roughProductConfiguration.Description,
                EffectiveDate = roughProductConfiguration.EffectiveDate,
                Quantity = roughProductConfiguration.Quantity,
                UnitOfMeasure = (Core.Contract.Configuration.UnitOfMeasure)roughProductConfiguration.UnitOfMeasure,
                Cost = roughProductConfiguration.Cost
            };
        }

        private FiniteProductConfiguration ConvertToModel(Core.Contract.Configuration.FiniteProductConfiguration finiteProductConfiguration)
        {
            return new FiniteProductConfiguration()
            {
                ID = finiteProductConfiguration.ID,
                ProjectID = finiteProductConfiguration.ProjectID,
                Name = finiteProductConfiguration.Name,
                Description = finiteProductConfiguration.Description,
                Cost = finiteProductConfiguration.Cost,
                ProductDetails = finiteProductConfiguration.ProductDetails.Select(x => ConvertToModel(x)).ToArray()
            };
        }

        private ProductDetails ConvertToModel(Core.Contract.Configuration.ProductDetails productDetails)
        {
            return new ProductDetails()
            {
                RoughProductID = productDetails.RoughProductID,
                Name = productDetails.Name,
                Cost = productDetails.Cost,
                Quantity = productDetails.Quantity
            };
        }

        private Core.Contract.Configuration.FiniteProductConfiguration ConvertToContract(FiniteProductConfiguration finiteProductConfiguration)
        {
            return new Core.Contract.Configuration.FiniteProductConfiguration()
            {
                ID = finiteProductConfiguration.ID,
                ProjectID = finiteProductConfiguration.ProjectID,
                Name = finiteProductConfiguration.Name,
                Description = finiteProductConfiguration.Description,
                ProductDetails = finiteProductConfiguration.ProductDetails.Select(x => ConvertToContract(x)).ToArray()
            };
        }

        private Core.Contract.Configuration.ProductDetails ConvertToContract(ProductDetails productDetails)
        {
            return new Core.Contract.Configuration.ProductDetails()
            {
                RoughProductID = productDetails.RoughProductID,
                Quantity = productDetails.Quantity
            };
        }
    }
}