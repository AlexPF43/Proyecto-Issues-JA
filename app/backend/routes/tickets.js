// routes/tickets.js
import express from "express";
import { getAllTickets } from "../services/ticketService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = {
      title: req.query.title || "",
      status: req.query.status ? req.query.status.split(",") : [],
      source: req.query.source ? req.query.source.split(",") : [],
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      sortBy: req.query.sortBy || "external_created_at",
      sortOrder: req.query.sortOrder || "DESC"
    };

    const tickets = await getAllTickets(filters);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
});

export default router;