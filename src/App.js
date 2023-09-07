import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import 'font-awesome/css/font-awesome.min.css';
import { Dropdown } from 'bootstrap';


import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import HomeManager from "./components/HomeManager";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardCollaborater from "./components/board-collaborater.component";
import BoardManager from "./components/board-manager.component";
import NotificationService from "./services/NotificationService";
import NotificationsComponent from "./components/NotificationsComponent";
import CreateObjectiveComponent from "./components/CreateObjectiveComponent";
import SuggestObjectiveComponent from "./components/SuggestObjectiveComponent";

import CollaboratorList from "./components/CollaboratorList";
import SuggestionList from "./components/SuggestionList";
import ObjectiveList from "./components/ObjectiveList";

import ViewObjectiveComponent from "./components/ViewObjectiveComponent";
import SharedObjective from "./components/SharedObjectiveComponent";
import MySuggestComponent from "./components/MySuggestComponent";



class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showCollaboraterBoard: false,
      showManagerBoard: false,
      currentUser: undefined,
      notifications: [],
    };
  }

  handleNotificationClick = (notificationId) => {
    NotificationService.getNotificationById(notificationId).then(
      response => {
        let displayMessage = response.data.message;
  
        if (response.data.relatedObjective) {
          displayMessage += "\n\nRelated Objective: " + JSON.stringify(response.data.relatedObjective);
        }
  
        if (response.data.relatedSuggestion) {
          displayMessage += "\n\nRelated Suggestion: " + JSON.stringify(response.data.relatedSuggestion);
        }
  
        alert(displayMessage);
      },
      error => {
        console.error("Erreur lors de la récupération du contenu de la notification:", error);
      }
    );
  }
  
  


  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      const dropdownElement = document.querySelector('#notificationsDropdown');
      if (dropdownElement) {
        new Dropdown(dropdownElement);
      }

    NotificationService.getAllUserNotifications().then(
      (response) => {
        this.setState({ notifications: response.data });
      },
      (error) => {
        console.log("Error getting notifications:", error);
      }
    );
    }

    if (user) {
      this.setState({
        currentUser: user,
        showCollaboraterBoard: user.roles.includes("ROLE_COLLABORATER"),
        showManagerBoard: user.roles.includes("ROLE_MANAGER"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showCollaboraterBoard: false,
      showManagerBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showCollaboraterBoard, showManagerBoard } = this.state;


    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
          NexObjective
          </Link>

          <div className="navbar-nav mr-auto">

           {showCollaboraterBoard && (
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
           )}

           {showManagerBoard && (
            <li className="nav-item">
              <Link to={"/homem"} className="nav-link">
                Home
              </Link>
            </li>
           )}

            {showCollaboraterBoard && (
              <li className="nav-item">
                <Link to={"/collab"} className="nav-link">
                  Collaborater Board
                </Link>
              </li>
            )}

            {showManagerBoard && (
              <li className="nav-item">
                <Link to={"/manager"} className="nav-link">
                  Manager Board
                </Link>
              </li>
            )}

            {showManagerBoard && (
             <li className="nav-item">
               <Link to={"/create-objective"} className="nav-link">
                 Create Objective
               </Link>
              </li>
            )}

           {showCollaboraterBoard && (
              <li className="nav-item">
                <Link to={"/suggest-objective"} className="nav-link">
                 Suggest Objective
                </Link>
              </li>
            )}


            {/* Notifications icon */}
            {currentUser &&
             <li className="nav-item dropdown">
                <NotificationsComponent notifications={this.state.notifications} 
                  onNotificationClick={this.handleNotificationClick} 
                />
             </li>
            }

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/homem" element={<HomeManager/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/user" element={<BoardUser />} />
            <Route path="/collab" element={<BoardCollaborater />} />
            <Route path="/manager" element={<BoardManager />} />

            <Route path="/create-objective" element={<CreateObjectiveComponent />} />
            <Route path="/suggest-objective" element={<SuggestObjectiveComponent />} />

            {/*Manager Board*/}     
            <Route path="/collaborators" element={<CollaboratorList />} />  
            <Route path="/suggestions" element={<SuggestionList />} />
            <Route path="/objectives" element={<ObjectiveList />} />

            {/* Collaborater Board */}
            <Route path="/view-objective" element={<ViewObjectiveComponent />} />
            <Route path="/shared-objective" element={<SharedObjective />} />
            <Route path="/my-suggest" element={<MySuggestComponent />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
