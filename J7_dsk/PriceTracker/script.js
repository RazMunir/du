        // Sample initial products
        let products = [
            { id: 1, name: "Laptop Pro", category: "Electronics", price: 1299.99 },
            { id: 2, name: "Wireless Headphones", category: "Audio", price: 199.99 },
            { id: 3, name: "Smart Watch", category: "Wearables", price: 249.99 },
            { id: 4, name: "Bluetooth Speaker", category: "Audio", price: 89.99 },
            { id: 5, name: "Tablet", category: "Electronics", price: 499.99 }
        ];

        // DOM Elements
        const productForm = document.getElementById('productForm');
        const productsList = document.getElementById('productsList');
        const totalProducts = document.getElementById('totalProducts');
        const totalValue = document.getElementById('totalValue');
        const avgPrice = document.getElementById('avgPrice');
        const searchInput = document.getElementById('searchInput');
        const resetBtn = document.getElementById('resetBtn');
        const notification = document.getElementById('notification');
        const emptyState = document.getElementById('emptyState');

        // Current product being edited
        let currentProductId = null;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateStats();
        });

        // Form submit event
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('productName').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = document.getElementById('productCategory').value || 'General';
            
            if (currentProductId === null) {
                // Add new product
                const newProduct = {
                    id: Date.now(), // Using timestamp as ID
                    name,
                    category,
                    price
                };
                products.push(newProduct);
                showNotification('Product added successfully!', 'success');
            } else {
                // Update existing product
                const productIndex = products.findIndex(p => p.id === currentProductId);
                if (productIndex !== -1) {
                    products[productIndex] = {
                        ...products[productIndex],
                        name,
                        category,
                        price
                    };
                    showNotification('Product updated successfully!', 'success');
                }
                // Reset edit mode

                currentProductId = null;
                productForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Product';
            }
            
            renderProducts();
            updateStats();
            productForm.reset();
        });

        // Reset form button
        resetBtn.addEventListener('click', () => {
            productForm.reset();
            currentProductId = null;
            productForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Product';
        });

        // Search functionality
        searchInput.addEventListener('input', () => {
            renderProducts();
        });

        // Edit product
        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (product) {
                document.getElementById('productName').value = product.name;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productCategory').value = product.category;
                
                currentProductId = id;
                productForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Product';
                
                // Scroll to form
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Delete product
        function deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                products = products.filter(p => p.id !== id);
                renderProducts();
                updateStats();
                showNotification('Product deleted successfully!', 'success');
            }
        }

        // Render products to the table
        function renderProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            if (filteredProducts.length === 0) {
                productsList.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            productsList.innerHTML = filteredProducts.map(product => `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td class="price-cell">$${product.price.toFixed(2)}</td>
                    <td class="action-cell">
                        <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            totalProducts.textContent = products.length;
            
            const total = products.reduce((sum, product) => sum + product.price, 0);
            totalValue.textContent = `$${total.toFixed(2)}`;
            
            const average = products.length > 0 ? total / products.length : 0;
            avgPrice.textContent = `$${average.toFixed(2)}`;
        }

        // Show notification
        function showNotification(message, type) {
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.className = 'notification';
            }, 3000);
        }