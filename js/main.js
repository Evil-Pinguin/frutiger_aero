/* FRUTIGER AERO main */
const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);

// LOADER
let loaderProg=0;
const loaderFill=$('#loader-fill'), loaderPct=$('#loader-percent'), loader=$('#loader');
const loaderInt=setInterval(()=>{
  loaderProg+= Math.random()*18+4;
  if(loaderProg>=100){loaderProg=100;clearInterval(loaderInt);
    loaderFill.style.height='100%';loaderPct.textContent='100%';
    setTimeout(()=>{loader.classList.add('hidden');initAll();},600);
  }
  loaderFill.style.height=loaderProg+'%';
  loaderPct.textContent=Math.floor(loaderProg)+'%';
},120);

// CURSOR
const cursor=$('#cursor'), ripple=$('#cursor-ripple');
let mouseX=0,mouseY=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{
  mouseX=e.clientX;mouseY=e.clientY;
});
(function loop(){
  cx+=(mouseX-cx)*0.18; cy+=(mouseY-cy)*0.18;
  if(cursor){cursor.style.left=cx+'px';cursor.style.top=cy+'px';}
  requestAnimationFrame(loop);
})();
document.addEventListener('click',e=>{
  if(!ripple)return;
  ripple.style.left=e.clientX+'px';ripple.style.top=e.clientY+'px';
  ripple.style.transition='none';ripple.style.transform='translate(-50%,-50%) scale(0)';ripple.style.opacity='1';
  setTimeout(()=>{
    ripple.style.transition='transform .5s ease, opacity .5s ease';
    ripple.style.transform='translate(-50%,-50%) scale(4)';ripple.style.opacity='0';
  },10);
});
$$('button, .tag, .tl-card, .archive-folder, .d-icon, .q-opt, .aero-toggle, .thumb').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor&&cursor.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursor&&cursor.classList.remove('hover'));
});

function initAll(){
  initHeroBubbles();
  initBuilder();
  initTimeline();
  initArchive();
  initDesktop();
  initFlatSlider();
  initQuiz();
  initBubblePlay();
  initGrow();
  initSound();
  initAeroToggle();
  initParallax();
  initRevivalBubbles();
  initYearObserver();
}

// HERO BUBBLES + FLUFFY CLOUDS (no white ovals)
function initHeroBubbles(){
  const cont=$('#hero-bubbles');
  if(!cont)return;
  for(let i=0;i<22;i++){
    const b=document.createElement('div');b.className='bubble';
    const size=18+Math.random()*56;
    b.style.width=size+'px';b.style.height=size+'px';
    b.style.left=Math.random()*100+'%';
    b.style.animationDuration=(14+Math.random()*20)+'s';
    b.style.animationDelay=(Math.random()*12)+'s';
    cont.appendChild(b);
  }
  // fluffy clouds - composed of 3-5 puffs
  const hero=$('#hero');
  for(let i=0;i<5;i++){
    const c=document.createElement('div');c.className='cloud';
    c.style.top=(4+Math.random()*38)+'%';
    c.style.left='-320px';
    c.style.animationDuration=(45+Math.random()*50)+'s';
    c.style.animationDelay=(Math.random()*30)+'s';
    const puffCount=3+Math.floor(Math.random()*3);
    const baseW=70+Math.random()*60;
    for(let j=0;j<puffCount;j++){
      const puff=document.createElement('div');puff.className='puff';
      const w=baseW*(0.7+Math.random()*0.6);
      const h=w*(0.65+Math.random()*0.25);
      puff.style.width=w+'px';puff.style.height=h+'px';
      puff.style.marginLeft=j===0?'0':(-w*0.35)+'px';
      puff.style.transform=`translateY(${ (Math.random()-0.5)*12}px)`;
      c.appendChild(puff);
    }
    hero.appendChild(c);
  }
}
function initParallax(){
  const glass=$('#hero-glass');
  const hero=$('#hero');
  if(!hero||!glass)return;
  hero.addEventListener('mousemove',e=>{
    const x=(e.clientX/window.innerWidth-0.5)*30;
    const y=(e.clientY/window.innerHeight-0.5)*20;
    glass.style.transform=`translate(${x*0.3}px, ${y*0.3}px)`;
    $$('.bubble').forEach((b,i)=>{
      const factor=(i%3+1)*0.1;
      b.style.transform=`translate(${x*factor}px, ${y*factor}px)`;
    });
  });
}

