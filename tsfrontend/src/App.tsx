import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./components/Home"
import LogInReg from "./components/LogInReg"
import Nav from "./components/Nav"
import Context from "./components/Context"
import Quizform from "./components/Quizform"
import Test from "./components/Test"
import UserTest from "./components/UserTest"
function App() {
  
  return (
    <Context>
    <Router>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/loginReg" element={<LogInReg/>}/>
        <Route path="/form" element={<Quizform/>} />
        <Route path="start" element={<Test/>}/>
        <Route path="/userStart" element={<UserTest/>}/>
      </Routes>
    </Router>
    </Context>
  )
}

export default App
