const API_URL = 'http://localhost:3000/api/sneakers';

// 1. ПОЛУЧЕНИЕ (READ)
async function fetchSneakers() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderSneakers(data);
    } catch (error) {
        console.error("Ошибка подключения к API:", error);
    }
}

// 2. ОТРИСОВКА (RENDER)
function renderSneakers(items) {
    const container = document.getElementById('sneakers-list');
    if (!container) return;
    container.innerHTML = ''; 

    items.forEach(item => {
        container.insertAdjacentHTML('beforeend', `
            <div class="product-item bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative group">
                <img src="${item.imgUrl || 'assets/main/logo.png'}" alt="${item.title}" class="w-full h-40 object-contain mb-4">
                <h3 class="font-bold text-lg text-gray-800">${item.title}</h3>
                <div class="flex justify-between items-center mt-4">
                    <div>
                        <p class="text-gray-400 text-xs uppercase">Price:</p>
                        <span class="font-bold text-xl">${item.price} USD</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <button onclick="updatePrice('${item._id}')" class="text-blue-500 text-xs hover:underline">
                            Изменить цену
                        </button>
                        <button onclick="deleteItem('${item._id}')" class="text-red-500 text-xs hover:underline">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
}

// 3. ДОБАВЛЕНИЕ (CREATE)
window.addSneaker = async () => {
    const title = prompt("Название кроссовок:");
    const price = prompt("Цена (число):");
    
    if (title && price) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                price: Number(price),
                imgUrl: 'assets/products/sneaker 1.jpg' // временная картинка
            })
        });
        fetchSneakers(); 
    }
};

// 4. УДАЛЕНИЕ (DELETE)
window.deleteItem = async (id) => {
    if (confirm('Удалить этот товар?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchSneakers();
    }
};

// 5. ОБНОВЛЕНИЕ ЦЕНЫ (UPDATE)
window.updatePrice = async (id) => {
    const newPrice = prompt("Новая цена:");
    if (newPrice) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: Number(newPrice) })
        });
        fetchSneakers();
    }
};

// Запуск при старте
fetchSneakers();