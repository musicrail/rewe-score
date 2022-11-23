"use strict";

const amountElem = document.getElementById("amount");
const unitElem = document.getElementById("unit");
const ingredientElem = document.getElementById("ingredient");

const recipeTable = document.getElementById("current-recipe-display");
const allRecipesTable = document.getElementById("all-recipes");
const submitIngredient = document.getElementById("submit-ingredient");
const submitRecipe = document.getElementById("submit-recipe");
const downloadRecipes = document.getElementById("download-recipes");

// dummy data
const RECIPE = [];
const ALL_RECIPES = [];

const validUnits = ["g", "ml", "el", "tl", "st"];

/**
 * add ingredient and amount to recipe variable
 */
submitIngredient.addEventListener("click", () => {
  if (
    amountElem.value !== "" &&
    unitElem.value !== "" &&
    ingredientElem.value !== ""
  ) {
    if (isNaN(Number(amountElem.value))) return;
    if (!validUnits.includes(unitElem.value)) return;
    // TODO how to valid ingredients? | expandable dropdown menu with attempt to auto complete

    const tr = document.createElement("tr");
    for (const value of [
      amountElem.value,
      unitElem.value,
      ingredientElem.value,
    ]) {
      const cell = document.createElement("td");
      cell.innerText = value;
      tr.appendChild(cell);
    }
    recipeTable.lastElementChild.appendChild(tr);

    RECIPE.push({
      amount: amountElem.value,
      unit: unitElem.value,
      ingredient: ingredientElem.value,
    });
    console.log(RECIPE);

    amountElem.value = "";
    unitElem.value = "";
    ingredientElem.value = "";
    amountElem.focus();
  }
});

/**
 * add recipe to all-recipes and flush recipe
 */
submitRecipe.addEventListener("click", () => {
  if (RECIPE.length === 0) return;
  console.log(RECIPE);
  if (ALL_RECIPES.length === 0) {
    ALL_RECIPES.push([]);
  }
  const presentIngredients = ALL_RECIPES[0];
  const newRecipe = new Array(presentIngredients.length);
  newRecipe.fill(0);
  ALL_RECIPES.push(newRecipe);
  for ({ amount, unit, ingredient } of RECIPE) {
    //TODO transform units into gramm
    // transform unit to gramm (reference table)
    if (presentIngredients.includes(ingredient)) {
      const index = presentIngredients.indexOf(ingredient);
      newRecipe[index] = amount; // will maybe be changed through unit-transformer
    } else {
      ALL_RECIPES.forEach((elem) => elem.push(0));
      presentIngredients.pop();
      presentIngredients.push(ingredient);
      newRecipe.pop();
      newRecipe.push(amount);
    }
  }
  RECIPE.length = 0;
  recipeTable.replaceChildren([])
  console.log(ALL_RECIPES);

  // create all-recipe table
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  let stoper = 0;
  for (const line of ALL_RECIPES) {
    const tr = document.createElement("tr");
    if (stoper === 0) {
      line.forEach((cell) => {
        const th = document.createElement("th");
        th.innerText = cell;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      stoper = 1;
    } else {
      line.forEach((cell) => {
        const td = document.createElement("td");
        td.innerText = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
  }
  allRecipesTable.replaceChildren(thead, tbody);

  amountElem.focus();
});

/**
 * download all-recipes ass a csv-file
 */
downloadRecipes.addEventListener("click", () => {
  if (ALL_RECIPES.length <= 0) return
  const preparedCsv = [ALL_RECIPES.join("\n")];

  // download all recipes as csv
  const blob = new Blob(preparedCsv);
  const url = window.URL.createObjectURL(blob);
  console.log(url);
  const downloadHelper = document.createElement("a");
  downloadHelper.id = "downloadHelper";
  downloadHelper.href = url;
  // TODO rename with unique name
  downloadHelper.download = "this.txt";
  document.body.appendChild(downloadHelper);
  downloadHelper.click();
  document.getElementById("downloadHelper").remove();
  console.log("downloaded");

  allRecipesTable.replaceChildren([])
});
