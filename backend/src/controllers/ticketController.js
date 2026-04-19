import mongoose from "mongoose";

import { Ticket } from "../models/Ticket.js";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sendValidationError = (res, error, fallbackMessage) => {
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ message: firstError?.message || fallbackMessage });
  }

  return res.status(500).json({ message: fallbackMessage });
};

const buildTicketQuery = (req) => {
  const query = {};
  const { status, priority, category, search } = req.query;
  const normalizedCategory = category?.trim();
  const normalizedSearch = search?.trim();

  if (req.user.role !== "admin") {
    query.createdBy = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (normalizedCategory) {
    query.category = { $regex: escapeRegex(normalizedCategory), $options: "i" };
  }

  if (normalizedSearch) {
    const safeSearch = escapeRegex(normalizedSearch);
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  return query;
};

const getOwnerId = (ticket) =>
  typeof ticket.createdBy === "object" && ticket.createdBy !== null
    ? ticket.createdBy._id?.toString()
    : ticket.createdBy?.toString();

const canAccessTicket = (ticket, user) =>
  user.role === "admin" || getOwnerId(ticket) === user._id.toString();

export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const normalizedTitle = title?.trim();
    const normalizedDescription = description?.trim();
    const normalizedCategory = category?.trim();

    if (!normalizedTitle || !normalizedDescription || !normalizedCategory || !priority) {
      return res.status(400).json({ message: "All ticket fields are required" });
    }

    const ticket = await Ticket.create({
      title: normalizedTitle,
      description: normalizedDescription,
      category: normalizedCategory,
      priority,
      createdBy: req.user._id,
    });

    const populatedTicket = await ticket.populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: populatedTicket,
    });
  } catch (error) {
    return sendValidationError(res, error, "Failed to create ticket");
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find(buildTicketQuery(req))
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id).populate("createdBy", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(ticket, req.user)) {
      return res.status(403).json({ message: "Not allowed to view this ticket" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(ticket, req.user)) {
      return res.status(403).json({ message: "Not allowed to update this ticket" });
    }

    const allowedFields =
      req.user.role === "admin"
        ? ["title", "description", "category", "priority", "status"]
        : ["title", "description", "category", "priority"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const value =
          typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
        ticket[field] = value;
      }
    });

    await ticket.save();
    await ticket.populate("createdBy", "name email role");

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    return sendValidationError(res, error, "Failed to update ticket");
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (!canAccessTicket(ticket, req.user)) {
      return res.status(403).json({ message: "Not allowed to delete this ticket" });
    }

    await ticket.deleteOne();

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete ticket" });
  }
};
