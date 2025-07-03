import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ToggleButton = ({ isExpanded, toggle }) => (
  <div className="text-center mt-3">
    <button
      className="btn btn-sm"
      onClick={toggle}
      aria-label={isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}
      style={{ border: "none", background: "transparent" }}
    >
      <FontAwesomeIcon
        icon={faChevronDown}
        style={{
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          fontSize: "2.5rem",
          color: "#000",
        }}
      />
    </button>
  </div>
);

export default ToggleButton;
