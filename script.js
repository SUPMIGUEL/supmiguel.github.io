window.onload = function(){
    $("#instructions").hide();
    var set=false, songs, level, cardsDes, genre, urls=[],cardBoard=[],numCards=0,c1,c2,count=0,fail=0,chances=5;
    $("#ilevel").addClass("step");
    clicklistener();  

    function clicklistener(){       //Declare the function clicklistener for all the buttons
        $(".level").on("click", function() {   levelChose(this);   });
        $("#reset").on("click", function() {   fullreset(this);    });   
    }

    function levelChose(t){             // When te user chose one of the levels of difficult
        
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
        $(".table-score").append("<tr><td><img src=./img/win.png id=win></td><td id=matches class=score>0</td><td><img src=./img/lose.png id=lose></td><td id=failures class=score>0</td></tr>");
        $("#instructions").append("<span class='label center-block instrucc'>Click one card and listen</span><span class='label center-block instrucc'>Click and listen another card</span><span class='label center-block instrucc'>The two cards match? Find the pairs!</span><span class='label center-block instrucc'>You have 5 opportunities to make a mistake</span>");
        array(rows);
    }

    function array(level){            // To create the array with the "cards" depending of the level
        var stop;
        if (level===3) {
            stop = 12;
            songs=6;
            cardsDes=fill(stop);
            console.log(cardsDes);          // TEST
        } 
        else if (level===4) {
            stop = 16;
            songs = 8;
            cardsDes=fill(stop);
            console.log(cardsDes);          // TEST
        }
        else if (level===5) {
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
        numCards++;
        if (numCards==1) {
            c1=$(t).get(0).id;      // Take the index of the card on the board
            play();
            $(".card#"+c1).off();
        }
        if (numCards==2) {
            c2=$(t).get(0).id;
            play();
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
            numCards=0;
            count++;
            $("#matches").text(count);
            if (count===songs) {
                alert("Congratulations");
                fullreset();
            }
            $(".card#"+c1).removeClass("card-show");
            $(".card#"+c2).removeClass("card-show");
        }
        else{
            fail++;
            chances--;
            numCards=0;
            $(".card#"+c1).on("click", function() {   clickCard(this);    });
            $(".card#"+c2).on("click", function() {   clickCard(this);    });
            cardBoard[c1].classList.add("delete");
            cardBoard[c2].classList.add("delete");
            $("#failures").text(fail);
            if (chances===0) {
                $("#player")[0].pause();
                alert("Game Over");
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
                numCards=0;
            }
        }
        $("#player")[0].pause();
    }

    function fullreset(){                               // Reset the board and the score
        console.log("new game");
        $("#igenre").removeClass("step");
        $("#ilevel").addClass("step");
        for (var i = 0; i < cardBoard.length; i++){
                cardBoard[i].setAttribute("src","./img/1.png");
                cardBoard[i].classList.remove("delete");      
        }
        numCards=0;
        chances=5;
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
        $(".genre").removeClass("genre-Select");
        $(".genre").removeClass("genre-Selected");
    }
    
};