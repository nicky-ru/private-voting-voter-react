import React, { Component } from 'react';
import privateVoting from "../privateVoting";
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/main.css';

class VotingComponent extends Component {
    state = {
        candidates: "",
        numOfCandidates: 3,
    }

    async componentDidMount() {
        const numOfCandidates = await privateVoting.methods.getCandidateNumber().call();
        this.setState({numOfCandidates});
        await this.showCandidates();

        privateVoting.events.VotedEvent(async (error, event) => {
            document.getElementById("voting-warning").hidden = true;
            if (!error) {
                document.getElementById("voting-primary").hidden = false;
            }
            else document.getElementById("voting-danger").hidden = false;
        });
    }

    showCandidates = async () => {
        let names = [];
        let mottos = [];
        let photoUrls = [];
        let imgs = [];
        let candidate;
        let candidates = [];

        for (let i = 0; i < this.state.numOfCandidates; i++) {
            candidate = await privateVoting.methods.getCandidate(i).call();
            names.push(candidate[0]);
            mottos.push(candidate[1]);
            photoUrls.push(candidate[2].split(',')[0]);
            imgs.push(candidate[2].split(',')[1]);
            candidates.push(
                <div className="col">
                    <div className="card bg-dark">
                        <a href={photoUrls[i]}>
                            <img className="card-img-top w-100 d-block" src={imgs[i]} alt={names[i]} border="0" />
                        </a>
                        <div className="card-body">
                            <h4 className="card-title">{names[i]}</h4>
                            <p className="card-text">{mottos[i]}</p>
                            <button className="btn btn-primary" type="button" value={i} onClick={this.vote}>vote</button>
                        </div>
                    </div>
                </div>
            );
        }
        this.setState({candidates: candidates});
    }

    vote = async (event) => {
        document.getElementById("voting-danger").hidden = true;
        document.getElementById("voting-warning").hidden = true;
        document.getElementById("voting-primary").hidden = true;

        event.preventDefault();

        try {
            document.getElementById("voting-warning").hidden = false;
            await privateVoting.methods.vote(event.target.value).send({from: this.props.currentUser, gas: 100000});
        } catch (e) {
            document.getElementById("voting-warning").hidden = true;
            document.getElementById("voting-danger").hidden = false;
        }
    }

    render() {
        if (this.props.workflowStatus === "6") {
            return(
                <section className="text-center download-section content-section" id="voting-section">
                    <div className="container">
                        <div className="col-lg-8 mx-auto">
                            <h1>vote for your favorite candidate</h1>
                            <p>One verified account can vote only once, be careful.</p>
                        </div>
                        <div className="row row-cols-1 row-cols-md-3">

                            {this.state.candidates}

                        </div>
                    </div>
                    <p className="lead text-uppercase text-warning" id="voting-warning" hidden>processing...</p>
                    <p className="lead text-uppercase text-primary" id="voting-primary" hidden>your vote has been submitted</p>
                    <p className="lead text-uppercase text-danger" id="voting-danger" hidden>your vote could not be submitted</p>
                </section>
            );
        }
        else return (<div/>);
    }
}

export default VotingComponent;