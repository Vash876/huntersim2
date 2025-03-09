export function fillArray(d, h, x) {
  var N = -1,
      $ = d.length;
  h < 0 && (h = -h > $ ? 0 : $ + h),
  x = x > $ ? $ : x,
  x < 0 && (x += $),
  $ = h > x ? 0 : x - h >>> 0,
  h >>>= 0;
  for (var V = Array($); ++N < $;)
      V[N] = d[N + h];
  return V
}

export function chunk(d, h) {
  var N = d.length;
  if (!N || h < 1)
      return [];
  for (var $ = 0, V = 0, re = Array(Math.ceil(N / h)); $ < N;)
      re[V++] = fillArray(d, $, $ += h);
  return re
}

export function generateEncoder(e) {
  if (e.length >= 255)
      throw new TypeError("Alphabet too long");
  const t = new Uint8Array(256);
  for (let c = 0; c < t.length; c++)
      t[c] = 255;
  for (let c = 0; c < e.length; c++) {
      const u = e.charAt(c),
          f = u.charCodeAt(0);
      if (t[f] !== 255)
          throw new TypeError(u + " is ambiguous");
      t[f] = c
  }
  const n = e.length,
      r = e.charAt(0),
      o = Math.log(n) / Math.log(256),
      a = Math.log(256) / Math.log(n);
  function encode(c) {
      if (c instanceof Uint8Array || (ArrayBuffer.isView(c) ? c = new Uint8Array(c.buffer, c.byteOffset, c.byteLength) : Array.isArray(c) && (c = Uint8Array.from(c))), !(c instanceof Uint8Array))
          throw new TypeError("Expected Uint8Array");
      if (c.length === 0)
          return "";
      let u = 0,
          f = 0,
          p = 0;
      const g = c.length;
      for (; p !== g && c[p] === 0;)
          p++,
          u++;
      const v = (g - p) * a + 1 >>> 0,
          b = new Uint8Array(v);
      for (; p !== g;) {
          let O = c[p],
              k = 0;
          for (let _ = v - 1; (O !== 0 || k < f) && _ !== -1; _--, k++)
              O += 256 * b[_] >>> 0,
              b[_] = O % n >>> 0,
              O = O / n >>> 0;
          if (O !== 0)
              throw new Error("Non-zero carry");
          f = k,
          p++
      }
      let S = v - f;
      for (; S !== v && b[S] === 0;)
          S++;
      let w = r.repeat(u);
      for (; S < v; ++S)
          w += e.charAt(b[S]);
      return w
  }
  function decodeUnsafe(c) {
      if (typeof c != "string")
          throw new TypeError("Expected String");
      if (c.length === 0)
          return new Uint8Array;
      let u = 0,
          f = 0,
          p = 0;
      for (; c[u] === r;)
          f++,
          u++;
      const g = (c.length - u) * o + 1 >>> 0,
          v = new Uint8Array(g);
      for (; c[u];) {
          let O = t[c.charCodeAt(u)];
          if (O === 255)
              return;
          let k = 0;
          for (let _ = g - 1; (O !== 0 || k < p) && _ !== -1; _--, k++)
              O += n * v[_] >>> 0,
              v[_] = O % 256 >>> 0,
              O = O / 256 >>> 0;
          if (O !== 0)
              throw new Error("Non-zero carry");
          p = k,
          u++
      }
      let b = g - p;
      for (; b !== g && v[b] === 0;)
          b++;
      const S = new Uint8Array(f + (g - b));
      let w = f;
      for (; b !== g;)
          S[w++] = v[b++];
      return S
  }
  function decode(c) {
      const u = decodeUnsafe(c);
      if (u)
          return u;
      throw new Error("Non-base" + n + " character")
  }
  return {
      encode,
      decodeUnsafe,
      decode
  }
}
var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var encoder = generateEncoder(alphabet);
export class codeHandler {
  constructor(t, n, r)
  {
      this.kind = t,
      this.version = n,
      this.levels = r
  }
  toCode()
  {
      return encoder.encode(this.toBuffer())
  }
  toBuffer()
  {
      const t = [101, this.kind << 5 | this.version & 7];
      for (const n of chunk(this.levels, 4)) {
          const r = n.map((o)=> [o, o === 0 ? 0 : o === 1 ? 1 : o <= 255 ? 2 : 3]);
          for (; r.length < 4;)
              r.push([0, 0]);
          t.push(r.reduce((o, a) => o << 2 | a[1], 0)),
          r.forEach(([o, a]) => {
              a === 2 ? t.push(o & 255) : a === 3 && t.push(o >> 8 & 255, o & 255)
          })
      }
      return new Uint8Array(t)
  }
  static fromBuffer(t) {
    if (t.length < 2 || t[0] != 101)
      return null;
    const n = t[1] >> 5, // kind
          r = t[1] & 7,  // version
          o = [];        // levels array
    let a = 2;
    
    console.log('Kind:', n);
    console.log('Version:', r);
    
    const i = s => {
      if (s < 2) {
        o.push(s);
      } else if (s === 2 && a < t.length) {
        o.push(t[a++] & 255);
      } else if (a + 1 < t.length) {
        o.push((t[a++] & 255) << 8 | t[a++] & 255);
      }
    };
  
    for (; a < t.length;) {
      const s = t[a++] & 255;
      i(s >> 6);
      i(s >> 4 & 3);
      i(s >> 2 & 3);
      i(s & 3);
    }
  
    console.log('Dekodierte Levels Länge:', o.length);
    console.log('Dekodierte Levels:', o);
  
    return new codeHandler(n, r, o);
  }
  static fromCode(t)
  {
      try {
          return codeHandler.fromBuffer(encoder.decode(t))
      } catch {
          return null
      }
  }
}

