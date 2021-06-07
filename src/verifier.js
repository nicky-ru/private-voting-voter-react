import web3 from "./web3";
import { VerifierAbi } from "./verifierAbi";

const address = "0xa340115540Cd87c4c8Bf90459C89736198E9ecE7";

export default new web3.eth.Contract(VerifierAbi, address);