// STARTUP SOUND & WELCOME MODAL
let audioCtx;
function playStartup(){
  try{
    if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine';o.frequency.setValueAtTime(440,audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880,audioCtx.currentTime+0.6);
    g.gain.setValueAtTime(0,audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.25,audioCtx.currentTime+0.05);
    g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1.2);
    o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+1.2);
    // second chime
    setTimeout(()=>{
      const o2=audioCtx.createOscillator(), g2=audioCtx.createGain();
      o2.frequency.setValueAtTime(660,audioCtx.currentTime);
      o2.frequency.linearRampToValueAtTime(1320,audioCtx.currentTime+0.5);
      g2.gain.setValueAtTime(0,audioCtx.currentTime);g2.gain.linearRampToValueAtTime(0.2,audioCtx.currentTime+0.05);g2.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+1);
      o2.connect(g2);g2.connect(audioCtx.destination);o2.start();o2.stop(audioCtx.currentTime+1);
    },300);
  }catch(e){}
}
const enterBtn=$('#enter-future'), welcomeModal=$('#welcome-modal');
if(enterBtn){
  enterBtn.addEventListener('click',()=>{
    playStartup();
    welcomeModal.classList.add('open');
  });
}
$('#close-welcome')?.addEventListener('click',()=>welcomeModal.classList.remove('open'));
$('#continue-btn')?.addEventListener('click',()=>{
  welcomeModal.classList.remove('open');
  document.querySelector('#about')?.scrollIntoView({behavior:'smooth'});
});

// BUILDER
function initBuilder(){
  const sliders={sky:$('#s-sky'),nature:$('#s-nature'),gloss:$('#s-gloss'),bubbles:$('#s-bubbles'),tech:$('#s-tech'),opt:$('#s-opt')};
  const vals={sky:$('#v-sky'),nature:$('#v-nature'),gloss:$('#v-gloss'),bubbles:$('#v-bubbles'),tech:$('#v-tech'),opt:$('#v-opt')};
  const sceneEls={sky:$('#b-sky'),grass:$('#b-grass'),gloss:$('#b-gloss'),bubbles:$('#b-bubbles'),city:$('#b-city'),rainbow:$('#b-rainbow')};
  const achieved=$('#builder-achieved');
  const scene=$('#builder-scene');
  function update(){
    const s=parseInt(sliders.sky.value), n=parseInt(sliders.nature.value), g=parseInt(sliders.gloss.value), b=parseInt(sliders.bubbles.value), t=parseInt(sliders.tech.value), o=parseInt(sliders.opt.value);
    vals.sky.textContent=s+'%';vals.nature.textContent=n+'%';vals.gloss.textContent=g+'%';vals.bubbles.textContent=b+'%';vals.tech.textContent=t+'%';vals.opt.textContent=o+'%';
    // sky
    const gray=255 - s*1.2; const blueMix=s;
    sceneEls.sky.style.background=`linear-gradient(180deg, hsl(${200+blueMix*0.1}, ${30+blueMix*0.7}%, ${70+blueMix*0.2}% ) 0%, hsl(${190+blueMix*0.2}, 90%, ${60+blueMix*0.2}% ) 100%)`;
    if(s<20)sceneEls.sky.style.background=`linear-gradient(180deg, #bbb, #888)`;
    // grass
    sceneEls.grass.style.height=n*0.7+'%';
    // gloss
    sceneEls.gloss.style.opacity=g/100;
    // bubbles
    sceneEls.bubbles.innerHTML='';
    const count=Math.floor(b/6);
    for(let i=0;i<count;i++){
      const bub=document.createElement('div');bub.className='bubble';bub.style.position='absolute';
      const sz=10+Math.random()*30;bub.style.width=sz+'px';bub.style.height=sz+'px';
      bub.style.left=Math.random()*100+'%';bub.style.top=Math.random()*100+'%';bub.style.opacity=0.7;
      sceneEls.bubbles.appendChild(bub);
    }
    // tech city
    sceneEls.city.style.opacity=t>30? (t/100):0;
    sceneEls.city.style.transform=`translateX(-50%) scale(${0.6+t/100*0.6})`;
    // optimism rainbow
    sceneEls.rainbow.style.opacity=o>50? (o-50)/50 :0;
    // check achieved
    if(s>70 && n>70 && g>60 && b>60 && t>60 && o>70){
      achieved.classList.add('show');scene.style.boxShadow='0 0 40px #9BF938, var(--glass-shadow)';scene.classList.add('glow');
    }else{achieved.classList.remove('show');scene.classList.remove('glow');}
  }
  Object.values(sliders).forEach(sl=>sl&&sl.addEventListener('input',update));
  update();
}

