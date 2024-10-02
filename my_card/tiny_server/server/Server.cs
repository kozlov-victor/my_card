using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using tinyServer.client;
using tinyServer.controller;


namespace tinyServer.server
{
    class Server
    {
        private readonly TcpListener Listener; // to accept tcp clients
        public static readonly ControllerRegistry ControllerRegistry = new ControllerRegistry();

        // run server
        public Server(int Port)
        {
            Listener = new TcpListener(IPAddress.Any, Port); // create listener
            Listener.Start(); // run it
        }

        public void Listen()
        {
            while (true)
            {
                // accept new client
                TcpClient client = Listener.AcceptTcpClient();
                // create the thread
                Thread thread = new Thread(new ParameterizedThreadStart(stateInfo=> {
                    new Client((TcpClient)stateInfo);
                }));
                thread.IsBackground = true;
                // run it and pass a client
                thread.Start(client);
            }
        }

       
        ~Server()
        {
            if (Listener != null)
            {
                Listener.Stop();
            }
        }

    }
}
