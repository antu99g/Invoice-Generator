import { useState } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../actions";
import "../styles/App.css";

function InvoiceListItem({
  invoice,
  invoiceIdToCopy,
  startEditingInvoice,
  openModal,
  handleInvoiceSelect,
}) {
  const dispatch = useDispatch();

  // State to show modal to confirm delete invoice
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to delete an invoice
  const handleDeleteInvoice = () => {
    dispatch(deleteInvoice(invoice.invoiceId));
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card
        className="px-4 pt-4 pb-3 mb-4"
        style={{
          backgroundColor:
            invoiceIdToCopy === invoice.invoiceId ? "rgba(0, 0, 0, 0.1)" : "",
        }}
        key={invoice.invoiceId}
      >
        <Row>
          <Col
            md={8}
            lg={9}
            onClick={() => handleInvoiceSelect(invoice.invoiceId)}
          >
            <div className="d-flex align-items-center">
              <h5>Invoice : </h5>
              <h6 className="text-secondary">&ensp;#{invoice.invoiceId}</h6>
            </div>
            <div className="d-flex align-center">
              <h5 className="mr-3">Billing : </h5>
              <span className="ml-2 fs-6">
                &ensp;{`${invoice.billFrom} - ${invoice.billTo}`}
              </span>
            </div>
            <div className="d-flex align-center">
              <h5>Issue Date : </h5>
              <span className="fs-6">&ensp;{invoice.dateOfIssue}</span>
            </div>
            <div className="d-flex align-center">
              <h5>Total : </h5>
              <span className="fs-6">
                &ensp;{`${invoice.currency}${invoice.total}`}
              </span>
            </div>
          </Col>
          <Col md={4} lg={3} className="d-flex align-items-start">
            <div className="btnContainerGrid w-100">
              <Button variant="primary" onClick={() => openModal(invoice)}>
                View Detail
              </Button>
              <Button
                variant="secondary"
                onClick={() => startEditingInvoice(invoice.invoiceId)}
              >
                Edit
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      <Modal show={showDeleteModal} centered>
        <Modal.Header closeButton onClick={() => setShowDeleteModal(false)} />
        <Modal.Body>
          <h5>Do you want to delete this invoice?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteInvoice}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InvoiceListItem;
