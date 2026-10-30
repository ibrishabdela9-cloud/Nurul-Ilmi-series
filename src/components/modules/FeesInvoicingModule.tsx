/**
 * Module 8: Fees & Invoicing (ETB)
 * Decimal-safe tuition invoicing, partial payments, Telebirr and CBE Birr transaction tracking,
 * automatic cashbook synchronization, and printable Ethiopian stamped receipts.
 */

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Smartphone,
  Building2,
  Printer,
  X,
  CreditCard,
  Stamp,
  Download,
} from 'lucide-react';
import { AppStoreState } from '../../lib/store';
import { FeeInvoice, PaymentMethod, CashbookVoucher } from '../../types';
import { toEthiopianDate } from '../../lib/ethiopian-calendar';
import { generateInvoicePDF, downloadPDF } from '../../lib/pdf-generator';

interface FeesInvoicingModuleProps {
  state: AppStoreState;
  onAddInvoice: (inv: FeeInvoice) => void;
  onRecordPayment: (invoiceId: string, amountETB: number, method: PaymentMethod, txRef: string) => void;
  onAddVoucher: (v: CashbookVoucher) => void;
}

export const FeesInvoicingModule: React.FC<FeesInvoicingModuleProps> = ({
  state,
  onAddInvoice,
  onRecordPayment,
  onAddVoucher,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Telebirr');
  const [payTxRef, setPayTxRef] = useState<string>('');

  // New Invoice Modal state
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState<string>(state.students[0]?.id || '');
  const [newTerm, setNewTerm] = useState<string>('Term 1 (2026/27)');
  const [newAmountETB, setNewAmountETB] = useState<number>(12500);
  const [newDueDate, setNewDueDate] = useState<string>('2026-11-15');

  // Receipt Printable State
  const [printableReceipt, setPrintableReceipt] = useState<{ invoice: FeeInvoice; student: any } | null>(null);

  const filteredInvoices = state.invoices.filter(inv => {
    const student = state.students.find(s => s.id === inv.studentId);
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student && (student.fullNameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayment = (inv: FeeInvoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balanceETB);
    setPayTxRef(inv.paymentMethod === 'Telebirr' ? 'TB-' + Math.floor(1000000000 + Math.random() * 9000000000) : 'CBEB-' + Math.floor(1000000 + Math.random() * 9000000));
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || payAmount <= 0) return;

    onRecordPayment(selectedInvoice.id, payAmount, payMethod, payTxRef);

    // Sync with Cashbook: automatically post income voucher
    const eth = toEthiopianDate();
    const student = state.students.find(s => s.id === selectedInvoice.studentId);
    const voucherNumber = `IN-2026-${String(state.vouchers.length + 10).padStart(4, '0')}`;

    let targetAccountId = 'acc-safe';
    if (payMethod === 'Telebirr') targetAccountId = 'acc-telebirr';
    else if (payMethod === 'Commercial Bank of Ethiopia' || payMethod === 'CBE Birr') targetAccountId = 'acc-cbe';
    else if (payMethod === 'Awash Bank') targetAccountId = 'acc-awash';

    const newVoucher: CashbookVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber,
      type: 'INCOME',
      date: new Date().toISOString().split('T')[0],
      ethiopianDateString: `${eth.monthNameAmharic} ${eth.geezDay} ቀን ${eth.geezYear} ዓ.ም`,
      accountId: targetAccountId,
      category: 'Tuition & Boarding Fee',
      amountETB: payAmount,
      payerReceiver: `${student?.fullNameEnglish || 'Student'} (${student?.rollNo || ''})`,
      description: `Settlement for ${selectedInvoice.invoiceNumber} via ${payMethod} (Ref: ${payTxRef})`,
      authorizedBy: 'Sheikh Dawud Abdo (Treasurer)',
      status: 'Audited',
    };

    onAddVoucher(newVoucher);

    // Prepare printable receipt
    if (student) {
      setPrintableReceipt({
        invoice: {
          ...selectedInvoice,
          amountPaidETB: selectedInvoice.amountPaidETB + payAmount,
          balanceETB: Math.max(0, selectedInvoice.balanceETB - payAmount),
          status: selectedInvoice.balanceETB - payAmount <= 0 ? 'Paid' : 'Partial',
          paymentMethod: payMethod,
          transactionRef: payTxRef,
          officialReceiptNumber: `RCP-ET-${Math.floor(1000 + Math.random() * 9000)}`,
        },
        student,
      });
    }

    setIsPaymentModalOpen(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const nextInvNo = `INV-2026-${String(state.invoices.length + 101)}`;
    const newInv: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: nextInvNo,
      studentId: newStudentId,
      termOrMonth: newTerm,
      amountETB: newAmountETB,
      amountPaidETB: 0,
      balanceETB: newAmountETB,
      dueDate: newDueDate,
      status: 'Pending',
    };
    onAddInvoice(newInv);
    setIsNewInvoiceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Fees & Invoicing (Ethiopian Birr - ETB)</h1>
            <span className="font-ethiopic text-amber-300 text-sm">የትምህርት ክፍያና ደረሰኝ</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Decimal-safe tuition invoicing, partial payments, Telebirr & CBE Birr settlement, and automated cashbook reconciliation.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student, roll number, invoice number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Paid">Paid (የተከፈለ)</option>
            <option value="Partial">Partial (በከፊል የተከፈለ)</option>
            <option value="Pending">Pending (ያልተከፈለ)</option>
            <option value="Overdue">Overdue (ጊዜው ያለፈበት)</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Invoice No</th>
              <th className="py-3 px-4 font-semibold">Student & Roll No</th>
              <th className="py-3 px-4 font-semibold">Term / Period</th>
              <th className="py-3 px-4 font-semibold text-right">Total (ETB)</th>
              <th className="py-3 px-4 font-semibold text-right">Paid (ETB)</th>
              <th className="py-3 px-4 font-semibold text-right">Balance (ETB)</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredInvoices.map(inv => {
              const student = state.students.find(s => s.id === inv.studentId);
              return (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{student?.fullNameEnglish || 'Unknown'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{student?.rollNo}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{inv.termOrMonth}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">
                    {inv.amountETB.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                    {inv.amountPaidETB.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">
                    {inv.balanceETB.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : inv.status === 'Partial'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          const doc = generateInvoicePDF(inv, student);
                          downloadPDF(doc, `Nurul_Ilmi_Invoice_${inv.invoiceNumber}.pdf`);
                        }}
                        className="p-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 hover:text-white transition-colors"
                        title="Download official PDF invoice via jsPDF"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                      {inv.balanceETB > 0 && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                        >
                          Pay (ክፈል)
                        </button>
                      )}
                      {inv.amountPaidETB > 0 && (
                        <button
                          onClick={() => setPrintableReceipt({ invoice: inv, student })}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Print Official Stamped Ethiopian Birr Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-teal-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Settlement Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-sm text-white">Record Fee Settlement</h2>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Invoice:</span>
                <span className="font-mono text-amber-300 font-bold">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Remaining Balance:</span>
                <span className="font-mono text-rose-400 font-bold">{selectedInvoice.balanceETB.toLocaleString()} ETB</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Amount to Settle (ETB):</label>
                <input
                  type="number"
                  min={1}
                  max={selectedInvoice.balanceETB}
                  value={payAmount}
                  onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono text-sm font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Settlement Method:</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Telebirr">Telebirr (ቴሌብር Merchant 88219)</option>
                  <option value="CBE Birr">CBE Birr (የኢትዮጵያ ንግድ ባንክ)</option>
                  <option value="Commercial Bank of Ethiopia">CBE Account Deposit (1000293847291)</option>
                  <option value="Awash Bank">Awash Bank Transfer</option>
                  <option value="Cash in Safe">Main Campus Cash in Safe</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Transaction Ref / Slip Number:</label>
                <input
                  type="text"
                  required
                  value={payTxRef}
                  onChange={e => setPayTxRef(e.target.value)}
                  placeholder="e.g. TB-9827364102 or CBE-TRANS-928"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Post Payment & Sync Cashbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Ethiopian Birr Stamped Receipt Modal */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Official Ethiopian Birr Cash Receipt</h2>
              <button
                onClick={() => setPrintableReceipt(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Paper Surface */}
            <div className="print-surface bg-white text-slate-900 p-6 rounded-xl border-2 border-emerald-900 shadow-xl space-y-4 text-xs font-sans">
              <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-3">
                <div className="space-y-0.5">
                  <div className="font-arabic text-xl font-bold text-emerald-950">نور العلم لتحفيظ القرآن الكريم</div>
                  <div className="font-bold text-sm text-slate-900 uppercase">Nurul Ilmi Integrated Institutional Center</div>
                  <div className="font-ethiopic font-semibold text-xs text-amber-900">የኑሩል ዒልሚ የቁርኣን ሒፍዝና የኢስላማዊ ጥናት ማዕከል</div>
                  <div className="text-[10px] text-slate-600">Addis Ababa, Ethiopia · EAT UTC+3 · Official Stamped Receipt</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-emerald-900">
                    {printableReceipt.invoice.officialReceiptNumber || 'RCP-ET-9941'}
                  </div>
                  <div className="text-[10px] text-slate-600">Date: {printableReceipt.invoice.lastPaymentDate || new Date().toISOString().split('T')[0]}</div>
                  <div className="font-ethiopic text-[10px] text-amber-800">
                    {toEthiopianDate().formattedAmharic}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
                <div>
                  <div>Received From (የከፋይ ስም): <strong className="text-slate-900">{printableReceipt.student?.fullNameEnglish}</strong></div>
                  <div>የተማሪው ሙሉ ስም: <strong className="font-ethiopic text-slate-900">{printableReceipt.student?.fullNameAmharic}</strong></div>
                  <div>Roll Number: <strong className="font-mono text-emerald-900">{printableReceipt.student?.rollNo}</strong></div>
                </div>
                <div>
                  <div>Payment For: <strong>{printableReceipt.invoice.termOrMonth}</strong></div>
                  <div>Settlement Channel: <strong>{printableReceipt.invoice.paymentMethod || 'Telebirr'}</strong></div>
                  <div>Transaction Ref: <strong className="font-mono text-slate-800">{printableReceipt.invoice.transactionRef || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-sm">
                <span className="font-semibold text-emerald-950">Total Amount Settled (የተከፈለው ገንዘብ መጠን):</span>
                <span className="font-mono font-extrabold text-emerald-900 text-base">
                  {printableReceipt.invoice.amountPaidETB.toLocaleString()} ETB
                </span>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                Amount in Words: {printableReceipt.invoice.amountPaidETB.toLocaleString()} Ethiopian Birr Only.
              </div>

              {/* Signatures & Official Stamp */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-300 text-[10px]">
                <div className="space-y-4">
                  <div>Cashier / Collector: Sheikh Dawud Abdo (Treasurer)</div>
                  <div>Authorized Signature: ____________________________</div>
                </div>

                <div className="w-24 h-24 rounded-full border-4 border-dashed border-emerald-900 flex flex-col items-center justify-center p-1 text-center text-emerald-950 font-bold select-none rotate-[-8deg]">
                  <div className="font-arabic text-[10px]">نور العلم</div>
                  <div className="text-[7px] uppercase tracking-wider">OFFICIAL RECEIPT</div>
                  <div className="text-[6px]">Addis Ababa Campus</div>
                  <div className="font-ethiopic text-[6px]">ክፍያ ተፈጽሟል</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintableReceipt(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (printableReceipt) {
                    const doc = generateInvoicePDF(printableReceipt.invoice, printableReceipt.student);
                    downloadPDF(doc, `Nurul_Ilmi_Invoice_${printableReceipt.invoice.invoiceNumber}.pdf`);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF (jsPDF)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Generate Student Fee Invoice</h2>
              <button
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Student:</label>
                <select
                  value={newStudentId}
                  onChange={e => setNewStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                >
                  {state.students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullNameEnglish} ({st.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Term / Month:</label>
                <input
                  type="text"
                  required
                  value={newTerm}
                  onChange={e => setNewTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Invoice Amount (ETB):</label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={newAmountETB}
                  onChange={e => setNewAmountETB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 font-mono text-sm font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Due Date:</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-md"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
