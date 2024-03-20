import * as yup from "yup";

export const initialValues = () => {
  return {
    usuarioId: "",
    email: "",
    nombre: "",
    login: "",
    password: "",
  };
};
/* This function defines the validation rules for the form fields using Yup.
 It returns a Yup schema object. In this case, it defines 
 validation rules for the nombre, login, password, and email fields */
export const validationSchema = () => {
  return yup.object({
    nombre: yup.string().required("Requerido"),
    login: yup.string().required("Requerido"),
    password: yup.string().required("Requerido"),
    email: yup.string().required("Requerido"),
  });
};
