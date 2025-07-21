/**
 * Google OAuth Authentication Service
 * Firefox-optimized version
 */

export class AuthService {
  constructor() {
    this.googleAuth = null;
    this.isInitialized = false;
    this.user = null;
    this.pendingPromise = null; // Speichere das aktuelle Promise
  }

  async initGoogleAuth() {
    if (this.isInitialized) return;

    try {
      // Prüfe ob User bereits eingeloggt ist (Page Refresh)
      const storedUser = localStorage.getItem('cifi-auth-user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', this.user.email);
        this.onAuthStateChanged?.(this.user);
      }

      // Prüfe Environment Variable
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('VITE_GOOGLE_CLIENT_ID environment variable is missing');
      }

      console.log('Initializing Google Auth with Client ID:', clientId);
      console.log('Current origin:', window.location.origin);
      console.log('Current hostname:', window.location.hostname);
      console.log('Browser User Agent:', navigator.userAgent);
      console.log('Is Chrome:', navigator.userAgent.includes('Chrome'));
      
      // Google Identity Services laden
      await this.loadGoogleIdentityScript();
      
      // Warte kurz für Firefox Kompatibilität
      await this.waitForGoogleReady();
      
      // OAuth konfigurieren mit Chrome/Firefox Kompatibilität
      const isChrome = navigator.userAgent.includes('Chrome');
      console.log('Configuring Google OAuth for:', isChrome ? 'Chrome' : 'Firefox');
      
      const config = {
        client_id: clientId,
        callback: this.handleGoogleCallback.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false,
        ux_mode: 'popup',
        context: 'signin'
      };

      // Chrome-spezifische Konfiguration
      if (isChrome) {
        config.use_fedcm_for_prompt = false; // Chrome FedCM manchmal problematisch
        config.itp_support = true;
      }

      // Nur für localhost
      if (window.location.hostname === 'localhost') {
        config.state_cookie_domain = 'localhost';
      }

      console.log('Google OAuth config:', config);
      
      window.google.accounts.id.initialize(config);

