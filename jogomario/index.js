const telaReiniciar = document.getElementById("tela-reiniciar")
const botaoContinuar = document.getElementById("button-continuar")
const botaoReiniciar = document.getElementById("button-reiniciar")

const personagem = document.getElementById("personagem")
let posicao = 0
let direcao = 0
let velocidade = 13
let checarPulo
let checarMovimento

const inimigo = document.getElementById("inimigo")
let checarColisaoComInimigo
let colidiu = false

const cenario = document.getElementById("cenario")
const larguraCenario = cenario.offsetWidth //Pegar largura do cenário
const larguraPersonagem = personagem.offsetWidth //Pegar largura Personagem

const pontos = document.getElementById("pontos")
const vidas = document.getElementById("vidas")
const moedas = document.getElementById("moedas")
//Não criei do tipo let pois esses valores serão utilizados para iniciar o jogo

let pontosAtual = parseInt(localStorage.getItem("pontosAtual")) || 0;
pontos.textContent = pontosAtual //sem isso não funciona
let vidasAtual = parseInt(localStorage.getItem("vidasAtual")) || 5;
vidas.textContent = vidasAtual
let moedasAtual = parseInt(localStorage.getItem("moedasAtual")) || 0
moedas.textContent = moedasAtual

const bloco = document.getElementById("bloco")
let checarColisaoComBloco

const tempo = document.getElementById("tempo")
let tempoAtual = 400
let checarCronometro

/* ----------  Fim Declaração de Variáveis ---------------  */



function continuarPartida(){
    telaReiniciar.style.display = "none"
}

function reiniciarPartida(){
    moedasAtual = 0
    moedasAtual.textContent = moedasAtual
    localStorage.setItem("moedasAtual", moedasAtual)
    pontosAtual = 0
    pontosAtual.textContent = pontosAtual
    localStorage.setItem("pontosAtual", pontosAtual)
    vidasAtual = 5
    vidasAtual.textContent = vidasAtual
    localStorage.setItem("vidasAtual", vidasAtual)
    // vazio
    location.reload()
}

function teclaPressionada(event){
    if(event.key === "ArrowRight"){
        direcao = 1
        personagem.style.backgroundImage = "url(/imagens/marioAndandoLadoDireito.gif)" //mudar posição do mario andando
    } else if (event.key === "ArrowLeft"){
        direcao = -1
        personagem.style.backgroundImage = "url(/imagens/marioAndandoLadoEsquerdo.gif)" //mudar posição do mario andando

        if(colidiu){
            personagem.style.backgroundImage = "url(imagens/marioMorto.gif)"
        }

    } else if (event.code === "Space") {
        personagem.classList.add("puloPersonagem")
        // Não remover o pulo na função 'teclaSolta' porque assim que soltarmos a tecla a animação pode não ser concluída
        //usar 'setTimeout'

        if(colidiu){
            clearTimeout(checarPulo)
            personagem.style.backgroundImage = "url(imagens/marioMorto.gif)"
            // addFuncoesdeTeclas() // - Karla
        } else {
            checarPulo = setTimeout(() => {
                personagem.classList.remove("puloPersonagem")
            },500)
        }

    } else if (event.key === "Enter"){
        telaReiniciar.style.display = "flex"
    }
}

function teclaSolta(event){
    if(event.key === "ArrowRight"){
        direcao = 0
        personagem.style.backgroundImage = "url(/imagens/marioParadoLadoDireito.png)" //mudar posição do mario parado
    } else if (event.key === "ArrowLeft"){
        direcao = 0
        personagem.style.backgroundImage = "url(/imagens/marioParadoLadoEsquerdo.png)" //mudar posição do mario
    }
}

function atualizarMovimento(){
    posicao += direcao * velocidade

    if(posicao < 0){
        posicao = 0
    } else if(posicao > larguraCenario - larguraPersonagem){
        posicao = larguraCenario - larguraPersonagem
    } // limitar espaço dos movimentos horizontais

    personagem.style.left = posicao + "px"
}

