url = "https://raw.githubusercontent.com/RazMunir/Json_Data/refs/heads/main/du_d/purchase.json";

const ls = "itemsPrice";
const lsItem = "items";


// Load history from localStorage or initialize empty array
let itemsPrice = JSON.parse(localStorage.getItem(ls)) || [];
let items = JSON.parse(localStorage.getItem(lsItem)) || [];

const date = new Date()
    .toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka' // +06 timezone
    });


const itemsList = document.getElementById('itemsList');
const searchInput = document.getElementById('searchInput');
// date
document.getElementById('dateDisplay').innerHTML = date;

document.addEventListener('DOMContentLoaded', () => {
            //fetchData();
            renderItems();
        });

searchInput.addEventListener('input', () => {
            renderItems();
        });

function renderItems() {
    console.log("Length is: "+items.length);
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = itemsPrice
              .filter(product =>
                  product.des.toLowerCase()
                  .includes(searchTerm));
    /*products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            ); */
    
    if (filteredItems.length === 0) return;
    
    itemsList.innerHTML = filteredItems
             .map(product => `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.date}</td>
                    <td>${items[product.icode.split('-')[1]].name}</td>
                    <td>${product.qty}${product.unit}</td>
                    <td>${product.price}</td>
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

function fetchData() {
    fetch(url)
      .then(res => res.json())
      .then(data => {
          console.log("data is:"+data.length);
          saveLS(ls, data);
          //items = data;
          //renderItems();
          
  }) 
  .catch(function(error) {
     console.log('Fetch problem: ' + error.message);
  });
}

function saveLS(tag, data) {
    // Save to localStorage
    try {
        localStorage.setItem(tag, JSON.stringify(data));
    } catch (e) {
        
        console.error('localStg error:', e);
        return;
    }
}



