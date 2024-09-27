using System;
using System.Linq;





namespace tinyServer.cli_ui
{

    class CliUi
    {

        private string LeftPad(string str, int toLength) 
        {
            string pad = "";
            for (int i = str.Length; i < toLength; i++) pad += " ";
            return pad + str;
        }

        private string RightPad(string str, int toLength) 
        {
            string pad = "";
            for (int i = str.Length; i < toLength; i++) pad += " ";
            return str + pad;
        }

        private string CenterPad(string str, int toLength) 
        {
            string leftPadded = LeftPad(str, toLength / 2 + str.Length / 2);
            return RightPad(leftPadded, toLength);
        }

        private string GetLine(char symbol, int length) 
        {
            return new String(symbol, length);
        }

        private void ShowWindow (string[] strings, ConsoleColor colorBg, ConsoleColor colorFg, ConsoleColor colorShadow) 
        {

            
            int maxLength = strings.OrderByDescending(s => s.Length).First().Length;
            if (maxLength < 3) maxLength = 3;
            Console.Write("    ");
            Console.BackgroundColor = colorBg;
            Console.ForegroundColor = colorFg;
            Console.Write($"╔═▓{ GetLine('═', maxLength - 2)}╗");
            Console.ResetColor();
            Console.Write("\n");


            foreach (string s in strings) {
                Console.ResetColor();
                Console.Write("    ");
                Console.BackgroundColor = colorBg;
                Console.ForegroundColor = colorFg;
                Console.Write($"║{CenterPad(s, maxLength)}║");
                Console.BackgroundColor = colorShadow;
                Console.Write(" ");
                Console.ResetColor();
                Console.Write("\n");
            }

            Console.ResetColor();
            Console.Write("    ");
            Console.BackgroundColor = colorBg;
            Console.ForegroundColor = colorFg;

            Console.Write($"╚{GetLine('═', maxLength)}╝");
            Console.BackgroundColor = colorShadow;
            Console.Write(" ");
            Console.Write("\n");

            Console.ResetColor();
            Console.Write("     ");
            Console.BackgroundColor = colorShadow;
            Console.Write($" {GetLine(' ', maxLength)} ");
            Console.Write("\n");

            Console.ResetColor();
        }

        public void ShowInfoWindow(string[] text) 
        {
            ShowWindow(text, ConsoleColor.Blue, ConsoleColor.Cyan, ConsoleColor.Cyan);
        }

        public void ShowErrorWindow(string[] text)
        {
            ShowWindow(text, ConsoleColor.Magenta, ConsoleColor.White, ConsoleColor.Cyan);
        }

    }
}
