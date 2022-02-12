import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { SelectButton } from "primereact/selectbutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAstronauts, addAstronaut, saveAstronaut, deleteAstronaut } from "../actions";

const astronautSelector = (state) => state.astronaut.astronautList;

function AstronautList() {

    const styles = {
        h3: {
            fontFamily: "Tahoma",
            fontSize: "24px",
            color: "royalblue",
            padding: 0,
            marginLeft: "12px"
        }
    }

    const [isDialogShown, setIsDialogShown] = useState(false);
    const [numeAstronaut, setNumeAstronaut] = useState("");
    const [rol, setRol] = useState("");

    const [isNewRecord, setIsNewRecord] = useState(true);
    const [selectedAstronaut, setSelectedAstronaut] = useState(null);
    const navigate = useNavigate();

    const astronauts = useSelector(astronautSelector);

    const dispatch = useDispatch();
    const { idSpacecraft } = useParams();

    useEffect(() => {
        dispatch(getAstronauts(idSpacecraft));
    }, [idSpacecraft]);

    const handleAddClick = (evt) => {
        setIsDialogShown(true);
        setIsNewRecord(true);
        setNumeAstronaut("");
        setRol("");
    };

    const hideDialog = () => {
        setIsDialogShown(false);
    };

    const handleSaveClick = () => {
        if (isNewRecord) {
            if (numeAstronaut.length >= 5 && rol != null) {
                dispatch(addAstronaut(idSpacecraft, { numeAstronaut, rol }));
                toast.success("Astronaut adaugat!");
                setIsDialogShown(false);
                setSelectedAstronaut(null);
                setNumeAstronaut("");
                setRol("");
            } else {
                if (numeAstronaut.length < 5) {
                    toast.error("Numele trebuie sa aiba cel putin 5 caractere!");

                } else if (rol == null) {
                    toast.error("Selectati un rol!!");
                }
            }
        } else {
            if (numeAstronaut.length >= 5 && rol != null) {
                dispatch(saveAstronaut(idSpacecraft, { numeAstronaut, rol }, selectedAstronaut));
                toast.success("Astronaut actualizat!");
                setIsDialogShown(false);
                setSelectedAstronaut(null);
                setNumeAstronaut("");
                setRol("");
            } else {
                if (numeAstronaut.length < 5) {

                    toast.error("Numele trebuie sa aiba cel putin 5 caractere!");
                } else if (rol == null) {
                    toast.error("Selectati un rol!!");
                }
            }
        }
    };

    const editAstronaut = (rowData) => {
        setSelectedAstronaut(rowData.id);
        setNumeAstronaut(rowData.numeAstronaut);
        setRol(rowData.rol);
        setIsDialogShown(true);
        setIsNewRecord(false);
    };

    const handleDeleteAstronaut = (rowData) => {
        dispatch(deleteAstronaut(idSpacecraft, rowData.id));
        toast.success("Astronaut sters!");
    };

    const redirect = () => {
        navigate(`/`);
    };

    const tableFooter = (
        <div className="flex justify-content-around">
            <Button
                label="Add"
                icon="pi pi-plus"
                onClick={handleAddClick}
            />
            <Button
                label="Back"
                icon="pi pi-sign-out"
                onClick={redirect}
            />
        </div>
    );

    const dialogFooter = (
        <div>
            <Button
                label="Save"
                icon="pi pi-save"
                onClick={handleSaveClick}
            />
        </div>
    );

    const opsColumn = (rowData) => {
        return (
            <>
                <Button className="mx-3"
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => editAstronaut(rowData)}
                />
                <Button className="mx-3"
                    label="Delete"
                    icon="pi pi-times"
                    className="p-button p-button-danger"
                    onClick={() => handleDeleteAstronaut(rowData)}
                />
            </>
        );
    };

    const options = [
        { value: "COMMANDER", label: "COMMANDER" },
        { value: "PILOT", label: "PILOT" },
    ];

    return (
        <div>
            <ToastContainer />
            <div>
                <h3 style={styles.h3}>Lista astronautilor:</h3>
            </div>
            <DataTable value={astronauts} footer={tableFooter} lazy>
                <Column header="Nume" field="numeAstronaut" />
                <Column header="Rol" field="rol" />

                <Column body={opsColumn} />
            </DataTable>
            <Dialog
                header="Astronaut"
                visible={isDialogShown}
                onHide={hideDialog}
                footer={dialogFooter}
            >
                <div>
                    <InputText className="mb-2"
                        placeholder="Nume"
                        onChange={(evt) => setNumeAstronaut(evt.target.value)}
                        value={numeAstronaut}
                    />
                </div>
                <div>
                    <SelectButton
                        options={options}
                        value={rol}
                        onChange={(evt) => setRol(evt.target.value)}
                    />
                </div>
            </Dialog>
        </div>
    );
}

export default AstronautList;
