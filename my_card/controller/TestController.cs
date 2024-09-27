using System;
using System.Collections.Generic;
using tinyServer.request;
using tinyServer.response;


namespace tinyServer.controller
{
    class TestController
    {

        [ControllerAttribute(Url = "/test", Method = "GET")]
        public void Test(Request req, Response resp)
        {
            req.QueryParams.TryGetValue("name", out string name);
            resp.WriteJSON(new Dictionary<string, object> {
                { "response", $"hello, {name} (проверка кирилицы)" }
            });
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

        [ControllerAttribute(Url = "/testPost", Method = "POST")]
        public void TestPost(Request req, Response resp)
        {
            req.BodyJSON.TryGetValue("name", out object name);
            resp.WriteJSON(new Dictionary<string, object> {
                { "response", $"hello, {name} from post" }
            });
        }

       

    }


}
