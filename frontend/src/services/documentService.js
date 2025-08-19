import axios from 'axios';
import { getFormattedNameDNI } from '../utils';

const API_BASE_URL = import.meta.env.VITE_CI_API_BASE_URL

const getDniData = async (dni) => {
    const response = await axios.get(`${API_BASE_URL}/dni/${dni}`)
    if (response.data.success) {
        const data = response.data.data;
        const nombre = getFormattedNameDNI(data.apellido_paterno, data.apellido_materno, data.nombres);
        return nombre
    }
    return null
}
const getRucData = async (ruc) => {
    const response = await axios.get(`${API_BASE_URL}/ruc/${ruc}`)
    if (response.data.success) {
        const data = response.data.data;
        return data.nombre_o_razon_social;
    }
    return null
}

const getServiceData = async (docType, document) => {
    switch (docType) {
        case 'dni':
            return await getDniData(document);
        case 'ruc':
            return await getRucData(document);
        default:
            throw new Error('Unsupported document type');
    }
}

export {
    getServiceData
}