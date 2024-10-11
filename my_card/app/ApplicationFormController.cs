using System;
using System.Collections.Generic;
using tinyServer.controller;
using tinyServer.request;
using tinyServer.response;

using System.IO;
using System.Web.Script.Serialization;
using my_card.app;

namespace my_card.controller
{

    class Template
    {
        public String templateName { get; set; }
        public String content{ get; set; }
    }

    [ControllerAttribute()]
    class ApplicationFormController
    {

        private PdfUtil pdfUtil = new PdfUtil();
        private WordUtil wordUtil = new WordUtil();

        [RequestAttribute(Url = "/save-session", Method = "POST")]
        public void SaveSession(Request req, Response resp)
        {
            var json = new JavaScriptSerializer().Serialize(req.BodyJSON);
            FileUtil.CreateFile("session", json);
        }

        [RequestAttribute(Url = "/load-session", Method = "POST")]
        public void LoadSession(Request req, Response resp)
        {
            var json = FileUtil.ReadFile("session","{}");

            resp.WriteJSON(new JavaScriptSerializer().DeserializeObject(json));
        }

        [RequestAttribute(Url = "/save-as-template", Method = "POST")]
        public void SaveAsTemplate(Request req, Response resp)
        {
            var name = "" + req.BodyJSON["name"];
            var template = new JavaScriptSerializer().ConvertToType<Template>(req.BodyJSON);
            var json = FileUtil.ReadFile(name,"[]");
            var list = new JavaScriptSerializer().Deserialize<List<Template>>(json);
            list.Add(template);
            FileUtil.CreateFile(name, new JavaScriptSerializer().Serialize(list));
        }

        [RequestAttribute(Url = "/get-my-templates", Method = "POST")]
        public void GetMyTemplates(Request req, Response resp)
        {
            var name = "" + req.BodyJSON["name"];
            var json = FileUtil.ReadFile(name, "[]");
            var list = new JavaScriptSerializer().Deserialize<List<Template>>(json);
            resp.WriteJSON(list);
        }

        [RequestAttribute(Url = "/save-print-session", Method = "POST")]
        public void SavePrintSession(Request req, Response resp)
        {
            var html = req.BodyJSON["html"];
            var title = req.BodyJSON["title"];
            FileUtil.CreateFile("print-session", new JavaScriptSerializer().Serialize(req.BodyJSON));
        }

        [RequestAttribute(Url = "/pdf", Method = "GET")]
        public void GetPdf(Request req, Response resp)
        {
            var json = FileUtil.ReadFile("print-session", "{}");
            var printSession = new JavaScriptSerializer().Deserialize<Dictionary<string,string>>(json);
            var html = printSession["html"];
            var title = printSession["title"];
            resp.Headers.Add("Content-Disposition", $"inline; filename={title}.pdf");
            resp.WriteByteArray(pdfUtil.Create(html), "application/pdf");
        }


        [RequestAttribute(Url = "/word", Method = "GET")]
        public void GetWord(Request req, Response resp)
        {
            var json = FileUtil.ReadFile("print-session", "{}");
            var printSession = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(json);
            var html = printSession["html"];
            var title = printSession["title"];
            resp.Headers.Add("Content-Disposition", $"attachment; filename={title}.docx");
            resp.WriteByteArray(wordUtil.Create(html), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        }


    }
}
