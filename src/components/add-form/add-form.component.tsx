import { useEffect, useReducer, useState } from "react";
import "./add-form.css";
import { IStudent } from "../../types";
import CoursesListForm from "../courses-list-form/courses-list-form.component";
import { validateStudent } from "../../utils/validation";

const INITIAL_STUDENT = {
  student: {
    age: 0,
    coursesList: [],
    id: "",
    isGraduated: false,
    name: "",
    absents: 0,
  },
  errorsList: [],
  isOpen: false,
};

interface IProps {
  className?: string;
  onSubmit: (std: IStudent) => void;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        student: {
          ...state.student,
          [action.payload.field]: action.payload.value,
        },
      };
    case "TOGGLE_FORM":
      return { ...state, isOpen: !state.isOpen };
    case "CLEAR_FORM":
      return { ...state, student: INITIAL_STUDENT.student, errorsList: [] };
    case "SET_ERRORS":
      return { ...state, errorsList: action.payload };
    case "ADD_STUDENT":
      return { ...state, student: INITIAL_STUDENT.student, errorsList: [] };
  }
  throw Error("Error Action");
};

const AddForm = (props: IProps) => {
  // const [student, setStudent] = useState<IStudent>(INITIAL_STUDENT);
  // const [isOpen, setIsOpen] = useState(false);
  // const [errorsList, setErrorsList] = useState<string[]>([]);

  const [state, dispatch] = useReducer(reducer, INITIAL_STUDENT);

  useEffect(() => {
    console.log("Hello from Add Form component!");
  }, []);

  const handleChange = (field: keyof IStudent, value: any) => {
    dispatch({ type: "UPDATE_FIELD", payload: { field, value } });
  };

  const handleSubmit = () => {
    const newStudent: IStudent = {
      ...state.student,
      id: Date.now().toString(),
    };

    const errors = validateStudent(newStudent);
    if (errors.length > 0) {
      dispatch({ type: "SET_ERRORS", payload: errors });
      console.log("payload");
    } else {
      dispatch({ type: "ADD_STUDENT" });
      props.onSubmit(newStudent);
      handleClear();
    }
  };

  const handleClear = () => {
    dispatch({ type: "CLEAR_FORM" });
  };

  const handleCoursesChange = (list: string[]) => {
    handleChange("coursesList", list);
  };

  return (
    <div
      className={`wrapper ${props.className} ${
        state.isOpen ? "open" : "closed"
      }`}
    >
      <button onClick={() => dispatch({ type: "TOGGLE_FORM" })}>
        {state.isOpen ? <span>&and; Close </span> : <span>&or; Open </span>}
        Add Form
      </button>
      <div className="input">
        <label htmlFor="name">Student Name: </label>
        <input
          id="name"
          type="text"
          value={state.student.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="input">
        <label htmlFor="age">Student Age: </label>
        <input
          id="age"
          type="number"
          min={17}
          max={40}
          value={state.student.age}
          onChange={(e) => handleChange("age", Number(e.target.value))}
        />
      </div>
      <div className="input">
        <label htmlFor="isGraduated">Is Student Graduated: </label>
        <input
          id="isGraduated"
          type="checkbox"
          checked={state.student.isGraduated}
          onChange={(e) => handleChange("isGraduated", e.target.checked)}
        />
      </div>
      <div>
        <CoursesListForm
          value={state.student.coursesList}
          onSubmit={handleCoursesChange}
        />
      </div>
      <div className="Actions">
        <button
          onClick={handleSubmit}
          style={{ color: state.errorsList.length ? "red" : "initial" }}
        >
          Submit
        </button>
        <button onClick={handleClear}>Clear</button>
      </div>
      {Boolean(state.errorsList.length) && (
        <div className="report">
          <h4>You have the following error/s:</h4>
          {state.errorsList.map((error) => (
            <p key={error}>- {error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddForm;
