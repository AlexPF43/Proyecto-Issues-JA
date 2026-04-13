import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ticketsRoutes from "./routes/tickets.js";
import { syncTicketsToDB, getTicketStats } from "./services/ticketService.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Rutas
app.use("/tickets", ticketsRoutes);

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor activo" });
});

// Endpoint de estadísticas
app.get("/stats", async (req, res) => {
  try {
    const stats = await getTicketStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para sincronizar manualmente
app.post("/sync", async (req, res) => {
  try {
    const result = await syncTicketsToDB();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = Number(process.env.PORT) || 3000;
const SYNC_INTERVAL = Number(process.env.SYNC_INTERVAL) || 50000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log("HOST:" + process.env.DB_HOST);
  console.log("USER:" + process.env.DB_USER);
  console.log("PORT:" + process.env.DB_PORT);});

/**
 * Sincronización periódica de tickets desde Mantis y Redmine
 */
async function startPeriodicSync() {
  console.log(`Sincronización automática cada ${SYNC_INTERVAL / 1000} segundos`);
  
  setInterval(async () => {
    try {
      await syncTicketsToDB();
    } catch (error) {
      console.error("Error en sincronización periódica:", error.message);
    }
  }, SYNC_INTERVAL);

  // Primera sincronización inmediata
  try {
    await syncTicketsToDB();
  } catch (error) {
    console.error("✗ Error en primera sincronización:", error.message);
  }
}

// Iniciar sincronización periódica
startPeriodicSync();