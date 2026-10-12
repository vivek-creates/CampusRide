import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { EmblemLogo } from './EmblemLogo';
import { OTPScreen } from './OTPScreen';
import { StorageService } from '../services/storageService';
import { useApp } from '../context/AppContext';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { t } = useApp();
  const [email, setEmail] = useState('mrvivekdubey2006@gmail.com');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid college email address');
      return;
    }
    setEmailError(null);
    setStep('otp');
  };

  const handleGoogleDemoLogin = () => {
    // Direct demo login with Google
    const demoEmail = 'mrvivekdubey2006@gmail.com';
    const username = demoEmail.split('@')[0];
    StorageService.setSession({
      email: demoEmail,
      username,
      isAuthenticated: true,
      loginTime: Date.now(),
      isDemoUser: true
    });
    onLoginSuccess(demoEmail);
  };

  const handleOTPSuccess = () => {
    const username = email.split('@')[0];
    StorageService.setSession({
      email,
      username,
      isAuthenticated: true,
      loginTime: Date.now(),
      isDemoUser: true
    });
    onLoginSuccess(email);
  };

  if (step === 'otp') {
    return (
      <OTPScreen
        email={email}
        onSuccess={handleOTPSuccess}
        onBack={() => setStep('email')}
      />
    );
  }

  return (
    <div className="min-h-screen app-bg flex flex-col justify-between max-w-md mx-auto relative overflow-hidden select-none">
      {/* Background Ambient Glow with Breathing Animation */}
      <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-gradient-to-b from-[#FF6A00]/25 via-[#FF790F]/10 to-transparent blur-[80px] animate-breathing-glow" />
      </div>

      {/* Subtle Star / Particle Diagonal Streaks */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-96" viewBox="0 0 400 400" fill="none">
          <line x1="20" y1="80" x2="160" y2="40" stroke="#FF790F" strokeWidth="0.8" strokeDasharray="3 7" opacity="0.6" />
          <line x1="280" y1="120" x2="380" y2="90" stroke="#FFA63D" strokeWidth="0.8" opacity="0.4" />
          <circle cx="80" cy="110" r="1.5" fill="#FFF" opacity="0.7" />
          <circle cx="320" cy="70" r="1.5" fill="#FF790F" opacity="0.9" />
          <circle cx="210" cy="40" r="1.2" fill="#FFF" opacity="0.6" />
        </svg>
      </div>

      {/* TOP SECTION: Artwork, Wordmark, Taglines */}
      <div className="relative z-10 pt-14 pb-8 flex flex-col items-center justify-center px-6 text-center">
        {/* Glowing Emblem Box with breathing orange glow */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-5"
        >
          <div className="animate-breathing-glow rounded-3xl p-1">
            <EmblemLogo size="lg" glow={true} />
          </div>
        </motion.div>

        {/* Wordmark: Campus in White/Primary, Ride in Orange */}
        <div className="flex items-center tracking-tight mb-2">
          <span className="text-3xl font-extrabold app-text-primary">Campus</span>
          <span className="text-3xl font-extrabold text-[#FF6A00] ml-0.5">Ride</span>
        </div>

        {/* Taglines */}
        <p className="text-sm font-medium app-text-primary tracking-wide">
          Know your bus. Know your bay.
        </p>
        <p className="text-xs app-text-secondary mt-0.5">
          Reach home easier.
        </p>
      </div>

      {/* BOTTOM SHEET / CARD */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 app-secondary rounded-t-[36px] app-border border-t px-6 pt-7 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.4)]"
      >
        <div className="mb-5">
          <h2 className="text-2xl font-bold app-text-primary tracking-tight">{t('loginTitle')}</h2>
          <p className="text-xs app-text-secondary mt-1">
            {t('loginSubtitle')}
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {/* Email Input Field */}
          <div>
            <div className="relative flex items-center">
              <div className="absolute left-4 app-text-muted pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                id="college-email-input"
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setEmailError(null);
                }}
                placeholder={t('emailPlaceholder')}
                className="w-full h-13 pl-11 pr-4 rounded-full app-input app-text-primary text-sm placeholder:app-text-muted focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-all outline-none"
                required
              />
            </div>
            {emailError && (
              <p className="text-xs text-[#FF4D4D] mt-1.5 ml-4 font-medium">
                {emailError}
              </p>
            )}
          </div>

          {/* Continue Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-13 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF790F] to-[#FF6A00] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,106,0,0.45)] hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110 active:brightness-95"
          >
            <span>{t('continueBtn')}</span>
            <ArrowRight size={17} />
          </motion.button>
        </form>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="app-divider border-t w-full" />
          <span className="app-secondary px-3 text-[11px] font-semibold tracking-wider app-text-muted">
            {t('orDivider')}
          </span>
          <div className="app-divider border-t w-full" />
        </div>

        {/* Continue with Google (Demo) */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleDemoLogin}
          className="w-full h-13 rounded-full app-card hover:border-[#FF6A00]/50 app-text-primary font-semibold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          {/* Google 4-color SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('continueGoogle')}</span>
        </motion.button>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 mt-5 text-center px-4">
          <Lock size={14} className="text-[#FF9D2E] shrink-0" />
          <span className="text-[11px] app-text-secondary leading-tight">
            {t('securityNotice')}
          </span>
        </div>

        {/* Terms Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] app-text-muted leading-relaxed">
            {t('termsFooter')}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
