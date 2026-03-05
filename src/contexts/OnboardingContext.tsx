import React, { createContext, useContext, useEffect, useState } from 'react';

type OnboardingContextValue = {
  isOnboarded: boolean;
  completeOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = 'payecho:isOnboarded';

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsOnboarded(true);
    }
  }, []);

  const completeOnboarding = () => {
    setIsOnboarded(true);
    window.localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <OnboardingContext.Provider value={{ isOnboarded, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}

