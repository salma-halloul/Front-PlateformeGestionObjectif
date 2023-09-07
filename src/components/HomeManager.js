import React, { Component } from 'react';
import Calendar from 'react-calendar';  
import Chart from 'react-apexcharts';   
import SuggestionService from "../services/SuggestionService";
import ObjectiveService from "../services/ObjectiveService";
import ReactApexChart from 'react-apexcharts';



export default class HomeManager extends Component {
  state = {
    suggestionsCount: 0,
    objectives: [],
    calendarEvents: [],
    chartData: {
        options: {
          labels: ['To Do', 'In Progress', 'Completed'],
        },
        series: [0, 0, 0],  
      }
    
  }

  componentDidMount() {
    SuggestionService.getAllSuggestions()
    .then(response => {
        this.setState({
            suggestionsCount: response.data.length
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des suggestions:", error);
    });

    ObjectiveService.getAllObjectives()
            .then(response => {
                this.setState({
                    objectives: response.data
                });
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des objectifs:", error);
    });
    
    ObjectiveService.getObjectivesStatusCount()
    .then(response => {
        const { OPEN, IN_PROGRESS, COMPLETED } = response.data;
        this.setState(prevState => ({
            chartData: {
                ...prevState.chartData,
                series: [OPEN, IN_PROGRESS, COMPLETED]
            }
        }));
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des counts:", error);
    });

    
    
 }

  render() {
    return (
     <div className="manager-home">
       <div className="left-content">
          <section className="suggestion-section">
             <h2>Suggestion Request</h2>
             <div className="suggestions-count">{this.state.suggestionsCount}</div>
           </section>


           <section>
              <h2>Objectives Table</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Percentage</th>
                            <th>Collaborater Owner</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.objectives.map(objective => (
                            <tr key={objective.id}>
                                <td>{objective.description}</td>
                                <td>{objective.percentage}</td>
                                <td>{objective.owner.username}</td>
                                <td data-status={objective.status}>{objective.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Objectives Status Chart</h2>
                <div className="row">
                    <div className="mixed-chart">
                       <Chart 
                        options={this.state.chartData.options}
                        series={this.state.chartData.series}
                        type="pie"
                        width="380"
                       />
                    </div>
                </div>
            </section>
        </div>

        <section className="calendar-section1">
          <h2>Calendar</h2>
          <Calendar />
          <button className="add-meeting-btn">Add Meeting</button>
        </section>


      </div>
    )
  }
}
