'use client';

import { useEffect, useState } from 'react';
import Clarity from '@microsoft/clarity';

// Get Clarity configuration from environment variables
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const ENABLE_CLARITY = process.env.NEXT_PUBLIC_ENABLE_CLARITY === 'true';

interface ClarityProps {
  projectId?: string;
  enabled?: boolean;
}

export default function ClarityProvider({ 
  projectId = CLARITY_PROJECT_ID, 
  enabled = ENABLE_CLARITY 
}: ClarityProps) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [clarityInitialized, setClarityInitialized] = useState(false);

  useEffect(() => {
    // Check for existing consent on mount
    const consentStatus = localStorage.getItem('cookie-consent');
    if (consentStatus) {
      setHasConsent(consentStatus === 'accepted');
    }

    // Listen for consent events
    const handleConsentGranted = () => {
      setHasConsent(true);
    };

    window.addEventListener('consentGranted', handleConsentGranted);
    
    return () => {
      window.removeEventListener('consentGranted', handleConsentGranted);
    };
  }, []);

  useEffect(() => {
    // Only initialize Clarity if we have consent and it's enabled
    if (enabled && hasConsent && projectId && projectId !== 'YOUR_CLARITY_PROJECT_ID' && !clarityInitialized) {
      console.log('Initializing Microsoft Clarity with consent - Project ID:', projectId);
      try {
        Clarity.init(projectId);
        setClarityInitialized(true);
        
        // Explicitly call consent to ensure Clarity knows we have permission
        Clarity.consent(true);
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    } else if (!enabled) {
      console.log('Microsoft Clarity disabled via environment variable');
    } else if (!hasConsent) {
      console.log('Microsoft Clarity waiting for user consent');
    } else if (!projectId || projectId === 'YOUR_CLARITY_PROJECT_ID') {
      console.log('Microsoft Clarity not initialized: Invalid or missing project ID');
    }
  }, [enabled, hasConsent, projectId, clarityInitialized]);

  // Handle consent changes
  useEffect(() => {
    if (hasConsent === false && clarityInitialized) {
      // User declined consent or revoked it
      console.log('Microsoft Clarity consent revoked');
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('consent', false);
      }
    }
  }, [hasConsent, clarityInitialized]);

  return null; // This component doesn't render anything
}

// Export utility functions for using Clarity API throughout your app
// These will only work when Clarity is properly initialized and has consent
export const clarityAPI = {
  // Check if Clarity is enabled, has consent, and available
  isEnabled: () => {
    const hasConsent = localStorage.getItem('cookie-consent') === 'accepted';
    return ENABLE_CLARITY && CLARITY_PROJECT_ID && CLARITY_PROJECT_ID !== 'YOUR_CLARITY_PROJECT_ID' && hasConsent;
  },

  // Identify API - for custom user identification
  identify: (
    customId: string,
    customSessionId?: string,
    customPageId?: string,
    friendlyName?: string
  ) => {
    if (clarityAPI.isEnabled()) {
      Clarity.identify(customId, customSessionId, customPageId, friendlyName);
    }
  },

  // Custom tags API - for applying arbitrary tags to sessions
  setTag: (key: string, value: string | string[]) => {
    if (clarityAPI.isEnabled()) {
      Clarity.setTag(key, value);
    }
  },

  // Custom events API - for tracking specific user actions
  event: (eventName: string) => {
    if (clarityAPI.isEnabled()) {
      Clarity.event(eventName);
    }
  },

  // Cookie consent API - for managing cookie consent
  consent: (consent: boolean = true) => {
    if (clarityAPI.isEnabled()) {
      Clarity.consent(consent);
    }
  },

  // Upgrade session API - for prioritizing specific sessions
  upgrade: (reason: string) => {
    if (clarityAPI.isEnabled()) {
      Clarity.upgrade(reason);
    }
  },

  // Helper to revoke consent and clear cookies
  revokeConsent: () => {
    localStorage.setItem('cookie-consent', 'declined');
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('consent', false);
    }
  }
};