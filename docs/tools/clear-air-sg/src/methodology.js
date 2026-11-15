import {FORMULAS as F, equation, math, symbolLegend} from './equations.js?v=20261023-office-filters-r2';
import {MERV_LOOKUP} from './filters.js?v=20261023-office-filters-r2';

export function physicsArticle(lang, refs) {
 const t=(en,zh)=>lang==='zh'?zh:en;
 return `<article id="physics" class="method-section">
  <div class="eyebrow">01 / ${t('THE MASS BALANCE','质量平衡')}</div>
  <h2>${t('What enters. What leaves. What gets filtered.','进入、离开，以及被过滤的颗粒物。')}</h2>
  <p>${t('We solve a single-zone particle balance with separate paths for window air, leakage, filtered outdoor air and recirculated air. A portable purifier adds clean airflow.','用单区颗粒物质量平衡，分别考虑开窗、渗透、经过滤的新风与循环风。便携净化器提供额外洁净空气量。')}</p>
  ${equation(t('01 · Particle mass balance','01 · 颗粒物质量平衡'),[F.particle,F.input,F.removal],t(`${math('J')} is the total particle input; ${math('L')} is the existing removal flow before portable filtration.`,`${math('J')} 为颗粒物总输入；${math('L')} 为便携净化器以外的已有去除风量。`))}
  <p>${t('At steady state, divide total particle input by total removal flow. We rearrange the equation to find the CADR required to hold your target. Custom HVAC efficiencies should include bypass; selectable MERV values use the planning proxy explained below. CADR already includes a purifier’s filter performance; it is not multiplied by HEPA efficiency again.','稳态时，总颗粒物输入除以总去除风量即室内浓度。反解方程得到维持目标浓度所需的 CADR。自定义 HVAC 有效效率应包含旁路影响；MERV 选项使用下文说明的规划近似。CADR 已包含净化器过滤表现，不会再乘一次 HEPA 效率。')}</p>
  ${equation(t('02 · Steady state & required CADR','02 · 稳态浓度与所需 CADR'),[F.steady,F.minimum])}
  <p>${t('The reported CADR is this mass-balance requirement itself. We do not apply a usable-fraction derating, a selection margin, a clean-air reference floor or product rounding. A purifier’s rated CADR is measured at its highest speed, so a quieter setting delivers less than the nameplate; compare the number with independently tested CADR at the speed you will actually use.','本工具给出的 CADR 就是上述质量平衡需求本身，不再乘实际可用比例、不加选型余量、不设洁净空气量下限、也不做产品取整。净化器的额定 CADR 在最高档测得，较安静的档位低于铭牌值；请按你实际会使用的档位，对照独立测试的 CADR。')}</p>
  <p>${t('For reference, NEA’s 2014 haze guidance suggests a smoke CADR of about 3 cfm per m³ of room volume (≈ 5.1 h⁻¹ after unit conversion; 1 cfm ≈ 1.699 m³/h). That rule of thumb is not used in this calculation—compare it with the model result rather than treating either as a requirement.','作为参照，NEA 2014 年雾霾指引建议烟雾 CADR 约为每 m³ 空间 3 cfm（换算约 5.1 h⁻¹；1 cfm ≈ 1.699 m³/h）。该经验值不参与本工具计算，可与模型结果互相对照，但两者都不是强制要求。')}</p>
  ${refs(['nea-haze'])}
  <h3>${t('CO₂ follows a different balance.','CO₂ 遵循另一套平衡。')}</h3>
  ${equation(t('03 · CO₂ mass balance','03 · CO₂ 质量平衡'),[F.co2,F.outdoor])}
  <p>${t(`${math('X')} is CO₂ in ppm and ${math('G')} is occupant generation in m³/h. Filtration does not appear in this equation. We solve the transient analytically under constant conditions. Airing simulations switch between open and closed states at one-minute intervals and keep occupants and purifier operation unchanged.`,`${math('X')} 为 CO₂（ppm），${math('G')} 为人员产生量（m³/h）。过滤不出现在此方程中。在条件恒定的时段使用解析解。开窗试算按一分钟步长在开关窗状态间切换，人数和净化器运行不变。`)}</p>
  <p>${t('Open-window ACH means total natural exchange, including leakage. We subtract the closed-window leakage rate to avoid counting it twice. Mechanical supply is added independently and is assumed to be balanced by exhaust. Split AC and ceiling fans are not outdoor-air sources.','开窗 ACH 是包含渗透在内的总自然换气率。计算开窗风量时扣除关窗换气，避免重复计入。机械新风独立相加，假定有对应排风。分体空调和吊扇不作为新风来源。')}</p>
  ${equation(t('04 · Additional airflow with windows open','04 · 开窗增加的自然通风量'),[F.natural],t(`${math(String.raw`Q_n=0`)} when windows are closed; leakage remains in ${math(String.raw`Q_{\ell}`)}.`,`关窗时 ${math(String.raw`Q_n=0`)}；渗透风量仍由 ${math(String.raw`Q_{\ell}`)} 计入。`))}
  ${refs(['persily','nea-vent'])}
  <details><summary>${t('Symbols & units','符号与单位')}</summary>${symbolLegend(lang)}</details>
  <section id="filter-grades">
   <h3>${t('Office filters: from MERV to a model efficiency','办公室滤网：从 MERV 等级到模型效率')}</h3>
   <p>${t('Outdoor-air and recirculated-air filters are selected separately. Outdoor filtration reduces particle entry; recirculation filtration adds an indoor removal term. If one AHU filter treats both streams, use its grade for each stream without adding another filter stage.','新风与回风滤网分别选择。新风过滤减少颗粒物进入，回风过滤增加室内去除项。如果同一 AHU 滤网处理两种气流，在两处填写该等级即可，无需额外叠加一级过滤。')}</p>
   <p>${t('Both office filters default to MERV 14, following NEA’s October 2026 guidance, section 2.3(a), for treating outdoor and recirculated air during haze. This is a planning recommendation; confirm the installed filters and airflow with the facilities team.','两处办公室滤网均默认 MERV 14，参考 NEA 2026 年 10 月指南第 2.3(a) 节对雾霾期间新风与再循环空气过滤的建议。这是规划参考，请向设施管理人员确认实际滤网与风量。')}</p>
   ${refs(['nea-vent','ss553-2026'])}
   <p>${t('MERV specifies capture by particle-size band, rather than one PM₂.₅ mass efficiency. The lookup uses the minimum efficiency in the 0.3–1 µm test band (E1) as a fine-particle planning proxy. MERV 1–10 have no rated E1 minimum, so the model credits no removal for those grades; this does not imply zero physical capture.','MERV 按粒径档规定捕集效率，并非一个统一的 PM₂.₅ 质量效率。查表采用 0.3–1 µm 测试档（E1）最低效率，作为细颗粒规划近似。MERV 1–10 未规定 E1 最低值，因此模型不计去除贡献，但不代表实际捕集为零。')}</p>
   <div class="table-scroll"><table><thead><tr><th>MERV</th><th>${t('Model efficiency','模型效率')}</th><th>${t('Basis','依据')}</th></tr></thead><tbody>
    <tr><td>1–10</td><td>0%</td><td>${t('E1 not rated; no model credit','E1 未规定，模型不计贡献')}</td></tr>
    ${MERV_LOOKUP.filter(row=>row.grade>=11).map(row=>`<tr><td>${row.grade}</td><td>${Math.round(row.efficiency*100)}%</td><td>${t('E1 minimum','E1 最低效率')}</td></tr>`).join('')}
   </tbody></table></div>
   <p>${t('The proxy does not cover particles below 0.3 µm. PM₂.₅ size distribution, filter loading and bypass can change actual performance. Use a verified custom effective efficiency when available. The lookup is ordinary MERV; the current SS 554:2026 preview describes MERV-A, which is a distinct rating and cannot be inferred from ordinary MERV alone.','该近似不覆盖小于 0.3 µm 的颗粒。PM₂.₅ 粒径分布、滤网积尘和旁路均会改变实际效果。有经核实的有效效率时可自定义。查表使用普通 MERV；现行 SS 554:2026 预览说明采用 MERV-A，两种评级不同，不能仅由普通 MERV 推断 MERV-A。')}</p>
   ${refs(['epa-merv','ss554-2026'])}
  </section>
 </article>`;
}
