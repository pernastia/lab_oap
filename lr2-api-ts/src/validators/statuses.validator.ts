export function validateCreateStatus(dto: any) {
  const errors = [];

  if (typeof dto.name !== "string" || dto.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters",
    });
  }

  return errors;
}
