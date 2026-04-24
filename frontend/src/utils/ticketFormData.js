export const buildTicketFormData = (values, options = {}) => {
  const formData = new FormData();
  const fields = ["title", "description", "category", "priority", "status"];

  fields.forEach((field) => {
    if (values[field] !== undefined) {
      formData.append(field, values[field]);
    }
  });

  if (options.attachmentFile) {
    formData.append("attachment", options.attachmentFile);
  }

  if (options.removeAttachment) {
    formData.append("removeAttachment", "true");
  }

  return formData;
};
