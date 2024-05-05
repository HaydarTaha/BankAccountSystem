import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import {
  createData,
  getAllData,
  updateData,
  deleteData,
} from "../../service/Crud";

const Table = ({ data, tableName, isFetching, setData, setIsFetching }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  // Define columns for 4 types of data
  // Users, Accounts, Transactions, Deposit Options
  /*
    Users:
    - ID, id
    - Name, name
    - Surname, surname
    - Email, email
    - Password, password
    - Role, role

    Accounts:
    - ID, id
    - Account ID, account_id
    - User ID, user_id
    - Deposit Option ID, deposit_option_id
    - Account Name, account_name
    - Account Type, account_type
    - IBAN, iban
    - Balance, balance
    - Available Balance, available_balance
    - Currency, currency

    Transactions:
    - ID, id
    - Sender Account ID, sender_account_id
    - Receiver Account ID, receiver_account_id
    - Date, date
    - Amount, amount
    - Transaction Type, transaction_type
    - Description, description

    Deposit Options:
    - ID, id
    - Name, name
    - Description, description
    - Interest Rate, interest_rate
    - Term, term
  */
  const columns = useMemo(() => {
    if (!data || data.length === 0) {
      if (tableName === "User") {
        return [
          { accessorKey: "id", header: "ID", size: 50 },
          { accessorKey: "name", header: "Name", size: 50 },
          { accessorKey: "surname", header: "Surname", size: 50 },
          { accessorKey: "email", header: "Email", size: 50 },
          { accessorKey: "password", header: "Password", size: 50 },
          { accessorKey: "role", header: "Role", size: 50 },
        ];
      } else if (tableName === "Account") {
        return [
          { accessorKey: "id", header: "ID", size: 50 },
          { accessorKey: "account_id", header: "Account ID", size: 50 },
          { accessorKey: "user_id", header: "User ID", size: 50 },
          {
            accessorKey: "deposit_option_id",
            header: "Deposit Option ID",
            size: 50,
          },
          { accessorKey: "account_name", header: "Account Name", size: 50 },
          { accessorKey: "account_type", header: "Account Type", size: 50 },
          { accessorKey: "iban", header: "IBAN", size: 50 },
          { accessorKey: "balance", header: "Balance", size: 50 },
          {
            accessorKey: "available_balance",
            header: "Available Balance",
            size: 50,
          },
          { accessorKey: "currency", header: "Currency", size: 50 },
        ];
      } else if (tableName === "Transaction") {
        return [
          { accessorKey: "id", header: "ID", size: 50 },
          {
            accessorKey: "sender_account_id",
            header: "Sender Account ID",
            size: 50,
          },
          {
            accessorKey: "receiver_account_id",
            header: "Receiver Account ID",
            size: 50,
          },
          { accessorKey: "date", header: "Date", size: 50 },
          { accessorKey: "amount", header: "Amount", size: 50 },
          {
            accessorKey: "transaction_type",
            header: "Transaction Type",
            size: 50,
          },
          { accessorKey: "description", header: "Description", size: 50 },
        ];
      } else if (tableName === "Deposit Option") {
        return [
          { accessorKey: "id", header: "ID", size: 50 },
          { accessorKey: "name", header: "Name", size: 50 },
          { accessorKey: "description", header: "Description", size: 50 },
          { accessorKey: "interest_rate", header: "Interest Rate", size: 50 },
          { accessorKey: "term", header: "Term", size: 50 },
        ];
      }
    }

    const keys = Object.keys(data[0]);

    const forbiddenKeys = ["created_at", "updated_at", "open_date"];

    const columns = keys.map((key) => {
      let header = key.replace(/_/g, " ");
      let enableEditing = true;
      let muiEditTextFieldProps = {};

      // Skip forbidden keys
      if (forbiddenKeys.includes(key)) return null;

      // Capitalize the first letter of each word
      if (key === "id" || key === "iban") {
        header = key.toUpperCase();
      } else if (key.includes("_id")) {
        // Convert _id to ID
        header = header
          .replace(/_id/g, " ID")
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replace("Id", "ID");
      } else {
        // Capitalize the first letter of each word
        header = header.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      // Disable editing for ID and IBAN columns
      if (key === "id" || key === "iban" || key.includes("_id")) {
        enableEditing = false;
      }

      muiEditTextFieldProps = {
        required: true,
        error: !!validationErrors[key],
        helperText: validationErrors[key],
        onFocus: () =>
          setValidationErrors({ ...validationErrors, [key]: undefined }),
      };

      // Return the column object
      return {
        accessorKey: key,
        header: header,
        size: 50,
        enableEditing: enableEditing,
        muiEditTextFieldProps: muiEditTextFieldProps,
      };
    });

    return columns.filter((column) => column !== null);
  }, [data]);

  //Create action
  const handleCreate = async ({ values, table }) => {
    setIsCreating(true);
    console.log(values);
    /*
    const response = await createData(tableName.toLowerCase() + "s", values);
    console.log(response);
    if (response.status === 201) {
      setIsFetching(true);
      // Fetch the updated data
      const updatedData = await getAllData(tableName.toLowerCase() + "s");
      if (updatedData.status === 200) {
        setData(updatedData.data);
        setIsFetching(false);
      }
    }
    */
    setIsCreating(false);
    // Create the row
    table.setCreatingRow(null);
  };

  //Update action
  const handleUpdate = async ({ values, table }) => {
    setIsUpdating(true);
    // Update the row
    const response = await updateData(
      tableName.toLowerCase() + "s",
      values.id,
      values
    );
    if (response.status === 200) {
      setIsFetching(true);
      // Fetch the updated data
      const updatedData = await getAllData(tableName.toLowerCase() + "s");
      setData(updatedData.data);
      setIsFetching(false);
    }
    setIsUpdating(false);
    // Update the row
    table.setEditingRow(null);
  };

  //Delete action
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // Delete the row
      console.log("Deleting row with ID:", row.original.id);
      setIsDeleting(true);
      const response = await deleteData(
        tableName.toLowerCase() + "s",
        row.original.id
      );
      if (response.status === 204) {
        setIsFetching(true);
        // Fetch the updated data
        const updatedData = await getAllData(tableName.toLowerCase() + "s");
        setData(updatedData.data);
        setIsFetching(false);
      }
      setIsDeleting(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => console.log("Creating row canceled"),
    onCreatingRowSave: handleCreate,
    onEditingRowCancel: () => console.log("Editing row canceled"),
    onEditingRowSave: handleUpdate,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => table.setCreatingRow(true)}
        >
          Create a New {tableName}
        </Button>
      </Box>
    ),
    state: {
      showProgressBars: isFetching,
      isSaving: isUpdating,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Table;
