/*
    ETML
    Auteur: Clément Sartoni
    Date: 14.12.2020
    Description: Page de javascript globale pour les environnements de jeux
*/

const bHelp = document.getElementById("helpButton");                            //le bouton pour afficher l'aide
const divsIndications = document.getElementsByClassName("gameIndications")      //les div contenant les touches, les règles, etc.

//quand le joueur veut afficher l'aide
bHelp.onclick = function()
{
    if(!helped)
    {
        //affiche les divs
        divsIndications[0].style.visibility = "visible";
        divsIndications[1].style.visibility = "visible";

        //indique qu'elles restent pour l'instant
        helped = true;
    }
    else
    {
        //cache les divs
        divsIndications[0].style.visibility = "hidden";
        divsIndications[1].style.visibility = "hidden";

        //indique qu'elles ne restent pas
        helped = false;
    }
}