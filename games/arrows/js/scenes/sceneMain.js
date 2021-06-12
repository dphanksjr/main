class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        
    }
    create() {
        this.checkFlag=false;
        mt.mediaManager.setBackground("background");
        this.arrowGroup=this.physics.add.group();
        this.arrowCount = 100;
        this.blockGroup=this.physics.add.group();

        this.speed=100;
        this.arrowsShot=0;
        this.score=0;


        this.back=this.add.image(0,0,"back");
        this.back.displayHeight=game.config.height;
        this.back.displayWidth=game.config.width;
        this.back.setOrigin(0,0);

        this.agrid=new AlignGrid({scene:this,rows:11,cols:11});
        //this.agrid.showNumbers();

        var wall=this.add.image(0,0,"wall");
        Align.scaleToGameW(wall,1);
        wall.x=game.config.width/2;
        wall.y=wall.displayHeight/2;
        this.wall = wall;


        this.target=this.physics.add.sprite(0,0,"target");
        Align.scaleToGameW(this.target,.2);
        this.agrid.placeAtIndex(16,this.target);
        this.target.setVelocityX(this.speed);
        this.target.setImmovable();

        this.input.on('pointerdown',this.addArrow, this);
        this.physics.add.collider(this.target, this.arrowGroup, this.hitTarget, null,this);
    
        this.arrowCountText=this.add.text(0,0,this.arrowCount,{color:'#000000',fontSize:game.config.width/30});
        this.arrowCountText.setOrigin(0.5,0.5);
        this.agrid.placeAtIndex(100,this.arrowCountText);
        this.arrowIcon=this.add.image(0,0,"arrow");
        Align.scaleToGameW(this.arrowIcon,.01);
        this.agrid.placeAtIndex(99,this.arrowIcon);

        this.scoreText=this.add.text(0,0,"0/0");
        this.scoreText.setOrigin(0.5, 0.5);
        this.agrid.placeAtIndex(108, this.scoreText);
        

        this.setColliders();


    }
    setColliders(){
        this.physics.add.collider(this.target, this.arrowGroup, this.hitTarget, null,this);
        this.physics.add.collider(this.arrowGroup, this.blockGroup, this.hitBlock, null,this);

    } 
    hitBlock(arrow,block)
    {
        arrow.destroy();
        
    }

    addBlock(pos)
    {
        var block=this.physics.add.sprite(0,0,"block");  
        Align.scaleToGameW(block,0.1);
        this.blockGroup.add(block);
        this.agrid.placeAtIndex(pos,block);
        block.setVelocityX(this.speed);
        block.setImmovable();

    }
    updateText()
    {
        this.scoreText.setText(this.score+"/"+this.arrowsShot);
    }
    hitTarget(target,arrow)
    {
        arrow.destroy();
        this.score++;
        this.speed += 8;
        this.updateText();
        var effect=new Effect({scene:this,effectNumber: mt.model.effectNumber});
        effect.x=this.target.x;
        effect.y=this.target.y;
        if (this.score==10)
        {
            this.addBlock(50);
        }
        if (this.score==20)
        {
            this.addBlock(68);
        }
        if (this.score==40)
        {
            Align.scaleToGameW(this.target,.15);
        }
        if (this.score==50)
        {
            this.addBlock(22);
        }
        if (this.score==60)
        {
            Align.scaleToGameW(this.target,.10);
        }
        mt.mediaManager.playSound("hit");
    }
    addArrow(pointer)
    {
        if (this.arrowCount==0)
        {
            return;
        }
        this.arrowCount--;
        this.arrowsShot++;
        this.arrowCountText.setText(this.arrowCount);
        var arrow=this.physics.add.sprite(0,0,"arrow");
        Align.scaleToGameW(arrow, .025);
        this.arrowGroup.add(arrow);
        this.agrid.placeAtIndex(93,arrow);
        arrow.x=pointer.x;
        arrow.setVelocityY(-550);
        this.updateText();
        if (this.arrowCount>10)
        {
            if (this.arrowCount / 2 == Math.floor(this.arrowCount /2)){
                mt.mediaManager.playSound("swish1");
            }else {
                mt.mediaManager.playSound("swish2");
            }
        }
        else
        {
            mt.mediaManager.playSound("pop");
        }
    }
    update() {
        if (this.target.x>game.config.width)
        {
            this.target.setVelocityX(-this.speed);
        }
        if (this.target.x < 0)
        {
            this.target.setVelocityX(this.speed);
        }
        this.arrowGroup.children.iterate(function(child){
        if (child) {
            if (child.y < 0){
                child.destroy();
            }
        }

        }.bind(this));
       
        this.blockGroup.children.iterate(function(child){
            if (child) {
                if (child.x < 0){
                    child.setVelocityX(this.speed);
                }
                if (child.x>game.config.width)
                {
                    child.setVelocityX(-this.speed);
                }
            }
    
            }.bind(this));
            if (this.arrowCount == 0 && this.arrowGroup.children.entries.length == 0){
                
                this.checkWin();
               
            }
        }
        checkWin()
        {
            if (this.checkFlag==true)
            {
                return;
            }
            this.checkFlag=true;
            mt.mediaManager.stopMusic();
            if (this.score<75)
            {
                this.scene.start("SceneOver");
            }
            else
            {
                var exp=new Effect({scene:this,effectNumber:mt.model.explode});
                exp.x=this.wall.x;
                exp.y=this.wall.y;
                this.tweens.add({targets: this.wall,duration: 2000,alpha:0})
                mt.mediaManager.playSound("boom");
                this.time.addEvent({ delay:3000, callback: this.doGameOver, callbackScope: this, loop: false});
            }
        }
        doGameOver()
        {
            this.scene.start("SceneOver");
        }
}