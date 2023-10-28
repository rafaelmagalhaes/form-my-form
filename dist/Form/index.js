import React, { createRef, useEffect, useState } from "react";
import "../../../index.css";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import MultiSelect from "./MultiSelect";
import Option from "./Option";
const Form = props => {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});
  const formRef = /*#__PURE__*/createRef();
  const submitForm = e => {
    e.preventDefault();
    const form = formRef;
    let error = [];
    for (let i = 0; i < form.current.elements.length; i++) {
      // Reset error border effect
      document.getElementById(form?.current?.elements[i].getAttribute("id")).style.border = "";
      if (form?.current?.elements[i]?.getAttribute("aria-required") && !form?.current?.elements[i].value.length) {
        error.push(form?.current?.elements[i].getAttribute("id"));
      }
      // Check for errors on input text
      if (form?.current?.elements[i]?.getAttribute("regex")) {
        if (!eval(form?.current?.elements[i]?.getAttribute("regex")).test(form?.current?.elements[i].getAttribute("type") ? form.current.elements[i].getAttribute("value") : form?.current?.elements[i].value)) {
          error.push(form?.current?.elements[i].getAttribute("id"));
        }
      }
    }
    // Apply error border effect
    error.map(e => {
      document.getElementById(e).style.border = "1px solid #f00";
    });
    if (error.length > 0) {
      setFormError({
        ...formError,
        generalErrorMessage: props.setup.generalErrorMessage
      });
    } else {
      setFormError({});
      props.submittedData(formData);
    }
  };
  const checkErrors = (target, error, errorMessage) => {
    setFormError(currentError => {
      if (target?.value?.length > 0 && error && !Object.keys(currentError).includes(target.id)) {
        return {
          ...currentError,
          [target.id]: errorMessage
        };
      }
      if (!error || target.value.length === 0) {
        delete currentError[target.id];
        return {
          ...currentError
        };
      }
      return currentError;
    });
  };
  const handleChange = e => {
    const {
      target,
      error,
      errorMessage
    } = e;
    // Check and set errors
    checkErrors(target, error, errorMessage);
    setFormData({
      ...formData,
      [target.id]: target.value
    });
  };

  // Prepares each field for the form
  const generateFormItem = (field, i) => {
    switch (field.kind) {
      case "text":
        return /*#__PURE__*/React.createElement(Input, {
          key: i,
          field: field,
          value: formData[field.name],
          error: formError[field.name],
          handleChange: handleChange
        });
      case "select":
        return /*#__PURE__*/React.createElement(Select, {
          key: i,
          field: field,
          handleChange: handleChange,
          value: formData[field.name]
        });
      case "multi-select":
        return /*#__PURE__*/React.createElement(MultiSelect, {
          key: i,
          field: field,
          handleChange: handleChange
        });
      case "option":
        return /*#__PURE__*/React.createElement(Option, {
          key: i,
          field: field,
          handleChange: handleChange,
          value: formData[field.name]
        });
      case "button":
        return /*#__PURE__*/React.createElement(Button, {
          key: i,
          field: field
        });
      default:
        return;
    }
  };
  // Returns form with full design
  return /*#__PURE__*/React.createElement("div", {
    className: "form-div"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title-div"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, props.setup.title), /*#__PURE__*/React.createElement("div", {
    className: "subtitle"
  }, props.setup.subtitle)), /*#__PURE__*/React.createElement("form", {
    ref: formRef,
    onSubmit: submitForm
  }, props.setup.fields.map((field, i) => {
    // If form items are grouped (show side by side):
    if (field.length) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "field-group"
      }, field.map((field, i) => {
        return generateFormItem(field, i);
      }));
    }
    // If form items are not grouped:
    return generateFormItem(field, i);
  })), /*#__PURE__*/React.createElement("p", {
    className: "field-error-message"
  }, formError?.generalErrorMessage));
};
export default Form;