import Parse from "parse";

export async function postCategory(name, userId) {
  try {
    const Category = Parse.Object.extend("Category");
    const thisCategory = new Category();
    thisCategory.set("name", name);
    thisCategory.set("userId", userId);
    //thisCategory.set("userPointer", userPointer); Bug: Doesn't work with pointersl
    await thisCategory.save();
    alert("Saved category to database");
  } catch (error) {}
}

export async function getCategories(userId, setCategories) {
  const parseQuery = new Parse.Query("Category");
  parseQuery.contains("userId", userId);
  try {
    let categories = await parseQuery.find();
    setCategories(categories);
    return categories;
  } catch (error) {
    alert("errors");
    return false;
  }
}

export async function postAsset(assetName, assetValue, categoryId, userId) {
  try {
    const Asset = Parse.Object.extend("Asset");
    const thisAsset = new Asset();
    thisAsset.set("name", assetName);
    thisAsset.set("value", assetValue);
    thisAsset.set("categoryId", categoryId);
    thisAsset.set("userId", userId);
    //thisAsset.set("userPointer", userPointer); Bug: Doesn't work with pointers
    await thisAsset.save();
    alert("Saved asset to database");
  } catch (error) {}
}

function getCatVal(assets) {
  //Note: Techincal debt - there is no reason we are not just treating assets as numbers/ints consistently
  let sum = 0;
  assets.map((asset) => {
    sum += parseInt(asset.get("value"));
    return sum; //If error, check what this does
  });
  return sum;
}

async function postCatVal(categoryId, value) {
  const Category = Parse.Object.extend("Category");
  const thisCategory = new Category();
  thisCategory.set("objectId", categoryId);
  //Semantic bug: Works as intented but causes console error - It's because the name is required in the DB
  thisCategory.set("value", value);
  try {
    await thisCategory.save();
    console.log("Saved category value to DB");
  } catch (error) {
    console.log(
      "Error in postCatVal(): This is a tempoary solution: Cannot post a category without a name. You cannot make the name field not mandatory, because then it posts a new category without name everytime the page rerenders " +
        error
    );
  }
}

export async function getAssets(categoryId, userId, setAssets) {
  const parseQuery = new Parse.Query("Asset");
  parseQuery.contains("categoryId", categoryId);
  parseQuery.contains("userId", userId);
  try {
    let assets = await parseQuery.find();
    //Saves total category value in catVal which it gets from the array of asset related to a cetain category
    const catVal = getCatVal(assets);
    postCatVal(categoryId, catVal); //Technical debt: Needs to be called correctly in useEffect because we don't want it to be called when we are getting assets
    setAssets(assets);
    return assets;
  } catch (error) {
    alert("errors");
    return false;
  }
}

// //Not working: 1st attempt to GET the total value of a category by fetching all assets from database - needs to be imported to work in dashboard
// export async function getCategoryValue(categoryId, userId) {
//   let sum = 0;
//   const parseQuery = new Parse.Query("Asset");
//   parseQuery.contains("categoryId", categoryId);
//   parseQuery.contains("userId", userId);
//   try {
//     let assets = await parseQuery.find();
//     assets.map((asset) => (sum += asset.get("value")));
//   } catch (error) {
//     console.log(error);
//   }
//   return sum;
// }

// //Not working: 2nd attempt to itterate thorugh all the assets in the assets array of dashboard (passed as assets) and then to POST the total value to the category of the database. Notice that the use of ParseInt() is an attempt to solve the issue of storing strings in the database and use them as integers here - needs to be imported to work in dashboard
// export async function postCategoryValue(categoryId, userId, assets) {
//   let sum = 0;
//   //Attempt to iterate thoguh all assetvalues to get sum
//   assets.map((asset) => (sum += parseInt(asset.value)));
//   console.log(sum);
//   try {
//     const Category = Parse.Object.extend("Category");
//     const thisCategory = new Category();
//     //Filtering of right rows in category table goes here
//     thisCategory.set("value", sum);
//   } catch (error) {}
// }
