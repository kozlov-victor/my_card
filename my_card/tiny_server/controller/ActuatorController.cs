using System;
using System.Collections.Generic;
using tinyServer.request;
using tinyServer.response;


namespace tinyServer.controller
{
    [ControllerAttribute()]
    class ActuatorController
    {

        [RequestAttribute(Url = "/health", Method = "GET")]
        public void HealthGet(Request req, Response resp)
        {
            resp.WriteText($"system is <b>alive</b>: {DateTime.Now}","text/html");
        }

        //(async () => {
        // const rawResponse = await fetch('/testPost', {
        //    method: 'POST',
        //    headers: {
        //      'Accept': 'application/json',
        //      'Content-Type': 'application/json'
        //    },
        //   body: JSON.stringify({name:'postMan'})
        // });
        // const content = await rawResponse.json();
        // console.log(content);
        //})();

        [RequestAttribute(Url = "/health", Method = "POST")]
        public void HealthPost(Request req, Response resp)
        {
            resp.WriteJSON(new Dictionary<string, object> {
                { "response", $"system is alive: {DateTime.Now}" }
            });
        }

       

    }


}
