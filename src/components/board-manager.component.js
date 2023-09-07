import React, { Component } from "react";

import UserService from "../services/user.service";
import { Link } from 'react-router-dom';
import EventBus  from '../common/EventBus';

export default class BoardManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getManagerBoard().then(
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
                <h1 className="display-4 text-primary">Manager Board</h1>
                <hr className="border-primary" />
            </div>
            <div className="d-flex justify-content-center mt-5">
                <Link to="/collaborators" className="btn btn-primary m-2">View Collaborators</Link>
                <Link to="/suggestions" className="btn btn-success m-2">View Suggestions</Link>
                <Link to="/objectives" className="btn btn-warning m-2">View Objectives</Link>
            </div>
        </div>
    );
}
}

