// ── STARS ──────────────────────────────────────────────────────────────────
(function(){
  const bg=document.getElementById('stars-bg');
  for(let i=0;i<70;i++){
    const s=document.createElement('div');s.className='star';
    const sz=Math.random()*3+1;
    s.style.cssText=`width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${2+Math.random()*3}s`;
    bg.appendChild(s);
  }
})();

// ── HELPERS ────────────────────────────────────────────────────────────────
function rInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}

// ── STORY TEMPLATES ────────────────────────────────────────────────────────
const STORY_POOL = {
  '+': [
    { emoji:'🍎', story:(a,b,r)=>`<strong>João</strong> foi ao mercado e comprou <strong>${a} maçãs</strong>. Depois voltou e comprou mais <strong>${b} maçãs</strong>. Com quantas maçãs João ficou ao todo?` },
    { emoji:'🐟', story:(a,b,r)=>`<strong>Ana</strong> tem um aquário com <strong>${a} peixes</strong>. Seu pai deu de presente mais <strong>${b} peixes</strong> novos. Quantos peixes tem no aquário agora?` },
    { emoji:'🎈', story:(a,b,r)=>`Na festa havia <strong>${a} balões azuis</strong> e chegaram mais <strong>${b} balões amarelos</strong>. Quantos balões tem na festa agora?` },
    { emoji:'🚀', story:(a,b,r)=>`O astronauta <strong>Pedro</strong> coletou <strong>${a} pedras</strong> na Lua de manhã e <strong>${b} pedras</strong> à tarde. Quantas pedras coletou no total?` },
    { emoji:'🍫', story:(a,b,r)=>`<strong>Maria</strong> ganhou <strong>${a} chocolates</strong> no aniversário e comprou mais <strong>${b}</strong> na loja. Quantos chocolates ela tem agora?` },
    { emoji:'📚', story:(a,b,r)=>`<strong>Lucas</strong> leu <strong>${a} páginas</strong> de manhã e <strong>${b} páginas</strong> depois do almoço. Quantas páginas ele leu ao todo hoje?` },
    { emoji:'🐾', story:(a,b,r)=>`No abrigo havia <strong>${a} cães</strong>. Trouxeram mais <strong>${b} cães</strong> resgatados. Quantos cães há no abrigo agora?` },
    { emoji:'🌻', story:(a,b,r)=>`<strong>Sofia</strong> plantou <strong>${a} girassóis</strong> segunda-feira e <strong>${b} girassóis</strong> terça-feira. Quantos girassóis ela plantou no total?` },
  ],
  '-': [
    { emoji:'🍌', story:(a,b,r)=>`<strong>João</strong> tinha <strong>${a} bananas</strong>. Ele comeu <strong>${b}</strong> no café da manhã. Com quantas bananas João ficou?` },
    { emoji:'🎮', story:(a,b,r)=>`<strong>Gabriel</strong> tinha <strong>${a} vidas</strong> no jogo. Perdeu <strong>${b} vidas</strong> numa fase difícil. Quantas vidas ele ainda tem?` },
    { emoji:'🍬', story:(a,b,r)=>`<strong>Clara</strong> tinha <strong>${a} balas</strong> e deu <strong>${b}</strong> para a amiga. Com quantas balas Clara ficou?` },
    { emoji:'🏀', story:(a,b,r)=>`O time marcou <strong>${a} pontos</strong> na partida, mas o juiz anulou <strong>${b} pontos</strong>. Com quantos pontos o time ficou?` },
    { emoji:'🐦', story:(a,b,r)=>`Havia <strong>${a} pássaros</strong> na árvore. <strong>${b}</strong> voaram embora quando ouviram um barulho. Quantos pássaros ficaram na árvore?` },
    { emoji:'🎨', story:(a,b,r)=>`<strong>Bia</strong> tinha <strong>${a} lápis de cor</strong>. Emprestou <strong>${b}</strong> para o amigo. Quantos lápis ela ainda tem?` },
    { emoji:'🌮', story:(a,b,r)=>`A lanchonete tinha <strong>${a} tacos</strong>. Vendeu <strong>${b}</strong> na hora do almoço. Quantos tacos ainda sobraram?` },
    { emoji:'⚽', story:(a,b,r)=>`O time tinha <strong>${a} jogadores</strong> mas <strong>${b}</strong> se machucaram. Quantos jogadores continuaram em campo?` },
  ],
};

