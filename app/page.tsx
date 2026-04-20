"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// টাইপস্ক্রিপ্ট এরর দূর করার জন্য ইন্টারফেস ডিফাইন করা
interface Translation {
  title: string;
  entryTab: string;
  adminTab: string;
  name: string;
  id: string;
  dept: string;
  phone: string;
  pos: string;
  program: string;
  provider: string;
  submit: string;
  loading: string;
  approve: string;
  empty: string;
  date: string;
  switchBtn: string;
  newEntryBtn: string;
  successMsg: string;
  footerText: string;
  authorName: string;
  club: string;
  loginError: string;
}

export default function RibbonSystem() {
  const [view, setView] = useState('form'); 
  const [language, setLanguage] = useState<'bn' | 'en'>('bn'); // টাইপ নির্দিষ্ট করা
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    date: '', name: '', studentId: '', department: '', phone: '', position: '', program: '', provider: ''
  });

  const scriptURL = 'https://script.google.com/macros/s/AKfycbx8BIZBqlgiVuiShDnpp-CgaA9d6zfRrcWKoIE0OdPK_I1OPENhR5MF20Q4UotLAXaxJQ/exec';

  const ADMIN_CREDENTIALS = {
    username: "admin_diups",
    password: "diups_blackmagic"
  };

  const t: Record<'bn' | 'en', Translation> = {
    bn: { 
      title: "রিবন ম্যানেজমেন্ট - #Team_DIUPS", entryTab: "এন্ট্রি ফর্ম", adminTab: "এডমিন ভিউ", 
      name: "নাম", id: "আইডি নং", dept: "ডিপার্টমেন্ট", phone: "ফোন নম্বর", 
      pos: "ক্লাব পজিশন", program: "প্রোগ্রাম", provider: "কার থেকে নেওয়া", 
      submit: "সাবমিট করুন", loading: "প্রসেসিং...", approve: "কনফার্ম", 
      empty: "কোনো পেন্ডিং রিবন নেই", date: "তারিখ", switchBtn: "English",
      newEntryBtn: "নতুন এন্ট্রি", successMsg: "সফলভাবে জমা হয়েছে!",
      footerText: "তৈরি করেছেন", authorName: "তানভীর ইমন", club: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি ফটোগ্রাফিক সোসাইটি",
      loginError: "ভুল ইউজারনেম বা পাসওয়ার্ড!"
    },
    en: { 
      title: "Ribbon Management - #Team_DIUPS", entryTab: "Entry Form", adminTab: "Admin View", 
      name: "Name", id: "ID No", dept: "Department", phone: "Phone No", 
      pos: "Position", program: "Program", provider: "Provider", 
      submit: "Submit", loading: "Processing...", approve: "Approve", 
      empty: "No pending ribbons", date: "Date", switchBtn: "বাংলা",
      newEntryBtn: "New Entry", successMsg: "Submitted Successfully!",
      footerText: "Developed by", authorName: "Tanvir Emon", club: "Daffodil International University Photographic Society",
      loginError: "Invalid Username or Password!"
    }
  };

  // ✅ ফিক্সড লাইন: টাইপ কাস্টিং ব্যবহার করে এরর দূর করা হয়েছে
  const lang = t[language];

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${scriptURL}?action=getList`);
      const data = await res.json();
      setPendingList(data.filter((item: any) => item.status === "Pending"));
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setView('admin');
      fetchList();
      return;
    }

    const user = prompt(language === 'bn' ? "ইউজারনেম লিখুন:" : "Enter Username:");
    const pass = prompt(language === 'bn' ? "পাসওয়ার্ড লিখুন:" : "Enter Password:");

    if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true);
      setView('admin');
      fetchList();
    } else {
      alert(lang.loginError);
    }
  };

  const handleReturn = async (id: string) => {
    if(!confirm(language === 'bn' ? "আপনি কি নিশ্চিত?" : "Are you sure?")) return;
    await fetch(`${scriptURL}?action=return&id=${id}`);
    fetchList();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(scriptURL, { method: 'POST', body: JSON.stringify(formData) });
      setSubmitted(true);
      setFormData({ date: '', name: '', studentId: '', department: '', phone: '', position: '', program: '', provider: '' });
    } catch (error) { alert("Error!"); }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col relative">
      
      {/* লোগো এবং ল্যাঙ্গুয়েজ বার */}
      <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
         
          <button 
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-all flex items-center gap-2"
          >
            🌐 {lang.switchBtn}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pb-16 flex-grow w-full mt-8 md:mt-12">
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 uppercase">
            {lang.title}
          </h1>
          <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full max-w-xs md:max-w-sm border border-slate-100">
            <button onClick={() => setView('form')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${view === 'form' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>{lang.entryTab}</button>
            <button onClick={handleAdminAccess} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${view === 'admin' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>{lang.adminTab}</button>
          </div>
        </div>

        {view === 'form' ? (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 max-w-3xl mx-auto">
            {submitted ? (
              <div className="p-16 md:p-24 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner italic">✓</div>
                <h2 className="text-3xl font-bold mb-8 text-slate-800">{lang.successMsg}</h2>
                <button onClick={() => setSubmitted(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 w-full md:w-auto">{lang.newEntryBtn}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.date}</label><input type="date" value={formData.date} required onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.id}</label><input type="text" placeholder="232-15-XXX" value={formData.studentId} required onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                </div>
                <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.name}</label><input type="text" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.dept}</label><input type="text" placeholder="CSE" value={formData.department} required onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.phone}</label><input type="tel" placeholder="01XXXXXXXXX" value={formData.phone} required onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.pos}</label><input type="text" placeholder="Member" value={formData.position} required onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                  <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.program}</label><input type="text" placeholder="Event Name" value={formData.program} required onChange={e => setFormData({...formData, program: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                </div>
                <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.provider}</label><input type="text" placeholder="Provider Name" value={formData.provider} required onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 transition outline-none text-slate-700" /></div>
                <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] mt-6 disabled:opacity-50">
                  {isLoading ? lang.loading : lang.submit}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-xl p-4 md:p-10 border border-slate-100">
            {isLoading ? <div className="text-center py-24"><div className="animate-spin w-12 h-12 border-[5px] border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"></div><p className="font-bold text-slate-400">Fetching Data...</p></div> : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-left min-w-[600px] md:min-w-full">
                  <thead><tr className="text-slate-400 text-[11px] font-black uppercase border-b border-slate-50"><th className="pb-5 px-5">{lang.name}</th><th className="pb-5">{lang.program}</th><th className="pb-5 text-right px-5">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingList.length === 0 ? <tr><td colSpan="3" className="py-24 text-center text-slate-300 font-black text-xl">{lang.empty}</td></tr> : 
                      pendingList.map((item) => (
                        <tr key={item.actionId} className="hover:bg-indigo-50/40 transition-all group">
                          <td className="py-6 px-5"><p className="font-bold text-slate-800 text-base md:text-lg tracking-tight">{item.name}</p><p className="text-[11px] text-slate-400 font-medium">{item.studentId} • {item.phone}</p></td>
                          <td className="py-6"><p className="text-sm md:text-base font-bold text-slate-700">{item.program}</p><p className="text-[10px] text-indigo-500 font-black uppercase tracking-tight">From: {item.provider}</p></td>
                          <td className="py-6 text-right px-5"><button onClick={() => handleReturn(item.actionId)} className="bg-green-100 text-green-700 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl text-xs font-black hover:bg-green-600 hover:text-white transition-all uppercase shadow-sm active:scale-95">{lang.approve}</button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="w-full py-12 mt-auto bg-white border-t border-slate-100 text-center">
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            {lang.footerText} <span className="text-indigo-600 font-black uppercase tracking-widest ml-1">{lang.authorName}</span>
          </p>
          <p className="text-slate-400 text-[10px] md:text-xs mt-3 uppercase font-bold tracking-tighter opacity-70">
            {lang.club}
          </p>
      </footer>
    </div>
  );
}