// TIMELINE WITH EXPLICIT YEAR TRANSITIONS
let lastEra=null;
function triggerYearTransition(year){
  const overlay=$('#year-transition');
  const yt=$('#yt-year');
  if(!overlay||!yt)return;
  yt.textContent=year;
  overlay.classList.add('show');
  // play chime
  if(audioCtx){
    try{
      const o=audioCtx.createOscillator(), g=audioCtx.createGain();
      o.frequency.setValueAtTime(600,audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1200,audioCtx.currentTime+0.4);
      g.gain.setValueAtTime(0.12,audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.6);
      o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+0.6);
    }catch{}
  }
  setTimeout(()=>overlay.classList.remove('show'),1100);
}
function initTimeline(){
  const years=$$('.tl-year');
  const eras=$$('.tl-era');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const era=e.target.dataset.era;
        years.forEach(y=>y.classList.toggle('active', y.dataset.year===era));
        $('#year-badge').textContent=era;
        // explicit transition effect
        eras.forEach(er=>er.classList.remove('active-era'));
        e.target.classList.add('active-era');
        if(lastEra!==era){
          triggerYearTransition(era);
          // background shift per era
          const bgMap={
            '2001':'linear-gradient(180deg,#c0c8d0,#7a8fa6)',
            '2004':'linear-gradient(180deg,#d0e8ff,#a0c4e8)',
            '2007':'linear-gradient(180deg,#e6fbff,#87d9ff)',
            '2009':'linear-gradient(180deg,#b9f4ff,#58C928)',
            '2012':'linear-gradient(180deg,#87d9ff,#9BF938)',
            '2013':'linear-gradient(180deg,#f5f5f5,#e0e0e0)',
            '2017':'linear-gradient(180deg,#fff,#b9f4ff)',
            '2022':'linear-gradient(180deg,#b9f4ff,#00AEEF)',
            '2026':'linear-gradient(180deg,#00AEEF,#087ED1)'
          };
          if(bgMap[era]){
            $('#timeline').style.background=bgMap[era];
            $('#timeline').style.transition='background 1.2s ease';
          }
          lastEra=era;
        }
      }
    });
  },{threshold:0.55});
  eras.forEach(er=>observer.observe(er));
  years.forEach(y=>y.addEventListener('click',()=>{
    const target=document.querySelector(`.tl-era[data-era="${y.dataset.year}"]`);
    if(target)target.scrollIntoView({behavior:'smooth'});
  }));
  // vista modals
  const vistaData={
    vista:{title:'Windows Vista — Aero Glass',body:'<p style="font-size:13px;line-height:1.5">Aero Glass: Transparency, blur, gloss, aurora, depth. Vista закрепила язык Aero в массовой культуре. Полупрозрачные окна, отражения, мягкие тени — будущее выглядело как стекло.</p><img src="assets/interface-vista.jpg" style="width:100%;margin-top:12px;border-radius:8px">'},
    wii:{title:'Nintendo Wii',body:'<p style="font-size:13px">Белая глянцевая консоль, пузыри в меню, дружелюбный дизайн. Игры для всех, а не только для гиков.</p><img src="assets/games-consoles.jpg" style="width:100%;margin-top:12px;border-radius:8px">'},
    ps3:{title:'PlayStation 3',body:'<p>XMB интерфейс с волнами и пузырями. Черный глянец, хром, futurism.</p>'},
    iphone:{title:'iPhone (2007)',body:'<p>Богатый скевоморфный UI: камера как камера, блокнот как блокнот. Тактильность как принцип.</p><img src="assets/tech-phones.jpg" style="width:100%;margin-top:12px;border-radius:8px">'},
    web2:{title:'Web 2.0',body:'<p>Глянцевые кнопки, градиенты, reflections, rounded corners. Интернет стал цветным и выпуклым.</p>'}
  };
  const vModal=$('#vista-modal'), vTitle=$('#vista-title'), vBody=$('#vista-body');
  $$('.tl-card').forEach(c=>c.addEventListener('click',()=>{
    const k=c.dataset.open;if(!vistaData[k])return;
    vTitle.textContent=vistaData[k].title;vBody.innerHTML=vistaData[k].body;vModal.classList.add('open');
  }));
  $$('[data-close-vista]').forEach(b=>b.addEventListener('click',()=>vModal.classList.remove('open')));
  vModal.addEventListener('click',e=>{if(e.target===vModal)vModal.classList.remove('open')});
}

