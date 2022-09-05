import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 250,
    borderWidth: 1,
    margin: '0px 0px 0px 10px'
  },
  tableContainerInCharge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 250,
    borderTop: '1px solid black',
    margin: '0px 0px 10px 0px'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1
  },
  footer: {
    flexDirection: 'row',
    flexGrow: 1,
    margin: '20px 10px 0px 20px'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },

  rowContainer_header: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },
  viscosity: {
    fontSize: 13,
    width: '9.1%',
    left: 356.4,
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    padding: '5px 0px'
  },
  astm_distillation: {
    fontSize: 13,
    width: '31.56%',
    left: 399.4,
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    padding: '5px 0px'
  },
  stability: {
    fontSize: 13,
    width: '12.4%',
    left: 410,
    borderRight: '1px solid black',
    padding: '5px 0px'
  },
  th: {
    width: '4.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 8
  },
  ppc: {
    width: '4.5%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 8,
    borderTop: '0px'
  },
  th_before: {
    width: '4.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_sl: {
    width: '4.2%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_viscosity50: {
    width: '3.9%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_viscosity100: {
    width: '4.5%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_IBP: {
    width: '3.9%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_5: {
    width: '3.8%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_10: {
    width: '4.3%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_50: {
    width: '4.4%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_95: {
    width: '4.4%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  row_FR5: {
    width: '6.3%',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  bswBefore: {
    width: '6.7%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  bswAfter: {
    width: '5.8%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  bswReport: {
    width: '4%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  waterTest: {
    width: '100%',
    fontSize: 12,
    padding: '12px 0px'
  },
  td_water: {
    width: '7%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  unit_water: {
    width: '7%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  td_sampleName: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '5px 5px',
    fontSize: 8,
    textAlign: 'left',
    borderTop: '1px solid black'
  },
  shift_in_Charge: {
    width: '23%',
    fontSize: 8,
    top: 70
  },
  sampleName_lrv: {
    width: '12%',
    borderRight: '1px solid black',
    padding: '5px 5px',
    fontSize: 8,
    textAlign: 'left',
    borderTop: '1px solid black'
  },
  th_sampleName_lrv: {
    width: '13%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 8
  },
  unit_lrv: {
    width: '4.3%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  },
  th_unit_lrv: {
    width: '6%',
    borderRight: '1px solid black',
    padding: '10.5px 0px',
    fontSize: 8
  },
  density: {
    width: '6.3%',
    borderRight: '1px solid black',
    padding: '5px 0px',
    fontSize: 8,
    borderTop: '1px solid black'
  }
});

const BORDER_1 = '1px solid black';

