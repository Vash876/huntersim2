(module
 (type $0 (func (result f64)))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (result i32)))
 (type $3 (func))
 (type $4 (func (param i32 i32) (result i32)))
 (type $5 (func (param i32)))
 (type $6 (func (param i32 i32 i32)))
 (type $7 (func (param i32) (result f64)))
 (type $8 (func (param i32 i32)))
 (type $9 (func (param i32 i32 i32) (result i32)))
 (type $10 (func (param f64) (result i32)))
 (type $11 (func (param i32 i32 i32 i32)))
 (type $12 (func (param i32 i32 i64)))
 (type $13 (func (param f64 f64) (result f64)))
 (type $14 (func (param i64 i64 i32 i64 i32) (result i32)))
 (type $15 (func (param i32 i32 f64)))
 (type $16 (func (param i32 i32) (result f64)))
 (type $17 (func (param i32 i32 i32 i32 i32 i32 f64 i32 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)))
 (type $18 (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result f64)))
 (type $19 (func (param i32 f64 i32)))
 (type $20 (func (param i32 i32 i32 i32 i32 f64 i32 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32)))
 (type $21 (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result f64)))
 (type $22 (func (param f64)))
 (type $23 (func (param i32 i32 i32 i32 i32 i32 f64 i32 f64 i32 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)))
 (type $24 (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 f64 f64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result f64)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/evalBorge/seed (mut i32) (i32.const 12345))
 (global $~lib/rt/itcms/total (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/threshold (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/state (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/visitCount (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/pinSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/iter (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/toSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $assembly/evalBorge/ENEMIES (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentBorge (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentEnem (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentTime (mut f64) (f64.const 0))
 (global $~lib/util/math/log_tail (mut f64) (f64.const 0))
 (global $assembly/evalBorge/currentEnemy (mut i32) (i32.const 0))
 (global $assembly/evalBorge/furyEnabled (mut i32) (i32.const 0))
 (global $assembly/evalBorge/trampleDamage (mut f64) (f64.const 0))
 (global $assembly/evalBorge/fowRemaining (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextAtk (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextAthena (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextEnemAtk (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextRegen (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextBossBonusAtk (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextFury (mut f64) (f64.const 0))
 (global $assembly/evalBorge/nextInfernalBulk (mut f64) (f64.const 0))
 (global $assembly/evalBorge/currentAttr (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentCatchup99gu (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentTrample (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentMaxStage (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentTempGN4 (mut i32) (i32.const 0))
 (global $assembly/evalBorge/currentCreaGem4 (mut i32) (i32.const 0))
 (global $assembly/evalBorge/lastBorge (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/seed (mut i32) (i32.const 12345))
 (global $assembly/evalOzzy/OZZY_ENEMIES (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/currentOzzy (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/currentOzzyEnem (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/currentOzzyTime (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/currentOzzyEnemy (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/vectidStacks (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/cripplingActive (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/hardenEnd (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextOzzyAtk (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextEchoBullet (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextOzzyEnemAtk (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextOzzyRegen (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextMultistrike (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/nextHarden (mut f64) (f64.const 0))
 (global $assembly/evalOzzy/currentOzzyAttr (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/currentOzzyCatchup99gu (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/currentOzzyCreaGem4 (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/bossKillsByRevive (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/bossAttemptsByRevive (mut i32) (i32.const 0))
 (global $assembly/evalOzzy/lastTrackedBossStage (mut i32) (i32.const -1))
 (global $assembly/evalOzzy/entryRevivesForRun (mut i32) (i32.const -1))
 (global $assembly/evalOzzy/lastOzzy (mut i32) (i32.const 0))
 (global $assembly/evalKnox/seed (mut i32) (i32.const 12345))
 (global $assembly/evalKnox/KNOX_ENEMIES (mut i32) (i32.const 0))
 (global $assembly/evalKnox/currentKnox (mut i32) (i32.const 0))
 (global $assembly/evalKnox/currentKnoxEnem (mut i32) (i32.const 0))
 (global $assembly/evalKnox/currentKnoxTime (mut f64) (f64.const 0))
 (global $assembly/evalKnox/currentKnoxEnemy (mut i32) (i32.const 0))
 (global $assembly/evalKnox/leftoverTorpedos (mut i32) (i32.const 0))
 (global $assembly/evalKnox/nextKnoxAtk (mut f64) (f64.const 0))
 (global $assembly/evalKnox/nextKnoxBullet (mut f64) (f64.const 0))
 (global $assembly/evalKnox/nextKnoxTorpedo (mut f64) (f64.const 0))
 (global $assembly/evalKnox/nextKnoxEnemAtk (mut f64) (f64.const 0))
 (global $assembly/evalKnox/nextKnoxRegen (mut f64) (f64.const 0))
 (global $assembly/evalKnox/currentKnoxAttr (mut i32) (i32.const 0))
 (global $assembly/evalKnox/currentKnoxCatchup99gu (mut i32) (i32.const 0))
 (global $assembly/evalKnox/currentKnoxCreaGem4 (mut i32) (i32.const 0))
 (global $assembly/evalKnox/lastKnox (mut i32) (i32.const 0))
 (global $assembly/index/HunterType.BORGE i32 (i32.const 0))
 (global $assembly/index/HunterType.OZZY i32 (i32.const 1))
 (global $assembly/index/HunterType.KNOX i32 (i32.const 2))
 (global $assembly/index/HunterType.UNKNOWN i32 (i32.const 99))
 (global $~lib/util/number/_frc_plus (mut i64) (i64.const 0))
 (global $~lib/util/number/_frc_minus (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp (mut i32) (i32.const 0))
 (global $~lib/util/number/_K (mut i32) (i32.const 0))
 (global $~lib/util/number/_frc_pow (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp_pow (mut i32) (i32.const 0))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 44388))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00r\00t\00/\00i\00t\00c\00m\00s\00.\00t\00s")
 (data $6 (i32.const 1340) "<")
 (data $6.1 (i32.const 1352) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $7 (i32.const 1404) ",")
 (data $7.1 (i32.const 1416) "\02\00\00\00\14\00\00\00~\00l\00i\00b\00/\00r\00t\00.\00t\00s")
 (data $9 (i32.const 1484) "<")
 (data $9.1 (i32.const 1496) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data $10 (i32.const 1548) "<")
 (data $10.1 (i32.const 1560) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $11 (i32.const 1621) "\a0\f6?")
 (data $11.1 (i32.const 1633) "\c8\b9\f2\82,\d6\bf\80V7($\b4\fa<\00\00\00\00\00\80\f6?")
 (data $11.2 (i32.const 1665) "\08X\bf\bd\d1\d5\bf \f7\e0\d8\08\a5\1c\bd\00\00\00\00\00`\f6?")
 (data $11.3 (i32.const 1697) "XE\17wv\d5\bfmP\b6\d5\a4b#\bd\00\00\00\00\00@\f6?")
 (data $11.4 (i32.const 1729) "\f8-\87\ad\1a\d5\bf\d5g\b0\9e\e4\84\e6\bc\00\00\00\00\00 \f6?")
 (data $11.5 (i32.const 1761) "xw\95_\be\d4\bf\e0>)\93i\1b\04\bd\00\00\00\00\00\00\f6?")
 (data $11.6 (i32.const 1793) "`\1c\c2\8ba\d4\bf\cc\84LH/\d8\13=\00\00\00\00\00\e0\f5?")
 (data $11.7 (i32.const 1825) "\a8\86\860\04\d4\bf:\0b\82\ed\f3B\dc<\00\00\00\00\00\c0\f5?")
 (data $11.8 (i32.const 1857) "HiUL\a6\d3\bf`\94Q\86\c6\b1 =\00\00\00\00\00\a0\f5?")
 (data $11.9 (i32.const 1889) "\80\98\9a\ddG\d3\bf\92\80\c5\d4MY%=\00\00\00\00\00\80\f5?")
 (data $11.10 (i32.const 1921) " \e1\ba\e2\e8\d2\bf\d8+\b7\99\1e{&=\00\00\00\00\00`\f5?")
 (data $11.11 (i32.const 1953) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00`\f5?")
 (data $11.12 (i32.const 1985) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00@\f5?")
 (data $11.13 (i32.const 2017) "x\cf\fbA)\d2\bfv\daS($Z\16\bd\00\00\00\00\00 \f5?")
 (data $11.14 (i32.const 2049) "\98i\c1\98\c8\d1\bf\04T\e7h\bc\af\1f\bd\00\00\00\00\00\00\f5?")
 (data $11.15 (i32.const 2081) "\a8\ab\ab\\g\d1\bf\f0\a8\823\c6\1f\1f=\00\00\00\00\00\e0\f4?")
 (data $11.16 (i32.const 2113) "H\ae\f9\8b\05\d1\bffZ\05\fd\c4\a8&\bd\00\00\00\00\00\c0\f4?")
 (data $11.17 (i32.const 2145) "\90s\e2$\a3\d0\bf\0e\03\f4~\eek\0c\bd\00\00\00\00\00\a0\f4?")
 (data $11.18 (i32.const 2177) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\a0\f4?")
 (data $11.19 (i32.const 2209) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\80\f4?")
 (data $11.20 (i32.const 2241) "@^m\18\b9\cf\bf\87<\99\ab*W\r=\00\00\00\00\00`\f4?")
 (data $11.21 (i32.const 2273) "`\dc\cb\ad\f0\ce\bf$\af\86\9c\b7&+=\00\00\00\00\00@\f4?")
 (data $11.22 (i32.const 2305) "\f0*n\07\'\ce\bf\10\ff?TO/\17\bd\00\00\00\00\00 \f4?")
 (data $11.23 (i32.const 2337) "\c0Ok!\\\cd\bf\1bh\ca\bb\91\ba!=\00\00\00\00\00\00\f4?")
 (data $11.24 (i32.const 2369) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\00\f4?")
 (data $11.25 (i32.const 2401) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\e0\f3?")
 (data $11.26 (i32.const 2433) "\90-t\86\c2\cb\bf\8f\b7\8b1\b0N\19=\00\00\00\00\00\c0\f3?")
 (data $11.27 (i32.const 2465) "\c0\80N\c9\f3\ca\bff\90\cd?cN\ba<\00\00\00\00\00\a0\f3?")
 (data $11.28 (i32.const 2497) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\a0\f3?")
 (data $11.29 (i32.const 2529) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\80\f3?")
 (data $11.30 (i32.const 2561) "P\f4\9cZR\c9\bf\e3\d4\c1\04\d9\d1*\bd\00\00\00\00\00`\f3?")
 (data $11.31 (i32.const 2593) "\d0 e\a0\7f\c8\bf\t\fa\db\7f\bf\bd+=\00\00\00\00\00@\f3?")
 (data $11.32 (i32.const 2625) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00@\f3?")
 (data $11.33 (i32.const 2657) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00 \f3?")
 (data $11.34 (i32.const 2689) "\d0\19\e7\0f\d6\c6\bff\e2\b2\a3j\e4\10\bd\00\00\00\00\00\00\f3?")
 (data $11.35 (i32.const 2721) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\00\f3?")
 (data $11.36 (i32.const 2753) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\e0\f2?")
 (data $11.37 (i32.const 2785) "\b0\a1\e3\e5&\c5\bf\8f[\07\90\8b\de \bd\00\00\00\00\00\c0\f2?")
 (data $11.38 (i32.const 2817) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\c0\f2?")
 (data $11.39 (i32.const 2849) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\a0\f2?")
 (data $11.40 (i32.const 2881) "\90\1e \fcq\c3\bf:T\'M\86x\f1<\00\00\00\00\00\80\f2?")
 (data $11.41 (i32.const 2913) "\f0\1f\f8R\95\c2\bf\08\c4q\170\8d$\bd\00\00\00\00\00`\f2?")
 (data $11.42 (i32.const 2945) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00`\f2?")
 (data $11.43 (i32.const 2977) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00@\f2?")
 (data $11.44 (i32.const 3009) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00@\f2?")
 (data $11.45 (i32.const 3041) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00 \f2?")
 (data $11.46 (i32.const 3073) "\e0\db1\91\ec\bf\bf\f23\a3\\Tu%\bd\00\00\00\00\00\00\f2?")
 (data $11.47 (i32.const 3106) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\00\f2?")
 (data $11.48 (i32.const 3138) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\e0\f1?")
 (data $11.49 (i32.const 3169) "\c0[\8fT^\bc\bf\06\be_XW\0c\1d\bd\00\00\00\00\00\c0\f1?")
 (data $11.50 (i32.const 3201) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\c0\f1?")
 (data $11.51 (i32.const 3233) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\a0\f1?")
 (data $11.52 (i32.const 3265) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\a0\f1?")
 (data $11.53 (i32.const 3297) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\80\f1?")
 (data $11.54 (i32.const 3329) "`\e5\8a\d2\f0\b6\bf\das3\c97\97&\bd\00\00\00\00\00`\f1?")
 (data $11.55 (i32.const 3361) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00`\f1?")
 (data $11.56 (i32.const 3393) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00@\f1?")
 (data $11.57 (i32.const 3425) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00@\f1?")
 (data $11.58 (i32.const 3457) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00 \f1?")
 (data $11.59 (i32.const 3489) "\80\a3\ee6e\b1\bf\t\a3\8fv^|\14=\00\00\00\00\00\00\f1?")
 (data $11.60 (i32.const 3521) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\00\f1?")
 (data $11.61 (i32.const 3553) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\e0\f0?")
 (data $11.62 (i32.const 3585) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\e0\f0?")
 (data $11.63 (i32.const 3617) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\c0\f0?")
 (data $11.64 (i32.const 3649) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\c0\f0?")
 (data $11.65 (i32.const 3681) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\a0\f0?")
 (data $11.66 (i32.const 3713) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\a0\f0?")
 (data $11.67 (i32.const 3745) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\80\f0?")
 (data $11.68 (i32.const 3778) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00\80\f0?")
 (data $11.69 (i32.const 3810) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00`\f0?")
 (data $11.70 (i32.const 3841) "\80\d5\07\1b\b9\97\bf9\a6\fa\93T\8d(\bd\00\00\00\00\00@\f0?")
 (data $11.71 (i32.const 3874) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00@\f0?")
 (data $11.72 (i32.const 3906) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00 \f0?")
 (data $11.73 (i32.const 3938) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00 \f0?")
 (data $11.74 (i32.const 3970) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00\00\f0?")
 (data $11.75 (i32.const 4022) "\f0?")
 (data $11.76 (i32.const 4053) "\c0\ef?")
 (data $11.77 (i32.const 4066) "\89u\15\10\80?\e8+\9d\99k\c7\10\bd\00\00\00\00\00\80\ef?")
 (data $11.78 (i32.const 4097) "\80\93XV \90?\d2\f7\e2\06[\dc#\bd\00\00\00\00\00@\ef?")
 (data $11.79 (i32.const 4130) "\c9(%I\98?4\0cZ2\ba\a0*\bd\00\00\00\00\00\00\ef?")
 (data $11.80 (i32.const 4161) "@\e7\89]A\a0?S\d7\f1\\\c0\11\01=\00\00\00\00\00\c0\ee?")
 (data $11.81 (i32.const 4194) ".\d4\aef\a4?(\fd\bdus\16,\bd\00\00\00\00\00\80\ee?")
 (data $11.82 (i32.const 4225) "\c0\9f\14\aa\94\a8?}&Z\d0\95y\19\bd\00\00\00\00\00@\ee?")
 (data $11.83 (i32.const 4257) "\c0\dd\cds\cb\ac?\07(\d8G\f2h\1a\bd\00\00\00\00\00 \ee?")
 (data $11.84 (i32.const 4289) "\c0\06\c01\ea\ae?{;\c9O>\11\0e\bd\00\00\00\00\00\e0\ed?")
 (data $11.85 (i32.const 4321) "`F\d1;\97\b1?\9b\9e\rV]2%\bd\00\00\00\00\00\a0\ed?")
 (data $11.86 (i32.const 4353) "\e0\d1\a7\f5\bd\b3?\d7N\db\a5^\c8,=\00\00\00\00\00`\ed?")
 (data $11.87 (i32.const 4385) "\a0\97MZ\e9\b5?\1e\1d]<\06i,\bd\00\00\00\00\00@\ed?")
 (data $11.88 (i32.const 4417) "\c0\ea\n\d3\00\b7?2\ed\9d\a9\8d\1e\ec<\00\00\00\00\00\00\ed?")
 (data $11.89 (i32.const 4449) "@Y]^3\b9?\daG\bd:\\\11#=\00\00\00\00\00\c0\ec?")
 (data $11.90 (i32.const 4481) "`\ad\8d\c8j\bb?\e5h\f7+\80\90\13\bd\00\00\00\00\00\a0\ec?")
 (data $11.91 (i32.const 4513) "@\bc\01X\88\bc?\d3\acZ\c6\d1F&=\00\00\00\00\00`\ec?")
 (data $11.92 (i32.const 4545) " \n\839\c7\be?\e0E\e6\afh\c0-\bd\00\00\00\00\00@\ec?")
 (data $11.93 (i32.const 4577) "\e0\db9\91\e8\bf?\fd\n\a1O\d64%\bd\00\00\00\00\00\00\ec?")
 (data $11.94 (i32.const 4609) "\e0\'\82\8e\17\c1?\f2\07-\cex\ef!=\00\00\00\00\00\e0\eb?")
 (data $11.95 (i32.const 4641) "\f0#~+\aa\c1?4\998D\8e\a7,=\00\00\00\00\00\a0\eb?")
 (data $11.96 (i32.const 4673) "\80\86\0ca\d1\c2?\a1\b4\81\cbl\9d\03=\00\00\00\00\00\80\eb?")
 (data $11.97 (i32.const 4705) "\90\15\b0\fce\c3?\89rK#\a8/\c6<\00\00\00\00\00@\eb?")
 (data $11.98 (i32.const 4737) "\b03\83=\91\c4?x\b6\fdTy\83%=\00\00\00\00\00 \eb?")
 (data $11.99 (i32.const 4769) "\b0\a1\e4\e5\'\c5?\c7}i\e5\e83&=\00\00\00\00\00\e0\ea?")
 (data $11.100 (i32.const 4801) "\10\8c\beNW\c6?x.<,\8b\cf\19=\00\00\00\00\00\c0\ea?")
 (data $11.101 (i32.const 4833) "pu\8b\12\f0\c6?\e1!\9c\e5\8d\11%\bd\00\00\00\00\00\a0\ea?")
 (data $11.102 (i32.const 4865) "PD\85\8d\89\c7?\05C\91p\10f\1c\bd\00\00\00\00\00`\ea?")
 (data $11.103 (i32.const 4898) "9\eb\af\be\c8?\d1,\e9\aaT=\07\bd\00\00\00\00\00@\ea?")
 (data $11.104 (i32.const 4930) "\f7\dcZZ\c9?o\ff\a0X(\f2\07=\00\00\00\00\00\00\ea?")
 (data $11.105 (i32.const 4961) "\e0\8a<\ed\93\ca?i!VPCr(\bd\00\00\00\00\00\e0\e9?")
 (data $11.106 (i32.const 4993) "\d0[W\d81\cb?\aa\e1\acN\8d5\0c\bd\00\00\00\00\00\c0\e9?")
 (data $11.107 (i32.const 5025) "\e0;8\87\d0\cb?\b6\12TY\c4K-\bd\00\00\00\00\00\a0\e9?")
 (data $11.108 (i32.const 5057) "\10\f0\c6\fbo\cc?\d2+\96\c5r\ec\f1\bc\00\00\00\00\00`\e9?")
 (data $11.109 (i32.const 5089) "\90\d4\b0=\b1\cd?5\b0\15\f7*\ff*\bd\00\00\00\00\00@\e9?")
 (data $11.110 (i32.const 5121) "\10\e7\ff\0eS\ce?0\f4A`\'\12\c2<\00\00\00\00\00 \e9?")
 (data $11.111 (i32.const 5154) "\dd\e4\ad\f5\ce?\11\8e\bbe\15!\ca\bc\00\00\00\00\00\00\e9?")
 (data $11.112 (i32.const 5185) "\b0\b3l\1c\99\cf?0\df\0c\ca\ec\cb\1b=\00\00\00\00\00\c0\e8?")
 (data $11.113 (i32.const 5217) "XM`8q\d0?\91N\ed\16\db\9c\f8<\00\00\00\00\00\a0\e8?")
 (data $11.114 (i32.const 5249) "`ag-\c4\d0?\e9\ea<\16\8b\18\'=\00\00\00\00\00\80\e8?")
 (data $11.115 (i32.const 5281) "\e8\'\82\8e\17\d1?\1c\f0\a5c\0e!,\bd\00\00\00\00\00`\e8?")
 (data $11.116 (i32.const 5313) "\f8\ac\cb\\k\d1?\81\16\a5\f7\cd\9a+=\00\00\00\00\00@\e8?")
 (data $11.117 (i32.const 5345) "hZc\99\bf\d1?\b7\bdGQ\ed\a6,=\00\00\00\00\00 \e8?")
 (data $11.118 (i32.const 5377) "\b8\0emE\14\d2?\ea\baF\ba\de\87\n=\00\00\00\00\00\e0\e7?")
 (data $11.119 (i32.const 5409) "\90\dc|\f0\be\d2?\f4\04PJ\fa\9c*=\00\00\00\00\00\c0\e7?")
 (data $11.120 (i32.const 5441) "`\d3\e1\f1\14\d3?\b8<!\d3z\e2(\bd\00\00\00\00\00\a0\e7?")
 (data $11.121 (i32.const 5473) "\10\bevgk\d3?\c8w\f1\b0\cdn\11=\00\00\00\00\00\80\e7?")
 (data $11.122 (i32.const 5505) "03wR\c2\d3?\\\bd\06\b6T;\18=\00\00\00\00\00`\e7?")
 (data $11.123 (i32.const 5537) "\e8\d5#\b4\19\d4?\9d\e0\90\ec6\e4\08=\00\00\00\00\00@\e7?")
 (data $11.124 (i32.const 5569) "\c8q\c2\8dq\d4?u\d6g\t\ce\'/\bd\00\00\00\00\00 \e7?")
 (data $11.125 (i32.const 5601) "0\17\9e\e0\c9\d4?\a4\d8\n\1b\89 .\bd\00\00\00\00\00\00\e7?")
 (data $11.126 (i32.const 5633) "\a08\07\ae\"\d5?Y\c7d\81p\be.=\00\00\00\00\00\e0\e6?")
 (data $11.127 (i32.const 5665) "\d0\c8S\f7{\d5?\ef@]\ee\ed\ad\1f=\00\00\00\00\00\c0\e6?")
 (data $11.128 (i32.const 5697) "`Y\df\bd\d5\d5?\dce\a4\08*\0b\n\bd")
 (data $12 (i32.const 5726) "\f0?n\bf\88\1aO;\9b<53\fb\a9=\f6\ef?]\dc\d8\9c\13`q\bca\80w>\9a\ec\ef?\d1f\87\10z^\90\bc\85\7fn\e8\15\e3\ef?\13\f6g5R\d2\8c<t\85\15\d3\b0\d9\ef?\fa\8e\f9#\80\ce\8b\bc\de\f6\dd)k\d0\ef?a\c8\e6aN\f7`<\c8\9bu\18E\c7\ef?\99\d33[\e4\a3\90<\83\f3\c6\ca>\be\ef?m{\83]\a6\9a\97<\0f\89\f9lX\b5\ef?\fc\ef\fd\92\1a\b5\8e<\f7Gr+\92\ac\ef?\d1\9c/p=\be><\a2\d1\d32\ec\a3\ef?\0bn\90\894\03j\bc\1b\d3\fe\aff\9b\ef?\0e\bd/*RV\95\bcQ[\12\d0\01\93\ef?U\eaN\8c\ef\80P\bc\cc1l\c0\bd\8a\ef?\16\f4\d5\b9#\c9\91\bc\e0-\a9\ae\9a\82\ef?\afU\\\e9\e3\d3\80<Q\8e\a5\c8\98z\ef?H\93\a5\ea\15\1b\80\bc{Q}<\b8r\ef?=2\deU\f0\1f\8f\bc\ea\8d\8c8\f9j\ef?\bfS\13?\8c\89\8b<u\cbo\eb[c\ef?&\eb\11v\9c\d9\96\bc\d4\\\04\84\e0[\ef?`/:>\f7\ec\9a<\aa\b9h1\87T\ef?\9d8\86\cb\82\e7\8f\bc\1d\d9\fc\"PM\ef?\8d\c3\a6DAo\8a<\d6\8cb\88;F\ef?}\04\e4\b0\05z\80<\96\dc}\91I?\ef?\94\a8\a8\e3\fd\8e\96<8bunz8\ef?}Ht\f2\18^\87<?\a6\b2O\ce1\ef?\f2\e7\1f\98+G\80<\dd|\e2eE+\ef?^\08q?{\b8\96\bc\81c\f5\e1\df$\ef?1\ab\tm\e1\f7\82<\e1\de\1f\f5\9d\1e\ef?\fa\bfo\1a\9b!=\bc\90\d9\da\d0\7f\18\ef?\b4\n\0cr\827\8b<\0b\03\e4\a6\85\12\ef?\8f\cb\ce\89\92\14n<V/>\a9\af\0c\ef?\b6\ab\b0MuM\83<\15\b71\n\fe\06\ef?Lt\ac\e2\01B\86<1\d8L\fcp\01\ef?J\f8\d3]9\dd\8f<\ff\16d\b2\08\fc\ee?\04[\8e;\80\a3\86\bc\f1\9f\92_\c5\f6\ee?hPK\cc\edJ\92\bc\cb\a9:7\a7\f1\ee?\8e-Q\1b\f8\07\99\bcf\d8\05m\ae\ec\ee?\d26\94>\e8\d1q\bc\f7\9f\e54\db\e7\ee?\15\1b\ce\b3\19\19\99\bc\e5\a8\13\c3-\e3\ee?mL*\a7H\9f\85<\"4\12L\a6\de\ee?\8ai(z`\12\93\bc\1c\80\ac\04E\da\ee?[\89\17H\8f\a7X\bc*.\f7!\n\d6\ee?\1b\9aIg\9b,|\bc\97\a8P\d9\f5\d1\ee?\11\ac\c2`\edcC<-\89a`\08\ce\ee?\efd\06;\tf\96<W\00\1d\edA\ca\ee?y\03\a1\da\e1\ccn<\d0<\c1\b5\a2\c6\ee?0\12\0f?\8e\ff\93<\de\d3\d7\f0*\c3\ee?\b0\afz\bb\ce\90v<\'*6\d5\da\bf\ee?w\e0T\eb\bd\1d\93<\r\dd\fd\99\b2\bc\ee?\8e\a3q\004\94\8f\bc\a7,\9dv\b2\b9\ee?I\a3\93\dc\cc\de\87\bcBf\cf\a2\da\b6\ee?_8\0f\bd\c6\dex\bc\82O\9dV+\b4\ee?\f6\\{\ecF\12\86\bc\0f\92]\ca\a4\b1\ee?\8e\d7\fd\18\055\93<\da\'\b56G\af\ee?\05\9b\8a/\b7\98{<\fd\c7\97\d4\12\ad\ee?\tT\1c\e2\e1c\90<)TH\dd\07\ab\ee?\ea\c6\19P\85\c74<\b7FY\8a&\a9\ee?5\c0d+\e62\94<H!\ad\15o\a7\ee?\9fv\99aJ\e4\8c\bc\t\dcv\b9\e1\a5\ee?\a8M\ef;\c53\8c\bc\85U:\b0~\a4\ee?\ae\e9+\89xS\84\bc \c3\cc4F\a3\ee?XXVx\dd\ce\93\bc%\"U\828\a2\ee?d\19~\80\aa\10W<s\a9L\d4U\a1\ee?(\"^\bf\ef\b3\93\bc\cd;\7ff\9e\a0\ee?\82\b94\87\ad\12j\bc\bf\da\0bu\12\a0\ee?\ee\a9m\b8\efgc\bc/\1ae<\b2\9f\ee?Q\88\e0T=\dc\80\bc\84\94Q\f9}\9f\ee?\cf>Z~d\1fx\bct_\ec\e8u\9f\ee?\b0}\8b\c0J\ee\86\bct\81\a5H\9a\9f\ee?\8a\e6U\1e2\19\86\bc\c9gBV\eb\9f\ee?\d3\d4\t^\cb\9c\90<?]\deOi\a0\ee?\1d\a5M\b9\dc2{\bc\87\01\ebs\14\a1\ee?k\c0gT\fd\ec\94<2\c10\01\ed\a1\ee?Ul\d6\ab\e1\ebe<bN\cf6\f3\a2\ee?B\cf\b3/\c5\a1\88\bc\12\1a>T\'\a4\ee?47;\f1\b6i\93\bc\13\ceL\99\89\a5\ee?\1e\ff\19:\84^\80\bc\ad\c7#F\1a\a7\ee?nWr\d8P\d4\94\bc\ed\92D\9b\d9\a8\ee?\00\8a\0e[g\ad\90<\99f\8a\d9\c7\aa\ee?\b4\ea\f0\c1/\b7\8d<\db\a0*B\e5\ac\ee?\ff\e7\c5\9c`\b6e\bc\8cD\b5\162\af\ee?D_\f3Y\83\f6{<6w\15\99\ae\b1\ee?\83=\1e\a7\1f\t\93\bc\c6\ff\91\0b[\b4\ee?)\1el\8b\b8\a9]\bc\e5\c5\cd\b07\b7\ee?Y\b9\90|\f9#l\bc\0fR\c8\cbD\ba\ee?\aa\f9\f4\"CC\92\bcPN\de\9f\82\bd\ee?K\8ef\d7l\ca\85\bc\ba\07\cap\f1\c0\ee?\'\ce\91+\fc\afq<\90\f0\a3\82\91\c4\ee?\bbs\n\e15\d2m<##\e3\19c\c8\ee?c\"b\"\04\c5\87\bce\e5]{f\cc\ee?\d51\e2\e3\86\1c\8b<3-J\ec\9b\d0\ee?\15\bb\bc\d3\d1\bb\91\bc]%>\b2\03\d5\ee?\d21\ee\9c1\cc\90<X\b30\13\9e\d9\ee?\b3Zsn\84i\84<\bf\fdyUk\de\ee?\b4\9d\8e\97\cd\df\82\bcz\f3\d3\bfk\e3\ee?\873\cb\92w\1a\8c<\ad\d3Z\99\9f\e8\ee?\fa\d9\d1J\8f{\90\bcf\b6\8d)\07\ee\ee?\ba\ae\dcV\d9\c3U\bc\fb\15O\b8\a2\f3\ee?@\f6\a6=\0e\a4\90\bc:Y\e5\8dr\f9\ee?4\93\ad8\f4\d6h\bcG^\fb\f2v\ff\ee?5\8aXk\e2\ee\91\bcJ\06\a10\b0\05\ef?\cd\dd_\n\d7\fft<\d2\c1K\90\1e\0c\ef?\ac\98\92\fa\fb\bd\91\bc\t\1e\d7[\c2\12\ef?\b3\0c\af0\aens<\9cR\85\dd\9b\19\ef?\94\fd\9f\\2\e3\8e<z\d0\ff_\ab \ef?\acY\t\d1\8f\e0\84<K\d1W.\f1\'\ef?g\1aN8\af\cdc<\b5\e7\06\94m/\ef?h\19\92l,kg<i\90\ef\dc 7\ef?\d2\b5\cc\83\18\8a\80\bc\fa\c3]U\0b?\ef?o\fa\ff?]\ad\8f\bc|\89\07J-G\ef?I\a9u8\ae\r\90\bc\f2\89\r\08\87O\ef?\a7\07=\a6\85\a3t<\87\a4\fb\dc\18X\ef?\0f\"@ \9e\91\82\bc\98\83\c9\16\e3`\ef?\ac\92\c1\d5PZ\8e<\852\db\03\e6i\ef?Kk\01\acY:\84<`\b4\01\f3!s\ef?\1f>\b4\07!\d5\82\bc_\9b{3\97|\ef?\c9\rG;\b9*\89\bc)\a1\f5\14F\86\ef?\d3\88:`\04\b6t<\f6?\8b\e7.\90\ef?qr\9dQ\ec\c5\83<\83L\c7\fbQ\9a\ef?\f0\91\d3\8f\12\f7\8f\bc\da\90\a4\a2\af\a4\ef?}t#\e2\98\ae\8d\bc\f1g\8e-H\af\ef?\08 \aaA\bc\c3\8e<\'Za\ee\1b\ba\ef?2\eb\a9\c3\94+\84<\97\bak7+\c5\ef?\ee\85\d11\a9d\8a<@En[v\d0\ef?\ed\e3;\e4\ba7\8e\bc\14\be\9c\ad\fd\db\ef?\9d\cd\91M;\89w<\d8\90\9e\81\c1\e7\ef?\89\cc`A\c1\05S<\f1q\8f+\c2\f3\ef?")
 (data $13 (i32.const 7772) "|")
 (data $13.1 (i32.const 7784) "\02\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y")
 (data $14 (i32.const 7900) "<")
 (data $14.1 (i32.const 7912) "\02\00\00\00$\00\00\00K\00e\00y\00 \00d\00o\00e\00s\00 \00n\00o\00t\00 \00e\00x\00i\00s\00t")
 (data $15 (i32.const 7964) ",")
 (data $15.1 (i32.const 7976) "\02\00\00\00\16\00\00\00~\00l\00i\00b\00/\00m\00a\00p\00.\00t\00s")
 (data $16 (i32.const 8012) "\1c")
 (data $16.1 (i32.const 8024) "\02\00\00\00\04\00\00\00{\00}")
 (data $17 (i32.const 8044) "\1c")
 (data $17.1 (i32.const 8056) "\02\00\00\00\02\00\00\00{")
 (data $18 (i32.const 8076) ",")
 (data $18.1 (i32.const 8088) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $19 (i32.const 8124) "\1c")
 (data $19.1 (i32.const 8136) "\02\00\00\00\02\00\00\00,")
 (data $20 (i32.const 8156) "\1c")
 (data $20.1 (i32.const 8168) "\02")
 (data $21 (i32.const 8188) "\1c")
 (data $21.1 (i32.const 8200) "\02\00\00\00\02\00\00\00\"")
 (data $22 (i32.const 8220) "\1c")
 (data $22.1 (i32.const 8232) "\02\00\00\00\04\00\00\00\"\00:")
 (data $23 (i32.const 8252) ",\00\00\00\03\00\00\00\00\00\00\00\17\00\00\00\10\00\00\00\10 \00\00\00\00\00\000 ")
 (data $24 (i32.const 8300) "|")
 (data $24.1 (i32.const 8312) "\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006")
 (data $25 (i32.const 8428) "<")
 (data $25.1 (i32.const 8440) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s")
 (data $26 (i32.const 8492) "\1c")
 (data $26.1 (i32.const 8504) "\02\00\00\00\02\00\00\000")
 (data $27 (i32.const 8524) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009")
 (data $28 (i32.const 8924) "\1c\04")
 (data $28.1 (i32.const 8936) "\02\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f")
 (data $29 (i32.const 9980) "\\")
 (data $29.1 (i32.const 9992) "\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z")
 (data $30 (i32.const 10076) "\1c")
 (data $30.1 (i32.const 10088) "\02\00\00\00\02\00\00\00}")
 (data $31 (i32.const 10108) "\\\00\00\00\03\00\00\00\00\00\00\00\17\00\00\00D\00\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f\00\00\00\00\00\00\d0\1f")
 (data $32 (i32.const 10204) "\1c")
 (data $32.1 (i32.const 10216) "\02\00\00\00\06\00\00\000\00.\000")
 (data $33 (i32.const 10236) "\1c")
 (data $33.1 (i32.const 10248) "\02\00\00\00\06\00\00\00N\00a\00N")
 (data $34 (i32.const 10268) ",")
 (data $34.1 (i32.const 10280) "\02\00\00\00\12\00\00\00-\00I\00n\00f\00i\00n\00i\00t\00y")
 (data $35 (i32.const 10316) ",")
 (data $35.1 (i32.const 10328) "\02\00\00\00\10\00\00\00I\00n\00f\00i\00n\00i\00t\00y")
 (data $37 (i32.const 10424) "\88\02\1c\08\a0\d5\8f\fav\bf>\a2\7f\e1\ae\bav\acU0 \fb\16\8b\ea5\ce]J\89B\cf-;eU\aa\b0k\9a\dfE\1a=\03\cf\1a\e6\ca\c6\9a\c7\17\fep\abO\dc\bc\be\fc\b1w\ff\0c\d6kA\ef\91V\be<\fc\7f\90\ad\1f\d0\8d\83\9aU1(\\Q\d3\b5\c9\a6\ad\8f\acq\9d\cb\8b\ee#w\"\9c\eamSx@\91I\cc\aeW\ce\b6]y\12<\827V\fbM6\94\10\c2O\98H8o\ea\96\90\c7:\82%\cb\85t\d7\f4\97\bf\97\cd\cf\86\a0\e5\ac*\17\98\n4\ef\8e\b25*\fbg8\b2;?\c6\d2\df\d4\c8\84\ba\cd\d3\1a\'D\dd\c5\96\c9%\bb\ce\9fk\93\84\a5b}$l\ac\db\f6\da_\rXf\ab\a3&\f1\c3\de\93\f8\e2\f3\b8\80\ff\aa\a8\ad\b5\b5\8bJ|l\05_b\87S0\c14`\ff\bc\c9U&\ba\91\8c\85N\96\bd~)p$w\f9\df\8f\b8\e5\b8\9f\bd\df\a6\94}t\88\cf_\a9\f8\cf\9b\a8\8f\93pD\b9k\15\0f\bf\f8\f0\08\8a\b611eU%\b0\cd\ac\7f{\d0\c6\e2?\99\06;+*\c4\10\\\e4\d3\92si\99$$\aa\0e\ca\00\83\f2\b5\87\fd\eb\1a\11\92d\08\e5\bc\cc\88Po\t\cc\bc\8c,e\19\e2X\17\b7\d1\00\00\00\00\00\00@\9c\00\00\00\00\10\a5\d4\e8\00\00b\ac\c5\ebx\ad\84\t\94\f8x9?\81\b3\15\07\c9{\ce\97\c0p\\\ea{\ce2~\8fh\80\e9\ab\a48\d2\d5E\"\9a\17&\'O\9f\'\fb\c4\d41\a2c\ed\a8\ad\c8\8c8e\de\b0\dbe\ab\1a\8e\08\c7\83\9a\1dqB\f9\1d]\c4X\e7\1b\a6,iM\92\ea\8dp\1ad\ee\01\daJw\ef\9a\99\a3m\a2\85k}\b4{x\t\f2w\18\ddy\a1\e4T\b4\c2\c5\9b[\92\86[\86=]\96\c8\c5S5\c8\b3\a0\97\fa\\\b4*\95\e3_\a0\99\bd\9fF\de%\8c9\db4\c2\9b\a5\\\9f\98\a3r\9a\c6\f6\ce\be\e9TS\bf\dc\b7\e2A\"\f2\17\f3\fc\88\a5x\\\d3\9b\ce \cc\dfS!{\f3Z\16\98:0\1f\97\dc\b5\a0\e2\96\b3\e3\\S\d1\d9\a8<D\a7\a4\d9|\9b\fb\10D\a4\a7LLv\bb\1a\9c@\b6\ef\8e\ab\8b,\84W\a6\10\ef\1f\d0)1\91\e9\e5\a4\10\9b\9d\0c\9c\a1\fb\9b\10\e7)\f4;b\d9 (\ac\85\cf\a7z^KD\80-\dd\ac\03@\e4!\bf\8f\ffD^/\9cg\8eA\b8\8c\9c\9d\173\d4\a9\1b\e3\b4\92\db\19\9e\d9w\df\ban\bf\96\ebk\ee\f0\9b;\02\87\af")
 (data $38 (i32.const 11120) "<\fbW\fbr\fb\8c\fb\a7\fb\c1\fb\dc\fb\f6\fb\11\fc,\fcF\fca\fc{\fc\96\fc\b1\fc\cb\fc\e6\fc\00\fd\1b\fd5\fdP\fdk\fd\85\fd\a0\fd\ba\fd\d5\fd\ef\fd\n\fe%\fe?\feZ\fet\fe\8f\fe\a9\fe\c4\fe\df\fe\f9\fe\14\ff.\ffI\ffc\ff~\ff\99\ff\b3\ff\ce\ff\e8\ff\03\00\1e\008\00S\00m\00\88\00\a2\00\bd\00\d8\00\f2\00\r\01\'\01B\01\\\01w\01\92\01\ac\01\c7\01\e1\01\fc\01\16\021\02L\02f\02\81\02\9b\02\b6\02\d0\02\eb\02\06\03 \03;\03U\03p\03\8b\03\a5\03\c0\03\da\03\f5\03\0f\04*\04")
 (data $39 (i32.const 11296) "\01\00\00\00\n\00\00\00d\00\00\00\e8\03\00\00\10\'\00\00\a0\86\01\00@B\0f\00\80\96\98\00\00\e1\f5\05\00\ca\9a;")
 (data $40 (i32.const 11340) "\1c")
 (data $40.1 (i32.const 11352) "\02\00\00\00\02\00\00\00_")
 (data $41 (i32.const 11372) ",\00\00\00\03\00\00\00\00\00\00\00\17\00\00\00\18\00\00\00\10 \00\00\00\00\00\00`,\00\00\00\00\00\000 ")
 (data $42 (i32.const 11420) ",\00\00\00\03\00\00\00\00\00\00\00\17\00\00\00\18\00\00\00\10 \00\00\00\00\00\00`,\00\00\00\00\00\000 ")
 (data $43 (i32.const 11468) ",\00\00\00\03\00\00\00\00\00\00\00\17\00\00\00\18\00\00\00\10 \00\00\00\00\00\00`,\00\00\00\00\00\000 ")
 (data $44 (i32.const 11520) "\18\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00 \00\00\00\04A\00\00\00\00\00\00 \00\00\00\04A\00\00\10\t\12\00 \00\00\00\04A\00\00\00\00\00\00 \00\00\00\04A\00\00$\t\00\00 \00\00\00\04A\00\00\00\00\00\00 \00\00\00\04A\00\00$\1a\00\00\02\t\00\00\04A")
 (export "multiWasm" (func $assembly/evalBorge/multi))
 (export "testMultiFunction" (func $assembly/index/testMultiFunction))
 (export "HunterType.BORGE" (global $assembly/index/HunterType.BORGE))
 (export "HunterType.OZZY" (global $assembly/index/HunterType.OZZY))
 (export "HunterType.KNOX" (global $assembly/index/HunterType.KNOX))
 (export "HunterType.UNKNOWN" (global $assembly/index/HunterType.UNKNOWN))
 (export "getWasmBuildTimestamp" (func $assembly/index/getWasmBuildTimestamp))
 (export "EVALBORGE_WASM" (func $assembly/evalBorge/EVALBORGE_WASM))
 (export "testEnemyCreation" (func $assembly/evalBorge/testEnemyCreation))
 (export "getLastAvgStage" (func $assembly/evalBorge/getLastAvgStage))
 (export "getLastAvgTime" (func $assembly/evalBorge/getLastAvgTime))
 (export "getLastMinStage" (func $assembly/evalBorge/getLastMinStage))
 (export "getLastMaxStage" (func $assembly/evalBorge/getLastMaxStage))
 (export "getLastBossHpPercent" (func $assembly/evalBorge/getLastBossHpPercent))
 (export "getLastBossKillRate" (func $assembly/evalBorge/getLastBossKillRate))
 (export "getLastMat1" (func $assembly/evalBorge/getLastMat1))
 (export "getLastMat2" (func $assembly/evalBorge/getLastMat2))
 (export "getLastMat3" (func $assembly/evalBorge/getLastMat3))
 (export "getLastXp" (func $assembly/evalBorge/getLastXp))
 (export "getLastMinMat1" (func $assembly/evalBorge/getLastMinMat1))
 (export "getLastMaxMat1" (func $assembly/evalBorge/getLastMaxMat1))
 (export "getLastMinMat2" (func $assembly/evalBorge/getLastMinMat2))
 (export "getLastMaxMat2" (func $assembly/evalBorge/getLastMaxMat2))
 (export "getLastMinMat3" (func $assembly/evalBorge/getLastMinMat3))
 (export "getLastMaxMat3" (func $assembly/evalBorge/getLastMaxMat3))
 (export "getLastMinXp" (func $assembly/evalBorge/getLastMinXp))
 (export "getLastMaxXp" (func $assembly/evalBorge/getLastMaxXp))
 (export "getLastProgressString" (func $assembly/evalBorge/getLastProgressString))
 (export "getLastStatsString" (func $assembly/evalBorge/getLastStatsString))
 (export "getLastBorgeMaxHp" (func $assembly/evalBorge/getLastBorgeMaxHp))
 (export "getLastBorgeAtk" (func $assembly/evalBorge/getLastBorgeAtk))
 (export "getLastBorgeRegen" (func $assembly/evalBorge/getLastBorgeRegen))
 (export "getLastBorgeDr" (func $assembly/evalBorge/getLastBorgeDr))
 (export "getLastBorgeEvade" (func $assembly/evalBorge/getLastBorgeEvade))
 (export "getLastBorgeEffect" (func $assembly/evalBorge/getLastBorgeEffect))
 (export "getLastBorgeCritRate" (func $assembly/evalBorge/getLastBorgeCritRate))
 (export "getLastBorgeCritPower" (func $assembly/evalBorge/getLastBorgeCritPower))
 (export "getLastBorgeReload" (func $assembly/evalBorge/getLastBorgeReload))
 (export "getProgressSize" (func $assembly/evalBorge/getProgressSize))
 (export "getProgressStageAt" (func $assembly/evalBorge/getProgressStageAt))
 (export "getProgressCountAt" (func $assembly/evalBorge/getProgressCountAt))
 (export "getDeathsByStageAndReviveSize" (func $assembly/evalBorge/getDeathsByStageAndReviveSize))
 (export "getDeathKeyAt" (func $assembly/evalBorge/getDeathKeyAt))
 (export "getDeathCountAt" (func $assembly/evalBorge/getDeathCountAt))
 (export "getDeathsByStageAndReviveString" (func $assembly/evalBorge/getDeathsByStageAndReviveString))
 (export "EVALOZZY_WASM" (func $assembly/evalOzzy/EVALOZZY_WASM))
 (export "getLastOzzyAvgStage" (func $assembly/evalOzzy/getLastOzzyAvgStage))
 (export "getLastOzzyAvgTime" (func $assembly/evalOzzy/getLastOzzyAvgTime))
 (export "getLastOzzyMinStage" (func $assembly/evalOzzy/getLastOzzyMinStage))
 (export "getLastOzzyMaxStage" (func $assembly/evalOzzy/getLastOzzyMaxStage))
 (export "getLastOzzyBossHpPercent" (func $assembly/evalOzzy/getLastOzzyBossHpPercent))
 (export "getLastOzzyBossKillRate" (func $assembly/evalOzzy/getLastOzzyBossKillRate))
 (export "getLastOzzyMat1" (func $assembly/evalOzzy/getLastOzzyMat1))
 (export "getLastOzzyMat2" (func $assembly/evalOzzy/getLastOzzyMat2))
 (export "getLastOzzyMat3" (func $assembly/evalOzzy/getLastOzzyMat3))
 (export "getLastOzzyXp" (func $assembly/evalOzzy/getLastOzzyXp))
 (export "getLastMinOzzyMat1" (func $assembly/evalOzzy/getLastMinOzzyMat1))
 (export "getLastMaxOzzyMat1" (func $assembly/evalOzzy/getLastMaxOzzyMat1))
 (export "getLastMinOzzyMat2" (func $assembly/evalOzzy/getLastMinOzzyMat2))
 (export "getLastMaxOzzyMat2" (func $assembly/evalOzzy/getLastMaxOzzyMat2))
 (export "getLastMinOzzyMat3" (func $assembly/evalOzzy/getLastMinOzzyMat3))
 (export "getLastMaxOzzyMat3" (func $assembly/evalOzzy/getLastMaxOzzyMat3))
 (export "getLastMinOzzyXp" (func $assembly/evalOzzy/getLastMinOzzyXp))
 (export "getLastMaxOzzyXp" (func $assembly/evalOzzy/getLastMaxOzzyXp))
 (export "getLastOzzyMaxHp" (func $assembly/evalOzzy/getLastOzzyMaxHp))
 (export "getLastOzzyAtk" (func $assembly/evalOzzy/getLastOzzyAtk))
 (export "getLastOzzyRegen" (func $assembly/evalOzzy/getLastOzzyRegen))
 (export "getLastOzzyDr" (func $assembly/evalOzzy/getLastOzzyDr))
 (export "getLastOzzyEvade" (func $assembly/evalOzzy/getLastOzzyEvade))
 (export "getLastOzzyEffect" (func $assembly/evalOzzy/getLastOzzyEffect))
 (export "getLastOzzyMultistrike" (func $assembly/evalOzzy/getLastOzzyMultistrike))
 (export "getLastOzzyMultistrikePower" (func $assembly/evalOzzy/getLastOzzyMultistrikePower))
 (export "getLastOzzyReload" (func $assembly/evalOzzy/getLastOzzyReload))
 (export "getOzzyProgressSize" (func $assembly/evalOzzy/getOzzyProgressSize))
 (export "getOzzyProgressStageAt" (func $assembly/evalOzzy/getOzzyProgressStageAt))
 (export "getOzzyProgressCountAt" (func $assembly/evalOzzy/getOzzyProgressCountAt))
 (export "getOzzyDeathsByStageAndReviveSize" (func $assembly/evalOzzy/getOzzyDeathsByStageAndReviveSize))
 (export "getOzzyDeathKeyAt" (func $assembly/evalOzzy/getOzzyDeathKeyAt))
 (export "getOzzyDeathCountAt" (func $assembly/evalOzzy/getOzzyDeathCountAt))
 (export "getOzzyDeathsByStageAndReviveString" (func $assembly/evalOzzy/getOzzyDeathsByStageAndReviveString))
 (export "getOzzyBossKillsByReviveSize" (func $assembly/evalOzzy/getOzzyBossKillsByReviveSize))
 (export "getOzzyBossRemainingReviveAt" (func $assembly/evalOzzy/getOzzyBossRemainingReviveAt))
 (export "getOzzyBossKillCountAt" (func $assembly/evalOzzy/getOzzyBossKillCountAt))
 (export "getOzzyBossAttemptCountAt" (func $assembly/evalOzzy/getOzzyBossAttemptCountAt))
 (export "EVALKNOX_WASM" (func $assembly/evalKnox/EVALKNOX_WASM))
 (export "getLastKnoxAvgStage" (func $assembly/evalKnox/getLastKnoxAvgStage))
 (export "getLastKnoxAvgTime" (func $assembly/evalKnox/getLastKnoxAvgTime))
 (export "getLastKnoxMinStage" (func $assembly/evalKnox/getLastKnoxMinStage))
 (export "getLastKnoxMaxStage" (func $assembly/evalKnox/getLastKnoxMaxStage))
 (export "getLastKnoxBossHpPercent" (func $assembly/evalKnox/getLastKnoxBossHpPercent))
 (export "getLastKnoxBossKillRate" (func $assembly/evalKnox/getLastKnoxBossKillRate))
 (export "getLastKnoxMat1" (func $assembly/evalKnox/getLastKnoxMat1))
 (export "getLastKnoxMat2" (func $assembly/evalKnox/getLastKnoxMat2))
 (export "getLastKnoxMat3" (func $assembly/evalKnox/getLastKnoxMat3))
 (export "getLastKnoxXp" (func $assembly/evalKnox/getLastKnoxXp))
 (export "getLastMinKnoxMat1" (func $assembly/evalKnox/getLastMinKnoxMat1))
 (export "getLastMaxKnoxMat1" (func $assembly/evalKnox/getLastMaxKnoxMat1))
 (export "getLastMinKnoxMat2" (func $assembly/evalKnox/getLastMinKnoxMat2))
 (export "getLastMaxKnoxMat2" (func $assembly/evalKnox/getLastMaxKnoxMat2))
 (export "getLastMinKnoxMat3" (func $assembly/evalKnox/getLastMinKnoxMat3))
 (export "getLastMaxKnoxMat3" (func $assembly/evalKnox/getLastMaxKnoxMat3))
 (export "getLastMinKnoxXp" (func $assembly/evalKnox/getLastMinKnoxXp))
 (export "getLastMaxKnoxXp" (func $assembly/evalKnox/getLastMaxKnoxXp))
 (export "getLastKnoxMaxHp" (func $assembly/evalKnox/getLastKnoxMaxHp))
 (export "getLastKnoxAtk" (func $assembly/evalKnox/getLastKnoxAtk))
 (export "getLastKnoxRegen" (func $assembly/evalKnox/getLastKnoxRegen))
 (export "getLastKnoxDr" (func $assembly/evalKnox/getLastKnoxDr))
 (export "getLastKnoxBlock" (func $assembly/evalKnox/getLastKnoxBlock))
 (export "getLastKnoxEffect" (func $assembly/evalKnox/getLastKnoxEffect))
 (export "getLastKnoxCharge" (func $assembly/evalKnox/getLastKnoxCharge))
 (export "getLastKnoxChargeGain" (func $assembly/evalKnox/getLastKnoxChargeGain))
 (export "getLastKnoxReload" (func $assembly/evalKnox/getLastKnoxReload))
 (export "getLastKnoxSc" (func $assembly/evalKnox/getLastKnoxSc))
 (export "getKnoxProgressSize" (func $assembly/evalKnox/getKnoxProgressSize))
 (export "getKnoxProgressStageAt" (func $assembly/evalKnox/getKnoxProgressStageAt))
 (export "getKnoxProgressCountAt" (func $assembly/evalKnox/getKnoxProgressCountAt))
 (export "getKnoxDeathsByStageAndReviveSize" (func $assembly/evalKnox/getKnoxDeathsByStageAndReviveSize))
 (export "getKnoxDeathKeyAt" (func $assembly/evalKnox/getKnoxDeathKeyAt))
 (export "getKnoxDeathCountAt" (func $assembly/evalKnox/getKnoxDeathCountAt))
 (export "getKnoxDeathsByStageAndReviveString" (func $assembly/evalKnox/getKnoxDeathsByStageAndReviveString))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/itcms/visitRoots
  (local $0 i32)
  (local $1 i32)
  i32.const 1360
  call $~lib/rt/itcms/__visit
  i32.const 1056
  call $~lib/rt/itcms/__visit
  i32.const 7792
  call $~lib/rt/itcms/__visit
  i32.const 7920
  call $~lib/rt/itcms/__visit
  i32.const 1168
  call $~lib/rt/itcms/__visit
  i32.const 8944
  call $~lib/rt/itcms/__visit
  i32.const 10000
  call $~lib/rt/itcms/__visit
  global.get $assembly/evalBorge/ENEMIES
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalBorge/currentBorge
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalBorge/currentEnemy
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/OZZY_ENEMIES
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/bossKillsByRevive
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/bossAttemptsByRevive
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalKnox/KNOX_ENEMIES
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $~lib/rt/itcms/pinSpace
  local.tee $1
  i32.load offset=4
  i32.const -4
  i32.and
  local.set $0
  loop $while-continue|0
   local.get $0
   local.get $1
   i32.ne
   if
    local.get $0
    i32.load offset=4
    i32.const 3
    i32.and
    i32.const 3
    i32.ne
    if
     i32.const 0
     i32.const 1232
     i32.const 160
     i32.const 16
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 20
    i32.add
    call $~lib/rt/__visit_members
    local.get $0
    i32.load offset=4
    i32.const -4
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/itcms/Object#makeGray (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  global.get $~lib/rt/itcms/iter
  i32.eq
  if
   local.get $0
   i32.load offset=8
   local.tee $1
   i32.eqz
   if
    i32.const 0
    i32.const 1232
    i32.const 148
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   global.set $~lib/rt/itcms/iter
  end
  block $__inlined_func$~lib/rt/itcms/Object#unlink$2378
   local.get $0
   i32.load offset=4
   i32.const -4
   i32.and
   local.tee $1
   i32.eqz
   if
    local.get $0
    i32.load offset=8
    i32.eqz
    local.get $0
    i32.const 44388
    i32.lt_u
    i32.and
    i32.eqz
    if
     i32.const 0
     i32.const 1232
     i32.const 128
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    br $__inlined_func$~lib/rt/itcms/Object#unlink$2378
   end
   local.get $0
   i32.load offset=8
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1232
    i32.const 132
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   local.get $2
   i32.store offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store offset=4
  end
  global.get $~lib/rt/itcms/toSpace
  local.set $2
  local.get $0
  i32.load offset=12
  local.tee $1
  i32.const 2
  i32.le_u
  if (result i32)
   i32.const 1
  else
   local.get $1
   i32.const 11520
   i32.load
   i32.gt_u
   if
    i32.const 1360
    i32.const 1424
    i32.const 21
    i32.const 28
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 2
   i32.shl
   i32.const 11524
   i32.add
   i32.load
   i32.const 32
   i32.and
  end
  local.set $3
  local.get $2
  i32.load offset=8
  local.set $1
  local.get $0
  global.get $~lib/rt/itcms/white
  i32.eqz
  i32.const 2
  local.get $3
  select
  local.get $2
  i32.or
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $1
  local.get $0
  local.get $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store offset=4
  local.get $2
  local.get $0
  i32.store offset=8
 )
 (func $~lib/rt/itcms/__visit (param $0 i32)
  local.get $0
  i32.eqz
  if
   return
  end
  global.get $~lib/rt/itcms/white
  local.get $0
  i32.const 20
  i32.sub
  local.tee $0
  i32.load offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   call $~lib/rt/itcms/Object#makeGray
   global.get $~lib/rt/itcms/visitCount
   i32.const 1
   i32.add
   global.set $~lib/rt/itcms/visitCount
  end
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.tee $3
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $3
   local.get $3
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $3
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $2
   local.get $3
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $3
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load offset=8
  local.set $5
  local.get $1
  i32.load offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   i32.store offset=8
  end
  local.get $5
  if
   local.get $5
   local.get $4
   i32.store offset=4
  end
  local.get $1
  local.get $0
  local.get $2
  i32.const 4
  i32.shl
  local.get $3
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.tee $1
  i32.load offset=96
  i32.eq
  if
   local.get $1
   local.get $5
   i32.store offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load offset=4
    i32.const -2
    local.get $3
    i32.rotl
    i32.and
    local.set $3
    local.get $1
    local.get $3
    i32.store offset=4
    local.get $3
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load
     i32.const -2
     local.get $2
     i32.rotl
     i32.and
     i32.store
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load
   local.tee $1
   i32.load
   local.tee $6
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1504
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  i32.ne
  if
   i32.const 0
   i32.const 1504
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $5
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  local.get $3
  i32.store offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store offset=96
  local.get $0
  local.get $0
  i32.load
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $2
  local.get $1
  i64.extend_i32_u
  i64.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load offset=1568
  local.tee $3
  if
   local.get $3
   i32.const 4
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1504
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   local.get $1
   i32.const 16
   i32.sub
   local.tee $5
   i32.eq
   if
    local.get $3
    i32.load
    local.set $4
    local.get $5
    local.set $1
   end
  else
   local.get $0
   i32.const 1572
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1504
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $3
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $4
  i32.const 2
  i32.and
  local.get $3
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  i32.store
  local.get $0
  local.get $3
  i32.store offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
  (local $1 i32)
  memory.size
  local.tee $1
  i32.const 0
  i32.le_s
  if (result i32)
   i32.const 1
   local.get $1
   i32.sub
   memory.grow
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  i32.const 44400
  i32.const 0
  i32.store
  i32.const 45968
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $0
   i32.const 23
   i32.lt_u
   if
    local.get $0
    i32.const 2
    i32.shl
    i32.const 44400
    i32.add
    i32.const 0
    i32.store offset=4
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     i32.const 16
     i32.lt_u
     if
      local.get $0
      i32.const 4
      i32.shl
      local.get $1
      i32.add
      i32.const 2
      i32.shl
      i32.const 44400
      i32.add
      i32.const 0
      i32.store offset=96
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 44400
  i32.const 45972
  memory.size
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 44400
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/itcms/step (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $break|0
   block $case2|0
    block $case1|0
     block $case0|0
      global.get $~lib/rt/itcms/state
      br_table $case0|0 $case1|0 $case2|0 $break|0
     end
     i32.const 1
     global.set $~lib/rt/itcms/state
     i32.const 0
     global.set $~lib/rt/itcms/visitCount
     call $~lib/rt/itcms/visitRoots
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/iter
     global.get $~lib/rt/itcms/visitCount
     return
    end
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.set $1
    global.get $~lib/rt/itcms/iter
    i32.load offset=4
    i32.const -4
    i32.and
    local.set $0
    loop $while-continue|1
     local.get $0
     global.get $~lib/rt/itcms/toSpace
     i32.ne
     if
      local.get $0
      global.set $~lib/rt/itcms/iter
      local.get $1
      local.get $0
      i32.load offset=4
      local.tee $2
      i32.const 3
      i32.and
      i32.ne
      if
       local.get $0
       local.get $2
       i32.const -4
       i32.and
       local.get $1
       i32.or
       i32.store offset=4
       i32.const 0
       global.set $~lib/rt/itcms/visitCount
       local.get $0
       i32.const 20
       i32.add
       call $~lib/rt/__visit_members
       global.get $~lib/rt/itcms/visitCount
       return
      end
      local.get $0
      i32.load offset=4
      i32.const -4
      i32.and
      local.set $0
      br $while-continue|1
     end
    end
    i32.const 0
    global.set $~lib/rt/itcms/visitCount
    call $~lib/rt/itcms/visitRoots
    global.get $~lib/rt/itcms/toSpace
    global.get $~lib/rt/itcms/iter
    i32.load offset=4
    i32.const -4
    i32.and
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.set $0
     loop $while-continue|0
      local.get $0
      i32.const 44388
      i32.lt_u
      if
       local.get $0
       i32.load
       call $~lib/rt/itcms/__visit
       local.get $0
       i32.const 4
       i32.add
       local.set $0
       br $while-continue|0
      end
     end
     global.get $~lib/rt/itcms/iter
     i32.load offset=4
     i32.const -4
     i32.and
     local.set $0
     loop $while-continue|2
      local.get $0
      global.get $~lib/rt/itcms/toSpace
      i32.ne
      if
       local.get $1
       local.get $0
       i32.load offset=4
       local.tee $2
       i32.const 3
       i32.and
       i32.ne
       if
        local.get $0
        local.get $2
        i32.const -4
        i32.and
        local.get $1
        i32.or
        i32.store offset=4
        local.get $0
        i32.const 20
        i32.add
        call $~lib/rt/__visit_members
       end
       local.get $0
       i32.load offset=4
       i32.const -4
       i32.and
       local.set $0
       br $while-continue|2
      end
     end
     global.get $~lib/rt/itcms/fromSpace
     local.set $0
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/fromSpace
     local.get $0
     global.set $~lib/rt/itcms/toSpace
     local.get $1
     global.set $~lib/rt/itcms/white
     local.get $0
     i32.load offset=4
     i32.const -4
     i32.and
     global.set $~lib/rt/itcms/iter
     i32.const 2
     global.set $~lib/rt/itcms/state
    end
    global.get $~lib/rt/itcms/visitCount
    return
   end
   global.get $~lib/rt/itcms/iter
   local.tee $0
   global.get $~lib/rt/itcms/toSpace
   i32.ne
   if
    local.get $0
    i32.load offset=4
    local.tee $1
    i32.const -4
    i32.and
    global.set $~lib/rt/itcms/iter
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.get $1
    i32.const 3
    i32.and
    i32.ne
    if
     i32.const 0
     i32.const 1232
     i32.const 229
     i32.const 20
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 44388
    i32.lt_u
    if
     local.get $0
     i32.const 0
     i32.store offset=4
     local.get $0
     i32.const 0
     i32.store offset=8
    else
     global.get $~lib/rt/itcms/total
     local.get $0
     i32.load
     i32.const -4
     i32.and
     i32.const 4
     i32.add
     i32.sub
     global.set $~lib/rt/itcms/total
     local.get $0
     i32.const 4
     i32.add
     local.tee $0
     i32.const 44388
     i32.ge_u
     if
      global.get $~lib/rt/tlsf/ROOT
      i32.eqz
      if
       call $~lib/rt/tlsf/initialize
      end
      global.get $~lib/rt/tlsf/ROOT
      local.get $0
      i32.const 4
      i32.sub
      local.set $2
      local.get $0
      i32.const 15
      i32.and
      i32.const 1
      local.get $0
      select
      if (result i32)
       i32.const 1
      else
       local.get $2
       i32.load
       i32.const 1
       i32.and
      end
      if
       i32.const 0
       i32.const 1504
       i32.const 562
       i32.const 3
       call $~lib/builtins/abort
       unreachable
      end
      local.get $2
      local.get $2
      i32.load
      i32.const 1
      i32.or
      i32.store
      local.get $2
      call $~lib/rt/tlsf/insertBlock
     end
    end
    i32.const 10
    return
   end
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   i32.store offset=4
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   i32.store offset=8
   i32.const 0
   global.set $~lib/rt/itcms/state
  end
  i32.const 0
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if
   local.get $1
   i32.const 4
   i32.shr_u
   local.set $1
  else
   local.get $1
   i32.const 536870910
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.const 27
    local.get $1
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.set $1
   end
   local.get $1
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   local.tee $2
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $1
   local.get $2
   i32.const 7
   i32.sub
   local.set $2
  end
  local.get $1
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
  else
   local.get $0
   i32.load
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 1504
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/itcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.ge_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 261
   i32.const 31
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.ge_u
  if
   block $__inlined_func$~lib/rt/itcms/interrupt$69
    i32.const 2048
    local.set $2
    loop $do-loop|0
     local.get $2
     call $~lib/rt/itcms/step
     i32.sub
     local.set $2
     global.get $~lib/rt/itcms/state
     i32.eqz
     if
      global.get $~lib/rt/itcms/total
      i64.extend_i32_u
      i64.const 200
      i64.mul
      i64.const 100
      i64.div_u
      i32.wrap_i64
      i32.const 1024
      i32.add
      global.set $~lib/rt/itcms/threshold
      br $__inlined_func$~lib/rt/itcms/interrupt$69
     end
     local.get $2
     i32.const 0
     i32.gt_s
     br_if $do-loop|0
    end
    global.get $~lib/rt/itcms/total
    global.get $~lib/rt/itcms/total
    global.get $~lib/rt/itcms/threshold
    i32.sub
    i32.const 1024
    i32.lt_u
    i32.const 10
    i32.shl
    i32.add
    global.set $~lib/rt/itcms/threshold
   end
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.set $4
  local.get $0
  i32.const 16
  i32.add
  local.tee $2
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1168
   i32.const 1504
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  i32.const 12
  i32.le_u
  if (result i32)
   i32.const 12
  else
   local.get $2
   i32.const 19
   i32.add
   i32.const -16
   i32.and
   i32.const 4
   i32.sub
  end
  local.tee $5
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   memory.size
   local.tee $2
   local.get $5
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $5
    i32.const 536870910
    i32.lt_u
    if (result i32)
     local.get $5
     i32.const 1
     i32.const 27
     local.get $5
     i32.clz
     i32.sub
     i32.shl
     i32.add
     i32.const 1
     i32.sub
    else
     local.get $5
    end
   else
    local.get $5
   end
   i32.const 4
   local.get $4
   i32.load offset=1568
   local.get $2
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $2
   local.get $3
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $4
   local.get $2
   i32.const 16
   i32.shl
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/searchBlock
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1504
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $5
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.gt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load
  local.set $6
  local.get $5
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 1504
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $6
  i32.const -4
  i32.and
  local.get $5
  i32.sub
  local.tee $3
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $5
   local.get $6
   i32.const 2
   i32.and
   i32.or
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.add
   local.tee $5
   local.get $3
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $6
   i32.const -2
   i32.and
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   local.get $3
   i32.load
   i32.const -3
   i32.and
   i32.store
  end
  local.get $2
  local.get $1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  global.get $~lib/rt/itcms/fromSpace
  local.tee $1
  i32.load offset=8
  local.set $3
  local.get $2
  local.get $1
  global.get $~lib/rt/itcms/white
  i32.or
  i32.store offset=4
  local.get $2
  local.get $3
  i32.store offset=8
  local.get $3
  local.get $2
  local.get $3
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store offset=4
  local.get $1
  local.get $2
  i32.store offset=8
  global.get $~lib/rt/itcms/total
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/itcms/total
  local.get $2
  i32.const 20
  i32.add
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill
  local.get $1
 )
 (func $~lib/rt/itcms/__link (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  i32.eqz
  if
   return
  end
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 1232
   i32.const 295
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/white
  local.get $1
  i32.const 20
  i32.sub
  local.tee $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   i32.const 20
   i32.sub
   local.tee $0
   i32.load offset=4
   i32.const 3
   i32.and
   local.tee $3
   global.get $~lib/rt/itcms/white
   i32.eqz
   i32.eq
   if
    local.get $0
    local.get $1
    local.get $2
    select
    call $~lib/rt/itcms/Object#makeGray
   else
    global.get $~lib/rt/itcms/state
    i32.const 1
    i32.eq
    local.get $3
    i32.const 3
    i32.eq
    i32.and
    if
     local.get $1
     call $~lib/rt/itcms/Object#makeGray
    end
   end
  end
 )
 (func $~lib/math/NativeMath.pow (param $0 f64) (param $1 f64) (result f64)
  (local $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  (local $10 f64)
  (local $11 i64)
  (local $12 i64)
  (local $13 f64)
  (local $14 f64)
  (local $15 f64)
  (local $16 f64)
  (local $17 f64)
  (local $18 i32)
  local.get $1
  f64.abs
  f64.const 2
  f64.le
  if
   local.get $1
   f64.const 2
   f64.eq
   if
    local.get $0
    local.get $0
    f64.mul
    return
   end
   local.get $1
   f64.const 0.5
   f64.eq
   if
    local.get $0
    f64.sqrt
    f64.abs
    f64.const inf
    local.get $0
    f64.const -inf
    f64.ne
    select
    return
   end
   local.get $1
   f64.const -1
   f64.eq
   if
    f64.const 1
    local.get $0
    f64.div
    return
   end
   local.get $1
   f64.const 1
   f64.eq
   if
    local.get $0
    return
   end
   local.get $1
   f64.const 0
   f64.eq
   if
    f64.const 1
    return
   end
  end
  block $~lib/util/math/pow_lut|inlined.0 (result f64)
   local.get $1
   i64.reinterpret_f64
   local.tee $11
   i64.const 52
   i64.shr_u
   local.set $6
   local.get $0
   i64.reinterpret_f64
   local.tee $2
   i64.const 52
   i64.shr_u
   local.tee $5
   i64.const 1
   i64.sub
   i64.const 2046
   i64.ge_u
   if (result i32)
    i32.const 1
   else
    local.get $6
    i64.const 2047
    i64.and
    i64.const 958
    i64.sub
    i64.const 128
    i64.ge_u
   end
   if
    local.get $11
    i64.const 1
    i64.shl
    local.tee $12
    i64.const 1
    i64.sub
    i64.const -9007199254740993
    i64.ge_u
    if
     f64.const 1
     local.get $12
     i64.eqz
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const nan:0x8000000000000
     local.get $2
     i64.const 4607182418800017408
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $0
     local.get $1
     f64.add
     local.get $12
     i64.const -9007199254740992
     i64.gt_u
     local.get $2
     i64.const 1
     i64.shl
     local.tee $2
     i64.const -9007199254740992
     i64.gt_u
     i32.or
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const nan:0x8000000000000
     local.get $2
     i64.const 9214364837600034816
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const 0
     local.get $11
     i64.const 63
     i64.shr_u
     i64.eqz
     local.get $2
     i64.const 9214364837600034816
     i64.lt_u
     i32.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $1
     local.get $1
     f64.mul
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $2
    i64.const 1
    i64.shl
    i64.const 1
    i64.sub
    i64.const -9007199254740993
    i64.ge_u
    if
     f64.const 1
     local.get $0
     local.get $0
     f64.mul
     local.tee $0
     f64.neg
     local.get $0
     local.get $2
     i64.const 63
     i64.shr_u
     i32.wrap_i64
     if (result i32)
      block $~lib/util/math/checkint|inlined.0 (result i32)
       i32.const 0
       local.get $11
       i64.const 52
       i64.shr_u
       i64.const 2047
       i64.and
       local.tee $2
       i64.const 1023
       i64.lt_u
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 2
       local.get $2
       i64.const 1075
       i64.gt_u
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 0
       local.get $11
       i64.const 1
       i64.const 1075
       local.get $2
       i64.sub
       i64.shl
       local.tee $2
       i64.const 1
       i64.sub
       i64.and
       i64.const 0
       i64.ne
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 1
       local.get $2
       local.get $11
       i64.and
       i64.const 0
       i64.ne
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 2
      end
      i32.const 1
      i32.eq
     else
      i32.const 0
     end
     select
     local.tee $0
     f64.div
     local.get $0
     local.get $11
     i64.const 0
     i64.lt_s
     select
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $2
    i64.const 0
    i64.lt_s
    if
     block $~lib/util/math/checkint|inlined.1 (result i32)
      i32.const 0
      local.get $11
      i64.const 52
      i64.shr_u
      i64.const 2047
      i64.and
      local.tee $12
      i64.const 1023
      i64.lt_u
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 2
      local.get $12
      i64.const 1075
      i64.gt_u
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 0
      local.get $11
      i64.const 1
      i64.const 1075
      local.get $12
      i64.sub
      i64.shl
      local.tee $12
      i64.const 1
      i64.sub
      i64.and
      i64.const 0
      i64.ne
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 1
      local.get $11
      local.get $12
      i64.and
      i64.const 0
      i64.ne
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 2
     end
     local.tee $3
     i32.eqz
     if
      local.get $0
      local.get $0
      f64.sub
      local.tee $0
      local.get $0
      f64.div
      br $~lib/util/math/pow_lut|inlined.0
     end
     local.get $5
     i64.const 2047
     i64.and
     local.set $5
     i32.const 262144
     i32.const 0
     local.get $3
     i32.const 1
     i32.eq
     select
     local.set $4
     local.get $2
     i64.const 9223372036854775807
     i64.and
     local.set $2
    end
    local.get $6
    i64.const 2047
    i64.and
    local.tee $12
    i64.const 958
    i64.sub
    i64.const 128
    i64.ge_u
    if
     f64.const 1
     local.get $2
     i64.const 4607182418800017408
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const 1
     local.get $12
     i64.const 958
     i64.lt_u
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const inf
     f64.const 0
     local.get $6
     i64.const 2048
     i64.lt_u
     local.get $2
     i64.const 4607182418800017408
     i64.gt_u
     i32.eq
     select
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $5
    i64.eqz
    if
     local.get $0
     f64.const 4503599627370496
     f64.mul
     i64.reinterpret_f64
     i64.const 9223372036854775807
     i64.and
     i64.const 234187180623265792
     i64.sub
     local.set $2
    end
   end
   local.get $2
   local.get $2
   i64.const 4604531861337669632
   i64.sub
   local.tee $2
   i64.const -4503599627370496
   i64.and
   i64.sub
   local.tee $5
   i64.const 2147483648
   i64.add
   i64.const -4294967296
   i64.and
   f64.reinterpret_i64
   local.tee $7
   local.get $2
   i64.const 45
   i64.shr_u
   i64.const 127
   i64.and
   i32.wrap_i64
   i32.const 5
   i32.shl
   i32.const 1616
   i32.add
   local.tee $3
   f64.load
   local.tee $8
   f64.mul
   f64.const -1
   f64.add
   local.set $9
   local.get $2
   i64.const 52
   i64.shr_s
   f64.convert_i64_s
   local.tee $13
   f64.const 0.6931471805598903
   f64.mul
   local.get $3
   f64.load offset=16
   f64.add
   local.tee $0
   local.get $9
   local.get $5
   f64.reinterpret_i64
   local.get $7
   f64.sub
   local.get $8
   f64.mul
   local.tee $7
   f64.add
   local.tee $14
   f64.add
   local.set $15
   local.get $14
   local.get $14
   f64.const -0.5
   f64.mul
   local.tee $8
   f64.mul
   local.set $16
   local.get $15
   local.get $9
   local.get $9
   f64.const -0.5
   f64.mul
   local.tee $17
   f64.mul
   local.tee $9
   f64.add
   local.tee $10
   local.get $10
   local.get $13
   f64.const 5.497923018708371e-14
   f64.mul
   local.get $3
   f64.load offset=24
   f64.add
   local.get $0
   local.get $15
   f64.sub
   local.get $14
   f64.add
   f64.add
   local.get $7
   local.get $8
   local.get $17
   f64.add
   f64.mul
   f64.add
   local.get $15
   local.get $10
   f64.sub
   local.get $9
   f64.add
   f64.add
   local.get $14
   local.get $16
   f64.mul
   local.get $14
   f64.const 0.5000000000000007
   f64.mul
   f64.const -0.6666666666666679
   f64.add
   local.get $16
   local.get $14
   f64.const -0.6666666663487739
   f64.mul
   f64.const 0.7999999995323976
   f64.add
   local.get $16
   local.get $14
   f64.const 1.0000415263675542
   f64.mul
   f64.const -1.142909628459501
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.tee $0
   f64.add
   local.tee $7
   f64.sub
   local.get $0
   f64.add
   global.set $~lib/util/math/log_tail
   block $~lib/util/math/exp_inline|inlined.0 (result f64)
    local.get $11
    i64.const -134217728
    i64.and
    f64.reinterpret_i64
    local.tee $0
    local.get $7
    i64.reinterpret_f64
    i64.const -134217728
    i64.and
    f64.reinterpret_i64
    local.tee $8
    f64.mul
    local.tee $9
    i64.reinterpret_f64
    local.tee $2
    i64.const 52
    i64.shr_u
    i32.wrap_i64
    i32.const 2047
    i32.and
    local.tee $3
    i32.const 969
    i32.sub
    local.tee $18
    i32.const 63
    i32.ge_u
    if
     f64.const -1
     f64.const 1
     local.get $4
     select
     local.get $18
     i32.const -2147483648
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     f64.const -0
     f64.const 0
     local.get $4
     select
     f64.const -inf
     f64.const inf
     local.get $4
     select
     local.get $2
     i64.const 0
     i64.lt_s
     select
     local.get $3
     i32.const 1033
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     i32.const 0
     local.set $3
    end
    local.get $9
    f64.const 184.6649652337873
    f64.mul
    f64.const 6755399441055744
    f64.add
    local.tee $10
    i64.reinterpret_f64
    local.tee $2
    i64.const 127
    i64.and
    i64.const 1
    i64.shl
    i32.wrap_i64
    i32.const 3
    i32.shl
    i32.const 5712
    i32.add
    local.tee $18
    i64.load offset=8
    local.get $2
    local.get $4
    i64.extend_i32_u
    i64.add
    i64.const 45
    i64.shl
    i64.add
    local.set $5
    local.get $9
    local.get $10
    f64.const -6755399441055744
    f64.add
    local.tee $9
    f64.const -0.005415212348111709
    f64.mul
    f64.add
    local.get $9
    f64.const -1.2864023111638346e-14
    f64.mul
    f64.add
    local.get $1
    local.get $0
    f64.sub
    local.get $8
    f64.mul
    local.get $1
    local.get $7
    local.get $8
    f64.sub
    global.get $~lib/util/math/log_tail
    f64.add
    f64.mul
    f64.add
    f64.add
    local.tee $0
    local.get $0
    f64.mul
    local.set $1
    local.get $18
    f64.load
    local.get $0
    f64.add
    local.get $1
    local.get $0
    f64.const 0.16666666666665886
    f64.mul
    f64.const 0.49999999999996786
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $1
    f64.mul
    local.get $0
    f64.const 0.008333335853059549
    f64.mul
    f64.const 0.0416666808410674
    f64.add
    f64.mul
    f64.add
    local.set $0
    local.get $3
    i32.eqz
    if
     block $~lib/util/math/specialcase|inlined.0 (result f64)
      local.get $2
      i64.const 2147483648
      i64.and
      i64.eqz
      if
       local.get $5
       i64.const 4544132024016830464
       i64.sub
       f64.reinterpret_i64
       local.tee $1
       local.get $1
       local.get $0
       f64.mul
       f64.add
       f64.const 5486124068793688683255936e279
       f64.mul
       br $~lib/util/math/specialcase|inlined.0
      end
      local.get $5
      i64.const 4602678819172646912
      i64.add
      local.tee $2
      f64.reinterpret_i64
      local.tee $1
      local.get $0
      f64.mul
      local.set $0
      local.get $1
      local.get $0
      f64.add
      local.tee $7
      f64.abs
      f64.const 1
      f64.lt
      if (result f64)
       f64.const 1
       local.get $7
       f64.copysign
       local.tee $8
       local.get $7
       f64.add
       local.tee $9
       local.get $8
       local.get $9
       f64.sub
       local.get $7
       f64.add
       local.get $1
       local.get $7
       f64.sub
       local.get $0
       f64.add
       f64.add
       f64.add
       local.get $8
       f64.sub
       local.tee $0
       f64.const 0
       f64.eq
       if (result f64)
        local.get $2
        i64.const -9223372036854775808
        i64.and
        f64.reinterpret_i64
       else
        local.get $0
       end
      else
       local.get $7
      end
      f64.const 2.2250738585072014e-308
      f64.mul
     end
     br $~lib/util/math/exp_inline|inlined.0
    end
    local.get $5
    f64.reinterpret_i64
    local.tee $1
    local.get $1
    local.get $0
    f64.mul
    f64.add
   end
  end
 )
 (func $assembly/evalBorge/multi (param $0 i32) (result f64)
  local.get $0
  i32.const 149
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.const 1
  f64.add
  local.get $0
  i32.const 199
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 249
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 299
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 309
  i32.sub
  f64.convert_i32_s
  f64.const 0.003
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 319
  i32.sub
  f64.convert_i32_s
  f64.const 0.003
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 329
  i32.sub
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 339
  i32.sub
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 349
  i32.sub
  f64.convert_i32_s
  f64.const 0.005
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 359
  i32.sub
  f64.convert_i32_s
  f64.const 0.005
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 369
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 379
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 389
  i32.sub
  f64.convert_i32_s
  f64.const 0.007
  f64.mul
  f64.const 0
  f64.max
  f64.add
  f64.const 1
  f64.max
  f64.const 1.01
  local.get $0
  i32.const 350
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  call $~lib/math/NativeMath.pow
  f64.mul
 )
 (func $assembly/evalKnox/knoxMulti (param $0 i32) (result f64)
  local.get $0
  i32.const 49
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 1
  f64.add
  local.get $0
  i32.const 99
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 119
  i32.sub
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 129
  i32.sub
  f64.convert_i32_s
  f64.const 0.008
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 139
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 149
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 159
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 169
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 179
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 189
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 199
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 219
  i32.sub
  f64.convert_i32_s
  f64.const 0.02
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 249
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 299
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 309
  i32.sub
  f64.convert_i32_s
  f64.const 0.003
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 319
  i32.sub
  f64.convert_i32_s
  f64.const 0.02
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 329
  i32.sub
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 339
  i32.sub
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 349
  i32.sub
  f64.convert_i32_s
  f64.const 0.005
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 359
  i32.sub
  f64.convert_i32_s
  f64.const 0.005
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 369
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 379
  i32.sub
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.const 0
  f64.max
  f64.add
  local.get $0
  i32.const 389
  i32.sub
  f64.convert_i32_s
  f64.const 0.007
  f64.mul
  f64.const 0
  f64.max
  f64.add
  f64.const 1
  f64.max
 )
 (func $assembly/index/testMultiFunction (result f64)
  (local $0 i32)
  (local $1 f64)
  loop $for-loop|0
   local.get $0
   i32.const 100000
   i32.lt_s
   if
    local.get $1
    local.get $0
    i32.const 1000
    i32.rem_s
    call $assembly/evalBorge/multi
    f64.add
    local.set $1
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  local.get $1
 )
 (func $assembly/index/getWasmBuildTimestamp (result i32)
  i32.const 20250613
 )
 (func $~lib/util/number/utoa32_dec_lut (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  loop $while-continue|0
   local.get $1
   i32.const 10000
   i32.ge_u
   if
    local.get $1
    i32.const 10000
    i32.rem_u
    local.set $3
    local.get $1
    i32.const 10000
    i32.div_u
    local.set $1
    local.get $0
    local.get $2
    i32.const 4
    i32.sub
    local.tee $2
    i32.const 1
    i32.shl
    i32.add
    local.get $3
    i32.const 100
    i32.div_u
    i32.const 2
    i32.shl
    i32.const 8524
    i32.add
    i64.load32_u
    local.get $3
    i32.const 100
    i32.rem_u
    i32.const 2
    i32.shl
    i32.const 8524
    i32.add
    i64.load32_u
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 100
  i32.ge_u
  if
   local.get $0
   local.get $2
   i32.const 2
   i32.sub
   local.tee $2
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 100
   i32.rem_u
   i32.const 2
   i32.shl
   i32.const 8524
   i32.add
   i32.load
   i32.store
   local.get $1
   i32.const 100
   i32.div_u
   local.set $1
  end
  local.get $1
  i32.const 10
  i32.ge_u
  if
   local.get $0
   local.get $2
   i32.const 2
   i32.sub
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 2
   i32.shl
   i32.const 8524
   i32.add
   i32.load
   i32.store
  else
   local.get $0
   local.get $2
   i32.const 1
   i32.sub
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 48
   i32.add
   i32.store16
  end
 )
 (func $~lib/number/I32#toString (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  block $__inlined_func$~lib/util/number/itoa32$84
   local.get $0
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    i32.const 4
    i32.add
    global.set $~lib/memory/__stack_pointer
    i32.const 8512
    local.set $0
    br $__inlined_func$~lib/util/number/itoa32$84
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   local.get $0
   i32.sub
   local.get $0
   local.get $0
   i32.const 31
   i32.shr_u
   i32.const 1
   i32.shl
   local.tee $1
   select
   local.tee $3
   i32.const 100000
   i32.lt_u
   if (result i32)
    local.get $3
    i32.const 100
    i32.lt_u
    if (result i32)
     local.get $3
     i32.const 10
     i32.ge_u
     i32.const 1
     i32.add
    else
     local.get $3
     i32.const 10000
     i32.ge_u
     i32.const 3
     i32.add
     local.get $3
     i32.const 1000
     i32.ge_u
     i32.add
    end
   else
    local.get $3
    i32.const 10000000
    i32.lt_u
    if (result i32)
     local.get $3
     i32.const 1000000
     i32.ge_u
     i32.const 6
     i32.add
    else
     local.get $3
     i32.const 1000000000
     i32.ge_u
     i32.const 8
     i32.add
     local.get $3
     i32.const 100000000
     i32.ge_u
     i32.add
    end
   end
   local.tee $2
   i32.const 1
   i32.shl
   local.get $1
   i32.add
   i32.const 2
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   local.get $0
   local.get $1
   i32.add
   local.get $3
   local.get $2
   call $~lib/util/number/utoa32_dec_lut
   local.get $1
   if
    local.get $0
    i32.const 45
    i32.store16
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
  end
  local.get $0
 )
 (func $~lib/util/number/genDigits (param $0 i64) (param $1 i64) (param $2 i32) (param $3 i64) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i64)
  (local $8 i32)
  (local $9 i64)
  (local $10 i64)
  (local $11 i32)
  (local $12 i64)
  local.get $1
  local.get $0
  i64.sub
  local.set $10
  i64.const 1
  i32.const 0
  local.get $2
  i32.sub
  local.tee $11
  i64.extend_i32_s
  local.tee $0
  i64.shl
  local.tee $7
  i64.const 1
  i64.sub
  local.tee $12
  local.get $1
  i64.and
  local.set $9
  local.get $1
  local.get $0
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 100000
  i32.lt_u
  if (result i32)
   local.get $5
   i32.const 100
   i32.lt_u
   if (result i32)
    local.get $5
    i32.const 10
    i32.ge_u
    i32.const 1
    i32.add
   else
    local.get $5
    i32.const 10000
    i32.ge_u
    i32.const 3
    i32.add
    local.get $5
    i32.const 1000
    i32.ge_u
    i32.add
   end
  else
   local.get $5
   i32.const 10000000
   i32.lt_u
   if (result i32)
    local.get $5
    i32.const 1000000
    i32.ge_u
    i32.const 6
    i32.add
   else
    local.get $5
    i32.const 1000000000
    i32.ge_u
    i32.const 8
    i32.add
    local.get $5
    i32.const 100000000
    i32.ge_u
    i32.add
   end
  end
  local.set $8
  loop $while-continue|0
   local.get $8
   i32.const 0
   i32.gt_s
   if
    block $break|1
     block $case10|1
      block $case9|1
       block $case8|1
        block $case7|1
         block $case6|1
          block $case5|1
           block $case4|1
            block $case3|1
             block $case2|1
              block $case1|1
               block $case0|1
                local.get $8
                i32.const 1
                i32.sub
                br_table $case9|1 $case8|1 $case7|1 $case6|1 $case5|1 $case4|1 $case3|1 $case2|1 $case1|1 $case0|1 $case10|1
               end
               local.get $5
               i32.const 1000000000
               i32.div_u
               local.set $6
               local.get $5
               i32.const 1000000000
               i32.rem_u
               local.set $5
               br $break|1
              end
              local.get $5
              i32.const 100000000
              i32.div_u
              local.set $6
              local.get $5
              i32.const 100000000
              i32.rem_u
              local.set $5
              br $break|1
             end
             local.get $5
             i32.const 10000000
             i32.div_u
             local.set $6
             local.get $5
             i32.const 10000000
             i32.rem_u
             local.set $5
             br $break|1
            end
            local.get $5
            i32.const 1000000
            i32.div_u
            local.set $6
            local.get $5
            i32.const 1000000
            i32.rem_u
            local.set $5
            br $break|1
           end
           local.get $5
           i32.const 100000
           i32.div_u
           local.set $6
           local.get $5
           i32.const 100000
           i32.rem_u
           local.set $5
           br $break|1
          end
          local.get $5
          i32.const 10000
          i32.div_u
          local.set $6
          local.get $5
          i32.const 10000
          i32.rem_u
          local.set $5
          br $break|1
         end
         local.get $5
         i32.const 1000
         i32.div_u
         local.set $6
         local.get $5
         i32.const 1000
         i32.rem_u
         local.set $5
         br $break|1
        end
        local.get $5
        i32.const 100
        i32.div_u
        local.set $6
        local.get $5
        i32.const 100
        i32.rem_u
        local.set $5
        br $break|1
       end
       local.get $5
       i32.const 10
       i32.div_u
       local.set $6
       local.get $5
       i32.const 10
       i32.rem_u
       local.set $5
       br $break|1
      end
      local.get $5
      local.set $6
      i32.const 0
      local.set $5
      br $break|1
     end
     i32.const 0
     local.set $6
    end
    local.get $4
    local.get $6
    i32.or
    if
     local.get $4
     local.tee $2
     i32.const 1
     i32.add
     local.set $4
     local.get $2
     i32.const 1
     i32.shl
     i32.const 10368
     i32.add
     local.get $6
     i32.const 65535
     i32.and
     i32.const 48
     i32.add
     i32.store16
    end
    local.get $8
    i32.const 1
    i32.sub
    local.set $8
    local.get $3
    local.get $5
    i64.extend_i32_u
    local.get $11
    i64.extend_i32_s
    local.tee $1
    i64.shl
    local.get $9
    i64.add
    local.tee $0
    i64.ge_u
    if
     global.get $~lib/util/number/_K
     local.get $8
     i32.add
     global.set $~lib/util/number/_K
     local.get $8
     i32.const 2
     i32.shl
     i32.const 11296
     i32.add
     i64.load32_u
     local.get $1
     i64.shl
     local.set $7
     local.get $4
     i32.const 1
     i32.shl
     i32.const 10366
     i32.add
     local.tee $2
     i32.load16_u
     local.set $6
     loop $while-continue|3
      local.get $0
      local.get $10
      i64.lt_u
      local.get $3
      local.get $0
      i64.sub
      local.get $7
      i64.ge_u
      i32.and
      if (result i32)
       local.get $10
       local.get $0
       local.get $7
       i64.add
       local.tee $1
       i64.gt_u
       local.get $10
       local.get $0
       i64.sub
       local.get $1
       local.get $10
       i64.sub
       i64.gt_u
       i32.or
      else
       i32.const 0
      end
      if
       local.get $6
       i32.const 1
       i32.sub
       local.set $6
       local.get $0
       local.get $7
       i64.add
       local.set $0
       br $while-continue|3
      end
     end
     local.get $2
     local.get $6
     i32.store16
     local.get $4
     return
    end
    br $while-continue|0
   end
  end
  loop $while-continue|4
   local.get $3
   i64.const 10
   i64.mul
   local.set $3
   local.get $9
   i64.const 10
   i64.mul
   local.tee $1
   local.get $11
   i64.extend_i32_s
   i64.shr_u
   local.tee $0
   local.get $4
   i64.extend_i32_s
   i64.or
   i64.const 0
   i64.ne
   if
    local.get $4
    local.tee $2
    i32.const 1
    i32.add
    local.set $4
    local.get $2
    i32.const 1
    i32.shl
    i32.const 10368
    i32.add
    local.get $0
    i32.wrap_i64
    i32.const 65535
    i32.and
    i32.const 48
    i32.add
    i32.store16
   end
   local.get $8
   i32.const 1
   i32.sub
   local.set $8
   local.get $1
   local.get $12
   i64.and
   local.tee $9
   local.get $3
   i64.ge_u
   br_if $while-continue|4
  end
  global.get $~lib/util/number/_K
  local.get $8
  i32.add
  global.set $~lib/util/number/_K
  local.get $10
  i32.const 0
  local.get $8
  i32.sub
  i32.const 2
  i32.shl
  i32.const 11296
  i32.add
  i64.load32_u
  i64.mul
  local.set $1
  local.get $4
  i32.const 1
  i32.shl
  i32.const 10366
  i32.add
  local.tee $2
  i32.load16_u
  local.set $6
  loop $while-continue|6
   local.get $1
   local.get $9
   i64.gt_u
   local.get $3
   local.get $9
   i64.sub
   local.get $7
   i64.ge_u
   i32.and
   if (result i32)
    local.get $1
    local.get $7
    local.get $9
    i64.add
    local.tee $0
    i64.gt_u
    local.get $1
    local.get $9
    i64.sub
    local.get $0
    local.get $1
    i64.sub
    i64.gt_u
    i32.or
   else
    i32.const 0
   end
   if
    local.get $6
    i32.const 1
    i32.sub
    local.set $6
    local.get $7
    local.get $9
    i64.add
    local.set $9
    br $while-continue|6
   end
  end
  local.get $2
  local.get $6
  i32.store16
  local.get $4
 )
 (func $~lib/util/number/prettify (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  local.get $2
  i32.eqz
  if
   local.get $0
   local.get $1
   i32.const 1
   i32.shl
   i32.add
   i32.const 3145774
   i32.store
   local.get $1
   i32.const 2
   i32.add
   return
  end
  local.get $1
  local.get $2
  i32.add
  local.tee $3
  i32.const 21
  i32.le_s
  local.get $1
  local.get $3
  i32.le_s
  i32.and
  if (result i32)
   loop $for-loop|0
    local.get $1
    local.get $3
    i32.lt_s
    if
     local.get $0
     local.get $1
     i32.const 1
     i32.shl
     i32.add
     i32.const 48
     i32.store16
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   local.get $0
   local.get $3
   i32.const 1
   i32.shl
   i32.add
   i32.const 3145774
   i32.store
   local.get $3
   i32.const 2
   i32.add
  else
   local.get $3
   i32.const 21
   i32.le_s
   local.get $3
   i32.const 0
   i32.gt_s
   i32.and
   if (result i32)
    local.get $0
    local.get $3
    i32.const 1
    i32.shl
    i32.add
    local.tee $0
    i32.const 2
    i32.add
    local.get $0
    i32.const 0
    local.get $2
    i32.sub
    i32.const 1
    i32.shl
    memory.copy
    local.get $0
    i32.const 46
    i32.store16
    local.get $1
    i32.const 1
    i32.add
   else
    local.get $3
    i32.const 0
    i32.le_s
    local.get $3
    i32.const -6
    i32.gt_s
    i32.and
    if (result i32)
     local.get $0
     i32.const 2
     local.get $3
     i32.sub
     local.tee $3
     i32.const 1
     i32.shl
     i32.add
     local.get $0
     local.get $1
     i32.const 1
     i32.shl
     memory.copy
     local.get $0
     i32.const 3014704
     i32.store
     i32.const 2
     local.set $2
     loop $for-loop|1
      local.get $2
      local.get $3
      i32.lt_s
      if
       local.get $0
       local.get $2
       i32.const 1
       i32.shl
       i32.add
       i32.const 48
       i32.store16
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|1
      end
     end
     local.get $1
     local.get $3
     i32.add
    else
     local.get $1
     i32.const 1
     i32.eq
     if
      local.get $0
      i32.const 101
      i32.store16 offset=2
      local.get $0
      i32.const 4
      i32.add
      local.tee $2
      local.get $3
      i32.const 1
      i32.sub
      local.tee $0
      i32.const 0
      i32.lt_s
      local.tee $3
      if
       i32.const 0
       local.get $0
       i32.sub
       local.set $0
      end
      local.get $0
      local.get $0
      i32.const 100000
      i32.lt_u
      if (result i32)
       local.get $0
       i32.const 100
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 10
        i32.ge_u
        i32.const 1
        i32.add
       else
        local.get $0
        i32.const 10000
        i32.ge_u
        i32.const 3
        i32.add
        local.get $0
        i32.const 1000
        i32.ge_u
        i32.add
       end
      else
       local.get $0
       i32.const 10000000
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 1000000
        i32.ge_u
        i32.const 6
        i32.add
       else
        local.get $0
        i32.const 1000000000
        i32.ge_u
        i32.const 8
        i32.add
        local.get $0
        i32.const 100000000
        i32.ge_u
        i32.add
       end
      end
      i32.const 1
      i32.add
      local.tee $1
      call $~lib/util/number/utoa32_dec_lut
      local.get $2
      i32.const 45
      i32.const 43
      local.get $3
      select
      i32.store16
     else
      local.get $0
      i32.const 4
      i32.add
      local.get $0
      i32.const 2
      i32.add
      local.get $1
      i32.const 1
      i32.shl
      local.tee $2
      i32.const 2
      i32.sub
      memory.copy
      local.get $0
      i32.const 46
      i32.store16 offset=2
      local.get $0
      local.get $2
      i32.add
      local.tee $0
      i32.const 101
      i32.store16 offset=2
      local.get $0
      i32.const 4
      i32.add
      local.tee $4
      local.get $3
      i32.const 1
      i32.sub
      local.tee $0
      i32.const 0
      i32.lt_s
      local.tee $2
      if
       i32.const 0
       local.get $0
       i32.sub
       local.set $0
      end
      local.get $0
      local.get $0
      i32.const 100000
      i32.lt_u
      if (result i32)
       local.get $0
       i32.const 100
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 10
        i32.ge_u
        i32.const 1
        i32.add
       else
        local.get $0
        i32.const 10000
        i32.ge_u
        i32.const 3
        i32.add
        local.get $0
        i32.const 1000
        i32.ge_u
        i32.add
       end
      else
       local.get $0
       i32.const 10000000
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 1000000
        i32.ge_u
        i32.const 6
        i32.add
       else
        local.get $0
        i32.const 1000000000
        i32.ge_u
        i32.const 8
        i32.add
        local.get $0
        i32.const 100000000
        i32.ge_u
        i32.add
       end
      end
      i32.const 1
      i32.add
      local.tee $0
      call $~lib/util/number/utoa32_dec_lut
      local.get $4
      i32.const 45
      i32.const 43
      local.get $2
      select
      i32.store16
      local.get $0
      local.get $1
      i32.add
      local.set $1
     end
     local.get $1
     i32.const 2
     i32.add
    end
   end
  end
 )
 (func $~lib/util/number/dtoa_core (param $0 f64) (result i32)
  (local $1 i64)
  (local $2 i32)
  (local $3 i64)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i32)
  (local $9 i32)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  (local $13 i64)
  (local $14 i64)
  local.get $0
  f64.const 0
  f64.lt
  local.tee $2
  if (result f64)
   i32.const 10368
   i32.const 45
   i32.store16
   local.get $0
   f64.neg
  else
   local.get $0
  end
  i64.reinterpret_f64
  local.tee $1
  i64.const 9218868437227405312
  i64.and
  i64.const 52
  i64.shr_u
  i32.wrap_i64
  local.tee $4
  i32.const 1
  local.get $4
  select
  i32.const 1075
  i32.sub
  local.tee $8
  i32.const 1
  i32.sub
  local.get $1
  i64.const 4503599627370495
  i64.and
  local.get $4
  i32.const 0
  i32.ne
  i64.extend_i32_u
  i64.const 52
  i64.shl
  i64.add
  local.tee $1
  i64.const 1
  i64.shl
  i64.const 1
  i64.add
  local.tee $3
  i64.clz
  i32.wrap_i64
  local.tee $9
  i32.sub
  local.set $4
  local.get $3
  local.get $9
  i64.extend_i32_s
  i64.shl
  global.set $~lib/util/number/_frc_plus
  local.get $1
  local.get $1
  i64.const 4503599627370496
  i64.eq
  i32.const 1
  i32.add
  local.tee $9
  i64.extend_i32_s
  i64.shl
  i64.const 1
  i64.sub
  local.get $8
  local.get $9
  i32.sub
  local.get $4
  i32.sub
  i64.extend_i32_s
  i64.shl
  global.set $~lib/util/number/_frc_minus
  local.get $4
  global.set $~lib/util/number/_exp
  i32.const 348
  i32.const -61
  global.get $~lib/util/number/_exp
  i32.sub
  f64.convert_i32_s
  f64.const 0.30102999566398114
  f64.mul
  f64.const 347
  f64.add
  local.tee $0
  i32.trunc_sat_f64_s
  local.tee $4
  local.get $4
  f64.convert_i32_s
  local.get $0
  f64.ne
  i32.add
  i32.const 3
  i32.shr_s
  i32.const 1
  i32.add
  local.tee $4
  i32.const 3
  i32.shl
  local.tee $8
  i32.sub
  global.set $~lib/util/number/_K
  local.get $8
  i32.const 10424
  i32.add
  i64.load
  global.set $~lib/util/number/_frc_pow
  local.get $4
  i32.const 1
  i32.shl
  i32.const 11120
  i32.add
  i32.load16_s
  global.set $~lib/util/number/_exp_pow
  local.get $1
  local.get $1
  i64.clz
  i64.shl
  local.tee $1
  i64.const 4294967295
  i64.and
  local.set $5
  global.get $~lib/util/number/_frc_pow
  local.tee $10
  i64.const 4294967295
  i64.and
  local.tee $11
  local.get $1
  i64.const 32
  i64.shr_u
  local.tee $1
  i64.mul
  local.get $5
  local.get $11
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $6
  global.get $~lib/util/number/_frc_plus
  local.tee $3
  i64.const 4294967295
  i64.and
  local.set $12
  local.get $3
  i64.const 32
  i64.shr_u
  local.tee $3
  local.get $11
  i64.mul
  local.get $11
  local.get $12
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $7
  global.get $~lib/util/number/_frc_minus
  local.tee $13
  i64.const 4294967295
  i64.and
  local.set $14
  local.get $13
  i64.const 32
  i64.shr_u
  local.tee $13
  local.get $11
  i64.mul
  local.get $11
  local.get $14
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $11
  local.get $2
  i32.const 1
  i32.shl
  i32.const 10368
  i32.add
  local.get $1
  local.get $10
  i64.const 32
  i64.shr_u
  local.tee $1
  i64.mul
  local.get $6
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $5
  i64.mul
  local.get $6
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $3
  i64.mul
  local.get $7
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $12
  i64.mul
  local.get $7
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  i64.const 1
  i64.sub
  local.tee $3
  global.get $~lib/util/number/_exp_pow
  global.get $~lib/util/number/_exp
  i32.add
  i32.const -64
  i32.sub
  local.get $3
  local.get $1
  local.get $13
  i64.mul
  local.get $11
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $14
  i64.mul
  local.get $11
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  i64.const 1
  i64.add
  i64.sub
  local.get $2
  call $~lib/util/number/genDigits
  local.get $2
  i32.sub
  global.get $~lib/util/number/_K
  call $~lib/util/number/prettify
  local.get $2
  i32.add
 )
 (func $~lib/number/F64#toString (param $0 f64) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 10224
  local.set $1
  block $~lib/util/number/dtoa_impl|inlined.0
   local.get $0
   f64.const 0
   f64.eq
   br_if $~lib/util/number/dtoa_impl|inlined.0
   local.get $0
   local.get $0
   f64.sub
   f64.const 0
   f64.ne
   if
    i32.const 10256
    local.set $1
    local.get $0
    local.get $0
    f64.ne
    br_if $~lib/util/number/dtoa_impl|inlined.0
    i32.const 10288
    i32.const 10336
    local.get $0
    f64.const 0
    f64.lt
    select
    local.set $1
    br $~lib/util/number/dtoa_impl|inlined.0
   end
   local.get $0
   call $~lib/util/number/dtoa_core
   i32.const 1
   i32.shl
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.const 2
   call $~lib/rt/itcms/__new
   local.tee $1
   i32.store
   local.get $1
   i32.const 10368
   local.get $2
   memory.copy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $~lib/rt/__visit_members (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $folding-inner1
   block $folding-inner0
    block $invalid
     block $~lib/array/Array<i32>
      block $~lib/staticarray/StaticArray<f64>
       block $assembly/evalKnox/KnoxBossStats
        block $assembly/evalKnox/Knox
         block $assembly/evalKnox/KnoxEnemy
          block $~lib/staticarray/StaticArray<i32>
           block $assembly/evalOzzy/OzzyBossStats
            block $assembly/evalOzzy/Ozzy
             block $assembly/evalOzzy/OzzyEnemy
              block $"~lib/map/Map<i32,i32>"
               block $assembly/evalBorge/BossStats
                block $assembly/evalBorge/Borge
                 block $assembly/evalBorge/Enemy
                  block $~lib/arraybuffer/ArrayBufferView
                   block $~lib/string/String
                    block $~lib/arraybuffer/ArrayBuffer
                     block $~lib/object/Object
                      local.get $0
                      i32.const 8
                      i32.sub
                      i32.load
                      br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $~lib/arraybuffer/ArrayBufferView $assembly/evalBorge/Enemy $folding-inner1 $assembly/evalBorge/Borge $assembly/evalBorge/BossStats $folding-inner1 $"~lib/map/Map<i32,i32>" $assembly/evalOzzy/OzzyEnemy $folding-inner1 $assembly/evalOzzy/Ozzy $assembly/evalOzzy/OzzyBossStats $folding-inner1 $~lib/staticarray/StaticArray<i32> $assembly/evalKnox/KnoxEnemy $folding-inner1 $assembly/evalKnox/Knox $assembly/evalKnox/KnoxBossStats $folding-inner1 $~lib/staticarray/StaticArray<f64> $~lib/array/Array<i32> $folding-inner1 $invalid
                     end
                     return
                    end
                    return
                   end
                   return
                  end
                  local.get $0
                  i32.load
                  local.tee $0
                  if
                   local.get $0
                   call $~lib/rt/itcms/__visit
                  end
                  return
                 end
                 return
                end
                local.get $0
                i32.load offset=392
                local.tee $1
                if
                 local.get $1
                 call $~lib/rt/itcms/__visit
                end
                local.get $0
                i32.load offset=396
                local.tee $1
                if
                 local.get $1
                 call $~lib/rt/itcms/__visit
                end
                local.get $0
                i32.load offset=400
                local.tee $0
                if
                 local.get $0
                 call $~lib/rt/itcms/__visit
                end
                return
               end
               return
              end
              global.get $~lib/memory/__stack_pointer
              i32.const 4
              i32.sub
              global.set $~lib/memory/__stack_pointer
              global.get $~lib/memory/__stack_pointer
              i32.const 11620
              i32.lt_s
              br_if $folding-inner0
              global.get $~lib/memory/__stack_pointer
              i32.const 0
              i32.store
              global.get $~lib/memory/__stack_pointer
              local.get $0
              i32.store
              local.get $0
              i32.load
              call $~lib/rt/itcms/__visit
              global.get $~lib/memory/__stack_pointer
              local.get $0
              i32.store
              local.get $0
              i32.load offset=8
              call $~lib/rt/itcms/__visit
              global.get $~lib/memory/__stack_pointer
              i32.const 4
              i32.add
              global.set $~lib/memory/__stack_pointer
              return
             end
             return
            end
            local.get $0
            i32.load offset=448
            local.tee $1
            if
             local.get $1
             call $~lib/rt/itcms/__visit
            end
            local.get $0
            i32.load offset=452
            local.tee $1
            if
             local.get $1
             call $~lib/rt/itcms/__visit
            end
            local.get $0
            i32.load offset=456
            local.tee $0
            if
             local.get $0
             call $~lib/rt/itcms/__visit
            end
            return
           end
           return
          end
          return
         end
         return
        end
        local.get $0
        i32.load offset=484
        local.tee $1
        if
         local.get $1
         call $~lib/rt/itcms/__visit
        end
        local.get $0
        i32.load offset=488
        local.tee $1
        if
         local.get $1
         call $~lib/rt/itcms/__visit
        end
        local.get $0
        i32.load offset=492
        local.tee $0
        if
         local.get $0
         call $~lib/rt/itcms/__visit
        end
        return
       end
       return
      end
      return
     end
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 11620
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i32.const 0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     i32.load
     call $~lib/rt/itcms/__visit
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     return
    end
    unreachable
   end
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.add
  local.set $2
  loop $while-continue|0
   local.get $0
   local.get $2
   i32.lt_u
   if
    local.get $0
    i32.load
    local.tee $1
    if
     local.get $1
     call $~lib/rt/itcms/__visit
    end
    local.get $0
    i32.const 4
    i32.add
    local.set $0
    br $while-continue|0
   end
  end
 )
 (func $~start
  (local $0 i32)
  memory.size
  i32.const 16
  i32.shl
  i32.const 44388
  i32.sub
  i32.const 1
  i32.shr_u
  global.set $~lib/rt/itcms/threshold
  i32.const 1284
  i32.const 1280
  i32.store
  i32.const 1288
  i32.const 1280
  i32.store
  i32.const 1280
  global.set $~lib/rt/itcms/pinSpace
  i32.const 1316
  i32.const 1312
  i32.store
  i32.const 1320
  i32.const 1312
  i32.store
  i32.const 1312
  global.set $~lib/rt/itcms/toSpace
  i32.const 1460
  i32.const 1456
  i32.store
  i32.const 1464
  i32.const 1456
  i32.store
  i32.const 1456
  global.set $~lib/rt/itcms/fromSpace
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4004
   i32.const 5
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   global.set $assembly/evalBorge/ENEMIES
   call $assembly/evalBorge/Borge#constructor
   global.set $assembly/evalBorge/currentBorge
   i32.const 0
   call $assembly/evalBorge/Enemy#constructor
   global.set $assembly/evalBorge/currentEnemy
   call $assembly/evalBorge/Borge#constructor
   global.set $assembly/evalBorge/lastBorge
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4004
   i32.const 11
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   global.set $assembly/evalOzzy/OZZY_ENEMIES
   call $assembly/evalOzzy/Ozzy#constructor
   global.set $assembly/evalOzzy/currentOzzy
   i32.const 0
   call $assembly/evalOzzy/OzzyEnemy#constructor
   global.set $assembly/evalOzzy/currentOzzyEnemy
   call $~lib/staticarray/StaticArray<i32>#constructor
   global.set $assembly/evalOzzy/bossKillsByRevive
   call $~lib/staticarray/StaticArray<i32>#constructor
   global.set $assembly/evalOzzy/bossAttemptsByRevive
   call $assembly/evalOzzy/Ozzy#constructor
   global.set $assembly/evalOzzy/lastOzzy
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4004
   i32.const 17
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   global.set $assembly/evalKnox/KNOX_ENEMIES
   call $assembly/evalKnox/Knox#constructor
   global.set $assembly/evalKnox/currentKnox
   i32.const 0
   call $assembly/evalKnox/KnoxEnemy#constructor
   global.set $assembly/evalKnox/currentKnoxEnemy
   call $assembly/evalKnox/Knox#constructor
   global.set $assembly/evalKnox/lastKnox
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 93
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#constructor" (result i32)
  (local $0 i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 24
  i32.const 9
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 3
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  i32.const 48
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 4
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/evalBorge/Borge#constructor (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 408
   i32.const 6
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=172
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=180
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=188
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=196
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=392
   local.get $0
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=396
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=400
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=404
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=172
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=180
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=188
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=196
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 50000
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 40
   i32.const 8
   call $~lib/rt/itcms/__new
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=392
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   loop $for-loop|0
    local.get $1
    i32.const 10
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=392
     local.tee $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 11620
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     i32.const 12
     i32.const 7
     call $~lib/rt/itcms/__new
     local.tee $3
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=8
     local.get $2
     local.get $1
     local.get $3
     call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=396
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=400
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=404
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalBorge/Enemy#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  (local $5 i32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 112
  i32.const 4
  call $~lib/rt/itcms/__new
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=32
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=40
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=80
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=88
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=96
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=104
  local.get $0
  call $assembly/evalBorge/multi
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.gt_s
  local.tee $1
  if
   local.get $0
   i32.const 100
   i32.rem_s
   i32.eqz
   local.set $1
  end
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $7
  f64.const 4
  f64.mul
  f64.const 9
  f64.add
  local.get $4
  f64.mul
  f64.const 2.85
  local.get $0
  i32.const 1
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  f64.const 100
  f64.div
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $3
  f64.convert_i32_s
  local.tee $8
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 90
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.const 0.9
  f64.const 1
  local.get $0
  i32.const 300
  i32.eq
  local.tee $5
  select
  local.tee $6
  f64.mul
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 1
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $7
  f64.const 0.7
  f64.mul
  f64.const 2.5
  f64.add
  local.get $4
  f64.mul
  f64.const 2.85
  local.get $8
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 3.63
  f64.const 1
  local.get $1
  select
  f64.mul
  local.get $6
  f64.mul
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=8
  local.get $2
  local.get $2
  f64.load offset=16
  f64.store offset=104
  local.get $0
  i32.const 400
  i32.eq
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 10
   f64.store offset=96
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=96
  end
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $6
  f64.const 0.0004
  f64.mul
  f64.const 0.0322
  f64.add
  f64.const 0.04
  f64.const 0
  local.get $1
  select
  f64.add
  f64.const 0.25
  f64.min
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 0.008
  f64.mul
  f64.const 1.212
  f64.add
  f64.const 0.25
  f64.const 0
  local.get $1
  select
  f64.add
  f64.const 2.5
  f64.min
  f64.store offset=32
  local.get $0
  i32.const 200
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 1
   local.get $3
   i32.const 2
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.02
   f64.mul
   f64.const 0.04
   f64.add
   f64.sub
   f64.const 0.05
   f64.const 0
   local.get $1
   select
   f64.sub
   f64.store offset=40
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0.95
   f64.const 1
   local.get $1
   select
   f64.store offset=40
  end
  local.get $0
  i32.const 100
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $3
   i32.const 1
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.004
   f64.mul
   f64.const 0.004
   f64.add
   f64.store offset=48
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=48
  end
  local.get $0
  i32.const 300
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $3
   i32.const 3
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.01
   f64.mul
   f64.const 0.04
   f64.add
   f64.const 0.04
   f64.const 0
   local.get $1
   select
   f64.add
   f64.store offset=56
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=56
  end
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $0
  i32.const 1
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  f64.const 0.08
  f64.mul
  local.get $4
  f64.mul
  f64.const 1.052
  local.get $3
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 0
  f64.max
  f64.const 1.92
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.const 0.9
  f64.const 1
  local.get $5
  select
  f64.mul
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 4.526
  local.get $0
  f64.convert_i32_s
  f64.const 0.006
  f64.mul
  f64.sub
  f64.const 2.42
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=80
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=88
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/evalOzzy/Ozzy#constructor (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 464
   i32.const 12
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=172
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=180
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=188
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=196
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=316
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=324
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=392
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=400
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=408
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=416
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=424
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=432
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=440
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=448
   local.get $0
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=452
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=456
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=460
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=172
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=180
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=188
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=196
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=316
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 5000
   i32.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=324
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=392
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=400
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=408
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=416
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=424
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=432
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=440
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 40
   i32.const 14
   call $~lib/rt/itcms/__new
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=448
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   loop $for-loop|0
    local.get $1
    i32.const 10
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=448
     local.tee $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 11620
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     i32.const 12
     i32.const 13
     call $~lib/rt/itcms/__new
     local.tee $3
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=8
     local.get $2
     local.get $1
     local.get $3
     call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=452
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=456
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=460
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalOzzy/OzzyEnemy#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 i32)
  (local $5 i32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 104
  i32.const 10
  call $~lib/rt/itcms/__new
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=32
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=40
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=80
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=88
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=96
  local.get $0
  call $assembly/evalBorge/multi
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.gt_s
  local.tee $1
  if
   local.get $0
   i32.const 100
   i32.rem_s
   i32.eqz
   local.set $1
  end
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $6
  f64.const 6
  f64.mul
  f64.const 11
  f64.add
  local.get $3
  f64.mul
  f64.const 2.9
  local.get $0
  i32.const 1
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  f64.const 100
  f64.div
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $4
  f64.convert_i32_s
  local.tee $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 48
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.const 0.94
  f64.const 1
  local.get $0
  i32.const 300
  i32.eq
  local.tee $5
  select
  local.tee $8
  f64.mul
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 1
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 0.75
  f64.mul
  f64.const 1.35
  f64.add
  local.get $3
  f64.mul
  f64.const 2.7
  local.get $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 3
  f64.const 1
  local.get $1
  select
  f64.mul
  local.get $8
  f64.mul
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 0.0006
  f64.mul
  f64.const 0.0994
  f64.add
  f64.const 0.1
  f64.const 0
  local.get $1
  select
  f64.add
  f64.const 0.25
  f64.min
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 0.008
  f64.mul
  f64.const 1.03
  f64.add
  f64.const 2.5
  f64.min
  f64.store offset=32
  local.get $0
  i32.const 200
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 1
   local.get $4
   i32.const 2
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.02
   f64.mul
   f64.const 0.04
   f64.add
   f64.sub
   f64.const 0.05
   f64.const 0
   local.get $1
   select
   f64.sub
   f64.store offset=40
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0.95
   f64.const 1
   local.get $1
   select
   f64.store offset=40
  end
  local.get $0
  i32.const 100
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $4
   i32.const 1
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.01
   f64.mul
   f64.const 0.01
   f64.add
   f64.store offset=48
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=48
  end
  local.get $0
  i32.const 300
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $4
   i32.const 3
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.01
   f64.mul
   f64.const 0.04
   f64.add
   f64.const 0.04
   f64.const 0
   local.get $1
   select
   f64.add
   f64.store offset=56
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=56
  end
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $6
  f64.const 0.1
  f64.mul
  local.get $3
  f64.mul
  f64.const 1.25
  local.get $4
  f64.convert_i32_s
  local.tee $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const -0.08
  f64.add
  f64.const 0
  f64.max
  f64.const 6
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.const 0.97
  f64.const 1
  local.get $5
  select
  f64.mul
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 3.2
  local.get $6
  f64.const 0.004
  f64.mul
  f64.sub
  local.tee $8
  f64.const 2.45
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 0.75
  f64.mul
  f64.const 1.35
  f64.add
  f64.const 999
  f64.mul
  local.get $3
  f64.mul
  f64.const 2.7
  local.get $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 3
  f64.const 1
  local.get $1
  select
  f64.mul
  local.get $6
  f64.const 0.008
  f64.mul
  f64.const 1.03
  f64.add
  f64.const 2.5
  f64.min
  f64.mul
  local.get $8
  f64.div
  f64.store offset=80
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=88
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=96
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/evalKnox/Knox#constructor (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 500
   i32.const 18
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=124
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store8 offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store8 offset=205
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=300
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=308
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=316
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=340
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=348
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=392
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=400
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=408
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=416
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=424
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=432
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=440
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=448
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=456
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=464
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=472
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=480
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=484
   local.get $0
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=488
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=492
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=496
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=124
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store8 offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store8 offset=205
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=300
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=308
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=316
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=340
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 5000
   i32.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=348
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=392
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=400
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=408
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=416
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=424
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 1.e+308
   f64.store offset=432
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=440
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=448
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=456
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=464
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 0
   f64.store offset=472
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=480
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 40
   i32.const 20
   call $~lib/rt/itcms/__new
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   local.get $0
   local.get $2
   i32.store offset=484
   local.get $0
   local.get $2
   i32.const 0
   call $~lib/rt/itcms/__link
   loop $for-loop|0
    local.get $1
    i32.const 10
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=484
     local.tee $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 11620
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     i32.const 12
     i32.const 19
     call $~lib/rt/itcms/__new
     local.tee $3
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     f64.const 0
     f64.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     i32.const 0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=8
     local.get $2
     local.get $1
     local.get $3
     call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=488
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   call $"~lib/map/Map<i32,i32>#constructor"
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   local.get $0
   local.get $1
   i32.store offset=492
   local.get $0
   local.get $1
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=496
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalKnox/KnoxEnemy#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 i32)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 84
  i32.const 16
  call $~lib/rt/itcms/__new
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=32
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=40
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 0
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=80
  local.get $0
  call $assembly/evalKnox/knoxMulti
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.gt_s
  local.tee $1
  if
   local.get $0
   i32.const 100
   i32.rem_s
   i32.eqz
   local.set $1
  end
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $5
  f64.const 9
  f64.mul
  f64.const 7
  f64.add
  local.get $3
  f64.mul
  local.tee $6
  f64.const 3.2
  local.get $0
  i32.const 1
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  f64.const 100
  f64.div
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $4
  f64.convert_i32_s
  local.tee $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 120
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $6
  f64.const 3.2
  local.get $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $5
  f64.const 1.4
  f64.mul
  f64.const 2.4
  f64.add
  local.get $3
  f64.mul
  f64.const 2.7
  local.get $7
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 4
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $5
  f64.const 0.0006
  f64.mul
  f64.const 0.0994
  f64.add
  f64.const 0.1
  f64.const 0
  local.get $1
  select
  f64.add
  f64.const 0.25
  f64.min
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $5
  f64.const 0.008
  f64.mul
  f64.const 1.032
  f64.add
  f64.const 2.5
  f64.min
  f64.store offset=32
  local.get $0
  i32.const 200
  i32.ge_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 1
   local.get $4
   i32.const 2
   i32.sub
   f64.convert_i32_s
   f64.const 0
   f64.max
   f64.const 0.02
   f64.mul
   f64.const 0.04
   f64.add
   f64.sub
   f64.const 0.05
   f64.const 0
   local.get $1
   select
   f64.sub
   f64.store offset=40
  else
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0.95
   f64.const 1
   local.get $1
   select
   f64.store offset=40
  end
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $0
  i32.const 100
  i32.div_s
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $0
  f64.convert_i32_s
  local.tee $5
  f64.const 0.04
  f64.mul
  local.get $3
  f64.mul
  f64.const 1.4
  local.get $4
  f64.convert_i32_s
  local.tee $6
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 2
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  f64.const 6.005
  local.get $5
  f64.const 0.005
  f64.mul
  local.tee $7
  f64.sub
  f64.const 2.85
  f64.const 1
  local.get $1
  select
  f64.mul
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $5
  f64.const 1.4
  f64.mul
  f64.const 2.4
  f64.add
  local.get $3
  f64.mul
  local.get $5
  f64.const 0.008
  f64.mul
  f64.const 1.03
  f64.add
  f64.mul
  f64.const 6
  local.get $7
  f64.sub
  f64.div
  f64.const 2.7
  local.get $6
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=80
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/evalBorge/initEnemies
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  loop $for-loop|0
   local.get $0
   i32.const 1000
   i32.le_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/ENEMIES
    local.tee $2
    i32.store
    local.get $0
    call $assembly/evalBorge/Enemy#constructor
    local.set $1
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store offset=4
    local.get $2
    local.get $0
    local.get $1
    call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.tee $0
  i32.store offset=4
  local.get $0
  i32.eqz
  if
   i32.const 7792
   i32.const 1104
   i32.const 82
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/evalBorge/killEnemy
  (local $0 i32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $assembly/evalBorge/currentEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if
   global.get $assembly/evalBorge/currentEnem
   i32.const 1
   i32.add
   global.set $assembly/evalBorge/currentEnem
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=120
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.007
   f64.mul
   f64.sub
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=128
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.014
   f64.mul
   f64.sub
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=136
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.025
   f64.mul
   f64.sub
   f64.store offset=136
   i32.const 0
   global.set $assembly/evalBorge/furyEnabled
   f64.const 99999999
   global.set $assembly/evalBorge/nextFury
   global.get $assembly/evalBorge/currentEnem
   i32.const 10
   i32.add
   global.set $assembly/evalBorge/currentEnem
  end
  global.get $assembly/evalBorge/currentEnem
  i32.const 10
  i32.rem_s
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/ENEMIES
   local.tee $0
   i32.store
   local.get $0
   global.get $assembly/evalBorge/currentEnem
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   i32.trunc_sat_f64_s
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   global.set $assembly/evalBorge/currentEnemy
   global.get $assembly/evalBorge/currentEnem
   i32.const 4000
   i32.eq
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $3
    i32.store offset=4
    local.get $0
    local.get $3
    f64.load offset=104
    f64.const 2780
    f64.add
    f64.store offset=16
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $3
    i32.store offset=4
    local.get $0
    local.get $3
    f64.load offset=104
    f64.store offset=16
   end
  end
  loop $while-continue|0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalBorge/trampleDamage
   local.get $0
   f64.load
   f64.ge
   if (result i32)
    global.get $assembly/evalBorge/currentEnem
    i32.const 10
    i32.rem_s
   else
    i32.const 0
   end
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.const 0
    f64.store offset=8
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/trampleDamage
    local.get $0
    f64.load
    f64.sub
    global.set $assembly/evalBorge/trampleDamage
    global.get $assembly/evalBorge/currentEnem
    i32.const 1
    i32.add
    global.set $assembly/evalBorge/currentEnem
    global.get $assembly/evalBorge/currentEnem
    i32.const 10
    i32.rem_s
    i32.eqz
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalBorge/ENEMIES
     local.tee $0
     i32.store
     local.get $0
     global.get $assembly/evalBorge/currentEnem
     i32.const 10
     i32.div_s
     f64.convert_i32_s
     f64.const 1e3
     f64.min
     i32.trunc_sat_f64_s
     call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
     global.set $assembly/evalBorge/currentEnemy
     global.get $assembly/evalBorge/currentEnem
     i32.const 4000
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $0
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $3
      i32.store offset=4
      local.get $0
      local.get $3
      f64.load offset=104
      f64.const 2780
      f64.add
      f64.store offset=16
     else
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $0
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $3
      i32.store offset=4
      local.get $0
      local.get $3
      f64.load offset=104
      f64.store offset=16
     end
    end
    br $while-continue|0
   end
  end
  global.get $assembly/evalBorge/currentEnem
  i32.const 1000
  i32.eq
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $3
   f64.load offset=24
   f64.store offset=104
  end
  f64.const 0
  global.set $assembly/evalBorge/trampleDamage
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $3
  i32.store offset=4
  local.get $3
  f64.load
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $3
  i32.store offset=4
  local.get $0
  local.get $1
  f64.const 1
  local.get $3
  i32.load offset=192
  f64.convert_i32_s
  f64.const 0.04
  f64.mul
  f64.const 1
  f64.const 0.5
  global.get $assembly/evalBorge/currentEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  select
  f64.mul
  f64.sub
  f64.mul
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=80
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.const 0
  f64.store offset=88
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=96
  f64.lt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=176
  else
   i32.const 0
  end
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=128
   local.tee $1
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalBorge/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalBorge/seed
    local.get $1
    global.get $assembly/evalBorge/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=96
   local.set $2
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=16
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=96
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $2
   local.get $4
   local.get $1
   local.get $3
   i32.load offset=176
   f64.convert_i32_s
   f64.mul
   f64.const 0.02
   f64.mul
   f64.add
   f64.min
   f64.store offset=16
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $0
  i32.store
  global.get $assembly/evalBorge/currentTime
  local.get $0
  f64.load offset=72
  f64.add
  global.set $assembly/evalBorge/nextEnemAtk
  global.get $assembly/evalBorge/currentEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if
   f64.const 99999999
   global.set $assembly/evalBorge/nextBossBonusAtk
   global.get $assembly/evalBorge/currentEnem
   i32.const 4000
   i32.ne
   if
    f64.const 999999999
    global.set $assembly/evalBorge/nextInfernalBulk
   end
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=120
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.007
   f64.mul
   f64.add
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=128
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.014
   f64.mul
   f64.add
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=136
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.025
   f64.mul
   f64.add
   f64.store offset=136
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.eq
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $3
    i32.store offset=4
    local.get $0
    local.get $3
    f64.load offset=24
    f64.store offset=104
   end
   global.get $assembly/evalBorge/currentEnem
   i32.const 2000
   i32.ge_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/currentTime
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    f64.add
    global.set $assembly/evalBorge/nextBossBonusAtk
   end
   global.get $assembly/evalBorge/currentEnem
   i32.const 3000
   i32.ge_s
   if
    global.get $assembly/evalBorge/currentTime
    f64.const 60
    f64.add
    global.set $assembly/evalBorge/nextFury
   end
   global.get $assembly/evalBorge/currentEnem
   i32.const 4000
   i32.eq
   if
    global.get $assembly/evalBorge/currentTime
    f64.const 10
    f64.add
    global.set $assembly/evalBorge/nextInfernalBulk
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#find" (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $2
  local.get $0
  i32.load offset=4
  i32.and
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  loop $while-continue|0
   local.get $0
   if
    local.get $0
    i32.load offset=8
    local.tee $2
    i32.const 1
    i32.and
    if (result i32)
     i32.const 0
    else
     local.get $1
     local.get $0
     i32.load
     i32.eq
    end
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $0
     return
    end
    local.get $2
    i32.const -2
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $"~lib/map/Map<i32,i32>#has" (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $1
  local.get $1
  i32.const -1028477379
  i32.mul
  i32.const 374761397
  i32.add
  i32.const 17
  i32.rotl
  i32.const 668265263
  i32.mul
  local.tee $0
  local.get $0
  i32.const 15
  i32.shr_u
  i32.xor
  i32.const -2048144777
  i32.mul
  local.tee $0
  local.get $0
  i32.const 13
  i32.shr_u
  i32.xor
  i32.const -1028477379
  i32.mul
  local.tee $0
  local.get $0
  i32.const 16
  i32.shr_u
  i32.xor
  call $"~lib/map/Map<i32,i32>#find"
  i32.const 0
  i32.ne
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#get" (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $1
  local.get $1
  i32.const -1028477379
  i32.mul
  i32.const 374761397
  i32.add
  i32.const 17
  i32.rotl
  i32.const 668265263
  i32.mul
  local.tee $0
  local.get $0
  i32.const 15
  i32.shr_u
  i32.xor
  i32.const -2048144777
  i32.mul
  local.tee $0
  local.get $0
  i32.const 13
  i32.shr_u
  i32.xor
  i32.const -1028477379
  i32.mul
  local.tee $0
  local.get $0
  i32.const 16
  i32.shr_u
  i32.xor
  call $"~lib/map/Map<i32,i32>#find"
  local.tee $0
  i32.eqz
  if
   i32.const 7920
   i32.const 7984
   i32.const 105
   i32.const 17
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#set" (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   local.get $1
   local.get $1
   i32.const -1028477379
   i32.mul
   i32.const 374761397
   i32.add
   i32.const 17
   i32.rotl
   i32.const 668265263
   i32.mul
   local.tee $3
   i32.const 15
   i32.shr_u
   local.get $3
   i32.xor
   i32.const -2048144777
   i32.mul
   local.tee $3
   i32.const 13
   i32.shr_u
   local.get $3
   i32.xor
   i32.const -1028477379
   i32.mul
   local.tee $3
   i32.const 16
   i32.shr_u
   local.get $3
   i32.xor
   local.tee $7
   call $"~lib/map/Map<i32,i32>#find"
   local.tee $3
   if
    local.get $3
    local.get $2
    i32.store offset=4
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load offset=16
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load offset=12
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=20
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=12
     i32.const 3
     i32.mul
     i32.const 4
     i32.div_s
     i32.lt_s
     if (result i32)
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      local.get $0
      i32.load offset=4
     else
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      local.get $0
      i32.load offset=4
      i32.const 1
      i32.shl
      i32.const 1
      i32.or
     end
     local.set $8
     global.get $~lib/memory/__stack_pointer
     i32.const 16
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 11620
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $8
     i32.const 1
     i32.add
     local.tee $3
     i32.const 2
     i32.shl
     call $~lib/arraybuffer/ArrayBuffer#constructor
     local.tee $9
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.const 3
     i32.shl
     i32.const 3
     i32.div_s
     local.tee $6
     i32.const 12
     i32.mul
     call $~lib/arraybuffer/ArrayBuffer#constructor
     local.tee $4
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     i32.load offset=8
     local.set $10
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $10
     local.get $0
     i32.load offset=16
     i32.const 12
     i32.mul
     i32.add
     local.set $5
     local.get $4
     local.set $3
     loop $while-continue|0
      local.get $5
      local.get $10
      i32.ne
      if
       local.get $10
       i32.load offset=8
       i32.const 1
       i32.and
       i32.eqz
       if
        local.get $3
        local.get $10
        i32.load
        local.tee $11
        i32.store
        local.get $3
        local.get $10
        i32.load offset=4
        i32.store offset=4
        local.get $3
        local.get $9
        local.get $8
        local.get $11
        i32.const -1028477379
        i32.mul
        i32.const 374761397
        i32.add
        i32.const 17
        i32.rotl
        i32.const 668265263
        i32.mul
        local.tee $11
        i32.const 15
        i32.shr_u
        local.get $11
        i32.xor
        i32.const -2048144777
        i32.mul
        local.tee $11
        i32.const 13
        i32.shr_u
        local.get $11
        i32.xor
        i32.const -1028477379
        i32.mul
        local.tee $11
        i32.const 16
        i32.shr_u
        local.get $11
        i32.xor
        i32.and
        i32.const 2
        i32.shl
        i32.add
        local.tee $11
        i32.load
        i32.store offset=8
        local.get $11
        local.get $3
        i32.store
        local.get $3
        i32.const 12
        i32.add
        local.set $3
       end
       local.get $10
       i32.const 12
       i32.add
       local.set $10
       br $while-continue|0
      end
     end
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $9
     i32.store offset=12
     local.get $0
     local.get $9
     i32.store
     local.get $0
     local.get $9
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     local.get $8
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=12
     local.get $0
     local.get $4
     i32.store offset=8
     local.get $0
     local.get $4
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     local.get $6
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     local.get $0
     local.get $0
     i32.load offset=20
     i32.store offset=16
     global.get $~lib/memory/__stack_pointer
     i32.const 16
     i32.add
     global.set $~lib/memory/__stack_pointer
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=8
    local.tee $3
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=16
    local.tee $4
    i32.const 1
    i32.add
    i32.store offset=16
    local.get $3
    local.get $4
    i32.const 12
    i32.mul
    i32.add
    local.tee $3
    local.get $1
    i32.store
    local.get $3
    local.get $2
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=20
    i32.const 1
    i32.add
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load
    local.set $1
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $3
    local.get $1
    local.get $7
    local.get $0
    i32.load offset=4
    i32.and
    i32.const 2
    i32.shl
    i32.add
    local.tee $0
    i32.load
    i32.store offset=8
    local.get $0
    local.get $3
    i32.store
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalBorge/enemyAttack (param $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $2
  i32.store
  f64.const 1
  local.get $2
  i32.load offset=240
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.sub
  global.get $assembly/evalBorge/currentCreaGem4
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.sub
  f64.mul
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $2
  i32.store
  f64.const 1
  local.get $2
  f64.load offset=120
  f64.sub
  f64.mul
  local.set $1
  global.get $assembly/evalBorge/currentEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalBorge/currentTime
   local.get $0
   f64.load offset=72
   f64.add
   global.set $assembly/evalBorge/nextEnemAtk
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $3
   i32.store offset=4
   local.get $2
   local.get $3
   i32.load offset=80
   i32.const 1
   i32.add
   i32.store offset=80
   i32.const 3
   i32.const 1
   global.get $assembly/evalBorge/furyEnabled
   select
   local.set $2
   local.get $0
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $2
    f64.convert_i32_s
    local.tee $4
    f64.div
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    f64.convert_i32_s
    local.set $6
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/currentTime
    local.get $5
    local.get $6
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    f64.add
    global.set $assembly/evalBorge/nextBossBonusAtk
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    local.get $4
    f64.div
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    i32.const 1
    i32.sub
    f64.convert_i32_s
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    local.get $4
    f64.div
    local.set $6
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    f64.convert_i32_s
    local.set $7
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/nextEnemAtk
    local.get $5
    local.get $6
    local.get $7
    local.get $0
    f64.load offset=72
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    f64.sub
    f64.sub
    global.set $assembly/evalBorge/nextEnemAtk
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    local.get $2
    f64.convert_i32_s
    local.tee $4
    f64.div
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    f64.convert_i32_s
    local.set $6
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/currentTime
    local.get $5
    local.get $6
    local.get $0
    f64.load offset=72
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    f64.add
    global.set $assembly/evalBorge/nextEnemAtk
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $4
    f64.div
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    i32.const 1
    i32.sub
    f64.convert_i32_s
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $4
    f64.div
    local.set $6
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=80
    f64.convert_i32_s
    local.set $7
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalBorge/nextBossBonusAtk
    local.get $5
    local.get $6
    local.get $7
    local.get $0
    f64.load offset=72
    f64.const 1.8
    f64.mul
    local.get $4
    f64.div
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    f64.sub
    f64.sub
    global.set $assembly/evalBorge/nextBossBonusAtk
   end
  end
  i32.const 0
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=48
  local.tee $4
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalBorge/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalBorge/seed
   local.get $4
   global.get $assembly/evalBorge/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  if (result f64)
   i32.const 1
   local.set $0
   f64.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $2
   i32.store
   local.get $2
   f64.load offset=24
   local.tee $4
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalBorge/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalBorge/seed
    local.get $4
    global.get $assembly/evalBorge/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $2
    i32.store
    local.get $2
    f64.load offset=32
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $2
    i32.store
    local.get $1
    local.get $4
    f64.const 1
    local.get $2
    i32.load offset=252
    f64.convert_i32_s
    f64.const 0.11
    f64.mul
    f64.sub
    f64.mul
    f64.mul
   else
    local.get $1
   end
  end
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $3
  i32.store offset=4
  local.get $2
  local.get $3
  f64.load offset=16
  local.get $1
  f64.sub
  f64.store offset=16
  local.get $0
  i32.eqz
  if
   global.get $assembly/evalBorge/currentTempGN4
   i32.const 0
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $2
    i32.store
    local.get $2
    f64.load offset=16
    local.set $1
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $2
    i32.store
    local.get $2
    f64.load offset=24
    local.tee $4
    f64.const 0
    f64.gt
    if (result i32)
     global.get $assembly/evalBorge/seed
     i64.extend_i32_u
     i64.const 1664525
     i64.mul
     i64.const 1013904223
     i64.add
     i64.const 4294967295
     i64.and
     i32.wrap_i64
     global.set $assembly/evalBorge/seed
     local.get $4
     global.get $assembly/evalBorge/seed
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.gt
    else
     i32.const 0
    end
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalBorge/currentEnemy
     local.tee $2
     i32.store
     local.get $1
     local.get $2
     f64.load offset=32
     f64.mul
     local.set $1
    end
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=8
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store offset=4
   local.get $2
   local.get $4
   local.get $3
   i32.load offset=244
   f64.convert_i32_s
   f64.const 0.08
   f64.mul
   local.get $1
   f64.mul
   f64.const 1
   f64.const 0.1
   global.get $assembly/evalBorge/currentEnem
   i32.const 0
   i32.gt_s
   if (result i32)
    global.get $assembly/evalBorge/currentEnem
    i32.const 1000
    i32.rem_s
   else
    i32.const 1
   end
   select
   f64.mul
   f64.sub
   f64.store offset=8
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=8
  f64.const 0
  f64.le
  if
   call $assembly/evalBorge/killEnemy
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $2
  i32.store
  local.get $0
  i32.const 1
  local.get $2
  f64.load offset=56
  local.tee $1
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalBorge/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalBorge/seed
   local.get $1
   global.get $assembly/evalBorge/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  select
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   f64.load offset=120
   f64.const -0.02
   f64.add
   f64.const 0
   f64.max
   f64.store offset=120
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=148
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=16
   f64.const 0
   f64.le
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   f64.load offset=96
   f64.const 0.8
   f64.mul
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=404
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store
   local.get $2
   i32.load offset=148
   i32.sub
   i32.const 1
   i32.add
   global.get $assembly/evalBorge/currentEnem
   i32.const 10
   i32.div_s
   i32.const 1000
   i32.mul
   i32.add
   local.set $0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.load offset=400
   local.tee $2
   i32.store
   local.get $2
   local.get $0
   call $"~lib/map/Map<i32,i32>#has"
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $2
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.load offset=400
    local.tee $2
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $3
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=400
    local.tee $3
    i32.store offset=4
    local.get $2
    local.get $0
    local.get $3
    local.get $0
    call $"~lib/map/Map<i32,i32>#get"
    i32.const 1
    i32.add
    call $"~lib/map/Map<i32,i32>#set"
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $2
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.load offset=400
    local.tee $2
    i32.store
    local.get $2
    local.get $0
    i32.const 1
    call $"~lib/map/Map<i32,i32>#set"
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   i32.load offset=148
   i32.const 1
   i32.sub
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   f64.load offset=160
   f64.const 3
   f64.add
   f64.store offset=160
   global.get $assembly/evalBorge/furyEnabled
   if
    global.get $assembly/evalBorge/nextFury
    f64.const -3
    f64.add
    global.set $assembly/evalBorge/nextFury
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   f64.load offset=40
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
   if (result f64)
    f64.const 0
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $0
    i32.store offset=4
    local.get $0
    i32.load offset=236
    f64.convert_i32_s
    f64.const 0.007
    f64.mul
   end
   f64.add
   f64.store offset=120
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/atk (param $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=48
  f64.const 0
  f64.gt
  local.tee $1
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=48
   local.tee $2
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalBorge/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalBorge/seed
    local.get $2
    global.get $assembly/evalBorge/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
   local.set $1
  end
  local.get $1
  if (result f64)
   f64.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   local.get $3
   f64.load offset=104
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   local.get $3
   i32.load offset=220
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   local.get $3
   f64.load offset=16
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   f64.const 1
   local.get $5
   local.get $3
   f64.load offset=96
   f64.div
   f64.sub
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   local.get $0
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $3
    i32.store
    local.get $3
    f64.load offset=72
    f64.const 1.5
    f64.mul
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $3
    i32.store
    local.get $3
    f64.load offset=136
    local.tee $2
    f64.const 0
    f64.gt
    if (result i32)
     global.get $assembly/evalBorge/seed
     i64.extend_i32_u
     i64.const 1664525
     i64.mul
     i64.const 1013904223
     i64.add
     i64.const 4294967295
     i64.and
     i32.wrap_i64
     global.set $assembly/evalBorge/seed
     local.get $2
     global.get $assembly/evalBorge/seed
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.gt
    else
     i32.const 0
    end
    if (result f64)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalBorge/currentBorge
     local.tee $3
     i32.store
     local.get $3
     f64.load offset=72
    else
     f64.const 1
    end
   end
   f64.mul
  end
  local.set $2
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $3
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $6
  i32.store offset=4
  local.get $6
  f64.load offset=8
  local.set $4
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $6
  i32.store offset=4
  local.get $3
  local.get $4
  local.get $2
  local.get $6
  f64.load offset=40
  f64.mul
  f64.sub
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $3
  i32.store
  global.get $assembly/evalBorge/currentTrample
  i32.const 0
  local.get $2
  local.get $3
  f64.load
  f64.const 2
  f64.mul
  f64.gt
  select
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $3
   i32.store
   local.get $2
   local.get $3
   f64.load
   f64.sub
   global.set $assembly/evalBorge/trampleDamage
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentEnemy
  local.tee $3
  i32.store
  local.get $3
  f64.load offset=8
  f64.const 0
  f64.le
  if
   call $assembly/evalBorge/killEnemy
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $3
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $6
  i32.store offset=4
  local.get $6
  f64.load offset=96
  local.set $4
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $6
  i32.store offset=4
  local.get $6
  f64.load offset=16
  local.set $5
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $6
  i32.store offset=4
  local.get $3
  local.get $4
  local.get $5
  local.get $6
  f64.load offset=88
  local.get $2
  f64.mul
  f64.add
  f64.min
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/currentBorge
  local.tee $3
  i32.store
  local.get $3
  i32.load offset=172
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   local.get $3
   f64.load offset=128
   local.tee $4
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalBorge/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalBorge/seed
    local.get $4
    global.get $assembly/evalBorge/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $3
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $6
   i32.store offset=4
   local.get $6
   f64.load offset=96
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $6
   i32.store offset=4
   local.get $6
   f64.load offset=16
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $6
   i32.store offset=4
   local.get $3
   local.get $4
   local.get $5
   local.get $6
   i32.load offset=172
   f64.convert_i32_s
   f64.const 0.06
   f64.mul
   local.get $2
   f64.mul
   f64.add
   f64.min
   f64.store offset=16
  end
  local.get $1
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=180
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    local.get $1
    f64.load offset=128
    local.tee $2
    f64.const 0
    f64.gt
    if (result i32)
     global.get $assembly/evalBorge/seed
     i64.extend_i32_u
     i64.const 1664525
     i64.mul
     i64.const 1013904223
     i64.add
     i64.const 4294967295
     i64.and
     i32.wrap_i64
     global.set $assembly/evalBorge/seed
     local.get $2
     global.get $assembly/evalBorge/seed
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.gt
    else
     i32.const 0
    end
   else
    i32.const 0
   end
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    local.get $1
    i32.load offset=180
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $1
    i32.store
    global.get $assembly/evalBorge/nextEnemAtk
    local.get $2
    f64.const 1
    f64.const 2
    global.get $assembly/evalBorge/currentEnem
    i32.const 0
    i32.gt_s
    if (result i32)
     global.get $assembly/evalBorge/currentEnem
     i32.const 1000
     i32.rem_s
    else
     i32.const 1
    end
    select
    f64.div
    local.get $1
    f64.load offset=88
    global.get $assembly/evalBorge/currentTime
    f64.sub
    f64.const 0
    f64.max
    f64.sub
    f64.add
    global.set $assembly/evalBorge/nextEnemAtk
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    local.get $1
    i32.load offset=180
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $1
    i32.store
    global.get $assembly/evalBorge/nextBossBonusAtk
    local.get $2
    f64.const 1
    f64.const 2
    global.get $assembly/evalBorge/currentEnem
    i32.const 0
    i32.gt_s
    if (result i32)
     global.get $assembly/evalBorge/currentEnem
     i32.const 1000
     i32.rem_s
    else
     i32.const 1
    end
    select
    f64.div
    local.get $1
    f64.load offset=88
    global.get $assembly/evalBorge/currentTime
    f64.sub
    f64.const 0
    f64.max
    f64.sub
    f64.add
    global.set $assembly/evalBorge/nextBossBonusAtk
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentEnemy
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $3
    i32.store offset=4
    local.get $1
    global.get $assembly/evalBorge/currentTime
    local.get $3
    i32.load offset=180
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.const 1
    f64.const 2
    global.get $assembly/evalBorge/currentEnem
    i32.const 0
    i32.gt_s
    if (result i32)
     global.get $assembly/evalBorge/currentEnem
     i32.const 1000
     i32.rem_s
    else
     i32.const 1
    end
    select
    f64.div
    f64.add
    f64.store offset=88
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=196
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    local.get $1
    f64.load offset=128
    local.tee $2
    f64.const 0
    f64.gt
    if (result i32)
     global.get $assembly/evalBorge/seed
     i64.extend_i32_u
     i64.const 1664525
     i64.mul
     i64.const 1013904223
     i64.add
     i64.const 4294967295
     i64.and
     i32.wrap_i64
     global.set $assembly/evalBorge/seed
     local.get $2
     global.get $assembly/evalBorge/seed
     f64.convert_i32_u
     f64.const 2.3283064365386963e-10
     f64.mul
     f64.gt
    else
     i32.const 0
    end
   else
    i32.const 0
   end
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    local.get $1
    i32.load offset=196
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    global.set $assembly/evalBorge/fowRemaining
   end
  end
  global.get $assembly/evalBorge/currentEnem
  i32.const 1000
  i32.lt_s
  global.get $assembly/evalBorge/currentAttr
  i32.const 0
  i32.gt_s
  i32.and
  if (result f64)
   f64.const 1.08
   global.get $assembly/evalBorge/currentCatchup99gu
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   global.get $assembly/evalBorge/currentAttr
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 1
   f64.add
   f64.const -0.1
   f64.add
   call $~lib/math/NativeMath.pow
  else
   f64.const 1
  end
  local.set $2
  global.get $assembly/evalBorge/currentEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalBorge/currentEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $1
   i32.store
   f64.const 1
   f64.const 1
   local.get $1
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.04
   f64.mul
   f64.sub
   f64.div
   local.set $2
  end
  local.get $0
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $assembly/evalBorge/currentTime
   local.get $0
   f64.load offset=80
   f64.const 6
   f64.mul
   local.get $2
   f64.div
   f64.add
   global.set $assembly/evalBorge/nextAthena
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $0
   i32.store
   global.get $assembly/evalBorge/currentTime
   local.get $0
   f64.load offset=80
   local.get $2
   f64.div
   f64.add
   global.set $assembly/evalBorge/nextAtk
  end
  global.get $assembly/evalBorge/fowRemaining
  i64.reinterpret_f64
  i64.const 1
  i64.shl
  i64.const 2
  i64.sub
  i64.const -9007199254740994
  i64.le_u
  if
   global.get $assembly/evalBorge/fowRemaining
   global.get $assembly/evalBorge/nextAthena
   global.get $assembly/evalBorge/currentTime
   f64.sub
   global.get $assembly/evalBorge/nextAtk
   global.get $assembly/evalBorge/currentTime
   f64.sub
   f64.min
   local.tee $2
   f64.const 0.5
   f64.mul
   f64.le
   if
    global.get $assembly/evalBorge/nextAthena
    global.get $assembly/evalBorge/fowRemaining
    f64.sub
    global.set $assembly/evalBorge/nextAthena
    global.get $assembly/evalBorge/nextAtk
    global.get $assembly/evalBorge/fowRemaining
    f64.sub
    global.set $assembly/evalBorge/nextAtk
    f64.const 0
    global.set $assembly/evalBorge/fowRemaining
   else
    global.get $assembly/evalBorge/nextAthena
    local.get $2
    f64.const 0.5
    f64.mul
    local.tee $2
    f64.sub
    global.set $assembly/evalBorge/nextAthena
    global.get $assembly/evalBorge/nextAtk
    local.get $2
    f64.sub
    global.set $assembly/evalBorge/nextAtk
    global.get $assembly/evalBorge/fowRemaining
    local.get $2
    f64.sub
    global.set $assembly/evalBorge/fowRemaining
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/staticarray/StaticArray<f64>#__set (param $0 i32) (param $1 i32) (param $2 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 3
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 93
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  local.get $2
  f64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/staticarray/StaticArray<f64>#__get (param $0 i32) (param $1 i32) (result f64)
  (local $2 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 3
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  f64.load
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/arrayAverage (param $0 i32) (result f64)
  (local $1 f64)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   loop $for-loop|0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $2
    local.get $0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $1
     local.get $0
     local.get $2
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.add
     local.set $1
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $1
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 3
   i32.shr_u
   f64.convert_i32_s
   f64.div
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalBorge/sim (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 f64) (param $7 i32) (param $8 f64) (param $9 i32) (param $10 i32) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 i32) (param $26 i32) (param $27 i32) (param $28 i32) (param $29 f64) (param $30 i32) (param $31 i32) (param $32 i32) (param $33 i32) (param $34 i32) (param $35 i32) (param $36 i32) (param $37 i32) (param $38 i32) (param $39 i32)
  (local $40 f64)
  (local $41 f64)
  (local $42 f64)
  (local $43 f64)
  (local $44 f64)
  (local $45 f64)
  (local $46 f64)
  (local $47 f64)
  (local $48 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 32
   memory.fill
   local.get $0
   global.set $assembly/evalBorge/currentBorge
   i32.const 0
   global.set $assembly/evalBorge/currentEnem
   f64.const 0
   global.set $assembly/evalBorge/currentTime
   local.get $2
   global.set $assembly/evalBorge/currentAttr
   local.get $3
   global.set $assembly/evalBorge/currentCatchup99gu
   local.get $5
   i32.const 0
   i32.ne
   global.set $assembly/evalBorge/currentTrample
   local.get $1
   global.set $assembly/evalBorge/currentMaxStage
   local.get $33
   global.set $assembly/evalBorge/currentTempGN4
   local.get $39
   global.set $assembly/evalBorge/currentCreaGem4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.const 0
   i32.store offset=144
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=8
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=8
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=24
   local.get $2
   i32.const 0
   i32.gt_s
   if (result f64)
    f64.const 1.08
    local.get $3
    f64.convert_i32_s
    call $~lib/math/NativeMath.pow
    local.get $2
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.const 1
    f64.add
    f64.const -0.1
    f64.add
    call $~lib/math/NativeMath.pow
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=32
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=40
   f64.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=56
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=64
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=168
   i32.store offset=148
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=160
   f64.const 40
   local.get $4
   f64.convert_i32_s
   f64.const 30
   f64.min
   f64.sub
   f64.add
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.load offset=4
   f64.convert_i32_s
   local.set $44
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $44
   local.get $0
   i32.load offset=284
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.max
   i32.trunc_sat_f64_s
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.const 0
   i32.store offset=152
   i32.const 0
   global.set $assembly/evalBorge/furyEnabled
   f64.const 0
   global.set $assembly/evalBorge/trampleDamage
   f64.const 0
   global.set $assembly/evalBorge/fowRemaining
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/ENEMIES
   local.tee $1
   i32.store
   local.get $1
   i32.const 0
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   global.set $assembly/evalBorge/currentEnemy
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $3
   i32.store offset=4
   local.get $1
   local.get $3
   f64.load
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=80
   global.set $assembly/evalBorge/nextAtk
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=224
   i32.const 0
   i32.gt_s
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.load offset=80
    f64.const 6
    f64.mul
   else
    f64.const 999999999
   end
   global.set $assembly/evalBorge/nextAthena
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentEnemy
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=72
   global.set $assembly/evalBorge/nextEnemAtk
   f64.const 1
   global.set $assembly/evalBorge/nextRegen
   f64.const 999999999
   global.set $assembly/evalBorge/nextBossBonusAtk
   f64.const 999999999
   global.set $assembly/evalBorge/nextFury
   f64.const 999999999
   global.set $assembly/evalBorge/nextInfernalBulk
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/currentBorge
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=404
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/currentBorge
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $1
    local.get $0
    i32.load offset=168
    i32.store offset=404
   end
   loop $while-continue|0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.load offset=16
    f64.const 0
    f64.gt
    if
     global.get $assembly/evalBorge/nextInfernalBulk
     global.get $assembly/evalBorge/nextFury
     global.get $assembly/evalBorge/nextBossBonusAtk
     global.get $assembly/evalBorge/nextAthena
     global.get $assembly/evalBorge/nextRegen
     global.get $assembly/evalBorge/nextAtk
     global.get $assembly/evalBorge/nextEnemAtk
     f64.min
     f64.min
     f64.min
     f64.min
     f64.min
     f64.min
     global.set $assembly/evalBorge/currentTime
     global.get $assembly/evalBorge/currentTime
     global.get $assembly/evalBorge/nextRegen
     f64.eq
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 11620
      i32.lt_s
      br_if $folding-inner1
      global.get $~lib/memory/__stack_pointer
      i64.const 0
      i64.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $1
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=96
      local.set $44
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=16
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=112
      f64.add
      local.set $45
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $3
      i32.load offset=260
      f64.convert_i32_s
      f64.const 0.0008
      f64.mul
      local.set $46
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=96
      local.set $47
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $1
      local.get $44
      local.get $45
      local.get $46
      local.get $47
      local.get $3
      f64.load offset=16
      f64.sub
      f64.mul
      f64.add
      f64.min
      f64.store offset=16
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $1
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load
      local.set $44
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=8
      local.set $45
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=64
      local.set $46
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentBorge
      local.tee $3
      i32.store offset=4
      local.get $1
      local.get $44
      local.get $45
      local.get $46
      f64.const 1
      local.get $3
      i32.load offset=184
      f64.convert_i32_s
      f64.const 0.08
      f64.mul
      f64.const 1
      f64.const 2
      global.get $assembly/evalBorge/currentEnem
      i32.const 0
      i32.gt_s
      if (result i32)
       global.get $assembly/evalBorge/currentEnem
       i32.const 1000
       i32.rem_s
      else
       i32.const 1
      end
      select
      f64.div
      f64.sub
      f64.mul
      f64.add
      f64.min
      f64.store offset=8
      global.get $assembly/evalBorge/currentTime
      f64.const 1
      f64.add
      global.set $assembly/evalBorge/nextRegen
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/currentEnemy
      local.tee $1
      i32.store
      local.get $1
      f64.load offset=8
      f64.const 0
      f64.le
      if
       call $assembly/evalBorge/killEnemy
      end
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
     else
      global.get $assembly/evalBorge/currentTime
      global.get $assembly/evalBorge/nextEnemAtk
      f64.eq
      if
       i32.const 0
       call $assembly/evalBorge/enemyAttack
      else
       global.get $assembly/evalBorge/currentTime
       global.get $assembly/evalBorge/nextAtk
       f64.eq
       if
        i32.const 0
        call $assembly/evalBorge/atk
       else
        global.get $assembly/evalBorge/currentTime
        global.get $assembly/evalBorge/nextAthena
        f64.eq
        if
         i32.const 1
         call $assembly/evalBorge/atk
        else
         global.get $assembly/evalBorge/currentTime
         global.get $assembly/evalBorge/nextBossBonusAtk
         f64.eq
         if
          i32.const 1
          call $assembly/evalBorge/enemyAttack
         else
          global.get $assembly/evalBorge/currentTime
          global.get $assembly/evalBorge/nextFury
          f64.eq
          if
           global.get $~lib/memory/__stack_pointer
           i32.const 4
           i32.sub
           global.set $~lib/memory/__stack_pointer
           global.get $~lib/memory/__stack_pointer
           i32.const 11620
           i32.lt_s
           br_if $folding-inner1
           global.get $~lib/memory/__stack_pointer
           i32.const 0
           i32.store
           global.get $assembly/evalBorge/furyEnabled
           i32.eqz
           local.tee $1
           global.set $assembly/evalBorge/furyEnabled
           global.get $~lib/memory/__stack_pointer
           global.get $assembly/evalBorge/currentEnemy
           local.tee $3
           i32.store
           local.get $3
           f64.load offset=88
           global.get $assembly/evalBorge/currentTime
           f64.sub
           f64.const 0
           f64.max
           local.set $44
           local.get $1
           if
            global.get $assembly/evalBorge/currentTime
            f64.const 5
            f64.add
            global.set $assembly/evalBorge/nextFury
            global.get $assembly/evalBorge/currentTime
            global.get $assembly/evalBorge/nextEnemAtk
            local.get $44
            f64.sub
            global.get $assembly/evalBorge/currentTime
            f64.sub
            f64.const 3
            f64.div
            f64.add
            local.get $44
            f64.add
            global.set $assembly/evalBorge/nextEnemAtk
            global.get $assembly/evalBorge/currentTime
            global.get $assembly/evalBorge/nextBossBonusAtk
            local.get $44
            f64.sub
            global.get $assembly/evalBorge/currentTime
            f64.sub
            f64.const 3
            f64.div
            f64.add
            local.get $44
            f64.add
            global.set $assembly/evalBorge/nextBossBonusAtk
           else
            global.get $assembly/evalBorge/currentTime
            f64.const 60
            f64.add
            global.set $assembly/evalBorge/nextFury
            global.get $assembly/evalBorge/currentTime
            global.get $assembly/evalBorge/nextEnemAtk
            local.get $44
            f64.sub
            global.get $assembly/evalBorge/currentTime
            f64.sub
            f64.const 3
            f64.mul
            f64.add
            local.get $44
            f64.add
            global.set $assembly/evalBorge/nextEnemAtk
            global.get $assembly/evalBorge/currentTime
            global.get $assembly/evalBorge/nextBossBonusAtk
            local.get $44
            f64.sub
            global.get $assembly/evalBorge/currentTime
            f64.sub
            f64.const 3
            f64.mul
            f64.add
            local.get $44
            f64.add
            global.set $assembly/evalBorge/nextBossBonusAtk
           end
           global.get $~lib/memory/__stack_pointer
           i32.const 4
           i32.add
           global.set $~lib/memory/__stack_pointer
          else
           global.get $assembly/evalBorge/currentTime
           global.get $assembly/evalBorge/nextInfernalBulk
           f64.eq
           if
            global.get $~lib/memory/__stack_pointer
            i32.const 8
            i32.sub
            global.set $~lib/memory/__stack_pointer
            global.get $~lib/memory/__stack_pointer
            i32.const 11620
            i32.lt_s
            br_if $folding-inner1
            global.get $~lib/memory/__stack_pointer
            i64.const 0
            i64.store
            global.get $assembly/evalBorge/currentEnem
            i32.const 4000
            i32.eq
            if
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalBorge/currentEnemy
             local.tee $1
             i32.store
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalBorge/currentEnemy
             local.tee $3
             i32.store offset=4
             local.get $1
             local.get $3
             f64.load offset=16
             f64.const 2800
             f64.add
             f64.store offset=16
             global.get $assembly/evalBorge/currentTime
             f64.const 10
             f64.add
             global.set $assembly/evalBorge/nextInfernalBulk
            else
             f64.const 999999
             global.set $assembly/evalBorge/nextInfernalBulk
            end
            global.get $~lib/memory/__stack_pointer
            i32.const 8
            i32.add
            global.set $~lib/memory/__stack_pointer
           end
          end
         end
        end
       end
      end
     end
     br $while-continue|0
    end
   end
   i32.const 0
   local.set $3
   loop $for-loop|1
    local.get $3
    i32.const 10
    i32.lt_s
    if
     global.get $assembly/evalBorge/currentEnem
     local.get $3
     i32.const 1
     i32.add
     local.tee $1
     i32.const 1000
     i32.mul
     i32.lt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=392
      local.tee $4
      i32.store offset=4
      local.get $4
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=392
      local.tee $5
      i32.store offset=8
      local.get $5
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $5
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store offset=4
      local.get $5
      f64.load
      local.set $44
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/ENEMIES
      local.tee $5
      i32.store offset=8
      local.get $5
      local.get $1
      i32.const 100
      i32.mul
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $1
      global.get $~lib/memory/__stack_pointer
      local.get $1
      i32.store offset=4
      local.get $4
      local.get $44
      local.get $1
      f64.load
      f64.add
      f64.store
     else
      global.get $assembly/evalBorge/currentEnem
      local.get $3
      i32.const 1
      i32.add
      local.tee $1
      i32.const 1000
      i32.mul
      i32.eq
      if
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=8
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=392
       local.tee $4
       i32.store offset=4
       local.get $4
       local.get $3
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $4
       i32.store
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=12
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=392
       local.tee $5
       i32.store offset=8
       local.get $5
       local.get $3
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $5
       global.get $~lib/memory/__stack_pointer
       local.get $5
       i32.store offset=4
       local.get $5
       f64.load
       local.set $44
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalBorge/ENEMIES
       local.tee $5
       i32.store offset=8
       local.get $5
       local.get $1
       i32.const 100
       i32.mul
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $1
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store offset=4
       local.get $4
       local.get $44
       local.get $1
       f64.load offset=8
       f64.add
       f64.store
      else
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=8
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=392
       local.tee $1
       i32.store offset=4
       local.get $1
       local.get $3
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $1
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=12
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=392
       local.tee $4
       i32.store offset=8
       local.get $4
       local.get $3
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $4
       i32.store offset=4
       local.get $1
       local.get $4
       i32.load offset=8
       i32.const 1
       i32.add
       i32.store offset=8
      end
     end
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     br $for-loop|1
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 7
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $3
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 0
   f64.const 1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 1
   f64.const 1.1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 2
   f64.const 1.3
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 3
   f64.const 1.5
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 4
   f64.const 1.7
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 5
   f64.const 2
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   i32.const 6
   f64.const 3.2
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $4
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 0
   f64.const 1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 1
   f64.const 1.2
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 2
   f64.const 1.4
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 3
   f64.const 2.8
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 3
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $5
   i32.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   i32.const 0
   f64.const 0.8
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   i32.const 1
   f64.const 1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   i32.const 2
   f64.const 1.8
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 2
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $39
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   i32.const 0
   f64.const 1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   i32.const 1
   f64.const 1.2
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   call $assembly/evalBorge/arrayAverage
   f64.add
   f64.const 10
   f64.div
   local.set $44
   i32.const 1010
   local.set $33
   f64.const 1.5
   f64.const 1
   local.get $13
   select
   f64.const 2
   global.get $assembly/evalBorge/currentMaxStage
   i32.const 1
   i32.sub
   i32.const 100
   i32.div_s
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 2
   local.get $12
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   local.set $45
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=216
   f64.convert_i32_s
   f64.const 0.14
   f64.mul
   f64.const 1
   f64.add
   local.get $29
   f64.mul
   f64.const 1.05
   f64.const 1
   local.get $30
   select
   f64.mul
   local.get $31
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $37
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.set $46
   f64.const 1
   local.set $29
   i32.const 1
   local.set $1
   loop $for-loop|2
    local.get $1
    local.get $20
    i32.le_s
    if
     local.get $29
     local.get $1
     i32.const 1
     i32.add
     local.tee $1
     f64.convert_i32_s
     f64.const 0.01
     f64.mul
     f64.const 1
     f64.add
     f64.mul
     local.set $29
     br $for-loop|2
    end
   end
   local.get $6
   f64.const 1
   f64.max
   f64.const 1.25
   f64.const 1
   local.get $7
   select
   f64.mul
   local.get $8
   f64.const 1
   f64.max
   f64.mul
   f64.const 1.05
   local.get $9
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.02
   local.get $10
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.05
   local.get $11
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.25
   f64.const 1
   local.get $14
   select
   f64.mul
   f64.const 1.07
   local.get $15
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   local.get $2
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 1
   f64.add
   f64.const -0.1
   f64.add
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.1
   local.get $16
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.1
   local.get $17
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.08
   local.get $18
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $19
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.2
   f64.const 1
   local.get $19
   i32.const 4
   i32.ge_s
   select
   f64.mul
   local.get $29
   f64.mul
   f64.const 1.2
   f64.const 1
   local.get $21
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.3
   f64.const 1
   local.get $21
   i32.const 4
   i32.ge_s
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $22
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $23
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.07
   f64.const 1
   local.get $24
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.05
   f64.const 1
   local.get $25
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $26
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $27
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $28
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   local.get $34
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.08
   local.get $35
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   local.get $36
   f64.convert_i32_s
   f64.const 0.002
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.const 1.3
   f64.const 1
   local.get $38
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $32
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.set $8
   local.get $44
   f64.const 1.051
   global.get $assembly/evalBorge/currentEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   call $~lib/math/NativeMath.pow
   f64.const -1
   f64.add
   f64.const 0.050999999999999934
   f64.div
   f64.const 10
   f64.mul
   global.get $assembly/evalBorge/currentEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   global.get $assembly/evalBorge/currentEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   f64.const 10
   f64.mul
   f64.sub
   f64.const 1.051
   global.get $assembly/evalBorge/currentEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.add
   f64.mul
   local.get $46
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=188
   f64.convert_i32_s
   f64.const 0.2
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=56
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   local.set $29
   f64.const 1
   local.set $6
   global.get $assembly/evalBorge/currentEnem
   local.set $2
   loop $while-continue|3
    local.get $2
    local.get $33
    i32.ge_s
    if
     local.get $6
     f64.const 1.051
     f64.const 100
     call $~lib/math/NativeMath.pow
     f64.mul
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $40
     local.get $6
     local.get $3
     local.get $3
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 800
     f64.mul
     local.get $46
     f64.mul
     local.get $8
     f64.mul
     f64.add
     local.set $40
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=4
     local.get $41
     local.get $6
     local.get $4
     local.get $4
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 600
     f64.mul
     local.get $46
     f64.mul
     local.get $8
     f64.mul
     f64.add
     local.set $41
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store offset=4
     local.get $42
     local.get $6
     local.get $5
     local.get $5
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 400
     f64.mul
     local.get $46
     f64.mul
     local.get $8
     f64.mul
     f64.add
     local.set $42
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=4
     local.get $43
     local.get $6
     local.get $39
     local.get $39
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 300
     f64.mul
     local.get $46
     f64.mul
     local.get $8
     f64.mul
     local.get $45
     f64.mul
     f64.add
     local.set $43
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=264
     local.set $47
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=8
     local.get $0
     local.get $47
     local.get $6
     local.get $3
     local.get $3
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 800
     f64.mul
     local.get $46
     f64.mul
     f64.add
     f64.store offset=264
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=264
     local.set $47
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=8
     local.get $0
     local.get $47
     local.get $6
     local.get $4
     local.get $4
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 600
     f64.mul
     local.get $46
     f64.mul
     f64.add
     f64.store offset=264
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=264
     local.set $47
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store offset=8
     local.get $0
     local.get $47
     local.get $6
     local.get $5
     local.get $5
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 400
     f64.mul
     local.get $46
     f64.mul
     f64.add
     f64.store offset=264
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=264
     local.set $47
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=8
     local.get $0
     local.get $47
     local.get $6
     local.get $39
     local.get $39
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 300
     f64.mul
     local.get $46
     f64.mul
     f64.add
     f64.store offset=264
     local.get $2
     local.get $33
     i32.sub
     local.set $2
     i32.const 1000
     local.set $33
     local.get $2
     f64.convert_i32_s
     f64.const 990
     f64.min
     local.tee $47
     f64.const 10
     f64.div
     f64.floor
     local.set $48
     local.get $6
     f64.const 5
     f64.mul
     local.tee $6
     local.get $44
     f64.mul
     f64.const 1.051
     f64.mul
     f64.const 1.051
     local.get $47
     f64.const 10
     f64.div
     f64.floor
     call $~lib/math/NativeMath.pow
     f64.const -1
     f64.add
     f64.const 0.050999999999999934
     f64.div
     f64.const 10
     f64.mul
     local.get $47
     local.get $48
     f64.const 10
     f64.mul
     f64.sub
     f64.const 1.051
     local.get $48
     call $~lib/math/NativeMath.pow
     f64.mul
     f64.add
     f64.mul
     local.get $46
     f64.mul
     local.set $47
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     i32.load offset=188
     f64.convert_i32_s
     f64.const 0.2
     f64.mul
     local.set $48
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $29
     local.get $47
     local.get $48
     local.get $0
     f64.load offset=56
     f64.mul
     f64.const 1
     f64.add
     f64.mul
     f64.add
     local.set $29
     br $while-continue|3
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $29
   f64.const 3
   f64.mul
   f64.const 10
   f64.div
   local.tee $6
   local.get $3
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $44
   f64.div
   local.get $8
   f64.mul
   local.get $40
   f64.add
   local.set $40
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $6
   local.get $4
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $44
   f64.div
   local.get $8
   f64.mul
   local.get $41
   f64.add
   local.set $41
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $6
   local.get $5
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $44
   f64.div
   local.get $8
   f64.mul
   local.get $42
   f64.add
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $29
   f64.const 10
   f64.div
   local.get $39
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $44
   f64.div
   local.get $8
   f64.mul
   local.get $45
   f64.mul
   local.get $43
   f64.add
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=288
   local.get $40
   f64.add
   f64.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=296
   local.get $41
   f64.add
   f64.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=304
   local.get $6
   f64.add
   f64.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=312
   local.get $8
   f64.add
   f64.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $40
   local.get $0
   f64.load offset=328
   f64.min
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $40
   local.get $0
   f64.load offset=336
   f64.max
   f64.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $41
   local.get $0
   f64.load offset=344
   f64.min
   f64.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $41
   local.get $0
   f64.load offset=352
   f64.max
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $0
   f64.load offset=360
   f64.min
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $0
   f64.load offset=368
   f64.max
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $8
   local.get $0
   f64.load offset=376
   f64.min
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $8
   local.get $0
   f64.load offset=384
   f64.max
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=264
   local.get $29
   f64.add
   f64.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=160
   global.get $assembly/evalBorge/currentTime
   f64.add
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   global.get $assembly/evalBorge/currentEnem
   local.get $0
   i32.load offset=272
   i32.add
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=264
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $0
   f64.load offset=160
   f64.div
   f64.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=276
   i32.const 1
   i32.add
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   global.get $assembly/evalBorge/currentEnem
   f64.convert_i32_s
   local.tee $6
   local.get $0
   i32.load offset=280
   f64.convert_i32_s
   f64.min
   i32.trunc_sat_f64_s
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=284
   f64.convert_i32_s
   local.get $6
   f64.max
   i32.trunc_sat_f64_s
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=396
   local.tee $1
   i32.store
   local.get $1
   global.get $assembly/evalBorge/currentEnem
   i32.const 10
   i32.div_s
   local.tee $1
   call $"~lib/map/Map<i32,i32>#has"
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=396
    local.tee $2
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=396
    local.tee $0
    i32.store offset=4
    local.get $2
    local.get $1
    local.get $0
    local.get $1
    call $"~lib/map/Map<i32,i32>#get"
    i32.const 1
    i32.add
    call $"~lib/map/Map<i32,i32>#set"
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=396
    local.tee $0
    i32.store
    local.get $0
    local.get $1
    i32.const 1
    call $"~lib/map/Map<i32,i32>#set"
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 32
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalBorge/EVALBORGE_WASM (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 i32) (param $8 i32) (param $9 i32) (param $10 i32) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 i32) (param $26 i32) (param $27 i32) (param $28 i32) (param $29 i32) (param $30 i32) (param $31 i32) (param $32 i32) (param $33 i32) (param $34 i32) (param $35 i32) (param $36 i32) (param $37 f64) (param $38 f64) (param $39 i32) (param $40 i32) (param $41 i32) (param $42 i32) (param $43 i32) (param $44 i32) (param $45 i32) (param $46 i32) (param $47 i32) (param $48 i32) (param $49 i32) (param $50 i32) (param $51 i32) (param $52 i32) (param $53 i32) (param $54 i32) (param $55 i32) (param $56 i32) (param $57 i32) (param $58 i32) (param $59 i32) (param $60 i32) (param $61 i32) (param $62 i32) (param $63 i32) (param $64 i32) (param $65 i32) (param $66 i32) (param $67 i32) (param $68 i32) (param $69 i32) (param $70 i32) (param $71 i32) (param $72 i32) (param $73 i32) (param $74 i32) (param $75 i32) (param $76 i32) (param $77 i32) (param $78 i32) (param $79 i32) (param $80 i32) (param $81 i32) (param $82 i32) (param $83 i32) (param $84 i32) (param $85 i32) (param $86 i32) (param $87 i32) (param $88 i32) (param $89 i32) (param $90 i32) (param $91 i32) (param $92 i32) (param $93 i32) (param $94 i32) (param $95 i32) (param $96 i32) (param $97 i32) (param $98 i32) (param $99 i32) (result f64)
  (local $100 f64)
  (local $101 f64)
  (local $102 f64)
  (local $103 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  call $assembly/evalBorge/initEnemies
  f64.const 1.001
  local.get $35
  f64.convert_i32_s
  local.tee $100
  call $~lib/math/NativeMath.pow
  f64.const 1.02
  local.get $35
  i32.const 10
  i32.div_s
  f64.convert_i32_s
  local.tee $101
  call $~lib/math/NativeMath.pow
  f64.mul
  local.set $102
  f64.const 1.005
  local.get $100
  call $~lib/math/NativeMath.pow
  f64.const 1.02
  local.get $101
  call $~lib/math/NativeMath.pow
  f64.mul
  local.set $101
  global.get $~lib/memory/__stack_pointer
  call $assembly/evalBorge/Borge#constructor
  local.tee $35
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $1
  i32.store offset=4
  local.get $97
  i32.const 0
  i32.gt_s
  if (result f64)
   local.get $98
   f64.convert_i32_s
   f64.const 100
   f64.min
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
  else
   f64.const 1
  end
  local.set $103
  local.get $84
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $47
  i32.const 6
  i32.mul
  f64.convert_i32_s
  f64.const 43
  f64.add
  local.get $54
  i32.const 24
  i32.mul
  f64.convert_i32_s
  f64.add
  local.get $2
  i32.const 5
  i32.div_s
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 2.5
  f64.add
  local.get $2
  f64.convert_i32_s
  f64.mul
  f64.add
  local.get $102
  f64.mul
  local.get $43
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $72
  select
  f64.mul
  f64.const 1.2
  f64.const 1
  local.get $63
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $64
  select
  f64.mul
  local.get $65
  if (result f64)
   local.get $0
   i32.const 39
   i32.sub
   f64.convert_i32_s
   f64.const 0.015
   f64.mul
   f64.const 0
   f64.max
   f64.const 1
   f64.add
  else
   f64.const 1
  end
  f64.mul
  local.get $56
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1.0777
  f64.const 1
  local.get $86
  select
  f64.mul
  local.get $58
  f64.convert_i32_s
  f64.const 0.05
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  local.get $100
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $94
  i32.const 0
  i32.gt_s
  select
  f64.mul
  local.get $103
  f64.mul
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $50
  f64.convert_i32_s
  f64.const 3
  f64.add
  local.get $14
  f64.convert_i32_s
  f64.const 2
  f64.mul
  f64.add
  local.get $3
  i32.const 10
  i32.div_s
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 0.5
  f64.add
  local.get $3
  f64.convert_i32_s
  f64.mul
  f64.add
  local.get $102
  f64.mul
  local.get $45
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $66
  select
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $72
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $64
  select
  f64.mul
  local.get $65
  if (result f64)
   local.get $0
   i32.const 39
   i32.sub
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0
   f64.max
   f64.const 1
   f64.add
  else
   f64.const 1
  end
  f64.mul
  local.get $56
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1.05
  local.get $59
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  local.get $100
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $94
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $21
  f64.convert_i32_s
  f64.const 0.04
  f64.mul
  f64.const 0.02
  f64.add
  local.get $4
  i32.const 30
  i32.div_s
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 0.03
  f64.add
  local.get $4
  f64.convert_i32_s
  f64.mul
  f64.add
  local.get $102
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $72
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $64
  select
  f64.mul
  local.get $65
  if (result f64)
   local.get $0
   i32.const 39
   i32.sub
   f64.convert_i32_s
   f64.const 0.005
   f64.mul
   f64.const 0
   f64.max
   f64.const 1
   f64.add
  else
   f64.const 1
  end
  f64.mul
  f64.const 1.0777
  f64.const 1
  local.get $86
  select
  f64.mul
  local.get $100
  f64.mul
  f64.store offset=32
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $5
  f64.convert_i32_s
  f64.const 0.0144
  f64.mul
  f64.const 0.02
  f64.const 0
  local.get $64
  select
  local.tee $100
  f64.add
  local.get $53
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.add
  local.get $62
  f64.convert_i32_s
  f64.const 0.002
  f64.mul
  f64.add
  f64.store offset=40
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $6
  f64.convert_i32_s
  f64.const 0.0034
  f64.mul
  f64.const 0.01
  f64.add
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $7
  f64.convert_i32_s
  f64.const 0.005
  f64.mul
  f64.const 0.04
  f64.add
  f64.const 0.03
  f64.const 0
  local.get $66
  select
  f64.add
  local.get $100
  f64.add
  local.get $49
  f64.convert_i32_s
  f64.const 0.02
  f64.mul
  f64.add
  local.get $61
  f64.convert_i32_s
  f64.const 0.002
  f64.mul
  f64.add
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $8
  f64.convert_i32_s
  f64.const 0.0018
  f64.mul
  f64.const 0.05
  f64.add
  local.get $100
  f64.add
  local.get $48
  f64.convert_i32_s
  f64.const 0.0065
  f64.mul
  f64.add
  local.get $60
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.add
  f64.store offset=64
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $9
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1.3
  f64.add
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  f64.const 5
  local.get $10
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.sub
  local.get $52
  f64.convert_i32_s
  f64.const 0.04
  f64.mul
  f64.sub
  local.get $92
  i32.const 0
  i32.gt_s
  if (result f64)
   local.get $93
   f64.convert_i32_s
   f64.const 3
   f64.div
   f64.floor
   f64.const 0.01
   f64.mul
   f64.const 0.25
   f64.min
  else
   f64.const 0
  end
  f64.sub
  f64.store offset=80
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $11
  i32.store offset=168
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $12
  i32.store offset=172
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $13
  i32.store offset=176
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $14
  i32.store offset=180
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $15
  i32.store offset=184
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $16
  i32.store offset=188
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $17
  i32.store offset=192
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $19
  i32.store offset=196
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $18
  i32.store offset=200
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $20
  i32.store offset=204
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $21
  i32.store offset=208
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $22
  i32.store offset=212
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $23
  i32.store offset=216
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $24
  i32.store offset=220
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $25
  i32.store offset=224
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $26
  i32.store offset=228
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $27
  i32.store offset=232
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $28
  i32.store offset=236
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $29
  i32.store offset=240
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $30
  i32.store offset=244
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $31
  i32.store offset=248
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $32
  i32.store offset=252
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $33
  i32.store offset=256
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  local.get $34
  i32.store offset=260
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=8
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=200
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=204
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.mul
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=32
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=200
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=208
  f64.convert_i32_s
  f64.const 0.009
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.mul
  f64.store offset=32
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=24
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=200
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=204
  f64.convert_i32_s
  f64.const 0.002
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=240
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.mul
  f64.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=40
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $35
  i32.load offset=212
  f64.convert_i32_s
  f64.const 0.015
  f64.mul
  f64.add
  f64.store offset=40
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=64
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=248
  f64.convert_i32_s
  f64.const 0.044
  f64.mul
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=256
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.add
  f64.add
  f64.store offset=64
  local.get $99
  i32.const 0
  i32.gt_s
  if
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $35
   f64.load offset=64
   f64.const 0.02
   f64.add
   f64.store offset=64
  end
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=72
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=248
  f64.convert_i32_s
  f64.const 0.08
  f64.mul
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=256
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.add
  f64.add
  f64.store offset=72
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=56
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  i32.load offset=232
  f64.convert_i32_s
  f64.const 0.012
  f64.mul
  local.set $102
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $102
  local.get $35
  i32.load offset=256
  f64.convert_i32_s
  f64.const 0.004
  f64.mul
  f64.add
  f64.add
  f64.store offset=56
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  f64.load offset=48
  local.set $100
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $100
  local.get $35
  i32.load offset=232
  f64.convert_i32_s
  f64.const 0.016
  f64.mul
  f64.add
  f64.store offset=48
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=8
  local.get $35
  local.get $35
  i32.load offset=228
  f64.convert_i32_s
  f64.const 0.0111
  f64.mul
  f64.store offset=88
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $76
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $35
    i32.store offset=4
    local.get $35
    local.get $1
    local.get $69
    local.get $70
    local.get $39
    local.get $40
    i32.const 0
    i32.gt_s
    local.get $37
    local.get $36
    i32.const 0
    i32.gt_s
    local.get $38
    local.get $41
    local.get $42
    local.get $44
    local.get $46
    local.get $67
    i32.const 0
    i32.gt_s
    local.get $68
    i32.const 0
    i32.gt_s
    local.get $71
    local.get $51
    local.get $57
    local.get $55
    local.get $73
    local.get $74
    local.get $75
    local.get $77
    local.get $78
    local.get $79
    local.get $80
    local.get $81
    local.get $82
    local.get $83
    local.get $101
    local.get $72
    i32.const 0
    i32.gt_s
    local.get $56
    local.get $85
    local.get $87
    local.get $88
    local.get $89
    local.get $91
    local.get $94
    local.get $95
    local.get $96
    call $assembly/evalBorge/sim
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  local.get $35
  global.set $assembly/evalBorge/lastBorge
  global.get $~lib/memory/__stack_pointer
  local.get $35
  i32.store offset=4
  local.get $35
  f64.load offset=320
  f64.const 60
  f64.mul
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/testEnemyCreation (result f64)
  (local $0 i32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  call $assembly/evalBorge/initEnemies
  loop $for-loop|0
   local.get $0
   i32.const 1000
   i32.le_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/ENEMIES
    local.tee $3
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $3
    local.get $0
    call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store
    local.get $3
    f64.load
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store
    local.get $1
    local.get $2
    local.get $3
    f64.load offset=16
    f64.add
    f64.add
    local.set $1
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/evalBorge/getLastAvgStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=272
  f64.convert_i32_s
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastAvgTime (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=160
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  f64.const 60
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMinStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=280
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMaxStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=284
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBossHpPercent (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=276
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/lastBorge
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=392
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/lastBorge
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=276
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/lastBorge
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=284
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/ENEMIES
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 100
   i32.mul
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/lastBorge
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=392
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/lastBorge
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=276
   f64.convert_i32_s
   f64.div
   local.get $5
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalBorge/getLastBossKillRate (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=276
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/lastBorge
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=392
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalBorge/lastBorge
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=276
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/lastBorge
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=284
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/lastBorge
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=392
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=8
   f64.convert_i32_s
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/lastBorge
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=276
   f64.convert_i32_s
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalBorge/getLastMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=288
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=296
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=304
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=312
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMinMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=328
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMaxMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=336
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMinMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=344
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMaxMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=352
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMinMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=360
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMaxMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=368
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMinXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=376
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastMaxXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=384
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#get:size" (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=20
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/array/ensureCapacity (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=8
  local.tee $4
  i32.const 2
  i32.shr_u
  i32.gt_u
  if
   local.get $1
   i32.const 268435455
   i32.gt_u
   if
    i32.const 1056
    i32.const 8096
    i32.const 19
    i32.const 48
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load
   local.set $3
   i32.const 8
   local.get $1
   local.get $1
   i32.const 8
   i32.le_u
   select
   i32.const 2
   i32.shl
   local.set $1
   local.get $2
   if
    i32.const 1073741820
    local.get $4
    i32.const 1
    i32.shl
    local.tee $2
    local.get $2
    i32.const 1073741820
    i32.ge_u
    select
    local.tee $2
    local.get $1
    local.get $1
    local.get $2
    i32.lt_u
    select
    local.set $1
   end
   block $__inlined_func$~lib/rt/itcms/__renew$2320
    local.get $3
    i32.const 20
    i32.sub
    local.tee $4
    i32.load
    i32.const -4
    i32.and
    i32.const 16
    i32.sub
    local.get $1
    i32.ge_u
    if
     local.get $4
     local.get $1
     i32.store offset=16
     local.get $3
     local.set $2
     br $__inlined_func$~lib/rt/itcms/__renew$2320
    end
    local.get $1
    local.get $4
    i32.load offset=12
    call $~lib/rt/itcms/__new
    local.tee $2
    local.get $3
    local.get $1
    local.get $4
    i32.load offset=16
    local.tee $4
    local.get $1
    local.get $4
    i32.lt_u
    select
    memory.copy
   end
   local.get $2
   local.get $3
   i32.ne
   if
    local.get $0
    local.get $2
    i32.store
    local.get $0
    local.get $2
    i32.store offset=4
    local.get $0
    local.get $2
    i32.const 0
    call $~lib/rt/itcms/__link
   end
   local.get $0
   local.get $1
   i32.store offset=8
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<i32,i32>#keys" (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=8
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=16
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.const 22
   call $~lib/rt/itcms/__new
   local.tee $6
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   i32.const 0
   i32.store
   local.get $6
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   i32.const 0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   i32.const 0
   i32.store offset=12
   local.get $4
   i32.const 268435455
   i32.gt_u
   if
    i32.const 1056
    i32.const 8096
    i32.const 70
    i32.const 60
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   local.get $4
   local.get $4
   i32.const 8
   i32.le_u
   select
   i32.const 2
   i32.shl
   local.tee $0
   i32.const 1
   call $~lib/rt/itcms/__new
   local.tee $5
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=12
   local.get $6
   local.get $5
   i32.store
   local.get $6
   local.get $5
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   local.get $5
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   local.get $6
   local.get $4
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=4
   loop $for-loop|0
    local.get $2
    local.get $4
    i32.lt_s
    if
     local.get $3
     local.get $2
     i32.const 12
     i32.mul
     i32.add
     local.tee $5
     i32.load offset=8
     i32.const 1
     i32.and
     i32.eqz
     if
      global.get $~lib/memory/__stack_pointer
      local.get $6
      i32.store
      local.get $1
      local.tee $0
      i32.const 1
      i32.add
      local.set $1
      local.get $5
      i32.load
      local.set $7
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 11620
      i32.lt_s
      br_if $folding-inner1
      global.get $~lib/memory/__stack_pointer
      i32.const 0
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $6
      i32.store
      local.get $0
      local.get $6
      i32.load offset=12
      i32.ge_u
      if
       local.get $0
       i32.const 0
       i32.lt_s
       if
        i32.const 1360
        i32.const 8096
        i32.const 130
        i32.const 22
        call $~lib/builtins/abort
        unreachable
       end
       local.get $6
       local.get $0
       i32.const 1
       i32.add
       local.tee $5
       i32.const 1
       call $~lib/array/ensureCapacity
       global.get $~lib/memory/__stack_pointer
       local.get $6
       i32.store
       local.get $6
       local.get $5
       i32.store offset=12
      end
      global.get $~lib/memory/__stack_pointer
      local.get $6
      i32.store
      local.get $6
      i32.load offset=4
      local.get $0
      i32.const 2
      i32.shl
      i32.add
      local.get $7
      i32.store
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
     end
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   local.get $6
   local.get $1
   i32.const 0
   call $~lib/array/ensureCapacity
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store
   local.get $6
   local.get $1
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $6
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/array/Array<i32>#get:length (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/array/Array<i32>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 1360
   i32.const 8096
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/string/String.__concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   local.tee $2
   i32.store
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const -2
   i32.and
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store
   block $__inlined_func$~lib/string/String#concat$2389
    local.get $1
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const -2
    i32.and
    local.tee $4
    local.get $3
    i32.add
    local.tee $0
    i32.eqz
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     i32.const 8176
     local.set $0
     br $__inlined_func$~lib/string/String#concat$2389
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.const 2
    call $~lib/rt/itcms/__new
    local.tee $0
    i32.store offset=4
    local.get $0
    local.get $2
    local.get $3
    memory.copy
    local.get $0
    local.get $3
    i32.add
    local.get $1
    local.get $4
    memory.copy
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.add
    global.set $~lib/memory/__stack_pointer
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/util/string/joinStringArray (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store offset=8
  local.get $1
  i32.const 1
  i32.sub
  local.tee $4
  i32.const 0
  i32.lt_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8176
   return
  end
  local.get $4
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   i32.const 8176
   local.get $0
   select
   return
  end
  loop $for-loop|0
   local.get $1
   local.get $3
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $5
    i32.store offset=4
    local.get $5
    if
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store offset=8
     local.get $2
     local.get $5
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     i32.add
     local.set $2
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  i32.const 0
  local.set $3
  global.get $~lib/memory/__stack_pointer
  i32.const 8176
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.const 8172
  i32.load
  i32.const 1
  i32.shr_u
  local.tee $1
  local.get $4
  i32.mul
  i32.add
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $5
  i32.store offset=12
  i32.const 0
  local.set $2
  loop $for-loop|1
   local.get $2
   local.get $4
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $6
    i32.store offset=4
    local.get $6
    if
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store offset=8
     local.get $5
     local.get $3
     i32.const 1
     i32.shl
     i32.add
     local.get $6
     local.get $6
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     local.tee $6
     i32.const 1
     i32.shl
     memory.copy
     local.get $3
     local.get $6
     i32.add
     local.set $3
    end
    local.get $1
    if
     local.get $5
     local.get $3
     i32.const 1
     i32.shl
     i32.add
     i32.const 8176
     local.get $1
     i32.const 1
     i32.shl
     memory.copy
     local.get $1
     local.get $3
     i32.add
     local.set $3
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|1
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  local.get $4
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.tee $0
  i32.store offset=4
  local.get $0
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   local.get $5
   local.get $3
   i32.const 1
   i32.shl
   i32.add
   local.get $0
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const -2
   i32.and
   memory.copy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $5
 )
 (func $~lib/staticarray/StaticArray<~lib/string/String>#join (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 8176
  i32.store
  local.get $0
  local.get $1
  call $~lib/util/string/joinStringArray
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastProgressString (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 32
  memory.fill
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalBorge/lastBorge
   local.tee $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=396
   local.tee $0
   i32.store
   local.get $0
   call $"~lib/map/Map<i32,i32>#get:size"
  else
   i32.const 0
  end
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 32
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8032
   return
  end
  i32.const 8064
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8064
  i32.store offset=8
  i32.const 1
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $3
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.load offset=396
  local.tee $3
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $3
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $3
  i32.store offset=12
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/array/Array<i32>#get:length
   local.get $2
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store
    local.get $3
    local.get $2
    call $~lib/array/Array<i32>#__get
    local.set $4
    local.get $1
    i32.eqz
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     i32.const 8144
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.const 8144
     call $~lib/string/String.__concat
     local.tee $0
     i32.store offset=8
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    local.get $4
    call $~lib/number/I32#toString
    local.tee $1
    i32.store offset=16
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/lastBorge
    local.tee $6
    i32.store offset=24
    global.get $~lib/memory/__stack_pointer
    local.get $6
    i32.load offset=396
    local.tee $6
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $6
    local.get $4
    call $"~lib/map/Map<i32,i32>#get"
    call $~lib/number/I32#toString
    local.tee $4
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    i32.const 8272
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store offset=24
    i32.const 8276
    local.get $1
    i32.store
    i32.const 8272
    local.get $1
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 8272
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=24
    i32.const 8284
    local.get $4
    i32.store
    i32.const 8272
    local.get $4
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 8272
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    i32.const 8176
    i32.store offset=24
    i32.const 8272
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $1
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store offset=4
    local.get $0
    local.get $1
    call $~lib/string/String.__concat
    local.tee $0
    i32.store offset=8
    i32.const 0
    local.set $1
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 10096
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 10096
  call $~lib/string/String.__concat
  local.tee $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/evalBorge/getLastStatsString (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 44
  memory.fill
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=276
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 44
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8176
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  f64.load offset=8
  call $~lib/number/F64#toString
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  f64.load offset=24
  call $~lib/number/F64#toString
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  f64.load offset=32
  call $~lib/number/F64#toString
  local.tee $2
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $3
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $3
  f64.load offset=40
  call $~lib/number/F64#toString
  local.tee $3
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $4
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $4
  f64.load offset=48
  call $~lib/number/F64#toString
  local.tee $4
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $5
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $5
  f64.load offset=56
  call $~lib/number/F64#toString
  local.tee $5
  i32.store offset=24
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $6
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $6
  f64.load offset=64
  call $~lib/number/F64#toString
  local.tee $6
  i32.store offset=28
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $7
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $7
  f64.load offset=72
  call $~lib/number/F64#toString
  local.tee $7
  i32.store offset=32
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $8
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $8
  f64.load offset=80
  call $~lib/number/F64#toString
  local.tee $8
  i32.store offset=36
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=40
  i32.const 10128
  local.get $0
  i32.store
  i32.const 10128
  local.get $0
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=40
  i32.const 10136
  local.get $1
  i32.store
  i32.const 10128
  local.get $1
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=40
  i32.const 10144
  local.get $2
  i32.store
  i32.const 10128
  local.get $2
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store offset=40
  i32.const 10152
  local.get $3
  i32.store
  i32.const 10128
  local.get $3
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=40
  i32.const 10160
  local.get $4
  i32.store
  i32.const 10128
  local.get $4
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $5
  i32.store offset=40
  i32.const 10168
  local.get $5
  i32.store
  i32.const 10128
  local.get $5
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=40
  i32.const 10176
  local.get $6
  i32.store
  i32.const 10128
  local.get $6
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $7
  i32.store offset=40
  i32.const 10184
  local.get $7
  i32.store
  i32.const 10128
  local.get $7
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $8
  i32.store offset=40
  i32.const 10192
  local.get $8
  i32.store
  i32.const 10128
  local.get $8
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 10128
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 8176
  i32.store offset=40
  i32.const 10128
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeMaxHp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeAtk (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=24
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeRegen (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=32
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeDr (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=40
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeEvade (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=48
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeEffect (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=56
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeCritRate (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=64
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeCritPower (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=72
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getLastBorgeReload (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=80
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getProgressSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=396
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getProgressStageAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=396
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=396
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getProgressCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=396
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=396
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=396
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getDeathsByStageAndReviveSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=400
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getDeathKeyAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=400
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=400
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getDeathCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=400
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=400
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=400
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalBorge/getDeathsByStageAndReviveString (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 36
  memory.fill
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=400
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 36
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8032
   return
  end
  i32.const 8064
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8064
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalBorge/lastBorge
  local.tee $2
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.load offset=400
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $2
  i32.store offset=12
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/array/Array<i32>#get:length
   local.get $1
   i32.gt_s
   if
    local.get $1
    i32.const 0
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     i32.const 8144
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.const 8144
     call $~lib/string/String.__concat
     local.tee $0
     i32.store offset=8
    end
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    local.get $2
    local.get $1
    call $~lib/array/Array<i32>#__get
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalBorge/lastBorge
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=400
    local.tee $3
    i32.store
    local.get $3
    local.get $4
    call $"~lib/map/Map<i32,i32>#get"
    local.set $5
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.div_s
    call $~lib/number/I32#toString
    local.tee $3
    i32.store offset=16
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.rem_s
    call $~lib/number/I32#toString
    local.tee $4
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $5
    call $~lib/number/I32#toString
    local.tee $5
    i32.store offset=24
    global.get $~lib/memory/__stack_pointer
    i32.const 11392
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=32
    i32.const 11396
    local.get $3
    i32.store
    i32.const 11392
    local.get $3
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11392
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=32
    i32.const 11404
    local.get $4
    i32.store
    i32.const 11392
    local.get $4
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11392
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=32
    i32.const 11412
    local.get $5
    i32.store
    i32.const 11392
    local.get $5
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11392
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    i32.const 8176
    i32.store offset=32
    i32.const 11392
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    local.get $0
    local.get $3
    call $~lib/string/String.__concat
    local.tee $0
    i32.store offset=8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 10096
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 10096
  call $~lib/string/String.__concat
  local.tee $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/staticarray/StaticArray<i32>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 93
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/staticarray/StaticArray<i32>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1104
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzyKillEnemy
  (local $0 i32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  f64.const 0
  global.set $assembly/evalOzzy/hardenEnd
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 1
  i32.add
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 10
  i32.add
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  select
  global.set $assembly/evalOzzy/currentOzzyEnem
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 1000
  i32.eq
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $3
   f64.load offset=104
   f64.const 1.08
   global.get $assembly/evalOzzy/currentOzzyCatchup99gu
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   global.get $assembly/evalOzzy/currentOzzyAttr
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 1
   f64.add
   f64.const -0.1
   f64.add
   call $~lib/math/NativeMath.pow
   f64.div
   f64.store offset=104
  end
  f64.const 99999999
  global.get $assembly/evalOzzy/currentOzzyTime
  f64.const 25
  f64.add
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 2000
  i32.ge_s
  if (result i32)
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  select
  global.set $assembly/evalOzzy/nextHarden
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 10
  i32.rem_s
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/OZZY_ENEMIES
   local.tee $0
   i32.store
   local.get $0
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 10
   i32.div_s
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   global.set $assembly/evalOzzy/currentOzzyEnemy
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $3
  i32.store offset=4
  local.get $0
  local.get $3
  f64.load
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=88
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.const 0
  f64.store offset=96
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=96
  f64.lt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=212
  else
   i32.const 0
  end
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=56
   local.tee $1
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalOzzy/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalOzzy/seed
    local.get $1
    global.get $assembly/evalOzzy/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=96
   local.set $2
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=16
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=96
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $2
   local.get $4
   local.get $1
   local.get $3
   i32.load offset=212
   f64.convert_i32_s
   f64.mul
   f64.const 0.02
   f64.mul
   f64.add
   f64.min
   f64.store offset=16
   i32.const 5
   global.set $assembly/evalOzzy/vectidStacks
  end
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=80
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   f64.const 1
   local.get $0
   f64.load offset=120
   f64.sub
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=112
   f64.gt
  else
   i32.const 1
  end
  if (result f64)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalOzzy/currentOzzyTime
   local.get $0
   f64.load offset=72
   f64.add
  else
   f64.const 9999999
  end
  global.set $assembly/evalOzzy/nextOzzyEnemAtk
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  f64.const 0
  f64.le
  if
   call $assembly/evalOzzy/ozzyKillEnemy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzyRegen
  (local $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 f64)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 3000
  i32.ge_s
  if (result i32)
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if (result f64)
   f64.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=64
   f64.const 0.2
   f64.mul
   f64.const 1
   f64.const 3
   global.get $assembly/evalOzzy/currentOzzyTime
   global.get $assembly/evalOzzy/hardenEnd
   f64.gt
   select
   f64.mul
  end
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $2
  i32.store offset=4
  local.get $2
  f64.load offset=96
  local.set $3
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $2
  i32.store offset=4
  local.get $2
  f64.load offset=16
  local.get $1
  f64.sub
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $2
  i32.store offset=4
  local.get $0
  local.get $3
  local.get $1
  local.get $2
  f64.load offset=112
  global.get $assembly/evalOzzy/vectidStacks
  if (result f64)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store offset=4
   local.get $0
   i32.load offset=280
   f64.convert_i32_s
   f64.const 0.15
   f64.mul
   f64.const 1
   f64.add
  else
   f64.const 1
  end
  f64.mul
  f64.add
  f64.min
  f64.store offset=16
  global.get $assembly/evalOzzy/currentOzzyTime
  global.get $assembly/evalOzzy/hardenEnd
  f64.gt
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=8
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=64
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   f64.const 1
   local.get $2
   i32.load offset=284
   f64.convert_i32_s
   f64.const 0.088
   f64.mul
   f64.sub
   f64.mul
   f64.add
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   i32.load offset=272
   f64.convert_i32_s
   f64.const 0.06
   f64.mul
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   local.get $4
   local.get $2
   f64.load offset=112
   f64.mul
   global.get $assembly/evalOzzy/vectidStacks
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzy
    local.tee $0
    i32.store offset=4
    local.get $0
    i32.load offset=280
    f64.convert_i32_s
    f64.const 0.15
    f64.mul
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.sub
   f64.min
   f64.store offset=8
  end
  global.get $assembly/evalOzzy/currentOzzyTime
  f64.const 1
  f64.add
  global.set $assembly/evalOzzy/nextOzzyRegen
  global.get $assembly/evalOzzy/vectidStacks
  i32.const 1
  i32.sub
  f64.convert_i32_s
  f64.const 0
  f64.max
  i32.trunc_sat_f64_s
  global.set $assembly/evalOzzy/vectidStacks
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  f64.const 0
  f64.le
  if
   call $assembly/evalOzzy/ozzyKillEnemy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzyAtk (param $0 i32) (param $1 f64) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $3
  i32.store
  local.get $3
  f64.load offset=48
  f64.const 0
  f64.gt
  local.tee $3
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $3
   i32.store
   local.get $3
   f64.load offset=48
   local.tee $5
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalOzzy/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalOzzy/seed
    local.get $5
    global.get $assembly/evalOzzy/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
   local.set $3
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $6
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $4
  i32.store offset=4
  local.get $6
  local.get $4
  f64.load offset=8
  local.get $3
  if (result f64)
   f64.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $4
   i32.store offset=4
   local.get $4
   f64.load offset=104
   local.get $1
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $4
   i32.store offset=4
   local.get $4
   i32.load offset=220
   f64.convert_i32_s
   f64.const 0.008
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $4
   i32.store offset=4
   local.get $4
   f64.load offset=8
   f64.mul
   f64.const 1
   f64.const 10
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 0
   i32.gt_s
   if (result i32)
    global.get $assembly/evalOzzy/currentOzzyEnem
    i32.const 1000
    i32.rem_s
   else
    i32.const 1
   end
   select
   f64.div
   f64.add
   global.get $assembly/evalOzzy/cripplingActive
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzy
    local.tee $4
    i32.store offset=4
    local.get $4
    i32.load offset=228
    f64.convert_i32_s
    f64.const 0.03
    f64.mul
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   global.get $assembly/evalOzzy/currentOzzyTime
   global.get $assembly/evalOzzy/hardenEnd
   f64.lt
   if (result f64)
    f64.const 0.05
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $4
    i32.store offset=4
    local.get $4
    f64.load offset=40
   end
   f64.mul
  end
  f64.sub
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $4
  i32.store
  local.get $4
  f64.load offset=8
  f64.const 0
  f64.le
  if
   call $assembly/evalOzzy/ozzyKillEnemy
  end
  local.get $2
  i32.eqz
  local.tee $2
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store
   local.get $2
   f64.load offset=128
   local.tee $5
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalOzzy/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalOzzy/seed
    local.get $5
    global.get $assembly/evalOzzy/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   local.get $2
  end
  if
   global.get $assembly/evalOzzy/currentOzzyTime
   f64.const 0.3
   f64.add
   global.set $assembly/evalOzzy/nextMultistrike
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $2
  i32.store
  local.get $2
  local.get $3
  if (result f64)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=16
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=96
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=16
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=88
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=104
   f64.mul
   local.get $1
   f64.mul
   f64.add
   f64.min
  end
  f64.store offset=16
  local.get $3
  if (result i32)
   i32.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store
   local.get $2
   i32.load offset=228
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store
   local.get $2
   f64.load offset=56
   local.tee $1
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalOzzy/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalOzzy/seed
    local.get $1
    global.get $assembly/evalOzzy/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
   global.set $assembly/evalOzzy/cripplingActive
  end
  local.get $0
  i32.eqz
  if
   local.get $3
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=232
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=56
     f64.const 0.5
     f64.mul
     local.tee $1
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalOzzy/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalOzzy/seed
      local.get $1
      global.get $assembly/evalOzzy/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    else
     i32.const 0
    end
    if
     global.get $assembly/evalOzzy/currentOzzyTime
     f64.const 0.3001
     f64.add
     global.set $assembly/evalOzzy/nextEchoBullet
    end
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=208
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=56
     f64.const 0.5
     f64.mul
     local.tee $1
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalOzzy/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalOzzy/seed
      local.get $1
      global.get $assembly/evalOzzy/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    else
     i32.const 0
    end
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $2
     i32.store offset=4
     local.get $0
     local.get $2
     i32.load offset=144
     i32.const 1
     i32.add
     i32.store offset=144
    end
    global.get $assembly/evalOzzy/currentOzzyTime
    global.get $assembly/evalOzzy/hardenEnd
    f64.gt
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     local.get $0
     i32.load offset=216
    else
     i32.const 0
    end
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=56
     local.tee $1
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalOzzy/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalOzzy/seed
      local.get $1
      global.get $assembly/evalOzzy/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    else
     i32.const 0
    end
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     global.get $assembly/evalOzzy/nextOzzyEnemAtk
     local.get $0
     i32.load offset=216
     f64.convert_i32_s
     f64.const 0.05
     f64.mul
     f64.const 1
     f64.const 2
     global.get $assembly/evalOzzy/currentOzzyEnem
     i32.const 1000
     i32.rem_s
     select
     local.tee $1
     f64.div
     f64.add
     global.set $assembly/evalOzzy/nextOzzyEnemAtk
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzyEnemy
     local.tee $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $2
     i32.store offset=4
     local.get $0
     global.get $assembly/evalOzzy/currentOzzyTime
     local.get $2
     i32.load offset=216
     f64.convert_i32_s
     f64.const 0.05
     f64.mul
     local.get $1
     f64.div
     f64.add
     f64.store offset=96
    end
   end
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.lt_s
   if (result f64)
    f64.const 1.08
    global.get $assembly/evalOzzy/currentOzzyCatchup99gu
    f64.convert_i32_s
    call $~lib/math/NativeMath.pow
    global.get $assembly/evalOzzy/currentOzzyAttr
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.const 1
    f64.add
    f64.const -0.1
    f64.add
    call $~lib/math/NativeMath.pow
   else
    f64.const 1
   end
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   global.get $assembly/evalOzzy/currentOzzyTime
   local.get $0
   f64.load offset=80
   local.get $1
   f64.div
   f64.add
   global.set $assembly/evalOzzy/nextOzzyAtk
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzyEnemyAttack
  (local $0 i32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=16
  local.set $1
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalOzzy/currentOzzyTime
   local.get $0
   f64.load offset=72
   f64.add
   global.set $assembly/evalOzzy/nextOzzyEnemAtk
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $3
   i32.load offset=88
   i32.const 1
   i32.add
   i32.store offset=88
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   local.get $1
   f64.const 3
   f64.mul
   local.get $1
   local.get $0
   i32.load offset=88
   i32.const 200
   i32.gt_s
   select
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=72
   local.set $2
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=88
   f64.convert_i32_s
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalOzzy/currentOzzyTime
   local.get $2
   local.get $4
   local.get $0
   f64.load offset=72
   f64.const 200
   f64.div
   f64.mul
   f64.sub
   f64.const 0.5
   f64.max
   f64.add
   global.set $assembly/evalOzzy/nextOzzyEnemAtk
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=144
  if
   f64.const 0
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $3
   i32.load offset=144
   i32.const 1
   i32.sub
   i32.store offset=144
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=48
   local.tee $2
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalOzzy/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalOzzy/seed
    local.get $2
    global.get $assembly/evalOzzy/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
   if
    f64.const 0
    local.set $1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=88
    i32.const 200
    i32.gt_s
    if (result i32)
     i32.const 1
    else
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzyEnemy
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=24
     local.tee $2
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalOzzy/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalOzzy/seed
      local.get $2
      global.get $assembly/evalOzzy/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    end
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzyEnemy
     local.tee $0
     i32.store
     local.get $1
     local.get $0
     f64.load offset=32
     f64.mul
     local.set $1
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/currentOzzy
     local.tee $0
     i32.store
     local.get $0
     i32.load offset=252
     f64.convert_i32_s
     f64.const 0.15
     f64.mul
     local.tee $2
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalOzzy/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalOzzy/seed
      local.get $2
      global.get $assembly/evalOzzy/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
     if
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/currentOzzy
      local.tee $0
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/currentOzzy
      local.tee $3
      i32.store offset=4
      local.get $0
      local.get $3
      i32.load offset=144
      i32.const 1
      i32.add
      i32.store offset=144
     end
    end
   end
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=56
  local.tee $2
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalOzzy/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalOzzy/seed
   local.get $2
   global.get $assembly/evalOzzy/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $3
   i32.store offset=4
   local.get $0
   local.get $3
   f64.load offset=120
   f64.const -0.02
   f64.add
   f64.const 0
   f64.max
   f64.store offset=120
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $3
  i32.store offset=4
  local.get $3
  f64.load offset=16
  local.set $2
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $3
  i32.store offset=4
  local.get $1
  f64.const 1
  local.get $3
  f64.load offset=120
  f64.sub
  f64.mul
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzy
  local.tee $3
  i32.store offset=4
  local.get $0
  local.get $2
  local.get $1
  f64.const 1
  local.get $3
  i32.load offset=276
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.sub
  global.get $assembly/evalOzzy/currentOzzyCreaGem4
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.sub
  f64.mul
  f64.sub
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzyHarden
  (local $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 f64)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $assembly/evalOzzy/hardenEnd
  i64.reinterpret_f64
  i64.const 1
  i64.shl
  i64.const 2
  i64.sub
  i64.const -9007199254740994
  i64.gt_u
  if
   global.get $assembly/evalOzzy/currentOzzyTime
   f64.const 5
   f64.add
   global.set $assembly/evalOzzy/hardenEnd
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $assembly/evalOzzy/nextOzzyEnemAtk
   f64.const 5
   local.get $0
   f64.load offset=96
   global.get $assembly/evalOzzy/currentOzzyTime
   f64.sub
   f64.const 0
   f64.max
   f64.sub
   f64.add
   global.set $assembly/evalOzzy/nextOzzyEnemAtk
   global.get $assembly/evalOzzy/currentOzzyTime
   f64.const 3
   f64.mul
   f64.ceil
   f64.const 3
   f64.div
   global.set $assembly/evalOzzy/nextHarden
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=8
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzyEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=64
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   f64.const 1
   local.get $2
   i32.load offset=284
   f64.convert_i32_s
   f64.const 0.088
   f64.mul
   f64.sub
   f64.mul
   f64.add
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $2
   i32.load offset=272
   f64.convert_i32_s
   f64.const 0.06
   f64.mul
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/currentOzzy
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $3
   local.get $4
   local.get $2
   f64.load offset=112
   f64.mul
   global.get $assembly/evalOzzy/vectidStacks
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzy
    local.tee $0
    i32.store offset=4
    local.get $0
    i32.load offset=280
    f64.convert_i32_s
    f64.const 0.15
    f64.mul
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.sub
   f64.min
   f64.store offset=8
   global.get $assembly/evalOzzy/currentOzzyTime
   f64.const 0.3333333333333333
   f64.add
   global.set $assembly/evalOzzy/nextHarden
   global.get $assembly/evalOzzy/nextHarden
   global.get $assembly/evalOzzy/hardenEnd
   f64.gt
   if
    global.get $assembly/evalOzzy/currentOzzyTime
    f64.const 25
    f64.add
    global.set $assembly/evalOzzy/nextHarden
    f64.const 0
    global.set $assembly/evalOzzy/hardenEnd
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $2
    i32.store offset=4
    local.get $0
    local.get $2
    i32.load offset=88
    i32.const 5
    i32.add
    i32.store offset=88
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=88
    i32.const 5
    i32.sub
    f64.convert_i32_s
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    local.set $1
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    f64.load offset=72
    local.set $3
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=88
    f64.convert_i32_s
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/currentOzzyEnemy
    local.tee $0
    i32.store
    global.get $assembly/evalOzzy/nextOzzyEnemAtk
    local.get $1
    local.get $3
    local.get $4
    local.get $0
    f64.load offset=72
    f64.const 200
    f64.div
    f64.mul
    f64.sub
    f64.const 0.5
    f64.max
    f64.sub
    f64.sub
    global.set $assembly/evalOzzy/nextOzzyEnemAtk
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/ozzySim (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 f64) (param $6 i32) (param $7 f64) (param $8 i32) (param $9 i32) (param $10 i32) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 f64) (param $26 i32) (param $27 i32) (param $28 i32) (param $29 i32) (param $30 i32) (param $31 i32) (param $32 i32) (param $33 i32) (param $34 i32)
  (local $35 f64)
  (local $36 f64)
  (local $37 f64)
  (local $38 f64)
  (local $39 f64)
  (local $40 i32)
  (local $41 f64)
  (local $42 i32)
  (local $43 f64)
  (local $44 f64)
  (local $45 f64)
  (local $46 f64)
  (local $47 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 32
  memory.fill
  i32.const -1
  global.set $assembly/evalOzzy/entryRevivesForRun
  i32.const -1
  global.set $assembly/evalOzzy/lastTrackedBossStage
  local.get $0
  global.set $assembly/evalOzzy/currentOzzy
  i32.const 0
  global.set $assembly/evalOzzy/currentOzzyEnem
  f64.const 0
  global.set $assembly/evalOzzy/currentOzzyTime
  local.get $2
  global.set $assembly/evalOzzy/currentOzzyAttr
  local.get $3
  global.set $assembly/evalOzzy/currentOzzyCatchup99gu
  local.get $34
  global.set $assembly/evalOzzy/currentOzzyCreaGem4
  i32.const 0
  global.set $assembly/evalOzzy/vectidStacks
  i32.const 0
  global.set $assembly/evalOzzy/cripplingActive
  f64.const 0
  global.set $assembly/evalOzzy/hardenEnd
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=144
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=8
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=8
  f64.store offset=96
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=24
  f64.const 1.08
  local.get $3
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  local.get $2
  f64.convert_i32_s
  f64.const 0.1
  f64.mul
  f64.const 1
  f64.add
  f64.const -0.1
  f64.add
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.store offset=104
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=32
  f64.store offset=112
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=40
  f64.store offset=120
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=64
  f64.store offset=128
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=72
  f64.store offset=136
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.load offset=204
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $3
  local.get $0
  i32.load offset=296
  i32.add
  i32.store offset=148
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=160
  f64.const 40
  local.get $4
  f64.convert_i32_s
  f64.const 30
  f64.min
  f64.sub
  f64.add
  f64.store offset=160
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.load offset=4
  f64.convert_i32_s
  local.set $39
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $39
  local.get $0
  i32.load offset=324
  i32.const 10
  i32.div_s
  f64.convert_i32_s
  f64.max
  i32.trunc_sat_f64_s
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=152
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=460
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.load offset=204
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $3
   local.get $0
   i32.load offset=296
   i32.add
   i32.store offset=460
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/OZZY_ENEMIES
  local.tee $3
  i32.store
  local.get $3
  i32.const 0
  call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
  global.set $assembly/evalOzzy/currentOzzyEnemy
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $3
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $4
  i32.store offset=4
  local.get $3
  local.get $4
  f64.load
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=80
  global.set $assembly/evalOzzy/nextOzzyAtk
  f64.const 99999999
  global.set $assembly/evalOzzy/nextEchoBullet
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/currentOzzyEnemy
  local.tee $3
  i32.store
  local.get $3
  f64.load offset=72
  global.set $assembly/evalOzzy/nextOzzyEnemAtk
  f64.const 1
  global.set $assembly/evalOzzy/nextOzzyRegen
  f64.const 99999999
  global.set $assembly/evalOzzy/nextMultistrike
  f64.const 99999999
  global.set $assembly/evalOzzy/nextHarden
  loop $while-continue|0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=16
   f64.const 0
   f64.gt
   if
    global.get $assembly/evalOzzy/currentOzzyEnem
    i32.const 0
    i32.gt_s
    if (result i32)
     global.get $assembly/evalOzzy/currentOzzyEnem
     i32.const 1000
     i32.rem_s
    else
     i32.const 1
    end
    i32.eqz
    if
     global.get $assembly/evalOzzy/currentOzzyEnem
     i32.const 10
     i32.div_s
     local.tee $3
     global.get $assembly/evalOzzy/lastTrackedBossStage
     i32.ne
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store
      local.get $0
      i32.load offset=148
      global.set $assembly/evalOzzy/entryRevivesForRun
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/bossAttemptsByRevive
      local.tee $4
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      local.get $0
      i32.load offset=148
      local.set $34
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/bossAttemptsByRevive
      local.tee $40
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      local.get $4
      local.get $34
      local.get $40
      local.get $0
      i32.load offset=148
      call $~lib/staticarray/StaticArray<i32>#__get
      i32.const 1
      i32.add
      call $~lib/staticarray/StaticArray<i32>#__set
      local.get $3
      global.set $assembly/evalOzzy/lastTrackedBossStage
     end
    end
    global.get $assembly/evalOzzy/nextHarden
    global.get $assembly/evalOzzy/nextOzzyRegen
    global.get $assembly/evalOzzy/nextOzzyEnemAtk
    global.get $assembly/evalOzzy/nextMultistrike
    global.get $assembly/evalOzzy/nextOzzyAtk
    global.get $assembly/evalOzzy/nextEchoBullet
    f64.min
    f64.min
    f64.min
    f64.min
    f64.min
    global.set $assembly/evalOzzy/currentOzzyTime
    global.get $assembly/evalOzzy/currentOzzyTime
    global.get $assembly/evalOzzy/nextOzzyRegen
    f64.eq
    if
     call $assembly/evalOzzy/ozzyRegen
    else
     global.get $assembly/evalOzzy/currentOzzyTime
     global.get $assembly/evalOzzy/nextMultistrike
     f64.eq
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store
      i32.const 1
      local.get $0
      f64.load offset=136
      i32.const 1
      call $assembly/evalOzzy/ozzyAtk
      f64.const 99999999
      global.set $assembly/evalOzzy/nextMultistrike
     else
      global.get $assembly/evalOzzy/currentOzzyTime
      global.get $assembly/evalOzzy/nextEchoBullet
      f64.eq
      if
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store
       i32.const 1
       local.get $0
       i32.load offset=232
       f64.convert_i32_s
       f64.const 0.05
       f64.mul
       i32.const 0
       call $assembly/evalOzzy/ozzyAtk
       f64.const 99999999
       global.set $assembly/evalOzzy/nextEchoBullet
      else
       global.get $assembly/evalOzzy/currentOzzyTime
       global.get $assembly/evalOzzy/nextOzzyEnemAtk
       f64.eq
       if
        call $assembly/evalOzzy/ozzyEnemyAttack
       else
        global.get $assembly/evalOzzy/currentOzzyTime
        global.get $assembly/evalOzzy/nextHarden
        f64.eq
        if
         call $assembly/evalOzzy/ozzyHarden
        else
         global.get $assembly/evalOzzy/currentOzzyTime
         global.get $assembly/evalOzzy/nextOzzyAtk
         f64.eq
         if
          i32.const 0
          f64.const 1
          i32.const 0
          call $assembly/evalOzzy/ozzyAtk
         end
        end
       end
      end
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load offset=148
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     f64.load offset=16
     f64.const 0
     f64.le
    else
     i32.const 0
    end
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     f64.load offset=96
     f64.const 0.8
     f64.mul
     f64.store offset=16
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     i32.load offset=460
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     i32.load offset=148
     i32.sub
     i32.const 1
     i32.add
     global.get $assembly/evalOzzy/currentOzzyEnem
     i32.const 10
     i32.div_s
     i32.const 1000
     i32.mul
     i32.add
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=456
     local.tee $4
     i32.store
     local.get $4
     local.get $3
     call $"~lib/map/Map<i32,i32>#has"
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=456
      local.tee $4
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=456
      local.tee $34
      i32.store offset=4
      local.get $4
      local.get $3
      local.get $34
      local.get $3
      call $"~lib/map/Map<i32,i32>#get"
      i32.const 1
      i32.add
      call $"~lib/map/Map<i32,i32>#set"
     else
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=456
      local.tee $4
      i32.store
      local.get $4
      local.get $3
      i32.const 1
      call $"~lib/map/Map<i32,i32>#set"
     end
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     i32.load offset=148
     i32.const 1
     i32.sub
     i32.store offset=148
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=24
     local.set $39
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=292
     f64.convert_i32_s
     f64.const 0.02
     f64.mul
     local.set $41
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=204
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=296
     i32.add
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $39
     local.get $41
     local.get $3
     local.get $0
     i32.load offset=148
     i32.sub
     f64.convert_i32_s
     f64.mul
     f64.const 1
     f64.add
     f64.mul
     f64.store offset=104
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=40
     local.set $39
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=292
     f64.convert_i32_s
     f64.const 0.016
     f64.mul
     local.set $41
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=204
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=296
     i32.add
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $39
     local.get $41
     local.get $3
     local.get $0
     i32.load offset=148
     i32.sub
     f64.convert_i32_s
     f64.mul
     f64.add
     f64.store offset=120
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=128
     local.set $39
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $39
     local.get $0
     i32.load offset=288
     f64.convert_i32_s
     f64.const 0.023
     f64.mul
     f64.add
     f64.store offset=128
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=136
     local.set $39
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $39
     local.get $0
     i32.load offset=288
     f64.convert_i32_s
     f64.const 0.02
     f64.mul
     f64.add
     f64.store offset=136
    end
    br $while-continue|0
   end
  end
  global.get $assembly/evalOzzy/entryRevivesForRun
  i32.const 0
  i32.ge_s
  if
   global.get $assembly/evalOzzy/currentOzzyEnem
   global.get $assembly/evalOzzy/currentOzzyEnem
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.const 100
   f64.div
   i32.trunc_sat_f64_s
   i32.const 1000
   i32.mul
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossKillsByRevive
    local.tee $3
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossKillsByRevive
    local.tee $4
    i32.store offset=4
    local.get $3
    global.get $assembly/evalOzzy/entryRevivesForRun
    local.get $4
    global.get $assembly/evalOzzy/entryRevivesForRun
    call $~lib/staticarray/StaticArray<i32>#__get
    i32.const 1
    i32.add
    call $~lib/staticarray/StaticArray<i32>#__set
   end
  end
  i32.const 0
  local.set $3
  loop $for-loop|1
   local.get $3
   i32.const 10
   i32.lt_s
   if
    global.get $assembly/evalOzzy/currentOzzyEnem
    local.get $3
    i32.const 1
    i32.add
    local.tee $4
    i32.const 1000
    i32.mul
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=448
     local.tee $34
     i32.store offset=4
     local.get $34
     local.get $3
     call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
     local.set $34
     global.get $~lib/memory/__stack_pointer
     local.get $34
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load offset=448
     local.tee $40
     i32.store offset=8
     local.get $40
     local.get $3
     call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
     local.set $40
     global.get $~lib/memory/__stack_pointer
     local.get $40
     i32.store offset=4
     local.get $40
     f64.load
     local.set $39
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/OZZY_ENEMIES
     local.tee $40
     i32.store offset=8
     local.get $40
     local.get $4
     i32.const 100
     i32.mul
     call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
     local.set $4
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=4
     local.get $34
     local.get $39
     local.get $4
     f64.load
     f64.add
     f64.store
    else
     global.get $assembly/evalOzzy/currentOzzyEnem
     local.get $3
     i32.const 1
     i32.add
     local.tee $4
     i32.const 1000
     i32.mul
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=448
      local.tee $34
      i32.store offset=4
      local.get $34
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $34
      global.get $~lib/memory/__stack_pointer
      local.get $34
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=448
      local.tee $40
      i32.store offset=8
      local.get $40
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $40
      global.get $~lib/memory/__stack_pointer
      local.get $40
      i32.store offset=4
      local.get $40
      f64.load
      local.set $39
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/OZZY_ENEMIES
      local.tee $40
      i32.store offset=8
      local.get $40
      local.get $4
      i32.const 100
      i32.mul
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store offset=4
      local.get $34
      local.get $39
      local.get $4
      f64.load offset=8
      f64.add
      f64.store
     else
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=448
      local.tee $4
      i32.store offset=4
      local.get $4
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=448
      local.tee $34
      i32.store offset=8
      local.get $34
      local.get $3
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $34
      global.get $~lib/memory/__stack_pointer
      local.get $34
      i32.store offset=4
      local.get $4
      local.get $34
      i32.load offset=8
      i32.const 1
      i32.add
      i32.store offset=8
     end
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|1
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 7
  call $~lib/staticarray/StaticArray<f64>#constructor
  local.tee $34
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 0
  f64.const 1
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 1
  f64.const 1.2
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 2
  f64.const 1.4
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 3
  f64.const 1.6
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 4
  f64.const 1.8
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 5
  f64.const 2.5
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  i32.const 6
  f64.const 3.2
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  call $~lib/staticarray/StaticArray<f64>#constructor
  local.tee $40
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $40
  i32.const 0
  f64.const 1.1
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $40
  i32.const 1
  f64.const 1.3
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $40
  i32.const 2
  f64.const 1.4
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $40
  i32.const 3
  f64.const 2.8
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  i32.const 3
  call $~lib/staticarray/StaticArray<f64>#constructor
  local.tee $42
  i32.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store
  local.get $42
  i32.const 0
  f64.const 0.9
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store
  local.get $42
  i32.const 1
  f64.const 1
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store
  local.get $42
  i32.const 2
  f64.const 1.95
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  i32.const 2
  call $~lib/staticarray/StaticArray<f64>#constructor
  local.tee $4
  i32.store offset=28
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store
  local.get $4
  i32.const 0
  f64.const 1.2
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store
  local.get $4
  i32.const 1
  f64.const 1.6
  call $~lib/staticarray/StaticArray<f64>#__set
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $34
  call $assembly/evalBorge/arrayAverage
  f64.const 3
  f64.mul
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $40
  call $assembly/evalBorge/arrayAverage
  f64.const 3
  f64.mul
  f64.add
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store
  local.get $42
  call $assembly/evalBorge/arrayAverage
  f64.const 3
  f64.mul
  f64.add
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store
  local.get $4
  call $assembly/evalBorge/arrayAverage
  f64.add
  f64.const 10
  f64.div
  local.set $41
  i32.const 1010
  local.set $3
  f64.const 1.75
  local.get $27
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.const 2
  local.get $1
  i32.const 1
  i32.sub
  i32.const 100
  i32.div_s
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  local.set $43
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=260
  f64.convert_i32_s
  f64.const 0.16
  f64.mul
  f64.const 1
  f64.add
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=276
  f64.convert_i32_s
  f64.const 0.05
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  local.get $25
  f64.mul
  f64.const 1.05
  f64.const 1
  local.get $26
  select
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $32
  i32.const 0
  i32.gt_s
  select
  f64.mul
  local.set $44
  f64.const 1
  local.set $25
  i32.const 1
  local.set $1
  loop $for-loop|2
   local.get $1
   local.get $16
   i32.le_s
   if
    local.get $25
    local.get $1
    i32.const 1
    i32.add
    local.tee $1
    f64.convert_i32_s
    f64.const 0.01
    f64.mul
    f64.const 1
    f64.add
    f64.mul
    local.set $25
    br $for-loop|2
   end
  end
  local.get $5
  f64.const 1
  f64.max
  f64.const 1.25
  f64.const 1
  local.get $6
  select
  f64.mul
  local.get $7
  f64.const 1
  f64.max
  f64.mul
  f64.const 1.05
  local.get $8
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.02
  local.get $9
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.05
  local.get $10
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.25
  f64.const 1
  local.get $11
  select
  f64.mul
  f64.const 1.04
  local.get $12
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  local.get $2
  f64.convert_i32_s
  f64.const 0.1
  f64.mul
  f64.const 1
  f64.add
  f64.const -0.1
  f64.add
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.5
  local.get $13
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.1
  local.get $14
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.1
  f64.const 1
  local.get $15
  i32.const 2
  i32.ge_s
  select
  f64.mul
  f64.const 1.2
  f64.const 1
  local.get $15
  i32.const 5
  i32.ge_s
  select
  f64.mul
  local.get $25
  f64.mul
  f64.const 1.2
  f64.const 1
  local.get $17
  i32.const 2
  i32.ge_s
  select
  f64.mul
  f64.const 1.3
  f64.const 1
  local.get $17
  i32.const 5
  i32.ge_s
  select
  f64.mul
  f64.const 1.03
  f64.const 1
  local.get $18
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $19
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.07
  f64.const 1
  local.get $20
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.05
  f64.const 1
  local.get $21
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $22
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.02
  f64.const 1
  local.get $23
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.1
  f64.const 1
  local.get $24
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.02
  local.get $29
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.const 1.08
  local.get $30
  f64.convert_i32_s
  call $~lib/math/NativeMath.pow
  f64.mul
  local.get $31
  f64.convert_i32_s
  f64.const 0.003
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1.1
  f64.const 1
  local.get $28
  i32.const 0
  i32.gt_s
  select
  f64.mul
  f64.const 1.3
  f64.const 1
  local.get $33
  i32.const 0
  i32.gt_s
  select
  f64.mul
  local.set $5
  local.get $41
  f64.const 1.059
  global.get $assembly/evalOzzy/currentOzzyEnem
  f64.convert_i32_s
  f64.const 1e3
  f64.min
  f64.const 10
  f64.div
  f64.floor
  call $~lib/math/NativeMath.pow
  f64.const -1
  f64.add
  f64.const 0.05899999999999994
  f64.div
  f64.const 10
  f64.mul
  global.get $assembly/evalOzzy/currentOzzyEnem
  f64.convert_i32_s
  f64.const 1e3
  f64.min
  global.get $assembly/evalOzzy/currentOzzyEnem
  f64.convert_i32_s
  f64.const 1e3
  f64.min
  f64.const 10
  f64.div
  f64.floor
  f64.const 10
  f64.mul
  f64.sub
  f64.const 1.059
  global.get $assembly/evalOzzy/currentOzzyEnem
  f64.convert_i32_s
  f64.const 1e3
  f64.min
  f64.const 10
  f64.div
  f64.floor
  call $~lib/math/NativeMath.pow
  f64.mul
  f64.add
  f64.mul
  local.get $44
  f64.mul
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=224
  f64.convert_i32_s
  f64.const 0.2
  f64.mul
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=56
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  local.set $7
  f64.const 1
  local.set $25
  global.get $assembly/evalOzzy/currentOzzyEnem
  local.set $1
  loop $while-continue|3
   local.get $1
   local.get $3
   i32.ge_s
   if
    local.get $25
    f64.const 1.059
    f64.const 100
    call $~lib/math/NativeMath.pow
    f64.mul
    local.set $45
    global.get $~lib/memory/__stack_pointer
    local.get $34
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $34
    i32.store offset=4
    local.get $36
    local.get $45
    local.get $34
    local.get $34
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 800
    f64.mul
    local.get $44
    f64.mul
    local.get $5
    f64.mul
    local.tee $46
    f64.add
    local.set $36
    global.get $~lib/memory/__stack_pointer
    local.get $40
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $40
    i32.store offset=4
    local.get $37
    local.get $45
    local.get $40
    local.get $40
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 600
    f64.mul
    local.get $44
    f64.mul
    local.get $5
    f64.mul
    local.tee $25
    f64.add
    local.set $37
    global.get $~lib/memory/__stack_pointer
    local.get $42
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $42
    i32.store offset=4
    local.get $38
    local.get $45
    local.get $42
    local.get $42
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 400
    f64.mul
    local.get $44
    f64.mul
    local.get $5
    f64.mul
    local.tee $39
    f64.add
    local.set $38
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=4
    local.get $35
    local.get $45
    local.get $4
    local.get $4
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 300
    f64.mul
    local.get $44
    f64.mul
    local.get $5
    f64.mul
    local.get $43
    f64.mul
    local.tee $47
    f64.add
    local.set $35
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    f64.load offset=328
    local.get $46
    f64.add
    f64.store offset=328
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    f64.load offset=336
    local.get $25
    f64.add
    f64.store offset=336
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    f64.load offset=344
    local.get $39
    f64.add
    f64.store offset=344
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    f64.load offset=352
    local.get $47
    f64.add
    f64.store offset=352
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    f64.load offset=304
    local.set $25
    global.get $~lib/memory/__stack_pointer
    local.get $34
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $34
    i32.store offset=8
    local.get $0
    local.get $25
    local.get $45
    local.get $34
    local.get $34
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 800
    f64.mul
    local.get $44
    f64.mul
    f64.add
    f64.store offset=304
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    f64.load offset=304
    local.set $25
    global.get $~lib/memory/__stack_pointer
    local.get $40
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $40
    i32.store offset=8
    local.get $0
    local.get $25
    local.get $45
    local.get $40
    local.get $40
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 600
    f64.mul
    local.get $44
    f64.mul
    f64.add
    f64.store offset=304
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    f64.load offset=304
    local.set $25
    global.get $~lib/memory/__stack_pointer
    local.get $42
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $42
    i32.store offset=8
    local.get $0
    local.get $25
    local.get $45
    local.get $42
    local.get $42
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 400
    f64.mul
    local.get $44
    f64.mul
    f64.add
    f64.store offset=304
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    f64.load offset=304
    local.set $25
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=8
    local.get $0
    local.get $25
    local.get $45
    local.get $4
    local.get $4
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 3
    i32.shr_u
    i32.const 1
    i32.sub
    call $~lib/staticarray/StaticArray<f64>#__get
    f64.mul
    f64.const 300
    f64.mul
    local.get $44
    f64.mul
    f64.add
    f64.store offset=304
    local.get $1
    local.get $3
    i32.sub
    local.set $1
    i32.const 1000
    local.set $3
    local.get $1
    f64.convert_i32_s
    f64.const 990
    f64.min
    local.tee $39
    f64.const 10
    f64.div
    f64.floor
    local.set $46
    local.get $45
    f64.const 5
    f64.mul
    local.tee $25
    local.get $41
    f64.mul
    f64.const 1.059
    f64.mul
    f64.const 1.059
    local.get $39
    f64.const 10
    f64.div
    f64.floor
    call $~lib/math/NativeMath.pow
    f64.const -1
    f64.add
    f64.const 0.05899999999999994
    f64.div
    f64.const 10
    f64.mul
    local.get $39
    local.get $46
    f64.const 10
    f64.mul
    f64.sub
    f64.const 1.059
    local.get $46
    call $~lib/math/NativeMath.pow
    f64.mul
    f64.add
    f64.mul
    local.get $44
    f64.mul
    local.set $39
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load offset=224
    f64.convert_i32_s
    f64.const 0.2
    f64.mul
    local.set $45
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $7
    local.get $39
    local.get $45
    local.get $0
    f64.load offset=56
    f64.mul
    f64.const 1
    f64.add
    f64.mul
    f64.add
    local.set $7
    br $while-continue|3
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store
  local.get $7
  f64.const 3
  f64.mul
  f64.const 10
  f64.div
  local.tee $25
  local.get $34
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  local.get $36
  f64.add
  local.set $36
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store
  local.get $25
  local.get $40
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  local.get $37
  f64.add
  local.set $37
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store
  local.get $25
  local.get $42
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  local.get $38
  f64.add
  local.set $38
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store
  local.get $7
  f64.const 10
  f64.div
  local.tee $39
  local.get $4
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  local.get $43
  f64.mul
  local.get $35
  f64.add
  local.set $35
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  f64.load offset=328
  local.set $44
  global.get $~lib/memory/__stack_pointer
  local.get $34
  i32.store offset=4
  local.get $0
  local.get $44
  local.get $25
  local.get $34
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  f64.add
  f64.store offset=328
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  f64.load offset=336
  local.set $44
  global.get $~lib/memory/__stack_pointer
  local.get $40
  i32.store offset=4
  local.get $0
  local.get $44
  local.get $25
  local.get $40
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  f64.add
  f64.store offset=336
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  f64.load offset=344
  local.set $44
  global.get $~lib/memory/__stack_pointer
  local.get $42
  i32.store offset=4
  local.get $0
  local.get $44
  local.get $25
  local.get $42
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  f64.add
  f64.store offset=344
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  f64.load offset=352
  local.set $25
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $0
  local.get $25
  local.get $39
  local.get $4
  call $assembly/evalBorge/arrayAverage
  f64.mul
  local.get $41
  f64.div
  local.get $5
  f64.mul
  local.get $43
  f64.mul
  f64.add
  f64.store offset=352
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $36
  local.get $0
  f64.load offset=360
  f64.min
  f64.store offset=360
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $36
  local.get $0
  f64.load offset=368
  f64.max
  f64.store offset=368
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $37
  local.get $0
  f64.load offset=376
  f64.min
  f64.store offset=376
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $37
  local.get $0
  f64.load offset=384
  f64.max
  f64.store offset=384
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $38
  local.get $0
  f64.load offset=392
  f64.min
  f64.store offset=392
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $38
  local.get $0
  f64.load offset=400
  f64.max
  f64.store offset=400
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $35
  local.get $0
  f64.load offset=408
  f64.min
  f64.store offset=408
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $35
  local.get $0
  f64.load offset=416
  f64.max
  f64.store offset=416
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=304
  local.get $7
  f64.add
  f64.store offset=304
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  f64.load offset=160
  global.get $assembly/evalOzzy/currentOzzyTime
  f64.add
  f64.store offset=160
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  global.get $assembly/evalOzzy/currentOzzyEnem
  local.get $0
  i32.load offset=312
  i32.add
  i32.store offset=312
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  f64.load offset=304
  local.set $5
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $5
  local.get $0
  f64.load offset=160
  f64.div
  f64.store offset=424
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  i32.load offset=316
  i32.const 1
  i32.add
  i32.store offset=316
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  global.get $assembly/evalOzzy/currentOzzyEnem
  f64.convert_i32_s
  local.tee $5
  local.get $0
  i32.load offset=320
  f64.convert_i32_s
  f64.min
  i32.trunc_sat_f64_s
  i32.store offset=320
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $0
  i32.load offset=324
  f64.convert_i32_s
  local.get $5
  f64.max
  i32.trunc_sat_f64_s
  i32.store offset=324
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=452
  local.tee $1
  i32.store
  local.get $1
  global.get $assembly/evalOzzy/currentOzzyEnem
  i32.const 10
  i32.div_s
  local.tee $1
  call $"~lib/map/Map<i32,i32>#has"
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=452
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=452
   local.tee $0
   i32.store offset=4
   local.get $2
   local.get $1
   local.get $0
   local.get $1
   call $"~lib/map/Map<i32,i32>#get"
   i32.const 1
   i32.add
   call $"~lib/map/Map<i32,i32>#set"
  else
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=452
   local.tee $0
   i32.store
   local.get $0
   local.get $1
   i32.const 1
   call $"~lib/map/Map<i32,i32>#set"
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/EVALOZZY_WASM (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 i32) (param $8 i32) (param $9 i32) (param $10 i32) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 i32) (param $26 i32) (param $27 i32) (param $28 i32) (param $29 i32) (param $30 i32) (param $31 i32) (param $32 i32) (param $33 i32) (param $34 i32) (param $35 i32) (param $36 i32) (param $37 f64) (param $38 f64) (param $39 i32) (param $40 i32) (param $41 i32) (param $42 i32) (param $43 i32) (param $44 i32) (param $45 i32) (param $46 i32) (param $47 i32) (param $48 i32) (param $49 i32) (param $50 i32) (param $51 i32) (param $52 i32) (param $53 i32) (param $54 i32) (param $55 i32) (param $56 i32) (param $57 i32) (param $58 i32) (param $59 i32) (param $60 i32) (param $61 i32) (param $62 i32) (param $63 i32) (param $64 i32) (param $65 i32) (param $66 i32) (param $67 i32) (param $68 i32) (param $69 i32) (param $70 i32) (param $71 i32) (param $72 i32) (param $73 i32) (param $74 i32) (param $75 i32) (param $76 i32) (param $77 i32) (param $78 i32) (param $79 i32) (param $80 i32) (param $81 i32) (param $82 i32) (param $83 i32) (param $84 i32) (param $85 i32) (param $86 i32) (param $87 i32) (result f64)
  (local $88 i32)
  (local $89 i32)
  (local $90 f64)
  (local $91 f64)
  (local $92 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   loop $for-loop|0
    local.get $88
    i32.const 1000
    i32.le_s
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/OZZY_ENEMIES
     local.tee $77
     i32.store
     local.get $88
     call $assembly/evalOzzy/OzzyEnemy#constructor
     local.set $89
     global.get $~lib/memory/__stack_pointer
     local.get $89
     i32.store offset=4
     local.get $77
     local.get $88
     local.get $89
     call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
     local.get $88
     i32.const 1
     i32.add
     local.set $88
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   i32.const 0
   local.set $88
   loop $for-loop|00
    local.get $88
    i32.const 11
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/bossKillsByRevive
     local.tee $77
     i32.store
     local.get $77
     local.get $88
     i32.const 0
     call $~lib/staticarray/StaticArray<i32>#__set
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalOzzy/bossAttemptsByRevive
     local.tee $77
     i32.store
     local.get $77
     local.get $88
     i32.const 0
     call $~lib/staticarray/StaticArray<i32>#__set
     local.get $88
     i32.const 1
     i32.add
     local.set $88
     br $for-loop|00
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 1.001
   local.get $35
   f64.convert_i32_s
   local.tee $90
   call $~lib/math/NativeMath.pow
   f64.const 1.02
   local.get $35
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   local.tee $91
   call $~lib/math/NativeMath.pow
   f64.mul
   local.set $92
   f64.const 1.005
   local.get $90
   call $~lib/math/NativeMath.pow
   f64.const 1.02
   local.get $91
   call $~lib/math/NativeMath.pow
   f64.mul
   local.set $90
   global.get $~lib/memory/__stack_pointer
   call $assembly/evalOzzy/Ozzy#constructor
   local.tee $35
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $2
   i32.const 5
   i32.div_s
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.const 2
   f64.add
   local.get $2
   f64.convert_i32_s
   f64.mul
   f64.const 16
   f64.add
   local.get $92
   f64.mul
   local.get $42
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $60
   select
   f64.mul
   local.get $72
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
   local.tee $91
   f64.mul
   f64.const 1.0777
   f64.const 1
   local.get $74
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $81
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.get $84
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $85
    f64.convert_i32_s
    f64.const 100
    f64.min
    f64.const 0.01
    f64.mul
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   local.get $86
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 69
    i32.sub
    f64.convert_i32_s
    f64.const 0.015
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $3
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0.3
   f64.add
   local.get $3
   f64.convert_i32_s
   f64.mul
   f64.const 2
   f64.add
   local.get $92
   f64.mul
   local.get $44
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $55
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $60
   select
   f64.mul
   local.get $91
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $81
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.get $86
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 69
    i32.sub
    f64.convert_i32_s
    f64.const 0.01
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $4
   i32.const 30
   i32.div_s
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0.05
   f64.add
   local.get $4
   f64.convert_i32_s
   f64.mul
   f64.const 0.1
   f64.add
   local.get $92
   f64.mul
   f64.const 1.25
   f64.const 1
   local.get $54
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $60
   select
   f64.mul
   local.get $91
   f64.mul
   f64.const 1.0777
   f64.const 1
   local.get $74
   select
   f64.mul
   local.get $86
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 69
    i32.sub
    f64.convert_i32_s
    f64.const 0.005
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $5
   f64.convert_i32_s
   f64.const 0.0035
   f64.mul
   local.get $49
   f64.convert_i32_s
   f64.const 0.0111
   f64.mul
   f64.add
   local.get $52
   f64.convert_i32_s
   f64.const 0.002
   f64.mul
   f64.add
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $6
   f64.convert_i32_s
   f64.const 0.0062
   f64.mul
   f64.const 0.05
   f64.add
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $7
   f64.convert_i32_s
   f64.const 0.0035
   f64.mul
   f64.const 0.04
   f64.add
   local.get $45
   f64.convert_i32_s
   f64.const 0.006
   f64.mul
   f64.add
   local.get $53
   f64.convert_i32_s
   f64.const 0.002
   f64.mul
   f64.add
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $8
   f64.convert_i32_s
   f64.const 0.0038
   f64.mul
   f64.const 0.05
   f64.add
   f64.const 0.03
   f64.const 0
   local.get $55
   select
   f64.add
   local.get $50
   f64.convert_i32_s
   f64.const 0.005
   f64.mul
   f64.add
   f64.store offset=64
   local.get $87
   i32.const 0
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $35
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $35
    i32.store offset=8
    local.get $35
    local.get $35
    f64.load offset=64
    f64.const 0.02
    f64.add
    f64.store offset=64
   end
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $9
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0.25
   f64.add
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   f64.const 4
   local.get $10
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.sub
   local.get $48
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.sub
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $2
   i32.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $3
   i32.store offset=172
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $4
   i32.store offset=176
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $5
   i32.store offset=180
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $6
   i32.store offset=184
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $7
   i32.store offset=188
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $8
   i32.store offset=192
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $9
   i32.store offset=196
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $10
   i32.store offset=200
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $11
   i32.store offset=204
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $12
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $13
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $14
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $15
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $16
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $17
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $19
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $18
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $20
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $21
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $22
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $23
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $24
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $25
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $26
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $27
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $28
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $29
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $30
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $31
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $32
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $33
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   local.get $34
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=8
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   i32.load offset=240
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.const 1
   f64.add
   local.set $92
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $92
   local.get $35
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.mul
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=32
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   i32.load offset=240
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.const 1
   f64.add
   local.set $92
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $92
   local.get $35
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.mul
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=24
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   i32.load offset=244
   f64.convert_i32_s
   f64.const 0.012
   f64.mul
   f64.const 1
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   i32.load offset=256
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   local.set $92
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $92
   local.get $35
   i32.load offset=236
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.mul
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=80
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $35
   i32.load offset=216
   f64.convert_i32_s
   f64.const 0.06
   f64.mul
   f64.sub
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $35
   f64.load offset=80
   local.get $79
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $80
    f64.convert_i32_s
    f64.const 3
    f64.div
    f64.floor
    f64.const 0.01
    f64.mul
    f64.const 0.25
    f64.min
   else
    f64.const 0
   end
   f64.sub
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=40
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $35
   i32.load offset=264
   f64.convert_i32_s
   f64.const 0.026
   f64.mul
   f64.add
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=56
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $35
   i32.load offset=268
   f64.convert_i32_s
   f64.const 0.028
   f64.mul
   f64.add
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=48
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   local.get $35
   i32.load offset=264
   f64.convert_i32_s
   f64.const 0.005
   f64.mul
   f64.add
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $35
   i32.load offset=248
   f64.convert_i32_s
   f64.const 0.033
   f64.mul
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   f64.load offset=80
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $91
   f64.const 1
   local.get $35
   i32.load offset=256
   f64.convert_i32_s
   f64.const 0.004
   f64.mul
   f64.sub
   f64.mul
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=8
   local.get $35
   local.get $35
   f64.load offset=8
   f64.store offset=16
   i32.const 0
   local.set $0
   loop $for-loop|01
    local.get $0
    local.get $64
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $35
     i32.store offset=4
     local.get $35
     local.get $1
     local.get $57
     local.get $58
     local.get $39
     local.get $37
     local.get $36
     i32.const 0
     i32.gt_s
     local.get $38
     local.get $40
     local.get $41
     local.get $43
     local.get $56
     i32.const 0
     i32.gt_s
     local.get $59
     local.get $46
     local.get $51
     local.get $61
     local.get $62
     local.get $63
     local.get $65
     local.get $66
     local.get $67
     local.get $68
     local.get $69
     local.get $70
     local.get $71
     local.get $90
     local.get $60
     i32.const 0
     i32.gt_s
     local.get $47
     local.get $73
     local.get $75
     local.get $76
     local.get $78
     local.get $81
     local.get $82
     local.get $83
     call $assembly/evalOzzy/ozzySim
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|01
    end
   end
   local.get $35
   global.set $assembly/evalOzzy/lastOzzy
   global.get $~lib/memory/__stack_pointer
   local.get $35
   i32.store offset=4
   local.get $35
   f64.load offset=424
   f64.const 60
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalOzzy/getLastOzzyAvgStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=312
  f64.convert_i32_s
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyAvgTime (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=160
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  f64.const 60
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMinStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=320
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMaxStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=324
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyBossHpPercent (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=316
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/lastOzzy
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=448
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/lastOzzy
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=316
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/lastOzzy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=324
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/OZZY_ENEMIES
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 100
   i32.mul
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/lastOzzy
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=448
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/lastOzzy
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=316
   f64.convert_i32_s
   f64.div
   local.get $5
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalOzzy/getLastOzzyBossKillRate (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=316
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/lastOzzy
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=448
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/lastOzzy
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=316
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/lastOzzy
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=324
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/lastOzzy
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=448
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=8
   f64.convert_i32_s
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalOzzy/lastOzzy
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=316
   f64.convert_i32_s
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalOzzy/getLastOzzyMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=328
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=336
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=344
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=352
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=316
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMinOzzyMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=360
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMaxOzzyMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=368
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMinOzzyMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=376
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMaxOzzyMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=384
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMinOzzyMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=392
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMaxOzzyMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=400
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMinOzzyXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=408
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastMaxOzzyXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=416
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMaxHp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyAtk (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=24
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyRegen (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=32
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyDr (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=40
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyEvade (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=48
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyEffect (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=56
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMultistrike (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=64
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyMultistrikePower (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=72
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getLastOzzyReload (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=80
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyProgressSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=452
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyProgressStageAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=452
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=452
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyProgressCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=452
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=452
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=452
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyDeathsByStageAndReviveSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=456
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyDeathKeyAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=456
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=456
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyDeathCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=456
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=456
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=456
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalOzzy/getOzzyDeathsByStageAndReviveString (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 36
  memory.fill
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=456
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 36
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8032
   return
  end
  i32.const 8064
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8064
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalOzzy/lastOzzy
  local.tee $2
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.load offset=456
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $2
  i32.store offset=12
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/array/Array<i32>#get:length
   local.get $1
   i32.gt_s
   if
    local.get $1
    i32.const 0
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     i32.const 8144
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.const 8144
     call $~lib/string/String.__concat
     local.tee $0
     i32.store offset=8
    end
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    local.get $2
    local.get $1
    call $~lib/array/Array<i32>#__get
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/lastOzzy
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=456
    local.tee $3
    i32.store
    local.get $3
    local.get $4
    call $"~lib/map/Map<i32,i32>#get"
    local.set $5
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.div_s
    call $~lib/number/I32#toString
    local.tee $3
    i32.store offset=16
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.rem_s
    call $~lib/number/I32#toString
    local.tee $4
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $5
    call $~lib/number/I32#toString
    local.tee $5
    i32.store offset=24
    global.get $~lib/memory/__stack_pointer
    i32.const 11440
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=32
    i32.const 11444
    local.get $3
    i32.store
    i32.const 11440
    local.get $3
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11440
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=32
    i32.const 11452
    local.get $4
    i32.store
    i32.const 11440
    local.get $4
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11440
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=32
    i32.const 11460
    local.get $5
    i32.store
    i32.const 11440
    local.get $5
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11440
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    i32.const 8176
    i32.store offset=32
    i32.const 11440
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    local.get $0
    local.get $3
    call $~lib/string/String.__concat
    local.tee $0
    i32.store offset=8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 10096
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 10096
  call $~lib/string/String.__concat
  local.tee $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/evalOzzy/getOzzyBossKillsByReviveSize (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $0
   i32.const 11
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossAttemptsByRevive
    local.tee $2
    i32.store
    local.get $1
    i32.const 1
    i32.add
    local.get $1
    local.get $2
    local.get $0
    call $~lib/staticarray/StaticArray<i32>#__get
    i32.const 0
    i32.gt_s
    select
    local.set $1
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/evalOzzy/getOzzyBossRemainingReviveAt (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $2
   i32.const 11
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossAttemptsByRevive
    local.tee $3
    i32.store
    local.get $3
    local.get $2
    call $~lib/staticarray/StaticArray<i32>#__get
    i32.const 0
    i32.gt_s
    if
     local.get $0
     local.get $1
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
      local.get $2
      return
     end
     local.get $1
     i32.const 1
     i32.add
     local.set $1
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const -1
 )
 (func $assembly/evalOzzy/getOzzyBossKillCountAt (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $2
   i32.const 11
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossAttemptsByRevive
    local.tee $3
    i32.store
    local.get $3
    local.get $2
    call $~lib/staticarray/StaticArray<i32>#__get
    i32.const 0
    i32.gt_s
    if
     local.get $0
     local.get $1
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/bossKillsByRevive
      local.tee $0
      i32.store
      local.get $0
      local.get $2
      call $~lib/staticarray/StaticArray<i32>#__get
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
      return
     end
     local.get $1
     i32.const 1
     i32.add
     local.set $1
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $assembly/evalOzzy/getOzzyBossAttemptCountAt (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $2
   i32.const 11
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalOzzy/bossAttemptsByRevive
    local.tee $3
    i32.store
    local.get $3
    local.get $2
    call $~lib/staticarray/StaticArray<i32>#__get
    i32.const 0
    i32.gt_s
    if
     local.get $0
     local.get $1
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalOzzy/bossAttemptsByRevive
      local.tee $0
      i32.store
      local.get $0
      local.get $2
      call $~lib/staticarray/StaticArray<i32>#__get
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
      return
     end
     local.get $1
     i32.const 1
     i32.add
     local.set $1
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $assembly/evalKnox/knoxSoulmult (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=136
  f64.const 0.005
  f64.mul
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=284
  f64.convert_i32_s
  f64.const 0.01
  f64.mul
  f64.const 1
  f64.add
  f64.mul
  f64.const 1
  f64.add
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/knoxKillEnemy (param $0 f64)
  (local $1 i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 1
  i32.add
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 10
  i32.add
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  select
  global.set $assembly/evalKnox/currentKnoxEnem
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 1000
  i32.eq
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=24
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $3
   local.get $2
   f64.load offset=152
   f64.mul
   f64.store offset=104
  end
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 10
  i32.rem_s
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/KNOX_ENEMIES
   local.tee $1
   i32.store
   local.get $1
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 10
   i32.div_s
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   global.set $assembly/evalKnox/currentKnoxEnemy
  end
  global.get $assembly/evalKnox/leftoverTorpedos
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=104
   f64.const 30
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   i32.load offset=308
   f64.convert_i32_s
   f64.const 0.08
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $3
   local.get $4
   local.get $2
   i32.load offset=304
   f64.convert_i32_s
   f64.const 0.2
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.sub
   f64.store offset=8
   global.get $assembly/evalKnox/leftoverTorpedos
   i32.const 1
   i32.sub
   global.set $assembly/evalKnox/leftoverTorpedos
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $2
   f64.load
   f64.store offset=8
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $1
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=80
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 1000
  i32.lt_s
  global.get $assembly/evalKnox/currentKnoxAttr
  i32.const 0
  i32.gt_s
  i32.and
  if (result f64)
   f64.const 1.08
   global.get $assembly/evalKnox/currentKnoxCatchup99gu
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   global.get $assembly/evalKnox/currentKnoxAttr
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 1
   f64.add
   f64.const -0.1
   f64.add
   call $~lib/math/NativeMath.pow
  else
   f64.const 1
  end
  local.set $3
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  i32.load offset=252
  if (result i32)
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 10
   i32.rem_s
  else
   i32.const 1
  end
  if (result i32)
   i32.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=64
   f64.const 2.5
   f64.mul
   local.tee $4
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalKnox/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalKnox/seed
    local.get $4
    global.get $assembly/evalKnox/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=144
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=136
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $5
   local.get $2
   i32.load offset=252
   f64.convert_i32_s
   f64.add
   f64.min
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   call $assembly/evalKnox/knoxSoulmult
   f64.store offset=152
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=8
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $2
   f64.load offset=152
   f64.mul
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=24
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $2
   f64.load offset=152
   f64.mul
   local.get $3
   f64.mul
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=40
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $2
   f64.load offset=152
   f64.mul
   f64.store offset=112
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=136
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=144
  f64.lt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=160
   local.tee $4
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalKnox/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalKnox/seed
    local.get $4
    global.get $assembly/evalKnox/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $2
   f64.load offset=136
   f64.const 1
   f64.add
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   call $assembly/evalKnox/knoxSoulmult
   f64.store offset=152
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=8
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $2
   f64.load offset=152
   f64.mul
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=24
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $4
   local.get $2
   f64.load offset=152
   f64.mul
   local.get $3
   f64.mul
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=40
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $3
   local.get $2
   f64.load offset=152
   f64.mul
   f64.store offset=112
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  i32.load offset=256
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=64
   local.tee $3
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalKnox/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalKnox/seed
    local.get $3
    global.get $assembly/evalKnox/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=96
   local.set $3
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=16
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=96
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $1
   local.get $3
   local.get $4
   local.get $5
   local.get $2
   i32.load offset=256
   f64.convert_i32_s
   f64.mul
   f64.const 0.02
   f64.mul
   f64.add
   f64.min
   f64.store offset=16
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  i32.load offset=320
  if (result i32)
   i32.const 1
  else
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 0
   i32.gt_s
   local.tee $1
   if (result i32)
    global.get $assembly/evalKnox/currentKnoxEnem
    i32.const 1000
    i32.rem_s
    i32.eqz
   else
    local.get $1
   end
  end
  if (result i32)
   i32.const 1
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=72
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   f64.const 1
   local.get $1
   i32.load offset=272
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.sub
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   f64.const 1
   local.get $1
   f64.load offset=48
   f64.sub
   f64.mul
   f64.const 1
   global.get $assembly/evalKnox/currentKnoxCreaGem4
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.sub
   f64.mul
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=112
   f64.gt
  end
  if (result f64)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $assembly/evalKnox/currentKnoxTime
   local.get $1
   f64.load offset=64
   f64.add
   local.get $0
   f64.add
  else
   f64.const 9999999
  end
  global.set $assembly/evalKnox/nextKnoxEnemAtk
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=8
  f64.const 0
  f64.le
  if
   f64.const 0
   call $assembly/evalKnox/knoxKillEnemy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/knoxAtk (param $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  local.get $2
  i32.const 0
  i32.store8 offset=205
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $3
  i32.store offset=4
  local.get $3
  f64.load offset=8
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $3
  i32.store offset=4
  local.get $2
  local.get $1
  local.get $3
  f64.load offset=48
  f64.const 0
  f64.gt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=48
   local.tee $1
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalKnox/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalKnox/seed
    local.get $1
    global.get $assembly/evalKnox/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if (result f64)
   f64.const 0
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=104
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=40
   f64.mul
  end
  f64.sub
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=8
  f64.const 0
  f64.le
  if
   f64.const 0
   call $assembly/evalKnox/knoxKillEnemy
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $3
  i32.store offset=4
  local.get $2
  local.get $3
  i32.load offset=260
  f64.convert_i32_s
  f64.const 0.0667
  f64.mul
  local.tee $1
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalKnox/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalKnox/seed
   local.get $1
   global.get $assembly/evalKnox/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  i32.store8 offset=204
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=32
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  f64.const 1
  f64.const 0
  local.get $2
  i32.load8_u offset=204
  select
  f64.add
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  f64.const 3
  f64.const 0
  local.get $2
  i32.load offset=312
  f64.convert_i32_s
  f64.const 0.02
  f64.mul
  local.tee $1
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalKnox/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalKnox/seed
   local.get $1
   global.get $assembly/evalKnox/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  select
  f64.add
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  local.get $2
  f64.load offset=72
  local.tee $4
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalKnox/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalKnox/seed
   local.get $4
   global.get $assembly/evalKnox/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=176
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $2
   local.get $4
   local.get $3
   f64.load offset=80
   f64.add
   f64.store offset=176
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=184
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $2
   local.get $4
   local.get $3
   f64.load offset=80
   f64.add
   f64.store offset=184
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $3
   f64.load offset=192
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $2
   local.get $4
   local.get $3
   f64.load offset=80
   f64.add
   f64.store offset=192
  end
  global.get $assembly/evalKnox/nextKnoxEnemAtk
  global.get $assembly/evalKnox/nextKnoxRegen
  f64.min
  local.set $4
  i32.const 1
  local.set $2
  loop $for-loop|0
   local.get $2
   f64.convert_i32_s
   local.tee $5
   local.get $1
   f64.lt
   if
    global.get $assembly/evalKnox/currentKnoxTime
    local.get $5
    f64.const 0.1
    f64.mul
    f64.add
    local.get $4
    f64.lt
    if
     i32.const 0
     local.set $3
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnox
     local.tee $6
     i32.store
     local.get $6
     i32.load offset=276
     if (result i32)
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnox
      local.tee $6
      i32.store
      local.get $6
      i32.load8_u offset=205
     else
      i32.const 1
     end
     i32.eqz
     if
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnox
      local.tee $3
      i32.store
      local.get $3
      i32.load8_u offset=204
      if (result i32)
       local.get $2
       f64.convert_i32_s
       local.tee $5
       local.get $1
       f64.const -1
       f64.add
       f64.eq
       local.get $5
       local.get $1
       f64.const -2
       f64.add
       f64.eq
       i32.or
       if (result i32)
        global.get $~lib/memory/__stack_pointer
        global.get $assembly/evalKnox/currentKnox
        local.tee $3
        i32.store
        local.get $3
        f64.load offset=64
        f64.const 2
        f64.mul
        local.tee $5
        f64.const 0
        f64.gt
        if (result i32)
         global.get $assembly/evalKnox/seed
         i64.extend_i32_u
         i64.const 1664525
         i64.mul
         i64.const 1013904223
         i64.add
         i64.const 4294967295
         i64.and
         i32.wrap_i64
         global.set $assembly/evalKnox/seed
         local.get $5
         global.get $assembly/evalKnox/seed
         f64.convert_i32_u
         f64.const 2.3283064365386963e-10
         f64.mul
         f64.gt
        else
         i32.const 0
        end
       else
        i32.const 0
       end
      else
       local.get $2
       f64.convert_i32_s
       local.get $1
       f64.const -1
       f64.add
       f64.eq
       if (result i32)
        global.get $~lib/memory/__stack_pointer
        global.get $assembly/evalKnox/currentKnox
        local.tee $3
        i32.store
        local.get $3
        f64.load offset=64
        f64.const 2
        f64.mul
        local.tee $5
        f64.const 0
        f64.gt
        if (result i32)
         global.get $assembly/evalKnox/seed
         i64.extend_i32_u
         i64.const 1664525
         i64.mul
         i64.const 1013904223
         i64.add
         i64.const 4294967295
         i64.and
         i32.wrap_i64
         global.set $assembly/evalKnox/seed
         local.get $5
         global.get $assembly/evalKnox/seed
         f64.convert_i32_u
         f64.const 2.3283064365386963e-10
         f64.mul
         f64.gt
        else
         i32.const 0
        end
       else
        i32.const 0
       end
      end
      local.tee $3
      if
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $6
       i32.store
       local.get $6
       i32.const 1
       i32.store8 offset=205
      end
     end
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnoxEnemy
     local.tee $6
     i32.store
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnoxEnemy
     local.tee $7
     i32.store offset=4
     local.get $7
     f64.load offset=8
     local.set $5
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnoxEnemy
     local.tee $7
     i32.store offset=4
     local.get $6
     local.get $5
     local.get $7
     f64.load offset=48
     f64.const 0
     f64.gt
     if (result i32)
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $6
      i32.store offset=4
      local.get $6
      f64.load offset=48
      local.tee $5
      f64.const 0
      f64.gt
      if (result i32)
       global.get $assembly/evalKnox/seed
       i64.extend_i32_u
       i64.const 1664525
       i64.mul
       i64.const 1013904223
       i64.add
       i64.const 4294967295
       i64.and
       i32.wrap_i64
       global.set $assembly/evalKnox/seed
       local.get $5
       global.get $assembly/evalKnox/seed
       f64.convert_i32_u
       f64.const 2.3283064365386963e-10
       f64.mul
       f64.gt
      else
       i32.const 0
      end
     else
      i32.const 0
     end
     if (result f64)
      f64.const 0
     else
      local.get $3
      if (result f64)
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $3
       i32.store offset=4
       local.get $3
       f64.load offset=104
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $3
       i32.store offset=4
       local.get $3
       i32.load offset=276
       f64.convert_i32_s
       f64.const 0.2
       f64.mul
       f64.const 1
       f64.add
       f64.mul
      else
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $3
       i32.store offset=4
       local.get $3
       f64.load offset=104
      end
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $3
      i32.store offset=4
      local.get $3
      f64.load offset=40
      f64.mul
     end
     f64.sub
     f64.store offset=8
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnoxEnemy
     local.tee $3
     i32.store
     local.get $3
     f64.load offset=8
     f64.const 0
     f64.le
     if
      local.get $2
      f64.convert_i32_s
      f64.const 0.1
      f64.mul
      call $assembly/evalKnox/knoxKillEnemy
     end
    else
     global.get $assembly/evalKnox/currentKnoxTime
     local.get $2
     f64.convert_i32_s
     local.tee $5
     f64.const 0.1
     f64.mul
     f64.add
     global.set $assembly/evalKnox/nextKnoxBullet
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnox
     local.tee $2
     i32.store
     local.get $2
     local.get $1
     local.get $5
     f64.sub
     i32.trunc_sat_f64_s
     i32.store offset=124
     local.get $1
     i32.trunc_sat_f64_s
     local.set $2
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $0
  i32.eqz
  if
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 1000
   i32.lt_s
   global.get $assembly/evalKnox/currentKnoxAttr
   i32.const 0
   i32.gt_s
   i32.and
   if (result f64)
    f64.const 1.08
    global.get $assembly/evalKnox/currentKnoxCatchup99gu
    f64.convert_i32_s
    call $~lib/math/NativeMath.pow
    global.get $assembly/evalKnox/currentKnoxAttr
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.const 1
    f64.add
    f64.const -0.1
    f64.add
    call $~lib/math/NativeMath.pow
   else
    f64.const 1
   end
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   global.get $assembly/evalKnox/currentKnoxTime
   local.get $0
   f64.load offset=88
   local.get $4
   f64.div
   f64.add
   global.set $assembly/evalKnox/nextKnoxAtk
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=308
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    f64.load offset=176
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    i32.load offset=308
    f64.convert_i32_s
    f64.const 0.02
    f64.mul
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $0
    local.get $4
    local.get $5
    local.get $2
    f64.load offset=88
    f64.mul
    f64.add
    f64.store offset=176
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    f64.load offset=184
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    i32.load offset=308
    f64.convert_i32_s
    f64.const 0.02
    f64.mul
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $0
    local.get $4
    local.get $5
    local.get $2
    f64.load offset=88
    f64.mul
    f64.add
    f64.store offset=184
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    f64.load offset=192
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $2
    i32.load offset=308
    f64.convert_i32_s
    f64.const 0.02
    f64.mul
    local.set $5
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $0
    local.get $4
    local.get $5
    local.get $2
    f64.load offset=88
    f64.mul
    f64.add
    f64.store offset=192
   end
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=176
  f64.const 10
  f64.gt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=124
  else
   i32.const 1
  end
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $2
   f64.load offset=176
   f64.const -10
   f64.add
   f64.store offset=176
   global.get $assembly/evalKnox/currentKnoxTime
   local.get $1
   f64.const 0.1
   f64.mul
   f64.add
   global.set $assembly/evalKnox/currentKnoxTime
   i32.const 1
   call $assembly/evalKnox/knoxAtk
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=184
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=168
  f64.ge
  if
   global.get $assembly/evalKnox/currentKnoxTime
   f64.const 1.5
   f64.add
   global.set $assembly/evalKnox/nextKnoxTorpedo
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=184
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store offset=4
   local.get $0
   local.get $1
   local.get $2
   f64.load offset=168
   f64.sub
   f64.store offset=184
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/knoxBullet
  (local $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $3
  i32.store offset=4
  local.get $2
  local.get $3
  i32.load offset=124
  i32.const 1
  i32.sub
  i32.store offset=124
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $2
  i32.store
  local.get $2
  i32.load offset=276
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $2
   i32.store
   local.get $2
   i32.load8_u offset=205
  else
   i32.const 1
  end
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   local.get $0
   i32.load8_u offset=204
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=124
    i32.const 1
    i32.eq
    if (result i32)
     i32.const 0
    else
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnox
     local.tee $0
     i32.store
     local.get $0
     i32.load offset=124
    end
    if (result i32)
     i32.const 0
    else
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnox
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=64
     f64.const 2
     f64.mul
     local.tee $1
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalKnox/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalKnox/seed
      local.get $1
      global.get $assembly/evalKnox/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    end
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=124
    if (result i32)
     i32.const 0
    else
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/currentKnox
     local.tee $0
     i32.store
     local.get $0
     f64.load offset=64
     f64.const 2
     f64.mul
     local.tee $1
     f64.const 0
     f64.gt
     if (result i32)
      global.get $assembly/evalKnox/seed
      i64.extend_i32_u
      i64.const 1664525
      i64.mul
      i64.const 1013904223
      i64.add
      i64.const 4294967295
      i64.and
      i32.wrap_i64
      global.set $assembly/evalKnox/seed
      local.get $1
      global.get $assembly/evalKnox/seed
      f64.convert_i32_u
      f64.const 2.3283064365386963e-10
      f64.mul
      f64.gt
     else
      i32.const 0
     end
    end
   end
   local.tee $0
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store
    local.get $2
    i32.const 1
    i32.store8 offset=205
   end
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $3
  i32.store offset=4
  local.get $3
  f64.load offset=8
  local.set $1
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $3
  i32.store offset=4
  local.get $2
  local.get $1
  local.get $3
  f64.load offset=48
  f64.const 0
  f64.gt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $2
   f64.load offset=48
   local.tee $1
   f64.const 0
   f64.gt
   if (result i32)
    global.get $assembly/evalKnox/seed
    i64.extend_i32_u
    i64.const 1664525
    i64.mul
    i64.const 1013904223
    i64.add
    i64.const 4294967295
    i64.and
    i32.wrap_i64
    global.set $assembly/evalKnox/seed
    local.get $1
    global.get $assembly/evalKnox/seed
    f64.convert_i32_u
    f64.const 2.3283064365386963e-10
    f64.mul
    f64.gt
   else
    i32.const 0
   end
  else
   i32.const 0
  end
  if (result f64)
   f64.const 0
  else
   local.get $0
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store offset=4
    local.get $0
    f64.load offset=104
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store offset=4
    local.get $0
    i32.load offset=276
    f64.convert_i32_s
    f64.const 0.2
    f64.mul
    f64.const 1
    f64.add
    f64.mul
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store offset=4
    local.get $0
    f64.load offset=104
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $0
   i32.store offset=4
   local.get $0
   f64.load offset=40
   f64.mul
  end
  f64.sub
  f64.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  f64.const 0
  f64.le
  if
   f64.const 0
   call $assembly/evalKnox/knoxKillEnemy
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=124
  if
   global.get $assembly/evalKnox/currentKnoxTime
   f64.const 0.1
   f64.add
   global.set $assembly/evalKnox/nextKnoxBullet
  else
   f64.const 999999999
   global.set $assembly/evalKnox/nextKnoxBullet
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $0
   i32.store
   local.get $0
   f64.load offset=176
   f64.const 10
   f64.gt
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=124
   else
    i32.const 1
   end
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $2
    i32.store offset=4
    local.get $0
    local.get $2
    f64.load offset=176
    f64.const -10
    f64.add
    f64.store offset=176
    global.get $assembly/evalKnox/currentKnoxTime
    f64.const 0.1
    f64.add
    global.set $assembly/evalKnox/currentKnoxTime
    i32.const 1
    call $assembly/evalKnox/knoxAtk
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/knoxEnemyAttack
  (local $0 f64)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  (local $5 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  f64.const 1
  local.get $1
  i32.load offset=272
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.sub
  f64.mul
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnoxEnemy
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=24
  local.tee $2
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalKnox/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalKnox/seed
   local.get $2
   global.get $assembly/evalKnox/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   local.get $0
   local.get $1
   f64.load offset=32
   f64.mul
   local.set $0
  end
  global.get $assembly/evalKnox/currentKnoxEnem
  i32.const 0
  i32.gt_s
  if (result i32)
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 1000
   i32.rem_s
  else
   i32.const 1
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $assembly/evalKnox/currentKnoxTime
   local.get $1
   f64.load offset=64
   f64.add
   global.set $assembly/evalKnox/nextKnoxEnemAtk
  else
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $3
   i32.store offset=4
   local.get $1
   local.get $3
   i32.load offset=80
   i32.const 1
   i32.add
   i32.store offset=80
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=64
   local.set $2
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=80
   f64.convert_i32_s
   local.set $4
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $1
   i32.store
   global.get $assembly/evalKnox/currentKnoxTime
   local.get $2
   local.get $4
   local.get $1
   f64.load offset=64
   f64.const 200
   f64.div
   f64.mul
   f64.sub
   f64.const 0.5
   f64.max
   f64.add
   global.set $assembly/evalKnox/nextKnoxEnemAtk
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  f64.load offset=56
  local.tee $2
  f64.const 0
  f64.gt
  if (result i32)
   global.get $assembly/evalKnox/seed
   i64.extend_i32_u
   i64.const 1664525
   i64.mul
   i64.const 1013904223
   i64.add
   i64.const 4294967295
   i64.and
   i32.wrap_i64
   global.set $assembly/evalKnox/seed
   local.get $2
   global.get $assembly/evalKnox/seed
   f64.convert_i32_u
   f64.const 2.3283064365386963e-10
   f64.mul
   f64.gt
  else
   i32.const 0
  end
  if
   local.get $0
   f64.const 0.5
   f64.mul
   local.set $0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=316
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $1
    i32.store
    local.get $1
    i32.const 5
    i32.store offset=200
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=320
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $3
    f64.load offset=176
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $1
    local.get $2
    local.get $3
    i32.load offset=320
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.add
    f64.store offset=176
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $3
    f64.load offset=184
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $1
    local.get $2
    local.get $3
    i32.load offset=320
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.add
    f64.store offset=184
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $3
    f64.load offset=192
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $1
    local.get $2
    local.get $3
    i32.load offset=320
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.add
    f64.store offset=192
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnoxEnemy
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnoxEnemy
    local.tee $3
    i32.store offset=4
    local.get $3
    f64.load offset=8
    local.set $2
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    local.get $1
    local.get $2
    local.get $0
    local.get $3
    i32.load offset=320
    f64.convert_i32_s
    f64.mul
    f64.const 0.2
    f64.mul
    f64.sub
    f64.store offset=8
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnoxEnemy
    local.tee $1
    i32.store
    local.get $1
    f64.load offset=8
    f64.const 0
    f64.le
    if
     f64.const 0
     call $assembly/evalKnox/knoxKillEnemy
    end
   end
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $3
  i32.store offset=4
  local.get $3
  f64.load offset=16
  local.set $2
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $3
  i32.store offset=4
  local.get $1
  local.get $2
  local.get $0
  f64.const 1
  local.get $3
  f64.load offset=48
  f64.sub
  f64.mul
  f64.const 1
  global.get $assembly/evalKnox/currentKnoxCreaGem4
  f64.convert_i32_s
  f64.const 0.03
  f64.mul
  f64.sub
  f64.mul
  f64.sub
  f64.store offset=16
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/currentKnox
  local.tee $1
  i32.store
  local.get $1
  i32.load offset=120
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   f64.load offset=16
   f64.const 0
   f64.le
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $1
   local.get $3
   f64.load offset=96
   f64.const 0.8
   f64.mul
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   local.get $1
   i32.load offset=496
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store
   local.get $3
   i32.load offset=120
   i32.sub
   i32.const 1
   i32.add
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 10
   i32.div_s
   i32.const 1000
   i32.mul
   i32.add
   local.set $1
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.load offset=492
   local.tee $3
   i32.store
   local.get $3
   local.get $1
   call $"~lib/map/Map<i32,i32>#has"
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=492
    local.tee $3
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $5
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.load offset=492
    local.tee $5
    i32.store offset=4
    local.get $3
    local.get $1
    local.get $5
    local.get $1
    call $"~lib/map/Map<i32,i32>#get"
    i32.const 1
    i32.add
    call $"~lib/map/Map<i32,i32>#set"
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/currentKnox
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=492
    local.tee $3
    i32.store
    local.get $3
    local.get $1
    i32.const 1
    call $"~lib/map/Map<i32,i32>#set"
   end
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnox
   local.tee $3
   i32.store offset=4
   local.get $1
   local.get $3
   i32.load offset=120
   i32.const 1
   i32.sub
   i32.store offset=120
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/knoxSim (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 f64) (param $7 i32) (param $8 f64) (param $9 i32) (param $10 f64) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 i32) (param $26 i32) (param $27 i32)
  (local $28 i64)
  (local $29 f64)
  (local $30 f64)
  (local $31 f64)
  (local $32 f64)
  (local $33 f64)
  (local $34 f64)
  (local $35 f64)
  (local $36 i64)
  (local $37 i64)
  (local $38 i64)
  (local $39 i32)
  (local $40 i64)
  (local $41 f64)
  (local $42 f64)
  (local $43 i64)
  (local $44 f64)
  (local $45 f64)
  (local $46 i64)
  global.get $~lib/memory/__stack_pointer
  i32.const 32
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 32
   memory.fill
   local.get $0
   global.set $assembly/evalKnox/currentKnox
   i32.const 0
   global.set $assembly/evalKnox/currentKnoxEnem
   f64.const 0
   global.set $assembly/evalKnox/currentKnoxTime
   local.get $3
   global.set $assembly/evalKnox/currentKnoxAttr
   local.get $4
   global.set $assembly/evalKnox/currentKnoxCatchup99gu
   local.get $27
   global.set $assembly/evalKnox/currentKnoxCreaGem4
   i32.const 0
   global.set $assembly/evalKnox/leftoverTorpedos
   local.get $2
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    block $__inlined_func$~lib/math/NativeMath.mod$1 (result f64)
     local.get $0
     i32.load offset=340
     f64.convert_i32_s
     local.tee $30
     local.get $30
     f64.trunc
     f64.sub
     local.get $30
     f64.copysign
     local.get $2
     f64.convert_i32_s
     local.tee $29
     f64.abs
     f64.const 1
     f64.eq
     br_if $__inlined_func$~lib/math/NativeMath.mod$1
     drop
     local.get $29
     i64.reinterpret_f64
     local.tee $40
     i64.const 52
     i64.shr_u
     i64.const 2047
     i64.and
     local.set $43
     local.get $40
     i64.const 1
     i64.shl
     local.tee $37
     i64.eqz
     local.get $30
     i64.reinterpret_f64
     local.tee $36
     i64.const 52
     i64.shr_u
     i64.const 2047
     i64.and
     local.tee $46
     i64.const 2047
     i64.eq
     i32.or
     local.get $29
     local.get $29
     f64.ne
     i32.or
     if
      local.get $30
      local.get $29
      f64.mul
      local.tee $29
      local.get $29
      f64.div
      br $__inlined_func$~lib/math/NativeMath.mod$1
     end
     local.get $36
     i64.const 1
     i64.shl
     local.tee $28
     local.get $37
     i64.le_u
     if
      local.get $30
      local.get $28
      local.get $37
      i64.ne
      f64.convert_i32_u
      f64.mul
      br $__inlined_func$~lib/math/NativeMath.mod$1
     end
     local.get $36
     i64.const 63
     i64.shr_u
     local.set $38
     local.get $46
     i64.eqz
     if (result i64)
      local.get $36
      i64.const 1
      local.get $46
      local.get $36
      i64.const 12
      i64.shl
      i64.clz
      i64.sub
      local.tee $46
      i64.sub
      i64.shl
     else
      local.get $36
      i64.const 4503599627370495
      i64.and
      i64.const 4503599627370496
      i64.or
     end
     local.set $28
     local.get $43
     i64.eqz
     if (result i64)
      local.get $40
      i64.const 1
      local.get $43
      local.get $40
      i64.const 12
      i64.shl
      i64.clz
      i64.sub
      local.tee $43
      i64.sub
      i64.shl
     else
      local.get $40
      i64.const 4503599627370495
      i64.and
      i64.const 4503599627370496
      i64.or
     end
     local.set $36
     loop $while-continue|0
      local.get $43
      local.get $46
      i64.lt_s
      if
       local.get $28
       local.get $36
       i64.ge_u
       if (result i64)
        local.get $30
        f64.const 0
        f64.mul
        local.get $28
        local.get $36
        i64.eq
        br_if $__inlined_func$~lib/math/NativeMath.mod$1
        drop
        local.get $28
        local.get $36
        i64.sub
       else
        local.get $28
       end
       i64.const 1
       i64.shl
       local.set $28
       local.get $46
       i64.const 1
       i64.sub
       local.set $46
       br $while-continue|0
      end
     end
     local.get $28
     local.get $36
     i64.ge_u
     if
      local.get $30
      f64.const 0
      f64.mul
      local.get $28
      local.get $36
      i64.eq
      br_if $__inlined_func$~lib/math/NativeMath.mod$1
      drop
      local.get $28
      local.get $36
      i64.sub
      local.set $28
     end
     local.get $46
     local.get $28
     i64.const 11
     i64.shl
     i64.clz
     local.tee $37
     i64.sub
     local.set $36
     local.get $28
     local.get $37
     i64.shl
     local.set $28
     local.get $36
     i64.const 0
     i64.gt_s
     if (result i64)
      local.get $28
      i64.const 4503599627370496
      i64.sub
      local.get $36
      i64.const 52
      i64.shl
      i64.or
     else
      local.get $28
      i64.const 1
      local.get $36
      i64.sub
      i64.shr_u
     end
     local.get $38
     i64.const 63
     i64.shl
     i64.or
     f64.reinterpret_i64
    end
    f64.const 0
    f64.eq
   else
    i32.const 0
   end
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.const 0
    f64.store offset=176
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.const 0
    f64.store offset=184
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=8
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=8
   f64.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=24
   local.get $3
   i32.const 0
   i32.gt_s
   if (result f64)
    f64.const 1.08
    local.get $4
    f64.convert_i32_s
    call $~lib/math/NativeMath.pow
    local.get $3
    f64.convert_i32_s
    f64.const 0.1
    f64.mul
    f64.const 1
    f64.add
    f64.const -0.1
    f64.add
    call $~lib/math/NativeMath.pow
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=104
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=40
   f64.store offset=112
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=248
   i32.store offset=120
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=128
   f64.const 40
   local.get $7
   f64.convert_i32_s
   f64.const 30
   f64.min
   f64.sub
   f64.add
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.const 1
   f64.store offset=152
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.load offset=4
   f64.convert_i32_s
   local.set $29
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $29
   local.get $0
   i32.load offset=348
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.max
   i32.trunc_sat_f64_s
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.const 100
   local.get $0
   i32.load offset=304
   f64.convert_i32_s
   f64.const 10
   f64.mul
   f64.sub
   f64.store offset=168
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.const 0
   i32.store offset=124
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/KNOX_ENEMIES
   local.tee $2
   i32.store
   local.get $2
   i32.const 0
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   global.set $assembly/evalKnox/currentKnoxEnemy
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $4
   i32.store
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store offset=4
   local.get $4
   local.get $2
   f64.load
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=88
   global.set $assembly/evalKnox/nextKnoxAtk
   f64.const 99999999
   global.set $assembly/evalKnox/nextKnoxBullet
   f64.const 99999999
   global.set $assembly/evalKnox/nextKnoxTorpedo
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/currentKnoxEnemy
   local.tee $2
   i32.store
   local.get $2
   f64.load offset=64
   global.set $assembly/evalKnox/nextKnoxEnemAtk
   f64.const 1
   global.set $assembly/evalKnox/nextKnoxRegen
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=496
   i32.eqz
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=248
    i32.store offset=496
   end
   loop $while-continue|00
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.load offset=16
    f64.const 0
    f64.gt
    if
     global.get $assembly/evalKnox/nextKnoxRegen
     global.get $assembly/evalKnox/nextKnoxEnemAtk
     global.get $assembly/evalKnox/nextKnoxTorpedo
     global.get $assembly/evalKnox/nextKnoxAtk
     global.get $assembly/evalKnox/nextKnoxBullet
     f64.min
     f64.min
     f64.min
     f64.min
     global.set $assembly/evalKnox/currentKnoxTime
     global.get $assembly/evalKnox/currentKnoxTime
     global.get $assembly/evalKnox/nextKnoxRegen
     f64.eq
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 11620
      i32.lt_s
      br_if $folding-inner1
      global.get $~lib/memory/__stack_pointer
      i64.const 0
      i64.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnox
      local.tee $2
      i32.store
      local.get $2
      f64.load offset=16
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnox
      local.tee $2
      i32.store
      local.get $2
      f64.load offset=96
      f64.lt
      if
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $4
       i32.store
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $2
       i32.store offset=4
       local.get $2
       f64.load offset=96
       local.set $31
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $2
       i32.store offset=4
       local.get $2
       f64.load offset=16
       local.set $30
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $2
       i32.store offset=4
       local.get $2
       f64.load offset=112
       local.set $29
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $2
       i32.store offset=4
       local.get $4
       local.get $31
       local.get $30
       local.get $29
       local.get $2
       i32.load offset=200
       if (result f64)
        global.get $~lib/memory/__stack_pointer
        global.get $assembly/evalKnox/currentKnox
        local.tee $2
        i32.store offset=4
        local.get $2
        i32.load offset=316
        f64.convert_i32_s
        f64.const 0.1
        f64.mul
        f64.const 1
        f64.add
       else
        f64.const 1
       end
       f64.mul
       f64.add
       f64.min
       f64.store offset=16
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $4
       i32.store
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/currentKnox
       local.tee $2
       i32.store offset=4
       local.get $4
       local.get $2
       i32.load offset=200
       i32.const 1
       i32.sub
       f64.convert_i32_s
       f64.const 0
       f64.max
       i32.trunc_sat_f64_s
       i32.store offset=200
      end
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $4
      i32.store
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $2
      i32.store offset=4
      local.get $2
      f64.load
      local.set $31
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $2
      i32.store offset=4
      local.get $2
      f64.load offset=8
      local.set $30
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnoxEnemy
      local.tee $2
      i32.store offset=4
      local.get $2
      f64.load offset=56
      local.set $29
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/currentKnox
      local.tee $2
      i32.store offset=4
      local.get $4
      local.get $31
      local.get $30
      local.get $29
      f64.const 1
      local.get $2
      i32.load offset=264
      f64.convert_i32_s
      f64.const 0.08
      f64.mul
      f64.const 2
      f64.const 1
      global.get $assembly/evalKnox/currentKnoxEnem
      i32.const 1000
      i32.eq
      select
      f64.div
      f64.sub
      f64.mul
      f64.add
      f64.min
      f64.store offset=8
      global.get $assembly/evalKnox/currentKnoxTime
      f64.const 1
      f64.add
      global.set $assembly/evalKnox/nextKnoxRegen
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
     else
      global.get $assembly/evalKnox/currentKnoxTime
      global.get $assembly/evalKnox/nextKnoxBullet
      f64.eq
      if
       call $assembly/evalKnox/knoxBullet
      else
       global.get $assembly/evalKnox/currentKnoxTime
       global.get $assembly/evalKnox/nextKnoxEnemAtk
       f64.eq
       if
        call $assembly/evalKnox/knoxEnemyAttack
       else
        global.get $assembly/evalKnox/currentKnoxTime
        global.get $assembly/evalKnox/nextKnoxAtk
        f64.eq
        if
         i32.const 0
         call $assembly/evalKnox/knoxAtk
        else
         global.get $assembly/evalKnox/currentKnoxTime
         global.get $assembly/evalKnox/nextKnoxTorpedo
         f64.eq
         if
          global.get $~lib/memory/__stack_pointer
          i32.const 8
          i32.sub
          global.set $~lib/memory/__stack_pointer
          global.get $~lib/memory/__stack_pointer
          i32.const 11620
          i32.lt_s
          br_if $folding-inner1
          global.get $~lib/memory/__stack_pointer
          i64.const 0
          i64.store
          i32.const 0
          local.set $4
          loop $for-loop|0
           block $__inlined_func$assembly/evalKnox/knoxTorpedo$2368
            global.get $~lib/memory/__stack_pointer
            global.get $assembly/evalKnox/currentKnox
            local.tee $2
            i32.store
            local.get $4
            local.get $2
            i32.load offset=304
            i32.const 5
            i32.add
            i32.lt_s
            if
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnoxEnemy
             local.tee $7
             i32.store
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnoxEnemy
             local.tee $2
             i32.store offset=4
             local.get $2
             f64.load offset=8
             local.set $30
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnox
             local.tee $2
             i32.store offset=4
             local.get $2
             f64.load offset=104
             f64.const 30
             f64.mul
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnox
             local.tee $2
             i32.store offset=4
             local.get $2
             i32.load offset=308
             f64.convert_i32_s
             f64.const 0.08
             f64.mul
             f64.const 1
             f64.add
             f64.mul
             local.set $29
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnox
             local.tee $2
             i32.store offset=4
             local.get $7
             local.get $30
             local.get $29
             local.get $2
             i32.load offset=304
             f64.convert_i32_s
             f64.const 0.2
             f64.mul
             f64.const 1
             f64.add
             f64.mul
             f64.sub
             f64.store offset=8
             global.get $~lib/memory/__stack_pointer
             global.get $assembly/evalKnox/currentKnoxEnemy
             local.tee $2
             i32.store
             local.get $2
             f64.load offset=8
             f64.const 0
             f64.le
             if
              f64.const 0
              call $assembly/evalKnox/knoxKillEnemy
             else
              global.get $~lib/memory/__stack_pointer
              global.get $assembly/evalKnox/currentKnox
              local.tee $2
              i32.store
              local.get $2
              i32.load offset=304
              local.get $4
              i32.sub
              i32.const 4
              i32.add
              global.set $assembly/evalKnox/leftoverTorpedos
              br $__inlined_func$assembly/evalKnox/knoxTorpedo$2368
             end
             local.get $4
             i32.const 1
             i32.add
             local.set $4
             br $for-loop|0
            end
           end
          end
          f64.const 99999999
          global.set $assembly/evalKnox/nextKnoxTorpedo
          global.get $~lib/memory/__stack_pointer
          i32.const 8
          i32.add
          global.set $~lib/memory/__stack_pointer
         end
        end
       end
      end
     end
     br $while-continue|00
    end
   end
   i32.const 0
   local.set $2
   loop $for-loop|1
    local.get $2
    i32.const 10
    i32.lt_s
    if
     global.get $assembly/evalKnox/currentKnoxEnem
     local.get $2
     i32.const 1
     i32.add
     local.tee $27
     i32.const 1000
     i32.mul
     i32.lt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=484
      local.tee $4
      i32.store offset=4
      local.get $4
      local.get $2
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $7
      global.get $~lib/memory/__stack_pointer
      local.get $7
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.load offset=484
      local.tee $4
      i32.store offset=8
      local.get $4
      local.get $2
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store offset=4
      local.get $4
      f64.load
      local.set $29
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/KNOX_ENEMIES
      local.tee $4
      i32.store offset=8
      local.get $4
      local.get $27
      i32.const 100
      i32.mul
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $4
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store offset=4
      local.get $7
      local.get $29
      local.get $4
      f64.load
      f64.add
      f64.store
     else
      global.get $assembly/evalKnox/currentKnoxEnem
      local.get $2
      i32.const 1
      i32.add
      local.tee $27
      i32.const 1000
      i32.mul
      i32.eq
      if
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=8
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=484
       local.tee $4
       i32.store offset=4
       local.get $4
       local.get $2
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $7
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=12
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=484
       local.tee $4
       i32.store offset=8
       local.get $4
       local.get $2
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $4
       i32.store offset=4
       local.get $4
       f64.load
       local.set $29
       global.get $~lib/memory/__stack_pointer
       global.get $assembly/evalKnox/KNOX_ENEMIES
       local.tee $4
       i32.store offset=8
       local.get $4
       local.get $27
       i32.const 100
       i32.mul
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $4
       i32.store offset=4
       local.get $7
       local.get $29
       local.get $4
       f64.load offset=8
       f64.add
       f64.store
      else
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=8
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=484
       local.tee $4
       i32.store offset=4
       local.get $4
       local.get $2
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $7
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=12
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.load offset=484
       local.tee $4
       i32.store offset=8
       local.get $4
       local.get $2
       call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $4
       i32.store offset=4
       local.get $7
       local.get $4
       i32.load offset=8
       i32.const 1
       i32.add
       i32.store offset=8
      end
     end
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|1
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 7
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $27
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 0
   f64.const 1
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 1
   f64.const 1.04
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 2
   f64.const 1.06
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 3
   f64.const 1.08
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 4
   f64.const 1.11
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 5
   f64.const 1.18
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   i32.const 6
   f64.const 1.25
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $7
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   i32.const 0
   f64.const 0.77
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   i32.const 1
   f64.const 0.88
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   i32.const 2
   f64.const 0.99
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   i32.const 3
   f64.const 1.05
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 3
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $39
   i32.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   i32.const 0
   f64.const 0.6
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   i32.const 1
   f64.const 0.7
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   i32.const 2
   f64.const 0.8
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   i32.const 2
   call $~lib/staticarray/StaticArray<f64>#constructor
   local.tee $4
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 0
   f64.const 2
   local.get $1
   i32.const 1
   i32.sub
   i32.const 100
   i32.div_s
   f64.convert_i32_s
   local.tee $29
   call $~lib/math/NativeMath.pow
   f64.const 1.3
   f64.mul
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.const 1
   f64.const 2
   local.get $29
   call $~lib/math/NativeMath.pow
   f64.const 1.4
   f64.mul
   call $~lib/staticarray/StaticArray<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $27
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $39
   call $assembly/evalBorge/arrayAverage
   f64.const 3
   f64.mul
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   call $assembly/evalBorge/arrayAverage
   f64.add
   f64.const 10
   f64.div
   local.set $35
   i32.const 1010
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=300
   f64.convert_i32_s
   f64.const 0.13
   f64.mul
   f64.const 1
   f64.add
   local.get $6
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $25
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.set $30
   f64.const 1
   local.set $6
   i32.const 1
   local.set $2
   loop $for-loop|2
    local.get $2
    local.get $12
    i32.le_s
    if
     local.get $6
     local.get $2
     i32.const 1
     i32.add
     local.tee $2
     f64.convert_i32_s
     f64.const 0.01
     f64.mul
     f64.const 1
     f64.add
     f64.mul
     local.set $6
     br $for-loop|2
    end
   end
   local.get $8
   f64.const 1
   f64.max
   f64.const 1.25
   f64.const 1
   local.get $9
   select
   f64.mul
   local.get $10
   f64.const 1
   f64.max
   f64.mul
   f64.const 1.03
   local.get $5
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   local.get $3
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 1
   f64.add
   f64.const -0.1
   f64.add
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $11
   i32.const 3
   i32.ge_s
   select
   f64.mul
   f64.const 1.2
   f64.const 1
   local.get $11
   i32.const 6
   i32.ge_s
   select
   f64.mul
   local.get $6
   f64.mul
   f64.const 1.2
   f64.const 1
   local.get $13
   i32.const 3
   i32.ge_s
   select
   f64.mul
   f64.const 1.3
   f64.const 1
   local.get $13
   i32.const 6
   i32.ge_s
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $15
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $16
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.07
   f64.const 1
   local.get $17
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.05
   f64.const 1
   local.get $18
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $19
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   f64.const 1
   local.get $20
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $21
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.02
   local.get $22
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.const 1.08
   local.get $23
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   f64.mul
   local.get $24
   f64.convert_i32_s
   f64.const 0.003
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.const 1.1
   f64.const 1
   local.get $14
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.3
   f64.const 1
   local.get $26
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.set $34
   local.get $35
   f64.const 1.074
   global.get $assembly/evalKnox/currentKnoxEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   call $~lib/math/NativeMath.pow
   f64.const -1
   f64.add
   f64.const 0.07400000000000007
   f64.div
   f64.const 10
   f64.mul
   global.get $assembly/evalKnox/currentKnoxEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   global.get $assembly/evalKnox/currentKnoxEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   f64.const 10
   f64.mul
   f64.sub
   f64.const 1.074
   global.get $assembly/evalKnox/currentKnoxEnem
   f64.convert_i32_s
   f64.const 1e3
   f64.min
   f64.const 10
   f64.div
   f64.floor
   call $~lib/math/NativeMath.pow
   f64.mul
   f64.add
   f64.mul
   local.get $30
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=268
   f64.convert_i32_s
   f64.const 0.2
   f64.mul
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=64
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   local.set $8
   f64.const 1
   local.set $10
   global.get $assembly/evalKnox/currentKnoxEnem
   local.set $3
   loop $while-continue|3
    local.get $1
    local.get $3
    i32.le_s
    if
     local.get $10
     f64.const 1.074
     f64.const 100
     call $~lib/math/NativeMath.pow
     f64.mul
     local.set $29
     global.get $~lib/memory/__stack_pointer
     local.get $27
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $27
     i32.store offset=4
     local.get $44
     local.get $29
     local.get $27
     local.get $27
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 800
     f64.mul
     local.get $30
     f64.mul
     local.get $34
     f64.mul
     local.tee $32
     f64.add
     local.set $44
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $42
     local.get $29
     local.get $7
     local.get $7
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 600
     f64.mul
     local.get $30
     f64.mul
     local.get $34
     f64.mul
     local.tee $31
     f64.add
     local.set $42
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=4
     local.get $45
     local.get $29
     local.get $39
     local.get $39
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 400
     f64.mul
     local.get $30
     f64.mul
     local.get $34
     f64.mul
     local.tee $10
     f64.add
     local.set $45
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=4
     local.get $41
     local.get $29
     local.get $4
     local.get $4
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 300
     f64.mul
     local.get $30
     f64.mul
     local.get $34
     f64.mul
     local.tee $6
     f64.add
     local.set $41
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     f64.load offset=352
     local.get $32
     f64.add
     f64.store offset=352
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     f64.load offset=360
     local.get $31
     f64.add
     f64.store offset=360
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     f64.load offset=368
     local.get $10
     f64.add
     f64.store offset=368
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     local.get $0
     f64.load offset=376
     local.get $6
     f64.add
     f64.store offset=376
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=328
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $27
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $27
     i32.store offset=8
     local.get $0
     local.get $6
     local.get $29
     local.get $27
     local.get $27
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 800
     f64.mul
     local.get $30
     f64.mul
     f64.add
     f64.store offset=328
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=328
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=8
     local.get $0
     local.get $6
     local.get $29
     local.get $7
     local.get $7
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 600
     f64.mul
     local.get $30
     f64.mul
     f64.add
     f64.store offset=328
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=328
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $39
     i32.store offset=8
     local.get $0
     local.get $6
     local.get $29
     local.get $39
     local.get $39
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 400
     f64.mul
     local.get $30
     f64.mul
     f64.add
     f64.store offset=328
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     f64.load offset=328
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=8
     local.get $0
     local.get $6
     local.get $29
     local.get $4
     local.get $4
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 3
     i32.shr_u
     i32.const 1
     i32.sub
     call $~lib/staticarray/StaticArray<f64>#__get
     f64.mul
     f64.const 300
     f64.mul
     local.get $30
     f64.mul
     f64.add
     f64.store offset=328
     local.get $3
     local.get $1
     i32.sub
     local.set $3
     i32.const 1000
     local.set $1
     local.get $29
     f64.const 5
     f64.mul
     local.tee $10
     local.get $35
     f64.mul
     f64.const 1.074
     f64.mul
     f64.const 1.074
     local.get $3
     f64.convert_i32_s
     f64.const 990
     f64.min
     local.tee $29
     f64.const 10
     f64.div
     f64.floor
     local.tee $6
     call $~lib/math/NativeMath.pow
     f64.const -1
     f64.add
     f64.const 0.07400000000000007
     f64.div
     f64.const 10
     f64.mul
     local.get $29
     local.get $6
     f64.const 10
     f64.mul
     f64.sub
     f64.const 1.074
     local.get $6
     call $~lib/math/NativeMath.pow
     f64.mul
     f64.add
     f64.mul
     local.get $30
     f64.mul
     local.set $29
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     i32.load offset=268
     f64.convert_i32_s
     f64.const 0.2
     f64.mul
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $8
     local.get $29
     local.get $6
     local.get $0
     f64.load offset=64
     f64.mul
     f64.const 1
     f64.add
     f64.mul
     f64.add
     local.set $8
     br $while-continue|3
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store
   local.get $8
   f64.const 3
   f64.mul
   f64.const 10
   f64.div
   local.tee $33
   local.get $27
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   local.get $44
   f64.add
   local.set $32
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $33
   local.get $7
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   local.get $42
   f64.add
   local.set $31
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store
   local.get $33
   local.get $39
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   local.get $45
   f64.add
   local.set $30
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $8
   f64.const 10
   f64.div
   local.tee $29
   local.get $4
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   local.get $41
   f64.add
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=352
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $27
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $33
   local.get $27
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   f64.add
   f64.store offset=352
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=360
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $33
   local.get $7
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   f64.add
   f64.store offset=360
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=368
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $39
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $33
   local.get $39
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   f64.add
   f64.store offset=368
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=376
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $29
   local.get $4
   call $assembly/evalBorge/arrayAverage
   f64.mul
   local.get $35
   f64.div
   local.get $34
   f64.mul
   f64.add
   f64.store offset=376
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $32
   local.get $0
   f64.load offset=384
   f64.min
   f64.store offset=384
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $32
   local.get $0
   f64.load offset=392
   f64.max
   f64.store offset=392
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $31
   local.get $0
   f64.load offset=400
   f64.min
   f64.store offset=400
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $31
   local.get $0
   f64.load offset=408
   f64.max
   f64.store offset=408
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $30
   local.get $0
   f64.load offset=416
   f64.min
   f64.store offset=416
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $30
   local.get $0
   f64.load offset=424
   f64.max
   f64.store offset=424
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $10
   local.get $0
   f64.load offset=432
   f64.min
   f64.store offset=432
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $10
   local.get $0
   f64.load offset=440
   f64.max
   f64.store offset=440
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=328
   local.get $8
   f64.add
   f64.store offset=328
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=128
   global.get $assembly/evalKnox/currentKnoxTime
   f64.add
   f64.store offset=128
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   global.get $assembly/evalKnox/currentKnoxEnem
   local.get $0
   i32.load offset=336
   i32.add
   i32.store offset=336
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=328
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $0
   f64.load offset=128
   f64.div
   f64.store offset=448
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=340
   i32.const 1
   i32.add
   i32.store offset=340
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=472
   local.tee $6
   i64.reinterpret_f64
   i64.const 1
   i64.shl
   i64.const 2
   i64.sub
   i64.const -9007199254740994
   i64.gt_u
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    f64.load offset=136
    local.set $6
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $6
   local.get $0
   f64.load offset=136
   f64.min
   f64.store offset=472
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load offset=144
   f64.eq
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=480
    i32.const 1
    i32.add
    i32.store offset=480
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   global.get $assembly/evalKnox/currentKnoxEnem
   f64.convert_i32_s
   local.tee $6
   local.get $0
   i32.load offset=344
   f64.convert_i32_s
   f64.min
   i32.trunc_sat_f64_s
   i32.store offset=344
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=348
   f64.convert_i32_s
   local.get $6
   f64.max
   i32.trunc_sat_f64_s
   i32.store offset=348
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=488
   local.tee $1
   i32.store
   local.get $1
   global.get $assembly/evalKnox/currentKnoxEnem
   i32.const 10
   i32.div_s
   local.tee $2
   call $"~lib/map/Map<i32,i32>#has"
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=488
    local.tee $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=488
    local.tee $0
    i32.store offset=4
    local.get $1
    local.get $2
    local.get $0
    local.get $2
    call $"~lib/map/Map<i32,i32>#get"
    i32.const 1
    i32.add
    call $"~lib/map/Map<i32,i32>#set"
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=488
    local.tee $0
    i32.store
    local.get $0
    local.get $2
    i32.const 1
    call $"~lib/map/Map<i32,i32>#set"
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 32
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalKnox/EVALKNOX_WASM (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 i32) (param $8 i32) (param $9 i32) (param $10 i32) (param $11 i32) (param $12 i32) (param $13 i32) (param $14 i32) (param $15 i32) (param $16 i32) (param $17 i32) (param $18 i32) (param $19 i32) (param $20 i32) (param $21 i32) (param $22 i32) (param $23 i32) (param $24 i32) (param $25 i32) (param $26 i32) (param $27 i32) (param $28 i32) (param $29 i32) (param $30 i32) (param $31 i32) (param $32 i32) (param $33 i32) (param $34 f64) (param $35 f64) (param $36 i32) (param $37 i32) (param $38 i32) (param $39 i32) (param $40 i32) (param $41 i32) (param $42 i32) (param $43 i32) (param $44 i32) (param $45 i32) (param $46 i32) (param $47 i32) (param $48 i32) (param $49 i32) (param $50 i32) (param $51 i32) (param $52 i32) (param $53 i32) (param $54 i32) (param $55 i32) (param $56 i32) (param $57 i32) (param $58 i32) (param $59 i32) (param $60 i32) (param $61 i32) (param $62 i32) (param $63 i32) (param $64 i32) (param $65 i32) (param $66 i32) (param $67 i32) (param $68 i32) (param $69 i32) (param $70 i32) (param $71 i32) (param $72 i32) (param $73 i32) (param $74 i32) (param $75 i32) (param $76 i32) (param $77 i32) (param $78 i32) (param $79 i32) (param $80 i32) (param $81 i32) (param $82 i32) (param $83 i32) (param $84 i32) (param $85 i32) (param $86 i32) (param $87 i32) (param $88 i32) (result f64)
  (local $89 f64)
  (local $90 f64)
  (local $91 f64)
  (local $92 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 11620
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   i32.const 0
   local.set $36
   loop $for-loop|0
    local.get $36
    i32.const 1000
    i32.le_s
    if
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/evalKnox/KNOX_ENEMIES
     local.tee $37
     i32.store
     local.get $36
     call $assembly/evalKnox/KnoxEnemy#constructor
     local.set $38
     global.get $~lib/memory/__stack_pointer
     local.get $38
     i32.store offset=4
     local.get $37
     local.get $36
     local.get $38
     call $~lib/staticarray/StaticArray<assembly/evalBorge/BossStats>#__set
     local.get $36
     i32.const 1
     i32.add
     local.set $36
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 1.001
   local.get $31
   f64.convert_i32_s
   local.tee $89
   call $~lib/math/NativeMath.pow
   f64.const 1.02
   local.get $31
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   local.tee $90
   call $~lib/math/NativeMath.pow
   f64.mul
   local.set $91
   f64.const 1.005
   local.get $89
   call $~lib/math/NativeMath.pow
   f64.const 1.02
   local.get $90
   call $~lib/math/NativeMath.pow
   f64.mul
   local.set $90
   global.get $~lib/memory/__stack_pointer
   call $assembly/evalKnox/Knox#constructor
   local.tee $31
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $1
   i32.store offset=4
   local.get $83
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $84
    f64.convert_i32_s
    f64.const 100
    f64.min
    f64.const 0.01
    f64.mul
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   local.set $92
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $2
   i32.const 5
   i32.div_s
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   f64.const 2
   f64.add
   local.get $2
   f64.convert_i32_s
   f64.mul
   f64.const 20
   f64.add
   local.get $91
   f64.mul
   local.get $70
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 1
   f64.add
   local.tee $89
   f64.mul
   f64.const 1.0777
   f64.const 1
   local.get $72
   select
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $79
   i32.const 0
   i32.gt_s
   select
   f64.mul
   f64.const 1.08
   f64.const 1
   local.get $82
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.get $81
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 29
    i32.sub
    f64.convert_i32_s
    f64.const 0.015
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   local.get $92
   f64.mul
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $31
   f64.load offset=8
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $3
   i32.const 10
   i32.div_s
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0.06
   f64.add
   local.get $3
   f64.convert_i32_s
   f64.mul
   f64.const 1.2
   f64.add
   local.get $91
   f64.mul
   local.get $89
   f64.mul
   f64.const 1.03
   f64.const 1
   local.get $79
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.get $81
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 29
    i32.sub
    f64.convert_i32_s
    f64.const 0.01
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $11
   f64.convert_i32_s
   f64.const 3
   f64.add
   f64.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $4
   i32.const 30
   i32.div_s
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.const 0.03
   f64.add
   local.get $4
   f64.convert_i32_s
   f64.mul
   f64.const 0.05
   f64.add
   local.get $91
   f64.mul
   local.get $89
   f64.mul
   f64.const 1.0777
   f64.const 1
   local.get $72
   select
   f64.mul
   f64.const 1.08
   f64.const 1
   local.get $82
   i32.const 0
   i32.gt_s
   select
   f64.mul
   local.get $81
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $0
    i32.const 29
    i32.sub
    f64.convert_i32_s
    f64.const 0.005
    f64.mul
    f64.const 0
    f64.max
    f64.const 1
    f64.add
   else
    f64.const 1
   end
   f64.mul
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $5
   f64.convert_i32_s
   f64.const 0.0032
   f64.mul
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $6
   f64.convert_i32_s
   f64.const 0.0055
   f64.mul
   f64.const 0.08
   f64.add
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $7
   f64.convert_i32_s
   f64.const 0.0036
   f64.mul
   f64.const 0.05
   f64.add
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $8
   f64.convert_i32_s
   f64.const 0.0025
   f64.mul
   f64.const 0.07
   f64.add
   f64.store offset=72
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $9
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   f64.const 0.25
   f64.add
   f64.store offset=80
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   f64.const 7
   local.get $10
   f64.convert_i32_s
   f64.const 0.03
   f64.mul
   f64.sub
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $31
   f64.load offset=88
   local.get $77
   i32.const 0
   i32.gt_s
   if (result f64)
    local.get $78
    f64.convert_i32_s
    f64.const 3
    f64.div
    f64.floor
    f64.const 0.01
    f64.mul
    f64.const 0.25
    f64.min
   else
    f64.const 0
   end
   f64.sub
   f64.store offset=88
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $2
   i32.store offset=208
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $3
   i32.store offset=212
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $11
   i32.store offset=216
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $4
   i32.store offset=220
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $5
   i32.store offset=224
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $6
   i32.store offset=228
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $7
   i32.store offset=232
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $8
   i32.store offset=236
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $9
   i32.store offset=240
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $10
   i32.store offset=244
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $12
   i32.store offset=248
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $13
   i32.store offset=252
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $14
   i32.store offset=256
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $15
   i32.store offset=260
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $16
   i32.store offset=264
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $17
   i32.store offset=268
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $18
   i32.store offset=272
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $19
   i32.store offset=276
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $20
   i32.store offset=280
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $21
   i32.store offset=284
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $22
   i32.store offset=288
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $23
   i32.store offset=292
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $24
   i32.store offset=296
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $25
   i32.store offset=300
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $26
   i32.store offset=304
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $27
   i32.store offset=308
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $28
   i32.store offset=312
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $29
   i32.store offset=316
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   local.get $30
   i32.store offset=320
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=8
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=280
   f64.convert_i32_s
   f64.const 0.005
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=40
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=280
   f64.convert_i32_s
   f64.const 0.008
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=24
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=280
   f64.convert_i32_s
   f64.const 0.005
   f64.mul
   f64.const 1
   f64.add
   f64.mul
   f64.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=48
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=296
   f64.convert_i32_s
   f64.const 0.009
   f64.mul
   f64.add
   f64.store offset=48
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=72
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load offset=292
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $91
   local.get $31
   i32.load offset=296
   f64.convert_i32_s
   f64.const 0.006
   f64.mul
   f64.add
   f64.add
   f64.store offset=72
   local.get $85
   i32.const 0
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $31
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $31
    i32.store offset=8
    local.get $31
    local.get $31
    f64.load offset=72
    f64.const 0.02
    f64.add
    f64.store offset=72
   end
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=64
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load offset=292
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $91
   local.get $31
   i32.load offset=296
   f64.convert_i32_s
   f64.const 0.007
   f64.mul
   f64.add
   f64.add
   f64.store offset=64
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=56
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load offset=316
   f64.convert_i32_s
   f64.const 0.01
   f64.mul
   local.set $91
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $91
   local.get $31
   i32.load offset=296
   f64.convert_i32_s
   f64.const 0.008
   f64.mul
   f64.add
   f64.add
   f64.store offset=56
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load
   f64.convert_i32_s
   f64.const 0.0014
   f64.mul
   f64.const 0.02
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load offset=4
   f64.convert_i32_s
   f64.const 0.0008
   f64.mul
   f64.add
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   f64.load offset=64
   f64.const 3
   f64.div
   f64.add
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=4
   i32.const 1
   i32.sub
   i32.const 100
   i32.div_s
   f64.convert_i32_s
   f64.const 0.02
   f64.mul
   f64.add
   f64.store offset=160
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $31
   f64.load offset=8
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   f64.const 0
   f64.store offset=136
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   i32.load offset=288
   i32.const 10
   i32.mul
   f64.convert_i32_s
   f64.const 100
   f64.add
   local.set $89
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=8
   local.get $31
   local.get $89
   local.get $31
   i32.load offset=4
   i32.const 1
   i32.sub
   i32.const 100
   i32.div_s
   f64.convert_i32_s
   f64.const 10
   f64.mul
   f64.add
   f64.store offset=144
   i32.const 0
   local.set $0
   loop $for-loop|00
    local.get $0
    local.get $32
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $31
     i32.store offset=4
     local.get $31
     local.get $1
     local.get $40
     local.get $86
     local.get $87
     local.get $88
     local.get $90
     local.get $39
     local.get $34
     local.get $33
     i32.const 0
     i32.gt_s
     local.get $35
     local.get $60
     local.get $61
     local.get $62
     local.get $71
     local.get $63
     local.get $64
     local.get $65
     local.get $66
     local.get $67
     local.get $68
     local.get $69
     local.get $73
     local.get $74
     local.get $76
     local.get $79
     local.get $80
     local.get $82
     call $assembly/evalKnox/knoxSim
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|00
    end
   end
   local.get $31
   global.set $assembly/evalKnox/lastKnox
   global.get $~lib/memory/__stack_pointer
   local.get $31
   i32.store offset=4
   local.get $31
   f64.load offset=448
   f64.const 60
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 44416
  i32.const 44464
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/evalKnox/getLastKnoxAvgStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=336
  f64.convert_i32_s
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxAvgTime (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=128
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  f64.const 60
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxMinStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=344
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxMaxStage (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=348
  f64.convert_i32_s
  f64.const 10
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxBossHpPercent (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=340
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/lastKnox
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=484
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/lastKnox
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=340
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/lastKnox
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=348
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/KNOX_ENEMIES
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.const 100
   i32.mul
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   local.set $5
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/lastKnox
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=484
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.load
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/lastKnox
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=340
   f64.convert_i32_s
   f64.div
   local.get $5
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalKnox/getLastKnoxBossKillRate (result f64)
  (local $0 i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store
  block $folding-inner0
   local.get $1
   i32.load offset=340
   i32.eqz
   br_if $folding-inner0
   i32.const -1
   local.set $1
   loop $for-loop|0
    local.get $0
    i32.const 10
    i32.lt_s
    if
     block $for-break0
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/lastKnox
      local.tee $3
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.load offset=484
      local.tee $3
      i32.store offset=4
      local.get $3
      local.get $0
      call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
      local.set $3
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store
      local.get $3
      i32.load offset=8
      global.get $~lib/memory/__stack_pointer
      global.get $assembly/evalKnox/lastKnox
      local.tee $4
      i32.store
      local.get $4
      i32.load offset=340
      i32.lt_s
      if
       local.get $0
       local.set $1
       br $for-break0
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|0
     end
    end
   end
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    i32.const 1
   else
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/lastKnox
    local.tee $0
    i32.store
    local.get $0
    i32.load offset=348
    local.get $1
    i32.const 1
    i32.add
    i32.const 1000
    i32.mul
    i32.lt_s
   end
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/lastKnox
   local.tee $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=484
   local.tee $0
   i32.store offset=4
   local.get $0
   local.get $1
   call $~lib/staticarray/StaticArray<assembly/evalBorge/Enemy>#__get
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=8
   f64.convert_i32_s
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/evalKnox/lastKnox
   local.tee $0
   i32.store
   local.get $0
   i32.load offset=340
   f64.convert_i32_s
   f64.div
   f64.const 100
   f64.mul
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  f64.const 0
 )
 (func $assembly/evalKnox/getLastKnoxMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=352
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=360
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=368
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=376
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  i32.load offset=340
  f64.convert_i32_s
  f64.div
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMinKnoxMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=384
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMaxKnoxMat1 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=392
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMinKnoxMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=400
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMaxKnoxMat2 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=408
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMinKnoxMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=416
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMaxKnoxMat3 (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=424
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMinKnoxXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=432
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastMaxKnoxXp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=440
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxMaxHp (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxAtk (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=24
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxRegen (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=40
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxDr (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=48
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxBlock (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=56
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxEffect (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=64
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxCharge (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=72
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxChargeGain (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=80
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxReload (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=88
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getLastKnoxSc (result f64)
  (local $0 i32)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store
  local.get $0
  f64.load offset=160
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxProgressSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=488
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxProgressStageAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=488
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=488
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxProgressCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=488
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=488
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=488
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxDeathsByStageAndReviveSize (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=492
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxDeathKeyAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=492
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const -1
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=492
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxDeathCountAt (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=492
  local.tee $1
  i32.store
  local.get $1
  call $"~lib/map/Map<i32,i32>#get:size"
  local.get $0
  i32.le_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=492
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  local.get $0
  call $~lib/array/Array<i32>#__get
  local.set $0
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load offset=492
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  call $"~lib/map/Map<i32,i32>#get"
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/evalKnox/getKnoxDeathsByStageAndReviveString (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 36
  memory.fill
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=492
  local.tee $0
  i32.store
  local.get $0
  call $"~lib/map/Map<i32,i32>#get:size"
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 36
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 8032
   return
  end
  i32.const 8064
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8064
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/evalKnox/lastKnox
  local.tee $2
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.load offset=492
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  call $"~lib/map/Map<i32,i32>#keys"
  local.tee $2
  i32.store offset=12
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/array/Array<i32>#get:length
   local.get $1
   i32.gt_s
   if
    local.get $1
    i32.const 0
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     i32.const 8144
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.const 8144
     call $~lib/string/String.__concat
     local.tee $0
     i32.store offset=8
    end
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    local.get $2
    local.get $1
    call $~lib/array/Array<i32>#__get
    local.set $4
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/evalKnox/lastKnox
    local.tee $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load offset=492
    local.tee $3
    i32.store
    local.get $3
    local.get $4
    call $"~lib/map/Map<i32,i32>#get"
    local.set $5
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.div_s
    call $~lib/number/I32#toString
    local.tee $3
    i32.store offset=16
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.const 1000
    i32.rem_s
    call $~lib/number/I32#toString
    local.tee $4
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $5
    call $~lib/number/I32#toString
    local.tee $5
    i32.store offset=24
    global.get $~lib/memory/__stack_pointer
    i32.const 11488
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=32
    i32.const 11492
    local.get $3
    i32.store
    i32.const 11488
    local.get $3
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11488
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=32
    i32.const 11500
    local.get $4
    i32.store
    i32.const 11488
    local.get $4
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11488
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=32
    i32.const 11508
    local.get $5
    i32.store
    i32.const 11488
    local.get $5
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 11488
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    i32.const 8176
    i32.store offset=32
    i32.const 11488
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    local.get $0
    local.get $3
    call $~lib/string/String.__concat
    local.tee $0
    i32.store offset=8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 10096
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 10096
  call $~lib/string/String.__concat
  local.tee $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1056
   i32.const 1568
   i32.const 52
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/staticarray/StaticArray<i32>#constructor (result i32)
  (local $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.const 15
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/staticarray/StaticArray<f64>#constructor (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 11620
  i32.lt_s
  if
   i32.const 44416
   i32.const 44464
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $0
  i32.const 134217727
  i32.gt_u
  if
   i32.const 1056
   i32.const 1104
   i32.const 51
   i32.const 60
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 3
  i32.shl
  i32.const 21
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
)
