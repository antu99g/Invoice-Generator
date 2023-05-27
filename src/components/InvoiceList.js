import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { BiConfused } from "react-icons/bi";
import InvoiceListItem from "./InvoiceListItem";
import InvoiceModal from "./InvoiceModal";
import Container from "react-bootstrap/Container";

function InvoiceList(props) {
  // List of invoices in redux-state
  const invoices = useSelector((state) => state.invoices);

  // Selected invoice-id to copy to create new invoice
  const [invoiceIdToCopy, setInvoiceIdToCopy] = useState("");

  // Invoice to copy and create new invoice
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState({});

  // State to show(or hide) selected invoice details in modal
  const [isOpen, setIsOpen] = useState(false);

  // Function to show modal with invoice details
  const openModal = (invoice) => {
    setSelectedInvoiceDetails(invoice);
    setIsOpen(true);
  };

  // Function to hide invoice details modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Copy invoice and start creating new invoice
  const handleCopyInvoice = () => {
    if (invoiceIdToCopy) {
      const invoiceExists = invoices.find(
        (invoice) => invoice.invoiceId === invoiceIdToCopy
      );
      // if copied invoice-id exists in invoice-list
      if (invoiceExists) {
        props.copyInvoiceToNew(invoiceExists);
      }
    }
  };

  // Selecting invoice to copy to create new invoice
  const handleInvoiceSelect = (invoiceId) => {
    // unselect if the selected invoice clicked
    if (invoiceIdToCopy === invoiceId) {
      setInvoiceIdToCopy(null);
    } else {
      setInvoiceIdToCopy(invoiceId);
    }
  };

  if (invoices.length < 1) {
    return (
      <Container style={{ marginTop: "30vh" }}>
        <Col
          md={5}
          lg={4}
          style={{ color: "grey" }}
          className={
            "mx-auto d-flex-col justify-content-center align-items-center"
          }
        >
          <BiConfused className="w-100" style={{ fontSize: "3rem" }} />
          <h1 className="mb-5 text-center">No invoice added</h1>
          <Button
            variant="primary"
            className="d-block w-100"
            style={{ fontSize: "1rem" }}
            onClick={props.createNewInvoice}
          >
            Create Invoice
          </Button>
        </Col>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={9} lg={7}>
          <div className="mb-3 mb-xl-4 pt-md-3 pt-xl-4">
            {invoices.map((invoice) => {
              return (
                <InvoiceListItem
                  invoice={invoice}
                  startEditingInvoice={props.startEditingInvoice}
                  invoiceIdToCopy={invoiceIdToCopy}
                  handleInvoiceSelect={handleInvoiceSelect}
                  invoiceListVisible={props.invoiceListVisible}
                  openModal={openModal}
                  key={invoice.invoiceId}
                />
              );
            })}
          </div>
        </Col>
        <Col md={3} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button
              variant={invoiceIdToCopy ? "outline-primary" : "primary"}
              className="d-block w-100 mb-3"
              onClick={props.createNewInvoice}
            >
              Create New Invoice
            </Button>
            <Button
              variant={invoiceIdToCopy ? "primary" : "outline-primary"}
              className="d-block w-100"
              onClick={handleCopyInvoice}
            >
              {invoiceIdToCopy
                ? "Copy to new Invoice"
                : "Select Invoice to copy"}
            </Button>
          </div>
        </Col>
      </Row>
      {isOpen && (
        <InvoiceModal
          showModal={isOpen}
          closeModal={closeModal}
          invoiceListVisible={props.invoiceListVisible}
          info={selectedInvoiceDetails}
          items={selectedInvoiceDetails.items}
        />
      )}
    </Container>
  );
}

export default InvoiceList;
