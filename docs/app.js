(() => {
  const games = [
    {id:'snake', name:'Neon Snake', category:'arcade', kicker:'MINI ARCADE / JUEGO 01', instructions:'Usa las flechas para moverte. Come los puntos y no choques.'},
    {id:'pong', name:'Micro Pong', category:'skill', kicker:'MINI ARCADE / JUEGO 02', instructions:'Mueve la raqueta con ← y →. Rebota la pelota todo lo que puedas.'},
    {id:'dash', name:'Pixel Dash', category:'arcade', kicker:'MINI ARCADE / JUEGO 03', instructions:'Pulsa ESPACIO, ↑ o SALTAR para esquivar. Sobrevive cuanto puedas.'}
  ];
  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas.getContext('2d');
  const dialog = document.querySelector('#game-dialog');
  const overlay = document.querySelector('#game-overlay');
  const overlayTitle = document.querySelector('#overlay-title');
  const overlayCopy = document.querySelector('#overlay-copy');
  const title = document.querySelector('#dialog-title');
  const kicker = document.querySelector('#game-kicker');
  const scoreNode = document.querySelector('#score');
  const hint = document.querySelector('#control-hint');
  const jumpControl = document.querySelector('.jump-control');
  let current = games[0], running = false, raf = 0, score = 0, last = 0, state = null;
  const W = canvas.width, H = canvas.height;
  const ink = '#1e2022', coral = '#f05a3a', yellow = '#f2d479', mint = '#a7d7bd', paper = '#f5f0e6';
  document.querySelector('#year').textContent = new Date().getFullYear();

  const cardList = [...document.querySelectorAll('.game-card')];
  const search = document.querySelector('#game-search');
  const filters = [...document.querySelectorAll('.filter-chip')];
  let category = 'all';
  function filterCards() {
    const q = search.value.trim().toLocaleLowerCase('es');
    let count = 0;
    cardList.forEach(card => {
      const visible = (category === 'all' || card.dataset.category === category) && (!q || card.dataset.name.includes(q));
      card.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector('#empty-state').hidden = count !== 0;
    document.querySelector('#catalog-count').textContent = `${String(count).padStart(2,'0')} ${count === 1 ? 'JUEGO' : 'JUEGOS'} ${count === 1 ? 'EN LA' : 'EN LA'} COLECCIÓN`;
  }
  search.addEventListener('input', filterCards);
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    filters.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
    filterCards();
  }));
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !dialog.open && document.activeElement !== search && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
  });

  document.querySelectorAll('[data-launch]').forEach(button => button.addEventListener('click', e => {
    e.stopPropagation(); openGame(button.dataset.launch);
  }));
  cardList.forEach(card => {
    card.addEventListener('click', e => { if (!e.target.closest('button')) openGame(card.dataset.game); });
    card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); openGame(card.dataset.game); } });
  });
  document.querySelector('#close-game').addEventListener('click', closeGame);
  dialog.addEventListener('click', e => { if (e.target === dialog) closeGame(); });
  dialog.addEventListener('cancel', () => stopGame());
  document.querySelector('#start-game').addEventListener('click', startGame);
  document.querySelector('#restart-game').addEventListener('click', () => { resetGame(); startGame(); });

  function openGame(id) {
    stopGame();
    current = games.find(game => game.id === id) || games[0];
    title.textContent = current.name;
    kicker.textContent = current.kicker;
    document.querySelector('#start-game').textContent = 'INICIAR PARTIDA →';
    overlayTitle.textContent = '¿Listo para jugar?';
    overlayCopy.textContent = current.instructions;
    hint.innerHTML = current.id === 'dash' ? '<span class="keycap">SPACE</span><span class="keycap">↑</span> saltar' : current.id === 'pong' ? '<span class="keycap">←</span><span class="keycap">→</span> mover la raqueta' : '<span class="keycap">←</span><span class="keycap">↑</span><span class="keycap">↓</span><span class="keycap">→</span> mover';
    jumpControl.classList.toggle('is-visible', current.id === 'dash');
    document.querySelectorAll('[data-control]').forEach(control => {
      const direction = control.dataset.control;
      control.hidden = current.id === 'snake' ? false : current.id === 'pong' ? !['left','right'].includes(direction) : direction !== 'jump';
    });
    score = 0; updateScore(); drawAttract();
    overlay.classList.remove('is-hidden');
    dialog.showModal();
    document.querySelector('#start-game').focus();
  }
  function closeGame() { stopGame(); if (dialog.open) dialog.close(); }
  function updateScore() { scoreNode.textContent = String(Math.floor(score)).padStart(3,'0'); }
  function startGame() {
    if (running) return;
    resetGame(); running = true; overlay.classList.add('is-hidden'); last = performance.now(); raf = requestAnimationFrame(tick);
  }
  function stopGame() { running = false; cancelAnimationFrame(raf); }
  function endGame(message) {
    stopGame(); overlayTitle.textContent = message || '¡Buen intento!'; overlayCopy.textContent = `Hiciste ${Math.floor(score)} puntos. ¿Una más?`; overlay.classList.remove('is-hidden');
    document.querySelector('#start-game').textContent = 'VOLVER A JUGAR →';
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min(.04,(now-last)/1000); last = now; update(dt); drawGame(); raf = requestAnimationFrame(tick);
  }
  function update(dt) {
    if (current.id === 'snake') updateSnake(dt);
    if (current.id === 'pong') updatePong(dt);
    if (current.id === 'dash') updateDash(dt);
  }
  function gridBackground() {
    ctx.fillStyle = '#24363b'; ctx.fillRect(0,0,W,H); ctx.strokeStyle = 'rgba(245,240,230,.07)'; ctx.lineWidth = 1;
    for(let x=0;x<W;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  }
  function updateSnake(dt) {
    state.elapsed += dt; state.step += dt;
    if(state.step < .115) return;
    state.step = 0; state.dir = state.next;
    const head={x:state.snake[0].x+state.dir.x,y:state.snake[0].y+state.dir.y};
    if(head.x<0||head.x>=26||head.y<0||head.y>=14||state.snake.some(part=>part.x===head.x&&part.y===head.y)){endGame('¡Choque!');return}
    state.snake.unshift(head);
    if(head.x===state.food.x&&head.y===state.food.y){score+=10;updateScore();state.food={x:Math.floor(Math.random()*26),y:Math.floor(Math.random()*14)}}else state.snake.pop();
  }
  function drawSnake() {
    gridBackground();
    ctx.fillStyle=coral;ctx.fillRect(state.food.x*24+5,state.food.y*24+5,14,14);
    state.snake.forEach((part,i)=>{ctx.fillStyle=i===0?yellow:mint;ctx.fillRect(part.x*24+3,part.y*24+3,18,18);if(i===0){ctx.fillStyle=ink;ctx.fillRect(part.x*24+14,part.y*24+7,3,3)}});
  }
  function updatePong(dt) {
    state.elapsed+=dt;const b=state.ball;
    if(state.keysLeft)state.paddle=Math.max(42,state.paddle-340*dt);if(state.keysRight)state.paddle=Math.min(H-42,state.paddle+340*dt);state.playerY=state.paddle;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.y<10||b.y>H-10)b.vy*=-1;
    if(b.x<38&&b.y>state.playerY-43&&b.y<state.playerY+43){b.vx=Math.abs(b.vx)*1.035;b.vy+=(b.y-state.playerY)*2.6}
    if(b.x>W-38&&b.y>state.cpuY-43&&b.y<state.cpuY+43)b.vx=-Math.abs(b.vx)*1.03;
    state.cpuY+=(b.y-state.cpuY)*Math.min(1,dt*3.7);
    if(b.x<0){endGame('¡Se escapó la pelota!');return}
    if(b.x>W+10){score+=1;updateScore();b.x=W/2;b.y=H/2;b.vx=-210;b.vy=(Math.random()-.5)*180}
  }
  function drawPong() {
    ctx.fillStyle='#efd879';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(30,32,34,.17)';for(let y=0;y<H;y+=20)ctx.fillRect(W/2-1,y,2,10);
    ctx.fillStyle=ink;ctx.font='20px "DM Mono",monospace';ctx.textAlign='center';ctx.fillText(String(score).padStart(2,'0'),W/2-45,42);ctx.fillText('CPU',W/2+45,42);
    ctx.fillStyle=ink;ctx.fillRect(22,state.playerY-42,11,84);ctx.fillStyle=coral;ctx.fillRect(W-33,state.cpuY-42,11,84);
    ctx.fillStyle=paper;ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.fillRect(state.ball.x-9,state.ball.y-9,18,18);ctx.strokeRect(state.ball.x-9,state.ball.y-9,18,18);
  }
  function updateDash(dt) {
    state.elapsed+=dt;score=Math.floor(state.elapsed*10);updateScore();const r=state.runner;
    if(!r.ground){r.vy+=950*dt;r.y+=r.vy*dt;if(r.y>=0){r.y=0;r.vy=0;r.ground=true}}
    state.next-=dt;if(state.next<=0){state.obstacles.push({x:W+10,w:20+Math.random()*18,h:25+Math.random()*25});state.next=1.05+Math.random()*.85}
    state.obstacles.forEach(o=>o.x-=250*dt);state.obstacles=state.obstacles.filter(o=>o.x>-40);
    for(const o of state.obstacles){if(o.x<119&&o.x+o.w>91&&r.y>-o.h+28){endGame('¡Uy, obstáculo!');return}}
    state.clouds.forEach(c=>{c.x-=22*dt;if(c.x<-55)c.x=W+50});
  }
  function drawDash() {
    ctx.fillStyle='#f7a983';ctx.fillRect(0,0,W,H);ctx.fillStyle=yellow;ctx.beginPath();ctx.arc(520,88,43,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(245,240,230,.8)';state.clouds.forEach(c=>{ctx.fillRect(c.x,c.y,46,10);ctx.fillRect(c.x+8,c.y-8,22,9)});
    ctx.fillStyle=ink;ctx.fillRect(0,300,W,3);ctx.fillStyle='rgba(30,32,34,.35)';for(let x=0;x<W;x+=52)ctx.fillRect((x-state.elapsed*250%52),315,24,2);
    ctx.fillStyle=mint;ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.fillRect(95,262+state.runner.y,34,38);ctx.strokeRect(95,262+state.runner.y,34,38);ctx.fillRect(101,246+state.runner.y,22,20);ctx.strokeRect(101,246+state.runner.y,22,20);ctx.fillStyle=ink;ctx.fillRect(115,252+state.runner.y,4,4);
    ctx.fillStyle=coral;ctx.strokeStyle=ink;ctx.lineWidth=3;state.obstacles.forEach(o=>{ctx.fillRect(o.x,300-o.h,o.w,o.h);ctx.strokeRect(o.x,300-o.h,o.w,o.h)});
    ctx.fillStyle=ink;ctx.font='bold 29px "Space Grotesk",sans-serif';ctx.textAlign='right';ctx.fillText('¡CORRE!',W-24,49);
  }
  function drawGame() {
    if(!state){drawAttract();return}
    if(current.id==='snake')drawSnake();if(current.id==='pong')drawPong();if(current.id==='dash')drawDash();
  }
  function drawAttract(){ctx.fillStyle='#24363b';ctx.fillRect(0,0,W,H);ctx.fillStyle=yellow;ctx.font='bold 30px "Space Grotesk",sans-serif';ctx.textAlign='center';ctx.fillText('PLAYNEXO',W/2,H/2-8);ctx.fillStyle=mint;ctx.font='13px "DM Mono",monospace';ctx.fillText('PULSA INICIAR',W/2,H/2+23)}
  document.addEventListener('keydown', e => {
    if(!dialog.open)return;
    const key=e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key))e.preventDefault();
    if(current.id==='snake'){
      const d={arrowup:{x:0,y:-1},w:{x:0,y:-1},arrowdown:{x:0,y:1},s:{x:0,y:1},arrowleft:{x:-1,y:0},a:{x:-1,y:0},arrowright:{x:1,y:0},d:{x:1,y:0}}[key];
      if(d&&state&&!(d.x===-state.dir.x&&d.y===-state.dir.y))state.next=d;
    }
    if(current.id==='pong'&&state){if(key==='arrowleft'||key==='a')state.keysLeft=true;if(key==='arrowright'||key==='d')state.keysRight=true}
    if(current.id==='dash'&&[' ','arrowup','w'].includes(key))jump();
  });
  document.addEventListener('keyup', e=>{if(current.id==='pong'&&state){const k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')state.keysLeft=false;if(k==='arrowright'||k==='d')state.keysRight=false}});
  function jump(){if(current.id==='dash'&&running&&state&&state.runner.ground){state.runner.ground=false;state.runner.vy=-480}}
  document.querySelectorAll('[data-control]').forEach(button=>{
    const action=button.dataset.control;
    const down=()=>{if(current.id==='dash'&&action==='jump'){jump();return}if(current.id==='pong'&&state){if(action==='left')state.keysLeft=true;if(action==='right')state.keysRight=true}if(current.id==='snake'&&state){const d={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[action];if(d&&!(d.x===-state.dir.x&&d.y===-state.dir.y))state.next=d}};
    const up=()=>{if(current.id==='pong'&&state){if(action==='left')state.keysLeft=false;if(action==='right')state.keysRight=false}};
    button.addEventListener('pointerdown',e=>{e.preventDefault();down()});button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('pointerleave',up);
  });
  function resetGame(){
    score=0;updateScore();
    if(current.id==='snake')state={snake:[{x:10,y:9},{x:9,y:9},{x:8,y:9}],dir:{x:1,y:0},next:{x:1,y:0},food:{x:15,y:7},elapsed:0,step:0};
    if(current.id==='pong')state={paddle:W/2,ball:{x:W/2,y:H/2,vx:210,vy:145},elapsed:0,keysLeft:false,keysRight:false,playerY:H/2,cpuY:H/2};
    if(current.id==='dash')state={runner:{y:0,vy:0,ground:true},obstacles:[],elapsed:0,next:1.25,clouds:[{x:170,y:55},{x:410,y:82}],dead:false};
    drawGame();
  }
})();
