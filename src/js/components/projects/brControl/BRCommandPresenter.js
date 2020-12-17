export class BRCommandPresenter {
  static create(state) {
    return new BRCommandPresenter(state);
  }
  constructor(state) {
    this.state = {
      enabled: state.commandEnabled || false,
      periods: state.periods || []
    };

  }

  setCommand(command) {
    const convertedCommand = this._convertCommand(command)

    this.state = {
      enabled: command.enabled || false,
      periods: convertedCommand.settings.periods
    };
    return this;
  }

  toCommand() {
    return {
      enabled: this.isEnabled(),
      alias: 'br',
      settings: {
        periods: this.getPeriods()
      }
    }
  }

  toState() {
    return {
      commandEnabled: this.isEnabled(),
      periods: this.getPeriods(),
      isInvalid: this.isInvalid(),
      isNotOptimal: this.isNotOptimal()
    };
  }

  isEnabled() {
    return this.state.enabled;
  }

  getPeriods() {
    return this.state.periods;
  }

  isInvalid() {
    return this._validatePeriods();
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
      startTime: null,
      stopTime: null
    });

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

    return JSON.stringify(serverState) !== JSON.stringify(command);
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
    const isStartInNotOptimal = [8, 9, 20, 21, 22].includes(startHours);
    const stopHours = stopTime.getHours();
    const stopMinutes = stopTime.getMinutes();
    const isStopInNotOptimal = [9, 21, 22].includes(stopHours)
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
          stopTime: new Date(stopTime)
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
}