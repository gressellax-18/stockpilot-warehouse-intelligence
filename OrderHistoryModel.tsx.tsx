import React from 'react';
import { X, Clock, CheckCircle, Printer, FileText, ShoppingBag, Zap, CreditCard } from 'lucide-react';
import { CompletedTransaction } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: CompletedTransaction[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        id="history-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 p-6 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Activity & Order History</h2>
              <p className="text-xs text-slate-500">{transactions.length} recorded purchases & recharges</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {transactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Clock className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No orders or recharge transactions recorded yet.</p>
              <p className="text-slate-400 mt-0.5">Your verified orders and utility payments will appear here with printable receipts.</p>
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {tx.type === 'order' ? (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                    ) : tx.type === 'bill' ? (
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                      <span className="text-[10px] text-slate-500">{tx.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">${tx.amount.toFixed(2)}</span>
                    <span className="block text-[10px] font-bold text-emerald-600">{tx.status}</span>
                  </div>
                </div>

                {/* Details Pills */}
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
                  <span className="font-mono text-slate-500 font-semibold">Ref ID: {tx.id}</span>
                  {Object.entries(tx.details).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400">{k}: </span>
                      <strong className="text-slate-800">{v}</strong>
                    </div>
                  ))}
                </div>

                {/* Itemized Products List (for store orders) */}
                {tx.items && tx.items.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ordered Products ({tx.items.reduce((s, i) => s + i.quantity, 0)} Units)
                    </span>
                    <div className="space-y-1.5">
                      {tx.items.map((item, idx) => (
                        <div key={`${item.product.id}-${idx}`} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="font-semibold text-slate-800 truncate max-w-xs">{item.product.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({item.product.sku})</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Warehouse Dispatch</span>
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Tax Invoice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
