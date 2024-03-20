import { Typography, Grid, Paper } from "@mui/material";
import React from "react";
import { NavBar } from "../../componentes/NavBar/NavBar";

export const InicioPagina = () => {
  return (
    <>
      <NavBar>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ padding: 12 }}>
              <Typography variant="h3">Moti app</Typography>
              <Typography color={"black"}>Hola</Typography>
            </Paper>
          </Grid>
        </Grid>
      </NavBar>
    </>
  );
};
