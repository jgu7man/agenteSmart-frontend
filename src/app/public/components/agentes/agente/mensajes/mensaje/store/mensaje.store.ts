import { createStore, applyMiddleware } from 'redux'
import devToolsEnhancer  from 'remote-redux-devtools'
import { mensajeReducer } from './mensaje.reducer';


const mensajeStore = createStore(
    mensajeReducer,
    devToolsEnhancer( {
        realtime: true,
        name: 'mensaje',
        hostname: 'localhost',
        port: 4200 
    })
)

export default mensajeStore