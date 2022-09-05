import LoadingContextProvider from 'components/contextProvider/LoadingContextProvider';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import Profile from 'views/Application/Account/Profile';
import Roles from 'views/Application/Account/Roles';
import Users from 'views/Application/Account/Users';
import AssignToDuty from 'views/Application/AssignOperator/AssignToDuty';
import Dashboard from 'views/Application/Dashboard';
import DecokingLaboratory from 'views/Application/Docking/DecokingLaboratory';
import DecokingLogSheet from 'views/Application/Docking/DecokingLogSheet';
import DecokingNumber from 'views/Application/MasterData/DecokingNumber';
import DecokingLogSheetParameters from 'views/Application/MasterData/DecokingParameters';
import Department from 'views/Application/MasterData/Department';
import Designation from 'views/Application/MasterData/Designation';
import Factor from 'views/Application/MasterData/Factor';
import LabShift from 'views/Application/MasterData/LabShift';
import Section from 'views/Application/MasterData/LogSection';
import Shift from 'views/Application/MasterData/LogShift';
import Unit from 'views/Application/MasterData/LogUnit';
import OperationGroup from 'views/Application/MasterData/OperationGroup';
import Operator from 'views/Application/MasterData/Operator';
import OperatorGroup from 'views/Application/MasterData/OperatorGroup';
import Switches from 'views/Application/MasterData/Switch';
import Tag from 'views/Application/MasterData/Tag';
import Tank from 'views/Application/MasterData/Tank';
import LabUnit from 'views/Application/MasterData/TestPlant';
import TestSamples from 'views/Application/MasterData/TestSamples';
import TimeSlot from 'views/Application/MasterData/TimeSlot';
import DailyProduction from 'views/Application/QualityControl/DailyProduction';
import LabTest from 'views/Application/QualityControl/LabTest';
import DecokingLaboratoryResult from 'views/Application/Reports/DecokingLaboratoryResult/DecokingLaboratoryResult';
import DecokingLogSheetReport from 'views/Application/Reports/DecokingLogSheetReport/DecokingLogSheet';
import DecokingReport from 'views/Application/Reports/DecokingReport';
import LogSheetReports from 'views/Application/Reports/LogSheetReports/LogSheetReports';
import MonthlyReport from 'views/Application/Reports/MonthlyReport/MonthlyReport';
import YearlyReport from 'views/Application/Reports/YearlyReport/YearlyReport';
import DailyDataSheet from 'views/Application/ScpData/DailyDataSheet';
import LogSheet from 'views/Application/ScpData/LogSheet';
import ShiftReport from 'views/Application/ScpData/ShiftReport';
import SiteReport from 'views/Application/ScpData/SiteReport';
import SwitchLog from 'views/Application/ScpData/SwitchLog';
import DailyDataSheetSetting from 'views/Application/Settings/DailyDataSheet';
import MonthlyProductionSetting from 'views/Application/Settings/MonthlyProductionSetting';
import ShiftReportSetting from 'views/Application/Settings/ShiftReportSetting';
import SiteReportSetting from 'views/Application/Settings/SiteReportSetting';
import TestPage from 'views/Application/Test/DailyDataSheetTest';
import ForgotPasswordPage from 'views/Auth/ForgotPassword';
import Login from 'views/Auth/Login';
import Register from 'views/Auth/Register';
import Error404 from 'views/Error/404';

