import styles from './NewRoutineList.module.css';
import Image from 'next/image';
import enterIcon from '../../public/icons/enter-icon-green2.svg';
import trashIconGreen from '../../public/icons/trash-icon-green.svg';
import { useState } from 'react';
import { Task, NewRoutineListProps } from '../../types/types';

export default function NewRoutineList({ taskData, addNewData, deleteData }: NewRoutineListProps) {
  const maxTasks = 5; // Maximum number of tasks to display
  const [inputValue, setInputValue] = useState('');

  function handleEnterIcon() {
    const element = {
      id: taskData.length + 1,
      title: inputValue,
      completed: false,
      committedDays: 10,
    };
    addNewData(element);
    setInputValue(''); // Reset the input value after adding data
  }

  function handleInputValue(e: any) {
    const { value } = e.target;
    setInputValue(value);
  }

  function handleEnterKey(e: any) {
    if (e.key === 'Enter') {
      const element = {
        id: taskData.length + 1,
        title: inputValue,
        completed: false,
      };
      addNewData(element as Task);
      setInputValue(''); // Reset the input value after adding data
    }
  }

  function handleDeleteClick(id: number) {
    deleteData(id);
  }

  return (
    <ul className={styles.myList}>
      {taskData.map((todo: Task) => (
        <li key={todo.id} className={styles.listItem}>
          <div className={styles.newHabit}>
            {todo.title}
            <Image
              src={trashIconGreen}
              alt={'Delete item Button'}
              height={27}
              onClick={() => handleDeleteClick(todo.id)}
            />
          </div>
        </li>
      ))}
      {/* Render additional inactive items if there are less than maxTasks */}
      {Array.from({ length: maxTasks - taskData.length }).map((_, index) => (
        <li key={index}>
          <div className={index === 0 ? styles.listInput : styles.emptyListItem}>
            {index === 0 ? (
              <input
                className={styles.emptyListInput}
                type="text"
                value={inputValue}
                onChange={handleInputValue}
                onKeyDown={handleEnterKey}
                placeholder="Please enter your habit"
              />
            ) : (
              <div className={styles.redDiv}></div>
            )}
            {index === 0 && (
              <Image src={enterIcon} alt="Plus-icon" height={27}/>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
  
}
