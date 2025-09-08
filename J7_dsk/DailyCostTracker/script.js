  // Set today's date as default
        document.getElementById('expense-date').valueAsDate = new Date();
        
        // Expense data storage
        let expenses = [
            { id: 1, date: '2023-08-19', description: 'Office printer paper', category: 'supplies', amount: 85.00 },
            { id: 2, date: '2023-08-19', description: 'Client lunch meeting', category: 'food', amount: 124.50 },
            { id: 3, date: '2023-08-19', description: 'Monthly internet bill', category: 'utilities', amount: 89.99 },
            { id: 4, date: '2023-08-19', description: 'Taxi to client office', category: 'travel', amount: 45.00 },
            { id: 5, date: '2023-08-19', description: 'Conference room supplies', category: 'supplies', amount: 32.75 }
        ];
        
        // Form submission handler for new expense
        document.getElementById('expense-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const date = document.getElementById('expense-date').value;
            const description = document.getElementById('expense-description').value;
            const category = document.getElementById('expense-category').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            
            if(!description || !amount) {
                alert('Please fill in all fields');
                return;
            }
            
            // Create new expense
            const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
            const newExpense = {
                id: newId,
                date: date,
                description: description,
                category: category,
                amount: amount
            };
            
            expenses.push(newExpense);
            renderExpenses();
            
            // Reset form
            document.getElementById('expense-form').reset();
            document.getElementById('expense-date').valueAsDate = new Date();
            
            showNotification('Expense added successfully!');
        });
        
        // Edit button click handler
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editExpense(id);
            });
        });
        
        // Edit expense function
        function editExpense(id) {
            const expense = expenses.find(e => e.id === id);
            if (!expense) return;
            
            // Populate the edit form
            document.getElementById('edit-id').value = expense.id;
            document.getElementById('edit-date').value = expense.date;
            document.getElementById('edit-description').value = expense.description;
            document.getElementById('edit-category').value = expense.category;
            document.getElementById('edit-amount').value = expense.amount;
            
            // Show the edit form
            document.getElementById('edit-form').classList.add('active');
            
            // Scroll to the edit form
            document.getElementById('edit-form').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update form submission handler
        document.getElementById('update-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('edit-id').value);
            const date = document.getElementById('edit-date').value;
            const description = document.getElementById('edit-description').value;
            const category = document.getElementById('edit-category').value;
            const amount = parseFloat(document.getElementById('edit-amount').value);
            
            if(!description || !amount) {
                alert('Please fill in all fields');
                return;
            }
            
            // Update the expense
            const index = expenses.findIndex(e => e.id === id);
            if (index !== -1) {
                expenses[index] = { id, date, description, category, amount };
                renderExpenses();
            }
            
            // Hide the edit form
            document.getElementById('edit-form').classList.remove('active');
            
            showNotification('Expense updated successfully!');
        });
        
        // Cancel edit button
        document.getElementById('cancel-edit').addEventListener('click', function() {
            document.getElementById('edit-form').classList.remove('active');
        });
        
        // Delete button handler
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this expense?')) {
                    deleteExpense(id);
                }
            });
        });
        
        // Delete expense function
        function deleteExpense(id) {
            expenses = expenses.filter(e => e.id !== id);
            renderExpenses();
            showNotification('Expense deleted successfully!');
        }
        
        // Render expenses to the table
        function renderExpenses() {
            const tbody = document.querySelector('#expense-table tbody');
            tbody.innerHTML = '';
            
            expenses.forEach(expense => {
                const categoryText = getCategoryText(expense.category);
                const row = document.createElement('tr');
                row.setAttribute('data-id', expense.id);
                
                row.innerHTML = `
                    <td>${expense.date}</td>
                    <td>${expense.description}</td>
                    <td><span class="expense-category category-${expense.category}">${categoryText}</span></td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${expense.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${expense.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Reattach event listeners
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    editExpense(parseInt(this.getAttribute('data-id')));
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('Are you sure you want to delete this expense?')) {
                        deleteExpense(id);
                    }
                });
            });
        }
        
        // Helper function to get category text
        function getCategoryText(category) {
            const categories = {
                supplies: 'Office Supplies',
                travel: 'Travel & Transportation',
                utilities: 'Utilities',
                food: 'Food & Entertainment',
                other: 'Other Expenses'
            };
            return categories[category] || category;
        }
        
        // Show notification
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }