import {menuArray} from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//EVENT LISTENERS
document.addEventListener('click', (e) => {
    if(e.target.dataset.plus){
        preCheckoutState(e.target.dataset.plus) 
    }
    else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }
    else if(e.target.id === "order-btn"){
        handleOrderClick()
    }
    else if(e.target.id === "pay-btn"){
        handlePayClick()
    }
})


//DEFAULT STATE WHEN OPENING APP
function defaultState(){
    let menuHtml = ''
    menuArray.forEach(item => {
        menuHtml += `
        <div class="default-state">
            <p class="emoji">${item.emoji}</p>
            <div class="meal-info">
                <h2>${item.name}</h2>
                <h5>${item.ingredients}</h5>
                <h4>$ ${item.price}</h4>
            </div>
            <button class="plus-button" id="plus-${item.id}" data-plus=${item.id}>+</button>
        </div>
        `
    })
    return menuHtml
}

//ITEMS ORDERED SHOWS AT BOTTOM
let itemChoice = []
        
function preCheckoutState(itemId){
    let priceList = ''
    let orderedItems = ''
    let totalPrice = []
    let totalChoices=[]
    let total = 0
    
    //PUSHES SELCTION TO ARRAY
    menuArray.forEach(item => {
        if (item.id == itemId){
           itemChoice.push({item:item.name, price:item.price, id: uuidv4()})
        }
    })  
    //CHECKS IF ANY ITEMS SELECTED AND OPENS PRICE SECTION AT BOTTOM
    if(itemChoice.length >= 1){
            document.getElementById("pre-checkout-state").classList.remove('hidden')
        }
    //FILTERS THROUGH SELECTED ITEMS TO CREATE ARRAY WITH ONLY ONE OF EACH SELECTION
    let pizzaChoice = itemChoice.filter(item => {
        return item.item === 'Pizza'
    })
    let pizza = pizzaChoice.length
    
    let burgerChoice = itemChoice.filter(item => {
        return item.item === 'Hamburger'
    })
    let burger = burgerChoice.length
    
    let beerChoice = itemChoice.filter(item => {
        return item.item === 'Beer'
    })
    let beer = beerChoice.length
 
    //CREATES ARRAY USING FILTERED OPTIONS AND ADDS AMOUNT OF EACH ITEM SELECTED
    let finalChoices = []
    if (pizza >= 1){
        finalChoices.push({select:pizzaChoice[0], amount:pizza})
    }
    if (burger >= 1){
        finalChoices.push({select:burgerChoice[0], amount:burger})
    }
    if (beer >= 1){
        finalChoices.push({select:beerChoice[0], amount:beer})
    }

    //ADDS UP AMOUNT OF SELECTED ITEMS
    for(let choice of finalChoices){
            orderedItems += `
                <div class="order-items"> 
                    <h2>${choice.select.item} (x${choice.amount})</h2>
                    <p class="remove" id="remove-${choice.select.id}" data-remove=${choice.select.id}>remove</p>
                    <h4 class="amount">$${(choice.select.price * choice.amount)}</h4>
                    </div>
                `
     }
    
    //TOTALS UP THE TOTAL PRICE ARRAY 
    finalChoices.forEach(select => {
        totalPrice.push(select.select.price * select.amount)
    })
    const sum = totalPrice.reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);
    
    //RENDERS PRICELIST TO SCREEN   
    priceList += `
         <div class="pre-order " id="pre-order">
              <h2 class="your-order">Your Order</h2>
              <div id="order-items"></div>
              <div class="total-price">
                 <h2 class="total">Total price</h2>
                 <h4 class="total amount">$${sum}</h4>
              </div>
              <button class="order-btn" id="order-btn">Complete Order</button>
          </div>
                ` 

        document.getElementById('pre-checkout-state').innerHTML = priceList
        document.getElementById('order-items').innerHTML = orderedItems
}

//REMOVE AN ITEM FROM ORDERED LIST AND HIDE ORDER SECTION IF EMPTY
function handleRemoveClick(itemId){
    itemChoice.forEach(item =>{
        if(item.id === itemId){
            let selectItem = item
            let index = itemChoice.indexOf(item)
            itemChoice.splice(index, 1)
        }
     })
        if(itemChoice.length === 0){
            document.getElementById("pre-checkout-state").classList.add('hidden')
        }
        preCheckoutState()
}

//MODAL MESSAGE POPS UP ON SCREEN FOR CARD DETAILS
function handleOrderClick(){
    document.getElementById("checkout-payment-modal").classList.remove('hidden')
    document.getElementById("main").classList.add('background')
    
    let payerDetails = ''
    payerDetails += `
        <section class="pay-box">
        <h3 class="enter">Enter card details</h3>
        <input required type="text" placeholder="Enter your name" id="name"/>
        <input required type="number" placeholder="Enter card number"/>
        <input required type="number" placeholder="Enter cvv"/>
        <button class="pay-btn" id="pay-btn">Pay</button>
        </section>
   `
   document.getElementById("checkout-payment-modal").innerHTML = payerDetails
}

//CLEARS PAY MODAL AND RETURNS THANK YOU MESSAGE
function handlePayClick(){
    
    document.getElementById("checkout-payment-modal").classList.add('hidden')
    document.getElementById("main").classList.remove('background')
    document.getElementById("order-complete-state").classList.remove('hidden')
    document.getElementById("pre-checkout-state").classList.add('hidden')
    
      
    let thankYou = ''
    let name = document.getElementById('name').value
    
    thankYou += `
        <div class="thank-you">
            <h3 class="thanks">Thanks ${name}! Your order is on the way.</h3>
        </div>
    `
    document.getElementById("order-complete-state").innerHTML = thankYou
    
}

function render(){
    document.getElementById('default-state').innerHTML = defaultState()
}

render()