// ARCHIVE
function initArchive(){
  const grid=$('#archive-grid');
  if(!grid)return;
  const items=[
    {src:'assets/wallpaper1.jpg',name:'aero_sunset.jpg',folder:'wallpapers'},
    {src:'assets/wallpaper2.jpg',name:'underwater_garden.png',folder:'wallpapers'},
    {src:'assets/hero-bg.jpg',name:'future_city_2007.jpg',folder:'advertising'},
    {src:'assets/interface-vista.jpg',name:'vista_aero_glass.png',folder:'interfaces'},
    {src:'assets/archive-ad.jpg',name:'eco_city_poster.jpg',folder:'advertising'},
    {src:'assets/nature-grass.jpg',name:'grass_dew_macro.jpg',folder:'nature'},
    {src:'assets/tech-phones.jpg',name:'phones_2008.jpg',folder:'technology'},
    {src:'assets/games-consoles.jpg',name:'consoles_gloss.jpg',folder:'technology'},
    {src:'assets/glass-sphere.jpg',name:'glass_world.png',folder:'corporate'},
    {src:'assets/wallpaper1.jpg',name:'bubble_dreams.jpg',folder:'corporate'},
    {src:'assets/wallpaper2.jpg',name:'tropical_aqua.jpg',folder:'nature'},
    {src:'assets/interface-vista.jpg',name:'old_desktop.png',folder:'interfaces'},
  ];
  function render(filter='all'){
    grid.innerHTML='';
    items.filter(it=>filter==='all'||it.folder===filter).forEach(it=>{
      const d=document.createElement('div');d.className='thumb';
      d.innerHTML=`<img src="${it.src}" alt=""><span>${it.name}</span>`;
      d.addEventListener('dblclick',()=>openViewer(it.src));
      d.addEventListener('click',()=>{
        d.style.outline='2px solid #00AEEF';
        setTimeout(()=>d.style.outline='',800);
      });
      grid.appendChild(d);
    });
  }
  $$('.archive-folder').forEach(f=>f.addEventListener('click',()=>{
    $$('.archive-folder').forEach(x=>x.classList.remove('active'));
    f.classList.add('active');render(f.dataset.folder);
  }));
  render();
}
function openViewer(src){
  $('#viewer-img').src=src;$('#photo-viewer').classList.add('open');
}
$('#close-viewer')?.addEventListener('click',()=>$('#photo-viewer').classList.remove('open'));
$('#photo-viewer')?.addEventListener('click',e=>{if(e.target.id==='photo-viewer')e.currentTarget.classList.remove('open')});

