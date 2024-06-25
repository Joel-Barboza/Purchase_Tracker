using Microsoft.AspNetCore.Mvc;

namespace Purchase_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectController : ControllerBase
    {
        [HttpGet]
        public string ConnectToServer()
        {
            return "Ok()";
        }
    }
}
