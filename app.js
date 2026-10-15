import {START,END,stores,benefits,validDate,koreaToday,eligibility,thresholdResult} from './eligibility.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const query=new URLSearchParams(location.search),today=koreaToday();let stored='';try{stored=localStorage.getItem('goraeit-store')||'';}catch{}
const state={store:stores[query.get('store')]?query.get('store'):(stores[stored]?stored:''),date:validDate(query.get('date'))?query.get('date'):today<START?START:today>END?END:today,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(query.get('time')||'')?query.get('time'):'',remembered:new Set((query.get('benefit')||'').split(',').filter(id=>benefits[id]))};
let activeBenefit='',calcType='weekend',toastTimer;const toast=t=>{const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);};
function render(){
 $$('[data-store]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.store===state.store)));
 $('#visit-date').value=state.date;$('#visit-time').value=state.time;
 const dateText=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short',timeZone:'Asia/Seoul'}).format(new Date(state.date+'T12:00:00+09:00'));
 $('#selection-status').textContent=state.store?`${stores[state.store]} · ${dateText}${state.time?' '+state.time:''} 방문 계획이에요. ${state.time?'상품·영수증 조건은 별도로 확인해 주세요.':'시간을 선택하면 시간제 혜택도 확인할 수 있어요.'}`:'먼저 매장을 골라 주세요. 네 가지 혜택을 아래에서 모두 살펴볼 수 있어요.';
 $$('[data-status]').forEach(el=>{const status=eligibility(el.dataset.status,state);el.textContent=(status.match?'✓ ':'')+status.text;});
 $('#plan-store').textContent=stores[state.store]||'어느 매장에서 만날까요?';$('#plan-date').textContent=`${dateText}${state.time?' · '+state.time:' · 방문 시간 미정'}`;
 const box=$('#plan-benefits');box.replaceChildren();if(state.remembered.size){for(const id of state.remembered){const p=document.createElement('p');p.textContent='♡ '+benefits[id].title+' — '+eligibility(id,state).text;box.append(p);}}else{const p=document.createElement('p');p.textContent='혜택 상세에서 ♡를 누르면 여기에 모아드려요.';box.append(p);}
 $('#whale-message').textContent=state.store==='river'?'리버점이라면, 퇴근길 혜택도 만나봐요!':state.store?'좋아요! 우리 매장 혜택을 찾아볼까요?':'이번 달도, 잘 먹고 잘 아껴요!';
}
$$('[data-store]').forEach(b=>b.addEventListener('click',()=>{state.store=b.dataset.store;try{localStorage.setItem('goraeit-store',state.store);}catch{}render();}));
$('#visit-date').addEventListener('change',e=>{if(!validDate(e.target.value)){e.target.setCustomValidity('11월 2일부터 29일 사이를 선택해 주세요.');e.target.reportValidity();e.target.value=state.date;}else{e.target.setCustomValidity('');state.date=e.target.value;render();}});
$('#visit-time').addEventListener('change',e=>{state.time=e.target.value;render();});
$$('[data-detail]').forEach(b=>b.addEventListener('click',()=>{activeBenefit=b.dataset.detail;const item=benefits[activeBenefit];$('#detail-title').textContent=item.title;$('#detail-eyebrow').textContent=item.eyebrow;const ul=document.createElement('ul');for(const text of item.conditions){const li=document.createElement('li');li.textContent=text;ul.append(li);}$('#detail-body').replaceChildren(ul);rememberLabel();$('#detail-dialog').showModal();}));
function rememberLabel(){$('#remember').textContent=state.remembered.has(activeBenefit)?'기억한 혜택에서 빼기 ♥':'이 혜택 기억하기 ♡';}
$('#remember').addEventListener('click',()=>{if(state.remembered.has(activeBenefit)){state.remembered.delete(activeBenefit);toast('방문 메모에서 뺐어요.');}else{state.remembered.add(activeBenefit);toast('내 장보기 계획에 기억했어요!');}rememberLabel();render();});
$$('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
$('#poster-open').addEventListener('click',()=>$('#poster-dialog').showModal());
function calculate(){const raw=$('#amount').value.replaceAll(',','');if(!raw){$('#calc-result').textContent='금액을 입력하면 기준을 확인할 수 있어요.';$('#progress').style.width='0%';return;}const r=thresholdResult(calcType,raw);$('#calc-result').textContent=r.text+(r.valid&&calcType==='weekend'?' (금~일 방문 기준)':'');$('#progress').style.width=(r.ratio*100)+'%';$('#amount').setAttribute('aria-invalid',String(!r.valid));}
$$('[data-calc]').forEach(b=>b.addEventListener('click',()=>{calcType=b.dataset.calc;$$('[data-calc]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$('#amount-label').textContent=calcType==='weekend'?'다른 상품 할인 적용 후 금액':'행사 신선식품 구매 금액';$('#amount').placeholder=calcType==='weekend'?'35,000':'10,000';calculate();}));$('#amount').addEventListener('input',calculate);
$('#share').addEventListener('click',async()=>{if(!state.store){toast('먼저 방문할 매장을 골라 주세요.');$('#benefits').scrollIntoView();$('[data-store]').focus();return;}const url=new URL(location.href);url.hash='plan';url.search='';url.searchParams.set('store',state.store);url.searchParams.set('date',state.date);if(state.time)url.searchParams.set('time',state.time);if(state.remembered.size)url.searchParams.set('benefit',[...state.remembered].join(','));const data={title:'고래잇! 내 장보기 계획',text:`${stores[state.store]}에서 오늘도 맛있게, 알뜰하게!`,url:url.href};try{if(navigator.share){await navigator.share(data);$('#share-status').textContent='공유했어요.';}else{await navigator.clipboard.writeText(url.href);$('#share-status').textContent='방문 계획 링크를 복사했어요!';}}catch(e){if(e.name==='AbortError')return;$('#share-status').textContent='아래 링크를 선택해 복사해 주세요: '+url.href;}});
$('#whale').addEventListener('click',()=>{const b=$('#whale');b.classList.add('hello');$('#whale-message').textContent='반가워요! 맛있는 하루 보내요 ♡';setTimeout(()=>b.classList.remove('hello'),500);});
if('IntersectionObserver'in window){new IntersectionObserver(entries=>entries.forEach(e=>$('#whale').classList.toggle('paused',!e.isIntersecting))).observe($('#whale'));}
$('#campaign-state').textContent=today<START?'11월 2일부터 시작해요. 지금은 장보기 계획을 세워보세요.':today>END?'이번 행사는 종료되었어요. 지난 행사 내용을 확인할 수 있어요.':'11월 장보기 행사가 진행 중이에요.';
if(today>END)$('.hero .button').firstChild.textContent='행사 내용 보기 ';
render();
