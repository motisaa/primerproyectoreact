import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { LoginBasicoUsuario } from "../../servicios/RQUsuarios";
import { GeneralCtx } from "../../contextos/GeneralContext";
import { ErrorGeneral } from "../../componentes/ErrorGeneral/ErrorGeneral";
import { MensajeInformativo } from "../../componentes/MensajeInformativo/MensajeInformativo";
import "./LoginPagina.css";
import { MensajeError } from "../../servicios/TratamientoErrores";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const validationSchema = yup.object({
  login: yup.string("Introduzca su login").required("Requerido"),
  password: yup.string("Introduzca su contraseña").required("Requerido"),
});

export const LoginForm = (props) => {
  const { setSession } = useContext(GeneralCtx);
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [hayMensaje, setHayMensaje] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const usuario = await loginBasico({
      login: values.login,
      password: values.password,
    });

    // preguntar si es correcto o hay que poner otro parametro
    setSession(usuario);
    // Mostramos mensaje de OK
    setMensaje(`Login correcto: ${usuario.nombre}`);
    setHayMensaje(true);
    // Nos vamos a inicio
    navigate("/inicio");
  };

  const loginBasico = async ({ login, password }) => {
    try {
      const { data: usuario } = await LoginBasicoUsuario(login, password);
      return usuario;
    } catch (error) {
      console.log("error", error);
      setMensajeError(MensajeError(error));
      setHayError(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      login: null,
      password: null,
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} alignItems="center">
            <AccountCircleIcon fontSize="large" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="login"
              name="login"
              label="Username"
              value={formik.values.login}
              onChange={formik.handleChange}
              error={formik.touched.login && Boolean(formik.errors.login)}
              helperText={formik.touched.login && formik.errors.login}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Entrar
            </Button>
          </Grid>
        </Grid>
      </form>
      <ErrorGeneral
        hayError={hayError}
        mensajeError={mensajeError}
        cerrarError={() => setHayError(false)}
      />
      <MensajeInformativo
        hayMensaje={hayMensaje}
        mensaje={mensaje}
        cerrarMensaje={() => false}
      />
    </>
  );
};
