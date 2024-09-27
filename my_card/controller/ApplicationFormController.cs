using System;
using System.Collections.Generic;
using tinyServer.controller;
using tinyServer.request;
using tinyServer.response;

using System.IO;
using System.Web.Script.Serialization;

namespace my_card.controller
{

    class Template
    {
        public String templateName { get; set; }
        public String content{ get; set; }
    }

    class ApplicationFormController
    {

        private PdfUtil pdfUtil = new PdfUtil();

        [ControllerAttribute(Url = "/save-session", Method = "POST")]
        public void SaveSession(Request req, Response resp)
        {
            var json = new JavaScriptSerializer().Serialize(req.BodyJSON);
            FileUtil.CreateFile("session", json);
        }

        [ControllerAttribute(Url = "/load-session", Method = "POST")]
        public void LoadSession(Request req, Response resp)
        {
            var json = FileUtil.ReadFile("session","{}");

            resp.WriteJSON(new JavaScriptSerializer().DeserializeObject(json));
        }

        [ControllerAttribute(Url = "/save-as-template", Method = "POST")]
        public void SaveAsTemplate(Request req, Response resp)
        {
            var name = "" + req.BodyJSON["name"];
            var template = new JavaScriptSerializer().ConvertToType<Template>(req.BodyJSON);
            var json = FileUtil.ReadFile(name,"[]");
            var list = new JavaScriptSerializer().Deserialize<List<Template>>(json);
            list.Add(template);
            FileUtil.CreateFile(name, new JavaScriptSerializer().Serialize(list));
        }

        [ControllerAttribute(Url = "/get-my-templates", Method = "POST")]
        public void GetMyTemplates(Request req, Response resp)
        {
            var name = "" + req.BodyJSON["name"];
            var json = FileUtil.ReadFile(name, "[]");
            var list = new JavaScriptSerializer().Deserialize<List<Template>>(json);
            resp.WriteJSON(list);
        }

        [ControllerAttribute(Url = "/save-print-session", Method = "POST")]
        public void SavePrintSession(Request req, Response resp)
        {
            var html = req.BodyJSON["html"].ToString();
            FileUtil.CreateFile("print-session", html);
        }

        [ControllerAttribute(Url = "/pdf", Method = "GET")]
        public void Test(Request req, Response resp)
        {

            var html = FileUtil.ReadFile("print-session", "no data to print");
            resp.WriteByteArray(pdfUtil.Create(html),"application/pdf");
        }

    }
}
