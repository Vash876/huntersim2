# Discord Build Preview - Edge Function

## 📁 Dateien:
- `netlify/edge-functions/discord-preview.js` - Edge Function Code
- `netlify.toml` - Konfiguration (Edge Function Route)

## 🚀 Deployment:

```bash
git add netlify/edge-functions/discord-preview.js
git add netlify.toml
git commit -m "Add optimized Discord build preview with aggressive caching"
git push
```

Warte ~1 Minute bis Netlify deployed.

## 🧪 Testen:

### 1. Mit Discord User-Agent (simuliert Discord Crawl):
```bash
curl -H "User-Agent: Discordbot" "https://cifi-tools.com/borge?code=DEIN_BUILD_CODE"
```

**Erwartete Response:**
- HTML mit Meta-Tags für Discord Preview
- Cache-Headers mit 7 Tagen

### 2. Mit normalem Browser:
```bash
curl "https://cifi-tools.com/borge?code=DEIN_BUILD_CODE"
```

**Erwartete Response:**
- 302 Redirect zur Hauptseite
- Keine Edge Function Execution (spart Ressourcen)

### 3. Discord testen:
Poste in Discord:
```
https://cifi-tools.com/borge?code=DEIN_BUILD_CODE
```

**Erwartetes Verhalten:**
- Discord zeigt Preview mit Hunter Name + Level
- Erster Crawl: Edge Function wird ausgeführt
- Alle weiteren Crawls: Aus Cache (0 Function Calls)

## 📊 Monitoring:

**Netlify Dashboard → Edge Functions → `discord-preview`**

Nach 1-2 Tagen solltest du sehen:
- Requests: Viel weniger als vorher
- Cache Hit Rate: >95%
- Average Response Time: <10ms

## 🎯 Erwartetes Ergebnis:

**Von ~200 Requests pro Build → 1-3 Requests!**

- Erster Discord Crawl (US): 1 Request → Cache
- Erster Discord Crawl (EU): 1 Request → Cache  
- Erster Discord Crawl (Asia): 1 Request → Cache
- Alle weiteren: 0 Requests (Cache Hit)

## ⚙️ Wie es funktioniert:

1. **Discord crawlt Link** → User-Agent: "Discordbot"
2. **Edge Function erkennt Discord** → Generiert HTML mit Meta-Tags
3. **Response wird gecached** → 7 Tage auf Netlify Edge (global)
4. **Weitere Crawls** → Direkt aus Cache (kein Function Call)
5. **Normale Browser** → 302 Redirect zur App (kein Function Call)

## 🔧 Konfiguration:

### Cache-Duration anpassen:

In `discord-preview.js`:
```javascript
'Cache-Control': 'public, max-age=604800, immutable' // 7 Tage
```

Für längeren Cache:
```javascript
'Cache-Control': 'public, max-age=2592000, immutable' // 30 Tage
```

### Cache manuell löschen:

```bash
# Falls du einen Build-Code aktualisieren willst
netlify api purgeCacheByTag --data '{"cache_tags":["build-borge-ABC123"]}'
```

Oder erhöhe Version im ETag:
```javascript
'ETag': `"${hunterId}-${buildCode}-v2"` // v1 → v2
```

## ✅ Vorteile:

- ✅ 99% weniger Function Calls
- ✅ Kostenlos unter 125k/Monat Limit
- ✅ Schneller (<10ms aus Cache)
- ✅ Kein Bot nötig
- ✅ Funktioniert sofort nach Deploy

## 🆘 Troubleshooting:

**Preview wird nicht angezeigt:**
- Check ob Edge Function deployed ist (Netlify Dashboard)
- Teste mit curl + Discordbot User-Agent
- Check Netlify Logs für Errors

**Zu viele Requests:**
- Check Cache-Headers in Response
- Prüfe ob `immutable` Flag gesetzt ist
- Check Netlify Edge Cache Hit Rate

**Build-Level falsch:**
- Check `TALENT_INDICES` in `discord-preview.js`
- Teste Build-Code mit verschiedenen Huntern
- Prüfe ob `calculateBuildLevel()` korrekt arbeitet
