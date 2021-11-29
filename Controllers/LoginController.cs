using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CorrectPrice.Client.Controllers
{
    [ApiController]
    [Route("{controller}/{action}/")]
    public class LoginController : ControllerBase
    {
        private readonly Core.Contract.Login.ILoginManager loginManager;

        public LoginController()
        {
            loginManager = (Core.Contract.Login.ILoginManager)Startup.ResolveDependency("Core.Contract.Login.ILoginManager");
        }

        [HttpPost]
        public bool ValidateClient([FromForm]string username, [FromForm]string password)
        {
            Guid? clientID = loginManager.ValidateClient(username, password);

            if (!clientID.HasValue)
                return false;

            CookieOptions cookieOptions = new CookieOptions()
            {
                Expires = (DateTime.UtcNow).AddMinutes(30),
                HttpOnly = true,
            };

            HttpContext.Response.Cookies.Append("ClientID", clientID.ToString(), cookieOptions);

            return true;
        }
    }
}