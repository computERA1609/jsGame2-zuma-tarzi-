// nesnelerin tanimlanmasi
const startdiv = document.getElementById("start");
const btn = document.querySelector("#start button");
const p = document.querySelector("#start p");
const scorediv = document.getElementById("score");
const killdiv = document.getElementById("kills");
const canvas = document.getElementById("canvas");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
ctx.clearRect(0,0,width,height); // Canvas temizleme satiri

// objenin mouse yonunde donmesi icin mousun yonunu bulalim
canvas.addEventListener("mousemove",(e)=>{
    if(playing){
      //console.log(e.pageX);

    //Objemizin donme yonunu bulma eventi Hayali dik ucgen ic acilari  uzerinden taradigi alani hesaplayacagiz
    var dx = e.pageX - player.x; // dx = distance x yani x yonundeki uzunluk
    var dy = e.pageY -player.y; // dx = distance x yani x yonundeki uzunluk
     var tetha = Math.atan2(dy,dx); // dx dy arasindaki aci radyan cinsinden
     tetha *= 180 / Math.PI; // radyani dereceye cevirdik
     angle = tetha;  
    }
});

// objemizin ates edebilme eventi
canvas.addEventListener("click",(e)=>{
    console.log(e.pageX);
    bullets.push( new Circle(player.x,player.y,e.pageX,e.pageY,5 /* mermi capi */,'white',5/* mermi hizi */)); 
    //console.log(bullets);
});


// mermiler icin ikinci clas olusturuyoruz
class Circle{
    constructor(bx,by,tx,ty,r,c,s){ /* baslangic x-y kordinati, tx= x teki target ty= y deki target  r capinda, c renginde */
        this.bx = bx;
        this.by = by;
        this.tx = tx;
        this.ty = ty;
        this.x = bx;
        this.y = by;
        this.r = r;
        this.c = c;
        this.s = s;
        
    }
    draw(){ /* arc cizdiriyoruz */
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    }
    update (){ /* Noktalari hareket ettiriyoruz */
        var dx = this.tx - this.bx; // obje ile hedef arasinda yine dik ucgen olusturduk
        var dy = this.ty - this.by; // obje ile hedef arasinda yine dik ucgen olusturduk
        var hp = Math.sqrt(dx*dx +dy*dy) //hp=hypotenus u buluyoruz
        this.x += (dx/hp)*this.s;
        this.y += (dy/hp)*this.s;
  
    }
    remove(){ /* ekranin disina cikan mermileri silme log. sismesini engellemek icin */
        if ((this.x < 0 || this.x > width) || (this.y < 0 || this.y > height)) { 
            return true;
        }
        return false;
    }
}


class Player{
    constructor(x,y,r,c){
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = c;
    }

    // fonksiyon ciz
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle*Math.PI/180);// butun canvasi angle acisi miktarinca ceviriyoruz
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(0,0,this.r,0,Math.PI*2);
        ctx.fillRect(0,-(this.r*0.4),this.r + 15,this.r*0.8);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

function addEnemy() { /* dusman ekliyoruz */
    for(var i = enemies.length; i< maxenemy; i++){ /* burda dusman yok edildikce yenisi gelecek */
    var r = Math.random() *30 + 10; // dusmanlarin rastgele boyutta gelmesini saglar
    var c = 'hsl('+ (Math.random()*360) + ',60%,50%)'; // hue, saturation, light ile rastgele renklerde dusman urettik
    var s = 0.5 + (( 40 - ((r/40)*r)) / 160) / maxenemy;  // dusmanin hizi

    var x,y; /* Dusman rastgele koordinatlardan geliyor */
    if(Math.random() < 0.5){
        x = (Math.random() > 0.5) ? width : 0;
        y = Math.random() * height;
    }else{
        x = Math.random() * width;
        y = (Math.random() < 0.5) ? height : 0;
    }


    //console.log(s);
    enemies.push( new Circle(x,y,player.x,player.y,r /* dusman capi */,c,s/* dusman hizi */)); 
    }
}

//Dusman ve mermileri carpistirma zamani. Eger mermi ve herhangi bir dusman temas ettigi an Rm + Rd = dik ucgenin hipotenusu olur Rtoplam=Rm+Rd
function collasion(x1,y1,r1,x2,y2,r2){
        var dx = x1 - x2; // obje ile hedef arasinda yine dik ucgen olusturduk
        var dy = y1 - y2; // obje ile hedef arasinda yine dik ucgen olusturduk
        var hp = Math.sqrt(dx*dx +dy*dy) //hp=hypotenus u buluyoruz
        if(hp<(r1+r2)){
            return true;
        }
        return false;
}

// animasyonu yapacak fonksiyon yaziyoruz
function  animate(){

    if(playing){
    requestAnimationFrame(animate);
    //ctx.clearRect(0,0,width,height); // Canvas temizleme satiri
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,width,height);
    ctx.fill();
    enemies.forEach((enemy,e) => { /* dusman alandan ciktiysatekrar getirt */
    bullets.forEach((bullet,b) => {
        if(collasion(enemy.x, enemy.y, enemy.r, bullet.x, bullet.y, bullet.r)){
            //console.log("hit !")

            //Skor hesaplama
            if(enemy.r < 15){
                enemies.splice(e,1); // mermi dusmana degince dusman yok oluyor
                score += 25; // dusmani yok edince skora 25 ekler
                kills++; // oldurulen dusman sayisi

                if(kills %5 === 0){
                    maxenemy++;}
                addEnemy();
            }else{
                enemy.r -= 5;
                score += 5; // dusmani her vurusta scora 5 ekler
            }
            bullets.splice(b,1); // mermi dusmana degince mermide yok oluyor
            
        }     
    });
 


    if(collasion(enemy.x , enemy.y, enemy.r, player.x, player.y, player.r)){
        console.log("Game Over")
        startdiv.classList.remove("hidden");
        btn.textContent = ("TRY AGAIN");
        p.innerHTML = "Game Over! <br/> Your Score : " + score;
        playing = false; /* dusman objeye degdigi an oyun duruyor */
    }




        if (enemy.remove()) {
            enemies.splice(e,1);
            addEnemy();
        }
        enemy.update();
        enemy.draw();
        
    });
    

    bullets.forEach((bullet,b) =>{
        if (bullet.remove()) {
            bullets.splice(b,1);
        }
        bullet.update();
        bullet.draw();
    });

    player.draw(); // ates eden objemiz}
    scorediv.innerHTML = "Score : " + score;
    killdiv.innerHTML = "Kill : " + kills;
    
    }
    
}

function init(){
     playing = true;
     score = 0;
     kills = 0;
     angle = 0; // objenin acisi
     bullets = []; // mermiler
     enemies = []; // dusmanlar
     maxenemy = 1;
     startdiv.classList.add("hidden"); // start panelini gizedik

     player = new Player(width/2,height/2,20,'white');
     addEnemy();
     animate();
}


var playing = false;
var player, angle, bullets,enemies, maxenemy, score, kills;
//init();


/*player 20px lik beyaz yuvarlak
// (x=100, y=100, radius=20, baslangic acisi=0, bitis acisi=Math.PI*2)
ctx.fillStyle = "white";
ctx.arc(100,100,20,0,Math.PI*2);
ctx.fillRect(100,95,30,10) //20 px lik yuvarlaga eklenmis kucuk dikdortgen
ctx.fill(); */


