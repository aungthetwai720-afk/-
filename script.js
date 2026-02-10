const webAppURL = "https://script.google.com/macros/s/AKfycbxU5Kp05IOX155TkqiZ2iwVnTw0w_Xcd6uryOhxqcw44xOKSoJ5-eNK4NRKx0Eo66eOpg/exec";

let inventory = [];
let saleItems = [];
let grandTotal = 0;

// Fetch inventory from Sheets
function fetchInventory() {
  fetch(`${webAppURL}?action=getInventory`)
    .then(res => res.json())
    .then(data => {
      inventory = data;
    })
    .catch(err => console.error("Inventory fetch error:", err));
}

function filterProducts(query){
  return inventory.filter(i => i["ပစ္စည်းအမည်"].toLowerCase().includes(query.toLowerCase()));
}

// Populate package dropdown based on product search
function populatePackages() {
  const searchInput = document.getElementById("productSearch").value;
  const packages = filterProducts(searchInput);
  const select = document.getElementById("packageSelect");
  select.innerHTML = "";
  packages.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p["ထုပ်ပိုးပုံ"];
    opt.textContent = `${p["ထုပ်ပိုးပုံ"]} - ${p["ဈေးနှုန်း"]}`;
    select.appendChild(opt);
  });
  updatePrice();
}

function updatePrice(){
  const productName = document.getElementById("productSearch").value;
  const packageName = document.getElementById("packageSelect").value;
  const item = inventory.find(i => i["ပစ္စည်းအမည်"] === productName && i["ထုပ်ပိုးပုံ"] === packageName);
  if(item){
    document.getElementById("price").value = item["ဈေးနှုန်း"];
    updateLineTotal();
  }
}

function updateLineTotal(){
  const price = parseFloat(document.getElementById("price").value) || 0;
  const qty = parseInt(document.getElementById("qty").value) || 0;
  document.getElementById("lineTotal").value = price * qty;
}

// Add product to sale table
function addProduct(){
  const product = document.getElementById("productSearch").value;
  const packageName = document.getElementById("packageSelect").value;
  const price = parseFloat(document.getElementById("price").value);
  const qty = parseInt(document.getElementById("qty").value);
  const lineTotal = price * qty;

  if(!product || !packageName || !qty) return;

  // Qty validation against inventory
  const invItem = inventory.find(i => i["ပစ္စည်းအမည်"]===product && i["ထုပ်ပိုးပုံ"]===packageName);
  if(qty > invItem["လက်ကျန်"]){
    alert(`အရေအတွက် လက်ကျန်ထက် မကျော်နိုင်ပါ! (${invItem["လက်ကျန်"]} available)`);
    return;
  }

  saleItems.push({product, packageName, price, qty, lineTotal, invItem});

  renderSaleTable();
  clearForm();
}

function renderSaleTable(){
  const tbody = document.querySelector("#saleTable tbody");
  tbody.innerHTML = "";
  grandTotal = 0;
  saleItems.forEach((item, index)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.product}</td>
      <td>${item.packageName}</td>
      <td>${item.price}</td>
      <td>${item.qty}</td>
      <td>${item.lineTotal}</td>
      <td><button onclick="removeProduct(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
    grandTotal += item.lineTotal;
  });
  document.getElementById("grandTotal").textContent = grandTotal;
}

function removeProduct(index){
  saleItems.splice(index,1);
  renderSaleTable();
}

function clearForm(){
  document.getElementById("productSearch").value="";
  document.getElementById("packageSelect").innerHTML="";
  document.getElementById("price").value="";
  document.getElementById("qty").value="";
  document.getElementById("lineTotal").value="";
}

// Save sale → Sheet2 + update Inventory
function saveSale(){
  if(saleItems.length===0){
    alert("No products in sale!");
    return;
  }
  const salesPerson = document.getElementById("salesPerson").value;
  const customer = document.getElementById("customer").value;
  const date = new Date().toLocaleDateString();

  const payload = {
    action: "submitSale",
    salesPerson,
    customer,
    date,
    items: saleItems
  };

  fetch(webAppURL,{
    method:"POST",
    body:JSON.stringify(payload)
  })
  .then(res=>res.json())
  .then(data=>{
    document.getElementById("msg").textContent = "Sale saved successfully ✅";
    saleItems = [];
    renderSaleTable();
    document.getElementById("salesForm").reset();
  })
  .catch(err=>{
    console.error(err);
    document.getElementById("msg").textContent = "Error saving sale ❌";
  });
}

// Event listeners
document.getElementById("productSearch").addEventListener("input", populatePackages);
document.getElementById("packageSelect").addEventListener("change", updatePrice);
document.getElementById("qty").addEventListener("input", updateLineTotal);
document.getElementById("addProductBtn").addEventListener("click", addProduct);
document.getElementById("saveSaleBtn").addEventListener("click", saveSale);

// Initial fetch
fetchInventory();