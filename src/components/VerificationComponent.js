import React, { Component } from 'react';
import privateVoting from "../privateVoting";
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/css/main.css';
import verifier from "../verifier";

class VerificationComponent extends Component {
    state = {
        proof: "",
    }

    async componentDidMount() {
        privateVoting.events.VoterVerifiedEvent(async (error, event) => {
            document.getElementById("verification-warning").hidden = true;

            if (!error) {
                document.getElementById('verification-primary').hidden = false;
            }
            else {
                document.getElementById('verification-danger').hidden = false;
                console.log(error);
            }
        });
    }

    setProof = (event) => {
        this.setState({proof: event.target.value});
    }

    verify = async (event) => {
        event.preventDefault();

        let keys = this.state.proof.split('"');

        let a = [keys[1], keys[3]];
        let b = [ [keys[5], keys[7]], [keys[9], keys[11]] ];
        let c = [keys[13], keys[15]];
        let input = [keys[17]];

        console.log(a);
        console.log(b);
        console.log(c);
        console.log(input);

        document.getElementById("verification-warning").hidden = false;
        document.getElementById("verification-primary").hidden = true;
        document.getElementById("verification-danger").hidden = true;

        // let res = await verifier.methods.verifyTx(a, b, c, input).call();
        // console.log(res);

        try {
            await privateVoting.methods.verifyAccount(a, b, c, input)
                .send({from: this.props.currentUser, gas: 500000});
        } catch (e) {
            document.getElementById("verification-warning").hidden = true;
            document.getElementById('verification-danger').hidden = false;
        }
    }

    render() {
        if (this.props.workflowStatus === "5") {
            return(
                <section className="text-center download-section content-section" id="verification-section">
                    <div className="container">
                        <div className="col-lg-8 mx-auto">
                            <h1>Verify your new eth address</h1>
                            <p>Enter your generated proof here</p>
                            <form>
                                <div className="col">
                                    <input className="form-control" type="text" placeholder="E.g. [&quot;0x2e79...001&quot;]" onChange={this.setProof}/>
                                </div>
                                <button className="btn btn-primary btn-lg btn-default" type="button" onClick={this.verify}>
                                    verify
                                </button>
                            </form>
                            <p className="lead text-uppercase text-warning" id="verification-warning" hidden>processing...</p>
                            <p className="lead text-uppercase text-primary" id="verification-primary" hidden>your account has been verified</p>
                            <p className="lead text-uppercase text-danger" id="verification-danger" hidden>your account could not be verified</p>
                        </div>
                    </div>
                </section>
            );
        }
        else return (<div/>);
    }
}

export default VerificationComponent;