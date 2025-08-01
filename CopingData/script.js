url = 'https://raw.githubusercontent.com/RazMunir/Json_Data/refs/heads/main/test.json';

const dataForm = document.getElementById('dataForm');
const dataInput = document.getElementById('dataInput');
const dataDisplay = document.getElementById('dataDisplay');


/* async function fetchData() {
const response = await fetch('https://raw.githubusercontent.com/RazMunir/Json_Data/refs/heads/main/test.json'); // Replace with your API endpoint
const data = await response.json();
console.log('Data is: '+data);
dataDisplay.innerHTML = ''; // Clear previous data
data.forEach(item => {
console.log('D2: '+item);
const itemDiv = document.createElement('div');
itemDiv.classList.add('data-item');
itemDiv.innerHTML = ` <span>${item.text}</span> <div> <button onclick="editData('${item.id}', '${item.text}')">Edit</button> <button onclick="deleteData('${item.id}')">Delete</button> </div> `;
dataDisplay.appendChild(itemDiv);
});
} */

function fetchData() {

dataDisplay.innerHTML = '';
fetch(url)
  .then(res => res.json())
  .then(data => {
      data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('data-item');
          itemDiv.innerHTML = ` <span>${item.name} </span> <div> <button onclick="editData('${item.id}', '${item.name}')">Edit</button> <button onclick="copyName('${item.id}', '${item.name}')">Copy</button> </div> `;
          dataDisplay.appendChild(itemDiv);
      })
  })
  .catch(function(error) {
     console.log('Fetch problem: ' + error.message);
  });
    
}

fetchData();

function copyName(id, name) {
    navigator.clipboard.writeText(name).then(()=>{
        console.log("Copied Name");
    });
}