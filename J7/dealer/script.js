let dealers = [
    {
        id: 0,
        cname: "Al Ain Farms",
        dname: "Shibin",
        cnumber: "0525520582"
    },
    {
        id:1,
        cname: "AAK Middle East",
        dname: "Awir",
        cnumber: "052"
    },
    {
        id:2,
        cname: "Jaleel Traders",
        dname: "Company",
        cnumber: "05277"
    }
];

const dealersList = getById('dealersList');
const searchInput = getById('searchInput');
const dealerForm = getById('dealerForm');
const cname = getById('cname');
const dname = getById('dname');
const cnumber = getById('cnumber');
const emptyState = getById('emptyState');
const totalDealer = getById('totalDealer');
const totalValue = getById('totalValue');
const avgPrice = getById('avgPrice');

let currentDealerId = null;


document.addEventListener('DOMContentLoaded', () => {
    renderDealers();
    updateStats();
});


dealerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (currentDealerId === null) {
        const obj = {
            id: dealers.length,
            cname: cname.value,
            dname: dname.value,
            cnumber: cnumber.value
        };
        dealers.push(obj);
        showNotification('Product added successfully!', 'success');
    } else {
        /* const idx = dealers.findIndex(p => p.id === currentProductId); */
        const idx = currentDealerId;
        dealers[idx].cname = cname.value;
        dealers[idx].dname = dname.value;
        
        
        dealers[idx].cnumber = cnumber.value;
        showNotification('Product updated successfully!', 'success');
        
        currentDealerId = null;
        dealerForm
            .querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Product';
    }
    
    renderDealers();
    updateStats()
    dealerForm.reset();
});


function editDealer(id) {
    const product = dealers.find(p => p.id === id);
    
    if (product) {
        cname.value = product.cname;
        dname.value = product.dname;
        cnumber.value = product.cnumber;
        
        currentDealerId = id;
        dealerForm
          .querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Product';
          
        document
          .querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
}


function deleteDealer(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        dealers = dealers.filter(p => p.id !== id);
        renderDealers();
        updateStats();
        showNotification('Product deleted successfully!', 'success');
    }
}


resetBtn.addEventListener('click', () => {
    dealerForm.reset();
    currentDealerId = null;
    dealerForm
      .querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Add Product';
});


function renderDealers() {
    const searchTerm = searchInput
        .value.toLowerCase();
    
    const filteredDealers = dealers.filter(product => product.cname.toLowerCase().includes(searchTerm) || product.dname.toLowerCase().includes(searchTerm));
    
    if (filteredDealers.length === 0) {
        productsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    
    dealersList.innerHTML = filteredDealers.map(product => `
        <tr>
            <td>${product.cname}</td>
            <td>${product.dname}</td>
            <td class="numCell">${product.cnumber}</td>
            <td class="action-cell">
                <button class="action-btn edit-btn" onclick="editDealer(${product.id})"><i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteDealer(${product.id})"><i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}


function updateStats() {
    totalDealer.textContent = dealers.length;
    
    const total = dealers.reduce((sum, product) => sum + product.id, 0);
    totalValue.textContent = `$${total.toFixed(2)}`;
    
    const average = dealers.length > 0 ? total / dealers.length : 0;
    avgPrice.textContent = `$${average.toFixed(2)}`;
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
      notification
        .className = 'notification';
    }, 3000);
}
