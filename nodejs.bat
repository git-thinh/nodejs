@ECHO OFF

taskkill /F /IM node.exe
start C:\m2\App\msys32\usr\bin\node.exe E:\nodejs\app.js

tasklist /fi "imagename eq node.exe"