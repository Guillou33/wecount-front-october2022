import { Status } from "./Status";

export interface UserProgression {
    nb: number,
    nbByStatus: {
        [Status.ARCHIVED]: number,
        [Status.IN_PROGRESS]: number,
        [Status.TO_VALIDATE]: number,
        [Status.TERMINATED]: number,
    }
}

export interface UserEmission{
    id: number;
    name: string;
    tCo2: number;
    asOwner: UserProgression;
    asWriter: UserProgression;
}

export const emptyUserData = {
    id: 0,
    name: "",
    tCo2: 0,
    asOwner: {
        nb: 0,
        nbByStatus: {
            [Status.ARCHIVED]: 0,
            [Status.IN_PROGRESS]: 0,
            [Status.TO_VALIDATE]: 0,
            [Status.TERMINATED]: 0,
        }
    },
    asWriter: {
        nb: 0,
        nbByStatus: {
            [Status.ARCHIVED]: 0,
            [Status.IN_PROGRESS]: 0,
            [Status.TO_VALIDATE]: 0,
            [Status.TERMINATED]: 0,
        }
    },
}