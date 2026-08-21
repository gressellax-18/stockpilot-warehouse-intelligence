import React, { useState } from 'react';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  Car, 
  Wifi, 
  Droplet, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Printer,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RECHARGE_PLANS } from '../data/products';
import { CompletedTransaction } from '../types';

interface BillsAndRechargeProps {
  onRecordTransaction: (tx: CompletedTransaction) => void;
}

type ServiceType = 'mobile' | 'electricity' | 'dth' | 'fastag' | 'broadband' | 'water';

export const BillsAndRecharge: React.FC<BillsAndRechargeProps> = ({ onRecordTransaction }) => {
  const [activeService, setActiveService] = useState<ServiceType>('mobile');

  // Mobile recharge states
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [operator, setOperator] = useState('Jio 5G');
  const [selectedPlanTab, setSelectedPlanTab] = useState<'popular' | 'unlimited' | 'data' | 'annual'>('popular');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-1');
  const [customAmount, setCustomAmount] = useState<string>('299');

  // Electricity bill states
  const [electricBoard, setElectricBoard] = useState('City Power & Distribution Corp');
  const [consumerId, setConsumerId] = useState('CA-9021884');
  const [electricAmount, setElectricAmount] = useState('84.50');

  // DTH states
  const [dthOperator, setDthOperator] = useState('Tata Play HD');
  const [smartCardId, setSmartCardId] = useState('3009841284');
  const [dthAmount, setDthAmount] = useState('350');

  // FASTag & Broadband
  const [vehicleNo, setVehicleNo] = useState('MH-02-EE-8899');
  const [fastagAmount, setFastagAmount] = useState('500');
  const [broadbandProvider, setBroadbandProvider] = useState('AeroFiber Gigabit');
  const [broadbandAmount, setBroadbandAmount] = useState('799');

  // Success Modal
  const [completedTx, setCompletedTx] = useState<CompletedTransaction | null>(null);

  const handleSelectPlan = (plan: typeof RECHARGE_PLANS[0]) => {
    setSelectedPlanId(plan.id);
    setCustomAmount(plan.price.toString());
  };

  const executePayment = (type: ServiceType) => {
    let title = '';
    let amount = 0;
    const details: Record<string, string | number> = {};

    if (type === 'mobile') {
      amount = parseFloat(customAmount) || 299;
      title = `Mobile Recharge (${operator})`;
      details['Mobile Number'] = mobileNumber;
      details['Operator'] = operator;
      details['Plan Category'] = selectedPlanTab.toUpperCase();
      details['Plan Validity'] = RECHARGE_PLANS.find(p => p.id === selectedPlanId)?.validity || '28 Days';
    } else if (type === 'electricity') {
      amount = parseFloat(electricAmount) || 84.50;
      title = `Electricity Bill Payment`;
      details['Utility Board'] = electricBoard;
      details['Consumer ID'] = consumerId;
      details['Billing Cycle'] = 'August 2026';
    } else if (type === 'dth') {
      amount = parseFloat(dthAmount) || 350;
      title = `DTH Recharge (${dthOperator})`;
      details['Operator'] = dthOperator;
      details['SmartCard ID'] = smartCardId;
    } else if (type === 'fastag') {
      amount = parseFloat(fastagAmount) || 500;
      title = `FASTag Toll Wallet Recharge`;
      details['Vehicle No'] = vehicleNo;
      details['Issuing Bank'] = 'OmniBank FASTag';
    } else if (type === 'broadband') {
      amount = parseFloat(broadbandAmount) || 799;
      title = `Broadband Internet Bill`;
      details['Provider'] = broadbandProvider;
      details['Speed'] = '300 Mbps Unlimited';
    } else {
      amount = 45;
      title = `Municipal Water Board Bill`;
      details['Connection ID'] = 'WTR-77821';
    }

    const newTx: CompletedTransaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      type: type === 'mobile' || type === 'dth' || type === 'fastag' ? 'recharge' : 'bill',
      title,
      amount,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Completed',
      details
    };

    onRecordTransaction(newTx);
    setCompletedTx(newTx);

    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const services = [
    { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'electricity', label: 'Electricity Bill', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'dth', label: 'DTH Satellite TV', icon: Tv, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'fastag', label: 'FASTag Recharge', icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'broadband', label: 'Broadband / Wi-Fi', icon: Wifi, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'water', label: 'Water Utilities', icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-violet-500/30 border border-violet-400/30 rounded-full px-3 py-1 text-xs font-semibold text-violet-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official BillPay & Instant Recharges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Bills, Recharges & Utility Payments
          </h1>
          <p className="text-sm text-slate-300">
            Zero convenience fee. Instant confirmation, instant digital invoice, and 100% bank-grade SSL secure processing.
          </p>
        </div>
      </div>

      {/* Services Grid Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {services.map((srv) => {
          const Icon = srv.icon;
          const isActive = activeService === srv.id;
          return (
            <button
              key={srv.id}
              id={`service-tab-${srv.id}`}
              onClick={() => setActiveService(srv.id as ServiceType)}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-white border-violet-600 shadow-md ring-2 ring-violet-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl ${srv.bg} ${srv.color} flex items-center justify-center mb-2 shadow-xs`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800">{srv.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Instant 0% Fee</span>
            </button>
          );
        })}
      </div>

      {/* Active Service Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        
        {/* --- MOBILE RECHARGE FORM --- */}
        {activeService === 'mobile' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Prepaid & Postpaid Mobile Recharge</h2>
                <p className="text-xs text-slate-500">Select your operator, enter 10-digit number, and pick recommended plans</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                5G Plans Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+1 / +91</span>
                  <input
                    type="tel"
                    id="mobile-number-input"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-violet-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Operator */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Telecom Operator
                </label>
                <select
                  id="telecom-operator-select"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-violet-500 outline-hidden cursor-pointer"
                >
                  <option value="Jio 5G">Jio True 5G</option>
                  <option value="Airtel 5G Plus">Airtel 5G Plus</option>
                  <option value="Vodafone Idea (Vi)">Vodafone Idea (Vi)</option>
                  <option value="BSNL 4G">BSNL National 4G</option>
                  <option value="Verizon / AT&T US">Verizon / AT&T US</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Recharge Amount ($ / ₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="recharge-amount-input"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="299"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:bg-white focus:border-violet-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Plans Browser */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Recommended Plan
                </h3>
                
                {/* Plan categories */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  {(['popular', 'unlimited', 'data', 'annual'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedPlanTab(tab)}
                      className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        selectedPlanTab === tab
                          ? 'bg-white text-violet-700 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {RECHARGE_PLANS.filter(p => p.category === selectedPlanTab).map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/50 shadow-xs ring-1 ring-violet-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-black text-slate-900">${plan.price}</span>
                          <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                            {plan.validity}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mb-1">
                          ⚡ {plan.data} • 📞 {plan.calls}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-violet-600">Select Plan</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Instant recharge confirmation via SMS & Email</span>
              </div>

              <button
                id="execute-mobile-recharge-btn"
                onClick={() => executePayment('mobile')}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-violet-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Proceed to Pay ${customAmount || '299'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- ELECTRICITY BILL FORM --- */}
        {activeService === 'electricity' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Electricity Bill Payment</h2>
                <p className="text-xs text-slate-500">Pay your municipal or private power distribution utility bill</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                0% Convenience Fee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Electricity Board / Provider
                </label>
                <select
                  value={electricBoard}
                  onChange={(e) => setElectricBoard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white outline-hidden cursor-pointer"
                >
                  <option value="City Power & Distribution Corp">City Power & Distribution Corp</option>
                  <option value="National Grid Energy Service">National Grid Energy Service</option>
                  <option value="State Electricity Distribution Ltd">State Electricity Distribution Ltd</option>
                  <option value="Metro Green Energy Power">Metro Green Energy Power</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Consumer Number / Account ID
                </label>
                <input
                  type="text"
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  placeholder="e.g. CA-9021884"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white outline-hidden"
                />
              </div>
            </div>

            {/* Bill Details Box */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Fetched Current Outstanding Bill</h4>
                  <p className="text-[11px] text-amber-700">Billing Cycle: Aug 1 - Aug 31 • Due Date: Sep 05, 2026</p>
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-amber-800 font-semibold">Total Amount Due:</span>
                <span className="text-xl font-black text-amber-950">${electricAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                id="execute-electricity-bill-btn"
                onClick={() => executePayment('electricity')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Pay Electricity Bill ${electricAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- DTH SATELLITE TV FORM --- */}
        {activeService === 'dth' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">DTH & Satellite TV Recharge</h2>
                <p className="text-xs text-slate-500">Instant channel activation within 60 seconds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  DTH Provider
                </label>
                <select
                  value={dthOperator}
                  onChange={(e) => setDthOperator(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-hidden"
                >
                  <option value="Tata Play HD">Tata Play HD</option>
                  <option value="Airtel Digital TV">Airtel Digital TV</option>
                  <option value="Dish TV Ultra">Dish TV Ultra</option>
                  <option value="Sun Direct HD">Sun Direct HD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  SmartCard / Subscriber ID
                </label>
                <input
                  type="text"
                  value={smartCardId}
                  onChange={(e) => setSmartCardId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Recharge Amount ($)
                </label>
                <input
                  type="number"
                  value={dthAmount}
                  onChange={(e) => setDthAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                id="execute-dth-recharge-btn"
                onClick={() => executePayment('dth')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-rose-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Recharge DTH ${dthAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- FASTAG TOLL RECHARGE --- */}
        {activeService === 'fastag' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">National FASTag Highway Toll Recharge</h2>
                <p className="text-xs text-slate-500">Top up your vehicle toll balance instantly across all national expressways</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. MH-02-EE-8899"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 uppercase outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Top-up Amount ($)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={fastagAmount}
                    onChange={(e) => setFastagAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-hidden"
                  />
                  {['200', '500', '1000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFastagAmount(amt)}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                id="execute-fastag-recharge-btn"
                onClick={() => executePayment('fastag')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Add ${fastagAmount} to FASTag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- BROADBAND / WI-FI & WATER --- */}
        {(activeService === 'broadband' || activeService === 'water') && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeService === 'broadband' ? 'High-Speed Broadband Internet Bill' : 'Municipal Water Utility Bill'}
                </h2>
                <p className="text-xs text-slate-500">Fast digital processing with zero late penalty guarantee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Account / Connection ID
                </label>
                <input
                  type="text"
                  defaultValue="FBR-88391002"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Amount Due ($)
                </label>
                <input
                  type="number"
                  value={activeService === 'broadband' ? broadbandAmount : '45'}
                  onChange={(e) => activeService === 'broadband' ? setBroadbandAmount(e.target.value) : null}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                id="execute-utility-bill-btn"
                onClick={() => executePayment(activeService)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Pay Bill & Get Invoice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SUCCESS RECEIPT MODAL */}
      {completedTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Payment Successful
            </span>

            <h3 className="text-xl font-black text-slate-900 mt-2">
              {completedTx.title}
            </h3>
            <p className="text-2xl font-black text-indigo-600 my-2">
              ${completedTx.amount.toFixed(2)}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 my-4 text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800">{completedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-800">{completedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-600">Verified & Active</span>
              </div>

              {Object.entries(completedTx.details).map(([key, val]) => (
                <div key={key} className="flex justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-slate-500">{key}:</span>
                  <span className="font-semibold text-slate-800">{val}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setCompletedTx(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
