let cena_atual // Variável que contém a cena atual
let largura_jogo // Variável que contém a largura do jogo
let altura_jogo // Variável que contém a altura do jogo
const espaco_entre_barreiras = 180 // Variável que contém o tamanho do espaço entre as barreiras
let parar_chao_e_fundo = false // Variável booleana para parar ou não a animação do chão e do fundo
let melhor_placar = 0 // Variável que contém o melhor placar

class JogoRodando extends Phaser.Scene{


    constructor(){
        super("jogoRodando")
    }

    create(){

        cena_atual = this
        
        largura_jogo = game.scale.width
        altura_jogo = game.scale.height
        
        this.cameras.main.fadeIn(1000, 0, 0, 0) // Fade in de transição de cena, (cena começa escura e vai ficando clara)
        
        
        this.som_voo = this.sound.add('som_voo') // Som de voo
		this.som_placar = this.sound.add('som_placar') // Som de placar
		this.som_colisao_barreira = this.sound.add('som_colisao_barreira') // Som de colisão com a barreira
		this.som_colisao_chao = this.sound.add('som_colisao_chao') // Som de colisão com o chão
        
        
        this.fundo = this.add.tileSprite(160,252.5,320,505,'fundo') // Fundo

        this.grupo_barreiras = new Array() // Array que contém o grupo de barreiras (o número de barreiras será o numero máximo de barreiras que ficarão na tela ao mesmo tempo)
        
        if(largura_jogo % espaco_entre_barreiras == 0){
            this.qtd_barreiras =  (largura_jogo / espaco_entre_barreiras ) + 1
        }else{
            this.qtd_barreiras = Math.floor( largura_jogo / espaco_entre_barreiras ) + 2
        }


        this.grupo_barreiras_fisica = this.add.group()

        for(let i=0; i<this.qtd_barreiras; i++){

            var a = this.add.image(largura_jogo, -1000, 'barreira_cano_inverso')
            var b = this.add.image(largura_jogo, -1000, 'barreira_bico_inverso')
            var c = this.add.image(largura_jogo, -1000, 'barreira_bico_direito')
            var d = this.add.image(largura_jogo, -1000, 'barreira_cano_direito')


            var grupo_cada = this.physics.add.group()

            grupo_cada.add(a)
            grupo_cada.add(b)
            grupo_cada.add(c)
            grupo_cada.add(d)
            grupo_cada.getChildren()[0].tem_placar = false

            this.grupo_barreiras_fisica.add(grupo_cada)


        }


        this.chao = this.add.tileSprite(160,450,505,112,'chao') // Chão

        this.platform = this.physics.add.existing(this.chao, true) // Física ao chão

        
        this.texto_get_ready = this.add.image(158, 0, 'texto_get_ready') // Texto "Get Ready"
        this.texto_placar = this.add.bitmapText(150, 0, 'flappy_font', '0', 36) // Texto "Get Ready"
        
        this.passaro = this.physics.add.sprite(105, 265, 'passaro')

        // Animação do placar aparecendo
        var animacao_texto_placar = this.tweens.add({
            targets: this.texto_placar,
            props: {
                y: { value: this.texto_placar.y + 30, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        })

        // Animação do texto "Get Ready" aparecendo
        var animacao_texto_get_ready = this.tweens.add({
            targets: this.texto_get_ready,
            props: {
                y: { value: this.texto_get_ready.y + 120, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        })

        this.instrucoes = this.add.image(158, 290, 'instrucoes') // Instruções


        this.placar = 0 // Variável que contém o valor do placar atual

        this.botao_pause = this.add.image(24, 0, 'botao_pause').setScale(0.55).setInteractive({useHandCursor: true}) // Botão Pause


        // Animação do pássaro (subindo e descendo)
        this.animacao_passaro = this.tweens.add({
            targets: this.passaro,
            props: {
                y: { value: this.passaro.y + 10, duration: 400,  },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            paused: true
        })

        // Animação asas do pássaro
        const animConfig = {
            key: 'asas',
            frames: 'passaro',
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(animConfig);


        // Animação do botão Pause (descendo)
        this.animacao_botao_pause = this.tweens.add({
            targets: this.botao_pause,
            props: {
                // x: { value: 700, duration: 4000, flipX: true },
                y: { value: this.botao_pause.y + 24, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        });



        // Ao clicar no botão Pause, ele abaixa 1px (para dar ideia de clique)
        this.botao_pause.on('pointerdown', function (event) {
            this.y = this.y + 1
        })

        // Ao soltar o botão Pause, ele sobe 1px (para dar ideia de clique) e chama a cena "PauseJogo"
        this.botao_pause.on('pointerup', function (event) {
            this.y = this.y - 1
            this.visible = false;
            cena_atual.scene.launch('pauseJogo')
            cena_atual.scene.pause()
        })

        // Colisão do chão e o pássaro
        this.colisao_chao = this.physics.add.collider(this.passaro, this.platform, this.colidiu_com_chao)

        // Colisão do chão e as barreiras
        this.colisao_barreira = this.physics.add.overlap(this.passaro, this.grupo_barreiras_fisica, this.colidiu_com_barreira)

        this.botao_ok = this.add.image(120, 300, 'botao_ok').setScale(0.5).setInteractive({useHandCursor: true}) // Botão Ok

        this.botao_menu = this.add.image(220, 300, 'botao_menu').setScale(0.5).setInteractive({useHandCursor: true}) // Botão Menu

        this.painel_de_placar_menor_que_10 = this.add.image(158, -100,'placar_painel') // Painel do placar sem a medalha
        this.painel_de_placar_menor_que_20 = this.add.image(158, -100,'placar_painel_bronze') // Painel do placar com a medalha de bronze
        this.painel_de_placar_menor_que_30 = this.add.image(158, -100,'placar_painel_prata') // Painel do placar com a medalha de prata
        this.painel_de_placar_menor_que_40 = this.add.image(158, -100,'placar_painel_ouro') // Painel do placar com a medalha de ouro
        this.painel_de_placar_maior_que_40 = this.add.image(158, -100,'placar_painel_platinum') // Painel do placar com a medalha de platinum

        this.texto_gameover = this.add.image(158, -100,'texto_gameover') // Texto "Game Over"
        this.mostrar_resultado = false // Variável booleana para mostrar ou não o resultado

        // Animação do texto "Game Over" (descendo)
        this.animacao_texto_gameover = this.tweens.add({
            targets: this.texto_gameover,
            props: {
                y: { value: this.texto_gameover.y + 200, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0,
            onComplete: () => {
                this.valor_resultado_provisorio = 0

                this.botao_menu.visible = true
                this.botao_ok.visible = true

                this.placar_tela.visible = true
		        this.melhor_placar_tela.visible = true
                if(this.quebrou_recorde){
                    this.texto_new.visible = true
                }

                const ad = window.setInterval(function(){
                    cena_atual.placar_tela.text = cena_atual.valor_resultado_provisorio
                    cena_atual.valor_resultado_provisorio += 1
                    if(cena_atual.valor_resultado_provisorio >= cena_atual.placar + 1){
                        clearInterval(ad)
                    }
                }, 50)
            }
        })

        this.animacao_texto_gameover.stop()

        // Animação do painel de placar (descendo)
        this.animacao_scoreboard = this.tweens.add({
            targets: [this.painel_de_placar_menor_que_10, this.painel_de_placar_menor_que_20, this.painel_de_placar_menor_que_30, this.painel_de_placar_menor_que_40, this.painel_de_placar_maior_que_40],
            props: {
                y: { value: this.painel_de_placar_menor_que_10.y + 300, duration: 800,  },
            },
            ease: 'Sine.easeInOut',
            // yoyo: true,
            repeat: 0
        })

        this.animacao_scoreboard.stop()

        // Ao clicar no botão Ok, ele abaixa 1px (para dar ideia de clique)
        this.botao_ok.on('pointerdown', function (event) {
            this.y += 1
        })

        // Ao soltar o botão Ok, ele sobe 1px (para dar ideia de clique) e o jogo se inicia de novo com a função preparação
        this.botao_ok.on('pointerup', function (event) {
            this.y -= 1
            cena_atual.preparacao()
        })

        // Ao clicar no botão Menu, ele abaixa 1px (para dar ideia de clique)
        this.botao_menu.on('pointerdown', function (event) {
            this.y += 1
        })

        // Ao soltar o botão Menu, ele sobe 1px (para dar ideia de clique) e volta para cena MenuJogo
        this.botao_menu.on('pointerup', function (event) {
            this.y -= 1
            cena_atual.scene.start('menuJogo')

        })

        this.placar_tela = this.add.bitmapText(225, 180, 'flappy_font', this.placar+'', 20) // Placar na tela
		this.melhor_placar_tela = this.add.bitmapText(225, 228, 'flappy_font', melhor_placar+'', 20) // Melhor placar na tela
        this.quebrou_recorde = false // Variável booleana para indicar se o recorde foi quebrado ou não
        this.texto_new = this.add.image(180, 213,'texto_new').setScale(0.30) // Texto "New"

        this.preparacao()
        
    }

    preparacao(){

        // Colocando as barreiras fora do mapa
        this.grupo_barreiras_fisica.getChildren().forEach((b) => {
            b.getChildren()[0].tem_placar = false
            b.getChildren().forEach(c => {
                c.x = largura_jogo
                c.y = -1000
            })
        })

        // Deixando os placares escondidos
        this.placar_tela.text = '0'
        this.placar_tela.visible = false
		this.melhor_placar_tela.visible = false
        this.texto_new.visible = false
        this.quebrou_recorde = false
        
        this.painel_de_placar_menor_que_10.visible = false
		this.painel_de_placar_menor_que_20.visible = false
		this.painel_de_placar_menor_que_30.visible = false
		this.painel_de_placar_menor_que_40.visible = false
		this.painel_de_placar_maior_que_40.visible = false


        // Deixando texto "Game Over" e botões escondidos
        this.texto_gameover.visible = false
        this.botao_ok.visible = false
        this.botao_menu.visible = false

        parar_chao_e_fundo = false

        this.barreira_atual = 0
        this.barreira_passar = 0

        this.game_over_habilitado = false
        this.colidiu_com_chao = false
        this.comecou = false


        this.texto_get_ready.visible = true
        this.instrucoes.visible = true
        this.texto_placar.visible = true

        this.texto_placar.text = 0
        this.placar = 0

        this.passaro.angle = 0
        this.passaro.x = 105
        this.passaro.y = 265

        // Ativando a animação das asas do pássaro e habilitando a física dele
        this.passaro.play('asas')
        this.passaro.body.enable = true
        this.passaro.body.velocity.y = 0
        this.passaro.body.gravity.y = 0;
        this.passaro.setBounce(1)
        this.passaro.setCollideWorldBounds(true)
        
        this.animacao_passaro.resume()





        this.colisao_chao.active = true
        this.colisao_barreira.active = true

        // Evitar o bug de quando ao clicar no ok, o pássaro já pula a preparação
        setTimeout(() => {  this.input.on('pointerup', () => {
            this.fly()
            this.comecar_jogo()
        }, this) }, 0.000000000000000001)


        // Colocando a função fly no espaço
        this.input.keyboard.on('keyup-SPACE', () => {
            this.fly()
            this.comecar_jogo()
        }, this)
    }

    comecar_jogo(){

        // Tirando os eventos do mouse e teclado
        delete this.input._events['pointerup']
        delete this.input.keyboard._events['keyup-SPACE']


        this.comecou = true

        this.texto_get_ready.visible = false
        this.instrucoes.visible = false

        this.animacao_passaro.pause();
        this.input.keyboard.on('keyup-SPACE', this.fly, this)
        this.mouse = this.input.on('pointerup', this.fly, this)

        this.y_antes_passaro = this.passaro.y
        this.passaro.body.gravity.y = 1000

        this.grupo_barreiras_fisica.getChildren().forEach((b) => {
                b.getChildren().forEach(c => {
                    c.body.velocity.x = -200
                    // a.body.setCollideWorldBounds(true);
                    c.body.onWorldBounds = true
                    // a.body.setOutOfBoundsKill(true) 
                })
        })

        this.gerar_barreiras()
    }

    verificar_placar(barreira){ // Função responsável por checar o score de determinada barreira
        if(!barreira.tem_placar && barreira.x<=this.passaro.x-34){ // Se o pássaro tiver passado da barreira, adiciona 1 ao score, e faça o som de score
            barreira.tem_placar = true
            this.texto_placar.text = ++this.placar
            this.som_placar.play()
            this.barreira_passar += 1
            if(this.barreira_passar == this.qtd_barreiras){
                this.barreira_passar = 0
            }
            return true
        }
        return false
    }

    gerar_barreiras(espacamento){ // Função para gerar barreiras com um espaçamento passado como atributo
        espacamento = 150 // Se não for passado atributo, o espaçamento como padrão será 70

        // Intervalo maximo e mínimo de posição y de uma barreira
        var pos_bico_direito_min = 16
        var pos_bico_direito_max = altura_jogo - 127 - espacamento

        var position = Math.random() * (pos_bico_direito_max - pos_bico_direito_min) + pos_bico_direito_min;


        if(this.barreira_atual == this.qtd_barreiras){
            this.barreira_atual = 0
        }

        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[0].tem_placar = false


        
        // Posicionando cada parte das barreiras em seus eixos x e y
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[0].x = largura_jogo + 50
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[1].x = largura_jogo + 50
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[2].x = largura_jogo + 50
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[3].x = largura_jogo + 50

        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[0].y = position - 160
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[1].y = position
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[2].y = position + espacamento
        this.grupo_barreiras_fisica.getChildren()[this.barreira_atual].getChildren()[3].y = position + espacamento + 160

        this.barreira_atual += 1


    }

    colidiu_com_chao(){
        cena_atual.passaro.body.enable = false

        cena_atual.colisao_chao.active = false
        cena_atual.som_colisao_chao.play(); // Execução do som de colisão com o chão
        cena_atual.gameOver(true) // chamando a função game over na hora
        this.colidiu_com_chao = true // Seta a variavel booleana de colisão com o chão em true
    }

    colidiu_com_barreira(){ // Função de colisão com a barreira
        if(this.game_over_habilitado){
            return // Se o jogo já está em game over, só retorna
        }

        // Se o jogo ainda não foi setado em game over
        document.getElementsByTagName('canvas')[0].style.opacity = 1 // Pisca a tela
        const interval = window.setInterval(function(){
            document.getElementsByTagName('canvas')[0].style.opacity = document.getElementsByTagName('canvas')[0].style.opacity - 0.05
            if(document.getElementsByTagName('canvas')[0].style.opacity < 0){
                    document.getElementsByTagName('canvas')[0].style.opacity = 1
                    clearInterval(interval)
            }
        }, 2)


        cena_atual.som_colisao_barreira.play(); // Execução do som de colisão com a barreira
        cena_atual.colisao_barreira.active = false
        cena_atual.gameOver() // Chamando a função game over, não vai excutar na hora, pois ela só faz isso quando chega ao chão
    }

    fly(){
        if(!(((game.input.mousePointer.x >= cena_atual.botao_pause.x) && (game.input.mousePointer.x <= cena_atual.botao_pause.x + cena_atual.botao_pause.width)) && ((game.input.mousePointer.y >= cena_atual.botao_pause.y) && (game.input.mousePointer.y <= cena_atual.botao_pause.y + cena_atual.botao_pause.height)))){
            this.y_antes_passaro = this.passaro.y
            this.passaro.body.velocity.y = -300 // O quanto ele sobe com uma clicada
            this.som_voo.play()
            // Inclinando o pássaro
            var tween = this.tweens.addCounter({
                from: 0,
                to: -45,
                duration: 150,
                repeat: 0,
                onUpdate: function (tween)
                {
                    cena_atual.passaro.setAngle(tween.getValue())
                }
            })
        }
    }

    parar_jogo(){ // Função responsável por parar o jogo
        parar_chao_e_fundo = true // Para a animação do chão
        this.grupo_barreiras_fisica.getChildren().forEach((a) => {
            a.getChildren().forEach((b) => {
                b.body.velocity.x = 0
            })
        })
        this.passaro.stop()
        delete this.input._events['pointerup']
        delete this.input.keyboard._events['keyup-SPACE']
    }

    mostrar_gameover(){ // Função responsável por mostrar o texto após game over

        this.comecou = false

		this.texto_placar.visible = false // Apaga o score da tela
		melhor_placar = melhor_placar || 0 // Pega o melhor score, se já tem

		if(this.placar > melhor_placar){ // Se o score atual for melhor que o melhor score, substitui ele
			melhor_placar = this.placar
            this.quebrou_recorde = true
		}

        this.melhor_placar_tela.text = melhor_placar


		if(this.placar < 10){ // Se o score for menor que 10, não terá medalha
			this.painel_de_placar_menor_que_10.visible = true
		}else if(this.placar < 20){ // Se o score for maior que 10 e menor que 20, terá medalha de bronze
			this.painel_de_placar_menor_que_20.visible = true
		}else if(this.placar < 30){ // Se o score for maior que 20 e menor que 30, terá medalha de prata
			this.painel_de_placar_menor_que_30.visible = true
		}else if(this.placar < 40){ // Se o score for maior que 30 e menor que 40, terá medalha de ouro
			this.painel_de_placar_menor_que_40.visible = true
		}else{ // Se o score for maior que 40, terá medalha de platinum
			this.painel_de_placar_maior_que_40.visible = true
		}

        this.botao_ok.x = 100
        this.botao_ok.y = 300
        
        this.texto_gameover.visible = true

        this.animacao_texto_gameover.play()
        this.animacao_scoreboard.play()

        
	}

    gameOver(show_text){ // Função responsável por setar o game over
        this.game_over_habilitado = true // Setando a variável booleana de game over em true
        cena_atual.parar_jogo() // Parando o jogo
        if(show_text){ // Se ja for pra mostrar o texto (Relou no chão), chama o texto
            this.mostrar_gameover()	
        }
    }


    


    update(){


        if(!parar_chao_e_fundo){
            // Animação do chão e fundo
            this.chao.tilePositionX += 0.5
            this.fundo.tilePositionX += 0.1
        }


        if(this.comecou){
            // Verificação de placar
            this.verificar_placar(this.grupo_barreiras_fisica.getChildren()[this.barreira_passar].getChildren()[0])

            // Começa a geração de barreiras
            if(this.grupo_barreiras_fisica.getChildren()[this.barreira_atual-1].getChildren()[0].x <= largura_jogo - espaco_entre_barreiras + 50){
                this.gerar_barreiras()
            }

            if(this.passaro.y >= this.y_antes_passaro){
                if(this.passaro.angle < 90){
                    this.passaro.angle += 3 // Isso faz com o que o pássaro comece a se inclinar
                } 
            }
        }

    }

}