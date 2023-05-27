// Action types
export const ADD_INVOICE = "ADD_INVOICE";
export const DELETE_INVOICE = "DELETE_INVOICE";
export const EDIT_INVOICE = "EDIT_INVOICE";

// Action creators

// Action for adding new invoice
export function addInvoice(invoice) {
  return {
    type: ADD_INVOICE,
    invoice,
  };
}

// Action for editing an invoice
export function editInvoice(invoice) {
  return {
    type: EDIT_INVOICE,
    invoice,
  };
}

// Action for deleting an invoice
export function deleteInvoice(invoiceId) {
  return {
    type: DELETE_INVOICE,
    invoiceId,
  };
}