// ── QUESTION GENERATOR ─────────────────────────────────────────────────────
function generateQuestions() {
  const qs = [];
  const usedPairs = new Set();

  function pair(minA,maxA,minB,maxB,op,check){
    let a,b,key,tries=0;
    do{
      a=rInt(minA,maxA); b=rInt(minB,maxB); key=op+a+','+b; tries++;
    } while((usedPairs.has(key)||(check&&!check(a,b)))&&tries<200);
    usedPairs.add(key);
    return {a,b};
  }

  // ── SECTION 1: Story – Adição fácil (soma ≤ 10, 6 qs)
  const storyAdd1=[
    (a,b)=>({emoji:'🍎',s:`Você tinha <strong>${a} maçãs</strong> e ganhou mais <strong>${b}</strong> de presente. Com quantas maçãs você ficou?`}),
    (a,b)=>({emoji:'🐶',s:`No parque havia <strong>${a} cachorros</strong> brincando. Chegaram mais <strong>${b}</strong> para brincar também. Quantos cachorros tem no parque agora?`}),
    (a,b)=>({emoji:'⭐',s:`Você ganhou <strong>${a} estrelas</strong> na escola e mais <strong>${b} estrelas</strong> em casa. Quantas estrelas você tem ao todo?`}),
    (a,b)=>({emoji:'🍪',s:`De manhã você comeu <strong>${a} biscoitos</strong> e à tarde comeu mais <strong>${b}</strong>. Quantos biscoitos você comeu no dia todo?`}),
    (a,b)=>({emoji:'🦋',s:`No jardim você viu <strong>${a} borboletas azuis</strong> e <strong>${b} borboletas amarelas</strong>. Quantas borboletas você viu ao todo?`}),
    (a,b)=>({emoji:'🐱',s:`No abrigo há <strong>${a} gatos</strong> grandes e <strong>${b} gatinhos</strong> pequenos. Quantos felinos há no abrigo ao todo?`}),
    (a,b)=>({emoji:'🌺',s:`Você plantou <strong>${a} flores</strong> ontem e mais <strong>${b} flores</strong> hoje. Quantas flores tem no seu jardim agora?`}),
    (a,b)=>({emoji:'🚗',s:`No estacionamento há <strong>${a} carros vermelhos</strong> e <strong>${b} carros azuis</strong>. Quantos carros tem no estacionamento?`}),
  ];
  for(let i=0;i<6;i++){
    const {a,b}=pair(1,6,1,6,'+', (a,b)=>a+b<=10&&a+b>=3);
    const t=pick(storyAdd1)(a,b);
    qs.push({type:'story',section:i===0?'🌟 Nível 1: Adição Fácil':null,emoji:t.emoji,story:t.s,a,b,op:'+',visual:false});
  }

  // ── SECTION 2: STORY – Adição fácil extra (3 qs from STORY_POOL)
  for(let i=0;i<3;i++){
    const {a,b}=pair(2,6,1,5,'+', (a,b)=>a+b<=10&&a+b>=3);
    const r=a+b;
    const t=pick(STORY_POOL['+']);
    qs.push({type:'story',section:i===0?'📖 Mais Problemas':null,emoji:t.emoji,story:t.story(a,b,r),a,b,op:'+'});
  }

  // ── SECTION 3: MISSING – Adição fácil (3 qs)
  for(let i=0;i<3;i++){
    const {a,b}=pair(1,6,1,5,'+', (a,b)=>a+b<=10&&a+b>=3&&a!==b);
    const blankPos=pick(['a','b']);
    const r=a+b;
    qs.push({type:'missing',section:i===0?'❓ Número Faltando – Fácil':null,emoji:'🔍',context:'Qual número está faltando na conta?',a,b,op:'+',blankPos,answer:blankPos==='a'?a:b,visual:true});
  }

  // ── SECTION 4: Story – Subtração fácil (6 qs)
  const storySub1=[
    (a,b)=>({emoji:'🍌',s:`Você tinha <strong>${a} bananas</strong> na fruteira e comeu <strong>${b}</strong> no café da manhã. Quantas bananas ainda sobraram?`}),
    (a,b)=>({emoji:'🎮',s:`No jogo você tinha <strong>${a} vidas</strong> e perdeu <strong>${b}</strong> numa fase muito difícil. Quantas vidas você ainda tem?`}),
    (a,b)=>({emoji:'🐠',s:`No aquário havia <strong>${a} peixinhos</strong> coloridos. <strong>${b}</strong> foram adotados por outras famílias. Quantos peixinhos ainda estão no aquário?`}),
    (a,b)=>({emoji:'🎁',s:`Você ganhou <strong>${a} presentes</strong> no aniversário e já abriu <strong>${b}</strong>. Quantos presentes você ainda não abriu?`}),
    (a,b)=>({emoji:'🍕',s:`A pizza chegou com <strong>${a} pedaços</strong> e você comeu <strong>${b}</strong> deles. Quantos pedaços de pizza ainda sobram?`}),
    (a,b)=>({emoji:'🦜',s:`Havia <strong>${a} pássaros</strong> cantando no galho da árvore. <strong>${b}</strong> voaram embora com um susto. Quantos pássaros ficaram no galho?`}),
    (a,b)=>({emoji:'🍬',s:`Você tinha <strong>${a} balas</strong> no bolso e deu <strong>${b}</strong> para o seu amigo. Com quantas balas você ficou?`}),
    (a,b)=>({emoji:'🏀',s:`Havia <strong>${a} bolas</strong> na caixa e <strong>${b}</strong> rolaram para fora. Quantas bolas ainda estão na caixa?`}),
  ];
  for(let i=0;i<6;i++){
    const {a,b}=pair(4,10,1,6,'-', (a,b)=>a-b>=1&&b<a);
    const t=pick(storySub1)(a,b);
    qs.push({type:'story',section:i===0?'🪐 Nível 1: Subtração Fácil':null,emoji:t.emoji,story:t.s,a,b,op:'-',visual:false});
  }

  // ── SECTION 5: STORY – Subtração fácil extra (3 qs)
  for(let i=0;i<3;i++){
    const {a,b}=pair(4,10,1,5,'-', (a,b)=>a-b>=1&&b<a);
    const r=a-b;
    const t=pick(STORY_POOL['-']);
    qs.push({type:'story',section:i===0?'📖 Mais Problemas':null,emoji:t.emoji,story:t.story(a,b,r),a,b,op:'-'});
  }

  // ── SECTION 6: MISSING – Subtração fácil (3 qs)
  for(let i=0;i<3;i++){
    const {a,b}=pair(5,10,1,5,'-', (a,b)=>a-b>=1&&a!==b);
    const blankPos=pick(['a','b']);
    qs.push({type:'missing',section:i===0?'❓ Número Faltando – Subtração':null,emoji:'🔍',context:'Qual número está faltando na conta?',a,b,op:'-',blankPos,answer:blankPos==='a'?a:b});
  }

  // ── SECTION 7: Story – Adição média (soma 11-20, 6 qs)
  const storyAdd2=[
    (a,b)=>({emoji:'🚀',s:`<strong>${a} astronautas</strong> chegaram à estação espacial de manhã e mais <strong>${b}</strong> chegaram à tarde. Quantos astronautas estão na estação ao todo?`}),
    (a,b)=>({emoji:'🌊',s:`Na praia você achou <strong>${a} conchas</strong> de manhã e mais <strong>${b}</strong> à tarde. Quantas conchas você achou no total?`}),
    (a,b)=>({emoji:'📚',s:`Você leu <strong>${a} páginas</strong> do seu livro ontem e mais <strong>${b} páginas</strong> hoje. Quantas páginas você leu no total?`}),
    (a,b)=>({emoji:'⚽',s:`O time de futebol fez <strong>${a} gols</strong> no primeiro tempo e mais <strong>${b} gols</strong> no segundo. Quantos gols o time fez na partida inteira?`}),
    (a,b)=>({emoji:'🎮',s:`Você ganhou <strong>${a} moedas</strong> na fase 1 e mais <strong>${b} moedas</strong> na fase 2. Quantas moedas você tem ao todo?`}),
    (a,b)=>({emoji:'🌙',s:`Gabriel colecionou <strong>${a} figurinhas</strong> na segunda-feira e mais <strong>${b}</strong> na terça. Quantas figurinhas ele tem agora?`}),
    (a,b)=>({emoji:'🦕',s:`No museu há <strong>${a} dinossauros grandes</strong> e <strong>${b} dinossauros pequenos</strong>. Quantos dinossauros tem no museu ao todo?`}),
  ];
  for(let i=0;i<6;i++){
    const {a,b}=pair(5,12,3,12,'+', (a,b)=>a+b>=11&&a+b<=20&&a!==b);
    const t=pick(storyAdd2)(a,b);
    qs.push({type:'story',section:i===0?'🚀 Nível 2: Adição Média':null,emoji:t.emoji,story:t.s,a,b,op:'+'});
  }

  // ── SECTION 8: MISSING – Adição média (3 qs)
  for(let i=0;i<3;i++){
    const {a,b}=pair(5,12,3,10,'+', (a,b)=>a+b>=11&&a+b<=20&&a!==b);
    const blankPos=pick(['a','b']);
    qs.push({type:'missing',section:i===0?'❓ Número Faltando – Médio':null,emoji:'🔍',context:'Qual número está faltando na conta?',a,b,op:'+',blankPos,answer:blankPos==='a'?a:b});
  }

  // ── SECTION 9: Story – Subtração média (a 11-20, 6 qs)
  const storySub2=[
    (a,b)=>({emoji:'🎪',s:`Havia <strong>${a} crianças</strong> assistindo ao espetáculo no circo. Quando o show acabou, <strong>${b}</strong> foram para casa. Quantas crianças ainda ficaram no circo?`}),
    (a,b)=>({emoji:'🐘',s:`O zoológico tinha <strong>${a} animais</strong>. <strong>${b}</strong> deles foram transferidos para outro zoológico maior. Quantos animais ficaram?`}),
    (a,b)=>({emoji:'🏆',s:`Seu time estava com <strong>${a} pontos</strong> no campeonato, mas perdeu <strong>${b} pontos</strong> por causa de uma falta. Com quantos pontos o time ficou?`}),
    (a,b)=>({emoji:'🦊',s:`Havia <strong>${a} raposas</strong> morando na floresta. <strong>${b}</strong> foram embora para procurar uma nova casa. Quantas raposas ainda ficaram na floresta?`}),
    (a,b)=>({emoji:'🎵',s:`Sua playlist tem <strong>${a} músicas</strong>. Você já ouviu <strong>${b}</strong> delas. Quantas músicas você ainda não ouviu?`}),
    (a,b)=>({emoji:'🚂',s:`O trem partiu com <strong>${a} passageiros</strong>. Na primeira estação, <strong>${b}</strong> desceram. Quantos passageiros continuaram viagem?`}),
    (a,b)=>({emoji:'🎨',s:`Você tinha <strong>${a} lápis de cor</strong> na sua caixa. Perdeu <strong>${b}</strong> deles na escola. Quantos lápis você tem agora?`}),
  ];
  for(let i=0;i<6;i++){
    const {a,b}=pair(11,20,2,10,'-', (a,b)=>a-b>=2&&a-b<=15);
    const t=pick(storySub2)(a,b);
    qs.push({type:'story',section:i===0?'🌌 Nível 2: Subtração Média':null,emoji:t.emoji,story:t.s,a,b,op:'-'});
  }

  // ── SECTION 10: MISSING – Subtração média (3 qs)
  for(let i=0;i<3;i++){
    const {a,b}=pair(11,20,2,9,'-', (a,b)=>a-b>=2&&a!==b);
    const blankPos=pick(['a','b']);
    qs.push({type:'missing',section:i===0?'❓ Número Faltando – Desafio':null,emoji:'🔍',context:'Qual número está faltando na conta?',a,b,op:'-',blankPos,answer:blankPos==='a'?a:b});
  }

  // ── SECTION 11: Story – Desafio misto (6 qs)
  const storyChallenge={
    '+':[
      (a,b)=>({emoji:'👾',s:`No planeta X existem <strong>${a} aliens verdes</strong> e <strong>${b} aliens roxos</strong>. Quantos aliens moram no planeta X ao todo?`}),
      (a,b)=>({emoji:'🌟',s:`Você colecionou <strong>${a} estrelas</strong> hoje e vai colecionar mais <strong>${b}</strong> amanhã. Quantas estrelas você terá ao todo?`}),
      (a,b)=>({emoji:'🪐',s:`Saturno já tinha <strong>${a} luas</strong> conhecidas e os cientistas descobriram mais <strong>${b}</strong> novas. Quantas luas Saturno tem agora?`}),
      (a,b)=>({emoji:'🐉',s:`O dragão tem <strong>${a} escamas azuis</strong> e <strong>${b} escamas douradas</strong> brilhando na luz do sol. Quantas escamas ele tem ao todo?`}),
    ],
    '-':[
      (a,b)=>({emoji:'🛸',s:`A nave espacial partiu com <strong>${a} tripulantes</strong>. Quando chegou ao planeta, <strong>${b}</strong> desceram para explorar. Quantos ficaram na nave?`}),
      (a,b)=>({emoji:'☄️',s:`Os cientistas avistaram <strong>${a} meteoros</strong> no céu. Durante a noite, <strong>${b}</strong> deles desapareceram. Quantos meteoros ainda estão brilhando?`}),
      (a,b)=>({emoji:'🏅',s:`Gabriel conquistou <strong>${a} medalhas</strong> nos jogos espaciais e deu <strong>${b}</strong> de presente para seus amigos. Com quantas medalhas ele ficou?`}),
      (a,b)=>({emoji:'🌙',s:`O telescópio descobriu <strong>${a} planetas</strong> novos. Mas <strong>${b}</strong> deles eram quentes demais para visitar. Quantos planetas você pode visitar?`}),
    ],
  };
  for(let i=0;i<6;i++){
    const op=i%2===0?'+':'-';
    let a,b,key,tries=0;
    do{
      if(op==='+'){a=rInt(7,13);b=rInt(4,10);}
      else{a=rInt(13,20);b=rInt(5,12);}
      key=op+a+','+b; tries++;
    }while((usedPairs.has(key)||(op==='+'?(a+b<13||a+b>20):(a-b<3||a-b>14)))&&tries<200);
    usedPairs.add(key);
    const t=pick(storyChallenge[op])(a,b);
    qs.push({type:'story',section:i===0?'🌠 Nível 3: Desafio Espacial!':null,emoji:t.emoji,story:t.s,a,b,op});
  }

  return qs;
}

