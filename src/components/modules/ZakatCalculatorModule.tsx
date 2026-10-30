/**
 * Module 13: Fiqh Zakat Calculator
 * Interactive Shariah-compliant calculator applying the 85-gram pure gold Nisab threshold,
 * 2.5% Hawl liability calculations in Ethiopian Birr, and direct fund disbursement.
 */

import React, { useState } from 'react';
import {
  Coins,
  Scale,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HandHeart,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { CashbookVoucher } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';

interface ZakatCalculatorModuleProps {
  state: AppStoreState;
  onAddVoucher: (v: CashbookVoucher) => void;
  onNavigate: (module: any) => void;
}

export const ZakatCalculatorModule: React.FC<ZakatCalculatorModuleProps> = ({
  state,
  onAddVoucher,
  onNavigate,
}) => {
  // Config: 85 grams pure gold standard
  const [goldPricePerGramETB, setGoldPricePerGramETB] = useState<number>(6400); // Current market in Addis Ababa

  // Assets entry
  const [cashInHandETB, setCashInHandETB] = useState<number>(58400);
  const [cashInBanksETB, setCashInBanksETB] = useState<number>(1433250);
  const [goldValueETB, setGoldValueETB] = useState<number>(0);
  const [tradeMerchandiseETB, setTradeMerchandiseETB] = useState<number>(85000); // Books & educational assets for sale
  const [receivablesETB, setReceivablesETB] = useState<number>(31500); // Good collectible tuition fees

  // Liabilities entry
  const [immediateLiabilitiesETB, setImmediateLiabilitiesETB] = useState<number>(45000); // Electricity, supplier invoices due

  const [disbursedSuccess, setDisbursedSuccess] = useState<string | null>(null);

  // Calculations
  const nisabThresholdETB = 85 * goldPricePerGramETB;
  const totalGrossAssetsETB = cashInHandETB + cashInBanksETB + goldValueETB + tradeMerchandiseETB + receivablesETB;
  const netZakatableWealthETB = Math.max(0, totalGrossAssetsETB - immediateLiabilitiesETB);
  const isNisabReached = netZakatableWealthETB >= nisabThresholdETB;
  const zakatDueETB = isNisabReached ? Math.round(netZakatableWealthETB * 0.025) : 0;

  const handleSyncCurrentCashbook = () => {
    const safeAccount = state.accounts.find(a => a.id === 'acc-safe');
    const bankAccounts = state.accounts.filter(a => a.id !== 'acc-safe');

    if (safeAccount) setCashInHandETB(safeAccount.balanceETB);
    const totalBanks = bankAccounts.reduce((acc, a) => acc + a.balanceETB, 0);
    setCashInBanksETB(totalBanks);
  };

  const handleDisburseToZakatPool = () => {
    if (zakatDueETB <= 0) return;

    const eth = toEthiopianDate();
    const newVoucher: CashbookVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber: `EX-2026-${String(state.vouchers.length + 1).padStart(4, '0')}`,
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${eth.monthNameAmharic} ${eth.geezDay} ቀን ${eth.geezYear} ዓ.ም`,
      accountId: 'acc-cbe',
      category: 'Zakat al-Mal Disbursement',
      amountETB: zakatDueETB,
      payerReceiver: 'Hifz Orphan Sponsorship & Needy Students Fund',
      description: `Institutional 2.5% Zakat al-Mal calculation disbursement (Nisab: ${nisabThresholdETB.toLocaleString()} ETB)`,
      authorizedBy: 'Dr. Sheikh Zakaria Ababor (Mudir)',
      status: 'Audited',
    };

    onAddVoucher(newVoucher);
    setDisbursedSuccess(`Successfully posted voucher ${newVoucher.voucherNumber} for ${zakatDueETB.toLocaleString()} ETB to the Orphan & Zakat Pool.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Fiqh Zakat Calculator</h1>
            <span className="font-arabic text-amber-300 text-lg">حساب زكاة المال الشرعية</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated against the 85-gram pure gold Nisab threshold and 2.5% Hawl liability under classical Islamic jurisprudence.
          </p>
        </div>

        <button
          onClick={handleSyncCurrentCashbook}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync from Institutional Cashbook</span>
        </button>
      </div>

      {disbursedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{disbursedSuccess}</span>
          </div>
          <button
            onClick={() => onNavigate('charity_funds')}
            className="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
          >
            View Zakat Fund Pool
          </button>
        </div>
      )}

      {/* Primary Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs">
          {/* Gold Benchmark Setting */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-100 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Nisab Benchmark (85g 24K Gold)</span>
              </span>
              <span className="font-mono text-amber-300">
                Nisab: {nisabThresholdETB.toLocaleString()} ETB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-slate-400 block mb-1">Addis Ababa Gold Rate (ETB / Gram):</label>
                <input
                  type="number"
                  min={1000}
                  step={100}
                  value={goldPricePerGramETB}
                  onChange={e => setGoldPricePerGramETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono font-bold outline-none focus:border-emerald-500"
                />
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex flex-col justify-center">
                <div>Standard: 85 Grams (نصاب الذهب)</div>
                <div className="text-emerald-400 font-medium mt-0.5">
                  Threshold = 85 × {goldPricePerGramETB.toLocaleString()} = {nisabThresholdETB.toLocaleString()} ETB
                </div>
              </div>
            </div>
          </div>

          {/* Zakatable Assets Entry */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>1. Zakatable Assets (الأموال الزكوية)</span>
              <span className="font-mono text-emerald-400">
                Gross: {totalGrossAssetsETB.toLocaleString()} ETB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Cash in Hand / Main Campus Safe (ETB):</label>
                <input
                  type="number"
                  min={0}
                  value={cashInHandETB}
                  onChange={e => setCashInHandETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Cash in Banks & Digital Accounts (CBE, Awash, Telebirr):</label>
                <input
                  type="number"
                  min={0}
                  value={cashInBanksETB}
                  onChange={e => setCashInBanksETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Gold & Silver Value (ETB):</label>
                <input
                  type="number"
                  min={0}
                  value={goldValueETB}
                  onChange={e => setGoldValueETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Trade Merchandise / Books (ETB):</label>
                <input
                  type="number"
                  min={0}
                  value={tradeMerchandiseETB}
                  onChange={e => setTradeMerchandiseETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Good Receivables (ETB):</label>
                <input
                  type="number"
                  min={0}
                  value={receivablesETB}
                  onChange={e => setReceivablesETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Deductible Liabilities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="font-bold text-slate-100 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>2. Deductible Immediate Liabilities (الديون الواجبة)</span>
              <span className="font-mono text-rose-400">
                - {immediateLiabilitiesETB.toLocaleString()} ETB
              </span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Short-term debts due immediately, unpaid monthly utilities, and pending supply invoices:
              </label>
              <input
                type="number"
                min={0}
                value={immediateLiabilitiesETB}
                onChange={e => setImmediateLiabilitiesETB(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Summary & Fiqh Verdict (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950 border-2 border-emerald-700/80 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-800/80">
              <Scale className="w-5 h-5 text-amber-300" />
              <h2 className="font-bold text-base text-white">Fiqh Assessment & Liability</h2>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Gross Zakatable Assets:</span>
                <span className="font-mono font-bold text-white">{totalGrossAssetsETB.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center text-rose-300">
                <span>Less Immediate Debts:</span>
                <span className="font-mono font-bold">- {immediateLiabilitiesETB.toLocaleString()} ETB</span>
              </div>
              <div className="pt-2 border-t border-emerald-800/60 flex justify-between items-center font-bold text-sm text-amber-300">
                <span>Net Zakatable Wealth:</span>
                <span className="font-mono">{netZakatableWealthETB.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>85g Gold Nisab Baseline:</span>
                <span className="font-mono">{nisabThresholdETB.toLocaleString()} ETB</span>
              </div>
            </div>

            {/* Nisab Status Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isNisabReached
                  ? 'bg-emerald-900/40 border-emerald-600 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {isNisabReached ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {isNisabReached ? 'Nisab Reached (بلغ النصاب)' : 'Below Nisab Threshold'}
                </div>
                <div className="text-[11px]">
                  {isNisabReached
                    ? 'Net wealth exceeds the 85g gold threshold. 2.5% Zakat al-Mal is legally due if a lunar year (Hawl) has elapsed.'
                    : 'Wealth is below 85g gold equivalent. No mandatory Zakat al-Mal liability.'}
                </div>
              </div>
            </div>

            {/* Zakat Amount Due */}
            {isNisabReached && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/60 text-center space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  2.5% Mandatory Zakat al-Mal Due
                </div>
                <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
                  {zakatDueETB.toLocaleString()} <span className="text-sm font-normal text-slate-400">ETB</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            {isNisabReached && (
              <button
                onClick={handleDisburseToZakatPool}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
              >
                <HandHeart className="w-4 h-4 text-amber-300" />
                <span>Disburse to Orphan & Zakat Fund</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
