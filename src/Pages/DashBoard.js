import Parse from "parse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../Components/Category";
import Container from "react-bootstrap/Container";
import AddCategory from "../Components/AddCategory";
import NavigationBar from "../Components/NavigationBar";
import TopComponents from "../Components/TopComponents";
import AddCategoryBtn from "../Components/AddCategoryBtn";
import React from "react";
import {
  postCategory,
  getCategories,
  postAsset,
  getAssets,
  postCatVal,
  deleteCategory,
  postAssetRealestateM2,
  getHistoricNetworth,
  postHistoricNetworth,
  getGoal,
  putCategory,
} from "../data";
//Dialogue box from here
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Height } from "@mui/icons-material";

function Dashboard() {
  const navigate = useNavigate();
  //Fetches userId upon start so it's always avaliable in localStorage
  const userId = localStorage.getItem("userId");
  const [categoryId, setCategoryId] = useState("");

  //Manages display of addCategoryComponent upon pressing addCategory and disappear upon pressing cancel
  const [visibleAddCategory, setVisibleAddCategory] = useState(false);

  //Manages display if addAssetComponent upon pressing addAsset and disappear upon pressing cancel
  const [visibleAddAsset, setVisibleAddAsset] = useState([]);

  const [visibleAsset, setVisibleAsset] = useState([]);

  const [updateEffectOfVisibleAsset, setUpdateEffectOfVisibleAsset] =
    useState(false);

  const [
    updateEffectOfVisibleAssetRealM2,
    setUpdateEffectOfVisibleAssetRealM2,
  ] = useState(false);

  //Manages list of saved categories
  const [categories, setCategories] = useState([]);

  //Manages list of saved assets
  const [assets, setAssets] = useState([]);

  const [historicNetworth, setHistoricNetworth] = useState([]);

  //Manages all values in overviewCard
  const [assetsTotal, setAssetsTotal] = useState("");
  const [debtTotal, setDebtTotal] = useState("");
  const [netWorth, setNetWorth] = useState("");

  const [goal, setGoal] = useState("");

  //Saves a category to database by calling postCategory in data.js
  async function saveCategory() {
    try {
      const categoryName = localStorage.getItem("categorySelect");
      await postCategory(categoryName, userId); //Added await
      getCategories(userId, setCategories); //Moved this up hear insted of in useEffect
      getAssets(false, categoryId, userId, setAssets);
      setVisibleAddCategory(false);
    } catch (error) {
      console.log("Errors");
    }
  }

  const [newCatName, setNewCatName] = useState("");
  const handleChangeNewCatName = (e) => {
    setNewCatName(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("newCategoryName", newCatName);
    console.log(newCatName);
  }, [newCatName]);

  async function putCategoryHandler() {
    try {
      setEditOpen(false);
      await putCategory(categoryId, userId, newCatName);
    } catch (error) {
      console.log("Errors in putCatHandler");
    }
  }

  /**
   * Sets the visibleAddAsset stateHook to array of objects.
   * Each object has an id (String) and isVisible (boolean).
   */
  function initVisibleAddAsset() {
    var arrOfCat = [
      {
        id: null,
        isVisible: false,
      },
    ];
    arrOfCat = categories.map((category) => ({
      id: category.id,
      isVisible: false,
    }));
    setVisibleAddAsset(arrOfCat);
  }

  function initVisibleAsset(assetsArr) {
    var arrOfAsset = [
      {
        id: null,
        categoryId: null,
        name: null,
        value: 0,
        isVisible: false,
      },
    ];
    arrOfAsset = assetsArr.map((assets) => ({
      id: assets.id,
      categoryId: assets.attributes.categoryId,
      name: assets.attributes.name,
      value: assets.attributes.value,
      isVisible: true,
    }));
    setVisibleAsset((prevArr) => arrOfAsset);
  }

  function initVisibleAssetAfterUpdate(assetsArr) {
    var arrOfAsset = [
      {
        id: null,
        categoryId: null,
        name: null,
        value: 0,
        isVisible: false,
      },
    ];
    arrOfAsset = assetsArr.map((assets) => ({
      id: assets.id,
      categoryId: assets.attributes.categoryId,
      name: assets.attributes.name,
      value: assets.attributes.value,
      isVisible: true,
    }));
    setVisibleAsset((prevArr) => arrOfAsset);
  }

  function updateVisibleAsset(assetsArr) {
    let newAssetCatID = assetsArr.attributes.categoryId;

    let b = visibleAsset.find((a) => a.categoryId === newAssetCatID);

    let visiValue;

    if (typeof b === "undefined") {
      visiValue = true;
    } else {
      visiValue = b.isVisible;
    }

    let lastAsset = assetsArr;

    //Getting the recently added asset object.

    // Making a new object similar to "lastAsset" but with a isVisible property added to it.
    const lastAssetWithIsVisible = {
      id: lastAsset.id,
      categoryId: lastAsset.attributes.categoryId,
      name: lastAsset.attributes.name,
      value: lastAsset.attributes.value,
      isVisible: visiValue,
    };

    // Adding the new object to the end of visibleAsset array
    const VisibleAssetWithLastAssetObj = [
      ...visibleAsset,
      lastAssetWithIsVisible,
    ];

    // Setting isVisible array to the array with the new object added.
    setVisibleAsset((prevArr) => VisibleAssetWithLastAssetObj);
  }

  function isNegative(value) {
    return value <= 0 ? true : false;
  }

  function isZero(value) {
    return value === 0 ? true : false;
  }
  /**
   * Sets the all of the AddAssets to false and
   * open/closes the visibility of a categories assets that
   * matches with its categoryId.
   * @param {boolean} isOpen - Pass true to display the Add Asset component.
   * @param {String} categoryId - The ID of a category.
   */
  function setVisibleAddAssetFunction(isOpen, categoryId) {
    initVisibleAddAsset(); //Set all visible to false (sets the id to all, thats why you need to call this first)
    setVisibleAddAsset((prevArr) =>
      prevArr.map((prevObj) => {
        if (prevObj.id === categoryId) {
          const newObj = {
            ...prevObj,
            isVisible: isOpen,
          };
          return newObj;
        }
        return prevObj;
      })
    );
  }

  /**
   * open/closes the visibility of a categories assets that
   * matches with its categoryId.
   * @param {String} categoryId - The ID of a category.
   */
  function setVisibleAssetFunction(categoryId) {
    setVisibleAsset((prevArr) =>
      prevArr.map((prevObj) => {
        if (prevObj.categoryId === categoryId) {
          const newObj = {
            ...prevObj,
            isVisible: !prevObj.isVisible, //2
          };
          return newObj;
        }
        return prevObj;
      })
    );
    console.log(visibleAsset);
  }

  //Saves an asset to database by calling postAsset in data.js
  async function saveAsset() {
    try {
      const assetName = localStorage.getItem("assetName");
      const assetValue = localStorage.getItem("assetValue");
      if (isNaN(assetValue)) {
        alert("The value most be a number. Could not add item");
      } else {
        //This gets all assets related to a certain category - maybe use it to solve the issue of calculating total value of a category, since it returns all relevant assets: const assetsInCategory = getAssets(categoryId, userId, setAssets);
        let saveAss = await postAsset(
          assetName,
          assetValue,
          categoryId,
          userId
        ); //Added await
        // await getAsset(true, saveAss.id, userId, setLastAddedAsset);
        setAssets((prev) => [...prev, saveAss]);
        updateVisibleAsset(saveAss);
        await saveCatValue();
        setVisibleAddAssetFunction(false, categoryId); //Closes the visibleAddAsset after saving an asset
        calculateNetWorth(categories);
      }
    } catch (error) {
      console.log("Errors");
    }
  }

  //Saves an asset of type realestate price pr. m2 calculatioj to database by calling postAssetRealestateM2 in data.js
  async function saveAssetRealestateM2Handler() {
    try {
      const assetName = localStorage.getItem("assetName");
      const m2 = parseInt(localStorage.getItem("m2"));
      const pricem2 = parseInt(localStorage.getItem("pricem2"));

      if (isNaN(m2) || isZero(m2) || isNegative(m2)) {
        alert(
          "The value in 'm2' most be a positive number. Could not add item"
        );
      } else if (isNaN(pricem2) || isZero(pricem2)) {
        alert(
          "The value in 'Price pr. m2' most be a number. Could not add item"
        );
      } else {
        let value = (m2 * pricem2).toString();
        console.log("This is the value " + value);
        let saveAss = await postAssetRealestateM2(
          assetName,
          m2,
          pricem2,
          value,
          categoryId,
          userId
        );
        // getAssets(true, categoryId, userId, setAssets); //This gets all assets related to a certain category - maybe use it to solve the issue of calculating total value of a category, since it returns all relevant assets: const assetsInCategory = getAssets(categoryId, userId, setAssets);
        setAssets((prev) => [...prev, saveAss]);
        updateVisibleAsset(saveAss);
        await saveCatValue();
        setVisibleAddAssetFunction(false, categoryId); //Closes the visibleAddAsset after saving an asset
        calculateNetWorth(categories);
      }
    } catch (error) {
      alert("Error caught in saveAssetRealestateM2 " + error);
    }
  }

  //Handles saving updates to categoryValues each time a new asset is added
  async function saveCatValue() {
    const categoryId = localStorage.getItem("categoryId");
    const parseQuery = new Parse.Query("Asset");
    parseQuery.contains("categoryId", categoryId);
    parseQuery.contains("userId", userId);
    try {
      let assets = await parseQuery.find();
      const catVal = getCatVal(assets);
      let postCatValue = await postCatVal(categoryId, catVal);
      console.log("postCatValue = " + postCatValue);
    } catch (error) {
      console.log("Error in saveCatVal: " + error);
    }
  }

  /**
   * Save the relevant categoryId to local storage after clicking addAsset
   * and sets the visibility of an AddAsset to true/false.
   * @param {boolean} isOpen Pass true to display the Add Asset component.
   * @param {String} categoryId The ID of a category.
   */
  function addAssetClick(isOpen, categoryId) {
    //HERE 1
    localStorage.setItem("categoryId", categoryId);
    setCategoryId(categoryId);
    setVisibleAddAssetFunction(isOpen, categoryId);
  }

  //Calculates the networth
  function calculateNetWorth(categories) {
    let assetsSum = 0;
    let debtSum = 0;
    categories.map((category) => {
      if (category.get("value") >= 0) {
        assetsSum += category.get("value");
        return assetsSum;
      } else {
        debtSum += category.get("value");
        return debtSum;
      }
    });
    setAssetsTotal((prev) => assetsSum);
    setDebtTotal((prev) => debtSum);
    setNetWorth((prev) => assetsSum + debtSum);
  }

  //Gets the category value for specific assets
  function getCatVal(assets) {
    console.log("getCatCal called");
    let sum = 0; //Note: Techincal debt - there is no reason we are not just treating assets as numbers/ints consistently
    assets.map((asset) => {
      sum += parseInt(asset.get("value"));
      return sum;
    });
    return sum;
  }

  //Manages deletion of a category
  async function deleteCategoryHandler(categoryId) {
    localStorage.setItem("categoryId", categoryId);
    await deleteCategory(categoryId);
    setRerenderState(!rerenderState);
    handleDeleteClose();
    console.log("Delete category handler called");
  }

  async function deleteProfileHandler() {
    handleDeleteProfileClose();
    await deleteProfile();
    doUserLogOut(); // logout
  }

  //useEffect and stateHook handling userLogin and registration
  const [currentUser, setCurrentUser] = useState(null);

  const [rerenderState, setRerenderState] = useState(false);
  const [rerenderStateEdit, setRerenderStateEdit] = useState(false);

  //Main useEffect for total render upon start
  useEffect(() => {
    console.log("start [userId]");
    getCurrentUser()
      .then(() => getCategories(userId, setCategories))
      .then((categori) => calculateNetWorth(categori))
      .then(() => getAssets(false, "", userId, setAssets))
      .then((assetsArr) => initVisibleAsset(assetsArr)); //1

    getHistoricNetworth(userId, setHistoricNetworth)
      .then((hisData) => setHistoricNetworth(hisData))
      .then(() => (isNewMonth() ? saveHistoricNetworth() : null));

    getGoal(userId, setGoal);
  }, []);

  //Main useEffect for total render upon update
  useEffect(() => {
    console.log("start [userId]");
    getCurrentUser()
      .then(() => getCategories(userId, setCategories))
      .then((categori) => calculateNetWorth(categori))
      .then(() => getAssets(false, "", userId, setAssets))
      .then((assetsArr) => initVisibleAssetAfterUpdate(assetsArr)); //1

    getHistoricNetworth(userId, setHistoricNetworth)
      .then((hisData) => setHistoricNetworth(hisData))
      .then(() => (isNewMonth() ? saveHistoricNetworth() : null));

    getGoal(userId, setGoal);
  }, [rerenderState, rerenderStateEdit]);

  // Handling updates of assets
  useEffect(() => {
    if (categoryId !== "") {
      saveAsset();
    }
  }, [updateEffectOfVisibleAsset]);

  useEffect(() => {
    if (categoryId !== "") {
      saveAssetRealestateM2Handler();
    }
  }, [updateEffectOfVisibleAssetRealM2]);

  function isNewMonth() {
    const historicMonth = historicNetworth.map((hisEle) => {
      return hisEle.get("date").getMonth() + 1;
    });
    const lastHistoricMonth = historicMonth[historicMonth.length - 1];
    const currentMonth = new Date().getMonth() + 1;

    if (lastHistoricMonth !== currentMonth && lastHistoricMonth !== undefined) {
      console.log("Saving historicNetworth to database");
      return true;
    } else {
      console.log("Did Not save historicNetworth to database");
      return false;
    }
  }

  function saveHistoricNetworth() {
    try {
      const userId = localStorage.getItem("userId");
      const networth = 25000;
      const date = new Date();
      // const date = 4
      postHistoricNetworth(userId, networth, date);
      console.log("inserted data");
    } catch (error) {
      alert("Error in saveHistoricNetworth");
    }
  }

  //User login/logout related
  async function getCurrentUser() {
    const currentUser = await Parse.User.current();
    setCurrentUser(currentUser);
    return currentUser;
  }

  //User login/logout related
  const doUserLogOut = async function () {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = await Parse.User.current();
      if (currentUser === null) {
        alert("Succesfully logged out!");
      }
      navigate("/");
      return true;
    } catch (error) {
      alert("Error caught: ", error);
      return false;
    }
  };

  const deleteProfile = async function () {
    // get current user
    const currentUser = await Parse.User.current();
    try {
      // delete the current user
      await currentUser.destroy();
      alert("Success! User deleted!");
      return true;
    } catch (error) {
      // Error can be caused by lack of Internet connection
      alert(`Error ${error.message}`);
      return false;
    }
  };

  //Dialogue box from here
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteProfileOpen, setDeleteProfileOpen] = React.useState(false);

  //GO HERE
  const handleEditClickOpen = (catId) => {
    addAssetClick(false, catId);
    setEditOpen(true);
  };

  const handleDeleteClickOpen = (catId) => {
    localStorage.setItem("categoryId", catId);
    setDeleteOpen(true);
  };

  const handleDeleteProfileClickOpen = () => {
    setDeleteProfileOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteProfileClose = () => {
    setDeleteProfileOpen(false);
  };

  if (currentUser === null) {
    //Nessesary, otherwise it crashes
    return (
      <>
        <p>Logging in - please hold</p>
      </>
    );
  }
  if (currentUser !== null) {
    return (
      <div>
        <NavigationBar
          welcome={"Welcome " + currentUser.get("username")}
          username={currentUser.get("username")}
          logout={() => doUserLogOut()}
          deleteProfile={() => handleDeleteProfileClickOpen()}
        />
        <Container>
          <br />
          <TopComponents
            assetsTotal={assetsTotal}
            debtTotal={debtTotal}
            netWorth={netWorth}
            categories={categories}
            historicNetworth={historicNetworth}
            goal={goal}
            setGoal={setGoal}
          />
          <br />
          <div className="visibleSavedCategory">
            {categories.map((category) => (
              <Category
                key={category.id} //Key is not a prop. Trying to access it will result in `undefined`.
                categoryId={category.id} // Created categoryId to access the prop in asset.
                title={category.get("name")}
                value={category.get("value")}
                eventAddAsset={() => addAssetClick(true, category.id)} //Sets the visibility of AddAsset to true
                assets={assets}
                visibleAddAsset={visibleAddAsset} //pass a array that tells whether add a new assets box is visible.
                eventSave={() =>
                  setUpdateEffectOfVisibleAsset((prevState) => !prevState)
                }
                eventCancel={() => addAssetClick(false, category.id)} //Sets the visibility of AddAsset to false
                eventDeleteCategory={() =>
                  // deleteCategoryHandler(category.id)
                  handleDeleteClickOpen(category.id)
                }
                eventSaveAssetRealestateM2={() =>
                  setUpdateEffectOfVisibleAssetRealM2((prevState) => !prevState)
                }
                viewAsset={() => setVisibleAssetFunction(category.id)} //Open/closes the visibility of a categories assets
                visibleAsset={visibleAsset} //pass a array that tells whether assets are visible.
                eventRerenderState={() => setRerenderState(!rerenderState)}
                eventRerenderStateEdit={() =>
                  setRerenderStateEdit(!rerenderStateEdit)
                }
                eventUpdateCategory={() => handleEditClickOpen(category.id)}
              />
            ))}
          </div>
          <div className="visibleAddCategory">
            {visibleAddCategory ? (
              <AddCategory
                eventCancel={() => setVisibleAddCategory(false)}
                eventSave={() => saveCategory()}
              />
            ) : (
              <div className="Empty container"></div>
            )}
          </div>
          <br />
          <AddCategoryBtn event={() => setVisibleAddCategory(true)} />
          <br />
        </Container>
        <div
          class="backgroundcolor-container"
          style={{ height: "200px", backgroundColor: "#eff0f3" }}
        ></div>
        {/* -----------Edit category dialog box---------------  */}
        <div>
          <Dialog open={editOpen} onClose={handleEditClose}>
            <DialogTitle>Enter new category name</DialogTitle>
            <DialogContent>
              <DialogContentText>{/*Subtitle goes here*/}</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Category name"
                type="name"
                fullWidth
                variant="standard"
                onChange={handleChangeNewCatName}
                value={newCatName}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditClose}>Cancel</Button>
              <Button onClick={putCategoryHandler}>Save</Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* -----------Delete category dialog box---------------  */}
        <div>
          <Dialog
            open={deleteOpen}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose}>No</Button>
              <Button
                onClick={() =>
                  deleteCategoryHandler(localStorage.getItem("categoryId"))
                }
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* -----------Delete profile dialog box---------------  */}
        <div>
          <Dialog
            open={deleteProfileOpen}
            onClose={handleDeleteProfileClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete profile?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>
                  All your data will be deleted permanently. Your data will also
                  be removed from the AssetTracker database permanently.
                </p>
                Are you sure you want to delete your profile?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteProfileClose}>No</Button>
              <Button onClick={() => deleteProfileHandler()} autoFocus>
                Yes, delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Dashboard;
