window.onload = function(){
    $("#instructions").hide();
    var set=false, songs, level, cardsDes, genre, urls=[],cardBoard=[],c1,c2,count=0,fail=0,chances,cardOne=false,cardTwo=false;
    $("#ilevel").addClass("step");
    clicklistener();  

    function clicklistener(){       //Declare the function clicklistener for all the buttons
        $(".level").on("click", function() {   levelChose(this);   });
        $("#reset").on("click", function() {   fullreset(this);    });   
    }

    function levelChose(t){             // When te user chose one of the levels of difficult
        $("#message").empty();
        fullreset();
        $("#igenre").addClass("step");
        $("#ilevel").removeClass("step");
        $(".level").removeClass("level-select");
        $(".genre").removeClass("genre-Selected");
        if (set===true) {
            $(".new-table").empty();
            set=false;
        }
        if(set===false){
            var rows=0;
            console.log($(t).get(0).id);
            if ($(t).get(0).id=="Easy") {
                rows=3;
            }
            else if ($(t).get(0).id=="Medium") {
                rows=4;
            }
            else if ($(t).get(0).id=="Hard"){
                rows=5;
            }
            set=true;
            $(".genre").on("click", function() {   genreChose(this);   });
            $(".genre").addClass("genre-Select");
            $(t).addClass("level-select");
            createBoard(rows);
        }
    }

    function createBoard(rows){         // To create the board
        var countId=0;
        $(".new-table").append("<tr>");
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < 4; j++) {
                $(".new-table").append("<td><img src=./img/1.png class=card id="+countId+"></td>");
                countId++;
            }
            $(".new-table").append("</tr><tr>");
        }
        array(rows);
        $(".table-score").append("<tr><td><img src=./img/win.png id=win></td><td id=matches class=score>0</td><td><img src=./img/lose.png id=lose></td><td id=failures class=score>0</td></tr>");
        $("#instructions").append("<span class='label center-block instrucc'>Click one card and listen</span><span class='label center-block instrucc'>Click and listen another card</span><span class='label center-block instrucc'>The two cards match? Find the pairs!</span><span class='label center-block instrucc'>You have "+chances+" opportunities to be wrong</span>");
        
    }

    function array(level){            // To create the array with the "cards" depending of the level
        var stop;
        if (level===3) {
            chances=8;
            stop = 12;
            songs = 6;
            cardsDes=fill(stop);
            console.log(cardsDes);          // TEST
        } 
        else if (level===4) {
            chances=9;
            stop = 16;
            songs = 8;
            cardsDes=fill(stop);
            console.log(cardsDes);          // TEST
        }
        else if (level===5) {
            chances=10;
            stop = 20;
            songs = 10;
            cardsDes=fill(stop);
            console.log(cardsDes);          // TEST
        }
        function fill(stop){                // Fill the array ex: [0,0,1,1,2,2,3,3,4,4,5,5]
            var newArr=[],n=0;
            for (var i = 0; i < stop; i++) {
                newArr[i]=n;
                if (i%2 !== 0){
                 n++;
                }   
            }
            return _.shuffle(newArr);
        }
    }

    function genreChose(t){                 // When te user chose the genre
        $("#igenre").removeClass("step");
        $(".genre").removeClass("genre-Selected");
        genre = $(t).attr("alt");
        $(t).addClass("genre-Selected");
        console.log(genre);                         // TEST
        $(".card").on("click", function() {   clickCard(this);    });   // Now listen for click on the boar
        cardBoard = $(".card");
        $("#instructions").show();
        $(".card").addClass("card-show");
        $(".genre").off();
        $(".genre").removeClass("genre-Select");
        getSongs(); 
    }

    function getSongs(){                    // Make the API conection and make an array with the url's
        $.ajax({    
            url: "https://itunes.apple.com/search",
            data: { term:genre, entity:"musicTrack", limit:songs },
            jsonp: "callback",
            dataType: "jsonp"
        }).done(function(data) {
            for (var i = 0; i < songs; i++) {
                urls[i]=data.results[i].previewUrl;
            }
            console.log(urls[0]);                       // TEST conection
        });
    }

    function clickCard(t){                  // When the user click on the board
        if(!cardOne && !cardTwo) {
            c1=$(t).get(0).id;      // Take the index of the card on the board
            play();
            $(".card#"+c1).off();
            cardOne=true;
        }
        else if (cardOne && !cardTwo){
            c2=$(t).get(0).id;
            play();
            $(".card#"+c2).off();
            cardTwo=true;
            check();
        }  
        function play(){                                    //Play the song of the card in the board
            $("#player").attr("src",urls[cardsDes[t.id]]);
            $("#player")[0].play();
            $(t).attr("src","./img/2.png");
        } 
    }

    

    function check(){                       // Check if the two cards have the same song
        if (cardsDes[c1]===cardsDes[c2]) {
            
            count++;
            $("#matches").text(count);
            if (count===songs) {
                $("#message").append("<img id='mess' src=./img/winner.png>");
                fullreset();
            }
            $(".card#"+c1).removeClass("card-show");
            $(".card#"+c2).removeClass("card-show");
            cardOne=false;
            cardTwo=false;
        }
        else{
            fail++;
            chances--;
            
            $(".card#"+c1).on("click", function() {   clickCard(this);    });
            $(".card#"+c2).on("click", function() {   clickCard(this);    });
            cardBoard[c1].classList.add("delete");
            cardBoard[c2].classList.add("delete");
            $("#failures").text(fail);
            if (chances===0) {
                $("#player")[0].pause();
                $("#message").append("<img id='mess' src=./img/gameover.png>");
                fullreset();
            }
            else{
                $("#chances").text(chances);
            }
            setTimeout(turnBack,3000);
        }
    }

    function turnBack(){                                // Return to their original position the cards that doesn't match
        for (var i = 0; i < cardBoard.length; i++){
            if (cardBoard[i].classList[2]=="delete") {
                cardBoard[i].setAttribute("src","./img/1.png");
                cardBoard[i].classList.remove("delete");
            }
        }
        $("#player")[0].pause();
        cardOne=false;
        cardTwo=false;
    }

    function fullreset(){                               // Reset the board and the score
        console.log("new game");
        $("#igenre").removeClass("step");
        $("#ilevel").addClass("step");
        for (var i = 0; i < cardBoard.length; i++){
                cardBoard[i].setAttribute("src","./img/1.png");
                cardBoard[i].classList.remove("delete");      
        }
        count=0;
        fail=0;
        if (fail !==0 & count !==0) {
            document.querySelector("#failures").innerText=fail;
            document.querySelector("#matches").innerText=count;
            $(".table-score").empty();
        }
        $("#instructions").empty();
        $(".table-score").empty();
        $(".new-table").empty();

        set=false;
        $("#player")[0].pause();
        cardOne=false;
        cardTwo=false;
        $(".genre").removeClass("genre-Select");
        $(".genre").removeClass("genre-Selected");
    }
    
};