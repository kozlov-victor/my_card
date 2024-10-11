using Spire.Doc;
using Spire.Doc.Documents;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace my_card.app
{
    class WordUtil
    {

        public byte[] Create(string html)
        {
            Document document = new Document();
            document.LoadHTML(new StringReader(html), XHTMLValidationType.None);
            Section sec = document.Sections[0];
            var strangeConstant = 72;
            sec.PageSetup.Margins.Top = (float)(0.59 * strangeConstant);
            sec.PageSetup.Margins.Bottom = (float)(0.5 * strangeConstant);
            sec.PageSetup.Margins.Left = (float)(0.59 * strangeConstant);
            sec.PageSetup.Margins.Right = (float)(0.5 * strangeConstant);
            var stream = new MemoryStream();
            document.SaveToStream(stream,FileFormat.Docx);
            return stream.ToArray();
        }

    }
}
