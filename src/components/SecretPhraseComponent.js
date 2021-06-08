import React, { Component } from 'react';
import privateVoting from "../privateVoting";

class SecretPhraseComponent extends Component {
    async componentDidMount() {
        privateVoting.events.AccountBurnedEvent(async (error, event) => {
            document.getElementById("burn-warning").hidden = true;
            document.getElementById("secret-key-result").hidden = false;
        });
    }

    generateSecret = async () => {
        const { randomBytes, createHash } = await import('crypto');
        const hash = createHash('sha256');
        let secretPhraseArr = new Array(4);
        let secretPhrase = '';

        for (let i = 0; i < 4; i++) {
            secretPhraseArr[i] = randomBytes(16);
            // eslint-disable-next-line no-undef
            secretPhrase += '"' + BigInt("0x" + secretPhraseArr[i].toString('hex')) + '",';
        }

        let byteArr64 = Buffer.concat(secretPhraseArr);
        let res_hash = hash.update(byteArr64).digest('hex');
        console.log(res_hash);

        // eslint-disable-next-line no-undef
        let first_uint128 =  BigInt("0x" + res_hash.slice(0, 32));
        console.log(first_uint128);
        console.log(res_hash.slice(0, 32));


        // eslint-disable-next-line no-undef
        let sec_uint128 = BigInt("0x" + res_hash.slice(32, 65));
        console.log(sec_uint128);
        console.log(res_hash.slice(32, 65));

        try {
            document.getElementById("burn-danger").hidden = true;
            document.getElementById("burn-warning").hidden = false;
            await privateVoting.methods.burnAndRetrieve(first_uint128, sec_uint128)
                .send({from: this.props.currentUser, gas: 200000});
        } catch (e) {
            document.getElementById("burn-warning").hidden = true;
            document.getElementById("burn-danger").hidden = false;
        }

        document.getElementById("key-output").value = '[' + secretPhrase.slice(0,-1) + ']';


    }

    render() {
        if (this.props.workflowStatus === "2") {
            return(
                <section className="text-center download-section content-section" id="secret-phrase-section">
                    <div className="container">
                        <div className="col-lg-8 mx-auto">
                            <h1>Get the secret phrase</h1>
                            <p>You should store your secret phrase offline in a secure place.</p>
                            <button className="btn btn-primary btn-lg btn-default" type="button" onClick={this.generateSecret}>Get secret phrase</button>
                            <p className="lead text-uppercase text-warning" id="burn-warning" hidden>processing...</p>
                            <p className="lead text-uppercase text-danger" id="burn-danger" hidden>error retrieving secret phrase</p>
                        </div>
                        <div className="row justify-content-center" id="secret-key-result" hidden>
                            <div className="col-12">
                                <h4>your secret phrase is:</h4>
                            </div>
                            <div className="col d-flex justify-content-center"><input type="text" id="key-output"/>
                                <button className="btn btn-primary" type="button"
                                        onClick={() => {navigator.clipboard.writeText(document.getElementById("key-output").value)}}>copy
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }
        else return(<div/>);
    }
}

export default SecretPhraseComponent;