using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using tinyServer.cli_ui;
using tinyServer.server;

namespace my_card
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;
            Console.WriteLine("Starting...");
            CliUi cliUi = new CliUi();
            int port = 8088;
            string url = $"http://localhost:{port}";
            var server = new Server(port);
            cliUi.ShowInfoWindow(new string[] {
                "--=App has been started=--",
                $"Server is running on port {port}...",
                $"data directory: {FileUtil.GetUserDir()}"
            });
            new Thread(() => {
                Thread.Sleep(1000);
                Console.WriteLine("Ready!");
                //System.Diagnostics.Process.Start(url);
            }).Start();
            server.Listen();
        }
    }
}
