import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import down from 'assets/images/down.png';
import running from 'assets/images/running.png';
import up from 'assets/images/up.png';
import _ from 'lodash';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import '../Styles/icon.css';

const styles = StyleSheet.create({
  tableContainerHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '5px 5px 10px 10px'
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    margin: '10px 5px 10px 20px'
  },
  tableContainerFeed: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 5px 5px',
    position: 'relative',
    width: '100%'
  },
  tableContainerNaptha: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 5px 5px',
    position: 'absolute',
    left: 153,
    width: '83%'
  },
  tableContainerGasOil: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 5px 5px',
    position: 'absolute',
    left: 283,
    width: '85%'
  },
  tableContainerResidue: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 100,
    margin: '0px 0px 5px 5px',
    position: 'absolute',
    left: 418,
    width: '85%'
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

  rowContainerFeedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px',
    width: '25%'
  },
  rowContainerNapthHead: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px',
    width: '25%'
  },
  rowContainerResidueHead: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 300px 0px 0px',
    width: '30%'
  },
  rowContainerNapthaHead: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 2,
    borderBottom: '1px solid black',
    display: 'block',
    margin: '0px 400px 0px 0px',
    width: '25%'
  },

  thBox1: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '4.5px 0px',
    fontSize: 10
  },
  feedName: {
    width: '30%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 8
  },
  NapthaName: {
    width: '40%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 8
  },
  gasOilName: {
    width: '50%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 8
  },
  resudueName: {
    width: '50%',
    borderRight: '1px solid black',
    borderLeft: '1px solid black',
    padding: '2px 5px',
    textAlign: 'left',
    fontSize: 8
  },
  feedReading: {
    width: '70%',
    borderRight: '1px solid black',
    padding: '2px 0px',
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 8
  },
  sectionFeed: {
    width: '25%',
    fontSize: 11,
    textAlign: 'left',
    paddingLeft: 60,
    border: '1px solid black'
  },
  sectionGasOil: {
    width: '25%',
    fontSize: 11,
    textAlign: 'left',
    paddingLeft: 40,
    border: '1px solid black'
  },
  sectionNaptha: {
    width: '25%',
    fontSize: 11,
    textAlign: 'left',
    paddingLeft: 40,
    border: '1px solid black'
  },
  sectionResidue: {
    width: '30%',
    fontSize: 11,
    textAlign: 'left',
    paddingLeft: 50,
    border: '1px solid black'
  },
  thBox1StandBy: {
    width: '25%',
    borderRight: '1px solid black',
    padding: '10px 0px',
    fontSize: 10
  },

  head: {
    width: '33.33%',
    padding: '4.5px 0px',
    fontSize: 10
  },
  imageContainer: {
    position: 'relative',
    color: 'green',
    margin: '15px 0',
    backgroundColor: 'rgba(30, 78, 124, 0.2)',
    fontSize: 9,
    fontWeight: '600'
  },
  image: {
    padding: 5,
    position: 'relative'
  },
  fileOneti04Left: { position: 'absolute', left: '33.5%', top: '13%' },
  fileOneti04Right: { position: 'absolute', left: '59.5%', top: '13%' },
  fileOnefic02: { position: 'absolute', left: '17%', top: '12%' },
  fileOnefic01: { position: 'absolute', left: '83%', top: '12%' },
  fileOnepi02: { position: 'absolute', left: '68.5%', top: '12%' },
  fileOnepi03: { position: 'absolute', left: '27%', top: '8%' },
  fileOnet05: { position: 'absolute', left: '63.5%', top: '49%' },
  fileOnet06: { position: 'absolute', left: '34%', top: '49%' },
  fileOnepi06: { position: 'absolute', left: '91%', top: '80%' },
  fileOnepi07: { position: 'absolute', left: '5%', top: '77%' },
  fileOnet07: { position: 'absolute', left: '86%', top: '80%' },
  fileOnet08: { position: 'absolute', left: '14.5%', top: '75%' },
  fileOnet09: { position: 'absolute', left: '80%', top: '80%' },
  fileOnepic19: { position: 'absolute', left: '37%', top: '80%' },
  fileOneo2: { position: 'absolute', left: '48%', top: '4.5%' },
  fileOnet10: { position: 'absolute', left: '58%', top: '70%' },
  fileOnet11: { position: 'absolute', left: '59.5%', top: '59%' },
  fileOnet12: { position: 'absolute', left: '35%', top: '70%' },
  fileOnet13: { position: 'absolute', left: '35%', top: '58%' },
  fileOnet14: { position: 'absolute', left: '50%', top: '50%' },
  fileOnet15: { position: 'absolute', left: '41%', top: '50%' },
  fileOnet64: { position: 'absolute', left: '51%', top: '34%' },
  fileOnet65: { position: 'absolute', left: '41.5%', top: '34%' },
  fileOneft37: { position: 'absolute', left: '30%', top: '81%' },
  fileOnestrokePass1: { position: 'absolute', left: '84%', top: '28%' },
  fileOnestrokePass2: { position: 'absolute', left: '13%', top: '28%' },
  fileOnehic03: { position: 'absolute', left: '50.5%', top: '13%' },
  fileOnehic23: { position: 'absolute', left: '44%', top: '13%' },
  fileOnepi52: { position: 'absolute', left: '48%', top: '42%' },
  fileOnefuelType: {
    position: 'absolute',
    left: '9%',
    top: '90%',
    width: 200,
    fontSize: 8
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  tableBox1Header: {
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    width: '33.34%',
    textAlign: 'center',
    padding: '2px 0px',
    fontSize: 8
  },
  tableBox1Row: {
    borderRight: '1px solid black',
    width: '33.34%',
    textAlign: 'center',
    padding: '2px 0px',
    fontSize: 8
  },
  Box1: {
    border: '1px solid black',
    width: '23%'
  },
  Box2: {
    border: '1px solid black',
    width: '50%',
    position: 'absolute',
    left: 138
  },
  Box3: {
    border: '1px solid black',
    width: '25%',
    position: 'absolute',
    left: 430
  },
  Box4: {
    border: '1px solid black',
    width: '23%',
    top: 12
  },
  Box5: {
    border: '1px solid black',
    width: '50%',
    position: 'absolute',
    left: 138,
    top: 12
  },
  Box6: {
    border: '1px solid black',
    width: '25%',
    position: 'absolute',
    left: 430,
    top: 12
  },
  Box7: {
    border: '1px solid black',
    width: '23%',
    top: 15
  },
  Box8: {
    border: '1px solid black',
    width: '50%',
    position: 'absolute',
    left: 138,
    top: 15
  },
  Box9: {
    border: '1px solid black',
    width: '25%',
    position: 'absolute',
    left: 430,
    top: 15
  },
  Box10: {
    border: '1px solid black',
    width: '49%',
    top: 25
  },

  Box12: {
    border: '1px solid black',
    width: '23%',
    position: 'absolute',
    top: 570
  },
  tableHead: {
    width: '33.34%',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    padding: '2px 0px',
    textAlign: 'center'
  },
  tableTr: {
    width: '33.34%',
    borderRight: '1px solid black',
    padding: '2px 0px',
    textAlign: 'center'
  },
  rowBox10: {
    flexDirection: 'row',
    textAlign: 'center',
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
    display: 'block'
  },
  thBox10Button: {
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
    width: '25%',
    padding: '2px 0px',
    fontSize: 8
  },
  thBox10: {
    borderRight: '1px solid black',
    width: '25%',
    padding: '2px 0px',
    fontSize: 8
  },
  jobDescription: {
    border: '1px solid black',
    width: '100%',
    position: 'absolute',
    top: 730
  },
  remarks: {
    flexDirection: 'row',
    flexGrow: 1,
    position: 'absolute',
    top: 748
  },
  remark: {
    textAlign: 'left',
    fontSize: 9,
    padding: '5px 15px'
  },
  colorRed: {
    color: 'red'
  }
});

