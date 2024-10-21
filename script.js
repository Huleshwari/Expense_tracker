let totalBalance = 0;
let remainingBalance = 0; 
let totalExpenses = 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Load balance from localStorage on page load
if (localStorage.getItem('totalBalance')) {
    totalBalance = parseFloat(localStorage.getItem('totalBalance'));
    remainingBalance = totalBalance - totalExpenses;
    updateBalance();
}

// Function to set the total balance
document.getElementById('set-balance-btn').addEventListener('click', () => {
    const newBalance = parseFloat(document.getElementById('balance-input').value);
    if (newBalance >= 0) {
        totalBalance += newBalance;  
        remainingBalance += newBalance;  
        localStorage.setItem('totalBalance', totalBalance); 
        updateBalance();  
    } else {
        alert('Please enter a valid positive balance.');
    }
});

// Function to add an expense
document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value || new Date().toISOString().split('T')[0];

    // Validate inputs
    if (!name || amount <= 0 || !category) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    // Check if the remaining balance is enough for the expense
    if (amount > remainingBalance) {
        alert('You do not have sufficient balance!');
        return;
    }

    // Add the expense
    const expense = { name, amount, category, date };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update total expenses and remaining balance
    totalExpenses += amount;
    remainingBalance -= amount;  

    addExpenseToList(expense);
    updateBalance();

    // Clear form inputs
    document.getElementById('expense-form').reset();
});

// Function to add an expense to the list view
function addExpenseToList(expense) {
    const expenseList = document.getElementById('expense-list');
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <span>${expense.name} - ₹${expense.amount} - ${expense.category} - ${expense.date}</span>
            <button class="edit-btn"><i class="fas fa-pen"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;
    expenseList.appendChild(li);

    // Add event listeners for edit and delete buttons
    li.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(expense, li));
    li.querySelector('.edit-btn').addEventListener('click', () => editExpense(expense, li));
}

// Function to delete an expense
function deleteExpense(expense, listItem) {
    expenses = expenses.filter((e) => e !== expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    listItem.remove();
    totalExpenses -= expense.amount;
    remainingBalance += expense.amount;  
    updateBalance();
}

// Function to edit an expense
function editExpense(expense, listItem) {
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-date').value = expense.date;

    deleteExpense(expense, listItem);
}

// Function to update the balance and total expenses
function updateBalance() {
    document.getElementById('total-amount').innerText = totalExpenses.toFixed(2);
    document.getElementById('remaining-balance').innerText = remainingBalance.toFixed(2);
    document.getElementById('total-balance').innerText = totalBalance.toFixed(2);
}

// Load expenses from localStorage on page load
function loadExpenses() {
    expenses.forEach(addExpenseToList);
    totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    remainingBalance = totalBalance - totalExpenses;
    updateBalance();
}

// Filter expenses by date range
document.getElementById('filter-btn').addEventListener('click', () => {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    
    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });

    // Clear current list and display filtered expenses
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    filteredExpenses.forEach(addExpenseToList);
});

// Reset filters
document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    loadExpenses(); // Reload all expenses
});

// Call loadExpenses on page load
loadExpenses();