// ── EXPLANATION ENGINE ──────────────────────────────────────────────────────
function buildNumberLine(a,b,op){
  const end=op==='+'?a+b:a-b;
  const lo=Math.max(0,Math.min(a,end)-1);
  const hi=Math.max(a,end)+1;
  const cellW=36,svgH=48,svgW=(hi-lo)*cellW+cellW;
  let html=`<div class="numberline-wrap"><div class="numberline">`;
  for(let n=lo;n<=hi;n++)
    html+=`<div class="nl-cell"><div class="nl-tick"></div><div class="nl-label">${n}</div>${n<hi?'<div class="nl-line-seg"></div>':''}</div>`;
  html+=`</div>`;
  const startX=(a-lo)*cellW+18,endX=(end-lo)*cellW+18,midX=(startX+endX)/2;
  const rx=Math.abs(endX-startX)/2,ry=30;
  const color=op==='+'?'#43A047':'#E53935';
  html+=`<div style="position:relative;height:${svgH+6}px;width:${svgW}px;margin-top:-${svgH-2}px">
    <svg width="${svgW}" height="${svgH}" style="position:absolute;top:0;left:0;overflow:visible">
      <defs><clipPath id="tophalf"><rect x="0" y="0" width="${svgW}" height="${svgH}"/></clipPath></defs>
      <ellipse cx="${midX}" cy="${svgH}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="3" clip-path="url(#tophalf)"/>
      <circle cx="${startX}" cy="${svgH}" r="5" fill="#5C6BC0"/>
      <circle cx="${endX}" cy="${svgH}" r="6" fill="${color}"/>
      <text x="${midX}" y="${svgH-ry-6}" text-anchor="middle" font-size="12" font-weight="800" fill="${color}">${op}${b}</text>
    </svg>
  </div></div>`;
  return html;
}

