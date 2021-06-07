import React, { Component } from 'react';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/main.css';

class ElectionComponent extends Component {
    render() {
        return(
            <header className="masthead">
                <div className="intro-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h1 className="brand-heading" id="elections-name">{this.props.electionName}</h1>
                                <p className="intro-text" id="elections-description">Your vote is as important as never</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default ElectionComponent;