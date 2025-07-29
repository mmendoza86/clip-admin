import { NextApiRequest, NextApiResponse } from 'next';

let clientes = [
  {
    id: 1,
    nombre: 'Cliente Uno',
    numero: '001',
    correo: 'cliente1@example.com',
    password: 'pass1',
    apiKey: 'apikey1',
    claveSecreta: 'secret1',
  },
  {
    id: 2,
    nombre: 'Cliente Dos',
    numero: '002',
    correo: 'cliente2@example.com',
    password: 'pass2',
    apiKey: 'apikey2',
    claveSecreta: 'secret2',
  }
];

let lastId = 2;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(clientes);
  } else if (req.method === 'POST') {
    const nuevo = { id: ++lastId, ...req.body };
    clientes.push(nuevo);
    res.status(201).json(nuevo);
  } else if (req.method === 'PUT') {
    const id = Number(req.query.id);
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...req.body };
      return res.status(200).json(clientes[index]);
    }
    res.status(404).json({ error: 'No encontrado' });
  } else if (req.method === 'DELETE') {
    const id = Number(req.query.id);
    clientes = clientes.filter(c => c.id !== id);
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
