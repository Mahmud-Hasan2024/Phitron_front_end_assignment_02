document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".searchBox");
  const searchBtn = document.querySelector(".searchBtn");
  const drinksContainer = document.querySelector(".cocktailContainer");
  const groupList = document.querySelector(".groupList");
  const drinkCount = document.createElement("p");
  let count = 0;

  drinkCount.textContent = `Number of drinks in the group: ${count}`;
  groupList.parentElement.insertBefore(drinkCount, groupList);

  const fetchdrinks = async (get) => {
    drinksContainer.innerHTML = "";
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${get}`
    );
    const data = await response.json();

    if (!data.drinks) {
      drinksContainer.innerHTML = "<p>No drinks found.</p>";
      return;
    }

    data.drinks.forEach((drink) => {
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
        if (groupList.children.length >= 7) {
          alert("You can't add more than 7 drinks.");
        } else {
          const groupItem = document.createElement("div");
          groupItem.classList.add("group-item");
          groupItem.innerHTML = `
            <h6>${drink.strDrink}</h6>
            <p>${drink.strCategory}</p>
            `;
          groupList.appendChild(groupItem);

          count++;
          drinkCount.textContent = `Number of drinks: ${count}`;
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

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = searchBox.value.trim();
    if (input) fetchdrinks(input);
  });
});
