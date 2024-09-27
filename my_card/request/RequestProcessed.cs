using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tinyServer.request
{
    class RequestProcessed
    {
        public Stream Stream { get; set; } 
        public string Body { get; set; } 
    }
}
