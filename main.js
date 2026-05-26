// 1. تهيئة السلة عند فتح الصفحة
document.addEventListener("DOMContentLoaded", function() {

    // نظام القائمة (الهامبرجر)
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenuBtn && navMenu) {

        mobileMenuBtn.addEventListener("click", function() {

            navMenu.classList.toggle("active");
        });
    }

    // تحديث الواجهة فوراً
    updateCartUI();
});


// 2. إدارة السلة (القراءة من الكاش)

let cart =
    JSON.parse(localStorage.getItem('stark_cart')) || [];

let total = 0;


function calculateTotal() {

    total = cart.reduce((sum, item) => {

        return sum + (item.price * (item.qty || 1));

    }, 0);
}


function addToCart(name, price) {
    // لازم نجيب الـ cart من الـ localStorage تاني في كل مرة بنضيف فيها
    let currentCart = JSON.parse(localStorage.getItem('stark_cart')) || [];
    
    const existingItem = currentCart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
        currentCart.push({ name: name, price: price, qty: 1 });
    }
    
    localStorage.setItem('stark_cart', JSON.stringify(currentCart));
    cart = currentCart; // تحديث المتغير العام
    updateCartUI();
}


function removeFromCart(index) {

    cart.splice(index, 1);

    saveCartToStorage();

    updateCartUI();
}


function saveCartToStorage() {

    localStorage.setItem(
        'stark_cart',
        JSON.stringify(cart)
    );
}


function updateCartUI() {
    

    const cartList =
        document.getElementById("cart-list");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutBtn =
        document.getElementById("checkout-btn");

    if (!cartList || !cartTotal) return;

    calculateTotal();

    if (cart.length === 0) {

        cartList.innerHTML =
            `<p style="color: #888; text-align:center;">
                السلة فارغة حالياً
            </p>`;

        if (checkoutBtn)
            checkoutBtn.style.display = "none";

    } else {

        cartList.innerHTML = "";

        cart.forEach((item, index) => {

            const itemQty = item.qty || 1;

            const itemTotal =
                item.price * itemQty;

            const li =
                document.createElement("li");

            li.className = "cart-item";

            li.innerHTML = `
                <span>
                    ${item.name}
                    <small style="color:#8a2be2;">
                        (x${itemQty})
                    </small>
                </span>

                <div>
                    <span style="
                        font-weight:700;
                        margin-left:10px;
                    ">
                        ${itemTotal} ج.م
                    </span>

                    <button
                        onclick="removeFromCart(${index})"
                        style="
                            background:none;
                            border:none;
                            color:#ff4757;
                            cursor:pointer;
                            font-size:16px;
                        "
                    >
                        ❌
                    </button>
                </div>
            `;

            cartList.appendChild(li);
        });

        if (checkoutBtn)
            checkoutBtn.style.display = "block";
    }

    cartTotal.innerText = total;
}


// 3. نظام المودال والواتساب

function openCheckoutModal() {

    if (cart.length === 0) return;

    document.getElementById(
        "checkout-modal"
    ).style.display = "flex";
}


function closeCheckoutModal() {

    document.getElementById(
        "checkout-modal"
    ).style.display = "none";
}


function confirmPurchase(event) {

    event.preventDefault();

    const clientName =
        document.getElementById('client-name')
        .value.trim();

    const clientPhone =
        document.getElementById('client-phone')
        .value.trim();

    const clientAddress =
        document.getElementById('client-address')
        .value.trim();

    if (
        !clientName ||
        !clientPhone ||
        !clientAddress
    ) {

        alert(
            'برجاء ملء جميع البيانات المطلوبة لشحن طلبك بنجاح.'
        );

        return;
    }

    let totalVal = cart.reduce((sum, item) => {

        return sum +
            (item.price * (item.qty || 1));

    }, 0);

    let message =
        `*طلب شراء جديد من متجر Stark Production* 🛒\n\n`;

    message += `*👤 بيانات العميل:*\n`;

    message += `• *الاسم:* ${clientName}\n`;

    message += `• *رقم التليفون:* ${clientPhone}\n`;

    message += `• *العنوان:* ${clientAddress}\n\n`;

    message += `*📦 المنتجات المطلوبة:*\n`;

    cart.forEach(item => {

        message +=
            `• ${item.name} (الكمية: ${item.qty || 1}) - بسعر: ${item.price * (item.qty || 1)} ج.م\n`;
    });

    message +=
        `\n💰 *الإجمالي النهائي:* ${totalVal} ج.م`;

    const encodedMessage =
        encodeURIComponent(message);

    const whatsappNumber =
        "201092967490";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // تنظيف العملية

    closeCheckoutModal();

    cart = [];

    saveCartToStorage();

    updateCartUI();

    document.getElementById('client-name').value = '';

    document.getElementById('client-phone').value = '';

    document.getElementById('client-address').value = '';

    window.open(whatsappURL, '_blank');
}
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex'; // أو 'block' حسب الـ CSS بتاعك
    } else {
        alert("لم يتم العثور على نموذج البيانات!");
    }
}
// ده الكود السحري اللي بيخلي السلة تسمع بعضها في كل الصفحات
window.addEventListener('storage', (event) => {
    if (event.key === 'stark_cart') {
        // لو السلة اتغيرت في صفحة تانية، حدثها هنا فوراً
        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    }
});