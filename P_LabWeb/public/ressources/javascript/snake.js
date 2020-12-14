/*
    Auteur: Clément Sartoni
    Date: 11.06.2020
    Description: Feuille de javascript du jeu "snake"
*/
//variables
const divStatsSolo = document.getElementsByClassName("statsSolo");              //toutes les div de statistiques pour les parties solo
const divStatsMulti = document.getElementsByClassName("statsMulti");            //toutes les div de statistiques pour les parties multijoueur
const pPommes = document.getElementById("pommes");                              //indicateur du nombre de pommes
const pMaxPommes = document.getElementById("maxPommes");                        //indicateur du nombre maximal de pommes
const pTimer = document.getElementById("timer");                                //indicateur du temps passé
const pScoreP1 = document.getElementById("pommesJoueur1");                      //indicateur du nombre de pommes du joueur 1
const pScoreP2 = document.getElementById("pommesJoueur2");                      //indicateur du nombre de pommes du joueur 2
const divsIndications = document.getElementsByClassName("gameIndications")      //les div contenant les touches, les règles, etc.
const bHelp = document.getElementById("helpButton");                            //le bouton pour afficher l'aide
const bOnePlayer = document.getElementById("buttonOnePlayer");                  //le bouton pour faire une partie seul
const bTwoPlayers = document.getElementById("buttonTwoPlayers");                //le bouton pour faire une partie à deux
const canvas = document.getElementById("canvasSnake");                          //reprèsente le canvas
const ctx = canvas.getContext("2d");                                            //représente le context du canvas
const elementSize= 20;                                                          //reprèsente la taille de chaque case. 
const canvasSize = 400;                                                         //représente la taille du canvas
const appleImg = document.createElement("IMG");                                 //l'image de la pomme
appleImg.setAttribute("src","../../ressources/images/pomme_game.png");
let timer;                                                                      //représente le setInterval qui compte les secondes
let framer;                                                                     //le setInterval qui lance chaque frame
let playing = false;                                                            //pour savoir si le jeu est en cours ou non
let speed = 100;                                                                //définit la vitesse du serpent (les updates en milisecondes)
let score = 0;                                                                  //le score actuel
let scoreMax =  localStorage.getItem("scoreMax") || 0;                           //le score maximal atteint (si il y en a un dans la mémoire, le récupère)
    pMaxPommes.textContent = scoreMax;                                          //affiche le score max d'avant
let timePlayed = 0;                                                             //la durée d'une partie, en secondes.
let twoPlayers = false;                                                         //si c'est une partie à deux joueurs 
let apples = [];                                                            //le tableau pour contenir les pommes
let snakes = [];                                                            //le tableau pour contenir les serpents  
let initialized;                                                                //pour enmpêcher de ré-initialiser
let helped = false;

//classes

//serpent
class snake
{
    constructor(_player, _color)
    {
        this.bodyX = [];
        this.bodyY = [Math.floor(canvas.height / elementSize /2)*elementSize,Math.floor(canvas.height / elementSize /2)*elementSize,
                      Math.floor(canvas.height / elementSize /2)*elementSize,Math.floor(canvas.height / elementSize /2)*elementSize];
        this.color = _color;
        this.direction= [];
        //this.framer;
        this.alive = true;
        this.canMove = true;
        this.player = _player;
        this.score = 0;
        snakes.push(this);
    }
    draw(_toClear = [0,0])
    {
        ctx.clearRect(_toClear[0], _toClear[1], elementSize, elementSize);
        ctx.fillStyle = this.color;

        for(let i = 0; i< this.bodyX.length; i++)
        {
            ctx.fillRect(this.bodyX[i],this.bodyY[i],elementSize, elementSize);
        }  
    }

}
//pour les pommes
class apple
{
    constructor()
    {
        this.X;                             //la valeur X de la position de la pomme
        this.Y;                             //sa valeur Y

        //ajoute la pomme au tableau de pommes, puis lui définit des positions
        apples.push(this);              
        this.setNewPosition();
        this.draw();
    }
    //définir une nouvelle position à la pomme
    setNewPosition(){
            //obtient des valeurs aléatoires positionnées correctement sur la grille
            this.X = Math.floor(Math.random() * canvasSize/elementSize)*elementSize;
            this.Y = Math.floor(Math.random() * canvasSize/elementSize)*elementSize;  

            if(isAppleInSnake(this))
                this.setNewPosition();     
    }
    draw()
    {
        ctx.drawImage(appleImg,this.X,this.Y);
    }
}

initialize();

