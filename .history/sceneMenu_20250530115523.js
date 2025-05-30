var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function(){
        Phaser.Scene.call(this, {"key": "sceneMenu"});
    },
    init(){},
    preload(){
        this.load.image('bg_start', 'assets/images/bg_start.png');
        this.load.image('btn_play', 'assets/images/btn_play.png');
        this.load.image('title_game', 'assets/images/title_game.png');
        this.load.image('panel_skor', 'assets/images/panel_skor.png');
        this.load.audio('snd_ambience', 'assets/audio/ambience.mp3');
        this.load.audio('snd_touch', 'assets/audio/touch.mp3');
        this.load.audio('snd_transisi_menu', 'assets/audio/transisi_menu.mp3');
        // FIXED: Menggunakan nama key yang konsisten
        this.load.spritesheet("sps_mummy", "assets/sprite/mummy37x45.png", { frameWidth: 37, frameHeight: 45 });
    },

    create(){
        X_POSITION = {
            LEFT: 0,
            CENTER: game.canvas.width / 2,
            RIGHT: game.canvas.width,
        }

        Y_POSITION = {
            TOP: 0,
            CENTER: game.canvas.height / 2,
            BOTTOM: game.canvas.height,
        }

        //mengisikan variabel global dengan musik latar jika
        //variabel snd_ambience masih kosong
        if(snd_ambience == null){
            snd_ambience = this.sound.add('snd_ambience');
            snd_ambience.loop = true;
            snd_ambience.setVolume(0.35);
            snd_ambience.play();
        }
        //membuat variabel sound lain
        this.snd_touch = this.sound.add('snd_touch');
        var snd_transisi = this.sound.add('snd_transisi_menu');
        //variabel untuk menampung skor tertinggi yang sudah pernah dicapai
        var skorTertinggi = localStorage["highscore"] || 0;
        
        // Menambahkan background ke dalam scene
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "bg_start");

        // Menambahkan sprite tombol play ke dalam scene
        var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "btn_play");
        btnPlay.setDepth(10);

        //menambahkan judul game
        this.titleGame = this.add.image(1024/2, 200, 'title_game');
        this.titleGame.setDepth(10);

        //mengurangi posisi y judul game sebanyak 384 pixel
        this.titleGame.y -= 384;

        //membuat panel nilai
        var panelSkor = this.add.image(1024/2, 768-120, 'panel_skor');
        panelSkor.setOrigin(0.5);
        panelSkor.setDepth(10);
        panelSkor.setAlpha(0.8);

        //membuat label skor pada panel
        var lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, "High Score : " + skorTertinggi);
        lblSkor.setOrigin(0.5);
        lblSkor.setDepth(10);
        lblSkor.setFontSize(25);
        lblSkor.setTint(0xff732e);

        var diz = this;
        
        // FIXED: Membuat animasi mummy terlebih dahulu sebelum membuat sprite
        this.anims.create({
            key: 'mummy_walk', // Memberikan nama key yang jelas
            frames: this.anims.generateFrameNumbers("sps_mummy", { start: 0, end: -1 }), // Menggunakan semua frame
            frameRate: 16,
            repeat: -1 // Animasi berulang terus
        });

        // FIXED: Menambahkan sprite mummy dengan skala yang benar
        const mummySprite = this.add.sprite(850, 768 / 2 + 150, "sps_mummy");
        mummySprite.setScale(4); // FIXED: Menggunakan nilai skala yang valid (bukan variabel 'd')
        mummySprite.setDepth(10);
        mummySprite.play('mummy_walk'); // Memainkan animasi yang sudah dibuat

        //menambahkan animasi judul game
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Bounce.easeOut',
            duration: 750,
            delay: 250,
            y: 200,
            onComplete: function(){
                snd_transisi.play();
            }
        });

        //mengatur scale awal btnPlay menjadi 0
        btnPlay.setScale(0);

        //menambahkan animasi ke tombol Play
        this.tweens.add({
            targets: btnPlay,
            ease: 'Back',
            duration: 500,
            delay: 750,
            scaleX: 1,
            scaleY: 1
        });

        // FIXED: Mengatur scale awal title game menjadi 0
        this.titleGame.setScale(0);

        //animasi title
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Elastic',
            duration: 750,
            delay: 1000,
            scaleX: 1,
            scaleY: 1
        });

        // FIXED: Menambahkan variabel penanda di awal sebelum digunakan
        var isBtnClicked = false;

        this.input.on('gameobjectover', function (pointer, gameObject) {
            console.log('Scene Menu | Object Over');
            if (!isBtnClicked) return;
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            console.log('Scene Menu | Object Out');
            if (!isBtnClicked) return;
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
                isBtnClicked = true;
            }
        }, this);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log('Scene Menu | Object Click');
            if (gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
                isBtnClicked = true;
            }
        }, this);

        //menambahkan deteksi objek selesai diklik
        this.input.on('gameobjectup', function (pointer, gameObject) {
            console.log('Scene Menu | Object End Click');
            if (gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
                this.scene.start('scenePlay');
                this.snd_touch.play();
            }
        }, this);

        this.input.on('pointerup', function (pointer, gameObject) {
            console.log('Scene Menu | Mouse Up');
            isBtnClicked = false;
        }, this);

        btnPlay.setInteractive();
    },
    update(){}
});