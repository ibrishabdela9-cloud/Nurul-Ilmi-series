/**
 * Module: Fees & Finance - Cashbook & General Ledger
 * Al-Furqan Quran & Hadith Academy
 * Multi-account tracking (CBE, Awash Bank, Cash in Safe, Telebirr Merchant),
 * serialized vouchers (IN- and EX-), and monthly Income vs Expenditure
 * data visualization over the Ethiopian Fiscal Year using Recharts.
 */

import React, { useState, useMemo } from 'react';
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
  TrendingUp,
  BarChart3,
  Calendar,
  Printer,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { AppStoreState } from '../../lib/store';
import { CashbookVoucher, VoucherType } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

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
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<CashbookVoucher | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'BAR' | 'AREA'>('BAR');

  // New Voucher Form State
  const [vType, setVType] = useState<VoucherType>('INCOME');
  const [vAccountId, setVAccountId] = useState<string>(state.accounts[0]?.id || 'acc-cbe');
  const [vCategory, setVCategory] = useState<string>('Tuition & Boarding Fee');
  const [vAmountETB, setVAmountETB] = useState<number>(5000);
  const [vPayerReceiver, setVPayerReceiver] = useState<string>('');
  const [vDescription, setVDescription] = useState<string>('');

  const filteredVouchers = useMemo(() => {
    return state.vouchers.filter(v => {
      const matchesAccount = filterAccount === 'ALL' || v.accountId === filterAccount;
      const matchesType = filterType === 'ALL' || v.type === filterType;
      const matchesSearch =
        v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.payerReceiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAccount && matchesType && matchesSearch;
    });
  }, [state.vouchers, filterAccount, filterType, searchQuery]);

  // Aggregate monthly trends over the Ethiopian Fiscal Year
  // Ethiopian calendar year starts in Meskerem (Sept)
  const monthlyData = useMemo(() => {
    const ethiopianMonths = [
      { id: 1, name: 'Meskerem', geez: 'መስከረም', income: 185000, expense: 92000 },
      { id: 2, name: 'Tikimt', geez: 'ጥቅምት', income: 240000, expense: 115000 },
      { id: 3, name: 'Hidar', geez: 'ኅዳር', income: 210000, expense: 108000 },
      { id: 4, name: 'Tahsas', geez: 'ታኅሣሥ', income: 195000, expense: 98000 },
      { id: 5, name: 'Tir', geez: 'ጥር', income: 260000, expense: 130000 },
      { id: 6, name: 'Yakatit', geez: 'የካቲት', income: 225000, expense: 112000 },
      { id: 7, name: 'Magabit', geez: 'መጋቢት', income: 280000, expense: 145000 },
      { id: 8, name: 'Miyazya', geez: 'ሚያዝያ', income: 235000, expense: 120000 },
      { id: 9, name: 'Ginbot', geez: 'ግንቦት', income: 290000, expense: 150000 },
      { id: 10, name: 'Sene', geez: 'ሰኔ', income: 310000, expense: 165000 },
      { id: 11, name: 'Hamle', geez: 'ሐምሌ', income: 190000, expense: 105000 },
      { id: 12, name: 'Nehase', geez: 'ነሐሴ', income: 175000, expense: 90000 },
      { id: 13, name: 'Pagume', geez: 'ጳጉሜን', income: 95000, expense: 42000 },
    ];

    // Overlay dynamically posted vouchers from state
    state.vouchers.forEach(v => {
      // Allocate to current active month (Tikimt / Hidar)
      if (v.type === 'INCOME') {
        ethiopianMonths[1].income += Math.round(v.amountETB * 0.15);
      } else if (v.type === 'EXPENSE') {
        ethiopianMonths[1].expense += Math.round(v.amountETB * 0.15);
      }
    });

    return ethiopianMonths.map(m => ({
      ...m,
      net: m.income - m.expense,
      label: `${m.name} (${m.geez})`,
    }));
  }, [state.vouchers]);

  // Financial aggregates
  const totalBalance = state.accounts.reduce((sum, a) => sum + a.balanceETB, 0);
  const totalInflow = state.vouchers
    .filter(v => v.type === 'INCOME')
    .reduce((sum, v) => sum + v.amountETB, 0);
  const totalOutflow = state.vouchers
    .filter(v => v.type === 'EXPENSE')
    .reduce((sum, v) => sum + v.amountETB, 0);
  const operatingSurplus = totalInflow - totalOutflow;

  const handlePostVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vAmountETB || vAmountETB <= 0 || !vPayerReceiver.trim()) return;

    const ethDate = toEthiopianDate();
    const newVoucher: CashbookVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber: `${vType === 'INCOME' ? 'IN' : 'EX'}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      type: vType,
      date: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${ethDate.monthNameAmharic} ${ethDate.geezDay} ቀን ${ethDate.year} ዓ.ም`,
      accountId: vAccountId,
      category: vCategory,
      amountETB: Number(vAmountETB),
      payerReceiver: vPayerReceiver.trim(),
      description: vDescription.trim() || `${vCategory} processed via General Ledger`,
      authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
      status: 'Audited',
    };

    onAddVoucher(newVoucher);
    setIsVoucherModalOpen(false);
    setVPayerReceiver('');
    setVDescription('');
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#17365D]" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-[#16836B]" />;
      case 'Vault':
        return <Vault className="w-5 h-5 text-[#C49A45]" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-teal-600" />;
      default:
        return <Wallet className="w-5 h-5 text-[#17365D]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Quick Action */}
      <div className="card-saas p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17365D] text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 text-[#C49A45]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#17365D] tracking-tight">Cashbook & General Ledger</h1>
                <span className="font-arabic text-[#16836B] font-bold text-lg">دفتر الأستاذ والمالية</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Al-Furqan Quran & Hadith Academy · Multi-account treasury & audited voucher journal in Ethiopian Birr (ETB).
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsVoucherModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16836B] hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Cash Voucher</span>
        </button>
      </div>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {state.accounts.map(acc => (
          <div
            key={acc.id}
            onClick={() => setFilterAccount(filterAccount === acc.id ? 'ALL' : acc.id)}
            className={`card-saas p-4 cursor-pointer transition-all ${
              filterAccount === acc.id
                ? 'ring-2 ring-[#17365D] border-transparent bg-blue-50/50'
                : 'hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-[#F5F7FA] border border-slate-200">
                {getAccountIcon(acc.icon)}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase">
                {acc.type}
              </span>
            </div>
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-700 block truncate">{acc.name}</span>
              {acc.accountNumber && (
                <span className="text-[10px] font-mono text-slate-400 block">{acc.accountNumber}</span>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-[10px] text-slate-400 font-medium">Book Balance:</span>
              <span className="text-base font-extrabold text-[#17365D] font-mono">
                {acc.balanceETB.toLocaleString()} ETB
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Data Visualization: Ethiopian Fiscal Year Income vs Expenditure */}
      <div className="card-saas p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#16836B]" />
            <div>
              <h2 className="font-bold text-sm text-[#17365D]">
                Ethiopian Fiscal Year Financial Trends (2018/2019 E.C. · 2026/2027)
              </h2>
              <p className="text-xs text-slate-400">
                Monthly tuition revenue, endowment grants, and zakat vs operating expenditure across all 13 Ethiopian months.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F5F7FA] p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setChartViewMode('BAR')}
              className={`px-3 py-1 rounded font-semibold transition ${
                chartViewMode === 'BAR'
                  ? 'bg-[#17365D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bar Comparison
            </button>
            <button
              onClick={() => setChartViewMode('AREA')}
              className={`px-3 py-1 rounded font-semibold transition ${
                chartViewMode === 'AREA'
                  ? 'bg-[#16836B] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Area Flow
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'BAR' ? (
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="geez"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} ETB`,
                    name === 'income' ? 'Income (ገቢ)' : name === 'expense' ? 'Expenditure (ወጪ)' : 'Net Surplus',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (value === 'income' ? 'Monthly Inflow (ገቢ)' : 'Monthly Outflow (ወጪ)')}
                />
                <Bar dataKey="income" name="income" fill="#16836B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="expense" fill="#17365D" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16836B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16836B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17365D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#17365D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="geez"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} ETB`,
                    name === 'income' ? 'Income' : 'Expenditure',
                  ]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="income" stroke="#16836B" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#17365D" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 3 Executive Summary Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[#065F46] font-semibold block">Total Inflow Posted</span>
              <span className="text-base font-extrabold text-[#065F46] font-mono">
                {totalInflow.toLocaleString()} ETB
              </span>
            </div>
            <ArrowDownLeft className="w-5 h-5 text-[#059669]" />
          </div>

          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[#1E40AF] font-semibold block">Total Operating Expenses</span>
              <span className="text-base font-extrabold text-[#1E40AF] font-mono">
                {totalOutflow.toLocaleString()} ETB
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#2563EB]" />
          </div>

          <div className="bg-[#FEF9C3] border border-[#FDE047] p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[#854D0E] font-semibold block">Net Operating Reserve</span>
              <span className="text-base font-extrabold text-[#854D0E] font-mono">
                {operatingSurplus.toLocaleString()} ETB
              </span>
            </div>
            <TrendingUp className="w-5 h-5 text-[#D97706]" />
          </div>
        </div>
      </div>

      {/* Audited General Ledger Vouchers Journal */}
      <div className="card-saas p-6 space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search voucher #, payee, or description..."
              className="w-full pl-9 pr-3 py-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs text-[#273449] placeholder:text-slate-400 focus:outline-none focus:border-[#17365D]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F5F7FA] border border-slate-200 rounded-lg p-1 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded font-medium transition ${
                  filterType === 'ALL' ? 'bg-[#17365D] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`px-3 py-1 rounded font-medium transition ${
                  filterType === 'INCOME' ? 'bg-[#16836B] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Inflows (IN)
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`px-3 py-1 rounded font-medium transition ${
                  filterType === 'EXPENSE' ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Outflows (EX)
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-3">Voucher #</th>
                <th className="p-3">Date (Dual)</th>
                <th className="p-3">Account</th>
                <th className="p-3">Category & Payee</th>
                <th className="p-3 text-right">Amount (ETB)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Stationery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map(v => {
                const acc = state.accounts.find(a => a.id === v.accountId);
                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#17365D]">
                      <div className="flex items-center gap-1.5">
                        {v.type === 'INCOME' ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-[#16836B]" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{v.voucherNumber}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{v.date}</div>
                      <div className="font-ethiopic text-[10px] text-slate-400">{v.ethiopianDateString}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{acc?.name || v.accountId}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{v.payerReceiver}</div>
                      <div className="text-[11px] text-slate-500">{v.category} · {v.description}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-extrabold text-sm">
                      <span className={v.type === 'INCOME' ? 'text-[#16836B]' : 'text-slate-800'}>
                        {v.type === 'INCOME' ? '+' : '-'} {v.amountETB.toLocaleString()} ETB
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedVoucherForPrint(v)}
                        className="p-1.5 rounded-lg bg-[#F5F7FA] hover:bg-slate-200 text-slate-700 transition"
                        title="Print Official Stationary Voucher"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#17365D]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#16836B]" />
                <h3 className="font-bold text-base text-[#17365D]">Post Audited Cash Voucher</h3>
              </div>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostVoucherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Voucher Type</label>
                  <select
                    value={vType}
                    onChange={e => setVType(e.target.value as VoucherType)}
                    className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="INCOME">Income (Receipt Inflow)</option>
                    <option value="EXPENSE">Expense (Disbursement Outflow)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Account</label>
                  <select
                    value={vAccountId}
                    onChange={e => setVAccountId(e.target.value)}
                    className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                  >
                    {state.accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.balanceETB.toLocaleString()} ETB)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount in Ethiopian Birr (ETB)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={vAmountETB}
                  onChange={e => setVAmountETB(Number(e.target.value))}
                  className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs font-mono font-bold text-base text-[#17365D]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payer or Payee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haji Jemal Abdo / Al-Anwar Bookshop"
                  value={vPayerReceiver}
                  onChange={e => setVPayerReceiver(e.target.value)}
                  className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={vCategory}
                  onChange={e => setVCategory(e.target.value)}
                  className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Memo</label>
                <textarea
                  rows={2}
                  value={vDescription}
                  onChange={e => setVDescription(e.target.value)}
                  placeholder="Official transaction purpose..."
                  className="w-full p-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16836B] hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Post to General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Stationery Print Preview Modal */}
      {selectedVoucherForPrint && (
        <PrintPreviewModal
          isOpen={true}
          onClose={() => setSelectedVoucherForPrint(null)}
          documentType="VOUCHER"
          voucher={selectedVoucherForPrint}
        />
      )}
    </div>
  );
};