const RestrictedRoute = ({ component: Component, ...rest }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const Routes = () => {
  const { authUser } = useSelector(({ auth }) => auth);

  const location = useLocation();

  if (location.pathname === '' || location.pathname === '/') {
    return <Redirect to={'/dashboard'} />;
  } else if (authUser && location.pathname === '/signin') {
    return <Redirect to={'/dashboard'} />;
  }

  return (
    <React.Fragment>
      <LoadingContextProvider>
        <Switch>
          <RestrictedRoute path="/dashboard" component={Dashboard} />
          <RestrictedRoute path="/test" component={TestPage} />
          {/* Account Menu */}
          <RestrictedRoute path="/roles" component={Roles} />
          <RestrictedRoute path="/users" component={Users} />
          <RestrictedRoute path="/profile" component={Profile} />
          {/* Account Menu */}

          {/* Master Menu */}
          <RestrictedRoute path="/department" component={Department} />
          <RestrictedRoute path="/designation" component={Designation} />
          <RestrictedRoute path="/operator" component={Operator} />
          <RestrictedRoute path="/operator-group" component={OperatorGroup} />
          <RestrictedRoute path="/operation-group" component={OperationGroup} />
          <RestrictedRoute path="/unit" component={Unit} />
          <RestrictedRoute path="/section" component={Section} />
          <RestrictedRoute path="/tag" component={Tag} />
          <RestrictedRoute path="/shift" component={Shift} />
          <RestrictedRoute path="/time-slot" component={TimeSlot} />
          <RestrictedRoute path="/factor" component={Factor} />
          <RestrictedRoute path="/switches" component={Switches} />
          <RestrictedRoute path="/test-plant" component={LabUnit} />
          <RestrictedRoute path="/lab-shift" component={LabShift} />
          <RestrictedRoute path="/test-sample" component={TestSamples} />
          <RestrictedRoute path="/decoking-parameters" component={DecokingLogSheetParameters} />
          <RestrictedRoute path="/decoking-numbers" component={DecokingNumber} />
          <RestrictedRoute path="/tank" component={Tank} />
          {/* Master Menu */}

          {/* Duty */}
          <RestrictedRoute path="/assign-operator-to-lab" component={AssignToDuty} />
          {/* Duty */}

          {/* Log Sheet Menu */}
          <RestrictedRoute path="/log-sheet" component={LogSheet} />
          <RestrictedRoute path="/switch-log" component={SwitchLog} />
          {/* Log Sheet Menu */}

          {/* QualityControl Menu */}
          {/* <RestrictedRoute path="/quality-control" component={QualityControl} /> */}
          <RestrictedRoute path="/daily-data-sheet" component={DailyDataSheet} />
          <RestrictedRoute path="/site-report" component={SiteReport} />
          <RestrictedRoute path="/daily-production" component={DailyProduction} />
          <RestrictedRoute path="/lab-test" component={LabTest} />
          {/* QualityControl Menu */}

          {/* Settings Menu */}
          <RestrictedRoute path="/daily-data-sheet-settings" component={DailyDataSheetSetting} />
          <RestrictedRoute path="/monthly-production-settings" component={MonthlyProductionSetting} />
          <RestrictedRoute path="/site-report-settings" component={SiteReportSetting} />
          <RestrictedRoute path="/shift-report-settings" component={ShiftReportSetting} />
          {/* Settings Menu */}

          {/* Decoking Menu */}
          <RestrictedRoute path="/decoking-log-sheet" component={DecokingLogSheet} />
          <RestrictedRoute path="/decoking-laboratory-result" component={DecokingLaboratory} />
          {/* Decoking Menu */}

          {/* Report Menu */}
          <RestrictedRoute path="/monthly-report" component={MonthlyReport} />
          <RestrictedRoute path="/yearly-report" component={YearlyReport} />
          <RestrictedRoute path="/shift-report" component={ShiftReport} />
          <RestrictedRoute path="/logs-sheet-report" component={LogSheetReports} />
          <RestrictedRoute path="/decoking-laboratory-report" component={DecokingLaboratoryResult} />
          <RestrictedRoute path="/decoking-log-sheet-report" component={DecokingLogSheetReport} />
          <RestrictedRoute path="/decoking-report" component={DecokingReport} />
          {/* Report Menu */}

          <Route path="/signin" component={Login} />
          <Route path="/signup" component={Register} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route component={Error404} />
        </Switch>
      </LoadingContextProvider>
    </React.Fragment>
  );
};

export default Routes;
