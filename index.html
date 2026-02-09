const URL = "https://script.google.com/macros/s/AKfycbxW1qefnDSUYrm2AxBg4pH56X2n1Mv4abzOoAkRBo3HF7NA51Y4yyTFeP1-S_dkUhxpdQ/exec"; 

let inventory = []; 
let cart = {};

// Google Sheet မှ ဒေတာဆွဲယူခြင်း
async function loadData() {
    try {
        const res = await fetch(URL);
        inventory = await res.json();
        render();
    } catch (e) {
        alert("ဒေတာဆွဲမရပါ၊ URL ကိုပြန်စစ်ပါ");
    }
}

// ပစ္စည်းစာရင်း ပြသခြင်း
function render(data = inventory) {
    document.getElementById('itemList').innerHTML = data.map(i => `
        <div class="bg-white p-3 rounded-lg flex justify-between items-center shadow-sm border-l-4 border-blue-500">
            <div>
                <div class="font-bold">${i[1]}</div>
                <div class="text-xs text-gray-500">${i[2]} | ${i[3]} K</div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="update('${i[0]}', -1, ${i[3]}, '${i[1]}')" class="bg-gray-200 px-2 rounded">-</button>
                <span id="q-${i[0]}">${cart[i[0]] ? cart[i[0]].qty : 0}</span>
                <button onclick="update('${i[0]}', 1, ${i[3]}, '${i[1]}')" class="bg-blue-100 text-blue-600 px-2 rounded font-bold">+</button>
            </div>
        </div>
    `).join('');
}

// ပစ္စည်းအရေအတွက် တိုး/လျော့ လုပ်ခြင်း
function update(id, ch, pr, nm) {
    if (!cart[id]) cart[id] = { qty: 0, price: pr, name: nm };
    cart[id].qty = Math.max(0, cart[id].qty + ch);
    document.getElementById(`q-${id}`).innerText = cart[id].qty;
    
    let total = 0; 
    Object.values(cart).forEach(i => total += (i.qty * i.price));
    document.getElementById('totalDisplay').innerText = total.toLocaleString() + " MMK";
}

// အရောင်းစာရင်းကို Google Sheet သို့ ပို့ခြင်း
async function checkout() {
    const btn = document.getElementById('btn');
    const seller = document.getElementById('seller').value;
    const buyer = document.getElementById('buyer').value;
    const selected = Object.keys(cart).filter(id => cart[id].qty > 0).map(id => ({
        id: id, 
        qty: cart[id].qty, 
        name: cart[id].name,
        price: cart[id].price
    }));

    if (!selected.length) return alert("ပစ္စည်းရွေးပါ");
    
    btn.disabled = true; 
    btn.innerText = "သိမ်းဆည်းနေပါသည်...";
    
    const rawTotal = Object.values(cart).reduce((t, i) => t + (i.qty * i.price), 0);

    await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
            sellerName: seller || "မသိရ",
            buyerName: buyer || "မသိရ",
            totalAmount: rawTotal,
            cart: selected
        })
    });

    alert("ရောင်းပြီးပါပြီ"); 
    location.reload();
}

// ရှာဖွေခြင်း
function searchItem() {
    let val = document.getElementById('search').value.toLowerCase();
    render(inventory.filter(i => i[1].toLowerCase().includes(val)));
}

loadData();
