import { type Request } from "express";

export default function validateTicket(req: Request) {
  const { subject, author } = req.body;

  const errors = [];

  if (!subject || typeof subject !== "string" || subject.length < 3) {
    errors.push({
      field: "subject",
      message: "Subject must be at least 3 chars",
    });
  }

  if (!author || typeof author !== "string") {
    errors.push({ field: "author", message: "Author is required" });
  }
  return errors;
}
