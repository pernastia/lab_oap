export interface Ticket {
    id: number;
    subject: string;
    priority: string;
    message: string;
    authorId: number;
    statusId: number;
    authorName?: string;
    statusName?: string;
}