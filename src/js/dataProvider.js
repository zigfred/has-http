import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

axios.defaults.baseURL = cookies.get("restUri");

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  console.log(error);
  return Promise.reject(error);
});

const provider = {
  heartbeat: function() {
    return axios.get("/");
  },

  getDataPoints: function() {
    return axios.get("/dataPoints");
  },
  addDataPoint: function(data) {
    return axios.post("/dataPoints", data);
  },
  updateDataPoint: function(_id, data) {
    return axios.put("/dataPoints/" + _id, data);
  },


  getDataPointTypes: function() {
    return axios.get("/dataPointTypes");
  },
  addDataPointType: function(data) {
    return axios.post("/dataPointTypes", data);
  },
  updateDataPointType: function(_id, data) {
    return axios.put("/dataPointTypes/" + _id, data);
  },
  deleteDataPointType: function(_id) {
    return axios.delete("/dataPointTypes/" + _id);
  },


  getArduinos: function() {
    return axios.get("/arduinos");
  },
  addArduino: function(data) {
    return axios.post("/arduinos", data);
  },
  updateArduino: function(_id, data) {
    return axios.put("/arduinos/" + _id, data);
  },

  getSettings: function() {
    return axios.get("/settings");
  },
  updateSettings: function(data) {
    return axios.put("/settings", data);
  },

  getFilter: function(filter) {
    return axios.get("/filters/" + filter);
  },
  deleteFilter: function(filter) {
    return axios.delete("/filters/" + filter);
  },
  saveFilters: function(data) {
    return axios.post("/filters", data);
  },
  getFilters: function() {
    return axios.get("/filters");
  },

  getCollectorsData: function(data) {
    return axios.post("/collector", data);
  },

  getProject1: function (data) {
    return axios.get("/projects/project1", data);
  },

  project2: {

    get: function (data) {
      return axios.get("/projects/project2", data);
    },
    set: function (data) {
      return axios.post("/projects/project2", data);
    }
  },

  brControl: {
    get: function () {
      return axios.get("/projects/brControl");
    },
    set: function (data) {
      return axios.post("/projects/brControl", data);
    },
  }
};


export default provider;