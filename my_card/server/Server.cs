using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using tinyServer.client;
using tinyServer.controller;

// Right click References and do Add Reference, then from Assemblies->Framework select System.Web

namespace tinyServer.server
{
    class Server
    {
        private readonly TcpListener Listener; // Объект, принимающий TCP-клиентов
        public static readonly ControllerRegistry ControllerRegistry = new ControllerRegistry();

        // Запуск сервера
        public Server(int Port)
        {
            Listener = new TcpListener(IPAddress.Any, Port); // Создаем "слушателя" для указанного порта
            Listener.Start(); // Запускаем его
        }

        public void Listen()
        {
            // В бесконечном цикле
            while (true)
            {
                // Принимаем нового клиента
                TcpClient client = Listener.AcceptTcpClient();
                // Создаем поток
                Thread thread = new Thread(new ParameterizedThreadStart(stateInfo=> {
                    new Client((TcpClient)stateInfo);
                }));
                thread.IsBackground = true;
                // И запускаем этот поток, передавая ему принятого клиента
                thread.Start(client);
            }
        }

       
        // Остановка сервера
        ~Server()
        {
            // Если "слушатель" был создан
            if (Listener != null)
            {
                // Остановим его
                Listener.Stop();
            }
        }

    }
}
