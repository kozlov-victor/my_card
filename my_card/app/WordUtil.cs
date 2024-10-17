using Spire.Doc;
using Spire.Doc.Documents;
using Spire.Doc.Fields;
using Spire.Doc.Interface;
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

        private IList<IDocumentObject> GetAllObjects(Document document)
        {

            //Create a list.
            List<IDocumentObject> nodes = new List<IDocumentObject>();

            //Create a new queue.
            Queue<ICompositeObject> containers = new Queue<ICompositeObject>();

            //Put the document objects in the queue.
            containers.Enqueue(document);
            while (containers.Count > 0)
            {
                ICompositeObject container = containers.Dequeue();
                var docObjects = container.ChildObjects;
                foreach (DocumentObject docObject in docObjects)
                {
                    nodes.Add(docObject);

                    //Judge the docObject.
                    if (docObject is ICompositeObject)
                    {
                        containers.Enqueue(docObject as ICompositeObject);
                    }
                }
            }

            return nodes;
        }

        private void FixImage(Document document)
        {
            var nodes = GetAllObjects(document);
            foreach (IDocumentObject node in nodes)
            {
                if (node.DocumentObjectType == DocumentObjectType.Picture)
                {
                    DocPicture picture = node as DocPicture;
                    picture.TextWrappingStyle = TextWrappingStyle.Behind;
                    picture.HorizontalPosition = (float)(0.02 * 72);
                    //picture.VerticalPosition = (float)(0.1 * 72);
                    //picture.Width = (float)(0.91 * 72);
                    //picture.Height = (float)(0.94 * 72);
                }
            }
        }
           

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
            //FixImage(document);
            var stream = new MemoryStream();
            document.SaveToStream(stream,FileFormat.Docx);
            return stream.ToArray();
        }

    }
}
