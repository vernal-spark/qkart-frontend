import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange=(e)=>{
    setSearchKey(e.target.value);
  }
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  // const performAPICall=async()=>{
  //   try{
  //     let url = `${config.endpoint}/products`;
  //    const res=await fetch(url);
  //    console.log(res)
  //    const d=await res.json();
  //    console.log(d)
  //    setProducts(d);
  //    setIsLoading(false);
  //   }catch(e){
  //     setIsLoading(false);
  //     if(e.response && e.response.status===400){
  //       enqueueSnackbar(e.response.data.message,{variant:"error"})
  //     }
  //     else{
  //           enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"})
  //         }
  //   }
  // }

  const performAPICall = async () => {
    
    return axios.get(`${config.endpoint}/products`)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((e) => {
        setIsLoading(false);
        if(e.response && e.response.status===500){
          enqueueSnackbar(e.response.data.message,{variant:"error"})
        }
        else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"})
        }
      })
  };
  useEffect(() => {
    setIsLoading(true);
    performAPICall();
    
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  // const performSearch=async(text)=>{
  //   try{
  //     let url = `${config.endpoint}/products`;
  //    if (searchKey) {
  //      url = `${config.endpoint}/products/search?value=${text}`;
  //    }
  //    const res=await fetch(url);
  //    const d=await res.json();
  //    console.log(d)
  //    setProducts(d);
  //    console.log(products)
  //    setIsLoading(false);
  //   }catch(e){
  //     setIsLoading(false);
  //     if(e.response && e.response.status===400){
  //       enqueueSnackbar(e.response.data.message,{variant:"error"})
  //     }
  //     else{
  //           enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"})
  //         }
  //   }
    
  // }
  const performSearch = async (text) => {
    let url = `${config.endpoint}/products`;
    if (text) {
      url = `${config.endpoint}/products/search?value=${text}`;
    }
    return axios
      .get(url)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
       setProducts(response.data);
      })
      .catch((e) => {
        setIsLoading(false);
        setProducts([])
        if(e.response && e.response.status===400){
          enqueueSnackbar(e.response.data.message,{variant:"error"})
        }
        else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant:"error"})
        }
      })
      
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (debounceTimeout) => {
    clearTimeout(debounceTimeout);
    const newtimerId = setTimeout(() => {
      setIsLoading(true);
      performSearch(searchKey);
    }, 500);
    setDebounceTimeout(newtimerId);
  };
  useEffect(()=>{
    debounceSearch(debounceTimeout);
  },[searchKey])

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          value={searchKey}
          onChange={(e) =>handleInputChange(e)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        value={searchKey}
        onChange={(e)=>handleInputChange(e)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {isLoading ? (
          <>Loading Products...</>
        ) : (<>
          {
          products && products.length?(
            <Grid container item mt={2} mb={2} ml={6} className="product-grid">
               {products.map((ele) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={ele._id}>
                  <ProductCard product={ele} />
                </Grid>
              ))}
            </Grid>
          ):(
            <Box className="loading">
            <SentimentDissatisfied color="action"/>
            <h4 >No Products Found</h4>
            </Box>
          )}
          </>)}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
