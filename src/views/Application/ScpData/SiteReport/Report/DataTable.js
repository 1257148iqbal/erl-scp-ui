import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  tableContainerHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '10px 5px 10px 20px'
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    margin: '10px 5px 10px 20px'
  },
  tableContainerBox1: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 10px 20px',
    position: 'relative'
  },
  tableContainerBox2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 10px 20px',
    position: 'absolute',
    left: 300,
    top: 39
  },
  tableContainerBox3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 10px 20px',
    position: 'absolute',
    left: 300,
    top: 219
  },
  tableContainerBox4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 10px 20px',
    position: 'absolute',
    left: 300,
    top: 319
  },
  tableContainerBox8: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 10px 20px',
    position: 'absolute',
    left: 295,
    top: 556
  },
  footer: {
    flexDirection: 'row',
    flexGrow: 1,
    margin: '0px 5px 0px 20px'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    display: 'block'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderTop: '1px solid black',
    display: 'block'
  },
  rowContainerBox5: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    display: 'block'
  },
  rowContainerBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px'
  },
  rowContainerBox1Head: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px'
  },
  rowContainerBox2: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px'
  },
  thBox1: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  thBox1Equip: {
    width: '25%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '10px 0px',
    fontSize: 10
  },
  thBox1StandBy: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 10
  },
  th: {
    width: '25%',
    borderTop: '1px solid black',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B5: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '4.5px 8px',
    fontSize: 10
  },
  th_Box05: {
    width: '16%',
    padding: '4.5px 8px',
    fontSize: 10
  },
  th_B6: {
    width: '8%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B6Burner: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B9: {
    width: '12.5%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B8: {
    width: '37.5%',
    borderRight: '1px solid black',
    borderTop: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B10: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  th_B11: {
    width: '16.67%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_sl: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_Left: {
    width: '25%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_LeftBox1: {
    width: '25%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '4.5px 0px',
    textAlign: 'left',
    paddingLeft: '5px',
    fontSize: 10
  },
  row_Top: {
    width: '25%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    borderTop: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B5: {
    width: '14%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B5_Impingment: {
    width: '16%',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B6: {
    width: '8%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    textAlign: 'center',
    fontSize: 10
  },
  borderRightNone: {
    borderRight: 'none'
  },
  row_B6Burner: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B8: {
    width: '37.5%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B9: {
    width: '12.5%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B10: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  row_B11: {
    width: '16.67%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  head: {
    width: '33.33%',
    padding: '4.5px 0px',
    fontSize: 10
  },
  remark: {
    textAlign: 'left'
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row'
  }
});

