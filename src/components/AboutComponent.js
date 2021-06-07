import React, { Component } from 'react';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/main.css';

class AboutComponent extends Component {
    render() {
        return(
            <section className="text-center content-section" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2>about current elections</h2>
                            <p>{this.props.electionDescription}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2>current session:</h2>
                            <p className="lead text-uppercase text-primary">{this.props.workflowStatusDescription}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default AboutComponent;