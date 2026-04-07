import mongoose from "mongoose";

import { Ticket } from "../models/Ticket.js";

const buildTicketQuery = (req) => {
  const query = {};
  const { status, priority, category, search } = req.query;

  if (req.user.role !== "admin") {
    query.createdBy = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
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

    if (!title || !description || !category || !priority) {
      return res.status(400).json({ message: "All ticket fields are required" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
    });

    const populatedTicket = await ticket.populate("createdBy", "name email role");

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: populatedTicket,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create ticket" });
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
        ticket[field] = req.body[field];
      }
    });

    await ticket.save();
    await ticket.populate("createdBy", "name email role");

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update ticket" });
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
