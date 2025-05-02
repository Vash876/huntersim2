export function EVALBORGE(lvl,maxStage,hp,atk,regen,dr,evade,effect,critRate,critPower,aspd,revival,life,ua,impacts,omen,ll,pog,ultimaTalent,fow,ares,ylith,spartan,timeless,bfb,athena,baal,sensors,atlas,mino,helltouch,punches,weakspot,hermes,inhaler,gadget,iap,special,ultima,reviveCd,trample,scavengers,m0,r4,r7,r16,r19,i3,i4,i11,i13,i14,i23,i24,i27,i44,i60,i80,i84,i87,i88,i89,i91,creaGN1,creaGN2,creaGN3,innoGN3,attrGN2,attrGN3,attr,catchup99gu,lootgu,card,research81,iters, cm46,cm47,cm48) {
  
  var multi = (enemyNum) => Math.max(1, 1 +
Math.max(0,(enemyNum - 149) * .006)+
Math.max(0,(enemyNum - 199) * .006)+
Math.max(0,(enemyNum - 249) * .006)+
Math.max(0,(enemyNum - 299) * .006)+
Math.max(0,(enemyNum - 309) * .003)+
Math.max(0,(enemyNum - 319) * .003)+
Math.max(0,(enemyNum - 329) * .004)+
Math.max(0,(enemyNum - 339) * .004)+
Math.max(0,(enemyNum - 349) * .005)+
Math.max(0,(enemyNum - 359) * .005)+
Math.max(0,(enemyNum - 369) * .006)+
Math.max(0,(enemyNum - 379) * .006)+
Math.max(0,(enemyNum - 389) * .007))*Math.pow(1.01,Math.max(0,enemyNum-350))

        var simEnemy = (enemyNum) => ({
  maxHp: (9 + 4 * enemyNum) * multi(enemyNum)*Math.pow(2.85,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 90 : 1)*(enemyNum === 300 ? .9 : 1),
  hp: 1,
  atk: (2.5 + .7 * enemyNum) * multi(enemyNum)*Math.pow(2.85,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 3.63 : 1)*(enemyNum === 300 ? .9 : 1),
  critRate: Math.min(.25,(.0322 + .0004 * enemyNum + (enemyNum>0 && enemyNum%100 === 0 ? .04 : 0))),
  critDmg: Math.min(2.5,1.212 + .008 * enemyNum + (enemyNum>0 && enemyNum%100 === 0 ? .25 : 0)),
  dr: (1-(enemyNum>=200?(Math.max(0,Math.floor(Math.max(0,enemyNum-1)/100)-2))*.02+.04:0)) - (enemyNum>0 && enemyNum%100 === 0 ? .05 : 0),
  evade: enemyNum>=100?.004 + .004*(Math.max(0,(Math.floor(Math.max(0,enemyNum-1)/100))-1)):0,
  effect: enemyNum>=300?.04+.01*(Math.max(0,(Math.floor(Math.max(0,enemyNum-1)/100))-3)) + (enemyNum>0 && enemyNum%100 === 0 ? .04 : 0):0,
  regen: Math.max(0,.08 * Math.max(0,enemyNum-1) * multi(enemyNum)*Math.pow(1.052,Math.floor(Math.max(0,enemyNum-1)/100)))*(enemyNum>0 && enemyNum%100 === 0 ? 1.92 : 1)*(enemyNum === 300 ? .9 : 1),
  atkSpd: (4.526 - .006 * enemyNum)*(enemyNum>0 && enemyNum%100 === 0 ? 2.42 : 1)
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
        maxHp: (43+Number(i3)*6+Number(i27)*24+(2.5+Math.floor(hp/5)*.01)*hp)*gadgetMulti*(1+.03*r4)*(Boolean(card)?1.03:1)*(Boolean(creaGN1)?1.2:1)*(Boolean(creaGN2)?1.02:1)*(Boolean(creaGN3)?1+(Math.max(0,(Number(lvl)-39)*.015)):1)*(1+Number(i60)*.03)*(1+.05*Number(i84)),
        hp: 43+(3+Math.floor(hp/5)*.06)*hp*gadgetMulti,
        atk: (3+Number(i13)+2*Number(impacts)+(.5+Math.floor(atk/10)*.01)*atk)*gadgetMulti*(1+.03*r16)*(Boolean(innoGN3)?1.03:1)*(Boolean(card)?1.03:1)*(Boolean(creaGN2)?1.02:1)*(Boolean(creaGN3)?1+(Math.max(0,(Number(lvl)-39)*.01)):1)*(1+Number(i60)*.03)*Math.pow(1.05,Number(i87)),
        regen: (.02+.04*Number(ylith)+(.03+Math.floor(regen/30)*.01)*regen)*gadgetMulti*(Boolean(card)?1.03:1)*(Boolean(creaGN2)?1.02:1)*(Boolean(creaGN3)?1+(Math.max(0,(Number(lvl)-39)*.005)):1),
        dr: .0144*dr+(Boolean(creaGN2)?.02:0)+Number(i24)*.004+Number(i91)*.002,
        evade: .0034*evade+.01,
        effect: .005*effect+.04+(Boolean(innoGN3)?.03:0)+(Boolean(creaGN2)?.02:0)+Number(i11)*.02+Number(i89)*.002,
        critRate: .05+.0018*critRate+(Boolean(creaGN2)?.02:0)+Number(i4)*.0065+Number(i88)*.004,
        critPower: .01*critPower+1.3,
        reload: 5-.03*aspd-Number(i23)*.04,
        baseStats: `${hp}/${atk}/${regen} ${dr}/${evade}/${effect} ${critRate}/${critPower}/${aspd}`
    }
}
var gadgetMulti = Math.pow(1.001,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var gadgetLootMulti = Math.pow(1.005,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var getBaseStatsRecord = ()=>{
    return {
        basehp: Number(hp),
        baseatk: Number(atk),
        baseregen: Number(regen),
        basedr: Number(dr),
        baseevade: Number(evade),
        baseeffect: Number(effect),
        basereload: Number(aspd),
    }
}
var getTalents = ()=>{
    return {
        revival:Number(revival), life:Number(life), ua:Number(ua), impacts:Number(impacts), omen:Number(omen), ll:Number(ll), pog:Number(pog), fow:Number(fow), ultimaTalent:Number(ultimaTalent)
    }
}
var getPath = ()=>{
    return {
        ares:Number(ares),ylith:Number(ylith),spartan:Number(spartan),timeless:Number(timeless),bfb:Number(bfb),athena:Number(athena),baal:Number(baal),sensors:Number(sensors),atlas:Number(atlas),mino:Number(mino),helltouch:Number(helltouch),punches:Number(punches),weakspot:Number(weakspot),hermes:Number(hermes),inhaler:Number(inhaler)
    }
}




var baseBorge = {
  lvl: Math.floor(Number(lvl)),
  maxStage: maxStage,
  loot:0,
  enem:0,
  iters:0,
  time:0,
  minEnem:50000,
  maxEnem:0,
  mat1:0,
  mat2:0,
  mat3:0,
  xp:0,
  progress: {},
  bossStats:[{},{},{},{},{},{},{},{},{},{}],
  ...getBaseStats(),
  ...getTalents(),
  ...getPath(),
  ...getBaseStatsRecord()
}


var prepBorge = (borgeBase)=>{
  var borge = {...borgeBase};
  borge.maxHp *= (1+.01*borge.ultimaTalent)*(1+.01*borge.ares);
  borge.regen *= (1+.01*borge.ultimaTalent)*(1+.009*borge.ylith);
  borge.atk *= (1+.01*borge.ultimaTalent)*(1+.002*borge.ares)*(1+.01*borge.mino);
  borge.dr += .015*borge.spartan;
  borge.critRate += .044*borge.punches + .004*borge.hermes;
  borge.critPower += .08*borge.punches + .01*borge.hermes;
  borge.effect += .012*borge.sensors + .004*borge.hermes;
  borge.evade += .016*borge.sensors;
  borge.lifesteal = .0111*borge.baal;
  
  return borge
}
var opts = [prepBorge(baseBorge)]


var sim = (borge) => {
    var enem = 0;
    var time = 0;
    borge.evadeStacks = 0;
    borge.hp = borge.maxHp;
    borge.currentMaxHp = borge.maxHp;
    borge.currentAtk = borge.atk * (Number(attr) ? (Math.pow(Math.pow(1.08,Number(catchup99gu)),1+Number(attr)*.1-.1)) : 1);
    borge.currentRegen = borge.regen;
    borge.currentDr = borge.dr;
    borge.currentEffect = borge.effect;
    borge.currentCritRate = borge.critRate;
    borge.revives = borge.revival;
    borge.time += 40-Math.min(Number(reviveCd),30);
    borge.maxStage = Math.max(borge.maxStage,Math.floor(borge.maxEnem/10))
    borge.remainingBullets = 0;
    var furyEnabled = false;
    var trampleDamage = 0;
    var fowRemaining = 0;
    var currentEnemy = enemies[0];
    currentEnemy.hp = currentEnemy.maxHp;
    var regen = () => {
      borge.hp = Math.min(borge.currentMaxHp, borge.hp + borge.currentRegen+borge.inhaler*.0008*(borge.currentMaxHp-borge.hp))
      currentEnemy.hp = Math.min(currentEnemy.maxHp, currentEnemy.hp + currentEnemy.regen * (1-borge.omen*.08/(enem>0&&enem%1000===0?2:1)))
      nextRegen = time + 1;
     
      if (currentEnemy.hp <= 0) { killEnemy() }
    }
    var fury = (enabled) => {
      furyEnabled = enabled;
      var stunRemaining = Math.max(0,currentEnemy.stunEnd-time);
      if(enabled){
        nextFury = time+5;
        nextEnemAtk = time + ((nextEnemAtk- stunRemaining) - time)/3 + stunRemaining
        nextBossBonusAtk = time + ((nextBossBonusAtk-stunRemaining) - time)/3 + stunRemaining
      }
      else{
        nextFury = time+60;
        nextEnemAtk = time + ((nextEnemAtk-stunRemaining) - time)*3 + stunRemaining
        nextBossBonusAtk = time + ((nextBossBonusAtk-stunRemaining) - time)*3 + stunRemaining
      }
    }
    var enemyAttack = (isBonus) => {
      var dmg = currentEnemy.atk * (1 - borge.currentDr) * (1-.01*borge.mino);
      
      if(enem > 0 && enem % 1000 === 0){
        currentEnemy.enrage++;
        var speedMod = furyEnabled ? 3 : 1;
        if(isBonus){
          nextBossBonusAtk = time + Math.max(.5,currentEnemy.atkSpd*1.8/speedMod-currentEnemy.enrage*(currentEnemy.atkSpd*1.8/speedMod/200))
          nextEnemAtk = nextEnemAtk - (Math.max(.5,currentEnemy.atkSpd/speedMod-(currentEnemy.enrage-1)*(currentEnemy.atkSpd/speedMod/200))-Math.max(.5,currentEnemy.atkSpd/speedMod-currentEnemy.enrage*(currentEnemy.atkSpd/speedMod/200)))
        }
        else{
          nextEnemAtk = time + Math.max(.5,currentEnemy.atkSpd/speedMod-currentEnemy.enrage*(currentEnemy.atkSpd/speedMod/200))
          nextBossBonusAtk = nextBossBonusAtk - (Math.max(.5,currentEnemy.atkSpd*1.8/speedMod-(currentEnemy.enrage-1)*(currentEnemy.atkSpd*1.8/speedMod/200))-Math.max(.5,currentEnemy.atkSpd*1.8/speedMod-currentEnemy.enrage*(currentEnemy.atkSpd*1.8/speedMod/200)))
        }
      }
      else{
        nextEnemAtk = time + currentEnemy.atkSpd
      }
      if (ck(borge.evade)) {
        dmg = 0;
      }
      else if (ck(currentEnemy.critRate)) {
        dmg *= currentEnemy.critDmg * (1-.11*borge.weakspot)
      }
      borge.hp -= dmg;
      currentEnemy.hp -= .08*borge.helltouch*dmg*(enem > 0 && enem%1000===0?.1:1);
      if(currentEnemy.hp <= 0){
        killEnemy();
      }
      if(ck(currentEnemy.effect)){
        borge.currentDr = Math.max(0,borge.currentDr - .02)
      }
      if (borge.revives && borge.hp <= 0) {
        borge.hp = .8 * borge.currentMaxHp
        borge.revives--
        borge.time+=3;
        if(furyEnabled){
          nextFury-=3;
        }
        borge.currentDr = borge.dr + (enem%1000===0?.007*borge.atlas:0)
      }
    }
    var killEnemy = () => {
      if(enem>0 && enem % 1000 === 0) {
        borge.currentDr-=.007*borge.atlas;
        borge.currentEffect-=.014*borge.atlas;
        borge.currentCritRate-=.025*borge.atlas;
        furyEnabled = false;
        nextFury = 99999999;
        enem+=10;
      }
      else{
        enem++;
      }
      if(enem%10===0){
          currentEnemy = enemies[Math.floor(enem/10)]
      }
      while(trampleDamage >= currentEnemy.maxHp && enem%10!==0){
        currentEnemy.hp = 0;
        trampleDamage-=currentEnemy.maxHp;
        enem++;
      }
      if(enem%10===0){
          currentEnemy = enemies[Math.floor(enem/10)]
      }
      if(enem === 1000){
        borge.currentAtk=borge.atk;
      }
      
      trampleDamage = 0;
      currentEnemy.hp = currentEnemy.maxHp*(1-.04*borge.pog*(enem > 0 && enem%1000===0?.5:1));
        
      currentEnemy.enrage=0;
      currentEnemy.stunEnd=0;
      if (borge.hp < borge.currentMaxHp && borge.ua && ck(borge.currentEffect)) {
        borge.hp = Math.min(borge.currentMaxHp, borge.hp+borge.currentMaxHp*borge.ua*.02)
      }
      nextEnemAtk = time + currentEnemy.atkSpd
      if(enem > 0 && enem%1000 === 0){
        borge.currentDr+=.007*borge.atlas;
        borge.currentEffect+=.014*borge.atlas;
        borge.currentCritRate+=.025*borge.atlas;
        if(enem === 1000){
          borge.currentAtk=borge.atk;
        }
        if(enem>=2000){
          nextBossBonusAtk = time + currentEnemy.atkSpd*1.8;
        }
        if(enem >= 3000){
          nextFury = time + 60;
        }
      }
      else{
        nextBossBonusAtk = 99999999;
      }
          
    }
    var atk = (isAthena) => {
      var evaded = currentEnemy.evade>0 && ck(currentEnemy.evade);
      var dmg = evaded ? 0 : (borge.currentAtk * (1+.1*borge.bfb*(1-borge.hp/borge.currentMaxHp)) * (isAthena ? borge.critPower * 1.5 : (ck(borge.currentCritRate) ? borge.critPower : 1) ))
      currentEnemy.hp -= dmg * currentEnemy.dr;
      if(dmg>currentEnemy.maxHp*2 && Boolean(trample)) trampleDamage = dmg - currentEnemy.maxHp;
      if (currentEnemy.hp <= 0) { killEnemy() }
      
      borge.hp = Math.min(borge.currentMaxHp, borge.hp + borge.lifesteal*dmg)
      if(borge.life && ck(borge.currentEffect)){
        borge.hp = Math.min(borge.currentMaxHp, borge.hp + .06*borge.life*dmg)
      }


     
      if(!evaded){
        if(borge.impacts && ck(borge.currentEffect)){
          nextEnemAtk+=borge.impacts*.1/(enem > 0 && enem%1000===0?2:1) - Math.max(0,currentEnemy.stunEnd-time);
          nextBossBonusAtk+=borge.impacts*.1/(enem > 0 && enem%1000===0?2:1) - Math.max(0,currentEnemy.stunEnd-time);
          currentEnemy.stunEnd = time + borge.impacts*.1/(enem > 0 && enem%1000===0?2:1);
        }
        if(borge.fow && ck(borge.currentEffect)){
          fowRemaining = borge.fow*.1;
        }
      }
      var divisor = 1;
      if(enem<1000 && Number(attr)){
        divisor = (Math.pow(Math.pow(1.08,Number(catchup99gu)),1+Number(attr)*.1-.1))
      }
      if(enem > 0 && enem%1000 === 0){
        divisor = 1/(1-.04*borge.atlas);
      }
      if(isAthena){
        nextAthena = time + borge.reload*6/divisor;
      }
      else{
        nextAtk = time + borge.reload/divisor;
      }
      if(fowRemaining){
        var nextReloadTime = Math.min(nextAthena-time,nextAtk-time);
        if(nextReloadTime/2>=fowRemaining){
          nextAthena -= fowRemaining;
          nextAtk-=fowRemaining;
          fowRemaining = 0;
        }
        else{
          nextAthena -= nextReloadTime/2;
          nextAtk -= nextReloadTime/2;
          fowRemaining = fowRemaining - nextReloadTime/2;
        }
      }
    }
    var nextAtk = borge.reload;
    var nextAthena = borge.athena ? borge.reload*6 : 999999999;
    var nextEnemAtk = currentEnemy.atkSpd;
    var nextRegen = 1;
    var nextBossBonusAtk = 999999999
    var nextFury = 999999999;
    while (borge.hp > 0) {
      time = Math.min(nextAtk,nextEnemAtk,nextRegen,nextAthena,nextBossBonusAtk,nextFury)    
      if(time == nextRegen)
          regen()
      else if(time == nextEnemAtk)
          enemyAttack()
      else if(time == nextAtk)
          atk()
      else if(time == nextAthena)
          atk(true)
      else if(time == nextBossBonusAtk)
          enemyAttack(true)
      else if(time == nextFury)
          fury(!furyEnabled)
    }
    for(var i = 0; i<10; i++){
      if(enem<(i+1)*1000){
        borge.bossStats[i].hp = (borge.bossStats[i].hp || 0) + enemies[(i+1)*100].maxHp;
      }
      else if(enem === (i+1)*1000){
        borge.bossStats[i].hp = (borge.bossStats[i].hp || 0) + enemies[(i+1)*100].hp;
      }
      else{
        borge.bossStats[i].kills = (borge.bossStats[i].kills || 0) + 1;
      }
    }
    var mat1 = [1,1.1,1.3,1.5,1.7,2,3.2]
    var mat2 = [1,1.2,1.4,2.8]      
    var mat3 = [.8,1,1.8]        
    var xp = [1,1.2]


    var normalized = (3*mat1.reduce((a, b) => a + b) / mat1.length+3*mat2.reduce((a, b) => a + b) / mat2.length+3*mat3.reduce((a, b) => a + b) / mat3.length+xp.reduce((a, b) => a + b) / xp.length)/10


    var stageGrowth = 1.051;
    var enemiesInSection = 1010;
    var excludedXpMultis = (Boolean(attrGN2)?1.5:1)*Math.pow(2,Math.floor((Number(maxStage)-1)/100))*Math.pow(2,Number(r19))
    var includedMultis = (1+borge.timeless*.14)*gadgetLootMulti*(Boolean(card)?1.05:1)*(1+Number(i60)*.03);
    var excludedMultis = Math.max(Number(special),1)*(Boolean(iap)?1.25:1)*Math.max(Number(ultima),1)*Math.pow(1.05,Number(scavengers))*Math.pow(1.02,Number(m0))*Math.pow(1.05,Number(r7))*(Boolean(attrGN3)?1.25:1)*(Math.pow(Math.pow(1.07,Number(lootgu)),1+Number(attr)*.1-.1))*Math.pow(1.1,Number(i14))*Math.pow(1.1,Number(i80))*Math.pow(1.08,Number(i44))*(Number(research81)>=1?1.1:1)*(Number(research81)>=4?1.2:1)*(Number(cm46)>0?1.03:1)*(Number(cm47)>0?1.02:1)*(Number(cm48)>0?1.07:1);
    var loopLoot = normalized*((Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(enem,enemiesInSection-10)-Math.floor(Math.min(enem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10)))*includedMultis*(1+borge.ll*.2*borge.effect);
    var bonusMulti = 1;
    var tempEnem = enem;
    while(tempEnem>=enemiesInSection){
        tempEnem-=enemiesInSection;
        enemiesInSection = 1000;


        bonusMulti*=Math.pow(stageGrowth,100)


        borge.mat1+=bonusMulti*mat1[mat1.length-1]*800*includedMultis*excludedMultis;
        borge.mat2+=bonusMulti*mat2[mat2.length-1]*600*includedMultis*excludedMultis;
        borge.mat3+=bonusMulti*mat3[mat3.length-1]*400*includedMultis*excludedMultis;
        borge.xp+=bonusMulti*xp[xp.length-1]*300*includedMultis*excludedMultis*excludedXpMultis;


        borge.loot+=bonusMulti*mat1[mat1.length-1]*800*includedMultis;
        borge.loot+=bonusMulti*mat2[mat2.length-1]*600*includedMultis;
        borge.loot+=bonusMulti*mat3[mat3.length-1]*400*includedMultis;
        borge.loot+=bonusMulti*xp[xp.length-1]*300*includedMultis;


        bonusMulti*=5;


        loopLoot += bonusMulti*normalized*stageGrowth*((Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(tempEnem,enemiesInSection-10)-Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)))*includedMultis*(1+borge.ll*.2*borge.effect);
    }
    borge.mat1+=loopLoot*3/10*mat1.reduce((a, b) => a + b) / mat1.length/normalized*excludedMultis;
    borge.mat2+=loopLoot*3/10*mat2.reduce((a, b) => a + b) / mat2.length/normalized*excludedMultis;
    borge.mat3+=loopLoot*3/10*mat3.reduce((a, b) => a + b) / mat3.length/normalized*excludedMultis;
    borge.xp+=loopLoot*1/10*xp.reduce((a, b) => a + b) / xp.length/normalized*excludedMultis*excludedXpMultis;
    borge.loot+=loopLoot;
    borge.time+=time;
    borge.enem+=enem;
    borge.ls=borge.loot/borge.time;
    borge.iters++;
   
    borge.minEnem=Math.min(borge.minEnem,enem)
    borge.maxEnem=Math.max(borge.maxEnem,enem)
    borge.progress[Math.floor(enem/10)] = (borge.progress[Math.floor(enem/10)] || 0) + 1
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
              return ([
                o.ls*60,
                o.enem/o.iters/10,
                o.time/o.iters/60,
                o.minEnem/10,
                o.maxEnem/10,
                (o.maxEnem >= (bossStatsIdx+1)*1000) ? o.bossStats[bossStatsIdx]?.hp/o.iters/enemies[(bossStatsIdx+1)*100].maxHp*100 : '--',
                (o.maxEnem >= (bossStatsIdx+1)*1000) ? (o.bossStats[bossStatsIdx]?.kills || 0)/o.iters*100 : '--',
                (o.mat1/o.iters),
                (o.mat2/o.iters),
                (o.mat3/o.iters),
                (o.xp/o.iters),
                `${o.maxHp},${o.atk},${o.regen},${o.dr},${o.evade},${o.effect},${o.critRate},${o.critPower},${o.reload}`,
                JSON.stringify(Object.keys(o.progress).sort((a,b)=>Number(a)-Number(b)).reduce((prev,k)=>({...prev,[k]:o.progress[k]}),{}))
              ])
            })
            return result;
}