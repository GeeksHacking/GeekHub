import * as React from "react";
import { ChangeEvent, ReactElement, useMemo, useState } from "react";
import {
    Button, Flex,
    FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select, Spinner, Textarea,
    useToast,
    VStack
} from "@chakra-ui/react";
import { compare } from "fast-json-patch";
import useTickets from "../../../api/swr/tickets/useTickets";
import ticketsApi from "../../../api/http/tickets";
import useTicketTypes from "../../../api/swr/tickets/useTicketTypes";
import useTicketStatuses from "../../../api/swr/tickets/useTicketStatuses";
import useProjectUsers from "../../../api/swr/projects/useProjectUsers";

export interface CreateTicketModalProps {
    projectId: string;
    ticketId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdateTicketModal(props: CreateTicketModalProps): Nullable<ReactElement> {
    const { projectId, ticketId, isOpen, onClose } = props;

    const { data: tickets, error: ticketsError, mutate } = useTickets(projectId);
    const { data: ticketTypes, error: ticketTypesError } = useTicketTypes(projectId);
    const { data: ticketStatuses, error: ticketStatusesError } = useTicketStatuses(projectId);
    const { data: projectUsers, error: projectUsersError } = useProjectUsers(projectId);

    const { update } = ticketsApi(projectId);
    const toast = useToast();

    const ticket = useMemo(() => {
        const placeholder = {
            name: "",
            description: "",
            ticketType: "",
            ticketStatus: "",
            reporterId: "",
            assigneeId: "",
            parentTicketId: ""
        };
        if (!tickets) {
            return placeholder;
        }
        return tickets.find(t => t.id === ticketId) ?? placeholder;
    }, [ticketId, tickets]);

    const [name, setName] = useState(ticket.name);
    const [description, setDescription] = useState(ticket.description);
    const [ticketType, setTicketType] = useState(ticket.ticketType);
    const [ticketStatus, setTicketStatus] = useState(ticket.ticketStatus);
    const [reporterId, setReporterId] = useState(ticket.reporterId);
    const [assigneeId, setAssigneeId] = useState(ticket.assigneeId);
    const [parentTicketId, setParentTicketId] = useState(ticket.parentTicketId);

    if (ticketsError || ticketTypesError || ticketStatusesError || projectUsersError) {
        toast({
            status: "error",
            isClosable: true,
            title: "Error",
            description: "An error occurred while fetching project ticket types/status"
        });
        return null;
    }

    if (!tickets || !ticketTypes || !ticketStatuses || !projectUsers) {
        return <Spinner/>;
    }

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value);
    const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value);
    const onTicketTypeChange = (event: ChangeEvent<HTMLSelectElement>) => setTicketType(event.target.value);
    const onTicketStatusChange = (event: ChangeEvent<HTMLSelectElement>) => setTicketStatus(event.target.value);
    const onReporterIdChange = (event: ChangeEvent<HTMLSelectElement>) => setReporterId(event.target.value);
    const onAssigneeIdChange = (event: ChangeEvent<HTMLSelectElement>) => setAssigneeId(event.target.value);
    const onParentTicketIdChange = (event: ChangeEvent<HTMLSelectElement>) => setParentTicketId(event.target.value);

    const createProject = async () => {
        try {
            await mutate(async (tickets) => {
                const updatedTicket = await update(ticketId, compare(ticket, {
                    id: ticketId,
                    name,
                    description,
                    ticketType,
                    ticketStatus,
                    reporterId,
                    assigneeId,
                    parentTicketId
                }));
                const filteredTickets = (tickets ?? []).filter(t => t.id !== updatedTicket.id);
                return [...filteredTickets, updatedTicket];
            });
            onClose();
        } catch (e) {
            const body = await e.response.json();
            toast({
                status: "error",
                isClosable: true,
                title: body.title,
                description: Object.keys(body.errors).reduce((a, k) => `${a}\n${k}: ${body.errors[k]}`, "")
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Update ticket</ModalHeader>
                <ModalBody>
                    <Flex>
                        <VStack spacing={"3"} mr={3} style={{ flex: 1 }}>
                            <FormControl isRequired>
                                <FormLabel>Ticket name</FormLabel>
                                <Input
                                    placeholder="Text here"
                                    value={name}
                                    onChange={onNameChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder="Text here"
                                    value={description}
                                    onChange={onDescriptionChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Parent ticket</FormLabel>
                                <Select placeholder="Nest this ticket" onChange={onParentTicketIdChange}>
                                    {tickets.map((ticket, idx) => (
                                        <option key={idx} value={ticket.id}>{ticket.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </VStack>
                        <VStack spacing={"3"} ml={1} style={{ flex: 1 }}>
                            <FormControl isRequired>
                                <FormLabel>Ticket type</FormLabel>
                                <Select placeholder="Select type" onChange={onTicketTypeChange}>
                                    {ticketTypes.map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Ticket status</FormLabel>
                                <Select placeholder="Select status" onChange={onTicketStatusChange}>
                                    {ticketStatuses.map((status, idx) => (
                                        <option key={idx} value={status}>{status}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Assigned to</FormLabel>
                                <Select placeholder="Assign this ticket" onChange={onAssigneeIdChange}>
                                    {projectUsers.map((user, idx) => (
                                        <option key={idx} value={user.id}>{user.displayName}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Reported by</FormLabel>
                                <Select placeholder="Select a reporter" onChange={onReporterIdChange}>
                                    {projectUsers.map((user, idx) => (
                                        <option key={idx} value={user.id}>{user.displayName}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </VStack>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={createProject} isDisabled={!name || !ticketType || !ticketStatus}>Update</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}