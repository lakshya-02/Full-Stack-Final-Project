import nodemailer from "nodemailer";

const getBoolean = (value) => String(value).toLowerCase() === "true";
let transportStatusLogged = false;

let transporter;

const getEmailConfig = () => ({
  service: process.env.EMAIL_SERVICE?.trim(),
  host: process.env.EMAIL_HOST?.trim(),
  port: process.env.EMAIL_PORT?.trim(),
  user: process.env.EMAIL_USER?.trim(),
  pass: process.env.EMAIL_PASS?.trim(),
  from: process.env.EMAIL_FROM?.trim(),
});

export const getEmailStatus = () => {
  const config = getEmailConfig();

  if (config.service) {
    if (!config.user || !config.pass) {
      return {
        enabled: false,
        reason: "EMAIL_SERVICE is set, but EMAIL_USER or EMAIL_PASS is missing.",
      };
    }

    return {
      enabled: true,
      reason: `Using ${config.service} via Nodemailer service transport.`,
    };
  }

  if (!config.host || !config.port || !config.user || !config.pass) {
    return {
      enabled: false,
      reason:
        "Missing EMAIL_HOST, EMAIL_PORT, EMAIL_USER, or EMAIL_PASS in backend/.env.",
    };
  }

  return {
    enabled: true,
    reason: `Using SMTP host ${config.host}:${config.port}.`,
  };
};

const getTransporter = () => {
  if (transporter !== undefined) {
    return transporter;
  }

  const status = getEmailStatus();

  if (!status.enabled) {
    transporter = null;
    return transporter;
  }

  const config = getEmailConfig();

  transporter = config.service
    ? nodemailer.createTransport({
        service: config.service,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      })
    : nodemailer.createTransport({
        host: config.host,
        port: Number(config.port),
        secure: getBoolean(process.env.EMAIL_SECURE),
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

  return transporter;
};

export const verifyEmailTransport = async () => {
  const status = getEmailStatus();

  if (!status.enabled) {
    console.warn(`Email notifications disabled: ${status.reason}`);
    return { ok: false, reason: status.reason };
  }

  try {
    await getTransporter().verify();
    console.log(`Email notifications enabled. ${status.reason}`);
    return { ok: true, reason: status.reason };
  } catch (error) {
    console.warn(`Email transport verification failed: ${error.message}`);
    return { ok: false, reason: error.message };
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  const activeTransporter = getTransporter();

  if (!activeTransporter || !to) {
    if (!transportStatusLogged) {
      const status = getEmailStatus();
      console.warn(`Email send skipped: ${status.reason}`);
      transportStatusLogged = true;
    }

    return { skipped: true, sent: false };
  }

  try {
    await activeTransporter.sendMail({
      from: getEmailConfig().from || getEmailConfig().user,
      to,
      subject,
      text,
      html,
    });
    return { skipped: false, sent: true };
  } catch (error) {
    console.warn(`Email notification failed: ${error.message}`);
    return { skipped: false, sent: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (user) =>
  sendEmail({
    to: user.email,
    subject: "Welcome to Corporate Helpdesk",
    text: `Hi ${user.name}, your helpdesk account is ready. You can now sign in and create support tickets.`,
    html: `<p>Hi ${user.name},</p><p>Your Corporate Helpdesk account is ready. You can now sign in and create support tickets.</p>`,
  });

export const sendNewTicketNotifications = async (ticket) => {
  await Promise.allSettled([
    sendEmail({
      to: ticket.createdBy?.email,
      subject: `Ticket created: ${ticket.title}`,
      text: `Hi ${ticket.createdBy?.name || "there"}, your ticket "${ticket.title}" has been created with status "${ticket.status}" and priority "${ticket.priority}".`,
      html: `<p>Hi ${ticket.createdBy?.name || "there"},</p><p>Your ticket <strong>${ticket.title}</strong> has been created with status <strong>${ticket.status}</strong> and priority <strong>${ticket.priority}</strong>.</p>`,
    }),
    sendEmail({
      to: process.env.SUPPORT_EMAIL,
      subject: `New helpdesk ticket: ${ticket.title}`,
      text: `A new ticket was created by ${ticket.createdBy?.name || "a user"} (${ticket.createdBy?.email || "unknown email"}). Category: ${ticket.category}. Priority: ${ticket.priority}.`,
      html: `<p>A new ticket was created by <strong>${ticket.createdBy?.name || "a user"}</strong> (${ticket.createdBy?.email || "unknown email"}).</p><p>Category: ${ticket.category}<br />Priority: ${ticket.priority}</p>`,
    }),
  ]);
};

export const sendTicketStatusUpdateEmail = async (ticket, previousStatus) =>
  sendEmail({
    to: ticket.createdBy?.email,
    subject: `Ticket status updated: ${ticket.title}`,
    text: `Hi ${ticket.createdBy?.name || "there"}, the status of your ticket "${ticket.title}" changed from "${previousStatus}" to "${ticket.status}".`,
    html: `<p>Hi ${ticket.createdBy?.name || "there"},</p><p>The status of your ticket <strong>${ticket.title}</strong> changed from <strong>${previousStatus}</strong> to <strong>${ticket.status}</strong>.</p>`,
  });