function buildDotVisual(a,b,op){
  let html='<div class="visual-helper" style="justify-content:flex-start;gap:4px;flex-wrap:wrap">';
  if(op==='+'){
    for(let i=0;i<a;i++) html+=`<div class="dot dot-blue">●</div>`;
    html+=`<span style="font-size:18px;font-weight:900;color:#AB47BC;align-self:center">+</span>`;
    for(let i=0;i<b;i++) html+=`<div class="dot dot-yellow">●</div>`;
    html+=`<span style="font-size:18px;font-weight:900;color:#1A237E;align-self:center">= ${a+b}</span>`;
  } else {
    for(let i=0;i<a;i++) html+=`<div class="dot ${i>=a-b?'dot-red':'dot-blue'}">●</div>`;
    html+=`<span style="font-size:14px;font-weight:800;color:#C62828;align-self:center;margin-left:4px">→ sobram ${a-b}</span>`;
  }
  return html+'</div>';
}

function buildBlocksVisual(a,b,op){
  const result=op==='+'?a+b:a-b;
  const tensA=Math.floor(a/10),unitsA=a%10;
  let html='<div class="blocks-section">';
  if(op==='+'){
    const tensB=Math.floor(b/10),unitsB=b%10,tensR=Math.floor(result/10),unitsR=result%10;
    html+=`<div class="blocks-row"><span class="blocks-label">${a} =</span>`;
    for(let i=0;i<tensA;i++) html+=`<div class="block-ten">10</div>`;
    for(let i=0;i<unitsA;i++) html+=`<div class="block-unit"></div>`;
    html+=`</div><div class="blocks-row"><span class="blocks-label">+${b} =</span>`;
    for(let i=0;i<tensB;i++) html+=`<div class="block-ten" style="background:#AB47BC">10</div>`;
    for(let i=0;i<unitsB;i++) html+=`<div class="block-unit" style="background:#E1BEE7;border-color:#CE93D8"></div>`;
    html+=`</div><div class="blocks-eq">Juntamos tudo:</div><div class="blocks-row">`;
    for(let i=0;i<tensR;i++) html+=`<div class="block-ten" style="background:#43A047">10</div>`;
    for(let i=0;i<unitsR;i++) html+=`<div class="block-unit" style="background:#C8E6C9;border-color:#81C784"></div>`;
    html+=`<span style="font-size:15px;font-weight:900;color:#2E7D32;margin-left:6px">= ${result}! ✅</span></div>`;
  } else {
    const tensB=Math.floor(b/10);
    html+=`<div class="blocks-row"><span class="blocks-label">${a} =</span>`;
    let removedTens=tensB;
    for(let i=0;i<tensA;i++){
      if(removedTens>0){html+=`<div class="block-ten removed">10</div>`;removedTens--;}
      else html+=`<div class="block-ten">10</div>`;
    }
    let unitRemove=tensB===0?b:0;
    for(let i=0;i<unitsA;i++){
      if(unitRemove>0&&i>=unitsA-unitRemove){html+=`<div class="block-unit removed"></div>`;}
      else html+=`<div class="block-unit"></div>`;
    }
    html+=`</div><div class="blocks-eq">Tiramos ${b} → sobram <strong style="color:#2E7D32">${result}</strong> ✅</div>`;
  }
  return html+'</div>';
}

