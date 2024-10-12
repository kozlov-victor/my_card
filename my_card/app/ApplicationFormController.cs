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

    class Extra
    {
        public String category { get; set; }
        public int? index { get; set; }
        public bool force { get; set; }
    }

    class SaveTemplateRequest
    {
        public Template template { get; set; }
        public Extra extra { get; set; }
    }

    class SaveTemplateResponse
    {
        public string result { get; set; }
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
            var saveTemplateRequest = new JavaScriptSerializer().ConvertToType<SaveTemplateRequest>(req.BodyJSON);
            var list = new JavaScriptSerializer().
                Deserialize<List<Template>>(FileUtil.ReadFile(saveTemplateRequest.extra.category, "[]"));

            var indexOf = list.FindIndex(it => it.templateName == saveTemplateRequest.template.templateName);
            if (indexOf==-1)
            {
                if (saveTemplateRequest.extra.index.HasValue)
                {
                    list[saveTemplateRequest.extra.index.Value] = saveTemplateRequest.template;
                }
                else
                {
                    list.Add(saveTemplateRequest.template);
                }
            }
            else
            {
                if (saveTemplateRequest.extra.index.HasValue)
                {
                    if (saveTemplateRequest.extra.index==indexOf)
                    {
                        list[saveTemplateRequest.extra.index.Value] = saveTemplateRequest.template;
                    }
                    else
                    {
                        if (!saveTemplateRequest.extra.force)
                        {
                            resp.WriteJSON(
                                new SaveTemplateResponse
                                {
                                    result = "duplication"
                                }
                            );
                            return;
                        }
                        else
                        {
                            list[saveTemplateRequest.extra.index.Value] = saveTemplateRequest.template;
                            list.RemoveAt(indexOf);
                        }
                    }
                }
                else
                {
                    if (!saveTemplateRequest.extra.force)
                    {
                        resp.WriteJSON(
                            new SaveTemplateResponse
                            {
                                result = "duplication"
                            }
                        );
                        return;
                    }
                    else
                    {
                        list[indexOf] = saveTemplateRequest.template;
                    }
                }
                resp.WriteJSON(
                    new SaveTemplateResponse
                    {
                        result = "ok"
                    }
                );
            }


            FileUtil.CreateFile(saveTemplateRequest.extra.category, new JavaScriptSerializer().Serialize(list));
        }


        [RequestAttribute(Url = "/delete-template", Method = "POST")]
        public void DeleteTemplate(Request req, Response resp)
        {
            var category = "" + req.BodyJSON["category"];
            var index = Convert.ToInt32(req.BodyJSON["index"]);
            var list = new JavaScriptSerializer().
                Deserialize<List<Template>>(FileUtil.ReadFile(category, "[]"));
            list.RemoveAt(index);
            FileUtil.CreateFile(category, new JavaScriptSerializer().Serialize(list));
        }


        [RequestAttribute(Url = "/get-my-templates", Method = "POST")]
        public void GetMyTemplates(Request req, Response resp)
        {
            var category = "" + req.BodyJSON["category"];
            var json = FileUtil.ReadFile(category, "[]");
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
