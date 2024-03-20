import axios from "axios";
import Entorno from "./Entorno";


export const LeerGrupos = () => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios_grupos`;

  return axios.get(url);
};
export const CrearGrupo = (usuarios_grupos) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios_grupos`;
  return axios.post(url, usuarios_grupos);
};

export const ActualizarGrupo = (usuarios_gruposId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios_grupos`;
  return axios.put(url, usuarios_gruposId);
};

export const LeerGrupo = (usuarios_gruposId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios_grupos/${usuarios_gruposId}`;
  return axios.get(url);
};

export const eliminarGrupo = (usuarios_gruposId) => {
  const ent = Entorno.getEnv();
  const url_base = ent.API_URL;
  const url = `${url_base}/usuarios_grupos/${usuarios_gruposId}`;
  return axios.delete(url);
};