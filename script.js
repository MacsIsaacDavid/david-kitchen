const menuItems=[
{id:1,name:"David's Kitchen Jollof Rice",category:"Rice",price:4500,description:"Smoky Nigerian jollof rice with tasty sides.",image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80"},
{id:2,name:"Fried Rice & Chicken",category:"Main Meals",price:5200,description:"Seasoned fried rice served with juicy chicken.",image:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80"},
{id:3,name:"Grilled Chicken",category:"Chicken",price:6500,description:"Tender grilled chicken with a rich smoky finish.",image:"https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80"},
{id:4,name:"Beef Suya",category:"Beef",price:5500,description:"Spicy Nigerian-style grilled beef with onions.",image:"https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=900&q=80"},
{id:5,name:"Grilled Fish",category:"Fish",price:7500,description:"Freshly grilled fish with pepper sauce and sides.",image:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80"},
{id:6,name:"Yam & Egg Sauce",category:"Breakfast",price:3500,description:"Golden yam served with rich Nigerian egg sauce.",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"},
{id:7,name:"Chicken & Chips",category:"Snacks",price:5000,description:"Crispy fries with seasoned fried chicken.",image:"https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80"},
{id:8,name:"David's Kitchen Burger",category:"Snacks",price:4800,description:"Loaded beef burger with fresh vegetables.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"},
{id:9,name:"Fresh Fruit Juice",category:"Drinks",price:2500,description:"A refreshing blend made with fresh fruits.",image:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80"},
{id:10,name:"Chocolate Cake",category:"Desserts",price:3000,description:"Soft, rich chocolate cake for a sweet finish.",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"},
{id:11,name:"Moi Moi",category:"Breakfast",price:2800,description:"Steamed Nigerian bean pudding, soft and savoury.",image:"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80"},
{id:12,name:"Peppered Chicken",category:"Chicken",price:6200,description:"Tender chicken tossed in spicy pepper sauce.",image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80"}
];

const categories=["All","Breakfast","Main Meals","Rice","Chicken","Beef","Fish","Drinks","Desserts","Snacks"];
let activeCategory="All";
let cart=JSON.parse(localStorage.getItem("davidsKitchenCart")||"[]");

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);

function saveCart(){
 localStorage.setItem("davidsKitchenCart",JSON.stringify(cart));
 updateCartCount();
}

function updateCartCount(){
 $("#cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
}

function renderCategories(){
 $("#categories").innerHTML=categories.map(c=>`<button class="${c===activeCategory?"active":""}" data-category="${c}">${c}</button>`).join("");
 document.querySelectorAll("#categories button").forEach(btn=>{
  btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderCategories();renderMenu()});
 });
}

function renderMenu(){
 const items=activeCategory==="All"?menuItems:menuItems.filter(i=>i.category===activeCategory);
 $("#foodGrid").innerHTML=items.map(item=>`
 <article class="food-card">
  <div class="food-image">
   <img src="${item.image}" alt="${item.name}">
   <button class="heart" onclick="this.classList.toggle('liked')">♡</button>
  </div>
  <div class="food-info">
   <span class="food-cat">${item.category}</span>
   <h3>${item.name}</h3>
   <p>${item.description}</p>
   <div class="food-bottom">
    <strong>${money(item.price)}</strong>
    <button class="add-btn" onclick="addToCart(${item.id})">＋ Add</button>
   </div>
  </div>
 </article>`).join("");
}

function addToCart(id){
 const product=menuItems.find(i=>i.id===id);
 const found=cart.find(i=>i.id===id);
 if(found) found.qty++;
 else cart.push({...product,qty:1});
 saveCart();
 showToast(`${product.name} added to cart`);
 openCart();
}

function changeQty(id,change){
 const item=cart.find(i=>i.id===id);
 if(!item)return;
 item.qty+=change;
 if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
 saveCart();renderCart();
}

function removeItem(id){
 cart=cart.filter(i=>i.id!==id);
 saveCart();renderCart();
}

function renderCart(){
 const box=$("#cartContent");
 if(!cart.length){
  box.innerHTML=`<div class="empty-cart"><div style="font-size:50px">🛒</div><h3>Your cart is empty</h3><p>Add something delicious from our menu.</p><button class="red-btn" onclick="closeCart()">EXPLORE MENU</button></div>`;
  return;
 }
 const subtotal=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
 const delivery=2000,total=subtotal+delivery;
 box.innerHTML=`
 <div class="cart-items">
 ${cart.map(i=>`<div class="cart-item">
  <img src="${i.image}" alt="${i.name}">
  <div class="cart-item-main"><h3>${i.name}</h3><strong>${money(i.price)}</strong>
   <div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button></div>
  </div>
  <button class="remove" onclick="removeItem(${i.id})">×</button>
 </div>`).join("")}
 </div>
 <div class="totals">
  <div><span>Subtotal</span><b>${money(subtotal)}</b></div>
  <div><span>Delivery</span><b>${money(delivery)}</b></div>
  <div class="grand"><span>Total</span><b>${money(total)}</b></div>
  <button class="red-btn wide" onclick="openCheckout()">CHECKOUT</button>
 </div>`;
}

function openCart(){renderCart();$("#cartOverlay").classList.add("show")}
function closeCart(){$("#cartOverlay").classList.remove("show")}

function openCheckout(){
 if(!cart.length){showToast("Your cart is empty");return}
 closeCart();
 const subtotal=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
 $("#checkoutContent").innerHTML=`
 <span class="red-label">CHECKOUT</span>
 <h1>Complete your order.</h1>
 <form class="checkout-form" id="checkoutForm">
  <label>Full Name<input required name="name" autocomplete="name" placeholder="Your full name"></label>
  <label>Phone Number<input required name="phone" autocomplete="tel" type="tel" placeholder="0800 000 0000"></label>
  <label>Email Address<input required type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
  <label>Delivery Address<input required name="address" autocomplete="street-address" placeholder="House number, street, area"></label>
  <label>City<input required name="city" value="Port Harcourt"></label>
  <label>State<input required name="state" value="Rivers"></label>
  <label>Additional Instructions<textarea name="instructions" placeholder="Anything our rider should know?"></textarea></label>
  <fieldset><legend>Payment Method</legend>
   <label><input type="radio" name="payment" value="Pay on Delivery" checked> Pay on Delivery</label>
   <label><input type="radio" name="payment" value="Bank Transfer"> Bank Transfer</label>
   <label><input type="radio" name="payment" value="Online Payment (demo)"> Online Payment (demo)</label>
  </fieldset>
  <p class="checkout-note">Total includes a ₦2,000 delivery fee. Online payment is a demo option and will not charge you.</p>
  <button class="red-btn wide" id="placeOrderBtn">PLACE ORDER — ${money(subtotal+2000)}</button>
  <p id="checkoutError" role="alert" style="color:#b42318"></p>
 </form>`;
 $("#checkoutOverlay").classList.add("show");
 $("#checkoutForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const btn=$("#placeOrderBtn");
  const error=$("#checkoutError");
  btn.disabled=true;btn.textContent="SUBMITTING ORDER…";error.textContent="";
  const fields=Object.fromEntries(new FormData(form).entries());
  const payload={customer:{name:fields.name,phone:fields.phone,email:fields.email,address:fields.address,city:fields.city,state:fields.state,instructions:fields.instructions||""},paymentMethod:fields.payment,items:cart.map(i=>({id:i.id,quantity:i.qty}))};
  try{
   const response=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"We could not submit your order. Please try again.");
   $("#checkoutContent").innerHTML=`<div style="text-align:center;padding:55px 15px"><div style="font-size:65px;color:#159447">✓</div><span class="red-label">ORDER RECEIVED</span><h1>Thank you for ordering!</h1><p>Your order has been saved successfully. David's Kitchen can now process it.</p><strong style="color:#ed1111;font-size:24px">${result.orderNumber}</strong><p>Total: <strong>${money(result.total)}</strong></p><button class="red-btn" style="margin-top:25px" onclick="closeCheckout();cart=[];saveCart();window.scrollTo({top:0,behavior:'smooth'})">BACK TO HOME</button></div>`;
  }catch(err){error.textContent=err.message||"Unable to connect to the server. Make sure the backend is running.";btn.disabled=false;btn.textContent=`PLACE ORDER — ${money(subtotal+2000)}`;}
 });
}

function closeCheckout(){$("#checkoutOverlay").classList.remove("show")}

function showToast(message){
 const toast=$("#toast");toast.textContent=message;toast.classList.add("show");
 setTimeout(()=>toast.classList.remove("show"),1800);
}

$("#menuBtn").addEventListener("click",()=>$("#drawerOverlay").classList.add("show"));
$("#drawerClose").addEventListener("click",()=>$("#drawerOverlay").classList.remove("show"));
$("#drawerOverlay").addEventListener("click",e=>{if(e.target.id==="drawerOverlay")$("#drawerOverlay").classList.remove("show")});
$("#drawerCart").addEventListener("click",()=>{$("#drawerOverlay").classList.remove("show");openCart()});
$("#cartOpenBtn").addEventListener("click",openCart);
$("#cartClose").addEventListener("click",closeCart);
$("#cartOverlay").addEventListener("click",e=>{if(e.target.id==="cartOverlay")closeCart()});
$("#checkoutClose").addEventListener("click",closeCheckout);
$("#checkoutOverlay").addEventListener("click",e=>{if(e.target.id==="checkoutOverlay")closeCheckout()});
$("#heroOrder").addEventListener("click",()=>$("#menu").scrollIntoView({behavior:"smooth"}));
$("#contactForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const form=e.currentTarget;const submit=form.querySelector('button[type="submit"],button:not([type])');
 const fields=Object.fromEntries(new FormData(form).entries());
 try{
  const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(fields)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||"Could not send your message.");
  form.reset();showToast("Message received. Thank you!");
 }catch(err){showToast(err.message||"Could not connect to server. Please try again.");}
});

window.addEventListener("scroll",()=>$("#topBtn").classList.toggle("show",window.scrollY>600));
$("#topBtn").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

renderCategories();
renderMenu();
updateCartCount();
