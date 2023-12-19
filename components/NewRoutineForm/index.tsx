"use client";

import "src/app/globals.css";
import NewRoutineList from "../NewRoutineList/index";
import { useState } from "react";
import styles from "./page.module.css";
import Popup from "../popup/index";
import supabase from "../../lib/initSupabase";
import InstructionPopup from "../instructionPopup/index";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  committedDays: number;
}

let taskDataOriginal: Task[] = [];

export default function NewRoutineForm({
  toggleIsCommitted,
  isCommitted,
  handleMainBtnClick,
  goodLuck,
  toggleGoodLuck,
}: any) {
  const [taskData, setTaskData] = useState<Task[]>(taskDataOriginal);
  const [toggleData, setToggleData] = useState<any>(false);
  const [toggleInstructions, setToggleInstructions] = useState<any>(true);

  const addNewData = (todo: Task) => {
    setTaskData([...taskData, todo]);
  };

  function confirmData() {
    setToggleData(!toggleData);
  }

  function confirmInstructions() {
    setToggleInstructions(!toggleInstructions);
  }

  async function linkToMyList() {

    // Continue with inserting new records or other operations
    const tasks: any = taskData.map((task) => ({ habit_name: task.title }));
    const { data, error: insertError } = await supabase
      .from("habit_table")
      .insert(tasks);

    if (insertError) {
      console.error("Error inserting data:", insertError);
      return;
    }

    if (data) {
      const getData = async () => {
        const { data, error } = await supabase.from("habit_table").select("*");
      };
      getData();
    }
    toggleIsCommitted();
    handleMainBtnClick();
  }

  const deleteData = (id: any) => {
    const newArray = taskData.filter((task) => task.id !== id);
    setTaskData(newArray);
  };

  return (
    <>
      <div>
        <InstructionPopup
          toggleInstructions={toggleInstructions}
          confirmInstructions={confirmInstructions}
        />
        <Popup
          linkToMyList={linkToMyList}
          confirmData={confirmData}
          toggleData={toggleData}
          setToggleData={setToggleData}
          goodLuck={goodLuck}
          toggleGoodLuck={toggleGoodLuck}
          taskData={taskData}
        />
        <NewRoutineList
          taskData={taskData}
          addNewData={addNewData}
          deleteData={deleteData}
        />
      </div>
      <div className="btn-container" style={{ justifyContent: "center" }}>
      <button
          className={styles.commitBtn}
          onClick={confirmData}
          disabled={taskData.length === 0} // Disable if taskData is empty
        >
          Commit
        </button>
      </div>
    </>
  );
}