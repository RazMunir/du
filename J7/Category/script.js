let categories =  getCategoriesLS() || [];

const categoriesList = getById('categoriesList');
const categoryForm = getById('categoryForm');
const name = getById('name');
const code = getById('code');
const deleteBtn = getById('deleteBtn');

document.addEventListener('DOMContentLoaded',
    () => {
        renderItems();
});

categoryForm.addEventListener('submit', (e) =>  {
    e.preventDefault();
    var obj = {
        id: categories.length,
        name: name.value,
        code: code.value
    };
    
    categories.push(obj);
    renderItems();
});

saveLSBtn.addEventListener('click', (e) =>{
    saveCategoriesLS(categories);
});

deleteLastBtn.addEventListener('click', (e) =>{
    if (confirm('Are you sure you want to delete this product?')){
        categories.pop();
        renderItems();
    }
});

function renderItems() {
    categoriesList.innerHTML = categories
         .map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.code}</td>
            </tr>
        `)
        .join('');    
}