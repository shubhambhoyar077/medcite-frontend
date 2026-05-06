import { APIService } from '../services/APIService';
import { currentAuthenticationToken } from './APITokenConfig';



export const API = new APIService({ accessTokenPreferenceKey: currentAuthenticationToken() })