let volume = 0.5 // Vai de 0 até 1

// Cena do menu do jogo
class MenuJogo extends Phaser.Scene{
    constructor(){
        super("menuJogo")
    }

    preload(){
        //  Carregando o plugin responsável pela slider bar do som
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })
    }

	create(){

        const cena_atual = this

		this.fundo = this.add.tileSprite(160,252.5,320,505,'fundo') // Sprite do fundo (para animá-lo)
		this.chao = this.add.tileSprite(160,450,505,112,'chao') // Sprite do chão (para animá-lo)
        game.sound.volume = volume // Deixando o volume padrão

        // Animação das asas passaro
        const animacao_asas_passaro_config = {
            key: 'asas',
            frames: 'passaro',
            frameRate: 12,
            repeat: -1
        }

        this.anims.create(animacao_asas_passaro_config)

        this.passaro = this.add.sprite(260, 97, 'passaro', '0') // Sprite do pássaro (para animá-lo)
        this.passaro.play('asas'); // Animando as asas do pássaro

        this.logo = this.add.image(130, 100, 'titulo').setScale(0.35) // Imagem do título do jogo

        // Animação do passaro junto ao título (subindo e descendo)
        var animacao_titulo_passaro = this.tweens.add({
            targets: [this.logo, this.passaro],
            props: {
                y: { value: this.logo.y + 10, duration: 400,  },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        })

        this.botao_start = this.add.image(94, 360, 'botao_start').setScale(0.5).setInteractive({useHandCursor: true}) // Botão Start

        // Ao clicar no botão Start, ele abaixa 1px (para dar ideia de clique)
        this.botao_start.on('pointerdown', function (event) {
            this.y += 1
        })

        // Ao soltar o botão Start, ele sobe 1px (para dar ideia de clique) e inicia o sombreamento da tela (Fade Out) e chama a cena "JogoRodando"
        this.botao_start.on('pointerup', function (event) {
            this.y -= 1
            cena_atual.cameras.main.fadeOut(1000, 0, 0, 0)
            volume = cena_atual.som_menu.value
            cena_atual.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                cena_atual.scene.start('jogoRodando')
            })

        })

        this.botao_score = this.add.image(224, 360, 'botao_score').setScale(0.5).setInteractive({useHandCursor: true}) // Botão Score

        // Slider de som
        this.som_menu = this.rexUI.add.slider({
            x: 160,
            y: -10,
            width: 200,
            height: 20,
            orientation: 'x',

            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xE98B5A),
            indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xED7434),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xED7434),

            input: 'drag', // 'drag'|'click'
            valuechangeCallback: function (value) {
                game.sound.volume = value
            },

        })
            .layout();

        // Deixando o som no volume padrão
        this.som_menu.value = volume

        // Variável booleana para indicar se o slider do som desceu ou subiu
        this.som_menu_desceu = false

        // Animação do slider do som descendo
        this.animacao_som_menu_descer = this.tweens.add({
            targets: this.som_menu,
            props: {
                y: { value: this.som_menu.y + 34, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        })
        
        this.animacao_som_menu_descer.stop()

        // Animação do slider do som subindo
        this.animacao_som_menu_subir = this.tweens.add({
            targets: this.som_menu,
            props: {
                y: { value: this.som_menu.y - 34, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        })

        this.animacao_som_menu_subir.stop()


        this.botao_som = this.add.image(24, 24, 'botao_som').setScale(0.55).setInteractive({useHandCursor: true}) // Botão Som

        // Ao clicar no botão Som, ele abaixa 1px (para dar ideia de clique)
        this.botao_som.on('pointerdown', function (event) {
            this.y = this.y + 1
        })

        // Ao clicar no botão Som, ele sobe 1px (para dar ideia de clique) e se a variável som_menu_desceu for true, ele sobe o slider, se for false, ele desce o slider
        this.botao_som.on('pointerup', function (event) {
            this.y = this.y - 1
            if(!cena_atual.som_menu_desceu){
                cena_atual.som_menu_desceu = true
                cena_atual.animacao_som_menu_descer.resume()
            }
            else{
                cena_atual.som_menu_desceu = false
                cena_atual.animacao_som_menu_subir.resume()
            }
        })





	}

    update ()
    {
        this.chao.tilePositionX += 0.5
        this.fundo.tilePositionX += 0.1
    }
}