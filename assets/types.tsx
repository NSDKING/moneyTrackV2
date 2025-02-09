type Wallet = {
    ID: number; // Primary key
    user_id: number; // Foreign key referencing the 'users' table
    name: string; // Name of the wallet
    icon:string;//icon of the wallet
    balance: number; // Decimal value representing the balance
    created_at: string; // Timestamp for when the wallet was created
    updated_at: string; // Timestamp for when the wallet was last updated
};

type Transaction = {
    ID: number; // Primary key
    wallet_id: number; // Foreign key referencing the 'wallets' table
    category_id: number; // Foreign key referencing the 'categories' table (optional)
    type: 'deposit' | 'withdrawal' | 'transfer'; // Transaction type
    amount: number; // Decimal value representing the transaction amount
    description?: string; // Optional description of the transaction
    transaction_date: string; // Timestamp for when the transaction occurred
    transfer_to_wallet_id?: number | null; // Foreign key referencing another wallet for transfers (optional)
    is_deleted?: boolean; // Indicates if the Transaction is deleted

};

enum CategoryType {
    Expense = 'expense',
    Income = 'income',
}

type Category = {
    ID: number; // Primary key for the category
    name: string; // Name of the category
    description?: string | null; // Optional description of the category
    budgeted?: boolean; // Indicates if the category is budgeted
    budget_limit?: number | null; // Optional budget limit for the category
    startDate: string; // Date indicating the start of the category's budget
    endDate: string; // Date indicating the end of the category's budget
    icon: string; // Icon representing the category
    color: string; // Color associated with the category
    type: CategoryType; // Type of the category (expense or income)
};

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    setTransactions: (transactions: Transaction[]) => void; // Function to update transactions
    transactions: Transaction[]; // Current transactions array
    categories: Category[]; // Current Categories array
    setCategories: (categories: Category[]) => void; // Function to update Categories

}

type Icon = {
    id: number;
    name: string;
    label: string;
};

type CategoryIcons = {
    [key: string]: Icon[]; // This allows any string key to index into an array of Icon
};

interface CategorySelectorProps {
    categoryType: string; // Define the type for selectedType
    setCategoryType: (type: string) => void; // Define the type for setSelectedType
}


interface AppContextType {
    wallets: Wallet[];
    setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    BudgetArray: Category[];
    setBudgetArray: React.Dispatch<React.SetStateAction<Category[]>>;
}

interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
    selectedCategory: string;
}

// Define the type for the budget_Tracking table
interface BudgetTracking {
    id: number; // Primary key
    next_rest: string; // TIMESTAMP, can be represented as a string
    amount_spent: number; // DECIMAL(10, 2)
    budget_limit: number; // DECIMAL(10, 2)
    category_id: number; // Foreign key referencing categories(ID)
    created_at: string; // TIMESTAMP, can be represented as a string
    updated_at: string; // TIMESTAMP, can be represented as a string
}


interface EditTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    transaction: Transaction ; 
}

interface RenderWalletCardProps {
    item: Wallet;
    onPress?: () => void;
}

type MonthlyTrends = {
    labels: string[];
    expenses: number[];
    income: number[];
  };



export { Wallet, Transaction, Category, AddTransactionModalProps,Icon, CategoryIcons, CategorySelectorProps, AppContextType, AddBudgetModalProps, BudgetTracking, EditTransactionModalProps, RenderWalletCardProps, MonthlyTrends };

