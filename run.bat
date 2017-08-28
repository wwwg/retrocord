@echo off
IF EXIST "./retrocord-light/" goto run
git clone https://github.com/wwwg/retrocord-light.git
npm link ./retrocord-light
:run
call node ./retrocord-light/src/index.js
