import React, { useEffect, useRef, useState } from "react";
import "../../index.css";
import ArrowDown from "../../svg/arrow-down.svg";
import useClickOutside from "../../composables/useClickOutside";

const MultiSelect = (props) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const eRef = useRef(null);
  const element = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((currentState) => {
      return !currentState;
    });
  };
  const setData = (e) => {
    eRef.current = e;
    setSelectedOptions((currentState) => {
      if (currentState.includes(e.target.value)) {
        return currentState.filter((value) => value !== e.target.value);
      }
      return [...currentState, e.target.value];
    });
  };

  useClickOutside(element, () => setDropdownOpen(false));

  useEffect(() => {
    if (eRef.current) {
      props.handleChange({
        target: { id: eRef.current.target.name, value: selectedOptions },
      });
    }
  }, [selectedOptions]);

  return (
    <div
      className="multi-select-container"
      style={props.design.multiSelectField}
    >
      <div
        className="multi-select-field"
        onClick={toggleDropdown}
        ref={element}
      >
        <div>
          {props.field.placeholder}&nbsp;
          {selectedOptions.length > 0 && <>({selectedOptions.length})</>}
        </div>
        <div>
          <img
            src={ArrowDown}
            className={dropdownOpen ? "rotate-arrow" : ""}
            alt=""
          />
        </div>
      </div>
      <div
        className={
          dropdownOpen
            ? "multi-select-field-options"
            : " multi-select-field-options multi-select-field-closed"
        }
        style={props.design.multiSelectField}
      >
        {props.field.options.map((option, i) => (
          <label className="multi-select-label" key={i}>
            <input
              id={props.field.id + i}
              type="checkbox"
              value={option.value}
              name={props.field.name}
              checked={selectedOptions.includes(option.value)}
              onChange={setData}
            />
            {option.text}
          </label>
        ))}
      </div>
    </div>
  );
};
export default MultiSelect;
