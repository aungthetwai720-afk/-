// Google Apps Script Web App URL
const webAppURL = "https://script.google.com/macros/s/AKfycbxU5Kp05IOX155TkqiZ2iwVnTw0w_Xcd6uryOhxqcw44xOKSoJ5-eNK4NRKx0Eo66eOpg/exec";

let inventory = [];

// Fetch inventory from Google Sheet
function fetchInventory() {
  fetch(`${webAppURL}?action=getInventory`)
    .then(res => res.json())
    .then(data => {
      inventory = data;
      populateProductDropdown();
      updateFields();
    })
    .catch(err => console.error("Inventory fetch error:", err));
}

function populateProductDropdown() {
  const productSelect = document.getElementById("product");
  productSelect.innerHTML = ""; // Clear previous options
  inventory.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item["ပစ္စည်းအမည်"];
    opt.textContent = item["ပစ္စည်းအမည်"];
    productSelect.appendChild(opt);
  });
}

// Update package, price, total when product changes
function updateFields() {
  const productName = document.getElementById("product").value;
  const item = inventory.find(i => i["ပစ္စည်းအမည်"] === productName);
  if(item){
    document.getElementById("package").value = item["ထုပ်ပိုးပုံ"];
    document.getElementById("price").value = item["ဈေးနှုန်း"];
    updateTotal();
  }
}

function updateTotal(){
  const price = parseFloat(document.getElementById("price").value) || 0;
  const qty = parseInt(document.getElementById("qty").value) || 0;
  document.getElementById("total").value = price * qty;
}

// Event listeners
document.getElementById("product").addEventListener("change", updateFields);
document.getElementById("qty").addEventListener("input", updateTotal);

// Handle form submission
document.getElementById("salesForm").addEventListener("submit", e => {
  e.preventDefault();

  const saleData = {
    action: "submitSale",
    Date: new Date().toLocaleDateString(),
    Customer: document.getElementById("customer").value,
    Product: document.getElementById("product").value,
    Price: parseFloat(document.getElementById("price").value),
    Qty: parseInt(document.getElementById("qty").value),
    Total: parseFloat(document.getElementById("total").value),
    SalesPerson: document.getElementById("salesPerson").value
  };

  fetch(webAppURL, {
    method: "POST",
    body: JSON.stringify(saleData)
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("msg").textContent = "Sale saved successfully ✅";
    document.getElementById("salesForm").reset();
    updateFields();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("msg").textContent = "Error saving sale ❌";
  });
});

// Initial fetch
fetchInventory();