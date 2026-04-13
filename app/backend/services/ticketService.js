// services/ticketService.js
import { getMantisTickets } from "../adapters/mantisAdapter.js";
import { getRedmineTickets } from "../adapters/redmineAdapter.js";
import Ticket from "../models/Ticket.js";

/**
 * Normalizar fecha al formato MySQL DATETIME
 */
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Sincronizar tickets desde Mantis y Redmine a PostgreSQL
 */
export async function syncTicketsToDB() {
  try {
    console.log("Sincronizando tickets...");

    // Obtener tickets de ambas fuentes
    const mantis = await getMantisTickets();
    const redmine = await getRedmineTickets();

    let syncCount = 0;

    // Guardar tickets de Mantis
    for (const ticket of mantis) {
      await Ticket.upsert({
        external_id: ticket.id,
        source: "mantis",
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        external_created_at: normalizeDate(ticket.created_at),
        external_updated_at: normalizeDate(ticket.updated_at),
        data: ticket,
      });
      syncCount++;
    }

    // Guardar tickets de Redmine
    for (const ticket of redmine) {
      await Ticket.upsert({
        external_id: ticket.id,
        source: "redmine",
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        external_created_at: normalizeDate(ticket.created_at),
        external_updated_at: normalizeDate(ticket.updated_at),
        data: ticket,
      });
      syncCount++;
    }

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
    // Convertir filtros al formato esperado por la BD
    const dbFilters = {
      title: filters.title,
      source: filters.source && filters.source.length > 0 ? filters.source : null,
      status: filters.status && filters.status.length > 0 ? filters.status : null,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    };

    // Remover filtros vacíos
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