const LrvDataTable = ({ data }) => {
  const lrvUnit = data.labReportDetails.filter(({ labUnitName }) => labUnitName === 'lrv');
  return (
    <div style={{ margin: '0px 10px' }}>
      {/* Table Head */}

      <View style={styles.tableContainer}>
        <View
          style={{
            borderRight: BORDER_1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4.3%',
            fontSize: 8
          }}>
          <Text>Unit</Text>
        </View>

        <View
          style={{
            borderRight: BORDER_1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '12%',
            fontSize: 8
          }}>
          <Text style={{ padding: '5px 10px' }}>Sample</Text>
        </View>

        <View
          style={{
            borderRight: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '6.3%',
            textAlign: 'center',
            fontSize: 9
          }}>
          <Text>Density at 15 C</Text>
        </View>

        <View
          style={{
            borderRight: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4.2%',
            fontSize: 8
          }}>
          <Text>RVP psi</Text>
        </View>

        <View
          style={{
            borderRight: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4.2%',
            fontSize: 8
          }}>
          <Text>Color ASTM</Text>
        </View>

        <View
          style={{
            borderRight: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4.2%',
            fontSize: 8
          }}>
          <Text style={{ padding: '5px 10px' }}>FP</Text>
        </View>

        <View style={{ width: '8.4%', flexDirection: 'column', borderRight: BORDER_1 }}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: BORDER_1 }}>
            <Text style={{ padding: '5px 10px', fontSize: 8 }}>Viscosity</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', height: 45.5 }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: BORDER_1
              }}>
              <Text style={{ padding: '5px 5px', fontSize: 8 }}>{'50 \u00b0C'}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text style={{ padding: '5px 5px', fontSize: 8 }}>{'100\u00b0C'}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '4.2%',
            borderRight: '1px solid black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'PP\u00b0C'}</Text>
        </View>

        <View style={{ width: '29.4%', flexDirection: 'column', borderRight: BORDER_1 }}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: BORDER_1 }}>
            <Text style={{ padding: '5px 10px', fontSize: 8 }}>ASTM Distalation</Text>
          </View>
          <View style={{ width: '100%', flexDirection: 'row', height: 45.5 }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: BORDER_1
              }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>IBP</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: BORDER_1 }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'5\u00b0C'}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: BORDER_1 }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'10\u00b0C'}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: BORDER_1 }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'50\u00b0C'}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: BORDER_1 }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'90\u00b0C'}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: BORDER_1 }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>{'95\u00b0C'}</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ padding: '5px 10px', fontSize: 8 }}>FBP</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '16.5%', flexDirection: 'column', borderRight: BORDER_1 }}>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: BORDER_1 }}>
            <Text style={{ padding: '5px 10px', fontSize: 8 }}>Stability (UOP)</Text>
          </View>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: BORDER_1 }}>
            <Text style={{ padding: '5px 10px', fontSize: 8 }}>BSW</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: BORDER_1,
                width: '90px'
              }}>
              <Text style={{ padding: '8.5px 2px', fontSize: 8 }}>Before Oxid.</Text>
            </View>
            <View
              style={{
                width: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: BORDER_1
              }}>
              <Text style={{ padding: '8.5px 2px', fontSize: 8 }}>After Oxid.</Text>
            </View>
            <View style={{ width: '52px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ padding: '8.5px 2px', fontSize: 8 }}>Report</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '6.3%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
          <Text
            style={{
              fontSize: 9
            }}>
            FR-5 %xylene
          </Text>
        </View>

        {lrvUnit.map((item, index) => (
          <View key={item.id} style={styles.rowContainer}>
            <View style={styles.unit_lrv}>
              <Text>{item.labUnitName.toUpperCase()}</Text>
            </View>

            <View style={styles.sampleName_lrv}>
              <Text>{item.testSampleName}</Text>
            </View>

            <View style={styles.density}>
              <Text>{item.density}</Text>
            </View>

            <Text style={styles.row_sl}>{item.rvP_psi ? item.rvP_psi : '-'}</Text>
            <Text style={styles.row_sl}>{item.colour_ASTM ? item.colour_ASTM : '-'}</Text>
            <Text style={styles.row_sl}>{item.fp ? item.fp : '-'}</Text>
            <Text style={styles.row_viscosity50}>{item.viscosity50 ? item.viscosity50 : '-'}</Text>
            <Text style={styles.row_viscosity100}>{item.viscosity100 ? item.viscosity100 : '-'}</Text>
            <Text style={styles.row_sl}>{item.ppInC ? item.ppInC : '-'}</Text>
            <Text style={styles.row_IBP}>{item.astM_Distillation_IBP ? item.astM_Distillation_IBP : '-'}</Text>
            <Text style={styles.row_5}>{item.astM_Distillation_5 ? item.astM_Distillation_5 : '-'}</Text>
            <Text style={styles.row_10}>{item.astM_Distillation_10 ? item.astM_Distillation_10 : '-'}</Text>
            <Text style={styles.row_50}>{item.astM_Distillation_50 ? item.astM_Distillation_50 : '-'}</Text>
            <Text style={styles.row_50}>{item.astM_Distillation_90 ? item.astM_Distillation_90 : '-'}</Text>
            <Text style={styles.row_95}>{item.astM_Distillation_95 ? item.astM_Distillation_95 : '-'}</Text>
            <Text style={styles.row_sl}>{item.astM_Distillation_FBP ? item.astM_Distillation_FBP : '-'}</Text>
            <Text style={styles.bswBefore}>{item.uoP_BSW_FBP_Before ? item.uoP_BSW_FBP_Before : '-'}</Text>
            <Text style={styles.bswAfter}>{item.uoP_BSW_FBP_After ? item.uoP_BSW_FBP_After : '-'}</Text>
            <Text style={styles.bswReport}>{item.uoP_BSW_FBP_Report ? item.uoP_BSW_FBP_Report : '-'}</Text>
            <Text style={styles.row_FR5}>{item.fR_5 ? item.fR_5 : '-'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.waterTest}>WATER TEST</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.unit_water}>UNIT</Text>
          <Text style={styles.td_sampleName}>Sample</Text>
          <Text style={styles.td_water}>pH</Text>
          <Text style={styles.td_water}>COND µS</Text>
          <Text style={styles.td_water}>TDS ppm</Text>
          <Text style={styles.td_water}>TA ppm</Text>
          <Text style={styles.td_water}>TAC ppm</Text>
          <Text style={styles.td_water}>NaCl ppm</Text>
          <Text style={styles.td_water}>H2S ppm</Text>
          <Text style={styles.td_water}>NH3 ppm</Text>
          <View style={styles.tableContainerInCharge}>
            <Text style={styles.shift_in_Charge}>SHIFT IN CHARGE</Text>
          </View>
        </View>

        {data.labReportDetails
          .filter(unit => unit.labUnitName === 'water')
          .map((item, index) => (
            <View style={styles.rowContainer} key={index + 1}>
              <Text style={styles.unit_water}>WATER</Text>
              <Text style={styles.td_sampleName}>{item.testSampleName}</Text>
              <Text style={styles.td_water}>{item.ph ? item.ph : '-'}</Text>
              <Text style={styles.td_water}>{item.cond ? item.cond : '-'}</Text>
              <Text style={styles.td_water}>{item.tds ? item.tds : '-'}</Text>
              <Text style={styles.td_water}>{item.ta ? item.ta : '-'}</Text>
              <Text style={styles.td_water}>{item.tac ? item.tac : '-'}</Text>
              <Text style={styles.td_water}>{item.naCI ? item.naCI : '-'}</Text>
              <Text style={styles.td_water}>{item.h2S ? item.h2S : '-'}</Text>
              <Text style={styles.td_water}>{item.nH3 ? item.nH3 : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.waterTest}>Distribution: DGM (SCP), AGM (SCP), SCP Control Room.</Text>
      </View>
    </div>
  );
};

export default LrvDataTable;
