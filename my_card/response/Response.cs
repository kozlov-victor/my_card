
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
        public int Code{ set; get; } = 200;
        public void WriteJSON(object obj)
        {
            string json = new JavaScriptSerializer().Serialize(obj);
            ContentType = "application/json";
            Stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
        }

        public void WriteText(string text)
        {
            ContentType = "text/plain";
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
