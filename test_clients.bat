@echo off

SET BROWSER=chrome.exe

FOR /L %%A IN (1,1,30) DO (
  START %BROWSER% -new-tab "https://webrpg.io/test_client.html"
)