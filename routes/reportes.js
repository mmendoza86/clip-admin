const express = require('express');
const path = require('path');
const fs = require('fs');
const { writeFile, readdir } = require('fs').promises;
const XLSX = require('xlsx');

const router = express.Router();
const REPORTES_DIR = path.join(__dirname, '../public', 'reportes');

// Servir reportes estáticos
router.use('/reportes', express.static(REPORTES_DIR));

// API: Generar reporte
router.post('/api/reportes/generar', async (req, res) => {
  const { data, seccion } = req.body;
  if (!Array.isArray(data) || !seccion) {
    return res.status(400).json({ error: 'Datos o sección inválida' });
  }

  try {
    const reportsDir = path.join(REPORTES_DIR, seccion);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.xlsx'));
    if (files.length >= 5) {
      const oldest = files
        .map(name => ({
          name,
          time: fs.statSync(path.join(reportsDir, name)).birthtimeMs,
        }))
        .sort((a, b) => a.time - b.time)[0];
      fs.unlinkSync(path.join(reportsDir, oldest.name));
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, seccion);

    const filename = `reporte_${seccion}_${Date.now()}.xlsx`;
    const filepath = path.join(reportsDir, filename);

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await writeFile(filepath, buffer);

    res.status(200).json({ message: 'Reporte generado', filename });
  } catch (error) {
    console.error('❌ Error al generar reporte:', error);
    res.status(500).json({ error: 'Error interno al generar el reporte' });
  }
});

// API: Historial de reportes
router.get('/api/reportes/historial', async (req, res) => {
  try {
    const seccion = req.query.seccion;
    const reportsDir = path.join(REPORTES_DIR, seccion);

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
    console.error('❌ Error al leer reportes:', error);
    res.status(500).json({ error: 'No se pudieron leer los reportes' });
  }
});

module.exports = router;
