import _ from 'lodash';

export class HeaterCommandPresenter {
  static create(state) {
    return new HeaterCommandPresenter(state);
  }
  constructor(state) {
    this.state = {
      alias: state.alias,
      enabled: state.enabled || false,
      skynet: state.skynet || false,
      periods: state.periods || [],
      heaters: state.heaters
    };

  }

  setCommand(command) {
    const convertedCommand = this._convertCommand(command)

    this.state = {
      alias: command.alias,
      enabled: command.enabled || false,
      skynet: command.settings.skynet || false,
      periods: convertedCommand.settings.periods,
      heaters: command.settings.heaters
    };
    return this;
  }

  toCommand() {
    return {
      enabled: this.isEnabled(),
      alias: this.getAlias(),
      settings: {
        periods: this.getPeriods(),
        heaters: this.getHeaters(),
        skynet: this.getSkynet()
      }
    }
  }

  toState() {
    this._calcHeatForPeriods();
    this._calcCostForPeriods();

    return {
      ...this.state,
      isInvalidPeriod: this.isInvalidPeriod(),
      isInvalidHeaterSwitcher: this.isInvalidHeaterSwitcher(),
      isNotOptimal: this.isNotOptimal(),
      totalHeat: this.calcTotalHeat(),
      totalCost: this.calcTotalCost()
    };
  }

  isEnabled() {
    return this.state.enabled;
  }

  getSkynet() {
    return this.state.skynet;
  }

  getAlias() {
    return this.state.alias;
  }

  getPeriods() {
    const { periods } = this.state;

    return periods.map(period => {
      return {
        startTime: period.startTime.toISOString(),
        stopTime: period.stopTime.toISOString(),
        run: period.run,
        heaterSwitcher: period.heaterSwitcher
      }
    })
  }

  getHeaters() {
    return this.state.heaters || [];
  }

  isInvalidPeriod() {
    return this._validatePeriods();
  }

  isInvalidHeaterSwitcher() {
    return this._validateHeaterSwitcher();
  }

  isNotOptimal() {
    return this._validateOptimalPeriods();
  }


  updatePeriod(data, index) {
    this.state.periods[index] = data;

    return this;
  }

  removePeriod(index) {
    if (!this.state.periods[index]) {
      return;
    }
    this.state.periods.splice(index, 1);

    return this;
  }

  addPeriod() {
    this.state.periods.push({
      startTime: new Date(),
      stopTime: new Date(),
      heaterSwitcher: this.state.heaters.map(() => 1),
      run: true
    });

    return this;
  }

  updateHeaters(data) {
    this.state.heaters = data;
    return this;
  }

  removeHeater(index) {
    if (!this.state.heaters[index]) {
      return;
    }
    this.state.heaters.splice(index, 1);

    const { periods } = this.state;

    this.state.periods = periods.map(period => {
      const newHeaterSwitcher = [...period.heaterSwitcher];
      newHeaterSwitcher.splice(index, 1)
      return {
        ...period,
        heaterSwitcher: newHeaterSwitcher
      }
    });

    return this;
  }

  addHeater(power) {
    this.state.heaters.push(power);

    const { periods } = this.state;
    this.state.periods = periods.map(period => {
      return {
        ...period,
        heaterSwitcher: [...period.heaterSwitcher, false]
      }
    });

    return this;
  }

  toggleSkynet() {
    this.state.skynet = !this.state.skynet;
    return this;
  }

  toggleEnabled() {
    this.state.enabled = !this.state.enabled;
    return this;
  }

  isModified(serverState) {
    if (!serverState) {
      return false;
    }

    const command = this.toCommand();

    delete serverState._id;
    delete serverState.isManualMode;

    return !_.isEqual(serverState, command);
  }

  _validateHeaterSwitcher() {
    const { periods } = this.state;
    if (!periods) {
      return true;
    }

    return periods.some(period => {
      const { heaterSwitcher, run } = period;
      if (!heaterSwitcher) {
        return false;
      }
      const isAnyHeaterEnabled = heaterSwitcher.some(heater => heater);

      return !run && isAnyHeaterEnabled;
    });
  }

  _validatePeriods() {
    const { periods } = this.state;
    if (!periods) {
      return true;
    }

    return periods.some(period => this._validatePeriod(period));
  }

  _validatePeriod(period) {
    const { startTime, stopTime } = period;

    return !startTime || !stopTime || startTime >= stopTime;
  }

  _validateOptimalPeriods() {
    const { periods } = this.state;
    if (!periods) {
      return true;
    }

    return periods.some(period => this._validateOptimalPeriod(period));
  }

