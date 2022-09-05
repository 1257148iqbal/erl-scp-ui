import {
  CASE_PS_FQ_3041,
  CASE_PS_FQ_3042,
  CASE_PS_FQ_3043,
  CASE_PS_FQ_3044,
  CASE_PS_FQ_3045,
  PS_3039,
  PS_3044,
  PS_POWER,
  PS_WITH_FACTOR,
  PS_WITH_TUIS,
  PS_WITH_TUIS_DEDUCT_15
} from 'constants/PSFormulaNames';

export const getResidureValue = ps => {
  const fq3041Reading = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041).psCalculatedValue
    ? +ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041).psCalculatedValue
    : 0;
  const fq3043Reading = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3043).psCalculatedValue
    ? +ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3043).psCalculatedValue
    : 0;
  const fq3044Reading = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3044).psCalculatedValue
    ? +ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3044).psCalculatedValue
    : 0;
  const fq3045Reading = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3045).psCalculatedValue
    ? +ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3045).psCalculatedValue
    : 0;
  const sum = fq3043Reading + fq3044Reading + fq3045Reading;
  const result = parseInt(+fq3041Reading - sum);
  return result;
};

export const getGetPSCalculatedValue = (
  psFormula,
  currentReading,
  previousReading,
  factor,
  vcf,
  density,
  tuiAverage,
  caseName
) => {
  //console.log({ psFormula, currentReading, previousReading, factor, vcf, density, tuiAverage, caseName });
  switch (psFormula) {
    case PS_WITH_TUIS_DEDUCT_15: {
      if (previousReading === null || previousReading === '' || previousReading === '0') {
        return 0;
      } else {
        const curr = parseFloat(currentReading);
        const prev = parseFloat(previousReading ? previousReading : 0);
        const tuisAvg = parseFloat(tuiAverage ? tuiAverage : 0);
        const fac = parseFloat(factor);
        const psCalculatedValueforFQ3041 = (curr - prev) * fac * Math.sqrt(vcf * density * (1 - 0.0007 * (tuisAvg - 15)));
        return isNaN(psCalculatedValueforFQ3041)
          ? ''
          : caseName === CASE_PS_FQ_3041
          ? parseInt(psCalculatedValueforFQ3041)
          : Number(psCalculatedValueforFQ3041).toFixed(2);
      }
    }

    case PS_WITH_TUIS: {
      if (previousReading === null || previousReading === '' || previousReading === '0') {
        return 0;
      } else {
        const curr = parseFloat(currentReading);
        const prev = parseFloat(previousReading ? previousReading : 0);
        const tuisAvg = parseFloat(tuiAverage ? tuiAverage : 0);
        const fac = parseFloat(factor);
        const psCalculatedValueforFQ3043 = (curr - prev) * fac * Math.sqrt((density - (tuisAvg - 15) * 0.0007) * vcf) - 15;
        return isNaN(psCalculatedValueforFQ3043) ? '' : parseInt(psCalculatedValueforFQ3043);
      }
    }

    case PS_3044: {
      if (previousReading === null || previousReading === '' || previousReading === '0') {
        return 0;
      } else {
        const curr = parseFloat(currentReading);
        const prev = parseFloat(previousReading ? previousReading : 0);
        const psCalculatedValueforFQ3044 = (curr - prev) / 80;
        return isNaN(psCalculatedValueforFQ3044) ? '' : psCalculatedValueforFQ3044.toFixed(2);
      }
    }

    case PS_3039: {
      if (previousReading === null || previousReading === '' || previousReading === '0') {
        return 0;
      } else {
        const curr = parseFloat(currentReading);
        const prev = parseFloat(previousReading ? previousReading : 0);
        const psCalculatedValueforFQ3039 = (curr - prev) * 0.08;
        return isNaN(psCalculatedValueforFQ3039) ? '' : parseInt(psCalculatedValueforFQ3039);
      }
    }

    case PS_WITH_FACTOR:
    case PS_POWER: {
      if (previousReading === null || previousReading === '' || previousReading === '0') {
        return 0;
      } else {
        const curr = parseFloat(currentReading);
        const prev = parseFloat(previousReading ? previousReading : 0);
        const psCalculatedValueforFQ30337 = (curr - prev) * factor;
        return isNaN(psCalculatedValueforFQ30337) ? '' : parseInt(psCalculatedValueforFQ30337);
      }
    }

    default:
      return 0;
  }
};

export const getDeltaTValue = settings => {
  const filteredObjs = settings.dataSheetSetting.filter(
    item => item.displayName === 'Furnace Outlet' || item.displayName === 'Max. Skin Temp.'
  );
  const [obj1, obj2] = filteredObjs;
  const deltaT = obj1.currentReading - obj2.currentReading;
  return Math.abs(deltaT);
};

export const getPercentage = (ps = [], calcValue, caseName) => {
  switch (caseName) {
    case CASE_PS_FQ_3041:
      return '%';
    case CASE_PS_FQ_3042: {
      const { psCalculatedValue } = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041);
      const percentage = ((calcValue / psCalculatedValue) * 100).toFixed(2);
      return !isNaN(percentage) ? percentage : '';
    }
    case CASE_PS_FQ_3043: {
      const { psCalculatedValue } = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041);
      const percentage = ((calcValue / psCalculatedValue) * 100).toFixed(2);
      return !isNaN(percentage) ? percentage : '';
    }
    case CASE_PS_FQ_3044: {
      const { psCalculatedValue } = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041);
      const percentage = ((calcValue / psCalculatedValue) * 100).toFixed(2);
      return !isNaN(percentage) ? percentage : '';
    }
    case CASE_PS_FQ_3045: {
      const { psCalculatedValue } = ps.dataSheetSetting.find(item => item.caseName === CASE_PS_FQ_3041);
      const percentage = ((calcValue / psCalculatedValue) * 100).toFixed(2);
      return !isNaN(percentage) ? percentage : '';
    }

    default:
      return '';
  }
};

/** Change Log
 * 23-April-2022(nasir): tuisAverage and previous value 0 check.
 **/
