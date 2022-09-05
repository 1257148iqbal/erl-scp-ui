import { Grid } from '@material-ui/core';
import { ArrowDownward, ArrowUpward, ImportExport } from '@mui/icons-material';
import _ from 'lodash';
import React from 'react';
import { getSign } from 'utils/commonHelper';
import { formattedDate } from 'utils/dateHelper';
import '../Styles/dailydatasheetview.css';
const icons = {
  Up: <ArrowUpward style={{ color: 'green' }} />,
  Down: <ArrowDownward style={{ color: 'red' }} />,
  Running: <ImportExport style={{ color: 'blue' }} />
};

const DailyDataSheetDetails = props => {
  const { details, sections } = props;

  return (
    <div>
      {/* <Grid item xs={12}>
        <PDFViewer width="100%" height="1000">
          <PDFView details={details} data={sections} />
        </PDFViewer>
      </Grid> */}
      <table className="master-section">
        <tbody>
          <tr>
            <td>
              <span>Group :</span>
              <span>{details.operatorGroup ?? ''}</span>
            </td>
            <td>
              <span>Time : </span>
              <span>{details.time}</span>
            </td>
            <td>
              <span>Date : </span>
              <span>{formattedDate(details.date)}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="details-section">
        <Grid container spacing={3}>
          <Grid item container xs={12} className="section" spacing={3}>
            <Grid item xs={6}>
              <table className="ddstables">
                <thead>
                  <tr>
                    <td colSpan={2}>ITEM</td>
                    <td>FQ READING</td>
                    <td>FACTOR</td>
                  </tr>
                </thead>
                <tbody>
                  {_.sortBy(sections.cumulitive, ['sortOrder']).map(cuSec => (
                    <tr key={cuSec.id}>
                      <td colSpan={cuSec.displayName === 'POWER INCOMER' ? 2 : 1}>{cuSec.displayName}</td>
                      {cuSec.displayName !== 'POWER INCOMER' && <td>{cuSec.tagName}</td>}
                      <td className="textBoxCenter">{cuSec.currentReading}</td>
                      <td className="textBoxCenter">{cuSec.factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6}>
              <table className="ddstables">
                <thead>
                  <tr>
                    <td>TUI</td>
                    <td>TEMP {`\u00b0C`}</td>
                  </tr>
                </thead>
                <tbody>
                  {_.sortBy(sections.tui, ['sortOrder']).map(t => (
                    <tr key={t.id}>
                      <td>{t.displayName}</td>
                      <td className="textBoxCenter">{t.currentReading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          </Grid>
          <Grid item container xs={12} className="section" spacing={3}>
            <Grid item xs={6}>
              <table className="ddstables fi">
                <tbody>
                  {_.sortBy(sections.fi, ['sortOrder']).map(fi => (
                    <tr key={fi.id}>
                      <td>{fi.displayName}</td>
                      <td className="textBoxCenter">{fi.signe}</td>
                      <td className="textBoxCenter">{fi.currentReading ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6}>
              <table className="ddstables fic">
                <tbody>
                  {_.sortBy(sections.fic, ['sortOrder']).map(fic => (
                    <tr key={fic.id}>
                      <td>{fic.displayName}</td>
                      <td className="textBoxCenter">{fic.signe}</td>
                      <td className="textBoxCenter">{fic.currentReading ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          </Grid>
          <Grid item container xs={12} className="section" spacing={3}>
            <Grid item xs={6}>
              <table className="ddstables ammonia">
                <tbody>
                  {_.sortBy(sections.ammonia, ['sortOrder']).map(am => (
                    <tr key={am.id}>
                      <td>{am.displayName}</td>
                      <td className="textBoxCenter">{am.currentReading ?? ''}</td>
                      <td className="textBoxCenter">{am.signe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6}>
              <table className="ddstables">
                <tbody>
                  {_.sortBy(sections.tray, ['sortOrder']).map((t, trayIdex) => (
                    <tr key={t.id}>
                      <td>{t.displayName}</td>
                      <td className="textBoxCenter">{t.signe}</td>
                      <td className="textBoxCenter">{t.currentReading ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
          </Grid>
          <Grid item container xs={12} className="section" spacing={3}>
            <Grid item container xs={6}>
              <Grid item xs={12} style={{ marginBottom: 20 }}>
                <table className="ddstables production-synopsis">
                  <thead>
                    <tr>
                      <td colSpan={2}>Production Synopsis</td>
                      <td colSpan={1}>%</td>
                    </tr>
                  </thead>
                  <tbody>
                    {_.sortBy(sections.productionSynopsys, ['sortOrder']).map((ps, psIdx) => {
                      return (
                        <tr key={ps.id}>
                          <td>{ps.displayName}</td>
                          <td className="textBoxCenter">{`${ps.psCalculatedValue ?? ''} ${ps.signe &&
                            '( ' + getSign(ps.signe) + ' )'}`}</td>
                          <td className="textBoxCenter">{ps.currentReading}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Grid>
              <Grid item xs={12}>
                <table className="ddstables consumptions">
                  <thead>
                    <tr>
                      <td colSpan={2}>Consumptions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {_.sortBy(sections.consumptions, ['sortOrder']).map((con, conIdx) => (
                      <tr key={con.id}>
                        <td>{`${con.displayName} ${con.signe && getSign(con.signe)}`}</td>
                        <td className="textBoxCenter">{con.psCalculatedValue ? con.psCalculatedValue : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <table className="ddstables other-features">
                <thead>
                  <tr>
                    <td colSpan={2}>Other Features</td>
                  </tr>
                </thead>
                <tbody>
                  {_.sortBy(sections.otherFeatures, ['sortOrder']).map(othf => {
                    let element;
                    switch (othf.displayName) {
                      case 'Feed Tank':
                        const tankReading = othf.currentReading ? JSON.parse(othf.currentReading) : [];
                        element = (
                          <td className="textBoxCenter">
                            <div className="tank-with-symbol">
                              {tankReading.length > 0
                                ? tankReading.map((item, idx) => (
                                    <div key={idx + 1}>
                                      <span>{item.tank}</span>
                                      <span>{icons[item.symbol]}</span>
                                    </div>
                                  ))
                                : ''}
                            </div>
                          </td>
                        );
                        break;
                      default:
                        element = (
                          <td className="textBoxCenter">{`${othf.currentReading ? othf.currentReading : ''} ${othf.signe &&
                            getSign(othf.signe)}`}</td>
                        );
                        break;
                    }
                    return (
                      <tr key={othf.id}>
                        <td>{`${othf.displayName}`}</td>
                        {element}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default DailyDataSheetDetails;
