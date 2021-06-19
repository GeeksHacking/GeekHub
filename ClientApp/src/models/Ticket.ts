export default interface Ticket {
    id: string;
    name: string;
    description: string;
    ticketType: string;
    ticketStatus: string;
    reporterId?: string;
    assigneeId?: string;
    parentTicketId?: string;
};