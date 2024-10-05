using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Web;
using tinyServer.multipart;

namespace tinyServer.request
{
    class Request
    {

        public string Url;
        public Dictionary<string, string> QueryParams = new Dictionary<string, string>();
        public Dictionary<string, string> Headers = new Dictionary<string, string>();
        public Dictionary<string, object> BodyJSON = new Dictionary<string, object>();
        public string BodyText;
        public Dictionary<string, string> BodyUrlEncoded = new Dictionary<string, string>();
        public List<MultipartFile> multipartFiles = new List<MultipartFile>();
        public string Method;

    }
}
