using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Expressions;
using System.Net;
using System.Net.Sockets;
using System.Text;
using tinyServer.io;
using tinyServer.request;
using tinyServer.response;
using tinyServer.server;

namespace tinyServer.client
{
    // Класс-обработчик клиента
    class Client
    {

        public Client(TcpClient client)
        {

            var io = new IO();

            var req = io.ReadRequest(client);

            Request request = RequestParser.Parse(req);
            Response response = Server.ControllerRegistry.TryToCallMethod(request);
            if (response != null) io.Send(response, client);
            else io.ReadAndSendLocalFile(request.Url, client);
        }
    }
}