// DESKTOP
function initDesktop(){
  const wins={internet:$('#win-internet'),aquarium:$('#win-aquarium'),weather:$('#win-weather'),media:$('#win-media'),future:$('#win-future'),bin:$('#win-bin')};
  let z=10;
  function openWin(key){
    const w=wins[key];if(!w)return;w.classList.add('open');w.style.zIndex=++z;
  }
  $$('.d-icon').forEach(ic=>ic.addEventListener('dblclick',()=>openWin(ic.dataset.win)));
  $$('.d-icon').forEach(ic=>ic.addEventListener('click',()=>{ic.style.filter='brightness(1.2)';setTimeout(()=>ic.style.filter='',200)}));
  $$('[data-close]').forEach(b=>b.addEventListener('click',e=>{e.target.closest('.aero-window').classList.remove('open')}));
  // draggable
  $$('.aero-window').forEach(win=>{
    const bar=win.querySelector('.win-titlebar');if(!bar)return;
    let sx,sy,ox,oy,drag=false;
    bar.addEventListener('mousedown',e=>{
      drag=true;sx=e.clientX;sy=e.clientY;ox=win.offsetLeft;oy=win.offsetTop;win.style.zIndex=++z;
    });
    document.addEventListener('mousemove',e=>{
      if(!drag)return;win.style.left=(ox+e.clientX-sx)+'px';win.style.top=(oy+e.clientY-sy)+'px';
    });
    document.addEventListener('mouseup',()=>drag=false);
    win.addEventListener('mousedown',()=>win.style.zIndex=++z);
  });
  // aquarium
  const canvas=$('#aquarium-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d');
    let fishes=[];let foods=[];let mouse={x:canvas.width/2,y:canvas.height/2,active:false};
    for(let i=0;i<6;i++)fishes.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,size:12+Math.random()*10,color:`hsl(${180+Math.random()*60},80%,60%)`});
    canvas.addEventListener('mousemove',e=>{
      const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)*(canvas.width/r.width);mouse.y=(e.clientY-r.top)*(canvas.height/r.height);mouse.active=true;
    });
    canvas.addEventListener('mouseleave',()=>mouse.active=false);
    canvas.addEventListener('click',e=>{
      const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*(canvas.width/r.width), y=(e.clientY-r.top)*(canvas.height/r.height);
      foods.push({x,y,life:200});
    });
    $('#feed-fish')?.addEventListener('click',()=>{for(let i=0;i<3;i++)foods.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,life:200})});
    function loopAqua(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // water gradient already via css but draw bubbles
      ctx.fillStyle='rgba(255,255,255,0.15)';
      for(let i=0;i<3;i++){const bx=(Date.now()*0.02+i*120)%canvas.height;ctx.beginPath();ctx.arc(20+i*30,canvas.height-bx,3,0,Math.PI*2);ctx.fill();}
      // foods
      foods.forEach(f=>{
        ctx.fillStyle='#ffcc66';ctx.beginPath();ctx.arc(f.x,f.y,3,0,Math.PI*2);ctx.fill();f.life--;
      });
      foods=foods.filter(f=>f.life>0);
      // fishes
      fishes.forEach(f=>{
        // seek mouse or food
        let target=null;
        if(foods.length>0){
          let closest=foods[0],d0=Infinity;
          foods.forEach(fd=>{const d=Math.hypot(fd.x-f.x,fd.y-f.y);if(d<d0){d0=d;closest=fd;}});
          target=closest;
        }else if(mouse.active){
          target=mouse;
        }
        if(target){
          const dx=target.x-f.x,dy=target.y-f.y,dist=Math.hypot(dx,dy);
          if(dist>5){f.vx+=(dx/dist)*0.05;f.vy+=(dy/dist)*0.05;}
        }
        f.vx*=0.98;f.vy*=0.98;
        f.x+=f.vx;f.y+=f.vy;
        if(f.x<0||f.x>canvas.width)f.vx*=-1;
        if(f.y<0||f.y>canvas.height)f.vy*=-1;
        // draw fish as simple triangle + circle
        ctx.save();ctx.translate(f.x,f.y);const ang=Math.atan2(f.vy,f.vx);ctx.rotate(ang);
        ctx.fillStyle=f.color;ctx.beginPath();ctx.ellipse(0,0,f.size,f.size*0.6,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=f.color;ctx.beginPath();ctx.moveTo(-f.size*0.6,0);ctx.lineTo(-f.size*1.2,f.size*0.5);ctx.lineTo(-f.size*1.2,-f.size*0.5);ctx.closePath();ctx.fill();
        ctx.fillStyle='white';ctx.beginPath();ctx.arc(f.size*0.3,0,2,0,Math.PI*2);ctx.fill();
        ctx.restore();
        // eat food
        foods.forEach((fd,i)=>{
          if(Math.hypot(fd.x-f.x,fd.y-f.y)<f.size){foods.splice(i,1);f.size=Math.min(28,f.size+1);}
        });
      });
      requestAnimationFrame(loopAqua);
    }
    loopAqua();
  }
  // media visualizer
  const vis=$('#visualizer');
  let visRunning=false, visAnim;
  if(vis){
    const vctx=vis.getContext('2d');
    function drawVis(){
      if(!visRunning)return;
      vctx.clearRect(0,0,vis.width,vis.height);
      const bars=32;
      for(let i=0;i<bars;i++){
        const h=10+Math.sin(Date.now()*0.005+i)*20+Math.random()*30;
        vctx.fillStyle=`hsl(${180+i*4},90%,60%)`;
        vctx.fillRect(i*(vis.width/bars+2),vis.height-h,vis.width/bars, h);
      }
      visAnim=requestAnimationFrame(drawVis);
    }
    $('#play-audio')?.addEventListener('click',()=>{visRunning=true;drawVis();});
    $('#pause-audio')?.addEventListener('click',()=>{visRunning=false;cancelAnimationFrame(visAnim);});
  }
  // flat exe easter egg
  $('#flat-exe')?.addEventListener('click',()=>{
    document.body.classList.add('flat');$('#aero-toggle').innerHTML='<div class="dot" style="background:#999"></div> AERO: OFF';
    alert('flat_design.exe executed: Depth removed. Gloss deleted. Future flattened. Click AERO toggle to restore.');
  });
}

