const main = document.querySelector("main");

const arrayBasic =  [
    {pic: 0,min: 1},
    {pic: 1,min: 1},
    {pic: 2,min: 1},
    {pic: 3,min: 1},
    {pic: 4,min: 1},
    {pic: 5,min: 1},
    {pic: 6,min: 1},
    {pic: 7,min: 1},
    {pic: 8,min: 1},
    {pic: 9,min: 1},
]

let exerciceArray = [];

//fonction se lance toute seule

(
    () => {
        if(localStorage.exercices) {
            exerciceArray = JSON.parse(localStorage.exercices);
        } else {
            exerciceArray = arrayBasic;
        }
    }
    )();


class Exercice {
    constructor() {
        this.index = 0;
        this.minute = exerciceArray[this.index].min;
        this.seconds = 0;
    }

    updateCountDown() {

        this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

        setTimeout(() => {
            if(this.minute === 0 && this.seconds === "00") {
                this.index++;
                this.ring();
                if(this.index < exerciceArray.length){
                    this.minute = exerciceArray[this.index].min;
                    this.seconds = 0;
                    this.updateCountDown();
                }
                else {
                  return page.finish(); 
                }

            }else if(this.seconds === "00") {
                this.minute--;
                this.seconds = 59;
                this.updateCountDown();
            }else {
                this.seconds--;
                this.updateCountDown();
            }
        }, 10);

        return (main.innerHTML = `
        <div class="exercice-container">
            <p>${this.minute}:${this.seconds}</p>
            <img src="./img/${exerciceArray[this.index].pic}.jpg" alt="img${exerciceArray[this.index].pic}"/>
            <div>${this.index + 1} / ${exerciceArray.length}</div>
        </div>
        `);
    }

    ring() {
        const audio = new Audio();
        audio.src = "ring.mp3";
        audio.play();
    }
}

const utils = {

    pageContent: function(title, content, btn) {
        document.querySelector("h1").innerHTML = title;
        main.innerHTML = content;
        document.querySelector(".btn-container").innerHTML = btn;
    },

    handleEventMinutes: function() {
        document.querySelectorAll('input[type="number"]')
        .forEach((input) => {
            input.addEventListener("input", (e) =>
            {
                exerciceArray.map((exo) => {
                    if(exo.pic == e.target.id) {
                        exo.min = parseInt(e.target.value);
                        this.store();
                    }
                })
            })
        })
    },

    hundleEventArrow: function() {
        document.querySelectorAll(".arrow")
        .forEach((arrow) => {
            let position = 0;
            arrow.addEventListener("click", (e) => {
                exerciceArray.map(exo => {
                    if(exo.pic == e.target.dataset.pic && position != 0) {
                        [exerciceArray[position], exerciceArray[position - 1]] = 
                        [exerciceArray[position - 1], exerciceArray[position]];
                        page.lobby();
                        this.store();
                    }else {
                        position++;
                    }
                })
            })
        })
    },

    deleteItem: function() {
        document.querySelectorAll(".deleteBtn")
        .forEach((btn) => {
            
            btn.addEventListener("click", (e) => {
                let newArray = [];
                exerciceArray.map(exo => {
                    if(exo.pic != parseInt(e.target.dataset.pic)) {
                        newArray.push(exo);
                    }
                });

                exerciceArray = newArray;

                page.lobby();
                this.store();
            })
        
        })
    },

    reboot: function() {
        exerciceArray = arrayBasic;
        page.lobby();
        this.store();
    },

    store: function() {
        localStorage.exercices = JSON.stringify(exerciceArray);
    }


}


const page = {
    lobby: function() {

        let mapArray = exerciceArray.map(exo => {
            return  `
            <li>
                <div class="card-header">
                    <input type="number" id="${exo.pic}" min="1" max="10" value="${exo.min}"/>
                    <span>min</span>
                </div>

                <img src="./img/${exo.pic}.jpg" alt="img${exo.pic}" />
                <div class="icone-container">
                    <i class="fas fa-arrow-alt-circle-left arrow" data-pic="${exo.pic}"></i>
                    <i class="fas fa-times-circle deleteBtn" data-pic="${exo.pic}"></i>
                </div>
            </li>
            
            `
        }).join("");


        utils.pageContent( 
        "Paramétrage <i id='reboot' class='fas fa-undo'></i>",     
        "<ul>" + mapArray + "</ul>",
        "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
        );    

        utils.handleEventMinutes();
        utils.hundleEventArrow();
        utils.deleteItem();
        reboot.addEventListener("click", () => utils.reboot());
        start.addEventListener("click", this.routine);
    },

    routine: function() {
        const exercise = new Exercice();
        utils.pageContent(
            "Routine",
            exercise.updateCountDown(),
            null
        );
    },

    finish: function() {
        utils.pageContent(
            "C'est Terminé !",
            "<button id='start'>Recommencer</button>",
            "<button id='reboot' class='btn-reboot'>Réinitialiser <i class='fas fa-times-circle'></i></button>"
        );
        start.addEventListener("click", () => this.routine());
        reboot.addEventListener("click",() => utils.reboot());
       
    }
};

page.lobby();