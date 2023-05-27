import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import { connect } from "react-redux";
import { addInvoice, editInvoice } from "../actions";

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentDate: new Date().toLocaleDateString(),
    };
    this.state.invoice = {
      currency: props.editInvoice ? props.editInvoice.currency : "$",
      invoiceNumber: props.editInvoice ? props.editInvoice.invoiceNumber : 1,
      dateOfIssue: props.editInvoice ? props.editInvoice.dateOfIssue : "",
      billTo: props.editInvoice ? props.editInvoice.billTo : "",
      billToEmail: props.editInvoice ? props.editInvoice.billToEmail : "",
      billToAddress: props.editInvoice ? props.editInvoice.billToAddress : "",
      billFrom: props.editInvoice ? props.editInvoice.billFrom : "",
      billFromEmail: props.editInvoice ? props.editInvoice.billFromEmail : "",
      billFromAddress: props.editInvoice
        ? props.editInvoice.billFromAddress
        : "",
      notes: props.editInvoice ? props.editInvoice.notes : "",
      total: props.editInvoice ? props.editInvoice.total : "0.00",
      subTotal: props.editInvoice ? props.editInvoice.subTotal : "0.00",
      taxRate: props.editInvoice ? props.editInvoice.taxRate : "",
      taxAmmount: props.editInvoice ? props.editInvoice.taxAmmount : "0.00",
      discountRate: props.editInvoice ? props.editInvoice.discountRate : "",
      discountAmmount: props.editInvoice
        ? props.editInvoice.discountAmmount
        : "0.00",
      invoiceId: props.editing
        ? props.editInvoice.invoiceId
        : (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
    };
    this.state.items = props.editInvoice
      ? [...props.editInvoice.items]
      : [
          {
            id: "0",
            name: "",
            description: "",
            price: "1.00",
            quantity: 1,
          },
        ];
    this.editField = this.editField.bind(this);
  }

  // Calculate total on-loading component(useful for copy/edit invoice)
  componentDidMount() {
    this.handleCalculateTotal(this.state.items);
  }

  // Function to add new item
  handleAddEvent = () => {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var newItem = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    let updatedItems = [...this.state.items, newItem];
    this.setState({ items: updatedItems });
  };

  // Function to delete an item
  handleRowDel = (item) => {
    var index = this.state.items.indexOf(item);
    this.state.items.splice(index, 1);
    this.setState({ items: this.state.items });
  };

  // Function to calculate total amount
  handleCalculateTotal = (items) => {
    let subTotal = 0;

    // calculate subtotal
    items.forEach((items) => {
      subTotal += parseFloat(
        parseFloat(items.price).toFixed(2) * parseInt(items.quantity)
      ).toFixed(2);
    });

    subTotal = parseFloat(subTotal).toFixed(2);
    const taxAmmount = parseFloat(
      parseFloat(subTotal) * (this.state.invoice.taxRate / 100)
    ).toFixed(2);
    const discountAmmount = parseFloat(
      parseFloat(subTotal) * (this.state.invoice.discountRate / 100)
    ).toFixed(2);
    const total = parseFloat(
      subTotal - (discountAmmount + parseFloat(taxAmmount))
    ).toFixed(2);

    this.setState((prevState) => {
      return {
        ...prevState,
        invoice: {
          ...prevState.invoice,
          subTotal,
          taxAmmount,
          discountAmmount,
          total,
        },
      };
    });
  };

  // Function to handle changes in items
  onItemizedItemEdit = (event) => {
    let newItems = this.state.items.map((item) => {
      if (item.id === event.id) {
        return { ...item, [event.name]: event.value };
      }
      return item;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal(newItems);
  };

  // Function to handle changes in any invoice field
  editField = (event) => {
    this.setState({
      invoice: {
        ...this.state.invoice,
        [event.target.name]: event.target.value,
      },
    });
    this.handleCalculateTotal(this.state.items);
  };

  // Function to handle currency change
  onCurrencyChange = (selectedCurrency) => {
    this.setState({
      invoice: { ...this.state.invoice, currency: selectedCurrency },
    });
  };

  // Function to add or edit invoice in redux state
  generateInvoice = () => {
    let generatedInvoice = {
      ...this.state.invoice,
      items: [...this.state.items],
    };

    if (this.props.editing) {
      this.props.dispatch(editInvoice(generatedInvoice));
    } else if (!this.props.editing) {
      this.props.dispatch(addInvoice(generatedInvoice));
    }
  };

  // Function to generate and open invoice
  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal(this.state.items);
    this.generateInvoice();
    this.setState({ isOpen: true });
  };

  // Function to close opened invoice
  closeModal = (event) => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={9} lg={8}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">
                        {this.state.currentDate}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      value={this.state.invoice.dateOfIssue}
                      name={"dateOfIssue"}
                      onChange={(event) => this.editField(event)}
                      style={{
                        maxWidth: "150px",
                      }}
                      required="required"
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">
                    Invoice&nbsp;Number:&nbsp;
                  </span>
                  <Form.Control
                    type="number"
                    value={this.state.invoice.invoiceNumber}
                    name={"invoiceNumber"}
                    onChange={(event) => this.editField(event)}
                    min="1"
                    style={{
                      maxWidth: "70px",
                    }}
                    required="required"
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice to?"}
                    rows={3}
                    value={this.state.invoice.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                    required="required"
                  />
                  <Form.Control
                    placeholder={"Email address"}
                    value={this.state.invoice.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="email"
                    required="required"
                  />
                  <Form.Control
                    placeholder={"Billing address"}
                    value={this.state.invoice.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                    required="required"
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder={"Who is this invoice from?"}
                    rows={3}
                    value={this.state.invoice.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="name"
                    required="required"
                  />
                  <Form.Control
                    placeholder={"Email address"}
                    value={this.state.invoice.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    onChange={(event) => this.editField(event)}
                    autoComplete="email"
                    required="required"
                  />
                  <Form.Control
                    placeholder={"Billing address"}
                    value={this.state.invoice.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(event) => this.editField(event)}
                    required="required"
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.invoice.currency}
                items={this.state.items}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>
                      {this.state.invoice.currency}
                      {this.state.invoice.subTotal}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small ">
                        ({this.state.invoice.discountRate || 0}%)
                      </span>
                      {this.state.invoice.currency}
                      {this.state.invoice.discountAmmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small ">
                        ({this.state.invoice.taxRate || 0}%)
                      </span>
                      {this.state.invoice.currency}
                      {this.state.invoice.taxAmmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex flex-row align-items-start justify-content-between"
                    style={{
                      fontSize: "1.125rem",
                    }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      {this.state.invoice.currency}
                      {this.state.invoice.total || 0}
                    </span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                placeholder="Thanks for your business!"
                name="notes"
                value={this.state.invoice.notes}
                onChange={(event) => this.editField(event)}
                as="textarea"
                className="my-2"
                rows={1}
              />
            </Card>
          </Col>
          <Col md={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">
                {this.props.editing ? "Edit Invoice" : "Generate Invoice"}
              </Button>
              <InvoiceModal
                showModal={this.state.isOpen}
                closeModal={this.closeModal}
                invoiceListVisible={this.props.invoiceListVisible}
                info={this.state.invoice}
                items={this.state.items}
              />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  onChange={(event) =>
                    this.onCurrencyChange(event.target.value)
                  }
                  className="btn btn-light my-1"
                  aria-label="Change Currency"
                >
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Signapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={this.state.invoice.taxRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={this.state.invoice.discountRate}
                    onChange={(event) => this.editField(event)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <hr className="my-4" />
              <Button
                variant="primary"
                className="d-block w-100"
                onClick={() => this.props.invoiceListVisible(true)}
              >
                Invoice List
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect()(InvoiceForm);
