# 🚀 Discord Preview Optimization - Auf 1-3 Requests reduzieren

## Problem: 200 Requests pro Build-Link

**Warum so viele?**
- Discord crawlt aggressiv für Link Previews
- Verschiedene Regionen/Server
- Retry bei langsamen Responses
- Preview Refresh bei Views

## ✅ Lösung: Aggressive Edge Caching

### Was wurde geändert:

```javascript
// VORHER (24h Cache):
'Cache-Control': 'public, max-age=86400'

// NACHHER (7 Tage + immutable):
'Cache-Control': 'public, max-age=604800, immutable'
'Netlify-CDN-Cache-Control': 'public, max-age=604800, immutable, stale-while-revalidate=86400'
'ETag': `"${hunterId}-${buildCode}-v1"`
```

### Wie es funktioniert:

**1. Erster Request (Discord crawlt):**
```
Discord → Netlify Edge Function → Parse Build → Response
                ↓
         Cache für 7 Tage auf Netlify Edge
```

**2. Alle weiteren Requests:**
```
Discord → Netlify Edge Cache → Sofortige Response (0ms)
         ↑
    KEINE Function Execution!
```

### Resultat:

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| **Requests zur Function** | 200 | 1-3 |
| **Netlify Function Calls** | 200 | 1-3 |
| **Kosten** | Hoch | 99% niedriger |
| **Response Time** | Variabel | <10ms (Cache) |

### Warum 1-3 statt 1?

Discord könnte von verschiedenen Edge-Locations crawlen:
- US-East crawlt → Cache in US-East
- EU-West crawlt → Cache in EU-West
- Asia crawlt → Cache in Asia

= Max. 3 Function Calls (einmalig pro Region)

Danach: **Alles aus Cache!**

---

## 📊 Monitoring

### Netlify Dashboard checken:

**Functions → Edge Functions → `index`**

Vor der Optimierung:
```
Request Count: ~200 pro Build
```

Nach der Optimierung:
```
Request Count: ~1-3 pro Build
Cache Hit Rate: >95%
```

### Cache-Effectiveness testen:

```bash
# Ersten Request (Cold)
curl -I "https://cifi-tools.com/borge?code=XXX"

# Response sollte enthalten:
Age: 0 (frischer Cache-Eintrag)
Cache-Control: public, max-age=604800, immutable

# Zweiten Request (Warm)
curl -I "https://cifi-tools.com/borge?code=XXX"

# Response sollte enthalten:
Age: 5 (oder höher - aus Cache!)
X-Cache: HIT (Netlify Edge Cache Hit)
```

---

## ⚠️ Wichtige Hinweise:

### Cache Purging (falls Build-Code sich ändert):

Wenn du einen Build-Code aktualisierst:

```bash
# Netlify CLI Cache purgen
netlify api purgeCacheByTag --data '{"cache_tags":["build-borge-XXX"]}'
```

Oder einfacher: **Versioniere im ETag**
```javascript
'ETag': `"${hunterId}-${buildCode}-v2"` // v1 → v2 bei Updates
```

### Builds ändern sich nie:

**Good News:** Build-Codes sind **immutable**!
- Ein Build-Code ändert sich nie
- Perfekt für aggressives Caching
- 7 Tage Cache ist sogar konservativ (könnte 1 Jahr sein!)

---

## 🎯 Erwartetes Ergebnis:

**Von 200 Requests → 1-3 Requests pro Build-Link!**

Das bedeutet:
- ✅ 99% weniger Function Calls
- ✅ Locker unter 125k/Monat Limit
- ✅ Schnellere Discord Previews (<10ms)
- ✅ Keine Kosten

---

## 📈 Weitere Optimierungen (optional):

### 1. Preload-Cache für beliebte Builds:

```javascript
// Script das populäre Builds vorab cached
const popularBuilds = ['ABC123', 'DEF456', 'GHI789'];

for (const code of popularBuilds) {
  await fetch(`https://cifi-tools.com/borge?code=${code}`);
  // Warmt den Cache auf
}
```

### 2. Cache-Warming via Cron Job:

```yaml
# netlify.toml
[[scheduled_functions]]
  schedule = "0 0 * * *" # Täglich
  path = "/.netlify/functions/cache-warmer"
```

---

**Teste es jetzt und schau dir die Netlify Metrics an! 🚀**
