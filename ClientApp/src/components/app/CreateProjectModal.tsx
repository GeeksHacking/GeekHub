import * as React from "react";
import { ChangeEvent, ReactElement, useState } from "react";
import {
    Button,
    FormControl,
    FormLabel, Input,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useToast,
    VStack
} from "@chakra-ui/react";
import useProjects from "../../api/swr/projects/useProjects";
import { create } from "../../api/http/projects";

export interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateProjectModal(props: CreateProjectModalProps): ReactElement {
    const { isOpen, onClose } = props;
    
    const { mutate } = useProjects();
    const errorToast = useToast();
    
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    
    const onProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => setProjectName(event.target.value);
    const onProjectDescriptionChange= (event: ChangeEvent<HTMLInputElement>) => setProjectDescription(event.target.value);
    const onGithubUrlChange = (event: ChangeEvent<HTMLInputElement>) => setGithubUrl(event.target.value);
    
    const createProject = async () => {
        try {
            await mutate(async (projects) => {
                const project = await create({
                    Name: projectName,
                    Description: projectDescription,
                    Repository: githubUrl
                });
                return [...(projects ?? []), project];
            });
            onClose();
        } catch (e) {
            const body = await e.response.json();
            errorToast({
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
                <ModalHeader>Start your project!</ModalHeader>
                <ModalBody>
                    <VStack spacing={"3"}>
                        <FormControl>
                            <FormLabel>Project name</FormLabel>
                            <Input
                                placeholder="Text here"
                                value={projectName}
                                onChange={onProjectNameChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Project description</FormLabel>
                            <Input
                                placeholder="Text here"
                                value={projectDescription}
                                onChange={onProjectDescriptionChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Project Github Url</FormLabel>
                            <Input
                                placeholder="Link here"
                                value={githubUrl}
                                onChange={onGithubUrlChange}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={createProject}>Create</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}