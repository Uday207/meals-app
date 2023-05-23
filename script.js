var input = document.querySelector("#search");
var searchBtn = document.querySelector(".searchbtn");
var heading2 = document.getElementById('card-title-heading')

if (localStorage.getItem("favouriteLists") == null) {
    localStorage.setItem("favouriteLists", JSON.stringify([]));
}

// it fetches meals from api and return it
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const data = await response.json();
    return data;
}

//displays the searched meal

function showMealList() {
    let inputValue = document.getElementById("search").value.trim();
    let arr = JSON.parse(localStorage.getItem("favouriteLists"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
     
        if (data.meals) {
            console.log(data);
            data.meals.forEach((element) => {
                let isFav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                if (isFav) {
                    html += `
                <div id="card" class="card mb-3" style="width: 21rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="....">
                    <div class="card-body">
                        <h5 class="card-title ">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealsDetails(${element.idMeal})">More details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-success active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 21rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="....">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealsDetails(${element.idMeal})">More details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-success" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center" ">
                
                            <div class="mb-4 lead white">
                                <h5>Sorry....! Your entered Food item not found in our site. Please enter another food item.<h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("Moredetails-list").innerHTML = html;
    });
}

//it  shows full meal details in main
async function showMealsDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          
    <div class="container py-3">
    <div class="card p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="card-title-heading">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="Moredetails-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a>

                    
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
    document.getElementById("Moredetails-list").innerHTML = html;
}


// it shows all favourites meals in favourites body
async function showFavMealList() {
    console.log("hello");
    console.log(localStorage.getItem("favouriteLists"))
    let arr=JSON.parse(localStorage.getItem("favouriteLists"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
            
                            <div class="mb-4 lead card-title-heading white">
                                <h5>No meal items are not added in your favorites list.</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="card mb-3 m-2" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="....">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showFavMealDetails(${data.meals[0].idMeal})">More details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-danger" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favorite-list").innerHTML= html;
}

//it  shows full meal details of favorite
async function showFavMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          
    <div class="container py-3">
    <div class="card card p-lg-5 p-md-2">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="card-title-heading">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="Moredetails-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-warning">Video</a>
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
    document.getElementById("favorite-list").innerHTML = html;
}



//adding and removal of the favoite list

function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouriteLists"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal item removed from your favourites list");
    } else {
        arr.push(id);
        alert("your meal add your favourites list");

    }
    localStorage.setItem("favouriteLists",JSON.stringify(arr));
    
    showFavMealList();
    showMealList();
}
