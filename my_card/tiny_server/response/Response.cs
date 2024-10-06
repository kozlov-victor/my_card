
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;

namespace tinyServer.response
{
    class Response
    {

        public Stream Stream { set; get; } = new MemoryStream(Encoding.UTF8.GetBytes(""));
        public string ContentType { set; get; } = "text/plain";
        public Dictionary<string, string> Headers { set; get; } = new Dictionary<string, string>();
        public int Code{ set; get; } = 200;

        public void WriteJSON(object obj)
        {
            string json = new JavaScriptSerializer().Serialize(obj);
            ContentType = "application/json";
            Stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
        }

        public void WriteText(string text)
        {
            WriteText(text, "text/plain");
        }

        public void WriteText(string text, string contentType)
        {
            ContentType = contentType;
            Stream = new MemoryStream(Encoding.UTF8.GetBytes(text));
        }

        public void WriteByteArray(byte[] arr, string contentType)
        {
            ContentType = contentType;
            Stream = new MemoryStream(arr);
        }

        public void WriteStream(Stream stream, string contentType)
        {
            ContentType = contentType;
            Stream = stream;
        }

    }
}
