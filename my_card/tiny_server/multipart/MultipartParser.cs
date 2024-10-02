using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tinyServer.multipart
{


	class KeyValueStateMachine
	{
		private string Key = null;
		private string Value = "";

		public Dictionary<string, string> Dict { get; }  = new Dictionary<string, string>();

		private string ExtractName(string line)
		{
			var pairs = line.Split(';');
			for (int i = 0; i < pairs.Length; i++)
			{
				var pair = pairs[i];
				var pp = pair.Split('=');
				if (pp.Length < 2) continue;
				var k = pp[0].Trim();
				if (k == "name") return pp[1];
			}
			return null;
		}

		public void SetKeyOrValue(string keyOrValue) 
		{
			if (keyOrValue == null)
			{
				return;
			}
			if (keyOrValue=="--")
			{
				if (!Dict.ContainsKey(Key)) Dict.Add(Key, Value.Trim());
				Key = null;
				Value = "";
				return;
			}
			bool startsWithContentDisposition = keyOrValue.StartsWith("Content-Disposition");
			if (startsWithContentDisposition && keyOrValue.Contains("filename="))
			{
				return;
			}
			bool isKey = startsWithContentDisposition;
			if (!isKey && Key == null) return;

			if (isKey)
			{
				if (Key!=null && !Dict.ContainsKey(Key)) Dict.Add(Key, Value.Trim());
				string k = ExtractName(keyOrValue);

				if (k == null)
				{
					return;
				}
				Key = k.Trim().Trim('"');
				Value = "";
			}
			else
			{
				Value += keyOrValue;
			}
			return;
		}

	}

	class MultipartParser
	{
		public string GetBoundary(string header)
		{
			var items = header.Split(';');
			if (items.Length > 1)
				for (int i = 0; i < items.Length; i++)
				{
					var item = (items[i]).Trim();
					if (item.Contains("boundary"))
					{
						var k = item.Split('=');
						return (k[1]).Trim();
					}
				}
			return "";
		}


		private MultipartFile Process(MultipartFileRaw part)
		{
			var header = part.Header.Split(';');
			var filePart = header.Length>=3?header[2]:"";
			var k = filePart.Split('=');
			var fileName = k.Length>=2?k[1].Trim():"";
			var partInfo = part.Info.Split(':');
			var contentType = partInfo.Length>=2?partInfo[1].Trim():"";
			return new MultipartFile
			{
				Name = fileName,
				ContentType = contentType,
				Stream = part.Stream
			};
		}

		public (List<MultipartFile>,Dictionary<string,string>) Parse(Stream stream, string boundary)
		{
			var keyValueStateMachine = new KeyValueStateMachine();
			var lastline = "";
			var header = "";
			var prevByte = (byte)0x0;
			var info = ""; 
			var state = 0; 
			var buffer = new MemoryStream();
			var allParts = new List<MultipartFile>();

			while (true)
			{
				int result = stream.ReadByte();
				if (result == -1) break;

				byte oneByte = (byte)result;


				var newLineDetected = ((oneByte == 0x0a) && (prevByte == 0x0d)) ? true : false;
				var newLineChar = ((oneByte == 0x0a) || (oneByte == 0x0d)) ? true : false;

				prevByte = oneByte;

				if (!newLineChar)
				{
					lastline += Convert.ToChar(oneByte);
				}
				if (newLineDetected)
				{
					keyValueStateMachine.SetKeyOrValue(lastline);
				}

				if ((0 == state) && newLineDetected)
				{
					if ("--" + boundary == lastline)
					{
						state = 1;
					}
					lastline = "";
				}
				else
				if ((1 == state) && newLineDetected)
				{
					header = lastline;
					state = 2;
					lastline = "";
				}
				else
				if ((2 == state) && newLineDetected)
				{
					info = lastline;
					state = 3;
					lastline = "";
				}
				else
				if ((3 == state) && newLineDetected)
				{
					state = 4;
					buffer = new MemoryStream();
					lastline = "";
				}
				else
				if (4 == state)
				{
					if (lastline.Length > (boundary.Length + 4))
					{
						lastline = "";
					}
					if ("--" + boundary == lastline)
					{
						var j = buffer.Length - lastline.Length;
						var part = new MemoryStream();
						buffer.Position = 0;
						for (int k = 0; k < j - 1; k++)
						{
							int b = buffer.ReadByte();
							if (b == -1) break;
							part.WriteByte((byte)b);
						}
						var p = new MultipartFileRaw
						{
							Header = header,
							Info = info,
							Stream = part
						};
						allParts.Add(Process(p));
						buffer = new MemoryStream(); 
						lastline = ""; 
						state = 5; 
						header = ""; 
						info = "";
					}
					else
					{
						buffer.WriteByte(oneByte);
					}
					if (newLineDetected)
					{
						lastline = "";
					}
				}
				else 
				if (5 == state)
				{
					if (newLineDetected) state = 1;
				}


			}

			return (allParts, keyValueStateMachine.Dict);
			
		}

	}	
		



}
