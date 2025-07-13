export function EVALOZZY(lvl,maxStage,hp,atk,regen,dr,evade,effect,multistrike,multistrikePower,aspd,revival,trickster,ua,thousandNeedles,omen,ll,crippling,ultimaTalent,echoBullets,lotl,exo,scorp,dod,cat,timeless,wings,exterm,medusa,scarab,vectid,snek,cod,dwd,sisters,gadget,iap,special,ultima,reviveCd,scavengers,m0,r4,r7,r17,i31,i32,i33,i36,i37,i40,i81,i86,i92,innoGN2,innoGN3,attrGN3,attr,catchup99gu,lootgu,card,research81,iters,cm46,cm47,cm48,cm51,creastat) {
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
  maxHp: (11+6 * enemyNum) * multi(enemyNum)*Math.pow(2.9,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 48 : 1)*(enemyNum === 300 ? .94 : 1),
  hp: 1,
  atk: (1.35+ .75 * enemyNum) * multi(enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 3 : 1)*(enemyNum === 300 ? .94 : 1),
  critRate: Math.min(.25,(.0994 + .0006 * enemyNum + (enemyNum>0 && enemyNum%100 === 0 ? .1 : 0))),
  critDmg: Math.min(2.5,1.03 + .008 * enemyNum),
  dr: (1-(enemyNum>=200?(Math.max(0,Math.floor((enemyNum-1)/100)-2))*.02+.04:0)) - (enemyNum>0 && enemyNum%100 === 0 ? .05 : 0),
  evade: enemyNum>=100?.01+.01*(Math.max(0,(Math.floor((enemyNum-1)/100))-1)):0,
  effect: enemyNum>=300?.04+.01*(Math.max(0,(Math.floor((enemyNum-1)/100))-3)) + (enemyNum>0 && enemyNum%100 === 0 ? .04 : 0):0,
  regen: Math.max(0,-.08 +.1* (enemyNum) * multi(enemyNum)*Math.pow(1.25,Math.floor(Math.max(0,enemyNum-1)/100)))*(enemyNum>0 && enemyNum%100 === 0 ? 6 : 1)*(enemyNum === 300 ? .97 : 1),
  atkSpd: (3.2 - .004 * enemyNum)*(enemyNum>0 && enemyNum%100 === 0 ? 2.45 : 1),
  maxDps: 999*(1.35+ .75 * enemyNum) * multi(enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 3 : 1)*Math.min(2.5,1.03 + .008 * enemyNum)/(3.2 - .004 * enemyNum)
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
        maxHp: (16+(2+Math.floor(hp/5)*.03)*hp)*gadgetMulti*(1+.03*r4)*(Boolean(card)?1.03:1)*crea4GUMulti,
        hp: 16+(2+Math.floor(hp/5)*.03)*hp*gadgetMulti*crea4GUMulti,
        atk: (2+(.3+Math.floor(atk/10)*.01)*atk)*gadgetMulti*(1+.03*r17)*(Boolean(innoGN3)?1.03:1)*(Boolean(card)?1.03:1)*crea4GUMulti,
        regen: (.1+(.05+Math.floor(regen/30)*.01)*regen)*gadgetMulti*(Boolean(innoGN2)?1.25:1)*(Boolean(card)?1.03:1)*crea4GUMulti,
        dr: .0035*dr+.0111*Number(i37)+.002*Number(i86),
        evade: .0062*evade+.05,
        effect: .0035*effect+.04+.006*Number(i31)+.002*Number(i92),
        multistrike: .05+.0038*multistrike+(Boolean(innoGN3)?.03:0) + .005*Number(i40),
        multistrikePower: .01*multistrikePower+.25,
        reload: 4-.02*aspd - .03*Number(i36),
        baseStats: `${hp}/${atk}/${regen} ${dr}/${evade}/${effect} ${multistrike}/${multistrikePower}/${aspd}`
    }
}

