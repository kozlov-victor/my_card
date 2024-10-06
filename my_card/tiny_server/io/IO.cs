using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using tinyServer.request;
using tinyServer.response;

namespace tinyServer.io
{
    class IO
    {
        private readonly static string n = "\n";

        private static string StreamToString(Stream stream)
        {
            stream.Position = 0;
            StreamReader reader = new StreamReader(stream, Encoding.UTF8);
            return reader.ReadToEnd();
        }

        public RequestProcessed ReadRequest(TcpClient client)
        {
            var memStream = new MemoryStream();
            var stream = client.GetStream();
            if (stream.CanRead)
            {
                byte[] readBuffer = new byte[2048 * 2];
                do
                {
                    int numberOfBytesRead = stream.Read(readBuffer, 0, readBuffer.Length);
                    System.Threading.Thread.Sleep(1);
                    memStream.Write(readBuffer, 0, numberOfBytesRead);
                }
                while (stream.DataAvailable);
                memStream.Flush();

                var body = StreamToString(memStream);

                memStream.Position = 0;
                return new RequestProcessed
                {
                    Body = body,
                    Stream = memStream
                };
            }
            else
            {
                return new RequestProcessed
                {
                    Body = "",
                    Stream = memStream
                };
            }
        }

        public void Send(Response resp, TcpClient client)
        {

            try
            {
                string respCodeStr = $"{resp.Code} {(HttpStatusCode)resp.Code}";
                string headers = $"HTTP/1.1 {resp.Code} {respCodeStr}{n}";
                headers += $"Content-Type: {resp.ContentType}{n}";
                headers += $"Content-Length: {resp.Stream.Length}{n}";
                foreach(var kv in resp.Headers)
                {
                    headers += $"{kv.Key}: {kv.Value}{n}";
                }
                headers += $"{n}";
                byte[] headersBuffer = Encoding.UTF8.GetBytes(headers);
                client.GetStream().Write(headersBuffer, 0, headersBuffer.Length);
                int count;
                byte[] buffer = new byte[2048*2];
                while (resp.Stream.Position < resp.Stream.Length)
                {
                    count = resp.Stream.Read(buffer, 0, buffer.Length);
                    client.GetStream().Write(buffer, 0, count);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                try
                {
                    resp.Stream.Close();
                    client.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        public void ReadAndSendLocalFile(string requestUri, TcpClient client)
        {
            // Если в строке содержится двоеточие, передадим ошибку 400
            // Это нужно для защиты от URL типа http://example.com/../../file.txt
            if (requestUri.IndexOf("..") >= 0)
            {
                var response = new Response
                {
                    Code = 400
                };
                Send(response, client);
                return;
            }

            // Если строка запроса оканчивается на "/", то добавим к ней index.html
            if (requestUri.EndsWith("/"))
            {
                requestUri += "index.html";
            }

            string filePath = "./" + requestUri;


            // Если в папке не существует данного файла, посылаем ошибку 404
            if (!File.Exists(filePath))
            {
                var response = new Response
                {
                    Code = 404
                };
                Send(response, client);
                return;
            }

            // Получаем расширение файла из строки запроса
            string extension = requestUri.Substring(requestUri.LastIndexOf('.'));

            // Тип содержимого
            string contentType;

            // Пытаемся определить тип содержимого по расширению файла
            switch (extension)
            {
                case ".htm":
                case ".html":
                    contentType = "text/html";
                    break;
                case ".css":
                    contentType = "text/css";
                    break;
                case ".js":
                    contentType = "text/javascript";
                    break;
                case ".jpg":
                    contentType = "image/jpeg";
                    break;
                case ".jpeg":
                case ".png":
                case ".gif":
                    contentType = "image/" + extension.Substring(1);
                    break;
                default:
                    if (extension.Length > 1)
                    {
                        contentType = "application/" + extension.Substring(1);
                    }
                    else
                    {
                        contentType = "application/unknown";
                    }
                    break;
            }

            Stream sourceStream;
            try
            {
                sourceStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            }
            catch (Exception e)
            {
                var response = new Response
                {
                    Code = 500,
                };
                response.WriteText(e.StackTrace);
                Send(response, client);
                return;
            }
            var resp = new Response
            {
                Stream = sourceStream,
                ContentType = contentType
            };
            Send(resp, client);

        }

    }
}
