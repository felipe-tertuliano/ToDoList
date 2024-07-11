import React, { useCallback, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridFilterModel,
    GridToolbar,
} from '@mui/x-data-grid';
import { v4 as uuid } from "uuid";
import api from "../../services/api";
import useAlert from "../../hooks/alert";

function consolelog(e: any) {
    console.log(e);
}

interface ITaskItem {
    id?: number;
    title: string;
    description?: string;
    isCompleted: boolean;
    category: string;
    createdAt?: Date | string;
    username?: string;
    isNew?: boolean;
};

const Table: React.FC = () => {

    const { addAlert } = useAlert();

    const [rows, setRows] = React.useState<ITaskItem[]>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });

    const loadTable = useCallback(() => {
        api.get("/task").then(({ data }) => {
            setRows((data as any[]).map(e => ({ ...e, createdAt: new Date(e["createdAt"]) })));
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        loadTable();
    }, [loadTable]);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = useCallback((params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    }, []);

    const handleEditClick = useCallback((id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }, [rowModesModel]);

    const handleSaveClick = useCallback((id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    }, [rowModesModel]);

    const handleDeleteClick = useCallback((id: GridRowId) => () => {
        api.delete(`/task/${id}`).then(() => {
            addAlert({
                type: "info",
                title: "Info",
                description: "Task successfully deleted.",
            });
            setRows(rows.filter((row) => row.id !== id));
        }).catch(() => {
            addAlert({
                type: "error",
                title: "Error",
                description: "Error while deleting Task, try again later.",
            });
        });
    }, [rows, addAlert]);

    const handleCancelClick = useCallback((id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    }, [rowModesModel, rows]);

    const handleProcessRowUpdateError = useCallback(() => {
        addAlert({
            type: "error",
            title: "Error",
            description: "Error while saving Task, try again later.",
        });
    }, [addAlert]);

    const handleRowModesModelChange = useCallback((newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    }, []);

    const handleAddRecordClick = useCallback(() => {
        const id = uuid();
        setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }] as any);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    }, []);

    const processRowUpdate = useCallback(async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        if (newRow?.isNew) {
            // Create
            await api.post("/task", {
                title: newRow.title,
                description: newRow.description,
                isCompleted: newRow.isCompleted,
                category: newRow.category,
            });
            loadTable();
        } else {
            // Edit
            await api.put(`/task/${newRow.id}`, {
                id: newRow.id,
                title: newRow.title,
                description: newRow.description,
                isCompleted: newRow.isCompleted,
                category: newRow.category,
            });
        }
        addAlert({
            type: "success",
            title: "Succes",
            description: "Task successfully saved.",
        });
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)) as any);
        return updatedRow;
    }, [rows, addAlert, loadTable]);

    const columns: GridColDef[] = [
        {
            field: "title",
            headerName: "Title",
            flex: 1,
            editable: true
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1,
            editable: true
        },
        {
            field: "isCompleted",
            headerName: "Is completed?",
            type: "boolean",
            flex: 1,
            editable: true
        },
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            editable: true
        },
        {
            field: "createdAt",
            headerName: "Created at",
            type: "dateTime",
            flex: 1,
            editable: false
        },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
            editable: false
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{ color: 'primary.main' }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRecordClick}>
                Add record
            </Button>
            <DataGrid
                columns={columns}
                editMode="row"
                filterModel={filterModel}
                onCellEditStop={(e) => consolelog(e)}
                onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                onRowEditStop={handleRowEditStop}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                rows={rows}
                slotProps={{ toolbar: { setRows, setRowModesModel } }}
                slots={{ toolbar: GridToolbar }}
            />
        </Box>
    );
}

export default Table;