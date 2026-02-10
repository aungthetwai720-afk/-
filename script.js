const URL = "https://script.google.com/macros/s/AKfycbxpsWD6_qceaMO6mVYlPGthy1KVKOsLMFF6XF7tWGapfrP_MnsZAjsKy5OKCdNxZJyauA/exec"; 

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
                    ${stockLeft <= 0 ? 'disabled style="opacity:0.5"' : ''}>+</button>
            </div>
        </div>`;
    }).join('');
}

function update(id, ch, pr, nm) {
    const item = inventory.find(i => i[0] == id);
    if (!cart[id]) cart[id] = { qty: 0, price: pr, name: nm };
    
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
    const selected = Object.keys(cart).filter(id => cart[id].qty > 0).map(id => cart[id]);

    if (!selected.length || !seller || !buyer) return alert("အချက်အလက်ပြည့်စုံစွာဖြည့်ပါ");

    const btn = document.getElementById('btn');
    btn.disabled = true; 
    btn.innerText = "ခေတ္တစောင့်ပါ...";

    try {
        // mode: 'no-cors' မသုံးဘဲ ပုံမှန်ပဲပို့ပါ
        fetch(URL, {
            method: 'POST',
            body: JSON.stringify({ sellerName: seller, buyerName: buyer, cart: selected })
        });
        
        // အောင်မြင်သည်ဖြစ်စေ၊ မရသည်ဖြစ်စေ ဘောင်ချာတန်းပြမယ်
        showReceipt(seller, buyer, selected);
    } catch (e) {
        showReceipt(seller, buyer, selected);
    }
}

function showReceipt(seller, buyer, items) {
    document.getElementById('r-seller').innerText = seller;
    document.getElementById('r-buyer').innerText = buyer;
    document.getElementById('r-date').innerText = new Date().toLocaleString();
    let total = 0;
    document.getElementById('r-items').innerHTML = items.map(i => {
        total += (i.qty * i.price);
        return `<tr class="border-b"><td>${i.name}</td><td>${i.qty}</td><td>${(i.qty * i.price).toLocaleString()}</td></tr>`;
    }).join('');
    document.getElementById('r-total').innerText = total.toLocaleString();
    document.getElementById('receiptModal').classList.remove('hidden');
}

function downloadReceipt() {
    const receipt = document.getElementById('receiptCapture');
    html2canvas(receipt, {
        useCORS: true,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Receipt_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

function searchItem() {
    let val = document.getElementById('search').value.toLowerCase();
    render(inventory.filter(i => i[1].toLowerCase().includes(val)));
}

loadData();
