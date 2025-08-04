import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Método no permitido');
  }

  const { data, seccion } = req.body;
  if (!Array.isArray(data) || !seccion) {
    return res.status(400).json({ error: 'Datos o sección inválida' });
  }

  try {
    const reportsDir = path.join(process.cwd(), 'public', 'reportes', seccion);

    // Crear carpeta si no existe
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Limitar a 5 archivos
    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.xlsx'));
    if (files.length >= 5) {
      const oldest = files
        .map(name => ({
          name,
          time: fs.statSync(path.join(reportsDir, name)).birthtimeMs,
        }))
        .sort((a, b) => a.time - b.time)[0]; // el más antiguo

      fs.unlinkSync(path.join(reportsDir, oldest.name));
    }

    // Crear y guardar el nuevo archivo
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, seccion);

    const filename = `reporte_${seccion}_${Date.now()}.xlsx`;
    const filepath = path.join(reportsDir, filename);

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await writeFile(filepath, buffer);

    res.status(200).json({ message: 'Reporte generado', filename });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error interno al generar el reporte' });
  }
}
