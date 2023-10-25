@echo off
cd ../public
start /B php -S localhost:65000
@REM color: (bleu:09) (green: 02) (yellow: 0E)
color 09
echo.
echo             ------ Server started on port 65000 ------
echo.