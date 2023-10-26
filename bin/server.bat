@echo off
title Server Chat 2.0

cd ../public
start /B php -S localhost:65000
@REM color: (bleu:09) (green: 02) (yellow: 0E)
color 09
echo.
echo _______________________________________________
echo.
echo -- Server running on http://localhost:65000 --
echo _______________________________________________
echo.