export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    is_super_admin: boolean;
    shop_id: number | null;
    roles: string[];
    permissions: string[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Impersonator = {
    id: number;
    name: string;
    type: 'super_admin' | 'shop_owner';
    shop_name?: string | null;
    staff_name?: string | null;
};

export type Auth = {
    user: User;
};

export type Shop = {
    id: number;
    name: string;
    currency: string;
    currency_symbol: string;
    logo: string | null;
    invoice_prefix: string;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

// ── Business Types ─────────────────────────────────────────────────────────────

export type Product = {
    id: number;
    name: string;
    sku: string | null;
    barcode: string | null;
    brand: string | null;
    purchase_price: number;
    selling_price: number;
    avg_cost: number;
    current_stock: number;
    min_stock_level: number;
    status: 'active' | 'inactive';
    image: string | null;
    category?: { id: number; name: string };
    unit?: { id: number; name: string; abbreviation: string };
};

export type Customer = {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    total_purchase: number;
    total_paid: number;
    total_due: number;
    status: 'active' | 'inactive';
};

export type Supplier = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    total_purchase: number;
    total_paid: number;
    total_due: number;
    status: 'active' | 'inactive';
};

export type Sale = {
    id: number;
    invoice_no: string;
    sale_date: string;
    subtotal: number;
    discount: number;
    total: number;
    paid_amount: number;
    due_amount: number;
    change_amount: number;
    gross_profit: number;
    payment_method: string;
    status: 'pending' | 'partial' | 'paid';
    customer?: Customer;
    items?: SaleItem[];
};

export type SaleItem = {
    id: number;
    quantity: number;
    unit_price: number;
    unit_cost: number;
    subtotal: number;
    profit: number;
    product: Product;
};

export type Purchase = {
    id: number;
    invoice_no: string | null;
    purchase_date: string;
    subtotal: number;
    discount: number;
    additional_cost: number;
    total: number;
    paid_amount: number;
    due_amount: number;
    payment_method: string;
    status: 'pending' | 'partial' | 'paid';
    supplier?: Supplier;
    items?: PurchaseItem[];
};

export type PurchaseItem = {
    id: number;
    quantity: number;
    unit_cost: number;
    subtotal: number;
    product: Product;
};

export type Expense = {
    id: number;
    amount: number;
    expense_date: string;
    description: string | null;
    payment_method: string;
    category?: { id: number; name: string };
};

export type StockMovement = {
    id: number;
    type: string;
    quantity: number;
    unit_cost: number;
    notes: string | null;
    created_at: string;
    product?: { id: number; name: string };
    user?: { id: number; name: string };
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
