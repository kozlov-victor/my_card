using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tinyServer.multipart
{
    class MultipartFileRaw
    {
        public string Header { get; set; }
        public string Info { get; set; }
        public MemoryStream Stream { get; set; }
    }

    class MultipartFile
    {
        public string ContentType { get; set; }
        public string Name { get; set; }
        public MemoryStream Stream { get; set; }
    }

}
