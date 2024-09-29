powershell Remove-Item -LiteralPath ./out/my_card.zip -Force
powershell Compress-Archive ../my_card/bin/Debug/my_card.exe ./out/my_card.zip -Force
powershell Compress-Archive ../my_card/bin/Debug/favicon.png ./out/my_card.zip -Update
powershell Compress-Archive ../my_card/bin/Debug/index.html ./out/my_card.zip -Update
powershell Compress-Archive ../my_card/bin/Debug/index.js ./out/my_card.zip -Update
powershell Compress-Archive ../my_card/bin/Debug/fonts ./out/my_card.zip -Update