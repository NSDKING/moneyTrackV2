const walletLists = [
    { 
        id: '1', 
        type: 'Cash', 
        amount: '150,000', 
        icon: 'cash-outline',
        color: '#4A90E2', // Optional: Color code for UI consistency
        transactions: ['1', '2', '5', '9']
    },
    { 
        id: '2', 
        type: 'Bank', 
        amount: '250,000', 
        icon: 'card-outline',
        color: '#27AE60',
        transactions: ['3', '6', '7', '12']
    },
    { 
        id: '3', 
        type: 'Savings', 
        amount: '450,000', 
        icon: 'wallet-outline',
        color: '#F1C40F',
        transactions: ['4', '8', '11', '16']
    },
    { 
        id: '4', 
        type: 'Investment', 
        amount: '300,000', 
        icon: 'trending-up-outline',
        color: '#E67E22',
        transactions: ['16']
    },
    { 
        id: '5', 
        type: 'Loan', 
        amount: '-100,000', 
        icon: 'alert-circle-outline',
        color: '#E74C3C',
        transactions: ['10', '13']
    },
    { 
        id: '6', 
        type: 'Credit Card', 
        amount: '-50,000', 
        icon: 'card-outline',
        color: '#8E44AD',
        transactions: ['14', '15']
    },
    { 
        id: '7', 
        type: 'Emergency Fund', 
        amount: '200,000', 
        icon: 'shield-checkmark-outline',
        color: '#2ECC71',
        transactions: ['17']
    },
    { 
        id: '8', 
        type: 'Travel', 
        amount: '120,000', 
        icon: 'airplane-outline',
        color: '#3498DB',
        transactions: ['18', '19']
    },
    { 
        id: '9', 
        type: 'Petty Cash', 
        amount: '30,000', 
        icon: 'cash-outline',
        color: '#F39C12',
        transactions: ['20']
    },
    { 
        id: '10', 
        type: 'Gift', 
        amount: '75,000', 
        icon: 'gift-outline',
        color: '#E91E63',
        transactions: ['21']
    },
];

export default walletLists;