//au début du jeu
function initialize()
{
    //stoppe tout jeu en cours
    clearInterval(framer);
    document.onkeydown = function(e){enterToPlay(e);};
    apples = [];
    snakes = [];
    clearInterval(timer);
    timePlayed = 0;
    playing = false;

    //affiche le message "cliquez pour jouer"
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle ="#FFFFFF";
    ctx.font ="27px Verdana";
    ctx.fillText("Cliquez pour jouer", 90, canvasSize/2);

    //vérifie que la taille des cases est valide
    if(canvas.width % elementSize != 0 && canvas.height % elementSize != 0)
        alert("attention! l'informaticient chargé de mettre en place le jeu à fait de la merde, la taille des cases n'est pas valide par rapport à celle du canvas.");

    //quand le joueur clique sur le canvas
    canvas.onclick = function(){canvasOnClick();};

}

//pour ouvrir le jeu quand on presse sur enter
function enterToPlay(_keypressed)
{
    if(_keypressed.key == "Enter")
        canvasOnClick();
}

//pour ouvrir le jeu
function canvasOnClick()
{
    //clear le canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //clear les variables de score
    pScoreP1.textContent = "0";
    pScoreP2.textContent = "0";
    pTimer.textContent = "0'0\"";
    timePlayed = 0;
    pPommes.textContent = "0";

    //unlock les touches et lock le clic
    document.onkeydown = function(e){snakeMovement(e)};
    canvas.onclick = function(){};

    //création et initialisation du premier serpent(indique l'emplacement du serpent ainsi que sa direction)
    snake1 = new snake(1, "green");
    snake1.bodyX = [Math.floor(canvas.width / elementSize /3)*elementSize, (Math.floor(canvas.width / elementSize /3)-1)*elementSize,
                    (Math.floor(canvas.width / elementSize /3)-2)*elementSize, (Math.floor(canvas.width / elementSize /3)-3)*elementSize];
    snake1.direction = [elementSize,0]   
    snake1.draw();

    //création d'une pomme
    apple1 = new apple();

    //si c'est une partie à deux
    if(twoPlayers){
        //création et initialisation d'un deuxième serpent
        snake2 = new snake(2, "blue");
        snake2.bodyX = [Math.floor(canvas.width / elementSize /3*2)*elementSize, (Math.floor(canvas.width / elementSize /3*2)+1)*elementSize,
                        (Math.floor(canvas.width / elementSize /3*2)+2)*elementSize, (Math.floor(canvas.width / elementSize /3*2)+3)*elementSize];
        snake2.direction = [-elementSize, 0]
        snake2.draw();

        //création d'une autre pomme
        apple2 = new apple();
    }
}

//quand le joueur clique sur les boutons pour choisir le mode de jeu
bOnePlayer.onclick = function()
{
    //change la class "currentButton" de bouton
    bOnePlayer.setAttribute("class","currentButton");
    bTwoPlayers.removeAttribute("class");

    //retire le focus au bouton
    bOnePlayer.blur();

    //cache les stats des parties multi et affiche les stats solo
    for(let i = 0; i< divStatsSolo.length;i++)
        divStatsSolo[i].style.display = "flex";
    for(let i = 0; i< divStatsMulti.length;i++)
        divStatsMulti[i].style.display = "none";

    //cache la div des touches (si elle doit pas rester)
    if(!helped)
        divsIndications[1].style.visibility = "hidden";
    
    //indique que c'est une partie solo et réinitialise le canvas
    twoPlayers = false;
    initialize();
    
}
bTwoPlayers.onclick = function()
{
    //change la class "currentButton" de bouton
    bTwoPlayers.setAttribute("class","currentButton");
    bOnePlayer.removeAttribute("class");

    //retire le focus au bouton
    bTwoPlayers.blur();

    //cache les stats des parties solo et affiche les stats multi
    for(let i = 0; i< divStatsSolo.length;i++)
        divStatsSolo[i].style.display = "none";
    for(let i = 0; i< divStatsMulti.length;i++)
        divStatsMulti[i].style.display = "flex";

    //affiche la div des touches 
    divsIndications[1].style.visibility = "visible";

    //indique que c'est une partie solo et réinitialise le canvas
    twoPlayers = true;
    initialize();
}

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

