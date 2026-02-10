const URL = "https://script.google.com/macros/s/AKfycbzfFFPVlzJcuu0F8GIce6qBkgI1WT6goH9PdKnLBMwEloHBsbgtyKqGiLxJCt4POu7Dmg/exec"; 

let inventory = []; 
let cart = {};

async function loadData() {
    try {
        const res = await fetch(URL);
        inventory = await res.json();
        render();
    } catch (e) { console.error("Load Error:", e); }
}

function render(data = inventory) {
    const list = document.getElementById('itemList');
    if (!list) return;
    list.innerHTML = data.map(i => {
        const currentInCart = cart[i[0]] ? cart[i[0]].qty : 0;
        const stockLeft = i[4] - currentInCart;
        return `
        <div class="bg-white p-3 rounded-lg flex justify-between items-center shadow-sm border border-gray-100 mb-2">
            <div>
                <div class="font-bold text-sm">${i[1]}</div>
                <div class="text-[10px] text-gray-500">${i[2]} | ${i[3]} K</div>
                <div class="text-[10px] ${stockLeft <= 0 ? 'text-red-500 font-bold' : 'text-blue-500'}">
                    လက်ကျန်: ${stockLeft}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="update('${i[0]}', -1, ${i[3]}, '${i[1]}')" class="bg-gray-200 px-3 py-1 rounded">-</button>
                <span id="q-${i[0]}" class="font-bold w-6 text-center text-sm">${currentInCart}</span>
                <button onclick="update('${i[0]}', 1, ${i[3]}, '${i[1]}')" 
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded font-bold"
                    ${stockLeft <= 0 ? 'disabled style="opacity:0.3"' : ''}>+</button>
            </div>
        </div>`;
    }).join('');
}

function update(id, ch, pr, nm) {
    const item = inventory.find(i => i[0] == id);
    if (!cart[id]) cart[id] = { id: id, qty: 0, price: pr, name: nm };
    if (ch > 0 && cart[id].qty >= item[4]) return alert("လက်ကျန်မရှိတော့ပါ");
    cart[id].qty = Math.max(0, cart[id].qty + ch);
    render(); 
    let total = 0; 
    Object.values(cart).forEach(i => total += (i.qty * i.price));
    document.getElementById('totalDisplay').innerText = total.toLocaleString() + " MMK";
}

async function checkout() {
    const seller = document.getElementById('seller').value;
    const buyer = document.getElementById('buyer').value;
    const selected = Object.values(cart).filter(item => item.qty > 0);

    if (!selected.length || !seller || !buyer) return alert("အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ");

    const btn = document.getElementById('btn');
    btn.disabled = true; 
    btn.innerText = "စာရင်းသွင်းနေပါသည်...";

    try {
        // ဒေတာကို Google Sheet ဆီ ပို့လိုက်ခြင်း
        await fetch(URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: JSON.stringify({ sellerName: seller, buyerName: buyer, cart: selected })
        });
        
        // စာရင်းသွင်းပြီးတာနဲ့ App ကို ပြန်ပတ် (Refresh) လုပ်မယ်
        alert("အရောင်းစာရင်းသွင်းပြီးပါပြီ။ လက်ကျန်နှုတ်ပြီးပါပြီ။");
        location.reload(); 

    } catch (e) {
        alert("Error ဖြစ်သွားပါသည်။ ပြန်ကြိုးစားကြည့်ပါ။");
        btn.disabled = false;
        btn.innerText = "ရောင်းမည်";
    }
}

function searchItem() {
    let val = document.getElementById('search').value.toLowerCase();
    render(inventory.filter(i => i[1].toLowerCase().includes(val)));
}

loadData();
