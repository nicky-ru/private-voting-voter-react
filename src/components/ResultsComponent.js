import { Component } from 'react';
import privateVoting from "../privateVoting";

class ResultsComponent extends Component {
    state = {
        winCandidateName: "",
        winCandidateImg: "",
        winCandidateVoteCount: "",
        winCandidatePhotoUrl: "",
    }

    async componentDidMount() {
        await this.showWinningCandidate();
    }

    showWinningCandidate = async () => {
        if (this.props.workflowStatus === "8") {
            let winningCandidate = await privateVoting.methods.getWinningCandidate().call();
            let candidateName = winningCandidate[0];
            let candidatePhoto = winningCandidate[2].split(',');
            let voteCount = winningCandidate[3];

            this.setState({
                winCandidateName: candidateName,
                winCandidatePhotoUrl: candidatePhoto[0],
                winCandidateImg: candidatePhoto[1],
                winCandidateVoteCount: voteCount});
        }
    }

    render() {
        if (this.props.workflowStatus === "8") {
            return(
                <section className="text-center download-section content-section" id="results">
                    <div className="container">
                        <div className="col-lg-8 mx-auto">
                            <h1>the winner is:</h1>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto col-sm-8 col-lg-4">
                                <div className="card bg-dark">
                                    <a href={this.state.winCandidatePhotoUrl}>
                                        <img className="card-img-top w-100 d-block" src={this.state.winCandidateImg} alt={this.state.winCandidateName} border="0" />
                                    </a>
                                    <div className="card-body">
                                        <h4 className="card-title">{this.state.winCandidateName}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-primary">Vote count: {this.state.winCandidateVoteCount}</h1>
                    </div>
                </section>
            );
        }
        else return (<div/>);
    }
}

export default ResultsComponent;