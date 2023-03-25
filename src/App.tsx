import { useState } from "react";
import Calendar from "./components/Calender/Calender";

const App = () => {
  const [currentDate, ] = useState(new Date("10-03-2022"));
  
  return (
    <div className="mt-16 flex flex-col items-center gap-8">
      <Calendar value={currentDate} />
    </div>
  );
};

export default App;
