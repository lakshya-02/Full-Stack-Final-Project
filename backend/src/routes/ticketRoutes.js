import express from "express";

import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTickets).post(createTicket);
router.route("/:id").get(getTicketById).put(updateTicket).delete(deleteTicket);

export default router;