  _validateOptimalPeriod(period) {
    const isInvalid = this._validatePeriod(period);
    if (isInvalid) {
      return false;
    }

    const { startTime, stopTime } = period;

    const startHours = startTime.getHours();
    const isStartInNotOptimal = [8, 9, 10, 20, 21].includes(startHours);
    const stopHours = stopTime.getHours();
    const stopMinutes = stopTime.getMinutes();
    const isStopInNotOptimal = [9, 10, 21].includes(stopHours)
      || ([8, 20].includes(stopHours) && stopMinutes > 0)
      || startHours < 8 && stopHours > 8
      || startHours < 20 && stopHours > 20;

    return isStartInNotOptimal || isStopInNotOptimal;
  }

  _convertCommand(command) {
    let periods = [];

    if (command.settings && command.settings.periods) {
      periods = command.settings.periods.map(period => {
        const { startTime, stopTime } = period;
        return {
          startTime: new Date(startTime),
          stopTime: new Date(stopTime),
          run: period.run,
          heaterSwitcher: period.heaterSwitcher || [],
          heat: this._calcHeatForPeriod(period),
          cost: this._calcCostForPeriod(period)
        }
      });
    }

    return {
      ...command,
      settings: {
        ...command.settings,
        periods
      }
    };
  }

  _calcHeatForPeriods() {
    this.state.periods = this.state.periods.map(period => {
      return {
        ...period,
        heat: this._calcHeatForPeriod(period)
      }
    });
  }

  // TODO: range intersections - add validation
  _calcHeatForPeriod(period) {
    const isInvalid = this._validatePeriod(period);
    if (isInvalid) {
      return false;
    }

    const { heaters } = this.state;
    const { startTime, stopTime, run, heaterSwitcher } = period;

    if (!run || !heaterSwitcher.some(switcher => switcher)) {
      return false;
    }

    const startTimeDate = new Date(startTime);
    const stopTimeDate = new Date(stopTime);
    const startMinute = startTimeDate.getHours() * 60 + startTimeDate.getMinutes();
    const stopMinute = stopTimeDate.getHours() * 60 + stopTimeDate.getMinutes();
    const hours = (stopMinute - startMinute) / 60;

    const power = heaters.reduce((memo, power, index) => {
      return memo + (heaterSwitcher[index] ? power / 1000 : 0);
    }, 0);

    let heat = hours * power;
    heat = heat.toFixed(2);

    return heat;
  }

  _calcCostForPeriods() {
    this.state.periods = this.state.periods.map(period => {
      return {
        ...period,
        cost: this._calcCostForPeriod(period)
      }
    });
  }

  // TODO: range intersections - add validation
  _calcCostForPeriod(period) {
    const ONE_MINUTE_KW_COST = 2.64 / 60;

    const isInvalid = this._validatePeriod(period);
    if (isInvalid) {
      return false;
    }

    const { heaters } = this.state;
    const { startTime, stopTime, run, heaterSwitcher } = period;

    if (!run || !heaterSwitcher.some(switcher => switcher)) {
      return false;
    }

    const startTimeDate = new Date(startTime);
    const stopTimeDate = new Date(stopTime);

    // 0-7 0.4 0-420
      // 7-8 1 420-480
        // 8-10 1.5 480-600
      // 10-20 1 600-1200
        // 20-23 1.5 1200-1380
    // 23-0 0.4 1380-1440

    const startMinute = startTimeDate.getHours() * 60 + startTimeDate.getMinutes();
    const stopMinute = stopTimeDate.getHours() * 60 + stopTimeDate.getMinutes();

    let modNight = 0;
    let modNormal = 0;
    let modPeak = 0;

    for (let minute = startMinute; minute < stopMinute; minute++) {
      switch (true) {
        case (inNightRange(minute)): modNight++; break;
        case (inNormalRange(minute)): modNormal++; break;
        case (inPeakRange(minute)): modPeak++; break;
      }
    }

    function inNightRange(minute) {
      return (0 <= minute && minute < 420) || (1380 <= minute && minute < 1440);
    }
    function inNormalRange(minute) {
      return (420 <= minute && minute < 480) || (600 <= minute && minute < 1200);
    }
    function inPeakRange(minute) {
      return (480 <= minute && minute < 600) || (1200 <= minute && minute < 1380);
    }


    let cost = modNight * ONE_MINUTE_KW_COST * 0.4;
    cost += modNormal * ONE_MINUTE_KW_COST;
    cost += modPeak * ONE_MINUTE_KW_COST * 1.5;


    const power = heaters.reduce((memo, power, index) => {
      return memo + (heaterSwitcher[index] ? power / 1000 : 0);
    }, 0);

    cost = cost * power;
    cost = cost.toFixed(2);

    return cost;
  }

  calcTotalHeat() {
    const total = this.state.periods.reduce((memo, period) => {
      return memo + (parseFloat(period.heat) || 0);
    }, 0);
    return total.toFixed(2);
  }

  calcTotalCost() {
    const total = this.state.periods.reduce((memo, period) => {
      return memo + (parseFloat(period.cost) || 0);
    }, 0);
    return total.toFixed(2);
  }

}
