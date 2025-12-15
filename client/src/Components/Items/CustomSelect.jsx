import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ options, value, placeholder, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    onChange?.(option);
    setOpen(false);
  };

  return (
    <div className="custom-select" ref={ref}>
        <button
            type="button"
            className={`select-button ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            >
            {options.find(o => o.value === value)?.label || placeholder}
            <span className="arrow">{open ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>}</span>
        </button>
    
      {open && (
        <ul className="select-options">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`option ${selected?.value === opt.value ? "selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
