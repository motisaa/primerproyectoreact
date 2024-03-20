import axios from "axios";
import Entorno from "./Entorno";

export const LoginBasicoUsuario = (login, password) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/login`;
  const data = {
    login,
    password,
  };
  return axios.post(url, data);
};

export const LeerUsuarios = () => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios`;

  return axios.get(url);
};
export const CrearUsuario = (usuario) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios`;
  return axios.post(url, usuario);
};

export const ActualizarUsuario = (usuarioId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios`;
  return axios.put(url, usuarioId);
};

export const LeerUsuario = (usuarioId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios/${usuarioId}`;
  return axios.get(url);
};

export const eliminarUsuario = (usuarioId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios/${usuarioId}`;
  return axios.delete(url);
};

//  export const ConsultarUsuarioPorAccUrl = (acu) => {
//    const ent = Entorno.getEnv();
//    const url_base = ent.API_URL;
//   const url = `${url_base}/usuarios/buscar-accurl/`;
//   const data = {
//      accUrl: acu,
//   };
//    return axios.post(url, data);
//  };
