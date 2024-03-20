import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";

export const LoginPagina = () => {
 
  // const consultarAcceso = async () => {
  //   try {
  //     const { data: resp } = await ConsultarUsuarioPorAccUrl(
  //       window.location.hostname
  //     );
  //     setUsuario({
  //       accUrl: resp.accUrl,
  //     });
  //   } catch (error) {
  //     console.log("err", error);
  //   }
  // };

  // useEffect(() => {
  //   consultarAcceso();
  // }, []);

  return (
    <>
      {/* center de login box */}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item m={4}>
          <div className="recuadro">
            {/* <LOgin dtLogin={usuario} /> */}
            <LoginForm />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