function buildSteps(a,b,op){
  const answer=op==='+'?a+b:a-b;
  let steps=[];
  if(op==='+'){
    if(answer<=10){
      steps=[`Começa com <strong>${a}</strong>.`,`Conta mais <strong>${b}</strong>: ${Array.from({length:b},(_,i)=>a+i+1).join(', ')}`,`Chegou em <strong>${answer}</strong>! 🎉`];
    } else {
      const toTen=10-a,left=b-toTen;
      if(toTen>0&&left>0)
        steps=[`Começa com <strong>${a}</strong>.`,`Para chegar em 10, faltam <strong>${toTen}</strong>.`,`Tira <strong>${toTen}</strong> do <strong>${b}</strong>: sobram <strong>${left}</strong>.`,`10 + <strong>${left}</strong> = <strong>${answer}</strong> ✅`];
      else
        steps=[`Começa com <strong>${a}</strong>.`,`Soma <strong>${b}</strong>: ${a} + ${b} = <strong>${answer}</strong> ✅`];
    }
  } else {
    if(a<=10){
      steps=[`Começa com <strong>${a}</strong>.`,`Conta para trás <strong>${b}</strong>: ${Array.from({length:b},(_,i)=>a-i-1).join(', ')}`,`Chegou em <strong>${answer}</strong>! 🎉`];
    } else {
      const unitsA=a%10;
      if(b>unitsA&&unitsA>0){
        const step1=a-unitsA,left=b-unitsA;
        steps=[`Começa com <strong>${a}</strong>.`,`Tira as <strong>${unitsA}</strong> unidades → chega em <strong>${step1}</strong>.`,`Ainda falta tirar <strong>${left}</strong>: ${step1} − ${left} = <strong>${answer}</strong>`,`Resultado: <strong>${answer}</strong> ✅`];
      } else {
        steps=[`Começa com <strong>${a}</strong>.`,`Subtrai <strong>${b}</strong>: ${a} − ${b} = <strong>${answer}</strong> ✅`];
      }
    }
  }
  return '<ul class="steps-list">'+steps.map((s,i)=>`<li><div class="step-num">${i+1}</div><span>${s}</span></li>`).join('')+'</ul>';
}