// FLAT SLIDER
function initFlatSlider(){
  const slider=$('#flat-slider'), fall=$('#fall'), compAero=$('#comp-aero'), compFlat=$('#comp-flat');
  if(!slider)return;
  slider.addEventListener('input',()=>{
    const v=parseInt(slider.value)/100;
    document.documentElement.style.setProperty('--flatness',v);
    if(v>0.5){fall.classList.add('flat-mode');}
    else fall.classList.remove('flat-mode');
    compAero.style.opacity=1-v;compAero.style.filter=`blur(${v*4}px)`;
    compFlat.style.opacity=0.4+v*0.6;
  });
  $('#where-btn')?.addEventListener('click',()=>$('#fall').scrollIntoView({behavior:'smooth'}));
}

// QUIZ
function initQuiz(){
  const opts=$$('.q-opt');
  const state={sky:null,btn:null,pet:null};
  opts.forEach(o=>{
    o.addEventListener('click',()=>{
      const q=o.closest('.quiz-options').dataset.q;
      o.closest('.quiz-options').querySelectorAll('.q-opt').forEach(x=>x.classList.remove('selected'));
      o.classList.add('selected');
      state[q]=o.dataset.v;
    });
  });
  $('#quiz-result-btn')?.addEventListener('click',()=>{
    let score=20;
    if(state.sky==='sunny')score+=20;if(state.sky==='rainbow')score+=40;
    if(state.btn==='glass')score+=20;if(state.btn==='glossy')score+=50;
    if(state.pet==='fish')score+=40;if(state.pet==='cat')score+=10;
    score=Math.min(99,score);
    if(state.sky==='rainbow'&&state.btn==='glossy'&&state.pet==='fish')score=96;
    $('#quiz-score').textContent=score+'% FRUTIGER AERO';
    let txt='You believe technology should have bubbles.';
    if(score>80)txt='You are literally Windows Vista wallpaper. Grass, bubbles, glass city — your soul is 2007.';
    else if(score>50)txt='Half flat, half glossy. You miss depth but live in minimalism.';
    else txt='You are flat design. But somewhere inside you still remember the bubbles.';
    $('#quiz-text').textContent=txt;
    $('#quiz-result').style.display='block';
  });
  $('#share-quiz')?.addEventListener('click',()=>{
    if(navigator.clipboard){navigator.clipboard.writeText($('#quiz-score').textContent+' — '+$('#quiz-text').textContent+' #FrutigerAero');alert('Copied for TikTok!');}
  });
}

