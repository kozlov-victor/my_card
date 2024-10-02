using my_card.controller;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using tinyServer.request;
using tinyServer.response;

namespace tinyServer.controller
{

    class MethodContextHolder
    {
        public MethodInfo MethodInfo;
        public object obj;
        public RequestAttribute Attr;
    }

    class ControllerRegistry
    {

        private readonly List<MethodContextHolder> MethodList = new List<MethodContextHolder>();


       
        public ControllerRegistry()
        {
            var asmbly = Assembly.GetExecutingAssembly();
            var controllers = asmbly.GetTypes().Where(
                    t => t.GetCustomAttributes(typeof(ControllerAttribute), true).Length > 0
            ).ToList();

            foreach (var c in controllers)
            {
                var instance = c.GetConstructor(Type.EmptyTypes).Invoke(new object[]{});
                RegisterController(instance);
            }
        }

        private void RegisterController(object controller) 
        {
            Type myType = controller.GetType();
            // Get the public methods.
            MethodInfo[] methodInfos = myType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            foreach (MethodInfo method in methodInfos)
            {
                object[] attributes = method.GetCustomAttributes(typeof(RequestAttribute), true);
                if (attributes.Length == 0) continue;
                RequestAttribute attr = (RequestAttribute)attributes[0];
                MethodContextHolder methodContextHolder = new MethodContextHolder
                {
                    MethodInfo = method,
                    obj = controller,
                    Attr = attr
                };
                MethodList.Add(methodContextHolder);
            }
            
        }

        public Response TryToCallMethod(Request request) 
        {
            foreach (var m in MethodList) {
                if (m.Attr.Url==request.Url && m.Attr.Method==request.Method)
                {
                    Response response = new Response();
                    try
                    {
                        m.MethodInfo.Invoke(m.obj, new object[] { request, response });
                        return response;
                    }
                    catch(Exception e)
                    {
                        Console.Error.WriteLine(e);
                        response.Code = 500;
                        response.WriteText($"{e.Message}\n");
                        response.WriteText(e.ToString());
                        return response;
                    }
                }
            }
            return null;
            
        }



    }
}
