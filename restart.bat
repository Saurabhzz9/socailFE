@echo off
taskkill /f /im node.exe 2>nul
npm run dev
