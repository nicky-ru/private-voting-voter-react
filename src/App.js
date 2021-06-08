import React, { Component } from 'react';
import web3 from "./web3";
import privateVoting from "./privateVoting";
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/css/main.css';
import ElectionComponent from "./components/ElectionComponent";
import About from "./components/About";
import SecretPhraseComponent from "./components/SecretPhraseComponent";
import VerificationComponent from "./components/VerificationComponent";
import VotingComponent from "./components/VotingComponent";
import ResultsComponent from "./components/ResultsComponent";

class App extends Component {
  state = {
      currentUser: "",
      workflowStatus: "",
      workflowStatusDescription: "",
      elections: "",
  };

  async componentDidMount() {
      this.startRefreshAccount();
      await this.refreshElectionInformation();
      await this.refreshWorkflowStatus();

      privateVoting.events.WorkflowStatusChangeEvent(async (error, event) => {
          if (!error) {
              await this.refreshWorkflowStatus();
          }
      });

      privateVoting.events.ElectionsRegisteredEvent(async (error, event) => {
          if (!error) {
              await this.refreshElectionInformation();
          }
      });
  }

  refreshAccount = async () => {
    let currentAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);
    if (currentAccount !== this.state.currentUser) {
      this.setState({currentUser: currentAccount});
      console.log("switched accounts " + currentAccount);
    }
  }

  startRefreshAccount = () => {
    setInterval(this.refreshAccount, 1000);
  }

  refreshWorkflowStatus = async () => {
        let workflowStatus = await privateVoting.methods.workflowStatus().call();

        let workflowStatusDescription;

        switch(workflowStatus.toString())
        {
            case '0':
                workflowStatusDescription = "Registering Elections";
                break;
            case '1':
                workflowStatusDescription = "Registering Voters";
                break;
            case '2':
                workflowStatusDescription = "Burn and Retrieve session started";
                // this.showSecretPhraseSection();
                break;
            case '3':
                workflowStatusDescription = "Registering Candidates";
                break;
            case '4':
                workflowStatusDescription = "Generating Verifier";
                break;
            case '5':
                workflowStatusDescription = "Verifying Accounts";
                // this.showVerificationSection();
                break;
            case '6':
                workflowStatusDescription = "Voting session started";
                // this.showVotingSection();
                break;
            case '7':
                workflowStatusDescription = "Voting session ended";
                break;
            case '8':
                workflowStatusDescription = "Votes tallied";
                // this.showResultsSection();
                break;
            default:
                workflowStatusDescription = "Unknown status";
        }

        this.setState({workflowStatus: workflowStatus, workflowStatusDescription: workflowStatusDescription});
    }

  workflowStatusIs = (workflowStatus) => {
      return this.state.workflowStatus === workflowStatus;
  }

  refreshElectionInformation = async () => {
        let elections = await privateVoting.methods.election().call();
        this.setState({elections});
    }

  render() {

    return(
        <div>

            <ElectionComponent
                electionName={this.state.elections[0]}
            />

            <About
                electionDescription={this.state.elections[1]}
                workflowStatusDescription={this.state.workflowStatusDescription}
            />

            <SecretPhraseComponent
                workflowStatus={this.state.workflowStatus}
                currentUser={this.state.currentUser}
            />

            <VerificationComponent
                currentUser={this.state.currentUser}
                workflowStatus={this.state.workflowStatus}
            />

            <VotingComponent
                currentUser={this.state.currentUser}
                workflowStatus={this.state.workflowStatus}
            />

            <ResultsComponent
                workflowStatus={this.state.workflowStatus}
            />

          <footer>
            <div className="container text-center">
              <p>Copyright ©&nbsp;Brand 2021</p>
            </div>
          </footer>

        </div>
    );
  }
}

export default App;

