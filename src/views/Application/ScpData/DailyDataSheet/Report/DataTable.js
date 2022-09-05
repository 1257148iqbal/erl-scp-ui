import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import down from 'assets/images/down.png';
import running from 'assets/images/running.png';
import up from 'assets/images/up.png';
import _ from 'lodash';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 120,
    borderWidth: 1,
    margin: '0px 0px 10px 20px'
  },
  tableContainerProductionSynopsis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 120,
    borderWidth: 1,
    margin: '0px 0px 10px 20px',
    width: '48%'
  },
  tableContainerOtherFetures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 120,
    borderWidth: 1,
    margin: '0px 0px 10px 20px',
    width: '46%',
    position: 'absolute',
    left: 290
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
    flexGrow: 1,
    borderTop: '1px solid black',
    display: 'block'
  },
  th: {
    width: '16.67%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    position: 'relative'
  },
  th_item: {
    width: '33.33%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'center'
  },
  th_temp: {
    width: '16.67%',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'center'
  },
  td_item: {
    width: '16.67%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  group: {
    width: '32.45%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 5
  },
  row_sl: {
    width: '16.67%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  td_proSyn: {
    width: '44%',
    borderRight: '1px solid black',
    padding: '3px 3px',
    fontSize: 10,
    textAlign: 'left'
  },
  td_consumptions: {
    width: '50%',
    borderRight: '1px solid black',
    padding: '3px 3px',
    fontSize: 10,
    textAlign: 'left'
  },
  td_otherFetures: {
    width: '50%',
    borderRight: '1px solid black',
    padding: '4px 3px',
    fontSize: 10,
    textAlign: 'left'
  },
  proSynpsCalculatedValue: {
    width: '28%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10
  },
  proSyncurrentReading: {
    width: '28%',
    padding: '3px 0px',
    fontSize: 10
  },
  consumpcurrentReading: {
    width: '50%',
    padding: '3px 0px',
    fontSize: 10
  },
  otherfeturecurrentReading: {
    width: '50%',
    padding: '4px 0px',
    fontSize: 10
  },
  time: {
    width: '32.4%',
    borderRight: '1px solid black',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 10
  },
  date: {
    width: '30%',
    padding: '3px 0px',
    fontSize: 10,
    textAlign: 'left',
    left: 20
  },
  td_productionSynopsis: {
    width: '100%',
    padding: '3px 0px',
    fontSize: 12
  },
  otherFetures: {
    width: '100%',
    padding: '5px 0px',
    fontSize: 12
  }
});

const icons = {
  Up: up,
  Down: down,
  Running: running
};

