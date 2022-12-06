// Add Cart Bundle Products 
var add_to_cart = document.getElementById("add_to_cart");
add_to_cart.addEventListener("click", (event) => {
  event.preventDefault();
  // var main_checkbox_array = []
  var array = []
  var formData = []
  var items = []
  var checkboxes = document.querySelectorAll("[checkbox_check]");
  var main_checkbox_check = add_to_cart.getAttribute("data-productid");
  var quantity = document.getElementById("data-qty-input").value;
  var selectedValue = main_checkbox_check;
  document.querySelector('.gif-loader').classList.add("custom-loader");
  // main product array push
  // main_checkbox_array.push(selectedValue)
  var line_item_message = document.getElementById("line_item_properties").value;
  var randomNumber = document.getElementById("randomNumber").value;
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes.checked = true;
    array.push(checkboxes[i].value); // sub product array push
    // main product and sub product line item properties
    items.push(
      {
        'id': array[i],
        'quantity':quantity,
        'properties': {
          'type': 'sub-product',
          'randomNumber': randomNumber
        }
      }
      )
    }
    items.push(
      {
        'id': selectedValue,
        'quantity':quantity,
        'properties': {
          'lineMessage': line_item_message,
          'type': 'main-product',
          'randomNumber': randomNumber,
        }
      }
      )
      var formData = {
        items
      }
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response =>{
        document.querySelector('.gif-loader').classList.remove("custom-loader")
        window.location.href="/cart"
      })
    })
    
    /** 
    * line item update
    * 
    */
    function editProperties(e){
      var targetitem = e.currentTarget.closest(".cart-item");
      var targetclose = targetitem.querySelector("[data-itemremove]");
      var lineno      = targetclose.getAttribute("data-index");
      console.log(lineno)
      var quantity = targetitem.querySelector("[data-qty-input]");
      var quantityval = quantity.value;  
      var rn_no = targetclose.getAttribute("data-itemremoverandomno");
      const elements = targetitem.querySelector(`input[id="input_value"]`);
      var message = elements.value;
      fetch("/cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(
          {
            "line": lineno,
            "quantity" : quantityval,
            properties: {
              "lineMessage": message,
              "type": "main-product",
              "randomNumber": rn_no
            }
          }
          )
        })
        .then(response => {
          window.location.reload();
        })
      }