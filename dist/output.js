document.write('<!doctype html><meta charset=UTF-8><title>JS13K TS</title><style>:root{--c-darkgrey:#111;--c-gold:rgb(155, 132, 2);--c-black:rgb(5, 0, 0);--c-red:#832323;--c-darkred:#5d3434}*{margin:0;box-sizing:border-box}body,html{background-color:#222;-webkit-font-smoothing:none;font-family:monospace;overflow:hidden}.fill{position:absolute;width:100%;height:100%;top:0;left:0}.centered{position:absolute;top:50%;left:50%;translate:-50% -50%}#loading-canvas{background:var(--c-black)}#start{z-index:100;cursor:pointer;outline:0;padding:1.5rem;border:.2rem solid var(--c-gold);color:var(--c-gold);background:0 0;letter-spacing:.25rem;font-size:1.2rem;font-weight:600}#start:hover{background-color:var(--c-gold);color:var(--c-black)}canvas{image-rendering:pixelated}#container{position:absolute;top:50%;left:50%;translate:-50% -50%;box-sizing:border-box}#container canvas{position:absolute;width:100%;height:100%}</style><div class=centered id=loading>Loading...</div><button class=centered id=start style=opacity:0>START PUBERTY</button>');let f={avatar:{x:172,y:7,w:8,h:8},bone:{x:66,y:7,w:7,h:19},book1:{x:354,y:0,w:12,h:15},book2:{x:366,y:0,w:12,h:15},book3:{x:378,y:0,w:12,h:15},book4:{x:390,y:0,w:12,h:15},book5:{x:341,y:0,w:13,h:14},brain:{x:402,y:0,w:13,h:11},"character 0":{x:33,y:0,w:33,h:54},"character 1":{x:0,y:0,w:33,h:55},claw:{x:326,y:0,w:15,h:13},eye:{x:161,y:7,w:11,h:7},foot:{x:116,y:7,w:9,h:10},horn:{x:99,y:7,w:8,h:13},iconCoin:{x:125,y:7,w:9,h:9},iconHormones:{x:152,y:7,w:9,h:9},iconHorn:{x:143,y:7,w:9,h:9},iconMuted:{x:73,
y:7,w:13,h:9},iconPlaying:{x:86,y:7,w:13,h:9},iconScroll:{x:134,y:7,w:9,h:9},kidney:{x:107,y:7,w:9,h:11},lungs:{x:299,y:0,w:15,h:23},minion:{x:180,y:7,w:7,h:7},note:{x:187,y:7,w:7,h:4},pituitary:{x:415,y:0,w:5,h:5},tail:{x:276,y:0,w:23,h:15},textAlt:{x:66,y:0,w:210,h:7},violin:{x:314,y:0,w:12,h:21}};function aa(a){return Math.round(Math.random()*a)}function n(a,c=10){let [d,b,e]=a;return`hsl(${d+(Math.random()-.5)*c},${b+(Math.random()-.5)*c}%,${e+(Math.random()-.5)*c}%)`}
function v(a){let c=a.cloneNode(),d=c.getContext("2d");d.drawImage(a,0,0);d.imageSmoothingEnabled=!1;return[c,d]}function w(a,c,d,b){(1>a.width||1>a.height)&&console.log("Failed to replace color");a=c.getImageData(0,0,a.width,a.height);let e=a.data;for(let g=0;g<e.length;g+=4)e.slice(g,g+3)+""==d+""&&(e[g]=b[0],e[g+1]=b[1],e[g+2]=b[2]);c.putImageData(a,0,0)}
function x(a,c,d,b,e,g,h=12,k,l,m){m=m||y;b=Math.ceil(b/m);e=Math.ceil(e/m);let u=k||1;l=l?l||1:0;let p=!k;p&&(a.fillStyle=n(g,0),a.fillRect(c||0,d||0,Math.ceil((b+1)*m),Math.ceil((e+1)*m)));for(let q=0;q<=b;q++)for(let t=0;t<=e;t++){let B=q<=u||q>=b-u||t<=u||t>=e-u;var r=q>=l&&q<=b-l&&t>=l&&t<=e-l;if(p||B&&r){r=.75<Math.random();let z=h;k&&(z=r?h:0);if(r||k&&B)a.fillStyle=n(g,z),a.fillRect(q*m+c,t*m+d,m,m)}}}function ba(a,c,d){var b=f.eye;a.drawImage(A,b.x,b.y,b.w,b.h,100*y,20*y,c,d)}
function C(a){let [c,d]=v(da),b=a.w,e=a.h;c.width=b;c.height=e;d.drawImage(A,a.x,a.y,a.w,a.h,0,0,b,e);return[c,d]}function D(a){return ea.find(c=>c.name==a)}Array.prototype.i=0;Array.prototype.next=function(){this.i=(this.i+1)%this.length;return this[this.i]};
let fa=[0,0,1],E=[2,2,22],ha=[9,70,20],ia=[8,65,15],ja=[164,38,5],ka=[0,0,28],la=[51,97,31],oa=[20,20,20],pa=[100,100,100],qa=[3,3,3],ra=[255,255,255],sa=[150,150,150],F=[155,132,2],ta=[93,52,52],ua=[180,49,67],va=[140,40,54],wa=[111,39,50],xa=1E3/30,ya=Math.sqrt(2),G=window.devicePixelRatio||1,H=window.innerWidth,J=window.innerHeight,Aa=[392,329.63,293.66,246.94,220,196],A=document.createElement("img");A.src="spritesheet.png";
let Ba=12/9,[K,L]=H/Ba>J?[J*Ba,J]:[H,H/Ba],y=K/300,M=3.5*L/24,Ca=21.75*L/24/y,N=(1*K/24+5)/y,Da=(25.5*K/24-N)/4/y,Ea=7*K/24,O=M+1.5*L/24,Fa=6.5*K/24,Ga=13*L/24,P=2.5*y,Q={start:"See that little runt? He just turned 13 and is starting puberty.",encourage:"He needs a bit of a nudge. Click the brain to get the hormones pumping.",brain_clicked:"Nice! Look at him squirm. Get more hormones and grow the pituitary.",jerk:"Hehe what a jerk. They grow up so fast",claws:"Be careful! Those things are sharp.",
kidney:"Hmm not sure what that does.",violin0:"What is this novel form of torture!?",violin1:"Agh! The agony!",violin2:"What horrible sounds!",violin3:"Where did you get this evil device!?",violin4:"No amount of practice will be enough!",studies:"Keep studying. The devil is in the details. Hehe",advice:"Every devil keeps that in their back pocket."},da=document.createElement("canvas");da.width=H;da.height=J;let [Ha,Ia]=v(da);Ha.id="loading";Ha.classList.add("fill");document.body.append(Ha);
x(Ia,0,0,H,J,fa);let R=document.createElement("div");R.style.width=K+"px";R.style.height=L+"px";R.id="container";R.innerHTML='<div id="text"></div><div id="footer"></div>';document.body.prepend(R);let [S,T]=v(da);S.id="main";R.append(S);S.width=K*G;S.height=L*G;T.scale(G,G);T.imageSmoothingEnabled=!1;document.documentElement.style.fontSize=4*y+"px";let [Ja]=v(S);var Ka="",La=void 0,Ma=0,Na=0,U=1,Oa="default",Qa=[],ea=[],Ra=[],V;
let Sa={name:"hormones",type:0,Y:f.iconHormones,M:"{",g:40,s:100,H:0,Z:!1,$:()=>!0},Ta={name:"confidence",type:2,Y:f.iconCoin,M:"}",g:0,s:10,H:0,Z:!0,$:()=>!1},Ua={name:"maturity",type:1,Y:f.iconHorn,M:"|",g:0,s:25,H:0,Z:!0,$:()=>!1},Va={name:"knowledge",type:3,Y:f.iconScroll,M:"~",g:0,s:5,H:0,Z:!0,$:()=>!1},Wa=[Sa,Ua,Ta,Va],Xa={[0]:Sa,[1]:Ua,[2]:Ta,[3]:Va};
class Ya{constructor(a,c,d,b){this.i=0;this.D=a;this.l=c;this.F=d;this.u=b;Ra.push(this)}U(a){0!=this.l&&(this.i+=a,a=Math.min(this.i/this.D,1),this.F&&this.F(a,this.l),this.i>=this.D&&(this.u&&this.u(this.l),this.l--,0!=this.l?this.i=0:this.cancel()))}cancel(){let a=Ra.indexOf(this);-1<a&&Ra.splice(a,1)}}
class Za{constructor(a){this.data={};let {id:c,x:d,y:b,w:e,W:g,m:h,ha:k,data:l}=a;this.id=c||aa(100)+"";this.data=l;let m=h[0];this.x=d*y;this.y=b*y;this.w=e*y;let u=this.w/m.w;this.i=m.h/m.w*this.w;this.F=h.map(p=>{let [r,q]=C(p);g&&(this.w*=2,this.w+=g*u,r.width*=2,r.width+=g);let t=p.x,B=p.y,z=p.w;p=p.h;a.W&&(q.drawImage(A,t,B,z,p,0,0,z,p),q.save(),q.scale(-1,1),q.translate(-r.width,0),q.drawImage(A,t,B,z,p,0,0,z,p),q.restore());return[r,q]}).map(p=>p[0]);this.O=this.F[0];k&&new Ya(k,-1,void 0,
()=>{this.O=this.F.next()})}V(a){a.drawImage(this.O,this.x,this.y,this.w,this.i)}}let $a=Ja.getContext("2d",{ma:!0});$a.scale(G,G);let eb=Ja.getBoundingClientRect();window.addEventListener("resize",()=>{eb=Ja.getBoundingClientRect()});Ja.id="hitmask";R.prepend(Ja);Ja.style.opacity="0";function fb(){let a=$a.getImageData((Ma-eb.left)*G,(Na-eb.top)*G,1,1).data;Ka=`rgb(${a[0]},${a[1]},${a[2]})`}
function gb(a){a.F.map(c=>{let [d,b]=v(c),e={};e.ja=c;b.globalCompositeOperation="source-over";b.fillStyle=a.fa;b.fillRect(0,0,a.w,a.i);b.globalCompositeOperation="destination-in";b.drawImage(c,0,0);var g=a.x,h=a.y,k=a.w,l=a.i;console.log("Add to hitmask");$a.drawImage(d,g,h,k,l);eb=Ja.getBoundingClientRect();b.globalCompositeOperation="source-atop";b.drawImage(c,0,0);w(d,b,ta,va);e.ea=v(d)[0];w(d,b,va,wa);e.ga=v(d)[0];w(d,b,va,ta);w(d,b,ta,ra);b.fillStyle="rgba(0,0,0,0.5)";b.fillRect(0,0,a.w,a.i);
e.ka=v(d)[0];b.globalCompositeOperation="source-over";b.drawImage(c,0,0);b.globalCompositeOperation="source-atop";b.fillStyle="rgba(0,0,0,0.4)";b.fillRect(0,0,a.w,a.i);e.da=v(d)[0];b.fillStyle="rgba(0,0,0,0.7)";b.fillRect(0,0,a.w,a.i);e.ia=v(d)[0];b.drawImage(c,0,0);w(d,b,ta,va);b.fillStyle="rgba(255,200,200,0.6)";b.fillRect(0,0,a.w,a.i);e.ca=v(d)[0];w(d,b,va,ta);b.clearRect(0,0,a.w,a.i);b.globalCompositeOperation="source-over";b.drawImage(c,0,0);a.aa.push(e)})}
class hb extends Za{constructor(a){let {name:c,description:d,B:b,state:e,j:g,gain:h,A:k,T:l,C:m,S:u,o:p,N:r,hidden:q=!1}=a;super(p);this.aa=[];this.J=this.ba=this.X=0;this.R=this.N=this.l=this.P=this.D=!1;this.name=c;this.description=d;this.B=b;this.state=e;this.j=g;this.gain=h;"number"===typeof k&&0<k&&(this.A=k);this.L=l;this.C=m;this.S=u;this.o=p;this.fa=`rgb(${aa(255)},${aa(255)},${aa(255)})`;this.hidden=q;this.N=r;gb(this);this.I=this.aa[0]}G(){0===this.state&&(this.state=1);this.R=!0;setTimeout(()=>
{this.R=!1},250)}U(){var a=Date.now();let c=this.fa===Ka;!this.P&&c&&(this.ba=a);this.P=c;let d=200<a-this.ba;c&&0!==this.state&&(Oa="pointer",d&&this.name&&(La=this));if(this.j){let b=!1;Object.entries(this.j).map(e=>{let [g,h]=e;h.g&&Xa[g].g<h.g&&(b=!0);h.v&&Xa[g].H<h.v&&(b=!0)});this.D=b}this.u&&this.B&&(this.X=(a-this.u)/this.B,a=1<this.X,5===this.state&&a&&(this.state=1))}T(){let a=this.A&&this.J>=this.A;this.l||5===this.state||a||(this.l=!0,this.L&&this.L(),setTimeout(()=>{this.l=!1},160),1!==
this.state||this.D||a||(this.J+=1,this.S&&this.S(),this.B&&(this.u=Date.now(),this.state=5),this.j&&Object.entries(this.j).map(c=>{let [d,b]=c;Xa[d].g-=b.g||0;Xa[d].H-=b.v||0}),this.gain&&Object.entries(this.gain).map(c=>{let [d,b]=c;c=Xa[d];let e=b.g||0,g=b.v||0,h=b.s||0;c.g+=e;c.g=Math.min(c.g,c.s);c.H+=g;c.s+=h;V&&ib(c,e,g,h)}),this.C&&this.C()))}V(a){if(!this.hidden){var c=this.I.ja,d=this.y,b=this.i,e=c.width,g=c.height,h=this.A&&this.J>=this.A;0===this.state||this.N?c=this.I.ia:this.R?(console.log(this.name,
"avail"),c=this.I.ca):this.l&&5===this.state?(d+=2,c=this.I.ca):this.u&&this.B&&5===this.state?(a.drawImage(this.I.da,this.x,d,this.w,b),h=Math.min((Date.now()-this.u-160)/(this.B-160),1),g*=h,b*=h):this.D&&!h?c=this.P?this.I.ka:this.I.da:h?c=this.I.ga:this.P&&(c=this.I.ea);this.P&&this.N&&(c=this.I.ea);a.drawImage(c,0,0,e,g,this.x,d,this.w,b)}}}function jb(a){43==a&&(a=0);33==a&&(a=1);63==a&&(a=2);58==a&&(a=3);45<a&&58>a&&(a-=16);64<a&&91>a&&(a-=61);return a}
function kb(){var a=lb;console.log("Sprite Text Init Src: ",f.textAlt);let [c]=C(f.textAlt);console.log("Sprite Text Init: ",f.textAlt,c.width,c.height);a.i=c;a.O=C(f.iconHormones)[0];a.L=C(f.iconHorn)[0];a.u=C(f.iconCoin)[0];a.F=C(f.iconScroll)[0];a.D=C(f.eye)[0]}function mb(a,c){let d=""+c[0]+c[1]+c[2];if(a.l[d])return a.l[d];a.i?.width||console.log("Canvas not defined yet");let [b,e]=v(a.i);w(b,e,ra,c);return a.l[d]=b}
function W(a,c,d=0,b=0,e=10,g=.3,h,k,l){var m=lb;c=c.toUpperCase();d*=y;b*=y;e*=y;h=h?h*y:void 0;let u=g*e,p=0,r=0,q=1,t=m.i;k&&(t=mb(m,k));let B=Ua.M.charCodeAt(0),z=Ta.M.charCodeAt(0),ca=Va.M.charCodeAt(0),xb=[Sa.M.charCodeAt(0),B,z,ca,94],Pa=0;c.split("").map((I,za)=>{I=c.charCodeAt(za);za=32==I;let ab=46==I,yb=63==I;var ma=58==I;let bb=xb.includes(I);if(33==I||ab||ma||bb)p-=.85*u;let zb=5*jb(I),cb=d+p,db=b+r*e*2.5,Ab=e,Bb=7*e/5;ma=()=>a.drawImage(t,zb,0,5,7,cb,db,Ab,Bb);if(bb){let na=m.O;I===
B&&m.L&&(na=m.L);I===z&&m.u&&(na=m.u);I===ca&&m.F&&(na=m.F);94===I&&m.D&&(na=m.D);na&&(ma=()=>{a.drawImage(na,cb,db-u,5.5*y,5.5*y)},p+=3*u)}za&&(ma=()=>{},p-=1.3*u,l&&(q-=l));p+=e+u;l?(q+=l,setTimeout(ma,q)):ma();h?za&&p>h&&(Pa+=p,p=0,r+=1):Pa=p;l&&(yb||ab)&&(q+=5*l)});return Pa}class nb{constructor(){this.i=document.createElement("canvas");this.l={}}}let lb=new nb;
function ib(a,c,d,b){var e=V;let g=N+12+Wa.indexOf(a)*Da,h=Ca-14,k="";c&&(k+="+"+c);d&&(k+=" +"+d+"/s");b&&(k+=" +"+b+"MAX");let l=g*y,m=(h-12)*y,u=150*y,p=25*y;new Ya(1E3,1,r=>{let q=-10*r;e.u.clearRect(l,m,u,p);W(e.u,k,g+5,h+q,4.3,void 0,void 0,F);e.u.globalCompositeOperation="destination-out";e.u.fillStyle=`rgba(0, 0, 0, ${r})`;e.u.fillRect(l,m,u,p);e.u.globalCompositeOperation="source-over"})}
function ob(a){let c=178*y,d=33*y,b=114*y;var e=La;a.l.clearRect(c,d,b,27*y);if(e){let g=e.name+"",h=g.match("evil eye"),k=e.J,l=e.A,m=e.j;e=e.gain;l&&(g+=": ");W(a.l,g,c/y+3,d/y+3,2.7,.3,void 0,sa);l&&W(a.l,k+"/"+l,(c+b)/y-20,d/y+3,2.7,.3,void 0,k===l?ua:F);let u=d/y+13,p=c/y+3;if(m||e){W(a.l,"COST: ",p,u,3,.2,void 0,sa);let r=0;Object.entries(m||[]).map(([q,t])=>{q=Wa[q];var B=q?.M;let z=t.g&&Math.round(t.g);t=t.v;let ca;z&&(ca=q.g>=z?F:ua,r+=W(a.l,`${z}${B} `,p+r,u+7,3,.2,void 0,ca)/y);t&&(B=`-${(t.toFixed(1)+
"").replace(/0(\.\d+)/,"$1")}/s${B} `,ca=q.H>=t?F:ua,r+=W(a.l,B,p+r,u+7,3,.2,void 0,ca)/y)})}if(e){let r="";Object.entries(e).map(([q,t])=>{q=Wa[q]?.M;let B=t.g,z=t.v;t=t.s;B&&(r+=`+${B}${q}`);z&&(r+=`+${(z.toFixed(1)+"").replace(/0(\.\d+)/,"$1")}/s${q}`);t&&(r+=`+${t}${q}MAX`)});h&&(r="^ evil eye");p+=60;W(a.l,"GAIN: ",p,u,3,.2,void 0,sa);W(a.l,r,p,u+7,3,.2,void 0,F)}}}
class pb{constructor(){this.D=!1;this.O=[];this.text="";document.getElementById("text");document.body.style.fontSize=K/64+"px";let [a,c]=v(S);a.id="ui";R.insertBefore(a,S);c.scale(G,G);c.imageSmoothingEnabled=!1;this.l=c;let [d,b]=v(S);R.append(d);b.scale(G,G);b.imageSmoothingEnabled=!1;this.u=b;let [e,g]=v(S);this.L=e;e.width=20;e.height=20;x(g,0,0,20,20,la,10,void 0,void 0,1);let [h]=v(this.L);this.X=h;x(g,0,0,20,20,E,10,void 0,void 0,1);let [k,l]=v(this.L);this.F=k;this.F.width=20;this.F.height=
20;this.i=l;ob(this)}K(a){console.log("minion",a,this.D);this.D?this.O.push(a):(console.log("typing start"),this.D=!0,setTimeout(()=>{console.log("typing end");this.D=!1},50*a.length+800),this.l.clearRect(30*y,7*y,400*y,17*y),W(this.l,a,34,13,2.7,.3,void 0,F,50))}U(){if(0<this.O.length&&!this.D){console.log("next minion text");let a=this.O.shift()+"";this.K(a)}ob(this)}V(a){Wa.map((c,d)=>{var b=22*y,e=Ca*y,g=e-b/2,h=c.g/c.s;d=(N-6.2+d*Da)*y;let k=this.F.width,l=k/ya,m=.8*l;this.i.clearRect(0,0,20,
20);let u=20*h;h*=k;this.i.drawImage(this.X,0,20-u,20,u,0,k-h,k,h);this.i.save();this.i.globalCompositeOperation="destination-in";this.i.translate(k/2,k/2);this.i.rotate(.785);this.i.fillRect(-m/2,-m/2,m,m);this.i.globalCompositeOperation="destination-over";this.i.fillStyle="red";this.i.drawImage(this.L,-l/2,-l/2,l,l);this.i.restore();this.l.drawImage(this.F,d,g,b,b);this.i.globalCompositeOperation="source-over";g=Math.floor(c.g);h="/"+c.s;b="+"+Math.floor(10*c.H)/10;d/=y;d+=25;e=e/y-2.5;d+=W(a,g+
"",d,e,4,.15,void 0,0<g?F:pa)/y;d+=1;d+=W(a,h,d,e,4,.15,void 0,pa)/y;"knowledge"!==c.name&&(c=0<c.H?F:pa,d+=W(a,b,d+3,e+2.2,2.5,.1,void 0,c)/y,W(a,"/s",d+3.3,e+3.2,1.7,.5,void 0,c))})}}
let qb=new AudioContext,rb={C_major:[261.63,329.63,392],G_major:[196,246.94,392],F_major:[174.61,220,349.23],A_minor:[220,261.63,329.63],D_minor:[293.66,349.23,440],B_diminished:[246.94,311.13,392],D_major:[146.83,185,220],E_major:[164.81,207.65,246.94],C_minor:[130.81,155.56,196],F_minor:[174.61,207.65,261.63],G7:[196,246.94,293.66],Cmaj7:[130.81,164.81,196],E_diminished:[164.81,207.65,246.94],G_minor:[196,233.08,293.66],ultra_low:[10,20.6,10],ultra_high:[4186.01,5274.04,6271.93]};
function sb(a){let c=0;setInterval(()=>{tb(a[c],2,.008,1);c=(c+1)%a.length},2E3)}function ub(){"suspended"===qb.state&&qb.resume();let a="E_diminished A_minor E_diminished F_minor E_diminished G_minor E_diminished C_minor".split(" ").map(c=>rb[c]);sb(a)}
function tb(a,c,d,b){let e=qb.currentTime;d*=U;a.map(g=>{let h=qb.createOscillator(),k=qb.createGain();h.type="sine";h.frequency.setValueAtTime(g,e);k.gain.setValueAtTime(d,e);k.gain.linearRampToValueAtTime(0,e+b);h.connect(k);k.connect(qb.destination);h.start(e);h.stop(e+c);h.onended=()=>{h.disconnect();k.disconnect()}})}function vb(){tb(rb.C_minor,2,.02*U,1)}function wb(){tb(rb.E_diminished,1,.01*U,1)}let X=new AudioContext;
function Cb(a){"suspended"===X.state&&X.resume();let c=.02*U,d=X.createOscillator();d.type="sawtooth";d.frequency.setValueAtTime(a,X.currentTime);a=X.createGain();a.gain.setValueAtTime(0,X.currentTime);a.gain.linearRampToValueAtTime(c,X.currentTime+.05);a.gain.exponentialRampToValueAtTime(.001,X.currentTime+1.5);d.connect(a);a.connect(X.destination);d.start(X.currentTime);d.stop(X.currentTime+1.5)}
function Db(){let [a,c]=v(S);R.append(a);a.id="end";c.scale(G,G);c.imageSmoothingEnabled=!1;let d=a.height/G/10,b=51*y;new Ya(800,10,void 0,e=>{let g=10-e;0<g&&1<e&&x(c,0,d*(g-1),a.width,d*g,ha,10);1==e&&(ba(c,2*b,1.5*b),W(c,"Fear! A new demon has emerged from puberty and risen to torment the earth!",20,115,7,void 0,200,qa,70),setTimeout(()=>{W(c,"YOU WIN: AND WE LOSE",100,200,6,void 0,200,qa)},5180))})}
let Y=1*K/24/y,Z=M/y,Eb=(M+4.1*L/24)/y,Fb=(M+11.2*L/24)/y,Gb=[{name:"evil eye",state:1,j:{[0]:{g:300},[1]:{g:60},[2]:{g:25},[3]:{g:5}},gain:{},C(){tb(rb.E_diminished,5,.03*U,4);Db()},A:1,o:{x:Y+25,y:Z+5,w:19,m:[f.eye]}},{name:"grow pituitary",B:2E3,state:1,j:{[0]:{g:60}},gain:{[0]:{v:.5,s:5}},C(){if(this.j){let a=this.j[0];a?.g&&(a.g+=35)}1==this.J&&(V?.K(Q.jerk),D("form kidney")?.G(),D("sharpen horns")?.G())},A:5,o:{x:Y+30,y:Z+50,w:10,m:[f.pituitary]}},{name:"form kidney",B:2E3,state:0,j:{[0]:{g:100}},
gain:{[0]:{s:10}},C(){if(this.j){let a=this.j[0];a?.g&&(a.g+=10)}1==this.J&&V?.K(Q.kidney)},A:2,o:{x:Y+5,y:Z+72,w:16,m:[f.kidney]}},{name:"exercise brain",B:800,state:1,gain:{[0]:{g:9}},C(){1==this.J&&V?.K(Q.brain_clicked)},o:{x:Y+23,y:Z+27,w:23,m:[f.brain]}},{name:"lungs",B:1E3,state:0,j:{[0]:{g:50}},gain:{[1]:{g:2},[2]:{g:.5}},o:{x:Y+24,y:Z+68,w:24,m:[f.lungs]}},{name:"growth spurt",B:12E3,A:6,state:0,j:{[1]:{g:20},[2]:{g:2}},gain:{[0]:{s:10},[1]:{s:5}},C(){if(this.j){var a=this.j[1];a?.g&&(a.g+=
5);a=this.j[2];a?.g&&(a.g+=2)}},o:{x:Y+53,y:Z+74,w:11.5,m:[f.bone]}},{name:"grow claws",B:2E3,state:0,A:3,j:{[0]:{g:120,v:.1},[1]:{g:20}},gain:{[1]:{v:.6}},C(){1==this.J&&(V?.K(Q.claws),D("practice violin")?.G());if(this.j){let a=this.j[0],c=this.j[1];a?.v&&(a.v+=.1);c?.g&&(c.g+=5)}},o:{x:Y+5,y:Z+49,w:20,W:17,m:[f.claw]}},{name:"sharpen horns",B:5E3,state:0,j:{[0]:{g:120}},gain:{[1]:{v:.2}},C(){1==this.J&&(D("grow claws")?.G(),D("shape hooves")?.G())},o:{x:Y+4,y:Z+8,w:14,W:20,m:[f.horn]}},{name:"shape hooves",
B:2E3,state:0,j:{[0]:{g:90},[1]:{g:25},[2]:{g:5}},gain:{[0]:{s:50},[1]:{s:5}},A:2,C(){},o:{x:Y+4,y:Z+129,w:17,W:15,m:[f.foot]}},{name:"grow tail",B:9E3,state:0,A:3,j:{[0]:{g:200},[1]:{v:.5},[2]:{g:5}},gain:{[2]:{v:.1,s:2}},o:{x:Y+4,y:Z+99,w:39,m:[f.tail]}}];Gb.map(a=>{a.S=vb});let Hb=[],Ib=Array(6).fill(6).map(()=>aa(5));
for(let a=0;6>a;a++){let c=a/6;for(let d=0;6>d;d++){let b=Aa[a];Hb.push({state:1,N:Ib[d]!==a,T(){Cb(b);ea.map(e=>{e?.data?.c==d&&(e.N=!0)});this.N=!1;this.R=!0;setTimeout(()=>{this.R=!1},111)},o:{id:"note",x:213+d/6*70,y:Eb+(1+28*c),w:9,m:[f.note],data:{c:d,r:a,la:b}}})}}
let Jb=[{name:"practice violin",B:2400,state:0,j:{[0]:{g:50},[1]:{v:.2,g:25}},gain:{[2]:{g:1}},C(){var a=[Q.violin0,Q.violin1,Q.violin2,Q.violin3,Q.violin4];V?.K(a[Math.floor(Math.random()*a.length)]);let c=[];a=ea.filter(d=>d.id.match("note")&&!d.N);for(let d=0;6>d;d++){let b=a.find(e=>e?.data?.c==d);b&&c.push(b)}new Ya(400,6,void 0,d=>{(d=c[6-d])&&d.T()})},o:{x:180,y:Eb,w:25,m:[f.violin]}},...Hb],Kb=[{name:"codex gigas",state:1,A:1,j:{[0]:{g:150},[1]:{g:15},[2]:{g:5}},gain:{[0]:{v:2},[3]:{g:1}},
C(){D("lungs")?.G();D("the black arts")?.G();D("growth spurt")?.G();V?.K(Q.studies)},o:{x:183,y:Fb,w:17,m:[f.book1]}},{name:"the black arts",state:0,A:1,j:{[0]:{g:220},[1]:{g:30},[2]:{g:6}},gain:{[2]:{v:.2},[3]:{g:2}},C(){D("dantes inferno")?.G();D("grow tail")?.G()},o:{x:210,y:Fb,w:17,m:[f.book2]}},{name:"dantes inferno",A:1,state:0,j:{[0]:{g:200},[1]:{g:30},[2]:{g:15}},gain:{[2]:{s:10},[3]:{g:1}},C(){D("advice for a teenage devil")?.G()},o:{x:237,y:Fb,w:17,m:[f.book3]}},{name:"advice for a teenage devil",
A:1,state:0,j:{[0]:{g:300},[1]:{g:50},[2]:{g:25}},gain:{[3]:{g:2}},C(){D("evil eye")?.G();V?.K(Q.advice)},o:{x:263,y:Fb,w:19,m:[f.book5]}},{name:"MUTE",state:1,T(){U=1-U;this.I=this.aa.next();0===U?this.name="UNMUTE":this.name="MUTE"},o:{x:275,y:11,w:10,m:[f.iconPlaying,f.iconMuted]}}];Kb.map(a=>{a.S=wb});
let Lb=Ca-5,Mb=[{name:"Hormones",state:1,o:{x:N+0*Da,y:Lb,w:10,m:[f.iconHormones]}},{name:"Maturity",state:1,o:{x:N+Da,y:Lb,w:10,m:[f.iconHorn]}},{name:"Confidence",state:1,o:{x:N+2*Da,y:Lb,w:10,m:[f.iconCoin]}},{name:"Knowledge",state:1,o:{x:N+3*Da,y:Lb,w:10,m:[f.iconScroll]}}],Nb=[...Gb,...Jb,...Kb,...Mb],Ob=[{x:16,y:10,w:10,m:[f.minion]},{x:98,y:1.25*O/y,w:60,m:[f["character 0"],f["character 1"]],ha:2E3}];
function Pb(){let [a,c]=v(da);a.id="page-background";document.body.prepend(a);x(c,0,0,H,J,fa,10);let [d,b]=v(S);d.id="background";b.scale(G,G);R.prepend(d);x(b,0,0,K,L,ja,8);var e=1*K/24,g=5.5*K/24,h=16*L/24;x(b,e,M,g,h,E,6);x(b,e,M,g,h,E,20,2);e=14*K/24;g=M+3.5*L/24;h=9*K/24;var k=6*L/24;x(b,e,g,h,k,E,8);x(b,e,g,h,k,ja,25,1,1);W(b,"The Band",1.22*e/y,.88*(g+k)/y,5,.83,void 0,oa);h=30*y;for(k=1;7>k;k++)b.fillStyle=n(fa),b.fillRect(e+38*y,g+(10+k*h/6),67*y,y);e=14*K/24;g=M+10.25*L/24;h=9*K/24;k=5.75*
L/24;x(b,e,g,h,k,E,8);x(b,e,g,h,k,ja,25,1,1);W(b,"The Library",1.05*e/y,.91*(g+k)/y,5,.81,void 0,oa);x(b,Ea,O,Fa,Ga,ia);x(b,Ea+P,O+Ga-6*P,Fa-2*P,5.1*P,ka,20);x(b,Ea,O,Fa,Ga,E,5,2);x(b,Ea,O,Fa,Ga,ja,25,1,1);e=14*K/24;x(b,e,M,9*K/24,2.75*L/24,E,6);e+=6*y;g=M+9.5*y;k=100*y;h=Math.ceil(k/y);b.fillStyle=n(ja,0);b.fillRect(e,g,k,y);for(k=0;k<=h;k++).75<Math.random()&&(b.fillStyle=n(ja,12),b.fillRect(k*y+e,g,y,y))}A.onload=Qb;console.log("Load Spritesheet",A);
function Qb(){kb();Pb();console.log("Rendered Background");let a=new pb;V=a;Ob.map(b=>Qa.push(new Za(b)));Nb.map(b=>ea.push(new hb(b)));document.addEventListener("mousemove",b=>{Ma=b.x;Na=b.y});console.log("After Initialized");document.getElementById("loading")?.remove();let c=document.getElementById("start");W(Ia,"Infernal Adolescence",H/2/y-134.4,J/4/y,12,.12,void 0,ua,80);setTimeout(()=>{c.style.opacity="1"},1800);c.addEventListener("click",function(){console.log("Start Function");c.remove();Ia.fillStyle=
"red";new Ya(100,30,void 0,e=>{Ia.clearRect(0,0,Ha.width,Ha.height*(1-e/30));1==e&&(V?.K(Q.start),V?.K(Q.encourage),Ha.remove())});ub();window.addEventListener("click",()=>{ea.find(e=>e.P)?.T()});let b=0;(function h(g){let k=g-b;k>=xa&&(b=g-k%xa,document.body.style.cursor=Oa,Oa="default",T.clearRect(0,0,K,L),a.U(),a.V(T),Qa.map(l=>l.V(T)),Wa.map(l=>{l.g+=l.H*k/1E3;l.g>l.s&&(l.g=l.s)}),La=void 0,ea.map(l=>{l.U();l.V(T)}),Ra.map(l=>{l.U(k)}),T.fillStyle=d,T.globalCompositeOperation="darken",T.globalAlpha=
.5,T.fillRect(Ea+P+2,O+P+2,Fa-2*P,Ga-2*P),T.globalCompositeOperation="source-over",T.globalAlpha=1,fb());requestAnimationFrame(h)})(0)});let d=T.createLinearGradient(Ea+P,O+P,Fa-2*P,Ga-2*P);d.addColorStop(0,n(fa,0));d.addColorStop(1,n(ia,0))};