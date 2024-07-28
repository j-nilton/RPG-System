class Posicao {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanciaPara(outro: Posicao): number {
        let dx: number = outro.x - this.x;
        let dy: number = outro.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

class Personagem {
    nome: string;
    saude: number;
    alcance: number;
    dano: number;
    posicao: Posicao;

    constructor(nome: string, saude: number, alcance: number, dano: number, posicao: Posicao) {
        this.nome = nome;
        this.saude = saude;
        this.alcance = alcance;
        this.dano = dano;
        this.posicao = posicao;
    }

    mover(direcao: string): boolean {
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

    atacar(inimigo: Personagem): boolean {
        let distancia = this.posicao.distanciaPara(inimigo.posicao);
        if (distancia > this.alcance) {
            return false;
        }
        inimigo.tomarDano(this.dano);
        return true;
    }

    tomarDano(dano: number) {
        this.saude -= dano;
        if (this.saude < 0) {
            this.saude = 0;
        }
    }
}

class Tabuleiro {
    largura: number;
    altura: number;
    personagens: Personagem[];

    constructor(largura: number, altura: number) {
        this.largura = largura;
        this.altura = altura;
        this.personagens = [];
    }

    adicionarPersonagem(personagem: Personagem) {
        this.personagens.push(personagem);
    }

    removerPersonagem(nome: string) {
        this.personagens = this.personagens.filter(personagem => personagem.nome !== nome);
    }

    encontrarPersonagem(nome: string): Personagem | undefined {
        return this.personagens.find(personagem => personagem.nome === nome);
    }

    moverPersonagem(nome: string, direcao: string): boolean {
        let personagem = this.encontrarPersonagem(nome);
        if (personagem) {
            return personagem.mover(direcao);
        }
        return false;
    }

    personagemAtacar(nomeAtacante: string, nomeAlvo: string): boolean {
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
                    } else {
                        console.log("Movimento inválido.");
                    }
                } else if (acao === '2') {
                    let alvoNome = prompt("Digite o nome do personagem a ser atacado:");
                    if (this.personagemAtacar(personagem.nome, alvoNome)) {
                        console.log(`${personagem.nome} atacou ${alvoNome} causando ${personagem.dano} de dano!`);
                    } else {
                        console.log("Ataque fora de alcance ou alvo inválido.");
                    }
                }

                this.mostrarStatus();

                if (this.personagens.filter(p => p.saude > 0).length <= 1) {
                    let vencedor = this.personagens.find(p => p.saude > 0);
                    console.log(`${vencedor?.nome} venceu a batalha!`);
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
let a: Posicao = new Posicao(0, 0);
let b: Posicao = new Posicao(3, 2);
let p1: Personagem = new Personagem("Guerreiro", 100, 2, 10, a);
let p2: Personagem = new Personagem("Arqueiro", 80, 3, 15, b);

let tabuleiro: Tabuleiro = new Tabuleiro(10, 10);
tabuleiro.adicionarPersonagem(p1);
tabuleiro.adicionarPersonagem(p2);

tabuleiro.batalha();