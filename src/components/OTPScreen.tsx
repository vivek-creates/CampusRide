import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { EmblemLogo } from './EmblemLogo';
import { useApp } from '../context/AppContext';

interface OTPScreenProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OTPScreen: React.FC<OTPScreenProps> = ({ email, onSuccess, onBack }) => {
  const { t } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isSuccess) return;
    setError(null);

    // Only allow numbers
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Handle single character
    const char = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-validate on 6th digit entered
    if (index === 5 || newDigits.every(d => d !== '')) {
      const code = newDigits.join('');
      validateCode(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSuccess) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const codeChars = pastedData.slice(0, 6).split('');
    const newDigits = [...digits];
    codeChars.forEach((ch, idx) => {
      newDigits[idx] = ch;
    });
    setDigits(newDigits);

    if (codeChars.length >= 6) {
      validateCode(newDigits.join(''));
    } else {
      inputRefs.current[codeChars.length]?.focus();
    }
  };

  const validateCode = (code: string) => {
    const DEMO_CODE = '123456';

    if (code === DEMO_CODE) {
      setIsSuccess(true);
      setError(null);
      // Wait for success animation before navigating to Home
      setTimeout(() => {
        onSuccess();
      }, 1100);
    } else {
      setError(t('incorrectCode'));
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 600);
    }
  };

  const handleFillDemoCode = () => {
    const demo = ['1', '2', '3', '4', '5', '6'];
    setDigits(demo);
    validateCode('123456');
  };

  return (
    <div className="min-h-screen app-bg flex flex-col justify-between max-w-md mx-auto relative px-6 py-8 overflow-hidden select-none">
      {/* Top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-[#FF6A00]/20 via-[#FF790F]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header back button */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full app-card app-text-primary flex items-center justify-center hover:border-[#FF6A00] transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full app-card text-[#FF9D2E]">
          {t('demoVerificationBadge')}
        </span>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-6">
        <div className="flex justify-center mb-6">
          <EmblemLogo size="md" glow={true} />
        </div>

        <h1 className="text-2xl font-bold app-text-primary text-center">{t('verifyCodeTitle')}</h1>
        <p className="text-sm app-text-secondary text-center mt-2 px-2">
          {t('verifyCodeSubtitle')}
          <br />
          <span className="app-text-primary font-medium">{email}</span>
        </p>

        {/* 6 Digit Input Boxes */}
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center gap-2 mt-8 max-w-xs mx-auto w-full"
        >
          {digits.map((digit, idx) => {
            const isFilled = digit !== '';
            let borderClass = 'app-border focus:border-[#FF6A00] app-input';

            if (isSuccess) {
              borderClass = 'border-[#35D07F] bg-[#35D07F]/15 text-[#35D07F] shadow-[0_0_15px_rgba(53,208,127,0.35)]';
            } else if (error) {
              borderClass = 'border-[#FF4D4D] bg-[#FF4D4D]/10 app-text-primary';
            } else if (isFilled) {
              borderClass = 'border-[#FF790F] app-card app-text-primary';
            }

            return (
              <input
                key={idx}
                ref={el => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isSuccess}
                className={`w-12 h-14 rounded-xl text-center text-xl font-bold transition-all duration-200 outline-none ${borderClass}`}
              />
            );
          })}
        </motion.div>

        {/* Status Message */}
        <div className="min-h-12 flex items-center justify-center mt-5">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-[#35D07F] font-semibold text-sm bg-[#35D07F]/10 px-4 py-2 rounded-full border border-[#35D07F]/30"
              >
                <CheckCircle2 size={18} className="animate-bounce" />
                <span>{t('verifiedSuccessfully')}</span>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[#FF4D4D] text-xs font-medium bg-[#FF4D4D]/10 px-3.5 py-1.5 rounded-full border border-[#FF4D4D]/30"
              >
                <AlertCircle size={15} />
                <span>{error}</span>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs app-text-muted"
              >
                {t('autoVerifyHint')}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Demo Helper Button */}
        <div className="mt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={handleFillDemoCode}
            className="text-xs text-[#FF9D2E] hover:text-[#FFA63D] bg-[#FF9D2E]/10 border border-[#FF9D2E]/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck size={14} />
            <span>{t('autoFillDemoCode')}</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-xs app-text-muted">
          {t('didNotReceiveCode')}
        </p>
      </div>
    </div>
  );
};
