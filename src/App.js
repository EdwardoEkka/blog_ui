import Main_log from "./components/main_log";
import { UserProvider } from "./components/userContext";
import UserInfo from "./components/data";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from "./components/data";
import UserList from "./components/users";

function App() {
  return (
    <div className="App">
       <Router>
                <UserProvider>
                    <Routes>
                        <Route path="/" element={<Main_log />} />
                        <Route path="/users" element={<UserList/>}/>
                    </Routes>
                </UserProvider>
            </Router>
    </div>
  );
}

export default App;
