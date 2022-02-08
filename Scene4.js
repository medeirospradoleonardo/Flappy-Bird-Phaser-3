// Cena de Pause do jogo
class PauseJogo extends Phaser.Scene{
    constructor(){
        super("pauseJogo")
    }

    create(){

        const cena_atual = this
        const cena_jogo_rodando = game.scene.scenes[2]

        this.botao_resume = this.add.image(24, 24, 'botao_resume').setScale(0.55).setInteractive({useHandCursor: true}) // Botão Resume

        // Ao clicar no botão Resume, ele abaixa 1px (para dar ideia de clique)
        this.botao_resume.on('pointerdown', function (event) {
            this.y += 1

        });

        // Ao soltar o botão Resume, ele sobe 1px (para dar ideia de clique) e volta para cena do JogoRodando
        this.botao_resume.on('pointerup', function (event) {
            this.y -= 1
            cena_jogo_rodando.botao_pause.visible = true
            cena_atual.botao_resume.visible = false
            cena_atual.scene.resume('jogoRodando')
            cena_atual.scene.stop()
        });
    }

}