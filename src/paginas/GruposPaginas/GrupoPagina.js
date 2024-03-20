import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { initialValues, validationSchema } from "./GrupoFunciones";
import { useNavigate } from "react-router-dom";
import { GeneralCtx } from "../../contextos/GeneralContext";
import { MensajeError } from "../../servicios/TratamientoErrores";
import { ErrorGeneral } from "../../componentes/ErrorGeneral/ErrorGeneral";
import { MensajeInformativo } from "../../componentes/MensajeInformativo/MensajeInformativo";
import { Button, TextField, Typography, Grid } from "@mui/material";
import {
  ActualizarGrupo,
  CrearGrupo,
  LeerGrupo,
} from "../../servicios/RQGrupos";
import { NavBar } from "../../componentes/NavBar/NavBar";

export const GrupoPagina = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [hayMensaje, setHayMensaje] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (values) => {
    if (!values.usuarioGrupoId) {
      await crearGrupo.mutateAsync(values);
    } else {
      await actualizarGrupo.mutateAsync(values);
    }
    navigate("/grupos");
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: handleSubmit,
  });

  const salirForm = (e) => {
    if (e) e.preventDefault();
    navigate("/grupos");
  };

  const actualizarGrupo = useMutation(
    (grupo) => {
      return ActualizarGrupo(grupo);
    },
    {
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  const crearGrupo = useMutation(
    (grupo) => {
      return CrearGrupo(grupo);
    },
    {
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  useQuery(
    ["grupo", params.usuarioGrupoId],
    () => {
      return LeerGrupo(params.usuarioGrupoId);
    },
    {
      onSuccess: (data, variables, context) => {
        formik.setValues({ ...formik.values, ...data.data });
      },
      onError: (error, variables, context) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
      enabled: params.usuarioGrupoId !== "0",
    }
  );

  return (
    <>
      <NavBar>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Datos de Grupo:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button color="success" variant="contained" onClick={salirForm}>
                Salir
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{ marginLeft: 2 }}
              >
                Aceptar
              </Button>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                id="usuarioGrupoId"
                name="usuarioGrupoId"
                label="ID"
                disabled
                value={formik.values.usuarioGrupoId}
                onChange={formik.handleChange}
                error={
                  formik.touched.usuarioGrupoId &&
                  Boolean(formik.errors.usuarioGrupoId)
                }
                helperText={
                  formik.touched.usuarioGrupoId && formik.errors.usuarioGrupoId
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="nombre"
                name="nombre"
                label="Nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>
            <Grid item xs={12} md={6}></Grid>
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button color="success" variant="contained" onClick={salirForm}>
                Salir
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{ marginLeft: 2 }}
              >
                Aceptar
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
          cerrarMensaje={() => setHayMensaje(false)}
        />
      </NavBar>
    </>
  );
};
