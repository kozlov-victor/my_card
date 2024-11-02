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
    class Client
    {

        public Client(TcpClient tcpClient)
        {

            var io = new IO();

            var req = io.ReadRequest(tcpClient);

            Request request = RequestParser.Parse(req);
            Response response = Server.ControllerRegistry.TryToCallMethod(request);
            if (response != null) io.Send(response, tcpClient);
            else io.ReadAndSendLocalFile(request.Url, tcpClient);
        }
    }
}
