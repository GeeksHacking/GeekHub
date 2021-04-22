import { useContext, createContext } from "react";
import { types, Instance, onSnapshot, castToSnapshot } from "mobx-state-tree";

const Root = types.model({
});

let initialState = Root.create({
});

const data = localStorage.getItem("rootState");
if (data) {
    const json = JSON.parse(data);
    if (Root.is(json)) {
        initialState = Root.create(castToSnapshot(json));
    }
}

export const rootStore = initialState;

onSnapshot(rootStore, snapshot => {
    console.log("Snapshot: ", snapshot);
    localStorage.setItem("rootState", JSON.stringify(snapshot));
});

export type RootInstance = Instance<typeof Root>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;

export function useMst(): RootInstance {
    const store = useContext(RootStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}
  