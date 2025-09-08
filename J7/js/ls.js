function getLS(tag) {
    return JSON
        .parse(localStorage
        .getItem(tag));
}

function saveLS(tag, data) {
    // Save localStorage data:list,tag:lsname
    try {
        localStorage.setItem(tag, JSON.stringify(data));
    } catch (e) {
        
        console.error('localStg error:', e);
        return;
    }
}

function fetchData(url, tag) {
    fetch(url)
      .then(res => res.json())
      .then(data => {
          console.log("Tag len:"+data.length);
          saveLS(tag, data);
  }) 
  .catch(function(error) {
     console.log('Fetch problem: ' + error.message);
  });
}

function getById(id) {
    return document.getElementById(id);
}



const categoriesTag = "Categories";
const itemsTag = "items";
const itemsPriceTag = "itemsPrice";

function getCategoriesLS() {
    return getLS(categoriesTag);
}

function saveCategoriesLS(list) {
    saveLS(categoriesTag, list);
    console.log("Category saved in ls.");
}