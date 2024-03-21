import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../componentes/NavBar/NavBar";
import { MensajeError } from "../../servicios/TratamientoErrores";
import { ErrorGeneral } from "../../componentes/ErrorGeneral/ErrorGeneral";
import { LeerGrupos, EliminarGrupo } from "../../servicios/RQGrupos";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { MensajeConfirmacion } from "../../componentes/MensajeConfirmacion/MensajeConfirmacion";
import { MensajeInformativo } from "../../componentes/MensajeInformativo/MensajeInformativo";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";

export const GruposPagina = () => {
  const navigate = useNavigate();
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [hayMensaje, setHayMensaje] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [hayConfirmacion, setHayConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [grupo, setGrupo] = useState();

  const queryGrupos = useQuery(
    "grupos",
    () => {
      return LeerGrupos();
    },
    {
      onSuccess: (data) => {
        setGrupos(data.data);
      },
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  const eliminaGrupo = useMutation(
    ({ usuarioGrupoId }) => {
      return EliminarGrupo(usuarioGrupoId);
    },
    {
      onError: (error) => {
        // si ocurre un error, se imprime en la consola (console.error(error)),
        console.error(error);
        // se establece un mensaje de error utilizando la función MensajeError(error
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );

  const newGrupo = () => {
    navigate(`/grupo/0`);
  };

  const editGrupo = (usuarioGrupoId) => {
    return () => {
      navigate(`/grupo/${usuarioGrupoId}`);
    };
  };

  const deleteGrupo = (row) => {
    return () => {
      setGrupo(row);
      setMensajeConfirmacion(
        `¿Realmente desea eliminar el grupo ${row.nombre}?`
      );
      setHayConfirmacion(true);
    };
  };
  const deleteConfirmado = async () => {
    await eliminaGrupo.mutateAsync({ usuarioGrupoId: grupo.usuarioGrupoId });
    queryGrupos.refetch();
    setHayConfirmacion(false);
    setMensaje(
      `El grupo ${grupo.nombre} ha sido eliminado de la base de datos`
    );
    setHayMensaje(true);
  };
  const columns = [
    { field: "usuarioGrupoId", headerName: "ID", width: 50 },
    { field: "nombre", headerName: "Nombre", flex: 1 },

    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 80,
      getActions: ({ row }) => {
        return [
          <IconButton onClick={deleteGrupo(row)}>
            <DeleteIcon />
          </IconButton>,
          <IconButton onClick={editGrupo(row.usuarioGrupoId)}>
            <EditIcon />
          </IconButton>,
        ];
      },
    },
  ];
  return (
    <>
      <NavBar>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar id="imagen" position="static" color="secondary">
              <Toolbar>
                <Typography variant="h6" component="h6">
                  Grupos
                </Typography>
                <span className="toolbarButtons">
                  <IconButton
                    size="large"
                    aria-label="Nuevo grupo"
                    color="inherit"
                    onClick={newGrupo}
                  >
                    <Tooltip title="Nuevo grupo">
                      <AddIcon />
                    </Tooltip>
                  </IconButton>
                </span>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12} style={{ height: "80vh", width: "100%" }}>
            <DataGrid
              rows={grupos}
              columns={columns}
              getRowId={(row) => row.usuarioGrupoId}
              components={{ Toolbar: GridToolbar }}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
          </Grid>
        </Grid>
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
        <MensajeConfirmacion
          hayConfirmacion={hayConfirmacion}
          mensaje={mensajeConfirmacion}
          confirmar={deleteConfirmado}
          cerrarConfirmacion={() => setHayConfirmacion(false)}
        />
      </NavBar>
    </>
  );
};
