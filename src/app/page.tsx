"use client";
import React from "react";
import Home from "../../components/homepage/index";
import NewRoutineForm from "../../components/NewRoutineForm";
import ActiveList from "../../components/ActiveList";
import { useState, useEffect } from "react";
import MainBtn from "../../components/MainBtn";
import supabase from "../../lib/initSupabase";
import { useRouter } from "next/navigation";
import EndingPopup from "../../components/EndingPopup";
import Prompt from "../../components/prompt/index";
import ButtonBar from "../../components/ButtonBar";

interface Habit {
  habit_id: string;
  habit_name: string;
  created_at: string;
  completed: boolean;
  current_score: number;
  max_score: number;
  user_id: number;
}

interface HabitLog {
  habit_id: string;
  completed_at: string;
  user_id: number;
}

export default function Parent() {
  const currentDate = new Date();
  const [habitData, setHabitData] = useState<Habit[] | null>(null);
  const [isMyListVisible, setIsMyListVisible] = useState<boolean>(true);
  const [isCommitted, setisCommitted] = useState(false);
  const [date, setDate] = useState(false);
  const [habitLogsArray, setHabitLogsArray] = useState<HabitLog[] | null>(null);
  const [goodLuck, setGoodLuck] = useState<any>(false);

  let router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") || null;
    if (isLoggedIn === "false" || null) {
      router.push("/authentication");
    }
  }, [router]);

  function toggleGoodLuck() {
    setGoodLuck(!goodLuck);
  }

  console.log(habitData)

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from("habit_table").select("*").eq("user_id", "1");
      setHabitData(data);
    };
    getData();
  }, [isMyListVisible]);


  // Calculate the current score, max score, and percentage completion
  let tenDaysPassed = false;
  let currentScore = habitLogsArray?.length ?? 0;
  let maxScore = habitData?.length ? habitData.length * 10 : 0;
  let percentageDecimal = maxScore ? (currentScore / maxScore) : 0;

  console.log(maxScore)

  // Function to handle MainBtn click, toggles visibility of My List
  const handleMainBtnClick = () => {
    setIsMyListVisible((prevValue) => !prevValue);
  };

  // Function to toggle commitment status
  function toggleIsCommitted(): any {
    setisCommitted(!isCommitted);
  }

  // Function to toggle date (It seems you're not using this function)
  function toggleDate(): any {
    setDate(!date);
  }

  // Effect hook to fetch data from the "habit_table" table when isMyListVisible changes
  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from("habit_table").select("*");
      setHabitData(data);
    };
    getData();
  }, [isMyListVisible]);

  // Effect hook to fetch data from the "habit_log" table when isMyListVisible changes
  useEffect(() => {
    const getHabitLogs = async () => {
      const { data: habitLogs, error: habitLogsError } = await supabase
        .from("habit_log")
        .select("*");
      setHabitLogsArray(habitLogs);
    };
    getHabitLogs();
  }, [isMyListVisible]);

  // Check if habitData is available and calculate tenDaysPassed
  if (habitData) {
    const startDate = new Date(habitData[0]?.created_at);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 10);
    tenDaysPassed = currentDate >= endDate;
  }

  // Function to simulate advancing time by 10 days
  const advanceTime = () => {
    if (habitData) {
      const newStartDate = new Date(habitData[0]?.created_at);
      newStartDate.setDate(newStartDate.getDate() - 10);
      setHabitData([{ ...habitData[0], created_at: newStartDate.toISOString() }]);
    }
  };

  const clearDatabase = async () => {
    // Delete all records from habit_log
    const { error: deleteLogError } = await supabase
      .from("habit_log")
      .delete()
      .eq("user_id", "1");
    if (deleteLogError) {
      console.error("Error deleting habit_log records:", deleteLogError);
      return;
    }
  
    // Delete records from habit_table
    const { error: deleteError } = await supabase
      .from("habit_table")
      .delete()
      .eq("user_id", "1");
  
    if (deleteError) {
      console.error("Error deleting habit_table records:", deleteError);
      return;
    }
  };

  return (
    <>
    <Prompt 
      tenDaysPassed={tenDaysPassed}
      isCommitted={isCommitted}
      maxScore={maxScore}
      currentScore={currentScore}
      percentageDecimal={percentageDecimal}
      toggleIsCommitted={toggleIsCommitted}
    />
      {isMyListVisible ? (
        isCommitted ? (
          <div>
            <ActiveList
              taskData={habitData}
              date={date}
              toggleDate={toggleDate}
              toggleIsCommitted={toggleIsCommitted}
            />
          </div>
        ) : (
          <div>
            <NewRoutineForm
              toggleIsCommitted={toggleIsCommitted}
              isCommitted={isCommitted}
              handleMainBtnClick={handleMainBtnClick}
              goodLuck={goodLuck}
              toggleGoodLuck={toggleGoodLuck}
            />
          </div>
        )
      ) : (
        <>
          <Home
            currentScore={currentScore}
            maxScore={maxScore}
            percentageDecimal={percentageDecimal}
            habitLogsArray={habitLogsArray}
            habitData={habitData}
            goodLuck={goodLuck}
            toggleGoodLuck={toggleGoodLuck}
          />
          {tenDaysPassed && (
            // Render EndingPopup component when ten days have passed
            <EndingPopup
              tenDaysPassed={tenDaysPassed}
              habitData={habitData}
              maxScore={maxScore}
              currentScore={currentScore}
              percentageDecimal={percentageDecimal}
              toggleIsCommitted={toggleIsCommitted}
              handleMainBtnClick={handleMainBtnClick}
              clearDatabase={clearDatabase}
            />
          )}
          {/* Button to simulate advancing time by 10 days */}
          <button onClick={advanceTime}>Advance Time by 10 Days</button>
        </>
      )}
      <MainBtn isMyListPage={isMyListVisible} onClick={handleMainBtnClick} />
      <ButtonBar />
    </>
  );
}
