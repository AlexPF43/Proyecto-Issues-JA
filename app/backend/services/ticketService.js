// services/ticketService.js
import { getMantisTickets } from "../adapters/mantisAdapter.js";
import { getRedmineTickets } from "../adapters/redmineAdapter.js";
import Ticket from "../models/Ticket.js";
import CustomStateMapping from "../models/CustomStateMapping.js";

/**
 * Normalizar fecha al formato MySQL DATETIME
 */
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function normalizeStatus(source, rawStatus, mappings) {
  if (!rawStatus) return null;
  const normalized = String(rawStatus).trim();
  const mapping = mappings.find(m =>
    m.source === source && m.custom_state.trim().toLowerCase() === normalized.toLowerCase()
  );
  return mapping ? mapping.parent_state : normalized;
}

export async function getAllCustomStates() {
  return await CustomStateMapping.findAll();
}

export async function addCustomStateMapping(mapping) {
  const existing = await CustomStateMapping.findBySourceAndCustomState(mapping.source, mapping.custom_state);
  if (existing) {
    throw new Error(`El mapeo para el estado personalizado '${mapping.custom_state}' ya existe para ${mapping.source}`);
  }
  return await CustomStateMapping.create(mapping);
}

export async function deleteCustomStateMapping(id) {
  return await CustomStateMapping.deleteById(id);
}

/**
 * Sincronizar tickets desde Mantis y Redmine a la base de datos
 */
export async function syncTicketsToDB() {
  try {
    console.log("Sincronizando tickets...");

    const mappings = await CustomStateMapping.findAll();

    // Obtener tickets de ambas fuentes
    const mantis = await getMantisTickets();
    const redmine = await getRedmineTickets();

    let syncCount = 0;

    // Guardar tickets de Mantis
    for (const ticket of mantis) {
      const mapped_status = normalizeStatus('mantis', ticket.status, mappings);
      await Ticket.upsert({
        external_id: ticket.id,
        source: "mantis",
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        mapped_status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        external_created_at: normalizeDate(ticket.created_at),
        external_updated_at: normalizeDate(ticket.updated_at),
        data: ticket,
      });
      syncCount++;
    }

    const mantisIds = mantis
      .map(ticket => ticket.id)
      .filter(id => id !== undefined && id !== null);

    // Guardar tickets de Mantis
    for (const ticket of mantis) {
      const mapped_status = normalizeStatus('mantis', ticket.status, mappings);
      await Ticket.upsert({
        external_id: ticket.id,
        source: "mantis",
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        mapped_status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        external_created_at: normalizeDate(ticket.created_at),
        external_updated_at: normalizeDate(ticket.updated_at),
        data: ticket,
      });
      syncCount++;
    }

    await Ticket.deleteMissingBySource('mantis', mantisIds);

    const redmineIds = redmine
      .map(ticket => ticket.id)
      .filter(id => id !== undefined && id !== null);

    // Guardar tickets de Redmine
    for (const ticket of redmine) {
      const mapped_status = normalizeStatus('redmine', ticket.status, mappings);
      await Ticket.upsert({
        external_id: ticket.id,
        source: "redmine",
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        mapped_status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        external_created_at: normalizeDate(ticket.created_at),
        external_updated_at: normalizeDate(ticket.updated_at),
        data: ticket,
      });
      syncCount++;
    }

    await Ticket.deleteMissingBySource('redmine', redmineIds);

    console.log(`✓ Sincronización completada: ${syncCount} tickets procesados`);
    return { success: true, count: syncCount };
  } catch (error) {
    console.error("✗ Error en sincronización:", error.message);
    throw error;
  }
}

/**
 * Obtener todos los tickets desde la base de datos
 */
export async function getAllTickets(filters = {}) {
  try {
    const dbFilters = {
      title: filters.title,
      source: filters.source && filters.source.length > 0 ? filters.source : null,
      status: filters.status && filters.status.length > 0 ? filters.status : null,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };

    Object.keys(dbFilters).forEach(
      (key) => dbFilters[key] === null || dbFilters[key] === undefined ? delete dbFilters[key] : {}
    );

    return await Ticket.findAll(dbFilters);
  } catch (error) {
    console.error("Error obteniendo tickets:", error);
    throw error;
  }
}

/**
 * Obtener un ticket específico
 */
export async function getTicketById(externalId) {
  try {
    return await Ticket.findByExternalId(externalId);
  } catch (error) {
    console.error("Error obteniendo ticket:", error);
    throw error;
  }
}

/**
 * Obtener estadísticas de tickets
 */
export async function getTicketStats() {
  try {
    const total = await Ticket.count();
    const bySource = {
      mantis: await Ticket.count({ source: "mantis" }),
      redmine: await Ticket.count({ source: "redmine" }),
    };

    return {
      total,
      bySource,
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw error;
  }
}
