let items =  getLS(itemsTag) || [];

function setValue(nam, val) {
   nam.value = val;
}

const id = getById('id');
const code = getById('code');
const ccode = getById('ccode');
const img = getById('img');
const name = getById('name');
const itemForm = getById('itemForm');
const saveLSBtn = getById('saveLSBtn');


id.addEventListener('input', () => {
    findValues();
});

function findValues() {
    var iVal = id.value;
    if(iVal && (iVal < items.length)) {
        const i = items[id.value];
        setValue(code, i.code);
        setValue(ccode, i.ccode);
        setValue(img, i.img);
        setValue(name, i.name);
    }
}

// update + save
itemForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    var iVal = id.value;
    //update
    if(iVal && (iVal < items.length)) {
        items[iVal].code = code.value;
        items[iVal].ccode = ccode.value;
        items[iVal].img = img.value;
        items[iVal].name = name.value;
    } else {
        saveItem();
    }
});

saveLSBtn.addEventListener('click', (e) =>{
    saveLS(itemsTag, items);
});

function saveItem() {
    var obj = {
        id: items.length,
        ccode: ccode.value,
        code: code.value,
        img: img.value,
        name: name.value
    };
    
    items.push(obj);
}

deleteLastItem.addEventListener('click', (e) =>{}
    if (confirm('Are you sure you want to delete this product?')){
        items.pop();
    }
);}


// code for item G0001
function getCode(c, i) {
    //c: category code, i: item.length
    return (i<9) ? c+'000'+i
        : (i<99) ? c+'00'+i
        : (i<999) ? c+'0'+i : c+i;
}