const icons = {
  Up: up,
  Down: down,
  Running: running
};

const DataTable = ({ data }) => {
  const FEED = data.shiftReportDetails.filter(section => section.shiftSection === 'FEED');
  const NAPHTHA = data.shiftReportDetails.filter(section => section.shiftSection === 'NAPHTHA');
  const GAS_OIL = data.shiftReportDetails.filter(section => section.shiftSection === 'GAS_OIL');
  const RESIDUE = data.shiftReportDetails.filter(section => section.shiftSection === 'RESIDUE');
  const File1 = data.shiftReportDetails.filter(item => item.shiftSection === 'File-1');
  const box1 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-1');
  const box2 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-2');
  const box3 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-3');
  const box4 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-4');
  const box5 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-5');
  const box6 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-6');
  const box7 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-7');
  const box8 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-8');
  const box9 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-9');
  const box10 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-10');
  const box11 = data.shiftReportDetails.filter(section => section.shiftSection === 'Box-11');

  const getMaxTag = data => {
    const filteredTag = data.filter(
      item => item.name === 'T-10' || item.name === 'T-11' || item.name === 'T-12' || item.name === 'T-13'
    );
    const readings = filteredTag.map(item => item.reading);
    const maxReading = Math.max(...readings);
    const maxReadingObj = filteredTag.find(item => item.reading === maxReading.toString());
    return maxReadingObj ? maxReadingObj : { name: 'no-matched-tag' };
  };

  return (
    <div style={{ margin: '0px 5px 0px 12px' }}>
      <View style={styles.tableContainerHeader}>
        <View style={styles.headerContainer}>
          <Text style={styles.head}>{`DATE : ${formattedDate(data.date)}`}</Text>
          <Text style={styles.head}>{`TIME : ${data.time}`}</Text>
          <Text style={styles.head}>{`SHIFT : ${data.shiftName}`}</Text>
          <Text style={styles.head}>{`GROUP : ${data.operatorGroup ? data.operatorGroup : ''}`}</Text>
          <Text style={styles.head}>{`Status : ${data.status ? data.status : ''}`}</Text>
        </View>
      </View>

      <View style={{ width: '100%' }}>
        <View style={styles.tableContainerFeed}>
          <Text style={styles.sectionFeed}>FEED</Text>
          {_.sortBy(FEED, ['sortOrder']).map(feed => {
            const _item = feed;
            let text;
            if (_item.getAutoReading) {
              text = (
                <Text style={styles.feedReading}>
                  {/* {` : ${feed.reading ?? '-'} ${feed.unitName ? getSign(feed.unitName) : ''}`} */}
                  {feed.reading === '0' || feed.reading === 0 || feed.reading === ''
                    ? '-'
                    : `${feed.reading} ${feed.unitName ? getSign(feed.unitName) : ''}`}
                </Text>
              );
            } else if (feed.name === 'TYPE') {
              text = <Text style={styles.feedReading}>{feed.reading ? feed.reading : '-'}</Text>;
            } else if (feed.name === 'TANK') {
              const reading = JSON.parse(feed.reading);
              text = (
                <Text style={styles.feedReading}>
                  {reading.map((item, idx) => (
                    <View key={idx + 1}>
                      <Text>{`${item.tank} :`}</Text>
                      <Text>
                        <Image src={icons[item.symbol]} />
                      </Text>
                      {idx < reading.length - 1 && <Text style={{ fontWeight: 900 }}>{` + `} </Text>}
                    </View>
                  ))}
                </Text>
              );
            }
            return (
              <View style={styles.rowContainerFeedHead} key={feed.id}>
                <Text style={styles.feedName}>{feed.name}</Text>
                {text}
              </View>
            );
          })}
        </View>

        <View style={styles.tableContainerNaptha}>
          <Text style={styles.sectionNaptha}>NAPTHA</Text>
          {_.sortBy(NAPHTHA, ['sortOrder']).map(n => {
            const _item = n;
            let text;
            if (_item.getAutoReading) {
              text = (
                <Text style={styles.feedReading}>
                  {n.reading === '0' || n.reading === 0 || n.reading === '' ? '-' : `${n.reading} ${getSign(n.unitName)}`}
                </Text>
              );
            }
            return (
              <View style={styles.rowContainerNapthHead} key={n.id}>
                <Text style={styles.NapthaName}>{n.name}</Text>
                {text}
              </View>
            );
          })}
        </View>

        <View style={styles.tableContainerGasOil}>
          <Text style={styles.sectionGasOil}>Gas Oil</Text>

          {_.sortBy(GAS_OIL, ['sortOrder']).map(gas => {
            let text;
            switch (gas.name) {
              case 'EP':
              case '90%':
                if (gas.reading > 0) {
                  text = (
                    <Text style={styles.feedReading}>
                      {gas.reading === '0' || gas.reading === 0 || gas.reading === ''
                        ? ' '
                        : ` > ${gas.reading} ${gas.unitName ? getSign(gas.unitName) : ''}`}
                    </Text>
                  );
                } else {
                  text = (
                    <Text style={styles.feedReading}>
                      {gas.reading === '0' || gas.reading === 0 || gas.reading === ''
                        ? '-'
                        : `${gas.reading} ${getSign(gas.unitName)}`}
                    </Text>
                  );
                }
                break;

              default:
                text = (
                  <Text style={styles.feedReading}>
                    {gas.reading === '0' || gas.reading === 0 || gas.reading === ''
                      ? '-'
                      : `${gas.reading} ${getSign(gas.unitName)}`}
                  </Text>
                );
            }

            return (
              <View style={styles.rowContainerFeedHead} key={gas.id}>
                <Text style={styles.gasOilName}>{gas.name}</Text>
                {text}
              </View>
            );
          })}
        </View>

        <View style={styles.tableContainerResidue}>
          <Text style={styles.sectionResidue}>RESIDUE</Text>
          {_.sortBy(RESIDUE, ['sortOrder']).map(residue => {
            const _item = residue;
            let text;
            if (_item.getAutoReading) {
              text = (
                <Text style={styles.feedReading}>
                  {residue.reading === '0' || residue.reading === 0 || residue.reading === ''
                    ? '-'
                    : `${residue.reading} ${getSign(residue.unitName)}`}
                </Text>
              );
            } else if (residue.name === 'STABILITY') {
              text = <Text style={styles.feedReading}>{`${residue.reading ? residue.reading : '-'}`}</Text>;
            }
            return (
              <View style={styles.rowContainerResidueHead} key={residue.id}>
                <Text style={styles.resudueName}>{residue.name}</Text>
                {text}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image style={styles.image} src="/images/ShiftImage01.jpg" />

        {File1.map((item, index, sourceFile1) => {
          return (
            <>
              <Text style={styles.fileOneti04Left}>{item.name === 'TI-04' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOneti04Right}>{item.name === 'TI-04' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnefic01}>{item.name === 'FIC-01' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnefic02}> {item.name === 'FIC-02' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnepi02}>{item.name === 'PI-02' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnepi03}>{item.name === 'PI-03' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnet05}> {item.name === 'T-05' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnet06}>{item.name === 'T-06' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnepi06}>{item.name === 'PI-06' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnepi07}> {item.name === 'PI-07' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnet07}>{item.name === 'T-07' ? item.reading ?? '-' : ''}</Text>
              <Text style={styles.fileOnet08}>{item.name === 'T-08' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnet09}> {item.name === 'T-09' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnepic19}>{item.name === 'PIC-19' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOneo2}>{item.name === '%O2' ? item.reading ?? 0 : ''}</Text>

              <Text
                style={
                  item.name === getMaxTag(sourceFile1).name
                    ? { ...styles.fileOnet10, ...styles.colorRed }
                    : { ...styles.fileOnet10 }
                }>
                {item.name === 'T-10' ? item.reading ?? 0 : ''}
              </Text>
              <Text
                style={
                  item.name === getMaxTag(sourceFile1).name
                    ? { ...styles.fileOnet11, ...styles.colorRed }
                    : { ...styles.fileOnet11 }
                }>
                {item.name === 'T-11' ? item.reading ?? 0 : ''}
              </Text>
              <Text
                style={
                  item.name === getMaxTag(sourceFile1).name
                    ? { ...styles.fileOnet12, ...styles.colorRed }
                    : { ...styles.fileOnet12 }
                }>
                {item.name === 'T-12' ? item.reading ?? 0 : ''}
              </Text>
              <Text
                style={
                  item.name === getMaxTag(sourceFile1).name
                    ? { ...styles.fileOnet13, ...styles.colorRed }
                    : { ...styles.fileOnet13 }
                }>
                {item.name === 'T-13' ? item.reading ?? 0 : ''}
              </Text>

              <Text style={styles.fileOnet14}>{item.name === 'T-14' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnet15}> {item.name === 'T-15' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnet64}> {item.name === 'T-64' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnet65}> {item.name === 'T-65' ? item.reading ?? 0 : ''}</Text>

              <Text style={styles.fileOneft37}> {item.name === 'FT-37' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnestrokePass1}>
                {item.name === '%STROKE_PASS-1' ? `${item.reading} x ${item.reading}` ?? 0 : ''}
              </Text>
              <Text style={styles.fileOnestrokePass2}>
                {item.name === '%STROKE_PASS-2' ? `${item.reading} x ${item.reading}` ?? 0 : ''}
              </Text>
              <Text style={styles.fileOnehic03}> {item.name === 'HIC-03' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnehic23}> {item.name === 'HIC-23' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnepi52}>{item.name === 'PI-52' ? item.reading ?? 0 : ''}</Text>
              <Text style={styles.fileOnefuelType}>{item.name === 'FUEL TYPE' ? item.reading ?? 0 : ''}</Text>
            </>
          );
        })}
      </View>

      <View style={{ fontSize: 11, paddingBottom: 5 }}>
        <Text>COLUMN DA-3001/DA-3002/DA-3004:</Text>
      </View>

      <View>
        <View style={styles.Box1}>
          <View style={styles.tableRow}>
            {_.sortBy(box1, ['sortOrder']).map(b1 => (
              <View style={styles.tableBox1Header} key={b1.id}>
                <Text>{b1.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box1, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box2}>
          <View style={styles.tableRow}>
            {_.sortBy(box2, ['sortOrder']).map(b2 => (
              <View style={styles.tableBox1Header} key={b2.id}>
                <Text>{b2.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box2, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box3}>
          <View style={styles.tableRow}>
            {_.sortBy(box3, ['sortOrder']).map(b3 => (
              <View style={styles.tableBox1Header} key={b3.id}>
                <Text>{b3.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box3, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View>
        <View style={styles.Box4}>
          <View style={styles.tableRow}>
            {_.sortBy(box4, ['sortOrder']).map(b4 => (
              <View style={styles.tableBox1Header} key={b4.id}>
                <Text>{b4.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box4, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box5}>
          <View style={styles.tableRow}>
            {_.sortBy(box5, ['sortOrder']).map(b5 => (
              <View style={styles.tableBox1Header} key={b5.id}>
                <Text>{b5.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box5, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box6}>
          <View style={styles.tableRow}>
            {_.sortBy(box6, ['sortOrder']).map(b6 => (
              <View style={styles.tableBox1Header} key={b6.id}>
                <Text>{b6.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box6, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ fontSize: 11, paddingBottom: 10, top: 20 }}>
        <Text>COLUMN DA-3003</Text>
      </View>

      <View>
        <View style={styles.Box7}>
          <View style={styles.tableRow}>
            {_.sortBy(box7, ['sortOrder']).map(b7 => (
              <View style={styles.tableBox1Header} key={b7.id}>
                <Text>{b7.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box7, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box8}>
          <View style={styles.tableRow}>
            {_.sortBy(box8, ['sortOrder']).map(b8 => (
              <View style={styles.tableBox1Header} key={b8.id}>
                <Text>{b8.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box8, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.getAutoReading
                    ? item.reading === '0' || item.reading === 0 || item.reading === ''
                      ? '-'
                      : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`
                    : getSign(item.unitName)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.Box9}>
          <View style={styles.tableRow}>
            {_.sortBy(box9, ['sortOrder']).map(b9 => (
              <View style={styles.tableBox1Header} key={b9.id}>
                <Text>{b9.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableRow}>
            {_.sortBy(box9, ['sortOrder']).map(item => (
              <View style={styles.tableBox1Row} key={item.id}>
                <Text>
                  {item.reading === '0' || item.reading === 0 || item.reading === ''
                    ? '-'
                    : `${item.reading} ${item.unitName ? getSign(item.unitName) : ''}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ fontSize: 11, top: 20 }}>
        <Text>MATERIAL BALANCE (ONE HR. BASIS) :</Text>
      </View>

      <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', top: 25, width: '49%' }}>
          <View style={styles.rowBox10}>
            <Text style={styles.thBox10}>{'-'}</Text>
            <Text style={styles.thBox10}>{'M\u00b3'}</Text>
            <Text style={styles.thBox10}>MT</Text>
            <Text style={styles.thBox10}>%</Text>
          </View>

          {_.sortBy(box10, ['sortOrder']).map((item, idx) => (
            <View style={styles.rowBox10} key={item.id}>
              <Text style={idx === 1 ? styles.thBox10Button : styles.thBox10}>{item.name}</Text>
              <Text style={idx === 1 ? styles.thBox10Button : styles.thBox10}>{`${
                item.reading === '0' || item.reading === 0 || item.reading === '' ? '-' : item.reading
              }`}</Text>
              <Text style={idx === 1 ? styles.thBox10Button : styles.thBox10}>{`${
                item.production ? item.production : '-'
              }`}</Text>

              <Text style={idx === 1 ? styles.thBox10Button : styles.thBox10}>{`${item.percent ? item.percent : '-'}`}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', position: 'absolute', flexWrap: 'wrap', left: 290, top: 25, width: '49%' }}>
          <View style={styles.rowBox10}>
            <Text style={styles.thBox10}>PRODUCTION</Text>
            <Text style={styles.thBox10}>{'M\u00b3'}</Text>
            <Text style={styles.thBox10}>MT</Text>
            <Text style={styles.thBox10}>% YIELD</Text>
          </View>

          {_.sortBy(box11, ['sortOrder']).map((item, idx) => (
            <View style={styles.rowBox10} key={item.id}>
              <Text style={idx === 3 ? styles.thBox10Button : styles.thBox10}>{item.name}</Text>
              <Text style={idx === 3 ? styles.thBox10Button : styles.thBox10}>{`${
                item.reading === '0' || item.reading === 0 || item.reading === '' ? '-' : item.reading
              }`}</Text>
              <Text style={idx === 3 ? styles.thBox10Button : styles.thBox10}>{`${
                item.production ? item.production : '-'
              }`}</Text>
              <Text style={idx === 3 ? styles.thBox10Button : styles.thBox10}>{`${item.percent ? item.percent : '-'}`}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ fontSize: 11, top: 50 }}>
        <Text> HYDROGEN PLANT : Shut CAPACITY :</Text>
      </View>

      {/* Box12, Box13, Box14 */}

      <View>
        <View style={{ border: '1px solid black', width: '23%', top: 55, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>Reformer</Text>
            <Text style={styles.tableHead}>IN. TR-12</Text>
            <Text style={styles.tableHead}>OUT TR-16</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'C'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '50%', position: 'absolute', top: 55, left: 138, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>PRESSURE</Text>
            <Text style={styles.tableHead}>PIC-02</Text>
            <Text style={styles.tableHead}>PIC-03</Text>
            <Text style={styles.tableHead}>PIC-26</Text>
            <Text style={styles.tableHead}>PIC-92</Text>
            <Text style={styles.tableHead}>PIC-91</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'Bar.g'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '25%', position: 'absolute', top: 55, left: 430, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>STEAM</Text>
            <Text style={styles.tableHead}>FIC-16</Text>
            <Text style={styles.tableHead}>FI-15</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'KG/H'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
      </View>

      {/* Box14, Box16, Box17 */}

      <View>
        <View style={{ border: '1px solid black', width: '23%', top: 68, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>FEED</Text>
            <Text style={styles.tableHead}>FIC-07</Text>
            <Text style={styles.tableHead}>FIC-05</Text>
            <Text style={styles.tableHead}>FIC-04</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'KG/H'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '50%', position: 'absolute', top: 68, left: 138, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>FUEL</Text>
            <Text style={styles.tableHead}>NG FI-29</Text>
            <Text style={styles.tableHead}>PG FI-30</Text>
            <Text style={styles.tableHead}>FUEL</Text>
            <Text style={styles.tableHead}>PIC-1859</Text>
            <Text style={styles.tableHead}>PIC-1860</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'KG/H'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'Bar.g'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '25%', position: 'absolute', top: 68, left: 430, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>DRAFT</Text>
            <Text style={styles.tableHead}>PIC-1814</Text>
            <Text style={styles.tableHead}>VALVE ON</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'mmWC'}</Text>
            <Text style={styles.tableTr}>{'%'}</Text>
          </View>
        </View>
      </View>

      {/* Box18, Box19, Box20 */}

      <View>
        <View style={{ border: '1px solid black', width: '23%', top: 82, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>V-1 LEV %</Text>
            <Text style={styles.tableHead}>V-2 LEV %</Text>
            <Text style={styles.tableHead}>CW M3/H</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '50%', position: 'absolute', top: 82, left: 138, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>TEMP.</Text>
            <Text style={styles.tableHead}>R-1 IN</Text>
            <Text style={styles.tableHead}>R-2 OUT</Text>
            <Text style={styles.tableHead}>R-3 IN</Text>
            <Text style={styles.tableHead}>R-3 OUT</Text>
            <Text style={styles.tableHead}>PSA IN</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'C'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
        <View style={{ border: '1px solid black', width: '25%', position: 'absolute', top: 82, left: 430, fontSize: 8 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>PSA</Text>
            <Text style={styles.tableHead}>KF</Text>
            <Text style={styles.tableHead}>KW</Text>
            <Text style={styles.tableHead}>Cap.Time</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableTr}>{'VALUE'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
            <Text style={styles.tableTr}>{'-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.jobDescription}>
        <View style={styles.tableRow}>
          <View
            style={{
              borderBottom: '1px solid black',
              textAlign: 'center',
              width: '100%',
              fontSize: 9
            }}>
            <Text>JOB DESCRIPTION</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View
            style={{
              fontSize: 9,
              paddingTop: 128,
              left: 420
            }}>
            <Text style={{ borderTop: '1px solid black' }}>SHIFT ENGINEER / CONTROLLER</Text>
          </View>
        </View>
      </View>

      <View style={styles.remarks}>
        <Text style={styles.remark}>{`${data.remark}`}</Text>
      </View>
    </div>
  );
};

export default DataTable;