function checarMoedas(){
    if(moedasAtual === 20){
        moedasAtual = 0
        moedas.textContent = moedasAtual
        localStorage.setItem("moedasAtual", moedasAtual)
        vidasAtual++
        vidas.textContent = vidasAtual
        localStorage.setItem("vidasAtual", vidasAtual)
    }
}

function colisaoComBloco(){
    const checarPersonagem = personagem.getBoundingClientRect() // Verifica os retângulos de um elemento
    const checarBloco = bloco.getBoundingClientRect()
    if(
        checarBloco.left < checarPersonagem.right &&
        checarBloco.right > checarPersonagem.left &&
        checarBloco.top < checarPersonagem.bottom &&
        checarBloco.bottom > checarPersonagem.top
    )
    {
        clearInterval(checarColisaoComBloco)

        moedasAtual++; pontosAtual+= +10;
        moedas.textContent = moedasAtual
        localStorage.setItem("moedasAtual", moedasAtual)
        pontos.textContent = pontosAtual
        localStorage.setItem("pontosAtual", pontosAtual)

        checarMoedas();

        setTimeout(() => {
            checarColisaoComBloco = setInterval(colisaoComBloco,500)
        }, 300)
    }
}

function checarVidas(){
    if(vidasAtual >= 1){
        location.reload() // recarrega a página 
    } else if(vidasAtual === 0){
        gameOver()
    }
}


function colisaoComInimigo(){  // -- Karla
    const checarPersonagem = personagem.getBoundingClientRect()
    const checarInimigo = inimigo.getBoundingClientRect()

    if(
        checarInimigo.left < checarPersonagem.right &&
        checarInimigo.right > checarPersonagem.left &&
        checarInimigo.top < checarPersonagem.bottom &&
        checarInimigo.bottom > checarPersonagem.top
    ) {
        personagem.style.backgroundImage = "url(imagens/marioMorto.gif)"
        colidiu = true

        let ativarTimeout = true

        while (ativarTimeout){
            clearTimeout(checarMovimento)
            clearTimeout(checarPulo)
            clearInterval(checarColisaoComInimigo)
            ativarTimeout = false
        }
        
        vidasAtual--;
        vidas.textContent = vidasAtual
        localStorage.setItem("vidasAtual", vidasAtual)

        setTimeout(() => {
            checarVidas()
        }, 400)

    }
}

function gameOver(){ // -- Karla
    personagem.style.backgroundImage = "url(/imagens/marioMorto.gif)"
    removerTeclas()
    // add musica, encerrar o jogo, mostrar pontuação
    clearInterval(checarCronometro)
    inimigo.style.display = "none"

    setTimeout(reiniciarPartida(), 2000)

}

function cronometro(){
    tempoAtual--
    tempo.textContent = tempoAtual

    if(tempoAtual === 100){
        //add musica, acelerar movimentos
    } else if (tempoAtual === 0){
        gameOver()
    }
}

function removerTeclas(){
    document.removeEventListener("keydown", teclaPressionada)
    document.removeEventListener("keyup", teclaSolta)
}

function addFuncoesdeTeclas(){
    teclaPressionada()
    teclaSolta()
    atualizarMovimento()
}

if(vidasAtual > 0){
    setInterval(addFuncoesdeTeclas, 50)
}

document.addEventListener("keydown", teclaPressionada)
document.addEventListener("keyup", teclaSolta) //keyup = tecla solta
checarMovimento = setInterval(atualizarMovimento, 50) //Faz a verificação do evento a cada 50 milésimos de segundo
checarColisaoComBloco = setInterval(colisaoComBloco,10)
checarCronometro = setInterval(cronometro, 1000)
checarColisaoComInimigo = setInterval(colisaoComInimigo, 50)
