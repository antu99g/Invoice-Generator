import { useState } from "react";
import InvoiceList from "../components/InvoiceList";
import InvoiceForm from "../components/InvoiceForm";
import { useSelector } from "react-redux";

function Home(props) {
  // List of invoices in redux-state
  const invoices = useSelector((state) => state.invoices);

  // State to show invoice-list
  const [showInvoiceList, setShowInvoiceList] = useState(true);

  // Invoice to edit or copy to create new invoice
  const [editInvoice, setEditInvoice] = useState(null);

  // Editing status of any invoice(used in invoice form)
  const [editing, setEditing] = useState(false);

  // Function to toggle between invoice-list and invoice-form component
  // used in other components also
  const invoiceListVisible = (state) => {
    if (typeof state === "boolean") {
      setShowInvoiceList(state);
    } else {
      setShowInvoiceList((prvState) => !prvState);
    }
  };

  // Function to create new invoice
  const createNewInvoice = () => {
    setEditing(false);
    setEditInvoice(null);
    invoiceListVisible(false);
  };

  // Function to edit an invoice
  const startEditingInvoice = (invoiceId) => {
    // Find invoice to edit from invoice-list
    const targetInvoice = invoices.find(
      (invoice) => invoice.invoiceId === invoiceId
    );
    if (targetInvoice) {
      setEditing(true);
      setEditInvoice(() => targetInvoice);
      invoiceListVisible(false);
    }
  };

  // Function to copy invoice to create new invoice
  const copyInvoiceToNew = (invoice) => {
    if (invoice) {
      setEditing(false);
      setEditInvoice(invoice);
      invoiceListVisible(false);
    }
  };

  return (
    <div className="sticky-top">
      {showInvoiceList ? (
        <InvoiceList
          createNewInvoice={createNewInvoice}
          startEditingInvoice={startEditingInvoice}
          copyInvoiceToNew={copyInvoiceToNew}
          invoiceListVisible={invoiceListVisible}
        />
      ) : (
        <InvoiceForm
          invoiceListVisible={invoiceListVisible}
          editInvoice={editInvoice}
          editing={editing}
        />
      )}
    </div>
  );
}
export default Home;
