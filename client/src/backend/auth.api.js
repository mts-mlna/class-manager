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

export const createClass = async (classData, token) => {
  const response = await api.post(
    '/classes/new',
    classData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data
};

export const getClasses = async (token) => {
  const response = await api.get('/classes', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const deleteClass = async (classId, token) => {
  const response = await api.delete(
    `/classes/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const updateClass = async (id, classData, token) => {
  const response = await api.put(
    `/classes/${id}`,
    classData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getClassById = async (id, token) => {
  const response = await api.get(
    `/classes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const createAlumno = async (classId, alumnoData, token) => {
  const response = await api.post(
    `/classes/${classId}/alumnos`,
    alumnoData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getAlumnosByClase = async (classId, token) => {
  const res = await api.get(
    `/classes/${classId}/alumnos`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

export const updateAlumno = async (alumnoId, alumnoData, token) => {
  const response = await api.put(
    `/alumnos/${alumnoId}`,
    alumnoData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const deleteAlumnos = async (alumnosIds, token) => {
  const response = await api.delete(
    `/alumnos`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        alumnosIds
      }
    }
  );

  return response.data;
};

export const createAsistencia = async (classId, data, token) => {
  const res = await api.post(
    `/classes/${classId}/asistencias`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
