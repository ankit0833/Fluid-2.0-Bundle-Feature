// Ajax cart JS for Drawer and Cart Page
const drawerSelectors = {
  cartIcons: document.querySelectorAll('.header__icon--cart'),
  cartIconDesktop: document.querySelector('#cart-icon-desktop'),
  cartIconMobile: document.querySelector('#cart-icon-mobile'),
};
class AjaxCart extends HTMLElement {
  constructor() {
    super();
    this.openeBy = drawerSelectors.cartIcons;
    this.isOpen =  this.classList.contains('open--drawer');
    this.bindEvents();
    this.cartNoteInput();
    this.querySelectorAll('.close-ajax--cart').forEach(button => button.addEventListener('click', this.closeCartDrawer.bind(this)));
    var removeproduct = document.querySelectorAll('[data-itemremove]');
    if(removeproduct.length > 0){
      this.removeItem(removeproduct);
    }
    if(window.globalVariables.template != 'cart'){
      this.addAccessibilityAttributes(this.openeBy);
      this.getCartData();
    }else{
      this.style.visibility = 'visible';
    }
    
    if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  }
  
  /**
  * Observe attribute of component
  * 
  * @returns {array} Attributes to Observe
  */
  static get observedAttributes() {
    return ['updating'];
  }
  
  /**
  * To Perform operation when attribute is changed
  * Calls attributeChangedCallback() with params when attribute value is updated
  * 
  * @param {string} name attribute name
  * @param {string} oldValue attribute Old value
  * @param {string} newValue attribute latest value
  */
  attributeChangedCallback(name, _oldValue, newValue) {
    // called when one of attributes listed above is modified
    if(name == 'updating' && newValue == 'false'){
      this.updateEvents();
    }
  }
  
  /**
  * Add accessibility attributes to Open Drawer buttons
  * 
  * @param {Node Array} openDrawerButtons Cart Icons
  */
  addAccessibilityAttributes(openDrawerButtons) {
    let _this = this;
    openDrawerButtons.forEach(element => {
      element.setAttribute('role', 'button');
      element.setAttribute('aria-expanded', false);
      element.setAttribute('aria-controls', _this.id);
    });
  }
  
