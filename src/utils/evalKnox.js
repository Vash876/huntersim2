export function EVALKNOX(lvl,maxStage,hp,atk,regen,dr,block,effect,charge,chargeGain,reload,proj,revival,calyp,ua,ghost,omen,ll,pog,finish,kraken,amp,dead,sear,pirate,timeless,torpedos,charger,armory,elixer,reflect,gadget,iters,iap,special,ultima,glac,quartz,tess,reviveCd,respec,bossLootRate,iterative,glacRate1,quartzRate1,tessRate1,xpRate1,hp1,atk1,regen1,dr1,block1,effect1,charge1,chargeGain1,reload1,proj1,gadget1,lvl1,time1,research81,cm46,cm47,cm48,cm51) {

  if(iterative && !lvl1){
    return 'Waiting for previous build'
  }

  var multi = (enemyNum) => Math.max(1, 1 + (enemyNum - 49) * .006+
  Math.max(0,(enemyNum - 99) * .006)+
  Math.max(0,(enemyNum - 119) * .01)+
  Math.max(0,(enemyNum - 129) * .008)+
  Math.max(0,(enemyNum - 139) * .006)+
  Math.max(0,(enemyNum - 149) * .006)+
  Math.max(0,(enemyNum - 159) * .006)+
  Math.max(0,(enemyNum - 169) * .006)+
  Math.max(0,(enemyNum - 179) * .006)+
  Math.max(0,(enemyNum - 189) * .006)+
  Math.max(0,(enemyNum - 199) * .006)+
  Math.max(0,(enemyNum - 219) * .02)+
  Math.max(0,(enemyNum - 249) * .006)+
  Math.max(0,(enemyNum - 299) * .006)+
  Math.max(0,(enemyNum - 309) * .003)+
  Math.max(0,(enemyNum - 319) * .02)+
  Math.max(0,(enemyNum - 329) * .004)+
  Math.max(0,(enemyNum - 339) * .004)+
  Math.max(0,(enemyNum - 349) * .005)+
  Math.max(0,(enemyNum - 359) * .005)+
  Math.max(0,(enemyNum - 369) * .006)+
  Math.max(0,(enemyNum - 379) * .006)+
  Math.max(0,(enemyNum - 389) * .007))

        var simEnemy = (enemyNum) => ({
  maxHp: (7 + 9 * enemyNum) * multi(enemyNum)*Math.pow(3.2,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 120 : 1),
  hp: (7 + 9 * enemyNum) * multi(enemyNum)*Math.pow(3.2,Math.floor(Math.max(0,enemyNum-1)/100)),
  atk: (2.4 + 1.4 * enemyNum) * multi(enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 4 : 1),
  critRate: Math.min(.25,.0994 + .0006 * enemyNum + (enemyNum>0 && enemyNum%100 === 0 ? .1 : 0)),
  critDmg: Math.min(2.5,1.032 + .008 * enemyNum),
  dr: (1-(enemyNum>=200?(Math.max(0,Math.floor(Math.max(0,enemyNum-1)/100)-2))*.02+.04:0)) - (enemyNum>0 && enemyNum%100 === 0 ? .05 : 0),
  evade: .01*Math.floor(enemyNum/100),
  regen: .04 * enemyNum * multi(enemyNum)*Math.pow(1.4,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 2 : 1),
  atkSpd: (6.005 - .005 * enemyNum)*(enemyNum>0 && enemyNum%100 === 0 ? 2.85 : 1),
  maxDps: (2.4 + 1.4 * enemyNum) * multi(enemyNum)*(1.03 + .008 * enemyNum)/(6 - .005 * enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))
});

var enemies = [];
for(var i = 0;i<=1000;i++){
    enemies.push(simEnemy(i))
}

var ck = (chance) => {
  return chance && chance > Math.random()
}