var gadgetMulti = Math.pow(1.001,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var gadgetLootMulti = Math.pow(1.005,Number(gadget)) * Math.pow(1.02,Math.floor(Number(gadget)/10))
var crea4GUMulti = 1 + Number(creastat) * 0.01; 


var getBaseStatsRecord = ()=>{
    return {
        basehp: Number(hp),
        baseatk: Number(atk),
        baseregen: Number(regen),
        basedr: Number(dr),
        baseevade: Number(evade),
        baseeffect: Number(effect),
        basecharge: Number(multistrike),
        basechargeGain: Number(multistrikePower),
        basereload: Number(aspd),
    }
}
var getTalents = ()=>{
    return {
        revival:Number(revival), trickster:Number(trickster), ua:Number(ua), thousandNeedles:Number(thousandNeedles), omen:Number(omen), ll:Number(ll), crippling:Number(crippling), echoBullets:Number(echoBullets), ultimaTalent:Number(ultimaTalent)
    }
}
var getPath = ()=>{
    return {
        lotl:Number(lotl), exo:Number(exo), scorp:Number(scorp), dod:Number(dod), cat:Number(cat), timeless:Number(timeless), wings:Number(wings), exterm:Number(exterm), medusa:Number(medusa), scarab:Number(scarab), vectid:Number(vectid),snek:Number(snek),cod:Number(cod),dwd:Number(dwd),sisters:Number(sisters)
    }
}




var baseOzzy = {
  lvl: Math.floor(Number(lvl)),
  maxStage: maxStage,
  loot:0,
  enem:0,
  iters:0,
  time:0,
  minEnem:5000,
  maxEnem:0,
  mat1:0,
  mat2:0,
  mat3:0,
  xp:0,
  bossKill:0,
  bossHp:0,
  progress: {},
  bossStats:[{},{},{},{},{},{},{},{},{},{}],
  ...getBaseStats(),
  ...getTalents(),
  ...getPath(),
  ...getBaseStatsRecord()
}


var prepOzzy = (ozzyBase)=>{
  var ozzy = {...ozzyBase};
  ozzy.maxHp *= (1+.02*ozzy.lotl)*(1+.01*ozzy.ultimaTalent);
  ozzy.regen *= (1+.02*ozzy.lotl)*(1+.01*ozzy.ultimaTalent);
  ozzy.atk *= (1+.012*ozzy.exo)*(1+.02*ozzy.cat)*(1+.01*ozzy.ultimaTalent);
  ozzy.reload -= .06*ozzy.thousandNeedles;
  ozzy.dr += .026*ozzy.wings;
  ozzy.effect += .028*ozzy.exterm;
  ozzy.evade += .005*ozzy.wings;
  ozzy.lifesteal = .033*ozzy.scorp;


  ozzy.reload*=(1-.004*ozzy.cat)


  ozzy.hp = ozzy.maxHp;
  return ozzy
}
var opts = [prepOzzy(baseOzzy)]


var sim = (ozzy) => {
    var enem = 0;
    var time = 0;
    var vectidStacks = 0;
    var cripplingActive = false;
    ozzy.evadeStacks = 0;
    ozzy.hp = ozzy.maxHp;
    ozzy.currentMaxHp = ozzy.maxHp;
    ozzy.currentAtk = ozzy.atk*(Math.pow(Math.pow(1.08,Number(catchup99gu)),1+Number(attr)*.1-.1));
    ozzy.currentRegen = ozzy.regen;
    ozzy.currentDr = ozzy.dr;
    ozzy.currentMultistrike = ozzy.multistrike;
    ozzy.currentMultistrikePower = ozzy.multistrikePower;
    ozzy.revives = ozzy.revival+ozzy.sisters;
    ozzy.time += 40-Math.min(Number(reviveCd),30);
    ozzy.maxStage = Math.max(ozzy.maxStage,Math.floor(ozzy.maxEnem/10))
    ozzy.remainingBullets = 0;
    var currentEnemy = enemies[0];
    currentEnemy.hp = currentEnemy.maxHp;
    var regen = () => {
      var medDmg = 0;
      if(enem%1000 === 0 && enem>=3000){
        medDmg = currentEnemy.regen*.2*(time>hardenEnd?1:3)
      }
      ozzy.hp = Math.min(ozzy.currentMaxHp, ozzy.hp - medDmg + ozzy.currentRegen*(vectidStacks ? (1+.15*ozzy.vectid) : 1))
      if(time>hardenEnd) currentEnemy.hp = Math.min(currentEnemy.maxHp, currentEnemy.hp + currentEnemy.regen*(1-.088*ozzy.snek)-.06*ozzy.medusa*ozzy.currentRegen*(vectidStacks ? (1+.15*ozzy.vectid) : 1))
      nextRegen = time + 1;
     
      vectidStacks = Math.max(0, vectidStacks - 1)
      if (currentEnemy.hp <= 0) { killEnemy() }
    }
    var harden = () => {
      if(!hardenEnd){
        hardenEnd = time+5;
        nextEnemAtk+=5 - Math.max(0,currentEnemy.stunEnd-time);
        nextHarden = Math.ceil(time*3)/3;
      }
      else{
        currentEnemy.hp = Math.min(currentEnemy.maxHp, currentEnemy.hp + currentEnemy.regen*(1-.088*ozzy.snek)-.06*ozzy.medusa*ozzy.currentRegen*(vectidStacks ? (1+.15*ozzy.vectid) : 1))
        nextHarden = time + 1/3;
        if(nextHarden>hardenEnd){
          nextHarden = time+25
          hardenEnd = 0;
          currentEnemy.enrage+=5;
          nextEnemAtk = nextEnemAtk - (Math.max(.5,currentEnemy.atkSpd-(currentEnemy.enrage-5)*(currentEnemy.atkSpd/200))-Math.max(.5,currentEnemy.atkSpd-currentEnemy.enrage*(currentEnemy.atkSpd/200)))
        }
      }
    }
    var enemyAttack = () => {
      var dmg = currentEnemy.atk;
      
      if(enem > 0 && enem % 1000 === 0){
        currentEnemy.enrage++;
        if(currentEnemy.enrage>200){
          dmg*=3
        } 
        nextEnemAtk = time + Math.max(.5,currentEnemy.atkSpd-currentEnemy.enrage*(currentEnemy.atkSpd/200))
      }
      else{
        nextEnemAtk = time + currentEnemy.atkSpd
      }
      
       
      if(ozzy.evadeStacks){
        dmg=0;
        ozzy.evadeStacks--;
      }
      else if (ck(ozzy.evade)) {
        dmg = 0;
      }
      else if (currentEnemy.enrage>200 || ck(currentEnemy.critRate)) {
        dmg *= currentEnemy.critDmg
        if(ck(ozzy.dod*.15)){
          ozzy.evadeStacks++;
        }
      }
      if(ck(currentEnemy.effect)){
        ozzy.currentDr = Math.max(0,ozzy.currentDr - .02)
      }
      ozzy.hp -= dmg * (1 - ozzy.currentDr) * (1-.01*ozzy.scarab);
    }
    var killEnemy = () => {
      hardenEnd = 0;
      if(enem>0 && enem % 1000 === 0)
        enem+=10;
      else{
        enem++;
      }
      if(enem === 1000){
        ozzy.currentAtk/=(Math.pow(Math.pow(1.08,Number(catchup99gu)),1+Number(attr)*.1-.1))
      }
      if(enem%1000 === 0 && enem>=2000){
        nextHarden = time+25
      }
      else{
        nextHarden = 99999999
      }
      if(enem%10===0)
          currentEnemy = enemies[Math.floor(enem/10)]
          
      currentEnemy.hp = currentEnemy.maxHp;
        
      currentEnemy.enrage=0;
      currentEnemy.stunEnd=0;
      if (ozzy.hp < ozzy.currentMaxHp && ozzy.ua && ck(ozzy.effect)) {
        ozzy.hp = Math.min(ozzy.currentMaxHp, ozzy.hp+ozzy.currentMaxHp*ozzy.ua*.02)
        vectidStacks = 5;
      }
      if((enem > 0 && enem % 1000 === 0) || (currentEnemy.maxDps * (1 - ozzy.currentDr) > ozzy.currentRegen)){
          nextEnemAtk = time + currentEnemy.atkSpd
      }
      else{
        nextEnemAtk = 9999999;
      }
      if(currentEnemy.hp <= 0){
        killEnemy();
      }
    }
    var atk = (skipAtkReset, dmgMod, isMultistrike) => {
      var evaded = currentEnemy.evade>0 && ck(currentEnemy.evade);
      currentEnemy.hp -= evaded ? 0 : (ozzy.currentAtk*(dmgMod||1)+ozzy.omen*.008*currentEnemy.hp/(enem > 0 && enem%1000===0?10:1))*(cripplingActive?1+.03*ozzy.crippling:1)*(time<hardenEnd?.05:currentEnemy.dr);
      if (currentEnemy.hp <= 0) { killEnemy() }
     
      var ms = !isMultistrike && ck(ozzy.currentMultistrike);
      if(ms){
        nextMultistrike = time+.3
      }
      
      ozzy.hp = evaded?ozzy.hp:Math.min(ozzy.currentMaxHp, ozzy.hp + ozzy.lifesteal*ozzy.currentAtk*dmgMod)


      if(!evaded && ozzy.crippling){
        cripplingActive = ck(ozzy.effect)
      }
     
      if(!skipAtkReset){
        if(!evaded){
          if(ozzy.echoBullets && ck(ozzy.effect/2)){
            nextEchoBullet = time+.3001
          }
          if(ozzy.trickster && ck(ozzy.effect/2)){
            ozzy.evadeStacks++;
          }
          if(time>hardenEnd && ozzy.thousandNeedles && ck(ozzy.effect)){
            nextEnemAtk+=ozzy.thousandNeedles*.05/(enem%1000===0?2:1)
            currentEnemy.stunEnd = time + ozzy.thousandNeedles*.05/(enem%1000===0?2:1);
          }
        }
        var divisor = 1;
        if(enem<1000){
          divisor = (Math.pow(Math.pow(1.08,Number(catchup99gu)),1+Number(attr)*.1-.1))
        }
        nextAtk =  time + ozzy.reload/divisor;
      }
    }
    var nextAtk = ozzy.reload;
    var nextEchoBullet = 99999999;
    var nextEnemAtk = currentEnemy.atkSpd;
    var nextRegen = 1;
    var nextMultistrike = 99999999
    var nextHarden = 99999999
    var hardenEnd = 0;
    while (ozzy.hp > 0) {
      time = Math.min(nextAtk,nextEchoBullet,nextMultistrike,nextEnemAtk,nextRegen,nextHarden) 
      if(time == nextRegen)
          regen()
      else if(time == nextMultistrike){
          atk(true,ozzy.currentMultistrikePower,true)
          nextMultistrike = 99999999;
      }
      else if(time == nextEchoBullet){
          atk(true,.05*ozzy.echoBullets)
          nextEchoBullet = 99999999;
      }
      else if(time == nextEnemAtk)
          enemyAttack()
      else if(time == nextHarden)
          harden()
      else if(time == nextAtk)
          atk(false,1)

      
      if (ozzy.revives && ozzy.hp <= 0) {
        ozzy.hp = .8 * ozzy.currentMaxHp
        ozzy.revives--
        ozzy.currentAtk=ozzy.atk*(1+.02*ozzy.dwd*(ozzy.revival+ozzy.sisters-ozzy.revives))
        ozzy.currentDr=ozzy.dr + .016*ozzy.dwd*(ozzy.revival+ozzy.sisters-ozzy.revives)
        ozzy.currentMultistrike += .023*ozzy.cod;
        ozzy.currentMultistrikePower += .02*ozzy.cod;
      }
    }
    
    for(var i = 0; i<10; i++){
      if(enem<(i+1)*1000){
        ozzy.bossStats[i].hp = (ozzy.bossStats[i].hp || 0) + enemies[(i+1)*100].maxHp;
      }
      else if(enem === (i+1)*1000){
        ozzy.bossStats[i].hp = (ozzy.bossStats[i].hp || 0) + enemies[(i+1)*100].hp;
      }
      else{
        ozzy.bossStats[i].kills = (ozzy.bossStats[i].kills || 0) + 1;
      }
    }
    var mat1 = [1,1.2,1.4,1.6,1.8,2.5,3.2]
    var mat2 = [1.1,1.3,1.4,2.8]    
    var mat3 = [.9,1,1.95] 
    var xp = [1.2,1.6]


    var normalized = (3*mat1.reduce((a, b) => a + b) / mat1.length+3*mat2.reduce((a, b) => a + b) / mat2.length+3*mat3.reduce((a, b) => a + b) / mat3.length+xp.reduce((a, b) => a + b) / xp.length)/10

    var stageGrowth = 1.059;
    var enemiesInSection = 1010;
    var excludedXpMultis = Math.pow(1.75,Number(i33))*Math.pow(2,Math.floor((Number(maxStage)-1)/100))
    var includedMultis = (1+ozzy.timeless*.16)*(1+.05*ozzy.scarab)*gadgetLootMulti*(Boolean(card)?1.05:1);
    var excludedMultis = Math.max(Number(special),1)*(Boolean(iap)?1.25:1)*Math.max(Number(ultima),1)*Math.pow(1.05,Number(scavengers))*Math.pow(1.02,Number(m0))*Math.pow(1.05,Number(r7))*(Boolean(attrGN3)?1.25:1)*(Math.pow(Math.pow(1.04,Number(lootgu)),1+Number(attr)*.1-.1))*Math.pow(1.5,Number(i32))*Math.pow(1.1,Number(i81))*(Number(research81)>=2?1.1:1)*(Number(research81)>=5?1.2:1)*(Number(cm46)>0?1.03:1)*(Number(cm47)>0?1.02:1)*(Number(cm48)>0?1.07:1)*(Number(cm51)>0?1.05:1);;
    var loopLoot = normalized*((Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(enem,enemiesInSection-10)-Math.floor(Math.min(enem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(enem,enemiesInSection-10)/10)))*includedMultis*(1+ozzy.ll*.2*ozzy.effect);
    var bonusMulti = 1;
    var tempEnem = enem;
    while(tempEnem>=enemiesInSection){
        tempEnem-=enemiesInSection;
        enemiesInSection = 1000;


        bonusMulti*=Math.pow(stageGrowth,100)


        ozzy.mat1+=bonusMulti*mat1[mat1.length-1]*800*includedMultis*excludedMultis;
        ozzy.mat2+=bonusMulti*mat2[mat2.length-1]*600*includedMultis*excludedMultis;
        ozzy.mat3+=bonusMulti*mat3[mat3.length-1]*400*includedMultis*excludedMultis;
        ozzy.xp+=bonusMulti*xp[xp.length-1]*300*includedMultis*excludedMultis*excludedXpMultis;


        ozzy.loot+=bonusMulti*mat1[mat1.length-1]*800*includedMultis;
        ozzy.loot+=bonusMulti*mat2[mat2.length-1]*600*includedMultis;
        ozzy.loot+=bonusMulti*mat3[mat3.length-1]*400*includedMultis;
        ozzy.loot+=bonusMulti*xp[xp.length-1]*300*includedMultis;


        bonusMulti*=5;


        loopLoot += bonusMulti*normalized*stageGrowth*((Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10))-1)/(stageGrowth-1)*10+(Math.min(tempEnem,enemiesInSection-10)-Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)*10)*Math.pow(stageGrowth,Math.floor(Math.min(tempEnem,enemiesInSection-10)/10)))*includedMultis*(1+ozzy.ll*.2*ozzy.effect);
    }
    ozzy.mat1+=loopLoot*3/10*mat1.reduce((a, b) => a + b) / mat1.length/normalized*excludedMultis;
    ozzy.mat2+=loopLoot*3/10*mat2.reduce((a, b) => a + b) / mat2.length/normalized*excludedMultis;
    ozzy.mat3+=loopLoot*3/10*mat3.reduce((a, b) => a + b) / mat3.length/normalized*excludedMultis;
    ozzy.xp+=loopLoot*1/10*xp.reduce((a, b) => a + b) / xp.length/normalized*excludedMultis*excludedXpMultis;
    ozzy.loot+=loopLoot;
    ozzy.time+=time;
    ozzy.enem+=enem;
    ozzy.ls=ozzy.loot/ozzy.time;
    ozzy.iters++;
   
    ozzy.minEnem=Math.min(ozzy.minEnem,enem)
    ozzy.maxEnem=Math.max(ozzy.maxEnem,enem)
    ozzy.progress[Math.floor(enem/10)] = (ozzy.progress[Math.floor(enem/10)] || 0) + 1
  }

  for(var k = 0 ;k < opts.length;k++){
    for(var i = 0;i<iters;i++){
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
                `${o.maxHp},${o.atk},${o.regen},${o.dr},${o.evade},${o.effect},${o.multistrike},${o.multistrikePower},${o.reload}`,
                
                JSON.stringify(Object.keys(o.progress).sort((a,b)=>Number(a)-Number(b)).reduce((prev,k)=>({...prev,[k]:o.progress[k]}),{}))
              ])
            })
            return result;
}

