using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace my_card
{
    class FileUtil
    {

        public static string GetUserDir()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "my_card_data");
            if (!Directory.Exists(path)) {
                Directory.CreateDirectory(path);
            }
            return path;
        }

        public static void CreateFile(string name, string context)
        {
            var path = Path.Combine(FileUtil.GetUserDir(), name + ".mcd");
            File.WriteAllText(path, context);
        }

        public static string ReadFile(string name, string defaultValue)
        {
            var path = Path.Combine(FileUtil.GetUserDir(), name + ".mcd");
            if (!File.Exists(path)) return defaultValue;
            return File.ReadAllText(path);
        }

    }
}
