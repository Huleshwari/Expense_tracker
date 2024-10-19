index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<body>
    <div class="container">
        <h1>Expense Tracker</h1>

        <!-- Balance Section -->
        <div class="balance-section">
            <input type="number" id="balance-input" placeholder="Set your balance" />
            <button id="set-balance-btn">Set Balance</button>
        </div>

        <!-- Remaining Balance Display -->
        <div class="balance-display">
            <h2>Remaining Balance: ₹<span id="remaining-balance">0</span></h2>
        </div>


        <!-- Total Balance Display -->
        <div class="total-balance-display">
            <h2>Total Balance: ₹<span id="total-balance">0</span></h2>
        </div>

        <!-- Expense Form -->
        <form id="expense-form">
            <input type="text" id="expense-name" placeholder="Expense Name" required />
            <input type="number" id="expense-amount" placeholder="Amount" required />
            <select id="expense-category" required>
                <option value="" disabled selected>Select Category</option>
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
            </select>
            <input type="date" id="expense-date" />
            <button type="submit">Add Expense</button>
        </form>

        <!-- Expense List -->
        <ul id="expense-list"></ul>

        <!-- Total Expenses -->
        <div id="total-expenses">
            Total Expenses: ₹<span id="total-amount">0</span>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>
```
style.css
```css
body {
    /* font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0; */
/* background: linear-gradient(to right, #e0f7fa, #b2ebf2); */
background: linear-gradient(to right, #f3e5f5, #e1bee7);

    margin: 0;
    padding: 0;
}

.container {
    width: 50%;
    margin: 50px auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
}

.balance-section input {
    width: 60%;
    /* Make the input box larger */
    padding: 10px;
    margin-right: 10px;
}

.balance-section button {
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
}

.balance-section button:hover {
    background-color: #218838;
}

.balance-display h2 {
    text-align: center;
    font-size: 20px;
}

.total-balance-display h2 {
    text-align: center;
    font-size: 20px;
    color: #333;
}

form {
    display: flex;
    flex-direction: column;
}

input,
select,
button {
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    background-color: #28a745;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

#balance,
#total-expenses {
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}

ul {
    list-style-type: none;
    padding: 0;
}

#expense-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

#expense-list li>div {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#expense-list li>div span {
    width: 70%;
    /* Set a fixed width for the text part */
}

#expense-list li button {
    margin-left: 10px;
    /* Adds spacing between the buttons */
}

.edit-btn,
.delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
}

.edit-btn i {
    color: #3498db;
}

.delete-btn i {
    color: #e74c3c;
}

.edit-btn:hover i {
    color: #2980b9;
}

.delete-btn:hover i {
    color: #c0392b;
}
```
script.js
```javascript
let totalBalance = 0;
let remainingBalance = 0; // Use this variable to track remaining balance
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
        totalBalance += newBalance;  // Add to total balance
        remainingBalance += newBalance;  // Add to remaining balance
        localStorage.setItem('totalBalance', totalBalance); // Save to localStorage
        updateBalance();  // Update the balance display
    } else {
        alert('Please enter a valid positive balance.');
    }
});

// Function to add an expense
document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission from refreshing the page

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
    remainingBalance -= amount;  // Subtract the amount from remaining balance

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
    remainingBalance += expense.amount;  // Add back the amount to remaining balance
    updateBalance();
}

// Function to edit an expense
function editExpense(expense, listItem) {
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-date').value = expense.date;

    // Remove the old expense and update total expenses
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

// Call loadExpenses on page load
loadExpenses();
```
