// =========================================================
// 1. მთავარი გვერდი (index.html): პროდუქტის კალათაში შენახვა
// =========================================================

// ვპოულობთ ყველა "+" ღილაკს მთავარ გვერდზე
const addButtons = document.querySelectorAll('.add-btn');

addButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // ვპოულობთ იმ კონკრეტულ ბარათს, რომლის ღილაკსაც დავაჭირეთ
        const productCard = event.target.closest('.product-card');
        
        // ამოვიღოთ ინფორმაცია ამ პროდუქტზე
        const name = productCard.querySelector('h3').textContent.trim();
        const priceText = productCard.querySelector('.price').textContent.trim();
        // ტექსტიდან "64.00₾" ვიღებთ მხოლოდ ციფრს 64.00
        const price = parseFloat(priceText.replace('₾', ''));
        // ვიღებთ ფოტოს მისამართს (src)
        const img = productCard.querySelector('.product-img img').getAttribute('src');

        // წამოვიღოთ უკვე კალათაში არსებული სიები LocalStorage-დან (თუ ცარიელია, შევქმნათ ახალი მასივი)
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

        // შევამოწმოთ, ეს პროდუქტი უკვე არის თუ არა კალათაში
        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            // თუ უკვე არის, უბრალოდ რაოდენობა გავზარდოთ 1-ით
            existingProduct.quantity += 1;
        } else {
            // თუ არ არის, დავამატოთ ახალი პროდუქტის ობიექტი
            cart.push({
                name: name,
                price: price,
                img: img,
                quantity: 1
            });
        }

        // შევინახოთ განახლებული კალათა LocalStorage-ში
        localStorage.setItem('coffeeCart', JSON.stringify(cart));

        // გამოვიტანოთ მარტივი შეტყობინება
        alert(`${name} წარმატებით დაემატა კალათაში!`);
    });
});


// =========================================================
// 2. კალათის გვერდი (cart.html): პროდუქტების გამოჩენა და მართვა
// =========================================================

// ვპოულობთ კონტეინერს, სადაც პროდუქტები უნდა ჩაიხატოს
const cartItemsContainer = document.querySelector('.cart-items-list');

// ეს კოდი გაეშვება მხოლოდ იმ შემთხვევაში, თუ კალათის გვერდზე ვართ
if (cartItemsContainer) {
    
    // ფუნქცია, რომელიც ეკრანზე ხატავს პროდუქტებს LocalStorage-დან
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        
        // თუ კალათა ცარიელია
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">თქვენი კალათა ცარიელია</p>';
            updateSummary(0);
            return;
        }

        // ჯერ ვასუფთავებთ კონტეინერს (რომ ძველი ხელით ჩაწერილი პროდუქტები წაიშალოს)
        cartItemsContainer.innerHTML = '';

        // სათითაოდ გადავუაროთ კალათის პროდუქტებს და შევქმნათ HTML სტრუქტურა
        cart.forEach((item, index) => {
            const totalPrice = (item.price * item.quantity).toFixed(2);
            
            const itemHTML = `
                <div class="cart-item-card" data-index="${index}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-desc">არომატული ყავა</p>
                        <div class="quantity-selector">
                            <button class="qty-btn minus-btn">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus-btn">+</button>
                        </div>
                    </div>
                    <span class="cart-item-price">${totalPrice} ₾</span>
                    <button class="remove-btn">✕</button>
                </div>
            `;
            // ჩავსვათ ეს HTML კოდი კონტეინერში
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // მას შემდეგ რაც პროდუქტები ჩაიხატა, ვამუშავებთ მათ ღილაკებს (+ , - , ✕)
        setupCartEventListeners();
        
        // გადავთვალოთ მთლიანი შეკვეთის ფასი
        calculateTotal(cart);
    }

    // ფუნქცია, რომელიც ამუშავებს კალათის შიგნით არსებულ ღილაკებს
    function setupCartEventListeners() {
        let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        const itemCards = document.querySelectorAll('.cart-item-card');

        itemCards.forEach(card => {
            const index = card.getAttribute('data-index');
            const plusBtn = card.querySelector('.plus-btn');
            const minusBtn = card.querySelector('.minus-btn');
            const removeBtn = card.querySelector('.remove-btn');

            // პლუს ღილაკი
            plusBtn.addEventListener('click', () => {
                cart[index].quantity += 1;
                localStorage.setItem('coffeeCart', JSON.stringify(cart));
                renderCart(); // გვერდის ხელახლა ჩახატვა განახლებული მონაცემებით
            });

            // მინუს ღილაკი
            minusBtn.addEventListener('click', () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('coffeeCart', JSON.stringify(cart));
                    renderCart();
                }
            });

            // წაშლის ღილაკი
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1); // მასივიდან ელემენტის ამოშლა ინდექსით
                localStorage.setItem('coffeeCart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // ფუნქცია, რომელიც ითვლის პროდუქტების ჯამს
    function calculateTotal(cart) {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        updateSummary(subtotal);
    }

    // ფუნქცია, რომელიც მარჯვენა პანელში ანახლებს ციფრებს
    function updateSummary(subtotal) {
        let deliveryCost = subtotal > 0 ? 5.00 : 0.00;
        let finalTotal = subtotal + deliveryCost;

        const subtotalElement = document.querySelector('.checkout-summary-card .summary-row:nth-of-type(1) span:last-child');
        const deliveryElement = document.querySelector('.checkout-summary-card .summary-row:nth-of-type(2) span:last-child');
        const totalElement = document.querySelector('.checkout-summary-card .total-row span:last-child');

        if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} ₾`;
        if (deliveryElement) deliveryElement.textContent = `${deliveryCost.toFixed(2)} ₾`;
        if (totalElement) totalElement.textContent = `${finalTotal.toFixed(2)} ₾`;
    }

    // პირველად ჩატვირთვისას გამოვაჩინოთ კალათა
    renderCart();
}