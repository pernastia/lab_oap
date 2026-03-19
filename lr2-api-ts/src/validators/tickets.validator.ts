export function validateCreateTicket(dto: any) {
  const errors = [];

  if (typeof dto.subject !== "string" || dto.subject.trim().length < 3) {
    errors.push({
      field: "subject",
      message: "Subject must be at least 3 characters",
    });
  }

  if (!dto.status) {
    errors.push({
      field: "status",
      message: "Status is required",
    });
  }

  if (!dto.priority) {
    errors.push({
      field: "priority",
      message: "Priority is required",
    });
  }

  if (!dto.message) {
    errors.push({
      field: "message",
      message: "Message is required",
    });
  }
  return errors;
}
