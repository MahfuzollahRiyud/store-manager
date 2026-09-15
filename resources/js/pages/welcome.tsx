import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Store, ShoppingCart, BarChart3, ShieldCheck, CheckCircle2,
    ArrowRight, MessageCircle, Phone, Sparkles, Printer,
    Users, Layers, AlertCircle, HelpCircle, ChevronRight,
    Zap, EyeOff, FileSpreadsheet, Globe, Check, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage().props as any;
    const whatsappNumber = "+8801940890210";
    const whatsappUrl = `https://wa.me/8801940890210?text=${encodeURIComponent('Hello StoreManager Team, I would like to know more about the store management software.')}`;

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

    // Translation content
    const t = {
        topBanner: {
            en: '100% reliable digital management solution for retail and grocery stores',
            bn: 'বাংলাদেশের রিটেইল ও মুদি দোকানের ১০০% নির্ভরযোগ্য ডিজিটাল সমাধান',
            badge: { en: 'New Version', bn: 'নতুন সংস্করণ' },
            helpline: { en: 'WhatsApp Support:', bn: 'হোয়াটসঅ্যাপ হেল্পলাইন:' },
        },
        nav: {
            tagline: { en: 'Store Management Software', bn: 'দোকান পরিচালনা সফটওয়্যার' },
            features: { en: 'Features', bn: 'ফিচারসমূহ' },
            howItWorks: { en: 'How It Works', bn: 'কীভাবে কাজ করে' },
            comparison: { en: 'Khata vs Digital', bn: 'সনাতন বনাম ডিজিটাল' },
            pricing: { en: 'Free Trial', bn: 'ফ্রি ট্রায়াল' },
            about: { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
            login: { en: 'Login', bn: 'লগইন' },
            register: { en: 'Register Store', bn: 'দোকান নিবন্ধন' },
            dashboard: { en: 'Go to Dashboard', bn: 'ড্যাশবোর্ডে যান' },
        },
        hero: {
            badge: { en: 'Precision Inventory, POS & Customer Ledger', bn: 'মুদি ও রিটেইল দোকানের ১০০% নির্ভুল হিসাব' },
            titleStart: { en: 'Replace manual khata notebooks with ', bn: 'খাতার হিসাব বাদ দিন, ' },
            titleHighlight: { en: 'a smart digital store', bn: 'ডিজিটাল দোকানে' },
            titleEnd: { en: ' that calculates real profit & customer dues automatically.', bn: ' আসল লাভ ও বাকির হিসাব রাখুন সহজে।' },
            subtitle: {
                en: 'High-speed barcode POS billing, digital customer credit ledger (বাকির খাতা), proactive low-stock warnings, and real net profit calculation on every item sold.',
                bn: 'বারকোড দিয়ে চোখের পলকে বিক্রি, গ্রাহকের ডিজিটাল বাকির খাতা, পণ্য শেষ হওয়ার আগেই স্টক ওয়ার্নিং, এবং প্রতিটি পণ্যে দৈনিক আসল লাভ জানার জন্য নির্ভরযোগ্য সফটওয়্যার।'
            },
            ctaRegister: { en: 'Start 7-Day Free Trial', bn: 'বিনামূল্যে দোকান রেজিস্টার করুন' },
            ctaHowItWorks: { en: 'See How It Works', bn: 'কীভাবে কাজ করে দেখুন' },
            ctaWhatsApp: { en: 'Chat on WhatsApp', bn: 'হোয়াটসঅ্যাপে কথা বলুন' },
            badges: {
                noInstall: { en: 'Zero installation required', bn: 'কোনো ইনস্টলেশন ঝামেলা নেই' },
                mobilePc: { en: 'Works on Mobile, Tablet & PC', bn: 'মোবাইল ও পিসি উভয়েই চলে' },
                thermal: { en: 'Thermal POS Receipt Support', bn: 'থার্মাল রিসিট প্রিন্ট সাপোর্ট' },
            },
        },
        mockup: {
            storeName: { en: 'Rahman General Store (POS Counter)', bn: 'রহমান জেনারেল স্টোর (POS Counter)' },
            liveCounter: { en: 'Live Counter', bn: 'লাইভ কাউন্টার' },
            todaySales: { en: "Today's Total Sales", bn: 'আজকের মোট বিক্রি' },
            ordersCompleted: { en: '48 Orders completed', bn: '৪৮টি অর্ডার সম্পন্ন' },
            todayProfit: { en: "Today's Real Profit", bn: 'আজকের আসল লাভ' },
            margin: { en: 'Avg Margin 17.4%', bn: 'গড় মুনাফা ১৭.৪%' },
            colItem: { en: 'Product (Item)', bn: 'পণ্য (আইটেম)' },
            colQtyPrice: { en: 'Qty × Price', bn: 'পরিমাণ × মূল্য' },
            colTotal: { en: 'Total', bn: 'মোট' },
            item1: { en: 'Soybean Cooking Oil (5 Liter)', bn: 'তীর সয়াবিন তেল (৫ লিটার)' },
            item2: { en: 'Miniket Rice (25 kg)', bn: 'মিনিকেট চাল (২৫ কেজি)' },
            item3: { en: 'Refined Sugar (1 kg)', bn: 'ডোনা চিনি (১ কেজি)' },
            totalPaid: { en: 'Total Paid:', bn: 'সর্বমোট পরিশোধ:' },
            receiptReady: { en: 'Thermal Receipt Ready', bn: 'থার্মাল রিসিট প্রস্তুত' },
            customerDue: { en: 'Customer Due: ৳ 0', bn: 'কাস্টমার বাকি: ৳ ০' },
        },
        targetTitle: {
            en: 'Tailored for Retail Businesses of All Sizes',
            bn: 'যেসব ব্যবসার জন্য StoreManager বিশেষভাবে তৈরি'
        },
        targets: [
            {
                title: { en: 'Grocery & Departmental Stores', bn: 'মুদি দোকান ও সুপার শপ' },
                desc: { en: 'Daily essentials, rice, oil & fast-moving goods', bn: 'দৈনন্দিন নিত্যপণ্য ও তেল-চালের হিসাব' },
                icon: Store,
            },
            {
                title: { en: 'Books & Stationery Shops', bn: 'বই ও স্টেশনারি' },
                desc: { en: 'Diverse stock of notebooks, pens & office items', bn: 'খাতা, কলম ও স্টেশনারির ভ্যারাইটি স্টক' },
                icon: Layers,
            },
            {
                title: { en: 'Cosmetics & Variety Stores', bn: 'কসমেটিক্স ও প্লাস্টিক' },
                desc: { en: 'Beauty products, branded items & daily accessories', bn: 'লেডিস কর্নার ও বিভিন্ন ব্র্যান্ডেড আইটেম' },
                icon: Sparkles,
            },
            {
                title: { en: 'Hardware & Electronics', bn: 'হার্ডওয়্যার ও ইলেকট্রনিক্স' },
                desc: { en: 'Category-wise tracking & stock warranty logs', bn: 'সিরিয়াল ও ক্যাটাগরিভিত্তিক স্টক হিসাব' },
                icon: Zap,
            },
            {
                title: { en: 'General Retail & Traders', bn: 'জেনারেল রিটেইল স্টোর' },
                desc: { en: 'Cash & credit wholesale & retail sales management', bn: 'নগদ ও বাকিতে পাইকারি ও খুচরা বিক্রয়' },
                icon: ShoppingCart,
            },
        ],
        featuresTitle: { en: 'Powerful Features', bn: 'পাওয়ারফুল ফিচারসমূহ' },
        featuresHeadline: {
            en: 'Everything your retail store needs to run smoothly',
            bn: 'আপনার দোকানের যাবতীয় কাজ এখন হবে নিমিষেই'
        },
        featuresSubtitle: {
            en: 'Leave behind calculation errors, lost notebooks, and blind business guesswork.',
            bn: 'জটিল খাতা-কলম আর ক্যালকুলেটরের দিন শেষ। আধুনিক খুচরা দোকানের সব প্রয়োজন এক জায়গায়।'
        },
        features: [
            {
                title: { en: 'High-Speed POS & Barcode Billing', bn: 'হাই-স্পিড POS ও বারকোড সেলস' },
                desc: {
                    en: 'Press F2 anywhere to open the checkout screen. Scan barcodes in seconds and accept Cash, Mobile Pay, or Credit Due.',
                    bn: 'কীবোর্ডের F2 চাপলেই বিক্রয় স্ক্রিন ওপেন। বারকোড স্ক্যানার দিয়ে নিমিষেই আইটেম যোগ করুন এবং ক্যাশ, বিকাশ বা বাকিতে বিক্রি করুন।'
                },
                icon: Zap,
                color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950',
            },
            {
                title: { en: 'Digital Customer Credit Ledger (বাকি খাতা)', bn: 'কাস্টমারের ডিজিটাল বাকির খাতা' },
                desc: {
                    en: 'Complete ledger for every customer. Track past dues, payments made, and collect dues with instant payment vouchers.',
                    bn: 'কোন কাস্টমারের কাছে কত টাকা বাকি আছে, কবে কত টাকা জমা দিয়েছে তার পূর্ণাঙ্গ লেজার খতিয়ান। ১ ক্লিকে জমা ভাউচার তৈরি করুন।'
                },
                icon: Users,
                color: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
            },
            {
                title: { en: 'Accurate Profit & Loss Tracking (WAC)', bn: 'প্রতিটি পণ্যে আসল লাভ হিসাব' },
                desc: {
                    en: 'Weighted Average Costing recalculates real purchase costs upon new purchases, showing true realized profit on every item sold.',
                    bn: 'গড় ক্রয়মূল্য (Weighted Average Cost) পদ্ধতিতে সফটওয়্যার প্রতিটি পণ্যের কেনা দামের সাথে মিলিয়ে দিন শেষে আসল নিট লাভ বের করে দেয়।'
                },
                icon: BarChart3,
                color: 'text-purple-600 bg-purple-100 dark:bg-purple-950',
            },
            {
                title: { en: 'Proactive Low-Stock & Reorder Alerts', bn: 'লো-স্টক সতর্কবার্তা ও ইনভেন্টরি' },
                desc: {
                    en: 'Visual red alerts appear before items run out of stock. Database row locking prevents selling negative phantom stock.',
                    bn: 'দোকানের কোনো মালামাল শেষ হয়ে যাওয়ার আগেই সফটওয়্যার লাল সতর্কতা দেখাবে। নেগেটিভ বা না থাকা স্টক বিক্রি হওয়া প্রতিরোধ করা।'
                },
                icon: AlertCircle,
                color: 'text-amber-600 bg-amber-100 dark:bg-amber-950',
            },
            {
                title: { en: 'Protected Salesman & Cashier Mode', bn: 'সেলসম্যানের জন্য নিরাপদ কাউন্টার ভিউ' },
                desc: {
                    en: 'Sales clerks and cashiers can scan and bill, while purchase costs, profit margins, and owner expenses remain completely masked.',
                    bn: 'কর্মচারী বা ক্যাশিয়ার শুধুমাত্র বিক্রি করবে। দোকানের পণ্যের কেনা দাম, মোট লাভ বা ব্যবসায়িক হিসাব কর্মচারীদের থেকে স্বয়ংক্রিয়ভাবে গোপন থাকবে।'
                },
                icon: EyeOff,
                color: 'text-rose-600 bg-rose-100 dark:bg-rose-950',
            },
            {
                title: { en: '9 In-depth Financial & Stock Reports', bn: '৯টি ব্যবসায়িক রিপোর্ট ও এক্সেল এক্সপোর্ট' },
                desc: {
                    en: 'Download instant reports for sales, stock valuation at cost, supplier payable dues, and expense breakdown with CSV export.',
                    bn: 'বিক্রি, ক্রয়, লাভ-ক্ষতি, সাপ্লায়ার দেনা, কাস্টমার বাকি ও মালামালের বর্তমান মোট মূল্যের বিস্তারিত রিপোর্ট যেকোনো সময় এক ক্লিকে ডাউনলোড করুন।'
                },
                icon: FileSpreadsheet,
                color: 'text-teal-600 bg-teal-100 dark:bg-teal-950',
            },
        ],
        comparisonTitle: { en: 'See The Difference', bn: 'পার্থক্য দেখুন' },
        comparisonHeadline: {
            en: 'Traditional Paper Khata vs StoreManager Digital Solution',
            bn: 'সনাতন খাতা-কলম বনাম StoreManager ডিজিটাল সমাধান'
        },
        comparisonHeaders: {
            aspect: { en: 'Aspect', bn: 'বিষয়' },
            traditional: { en: 'Traditional Paper Notebook (খাতা)', bn: 'সনাতন খাতা-কলমের হিসাব' },
            storemanager: { en: 'StoreManager Digital Software', bn: 'StoreManager ডিজিটাল সফটওয়্যার' },
        },
        comparisonRows: [
            {
                topic: { en: 'Customer Credit Due Ledger', bn: 'বাকির হিসাব ও প্রমাণ' },
                traditional: { en: 'If the notebook tears or gets wet, the credit history is lost forever.', bn: 'খাতা ছিঁড়ে গেলে বা পানি পড়লে পুরো বাকির হিসাব হারিয়ে যায়।' },
                storemanager: { en: '100% secure on cloud. Lifetime customer ledger with balance history.', bn: 'ক্লাউডে শতভাগ সুরক্ষিত। আজীবন কাস্টমার লেজার সংরক্ষিত থাকে।' },
            },
            {
                topic: { en: 'Real Daily Profit Calculation', bn: 'আসল লাভ বের করা' },
                traditional: { en: 'Owners guess profit from cash drawer, without knowing if they made a profit or loss.', bn: 'ক্যাশ বাক্সে থাকা টাকা দেখে অনুমান করা লাগে, লাভ হয়েছে না ক্ষতি তা অজানা থাকে।' },
                storemanager: { en: 'Calculates true gross & net profit against real purchase costs with 1 click.', bn: 'প্রতিটি পণ্যের গড় কেনা দামের সাথে মিলিয়ে ১ ক্লিকে দিনের খাঁটি লাভ দেখা যায়।' },
            },
            {
                topic: { en: 'Stock Control & Out-of-Stock Loss', bn: 'স্টকের হিসাব ও ক্ষতি' },
                traditional: { en: 'Owners discover items are out of stock only after customers leave disappointed.', bn: 'মাল শেষ হওয়ার পর বুঝতে পারা যায়, ফলে কাস্টমার পণ্য না পেয়ে ফিরে যায়।' },
                storemanager: { en: 'Proactive red alerts before stock runs out, preventing missed sales.', bn: 'স্টক নির্দিষ্ট পরিমাণের নিচে নামলেই লাল ওয়ার্নিং দেয়, সময়মতো অর্ডার করা যায়।' },
            },
            {
                topic: { en: 'Counter Speed & Thermal Receipts', bn: 'বিক্রির গতি ও রশিদ' },
                traditional: { en: 'Handwriting receipts creates long queues and slow service during peak hours.', bn: 'হাতে লিখে স্লিপ কাটতে কাস্টমারের লম্বা লাইন লেগে যায়।' },
                storemanager: { en: '2-second barcode checkout and instant 58mm/80mm thermal slip print.', bn: 'বারকোড স্ক্যানে ২ সেকেন্ডে বিক্রি এবং থার্মাল প্রিন্টারে ৫২/৮০মিমি রশিদ প্রিন্ট।' },
            },
            {
                topic: { en: 'Staff Privacy & Security', bn: 'কর্মচারী পরিচালনা ও নিরাপত্তা' },
                traditional: { en: 'Cashiers see purchase costs and sales margins, creating security risks.', bn: 'ক্যাশ কর্মচারীর হাতে ছেড়ে দিলে কেনা দাম জেনে যায় বা হিসাবে কারচুপি হতে পারে।' },
                storemanager: { en: 'Confidential costs and profit numbers are strictly masked for cashiers.', bn: 'কর্মচারীর কাছে কেনা দাম ও মোট লাভ লুকানো থাকে। ক্যাশ ও স্টক সুরক্ষিত থাকে।' },
            },
        ],
        howItWorksTitle: { en: '3 Simple Steps', bn: '৩টি সহজ ধাপ' },
        howItWorksHeadline: {
            en: 'How to get started with your digital store',
            bn: 'কীভাবে শুরু করবেন আপনার ডিজিটাল দোকান'
        },
        steps: [
            {
                num: '1',
                title: { en: 'Register Your Shop in 1 Minute', bn: 'দোকান রেজিস্ট্রেশন করুন' },
                desc: {
                    en: 'Enter your shop name, phone number, and address to create your private, secure store account.',
                    bn: 'আপনার দোকানের নাম, মোবাইল নাম্বার ও ঠিকানা দিয়ে মাত্র ১ মিনিটে বিনামূল্যে একটি অ্যাকাউন্ট খুলুন।'
                },
            },
            {
                num: '2',
                title: { en: 'Add Your Products & Stock', bn: 'পণ্য ও স্টক যুক্ত করুন' },
                desc: {
                    en: 'Input your product catalog with purchase costs, selling prices, and optional barcodes.',
                    bn: 'দোকানের পণ্যসমূহ, পাইকারি কেনা দাম ও বিক্রয়মূল্য যুক্ত করুন। বারকোড থাকলে স্ক্যান করে নিন।'
                },
            },
            {
                num: '3',
                title: { en: 'Start Selling & Track Real Profit', bn: 'বিক্রি ও লাভ উপভোগ করুন' },
                desc: {
                    en: 'Checkout customers in seconds, manage dues, and review your daily net profit before closing your store.',
                    bn: 'কাস্টমারকে ক্লিকে পণ্য বিক্রি করুন, বাকি থাকলে এন্ট্রি দিন এবং দিনশেষে আসল লাভের হিসাব দেখে বাড়ি ফিরুন।'
                },
            },
        ],
        ctaSection: {
            badge: { en: 'Start Free Trial Today', bn: 'আজই শুরু করুন' },
            headline: {
                en: 'Ready to modernize your retail store?',
                bn: 'আপনার দোকানকে আজই সম্পূর্ণ ডিজিটাল করতে প্রস্তুত?'
            },
            subtitle: {
                en: 'Join retail store owners who have eliminated accounting mistakes, lost dues, and inventory chaos. Try it free for 7 days with zero risk.',
                bn: 'হাজারো সচেতন দোকানদারের মতো আপনিও মুক্তি পান খাতার হিসাবের জটিলতা থেকে। আজই ৭ দিনের ফ্রি ট্রায়াল দিয়ে শুরু করুন।'
            },
            btnRegister: { en: 'Create Free Store Account', bn: 'বিনামূল্যে দোকান তৈরি করুন' },
            noCard: { en: '✓ No credit card required', bn: '✓ কোনো ক্রেডিট কার্ডের প্রয়োজন নেই' },
            setupTime: { en: '✓ Set up in less than 2 minutes', bn: '✓ মাত্র ২ মিনিটে শুরু করা যায়' },
            supportReady: { en: '✓ Full WhatsApp setup support', bn: '✓ সার্বক্ষণিক হোয়াটসঅ্যাপ সাপোর্ট' },
        },
        faqTitle: { en: 'Frequently Asked Questions', bn: 'সচরাচর জিজ্ঞাসিত প্রশ্ন' },
        faqHeadline: { en: 'Answers to Common Questions', bn: 'সাধারণ ব্যবসায়ীদের প্রশ্নোত্তর' },
        faqs: [
            {
                q: {
                    en: 'Can I run this software from a smartphone or tablet?',
                    bn: 'সফটওয়্যারটি কি মোবাইল দিয়েও ব্যবহার করা যাবে?'
                },
                a: {
                    en: 'Yes, absolutely. StoreManager is responsive and works smoothly on smartphones, tablets, laptops, and desktop computers in any browser.',
                    bn: 'হ্যাঁ, সম্পূর্ণভাবে। এটি যেকোনো স্মার্টফোন, ট্যাবলেট, ল্যাপটপ বা ডেস্কটপ কম্পিউটারের ব্রাউজারে সুন্দরভাবে কাজ করে। কোনো কিছু আলাদা ডাউনলোড বা ইনস্টল করার দরকার নেই।'
                },
            },
            {
                q: {
                    en: 'Does it support standard 58mm & 80mm thermal receipt printers?',
                    bn: 'থার্মাল প্রিন্টারে কি রিসিট স্লিপ প্রিন্ট করা যাবে?'
                },
                a: {
                    en: 'Yes! StoreManager includes thermal receipt templates for 58mm and 80mm POS printers. Print receipts directly upon checkout with one click.',
                    bn: 'হ্যাঁ! StoreManager-এ стандартный 58mm এবং 80mm পিওএস থার্মাল স্লিপ প্রিন্ট ফরম্যাট তৈরি করা আছে। বিক্রি সম্পন্ন করেই ১ ক্লিকে প্রিন্ট দিতে পারবেন।'
                },
            },
            {
                q: {
                    en: 'Is my store customer dues and financial data safe and confidential?',
                    bn: 'আমার দোকানের বাকির হিসাব ও লাভ-ক্ষতির তথ্য কি অন্যরা দেখতে পারবে?'
                },
                a: {
                    en: 'Your store database is isolated and securely encrypted. Other shops or cashiers cannot view your confidential purchase prices or profit figures.',
                    bn: 'না, কখনো না। প্রতিটি দোকানের ডাটাবেস সম্পূর্ণ আলাদা এবং এনক্রিপ্ট করা। এমনকি আপনার সেলসম্যানদের জন্যও কেনা দাম ও লাভের হিসাব লুকানো থাকে।'
                },
            },
            {
                q: {
                    en: 'Will it work smoothly on slow or mobile data connections?',
                    bn: 'ইন্টারনেট গতি ধীর হলে কি সফটওয়্যার চলবে?'
                },
                a: {
                    en: 'Yes. The application is optimized with lightweight asset bundles and runs fast even on standard 2G/3G or mobile hotspot connections.',
                    bn: 'হ্যাঁ, সফটওয়্যারটি আধুনিক প্রযুক্তিতে খুব হালকা করে বিল্ড করা হয়েছে। সাধারণ ২জি/৩জি বা মোবাইল হটস্পট ইন্টারনেট দিয়েও নিমিষেই পেজ লোড হয়।'
                },
            },
        ],
        footer: {
            desc: {
                en: 'Modern, reliable digital management software built for retail shops, grocery stores, stationery, and small businesses in Bangladesh and worldwide.',
                bn: 'বাংলাদেশের ও বিশ্বজুড়ে খুচরা ব্যবসায়ীদের হিসাব-নিকাশ, স্টক ম্যানেজমেন্ট, কাস্টমার বাকি খাতা ও প্রতিদিনের খাঁটি লাভ জানার আধুনিক বিশ্বস্ত ডিজিটাল সমাধান।'
            },
            quickLinks: { en: 'Quick Links', bn: 'কুইক লিঙ্ক' },
            account: { en: 'Account', bn: 'অ্যাকাউন্ট ও প্রবেশ' },
            rights: { en: 'All rights reserved. Built for retailers worldwide.', bn: 'সর্বস্বত্ব সংরক্ষিত। খুচরা ব্যবসায়ীদের বিশ্বস্ত সহযোগী।' },
        }
    };

    return (
        <>
            <Head title={lang === 'en' ? "StoreManager — Modern Retail Inventory, POS & Store Management" : "StoreManager — মুদি, স্টেশনারি ও রিটেইল দোকানের আধুনিক ডিজিটাল সফটওয়্যার"} />

            <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 font-sans">
                {/* ── Top Announcement & WhatsApp Contact Bar ────────────────────── */}
                <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <span className="inline-flex items-center gap-1 bg-emerald-700/60 text-emerald-200 px-2 py-0.5 rounded-full font-medium text-[11px]">
                                <Sparkles className="w-3 h-3 text-amber-400" /> {t.topBanner.badge[lang]}
                            </span>
                            <span>{t.topBanner[lang]}</span>
                        </div>
                        <div className="flex items-center gap-4 justify-center sm:justify-end">
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
                                    {t.nav.tagline[lang]}
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.features[lang]}
                            </a>
                            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.howItWorks[lang]}
                            </a>
                            <a href="#comparison" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.comparison[lang]}
                            </a>
                            <a href="#trial" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.pricing[lang]}
                            </a>
                            <Link href={route('about')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                {t.nav.about[lang]}
                            </Link>
                        </nav>

                        {/* Language Switcher & Action Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Modern Language Toggle */}
                            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
                                <button
                                    onClick={() => switchLang('en')}
                                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                                        lang === 'en'
                                            ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                    title="Switch to English"
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
                                    title="বাংলায় পরিবর্তন করুন"
                                >
                                    বাংলা
                                </button>
                            </div>

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
                                        {t.nav.dashboard[lang]} <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium">
                                            {t.nav.login[lang]}
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 text-xs sm:text-sm font-semibold">
                                            {t.nav.register[lang]}
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
                                    {t.hero.badge[lang]}
                                </div>

                                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.25]">
                                    {t.hero.titleStart[lang]}
                                    <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 underline-offset-8">
                                        {t.hero.titleHighlight[lang]}
                                    </span>
                                    {t.hero.titleEnd[lang]}
                                </h1>

                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    {t.hero.subtitle[lang]}
                                </p>

                                {/* Hero CTAs */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                                    <Link href={route('register')} className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-6 text-base font-semibold shadow-lg shadow-emerald-600/25 gap-2">
                                            {t.hero.ctaRegister[lang]} <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>

                                    <a href="#how-it-works" className="w-full sm:w-auto">
                                        <Button size="lg" variant="outline" className="w-full px-6 py-6 text-base font-medium border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2">
                                            {t.hero.ctaHowItWorks[lang]}
                                        </Button>
                                    </a>

                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/10"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {t.hero.ctaWhatsApp[lang]}
                                    </a>
                                </div>

                                {/* Micro highlights */}
                                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>{t.hero.badges.noInstall[lang]}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>{t.hero.badges.mobilePc[lang]}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>{t.hero.badges.thermal[lang]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual Card Column */}
                            <div className="lg:col-span-5">
                                <div className="relative mx-auto max-w-md lg:max-w-none">
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-25 blur-xl" />

                                    <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
                                        {/* Mock Header */}
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">
                                                    {t.mockup.storeName[lang]}
                                                </span>
                                            </div>
                                            <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                                                {t.mockup.liveCounter[lang]}
                                            </span>
                                        </div>

                                        {/* Today's Quick Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
                                                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">{t.mockup.todaySales[lang]}</p>
                                                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-0.5 font-mono">৳ 24,560</p>
                                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">{t.mockup.ordersCompleted[lang]}</p>
                                            </div>
                                            <div className="bg-blue-50/80 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                                                <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">{t.mockup.todayProfit[lang]}</p>
                                                <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-0.5 font-mono">৳ 4,280</p>
                                                <p className="text-[10px] text-blue-700 dark:text-blue-400 mt-1">{t.mockup.margin[lang]}</p>
                                            </div>
                                        </div>

                                        {/* Real-time Cart Preview */}
                                        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                                            <div className="flex items-center justify-between text-slate-500 font-medium pb-1 border-b border-slate-200/60 dark:border-slate-700">
                                                <span>{t.mockup.colItem[lang]}</span>
                                                <span>{t.mockup.colQtyPrice[lang]}</span>
                                                <span>{t.mockup.colTotal[lang]}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{t.mockup.item1[lang]}</span>
                                                <span className="text-slate-500">1 × ৳ 890</span>
                                                <span className="font-mono font-bold">৳ 890</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{t.mockup.item2[lang]}</span>
                                                <span className="text-slate-500">1 × ৳ 1,750</span>
                                                <span className="font-mono font-bold">৳ 1,750</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{t.mockup.item3[lang]}</span>
                                                <span className="text-slate-500">2 × ৳ 135</span>
                                                <span className="font-mono font-bold">৳ 270</span>
                                            </div>
                                            <div className="pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between font-bold text-sm">
                                                <span>{t.mockup.totalPaid[lang]}</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">৳ 2,910</span>
                                            </div>
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="flex items-center justify-between text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Printer className="w-3.5 h-3.5 text-amber-600" /> {t.mockup.receiptReady[lang]}
                                            </span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.mockup.customerDue[lang]}</span>
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
                            {t.targetTitle[lang]}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {t.targets.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title[lang]}</h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc[lang]}</p>
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
                                {t.featuresTitle[lang]}
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {t.featuresHeadline[lang]}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                {t.featuresSubtitle[lang]}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {t.features.map((feat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                                        <feat.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {feat.title[lang]}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {feat.desc[lang]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Comparison: Khata vs StoreManager ─────────────────────────── */}
                <section id="comparison" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                {t.comparisonTitle[lang]}
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {t.comparisonHeadline[lang]}
                            </h2>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70">
                                        <th className="py-4 px-5 font-bold text-slate-700 dark:text-slate-200 w-1/3">
                                            {t.comparisonHeaders.aspect[lang]}
                                        </th>
                                        <th className="py-4 px-5 font-bold text-rose-600 dark:text-rose-400 w-1/3">
                                            {t.comparisonHeaders.traditional[lang]}
                                        </th>
                                        <th className="py-4 px-5 font-bold text-emerald-600 dark:text-emerald-400 w-1/3 bg-emerald-50/60 dark:bg-emerald-950/30">
                                            {t.comparisonHeaders.storemanager[lang]}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {t.comparisonRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                            <td className="py-3.5 px-5 font-semibold text-slate-800 dark:text-slate-200">
                                                {row.topic[lang]}
                                            </td>
                                            <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">
                                                {row.traditional[lang]}
                                            </td>
                                            <td className="py-3.5 px-5 text-emerald-900 dark:text-emerald-200 font-medium bg-emerald-50/40 dark:bg-emerald-950/20">
                                                {row.storemanager[lang]}
                                            </td>
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
                                {t.howItWorksTitle[lang]}
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {t.howItWorksHeadline[lang]}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {t.steps.map((st, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                                        {st.num}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                        {st.title[lang]}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {st.desc[lang]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link href={route('about')}>
                                <Button variant="outline" className="text-xs font-semibold gap-1.5">
                                    {lang === 'en' ? 'Read Complete Guide & Walkthrough' : 'সম্পূর্ণ নির্দেশিকা ও বিস্তারিত জানুন'} <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── High-Converting Free Trial CTA Section (Replaced Open Demo Credentials) ── */}
                <section id="trial" className="py-20 bg-emerald-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-800/40 via-transparent to-transparent pointer-events-none" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="bg-gradient-to-tr from-emerald-900/90 to-teal-900/90 border border-emerald-700/60 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md text-center space-y-6">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                {t.ctaSection.badge[lang]}
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                                {t.ctaSection.headline[lang]}
                            </h2>

                            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                                {t.ctaSection.subtitle[lang]}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                                <Link href={route('register')}>
                                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-6 text-base shadow-lg shadow-emerald-500/20 gap-2">
                                        {t.ctaSection.btnRegister[lang]} <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>

                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-300" />
                                    {whatsappNumber}
                                </a>
                            </div>

                            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200/80">
                                <span>{t.ctaSection.noCard[lang]}</span>
                                <span>{t.ctaSection.setupTime[lang]}</span>
                                <span>{t.ctaSection.supportReady[lang]}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ─────────────────────────────────────────────── */}
                <section className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                {t.faqTitle[lang]}
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {t.faqHeadline[lang]}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {t.faqs.map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        {faq.q[lang]}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                                        {faq.a[lang]}
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
                                {t.footer.desc[lang]}
                            </p>
                            <p className="text-emerald-400 font-semibold pt-1">
                                WhatsApp: {whatsappNumber}
                            </p>
                        </div>

                        <div>
                            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                                {t.footer.quickLinks[lang]}
                            </h5>
                            <ul className="space-y-2">
                                <li><a href="#features" className="hover:text-white transition-colors">{t.nav.features[lang]}</a></li>
                                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t.nav.howItWorks[lang]}</a></li>
                                <li><a href="#trial" className="hover:text-white transition-colors">{t.nav.pricing[lang]}</a></li>
                                <li><Link href={route('about')} className="hover:text-white transition-colors">{t.nav.about[lang]}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
                                {t.footer.account[lang]}
                            </h5>
                            <ul className="space-y-2">
                                <li><Link href={route('login')} className="hover:text-white transition-colors">{t.nav.login[lang]}</Link></li>
                                <li><Link href={route('register')} className="hover:text-white transition-colors">{t.nav.register[lang]}</Link></li>
                                <li>
                                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                                        WhatsApp Chat
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-slate-500">
                        <p>© {new Date().getFullYear()} StoreManager. {t.footer.rights[lang]}</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
