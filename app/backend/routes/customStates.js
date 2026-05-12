import express from 'express';
import { getAllCustomStates, addCustomStateMapping, deleteCustomStateMapping } from '../services/ticketService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mappings = await getAllCustomStates();
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo los estados personalizados' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { source, custom_state, parent_state } = req.body;

    if (!source || !custom_state || !parent_state) {
      return res.status(400).json({ error: 'Los campos source, custom_state y parent_state son obligatorios' });
    }

    const mapping = await addCustomStateMapping({ source, custom_state, parent_state });
    res.status(201).json(mapping);
  } catch (error) {
    if (error.message.includes('ya existe')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creando el estado personalizado' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCustomStateMapping(id);
    if (!deleted) {
      return res.status(404).json({ error: 'No se encontró el mapeo para eliminar' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando el estado personalizado' });
  }
});

export default router;
