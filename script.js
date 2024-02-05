const apiUrl = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";

async function fetchProducts() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  function selectCategory(category) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('selected'));
  
    const selectedTab = document.getElementById(`${category.toLowerCase()}Tab`);
    selectedTab.classList.add('selected');
  
    fetchProducts()
      .then(data => {
        let num = 0;
        if(category === "Men"){
            num = 0;
        }
        else if(category === "Women"){
            num = 1;
        }
        else{
            num = 2;
        }
        const categoryData = data.categories[num];
        displayProducts(categoryData.category_products);
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  
  function displayProducts(products) {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';
  
    products.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
  }
  
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
  
    const discount = calculateDiscount(product.price, product.compare_at_price);
  
    card.innerHTML = `
        <div class="cards">
            <div class="card-image">
                <img src="${product.image}" class="image">
                ${
                    product.badge_text === null ? `` : 
                    `<div class="badge-container">
                        <div class="badge-text">${product.badge_text}</div>
                    </div>`
                }
                
            </div>
            <div class="card-details">
                <div class="detailHeader">
                    <div class="title">${product.title.length > 11 ? product.title.substring(0, 10) + `..` : product.title}</div>
                    <div class="vendor">• ${product.vendor}</div>
                </div>
                <div class="price-container">
                    <div class="actual-price">Rs ${product.price}.00</div>
                    <div class="compare-price"><del>${product.compare_at_price}</del></div>
                    <div class="discount">${discount}% Off</div>
                </div>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        </div>
    `;
  
    return card;
  }
  
  function calculateDiscount(currentPrice, comparePrice) {
    const current = parseFloat(currentPrice.replace('$', ''));
    const compare = parseFloat(comparePrice.replace('$', ''));
  
    const discountPercentage = ((compare - current) / compare) * 100;
    return discountPercentage.toFixed(2);
  }
  
  selectCategory('Men');