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
        private readonly Core.Contract.Configuration.IFinanceManager financeManager;

        private static readonly Guid ClientID = new Guid("EC29F557-E3EC-4FE6-8338-B0FB3F5B6A50");

        public ProjectConfigurationController()
        {
            projectCollectionConfigManager = (Core.Contract.Configuration.IProjectCollectionConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectCollectionConfigManager");
            projectConfigManager = (Core.Contract.Configuration.IProjectConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IProjectConfigManager");
            roughProductConfigManager = (Core.Contract.Configuration.IRoughProductConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IRoughProductConfigManager");
            finiteProductConfigManager = (Core.Contract.Configuration.IFiniteProductConfigManager)Startup.ResolveDependency("Core.Contract.Configuration.IFiniteProductConfigManager");
            financeManager = (Core.Contract.Configuration.IFinanceManager)Startup.ResolveDependency("Core.Contract.Configuration.IFinanceManager");
        }

        [HttpPost]
        public ProjectCollectionConfiguration DetailProjectCollection([FromForm]Guid projectCollectionID)
        {
            return ConvertToModel(projectCollectionConfigManager.DetailProjectCollection(projectCollectionID));
        }

        [HttpPost]
        public ProjectConfigurationDetails DetailProjectConfigurationDetails([FromForm] Guid projectID)
        {
            return ConvertToModel(projectConfigManager.DetailProjectConfigurationDetails(projectID));
        }

        [HttpPost]
        public CashFlowData DetailCashFlowData([FromForm]string startDate, [FromForm]string endDate)
        {
            return ConvertToModel(financeManager.DetailCashFlowData(ClientID, DateTime.Parse(startDate), DateTime.Parse(endDate)));
        }

        [HttpPost]
        public ProjectCollectionConfiguration[] ListAllProjectCollections()
        {
            List<ProjectCollectionConfiguration> projectCollectionConfigurations = new List<ProjectCollectionConfiguration>();

            foreach (Core.Contract.Configuration.ProjectCollectionConfiguration projectCollectionConfiguration in projectCollectionConfigManager.ListAllProjectCollections(ClientID))
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
        public RoughProductConfiguration[] ListAllRoughProductConfigurationsByCollection([FromForm]Guid projectCollectionID)
        {
            List<RoughProductConfiguration> roughProductConfigurations = new List<RoughProductConfiguration>();

            foreach (Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration in roughProductConfigManager.ListAllRoughProductConfigurationsByCollection(projectCollectionID))
                roughProductConfigurations.Add(ConvertToModel(roughProductConfiguration));

            return roughProductConfigurations.ToArray();
        }

        [HttpPost]
        public RoughProductConfiguration[] ListAllRoughProductConfigurationsByProject([FromForm]Guid projectID)
        {
            List<RoughProductConfiguration> roughProductConfigurations = new List<RoughProductConfiguration>();

            foreach (Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration in roughProductConfigManager.ListAllRoughProductConfigurationsByProject(projectID))
                roughProductConfigurations.Add(ConvertToModel(roughProductConfiguration));

            return roughProductConfigurations.ToArray();
        }

        [HttpPost]
        public FiniteProductConfiguration[] ListAllFiniteProductConfigurationsByProject([FromForm]Guid projectID)
        {
            List<FiniteProductConfiguration> finiteProductConfigurations = new List<FiniteProductConfiguration>();

            foreach (Core.Contract.Configuration.FiniteProductConfiguration finiteProductConfiguration in finiteProductConfigManager.ListAllFiniteProductConfigurationsByProject(projectID))
                finiteProductConfigurations.Add(ConvertToModel(finiteProductConfiguration));

            return finiteProductConfigurations.ToArray();
        }

        [HttpPost]
        public EarningsItem[] ListAllEarnings()
        {
            return ConvertToModel(financeManager.ListAllEarnings(ClientID));
        }

        [HttpPost]
        public InvestmentItem[] ListAllInvestments()
        {
            return ConvertToModel(financeManager.ListAllInvestments(ClientID));
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
        public void UpdateEarningsItem(EarningsItem earningsItem)
        {
            this.financeManager.UpdateEarningItem(ConvertToContract(earningsItem));
        }

        [HttpPost]
        public void UpdateInvestmentItem(InvestmentItem investmentItem)
        {
            this.financeManager.UpdateInvestmentItem(ConvertToContract(investmentItem));
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
        public void DeleteRoughProductCollectionConfiguration([FromForm] Guid id)
        {
            roughProductConfigManager.DeleteRoughProductCollectionConfiguration(id);
        }

        [HttpPost]
        public void DeleteFiniteProductConfiguration([FromForm] Guid id)
        {
            finiteProductConfigManager.DeleteFiniteProductConfiguration(id);
        }

        [HttpPost]
        public void DeleteEarningsItem([FromForm]Guid id)
        {
            financeManager.DeleteEarningItem(id);
        }

        [HttpPost]
        public void DeleteInvestmentItem([FromForm]Guid id)
        {
            financeManager.DeleteInvestmentItem(id);
        }

        [HttpPost]
        public FiniteProductConfiguration CalculateFiniteProductCosts(FiniteProductConfiguration finiteProductConfiguration)
        {
            return ConvertToModel(finiteProductConfigManager.CalculateFiniteProductCosts(ConvertToContract(finiteProductConfiguration)));
        }

        [HttpPost]
        public void CloseProject([FromForm] Guid id, [FromForm] string closingDate)
        {
            projectConfigManager.CloseProject(id, DateTime.Parse(closingDate));
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
                Description = projectConfiguration.Description,
                CloseDate = projectConfiguration.CloseDate
            };
        }

        private Core.Contract.Configuration.ProjectConfiguration ConvertToContract(ProjectConfiguration projectConfiguration)
        {
            return new Core.Contract.Configuration.ProjectConfiguration()
            {
                ID = projectConfiguration.ID,
                ProjectCollectionID = projectConfiguration.ProjectCollectionID,
                Name = projectConfiguration.Name,
                Description = projectConfiguration.Description,
                CloseDate = projectConfiguration.CloseDate
            };
        }

        private RoughProductConfiguration ConvertToModel(Core.Contract.Configuration.RoughProductConfiguration roughProductConfiguration)
        {
            return new RoughProductConfiguration()
            {
                ID = roughProductConfiguration.ID,
                ProjectCollectionID = roughProductConfiguration.ProjectCollectionID,
                ProjectID = roughProductConfiguration.ProjectID,
                ImportedID = roughProductConfiguration.ImportedID,
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
                ImportedID = roughProductConfiguration.ImportedID,
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
                Name = productDetails.Name,
                Quantity = productDetails.Quantity
            };
        }

        private Core.Contract.Configuration.EarningsItem ConvertToContract(EarningsItem earningsItem)
        {
            return new Core.Contract.Configuration.EarningsItem()
            {
                ID = earningsItem.ID,
                Details = earningsItem.Details,
                Cost = earningsItem.Cost,
                Date = earningsItem.Date,
                ProjectID = earningsItem.ProjectID,
                ProjectCollectionID = earningsItem.ProjectCollectionID,
                ClientID = earningsItem.ClientID
            };
        }

        private Core.Contract.Configuration.InvestmentItem ConvertToContract(InvestmentItem investmentItem)
        {
            return new Core.Contract.Configuration.InvestmentItem()
            {
                ID = investmentItem.ID,
                Name = investmentItem.Name,
                Description = investmentItem.Description,
                Cost = investmentItem.Cost,
                Date = investmentItem.Date,
                ProjectID = investmentItem.ProjectID,
                ProjectCollectionID = investmentItem.ProjectCollectionID,
                ClientID = investmentItem.ClientID
            };
        }

        private ProjectConfigurationDetails ConvertToModel(Core.Contract.Configuration.ProjectConfigurationDetails projectConfigurationDetails)
        {
            return new ProjectConfigurationDetails()
            {
                ID = projectConfigurationDetails.ID,
                ProjectCollectionID = projectConfigurationDetails.ProjectCollectionID,
                RoughProductDetails = projectConfigurationDetails.RoughProductDetails.Select(x => ConvertToModel(x)).ToArray(),
                TotalCostPerQuantityNeeded = projectConfigurationDetails.TotalCostPerQuantityNeeded,
                TotalCostPerQuantityToBuy = projectConfigurationDetails.TotalCostPerQuantityToBuy,
                TotalCostPerRemainQuantity = projectConfigurationDetails.TotalCostPerRemainQuantity
            };
        }

        private RoughProductDetails ConvertToModel(Core.Contract.Configuration.RoughProductDetails roughProductDetails)
        {
            return new RoughProductDetails()
            {
                ID = roughProductDetails.ID,
                Name = roughProductDetails.Name,
                CostPerQuantityNeeded = roughProductDetails.CostPerQuantityNeeded,
                CostPerQuantityToBuy = roughProductDetails.CostPerQuantityToBuy,
                CostPerRemainQuantity = roughProductDetails.CostPerRemainQuantity,
                QuantityNeeded = roughProductDetails.QuantityNeeded,
                QuantityToBuy = roughProductDetails.QuantityToBuy,
                RemainQuantity = roughProductDetails.RemainQuantity
            };
        }

        private EarningsItem[] ConvertToModel(Core.Contract.Configuration.EarningsItem[] earningsItem)
        {
            return earningsItem.Select(x =>
            {
                return new EarningsItem()
                {
                    ID = x.ID,
                    Details = x.Details,
                    Cost = x.Cost,
                    Date = x.Date,
                    ProjectID = x.ProjectID,
                    ProjectCollectionID = x.ProjectCollectionID,
                    ClientID = x.ClientID
                };
            }).ToArray();
        }

        private InvestmentItem[] ConvertToModel(Core.Contract.Configuration.InvestmentItem[] investmentItem)
        {
            return investmentItem.Select(x =>
            {
                return new InvestmentItem()
                {
                    ID = x.ID,
                    Name = x.Name,
                    Description = x.Description,
                    Cost = x.Cost,
                    Date = x.Date,
                    ProjectID = x.ProjectID,
                    ProjectCollectionID = x.ProjectCollectionID,
                    ClientID = x.ClientID
                };
            }).ToArray();
        }

        private CashFlowData ConvertToModel(Core.Contract.Configuration.CashFlowData cashFlowData)
        {
            return new CashFlowData()
            {
                CashFlowDataByMonth = cashFlowData.CashFlowDataByMonth.Select(x => ConvertToModel(x)).ToArray()
            };
        }

        private CashFlowDataByMonth ConvertToModel(Core.Contract.Configuration.CashFlowDataByMonth cashFlowDataByMonth)
        {
            return new CashFlowDataByMonth()
            {
                Name = cashFlowDataByMonth.Name,
                StartDate = cashFlowDataByMonth.StartDate,
                EndDate = cashFlowDataByMonth.EndDate,
                EarningsItems = ConvertToModel(cashFlowDataByMonth.EarningsItems),
                InvestmentItems = ConvertToModel(cashFlowDataByMonth.InvestmentItems),
                CashFlow = cashFlowDataByMonth.CashFlow
            };
        }
    }
}