import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      avatarColor: "#3498db", 
      isColorPickerOpen: false,
    };
  }

  colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#8e44ad", "#34495e", "#1abc9c", "#e67e22"];
  selectColor = (color) => {
    localStorage.setItem('avatarColor', color);
    this.setState({ avatarColor: color, isColorPickerOpen: false });
}

  handleColorChange = (event) => {
    this.setState({ avatarColor: event.target.value });
  }

  toggleColorPicker = () => {
    this.setState(prevState => ({ isColorPickerOpen: !prevState.isColorPickerOpen }));
    console.log("Toggling color picker:", !this.state.isColorPickerOpen);
  }


  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })

    const storedColor = localStorage.getItem('avatarColor');
    if (storedColor) {
        this.setState({ avatarColor: storedColor });
    }

    
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state;
    const initialLetter = currentUser.username.charAt(0).toUpperCase();


    return (
      <div className="profile-container">
          <div className="avatar-section" onClick={this.toggleColorPicker}>
              <div 
                  className="profile-avatar" 
                  style={{ backgroundColor: this.state.avatarColor }}
              >
                  {initialLetter}
              </div>
              {this.state.isColorPickerOpen && 
                  <div className="color-list">
                      {this.colors.map(color => (
                          <div 
                              key={color} 
                              className="color-option" 
                              style={{ backgroundColor: color }}
                              onClick={() => this.selectColor(color)}
                          ></div>
                      ))}
                  </div>
              }
          </div>
        <div className="info-section">
          <h3 className="profile-title" >
            <strong>{currentUser.username}</strong>'s Profile
          </h3>
          <p><strong>Nom complet:</strong> {currentUser.fullName}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Date de naissance:</strong> {currentUser.birthDate}</p>
          <p><strong>Genre:</strong> {currentUser.gender}</p>
          <p><strong>Numéro de téléphone:</strong> {currentUser.phone}</p>
          <p><strong>Bio:</strong> {currentUser.bio}</p>
          <p><strong>Hobbies:</strong> {currentUser.hobbies}</p>
          <strong>Rôle:</strong>
          <ul>
            {currentUser.roles && currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}