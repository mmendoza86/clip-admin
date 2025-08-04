import { readdir } from 'fs/promises';
import path from 'path';
import fs from 'fs'; // 👈 importa el módulo 'fs' para mkdirSync

export default async function handler(req, res) {
  try {
    const seccion = req.method === 'GET' ? req.query.seccion : req.body.seccion;
    const reportsDir = path.join(process.cwd(), 'public', 'reportes', seccion);

    // 👇 Verifica y crea las carpetas si no existen
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const files = await readdir(reportsDir);
    const sorted = files
      .filter(f => f.endsWith('.xlsx'))
      .sort((a, b) => b.localeCompare(a))
      .slice(0, 5);

    res.status(200).json({ files: sorted });
  } catch (error) {
    console.error('Error al leer reportes:', error);
    res.status(500).json({ error: 'No se pudieron leer los reportes' });
  }
}