//change la direction du serpent en fonction de la touche pressée
function snakeMovement(_keypressed)
{
    //obtient le code de la touche
    let key = _keypressed.which;

    //en fonction de la touche pressée
    switch(key)
    {
        //W
        case 87:
            //si ce n'est pas la direction opposée à celle actuelle et si on peut bouger, change la direction
            if(snake1.direction[1] != elementSize && snake1.canMove)
            {
                snake1.direction = [0,-elementSize];
                //si on vient de bouger, on ne peut plus jusqu'à la prochaine frame
                snake1.canMove = false;
            }   
            break;
        //S
        case 83:
            if(snake1.direction[1] != -elementSize && snake1.canMove)
            {
                snake1.direction = [0,elementSize];
                snake1.canMove = false;
            } 
            break;
        //A
        case 65:
            if(snake1.direction[0] != elementSize && snake1.canMove)
            {
                snake1.direction = [-elementSize,0];
                snake1.canMove = false;
            }
            break;
        //D
        case 68:
            if(snake1.direction[0] != -elementSize && snake1.canMove)
            {
                snake1.direction = [elementSize,0];
                snake1.canMove = false;
            }    
            break;
        //Flèche du haut
        case 38:
            if(snake2.direction[1] != elementSize && snake2.canMove)
            {
                snake2.direction = [0,-elementSize];
                snake2.canMove = false;
            } 
            break;
        //Flèche du bas
        case 40:
            if(snake2.direction[1] != -elementSize && snake2.canMove)
            {
                snake2.direction = [0,elementSize];
                snake2.canMove = false;
            }   
            break;
        //Flèche gauche
        case 37:
            if(snake2.direction[0] != elementSize && snake2.canMove)
            {
                snake2.direction = [-elementSize,0];
                snake2.canMove = false;
            }
            break;
        //Flèche droite
        case 39:
            if(snake2.direction[0] != -elementSize && snake2.canMove)
            {
                snake2.direction = [elementSize,0];
                snake2.canMove = false;
            }
    }

    //la première fois que le serpent bouge
    if(!playing)
    {
        framer = setInterval(update, speed);
        if(!twoPlayers)
            timer = setInterval(updateTimer,1000);
        playing = true;
        canvas.onclick = function(){};
    }
}
//à chaque tick du timer
function update(){
    //pour chaque serpent
    for(let i = 0; i<snakes.length;i++)
    {
        //pour indiquer que le serpent est prêt pout un nouveau mouvement
        snakes[i].canMove = true;

        //si le serpent se prend son corps où celui d'un autre, le fait mourir
        for(let j = 0; j<snakes.length;j++)
        {
            for(let k=1; k<snakes[j].bodyX.length-1;k++)
            {
                if(snakes[j].bodyX[k] == snakes[i].bodyX[0]+snakes[i].direction[0]&&
                    snakes[j].bodyY[k] == snakes[i].bodyY[0]+snakes[i].direction[1])
                {
                    snakes[i].alive = false; 
                }
            }
        }

        //si il touche un mur
        if(snakes[i].bodyX[0]+snakes[i].direction[0]<0||snakes[i].bodyX[0]+snakes[i].direction[0]>=canvasSize||
            snakes[i].bodyY[0]+snakes[i].direction[1]<0||snakes[i].bodyY[0]+snakes[i].direction[1]>=canvasSize)
        {
            snakes[i].alive = false;
        }
    
        //si le serpent touche une pomme
        for(let j = 0; j<apples.length;j++)
        {
            if(snakes[i].bodyX[0]+snakes[i].direction[0]==apples[j].X && snakes[i].bodyY[0]+snakes[i].direction[1]==apples[j].Y)
            {
                //ajout d'un bout de serpent
                snakes[i].bodyX[snakes[i].bodyX.length]=snakes[i].bodyX[snakes[i].bodyX.length-1]-snakes[i].direction[0];
                snakes[i].bodyY[snakes[i].bodyY.length]=snakes[i].bodyY[snakes[i].bodyY.length-1]-snakes[i].direction[1];
                
                //incrémentation du score
                snakes[i].score++;

                //partie solo
                if(!twoPlayers)
                {
                    //actualisation label score
                    pPommes.textContent= snakes[i].score;
                    
                    //si le score maximum est dépassé
                    if(snakes[i].score>=scoreMax)
                    {
                        pMaxPommes.textContent = scoreMax = snakes[i].score;
                    }
                }
                //partie multi
                else
                {
                    //actualisation du bon label
                    if(snakes[i].player == 1)
                    {
                        pScoreP1.textContent = snakes[i].score;
                    }
                    else
                    {
                        pScoreP2.textContent = snakes[i].score;
                    }
                }
    
                //déplacement de la pomme
                apples[j].setNewPosition();
            }
        }
    }

    //en cas de partie solo
    if(!twoPlayers)
    {
        //si le serpent est vivant
        if(snake1.alive)
        {
            //récupère le carré qui devra être clear lors du dessin du serpent
            let toClear = [snake1.bodyX[snake1.bodyX.length-1],snake1.bodyY[snake1.bodyY.length-1]];

            //déplace le serpent
            for(let i = snake1.bodyX.length-1 ; i > 0 ; i--)
            {
                snake1.bodyX[i] = snake1.bodyX[i-1];
                snake1.bodyY[i] = snake1.bodyY[i-1];
            }

            //bouge la tête
            snake1.bodyX[0] += snake1.direction[0];
            snake1.bodyY[0] += snake1.direction[1];

            //redessine le serpent et la pomme
            snake1.draw(toClear);
            for(let i = 0; i<apples.length;i++)
                apples[i].draw();
        }
        else
        {
            //désactive les entrées clavier et active le click sur le canvas
            document.onkeydown = function(e){enterToPlay(e);};
            canvas.onclick = function(){canvasOnClick()};

            //réinitialisation des tableaux
            apples = [];
            snakes = [];
            
            //clear les deux setIntervals
            clearInterval(timer)
            clearInterval(framer);
            
            //affiche les messages de défaite et de replay
            ctx.fillStyle ="#FF0000";
            ctx.font ="27px Verdana";
            ctx.fillText("YOU LOOOSE", 90, 200);
            ctx.font ="20px Verdana";
            ctx.fillText("click for replay", 130, 300);

            //indique que le jeu est terminé
            playing = false;

            //réinitialise les stats
            timePlayed = 0;

            //stocke le maxScore
            localStorage.setItem("scoreMax", scoreMax);
        }
    }
    //en cas de partie multi
    else
    {
        //si les serpents se tapent la tête
        if(snake1.bodyX[0]+snake1.direction[0]==snake2.bodyX[0] && snake1.bodyY[0]+snake1.direction[1] == snake2.bodyY[0] ||
            snake2.bodyX[0]+snake2.direction[0]==snake1.bodyX[0] && snake2.bodyY[0]+snake2.direction[1] == snake1.bodyY[0])
        {
            snake1.alive = false;
            snake2.alive = false;
        }
        //si les deux serpents sont vivants
        if(snake1.alive && snake2.alive)
        {
            for(let i = 0; i<snakes.length;i++)
            {
                //récupère le carré qui devra être clear lors du dessin du serpent
                let toClear = [snakes[i].bodyX[snakes[i].bodyX.length-1],snakes[i].bodyY[snakes[i].bodyY.length-1]];

                //déplace le serpent
                for(let j = snakes[i].bodyX.length-1 ; j > 0 ; j--)
                {
                    snakes[i].bodyX[j] = snakes[i].bodyX[j-1];
                    snakes[i].bodyY[j] = snakes[i].bodyY[j-1];
                    
                }
                //bouge la tête
                snakes[i].bodyX[0] += snakes[i].direction[0];
                snakes[i].bodyY[0] += snakes[i].direction[1];

                //redessine le serpent et la pomme
                snakes[i].draw(toClear);
                for(let i = 0; i<apples.length;i++)
                    apples[i].draw();
            }
        }
        //si un des deux serpents est mort
        else 
        {
            //désactive les entrées clavier et active le click sur le canvas
            document.onkeydown = function(e){enterToPlay(e);};
            canvas.onclick = function(){canvasOnClick()};

            //réinitialisation des tableaux
            apples = [];
            snakes = [];

            //clear les deux setIntervals
            clearInterval(framer)
            
            //affiche les messages de défaite et de replay
            ctx.fillStyle ="#FF0000";
            ctx.font ="25px Verdana";

            //si le serpent 1 est vivant
            if(snake1.alive)
                ctx.fillText("Le joueur 1 a gagné", 90, 200);

            //si le serpent 2 est vivant
            else if(snake2.alive)
                ctx.fillText("Le joueur 2 a gagné", 90, 200);

            //si ils sont les deux morts
            else
                ctx.fillText("Vous êtes morts ensembles", 40, 200);

            ctx.font ="20px Verdana";
            ctx.fillText("click for replay", 130, 300);

            //indique que le jeu est terminé
            playing = false;
        }
    }
    
}

//fonction pour savoir si une pomme a pop dans un serpent
function isAppleInSnake(_apple){
    for(let i=0; i<snake1.bodyX.length;i++)
    {
        if(_apple.X == snake1.bodyX[i] && _apple.Y == snake1.bodyY[i])
            return true;
    }
    return false;
}

//fonction pour compter le nombre de secondes de jeu passé
function updateTimer()
{
    timePlayed++;
    pTimer.textContent =  Math.floor(timePlayed/60)+"'"+timePlayed%60+"\"";
}

const test = {
    score: localStorage.getItem("score") || 0,

    setScore : function()
    {
        localStorage.setItem("score", 0);
    }
}