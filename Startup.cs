using CorrectPrice.Core.Engine.Contract;
using CorrectPrice.Core.Resource.Contract;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;

namespace CorrectPrice
{
    public class Startup
    {
        private static Dictionary<string, object> dependencyInjection;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            InitializeContainers();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

        public static object ResolveDependency(string contractName)
        {
            if (dependencyInjection.TryGetValue(contractName, out object value))
                return value;

            return null;
        }

        private void InitializeContainers()
        {
            dependencyInjection = new Dictionary<string, object>();

            IPriceCalculatorEngine priceCalculatorEngine = new Core.Engine.PriceCalculatorEngine();
            IProjectCollectionConfigResource projectCollectionConfigResource = new Core.Resource.ProjectCollectionConfigResource();
            IProjectConfigResource projectConfigResource = new Core.Resource.ProjectConfigResource();
            IRoughProductConfigurationResource roughProductConfigurationResource = new Core.Resource.RoughProductConfigurationResource();
            IFiniteProductConfigResource finiteProductConfigResource = new Core.Resource.FiniteProductConfigResource();
            IEarningsResource earningsResource = new Core.Resource.EarningsResource();
            IInvestmentsResource investmentsResource = new Core.Resource.InvestmentsResource();

            ILoginResource loginResource = new Core.Resource.LoginResource();

            Core.Contract.Configuration.IProjectCollectionConfigManager projectCollectionConfigManager = new Core.Manager.Configuration.ProjectCollectionConfigManager(projectCollectionConfigResource);
            Core.Contract.Configuration.IProjectConfigManager projectConfigManager = new Core.Manager.Configuration.ProjectConfigManager(projectConfigResource, projectCollectionConfigResource, finiteProductConfigResource, roughProductConfigurationResource, investmentsResource, earningsResource);
            Core.Contract.Configuration.IRoughProductConfigManager roughProductConfigManager = new Core.Manager.Configuration.RoughProductConfigManager(roughProductConfigurationResource);
            Core.Contract.Configuration.IFiniteProductConfigManager finiteProductConfigManager = new Core.Manager.Configuration.FiniteProductConfigManager(priceCalculatorEngine, finiteProductConfigResource, roughProductConfigurationResource);
            Core.Contract.Configuration.IFinanceManager financeManager = new Core.Manager.Configuration.FinanceManager(earningsResource, investmentsResource);

            Core.Contract.Login.ILoginManager loginManager = new Core.Manager.Login.LoginManager(loginResource);

            dependencyInjection.Add("Core.Contract.Configuration.IProjectCollectionConfigManager", projectCollectionConfigManager);
            dependencyInjection.Add("Core.Contract.Configuration.IProjectConfigManager", projectConfigManager);
            dependencyInjection.Add("Core.Contract.Configuration.IRoughProductConfigManager", roughProductConfigManager);
            dependencyInjection.Add("Core.Contract.Configuration.IFiniteProductConfigManager", finiteProductConfigManager);
            dependencyInjection.Add("Core.Contract.Configuration.IFinanceManager", financeManager);
            dependencyInjection.Add("Core.Contract.Login.ILoginManager", loginManager);
        }
    }
}
