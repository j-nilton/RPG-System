"use strict";
class Posicao {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanciaPara(outro) {
        let dx = outro.x - this.x;
        let dy = outro.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
class Personagem {
    constructor(nome, saude, alcance, dano, posicao) {
        this.nome = nome;
        this.saude = saude;
        this.alcance = alcance;
        this.dano = dano;
        this.posicao = posicao;
    }
    mover(direcao) {
        switch (direcao) {
            case 'cima':
                this.posicao.y += 1;
                break;
            case 'baixo':
                this.posicao.y -= 1;
                break;
            case 'esquerda':
                this.posicao.x -= 1;
                break;
            case 'direita':
                this.posicao.x += 1;
                break;
            default:
                return false;
        }
        return true;
    }
    atacar(inimigo) {
        let distancia = this.posicao.distanciaPara(inimigo.posicao);
        if (distancia > this.alcance) {
            return false;
        }
        inimigo.tomarDano(this.dano);
        return true;
    }
    tomarDano(dano) {
        this.saude -= dano;
        if (this.saude < 0) {
            this.saude = 0;
        }
    }
}
class Tabuleiro {
    constructor(largura, altura) {
        this.largura = largura;
        this.altura = altura;
        this.personagens = [];
    }
    adicionarPersonagem(personagem) {
        this.personagens.push(personagem);
    }
    removerPersonagem(nome) {
        this.personagens = this.personagens.filter(personagem => personagem.nome !== nome);
    }
    encontrarPersonagem(nome) {
        return this.personagens.find(personagem => personagem.nome === nome);
    }
    moverPersonagem(nome, direcao) {
        let personagem = this.encontrarPersonagem(nome);
        if (personagem) {
            return personagem.mover(direcao);
        }
        return false;
    }
    personagemAtacar(nomeAtacante, nomeAlvo) {
        let atacante = this.encontrarPersonagem(nomeAtacante);
        let alvo = this.encontrarPersonagem(nomeAlvo);
        if (atacante && alvo) {
            return atacante.atacar(alvo);
        }
        return false;
    }
    batalha() {
        while (true) {
            for (let personagem of this.personagens) {
                if (personagem.saude <= 0) {
                    continue;
                }
                console.log(`Turno de ${personagem.nome}`);
                let acao = prompt(`Escolha uma ação para ${personagem.nome} (1: mover, 2: atacar):`);
                if (acao === '1') {
                    let direcao = prompt("Digite a direção (cima, baixo, esquerda, direita):");
                    if (this.moverPersonagem(personagem.nome, direcao)) {
                        console.log(`${personagem.nome} se moveu para ${direcao}.`);
                    }
                    else {
                        console.log("Movimento inválido.");
                    }
                }
                else if (acao === '2') {
                    let alvoNome = prompt("Digite o nome do personagem a ser atacado:");
                    if (this.personagemAtacar(personagem.nome, alvoNome)) {
                        console.log(`${personagem.nome} atacou ${alvoNome} causando ${personagem.dano} de dano!`);
                    }
                    else {
                        console.log("Ataque fora de alcance ou alvo inválido.");
                    }
                }
                this.mostrarStatus();
                if (this.personagens.filter(p => p.saude > 0).length <= 1) {
                    let vencedor = this.personagens.find(p => p.saude > 0);
                    console.log(`${vencedor === null || vencedor === void 0 ? void 0 : vencedor.nome} venceu a batalha!`);
                    return;
                }
            }
        }
    }
    mostrarStatus() {
        for (let personagem of this.personagens) {
            console.log(`${personagem.nome}: Saúde = ${personagem.saude}, Posição = (${personagem.posicao.x}, ${personagem.posicao.y})`);
        }
    }
}
// Teste do sistema de RPG com batalha interativa
let a = new Posicao(0, 0);
let b = new Posicao(3, 2);
let p1 = new Personagem("Guerreiro", 100, 2, 10, a);
let p2 = new Personagem("Arqueiro", 80, 3, 15, b);
let tabuleiro = new Tabuleiro(10, 10);
tabuleiro.adicionarPersonagem(p1);
tabuleiro.adicionarPersonagem(p2);
tabuleiro.batalha();