// BUBBLE PLAYGROUND
function initBubblePlay(){
  const field=$('#bubble-field'), countEl=$('#bubble-count'), ach=$('#bubble-ach');
  if(!field)return;
  let popped=0;
  function spawn(){
    field.innerHTML='';popped=0;countEl.textContent='0 / 20 popped';ach.style.display='none';
    for(let i=0;i<30;i++){
      const b=document.createElement('div');b.className='pop-bubble';
      const sz=24+Math.random()*46;b.style.width=sz+'px';b.style.height=sz+'px';
      b.style.left=Math.random()*(field.clientWidth-sz)+'px';b.style.top=Math.random()*(field.clientHeight-sz)+'px';
      b.addEventListener('click',()=>{
        // pop effect
        for(let j=0;j<6;j++){
          const p=document.createElement('div');p.className='pop-particle';
          p.style.left=b.style.left;p.style.top=b.style.top;
          p.style.transform=`translate(${ (Math.random()-0.5)*80}px, ${(Math.random()-0.5)*80}px)`;
          field.appendChild(p);setTimeout(()=>p.remove(),500);
        }
        b.remove();popped++;countEl.textContent=popped+' / 20 popped';
        if(popped>=20){ach.style.display='inline-block';}
        // sound
        if(audioCtx){const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=400+Math.random()*600;g.gain.setValueAtTime(0.3,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.2);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+0.2);}
      });
      field.appendChild(b);
    }
  }
  spawn();
  field.addEventListener('dblclick',spawn);
}

// GROW WORLD - with generated glossy icons instead of emoji
function initGrow(){
  const field=$('#grow-field'), status=$('#grow-status');
  if(!field)return;
  let stage=0;const items=[];
  const stages=[
    {icon:'<img src="assets/icon-product.png" style="width:36px;height:36px;border-radius:8px">',count:8,text:'Grass is growing...',isImg:true},
    {icon:'<img src="assets/nature-grass.jpg" style="width:36px;height:36px;border-radius:50%;object-fit:cover">',count:5,text:'Flowers blooming',isImg:true},
    {icon:'<img src="assets/icon-ad.png" style="width:42px;height:42px;border-radius:10px">',count:3,text:'Trees rising',isImg:true},
    {icon:'<img src="assets/icon-computer.png" style="width:48px;height:48px;border-radius:10px">',count:1,text:'Glass city emerging',isImg:true},
    {icon:'<div style="width:64px;height:20px;background:linear-gradient(90deg,red,orange,yellow,green,cyan,blue,violet);border-radius:999px;box-shadow:0 2px 12px rgba(0,0,0,0.15)"></div>',count:1,text:'Rainbow appears — Your future is ready.',isImg:true}
  ];
  field.addEventListener('click',e=>{
    if(stage>=stages.length)return;
    const rect=field.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    if(y<rect.height*0.4 && stage<3)return;
    const cur=stages[stage];
    const el=document.createElement('div');el.className='grow-item';
    if(cur.isImg)el.innerHTML=cur.icon; else el.textContent=cur.icon;
    el.style.left=(x+ (Math.random()-0.5)*60)+'px';el.style.top=(y+ (Math.random()-0.5)*30)+'px';
    field.appendChild(el);items.push(el);
    cur.count--;
    if(cur.count<=0){stage++;status.textContent=stage<stages.length?stages[stage].text:stages[stages.length-1].text;}
    if(stage===1&&items.length>6)status.textContent=stages[1].text;
  });
}

