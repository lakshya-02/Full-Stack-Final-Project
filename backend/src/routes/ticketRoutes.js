import express from "express";

import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadTicketAttachment } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getTickets).post(uploadTicketAttachment, createTicket);
router.route("/:id").get(getTicketById).put(uploadTicketAttachment, updateTicket).delete(deleteTicket);

export default router;
