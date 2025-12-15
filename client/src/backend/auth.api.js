import api from './api';

export const signUp = async (email, password) => {
    const response = await api.post('/signup', {
        email,
        password
    })

    return response.data
}

export const logIn = async (email, password) => {
  const response = await api.post('/login', {
    email,
    password
  })

  return response.data
}