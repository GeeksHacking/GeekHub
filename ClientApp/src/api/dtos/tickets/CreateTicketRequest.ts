export default interface CreateTicketRequest {
    name: string;
    description?: string;
    ticketType?: string;
    ticketStatus?: string;
    reporterId?: string;
    assigneeId?: string;
    parentTicketId?: string;
}