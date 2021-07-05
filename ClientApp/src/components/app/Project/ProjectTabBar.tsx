import * as React from "react";
import { ReactElement, ReactNode } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from "@chakra-ui/react";

export interface ProjectTabBarProps {
    overview: ReactNode;
    lists: ReactNode;
    kanban: ReactNode;
    calendar: ReactNode;
}

export default function ProjectTabBar(props: ProjectTabBarProps): ReactElement {
    const { overview, lists, kanban, calendar } = props;

    return (
        <Tabs colorScheme={"teal"} style={{ flex: 1 }}>
            <TabList>
                <Tab>Overview</Tab>
                <Tab>Lists</Tab>
                <Tab>Kanban</Tab>
                <Tab>Calendar</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    {overview}
                </TabPanel>
                <TabPanel>
                    {lists}
                </TabPanel>
                <TabPanel>
                    {kanban}
                </TabPanel>
                <TabPanel>
                    {calendar}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}