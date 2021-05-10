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
    return axios.get("/", { timeout: 2000 });
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

  bwControl: {

    get: function (data) {
      return axios.get("/projects/bwControl", data);
    },
    set: function (data) {
      return axios.post("/projects/bwControl", data);
    }
  },

  command: {
    getCommand: function (alias) {
      return axios.get("/projects/command/" + alias);
    },
    setCommand: function (data) {
      return axios.post("/projects/command", data);
    },
  },

  // TODO: use getCollectorData endpoint
  brControl: {
    getData: function () {
      return axios.get("/projects/brControl/data");
    }
  },

  bdControl: {
    getData: function () {
      return axios.get("/projects/bdControl/data");
    }
  },

  wf: {
    owm: {
      getData: function () {
        return axios.get("/wf/owm");
      }
    }
  }
};


export default provider;