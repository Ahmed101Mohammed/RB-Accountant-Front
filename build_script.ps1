npx webpack --mode production;

if(Test-Path -Path "../RB-Accountant/dist")
{
  Remove-Item -Path "../RB-Accountant/dist" -Recurse;
}


Copy-Item -Path "dist" -Destination "../RB-Accountant" -Recurse;