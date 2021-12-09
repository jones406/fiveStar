import { ADD_DRINK } from "../utils/mutations";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Fingerprint from "@mui/icons-material/Fingerprint";
import { InputAdornment } from "@mui/material";

import {useMutation,useQuery} from "@apollo/client"
import {GET_ALL_DRINKS} from '../utils/queries'


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };




export function AddButton() {
    const [characterCount, setCharacterCount] = useState(0);

    const [formState, setFormState] = useState({
      drinkName: '',
      venue: '',
    });


  
    const [addDrink, { error }] = useMutation(ADD_DRINK,{
      update(cache, { data: { addDrink } }) {
        try {
          const { drinks } = cache.readQuery({ query: GET_ALL_DRINKS });
  
          cache.writeQuery({
            query: GET_ALL_DRINKS,
            data: { drinks: [addDrink, ...drinks] },
          });
        } catch (e) {
          console.error(e);
        }
      },
    });
  
  
  const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const { data } = await addDrink({
          variables: { ...formState },
        });
  
        setFormState({
          drinkName: '',
          venue: '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // if (name === 'thoughtText' && value.length <= 280) {
          setFormState({ ...formState, [name]: value });
         // setCharacterCount(value.length);
        // } else if (name !== 'thoughtText') {
        //   setFormState({ ...formState, [name]: value });
        // }
      };
    
    return (
        <div>
         <Box
              sx={{ pl: "1rem" }}
              component="form"
                onSubmit={handleFormSubmit}
            >
              <TextField
                variant="outlined"
                endAdornment
                sx={{ disableUnderline: true }}
                margin="normal"
                required
                fullWidth
                name="searchInput"
                label="Search Drinks"
                type="searchInput"
                id="searchInput"
                autoComplete="search"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="fingerprint"
                        color="secondary"
                        type="submit"
                      >
                        <Fingerprint />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
  
          <div className="col-12 col-lg-3">
            <button className="btn btn-primary btn-block py-3" type="submit">
              A Drink
            </button>
          </div>
          {error && (
            <div className="col-12 my-3 bg-danger text-white p-3">
              Something went wrong...
            </div>
          )}
      
      </div>
    );
  }

