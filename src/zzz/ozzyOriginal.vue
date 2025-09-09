<script>
// Growing Banner + Escaping Popups
window.addEventListener('DOMContentLoaded', function() {
  let popupAttempts = 0;
  let isEscaping = false;
  
  // === GROWING BANNER ===
  function makeHeaderAnnoyinglyLarge() {
    const startDate = new Date('2025-09-08');
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    const baseHeight = 32;
    const dailyGrowth = 20;
    const newHeight = baseHeight + (daysPassed * dailyGrowth);
    
    const banners = document.querySelectorAll('header div');
    for (let banner of banners) {
      if (banner.textContent && banner.textContent.includes('has moved to a new domain')) {
        banner.style.height = newHeight + 'px';
        banner.style.paddingTop = Math.floor(newHeight / 3) + 'px';
        banner.style.paddingBottom = Math.floor(newHeight / 3) + 'px';
        banner.style.fontSize = Math.min(18 + daysPassed * 1, 32) + 'px';
        banner.style.fontWeight = 'bold';
        banner.style.transition = 'all 0.5s ease-in-out';
        banner.style.zIndex = '9999';
        banner.style.background = 'linear-gradient(90deg, #8B5CF6, #3B82F6)';
        banner.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
        banner.style.animation = 'pulse 2s infinite';
        
        console.log(`🚨 GROWING BANNER Day ${daysPassed}: ${newHeight}px`);
        break;
      }
    }
  }
  
  // === ESCAPING POPUP SYSTEM ===
  function createEscapingPopup() {
    if (isEscaping) return; // Only one popup at a time
    
    popupAttempts++;
    isEscaping = true;
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'escape-popup-' + Date.now();
    popup.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff4444, #ff6666);
        color: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(255, 68, 68, 0.5);
        z-index: 99999;
        min-width: 350px;
        text-align: center;
        border: 3px solid #ff2222;
        font-family: Arial, sans-serif;
        font-size: 16px;
        transition: all 0.2s ease-out;
      ">
        <div style="font-size: 24px; margin-bottom: 15px;">⚠️ URGENT NOTICE</div>
        <div style="margin-bottom: 15px; line-height: 1.4;">
          <strong>This old domain is deprecated!</strong><br>
          Please switch to the new domain to continue using CIFI Tools.<br>
          Your data backup is recommended before the migration.
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <button id="backup-btn-${popup.id}" style="
            background: #22c55e;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          ">📦 Make Backup First</button>
          <button id="close-btn-${popup.id}" style="
            background: #6b7280;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          ">❌ Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    const popupElement = popup.firstElementChild;
    const closeBtn = document.getElementById(`close-btn-${popup.id}`);
    const backupBtn = document.getElementById(`backup-btn-${popup.id}`);
    
    let escapeCount = 0;
    const maxEscapes = 8; // After 8 escapes, popup stays
    
    // Backup button - actually helpful
    backupBtn.addEventListener('click', function() {
      alert('Go to Settings → Export Data to make a backup of your CIFI Tools data!');
      // Don't close popup, just help them
    });
    
    // Close button - THE ESCAPING PART
    function setupEscaping() {
      closeBtn.addEventListener('mouseenter', function() {
        if (escapeCount < maxEscapes && popupAttempts < 5) {
          escapeCount++;
          
          // Random new position
          const maxX = window.innerWidth - popupElement.offsetWidth - 20;
          const maxY = window.innerHeight - popupElement.offsetHeight - 20;
          const newX = Math.random() * maxX + 10;
          const newY = Math.random() * maxY + 10;
          
          popupElement.style.left = newX + 'px';
          popupElement.style.top = newY + 'px';
          popupElement.style.transform = 'none';
          
          // Add shake effect
          popupElement.style.animation = 'shake 0.5s ease-in-out';
          
          console.log(`🏃‍♂️ Popup escaped! Attempt ${escapeCount}/${maxEscapes}`);
          
          // Taunt messages
          const taunts = [
            "😏 Not so fast!",
            "🏃‍♂️ Gotta catch me first!",
            "😈 Nice try!",
            "🎯 Almost got me!",
            "😂 Keep trying!",
            "🚀 Whoosh!",
            "🎪 Peek-a-boo!",
            "⚡ Too slow!"
          ];
          
          const taunt = document.createElement('div');
          taunt.style.cssText = `
            position: fixed;
            top: ${newY - 30}px;
            left: ${newX + 50}px;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            z-index: 100000;
            pointer-events: none;
            animation: fadeOut 2s ease-out forwards;
          `;
          taunt.textContent = taunts[escapeCount - 1] || "😵 You're persistent!";
          document.body.appendChild(taunt);
          
          setTimeout(() => taunt.remove(), 2000);
        }
      });
      
      closeBtn.addEventListener('click', function() {
        if (escapeCount >= maxEscapes || popupAttempts >= 5) {
          // Finally closable
          popup.remove();
          isEscaping = false;
          
          // Show next popup after delay
          setTimeout(() => {
            if (popupAttempts < 5) {
              createEscapingPopup();
            } else {
              console.log('🎉 User survived all popups!');
            }
          }, 10000 + (popupAttempts * 5000)); // Longer delays each time
        } else {
          // Still escaping
          closeBtn.style.background = '#ef4444';
          setTimeout(() => {
            closeBtn.style.background = '#6b7280';
          }, 200);
        }
      });
    }
    
    setupEscaping();
  }
  
  // Add required CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
      50% { transform: scale(1.02); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6); }
      100% { transform: scale(1); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px) rotate(-1deg); }
      75% { transform: translateX(5px) rotate(1deg); }
    }
    @keyframes fadeOut {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Start the chaos
  makeHeaderAnnoyinglyLarge();
  setInterval(makeHeaderAnnoyinglyLarge, 30000);
  
  // First popup after 5 seconds
  setTimeout(createEscapingPopup, 5000);
});
</script>