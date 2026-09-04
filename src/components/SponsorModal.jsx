import React, { useState, useEffect } from 'react';
import { Heart, X, ShieldCheck, Sparkles, CheckCircle2, Copy, Check, CreditCard, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const DONATION_TIERS = [
  { amount: 100, label: '₹100', desc: 'Sponsor AI Senses for 1 Month', isPopular: true },
  { amount: 250, label: '₹250', desc: 'Sponsor Vision & Hearing for 3 Months', isPopular: false },
  { amount: 500, label: '₹500', desc: 'Sponsor Full Saathi Suite for 6 Months', isPopular: false }
];

export default function SponsorModal({ isOpen, onClose, speakText }) {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [copiedPaymentId, setCopiedPaymentId] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  // Async helper to guarantee Razorpay SDK script availability before checkout
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      if (typeof document === 'undefined') {
        resolve(false);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('[Saathi Razorpay] SDK script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('[Saathi Razorpay] Failed to load SDK script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Pre-load script on mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  if (!isOpen) return null;

  const announce = (msg) => {
    setStatusAnnouncement(msg);
    if (speakText) speakText(msg);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(null);
    announce(`Initiating Razorpay checkout for ₹${selectedAmount}...`);

    // 1. Script Availability Check
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      console.error('[Saathi Razorpay Error] SDK script failed to load.');
      setPaymentError('Razorpay SDK failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    // 2. Payload Formatting (amount converted to paise)
    const amountInPaise = Math.round(Number(selectedAmount) * 100);
    const testKey = 'rzp_test_1DP5mmOlF5G5ag';

    // 4. Options & Event Handlers
    const options = {
      key: testKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Saathi Accessibility AI',
      description: `Sponsor AI Senses for People with Disabilities (₹${selectedAmount})`,
      image: 'https://cdn-icons-png.flaticon.com/512/3064/3064155.png',
      handler: function (response) {
        console.log('[Saathi Razorpay Payment Success]', response);
        const successData = {
          razorpay_payment_id: response.razorpay_payment_id || 'pay_test_' + Date.now(),
          amount: selectedAmount
        };
        setPaymentSuccess(successData);
        setIsProcessing(false);
        triggerConfetti();
        announce(`Payment of ₹${selectedAmount} successful! Payment ID: ${successData.razorpay_payment_id}. Thank you for empowering independence.`);
      },
      prefill: {
        name: 'Test',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#06b6d4'
      },
      modal: {
        ondismiss: function () {
          console.log('[Saathi Razorpay Modal Dismissed]');
          setIsProcessing(false);
          announce('Razorpay checkout modal closed.');
        }
      }
    };

    // 3. Instance Execution
    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('[Saathi Razorpay Payment Failed]', response.error);
        const errMsg = response.error?.description || 'Payment transaction failed or was cancelled.';
        setPaymentError(errMsg);
        setIsProcessing(false);
        announce(`Payment failed: ${errMsg}`);
      });
      rzp.open();
    } catch (err) {
      console.error('[Saathi Razorpay Open Exception]', err);
      setPaymentError('Failed to open Razorpay checkout modal: ' + (err.message || 'Unknown error'));
      setIsProcessing(false);
    }
  };

  const copyPaymentId = () => {
    if (paymentSuccess?.razorpay_payment_id) {
      navigator.clipboard.writeText(paymentSuccess.razorpay_payment_id);
      setCopiedPaymentId(true);
      setTimeout(() => setCopiedPaymentId(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="sponsor-modal-title"
      aria-modal="true"
    >
      <div 
        aria-live="assertive" 
        className="sr-only"
        aria-atomic="true"
      >
        {statusAnnouncement}
      </div>

      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close sponsor modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all focus:ring-2 focus:ring-cyan-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Heart className="w-7 h-7 text-pink-400 fill-pink-400/20 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Razorpay Buildathon Special</span>
            </div>
            <h2 id="sponsor-modal-title" className="text-xl sm:text-2xl font-black text-slate-100">
              Sponsor a Saathi User
            </h2>
          </div>
        </div>

        {/* SUCCESS RECEIPT STATE */}
        {paymentSuccess ? (
          <div className="space-y-5 py-2 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-100">
                Sponsorship Successful! 🎉
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
                Your ₹{paymentSuccess.amount} micro-donation has been processed via Razorpay. You've directly empowered a person with disabilities to use AI senses for 1 month!
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-2 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-wider">
                <span>Razorpay Receipt</span>
                <span className="text-emerald-400 font-bold">STATUS: PAID</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Payment ID:</span>
                <button
                  onClick={copyPaymentId}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-all"
                  title="Click to copy Payment ID"
                >
                  <span>{paymentSuccess.razorpay_payment_id}</span>
                  {copiedPaymentId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Amount Contributed:</span>
                <span className="text-slate-100 font-bold">₹{paymentSuccess.amount}.00</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentSuccess(null);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-base shadow-xl transition-all"
            >
              Done & Return to App
            </button>
          </div>
        ) : (
          /* DEFAULT DONATION SELECTION FORM */
          <div className="space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Help us keep universal accessibility free for millions. Every ₹100 contribution sponsors AI camera vision and speech synthesis for an Indian user in need.
            </p>

            {/* Tiers Selection */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Select Micro-Donation Amount:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DONATION_TIERS.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      announce(`Selected ₹${tier.amount} sponsorship level`);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] focus:ring-2 focus:ring-cyan-300 ${
                      selectedAmount === tier.amount
                        ? 'bg-cyan-950/80 border-cyan-400 text-slate-100 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {tier.isPopular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                    <div className="text-2xl font-black tracking-tight text-slate-100">
                      {tier.label}
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 leading-tight">
                      {tier.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-xs text-red-200 font-semibold">
                ⚠️ {paymentError}
              </div>
            )}

            {/* Security Badge & Razorpay Trigger */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Test Mode Active
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> UPI, Cards & NetBanking
                </span>
              </div>

              <button
                onClick={handleRazorpayCheckout}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-slate-950 font-black text-lg sm:text-xl shadow-2xl transition-all transform active:scale-98 focus:ring-4 focus:ring-cyan-300 flex items-center justify-center gap-2 min-h-[56px]"
              >
                {isProcessing ? (
                  <span>Connecting to Razorpay...</span>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Pay ₹{selectedAmount} with Razorpay</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-500">
                Secured by Razorpay • 100% Tax Exempted Micro-Sponsorship Flow
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
