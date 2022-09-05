import CmtVertical from '@coremat/CmtNavigation/Vertical';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  AccessibilityNew,
  AccessTime,
  AccountBox,
  AccountTree,
  AvTimer,
  BorderLeft,
  BorderOuter,
  BorderRight,
  CompareArrows,
  CropOutlined,
  LocalOffer,
  MenuBook,
  NoteAdd,
  People,
  PermDeviceInformation,
  Print,
  School,
  Settings,
  SettingsCell,
  SettingsInputComponent,
  Timelapse,
  ToggleOff,
  ToggleOn,
  TrackChanges
} from '@material-ui/icons';
import { Backpack, Biotech, ElectricalServices, HourglassBottom, HourglassTop, Park, Quiz } from '@mui/icons-material';
import { OPERATION_GROUP } from 'constants/ApiEndPoints/v1';
import {
  DAILY_DATA_SHEETS,
  DAILY_DATA_SHEET_SETTINGS,
  DECOKING_LABRATORY,
  DECOKING_LOG,
  DECOKING_NUMBER,
  DEPARTMENTS,
  DESIGNATIONS,
  LAB_RPORTS,
  LAB_SHIFTS,
  LAB_UNITS,
  LOG_SHEETS,
  OPERATION_GROUPS,
  OPERATORS,
  OPERATOR_DUTY_LOG,
  OPERATOR_GROUPS,
  PARAMETER,
  PRODUCTION_SETTING,
  REPORTS_PERMISSIONS,
  ROLE,
  SECTIONS,
  SHIFTS,
  SHIFT_REPORTS,
  SHIFT_REPORT_SETTING,
  SITE_REPORTS,
  SITE_REPORT_SETTING,
  SWITCHES,
  SWITCH_LOGS,
  TAGS,
  TANKS,
  TEST_SAMPLES,
  TIME_SLOTS,
  UNITS,
  USERS
} from 'constants/permissionsType';
import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import { http } from 'services/httpService';
import { toastAlerts } from 'utils/alerts';

const useStyles = makeStyles(theme => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)'
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)'
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)'
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)'
    }
  }
}));

