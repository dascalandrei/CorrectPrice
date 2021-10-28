using System;
using System.Collections.Generic;
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

        public ProjectConfigurationController()
        {
            projectCollectionConfigManager = (Core.Contract.Configuration.IProjectCollectionConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectCollectionConfigManager");
            projectConfigManager = (Core.Contract.Configuration.IProjectConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectConfigManager");
            roughProductConfigManager = (Core.Contract.Configuration.IRoughProductConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IRoughProductConfigManager");
        }

        [HttpPost]
        public ProjectCollectionConfiguration[] ListAllProjectCollections()
        {
            Guid clientID = Guid.NewGuid();

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
    }
}