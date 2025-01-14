import { useEffect, useReducer, useRef, useState } from "react";
import { IStudent } from "../../types";
import CoursesList from "../courses-list/courses-list.component";
import "./student.css";

interface IProps extends IStudent {
  onAbsentChange: (id: string, change: number) => void;
}

const INITIAL_STATE = {
  absents: 0,
  prevAbsents: 0,
};

const reducer = (
  state: typeof INITIAL_STATE,
  action: { type: string; payload?: number }
) => {
  switch (action.type) {
    case "ADD_ABSENT":
      return {
        ...state,
        prevAbsents: state.absents,
        absents: state.absents + 1,
      };
      case "REMOVE_ABSENT":
      if (state.absents > 0) {
        return {
          ...state,
          prevAbsents: state.absents,
          absents: state.absents - 1,
        };
      }
      return state;
    case "RESET_ABSENT":
      return {
        ...state,
        prevAbsents: state.absents,
        absents: 0,
      }; 
    throw Error ("Unknown action type")  
  }
};
const Student = (props: IProps) => {
  // const [absents, setAbsents] = useState(props.absents);

  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    absents: props.absents,
  });
  const [absentColor, setAbsentColor] = useState("#213547");
  const prevAbsents = useRef<number>(props.absents); // useRef(initialValue)

  // useEffect(() => {
  //   prevAbsents.current = absents;
  // }, [absents]);

  useEffect(() => {
    if (state.absents >= 10) {
      setAbsentColor("#ff0000");
    } else if (state.absents >= 7) {
      setAbsentColor("#fd9c0e");
    } else if (state.absents >= 5) {
      setAbsentColor("#d6c728");
    } else {
      setAbsentColor("#213547");
    }
  }, [state.absents]);

  useEffect(() => {
    console.log("Hello from Student component!");

    // The code in this function will be called on the unmount
    return () => {
      console.log(`Student ${props.name}, has been deleted! `);
      // if (confirm("Do you want to back up the item before deletion!")) {
      //   localStorage.setItem('back-up', JSON.stringify(props));
      // }
    };
  }, []);

  const addAbsent = () => {
    dispatch({ type: "ADD_ABSENT" });
    props.onAbsentChange(props.id, +1);
  };

  const removeAbsent = () => {
    dispatch({ type: "REMOVE_ABSENT" });
    props.onAbsentChange(props.id, -1);
  };

  const resetAbsent = () => {
    dispatch({ type: "RESET_ABSENT" });
    props.onAbsentChange(props.id, -state.absents);
  };

  return (
    <div className="std-wrapper">
      <div className="data-field">
        <b>Student:</b> {props.name.toUpperCase() + "!"}
      </div>
      <div className="data-field">
        <b>Age:</b> {props.age}
      </div>
      <div
        className="data-field"
        style={{ color: props.isGraduated ? "green" : "orange" }}
      >
        <b>Is Graduated:</b> {props.isGraduated ? "Yes" : "No"}
      </div>
      <div className="data-field">
        <b>Courses List:</b>
        <CoursesList list={props.coursesList} />
      </div>
      <div className="absents">
        <b style={{ color: absentColor }}>Prev Absents:</b>{" "}
        {prevAbsents.current}
        <b style={{ color: absentColor }}>Absents:</b> {state.absents}
        <button onClick={addAbsent}>+</button>
        <button onClick={removeAbsent}>-</button>
        <button onClick={resetAbsent}>Reset</button>
      </div>
    </div>
  );
};

export default Student;