const SideBar = () => {
  const classes = useStyles();
  const { userPermission, authUser } = useSelector(({ auth }) => auth);
  //********************************** Test **********************************
  // ==> Individula Item Permission
  const testPermission = process.env.NODE_ENV === 'production' ? false : true;
  //--------------------------------------------------------------------------

  // ==> Section Permission
  const testSection = testPermission;
  //********************************** Test **********************************

  //********************************** User **********************************
  // ==> Individula Item Permission
  const usersPermission = userPermission?.includes(USERS.VIEW);
  const rolesPermission = userPermission?.includes(ROLE.VIEW);

  //--------------------------------------------------------------------------

  // ==> Section Permission
  const accountSection = usersPermission || rolesPermission;
  //********************************** User **********************************

  //********************************** Master **********************************
  // ==> Individula Item Permission
  const departmentPermission = userPermission?.includes(DEPARTMENTS.VIEW);
  const designationPermission = userPermission?.includes(DESIGNATIONS.VIEW);
  const operatorPermission = userPermission?.includes(OPERATORS.VIEW);
  const operatorGroupPermission = userPermission?.includes(OPERATOR_GROUPS.VIEW);
  const operationGroupPermission = userPermission?.includes(OPERATION_GROUPS.VIEW);
  const unitPermission = userPermission?.includes(UNITS.VIEW);
  const shiftPermission = userPermission?.includes(SHIFTS.VIEW);
  const switchPermission = userPermission?.includes(SWITCHES.VIEW);
  const sectionPermission = userPermission?.includes(SECTIONS.VIEW);
  const tagPermission = userPermission?.includes(TAGS.VIEW);
  const timeSlotPermission = userPermission?.includes(TIME_SLOTS.VIEW);
  const labUnits = userPermission?.includes(LAB_UNITS.VIEW);
  const labshifts = userPermission?.includes(LAB_SHIFTS.VIEW);
  const labSamples = userPermission?.includes(TEST_SAMPLES.VIEW);
  const parametersPermission = userPermission?.includes(PARAMETER.VIEW);
  const tankPermission = userPermission?.includes(TANKS.VIEW);
  const decokingNumberPermission = userPermission?.includes(DECOKING_NUMBER.VIEW);

  //--------------------------------------------------------------------------

  // ==> Section Permission
  const masterSection =
    departmentPermission ||
    designationPermission ||
    operatorPermission ||
    operatorGroupPermission ||
    operationGroupPermission ||
    unitPermission ||
    sectionPermission ||
    tagPermission ||
    shiftPermission ||
    timeSlotPermission ||
    switchPermission ||
    labUnits ||
    labSamples ||
    labshifts ||
    tankPermission ||
    decokingNumberPermission ||
    parametersPermission;
  //********************************** Master **********************************

  //********************************** Assign Operator **********************************
  // ==> Individula Item Permission
  const assignToDuty = userPermission?.includes(OPERATOR_DUTY_LOG.VIEW);
  //--------------------------------------------------------------------------
  // ==> Section Permission
  const assignOperatorSection = assignToDuty;
  //**********************************  Assign Operator **********************************

  //********************************** Logs **********************************
  // ==> Individula Item Permission
  const switchLogPermission = userPermission?.includes(SWITCH_LOGS.VIEW);
  const logSheetPermission = userPermission?.includes(LOG_SHEETS.VIEW);

  //--------------------------------------------------------------------------

  // ==> Section Permission
  const logSection = switchLogPermission || logSheetPermission;
  //********************************** Logs **********************************

  //********************************** Reports **********************************
  // ==> Individula Item Permission
  const logSheetReportPermission = userPermission?.includes(REPORTS_PERMISSIONS.DAILY_LOG_SHEET);
  const monthlyReportPermission = userPermission?.includes(REPORTS_PERMISSIONS.MONTHLY_PRODUCTION);
  const yearlyReportPermission = userPermission?.includes(REPORTS_PERMISSIONS.YEARLY_PRODUCTION);
  const decokingLaboratoryResultPermission = userPermission?.includes(REPORTS_PERMISSIONS.DECOKIN_LABORATORY_RESULT);
  const decokinglogSheetPermission = userPermission?.includes(REPORTS_PERMISSIONS.DECOKING_LOG_SHEET);
  const decokingReportPermission = userPermission?.includes(REPORTS_PERMISSIONS.DECOKING_REPORT);

  //--------------------------------------------------------------------------

  // ==> Section Permission
  const reportSection =
    monthlyReportPermission ||
    yearlyReportPermission ||
    logSheetReportPermission ||
    decokingLaboratoryResultPermission ||
    decokinglogSheetPermission ||
    decokingReportPermission;
  //********************************** Reports **********************************

  //********************************** Quality Control **********************************
  // ==> Individula Item Permission
  const labReportPermission = userPermission?.includes(LAB_RPORTS.VIEW);
  const dailyDataSheetPermission = userPermission?.includes(DAILY_DATA_SHEETS.VIEW);
  const siteReportPermission = userPermission?.includes(SITE_REPORTS.VIEW);
  const shiftReportPermission = userPermission?.includes(SHIFT_REPORTS.VIEW);
  const dailyProductionPermission = false; // forcefully false

  //--------------------------------------------------------------------------

  // ==> Section Permission
  const qualityControlSection =
    labReportPermission ||
    dailyDataSheetPermission ||
    siteReportPermission ||
    shiftReportPermission ||
    dailyProductionPermission;
  //********************************** Reports **********************************

  //********************************** Settings **********************************
  // ==> Individula Item Permission
  const dailyDadaSheetSettingsPermission = userPermission?.includes(DAILY_DATA_SHEET_SETTINGS.VIEW);
  const monthlyProductionSettingsPermission = userPermission?.includes(PRODUCTION_SETTING.VIEW);
  const siteReportSettingsPermission = userPermission?.includes(SITE_REPORT_SETTING.VIEW);
  const shiftReportSettingsPermission = userPermission?.includes(SHIFT_REPORT_SETTING.VIEW);

  //--------------------------------------------------------------------------

  // ==> Section Permission

  const settingsSection = authUser?.userName === 'superadmin';
  //********************************** Settings **********************************

  //********************************** Decoking **********************************
  // ==> Individula Item Permission
  const decokingLog = userPermission?.includes(DECOKING_LOG.VIEW);
  const decokingLaboratory = userPermission?.includes(DECOKING_LABRATORY.VIEW);
  //--------------------------------------------------------------------------

  // ==> Section Permission
  const decokingSection = decokingLog || decokingLaboratory;
  //********************************** Decoking **********************************

  const [opgroups, setOpgroups] = useState([]);
  const restItems = [
    {
      hasPermission: switchLogPermission,
      name: 'Switch Log',
      icon: <ToggleOff />,
      type: 'item',
      link: '/switch-log'
    },

    {
      hasPermission: siteReportPermission,
      name: 'Site Report',
      icon: <AccountTree />,
      type: 'item',
      link: '/site-report'
    },
    {
      hasPermission: shiftReportPermission,
      name: 'Shift Report',
      icon: <TrackChanges />,
      type: 'item',
      link: '/shift-report'
    },
    {
      hasPermission: dailyDataSheetPermission,
      name: 'Daily Data Sheet',
      icon: <CropOutlined />,
      type: 'item',
      link: '/daily-data-sheet'
    }
  ];

  useEffect(() => {
    let isMount = true;
    const control = new AbortController();

    const fetchOperationGroups = async () => {
      try {
        const res = await http.get(OPERATION_GROUP.get_active, { signal: control.signal });

        if (res.data.succeeded) {
          const op = res.data.data.map((item, index) => ({
            hasPermission: logSheetPermission,
            name: `${item.groupName} Log`,
            icon: index === 0 ? <BorderLeft /> : <BorderRight />,
            type: 'item',
            link: `/log-sheet/${item.groupName}-${item.id}-${item.alias}`
          }));
          isMount && setOpgroups(prev => [...prev, ...op, ...restItems]);
        }
      } catch (error) {
        toastAlerts('error', error);
      }
    };
    fetchOperationGroups();

    return () => {
      isMount = false;
      control.abort();
    };
  }, [logSheetPermission]);

  const navigationMenus = [
    {
      hasPermission: testSection,
      name: 'Test',
      type: 'section',
      children: [
        {
          hasPermission: testPermission,
          name: 'Test',
          icon: <MenuBook />,
          type: 'item',
          link: '/test'
        }
      ]
    },
    {
      hasPermission: settingsSection,
      name: 'Settings',
      type: 'section',
      children: [
        {
          hasPermission: dailyDadaSheetSettingsPermission,
          name: 'DDS Settings',
          icon: <Settings />,
          type: 'item',
          link: '/daily-data-sheet-settings'
        },
        {
          hasPermission: monthlyProductionSettingsPermission,
          name: 'MP Settings',
          icon: <Settings />,
          type: 'item',
          link: '/monthly-production-settings'
        },
        {
          hasPermission: siteReportSettingsPermission,
          name: 'Site Report Settings',
          icon: <Settings />,
          type: 'item',
          link: '/site-report-settings'
        },
        {
          hasPermission: shiftReportSettingsPermission,
          name: 'Shift Report Settings',
          icon: <Settings />,
          type: 'item',
          link: '/shift-report-settings'
        }
      ]
    },
    {
      hasPermission: accountSection,
      name: 'Account',
      type: 'section',
      children: [
        {
          hasPermission: userPermission,
          name: 'Roles',
          icon: <CompareArrows />,
          type: 'item',
          link: '/roles'
        },
        {
          hasPermission: userPermission,
          name: 'User',
          icon: <AccountBox />,
          type: 'item',
          link: '/users'
        }
      ]
    },
    {
      hasPermission: masterSection,
      name: 'Master',
      type: 'section',
      children: [
        {
          hasPermission: departmentPermission,
          name: 'Department',
          icon: <MenuBook />,
          type: 'item',
          link: '/department'
        },
        {
          hasPermission: designationPermission,
          name: 'Designation',
          icon: <School />,
          type: 'item',
          link: '/designation'
        },
        {
          hasPermission: operatorPermission,
          name: 'Operator Group',
          icon: <People />,
          type: 'item',
          link: '/operator-group'
        },
        {
          hasPermission: operatorPermission,
          name: 'Operator',
          icon: <AccessibilityNew />,
          type: 'item',
          link: '/operator'
        },

        {
          hasPermission: operationGroupPermission,
          name: 'Operation Group',
          icon: <ElectricalServices />,
          type: 'item',
          link: '/operation-group'
        },
        {
          hasPermission: unitPermission,
          name: 'Unit',
          icon: <PermDeviceInformation />,
          type: 'item',
          link: '/unit'
        },
        {
          hasPermission: false,
          name: 'Log Shift',
          icon: <AccessTime />,
          type: 'item',
          link: '/shift'
        },
        {
          hasPermission: switchPermission,
          name: 'Switch',
          icon: <ToggleOn />,
          type: 'item',
          link: '/switches'
        },
        {
          hasPermission: sectionPermission,
          name: 'Log Section',
          icon: <BorderOuter />,
          type: 'item',
          link: '/section'
        },
        {
          hasPermission: tagPermission,
          name: 'Tag',
          icon: <LocalOffer />,
          type: 'item',
          link: '/tag'
        },

        {
          hasPermission: timeSlotPermission,
          name: 'Time Slot',
          icon: <AvTimer />,
          type: 'item',
          link: '/time-slot'
        },
        {
          hasPermission: labUnits,
          name: 'Test Plant',
          icon: <Park />,
          type: 'item',
          link: '/test-plant'
        },
        {
          hasPermission: labshifts,
          name: 'Shift',
          icon: <Timelapse />,
          type: 'item',
          link: '/lab-shift'
        },
        {
          hasPermission: labSamples,
          name: 'Test Samples',
          icon: <Quiz />,
          type: 'item',
          link: '/test-sample'
        },
        {
          hasPermission: tankPermission,
          name: 'Tank',
          icon: <Backpack />,
          type: 'item',
          link: '/tank'
        },
        {
          hasPermission: parametersPermission,
          name: 'Decoking Parameters',
          icon: <HourglassBottom />,
          type: 'item',
          link: '/decoking-parameters'
        },
        {
          hasPermission: decokingNumberPermission,
          name: 'Decoking Number',
          icon: <HourglassTop />,
          type: 'item',
          link: '/decoking-numbers'
        }
      ]
    },
    {
      hasPermission: assignOperatorSection,
      name: 'Duty',
      type: 'section',
      children: [
        {
          hasPermission: assignToDuty,
          name: 'Assing To Duty',
          icon: <NoteAdd />,
          type: 'item',
          link: '/assign-operator-to-lab'
        }
      ]
    },
    {
      hasPermission: logSection,
      name: 'SCP Data',
      type: 'section',
      children: opgroups
    },

    {
      hasPermission: qualityControlSection,
      name: 'Quality Control',
      type: 'section',
      children: [
        {
          hasPermission: labReportPermission,
          name: 'Lab Test',
          icon: <Biotech />,
          type: 'item',
          link: '/lab-test'
        },
        {
          hasPermission: dailyProductionPermission,
          name: 'Daily Production',
          icon: <NoteAdd />,
          type: 'item',
          link: '/daily-production'
        }
      ]
    },
    {
      hasPermission: decokingSection,
      name: 'Decoking',
      type: 'section',
      children: [
        {
          hasPermission: decokingLog,
          name: 'Decoking Log Sheet',
          icon: <SettingsInputComponent />,
          type: 'item',
          link: '/decoking-log-sheet'
        },
        {
          hasPermission: decokingLaboratory,
          name: 'Decoking Laboratory',
          icon: <SettingsCell />,
          type: 'item',
          link: '/decoking-laboratory-result'
        }
      ]
    },
    {
      hasPermission: reportSection,
      name: 'Reports',
      type: 'section',
      children: [
        {
          hasPermission: logSheetReportPermission,
          name: 'Log Sheet Report',
          icon: <Print />,
          type: 'item',
          link: '/logs-sheet-report'
        },
        {
          hasPermission: decokinglogSheetPermission,
          name: 'Decoking Log Sheet',
          icon: <Print />,
          type: 'item',
          link: '/decoking-log-sheet-report'
        },
        {
          hasPermission: decokingLaboratoryResultPermission,
          name: 'Decoking Lab Report',
          icon: <Print />,
          type: 'item',
          link: '/decoking-laboratory-report'
        },
        {
          hasPermission: decokingReportPermission,
          name: 'Decoking Report',
          icon: <Print />,
          type: 'item',
          link: '/decoking-report'
        },
        {
          hasPermission: monthlyReportPermission,
          name: 'Monthly Report',
          icon: <Print />,
          type: 'item',
          link: '/monthly-report'
        },
        {
          hasPermission: yearlyReportPermission,
          name: 'Yearly Report',
          icon: <Print />,
          type: 'item',
          link: '/yearly-report'
        }
      ]
    }
  ];

  const permittedNavigationMenus = navigationMenus.reduce((previousValue, currentValue) => {
    if (currentValue.hasPermission) {
      previousValue.push({
        ...currentValue,
        children: currentValue.children.filter(({ hasPermission }) => hasPermission)
      });
    }

    return previousValue;
  }, []);
  return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
      <CmtVertical menuItems={permittedNavigationMenus} />
    </PerfectScrollbar>
  );
};

export default SideBar;

/**
 * 22-Jan-2022 : Settings section view logic change,(only show with username: superadmin)
 **/
