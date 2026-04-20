"use client";
import React, { useState } from 'react';
import Image from 'next/image';

/**
 * রিবন ম্যানেজমেন্ট সিস্টেম - ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি ফটোগ্রাফিক সোসাইটি (DIUPS)
 * তৈরি করেছেন: তানভীর ইমন
 */

export default function RibbonSystem() {
  // --- স্টেটস (States) ---
  const [view, setView] = useState('form'); // 'form' অথবা 'admin' ভিউ কন্ট্রোল করার জন্য
  const [language, setLanguage] = useState('bn'); // 'bn' (বাংলা) অথবা 'en' (ইংরেজি)
  const [submitted, setSubmitted] = useState(false); // ফর্ম জমা হয়েছে কি না
  const [isLoading, setIsLoading] = useState(false); // ডাটা প্রসেসিং লোডার
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // এডমিন লগইন সেশন
  const [pendingList, setPendingList] = useState<any[]>([]); // পেন্ডিং রিবন ডাটা লিস্ট
  
  // ফর্ম ইনপুট ডাটা অবজেক্ট
  const [formData, setFormData] = useState({
    date: '', name: '', studentId: '', department: '', phone: '', position: '', program: '', provider: ''
  });

  // --- কনফিগারেশন ---
  // গুগল অ্যাপস স্ক্রিপ্ট ইউআরএল (গুগল শিট কানেকশন)
  const scriptURL = 'https://script.google.com/macros/s/AKfycbx8BIZBqlgiVuiShDnpp-CgaA9d6zfRrcWKoIE0OdPK_I1OPENhR5MF20Q4UotLAXaxJQ/exec';

  // এডমিন লগইন তথ্য
  const ADMIN_CREDENTIALS = { username: "admin_diups", password: "diups_blackmagic" };

  // --- ল্যাঙ্গুয়েজ ট্রান্সলেশন অবজেক্ট ---
  const t: any = {
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

  const lang = t[language]; // বর্তমান ল্যাঙ্গুয়েজ সিলেক্ট করা

  // --- ফাংশনস (Functions) ---

  // গুগল শিট থেকে পেন্ডিং লিস্ট নিয়ে আসার ফাংশন
  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${scriptURL}?action=getList`);
      const data = await res.json();
      // শুধুমাত্র "Pending" স্ট্যাটাস আছে এমন ডাটাগুলো ফিল্টার করা
      setPendingList(data.filter((item: any) => item.status === "Pending"));
    } catch (e) { console.error("Error fetching data:", e); }
    setIsLoading(false);
  };

  // এডমিন এক্সেস ভেরিফিকেশন (Prompt এর মাধ্যমে)
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

  // রিবন রিটার্ন কনফার্ম করার ফাংশন (Status "Returned" করা)
  const handleReturn = async (id: string) => {
    if(!confirm(language === 'bn' ? "আপনি কি নিশ্চিত?" : "Are you sure?")) return;
    try {
      await fetch(`${scriptURL}?action=return&id=${id}`);
      fetchList(); // লিস্ট রিফ্রেশ করা
    } catch (e) { alert("Action Failed!"); }
  };

  // এন্ট্রি ফর্ম সাবমিট করার ফাংশন
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(formData),
        mode: 'no-cors' // গুগল স্ক্রিপ্টের জন্য জরুরি
      });
      setSubmitted(true);
      // ফর্ম রিসেট করা
      setFormData({ date: '', name: '', studentId: '', department: '', phone: '', position: '', program: '', provider: '' });
    } catch (error) { alert("Submission Error!"); }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 flex flex-col relative">
      
      {/* --- টপ নেভিগেশন (Logo & Lang Switch) --- */}
      <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
          
          <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')} className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-all flex items-center gap-2 shadow-sm">
            🌐 {lang.switchBtn}
          </button>
        </div>
      </nav>

      {/* --- মেইন কন্টেন্ট বডি --- */}
      <div className="max-w-5xl mx-auto px-4 pb-16 flex-grow w-full mt-8 md:mt-12">
        
        {/* টাইটেল এবং ট্যাব সুইচিং */}
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8 uppercase">{lang.title}</h1>
          <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full max-w-xs md:max-w-sm border border-slate-100">
            <button onClick={() => setView('form')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${view === 'form' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>{lang.entryTab}</button>
            <button onClick={handleAdminAccess} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${view === 'admin' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>{lang.adminTab}</button>
          </div>
        </div>

        {/* --- ফর্ম ভিউ (Entry Form) --- */}
        {view === 'form' ? (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 max-w-3xl mx-auto">
            {submitted ? (
              // সফলভাবে সাবমিট হওয়ার পর সাকসেস মেসেজ
              <div className="p-16 md:p-24 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner italic">✓</div>
                <h2 className="text-3xl font-bold mb-8 text-slate-800">{lang.successMsg}</h2>
                <button onClick={() => setSubmitted(false)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 w-full md:w-auto">{lang.newEntryBtn}</button>
              </div>
            ) : (
              // রিবন এন্ট্রি ফর্ম
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
                <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 mt-6 disabled:opacity-50">
                  {isLoading ? lang.loading : lang.submit}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* --- এডমিন ভিউ (Admin Dashboard) --- */
          <div className="bg-white rounded-[2rem] shadow-xl p-4 md:p-10 border border-slate-100">
            {isLoading ? <div className="text-center py-24"><div className="animate-spin w-12 h-12 border-[5px] border-indigo-600 border-t-transparent rounded-full mx-auto mb-6"></div><p className="font-bold text-slate-400">Fetching...</p></div> : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-left min-w-[600px] md:min-w-full">
                  <thead><tr className="text-slate-400 text-[11px] font-black uppercase border-b border-slate-50"><th className="pb-5 px-5">{lang.name}</th><th className="pb-5">{lang.program}</th><th className="pb-5 text-right px-5">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingList.length === 0 ? <tr><td colSpan={3} className="py-24 text-center text-slate-300 font-black text-xl">{lang.empty}</td></tr> : 
                      pendingList.map((item) => (
                        <tr key={item.actionId} className="hover:bg-indigo-50/40 transition-all">
                          <td className="py-6 px-5">
                            <p className="font-bold text-slate-800 text-base md:text-lg">{item.name}</p>
                            <p className="text-[11px] text-slate-400">{item.studentId} • {item.phone}</p>
                          </td>
                          <td className="py-6">
                            <p className="text-sm md:text-base font-bold text-slate-700">{item.program}</p>
                            <p className="text-[10px] text-indigo-500 font-black tracking-tight">From: {item.provider}</p>
                          </td>
                          <td className="py-6 text-right px-5">
                            <button onClick={() => handleReturn(item.actionId)} className="bg-green-100 text-green-700 px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-green-600 hover:text-white transition-all uppercase">
                              {lang.approve}
                            </button>
                          </td>
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

      {/* --- ফুটার (Footer) --- */}
      <footer className="w-full py-12 mt-auto bg-white border-t border-slate-100 text-center">
          <p className="text-slate-500 text-xs md:text-sm font-medium">{lang.footerText} <span className="text-indigo-600 font-black ml-1 uppercase">{lang.authorName}</span></p>
          <p className="text-slate-400 text-[10px] md:text-xs mt-3 uppercase font-bold opacity-70">{lang.club}</p>
      </footer>
    </div>
  );
}