var getBaseStats = ()=>{
    return {
        maxHp: 20+(2+Math.floor(hp/5)*.1)*hp*gadgetMulti,
        hp: 20+(2+Math.floor(hp/5)*.1)*hp*gadgetMulti,
        atk: 1.2+(.06+Math.floor(atk/10)*.01)*atk*gadgetMulti,
        salvo: 3+proj*1,
        regen: .05+(.03+Math.floor(regen/30)*.02)*regen*gadgetMulti,
        dr: .0032*dr,
        block: .0055*block+.08,
        effect: .0036*effect+.05,
        charge: .07+.0025*charge,
        chargeGain: .01*chargeGain+.25,
        reload: 7-.03*reload,
        baseStats: `${hp}/${atk}/${regen} ${dr}/${block}/${effect} ${charge}/${chargeGain}/${reload} ${proj}`
    }
}
var gadgetMulti = Math.pow(1.001,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var gadgetLootMulti = Math.pow(1.005,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var getBaseStatsRecord = ()=>{
    return {
        basehp: Number(hp),
        baseatk: Number(atk),
        basesalvo: Number(proj),
        baseregen: Number(regen),
        basedr: Number(dr),
        baseblock: Number(block),
        baseeffect: Number(effect),
        basecharge: Number(charge),
        basechargeGain: Number(chargeGain),
        basereload: Number(reload),
    }
}
var getTalents = ()=>{
    return {
        revival:Number(revival), calyp:Number(calyp), ua:Number(ua), ghost:Number(ghost), omen:Number(omen), ll:Number(ll), pog:Number(pog), finish:Number(finish)
    }
}
var getPath = ()=>{
    return {
        kraken:Number(kraken), amp:Number(amp), dead:Number(dead), sear:Number(sear), pirate:Number(pirate), timeless:Number(timeless), torpedos:Number(torpedos), charger:Number(charger), armory:Number(armory), elixer:Number(elixer), reflect:Number(reflect)
    }
}


var baseKnox = {
  lvl: Math.floor(Number(lvl)),
  maxStage: maxStage,
  loot:0,
  enem:0,
  iters:0,
  time:0,
  minEnem:5000,
  maxEnem:0,
  upgradeOrder:'',
  lvlOrder1:'',
  lvlOrder2:'',
  lvlOrder3:'',
  mat1:0,
  mat2:0,
  mat3:0,
  xp:0,
  charge1:0,
  charge2:0,
  totalCharge:0,
  bossKill:0,
  bossHp:0,
  minSouls:0,
  maxedSouls:0,
  progress: {},
  bossStats:[{},{},{},{},{},{},{},{},{},{}],
  spentGlac:(iterative?-1:1)*Number(glac),
  spentQuartz:(iterative?-1:1)*Number(quartz),
  spentTess:(iterative?-1:1)*Number(tess),
  spentXp:0,
  ...getBaseStats(),
  ...getTalents(),
  ...getPath(),
  ...getBaseStatsRecord()
}

var getAtkCost = (current)=>{
    return Math.ceil(2*Math.pow((1.068 + 0.00027*Math.min((current-1), 100)),(current-1)))
}
var getRegenCost = (current)=>{
    return Math.ceil(4*Math.pow((1.09 + 0.00027*Math.min((current-1), 70)),(current-1)))
}
var getHpCost = (current)=>{
    return Math.ceil(1*Math.pow((1.054 + 0.00027*Math.min((current-1), 110)),(current-1)))
}
var getDrCost = (current)=>{
    return Math.ceil(Math.ceil(2*Math.pow(((current-1)*0.008+1.12),(current-1))) * 0.9 * Math.pow(1.2,Math.max((current-1)-9, 0)) * Math.pow(1.5,Math.max((current-1)-19, 0)) * Math.pow(2,Math.max((current-1)-29, 0)) * Math.pow(3,Math.max((current-1)-34, 0)) * Math.pow(4,Math.max((current-1)-39,0)) * Math.pow(5,Math.max((current-1)-44,0)))
}
var getBlockCost = (current)=>{
    return Math.ceil(Math.ceil(3*Math.pow(((current-1)*0.028+1.18),(current-1))) * 0.9 * Math.pow(1.2,Math.max((current-1)-9, 0)) * Math.pow(1.5,Math.max((current-1)-19, 0)) * Math.pow(2,Math.max((current-1)-29, 0)) * Math.pow(3,Math.max((current-1)-34, 0)) * Math.pow(4,Math.max((current-1)-39,0)) * Math.pow(5,Math.max((current-1)-44,0)))
}
var getEffectCost = (current)=>{
    return Math.ceil(Math.ceil(50*Math.pow(((current-1)*0.018+1.2),(current-1))) * 0.9 * Math.pow(1.2,Math.max((current-1)-9, 0)) * Math.pow(1.5,Math.max((current-1)-19, 0)) * Math.pow(2,Math.max((current-1)-29, 0)) * Math.pow(3,Math.max((current-1)-34, 0)) * Math.pow(4,Math.max((current-1)-39,0)) * Math.pow(5,Math.max((current-1)-44,0)))
}
var getChgCost = (current)=>{
    return Math.ceil(Math.ceil(1*Math.pow(((current-1)*0.025+1.35),(current-1))) * 0.9 * Math.pow(1.05,Math.max((current-1)-9, 0)) * Math.pow(1.05,Math.max((current-1)-19, 0)) * Math.pow(1.2,Math.max((current-1)-29, 0)) * Math.pow(1.3,Math.max((current-1)-39, 0)) * Math.pow(1.4,Math.max((current-1)-49,0)) * Math.pow(1.5,Math.max((current-1)-59,0)))
}
var getChgChanceCost = (current)=>{
    return Math.ceil(Math.ceil(1*Math.pow(((current-1)*0.016+1.18),(current-1))) * 0.9 * Math.pow(1.05,Math.max((current-1)-9, 0)) * Math.pow(1.05,Math.max((current-1)-19, 0)) * Math.pow(1.2,Math.max((current-1)-29, 0)) * Math.pow(1.3,Math.max((current-1)-39, 0)) * Math.pow(1.4,Math.max((current-1)-49,0)) * Math.pow(1.5,Math.max((current-1)-59,0)))
}
var getAtkSpdCost = (current)=>{
    return Math.ceil(Math.ceil(2*Math.pow(((current-1)*0.035+1.24),(current-1))) * 0.9 * Math.pow(1.02,Math.max((current-1)-9, 0)) * Math.pow(1.05,Math.max((current-1)-19, 0)) * Math.pow(1.2,Math.max((current-1)-29, 0)) * Math.pow(1.3,Math.max((current-1)-39, 0)) * Math.pow(1.4,Math.max((current-1)-49,0)) * Math.pow(1.5,Math.max((current-1)-59,0)) * Math.pow(1.6,Math.max((current-1)-69,0)) * Math.pow(1.7,Math.max((current-1)-79,0)) * Math.pow(1.8,Math.max((current-1)-89,0)))
}
var getBulletCost = (current)=>{
    return [100*Math.pow(1000,(current-1))*0.8,100*Math.pow(1000,(current-1))*1.2,100*Math.pow(1000,(current-1))*0.9]
}
var getGadgetCost = (current)=>{
    return 60000*Math.pow(1.1,current-1)*Math.pow(1.35,Math.floor((current-1)/10))
}
var getXp = (current)=>{
  return Math.pow(1.6,current)*50
}

var prepKnox = (knoxBase)=>{
  var knox = {...knoxBase};
  knox.maxHp *= (1+.005*knox.kraken);
  knox.regen *= (1+.008*knox.kraken);
  knox.atk *= (1+.005*knox.kraken);
  knox.dr += .009*knox.pirate;
  knox.charge += .01*knox.sear + .006*knox.pirate;
  knox.effect += .02*knox.sear + .007*knox.pirate;
  knox.block += .01*knox.elixer + .008*knox.pirate;

  if(iterative && !glacRate1){
    knox.extraGlac = glac
    knox.extraQuartz = quartz
    knox.extraTess = tess
    knox.extraXp = 0
    var totalXp = (totalLoot)*0.1417163424;
    var lv = 0;
    while(totalXp>0){
      var nextXp=getXp(lv);
      if(totalXp>nextXp){
        totalXp-=nextXp;
        lv++;
      }
      else{
        lv+=totalXp/nextXp;
        totalXp = 0;
      }
    }
    knox.expectedLvl = Number(lvl);
  }
  else{
    var ignoreXp = !iterative && Number(maxStage)>100
    for(var i = iterative?hp1+1:1;i<=knox.basehp;i++){
      knox.spentGlac+=getHpCost(i)
    }
    for(var i = iterative?atk1+1:1;i<=knox.baseatk;i++){
      knox.spentGlac+=getAtkCost(i)
    }
    for(var i = iterative?regen1+1:1;i<=knox.baseregen;i++){
      knox.spentGlac+=getRegenCost(i)
    }
    for(var i = iterative?dr1+1:1;i<=knox.basedr;i++){
      knox.spentQuartz+=getDrCost(i)
    }
    for(var i = iterative?block1+1:1;i<=knox.baseblock;i++){
      knox.spentQuartz+=getBlockCost(i)
    }
    for(var i = iterative?effect1+1:1;i<=knox.baseeffect;i++){
      knox.spentQuartz+=getEffectCost(i)
    }
    for(var i = iterative?charge1+1:1;i<=knox.basecharge;i++){
      knox.spentTess+=getChgChanceCost(i)
    }
    for(var i = iterative?chargeGain1+1:1;i<=knox.basechargeGain;i++){
      knox.spentTess+=getChgCost(i)
    }
    for(var i = iterative?reload1+1:1;i<=knox.basereload;i++){
      knox.spentTess+=getAtkSpdCost(i)
    }
    for(var i = iterative?gadget1+1:1;i<=Number(gadget);i++){
      knox.spentTess+=getGadgetCost(i)
    }
    for(var i = iterative?proj1+1:1;i<=Number(proj);i++){
      var [g,q,t] = getBulletCost(i);
      knox.spentGlac+=g
      knox.spentQuartz+=q
      knox.spentTess+=t
    }
    for(var i = 0;i<Number(lvl);i++){
      var thisXp = getXp(i)
      if(i+1<Number(lvl)){
        knox.spentXp+=thisXp
      }
      else{
        knox.spentXp+=thisXp*(Number(lvl)-i);
      }
    }
    var prevXp = 0;
    if(iterative){
      for(var i = 0;i<Number(lvl1);i++){
        var thisXp = getXp(i)
        if(i+1<Number(lvl1)){
          prevXp+=thisXp
        }
        else{
          prevXp+=thisXp*(Number(lvl1)-i);
        }
      }
    }

    const blr = Number(bossLootRate||0)
    var glacRate = iterative?glacRate1:(0.3473175121*(1-blr)+blr*(800*1.25/(800*1.25+600*1.05+400*0.8+300*1.4)))
    var quartzRate = iterative?quartzRate1:(0.2905185019*(1-blr)+blr*(600*1.05/(800*1.25+600*1.05+400*0.8+300*1.4)))
    var tessRate = iterative?tessRate1:(0.2204476437*(1-blr)+blr*(400*0.8/(800*1.25+600*1.05+400*0.8+300*1.4)))
    var xpRate = iterative?xpRate1:(0.1417163424*(1-blr)+blr*(300*1.4/(800*1.25+600*1.05+400*0.8+300*1.4)))
    var totalLoot = Math.max(knox.spentGlac/glacRate,knox.spentQuartz/quartzRate,knox.spentTess/tessRate,ignoreXp ? 0 : (knox.spentXp-prevXp)/xpRate);
    knox.extraGlac = (totalLoot - knox.spentGlac/glacRate)*glacRate
    knox.extraQuartz = (totalLoot - knox.spentQuartz/quartzRate)*quartzRate
    knox.extraTess = (totalLoot - knox.spentTess/tessRate)*tessRate
    knox.extraXp = ignoreXp ? 0 : (totalLoot - knox.spentXp/xpRate)*xpRate + prevXp
    var totalXp = prevXp+(totalLoot)*xpRate;
    var lv = 0;
    while(totalXp>0){
      var nextXp=getXp(lv);
      if(totalXp>nextXp){
        totalXp-=nextXp;
        lv++;
      }
      else{
        lv+=totalXp/nextXp;
        totalXp = 0;
      }
    }
    if(iterative){
      knox.timeFromPrev = totalLoot*60
    }
    knox.expectedLvl = ignoreXp ? Number(lvl) : lv;
  }

  knox.sc = .02+.0014*knox.lvl+.0008*knox.maxStage+knox.effect/3+.02*Math.floor((knox.maxStage-1)/100);
  knox.hp = knox.maxHp;
  knox.souls = 0;
  knox.soulCap = 100+knox.dead*10+10*Math.floor((knox.maxStage-1)/100);
  return knox
}
var opts = [prepKnox(baseKnox)]

var sim = (knox) => {
    var enem = 0;
    var time = 0;
    var leftoverTorpedos = 0;
    if(Number(respec) && (knox.iters % Math.ceil(Number(respec))) === 0){
      knox.charge1 = 0;
      knox.charge2 = 0;
    }
    knox.hp = knox.maxHp;
    knox.currentMaxHp = knox.maxHp;
    knox.currentAtk = knox.atk;
    knox.currentRegen = knox.regen;
    knox.souls = 0;
    knox.revives = knox.revival;
    knox.time += 40-Math.min(Number(reviveCd),30);
    knox.soulmult = 1;
    knox.maxStage = Math.max(knox.maxStage,Math.floor(knox.maxEnem/10))
    knox.torpedoLimit = 100 - (10 * knox.torpedos);
    knox.remainingBullets = 0;
    var currentEnemy = enemies[0];
    currentEnemy.hp = currentEnemy.maxHp;
    var bullet = () => {
      knox.remainingBullets--;
      currentEnemy.hp -= currentEnemy.evade>0 && ck(currentEnemy.evade) ? 0 : (knox.finish && (knox.remainingBullets === (knox.gbHit ? 1 : 0)) && ck(knox.effect*2) ? knox.currentAtk*(1 + knox.finish * .2)*currentEnemy.dr : knox.currentAtk*currentEnemy.dr);
      if (currentEnemy.hp <= 0) { killEnemy() }
      if(knox.remainingBullets)
          nextBullet = time + .1
      else{
          nextBullet = 999999999;
          if (knox.charge1 > 10 && !knox.remainingBullets) {
            knox.charge1 -= 10;
            time = time + .1;
            atk(true)
          }
      }
    }
    var soulmult = () => {
      return 1 + knox.souls * .005 * (1 + knox.amp * .01)
    }
    var regen = () => {
      if (knox.hp < knox.currentMaxHp) {
        knox.hp = Math.min(knox.currentMaxHp, knox.hp + knox.currentRegen * (knox.bonusRegen ? 1 + .1 * knox.elixer : 1))
        knox.bonusRegen = Math.max(0, knox.bonusRegen - 1)
      }
      currentEnemy.hp = Math.min(currentEnemy.maxHp, currentEnemy.hp + currentEnemy.regen * (1 - .08 * knox.omen / (enem===1000 ? 2 : 1)))
      nextRegen = time + 1;
    }
    var enemyAttack = () => {
      var dmg = currentEnemy.atk * (1 - knox.pog * .03);
      if (ck(currentEnemy.critRate)) {
        dmg *= currentEnemy.critDmg
      }
      if(enem > 0 && enem % 1000 === 0){
        currentEnemy.enrage++;
        nextEnemAtk = time + Math.max(.5,currentEnemy.atkSpd-currentEnemy.enrage*(currentEnemy.atkSpd/200))
      }
      else{
        nextEnemAtk = time + currentEnemy.atkSpd
      }
      if (ck(knox.block)) {
        dmg /= 2
        if(knox.elixer)
          knox.bonusRegen = 5
        if(knox.reflect){
          knox.charge1 += .1 * knox.reflect
          knox.charge2 += .1 * knox.reflect
          knox.totalCharge += .1 * knox.reflect
          currentEnemy.hp -= dmg * knox.reflect * .2
          if (currentEnemy.hp <= 0) {
              killEnemy()
          }
        }
      }
      knox.hp -= dmg * (1 - knox.dr);
      if (knox.revives && knox.hp <= 0) {
        knox.hp = .8 * knox.currentMaxHp
        knox.revives--
      }
    }
    var torpedo = () => {
      for (var i = 0; i < 5 + knox.torpedos; i++) {
        currentEnemy.hp -= knox.currentAtk*30*(1+.08*knox.charger)*(1+.2*knox.torpedos);
        if(currentEnemy.hp<=0)
            killEnemy()
        else{
            leftoverTorpedos = 5 + knox.torpedos - (i+1)
            nextTorpedo = 99999999;
            return;
        }
      }
      nextTorpedo = 99999999
    }
    var killEnemy = (extraTime) => {
      if(enem>0 && enem % 1000 === 0)
        enem+=10;
      else{
        enem++;
      }
      if(enem%10===0)
          currentEnemy = enemies[Math.floor(enem/10)]
      if(leftoverTorpedos){
        currentEnemy.hp = currentEnemy.maxHp - knox.currentAtk*30*(1+.08*knox.charger)*(1+.2*knox.torpedos);
        leftoverTorpedos--;
      }
      else{
        currentEnemy.hp = currentEnemy.maxHp;
      }
      currentEnemy.enrage=0;
      if (knox.calyp && enem % 10 === 0 && ck(knox.effect * 2.5)) {
        knox.souls = Math.min(knox.soulCap, knox.souls + knox.calyp)
        knox.soulmult = soulmult();
        knox.currentMaxHp = knox.maxHp * knox.soulmult;
        knox.currentAtk = knox.atk * knox.soulmult;
        knox.currentRegen = knox.regen * knox.soulmult;
      }
      if (knox.souls < knox.soulCap && ck(knox.sc)) {
        knox.souls++
        knox.soulmult = soulmult();
        knox.currentMaxHp = knox.maxHp * knox.soulmult;
        knox.currentAtk = knox.atk * knox.soulmult;
        knox.currentRegen = knox.regen * knox.soulmult;
      }
      if (knox.ua && ck(knox.effect)) {
        knox.hp = Math.min(knox.currentMaxHp, knox.hp+knox.currentMaxHp*knox.ua*.02)
      }
      if(knox.reflect || (enem > 0 && enem % 1000 === 0) || (currentEnemy.maxDps * (1 - knox.pog * .03) * (1 - knox.dr) > knox.currentRegen)){
          nextEnemAtk = time + currentEnemy.atkSpd + (extraTime || 0)
      }
      else{
        nextEnemAtk = 9999999;
      }
      if(currentEnemy.hp <= 0){
        killEnemy();
      }
    }
    var atk = (skipAtkReset) => {
      currentEnemy.hp -= currentEnemy.evade>0 && ck(currentEnemy.evade) ? 0 : knox.currentAtk*currentEnemy.dr;
      if (currentEnemy.hp <= 0) { killEnemy() }
      knox.gbHit = ck(knox.ghost * .0667);
      let totalBullets = knox.salvo + (knox.gbHit ? 1 : 0) + (ck(knox.armory * .02) ? 3 : 0);
      if (ck(knox.charge)) {
        knox.charge1 += knox.chargeGain
        knox.charge2 += knox.chargeGain
        knox.totalCharge += knox.chargeGain
      }
  
      var nextTime = Math.min(nextEnemAtk,nextRegen);
      for (var i = 1; i < totalBullets; i++) { 
          if(time + .1 * i < nextTime){
              currentEnemy.hp -= currentEnemy.evade>0 && ck(currentEnemy.evade) ? 0 : (knox.finish && i == totalBullets-(knox.gbHit ? 2 : 1) && ck(knox.effect*2) ? knox.currentAtk*(1+knox.finish*.2)*currentEnemy.dr : knox.currentAtk*currentEnemy.dr);
              if (currentEnemy.hp <= 0) { killEnemy(i*.1) }
          }
          else{
              nextBullet = time + .1*i;
              knox.remainingBullets = totalBullets - i;
              i = totalBullets
          }
              
      }
      if(!skipAtkReset){
        nextAtk =  time + knox.reload;
        if(knox.charger){
          knox.charge1 += knox.charger * .02 * knox.reload
          knox.charge2 += knox.charger * .02 * knox.reload
          knox.totalCharge += knox.charger * .02 * knox.reload
        }
      }
      if (knox.charge1 > 10 && !knox.remainingBullets) {
        knox.charge1 -= 10;
        time = time + totalBullets*.1;
        atk(true)
      }
      if (knox.charge2 >= knox.torpedoLimit) {
          nextTorpedo = time + 1.5
          knox.charge2 -= knox.torpedoLimit
      }
    }
    var nextAtk = knox.reload;
    var nextBullet = 99999999;
    var nextTorpedo = 99999999;
    var nextEnemAtk = currentEnemy.atkSpd;
    var nextRegen = 1;
    while (knox.hp > 0) {
      time = Math.min(nextAtk,nextBullet,nextTorpedo,nextEnemAtk,nextRegen)      
      if(time == nextRegen)
          regen()
      else if(time == nextBullet)
          bullet()
      else if(time == nextEnemAtk)
          enemyAttack()
      else if(time == nextAtk)
          atk()
      else if(time == nextTorpedo)
          torpedo()
    }
    for(var i = 0; i<10; i++){
      if(enem<(i+1)*1000){
        knox.bossStats[i].hp = (knox.bossStats[i].hp || 0) + enemies[(i+1)*100].maxHp;
      }
      else if(enem === (i+1)*1000){
        knox.bossStats[i].hp = (knox.bossStats[i].hp || 0) + enemies[(i+1)*100].hp;
      }
      else{
        knox.bossStats[i].kills = (knox.bossStats[i].kills || 0) + 1;
      }
    }
    var mat1 = [1,1.04,1.06,1.08,1.11,1.18,1.25]
    var mat2 = [0.77,0.88,0.99,1.05]			
    var mat3 = [0.6,0.7,0.8]				
    var xp = [1.3,1.4].map(a=>a*Math.pow(2,Math.floor((Number(maxStage)-1)/100)))

    var normalized = (3*mat1.reduce((a, b) => a + b) / mat1.length+3*mat2.reduce((a, b) => a + b) / mat2.length+3*mat3.reduce((a, b) => a + b) / mat3.length+xp.reduce((a, b) => a + b) / xp.length)/10

    var stageGrowth = 1.074;
    var enemiesInSection = 1010;
    var excludedXpMultis = 1;//None for now
    var includedMultis = (1+knox.timeless*.13) * gadgetLootMulti;
    var excludedMultis = Math.max(Number(special),1)*(Boolean(iap)?1.25:1)*Math.max(Number(ultima),1)*(Number(research81)>=3?1.1:1)*(Number(research81)>=6?1.2:1)*(Number(cm46)>0?1.03:1)*(Number(cm47)>0?1.02:1)*(Number(cm48)>0?1.07:1)*(Number(cm51)>0?1.05:1);;
    var loopLoot = normalized*((Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(enem,enemiesInSection-10)-Math.floor(Math.min(enem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10)))*includedMultis*(1+knox.ll*.2*knox.effect);
    var bonusMulti = 1;
    var tempEnem = enem;
    while(tempEnem>=enemiesInSection){
        tempEnem-=enemiesInSection;
        enemiesInSection = 1000;


        bonusMulti*=Math.pow(stageGrowth,100)


        knox.mat1+=bonusMulti*mat1[mat1.length-1]*800*includedMultis*excludedMultis;
        knox.mat2+=bonusMulti*mat2[mat2.length-1]*600*includedMultis*excludedMultis;
        knox.mat3+=bonusMulti*mat3[mat3.length-1]*400*includedMultis*excludedMultis;
        knox.xp+=bonusMulti*xp[xp.length-1]*300*includedMultis*excludedMultis*excludedXpMultis;


        knox.loot+=bonusMulti*mat1[mat1.length-1]*800*includedMultis;
        knox.loot+=bonusMulti*mat2[mat2.length-1]*600*includedMultis;
        knox.loot+=bonusMulti*mat3[mat3.length-1]*400*includedMultis;
        knox.loot+=bonusMulti*xp[xp.length-1]*300*includedMultis;


        bonusMulti*=5;


        loopLoot += bonusMulti*normalized*stageGrowth*((Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(tempEnem,enemiesInSection-10)-Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)))*includedMultis*(1+knox.ll*.2*knox.effect);
    }
    knox.mat1+=loopLoot*3/10*mat1.reduce((a, b) => a + b) / mat1.length/normalized*excludedMultis;
    knox.mat2+=loopLoot*3/10*mat2.reduce((a, b) => a + b) / mat2.length/normalized*excludedMultis;
    knox.mat3+=loopLoot*3/10*mat3.reduce((a, b) => a + b) / mat3.length/normalized*excludedMultis;
    knox.xp+=loopLoot*1/10*xp.reduce((a, b) => a + b) / xp.length/normalized*excludedMultis*excludedXpMultis;

    knox.loot+=loopLoot;
    knox.time+=time;
    knox.enem+=enem;
    knox.ls=knox.loot/knox.time;
    knox.iters++;
    
    knox.minSouls=Math.min(knox.minSouls||knox.souls,knox.souls)
    if(knox.souls === knox.soulCap){
      knox.maxedSouls++;
    }
    knox.minEnem=Math.min(knox.minEnem,enem)
    knox.maxEnem=Math.max(knox.maxEnem,enem)
    knox.progress[Math.floor(enem/10)] = (knox.progress[Math.floor(enem/10)] || 0) + 1
  }

  for(var k = 0 ;k < opts.length;k++){
    for(var i = 0;i<iters;i++){
        // Fortschrittsbenachrichtigung senden, falls wir im Worker-Kontext sind
        if (typeof self !== 'undefined' && self.postMessage && i % Math.max(1, Math.floor(iters / 100)) === 0) {
            self.postMessage({
                type: 'progress',
                progress: {
                    iteration: i,
                    total: iters
                }
            });
        }
        sim(opts[k]);
    }
}
        
        var result = opts.map(o=>{
          var bossStatsIdx = o.bossStats.findIndex(b=>(b.kills || 0)<iters);
          return [
            o.ls*60,                        // Loot pro Minute
            o.enem/o.iters/10,              // Durchschnittliche Stage
            o.time/o.iters/60,              // Durchschnittliche Zeit in Minuten
            o.minEnem/10,                   // Minimale Stage
            o.maxEnem/10,                   // Maximale Stage
            (o.maxEnem >= (bossStatsIdx+1)*1000) ? o.bossStats[bossStatsIdx]?.hp/o.iters/enemies[(bossStatsIdx+1)*100].maxHp*100 : '--',  // Boss HP Prozent
            (o.maxEnem >= (bossStatsIdx+1)*1000) ? (o.bossStats[bossStatsIdx]?.kills || 0)/o.iters*100 : '--',  // Boss Kill-Rate Prozent
            (o.mat1/o.iters),               // Glac pro Run
            (o.mat2/o.iters),               // Quartz pro Run
            (o.mat3/o.iters),               // Tess pro Run
            (o.xp/o.iters),                 // XP pro Run
            o.extraGlac,                    // Überschüssiges Glac
            o.extraQuartz,                  // Überschüssiger Quartz
            o.extraTess,                    // Überschüssiges Tess
            o.extraXp,                      // Überschüssiges XP
            o.expectedLvl,                  // Erwartetes Level
            `${o.maxHp},${o.atk},${o.regen},${o.dr},${o.block},${o.effect},${o.charge},${o.chargeGain},${o.reload},${o.sc}`,  // Basis-Stats
            `${o.maxHp*(1 + o.soulCap * .005 * (1 + o.amp * .01))},${o.atk*(1 + o.soulCap * .005 * (1 + o.amp * .01))},${o.regen*(1 + o.soulCap * .005 * (1 + o.amp * .01))},${o.dr},${o.block},${o.effect},${o.charge},${o.chargeGain},${o.reload},${o.sc}`  // Soul-Buffed Stats
          ].concat(iterative ? [o.timeFromPrev/3600/24 || 0, (o.timeFromPrev/3600/24 || 0) + (Number(time1) || 0)] : [])
           .concat([JSON.stringify(Object.keys(o.progress).sort((a,b)=>Number(a)-Number(b)).reduce((prev,k)=>({...prev,[k]:o.progress[k]}),{}))])
        });
        return result;
}