window.onload = function(){

    var genreList, level, r, cards, cardsDes, genre="no", urls=[],cardBoard,numCards=0,c1,c2,count=0,fail=0,chances=5;

    start();
    clicklistener();    

function start(){   
    genreList = document.querySelectorAll(".genre");
    level = document.querySelectorAll(".level");
    cardBoard = document.querySelectorAll(".card");
    r = document.querySelector("#reset");
    n = document.querySelector("#newGame");
    cards = [0,0,1,1,2,2,3,3,4,4,5,5];
    cardsDes = shufle(cards);
    console.log(cardsDes);
}

function clicklistener(){       //Declare the function clicklistener for the genre chose
    for (var i = 0; i < genreList.length; i++){
        genreList[i].addEventListener("click",genreChose);
    }
    for (var j = 0; j < level.length; j++){
        level[j].addEventListener("click",levelChose);
    }
    for (var k = 0; k < cardBoard.length; k++) {
        if (genre!=="no") {
        cardBoard[k].addEventListener("click",clickCard);
        }
    }
    r.addEventListener("click",fullreset);
}

function genreChose(){
    genre = this.innerText;
    console.log(genre);
    getSongs();
}

function getSongs(){    // https://itunes.apple.com/lookup?id=909253
        $.ajax({    // https://itunes.apple.com/search?term=rock&entity=musicTrack&limit=10
            url: "https://itunes.apple.com/search",
            data: {
                term:genre,
                entity:"musicTrack",
                limit:6
            },
            jsonp: "callback",
            dataType: "jsonp"
        }).done(function(data) {
            for (var i = 0; i < 6; i++) {
                urls[i]=data.results[i].previewUrl;
            }
        });
}
function clickCard(){
    numCards=numCards+1;
    if (numCards==1) {
        c1=this.id;
        $("#player").attr("src",urls[cardsDes[this.id]]);
        $("#player").on("canplay", function() {
          $("#player")[0].play();
        });
        this.setAttribute("src","./img/2.png");
    }
    if (numCards==2) {
        c2=this.id;
        $("#player").attr("src",urls[cardsDes[this.id]]);
        $("#player").on("canplay", function() {
          $("#player")[0].play();
        });
        this.setAttribute("src","./img/2.png");
        check();
    }
}

function check(){
    if (cardsDes[c1]===cardsDes[c2]) {
        numCards=0;
        count=count+1;
        console.log(count); //TEST
        document.querySelector("#matches").innerText=count;
        if (count===6) {
            alert("Congratulations");
        }
        //reset();
        console.log("son iguales"); //TEST
    }
    else{
        fail=fail+1;
        chances=chances-1;
        cardBoard[c1].classList.add("delete");
        cardBoard[c2].classList.add("delete");
        numCards=0;
        document.querySelector("#failures").innerText=fail;
        if (chances===0) {
            document.querySelector("#chances").innerText=chances;
            alert("Game Over");
        }
        else{
        document.querySelector("#chances").innerText=chances;
        }
        setTimeout(reset,2000);
        console.log("No son iguales");
    }
}

function reset(){
    console.log("Reset");
    for (var i = 0; i < cardBoard.length; i++){
        if (cardBoard[i].classList[1]=="delete") {
            cardBoard[i].setAttribute("src","./img/1.png");
            cardBoard[i].classList.remove("delete");
            numCards=0;
        }
    }
}
function fullreset(){
    console.log("new game");
    for (var i = 0; i < cardBoard.length; i++){
            cardBoard[i].setAttribute("src","./img/1.png");
            cardBoard[i].classList.remove("delete");      
    }
    numCards=0;
    chances=5;
    count=0;
    fail=0;
    document.querySelector("#failures").innerText=fail;
    document.querySelector("#chances").innerText=chances;
    document.querySelector("#matches").innerText=count;
}
function levelChose(){
    console.log(this.innerText);
}

function shufle (arr){
    var ran, arr2 = [];
    for (var i = 0; i < arr.length; i++) {
      random();
      if (typeof arr2[ran]==="undefined") {
        arr2[ran]=arr[i];
      }
      else {
        random();
        i--;
      }
    }
    return arr2;

    function random(){
      ran = Math.floor(Math.random() * arr.length);
    }
}
};