const DataTable = ({ data }) => {
  const box6 = data.siteReportDetails.filter(section => section.siteSection === 'Box-6');

  return (
    <div>
      <View style={styles.tableContainerHeader}>
        <View style={styles.headerContainer}>
          <Text style={styles.head}>{`DATE: ${formattedDate(data.date)}`}</Text>
          <Text style={styles.head}>{`TIME: ${data.time}`}</Text>
          <Text style={styles.head}>{`GROUP: ${data.operatorGroup ?? ''}`}</Text>
        </View>
      </View>

      <View style={styles.tableContainerBox1}>
        <View style={styles.rowContainerBox1Head}>
          <Text style={styles.thBox1Equip}>EQUIP NO.</Text>
          <Text style={styles.thBox1}>DISCH. PRESS BAR</Text>
          <Text style={styles.thBox1}>AMP/ %STROKE</Text>
          <Text style={styles.thBox1StandBy}>STAND BY</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-1')
          .map((item, index) => (
            <View style={styles.rowContainerBox1} key={index + 1}>
              <Text style={styles.row_LeftBox1}>{item.equipTagDisplayName === 'None' ? ' ' : item.equipTagDisplayName}</Text>
              <Text style={styles.row_sl}>{item.discH_PRESS ? item.discH_PRESS : '-'}</Text>
              <Text style={styles.row_sl}>{item.amP_STROKE ? item.amP_STROKE : '-'}</Text>
              <Text style={styles.row_sl}>{item.standByTagDisplayName === 'None' ? ' ' : item.standByTagDisplayName}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainerBox2}>
        <View style={styles.rowContainerBox2}>
          <Text style={styles.row_Top}>EQUIP NO.</Text>
          <Text style={styles.th}>AMP</Text>
          <Text style={styles.th}>LOUV.%</Text>
          <Text style={styles.th}>STAND BY</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-2')
          .map((item, index) => (
            <View style={styles.rowContainerBox2} key={index + 1}>
              <Text style={styles.row_Left}>{item.equipTagDisplayName ? item.equipTagDisplayName : '-'}</Text>
              <Text style={styles.row_sl}>{item.amp ? item.amp : '-'}</Text>
              <Text style={styles.row_sl}>{item.louv ? item.louv : '-'}</Text>
              <Text style={styles.row_sl}>{item.isStandBy ? 'Yes' : 'No'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainerBox3}>
        <View style={styles.rowContainerBox2}>
          <Text style={styles.row_Top}>EQUIP NO.</Text>
          <Text style={styles.th}>AMP</Text>
          <Text style={styles.th}>LOAD.%</Text>
          <Text style={styles.th}>N2 SEAL</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-3')
          .map((item, index) => (
            <View style={styles.rowContainerBox2} key={index + 1}>
              <Text style={styles.row_Left}>{item.equipTagDisplayName}</Text>
              <Text style={styles.row_sl}>{item.amp ? item.amp : '-'}</Text>
              <Text style={styles.row_sl}>{item.load ? item.load : '-'}</Text>
              <Text style={styles.row_sl}>{item.n2_SEAL ? item.n2_SEAL : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainerBox4}>
        <View style={styles.rowContainerBox2}>
          <Text style={styles.row_Top}>VESSEL</Text>
          <Text style={styles.th}>TIME</Text>
          <Text style={styles.th}>LEVEL CM%</Text>
          <Text style={styles.th}>% SOLN</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-4')
          .map((item, index) => (
            <View style={styles.rowContainerBox2} key={index + 1}>
              <Text style={styles.row_Left}>{item.equipTagDisplayName}</Text>
              <Text style={styles.row_sl}>{item.time ? item.time : '-'}</Text>
              <Text style={styles.row_sl}>{item.leveL_CM ? item.leveL_CM : '-'}</Text>
              <Text style={styles.row_sl}>{item.soln ? item.soln : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainerBox5}>
          <Text style={styles.th_B5}>HIC-3003 %READ</Text>
          <Text style={styles.th_B5}>HIC-3023 %READ</Text>
          <Text style={styles.th_B5}>DRAFT MM W.C.</Text>
          <Text style={styles.th_B5}>NO. OF BURNER</Text>
          <Text style={styles.th_B5}>NO. OF PILOT</Text>
          <Text style={styles.th_B5}>FLAME COLOR</Text>
          <Text style={styles.th_Box05}>IMPINGEMENT</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-5')
          .map((item, index) => (
            <View style={styles.rowContainer} key={index + 1}>
              <Text style={styles.row_B5}>{item.hiC_3003 ? item.hiC_3003 : '-'}</Text>
              <Text style={styles.row_B5}>{item.hiC_3023 ? item.hiC_3023 : '-'}</Text>
              <Text style={styles.row_B5}>{item.drafT_MM_WC ? item.drafT_MM_WC : '-'}</Text>
              <Text style={styles.row_B5}>{item.noOfBurner ? item.noOfBurner : '-'}</Text>
              <Text style={styles.row_B5}>{item.noOfPilot ? item.noOfPilot : '-'}</Text>
              <Text style={styles.row_B5}>{item.flameColor ? item.flameColor : '-'}</Text>
              <Text style={styles.row_B5_Impingment}>{item.impingement ? item.impingement : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainerBox5}>
          <Text style={styles.th_B6Burner}>BURNER</Text>
          <Text style={styles.th_B6}>01</Text>
          <Text style={styles.th_B6}>02</Text>
          <Text style={styles.th_B6}>03</Text>
          <Text style={styles.th_B6}>04</Text>
          <Text style={styles.th_B6}>05</Text>
          <Text style={styles.th_B6}>06</Text>
          <Text style={styles.th_B6}>07</Text>
          <Text style={styles.th_B6}>08</Text>
          <Text style={styles.th_B6}>09</Text>
          <Text style={styles.th_B6}>10</Text>
        </View>

        {box6.map((item, index) => (
          <View style={styles.rowContainer} key={index + 1}>
            <Text style={styles.row_B6Burner}>{item.equipTagDisplayName}</Text>
            <Text style={styles.row_B6}>{item.burner_1 ? item.burner_1 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_2 ? item.burner_2 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_3 ? item.burner_3 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_4 ? item.burner_4 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_5 ? item.burner_5 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_6 ? item.burner_6 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_7 ? item.burner_7 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_8 ? item.burner_8 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_9 ? item.burner_9 : '-'}</Text>
            <Text style={styles.row_B6}>{item.burner_10 ? item.burner_10 : '-'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tableContainerBox1}>
        <View style={styles.rowContainerBox1}>
          <Text style={styles.row_Top}>EQUIP.</Text>
          <Text style={styles.th}>SUC.BAR</Text>
          <Text style={styles.th}>DISC.BAR</Text>
          <Text style={styles.th}>STAND BY</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-7')
          .map((item, index) => (
            <View style={styles.rowContainerBox1} key={index + 1}>
              <Text style={styles.row_Left}>{item.equipTagDisplayName}</Text>
              <Text style={styles.row_sl}>{item.suC_BAR ? item.suC_BAR : '-'}</Text>
              <Text style={styles.row_sl}>{item.disC_BAR ? item.disC_BAR : '-'}</Text>
              <Text style={styles.row_sl}>{item.standByTagDisplayName}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainerBox8}>
        <View style={styles.rowContainerBox2}>
          <Text style={styles.row_Top}>EQUIP.</Text>
          <Text style={styles.th_B8}>OIL LEVEL</Text>
          <Text style={styles.th_B8}>CW FLOW</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-8')
          .map((item, index) => (
            <View style={styles.rowContainerBox2} key={index + 1}>
              <Text style={styles.row_Left}>{item.equipTagDisplayName}</Text>
              <Text style={styles.row_B8}>{item.oiL_LEVEL ? item.oiL_LEVEL : '-'}</Text>
              <Text style={styles.row_B8}>{item.cW_FLOW ? item.cW_FLOW : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.th_B9}>EQUIP.</Text>
          <Text style={styles.th_B9}>1ST D. TEMP.</Text>
          <Text style={styles.th_B9}>2ND D. TEMP.</Text>
          <Text style={styles.th_B9}>OIL PRESS</Text>
          <Text style={styles.th_B9}>OIL LEVEL</Text>
          <Text style={styles.th_B9}>CW FLOW</Text>
          <Text style={styles.th_B9}>STAND BY</Text>
          <Text style={styles.th_B9}>AUTO</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-9')
          .map((item, index) => (
            <View style={styles.rowContainer} key={index + 1}>
              <Text style={styles.row_B9}>{`${item.equipTagDisplayName}-${item.equipCondition}`}</Text>
              <Text style={styles.row_B9}>{item.temP_1ST_D ? item.temP_1ST_D : '-'}</Text>
              <Text style={styles.row_B9}>{item.temP_2ND_D}</Text>
              <Text style={styles.row_B9}>{item.oiL_PRES ? item.oiL_PRES : '-'}</Text>
              <Text style={styles.row_B9}>{item.oiL_LEVEL ? item.oiL_LEVEL : '-'}</Text>
              <Text style={styles.row_B9}>{item.cW_FLOW ? item.cW_FLOW : '-'}</Text>
              <Text style={styles.row_B9}>{`${item.standByTagDisplayName}-${item.standByCondition}`}</Text>
              <Text style={styles.row_B9}>{item.auto ? item.auto : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.th_B10}>PIT LEVEL%</Text>
          <Text style={styles.th_B10}>PUMP IN AUTO</Text>
          <Text style={styles.th_B10}>STAND BY</Text>
          <Text style={styles.th_B10}>OIL CHAM. LEVEL%</Text>
          <Text style={styles.th_B10}>GA-6062 POSITION</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-10')
          .map((item, index) => (
            <View style={styles.rowContainer} key={index + 1}>
              <Text style={styles.row_B10}>{item.piT_LEVEL ? item.piT_LEVEL : '-'}</Text>
              <Text style={styles.row_B10}>{`${item.equipTagDisplayName}-${item.equipCondition}`}</Text>
              <Text style={styles.row_B10}>{`${item.standByTagDisplayName}-${item.standByCondition}`}</Text>
              <Text style={styles.row_B10}>{item.oiL_CHAM_LEVEL ? item.oiL_CHAM_LEVEL : '-'}</Text>
              <Text style={styles.row_B10}>{item.gA_6062_POSITION ? item.gA_6062_POSITION : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.th_B11}>B-6067 LEVEL</Text>
          <Text style={styles.th_B11}>PUMP IN AUTO</Text>
          <Text style={styles.th_B11}>STAND BY</Text>
          <Text style={styles.th_B11}>SEAL WATER</Text>
          <Text style={styles.th_B11}>STEAM</Text>
          <Text style={styles.th_B11}>PILOT GAS BAR.</Text>
        </View>

        {data.siteReportDetails
          .filter(section => section.siteSection === 'Box-11')
          .map((item, index) => (
            <View style={styles.rowContainer} key={index + 1}>
              <Text style={styles.th_B11}>{item.b_6071_LEVEL ? item.b_6071_LEVEL : '-'}</Text>
              <Text style={styles.th_B11}>{`${item.equipTagDisplayName}-${item.equipCondition}`}</Text>
              <Text style={styles.th_B11}>{`${item.standByTagDisplayName}-${item.standByCondition}`}</Text>
              <Text style={styles.th_B11}>{item.seaL_WATER ? item.seaL_WATER : '-'}</Text>
              <Text style={styles.th_B11}>{item.steam ? item.steam : '-'}</Text>
              <Text style={styles.th_B11}>{item.piloT_GAS_BAR ? item.piloT_GAS_BAR : '-'}</Text>
            </View>
          ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.remark}>{`Remarks : ${data.remark}`}</Text>
      </View>

      <View style={styles.tableRow}>
        <View
          style={{
            fontSize: 9,
            paddingTop: 80,
            left: 460
          }}>
          <Text style={{ borderTop: '1px solid black' }}>SIGN. OF OPERATOR </Text>
        </View>
      </View>
    </div>
  );
};

export default DataTable;
