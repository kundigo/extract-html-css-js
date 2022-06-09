import moment from "moment";
import {Utils} from "k-utils-js";

const suggestShipmentDateMinFromFuturesDateForCrystalSugar150Br = (futuresDateString, todayString) => {
  let futuresDate = moment.utc(futuresDateString);
  let year = futuresDate.year();
  let today = moment.utc(todayString);

  if (futuresDate.month() !== 2) {
    return futuresDateString
  } else if (today >= moment.utc({year: year, month: 1, day: 10})) {
    return futuresDateString
  } else if (today >= moment.utc({year: year, month: 0, day: 10})) {
    return moment({year: year, month: 1, day: 1}).format('YYYY-MM-DD');
  } else {
    return moment({year: year, month: 0, day: 1}).format('YYYY-MM-DD');
  }
};

const suggestShipmentDateMinFromFuturesDate = (futuresDateString, state, commodityType) => {
  let result;
  const interest = state.values.interest;
  // early exit it trading interest is persisted
  if (interest.is_persisted || interest.is_counter) {
    return undefined
  }

  // early exit it futures date is blank
  if (Utils.isBlank(futuresDateString)) {
    return undefined
  }

  // early exit if shipmentDateMin field has been focused
  const {touched} = state
  const shipmentDateMinTouched = touched.interest &&
    touched.interest.shipment_date_min
  if (shipmentDateMinTouched) {
    return undefined
  }

  result = futuresDateString

  // apply exception rule for futures date from march for crystal_sugar150_br
  if (commodityType === 'crystal_sugar150_br') {
    result = suggestShipmentDateMinFromFuturesDateForCrystalSugar150Br(result, moment.utc().format('YYYY-MM-DD'));
  }

  // exit if future shipmentDateMin would stay the

  if (result === interest.shipment_date_min) {
    return undefined
  }

  return result;
};

const suggestShipmentDateMaxFromShipmentDateMin = (futureShipmentDateMin, form, commodityType) => {
  let result, min, max;
  const interest = form.values.interest
  // early exit it trading interest is persisted
  if (interest.is_persisted || interest.is_counter) {
    return undefined
  }

  // exit if futureShipmentDateMin is blank
  if (Utils.isBlank(futureShipmentDateMin)) {
    return undefined
  }

  // exit if futureShipmentDateMin is not iso
  if (!Utils.dateHasIsoFormat(futureShipmentDateMin)) {
    return undefined
  }

  // early exit if shipmentDateMax field has been focused
  const {touched} = form
  const shipmentDateMaxTouched = touched.interest &&
    touched.interest.shipment_date_max
  if (shipmentDateMaxTouched) {
    return undefined
  }

  min = moment(futureShipmentDateMin, "YYYY-MM-DD");
  switch (commodityType) {
    case 'crystal_sugar150_br':

      const min_day = min.format('DD') // Extract the day out of the date.
      const DAY_IS_THE_15TH = '15'

      if (min_day === DAY_IS_THE_15TH) {
        max = min.add(1, 'months') // The 15th day of the following month from the futureShipmentDateMin.
      } else {
        max = min.add(1, 'months').subtract(1, 'days');
      }

      break;
    case 'raw_sugar_th_hipol':
      max = min.add(2, 'months').add(14, 'days');
      break;
    default:
      max = min.add(1, 'months').subtract(1, 'days');
      break;
  }

  result = max.format('YYYY-MM-DD');

  // exit if future shipmentDateMax would stay the same
  if (result === interest.shipment_date_max) {
    return undefined
  }

  return result;
};

const inferYearFromShipmentDateMin = (shipmentDateMinString, commodityType) => {
  let year, result, shipmentDateMin;

  // exit if this is not the right commodity
  if (commodityType !== 'crystal_sugar150_br') {
    return undefined;
  }

  // exit if futureShipmentDateMin is blank
  if (Utils.isBlank(shipmentDateMinString)) {
    return undefined
  }

  // exit if futureShipmentDateMin is not iso
  if (!Utils.dateHasIsoFormat(shipmentDateMinString)) {
    return undefined
  }

  shipmentDateMin = moment.utc(shipmentDateMinString);

  year = shipmentDateMin.year();

  if (shipmentDateMin <= moment.utc({year: year, month: 3, day: 30})) {
    result = year;
  } else {
    result = (year + 1);
  }

  return result;
};

const tradingFormPlugin = store => {

  store.subscribeAction({
    before: (action, state) => {
      if (action.type !== 'update' ) {
        return
      };

      if (!state.values.interest) {
        return
      };

      let path = action.payload.name.replace('[', '.').replace(']','')
      const { commodity_type: commodityType } = state.values.interest;
      const  {value: futureValue } = action.payload

      if('interest.quality' === path && 'exotic_sugar' === commodityType) {
        const currentValue = state.values.interest.quality;
        // 45ic => refined sugar => LDN5
        // any other value => non refined sugar => NY11
        if (currentValue !== futureValue && (currentValue === '45ic' || futureValue === "45ic" )) {
          // we need to reset the futures values
          store.dispatch('update', {
            value: '',
            name: 'interest.futures_date'
          })
        }
      }

      if('interest.incoterms' === path && 'exotic_sugar' === commodityType) {
        const currentValue = state.values.interest.incoterms;
        // CFR =>  port_of_departure must be reset
        // otherwise => port_of_arrival must be reset
        if (currentValue === "CFR" ) {
          store.dispatch('update', {
            value: null,
            name: 'interest.port_of_departure_id'
          })
        } else {
          store.dispatch('update', {
            value: null,
            name: 'interest.port_of_arrival_id'
          })
        }
      }

      if('interest.futures_date' === path && 'exotic_sugar' === commodityType) {
        if (futureValue === "FIXED" ) {
          store.dispatch('update', {
            value: true,
            name: 'interest.fixed_price'
          })
        } else {
          store.dispatch('update', {
            value: false,
            name: 'interest.fixed_price'
          })
        }
      }
    },
    after: (action, state) => {
      //console.log("after action", action)
    }

  })
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.

    if (mutation.type !== 'setValue' ) {
      return
    };

    if (!state.values.interest) {
      return
    };

    let path = mutation.payload.name.replace('[', '.').replace(']','')
    const { commodity_type: commodityType } = state.values.interest;
    const  {value: futureValue } = mutation.payload

    if('interest.futures_date' === path && futureValue !== 'FIXED') {
      const suggestedShipmentDateMin = suggestShipmentDateMinFromFuturesDate(futureValue, state, commodityType)
      if (!Utils.isBlank(suggestedShipmentDateMin)) {
        store.dispatch('update', {
          value: suggestedShipmentDateMin,
          name: 'interest.shipment_date_min'
        })
      }
    }

    if('interest.shipment_date_min' === path) {
      const suggestedShipmentDateMax = suggestShipmentDateMaxFromShipmentDateMin(futureValue, state, commodityType);
      if (!Utils.isBlank(suggestedShipmentDateMax)) {
        store.dispatch('update', {
          value: suggestedShipmentDateMax,
          name: 'interest.shipment_date_max'
        })
      }

      const inferredYearFromShipmentDateMin = inferYearFromShipmentDateMin(futureValue, commodityType);
      if (!Utils.isBlank(inferredYearFromShipmentDateMin)) {
        store.dispatch('update', {
          value: inferredYearFromShipmentDateMin,
          name: 'interest.year'
        })
      }
    }
  })
}
export default tradingFormPlugin