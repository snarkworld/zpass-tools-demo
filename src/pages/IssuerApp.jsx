// Imports: Packages, Components, and Contexts
import {useEffect, useState} from "react";
import Issuer from "../components/Issuer";
import { useAccountProvider } from "../contexts/account";
import * as wasm from '../../issuer/pkg/issuer';
import { Card } from "antd";
import {useGlobalProvider} from "../contexts/global.js";

// Main App Component
function IssuerApp() {
  // State & Context: Account and Web Worker
  const { account } = useAccountProvider();
  const { global, setGlobal } = useGlobalProvider();
  const [signature, setSignature] = useState(null);
  const [dobfield, setDOBField] = useState(null);
  const [subjectfield, setSubjectField] = useState(null);
  const [nationalityfield, setNationalityField] = useState(null);
  const [expiryfield, setExpiryField] = useState(null);
  const [isSignatureGenerated, setIsSignatureGenerated] = useState(false);

  function resetState() {
    setNationalityField(null);
    setExpiryField(null);
    setSubjectField(null);
    setDOBField(null);
    setSignature(null);
    setIsSignatureGenerated(false);
    setGlobal({});
  }

  useEffect(() => {
    resetState();
    const privateKey = account ? account.privateKey().to_string() : "";
    const viewKey = account ? account.viewKey().to_string() : "";
    const address = account ? account.address().to_string() : "";
    if (privateKey) setGlobal({ privateKey, viewKey, issuer: address});
  }, [account])

  // Handler: Generate signature using Issuer
  const handleIssuerGenerateSignature = (values) => {
    if (!account) {
      alert('Please select issuer account');
      return;
    }

    // Construct message data

    // debugger

    const subject = values.subject;
    const hash_type = values.hash_type;
    const dob = values.dob.startOf('day').unix() + (values.dob.utcOffset() * 60);
    const nationality = values.nationality;
    const expiry = values.expiry?.startOf('day').unix() + (values.expiry?.utcOffset() * 60);

    setNationalityField(nationality);
    setExpiryField(expiry);
    setSubjectField(subject);
    setDOBField(dob);

    console.log({subject, dob, nationality, expiry});
    const signInboundMessage = new wasm.SignInboundMessage(subject, dob, nationality, expiry);

    console.log(signInboundMessage);

    const {signature, hash} = wasm.sign_message(account.privateKey().to_string(), signInboundMessage, hash_type);

    setSignature(signature);

    setGlobal({...global, ...{
        subject,
        hash_type,
        generated_hash: hash,
        signature,
        dob: dob + "u32",
        nationality: wasm.get_field_from_value(nationality),
        expiry: (expiry ? expiry : 0) + "u32"
      }});


    // Mark signature as generated
    setIsSignatureGenerated(true);
  };

  // Main Render
  return (
    <>
      {/* Main Content */}
      <Card title="Issuer" style={{ margin: '0px 10px 0px 10px' }}>
        <Issuer
          handleIssue={handleIssuerGenerateSignature}
          isSignatureGenerated={isSignatureGenerated}
          generatedSignature={signature}
          dobfield={dobfield}
          setDOBField={setDOBField}
          subjectfield={subjectfield}
          nationalityfield={nationalityfield}
          expiryfield={expiryfield}
          issuer={account}
          global={global}
        />
      </Card>
    </>
  );
}

// Exporting App Component
export default IssuerApp;

