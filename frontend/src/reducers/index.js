import { combineReducers } from 'redux'
import spacecraft from './spacecraftReducer';
import astronaut from './astronautReducer';

export default combineReducers({
    spacecraft, astronaut
})

