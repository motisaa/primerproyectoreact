import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { initialValues, validationSchema } from "./UsuarioFunciones";
import { useNavigate } from "react-router-dom";
import { GeneralCtx } from "../../contextos/GeneralContext";
import { MensajeError } from "../../servicios/TratamientoErrores";
import { ErrorGeneral } from "../../componentes/ErrorGeneral/ErrorGeneral";
import { MensajeInformativo } from "../../componentes/MensajeInformativo/MensajeInformativo";
import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import {
  ActualizarUsuario,
  CrearUsuario,
  LeerUsuario,
} from "../../servicios/RQUsuarios";
import { NavBar } from "../../componentes/NavBar/NavBar";
import { LeerGrupos } from "../../servicios/RQGrupos";
import moment from "moment";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  ConvertirAFechaEs,
  FormatoFechaEs,
} from "../../utilidades/TratamientoFechas";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/es";
import { useGeolocated } from "react-geolocated";

export const UsuarioPagina = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { getSession } = useContext(GeneralCtx);
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [hayMensaje, setHayMensaje] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [grupos, setGrupos] = useState([]);
  let grupo_seleccionado = null;
  const getGrupoIdValue = () => {
    grupo_seleccionado = grupos.find(
      (i) => i.usuarioGrupoId === formik.values.usuarioGrupoId
    );
    return grupo_seleccionado || null;
  };
  useQuery(
    "grupos",
    () => {
      return LeerGrupos();
    },
    {
      onSuccess: (data) => {
        let opciones_grupos = data.data;
        setGrupos(opciones_grupos);
      },
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleSubmit = async (values) => {
    values.fechaInterna = moment(selectedDate).format("YYYY-MM-DD HH:mm:ss");
    if (!values.usuarioId) {
      await crearUsuario.mutateAsync(values);
    } else {
      await actualizarUsuario.mutateAsync(values);
    }
    navigate("/usuarios");
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: handleSubmit,
  });

  const salirForm = (e) => {
    if (e) e.preventDefault();
    navigate("/usuarios");
  };

  const actualizarUsuario = useMutation(
    (usuario) => {
      return ActualizarUsuario(usuario);
    },
    {
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  const crearUsuario = useMutation(
    (usuario) => {
      return CrearUsuario(usuario);
    },
    {
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  const session = getSession();
  useQuery(
    ["usuario", params.usuarioId],
    () => {
      return LeerUsuario(params.usuarioId);
    },
    {
      onSuccess: (data) => {
        formik.setValues({ ...formik.values, ...data.data });
        setSelectedDate(ConvertirAFechaEs(data.data.fechaInterna));
      },

      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
      enabled: params.usuarioId !== "0",
    }
  );
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
  useGeolocated({
      positionOptions: {
          enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
  });

  return (
    <>
      <NavBar>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Datos de usuario:</Typography>
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
                id="usuarioId"
                name="usuarioId"
                label="ID"
                disabled
                value={formik.values.usuarioId}
                onChange={formik.handleChange}
                error={
                  formik.touched.usuarioId && Boolean(formik.errors.usuarioId)
                }
                helperText={formik.touched.usuarioId && formik.errors.usuarioId}
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
            <Grid item xs={2}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="login"
                name="login"
                label="Login"
                value={formik.values.login}
                onChange={formik.handleChange}
                error={formik.touched.login && Boolean(formik.errors.login)}
                helperText={formik.touched.login && formik.errors.login}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                label="Grupo"
                options={grupos}
                value={getGrupoIdValue()}
                getOptionLabel={(option) => option.nombre}
                onChange={(e, value) => {
                  formik.setFieldValue("usuarioGrupoId", value.usuarioGrupoId);
                }}
                fullWidth
                id="usuarioGrupoId"
                name="usuarioGrupoId"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Elija un grupo"
                    error={
                      formik.touched.usuarioGrupoId &&
                      Boolean(formik.errors.usuarioGrupoId)
                    }
                    helperText={
                      formik.touched.usuarioGrupoId &&
                      formik.errors.usuarioGrupoId
                    }
                  ></TextField>
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                adapterLocale="es-ES"
              >
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Fecha de alta"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="latitud"
                name="latitud"
                label="Latitud"
                value={formik.values.latitud}
                onChange={formik.handleChange}
                error={formik.touched.latitud && Boolean(formik.errors.latitud)}
                helperText={formik.touched.latitud && formik.errors.latitud}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="longitud"
                name="longitud"
                label="Longitud"
                value={formik.values.longitud}
                onChange={formik.handleChange}
                error={formik.touched.longitud && Boolean(formik.errors.longitud)}
                helperText={formik.touched.longitud && formik.errors.longitud}
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
