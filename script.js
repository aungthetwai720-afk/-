const URL = "https://script.google.com/macros/s/AKfycbycZHSA0vW6mS-CR3XIWuf46z5E_kL3wDawAdi4z2dJdaAR7-f8_2GlHM7OP121oYiEHg/exec"; 

let inventory = []; 
let cart = {};

// Google Sheet မှ ဒေတာယူခြင်း
async function loadData() {
    try {
        const res = await fetch(URL);
        inventory = await res.json();
        render();
    } catch (e) {
        document.getElementById('itemList').innerHTML = `<p class="text-center text-red-500">Error: ဒေတာဆွဲမရပါ</p>`;
    }
}

// ပစ္စည်းများကို UI ပေါ်တွင် ပြသခြင်း
function render() {
    const list = document.getElementById('itemList');
    list.innerHTML = inventory.map(i => {
        const qtyInCart = cart[i[0]] ? cart[i[0]].qty : 0;
        const stockLeft = i[4] - qtyInCart;

        return `
        <div class="item-card bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm">
            <div>
                <div class="font-bold text-gray-800 text-sm">${i[1]}</div>
                <div class="text-[11px] text-gray-500">${i[3].toLocaleString()} K | <span class="${stockLeft <= 0 ? 'text-red-500 font-bold' : 'text-blue-500'}">လက်ကျန်: ${stockLeft}</span></div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="update('${i[0]}', -1, ${i[3]}, '${i[1]}')" class="bg-white border border-gray-300 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">-</button>
                <span class="font-bold text-sm w-4 text-center">${qtyInCart}</span>
                <button onclick="update('${i[0]}', 1, ${i[3]}, '${i[1]}')" 
                    class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    ${stockLeft <= 0 ? 'disabled style="opacity:0.3"' : ''}>+</button>
            </div>
        </div>`;
    }).join('');
}

// ဈေးနှုန်းတွက်ချက်ခြင်း
function update(id, change, price, name) {
    const item = inventory.find(i => i[0] == id);
    if (!cart[id]) cart[id] = { id: id, qty: 0, price: price, name: name };
    
    if (change > 0 && cart[id].qty >= item[4]) return; // လက်ကျန်ထက် ပိုမရောင်းရ

    cart[id].qty = Math.max(0, cart[id].qty + change);
    render();

    let total = 0;
    Object.values(cart).forEach(c => total += (c.qty * c.price));
    document.getElementById('totalDisplay').innerText = total.toLocaleString() + " MMK";
}

// အရောင်းစာရင်းသွင်းခြင်း
async function checkout() {
    const seller = document.getElementById('seller').value;
    const buyer = document.getElementById('buyer').value;
    const selectedItems = Object.values(cart).filter(c => c.qty > 0);

    if (!selectedItems.length || !seller || !buyer) return alert("အချက်အလက်များကို ပြည့်စုံစွာဖြည့်ပါ");

    const btn = document.getElementById('btn');
    btn.disabled = true;
    btn.innerText = "စာရင်းသွင်းနေပါသည်...";

    try {
        await fetch(URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ sellerName: seller, buyerName: buyer, cart: selectedItems })
        });

        alert("အရောင်းစာရင်းသွင်းခြင်း အောင်မြင်ပါသည်။ လက်ကျန်နှုတ်ပြီးပါပြီ။");
        location.reload(); // App ကို Refresh လုပ်ပြီး လက်ကျန်အသစ်ကို ပြန်ယူမယ်

    } catch (e) {
        alert("အမှားရှိနေပါသည်၊ ပြန်ကြိုးစားကြည့်ပါ။");
        btn.disabled = false;
        btn.innerText = "ရောင်းမည်";
    }
}

loadData();
