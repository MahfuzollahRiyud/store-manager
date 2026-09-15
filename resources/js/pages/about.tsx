import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Store, CheckCircle2, ArrowRight, MessageCircle, Phone,
    Sparkles, Printer, Users, BarChart3, Zap, ShieldCheck,
    HelpCircle, ChevronRight, BookOpen, Layers, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
    const whatsappNumber = "+8801940890210";
    const whatsappUrl = `https://wa.me/8801940890210?text=${encodeURIComponent('Hello StoreManager Team, I would like to get help regarding using the software.')}`;

    // Language state: 'en' by default, switchable to 'bn'
    const [lang, setLang] = useState<'en' | 'bn'>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('storemanager_lang') as 'en' | 'bn';
        if (savedLang === 'en' || savedLang === 'bn') {
            setLang(savedLang);
        }
    }, []);

    const switchLang = (newLang: 'en' | 'bn') => {
        setLang(newLang);
        localStorage.setItem('storemanager_lang', newLang);
    };

    const t = {
        topBanner: {
            badge: { en: 'User Guide & Walkthrough', bn: 'ব্যবহার সহায়িকা' },
            text: { en: 'Simple Step-by-Step Overview & Mission', bn: 'সহজ নির্দেশিকা ও পরিচিতি' },
            helpline: { en: 'WhatsApp Support:', bn: 'হোয়াটসঅ্যাপ হেল্পলাইন:' },
        },
        nav: {
            tagline: { en: 'Store Management Software', bn: 'দোকান পরিচালনা সফটওয়্যার' },
            home: { en: 'Home', bn: 'হোমপেজ' },
            howItWorks: { en: 'How It Works', bn: 'কীভাবে কাজ করে' },
            mission: { en: 'Our Mission', bn: 'আমাদের লক্ষ্য' },
            modules: { en: 'Core Modules', bn: 'মূল মডিউলসমূহ' },
            login: { en: 'Login', bn: 'লগইন' },
            register: { en: 'Register Store', bn: 'দোকান নিবন্ধন' },
        },
        hero: {
            badge: { en: 'Our Vision & Purpose', bn: 'আমাদের লক্ষ্য ও সফটওয়্যার পরিচিতি' },
            title: {
                en: 'Empowering Retail Store Owners with Effortless Digital Management',
                bn: 'বাংলাদেশের প্রতিটি রিটেইল দোকানকে সহজে ডিজিটাল করার অঙ্গীকার'
            },
            subtitle: {
                en: 'Built to eradicate manual accounting headaches, lost customer credit records, unexpected stock-outs, and blind business guesswork.',
                bn: 'মুদি দোকানদার ও খুচরা ব্যবসায়ীদের প্রতিদিনের বাকির খাতার অনিশ্চয়তা, মালামাল শেষের জটিলতা এবং দিনশেষে খাঁটি লাভ না জানতে পারার চিরাচরিত সমস্যা দূর করতেই StoreManager তৈরি।'
            },
        },
        story: {
            badge: { en: 'Why StoreManager?', bn: 'কেন এই সফটওয়্যার?' },
            title: {
                en: 'Paper khata notebooks can get lost or damaged, but your store records should last forever.',
                bn: 'কাগজের খাতা হারিয়ে যেতে পারে, কিন্তু আপনার ব্যবসার হিসাব থাকবে আজীবন'
            },
            p1: {
                en: 'A retail or grocery store manages hundreds of fast-moving products. Items are bought at fluctuating prices, sold on cash and credit, and operational expenses happen every day. By month-end, most shop owners struggle to verify if their business actually made a true profit or suffered a loss.',
                bn: 'একটি সাধারণ মুদি বা খুচরা দোকানে শত শত পণ্য থাকে। বিভিন্ন দামে মাল কেনা হয়, বাকিতে বিক্রি হয় এবং ক্যাশ বাক্সে নানা সময়ে টাকা আসে ও খরচ হয়। দিনশেষে হিসাব মেলাতে গিয়ে বেশিরভাগ দোকানদার বুঝতে পারেন না মাস শেষে তার ব্যবসা সত্যি লাভে আছে নাকি লোকসানে।'
            },
            p2: {
                en: 'StoreManager is designed with simplicity in mind. It is so straightforward and user-friendly that anyone can learn it within 5 minutes and run their business independently without hiring accountants.',
                bn: 'StoreManager কোনো জটিল বা কঠিন সফটওয়্যার নয়। এটি এমনভাবে ডিজাইন করা হয়েছে যাতে যে কেউ ৫ মিনিটে শিখে নিজের দোকান একা নিজেই পরিচালনা করতে পারেন।'
            },
            commitmentsTitle: { en: 'Our 4 Core Commitments', bn: 'আমাদের ৪টি মূল অঙ্গীকার' },
            commitments: [
                {
                    title: { en: '100% Real Profit Integrity:', bn: '১০০% নিখুঁত লাভ:' },
                    desc: {
                        en: 'Weighted average costing calculates exact realized gross and net profit against true purchase costs.',
                        bn: 'প্রতিটি বিক্রিতে গড়ে কত কেনা দাম ছিল তার ভিত্তিতে আসল লাভ দেখানো।'
                    },
                },
                {
                    title: { en: 'Total Credit Due Safety:', bn: 'বাকির খাতার পূর্ণ নিরাপত্তা:' },
                    desc: {
                        en: 'Complete digital tracking of customer dues, payment dates, and balance receipts.',
                        bn: 'কাস্টমার কবে কত নিল এবং দিল—সব ডিজিটাল ট্র্যাকিং।'
                    },
                },
                {
                    title: { en: 'Staff Privacy Protection:', bn: 'কর্মচারীর কাছ থেকে কেনা দাম গোপন:' },
                    desc: {
                        en: 'Clerks and cashiers are masked from seeing purchase wholesale costs and confidential business profit.',
                        bn: 'ক্যাশিয়ারের কাছে দোকানের মোট লাভ বা কেনা দাম গোপন রাখা।'
                    },
                },
                {
                    title: { en: 'Simple & Responsive Experience:', bn: 'সহজ ও বাংলাবান্ধব:' },
                    desc: {
                        en: 'Accessible on mobile, tablet, and desktop without requiring any technical accounting background.',
                        bn: 'কোনো কঠিন অ্যাকাউন্টিং জ্ঞান ছাড়াই সাধারণ দোকানদারদের সহজে ব্যবহার উপযোগী।'
                    },
                },
            ],
        },
        guide: {
            badge: { en: 'Walkthrough Guide', bn: 'ব্যবহার সহায়িকা' },
            title: {
                en: 'How to Operate Your Store with StoreManager',
                bn: 'যেভাবে খুব সহজে সফটওয়্যারটি ব্যবহার করবেন'
            },
            steps: [
                {
                    step: '1',
                    title: { en: 'Store Registration & Profile Setup (1 Minute)', bn: 'শপ রেজিস্ট্রেশন ও সেটআপ (মাত্র ১ মিনিট)' },
                    desc: {
                        en: 'Create your private account with your shop name, mobile number, and address. Everything is encrypted and private to your business.',
                        bn: 'আপনার দোকানের নাম, মোবাইল নম্বর এবং ঠিকানা দিয়ে একটি অ্যাকাউন্ট তৈরি করুন। এটি সম্পূর্ণ সুরক্ষিত এবং শুধুমাত্র আপনার দখলেই থাকবে।'
                    },
                },
                {
                    step: '2',
                    title: { en: 'Add Categories & Products', bn: 'ক্যাটাগরি ও পণ্য ইনপুট' },
                    desc: {
                        en: 'Add your product catalog with purchase costs, retail selling prices, units of measurement, and optional barcode numbers.',
                        bn: 'দোকানের প্রধান পণ্যগুলো যুক্ত করুন। প্রতিটি পণ্যের বারকোড (থাকলে), পরিমাপের একক (কেজি/পিস/প্যাকেট), ক্রয়মূল্য এবং বিক্রয়মূল্য এন্ট্রি দিন।'
                    },
                },
                {
                    step: '3',
                    title: { en: 'Fast Counter Checkout & Slip Printing (F2 Shortcut)', bn: 'কাউন্টারে দ্রুত বিক্রি ও স্লিপ প্রিন্ট (F2 শর্টকাট)' },
                    desc: {
                        en: 'Press F2 to open the point of sale screen. Scan barcodes, adjust quantities, select cash or credit due, and generate instant thermal print slips.',
                        bn: 'কীবোর্ডের F2 বাটনে ক্লিক করে সরাসরি বিক্রি শুরু করুন। বারকোড স্ক্যানার দিয়ে স্ক্যান করলেই আইটেম কার্টে চলে আসবে। নগদ বা বাকিতে বিক্রি করে কাস্টমারকে থার্মাল রিসিট দিন।'
                    },
                },
                {
                    step: '4',
                    title: { en: 'Customer Credit Due Collection', bn: 'কাস্টমার বাকি আদায় ও লেজার আপডেট' },
                    desc: {
                        en: 'When a customer repays credit dues, enter payment amount in the customer ledger to immediately update their balance and issue payment receipts.',
                        bn: 'যেকোনো কাস্টমার যখন বাকি টাকা পরিশোধ করতে আসবে, কাস্টমারের নামের পাশে "বাকি আদায়" বাটনে ক্লিক করে টাকার পরিমাণ লিখলেই রিসিট জেনারেট হবে এবং স্বয়ংক্রিয়ভাবে বাকি কমে যাবে।'
                    },
                },
                {
                    step: '5',
                    title: { en: 'Daily Real Profit & Expense Review', bn: 'দিনশেষে ড্যাশবোর্ডে আসল লাভ পর্যবেক্ষণ' },
                    desc: {
                        en: 'At closing time, check your daily dashboard. See total revenue, operating expenses, and exact net profit before closing your store.',
                        bn: 'দোকান বন্ধ করার সময় ড্যাশবোর্ডে প্রবেশ করুন। আজকের মোট কত টাকা বিক্রি হলো, কত খরচ হলো এবং কত খাঁটি লাভ হলো—সব এক নজরে দেখে নিশ্চিন্তে বাড়ি ফিরুন।'
                    },
                },
            ],
        },
        modules: {
            badge: { en: 'Core Modules', bn: 'মূল ফিচার মডিউল' },
            title: {
                en: 'Specialized Tools for Every Store Operation',
                bn: 'দোকানের প্রতিটি বিভাগের জন্য বিশেষায়িত মডিউল'
            },
            list: [
                {
                    title: { en: '1. POS & Checkout Counter', bn: '১. পিওএস ও বিক্রয় কাউন্টার' },
                    desc: {
                        en: 'Barcode scanner integration, instant calculator, due payment options, and thermal receipt slips.',
                        bn: 'বারকোড সাপোর্ট, ক্যাশ ও বাকি পেমেন্ট ক্যালকুলেটর, থার্মাল প্রিন্টিং।'
                    },
                    icon: Zap,
                    color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950',
                },
                {
                    title: { en: '2. Smart Stock & Inventory', bn: '২. স্মার্ট স্টক ও ক্রয়মূল্য' },
                    desc: {
                        en: 'Purchase stock tracking, weighted average cost recalculation, and automated low-stock warnings.',
                        bn: 'মাল ক্রয় এন্ট্রি, গড় কেনা দাম হিসাব, লো-স্টক ওয়ার্নিং ও স্টক ট্র্যাকিং।'
                    },
                    icon: Layers,
                    color: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
                },
                {
                    title: { en: '3. Digital Credit Ledger (বাকি খাতা)', bn: '৩. ডিজিটাল বাকির খাতা' },
                    desc: {
                        en: 'Customer and supplier ledgers, outstanding balances, and historical payment logs.',
                        bn: 'কাস্টমার ও সাপ্লায়ারদের দেনা-পাওনা লেজার ও পেমেন্ট হিস্ট্রি।'
                    },
                    icon: Users,
                    color: 'text-purple-600 bg-purple-100 dark:bg-purple-950',
                },
                {
                    title: { en: '4. 9 Comprehensive Reports', bn: '৪. ৯টি বিস্তারিত রিপোর্ট' },
                    desc: {
                        en: 'Sales, expense analysis, net profit & loss statements, and stock valuation with CSV export.',
                        bn: 'দৈনিক বিক্রি, খরচ, লাভ-ক্ষতি ও মোট সম্পদের এক্সেল ডাউনলোড।'
                    },
                    icon: BarChart3,
                    color: 'text-rose-600 bg-rose-100 dark:bg-rose-950',
                },
            ],
        },
        cta: {
            title: {
                en: 'Need Personal Assistance or Onboarding Support?',
                bn: 'সফটওয়্যারটি কীভাবে ব্যবহার করবেন বুঝতে সমস্যা হচ্ছে?'
            },
            subtitle: {
                en: 'Our support team is ready to assist you on WhatsApp with setup, product entry, and answers to your questions.',
                bn: 'আমাদের কাস্টমার কেয়ার টিম আপনাকে হাতে-কলমে সফটওয়্যারটি সেটআপ করতে সাহায্য করতে সদা প্রস্তুত। সরাসরি হোয়াটসঅ্যাপে মেসেজ করুন।'
            },
            whatsappBtn: { en: 'Chat on WhatsApp', bn: 'হোয়াটসঅ্যাপে মেসেজ করুন' },
            registerBtn: { en: 'Start Free 7-Day Trial', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন' },
        },
        footer: {
            rights: { en: 'All rights reserved. Built for retailers worldwide.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },
            home: { en: 'Home', bn: 'হোমপেজ' },
            login: { en: 'Login', bn: 'লগইন' },
        },
    };

    return (
        <>
            <Head title={lang === 'en' ? "About & User Guide — StoreManager Store Management Software" : "আমাদের সম্পর্কে ও ব্যবহার নির্দেশিকা — StoreManager দোকান পরিচালনা সফটওয়্যার"} />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 font-sans">
                {/* ── Top Bar ──────────────────────────────────────────────── */}
                <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" /> {t.topBanner.badge[lang]}
                            </span>
                            <span>{t.topBanner.text[lang]}</span>
                        </div>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-white transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t.topBanner.helpline[lang]} {whatsappNumber}</span>
                        </a>
                    </div>
                </div>

                {/* ── Main Sticky Navigation Bar ───────────────────────────────── */}
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <Link href={route('home')} className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Store<span className="text-emerald-600">Manager</span>
                                </span>
                                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold -mt-1">
                                    {t.nav.tagline[lang]}
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <Link href={route('home')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.home[lang]}
                            </Link>
                            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.howItWorks[lang]}
                            </a>
                            <a href="#mission" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.mission[lang]}
                            </a>
                            <a href="#modules" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.modules[lang]}
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {/* Language Switcher */}
                            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
                                <button
                                    onClick={() => switchLang('en')}
                                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                                        lang === 'en'
                                            ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => switchLang('bn')}
                                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                                        lang === 'bn'
                                            ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    বাংলা
                                </button>
                            </div>

                            <Link href={route('login')}>
                                <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium">
                                    {t.nav.login[lang]}
                                </Button>
                            </Link>
                            <Link href={route('register')}>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm shadow-sm font-semibold">
                                    {t.nav.register[lang]}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ────────────────────────────────────────────── */}
                <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            {t.hero.badge[lang]}
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                            {t.hero.title[lang]}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                            {t.hero.subtitle[lang]}
                        </p>
                    </div>
                </section>

                {/* ── Our Story & Vision ───────────────────────────────────────── */}
                <section id="mission" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                    {t.story.badge[lang]}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                    {t.story.title[lang]}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {t.story.p1[lang]}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {t.story.p2[lang]}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    {t.story.commitmentsTitle[lang]}
                                </h4>
                                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    {t.story.commitments.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                            <span><strong>{c.title[lang]}</strong> {c.desc[lang]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Detailed Step-by-Step Guide ─────────────────────────────── */}
                <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                {t.guide.badge[lang]}
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {t.guide.title[lang]}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {t.guide.steps.map((s, idx) => (
                                <div key={idx} className="flex gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                                        {s.step}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{s.title[lang]}</h4>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc[lang]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Key Modules Overview ────────────────────────────────────── */}
                <section id="modules" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                {t.modules.badge[lang]}
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {t.modules.title[lang]}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {t.modules.list.map((m, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                                        <m.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.title[lang]}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">{m.desc[lang]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── WhatsApp Direct Support Banner ──────────────────────────── */}
                <section className="py-16 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                            <MessageCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                            {t.cta.title[lang]}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
                            {t.cta.subtitle[lang]}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md transition-all"
                            >
                                <MessageCircle className="w-5 h-5" />
                                {t.cta.whatsappBtn[lang]} ({whatsappNumber})
                            </a>
                            <Link href={route('register')}>
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-6">
                                    {t.cta.registerBtn[lang]}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────────────── */}
                <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                                <Store className="w-4 h-4" />
                            </div>
                            <span className="text-base font-bold text-white">
                                Store<span className="text-emerald-500">Manager</span>
                            </span>
                        </div>
                        <p className="text-slate-500">© {new Date().getFullYear()} StoreManager. {t.footer.rights[lang]}</p>
                        <div className="flex items-center gap-4">
                            <Link href={route('home')} className="hover:text-white">{t.footer.home[lang]}</Link>
                            <Link href={route('login')} className="hover:text-white">{t.footer.login[lang]}</Link>
                            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
