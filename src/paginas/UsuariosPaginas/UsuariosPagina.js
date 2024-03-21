import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../componentes/NavBar/NavBar";
import { MensajeError } from "../../servicios/TratamientoErrores";
import { ErrorGeneral } from "../../componentes/ErrorGeneral/ErrorGeneral";
import { LeerUsuarios, eliminarUsuario } from "../../servicios/RQUsuarios";
import { GeneralCtx } from "../../contextos/GeneralContext";
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

export const UsuariosPagina = () => {
  const navigate = useNavigate();
  const { getSession } = useContext(GeneralCtx);
  const [hayError, setHayError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [hayMensaje, setHayMensaje] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [hayConfirmacion, setHayConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState();

  const session = getSession();

  /* useQuery: Esta función toma tres argumentos:

        El primer argumento es una clave o identificador único para esta consulta.
         En este caso, es'usuarios'.
        El segundo argumento es una función que realiza la consulta. 
        En este caso, llama a una función LeerUsuarios que toma un parámetro session.usuario.usuarioId, 
        presumiblemente para recuperar usuarios relacionados con una empresa específica.
        El tercer argumento es un objeto de opciones que puede tener propiedades como onSuccess y onError */

  /*este código define una consulta llamada queryUsuarios 
        que llama a la función LeerUsuarios para obtener la lista de usuarios. 
        Si la consulta tiene éxito, los resultados se establecen usando setUsuarios. 
        Si ocurre un error durante la consulta, se maneja mostrando un mensaje de error y estableciendo un indicador de error.
        */

  const queryUsuarios = useQuery(
    "usuarios",
    () => {
      return LeerUsuarios();
    },
    {
      onSuccess: (data) => {
        setUsuarios(data.data);
      },
      onError: (error) => {
        console.error(error);
        setMensajeError(MensajeError(error));
        setHayError(true);
      },
    }
  );
  /* La función useMutation toma dos argumentos:
    Una función que realiza la mutación. En este caso, la función recibe usuarioId y
    luego llama a otra función llamada eliminarUsuario con esos parámetros.

    Un objeto de opciones que puede tener diferentes propiedades, como onError, 
    que se ejecuta cuando ocurre un error durante la mutación. En este caso,
     
     )
    */
  const eliminaUsuario = useMutation(
    ({ usuarioId }) => {
      return eliminarUsuario(usuarioId);
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

  // esta función newUsuario se encarga de redirigir al usuario a la página donde puede crear un nuevo usuario en la aplicación.
  const newUsuario = () => {
    navigate(`/usuario/0`);
  };

  const editUsuario = (id) => {
    return () => {
      navigate(`/usuario/${id}`);
    };
  };

  const deleteUsuario = (row) => {
    return () => {
      setUsuario(row);
      setMensajeConfirmacion(
        `¿Realmente desea eliminar el usuario ${row.nombre}?`
      );
      setHayConfirmacion(true);
    };
  };

  const deleteConfirmado = async () => {
    await eliminaUsuario.mutateAsync({ usuarioId: usuario.usuarioId });
    queryUsuarios.refetch();
    setHayConfirmacion(false);
    setMensaje(
      `El usuario ${usuario.nombre} ha sido eliminado de la base de datos`
    );
    setHayMensaje(true);
  };

  const columns = [
    { field: "usuarioId", headerName: "ID", width: 50 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "login", headerName: "Login", flex: 0.4 },
    { field: "email", headerName: "email", flex: 0.3, hide: true  },
    { field: "usuarioGrupoId", headerName: "Grupo ID", flex: 0.3 },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 80,
      getActions: ({ row }) => {
        return [
          <IconButton onClick={deleteUsuario(row)}>
            <DeleteIcon />
          </IconButton>,
          <IconButton onClick={editUsuario(row.usuarioId)}>
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
                  Usuarios
                </Typography>
                <span className="toolbarButtons">
                  <IconButton
                    size="large"
                    aria-label="Nuevo usuario"
                    color="inherit"
                    onClick={newUsuario}
                  >
                    <Tooltip title="Nuevo usuario">
                      <AddIcon />
                    </Tooltip>
                  </IconButton>
                </span>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12} style={{ height: "80vh", width: "100%" }}>
            <DataGrid
              rows={usuarios}
              columns={columns}
              getRowId={(row) => row.usuarioId}
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
