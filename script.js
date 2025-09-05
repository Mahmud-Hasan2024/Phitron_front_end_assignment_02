document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".searchBox");
  const searchBtn = document.querySelector(".searchBtn");
  const drinksContainer = document.querySelector(".cocktailContainer");
  const groupList = document.querySelector(".groupList");
  const drinkCount = document.createElement("p");
  let count = 0;

  drinkCount.textContent = `Number of drinks in the group: ${count}`;
  groupList.parentElement.insertBefore(drinkCount, groupList);

  const renderDrinks = (drinks) => {
    drinksContainer.innerHTML = "";
    drinks.forEach((drink) => {
      const div = document.createElement("div");
      div.classList.add("product", "mb-3", "p-3", "border", "rounded");
      div.innerHTML = `
        <img src="${drink.strDrinkThumb}" class="img-fluid rounded"/>
        <h5 class="mt-2">${drink.strDrink}</h5>
        <p><b>Category:</b> ${drink.strCategory}</p>
        <p><b>Glass:</b> ${drink.strGlass}</p>
        <p><b>Instructions:</b> ${drink.strInstructions}</p>
        <button class="btn btn-primary add-to-group-btn">Add to Group</button>
        <button class="btn btn-secondary details-btn">Details</button>
      `;

      drinksContainer.appendChild(div);

      const addToGroupBtn = div.querySelector(".add-to-group-btn");
      addToGroupBtn.addEventListener("click", () => {
        const alreadyAdded = [...groupList.children].some(
          (item) => item.querySelector("h6").textContent === drink.strDrink
        );

        if (alreadyAdded) {
          alert("This drink is already in the group.");
          return;
        }

        if (groupList.children.length >= 7) {
          alert("You can't add more than 7 drinks.");
        } else {
          const groupItem = document.createElement("div");
          groupItem.classList.add("group-item", "mb-2", "p-2", "border", "rounded");
          groupItem.innerHTML = `
            <h6>${drink.strDrink}</h6>
            <p>${drink.strCategory}</p>
            <button class="btn btn-sm btn-danger remove-btn">Remove</button>
          `;
          groupList.appendChild(groupItem);

          groupItem.querySelector(".remove-btn").addEventListener("click", () => {
            groupItem.remove();
            count--;
            drinkCount.textContent = `Number of drinks in the group: ${count}`;
          });

          count++;
          drinkCount.textContent = `Number of drinks in the group: ${count}`;
        }
      });

      const detailsBtn = div.querySelector(".details-btn");
      detailsBtn.addEventListener("click", () => {
        alert(
          `Cocktail: ${drink.strDrink}\nCategory: ${drink.strCategory}\nGlass: ${drink.strGlass}\nInstructions: ${drink.strInstructions}\nAlcoholic: ${drink.strAlcoholic}`
        );
      });
    });
  };

  const fetchdrinks = async (get = "") => {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${get}`
    );
    const data = await response.json();

    if (!data.drinks) {
      drinksContainer.innerHTML = "<p>No drinks found.</p>";
      return;
    }

    renderDrinks(data.drinks);
  };

  const fetchRandomDrinks = async () => {
    const randomDrinks = [];
    for (let i = 0; i < 7; i++) {
      const response = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      if (data.drinks && data.drinks.length > 0) {
        randomDrinks.push(data.drinks[0]);
      }
    }
    renderDrinks(randomDrinks);
  };

  fetchRandomDrinks();

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = searchBox.value.trim();
    if (input) {
      fetchdrinks(input);
    } else {
      fetchRandomDrinks();
    }
  });
});
