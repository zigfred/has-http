import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function getUri() {
  return cookies.get('restUri') || '';
}


const provider = {
  getDataPoints: function() {
    return axios.get(getUri() + "/dataPoints");
  },
  addDataPoint: function(data) {
    return axios.post(getUri() + "/dataPoints", data);
  },
  updateDataPoint: function(_id, data) {
    return axios.put(getUri() + "/dataPoints/" + _id, data);
  },


  getDataPointTypes: function() {
    return axios.get(getUri() + "/dataPointTypes");
  },
  addDataPointType: function(data) {
    return axios.post(getUri() + "/dataPointTypes", data);
  },
  updateDataPointType: function(_id, data) {
    return axios.put(getUri() + "/dataPointTypes/" + _id, data);
  },
  deleteDataPointType: function(_id) {
    return axios.delete(getUri() + "/dataPointTypes/" + _id);
  },


  getArduinos: function() {
    return axios.get(getUri() + "/arduinos");
  },
  addArduino: function(data) {
    return axios.post(getUri() + "/arduinos", data);
  },
  updateArduino: function(_id, data) {
    return axios.put(getUri() + "/arduinos/" + _id, data);
  },

  getSettings: function() {
    return axios.get(getUri() + "/settings");
  },
  updateSettings: function(data) {
    return axios.put(getUri() + "/settings", data);
  },

  getFilter: function(filter) {
    return axios.get(getUri() + "/filters/" + filter);
  },
  deleteFilter: function(filter) {
    return axios.delete(getUri() + "/filters/" + filter);
  },
  saveFilters: function(data) {
    return axios.post(getUri() + "/filters", data);
  },
  getFilters: function() {
    return axios.get(getUri() + "/filters");
  },

  getCollectorsData: function(data) {
    return axios.post(getUri() + "/collector", data);
  }
};


export default provider;