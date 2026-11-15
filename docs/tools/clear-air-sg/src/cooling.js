export function coolingSection(lang, refs, icon) {
 const t=(en,zh)=>lang==='zh'?zh:en;
 return `<section class="container cooling-section" id="cooling" aria-labelledby="cooling-title">
  <div class="cooling-heading">
   <div class="eyebrow">03 / ${t('COOLING DURING HAZE','雾霾期间的清凉与节能')}</div>
   <h2 id="cooling-title">${t('Comfortable air.<br>A lighter energy bill.','清凉舒适，<br>也让电费轻一点。')}</h2>
  </div>
  <div class="cooling-evidence">
   <article class="cooling-card">
    <span class="cooling-card-icon">${icon('filter')}</span>
    <h3>${t('Does the AC filter count?','空调滤网算不算？')}</h3>
    <p>${t('Most split AC units recirculate indoor air without bringing in outdoor air. Their coarse, washable filters do not reliably remove fine PM₂.₅. We therefore exclude ordinary split AC filtration from default bedroom and home sizing; higher-efficiency systems need verified performance.','多数分体空调循环室内空气，不引入室外新风。常见的可清洗粗滤网不能可靠地去除细颗粒 PM₂.₅。因此，默认卧室和住宅选型不计入普通分体空调的过滤贡献；高效过滤系统则需要经核实的性能数据。')}</p>
    <div class="cooling-sources">${refs(['epa-split-ac'])}</div>
   </article>
   <article class="cooling-card">
    <span class="cooling-card-icon">${icon('ceilingFan','ceiling-fan-icon')}</span>
    <h3>${t('Can a fan lower airborne particles?','风扇能降低空气中的颗粒物吗？')}</h3>
    <p>${t('Air movement from ceiling fans and other circulation fans can enhance particle deposition onto indoor surfaces, helping lower airborne PM₂.₅ concentrations. Our default sizing calculation does not add an extra allowance for this fan effect.','吊扇及其他循环风扇产生的气流可以增强颗粒物在室内表面的沉积，帮助降低空气中的 PM₂.₅ 浓度。目前默认选型计算不额外计入这部分贡献。')}</p>
    <p class="cooling-deposition-caveat"><strong>${t('When is the effect stronger?','哪些情况下效果更明显？')}</strong> ${t('When a fan moves more air at higher speeds, airborne particles come into more frequent contact with walls, furniture, sofas and other indoor surfaces. This generally strengthens deposition, especially for larger particles. Surface material and roughness also affect the outcome.','风扇带动的空气越多、风速越快，空气中的颗粒物就越频繁地与室内表面（如墙面、家具和沙发）接触，风扇促进沉积的作用通常越强；这种作用对较大的颗粒也往往更明显。室内表面材质和粗糙度同样会影响效果。')}</p>
    <div class="cooling-sources">${refs(['li2024-fans','fan-first2026'],{'fan-first2026':'Tartarini et al.'},{'li2024-fans':'Figure S5','fan-first2026':t('Section 2.6','第 2.6 节')})}</div>
   </article>
  </div>
  <aside class="cooling-tip" aria-labelledby="cooling-tip-title">
   <div class="cooling-tip-intro">
    <div class="cooling-tip-label">${icon('sun')} ${t('A TIP FOR YOUR ENERGY BILL','省电小贴士')}</div>
    <h3 id="cooling-tip-title">${t('Let the fan help the AC.','让风扇帮空调一把。')}</h3>
    <p>${t('Try hybrid cooling: fan-driven air movement helps you stay comfortable at a higher AC setting, reducing the need for compressor cooling.','试试风扇与空调配合的混合降温（hybrid cooling）：利用风扇送风，在较高的空调设定温度下保持舒适，减少压缩机制冷需求。')}</p>
   </div>
   <ol class="cooling-steps">
    <li><span class="cooling-step-number" aria-hidden="true">01</span><div><h4>${t('Keep haze out.','先挡住雾霾。')}</h4><p>${t('When outdoor air quality is poor, keep windows mostly closed and keep your air purifier operating.','室外雾霾较重时，尽量关窗，并保持空气净化器运行。')}</p></div></li>
    <li><span class="cooling-step-number" aria-hidden="true">02</span><div><h4>${t('Turn the fan up.','把风扇开起来。')}</h4><p>${t('Use a ceiling, desk or pedestal fan at the highest speed that feels comfortable and has acceptable noise, including the highest setting if it suits you.','使用吊扇、台扇或落地扇，在舒适、噪声可接受的范围内尽量提高风速；条件允许时可用最高档。')}</p></div></li>
    <li><span class="cooling-step-number" aria-hidden="true">03</span><div><h4>${t('Raise the AC setting.','逐步调高空调温度。')}</h4><p>${t('Increase the temperature gradually while staying comfortable. The savings depend on your room, equipment and use.','逐步提高设定温度，以舒适为准。实际节能量取决于房间、设备和使用方式。')}</p></div></li>
   </ol>
   <div class="cooling-tip-foot"><div class="cooling-sources">${refs(['fan-first2026'])}</div></div>
  </aside>
 </section>`;
}
