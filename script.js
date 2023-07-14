const telaJogo = document.querySelector(".tela-jogo");
const fimJogo = document.querySelector(".fim-jogo");
const btnFim = document.querySelector(".fim-jogo .reiniciar");
const pontosElemento = document.querySelector(".pontos");
const recordeElemento = document.querySelector(".recorde");
const controles = document.querySelectorAll(".controles i");

let fimDeJogo = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let pontos = 0;

fimJogo.style.display = "none";

//Pegar o recorde do armazenamento local
let recorde = localStorage.getItem("high-score") || 0;
recordeElemento.innerText = `Recorde: ${recorde}`;

//Criar um food em um aposição aleatoria entre 1 e 30
const atualizarPosicaoComida = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}



const mostraFimDeJogo = () => {
    clearInterval(setIntervalId);
    telaJogo.style.display = "none";
    fimJogo.style.display = "flex";
    
    btnFim.addEventListener("click", () => {
        location.reload();
    })



    //telaJogo.style.background = '#005533';
    //alert("Fim de Jogo! Aperte OK para reiniciar");
    //location.reload();
}
/*
btnFim.addEventListener("click", () => {
    location.reload();
})*/

//Trocar a velocidade baseada en qual tecla foi pressionada
const mudarDirecao = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        console.log("aaa")
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//Mudar direção clicando em qualquer tecla
controles.forEach(button => button.addEventListener("click", () => mudarDirecao({
    key: button.dataset.key
})));

const initGame = () => {
    if (fimDeJogo) return mostraFimDeJogo();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Quando a cobra comer
    if (snakeX === foodX && snakeY === foodY) {
        atualizarPosicaoComida();
        snakeBody.push([foodY, foodX]); //Adiciona comida ao corpo da cobra
        pontos++;
        //Se pontos for maior q recorde, recorde recebe pontos
        recorde = pontos >= recorde ? pontos : recorde;

        localStorage.setItem("high-score", recorde);
        pontosElemento.innerText = `Pontos: ${pontos}`;
        recordeElemento.innerText = `Recorde: ${recorde}`;
    }
    //Atualizar a cabeça da cobra
    snakeX += velocityX;
    snakeY += velocityY;

    //Trocando valores de elementos no corpo da cobra

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    //Verifica se o corpo da cobra está fora da tela ou não
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return fimDeJogo = true;
    }

    //Adicionar uma div como parte do corpo da cobra
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} /
        ${snakeBody[i][0]}"></div>`;

        //Verifica se a cabeça da cobra toca o corpo ou não
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]) {
            fimDeJogo = true;
        }
    }
    telaJogo.innerHTML = html;
}

atualizarPosicaoComida();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", mudarDirecao);
