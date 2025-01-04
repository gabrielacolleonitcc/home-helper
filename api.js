import axios from 'axios';
const urlApi = 'https://api-tcc-i5r1.onrender.com'

export const api = axios.create({
    baseURL: urlApi
});

export const createUsuario = async (data) => {
    return api.post('/usuario', data)
}

export const updateUsuario = async (data) => {
    return api.put('/usuario', data)
}

export const loginUsuario = async (data) => {
    return api.post('/usuario/login', data)
}

export const createProfissional = async (data) => {
    return api.post('/profissional', data)
}

export const updateProfissional = async (data) => {
    return api.put('/profissional', data)
}

export const loginProfissional = async (data) => {
    return api.post('/profissional/login', data)
}

export const listProfissionais = async () => {
    return api.get('/profissional')
}

export const updateProfissionalServicos = async (data) => {
    return api.put('/profissional/servicos', data)
}

export const listServicos = async (servico) => {
    return api.get(`/servicos/${servico}`)
}

export const createSolicitacao = async (data) => {
    return api.post('/solicitacao', data)
}

export const getSolicitacaoByUsuario = async (id) => {
    return api.get(`/solicitacao/usuario/${id}`)
}

export const getSolicitacaoByProfissional = async (id) => {
    return api.get(`/solicitacao/profissional/${id}`)
}

export const updateSolicitacaoByProfissional = async (id, data) => {
    return api.put(`/solicitacao/profissional/${id}`, data)
}

export const updateSolicitacaoByUsuario = async (id, data) => {
    return api.put(`/solicitacao/usuario/${id}`, data)
}

export const finishSolicitacao = async (id) => {
    return api.put(`/solicitacao/finish/${id}`)
}

export const cancelSolicitacao = async (id) => {
    return api.delete(`/solicitacao/${id}`)
}

export const avaliarSoliciacao = async (id, data) => {
    return api.put(`/solicitacao/usuario/avaliar/${id}`, data)
}