function onEdit(e){
const sheet = e.range.getSheet();
const sheetName = sheet.getName();
if(sheetName === 'Knox'){
  if(e.range.getColumn() === 4){
    var data = codeHandler.fromCode(e.range.getValue());
    if(data){
      if(data.kind!==6){
        e.range.getCell(1,1).setValue('Code is not for Knox')
      }
      else{
        const row = e.range.getRow();
        var [revival,calyp,ua,ghost,omen,ll,pog,finish,ultimaTalent,kraken,armory,pirate,timeless,amp,dead,elixer,reflect,sear,charger,torpedos,hp,atk,regen,dr,block,effect,charge,chargeGain,reload,proj,reviveCd,maxStage,gadget] = data.levels;
        sheet.getRange(`E${row}:AI${row}`).setValues([[maxStage||0,hp||0,atk||0,regen||0,dr||0,block||0,effect||0,charge||0,chargeGain||0,reload||0,proj||0,revival||0,calyp||0,ua||0,ghost||0,omen||0,ll||0,pog||0,finish||0,kraken||0,amp||0,dead||0,armory||0,pirate||0,timeless||0,sear||0,charger||0,torpedos||0,elixer||0,reflect||0,gadget||0]])
        sheet.getRange(`AS${row}`).setValue((reviveCd||0)*3)
        e.range.getCell(1,1).setValue('')
      }
    }
  }
}
if(sheetName === 'Ozzy'){
  if(e.range.getColumn() === 4){
    var data = codeHandler.fromCode(e.range.getValue());
    if(data){
      if(data.kind!==3){
        e.range.getCell(1,1).setValue('Code is not for Ozzy')
      }
      else{
        const row = e.range.getRow();
        var [revival,trickster,ua,thousandNeedles,omen,ll,crippling,echoBullets,lotl,exo,scorp,timeless,wings,exterm,snek,vectid,cod,dwd,medusa,dod,hp,atk,regen,dr,evade,effect,multistrike,multistrikePower,aspd,r4,r17,i31,i36,i37,i40,innoGN2,innoGN3,attr,catchup99gu,i86,i92,ultimaTalent,sisters,scarab,cat,gadget,card,reviveCd] = data.levels;
        sheet.getRange(`F${row}:AM${row}`).setValues([[hp||0,atk||0,regen||0,dr||0,evade||0,effect||0,multistrike||0,multistrikePower||0,aspd||0,revival||0,trickster||0,ua||0,thousandNeedles||0,omen||0,ll||0,crippling||0,ultimaTalent||0,echoBullets||0,lotl||0,exo||0,scorp||0,dod||0,cat||0,timeless||0,wings||0,exterm||0,medusa||0,scarab||0,vectid||0,snek||0,cod||0,dwd||0,sisters||0,gadget||0]])
        sheet.getRange(`AQ${row}:AR${row}`).setValues([[(reviveCd||0)*3,card||0]])
        sheet.getRange(`BA${row}:BC${row}`).setValues([[i36||0,i37||0,i40||0]])
        sheet.getRange(`BE${row}:BH${row}`).setValues([[i86||0,i92||0,innoGN2||0,innoGN3||0]])
        sheet.getRange(`AW${row}:AX${row}`).setValues([[r17||0,i31||0]])
        sheet.getRange(`BJ${row}:BK${row}`).setValues([[attr||0,catchup99gu||0]])
        sheet.getRange(`AU${row}`).setValue(r4||0)
        e.range.getCell(1,1).setValue('')
      }
    }
  }
}
if(sheetName === 'Borge'){
  if(e.range.getColumn() === 4){
    var data = codeHandler.fromCode(e.range.getValue());
    if(data){
      if(data.kind!==1){
        e.range.getCell(1,1).setValue('Code is not for Borge')
      }
      else{
        const row = e.range.getRow();
        var [revival,life,ua,impacts,omen,ll,pog,fow,ares,ylith,spartan,timeless,baal,sensors,helltouch,inhaler,punches,atlas,weakspot,bfb,hp,atk,regen,dr,evade,effect,critRate,critPower,aspd,trample,r4,r16,r19,i3,i4,i11,i13,i23,i24,i27,i60,creaGN1,creaGN2,creaGN3,innoGN3,attrGN2,attr,catchup99gu,i84,i87,i88,i89,i91,ultimaTalent,athena,mino,hermes,gadget,card,reviveCd] = data.levels;
        sheet.getRange(`F${row}:AM${row}`).setValues([[hp||0,atk||0,regen||0,dr||0,evade||0,effect||0,critRate||0,critPower||0,aspd||0,revival||0,life||0,ua||0,impacts||0,omen||0,ll||0,pog||0,ultimaTalent||0,fow||0,ares||0,ylith||0,spartan||0,timeless||0,bfb||0,athena||0,baal||0,sensors||0,atlas||0,mino||0,helltouch||0,punches||0,weakspot||0,hermes||0,inhaler||0,gadget||0]])
        sheet.getRange(`AQ${row}:AS${row}`).setValues([[(reviveCd||0)*3,card||0,trample||0]])
        sheet.getRange(`AX${row}:BC${row}`).setValues([[r16||0,r19||0,i3||0,i4||0,i11||0,i13||0]])
        sheet.getRange(`BE${row}:BG${row}`).setValues([[i23||0,i24||0,i27||0]])

        sheet.getRange(`BK${row}:BT${row}`).setValues([[i84||0,i87||0,i88||0,i89||0,i91||0,creaGN1||0,creaGN2||0,creaGN3||0,innoGN3||0,attrGN2||0]])
        sheet.getRange(`BV${row}:BW${row}`).setValues([[attr||0,catchup99gu||0]])

        sheet.getRange(`AV${row}`).setValue(r4||0)
        sheet.getRange(`BI${row}`).setValue(i60||0)

        e.range.getCell(1,1).setValue('')
      }
    }
  }
}
}

