import Parse from "parse";
import { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../Components/Category";
import Container from "react-bootstrap/Container";
import AddCategory from "../Components/AddCategory";
import EditAsset from "../Components/EditAsset";
import NavigationBar from "../Components/NavigationBar";
import TopComponents from "../Components/TopComponents";
import AddCategoryBtn from "../Components/AddCategoryBtn";
import {
  postCategory,
  getCategories,
  postAsset,
  getAssets,
  postCatVal,
} from "../data";

function Dashboard() {
  const navigate = useNavigate();
  //Fetches userId upon start so it's always avaliable in localStorage
  const userId = localStorage.getItem("userId");
  const [categoryId, setCategoryId] = useState("");

  //Manages display of addCategoryComponent upon pressing addCategory and dissapear upon pressing cancel
  const [visibleAddCategory, setVisibleAddCategory] = useState(false);

  //Manages display if addAssetComponent upon pressing addAsset and dissapear upon pressing cancel
  const [visibleAddAsset, setVisibleAddAsset] = useState(false);

  //Manages list of saved categories
  const [categories, setCategories] = useState([]);

  //Manages list of saved assets
  const [assets, setAssets] = useState([]);

  //console.log(assets);
  const [assetsTotal, setAssetsTotal] = useState("");
  const [debtTotal, setDebtTotal] = useState("");
  const [netWorth, setNetWorth] = useState("");


  //Saves a category to database by calling postCategory in data.js
  async function saveCategory() {
    try {
      const categoryName = localStorage.getItem("categorySelect");
      await postCategory(categoryName, userId); //Added await
      getCategories(userId, setCategories); //Moved this up hear insted of in useEffect
      getAssets(categoryId, userId, setAssets);

      setVisibleAddCategory(false); 

        
      } catch (error) {
        console.log("Errors");
      } 
    }
    
    // ------------------Start------------------------
    
  const [visibleAddAsset, setVisibleAddAsset] = useState([]); // does not have any effect
    
  function initVisibleAddAsset(){  
    var arrOfCat = [{
      id:null, 
      isVisible:false
    }]
  
    arrOfCat = categories.map((category) => ({id: category.id, isVisible: false}))
    setVisibleAddAsset(arrOfCat)
  }

  useEffect(() => {
    initVisibleAddAsset() ;
    console.log(visibleAddAsset)
    console.log(categories)
  }, [categoryId]); 

  function setVisibleAddAssetFunction(isOpen, categoryId){
    setVisibleAddAsset( prevArr =>
      prevArr.map( (prevObj) => {
      
      if(prevObj.id === categoryId){
        
        const newObj = {
          ...prevObj,
          isVisible: isOpen
        }
        return newObj        
      } 
      return prevObj
    })
    )
  }

    // ------------------end------------------------
  


  //Saves an asset to database by calling postAsset in data.js
  async function saveAsset() {
    try {
      const assetName = localStorage.getItem("assetName");
      const assetValue = localStorage.getItem("assetValue");
      await postAsset(assetName, assetValue, categoryId, userId); //Added await
      getAssets(categoryId, userId, setAssets); //This gets all assets related to a certain category - maybe use it to solve the issue of calculating total value of a category, since it returns all relevant assets: const assetsInCategory = getAssets(categoryId, userId, setAssets);
      setVisibleAddAsset(false);
      saveCatValue();
    } catch (error) {
      console.log("Errors");
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
      await postCatVal(categoryId, catVal);
      console.log("Called saveCatVal");
    } catch (error) {
      console.log("Error in saveCatVal: " + error);
    }
  }


    
    
    //Nessesary functon that wraps function calls that needs to happen in a specific order in order to save the relevant categoryId to local storage after clicking addAsset
  function addAssetClick( isOpen, categoryId) {
    console.log("clicked")  
    

    localStorage.setItem("categoryId", categoryId);
    
    // ------------------Start------------------------
    setCategoryId(categoryId);

    getAssets(categoryId, userId, setAssets);
    setVisibleAddAssetFunction(isOpen, categoryId)
    // ------------------END------------------------

  }

  




  //useEffect and stateHook handling userLogin and registration
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    console.log("userID")
    getCurrentUser();
    initVisibleAddAsset() ;
  }, [userId]);


  
  //useEffect handling update of overviewCard (assettotal, debttotal and networth) in topComponent //NOTE: THE SOLUTION TO THE UNINTENDED CALLS TO GETCATEGORIES, GETASSETS AND CALCULATE NETWORTH IS ANOTHER USEEFFECT HOOK WITH IT'S OWN DEPENDENCIES: https://www.linkedin.com/learning/react-hooks/working-with-the-dependency-array?autoSkip=true&autoplay=true&resume=false&u=55937129
  useEffect(() => {
    calculateNetWorth(categories);
    console.log("UseEffect called");
  }, [categories, assets]);


  //useEffect handling update of categories and assets (Warning: dont add assets or categories to dependecy array)
  useEffect(() => {
    getCategories(userId, setCategories); //Moved this up hear insted of in useEffect
    getAssets(categoryId, userId, setAssets);
    console.log("UseEffect called");
  }, [userId, categoryId, visibleAddAsset]);


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
        <NavigationBar />
        <Container>
          <h2>Welcome {currentUser.get("username")}</h2>
          <TopComponents
            assetsTotal={assetsTotal}
            debtTotal={debtTotal}
            netWorth={netWorth}
            categories={categories}
          />
          <br />
          <div className="visibleSavedCategory">
            {categories.map((category) => (
              <Category
                key={category.id} //Key is not a prop. Trying to access it will result in `undefined`.
                categoryId={category.id} // Created categoryId to access the prop in asset.
                title={category.get("name")}
                value={category.get("value")}
                eventAddAsset={() => addAssetClick(true,category.id)}
                assets={assets}

    // ------------------Start------------------------
                visibleAddAsset={visibleAddAsset} 
                eventSave = {() => saveAsset()}             
                eventCancel = {() => addAssetClick(false, category.id)}             
    // ------------------End------------------------
              
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
          <button onClick={doUserLogOut}>Logout</button>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
