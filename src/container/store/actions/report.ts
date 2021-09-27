import axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { TAppActionTypeKeys } from ".";
import {
  IAppAction,
  IEnvInfo,
  IReportZ,
  IRootState,
  IMinReport,
  IReportX,
} from "../../interface";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchReports = () => (
  dispatch: Dispatch,
  getState: () => IRootState
) => {
  const { report, api } = getState();

  const headers = {
    Authorization: `Bearer ${api.token}`,
  };

  setReports([]);
  return axios
    .get(
      `${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`,
      { headers }
    )
    .then((response) => {
      dispatch(setReports(response.data));
      return response.data;
    });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchReportX = () => (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _dispatch: any,
  getState: () => IRootState
) => {
  const { report, api } = getState();

  const headers = {
    Authorization: `Bearer ${api.token}`,
  };
  return axios
    .get(
      `${report.env?.API_URL}/pos/reports/report_x/${report.env?.API_CENTRAL_ENTITY}?month=${report.start_date}`,
      { headers }
    )
    .then((response) => {
      // dispatch(setReportX(response.data))
      return response.data;
    });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchReportZ = () => (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _dispatch: any,
  getState: () => IRootState
) => {
  const { report, api } = getState();

  const headers = {
    Authorization: `Bearer ${api.token}`,
  };
  return axios
    .get<IReportZ[], AxiosResponse<IReportZ[]>>(
      `${report.env?.API_URL}/pos/reports/report_z/${report.env?.API_CENTRAL_ENTITY}?start_date=${report.start_date}&end_date=${report.end_date}`,
      { headers }
    )
    .then((response) => {
      // dispatch(setReportZ(response.data))

      const result: IMinReport = {
        total_net: 0,
        nb_net: 0,
        average_basket: 0,
      };
      for (let i = 0; i < response.data.length; i++) {
        const report: IReportZ = response.data[i];

        result.total_net += report.total_net;
        result.nb_net += report.nb_net;
        result.average_basket += report.average_basket;
      }

      if (result.nb_net !== 0) {
        result.average_basket = result.average_basket / result.nb_net;
      }
      return result;
    });
};

export function setToken(token: String): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_API_TOKEN,
    payload: token,
  };
}

export function setReportEnvInfo(
  envInfo: IEnvInfo
): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_ENV,
    payload: envInfo,
  };
}

export function setReportDates(
  startDate: string,
  endDate: string
): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_DATES,
    payload: {
      start: startDate,
      end: endDate,
    },
  };
}

export function resetReport(): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.RESET_REPORTS,
  };
}

export function setReports(report: IReportZ[]): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORTS,
    payload: report,
  };
}

export function setReportX(report: IReportX): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_X,
    payload: report,
  };
}

export function setReportZ(report: IReportZ): IAppAction<TAppActionTypeKeys> {
  return {
    type: TAppActionTypeKeys.SET_REPORT_Z,
    payload: report,
  };
}
