powershell Remove-Item -LiteralPath ./out/my_card.zip -Force
powershell npm run build
powershell Compress-Archive ../my_card/bin/Debug/my_card.exe ./out/my_card.zip -Force
powershell Compress-Archive ./src/assets/favicon.png ./out/my_card.zip -Update
powershell Compress-Archive ./index.html ./out/my_card.zip -Update
powershell Compress-Archive ./out/index.js ./out/my_card.zip -Update
powershell Compress-Archive ../my_card/bin/Debug/fonts ./out/my_card.zip -Update