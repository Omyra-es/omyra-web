// Interfaz de la calculadora: lee los campos, valida, llama a las fórmulas y pinta resultados.
import { analyze, monthlyGoal, totalMinutes, type Mode, type PromoType } from './formulas';
import { eur, pct1, pctFloor, duration, hours, int, parseNum } from './format';
import { BF_END, DEFAULTS, LIMITS, STORAGE_KEY, type CalcState } from './config';
import { track as px } from '../track';

const root = document.getElementById('calculadora');
if (root) init(root);

function init(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('#calc')!;
  const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
  const outs = (k: string) => document.querySelectorAll<HTMLElement>(`[data-r="${k}"]`);
  const put = (k: string, v: string, html = false) => outs(k).forEach((el) => (html ? (el.innerHTML = v) : (el.textContent = v)));
  const inputs = [...form.querySelectorAll<HTMLInputElement>('input[data-key]')];
  const byKey = (k: string) => inputs.find((i) => i.dataset.key === k)!;
  const vatSwitch = $<HTMLButtonElement>('#f-incvat')!;
  const range = $<HTMLInputElement>('#f-range')!;
  const bar = $<HTMLButtonElement>('#bar')!;

  // Black Friday: se oculta solo a partir de la fecha de fin.
  const bfOn = Date.now() < BF_END.getTime();
  if (!bfOn) document.querySelectorAll('[data-bf]').forEach((el) => el.remove());

  // ---- Estado ----
  const state: CalcState = { ...DEFAULTS, mode: 'promocion' };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') for (const k of Object.keys(DEFAULTS)) if (k in saved) (state as any)[k] = saved[k];
  } catch { /* sin almacenamiento */ }
  const q = new URLSearchParams(location.search).get('modo');
  if (q === 'precios' || q === 'promocion') state.mode = q;
  else if (location.pathname.includes('black-friday')) state.mode = 'promocion';

  const save = () => {
    try { const { mode, ...rest } = state; localStorage.setItem(STORAGE_KEY, JSON.stringify(rest)); } catch { /* nada */ }
  };
  const fmtInput = (n: number) => (Number.isInteger(n) ? int(n) : String(+n.toFixed(2)).replace('.', ','));

  function fillInputs() {
    for (const i of inputs) {
      const k = i.dataset.key!;
      const val = (state as any)[k];
      i.value = k === 'name' ? val : fmtInput(val);
      i.removeAttribute('aria-invalid');
      const e = document.getElementById(`e-${k}`); if (e) e.hidden = true;
    }
    vatSwitch.setAttribute('aria-checked', String(state.includesVat));
    range.value = String(Math.min(60, Math.round(state.pct / 5) * 5));
    setMode(state.mode, false);
    setPromo(state.promoType, false);
    syncChips();
  }

  // ---- Validación ----
  const invalid = new Set<string>();
  function readField(i: HTMLInputElement, showError: boolean) {
    const k = i.dataset.key!;
    if (k === 'name') { state.name = i.value.slice(0, 60); return; }
    const n = parseNum(i.value);
    const [min, maxRaw, msg] = LIMITS[k];
    const max = k === 'eur' || k === 'fixed' ? state.price : maxRaw;
    const err = document.getElementById(`e-${k}`);
    let bad = !Number.isFinite(n) || n < min;
    let text = msg;
    if (!bad && n > max) {
      if (k === 'eur' || k === 'fixed') {
        // No puede superar el precio habitual: se limita y se avisa.
        (state as any)[k] = max;
        if (showError) { i.value = fmtInput(max); if (err) { err.textContent = 'No puede superar tu precio habitual: lo hemos ajustado.'; err.hidden = false; } }
        invalid.delete(k);
        return;
      }
      bad = true;
    }
    if (k === 'price' && !Number.isFinite(n)) text = 'Escribe un precio mayor que 0';
    if (bad) {
      invalid.add(k);
      if (showError) { i.setAttribute('aria-invalid', 'true'); if (err) { err.textContent = text; err.hidden = false; } }
      return;
    }
    invalid.delete(k);
    (state as any)[k] = n;
    i.removeAttribute('aria-invalid');
    if (err && (showError || !err.hidden)) err.hidden = true;
  }

  // ---- Modo y tipo de promoción ----
  function setMode(m: Mode, doSave = true) {
    state.mode = m;
    root.dataset.mode = m;
    form.querySelectorAll<HTMLInputElement>('input[name="mode"]').forEach((r) => (r.checked = r.value === m));
    document.querySelectorAll<HTMLElement>('[data-only]').forEach((el) => (el.hidden = el.dataset.only !== m));
    if (doSave) render();
  }
  function setPromo(t: PromoType, doSave = true) {
    state.promoType = t;
    form.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((b) => {
      const on = b.dataset.promo === t;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')!)!.hidden = !on;
    });
    if (doSave) render();
  }
  function syncChips() {
    form.querySelectorAll<HTMLButtonElement>('[data-vat]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.vat) === state.vatPct)));
    form.querySelectorAll<HTMLButtonElement>('[data-pct]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.pct) === state.pct)));
  }

  // ---- Pintar ----
  function render() {
    syncChips();
    save();
    const name = state.name.trim() || 'Tu servicio';
    const s = { price: state.price, includesVat: state.includesVat, vatRate: state.vatPct / 100, prepMin: state.prepMin, serviceMin: state.serviceMin, cleanMin: state.cleanMin, adminMin: state.adminMin };
    const c = { materials: state.materials, consumables: state.consumables, otherVariable: state.otherVariable, fixedMonthly: state.fixedMonthly, servicesPerMonth: state.servicesPerMonth, hourlyTarget: state.hourlyTarget };
    const p = { type: state.promoType, pct: state.pct / 100, eur: state.eur, fixed: state.fixed };
    const vatTag = state.includesVat ? 'con IVA' : 'sin IVA';
    put('vatNote', `(${vatTag})`);

    // Paso 1: tiempo (solo depende de los minutos)
    const timeKeys = ['prepMin', 'serviceMin', 'cleanMin', 'adminMin'];
    const timeOk = timeKeys.every((k) => !invalid.has(k));
    const mins = totalMinutes(s);
    put('totalTime', timeOk ? duration(mins) : '—');
    outs('timeTip').forEach((el) => (el.hidden = !timeOk || mins <= s.serviceMin * 1.2));

    const costOk = ['materials', 'consumables', 'otherVariable', 'fixedMonthly', 'servicesPerMonth'].every((k) => !invalid.has(k));
    const anyBad = invalid.size > 0;
    const a = analyze(state.mode, s, c, p);
    put('cv', costOk ? eur(a.cv) : '—');
    put('gf', costOk ? eur(a.gf) : '—');
    put('ca', costOk ? eur(a.ca) : '—');
    put('targetLabel', `objetivo ${eur(c.hourlyTarget).replace(',00', '')}/h`);
    put('targetLabelP', `objetivo ${eur(c.hourlyTarget).replace(',00', '')}/h`);

    const dash = (k: string[]) => k.forEach((x) => put(x, '—'));
    const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    put('date', dateStr);
    const promoLabel = state.promoType === 'pct' ? `PROMOCIÓN DEL ${int(state.pct)}\u00a0%` : state.promoType === 'eur' ? `PROMOCIÓN DE ${eur(state.eur)} MENOS` : `PROMOCIÓN A ${eur(state.fixed)}`;
    put('reportSub', `${name.toUpperCase()} · ${state.mode === 'promocion' ? promoLabel : 'REVISIÓN DE PRECIO'}`);

    if (anyBad) {
      dash(['priceShown', 'promoShown', 'available', 'perHour', 'perHourP', 'availableP', 'minNet', 'minGross', 'goalAppts', 'goalHours', 'rTime', 'rPrice', 'rPromo', 'rTarget', 'rEffective', 'rMax', 'rMinNet', 'rMinGross']);
      ['priceNet', 'promoNet', 'diffMsg', 'extra', 'maxMsg', 'slot', 'meaning', 'surplusMsg'].forEach((k) => put(k, ''));
      put('status', 'Revisa los datos marcados');
      outs('status').forEach((el) => (el.dataset.s = 'below'));
      put('barText', 'Revisa los datos marcados');
      outs('hoursWarn').forEach((el) => (el.hidden = true));
      return;
    }

    const showP = (gross: number, net: number) => (state.includesVat ? [eur(gross), `${eur(net)} sin IVA`] : [eur(gross), `${eur(net * (1 + s.vatRate))} con IVA`]);
    const [pr, prN] = showP(s.price, a.netPrice);
    put('priceShown', pr); put('priceNet', prN);
    const [pp, ppN] = showP(a.saleShown, a.saleNet);
    put('promoShown', pp); put('promoNet', ppN);
    put('available', eur(a.available));
    put('perHour', eur(a.availablePerHour));
    const target = `${eur(c.hourlyTarget).replace(',00', '')}/h`;

    // Estado y diferencia
    const statusText = { above: 'Por encima de tu objetivo', on: 'En tu objetivo', below: 'Por debajo de tu objetivo' }[a.status];
    put('status', statusText);
    outs('status').forEach((el) => (el.dataset.s = a.status));
    put('diffMsg', a.status === 'below'
      ? `Con este descuento, te quedarían <b>${eur(-a.diffVsTarget)}</b> menos por servicio de lo necesario para alcanzar tu objetivo de ${target}.`
      : a.status === 'on' ? 'Con este descuento te quedas justo en tu objetivo.'
      : `Con este descuento sigues <b>${eur(a.diffVsTarget)}</b> por encima de tu objetivo.`, true);

    // Citas más necesarias
    if (a.extraAppointmentsPct === null) put('extra', '<b>Con este precio no cubres ni el material.</b>', true);
    else if (a.extraAppointmentsPct < 0.05) put('extra', 'Ninguna: con este precio no necesitas más citas para quedarte con lo mismo.');
    else put('extra', `<b>${pct1(a.extraAppointmentsPct)} más.</b> Por cada 10 citas a precio normal, necesitarías unas ${Math.ceil(10 * (1 + a.extraAppointmentsPct / 100) - 1e-9)} con la promoción para quedarte con lo mismo después de costes variables.`, true);

    // Descuento máximo
    outs('maxMsg').forEach((el) => (el.dataset.s = a.priceBelowMin ? 'below' : 'ok'));
    put('maxMsg', a.priceBelowMin
      ? 'Con tu precio actual ya estás por debajo de tu objetivo: antes de hacer descuentos, revisa tu precio.'
      : `Puedes descontar hasta un <b>${pctFloor(a.maxDiscount)}</b> sin bajar de tu objetivo.`, true);
    put('slot', `Cada hueco que queda vacío es una oportunidad de <b>${eur(a.emptySlotValue)}</b> (después de costes variables) que no se aprovecha.`, true);

    // Modo precios
    put('perHourP', eur(a.availablePerHour));
    put('availableP', eur(a.available));
    put('minNet', eur(a.minNet)); put('minGross', eur(a.minGross));
    const goal = !invalid.has('monthly') ? monthlyGoal(a, state.monthly) : null;
    put('goalAppts', goal ? int(goal.appointments) : '—');
    put('goalHours', goal ? hours(goal.hours) : '—');
    outs('hoursWarn').forEach((el) => (el.hidden = !(goal && goal.hours > 160)));
    put('surplusMsg', a.diffVsTarget >= -0.005
      ? `Tu precio cubre tus costes y el valor de tu tiempo, y deja un excedente estimado de <b>${eur(Math.max(0, a.diffVsTarget))}</b> por servicio.`
      : `Tu precio no llega a cubrir tus costes y el valor de tu tiempo: te faltan <b>${eur(-a.diffVsTarget)}</b> por servicio. Tu precio mínimo orientativo es <b>${eur(a.minNet)}</b> (<b>${eur(a.minGross)}</b> con IVA).`, true);
    if (state.mode === 'precios' && !goal) put('goalAppts', '—');

    // Informe
    put('rTime', duration(mins));
    put('rPrice', `${eur(s.price)} ${vatTag}`);
    put('rPromo', `${eur(a.saleShown)} ${vatTag}`);
    put('rTarget', `${target} · ${eur(a.ro)} por servicio`);
    put('rEffective', `${eur(a.availablePerHour)}/h · ${eur(a.available)} por servicio`);
    put('rMax', a.priceBelowMin ? '0 % (revisa tu precio)' : pctFloor(a.maxDiscount));
    put('rMinNet', eur(a.minNet)); put('rMinGross', eur(a.minGross));

    let meaning: string;
    if (state.mode === 'precios') meaning = outs('surplusMsg')[0]?.textContent ?? '';
    else if (a.priceBelowMin) meaning = 'Tu precio actual ya está por debajo de tu precio mínimo orientativo. Antes de hacer descuentos, te recomendamos revisar tu precio.';
    else if (!a.coversVariable) meaning = 'Con este precio pierdes dinero en cada cita, aunque llenes un hueco vacío. Baja el descuento o cambia a un bono.';
    else if (a.status === 'below') meaning = 'Con el descuento elegido, el servicio queda por debajo del objetivo de remuneración que has definido. Puedes reducir el descuento, ofrecer la promoción solo en horarios de menor demanda o probar un complemento cuyo coste sea menor que el descuento que estabas planteando.';
    else meaning = 'Con este descuento sigues cubriendo tus costes y el valor de tu tiempo. Si además lo pones en tus horas flojas, llenas huecos sin regalar tu trabajo.';
    put('meaning', meaning);

    // Mensaje de WhatsApp (Black Friday)
    put('waMsg', `¡Hola, [nombre]! Esta semana tengo Black Friday: ${name} a ${eur(a.saleShown)} solo en estos huecos: [día y hora]. Plazas limitadas. ¿Te guardo uno? 💛`);

    // Barra inferior (móvil)
    put('barText', state.mode === 'promocion'
      ? `Disponible por hora: <b>${eur(a.availablePerHour)}</b> · Objetivo ${target}`
      : `Precio mínimo: <b>${eur(a.minNet)}</b> sin IVA`, true);
  }

  // ---- Eventos ----
  // Medición: «UsoCalculadora» una vez por visita a la página, cuando la persona cambia algún dato.
  let used = false;
  const markUse = () => { if (!used) { used = true; px('UsoCalculadora', { modo: state.mode }); } };
  form.addEventListener('change', markUse);
  form.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('[data-pct], [data-vat], [role="tab"], #f-incvat')) markUse(); });
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t === range) { byKey('pct').value = range.value; readField(byKey('pct'), false); }
    else if (t.dataset.key) {
      readField(t, false);
      if (t.dataset.key === 'pct' && !invalid.has('pct')) range.value = String(Math.min(60, Math.max(0, state.pct)));
      if (t.dataset.key === 'price') { readField(byKey('eur'), false); readField(byKey('fixed'), false); }
    }
    render();
  });
  form.addEventListener('focusout', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset?.key) { readField(t, true); render(); }
  });
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'mode') setMode(t.value as Mode);
  });
  vatSwitch.addEventListener('click', () => {
    state.includesVat = !state.includesVat;
    vatSwitch.setAttribute('aria-checked', String(state.includesVat));
    render();
  });
  form.querySelectorAll<HTMLButtonElement>('[data-vat]').forEach((b) => b.addEventListener('click', () => {
    state.vatPct = Number(b.dataset.vat); byKey('vatPct').value = b.dataset.vat!; readField(byKey('vatPct'), true); render();
  }));
  form.querySelectorAll<HTMLButtonElement>('[data-pct]').forEach((b) => b.addEventListener('click', () => {
    byKey('pct').value = b.dataset.pct!; range.value = b.dataset.pct!; readField(byKey('pct'), true); render();
  }));
  const tabs = [...form.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  tabs.forEach((b, idx) => {
    b.addEventListener('click', () => setPromo(b.dataset.promo as PromoType));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(idx + d + tabs.length) % tabs.length];
      n.focus(); setPromo(n.dataset.promo as PromoType);
    });
  });

  // Copiar
  async function copy(text: string, btn: HTMLButtonElement) {
    const label = btn.textContent;
    const done = () => { btn.textContent = '¡Copiado!'; setTimeout(() => (btn.textContent = label), 2000); };
    try { await navigator.clipboard.writeText(text); done(); return; } catch { /* sigue */ }
    const ta = $<HTMLTextAreaElement>('#copyFallback')!;
    ta.value = text; ta.classList.remove('sr-only'); ta.removeAttribute('aria-hidden');
    ta.style.cssText = 'width:100%;min-height:200px;border-radius:14px;padding:1rem;border:1.5px solid var(--green);margin-top:.6rem';
    ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
    try { if (document.execCommand('copy')) { ta.classList.add('sr-only'); ta.setAttribute('aria-hidden', 'true'); ta.style.cssText = ''; btn.focus(); done(); return; } } catch { /* nada */ }
    btn.textContent = 'Selecciona el texto y cópialo';
    setTimeout(() => (btn.textContent = label), 3000);
  }
  function reportText() {
    const txt = (k: string) => outs(k)[0]?.textContent?.trim() ?? '';
    const promo = state.mode === 'promocion';
    const lines = [
      'Tu análisis de rentabilidad',
      txt('reportSub'),
      '',
      `Tiempo invertido: ${txt('rTime')}`,
      `Precio habitual: ${txt('rPrice')}`,
      promo ? `Precio promocional: ${txt('rPromo')}` : '',
      `Objetivo de remuneración: ${txt('rTarget')}`,
      `Remuneración efectiva estimada: ${txt('rEffective')}`,
      promo ? `Descuento máximo orientativo: ${txt('rMax')}` : '',
      '',
      `Tu precio mínimo orientativo: ${txt('rMinNet')} sin IVA (${txt('rMinGross')} con IVA)`,
      '',
      `¿Qué significa para ti? ${txt('meaning')}`,
      '',
      'Simulación orientativa. No representa beneficio neto ni incluye impuestos sobre beneficios u otros costes que no se hayan introducido.',
      'Calculado con omyra.es/calculadora',
    ];
    return lines.filter((l, i, arr) => l !== '' || arr[i - 1] !== '').join('\n');
  }
  $<HTMLButtonElement>('#copyReport')!.addEventListener('click', (e) => copy(reportText(), e.currentTarget as HTMLButtonElement));
  $<HTMLButtonElement>('#copyWa')?.addEventListener('click', (e) => copy(outs('waMsg')[0]?.textContent ?? '', e.currentTarget as HTMLButtonElement));
  $<HTMLButtonElement>('#printReport')!.addEventListener('click', () => window.print());
  $<HTMLButtonElement>('#resetData')!.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* nada */ }
    const mode = state.mode;
    Object.assign(state, DEFAULTS, { mode });
    invalid.clear();
    fillInputs();
    render();
  });

  // Barra inferior: visible mientras rellena; se oculta cuando el informe está en pantalla.
  const report = $('#informe')!;
  const calcBox = form;
  let reportVisible = false, calcVisible = false;
  const updBar = () => (bar.hidden = reportVisible || !calcVisible);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { reportVisible = e.isIntersecting; updBar(); }, { threshold: 0.15 }).observe(report);
    new IntersectionObserver(([e]) => { calcVisible = e.isIntersecting; updBar(); }).observe(calcBox);
  }
  bar.addEventListener('click', () => report.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));


  // Móvil «En Omyra»: muestra la pantalla del paso que está rellenando.
  let omxActive = 1;
  const setOmx = (n: number) => {
    if (n === omxActive) return;
    omxActive = n;
    document.querySelectorAll<HTMLElement>('[data-omx]').forEach((el) => el.classList.toggle('on', el.dataset.omx === String(n)));
    document.querySelectorAll<HTMLElement>('[data-omx-t]').forEach((el) => el.classList.toggle('on', el.dataset.omxT === String(n)));
    document.querySelectorAll<HTMLElement>('[data-omx-d]').forEach((el) => el.classList.toggle('on', el.dataset.omxD === String(n)));
  };
  form.addEventListener('focusin', (e) => {
    const st = (e.target as HTMLElement).closest<HTMLElement>('[data-step]');
    if (st) setOmx(Number(st.dataset.step));
  });
  if ('IntersectionObserver' in window) {
    const seen = new Map<Element, number>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => seen.set(en.target, en.isIntersecting ? en.intersectionRatio : 0));
      let best: HTMLElement | null = null, bestR = 0;
      seen.forEach((r, el) => { if (r > bestR && !(el as HTMLElement).hidden) { bestR = r; best = el as HTMLElement; } });
      if (best) setOmx(Number((best as HTMLElement).dataset.step));
    }, { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.01, 0.5, 1] });
    form.querySelectorAll('[data-step]').forEach((el) => io.observe(el));
  }
  fillInputs();
  render();
}
