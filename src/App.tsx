import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import NewPost from "./pages/NewPost";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route path="/editor" component={NewPost}/>
    </Router>

  );
}

export default App;