const DataTable = ({ details, data }) => {
  return (
    <div>
      <View style={styles.tableContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.group}>{`Group : ${details.operatorGroup ?? ''}`}</Text>
          <Text style={styles.time}>{`Time: ${details.time} `}</Text>
          <Text style={styles.date}>{`Date: ${formattedDate(details.date)} `}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.th_item}>Item</Text>
          <Text style={styles.th}>FQ Reading</Text>
          <Text style={styles.th}>Factor</Text>
          <Text style={styles.th}>TUI</Text>
          <Text style={styles.th_temp}>Temp</Text>
        </View>

        {_.sortBy(data.cumulitive, ['sortOrder']).map((item, index) => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.td_item}>{item.displayName}</Text>
            <Text style={styles.row_sl}>{item.tagName ? item.tagName : '-'}</Text>
            <Text style={styles.row_sl}>{item.currentReading ? item.currentReading : '-'}</Text>
            <Text style={styles.row_sl}>{item.factor ? item.factor : '-'}</Text>
            {data.tui[index] ? (
              <Text style={styles.row_sl}>{data.tui[index]['displayName']}</Text>
            ) : (
              <Text style={styles.row_sl}>{'-'}</Text>
            )}
            {data.tui[index] ? (
              <Text style={styles.th_temp}>
                {data.tui[index]['currentReading'] ? data.tui[index]['currentReading'] : '-'}
              </Text>
            ) : (
              <Text style={styles.th_temp}>{'-'} </Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.tableContainer}>
        {_.sortBy(data.fi, ['sortOrder']).map((item, index) => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.td_item}>{item.displayName}</Text>
            <Text style={styles.row_sl}>{item.signe}</Text>
            <Text style={styles.row_sl}>{item.currentReading ? item.currentReading : '-'}</Text>

            {data.fic[index] ? (
              <Text style={styles.row_sl}>{data.fic[index]['displayName']}</Text>
            ) : (
              <Text style={styles.row_sl} />
            )}
            {data.fic[index] ? (
              <Text style={styles.row_sl}>{data.fic[index]['signe']}</Text>
            ) : (
              <Text style={styles.row_sl} />
            )}
            {data.fic[index] ? (
              <Text style={styles.th_temp}>
                {data.fic[index]['currentReading'] ? data.fic[index]['currentReading'] : '-'}
              </Text>
            ) : (
              <Text style={styles.th_temp} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.tableContainer}>
        {_.sortBy(data.ammonia, ['sortOrder']).map((item, index) => (
          <View style={styles.rowContainer} key={item.id}>
            <Text style={styles.td_item}>{item.displayName}</Text>
            <Text style={styles.row_sl}>{item.signe}</Text>
            <Text style={styles.row_sl}>{item.currentReading ? item.currentReading : '-'}</Text>

            {data.tray[index] ? (
              <Text style={styles.row_sl}>{data.tray[index]['displayName']}</Text>
            ) : (
              <Text style={styles.row_sl} />
            )}
            {data.tray[index] ? (
              <Text style={styles.row_sl}>{data.tray[index]['signe']}</Text>
            ) : (
              <Text style={styles.row_sl} />
            )}
            {data.tray[index] ? (
              <Text style={styles.th_temp}>
                {data.tray[index]['currentReading'] ? data.tray[index]['currentReading'] : '-'}
              </Text>
            ) : (
              <Text style={styles.th_temp} />
            )}
          </View>
        ))}
      </View>

      <View style={{ position: 'relative' }}>
        <View style={styles.tableContainerProductionSynopsis}>
          <View style={styles.rowContainer}>
            <Text style={styles.td_productionSynopsis}>Production Synopsis</Text>
          </View>
          {_.sortBy(data.productionSynopsys, ['sortOrder']).map((item, index) => (
            <View style={styles.rowContainer} key={item.id}>
              <Text style={styles.td_proSyn}>{item.displayName}</Text>
              <Text style={styles.proSynpsCalculatedValue}>{item.psCalculatedValue ? item.psCalculatedValue : '-'}</Text>
              <Text style={styles.proSyncurrentReading}>{item.currentReading ? item.currentReading : '-'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tableContainerProductionSynopsis}>
          <View style={styles.rowContainer}>
            <Text style={styles.td_productionSynopsis}>Consumptions</Text>
          </View>
          {_.sortBy(data.consumptions, ['sortOrder']).map((item, index) => (
            <View style={styles.rowContainer} key={item.id}>
              <Text style={styles.td_consumptions}>{item.displayName ?? '-'}</Text>
              <Text style={styles.consumpcurrentReading}>{item.psCalculatedValue ? item.psCalculatedValue : '-'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tableContainerOtherFetures}>
          <View style={styles.rowContainer}>
            <Text style={styles.otherFetures}>Other Features</Text>
          </View>
          {_.sortBy(data.otherFeatures, ['sortOrder']).map((item, index) => {
            let element;
            if (item.displayName === 'Feed Tank') {
              const tankReading = item.currentReading ? JSON.parse(item.currentReading) : [];
              element = (
                <Text>
                  {tankReading.length > 0
                    ? tankReading.map((item, idx) => (
                        <View key={idx + 1}>
                          <Text>{item.tank}</Text>
                          <Text>
                            <Image src={icons[item.symbol]} />
                          </Text>
                          {idx < tankReading.length - 1 && <Text style={{ fontWeight: 900 }}>{`, `} </Text>}
                        </View>
                      ))
                    : '-'}
                </Text>
              );
            }
            return (
              <View style={styles.rowContainer} key={item.id}>
                <Text style={styles.td_otherFetures}>{`${item.displayName}`}</Text>
                {item.displayName === 'Feed Tank' ? (
                  <Text style={styles.otherfeturecurrentReading}>{element}</Text>
                ) : (
                  <Text style={styles.otherfeturecurrentReading}>
                    {item.currentReading ? `${item.currentReading} ${item.signe && getSign(item.signe)}` : '-'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </div>
  );
};

export default DataTable;
