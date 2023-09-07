import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Link } from 'react-router-dom';


export default class BoardCollaborater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getCollaboraterBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
        <div className="container mt-5">
            <div className="mb-5 text-center">
                <h1 className="display-4 text-primary">Collaborater Board</h1>
                <hr className="border-primary" />
            </div>
            <div className="d-flex justify-content-center mt-5">
                <Link to="/view-objective" className="btn btn-primary m-2">View Objective</Link>
                <Link to="/shared-objective" className="btn btn-success m-2">View Shared Objective</Link>
                <Link to="/my-suggest" className="btn btn-warning m-2">View My Suggest</Link>
            </div>
        </div>
    );
}


}