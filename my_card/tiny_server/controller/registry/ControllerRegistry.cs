using my_card.controller;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Script.Serialization;
using tinyServer.request;
using tinyServer.response;

namespace tinyServer.controller
{

    class Param
    {
        public bool IsRequestBody;
        public bool IsRequest;
        public bool IsResponse;
    }

    class MethodContextHolder
    {
        public MethodInfo MethodInfo;
        public object obj;
        public RequestAttribute Attr;
        public Param[] methodParams;
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
                    Attr = attr,
                    methodParams = new Param[method.GetParameters().Length]
                };
                int i = 0;
                foreach(ParameterInfo parameterInfo in method.GetParameters())
                {
                    var p = new Param();
                    methodContextHolder.methodParams[i] = p;
                    if (parameterInfo.GetCustomAttribute(typeof(RequestBody)) != null)
                    {
                        p.IsRequestBody = true;
                    }
                    else if (parameterInfo.ParameterType == typeof(Request))
                    {
                        p.IsRequest = true;
                    }
                    else if (parameterInfo.ParameterType == typeof(Response))
                    {
                        p.IsResponse = true;
                    }
                    else
                    {
                        throw new Exception($"unknown method parameter: {parameterInfo.ParameterType}");
                    }
                    i++;
                }
                MethodList.Add(methodContextHolder);
            }
            
        }

        private object[] GetMethodParameters(MethodContextHolder m, Request request, Response response)
        {
            var actualParameters = new object[m.methodParams.Length];
            for(int i=0;i<actualParameters.Length;i++)
            {
                var formalParameter = m.methodParams[i];
                if (formalParameter.IsRequest)
                {
                    actualParameters[i] = request;
                }
                else if (formalParameter.IsResponse)
                {
                    actualParameters[i] = response;
                }
                else if (formalParameter.IsRequestBody)
                {
                    actualParameters[i] = new JavaScriptSerializer().ConvertToType<SaveTemplateRequest>(request.BodyJSON);
                }
                else
                {
                    throw new Exception($"internal error: bad argument for method: {m.MethodInfo.Name}. Smth wrong with tinyServer");
                }
            }
            return actualParameters;
        }

        public Response TryToCallMethod(Request request) 
        {
            foreach (var m in MethodList) {
                if (m.Attr.Url==request.Url && m.Attr.Method==request.Method)
                {
                    Response response = new Response();
                    try
                    {
                        var parameters = GetMethodParameters(m, request, response);
                        Console.WriteLine($"{parameters}");
                        var result = m.MethodInfo.Invoke(m.obj, parameters);
                        if (result!=null)
                        {
                            response.WriteJSON(result);
                        }
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
