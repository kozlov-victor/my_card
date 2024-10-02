using System;
using System.Collections.Generic;
using System.Text;

namespace tinyServer.controller
{
    [AttributeUsage(AttributeTargets.Method, Inherited = false)]
    class RequestAttribute:Attribute
    {
        public string Url;
        public string Method;
    }

    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    class ControllerAttribute : Attribute
    {
        
    }

}