// SOUND TOGGLE
let soundOn=false, ambientOscs=[];
function initSound(){
  const btn=$('#sound-toggle');
  if(!btn)return;
  btn.addEventListener('click',()=>{
    soundOn=!soundOn;btn.textContent=soundOn?'🔊 SOUND ON':'🔊 SOUND OFF';
    if(soundOn){
      if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      // simple ambient: low filtered noise via oscillators
      try{
        const o=audioCtx.createOscillator(), g=audioCtx.createGain(), f=audioCtx.createBiquadFilter();
        o.type='sine';o.frequency.value=110;f.type='lowpass';f.frequency.value=600;
        g.gain.value=0.02;o.connect(f);f.connect(g);g.connect(audioCtx.destination);o.start();ambientOscs.push({o,g});
      }catch(e){}
    }else{
      ambientOscs.forEach(a=>{try{a.o.stop();}catch{}});ambientOscs=[];
    }
  });
}

// AERO TOGGLE
function initAeroToggle(){
  const t=$('#aero-toggle');
  if(!t)return;
  t.addEventListener('click',()=>{
    document.body.classList.toggle('flat');
    const isFlat=document.body.classList.contains('flat');
    t.innerHTML=isFlat?'<div class="dot" style="background:#999;box-shadow:none"></div> AERO: OFF':'<div class="dot"></div> AERO: ON';
  });
}

// REVIVAL BUBBLES
function initRevivalBubbles(){
  const cont=$('#revival-bubbles');
  if(!cont)return;
  for(let i=0;i<14;i++){
    const b=document.createElement('div');b.className='bubble';const sz=20+Math.random()*50;
    b.style.width=sz+'px';b.style.height=sz+'px';b.style.left=Math.random()*100+'%';
    b.style.animationDuration=(10+Math.random()*16)+'s';b.style.animationDelay=Math.random()*8+'s';
    cont.appendChild(b);
  }
}

// YEAR OBSERVER
function initYearObserver(){
  const badge=$('#year-badge');
  const sections=[
    {id:'hero',year:'2007'},
    {id:'about',year:'2007'},
    {id:'builder',year:'2007'},
    {id:'timeline',year:'2007'},
    {id:'world',year:'2009'},
    {id:'archive',year:'2010'},
    {id:'desktop',year:'2009'},
    {id:'peak',year:'2012'},
    {id:'fall',year:'2013'},
    {id:'why',year:'2013'},
    {id:'silence',year:'2016'},
    {id:'revival',year:'2022'},
    {id:'why-miss',year:'2022'},
    {id:'quiz',year:'2023'},
    {id:'bubbles-play',year:'2024'},
    {id:'grow',year:'2007'},
    {id:'finale',year:'∞'}
  ];
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const found=sections.find(s=>s.id===e.target.id);
        if(found)badge.textContent=found.year;
      }
    });
  },{threshold:0.4});
  sections.forEach(s=>{const el=document.getElementById(s.id);if(el)obs.observe(el);});
}

// RETURN TO 2007
$('#return-2007')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
