import React, { Component } from "react";
import UserService from "../services/user.service";
import ObjectiveService from "../services/ObjectiveService";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';


//HomeCollaborater

Modal.setAppElement('#root');  // Initialisez react-modal

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            objectivesWithDeadlines: [],
            statusCounts: {
                OPEN: 0,
                IN_PROGRESS: 0,
                COMPLETED: 0
            },
            allDeadlines: [],
            showModal: false
        };
    }
    componentDidMount() {
        ObjectiveService.getObjectivesStatusCount()
        .then(response => {
          this.setState({ statusCounts: response.data });
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données:", error);
        });
    
        ObjectiveService.getObjectivesDeadlines()
        .then(response => {
            // Convertir l'objet en tableau
            const objectivesArray = Object.values(response.data);
        
            const events = objectivesArray.map(objective => ({
                title: objective.description,
                start: new Date(objective.deadline),
                end: new Date(objective.deadline),
            }));
        
            this.setState({ objectivesWithDeadlines: events });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des objectifs avec deadlines:", error);
        });
        
        
    
    
    
        UserService.getPublicContent().then(
          response => {
            this.setState({
              content: response.data
            });
          },
          error => {
            this.setState({
              content:
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
            });
          }
        );
      }
    

    handleViewAllDeadlines = () => {
        ObjectiveService.getObjectivesDeadlines()
        .then(response => {
            const deadlinesArray = Object.values(response.data);
            this.setState({ allDeadlines: deadlinesArray, showModal: true });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des échéances:", error);
        });
    };

    closeModal = () => {
        this.setState({ showModal: false });
    }
  render() {
    const localizer = momentLocalizer(moment);
  
    return (
        <div className="dashboard">
            <h2 className="section-title">My work</h2>
            <div className="task-section">
            <div className="status-block">
                  <h3>To Do <span>({this.state.statusCounts.OPEN || 0})</span></h3>
              </div>
              <div className="status-block">
                  <h3>In Progress <span>({this.state.statusCounts.IN_PROGRESS || 0})</span></h3>
              </div>
              <div className="status-block">
                  <h3>Completed <span>({this.state.statusCounts.COMPLETED || 0})</span></h3>
              </div>      
            </div>
  
            <h2 className="section-title">Agenda</h2>
            <div className="calendar-section">
             <Calendar
                  localizer={localizer}
                  events={this.state.objectivesWithDeadlines}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "500px" }}
                  eventPropGetter={event => ({
                      style: {
                      }
                  })}
                  components={{
                    event: EventComponent
                }}
              />       
            </div>
            <button className="view-deadline-button" onClick={this.handleViewAllDeadlines}>View all deadlines</button>


            <Modal 
    isOpen={this.state.showModal}
    onRequestClose={this.closeModal}
    contentLabel="Deadlines"
    overlayClassName="react-modal-overlay"
    className="react-modal-content"
>
    <h2 className="modal-title">All Deadlines</h2>
    <button className="close-modal-button" onClick={this.closeModal}>&times;</button>
    <ul className="modal-list">
        {this.state.allDeadlines.map((deadline, index) => (
            <li key={index} className="modal-list-item">{deadline.description} - {new Date(deadline.deadline).toLocaleDateString()}</li>
        ))}
    </ul>
</Modal>

        </div>
    );
  }
  }

const EventComponent = ({ event }) => {
  return (
      <span>
          {event.title}
      </span>
  );
};

