import { SERVER } from "../config/global";
import dataImport from "./dataImport/dataImport.json";

export const getSpacecrafts = (filterString, page, pageSize, sortField, sortOrder) => {

    return {
        type: "GET_SPACECRAFTS",
        payload: async () => {
            const response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            const data = await response.json();
            return data;
        }
    };
};

export const addSpacecraft = (spacecraft, filterString, page, pageSize, sortField, sortOrder) => {

    return {

        type: "ADD_SPACECRAFT",
        payload: async () => {

            let response = await fetch(`${SERVER}/spacecrafts`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(spacecraft),
            });

            response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            const data = await response.json();
            return data;
        }
    };
};

export const saveSpacecraft = (id, spacecraft, filterString, page, pageSize, sortField, sortOrder) => {

    return {

        type: "SAVE_SPACECRAFT",
        payload: async () => {

            let response = await fetch(`${SERVER}/spacecrafts/${id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(spacecraft),
            });

            response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            const data = await response.json();
            return data;
        }
    };
};

export const deleteSpacecraft = (id, filterString, page, pageSize, sortField, sortOrder) => {

    return {

        type: "DELETE_SPACECRAFT",
        payload: async () => {
            let response = await fetch(`${SERVER}/spacecrafts/${id}`, {
                method: "delete",
            });

            response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            const data = await response.json();
            return data;
        }
    };
};

export const importSpacecrafts = (filterString, page, pageSize, sortField, sortOrder) => {

    return {

        type: "POST_IMPORT",
        payload: async () => {

            let response = await fetch(`${SERVER}/import`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataImport),
            });

            response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            const data = await response.json();
            return data;
        }
    };
};

export const exportSpacecrafts = (spacecrafts, filterString, page, pageSize, sortField, sortOrder) => {

    return {

        type: "GET_EXPORT",
        payload: async () => {

            const response = await fetch(`${SERVER}/export`);
            const data = await response.json();

            const blob = new Blob([JSON.stringify(data)], { type: "json" });
            const a = document.createElement("a");
            a.download = "spacecrafts.json";
            a.href = window.URL.createObjectURL(blob);
            a.click();

            response = await fetch(
                `${SERVER}/spacecrafts?${filterString}&sortField=${sortField || ""
                }&sortOrder=${sortOrder || ""}&page=${page || ""}&pageSize=${pageSize || ""}`
            );

            return data;
        }
    };
};

export const getAstronauts = (idSpacecraft) => {

    return {
        type: "GET_ASTRONAUTS",
        payload: async () => {

            const response = await fetch(`${SERVER}/spacecrafts/${idSpacecraft}/astronauts`);
            const data = await response.json();
            return data;
        }
    };
};

export const addAstronaut = (idSpacecraft, astronaut) => {

    return {
        type: "ADD_ASTRONAUT",
        payload: async () => {

            let response = await fetch(`${SERVER}/spacecrafts/${idSpacecraft}/astronauts`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(astronaut),
            });

            response = await fetch(`${SERVER}/spacecrafts/${idSpacecraft}/astronauts`);
            const data = await response.json();
            return data;
        }
    };
};

export const saveAstronaut = (idSpacecraft, astronaut, idAstronaut) => {

    return {

        type: "SAVE_ASTRONAUT",
        payload: async () => {

            let response = await fetch(
                `${SERVER}/spacecrafts/${idSpacecraft}/astronauts/${idAstronaut}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(astronaut),
            });

            response = await fetch(`${SERVER}/spacecrafts/${idSpacecraft}/astronauts`);
            const data = await response.json();
            return data;
        }
    };
};

export const deleteAstronaut = (idSpacecraft, idAstronaut) => {

    return {

        type: "DELETE_ASTRONAUT",
        payload: async () => {
            let response = await fetch(
                `${SERVER}/spacecrafts/${idSpacecraft}/astronauts/${idAstronaut}`, {
                method: "delete",
            });

            response = await fetch(`${SERVER}/spacecrafts/${idSpacecraft}/astronauts`);
            const data = await response.json();
            return data;
        }
    };
};
