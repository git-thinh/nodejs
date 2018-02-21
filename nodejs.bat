@ECHO OFF

set app=%1

taskkill /F /IM node.exe
start C:\m2\App\msys32\usr\bin\node.exe E:\nodejs\%app%.js

tasklist /fi "imagename eq node.exe"

echo.
echo [ RUNING: %app%.js at http://localhost ...]
echo.