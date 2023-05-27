import { ADD_INVOICE, EDIT_INVOICE, DELETE_INVOICE } from "../actions";

const initialState = {
  invoices: [],
};

// Reducer
export default function invoice(state = initialState, action) {
  switch (action.type) {
    case ADD_INVOICE: // Reducer for adding new invoice
      const existedInvoice = state.invoices.find(
        (invoice) => invoice.invoiceId === action.invoice.invoiceId
      );
      const allInvoices = [...state.invoices];
      if (!existedInvoice) {
        allInvoices.push(action.invoice);
      }
      return {
        ...state,
        invoices: allInvoices,
      };

    case EDIT_INVOICE: // Reducer for editing an invoice
      const editedInvoiceList = state.invoices.map((invoice) =>
        invoice.invoiceId === action.invoice.invoiceId
          ? action.invoice
          : invoice
      );
      return {
        ...state,
        invoices: editedInvoiceList,
      };

    case DELETE_INVOICE: // Reducer for deleting an invoice
      const updatedInvoices = state.invoices.filter(
        (invoice) => invoice.invoiceId !== action.invoiceId
      );
      return {
        ...state,
        invoices: updatedInvoices,
      };

    default:
      return state;
  }
}
