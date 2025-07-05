@echo off
:: 检查输入
if "%~1"=="" (
    echo 请将 MP4 文件拖入此脚本以转换为 GIF。
    pause
    exit /b
)

:: 变量定义
set "INPUT=%~1"
set "NAME=%~n1"
set "DIR=%~dp1"
set "OUTPUT=%DIR%%NAME%_x264.mp4"

ffmpeg -i "%INPUT%" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k -y "%OUTPUT%"