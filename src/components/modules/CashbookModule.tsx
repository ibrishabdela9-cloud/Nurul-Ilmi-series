/**
 * Module 11: Cashbook & General Ledger
 * Audited multi-account tracking (CBE, Awash Bank, Cash in Safe, Telebirr Merchant),
 * serialized vouchers (IN- and EX-), and atomic balance ledger.
 */

import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Landmark,
  Vault,
  Smartphone,
  Search,
  Filter,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { CashbookVoucher, VoucherType } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';

interface CashbookModuleProps {
  state: AppStoreState;
  onAddVoucher: (voucher: CashbookVoucher) => void;
}

export const CashbookModule: React.FC<CashbookModuleProps> = ({
  state,
  onAddVoucher,
}) => {
  const [filterAccount, setFilterAccount] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Voucher Form State
  const [vType, setVType] = useState<VoucherType>('INCOME');
  const [vAccountId, setVAccountId] = useState<string>(state.accounts[0]?.id || 'acc-cbe');
  const [vCategory, setVCategory] = useState<string>('Tuition & Boarding Fee');
  const [vAmountETB, setVAmountETB] = useState<number>(5000);
  const [vPayerReceiver, setVPayerReceiver] = useState<string>('');
  const [vDescription, setVDescription] = useState<string>('');

  const filteredVouchers = state.vouchers.filter(v => {
    const matchesAccount = filterAccount === 'ALL' || v.accountId === filterAccount;
    const matchesType = filterType === 'ALL' || v.type === filterType;
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.payerReceiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAccount && matchesType && matchesSearch;
  });

  const handlePostVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vAmountETB <= 0 || !vPayerReceiver.trim()) return;

    const eth = toEthiopianDate();
    const prefix = vType === 'INCOME' ? 'IN' : vType === 'EXPENSE' ? 'EX' : 'TR';
    const nextVoucherNumber = `${prefix}-2026-${String(state.vouchers.length + 1).padStart(4, '0')}`;

    const newVoucher: CashbookVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber: nextVoucherNumber,
      type: vType,
      date: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${eth.monthNameAmharic} ${eth.geezDay} ቀን ${eth.geezYear} ዓ.ም`,
      accountId: vAccountId,
      category: vCategory,
      amountETB: vAmountETB,
      payerReceiver: vPayerReceiver.trim(),
      description: vDescription.trim() || `${vCategory} transaction`,
      authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
      status: 'Audited',
    };

    onAddVoucher(newVoucher);
    setIsVoucherModalOpen(false);
    setVPayerReceiver('');
    setVDescription('');
  };

  const getAccountIcon = (name: string) => {
    if (name.includes('Commercial Bank')) return <Building2 className="w-5 h-5 text-emerald-400" />;
    if (name.includes('Awash')) return <Landmark className="w-5 h-5 text-amber-400" />;
    if (name.includes('Telebirr')) return <Smartphone className="w-5 h-5 text-teal-400" />;
    return <Vault className="w-5 h-5 text-indigo-400" />;
  };

  const totalLiquidityETB = state.accounts.reduce((acc, a) => acc + a.balanceETB, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Cashbook & General Ledger</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የጥሬ ገንዘብና የባንክ ሂሳብ መዝገብ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Double-entry multi-account tracking across CBE, Awash Bank, Main Campus Safe, and Telebirr with serialized vouchers.
          </p>
        </div>

        <button
          onClick={() => setIsVoucherModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Post Audited Voucher</span>
        </button>
      </div>

      {/* Account Balances Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {state.accounts.map(acc => (
          <div
            key={acc.id}
            className="board-card rounded-2xl p-5 flex flex-col justify-between text-xs shadow-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{acc.name}</div>
                {acc.accountNumber && (
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Acc: {acc.accountNumber}
                  </div>
                )}
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                {getAccountIcon(acc.name)}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Audited Balance</div>
              <div className="text-xl font-extrabold text-amber-300 font-mono mt-0.5">
                {acc.balanceETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-slate-400">ETB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="board-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by voucher number (e.g. IN-2026-0031), description, payer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAccount}
            onChange={e => setFilterAccount(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Accounts (ሁሉንም)</option>
            {state.accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income (ገቢ)</option>
            <option value="EXPENSE">Expense (ወጪ)</option>
            <option value="TRANSFER">Internal Transfer (ዝውውር)</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="board-card rounded-2xl overflow-hidden shadow-xl text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Voucher No</th>
              <th className="py-3 px-4 font-semibold">Date & Ge'ez</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Account</th>
              <th className="py-3 px-4 font-semibold">Payer / Beneficiary</th>
              <th className="py-3 px-4 font-semibold">Category & Description</th>
              <th className="py-3 px-4 font-semibold text-right">Amount (ETB)</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredVouchers.map(v => {
              const account = state.accounts.find(a => a.id === v.accountId);
              return (
                <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{v.voucherNumber}</td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-mono">{v.date}</div>
                    <div className="font-ethiopic text-[10px] text-amber-300/80">{v.ethiopianDateString}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        v.type === 'INCOME'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {v.type === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      <span>{v.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{account?.name || 'Account'}</td>
                  <td className="py-3 px-4 font-medium text-white">{v.payerReceiver}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{v.category}</div>
                    <div className="text-[11px] text-slate-400">{v.description}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={v.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}>
                      {v.type === 'INCOME' ? '+' : '-'} {v.amountETB.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                      {v.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Post Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-sm text-white">Post Serialized Financial Voucher</h2>
              </div>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostVoucherSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Voucher Type:</label>
                  <select
                    value={vType}
                    onChange={e => setVType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="INCOME">INCOME (ገቢ ቫውቸር)</option>
                    <option value="EXPENSE">EXPENSE (ወጪ ቫውቸር)</option>
                    <option value="TRANSFER">TRANSFER (የውስጥ ዝውውር)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Account:</label>
                  <select
                    value={vAccountId}
                    onChange={e => setVAccountId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                  >
                    {state.accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category:</label>
                <input
                  type="text"
                  required
                  value={vCategory}
                  onChange={e => setVCategory(e.target.value)}
                  placeholder="e.g. Tuition Fee, Faculty Honorarium, Electricity Bill"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Amount (ETB):</label>
                <input
                  type="number"
                  min={1}
                  step={50}
                  required
                  value={vAmountETB}
                  onChange={e => setVAmountETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-base font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payer or Beneficiary Name:</label>
                <input
                  type="text"
                  required
                  value={vPayerReceiver}
                  onChange={e => setVPayerReceiver(e.target.value)}
                  placeholder="e.g. Haji Nurredin Kassim or Al-Nur Bookshop"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Memo:</label>
                <textarea
                  rows={2}
                  value={vDescription}
                  onChange={e => setVDescription(e.target.value)}
                  placeholder="Details for auditing review..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Post to Audited General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
