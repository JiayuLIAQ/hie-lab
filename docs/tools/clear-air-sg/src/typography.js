// Keep the decimal point on the same subscript baseline as both digits.
// Only format HTML text; preserve attributes, code and other literal content.
export function formatPM(html) {
 let literal = null;
 return html.replace(/<(?:[^"'<>]|"[^"]*"|'[^']*')*>|PM(?:\u2082\.\u2085|2\.5)/g, token => {
  if (token.startsWith('<')) {
   const tag = token.match(/^<(\/?)\s*([a-z][\w-]*)/i);
   if (tag) {
    const name = tag[2].toLowerCase();
    if (tag[1] && name === literal) literal = null;
    else if (!tag[1] && !literal && /^(script|style|title|textarea|pre|code)$/.test(name)) literal = name;
   }
   return token;
  }
  return literal ? token : 'PM<sub class="pm-sub">2.5</sub>';
 });
}
