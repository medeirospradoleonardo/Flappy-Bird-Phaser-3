// Cena de boot do jogo (carrega os arquivos e imagens necessárias)
class BootJogo extends Phaser.Scene{
    constructor(){
        super("bootGame")
    }

    preload(){
		this.load.image('fundo','assets/fundo.png') // Fundo do jogo
    	this.load.image('chao','assets/chao.png') // Chão do jogo
		this.load.image('titulo','assets/titulo.png') // Título do jogo
    	this.load.atlas('passaro','assets/passaro.png', 'assets/passaro.json') // Pássaro
    	this.load.image('botao_start','assets/botao_start.png')  // Botão para começar
		this.load.image('botao_score','assets/botao_score.png')  // Botão para ver score
		this.load.image('botao_pause','assets/botao_pause.png')  // Botão para pausar
		this.load.image('botao_resume','assets/botao_resume.png')  // Botão para continuar
		this.load.image('botao_ok','assets/botao_ok.png')  // Botão para pausar
		this.load.image('botao_menu','assets/botao_menu.png')  // Botão para continuar
		this.load.image('botao_som','assets/botao_som.png')  // Botão para continuar
		this.load.image('barreira_bico_direito','assets/barreira_bico_direito.png')  // Botão para continuar
		this.load.image('barreira_bico_inverso','assets/barreira_bico_inverso.png')  // Botão para continuar
		this.load.image('barreira_cano_direito','assets/barreira_cano_direito.png')  // Botão para continuar
		this.load.image('barreira_cano_inverso','assets/barreira_cano_inverso.png')  // Botão para continuar
    	this.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt') // Fonte dos textos
    	this.load.audio('som_voo', 'assets/som_voo.mp3') // Som do voo
    	this.load.audio('som_placar', 'assets/som_placar.mp3') // Som de pontos ganhos ao passar pelas barreiras
    	this.load.audio('som_colisao_barreira', 'assets/som_colisao_barreira.mp3') // Som de colisão com as barreiras
    	this.load.audio('som_colisao_chao', 'assets/som_colisao_chao.mp3') // Som de colisão com o chão
    	this.load.image('texto_get_ready','assets/texto_get_ready.png') // Texto "Get Ready"
    	this.load.image('instrucoes','assets/instrucoes.png') // Instruções de como jogar
    	this.load.image('texto_gameover','assets/texto_gameover.png') // Texto de "Game Over"
    	this.load.image('placar_painel','assets/placar_painel.png') // Score sem medalha
		this.load.image('placar_painel_bronze','assets/placar_painel_bronze.png') // Score com medalha de bronze
		this.load.image('placar_painel_prata','assets/placar_painel_prata.png') // Score com medalha de prata
		this.load.image('placar_painel_ouro','assets/placar_painel_ouro.png') // Score com medalha de ouro
		this.load.image('placar_painel_platinum','assets/placar_painel_platinum.png') // Score com medalha de platinum
		this.load.image('texto_new','assets/texto_new.png') // Score com medalha de platinum
	}
	create(){
		this.scene.start('menuJogo') // Chamando a cena de menu do jogo
	}
}
