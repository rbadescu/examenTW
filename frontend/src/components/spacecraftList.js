import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "react-toastify/dist/ReactToastify.css";

import { getSpacecrafts, addSpacecraft, saveSpacecraft, deleteSpacecraft, importSpacecrafts, exportSpacecrafts } from "../actions";

const spacecraftSelector = (state) => state.spacecraft.spacecraftList;
const spacecraftCountSelector = (state) => state.spacecraft.count;

function SpacecraftList() {

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

    const [numeSpacecraft, setNumeSpacecraft] = useState("");
    const [vitezaMax, setVitezaMax] = useState(0);
    const [masa, setMasa] = useState(0);

    const [isNewRecord, setIsNewRecord] = useState(true);
    const [selectedSpacecraft, setSelectedSpacecraft] = useState(null);
    const [filterString, setFilterString] = useState("");

    const navigate = useNavigate();
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState(1);

    const [page, setPage] = useState(0);
    const [first, setFirst] = useState(0);

    const spacecrafts = useSelector(spacecraftSelector);
    const count = useSelector(spacecraftCountSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSpacecrafts(filterString, page, 4, sortField, sortOrder));
    }, [filterString, page, sortField, sortOrder]);

    const handleAddClick = (evt) => {
        setIsDialogShown(true);
        setIsNewRecord(true);
        setNumeSpacecraft("");
        setVitezaMax("");
        setMasa("");
    };

    const hideDialog = () => {
        setIsDialogShown(false);
    };

    const handleSaveClick = () => {
        if (isNewRecord) {
            if (numeSpacecraft.length >= 3 && vitezaMax > 1000 && masa > 200) {
                dispatch(addSpacecraft({ numeSpacecraft, vitezaMax, masa }));
                toast.success("Nava spatiala a fost adaugata!");
                setIsDialogShown(false);
                setSelectedSpacecraft(null);
                setNumeSpacecraft("");
                setVitezaMax("");
                setMasa("");
            } else {
                if (numeSpacecraft.length < 3) {
                    toast.error("Numele trebuie sa aiba cel putin 3 caractere!");
                } else if (vitezaMax < 1001 || isNaN(vitezaMax)) {
                    toast.error("Viteza maxima trebuie sa fie mai mare decat 1000!");
                } else if (masa < 201 || isNaN(masa)) {
                    toast.error("Masa trebuie sa fie mai mare decat 200!");
                }
            }
        } else {
            if (numeSpacecraft.length >= 3 && vitezaMax > 1000 && masa > 200) {
                dispatch(
                    saveSpacecraft(selectedSpacecraft, { numeSpacecraft, vitezaMax, masa })
                );
                toast.success("Nava spatiala a fost actualizata!");
                setIsDialogShown(false);
                setSelectedSpacecraft(null);
                setNumeSpacecraft("");
                setVitezaMax(0);
                setMasa(0);
            } else {
                if (numeSpacecraft.length < 3) {
                    toast.error("Numele trebuie sa aiba cel putin 3 caractere!");
                } else if (vitezaMax < 1001 || isNaN(vitezaMax)) {
                    toast.error("Viteza maxima trebuie sa fie mai mare decat 1000!");
                } else if (masa < 201 || isNaN(masa)) {
                    toast.error("Masa trebuie sa fie mai mare decat 200!");
                }
            }
        }
    };

    const editSpacecraft = (rowData) => {
        setSelectedSpacecraft(rowData.id);
        setNumeSpacecraft(rowData.numeSpacecraft);
        setVitezaMax(rowData.vitezaMax);
        setMasa(rowData.masa);
        setIsDialogShown(true);
        setIsNewRecord(false);
    };

    const handleDeleteSpacecraft = (rowData) => {
        dispatch(deleteSpacecraft(rowData.id));
        toast.success("Nava spatiala a fost stearsa!");
    };




    const redirect = (rowData) => {
        setSelectedSpacecraft(rowData.id);
        navigate(`/spacecrafts/${rowData.id}/astronauts`);
    };

    const tableFooter = (
        <div className="flex justify-content-around">
            <Button label="Add" icon="pi pi-plus" onClick={handleAddClick} />
        </div>
    );

    const dialogFooter = (
        <div>
            <Button label="Save" icon="pi pi-save" onClick={handleSaveClick} />
        </div>
    );

    const opsColumn = (rowData) => {
        return (
            <>
                <Button className="mx-3"
                    label="Edit"
                    icon="pi pi-pencil"
                    onClick={() => editSpacecraft(rowData)}
                />
                <Button className="mx-3"
                    label="Delete"
                    icon="pi pi-times"
                    className="p-button p-button-danger"
                    onClick={() => handleDeleteSpacecraft(rowData)}
                />
                <Button className="mx-3"
                    label="See astronauts"
                    icon="pi pi-eye"
                    onClick={() => redirect(rowData)}
                />
            </>
        );
    };

    const handlePageChange = (evt) => {
        setPage(evt.page);
        setFirst(evt.page * 4);
    };

    const handleSort = (evt) => {
        console.warn(evt);
        setSortField(evt.sortField);
        setSortOrder(evt.sortOrder);
    };

    return (
        <div className="flex flex-column">
            <ToastContainer />
            <div>
                <h3 style={styles.h3}>Lista navelor spatiale:</h3>
            </div>
            <DataTable
                value={spacecrafts}
                footer={tableFooter}
                lazy
                paginator
                onPage={handlePageChange}
                first={first}
                rows={4}
                totalRecords={count}
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
            >
                <Column
                    header="Nume"
                    field="numeSpacecraft"

                />
                <Column
                    header="Viteza maxima"
                    field="vitezaMax"
                />
                <Column header="Masa" field="masa" />

                <Column body={opsColumn} />
            </DataTable>
            <Dialog
                header="Nava spatiala"
                visible={isDialogShown}
                onHide={hideDialog}
                footer={dialogFooter}
            >
                <div>
                    <InputText className="mb-2"
                        placeholder="Nume spacecraft"
                        onChange={(evt) => setNumeSpacecraft(evt.target.value)}
                        value={numeSpacecraft}
                    />
                </div>
                <div>
                    <InputText className="mb-2"
                        placeholder="Viteza maxima"
                        onChange={(evt) => setVitezaMax(evt.target.value)}
                        value={vitezaMax}
                    />
                </div>
                <div>
                    <InputText
                        placeholder="Masa"
                        onChange={(evt) => setMasa(evt.target.value)}
                        value={masa}
                    />
                </div>
            </Dialog>
        </div>
    );
}

export default SpacecraftList;
