import { Head, Link, usePage } from '@inertiajs/react';
import {
    Store, ShoppingCart, BarChart3, ShieldCheck, CheckCircle2,
    ArrowRight, MessageCircle, Phone, Sparkles, Printer,
    CreditCard, Users, Layers, AlertCircle, HelpCircle,
    ChevronRight, Check, Zap, EyeOff, FileSpreadsheet, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage().props as any;
    const whatsappNumber = "+8801940890210";
    const whatsappUrl = `https://wa.me/8801940890210?text=${encodeURIComponent('Hello StoreManager Team, I would like to know more about the store management software.')}`;

    return (
        <>
            <Head title="StoreManager — মুদি, স্টেশনারি ও রিটেইল দোকানের আধুনিক ডিজিটাল সফটওয়্যার" />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 font-sans">
                {/* ── Top Announcement & WhatsApp Contact Bar ────────────────────── */}
                <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" /> নতুন সংস্করণ
                            </span>
                            <span>বাংলাদেশের রিটেইল ও মুদি দোকানের ১০০% নির্ভরযোগ্য ডিজিটাল সমাধান</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-white transition-colors"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>হোয়াটসঅ্যাপ হেল্পলাইন: {whatsappNumber}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Main Sticky Navigation Bar ───────────────────────────────── */}
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Store<span className="text-emerald-600">Manager</span>
                                </span>
                                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold -mt-1">
                                    দোকান পরিচালনা সফটওয়্যার
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                ফিচারসমূহ
                            </a>
                            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                কীভাবে কাজ করে
                            </a>
                            <a href="#comparison" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                সনাতন বনাম ডিজিটাল
                            </a>
                            <a href="#demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                লাইভ ডেমো
                            </a>
                            <Link href={route('about')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                আমাদের সম্পর্কে
                            </Link>
                        </nav>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                WhatsApp
                            </a>

                            {auth?.user ? (
                                <Link href={route('shop.dashboard')}>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-1.5 text-xs sm:text-sm">
                                        ড্যাশবোর্ডে যান <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium">
                                            লগইন
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 text-xs sm:text-sm">
                                            দোকান নিবন্ধন
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ────────────────────────────────────────────── */}
                <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent dark:from-emerald-950/30 dark:via-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Text Column */}
                            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    মুদি ও রিটেইল দোকানের ১০০% নির্ভুল হিসাব
                                </div>

                                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.25]">
                                    খাতার হিসাব বাদ দিন,{' '}
                                    <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 underline-offset-8">
                                        ডিজিটাল দোকানে
                                    </span>{' '}
                                    আসল লাভ ও বাকির হিসাব রাখুন সহজে
                                </h1>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    বারকোড দিয়ে চোখের পলকে বিক্রি, গ্রাহকের ডিজিটাল বাকির খাতা, পণ্য শেষ হওয়ার আগেই স্টক ওয়ার্নিং, এবং প্রতিটি পণ্যে দৈনিক আসল লাভ জানার জন্য বাংলাদেশের সেরা দোকান পরিচালনা সফটওয়্যার।
                                </p>

                                {/* Hero CTAs */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                                    <Link href={route('register')} className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-6 text-base font-semibold shadow-lg shadow-emerald-600/25 gap-2">
                                            বিনামূল্যে দোকান রেজিস্টার করুন <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>

                                    <a href="#demo" className="w-full sm:w-auto">
                                        <Button size="lg" variant="outline" className="w-full px-6 py-6 text-base font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2">
                                            লাইভ ডেমো টেস্ট করুন
                                        </Button>
                                    </a>

                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/10"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        হোয়াটসঅ্যাপ: {whatsappNumber}
                                    </a>
                                </div>

                                {/* Micro highlights */}
                                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>কোনো ইনস্টলেশন ঝামেলা নেই</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>মোবাইল ও পিসি উভয়েই চলে</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>থার্মাল রিসিট প্রিন্ট সাপোর্ট</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual Card Column */}
                            <div className="lg:col-span-5">
                                <div className="relative mx-auto max-w-md lg:max-w-none">
                                    {/* Decorative glow */}
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-25 blur-xl" />

                                    {/* Interactive Mockup Container */}
                                    <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
                                        {/* Mock Header */}
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">
                                                    রহমান জেনারেল স্টোর (POS Counter)
                                                </span>
                                            </div>
                                            <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                                                লাইভ কাউন্টার
                                            </span>
                                        </div>

                                        {/* Today's Quick Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                                                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">আজকের মোট বিক্রি</p>
                                                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-0.5 font-mono">৳ ২৪,৫৬০</p>
                                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">৪৮টি অর্ডার সম্পন্ন</p>
                                            </div>
                                            <div className="bg-blue-50/80 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                                                <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">আজকের আসল লাভ</p>
                                                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-0.5 font-mono">৳ ৪,২৮০</p>
                                                <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-1">গড় মুনাফা ১৭.৪%</p>
                                            </div>
                                        </div>

                                        {/* Real-time Cart Preview */}
                                        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                                            <div className="flex items-center justify-between text-slate-500 font-medium pb-1 border-b border-slate-200/60 dark:border-slate-700">
                                                <span>পণ্য (আইটেম)</span>
                                                <span>পরিমাণ × মূল্য</span>
                                                <span>মোট</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">তীর সয়াবিন তেল (৫ লিটার)</span>
                                                <span className="text-slate-500">১ × ৳ ৮৯০</span>
                                                <span className="font-mono font-bold">৳ ৮৯০</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">মিনিকেট চাল (২৫ কেজি)</span>
                                                <span className="text-slate-500">১ × ৳ ১,৭৫০</span>
                                                <span className="font-mono font-bold">৳ ১,৭৫০</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">ডোনা চিনি (১ কেজি)</span>
                                                <span className="text-slate-500">২ × ৳ ১৩৫</span>
                                                <span className="font-mono font-bold">৳ ২৭০</span>
                                            </div>
                                            <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between font-bold text-sm">
                                                <span>সর্বমোট পরিশোধ:</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">৳ ২,৯১০</span>
                                            </div>
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="flex items-center justify-between text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Printer className="w-3.5 h-3.5 text-amber-600" /> থার্মাল রিসিট প্রস্তুত
                                            </span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">কাস্টমার বাকি: ৳ ০</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Target Business Categories ─────────────────────────────── */}
                <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold mb-6">
                            যেসব ব্যবসার জন্য StoreManager বিশেষভাবে তৈরি
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { title: 'মুদি দোকান ও সুপার শপ', desc: 'দৈনন্দিন নিত্যপণ্য ও তেল-চালের হিসাব', icon: Store },
                                { title: 'বই ও স্টেশনারি', desc: 'খাতা, কলম ও স্টেশনারির ভ্যারাইটি স্টক', icon: Layers },
                                { title: 'কসমেটিক্স ও প্লাস্টিক', desc: 'লেডিস কর্নার ও বিভিন্ন ব্র্যান্ডেড আইটেম', icon: Sparkles },
                                { title: 'হার্ডওয়্যার ও ইলেকট্রনিক্স', desc: 'সিরিয়াল ও ক্যাটাগরিভিত্তিক স্টক হিসাব', icon: Zap },
                                { title: 'জেনারেল রিটেইল স্টোর', desc: 'নগদ ও বাকিতে পাইকারি ও খুচরা বিক্রয়', icon: ShoppingCart },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Core Features Grid ──────────────────────────────────────── */}
                <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                পাওয়ারফুল ফিচারসমূহ
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                আপনার দোকানের যাবতীয় কাজ এখন হবে নিমিষেই
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                জটিল খাতা-কলম আর ক্যালকুলেটরের দিন শেষ। আধুনিক খুচরা দোকানের সব প্রয়োজন এক জায়গায়।
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    হাই-স্পিড POS ও বারকোড সেলস
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    কীবোর্ডের <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-emerald-600">F2</code> চাপলেই বিক্রয় স্ক্রিন ওপেন। বারকোড স্ক্যানার দিয়ে নিমিষেই আইটেম যোগ করুন এবং ক্যাশ, বিকাশ বা বাকিতে বিক্রি করুন।
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    কাস্টমারের ডিজিটাল বাকির খাতা
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    কোন কাস্টমারের কাছে কত টাকা বাকি আছে, কবে কত টাকা জমা দিয়েছে তার পূর্ণাঙ্গ লেজার খতিয়ান। ১ ক্লিকে জমা ভাউচার তৈরি করুন।
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    প্রতিটি পণ্যে আসল লাভ হিসাব
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    গড় ক্রয়মূল্য (Weighted Average Cost) পদ্ধতিতে সফটওয়্যার প্রতিটি পণ্যের কেনা দামের সাথে মিলিয়ে দিন শেষে আসল নিট লাভ বের করে দেয়।
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    লো-স্টক সতর্কবার্তা ও ইনভেন্টরি
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    দোকানের কোনো মালামাল শেষ হয়ে যাওয়ার আগেই সফটওয়্যার লাল সতর্কতা দেখাবে। নেগেটিভ বা না থাকা স্টক বিক্রি হওয়া প্রতিরোধ করা।
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                                    <EyeOff className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    সেলসম্যানের জন্য নিরাপদ কাউন্টার ভিউ
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    কর্মচারী বা ক্যাশিয়ার শুধুমাত্র বিক্রি করবে। দোকানের পণ্যের কেনা দাম, মোট লাভ বা ব্যবসায়িক হিসাব কর্মচারীদের থেকে স্বয়ংক্রিয়ভাবে গোপন থাকবে।
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                                    <FileSpreadsheet className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    ৯টি ব্যবসায়িক রিপোর্ট ও এক্সেল এক্সপোর্ট
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    বিক্রি, ক্রয়, লাভ-ক্ষতি, সাপ্লায়ার দেনা, কাস্টমার বাকি ও মালামালের বর্তমান মোট মূল্যের বিস্তারিত রিপোর্ট যেকোনো সময় এক ক্লিকে ডাউনলোড করুন।
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Comparison: Khata vs StoreManager ─────────────────────────── */}
                <section id="comparison" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                পার্থক্য দেখুন
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                সনাতন খাতা-কলম বনাম StoreManager ডিজিটাল সমাধান
                            </h2>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70">
                                        <th className="py-4 px-5 font-bold text-slate-700 dark:text-slate-200 w-1/3">বিষয়</th>
                                        <th className="py-4 px-5 font-bold text-rose-600 dark:text-rose-400 w-1/3">সনাতন খাতা-কলমের হিসাব</th>
                                        <th className="py-4 px-5 font-bold text-emerald-600 dark:text-emerald-400 w-1/3 bg-emerald-50/60 dark:bg-emerald-950/30">StoreManager ডিজিটাল সফটওয়্যার</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {[
                                        {
                                            topic: 'বাকির হিসাব ও প্রমাণ',
                                            traditional: 'খাতা ছিঁড়ে গেলে বা পানি পড়লে পুরো বাকির হিসাব হারিয়ে যায়।',
                                            storemanager: 'ক্লাউডে শতভাগ সুরক্ষিত। আজীবন কাস্টমার লেজার সংরক্ষিত থাকে।',
                                        },
                                        {
                                            topic: 'আসল লাভ বের করা',
                                            traditional: 'ক্যাশ বাক্সে থাকা টাকা দেখে অনুমান করা লাগে, লাভ হয়েছে না ক্ষতি তা অজানা থাকে।',
                                            storemanager: 'প্রতিটি পণ্যের গড় কেনা দামের সাথে মিলিয়ে ১ ক্লিকে দিনের খাঁটি লাভ দেখা যায়।',
                                        },
                                        {
                                            topic: 'স্টকের হিসাব ও ক্ষতি',
                                            traditional: 'মাল শেষ হওয়ার পর বুঝতে পারা যায়, ফলে কাস্টমার পণ্য না পেয়ে ফিরে যায়।',
                                            storemanager: 'স্টক নির্দিষ্ট পরিমাণের নিচে নামলেই লাল ওয়ার্নিং দেয়, সময়মতো অর্ডার করা যায়।',
                                        },
                                        {
                                            topic: 'বিক্রির গতি ও রশিদ',
                                            traditional: 'হাতে লিখে স্লিপ কাটতে কাস্টমারের লম্বা লাইন লেগে যায়।',
                                            storemanager: 'বারকোড স্ক্যানে ২ সেকেন্ডে বিক্রি এবং থার্মাল প্রিন্টারে ৫২/৮০মিমি রশিদ প্রিন্ট।',
                                        },
                                        {
                                            topic: 'কর্মচারী পরিচালনা ও নিরাপত্তা',
                                            traditional: 'ক্যাশ কর্মচারীর হাতে ছেড়ে দিলে কেনা দাম জেনে যায় বা হিসাবে কারচুপি হতে পারে।',
                                            storemanager: 'কর্মচারীর কাছে কেনা দাম ও মোট লাভ লুকানো থাকে। ক্যাশ ও স্টক সুরক্ষিত থাকে।',
                                        },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <td className="py-3.5 px-5 font-semibold text-slate-800 dark:text-slate-200">{row.topic}</td>
                                            <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">{row.traditional}</td>
                                            <td className="py-3.5 px-5 text-emerald-900 dark:text-emerald-200 font-medium bg-emerald-50/40 dark:bg-emerald-950/20">{row.storemanager}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── How It Works (৩টি সহজ ধাপ) ─────────────────────────────── */}
                <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                ৩টি সহজ ধাপ
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                কীভাবে শুরু করবেন আপনার ডিজিটাল দোকান
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Step 1 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                                    ১
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    দোকান রেজিস্ট্রেশন করুন
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    আপনার দোকানের নাম, মোবাইল নাম্বার ও ঠিকানা দিয়ে মাত্র ১ মিনিটে বিনামূল্যে একটি অ্যাকাউন্ট খুলুন।
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                                    ২
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    পণ্য ও স্টক যুক্ত করুন
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    দোকানের পণ্যসমূহ, পাইকারি কেনা দাম ও বিক্রয়মূল্য যুক্ত করুন। বারকোড থাকলে স্ক্যান করে নিন।
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                                    ৩
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    বিক্রি ও লাভ উপভোগ করুন
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    কাস্টমারকে ক্লিকে পণ্য বিক্রি করুন, বাকি থাকলে এন্ট্রি দিন এবং দিনশেষে আসল লাভের হিসাব দেখে বাড়ি ফিরুন।
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <Link href={route('about')}>
                                <Button variant="outline" className="text-xs font-semibold gap-1.5">
                                    সম্পূর্ণ নির্দেশিকা ও বিস্তারিত জানুন <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── 1-Click Live Demo Section ─────────────────────────────────── */}
                <section id="demo" className="py-20 bg-emerald-950 text-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                সরাসরি পরীক্ষা করুন
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold">
                                কোনো অ্যাকাউন্ট ছাড়াই লাইভ ডেমো টেস্ট করুন
                            </h2>
                            <p className="text-emerald-200/80 text-sm">
                                নিচের যেকোনো রোলের তথ্য দিয়ে সরাসরি লগইন করে সফটওয়্যারটির প্রতিটি ফিচার নিজ চোখে দেখে নিন।
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Role 1: Shop Owner */}
                            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                        <Store className="w-5 h-5" />
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                        মূল ফিচার
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">দোকান মালিক (Shop Owner)</h4>
                                    <p className="text-xs text-emerald-300/80 mt-0.5">দোকানের সম্পূর্ণ নিয়ন্ত্রণ, স্টক ও আসল লাভ</p>
                                </div>
                                <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-800 text-xs font-mono space-y-1">
                                    <p><span className="text-emerald-400">ইমেইল:</span> owner@demo.com</p>
                                    <p><span className="text-emerald-400">পাসওয়ার্ড:</span> password</p>
                                </div>
                                <Link href={route('login')} className="block">
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                                        মালিক হিসেবে টেস্ট করুন
                                    </Button>
                                </Link>
                            </div>

                            {/* Role 2: Salesman */}
                            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5" />
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                                        কাউন্টার মোড
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">সেলসম্যান / ক্যাশিয়ার</h4>
                                    <p className="text-xs text-emerald-300/80 mt-0.5">লাভ ও কেনা দাম গোপন রেখে দ্রুত বিক্রি</p>
                                </div>
                                <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-800 text-xs font-mono space-y-1">
                                    <p><span className="text-emerald-400">ইমেইল:</span> sales@demo.com</p>
                                    <p><span className="text-emerald-400">পাসওয়ার্ড:</span> password</p>
                                </div>
                                <Link href={route('login')} className="block">
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                                        সেলসম্যান হিসেবে টেস্ট করুন
                                    </Button>
                                </Link>
                            </div>

                            {/* Role 3: Super Admin */}
                            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                        সেন্ট্রাল অ্যাডমিন
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">সুপার অ্যাডমিন প্যানেল</h4>
                                    <p className="text-xs text-emerald-300/80 mt-0.5">সব দোকানের তালিকা ও ১-ক্লিক ভিউ</p>
                                </div>
                                <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-800 text-xs font-mono space-y-1">
                                    <p><span className="text-emerald-400">ইমেইল:</span> admin@storemanager.app</p>
                                    <p><span className="text-emerald-400">পাসওয়ার্ড:</span> admin123</p>
                                </div>
                                <Link href={route('login')} className="block">
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                                        সুপার অ্যাডমিন টেস্ট করুন
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── WhatsApp Direct Support Banner ──────────────────────────── */}
                <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <h3 className="text-2xl font-extrabold">সফটওয়্যার সম্পর্কে বিস্তারিত জানতে বা পরামর্শ নিতে চান?</h3>
                                <p className="text-emerald-100 text-sm max-w-xl">
                                    আমাদের টিম সার্বক্ষণিক আপনার সেবায় প্রস্তুত। সরাসরি হোয়াটসঅ্যাপে মেসেজ করুন বা কল করুন।
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all"
                                >
                                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                                    হোয়াটসঅ্যাপে চ্যাট করুন
                                </a>
                                <a
                                    href={`tel:${whatsappNumber}`}
                                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm transition-all border border-emerald-600"
                                >
                                    <Phone className="w-4 h-4" />
                                    {whatsappNumber}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ─────────────────────────────────────────────── */}
                <section className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                সচরাচর জিজ্ঞাসিত প্রশ্ন
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                সাধারণ ব্যবসায়ীদের প্রশ্নোত্তর
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: 'সফটওয়্যারটি কি মোবাইল দিয়েও ব্যবহার করা যাবে?',
                                    a: 'হ্যাঁ, সম্পূর্ণভাবে। এটি যেকোনো স্মার্টফোন, ট্যাবলেট, ল্যাপটপ বা ডেস্কটপ কম্পিউটারের ব্রাউজারে সুন্দরভাবে কাজ করে। কোনো কিছু আলাদা ডাউনলোড বা ইনস্টল করার দরকার নেই।',
                                },
                                {
                                    q: 'থার্মাল প্রিন্টারে কি রিসিট স্লিপ প্রিন্ট করা যাবে?',
                                    a: 'হ্যাঁ! StoreManager-এ стандартный 58mm এবং 80mm পিওএস থার্মাল স্লিপ প্রিন্ট ফরম্যাট তৈরি করা আছে। বিক্রি সম্পন্ন করেই ১ ক্লিকে প্রিন্ট দিতে পারবেন।',
                                },
                                {
                                    q: 'আমার দোকানের বাকির হিসাব ও লাভ-ক্ষতির তথ্য কি অন্যরা দেখতে পারবে?',
                                    a: 'না, কখনো না। প্রতিটি দোকানের ডাটাবেস সম্পূর্ণ আলাদা এবং এনক্রিপ্ট করা। এমনকি আপনার সেলসম্যানদের জন্যও কেনা দাম ও লাভের হিসাব লুকানো থাকে।',
                                },
                                {
                                    q: 'ইন্টারনেট গতি ধীর হলে কি সফটওয়্যার চলবে?',
                                    a: 'হ্যাঁ, সফটওয়্যারটি আধুনিক প্রযুক্তিতে খুব হালকা করে বিল্ড করা হয়েছে। সাধারণ ২জি/৩জি বা মোবাইল হটস্পট ইন্টারনেট দিয়েও নিমিষেই পেজ লোড হয়।',
                                },
                            ].map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        {faq.q}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────────────── */}
                <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-3 md:col-span-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                                    <Store className="w-4 h-4" />
                                </div>
                                <span className="text-lg font-bold text-white">
                                    Store<span className="text-emerald-500">Manager</span>
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                                বাংলাদেশের খুচরা ব্যবসায়ীদের হিসাব-নিকাশ, স্টক ম্যানেজমেন্ট, কাস্টমার বাকি খাতা ও প্রতিদিনের খাঁটি লাভ জানার আধুনিক বিশ্বস্ত ডিজিটাল সমাধান।
                            </p>
                            <p className="text-emerald-400 font-semibold pt-1">
                                হেল্পলাইন / WhatsApp: {whatsappNumber}
                            </p>
                        </div>

                        <div>
                            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">কুইক লিঙ্ক</h5>
                            <ul className="space-y-2">
                                <li><a href="#features" className="hover:text-white transition-colors">ফিচারসমূহ</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">কীভাবে কাজ করে</a></li>
                                <li><a href="#demo" className="hover:text-white transition-colors">লাইভ ডেমো টেস্ট</a></li>
                                <li><Link href={route('about')} className="hover:text-white transition-colors">আমাদের সম্পর্কে</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">অ্যাকাউন্ট ও প্রবেশ</h5>
                            <ul className="space-y-2">
                                <li><Link href={route('login')} className="hover:text-white transition-colors">লগইন (Login)</Link></li>
                                <li><Link href={route('register')} className="hover:text-white transition-colors">নতুন দোকান রেজিস্ট্রেশন</Link></li>
                                <li>
                                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                                        হোয়াটসঅ্যাপে সরাসরি যোগাযোগ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-slate-500">
                        <p>© {new Date().getFullYear()} StoreManager. সর্বস্বত্ব সংরক্ষিত। বাংলাদেশের খুচরা ব্যবসায়ীদের বিশ্বস্ত সহযোগী।</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
