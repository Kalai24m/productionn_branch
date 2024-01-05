/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
// import axios from "axios";
import MDButton from "components/MDButton/index";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput/index";
import React, { Component } from "react";
import Card from "@mui/material/Card";

class Fileupload extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedFile: null };
    this.onFileChange = this.onFileChange.bind(this);
  }

  // On file select (from the pop up)
  onFileChange(event) {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  }

  // On file upload (click the upload button)
  // eslint-disable-next-line class-methods-use-this
  onFileUpload() {
    // Create an object of formData
    // eslint-disable-next-line no-unused-vars
    const formData = new FormData();

    // Update the formData object
    // formData.append("myFile", this.state.selectedFile, this.state.selectedFile.name);

    // // Details of the uploaded file
    // console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    // axios.post("api/uploadfile", formData);
  }

  // File content to be displayed after
  // file upload is complete
  fileData() {
    if (this.state.selectedFile) {
      return (
        <div>
          <h5>File Details:</h5>

          <h6>File Name: {this.state.selectedFile.name}</h6>

          <h6>File Type: {this.state.selectedFile.type}</h6>

          <h6>Last Modified: {this.state.selectedFile.lastModifiedDate.toDateString()}</h6>
        </div>
      );
    }
    return (
      <div>
        <br />
        <h6>Choose before Pressing the Upload button </h6>
      </div>
    );
  }

  render() {
    return (
      <Card lg={{ height: "100%", width: "100" }}>
        <MDBox
          mb={7}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <MDTypography mt={4} mb={3} variant="caption" color="info" fontWeight="regular">
            <h1>Upload your CSV file</h1>
          </MDTypography>
          <MDBox
            display="flex"
            width="450px"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-evenly"
          >
            <MDInput type="file" accept=".csv" onChange={this.onFileChange} />
            <MDButton type="submit" color="success" onClick={this.onFileUpload}>
              Upload!
            </MDButton>
          </MDBox>
          {this.fileData()}
        </MDBox>
      </Card>
    );
  }
}

export default Fileupload;