//borge:[revival,life,ua,impacts,omen,ll,pog,fow,ares,ylith,spartan,timeless,baal,sensors,helltouch,inhaler,punches,atlas,weakspot,bfb,hp,atk,regen,dr,evade,effect,critRate,critPower,aspd,trample,r4,r16,r19,i3,i4,i11,i13,i23,i24,i27,i60,creaGN1,creaGN2,creaGN3,innoGN3,attrGN2,attr,catchup99gu,i84,i87,i88,i89,i91,ultimaTalent,athena,mino,hermes,gadget,card,reviveCd]
//ozzy: [revive,trickster,ua,needles,omen,ll,crippling,echo,lotl,exo,scorp,timeless,wings,exterm,snek,elixer,cod,dwd,medusa,dod,hp,atk,regen,dr,evade,effect,multistrikeChance,multistrikePower,atkSpd,r4,r17,i31,i36,i37,i40,inoogn2,innogn3,attr,catchup99,i86,i92,ultimaTalent,sisters,scarab,cat,gadget,card,reviveTime]
//knox: [revive,ca,ua,gb,omen,ll,pog,fm,ultimaTalent,rtk,spa,pl,timeless,sa,dmtnt,fe,sop,se,pct,kot,hp,atk,regen,dr,block,effect,chargeChance,chargeGain,reload,proj,reviveTime,maxStage,gadget,research81]

//kind: 1=borge, 3=ozzy, 6=knox