      this.isInitialized = true;
      console.log('Google Auth initialized successfully');

    } catch (error) {
      console.error('Google Auth initialization failed:', error);
      throw error; // Kein Mock-Fallback mehr
    }
  }

  async loadGoogleIdentityScript() {
    return new Promise((resolve, reject) => {
      // Prüfe ob bereits geladen (aber möglicherweise nicht verfügbar)
      if (window.google?.accounts?.id) {
        console.log('Google Identity Services already loaded');
        resolve();
        return;
      }

      // Entferne eventuell vorhandene Scripts
      const existingScripts = document.querySelectorAll('script[src*="accounts.google.com"]');
      existingScripts.forEach(script => script.remove());

      console.log('Loading Google Identity Script for Chrome compatibility...');
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Identity Script loaded successfully');
        // Chrome braucht manchmal einen zusätzlichen Moment
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            console.warn('Google Identity Services not ready after script load');
            reject(new Error('Google Identity Services not available after script load'));
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Identity Script:', error);
        reject(new Error('Google Identity Script failed to load'));
      };
      
      document.head.appendChild(script);
    });
  }

  async waitForGoogleReady() {
    // Chrome braucht oft länger und ist sensibler
    let attempts = 0;
    const maxAttempts = 100; // 10 Sekunden max für Chrome
    const isChrome = navigator.userAgent.includes('Chrome');

    return new Promise((resolve, reject) => {
      const checkReady = () => {
        if (window.google?.accounts?.id?.initialize) {
          console.log('Google Identity Services ready (all methods available)');
          resolve();
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          console.error('Google Identity Services timeout after', attempts * 100, 'ms');
          console.log('Available:', !!window.google);
          console.log('Accounts:', !!window.google?.accounts);
          console.log('ID:', !!window.google?.accounts?.id);
          console.log('Initialize:', !!window.google?.accounts?.id?.initialize);
          
          reject(new Error('Google Identity Services not ready after timeout'));
          return;
        }

        // Chrome braucht längere Intervalle
        const interval = isChrome ? 100 : 50;
        setTimeout(checkReady, interval);
      };

      checkReady();
    });
  }

  async handleGoogleCallback(response) {
    try {
      console.log('Google callback received:', response);
      
      // JWT Token von Google dekodieren
      const payload = this.decodeJWT(response.credential);
      
      // User-Daten extrahieren
      this.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        token: response.credential
      };

      // User persistent speichern für Page Refresh
      localStorage.setItem('cifi-auth-user', JSON.stringify(this.user));

      // Trigger für App (Pinia Store Update)
      this.onAuthStateChanged?.(this.user);
      
      console.log('Google Sign-In successful:', this.user.email);
      
      // Entferne den Button modal falls vorhanden
      const existing = document.getElementById('temp-google-signin');
      if (existing) {
        document.body.removeChild(existing);
      }
      
      // Löse das pendende Promise auf
      if (this.pendingPromise) {
        this.pendingPromise.resolve(this.user);
        this.pendingPromise = null;
      }
      
      return this.user;
    } catch (error) {
      console.error('Google callback failed:', error);
      
      // Reject das pendende Promise
      if (this.pendingPromise) {
        this.pendingPromise.reject(error);
        this.pendingPromise = null;
      }
      
      throw error;
    }
  }

  async signIn() {
    if (!this.isInitialized) {
      await this.initGoogleAuth();
    }

    return new Promise((resolve, reject) => {
      // Speichere Promise für Callback
      this.pendingPromise = { resolve, reject };
      
      // Timeout nach 30 Sekunden
      const timeout = setTimeout(() => {
        if (this.pendingPromise) {
          this.pendingPromise.reject(new Error('Google Sign-In timeout after 30 seconds'));
          this.pendingPromise = null;
        }
      }, 30000);

      // Clear timeout wenn erfolgreich
      const originalResolve = resolve;
      const originalReject = reject;
      
      this.pendingPromise.resolve = (user) => {
        clearTimeout(timeout);
        originalResolve(user);
      };
      
      this.pendingPromise.reject = (error) => {
        clearTimeout(timeout);
        originalReject(error);
      };

      try {
        // Google Sign-In trigger - direct button approach
        this.renderSignInButton();
      } catch (error) {
        console.error('Sign-In error:', error);
        this.pendingPromise.reject(error);
        this.pendingPromise = null;
      }
    });
  }

  renderSignInButton() {
    // Entferne vorherigen Button falls vorhanden
    const existing = document.getElementById('temp-google-signin');
    if (existing) {
      document.body.removeChild(existing);
    }

    // Chrome-spezifische Validierung
    if (!window.google?.accounts?.id?.renderButton) {
      console.error('Google Identity Services not properly loaded');
      // Versuche erneut zu laden
      this.initGoogleAuth().then(() => {
        setTimeout(() => this.renderSignInButton(), 500);
      }).catch(error => {
        console.error('Failed to reinitialize Google Auth:', error);
        if (this.pendingPromise) {
          this.pendingPromise.reject(error);
          this.pendingPromise = null;
        }
      });
      return;
    }

    // Erstelle temporären Container für Google Button
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'temp-google-signin';
    buttonDiv.style.position = 'fixed';
    buttonDiv.style.top = '50%';
    buttonDiv.style.left = '50%';
    buttonDiv.style.transform = 'translate(-50%, -50%)';
    buttonDiv.style.zIndex = '10000';
    buttonDiv.style.background = 'white';
    buttonDiv.style.padding = '20px';
    buttonDiv.style.borderRadius = '8px';
    buttonDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    // Titel hinzufügen
    const title = document.createElement('h3');
    title.textContent = 'Sign in with Google';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#333';
    title.style.textAlign = 'center';
    buttonDiv.appendChild(title);
    
    // Button Container
    const buttonContainer = document.createElement('div');
    buttonDiv.appendChild(buttonContainer);
    
    // Schließen Button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '10px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'none';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#666';
    closeBtn.onclick = () => {
      if (document.body.contains(buttonDiv)) {
        document.body.removeChild(buttonDiv);
      }
      // Reject das Promise wenn User schließt
      if (this.pendingPromise) {
        this.pendingPromise.reject(new Error('User closed sign-in dialog'));
        this.pendingPromise = null;
      }
    };
    buttonDiv.appendChild(closeBtn);
    
    document.body.appendChild(buttonDiv);

    try {
      console.log('Rendering Google button...');
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 250,
        type: 'standard' // Verhindert Popup-Blocker
      });
      console.log('Google button rendered successfully');
    } catch (error) {
      console.error('Failed to render Google button:', error);
      // Entferne den Dialog
      if (document.body.contains(buttonDiv)) {
        document.body.removeChild(buttonDiv);
      }
      // Reject pending promise
      if (this.pendingPromise) {
        this.pendingPromise.reject(error);
        this.pendingPromise = null;
      }
      return;
    }

    // Auto-remove nach 60 Sekunden
    setTimeout(() => {
      if (document.body.contains(buttonDiv)) {
        document.body.removeChild(buttonDiv);
      }
      // Timeout rejection
      if (this.pendingPromise) {
        this.pendingPromise.reject(new Error('Sign-in dialog timeout'));
        this.pendingPromise = null;
      }
    }, 60000);
  }

  async signOut() {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      this.user = null;
      
      // Entferne User aus localStorage
      localStorage.removeItem('cifi-auth-user');
      
      this.onAuthStateChanged?.(null);
      
      console.log('Google Sign-Out successful');
      return true;
    } catch (error) {
      console.error('Sign-Out error:', error);
      throw error;
    }
  }

  isSignedIn() {
    return !!this.user;
  }

  getCurrentUser() {
    return this.user;
  }

  // JWT Token decoder (ohne externe Bibliothek)
  decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }

  // Event Handler für Auth State Changes
  onAuthStateChanged = null;
}

// Export singleton instance
export const authService = new AuthService();
