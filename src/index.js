import React from "react";
import ReactDOM from "react-dom";
import Main from "./js/components/Main.jsx";
import "./css/index.css";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faChartLine,
  faTable,
  faSave,
  faFolder,
  faUpload,
  faCity
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faChartLine,
  faTable,
  faSave,
  faFolder,
  faUpload,
  faCity
);

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<Main />, wrapper) : false;