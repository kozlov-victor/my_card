using System;
using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using tinyServer.multipart;

namespace tinyServer.request
{
    class RequestParser
    {


        private static Dictionary<string, string> ParseQueryString(string query)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            if (query == "") return result;
            string[] pairs = query.Split(new char[] { '&' });
            foreach (string pair in pairs)
            {
                string[] keyValue = pair.Split(new char[] { '=' });
                string key = keyValue[0];
                if (key.Contains("\r")) key = key.Replace("\r", string.Empty);
                string value = keyValue.Length == 2 ? WebUtility.UrlDecode(keyValue[1]) : null;
                if (!result.ContainsKey(key)) result.Add(key, value);
            }
            return result;
        }

        public static Request Parse(RequestProcessed requestProcessed)
        {

            using (requestProcessed.Stream)
            {
                // method
                string[] lines = requestProcessed.Body.Split(new char[] { '\n' });
                int cnt = 0;
                string firstLine = lines[cnt++];
                string[] parts = firstLine.Split(new char[] { ' ' });
                Request request = new Request
                {
                    Method = parts[0].ToUpper()
                };

                // uri and query params
                Match reqMatch = Regex.Match(requestProcessed.Body, @"^\w+\s+([^\s]+)[^\s]*\s+HTTP/.*|");
                string url = reqMatch.Groups[1].Value;
                string[] requestUriParts = url.Split(new char[] { '?' });
                string requestUri = requestUriParts[0];
                string requestParamsStr = requestUriParts.Length == 2 ? requestUriParts[1] : "";
                string uri = Uri.UnescapeDataString(requestUri);
                request.Url = uri;
                request.QueryParams = ParseQueryString(requestParamsStr);

                // headers
                for (; cnt < lines.Length; cnt++)
                {
                    string line = lines[cnt];
                    if (string.IsNullOrWhiteSpace(line)) break;
                    string[] keyVal = line.Split(new char[] { ':' });
                    string key = keyVal[0].Trim().ToLower();
                    string val = keyVal.Length == 2 ? keyVal[1].Trim() : "";
                    request.Headers.Add(key, val);
                }

                request.Headers.TryGetValue("Content-Type", out string contentType);
                if (contentType == null)
                {
                    request.Headers.TryGetValue("content-type", out contentType);
                }

                // body
                string reqBody = "";
                for (; cnt < lines.Length; cnt++)
                {
                    reqBody += lines[cnt];
                }
                if (cnt <= lines.Length - 1) reqBody = lines[cnt];

                if (contentType == "application/json")
                {
                    try
                    {
                        request.BodyJSON = new JavaScriptSerializer().DeserializeObject(reqBody) as Dictionary<string, object>;
                    }
                    catch (Exception e)
                    {
                        Console.Error.WriteLine(e.StackTrace);
                    }
                }
                else if (contentType == "text/plain")
                {
                    request.BodyText = reqBody;
                }
                else if (contentType?.StartsWith("multipart/form-data") ?? false)
                {
                    var multipartParser = new MultipartParser();
                    var boundary = multipartParser.GetBoundary(contentType);
                    var (files, dict) = multipartParser.Parse(requestProcessed.Stream, boundary);
                    request.BodyUrlEncoded = dict;
                    request.multipartFiles = files;
                }
                else if (contentType == "application/x-www-form-urlencoded")
                {
                    request.BodyUrlEncoded = ParseQueryString(reqBody);
                }
                return request;
            }
        }

    }
}