function generateExplanation(a,b,op){
  const answer=op==='+'?a+b:a-b;
  const title=op==='+'?`🧮 Como somar ${a} + ${b}:`:`🧮 Como subtrair ${a} − ${b}:`;
  let body='';
  if(a<=15&&b<=15) body+=buildDotVisual(a,b,op);
  body+=buildNumberLine(a,b,op);
  if(a>=10||answer>=10){
    body+=`<div style="margin:10px 0 4px;font-size:13px;font-weight:800;color:#455A64">Veja com blocos de dezena e unidade:</div>`;
    body+=buildBlocksVisual(a,b,op);
  }
  body+=`<div style="margin:10px 0 4px;font-size:13px;font-weight:800;color:#455A64">Passo a passo:</div>`;
  body+=buildSteps(a,b,op);
  return {title,body};
}

// ── STATE ──────────────────────────────────────────────────────────────────
let currentQ=0,score=0,correctCount=0,wrongCount=0,selectedOption=null,answered=false;
let QUESTIONS=generateQuestions();

function startGame(){
  document.getElementById('welcome-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  currentQ=0;score=0;correctCount=0;wrongCount=0;
  renderQuestion();
}
function restartGame(){
  document.getElementById('finish-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  currentQ=0;score=0;correctCount=0;wrongCount=0;
  QUESTIONS=generateQuestions();
  renderQuestion();
}

// ── RENDER ─────────────────────────────────────────────────────────────────
function renderQuestion(){
  const q=QUESTIONS[currentQ];
  answered=false; selectedOption=null;

  document.getElementById('progress-fill').style.width=(currentQ/QUESTIONS.length*100)+'%';
  document.getElementById('q-counter').textContent=(currentQ+1)+' / '+QUESTIONS.length;
  document.getElementById('score-display').textContent=score;

  const banner=document.getElementById('section-banner');
  if(q.section){banner.textContent=q.section;banner.classList.add('visible');}
  else banner.classList.remove('visible');

  document.getElementById('q-emoji').textContent=q.emoji;

  const badge=document.getElementById('type-badge');
  if(q.type==='story'){badge.textContent='📖 Problema';badge.className='type-badge story';}
  else if(q.type==='missing'){badge.textContent='❓ Número Faltando';badge.className='type-badge missing';}
  else{badge.className='type-badge normal';}

  const storyEl=document.getElementById('q-story');
  if(q.type==='story'&&q.story){storyEl.innerHTML=q.story;storyEl.classList.add('visible');}
  else{storyEl.innerHTML='';storyEl.classList.remove('visible');}

  document.getElementById('q-context').textContent=q.type==='story'?'':q.context||'';

  const realAnswer=q.op==='+'?q.a+q.b:q.a-q.b;
  const answerForOptions=q.type==='missing'?q.answer:realAnswer;

  const mathEl=document.getElementById('q-math');
  if(q.type==='story'){
    mathEl.style.display='none';
  } else {
    mathEl.style.display='';
    buildMathDisplay(q, realAnswer);
  }

  const vh=document.getElementById('visual-helper');
  vh.innerHTML='';
  if(q.visual&&q.type==='normal'){
    if(q.op==='+'){
      for(let i=0;i<q.a;i++){const d=document.createElement('div');d.className='dot dot-blue';d.textContent='●';vh.appendChild(d);}
      const sep=document.createElement('span');sep.style.cssText='font-size:18px;font-weight:900;color:#AB47BC;align-self:center';sep.textContent='+';vh.appendChild(sep);
      for(let i=0;i<q.b;i++){const d=document.createElement('div');d.className='dot dot-yellow';d.textContent='●';vh.appendChild(d);}
    } else {
      for(let i=0;i<q.a;i++){const d=document.createElement('div');d.className=`dot ${i>=q.a-q.b?'dot-red':'dot-blue'}`;d.textContent='●';vh.appendChild(d);}
    }
  }

  const opts=generateOptions(answerForOptions);
  const grid=document.getElementById('options-grid');
  grid.innerHTML='';
  opts.forEach(opt=>{
    const btn=document.createElement('button');btn.className='opt-btn';
    btn.textContent=opt;btn.dataset.value=opt;
    btn.onclick=()=>selectOption(btn,opt);
    grid.appendChild(btn);
  });

  const fb=document.getElementById('feedback-box');
  fb.className='feedback-box';fb.textContent='';
  const ep=document.getElementById('explanation-panel');
  ep.classList.remove('visible');ep.style.display='none';
  document.getElementById('exp-title').innerHTML='';
  document.getElementById('exp-body').innerHTML='';
  document.getElementById('btn-check').style.display='inline-block';
  document.getElementById('btn-check').disabled=true;
  document.getElementById('btn-next').style.display='none';
}

function buildMathDisplay(q, realAnswer){
  const mathEl=document.getElementById('q-math');
  if(q.type==='missing'){
    const blankHtml=`<span class="blank" id="blank-val">&nbsp;&nbsp;&nbsp;</span>`;
    const shownResult=`<span class="result-shown">${realAnswer}</span>`;
    if(q.blankPos==='a'){
      mathEl.innerHTML=`${blankHtml} <span class="op">${q.op}</span> ${q.b} <span class="op">=</span> ${shownResult}`;
    } else {
      mathEl.innerHTML=`${q.a} <span class="op">${q.op}</span> ${blankHtml} <span class="op">=</span> ${shownResult}`;
    }
  } else {
    mathEl.innerHTML=`${q.a} <span class="op">${q.op}</span> ${q.b} <span class="op">=</span> <span class="blank" id="blank-val">&nbsp;&nbsp;&nbsp;</span>`;
  }
}

function generateOptions(answer){
  const set=new Set([answer]);
  const d=[answer+1,answer-1,answer+2,answer-2,answer+3,answer-3,answer+4,answer-4].filter(n=>n>=0&&n!==answer);
  shuffle(d).slice(0,3).forEach(n=>set.add(n));
  return shuffle([...set]);
}

function selectOption(btn,val){
  if(answered)return;
  selectedOption=val;
  document.querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('btn-check').disabled=false;
}

// ── CHECK ANSWER ───────────────────────────────────────────────────────────
function checkAnswer(){
  if(answered||selectedOption===null)return;
  answered=true;

  const q=QUESTIONS[currentQ];
  const realAnswer=q.op==='+'?q.a+q.b:q.a-q.b;
  const correctAnswer=q.type==='missing'?q.answer:realAnswer;
  const isCorrect=parseInt(selectedOption)===correctAnswer;

  const blankEl=document.getElementById('blank-val');
  if(blankEl) blankEl.textContent=correctAnswer;

  document.querySelectorAll('.opt-btn').forEach(btn=>{
    btn.disabled=true;
    const v=parseInt(btn.dataset.value);
    if(v===correctAnswer)btn.classList.add('correct');
    else if(v===parseInt(selectedOption)&&!isCorrect)btn.classList.add('wrong');
  });

  const fb=document.getElementById('feedback-box');
  if(isCorrect){
    score+=10;correctCount++;
    document.getElementById('score-display').textContent=score;
    const msgs=['🎉 Arrasou! Resposta certa!','⭐ Incrível! Você é ótimo nisso!','🚀 Show de bola, Gabriel!','✅ Isso mesmo! Parabéns!','🌟 Perfeito! Continue assim!','🔥 Demais! Você mandou muito bem!'];
    fb.textContent=pick(msgs);fb.className='feedback-box correct';
    miniConfetti(4);
  } else {
    wrongCount++;
    let wrongMsg='Quase lá! 💪 ';
    if(q.type==='missing'){
      wrongMsg+=`O número faltando era <strong>${correctAnswer}</strong>. Veja como descobrir:`;
    } else if(q.type==='story'){
      wrongMsg+=`A resposta certa era <strong>${correctAnswer}</strong>. A conta era ${q.a} ${q.op} ${q.b} = ${correctAnswer}. Veja como:`;
    } else {
      wrongMsg+=`A resposta certa era <strong>${correctAnswer}</strong>. Veja como chegar lá:`;
    }
    fb.innerHTML=wrongMsg;fb.className='feedback-box wrong';

    const exp=generateExplanation(q.a,q.b,q.op);
    document.getElementById('exp-title').innerHTML=exp.title;
    document.getElementById('exp-body').innerHTML=exp.body;
    const ep=document.getElementById('explanation-panel');
    ep.style.display='block';ep.classList.add('visible');
  }

  document.getElementById('btn-check').style.display='none';
  document.getElementById('btn-next').style.display='inline-block';
}

function nextQuestion(){
  currentQ++;
  if(currentQ>=QUESTIONS.length)showFinish();
  else renderQuestion();
}

// ── FINISH ─────────────────────────────────────────────────────────────────
function showFinish(){
  document.getElementById('game-screen').classList.remove('active');
  document.getElementById('finish-screen').classList.add('active');
  const pct=correctCount/QUESTIONS.length;
  document.getElementById('final-score-num').textContent=score;
  document.getElementById('res-correct').textContent=correctCount;
  document.getElementById('res-wrong').textContent=wrongCount;
  document.getElementById('res-total').textContent=QUESTIONS.length;
  let trophy,title,subtitle,stars,msg;
  if(pct>=.9){trophy='🏆';title='Uau, Gabriel!';stars='⭐⭐⭐';subtitle='Você é um gênio da matemática!';msg='Que resultado incrível! Você acertou quase tudo! 🚀 Com esse cérebro brilhante, você vai voar pelo espaço um dia! Continue estudando assim e o universo inteiro vai ser seu!';confettiBurst(60);}
  else if(pct>=.7){trophy='🥇';title='Muito bem, Gabriel!';stars='⭐⭐✨';subtitle='Você foi super bem!';msg='Que orgulho! 🎉 Você acertou a maior parte das questões e mostrou que já sabe muito de matemática! Algumas foram difíceis, mas você enfrentou todas com coragem. Continue praticando!';confettiBurst(35);}
  else if(pct>=.5){trophy='🥈';title='Boa, Gabriel!';stars='⭐✨✨';subtitle='Você está no caminho certo!';msg='Parabéns pela coragem de tentar todas as questões! 💪 A matemática melhora com prática, como um super-herói que treina todos os dias. Você já sabe bastante coisa e vai melhorar ainda mais!';confettiBurst(20);}
  else{trophy='🌟';title='Gabriel, você é bravo!';stars='✨✨✨';subtitle='Tentar já é uma vitória!';msg='Ei, você sabia que todo astronauta precisa treinar muito antes de ir ao espaço? 🚀 Foi exatamente isso que você fez hoje: treinou! Cada erro é um aprendizado. Tente novamente e veja como vai melhorar. Você é incrível!';confettiBurst(15);}
  document.getElementById('finish-trophy').textContent=trophy;
  document.getElementById('finish-title').textContent=title;
  document.getElementById('finish-subtitle').textContent=subtitle;
  document.getElementById('finish-stars').textContent=stars;
  document.getElementById('finish-msg').textContent=msg;
}

// ── CONFETTI ───────────────────────────────────────────────────────────────
function miniConfetti(n){
  const wrap=document.getElementById('confetti-wrap');
  const colors=['#FFD54F','#EF5350','#66BB6A','#42A5F5','#AB47BC','#FF7043','#26C6DA'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div');c.className='confetti-piece';
    c.style.cssText=`left:${20+Math.random()*60}%;background:${pick(colors)};width:${8+Math.random()*8}px;height:${10+Math.random()*10}px;animation-duration:${1.5+Math.random()}s;animation-delay:${Math.random()*.3}s;border-radius:${Math.random()>.5?'50%':'3px'}`;
    wrap.appendChild(c);setTimeout(()=>c.remove(),2500);
  }
}
function confettiBurst(n){
  const wrap=document.getElementById('confetti-wrap');
  const colors=['#FFD54F','#EF5350','#66BB6A','#42A5F5','#AB47BC','#FF7043','#26C6DA','#EC407A'];
  for(let i=0;i<n;i++){
    setTimeout(()=>{
      const c=document.createElement('div');c.className='confetti-piece';
      c.style.cssText=`left:${Math.random()*100}%;background:${pick(colors)};width:${8+Math.random()*12}px;height:${10+Math.random()*14}px;animation-duration:${2+Math.random()*2}s;border-radius:${Math.random()>.5?'50%':'3px'};transform:rotate(${Math.random()*360}deg)`;
      wrap.appendChild(c);setTimeout(()=>c.remove(),5000);
    },i*60);
  }
}
