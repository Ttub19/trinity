/* floating owl button (id="aibar"): tap opens the chat page, drag moves it, release tucks it half into the nearest side.
   While tucked, the first tap slides it out and the next tap opens the chat; it tucks itself back after a few seconds.
   Position is kept in this browser. Arrow keys move it too, so it never needs a drag. */
(function(){
  const fab = document.getElementById('aibar');
  const screen = document.querySelector('.screen');
  if (!fab || !screen) return;
  const KEY = 'owly.fab', SIZE = 60, EDGE = 10;
  let pos = {side:'right', y:1, tuck:false};
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && (s.side === 'left' || s.side === 'right') && s.y >= 0 && s.y <= 1) pos = {side:s.side, y:s.y, tuck:!!s.tuck}; } catch(e){}
  let peek = false, peekT = 0;

  function bounds(){
    const W = screen.clientWidth, H = screen.clientHeight;
    const sb = screen.querySelector('.statusbar'), tb = screen.querySelector('.tabbar');
    const top = (sb && sb.offsetHeight ? sb.offsetTop + sb.offsetHeight : 0) + 12;
    const bottom = (tb && tb.offsetHeight ? tb.offsetTop : H) - SIZE - 12;
    return {W, top, bottom: Math.max(bottom, top)};
  }
  function setXY(x, y){ fab.style.setProperty('--fx', x + 'px'); fab.style.setProperty('--fy', y + 'px'); }
  function place(){
    const b = bounds(), tucked = pos.tuck && !peek, left = pos.side === 'left';
    const x = tucked ? (left ? -SIZE / 2 : b.W - SIZE / 2) : (left ? EDGE : b.W - SIZE - EDGE);
    fab.classList.toggle('tucked', tucked); fab.dataset.side = pos.side;
    setXY(x, b.top + pos.y * (b.bottom - b.top));
  }
  function setPeek(on, ms){
    clearTimeout(peekT);
    if (on){ peek = true; fab.classList.add('snap'); place(); }
    if (pos.tuck) peekT = setTimeout(() => { if (drag) return; peek = false; fab.classList.add('snap'); place(); }, on ? (ms || 4000) : 0);
  }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch(e){} }

  let drag = null, justDragged = false;
  fab.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const r = fab.getBoundingClientRect();
    drag = {id:e.pointerId, sx:e.clientX, sy:e.clientY, ox:e.clientX - r.left, oy:e.clientY - r.top, moved:false};
    fab.setPointerCapture(e.pointerId);
  });
  fab.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
    if (!drag.moved){ drag.moved = true; clearTimeout(peekT); fab.classList.remove('snap', 'tucked'); fab.classList.add('drag'); }
    const sr = screen.getBoundingClientRect(), b = bounds();
    const x = Math.min(Math.max(e.clientX - sr.left - drag.ox, 0), b.W - SIZE);
    const y = Math.min(Math.max(e.clientY - sr.top - drag.oy, b.top), b.bottom);
    setXY(x, y);
  });
  function end(e){
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved; drag = null;
    fab.classList.remove('drag');
    if (!moved) return;
    justDragged = true; setTimeout(() => { justDragged = false; }, 50);
    const sr = screen.getBoundingClientRect(), r = fab.getBoundingClientRect(), b = bounds();
    pos.side = (r.left + SIZE / 2 - sr.left) < b.W / 2 ? 'left' : 'right';
    pos.y = b.bottom > b.top ? Math.min(Math.max((r.top - sr.top - b.top) / (b.bottom - b.top), 0), 1) : 0;
    pos.tuck = true; peek = false;
    fab.classList.add('snap'); place(); save();
  }
  fab.addEventListener('pointerup', end);
  fab.addEventListener('pointercancel', end);
  /* a drag must not also open the chat: stop the click before the chat's own listener sees it */
  screen.addEventListener('click', e => {
    if (!fab.contains(e.target)) return;
    if (justDragged){ e.stopPropagation(); e.preventDefault(); justDragged = false; return; }
    /* tucked: the first tap only slides the owl out */
    if (fab.classList.contains('tucked')){ e.stopPropagation(); e.preventDefault(); setPeek(true); }
  }, true);
  /* keyboard users get the whole owl as soon as it has focus, so Enter opens the chat straight away */
  fab.addEventListener('focus', () => { if (fab.matches(':focus-visible')) setPeek(true, 60000); });
  fab.addEventListener('blur', () => { if (peek) setPeek(true, 600); });
  fab.addEventListener('dragstart', e => e.preventDefault());

  fab.addEventListener('keydown', e => {
    const k = e.key; if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k)) return;
    e.preventDefault();
    if (k === 'ArrowLeft') pos.side = 'left';
    if (k === 'ArrowRight') pos.side = 'right';
    if (k === 'ArrowUp') pos.y = Math.max(0, pos.y - 0.1);
    if (k === 'ArrowDown') pos.y = Math.min(1, pos.y + 0.1);
    fab.classList.add('snap'); place(); save();
  });

  place();
  if ('ResizeObserver' in window) new ResizeObserver(() => { fab.classList.remove('snap'); place(); }).observe(screen);
  else window.addEventListener('resize', place);

  /* after every screen change: re-place the owl (the tab bar can change height) and keep sideways tab rows readable */
  function afterRender(){
    if (!fab.hidden) place();
    document.querySelectorAll('.seg.scroll .track').forEach(tr => {
      const upd = () => tr.classList.toggle('at-end', tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4);
      upd(); tr.addEventListener('scroll', upd, {passive:true});
      const sel = tr.querySelector('[aria-selected="true"]');
      if (sel && (sel.offsetLeft < tr.scrollLeft || sel.offsetLeft + sel.offsetWidth > tr.scrollLeft + tr.clientWidth)) tr.scrollLeft = sel.offsetLeft - 12;
    });
  }
  const base = rerender;
  rerender = function(){ const r = base.apply(this, arguments); afterRender(); return r; };
  afterRender();
})();
