export function validateCreateMessage(dto: any) {
  const errors = [];

  if (typeof dto.ticketId !== "number") {
    errors.push({
      field: "ticketId",
      message: "ticketId must be a number",
    });
  }

  if (typeof dto.text !== "string" || dto.text.trim().length < 2) {
    errors.push({
      field: "text",
      message: "Message must be at least 2 characters",
    });
  }

  return errors;
}
