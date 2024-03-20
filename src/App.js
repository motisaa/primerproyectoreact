import { QueryClient, QueryClientProvider } from "react-query";

import { Route, Routes } from "react-router-dom";
import { GeneralContext } from "./contextos/GeneralContext";
import "./App.css";
import { InicioPagina } from "./paginas/InicioPagina/InicioPagina";
import { LoginPagina } from "./paginas/LoginPagina/LoginPagina";
import { UsuariosPagina } from "./paginas/UsuariosPaginas/UsuariosPagina";
import { UsuarioPagina } from "./paginas/UsuariosPaginas/UsuarioPagina";
import { GrupoPagina } from "./paginas/GruposPaginas/GrupoPagina";
import { GruposPagina } from "./paginas/GruposPaginas/GruposPagina";


const queryClient = new QueryClient();

function App() {
  return (
    <>
      <GeneralContext>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<LoginPagina />} />
            <Route path="/inicio" element={<InicioPagina />} />
            <Route path="/usuarios" element={<UsuariosPagina />} />
            <Route path="/usuario" element={<UsuarioPagina />} />
            <Route path="/usuario/:usuarioId" element={<UsuarioPagina/>}/>
            <Route path="/grupos" element={<GruposPagina />} />
            <Route path="/grupo" element={<GrupoPagina />} />
            <Route path="/grupo/:usuarioGrupoId" element={<GrupoPagina/>}/>
          </Routes>
        </QueryClientProvider>
      </GeneralContext>
    </>
  );
}

export default App;
