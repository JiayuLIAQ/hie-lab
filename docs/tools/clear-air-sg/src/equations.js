import katex from '../assets/katex/katex.mjs';

// Presentation of the existing model.js equations; all flows are in m³/h.
export const FORMULAS = {
 particle: String.raw`V\frac{\mathrm{d}C}{\mathrm{d}t}=J-\bigl(L+Q_p\bigr)C`,
 input: String.raw`\begin{aligned}J&=(Q_{\ell}P+Q_n)C_o\\&\quad+Q_s(1-\eta_s)C_o+E\end{aligned}`,
 removal: String.raw`\begin{aligned}L&=Q_{\ell}+Q_n+Q_s\\&\quad+\beta V+Q_r\eta_r\end{aligned}`,
 steady: String.raw`C_{\mathrm{ss}}=\frac{J}{L+Q_p}`,
 minimum: String.raw`Q_{p,\mathrm{required}}=\max\!\left(0,\frac{J}{C_t}-L\right)`,
 outdoor: String.raw`Q_{\mathrm{out}}=Q_{\ell}+Q_n+Q_s`,
 co2: String.raw`V\frac{\mathrm{d}X}{\mathrm{d}t}=10^6G+Q_{\mathrm{out}}(X_o-X)`,
 natural: String.raw`Q_n=V\max\!\left(0,a_{\mathrm{open}}-a_{\mathrm{leak}}\right)`,
};

export function math(tex, displayMode=false) {
 return katex.renderToString(tex, {displayMode, output:'htmlAndMathml', throwOnError:true, strict:'error', trust:false});
}

export function equation(label, rows, note='') {
 return `<div class="equation math-card"><div class="equation-label">${label}</div>${rows.map(tex=>`<div class="math-row" tabindex="0">${math(tex,true)}</div>`).join('')}${note?`<p class="equation-note">${note}</p>`:''}</div>`;
}

export function symbolLegend(lang) {
 const zh=lang==='zh';
 const symbols=[
  ['V',['Room volume','空间体积'],'m³'],
  [String.raw`C,\ C_o,\ C_t,\ C_{\mathrm{ss}}`,['Indoor, outdoor, target and steady-state particle concentration','室内、室外、目标与稳态颗粒物浓度'],'µg/m³'],
  [String.raw`Q_{\ell},\ Q_n,\ Q_s,\ Q_r`,['Leakage, natural, mechanical supply and recirculation airflow','渗透、自然通风、机械新风与循环风量'],'m³/h'],
  [String.raw`J,\ E`,['Total particle input and indoor emission rate','颗粒物总输入与室内排放率'],'µg/h'],
  ['L',['Existing particle-removal flow, before portable filtration','便携净化器以外的已有颗粒物去除风量'],'m³/h'],
  [String.raw`\beta`,['Particle deposition rate','颗粒物沉降率'],'h⁻¹'],
  [String.raw`P,\ \eta_s,\ \eta_r`,['Penetration and supply/recirculation filtration efficiency','穿透率与新风/循环过滤效率'],'0–1'],
  [String.raw`Q_p,\ Q_{p,\mathrm{required}}`,['Purifier CADR and CADR required to reach the target','净化器 CADR 与达到目标所需的 CADR'],'m³/h'],
  [String.raw`X,\ X_o`,['Indoor and outdoor CO₂ concentration','室内与室外 CO₂ 浓度'],'ppm'],
  ['G',['Occupant CO₂ generation','人员 CO₂ 产生量'],'m³/h'],
  [String.raw`a_{\mathrm{open}},\ a_{\mathrm{leak}}`,['Open-window total and closed-window air exchange','开窗总换气率与关窗换气率'],'h⁻¹'],
  [String.raw`Q_{\mathrm{out}},\ t`,['Total outdoor airflow and time','室外总新风量与时间'],'m³/h; h'],
 ];
 return `<dl class="symbol-list">${symbols.map(([tex,label,unit])=>`<div><dt>${math(tex)}</dt><dd>${label[zh?1:0]}<span class="symbol-unit">${unit}</span></dd></div>`).join('')}</dl>`;
}
