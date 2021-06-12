class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        
    }
    create() {
        this.back=this.add.tileSprite(0,0,game.config.width,game.config.height,"space");
        this.back.setOrigin(0,0);
        this.platGroup=this.physics.add.group();
        this.coinGroup=this.physics.add.group();
        this.agrid=new AlignGrid({scene:this,rows:11,cols:11});
        //this.agrid.showNumbers();
        mt.mediaManager.setBackground("background");
        this.score=0;

        this.ball=this.physics.add.sprite(0,0,"ball");
        Align.scaleToGameW(this.ball,.05);
        this.agrid.placeAtIndex(16, this.ball);

        this.ball.setGravity(0,400);
        this.ball.setBounce(.5, .5);
        this.time.addEvent({ delay: 1000, callback: this.makePlat, callbackScope: this, loop:true});
       
        this.time.addEvent({ delay: 2200, callback: this.addCoin, callbackScope: this, loop:true});

        this.scoreText=this.add.text(0,0,"Score:0",{color:'#ffffff',fontSize:game.config.width/15});
        this.scoreText.setOrigin(0.5,0.5);
        this.agrid.placeAtIndex(16,this.scoreText);
        this.physics.add.collider(this.ball, this.platGroup,this.hitPlat,null,this);
        this.physics.add.collider(this.ball, this.coinGroup,this.takeCoin,null,this);
        this.input.on("pointerdown", this.moveBall, this);
        this.makePlat();

        this.lastX=0;
        this.lastY=0;
    }
    hitPlat()
    {
        var diffX=Math.abs(this.lastX-this.ball.x);
        var diffY=Math.abs(this.lastY-this.ball.y);
        this.lastX=this.ball.x;
        this.lastY=this.ball.y;
        if (diffX > 20 || diffY > 20)
        {
            mt.mediaManager.playSound("smallPop");
        }
        
    }
    takeCoin(ball,coin)
    {
        coin.destroy();
        mt.mediaManager.playSound("catch");
        this.score++;
        this.scoreText.setText("Score:"+this.score);
    }
    moveBall(pointer)
    {
        if (pointer.x>this.ball.x)
        {
            this.ball.setVelocityX(150);
        }
        else
        {
            this.ball.setVelocityX(-150);
        }
        
    }
    addCoin()
    {
        var xx=Phaser.Math.Between(0,game.config.width);

        var yy=game.config.height*.95;
        var coin = this.physics.add.sprite(xx,yy,"coin");
        Align.scaleToGameW(coin,.05);
        this.coinGroup.add(coin);
        coin.setImmovable();
        coin.setVelocityY(-100);
    }
    makePlat()
    {
        var xx=Phaser.Math.Between(0,game.config.width);
        var ww=Phaser.Math.Between(1,3);
        if (this.platGroup.children.entries.length==0)
        {
            xx=game.config.width/2;
            ww=3;
        }
        var yy=game.config.height*.95;

        var plat=this.physics.add.sprite(0,0,"block");
        this.platGroup.add(plat);
        plat.setImmovable();
        plat.x=xx;
        plat.y=yy;

        plat.displayHeight=game.config.height*.05;
        
        plat.displayWidth*=ww;

        plat.setVelocityY(-100);
    }
    update() {
        this.platGroup.children.iterate(function(child)
        {
            if (child)
            {
               if (child.y<0)
               {
                   child.destroy();
               } 
            }
        }.bind(this));

        if (this.ball.x>game.config.width || this.ball.x<0 || this.ball.y<0 || this.ball.y>game.config.height)
        {
            mt.mediaManager.stopMusic();
            mt.mediaManager.playSound("hit");
            
            this.scene.start("SceneOver");
        }
        this.back.tilePositionY++;

    }
}