  /**
  * Escape Click event to close drawer when focused within Cart Drawer
  *
  * @param {event} Event instance
  */
  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;
    this.querySelector('.close-ajax--cart').dispatchEvent(new Event('click'));
  }
  
  /**
  * bind dclick and keyup event to Cart Icons
  * bind keyUp event to Cart drawer component
  * bind Other inside element events
  *
  */
  bindEvents() {
    if(window.globalVariables.template != 'cart'){
      this.openeBy.forEach(cartBtn => cartBtn.addEventListener('click', this.openCartDrawer.bind(this)));
      this.addEventListener('keyup', this.onKeyUp.bind(this));
    }
    this.updateEvents();
  }
  
  /**
  * bind Other inside element events to DOM
  *
  */
  updateEvents(){
    // this.querySelectorAll('[data-itemRemove]').forEach(button => button.addEventListener('click', this.removeItem.bind(this)));
    this.querySelectorAll('[data-qty-btn]').forEach(button => button.addEventListener('click', this.manageQtyBtn.bind(this)));
    this.querySelectorAll('[data-qty-input]').forEach(button => button.addEventListener('change', this.onQtyChange.bind(this)));
  }
  
  /**
  * Open Cart drawer and add focus to drawer container
  *
  * @param {event} Event instance
  */
  openCartDrawer(event) {
    if(!window.globalVariables.cart_drawer){
      window.location.href = window.routes.cart_fetch_url || '/cart';
      return;
    }
    
    if(document.querySelector('#mobile-menu-drawer').classList.contains('opened-drawer')){
      document.querySelector('.close-mobile--navbar').dispatchEvent(new Event('click'));
    }
    
    this.classList.add('opened-drawer');
    siteOverlay.prototype.showOverlay();
    Utility.forceFocus(this.querySelector('.cart-title'));
    let closeBtn = this.querySelector('.close-ajax--cart');
    Utility.trapFocus(this, closeBtn);
    
    if(event){
      event.preventDefault();
      let openBy = event.currentTarget;
      openBy.setAttribute('aria-expanded', true);
    }
  }
  
  /**
  * Close Cart drawer and Remove focus from drawer container
  *
  * @param {event} Event instance
  */
  closeCartDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      event.preventDefault();
      this.classList.remove('opened-drawer');
      siteOverlay.prototype.hideOverlay();
      let openByEle = event.currentTarget;
      openByEle.setAttribute('aria-expanded', false);
      Utility.removeTrapFocus(elementToFocus);
      
      let actionBtn = drawerSelectors.cartIconDesktop;
      if(window.innerWidth < 1024){
        actionBtn = drawerSelectors.cartIconMobile;
      }
      Utility.forceFocus(actionBtn);
    }
  }
  
  /**
  * Cart Item Qunatity Increment/Decrement Button event
  *
  * @param {event} Event instance
  */
  // manageQtyBtn(event){
  //   event.preventDefault();
  //   let currentTarget = event.currentTarget;
  //   let action = currentTarget.dataset.for || 'increase';
  //   let $qtyInput = currentTarget.closest('[data-qty-container]').querySelector('[data-qty-input]');
  //   let itemIndex = $qtyInput.dataset.index || 1;
  //   let currentQty = parseInt($qtyInput.value) || 1;
  //   let finalQty = 1;
  //   let qtyitemboxremove = currentTarget.getAttribute('qty-itemupdaterandomno');
  //   if(action == 'decrease' && currentQty <= 1){
  //     return false;
  //   }else if(action == 'decrease'){
  //     finalQty = currentQty - 1;
  //     this.qtyupdateitemrandom(qtyitemboxremove, finalQty);
  //   }else{
  //     finalQty = currentQty + 1;
  //   }
  //   console.log(itemIndex, finalQty);
  //   this.customupdate(itemIndex,finalQty);
  
  // }
  
  
  manageQtyBtn(event) {
    event.preventDefault();
    let currentTarget = event.currentTarget;
    let action = currentTarget.dataset.for || 'increase';
    let $qtyInput = currentTarget.closest('[data-qty-container]').querySelector('[data-qty-input]');
    let itemIndex = $qtyInput.dataset.index || 1;
    let currentQty = parseInt($qtyInput.value) || 1;
    let finalQty = 1;
    let qtyitemboxremove = currentTarget.getAttribute('qty-itemupdaterandomno');
    if (qtyitemboxremove != null) {
      let lineItem = document.querySelectorAll('[data-cart-item]')[itemIndex - 1];
      if (action == 'decrease' && currentQty <= 1) {
        return false;
      } else if (action == 'decrease') {
        finalQty = false; //remove 1 item
        this.qtyupdateitemrandom(qtyitemboxremove, finalQty);
        if (lineItem) { lineItem.classList.add('updating'); }
      } else {
        finalQty = true; //add 1 item
        this.qtyupdateitemrandom(qtyitemboxremove, finalQty);
        if (lineItem) { lineItem.classList.add('updating'); }
      }
    } else {
      if (action == 'decrease' && currentQty <= 1) {
        return false;
      } else if (action == 'decrease') {
        finalQty = currentQty - 1;
      } else {
        finalQty = currentQty + 1;
      }
    }
  }
  
  // customUpdate(line,quantity){
  //   fetch(window.Shopify.routes.root + 'cart/change.js', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       line,
  //       quantity
  //     })
  //   })
  //   .then(response => {
  //     window.location.reload();
  //     return response.json(); 
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  // }
  /***
  /*** 
  *** update qty bundle  */
  async qtyupdateitemrandom(randno, finalQty){
    var updateitemdataqty = [];
    var removeitemdata = document.querySelectorAll(`[data-itemremoverandomno="${randno}"]`);
    var itemcartdata = await getCart();
    var itemcartdataitems = itemcartdata.items;
    for (var x = 0; x < itemcartdataitems.length; x++) {
      var itemquantity = itemcartdataitems[x].quantity;
      if (itemcartdataitems[x].properties){
        var itemrandomno = itemcartdataitems[x].properties.randomNumber;
      }
      var getrandno = randno;
      if(itemrandomno == getrandno){
        if(finalQty==true){
          var itemquantitynew = itemquantity+1;
          updateitemdataqty.push(itemquantitynew);
        }else{
          updateitemdataqty.push(itemquantity-1);
        }
      }else{
        updateitemdataqty.push(itemquantity);
      }
    }
    var updatedata = {
      updates: updateitemdataqty
    }
    fetch('/cart/update.js', {
      body: JSON.stringify({updates: updateitemdataqty }),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With':'xmlhttprequest'
      },
      method: 'POST'
    }).then((response) => {
      window.location.reload();
      return response.json();
    }).catch((err) => {
      console.error(err)
    });
    
  }
  
  /** 
  * custom get Cart Data  
  * 
  */
  async getCartData(){
    const result = await fetch("/cart.json");
    if(result.status === "200"){
      return result.response();
    }
    throw new Error(`failed get cart data ${result.status} ${result.status.text}`)
  }
  
  /*
  *****
  ** update qty bundle product */
  updateCart(){
    fetch('/cart/update.js', {
      body: JSON.stringify({ updates: removeitemdatavalue }),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'xmlhttprequest'
      },
      method: 'POST'
    }).then((response) => {
      this.getCartData();
      return response.json();
    }).catch((err) => {
      console.error(err)
    });
  }
  
  /** 
  * remove product 
  ***/
  removeItem(removeproduct){
    removeproduct.forEach(button=>{
      button.addEventListener("click",(event)=>{
        event.preventDefault();
        let currentTarget = event.currentTarget;
        let itemIndex = currentTarget.dataset.index || null;
        var data_itemremoverandomno=currentTarget.getAttribute("data-itemremoverandomno");
        if (data_itemremoverandomno != null) {
          this.removeitemrandom(data_itemremoverandomno);
          let lineItem = document.querySelectorAll('[data-cart-item]')[itemIndex - 1];
          if (lineItem) { lineItem.classList.add('updating'); }
        } else {
          if (itemIndex != null) {
            this.updateItemQty(itemIndex, 0);
          }
        }
      }) 
    })
  }
  
  /***
  *** remove bundle product-1 */
  /***
  *** remove bundle product */
  async removeitemrandom(randno) {
    var removeitemdatavalue = [];
    var removeitemdata = document.querySelectorAll(`[data-itemremoverandomno="${randno}"]`);
    var itemcartdata = await getCart();
    var itemcartdataitems = itemcartdata.items;
    for (var x = 0; x < itemcartdataitems.length; x++) {
      var itemquantity = itemcartdataitems[x].quantity;
      if (itemcartdataitems[x].properties) {
        var itemrandomno = itemcartdataitems[x].properties.randomNumber;
      }
      var getrandno = randno;
      if (itemrandomno == getrandno) {
        removeitemdatavalue.push(0);
      } else {
        removeitemdatavalue.push(itemquantity);
      }
    }
    var updatedata = {
      updates: removeitemdatavalue
    }
    fetch('/cart/update.js', {
      body: JSON.stringify({ updates: removeitemdatavalue }),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'xmlhttprequest'
      },
      method: 'POST'
    }).then((response) => {
      this.getCartData();
      return response.json();
    }).then(async (dataresponse) => {
      window.location.reload()
    }).catch((err) => {
      console.error(err)
    });
  }
  /*
  *****
  ** remove bundle product END */
  /*
  *****
  ** remove bundle product END */
  /***
  /*** 
  
  /**
  * Cart Item Qunatity Input change event
  *
  * @param {event} Event instance
  */
  onQtyChange(event){
    const $qtyInput = event.currentTarget;
    const qtyValue = $qtyInput.value;
    const itemIndex = $qtyInput.dataset.index || null;
    if(itemIndex) console.log(itemIndex, qtyValue);
  }
  
  /**
  * Manage Cart Notes
  */
  cartNoteInput(){
    const cartNoteEle = document.querySelector('[data-cartNote] [name="note"]');
    if(!cartNoteEle) return;
    
    const cartNoteSave = document.querySelector('[data-saveNote]');
    let cartNoteEvents = ['input', 'paste'];
    cartNoteEvents.forEach((eventName)=>{
      cartNoteEle.addEventListener( eventName, ()=> {
        const defaultNote = cartNoteEle.dataset.default;
        if(defaultNote != cartNoteEle.value){
          cartNoteSave.style.display = 'block';
        }else{
          cartNoteSave.style.display = 'none';
        }
      }, false);
    });
    
    //  Cart Note Change event
    cartNoteSave.addEventListener( "click", e => {
      e.preventDefault();
      const currentTarget = e.currentTarget;
      const cartNoteContainer = currentTarget.closest('[data-cartNote]');
      const cartNote = cartNoteContainer.querySelector('[name="note"]').value.trim();
      if(cartNote.length <= 0){
        alert('Add Note before proceeding');
        return;
      }
      const submitBtn = cartNoteContainer.querySelector('[data-saveNote]');
      const waitText = (submitBtn.dataset.adding_txt) ? submitBtn.dataset.adding_txt : 'Saving...';
      submitBtn.innerHTML = waitText;
      submitBtn.disabled = true;
      this.updateCartNote(cartNoteContainer);
    });
  }
  
  /**
  * Update Cart Note
  * @param {element} cartNoteContainer 
  */
  updateCartNote(cartNoteContainer){
    const _this = this;
    const cartNoteEle = cartNoteContainer.querySelector('[name="note"]');
    const cartNote = cartNoteEle.value.trim();
    const resultEle = cartNoteContainer.querySelector('[data-resultMsg]');
    const submitBtn = cartNoteContainer.querySelector('[data-saveNote]');
    const defaultText = (submitBtn.dataset.default) ? submitBtn.dataset.default : 'Save';
    
    let body = JSON.stringify({
      note: cartNote
    });
    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body }
  }).then(function (data) {
    if (data.status == 200) {
      if(resultEle){
        resultEle.innerText = 'Added note to Order!';
        _this.manageResponseText(resultEle);
      }
      if(cartNoteEle){
        cartNoteEle.dataset.default = cartNote;
      }
      submitBtn.style.display = 'none';
      submitBtn.innerHTML = defaultText;
      submitBtn.disabled = false;
    }
    else {
      console.error('Request returned an error', data);
      if(resultEle){
        resultEle.innerText = data;
        _this.manageResponseText(resultEle);
      }
      submitBtn.innerHTML = defaultText;
      submitBtn.disabled = false;
    }
  }).catch(function (error) {
    console.error('Request failed', error);
    if(resultEle){
      resultEle.innerText = error;
      _this.manageResponseText(resultEle);
    }
    submitBtn.innerHTML = defaultText;
    submitBtn.disabled = false;
  });
}

/**
* fade effect on reponse
* @param {element} element 
*/
manageResponseText(element){
  Utility.fadeEffect(element, 'fadeIn');
  setTimeout(() => {
    Utility.fadeEffect(element, 'fadeOut');
  }, 3000);
}
}
customElements.define("ajax-cart", AjaxCart);
async function getCart() {
  const result = await fetch("/cart.js");
  if (result.status === 200) {
    return result.json();
  }
  throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
}