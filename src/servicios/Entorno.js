const Entorno = {
    getEnv: () => {
        let API_URL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : window.API_URL;
        API_URL = API_URL || ''
        return {
            API_URL
        }
    }
}
export default Entorno