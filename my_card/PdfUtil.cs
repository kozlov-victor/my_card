using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using iText.Html2pdf;
using iText.Kernel.Pdf;
using iText.Kernel.Events;
using iText.Kernel.Font;
using iText.Layout.Font;
using System.IO;

namespace my_card
{
    class PdfUtil
    {

        private ConverterProperties Properties;

        public PdfUtil()
        {
            FontProvider provider = new FontProvider();
            provider.AddFont(Path.Combine(Environment.CurrentDirectory, "fonts", "ArialBold.ttf"));
            provider.AddFont(Path.Combine(Environment.CurrentDirectory, "fonts", "ArialBoldItalic.ttf"));
            provider.AddFont(Path.Combine(Environment.CurrentDirectory, "fonts", "ArialRegular.ttf"));
            provider.AddFont(Path.Combine(Environment.CurrentDirectory, "fonts", "ArialUni.ttf"));

            Properties = new ConverterProperties();
            Properties.SetFontProvider(provider);
        }

        public byte[] Create(string html)
        {
            var stream = new MemoryStream();
            HtmlConverter.ConvertToPdf(html, stream, Properties);
            return stream.ToArray();
        }

        

    }
}
