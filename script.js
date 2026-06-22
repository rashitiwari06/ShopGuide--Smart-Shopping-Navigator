let selectedCategory = "";

// Category Selection
function selectCategory(category){
    selectedCategory = category;
    document.getElementById("page1").classList.remove("active");
    document.getElementById("page2").classList.add("active");
    document.getElementById("stepOne").classList.remove("active");
    document.getElementById("stepTwo").classList.add("active");
    document.getElementById("selectedCategory").innerHTML = "SelectedCategory: <b>" + 
    category.toUpperCase() + "</b>";
    document.getElementById("itemInput").focus();   
}

// Search Item
async function searchItem(){
    const item = document.getElementById("itemInput").value.trim();
    if(item === ""){
        alert("Please enter an item");
        return;
    }
    saveSearch(item);

    document.getElementById("page2").classList.remove("active");
    document.getElementById("page3").classList.add("active");
    document.getElementById("stepTwo").classList.remove("active");
    document.getElementById("stepThree").classList.add("active");
    document.getElementById("searchInfo").innerHTML =
        `<h3>${item}</h3`;
        generateLinks(item);
        await fetchProducts(item);  
}

//Generate Shopping Links

function generateLinks(item){
    let html = "";
    if(selectedCategory === "food"){
        html = `<a class="site-link"
        href="https://www.swiggy.com/search?query=${item}"
        target="_blank">Search on Swiggy</a>
        
        <a class="site-link"
        href="https://www.zomato.com/search?q=${item}"
        target="_blank">Search on Zomato</a>`;
    }
   else if(selectedCategory === "clothes"){
        html = `<a class="site-link"
        href="https://www.amazon.in/s?k=${item}"
        target="_blank">Amazon</a>
        
        <a class="site-link"
        href="https://www.flipkart.com/search?q=${item}"
        target="_blank">Flipkart</a>

        <a class="site-link"
        href="https://www.myntra.com/${item}"
        target="_blank">Myntra</a>`;
    }
   else if(selectedCategory === "grocery"){
        html = `<a class="site-link"
        href="https://blinkit.com/s/?q=${item}"
        target="_blank">Blinkit</a>
        
        <a class="site-link"
        href="https://www.bigbasket.com/ps/?q=${item}"
        target="_blank">Bigbasket</a>`;
    }
    else if(selectedCategory === "electronics"){
        html = `<a class="site-link"
        href="https://www.amazon.in/s?k=${item}"
        target="_blank">Amazon</a>

         <a class="site-link"
        href="https://www.flipkart.com/search?q=${item}"
        target="_blank">Flipkart</a>
        
        <a class="site-link"
        href="https://www.croma.com/searchB?q=${item}"
        target="_blank">Croma</a>`;
    }
    document.getElementById("results").innerHTML=html; 
}

//Fetch Products From API
async function fetchProducts(item) {
    const container = document.getElementById("productContainer");
    container.innerHTML = `<div class="loader">Loading...</div>`;
    try{
        //Food Category
        if(selectedCategory == "food"){
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`);
            const data = await response.json();
            if(!data.meals){
                container.innerHTML = "<p>No food item found.</p>";
                return;
            }
            let output = "";
            data.meals.forEach(meal => { output += ` <div class="product-card">
                <img src="${meal.strMealThumb}"
                alt="${meal.strMeal}">
                <h4>${meal.strMeal}</h4>
                <p>${meal.strCategory}</p>
                </div>`;});
                container.innerHTML = output;
        }
        //Clothes & Electronics
        else if(selectedCategory == "clothes" || selectedCategory == "electronics"){
            const response = await fetch(`https://dummyjson.com/products/search?q=${item}`);
            const data = await response.json();
            if(data.products.length === 0){
                container.innerHTML = "<p>No products found.</p>";
                return;
            }
            let output = "";
            data.products.forEach(product => { output += ` <div class="product-card">
                <img src="${product.thumbnail}"
                alt="${product.title}}">
                <h4>${product.title}</h4>
                <p>Rs${Math.round(product.price*85)}</p>
                <p>Rating${product.rating}</p>
                </div>`;});
                container.innerHTML = output;
        }
        //Grocery
        else if(selectedCategory == "grocery"){
            const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${item}&
            search_simple=1&json=1`);
            const data = await response.json();
            if(data.products.length === 0){
                container.innerHTML = "<p>No grocery item found.</p>";
                return;
            }
            let output = "";
            data.products.slice(0,6).forEach(meal => { output += ` <div class="product-card">
                <img src="${product.image_url || ''}"
                alt="${product.product_name || 'Product'}">
                <h4>${product.product_name || 'Unknown Product'}</h4>
                <p>${product.brands || "Brand Not Available"}</p>
                </div>`;});
                container.innerHTML = output;
        }
    }
    catch(error){
        container.innerHTML = "<p>Unable to load data.</p>";
        console.log(error);
    }
    
}

// Back To Category
function backToCategory(){
    document.getElementById("page2").classList.remove("active");
    document.getElementById("page1").classList.add("active");
    document.getElementById("stepTwo").classList.remove("active");
    document.getElementById("stepOne").classList.add("active");
}

// Back To Search
function backToSearch(){
    document.getElementById("page3").classList.remove("active");
    document.getElementById("page2").classList.add("active");
    document.getElementById("stepThree").classList.remove("active");
    document.getElementById("stepTwo").classList.add("active");
}

// Save Search History
function saveSearch(item){
    let searches = JSON.parse(
        localStorage.getItem("shopguideHistory")
    ) || [];
    searches.unshift(item);
    searches = searches.slice(0,5);
    localStorage.setItem("shopguideHistory",JSON.stringify(searches));
    loadHistory();
}

// Load Search History
function loadHistory(){
    const history = JSON.parse(
        localStorage.getItem("shopguideHistory")
    ) || [];
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    history.forEach(search => {
        historyList.innerHTML += `<li>${search}</li>`;
    });
}

// Load History On Page Start
window.onload = function(){
    loadHistory();
};